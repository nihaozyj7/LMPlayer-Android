package com.lmplayer.android

import android.media.AudioAttributes
import android.media.MediaPlayer
import android.media.audiofx.LoudnessEnhancer
import android.util.Log
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.Job
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.isActive
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

enum class RepeatMode { Off, All, One }

data class PlayerState(
    val song: Song? = null,
    val queue: List<Song> = emptyList(),
    val index: Int = -1,
    val playing: Boolean = false,
    val buffering: Boolean = false,
    val positionMs: Long = 0,
    val durationMs: Long = 0,
    val repeat: RepeatMode = RepeatMode.All,
    val shuffle: Boolean = false,
    /** 睡眠定时的剩余毫秒；0 = 未启用。 */
    val sleepRemainMs: Long = 0L,
    /** 到点后是否等当前这首播完再停（而不是立刻暂停）。 */
    val sleepAfterTrack: Boolean = false,
    /** 计时已经到点、正在等当前曲目结束。 */
    val sleepArmed: Boolean = false,
    /** 倍速（1f = 原速）。 */
    val speed: Float = 1f,
    /** 播放器内部增益（0~1），与系统媒体音量相乘。 */
    val volume: Float = 1f,
    val error: String? = null,
) {
    val hasNext: Boolean get() = queue.isNotEmpty()
    val hasPrev: Boolean get() = queue.isNotEmpty()
}

/**
 * 原生播放器。
 *
 * 用系统 MediaPlayer 而不是 Go 的 miniaudio 引擎：后者只吃 ffmpeg 转码后的
 * PCM，而 APK 里没有可执行的 ffmpeg（见 README-android「音频」一节）。
 * MediaPlayer 走系统的 Stagefright/ExoPlayer 解码栈，mp3/flac/aac/ogg/wav/m4a
 * 都能直接放，和之前 WebView 里 <audio> 的能力一致，但能拿到底层精确位置、
 * 能接 MediaSession 做通知栏/耳机键控制。
 */
object Player {
    private const val TAG = "LMPlayer"
    private val scope = CoroutineScope(SupervisorJob() + Dispatchers.Main.immediate)

    private var mp: MediaPlayer? = null
    private var ticker: Job? = null

    /** 响度补偿增益（dB）。测量完成前为 0（= 不补偿）。 */
    @Volatile
    private var loudnessDB = 0.0

    /**
     * 系统级的响度增强器（AudioEffect）。
     *
     * 为什么需要它：MediaPlayer.setVolume 的上限是 1.0，只能**衰减**；
     * 而响度均衡里有一半的歌（母带偏小）需要 +2~+6 dB 的提升。LoudnessEnhancer
     * 直接挂在 audio session 上，用一个 mB 单位的增益，正负都能覆盖，
     * 而且不需要换播放内核（换 ExoPlayer 才能做真正的 DSP 链）。
     */
    private var enhancer: LoudnessEnhancer? = null

    /** 恢复上次播放时要跳到的位置（毫秒）；0 = 从头播。 */
    private var pendingRestore: Long = 0L

    /** 上次把播放进度写进 SharedPreferences 的时间（2 秒一次，不能每帧写）。 */
    private var lastSaveAt: Long = 0L

    private val _state = MutableStateFlow(PlayerState())
    val state: StateFlow<PlayerState> = _state.asStateFlow()

    fun start() {
        restoreLast()
        if (ticker == null) {
            ticker = scope.launch {
                while (isActive) {
                    val m = mp
                    if (m != null && _state.value.playing) {
                        runCatching {
                            _state.value = _state.value.copy(
                                positionMs = m.currentPosition.toLong(),
                                durationMs = m.duration.toLong().coerceAtLeast(0),
                            )
                        }
                    }
                    tickSleepTimer()
                    val cur = _state.value
                    val now = System.currentTimeMillis()
                    // 进度 2 秒落一次盘：太勤会拖慢主线程，太慢则「关掉再开
                    // 回到几分钟前」，2 秒是用户感知不到差别的最小代价
                    if (cur.playing && cur.song != null && now - lastSaveAt > 2000L) {
                        lastSaveAt = now
                        Persist.savePlayback(cur.song.id, cur.positionMs)
                    }
                    delay(200)
                }
            }
        }
    }

    fun stop() {
        ticker?.cancel()
        ticker = null
        release()
    }

    fun release() {
        runCatching {
            mp?.setOnCompletionListener(null)
            mp?.setOnPreparedListener(null)
            mp?.setOnErrorListener(null)
            mp?.stop()
            mp?.release()
        }
        levelRamp?.cancel()
        levelRamp = null
        mp = null
        runCatching { enhancer?.release() }
        enhancer = null
        loudnessDB = 0.0
        appliedScale = _state.value.volume
        appliedMb = 0
        _state.value = _state.value.copy(playing = false, buffering = false)
    }

    /** 播一首歌；queue 为空时用当前视图的列表当队列。 */
    fun play(song: Song, queue: List<Song> = listOf(song), index: Int = -1) {
        start()
        val idx = when {
            index >= 0 -> index
            else -> queue.indexOfFirst { it.id == song.id }.coerceAtLeast(0)
        }
        _state.value = _state.value.copy(
            song = song,
            queue = queue.ifEmpty { listOf(song) },
            index = idx,
            buffering = true,
            positionMs = 0,
            durationMs = song.durationMs,
            error = null,
        )
        // 换了另一首歌就不要再套用「上次播放位置」
        if (song.id != Persist.songId) pendingRestore = 0L
        Persist.savePlayback(song.id, 0L)
        Persist.queueIds = _state.value.queue.map { it.id }
        open(song)
    }

    private fun open(song: Song) {
        scope.launch {
            releasePlayerOnly()
            val url = try {
                Store.audioUrl(song.id)
            } catch (t: Throwable) {
                fail(t.message ?: "取播放地址失败"); return@launch
            }
            if (url.isBlank()) {
                fail("这首歌没有可用的播放地址"); return@launch
            }
            val player = MediaPlayer()
            mp = player
            player.setAudioAttributes(
                AudioAttributes.Builder()
                    .setUsage(AudioAttributes.USAGE_MEDIA)
                    .setContentType(AudioAttributes.CONTENT_TYPE_MUSIC)
                    .build()
            )
            player.setOnPreparedListener { m ->
                runCatching {
                    // ★ 起播前先把缓存里的补偿同步套上。
                    //
                    // 这是「刚开始听正常、过一会儿声音突然变小」的根因：
                    // 以前这里一律按 loudnessDB=0 起播（原音量），补偿要等异步
                    // 测量命中缓存后再 applyLevel —— 于是每首歌都是先响一声，
                    // 再被压到目标响度。切到一首已测过的歌尤其明显。
                    // gainFor 是纯内存读取，同步取就行，第一帧就是正确音量。
                    loudnessDB = if (Loudness.enabled) {
                        Loudness.gainFor(song.id) ?: 0.0
                    } else {
                        0.0
                    }
                    applyLevel(m)
                    // 冷启动恢复上次那首歌：跳回离开时的位置（不自动开播）
                    if (pendingRestore > 0L) {
                        val dur = m.duration.toLong().coerceAtLeast(0)
                        val to = if (dur > 0) pendingRestore.coerceAtMost(dur - 500L) else pendingRestore
                        m.seekTo(to.coerceAtLeast(0L).toInt())
                        pendingRestore = 0L
                    }
                    // 换歌后要把当前倍速重新推给新的 MediaPlayer 实例
                    if (_state.value.speed != 1f) {
                        m.playbackParams = m.playbackParams.setSpeed(_state.value.speed).setPitch(1f)
                    }
                    m.start()
                }
                _state.value = _state.value.copy(
                    playing = true,
                    buffering = false,
                    durationMs = m.duration.toLong().coerceAtLeast(0),
                )
                MediaSessionHub.onState(_state.value)
                // 响度：先按「未测量」播（不补偿），测完立刻补上。测量要解码整首歌，
                // 放在后台做，绝不能挡播放开始。
                scope.launch {
                    val g = Loudness.ensureMeasured(song) ?: return@launch
                    if (_state.value.song?.id != song.id || mp !== m) return@launch
                    loudnessDB = g
                    // ★ 不在播放中途改音量。
                    //
                    // 测量要解码整首歌，通常播到 1~3 秒才出结果。这时候如果直接
                    // 把 -10dB 一步怼上去，听感就是「正听着声音突然小了一截」；
                    // 而下一首没测过又是原音量 —— 用户会觉得同一副耳机时大时小。
                    // 所以：刚起播（<2.5s）用约 1 秒平滑过渡；已经播到一半就只
                    // 记进缓存，这一遍完全不动它，下次再听这首时一开始就是对的。
                    val pos = runCatching { m.currentPosition }.getOrDefault(0)
                    if (pos < 2500) {
                        applyLevel(m, smooth = true)
                    } else {
                        Log.i(
                            TAG,
                            "响度 " + String.format("%.1f", g) + " dB（" + song.displayTitle +
                                "）本次不打断，下次播放起生效"
                        )
                    }
                    Loudness.prefetch(_state.value.queue.getOrNull(_state.value.index + 1))
                }
            }
            player.setOnCompletionListener {
                // ★ 必须在循环/自动切歌之前处理：
                // 单曲循环会 seekTo(0) 重播，那样「等这首播完」永远等不到，
                // 定时已归零而界面还在无限循环 —— 这就是要避开的那个死循环。
                val done = _state.value
                if (done.sleepArmed) {
                    _state.value = done.copy(
                        sleepArmed = false,
                        sleepAfterTrack = false,
                        sleepRemainMs = 0L,
                        positionMs = done.durationMs,
                    )
                    pause()
                    return@setOnCompletionListener
                }
                if (_state.value.repeat == RepeatMode.One) {
                    runCatching {
                        it.seekTo(0)
                        it.start()
                    }
                } else {
                    next(auto = true)
                }
            }
            player.setOnErrorListener { _, what, extra ->
                Log.w(TAG, "MediaPlayer error what=$what extra=$extra url=$url")
                fail("无法播放 .${song.ext}（系统解码器不支持或被拒绝）")
                true
            }
            runCatching {
                player.setDataSource(url)
                player.prepareAsync()
            }.onFailure {
                Log.w(TAG, "setDataSource 失败 $url", it)
                fail("播放失败：${it.message}")
            }
            MediaSessionHub.onState(_state.value)
        }
    }

    /**
     * 冷启动把「上次在播放的那首歌 + 队列 + 进度」放回界面。
     *
     * 只恢复状态、不自动开播：用户按下播放键才出声。曲库是异步加载的，
     * 所以这里等歌曲出现在 Store 里（最多约 8 秒）再恢复 —— 早了拿不到
     * Song 对象，晚了用户已经自己点了别的歌（那种情况直接放弃）。
     */
    private fun restoreLast() {
        if (_state.value.song != null) return
        val wantId = Persist.songId ?: return
        scope.launch {
            repeat(40) {
                if (_state.value.song != null) return@launch
                val songs = Store.state.value.songs
                val song = songs.firstOrNull { it.id == wantId }
                if (song != null) {
                    val byId = songs.associateBy { it.id }
                    val queue = Persist.queueIds.mapNotNull { byId[it] }.ifEmpty { listOf(song) }
                    val idx = queue.indexOfFirst { it.id == song.id }.coerceAtLeast(0)
                    pendingRestore = Persist.positionMs
                    _state.value = _state.value.copy(
                        song = song,
                        queue = queue,
                        index = idx,
                        positionMs = Persist.positionMs,
                        durationMs = if (song.durationMs > 0) song.durationMs else 0L,
                        playing = false,
                        buffering = false,
                    )
                    MediaSessionHub.onState(_state.value)
                    return@launch
                }
                kotlinx.coroutines.delay(200)
            }
        }
    }

    private fun fail(msg: String) {
        _state.value = _state.value.copy(playing = false, buffering = false, error = msg)
        MediaSessionHub.onState(_state.value)
    }

    private fun releasePlayerOnly() {
        runCatching {
            mp?.setOnPreparedListener(null)
            mp?.setOnCompletionListener(null)
            mp?.setOnErrorListener(null)
            mp?.stop()
            mp?.release()
        }
        levelRamp?.cancel()
        levelRamp = null
        mp = null
        runCatching { enhancer?.release() }
        enhancer = null
        loudnessDB = 0.0
        appliedScale = _state.value.volume
        appliedMb = 0
    }

    /** 当前真正下发给播放器的音量与增强器增益（平滑过渡的起点）。 */
    private var appliedScale = 1f
    private var appliedMb = 0
    private var levelRamp: Job? = null

    /**
     * 把「用户音量 × 响度补偿」落到当前的 MediaPlayer 上。
     *
     * 拆成两条路径是不得已：setVolume 只能 0~1（衰减），正增益只能靠
     * LoudnessEnhancer。两条同时生效时以「谁负责」为准，不会重复叠加。
     *
     * smooth=true 用约 1 秒插值过渡：增益是异步测出来的，一步到位会有
     * 明显的「声音突然被压下去」的听感。
     */
    private fun applyLevel(m: MediaPlayer, smooth: Boolean = false) {
        val v = _state.value.volume
        val g = if (Loudness.enabled) loudnessDB else 0.0
        val scale = if (g < 0) {
            (v * Math.pow(10.0, g / 20.0)).toFloat().coerceIn(0f, 1f)
        } else {
            v
        }
        val mb = if (g > 0) (g * 100).toInt() else 0
        if (!smooth) {
            levelRamp?.cancel()
            levelRamp = null
            setLevelNow(m, scale, mb)
            return
        }
        val fromScale = appliedScale
        val fromMb = appliedMb
        if (Math.abs(scale - fromScale) < 0.01f && fromMb == mb) {
            setLevelNow(m, scale, mb)
            return
        }
        levelRamp?.cancel()
        levelRamp = scope.launch {
            val steps = 25
            for (i in 1..steps) {
                if (mp !== m) return@launch
                val k = i / steps.toFloat()
                val s = fromScale + (scale - fromScale) * k
                val cur = (fromMb + (mb - fromMb) * k).toInt()
                runCatching { m.setVolume(s, s) }
                runCatching {
                    val e = enhancerFor(m) ?: return@runCatching
                    e.setTargetGain(cur)
                    e.enabled = cur > 0
                }
                appliedScale = s
                appliedMb = cur
                delay(40)
            }
        }
    }

    private fun setLevelNow(m: MediaPlayer, scale: Float, mb: Int) {
        runCatching { m.setVolume(scale, scale) }
        appliedScale = scale
        appliedMb = mb
        runCatching {
            val e = enhancerFor(m) ?: return@runCatching
            e.setTargetGain(mb)
            e.enabled = mb > 0
        }.onFailure { Log.w(TAG, "LoudnessEnhancer 不可用（本机可能禁用了音效）: ${it.message}") }
    }

    /**
     * 取（必要时创建）当前播放器的增强器。
     *
     * audioSessionId 为 0 表示系统还没分配会话：此时挂上去会作用在整个输出
     * 混音上（别的 App 的声音也会被一起放大），所以这轮宁可不启用，
     * 下次 applyLevel 再试。
     */
    private fun enhancerFor(m: MediaPlayer): LoudnessEnhancer? {
        val sid = runCatching { m.audioSessionId }.getOrDefault(0)
        if (sid <= 0) return null
        enhancer?.let { return it }
        val created = runCatching { LoudnessEnhancer(sid) }.getOrNull() ?: return null
        runCatching { created.enabled = true }
        enhancer = created
        return created
    }

    /* ------------------------------------------------------------------ 控制 */

    fun toggle() {
        val m = mp ?: run {
            _state.value.song?.let { play(it, _state.value.queue, _state.value.index) }
            return
        }
        runCatching {
            if (m.isPlaying) {
                m.pause()
                _state.value = _state.value.copy(playing = false)
            } else {
                m.start()
                _state.value = _state.value.copy(playing = true)
            }
        }
        MediaSessionHub.onState(_state.value)
    }

    fun pause() {
        val m = mp ?: return
        runCatching { if (m.isPlaying) m.pause() }
        _state.value = _state.value.copy(playing = false)
        MediaSessionHub.onState(_state.value)
    }

    fun resume() {
        val m = mp ?: run { _state.value.song?.let { play(it, _state.value.queue, _state.value.index) }; return }
        runCatching { m.start() }
        _state.value = _state.value.copy(playing = true)
        MediaSessionHub.onState(_state.value)
    }

    fun seekTo(ms: Long) {
        val m = mp ?: return
        val dur = _state.value.durationMs
        val target = ms.coerceIn(0, if (dur > 0) dur else ms)
        runCatching { m.seekTo(target.toInt()) }
        _state.value = _state.value.copy(positionMs = target)
    }

    /**
     * 清空播放队列并停下。
     *
     * 设置里那个「清空播放队列」以前只调了 pause()，队列其实一个字没动 ——
     * 用户以为清空了，切歌照样往上翻。真正的清空要连 Persist 里的记录一起清，
     * 否则下次冷启动又把队列恢复回来了。
     */
    fun clearQueue() {
        pause()
        Persist.queueIds = emptyList()
        Persist.savePlayback(null, 0L)
        _state.value = _state.value.copy(
            song = null, queue = emptyList(), index = -1,
            positionMs = 0, durationMs = 0, playing = false,
        )
    }

    /**
     * 从播放队列里删掉第 [index] 首。
     *
     * 三种情况必须分开算：
     *   - 删的是当前这首：队列还有歌就顺势接着播（用被删的位置放新的当前曲），
     *     队列空了就彻底停下；
     *   - 删的在当前曲之前：当前曲下标要减一，否则 next/prev 会错位一首；
     *   - 删的在之后：只动队列。
     */
    fun removeAt(index: Int) {
        val st = _state.value
        if (index !in st.queue.indices) return
        val q = st.queue.toMutableList().also { it.removeAt(index) }
        if (q.isEmpty()) {
            clearQueue()
            return
        }
        when {
            index < st.index -> {
                _state.value = st.copy(queue = q, index = st.index - 1)
                Persist.queueIds = q.map { it.id }
            }
            index > st.index -> {
                _state.value = st.copy(queue = q)
                Persist.queueIds = q.map { it.id }
            }
            else -> {
                // 删的正是当前曲：接着播原位置上那首（删的是最后一首就退回新的最后一首）
                val ni = index.coerceAtMost(q.size - 1)
                play(q[ni], q, ni)
            }
        }
    }

    /**
     * 「单击歌曲」的统一入口，行为由设置项 Persist.clickAction 决定：
     *
     *   append（默认）= 把这首追加到现有队列末尾再播，不打乱已经排好的顺序
     *   list           = 用当前列表整体替换队列，从这首开始往后播
     *
     * 两种都是合理心智：有人默认「点歌 = 换掉整个队列」，也有人边听边挑、
     * 希望点歌只是往排队里塞一首。所以做成设置项而不是二选一写死。
     */
    fun playClicked(song: Song, list: List<Song>) {
        if (Persist.clickAction != "append") {
            play(song, list)
            return
        }
        start()
        // 已经在队列里就跳过去播，不重复插入（否则同一首歌会出现两行）
        val exist = _state.value.queue.indexOfFirst { it.id == song.id }
        if (exist >= 0) {
            play(song, _state.value.queue, exist)
            return
        }
        val q = _state.value.queue.filter { it.id != song.id } + song
        play(song, q, q.lastIndex)
    }

    /** 随机播放整张列表（歌单页的「随机播放」用它）。 */
    fun playShuffled(list: List<Song>) {
        if (list.isEmpty()) return
        _state.value = _state.value.copy(shuffle = true)
        play(list.random(), list)
    }

    fun next(auto: Boolean = false) {
        val st = _state.value
        if (st.queue.isEmpty()) return
        if (st.shuffle) {
            val i = if (st.queue.size <= 1) 0 else (st.queue.indices.random().let { r ->
                if (r == st.index) (r + 1) % st.queue.size else r
            })
            play(st.queue[i], st.queue, i)
            return
        }
        val last = st.index >= st.queue.lastIndex
        if (last && st.repeat == RepeatMode.Off && auto) {
            pause()
            seekTo(0)
            return
        }
        val i = if (last) 0 else st.index + 1
        play(st.queue[i], st.queue, i)
    }

    fun prev() {
        val st = _state.value
        if (st.queue.isEmpty()) return
        // 播过 3 秒以上按「回到本曲开头」，这是所有播放器的通行约定
        if (st.positionMs > 3000) {
            seekTo(0)
            return
        }
        val i = if (st.index <= 0) st.queue.lastIndex else st.index - 1
        play(st.queue[i], st.queue, i)
    }

    fun cycleRepeat() {
        _state.value = _state.value.copy(
            repeat = when (_state.value.repeat) {
                RepeatMode.Off -> RepeatMode.All
                RepeatMode.All -> RepeatMode.One
                RepeatMode.One -> RepeatMode.Off
            }
        )
    }

    fun toggleShuffle() {
        _state.value = _state.value.copy(shuffle = !_state.value.shuffle)
    }

    /**
     * 播放模式四态循环：顺序（不循环）→ 列表循环 → 单曲循环 → 随机。
     *
     * 详情页只留一个「播放模式」按钮，所以把原来独立的 shuffle 开关并进来：
     * 五个位置里再挤一个随机按钮会让这一行过密，而用户心智里它们本来就是
     * 同一件事的四个选项（和桌面版底栏一致）。
     */
    fun cyclePlayMode() {
        val st = _state.value
        _state.value = when {
            st.shuffle -> st.copy(shuffle = false, repeat = RepeatMode.Off)
            st.repeat == RepeatMode.Off -> st.copy(repeat = RepeatMode.All)
            st.repeat == RepeatMode.All -> st.copy(repeat = RepeatMode.One)
            else -> st.copy(repeat = RepeatMode.Off, shuffle = true)
        }
    }

    /** 播放模式的界面文案（提示用）。 */
    fun playModeLabel(st: PlayerState): String = when {
        st.shuffle -> "随机播放"
        st.repeat == RepeatMode.Off -> "顺序播放"
        st.repeat == RepeatMode.All -> "列表循环"
        else -> "单曲循环"
    }

    /* ------------------------------------------------------------ 睡眠定时 */

    /**
     * 设定睡眠定时（分钟）；0 表示取消。
     *
     * @param afterTrack 到点时如果这首歌还没播完，就等它播完再停，而不是
     *   在句子中间把声音掐掉。重新设定时间会清掉「正在等待」的标记。
     */
    fun setSleepTimer(minutes: Int, afterTrack: Boolean = false) {
        _state.value = _state.value.copy(
            sleepRemainMs = if (minutes <= 0) 0L else minutes * 60_000L,
            sleepAfterTrack = minutes > 0 && afterTrack,
            sleepArmed = false,
        )
    }

    /**
     * 由 ticker 每 200ms 调一次。
     *
     * 到点后的两条路：
     *  - 默认立刻暂停；
     *  - 开了「播完这首再停」时只把 sleepArmed 打开，等 onCompletion 才真停。
     *
     * 为什么不会死循环：计时一旦归零就再也进不来（第一行的早退），
     * armed 只是「等一次结束事件」的标记，由 onCompletion 消费一次即清空。
     * 所以不存在「到点 → 等播完 → 判定没播完 → 继续等」这种自我维持。
     */
    private fun tickSleepTimer() {
        val st = _state.value
        if (st.sleepRemainMs <= 0L) return
        if (st.sleepArmed) return
        val left = st.sleepRemainMs - 200L
        if (left <= 0L) {
            if (st.sleepAfterTrack && st.playing) {
                _state.value = st.copy(sleepRemainMs = 0L, sleepArmed = true)
            } else {
                _state.value = st.copy(sleepRemainMs = 0L, sleepAfterTrack = false)
                pause()
            }
        } else {
            _state.value = st.copy(sleepRemainMs = left)
        }
    }

    /* -------------------------------------------------------------- 倍速 */

    /**
     * 倍速。
     *
     * MediaPlayer 的坑：setPlaybackParams 传入非 0 速度会**自动 resume**，
     * 所以暂停状态下设完必须再 pause 回来，否则改个倍速音乐自己就响了。
     */
    fun setSpeed(v: Float) {
        val s = v.coerceIn(0.5f, 2f)
        val wasPlaying = _state.value.playing
        _state.value = _state.value.copy(speed = s)
        val m = mp ?: return
        runCatching {
            m.playbackParams = m.playbackParams.setSpeed(s).setPitch(1f)
        }
        if (!wasPlaying) runCatching { m.pause() }
    }

    /** 音量由系统控制，这里只记住播放器内部增益，并同步到 state 供界面显示。 */
    fun setVolume(v: Float) {
        val vol = v.coerceIn(0f, 1f)
        _state.value = _state.value.copy(volume = vol)
        mp?.let { setLevelNow(it, vol.coerceIn(0f, 1f), appliedMb) }
    }

    /** 响度设置变化后重新应用（切换挡位/开关时调用）。 */
    fun refreshLoudness() {
        mp?.let { applyLevel(it, smooth = true) }
    }

    fun setQueue(queue: List<Song>) {
        val st = _state.value
        val idx = st.song?.let { s -> queue.indexOfFirst { it.id == s.id } } ?: -1
        _state.value = st.copy(queue = queue, index = if (idx >= 0) idx else st.index)
    }

    suspend fun peekUrl(songId: String): String = withContext(Dispatchers.IO) { Store.audioUrl(songId) }
}
