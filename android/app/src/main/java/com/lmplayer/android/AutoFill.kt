package com.lmplayer.android

import android.content.Context
import android.content.SharedPreferences
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

/**
 * 启动后自动补齐「没有封面 / 没有歌词」的歌。
 *
 * 以前这两件事都是**手动**的：封面要进「封面匹配」点一下按钮，歌词要等用户
 * 打开详情页（`Lyrics.load` 里临时联网）。B 站下载来的音频既没有内嵌封面
 * 也没有内嵌歌词，所以刚入库的歌永远是「灰底 + 音符」、歌词永远是「暂无」，
 * 用户的实际感受就是「匹配功能形同不存在」。
 *
 * 设计取舍：
 *
 *  1. **串行**。封面源（iTunes / 网易云 / Deezer / MusicBrainz）对并发很敏感，
 *     后端在自动匹配前还可能先等一次 AI 清洗。并发只会让所有请求一起变慢。
 *  2. **记忆失败项**。同一首歌这次没找到，不做记号的话每次曲库刷新（下载完
 *     一首、匹配完封面都会刷）都会把它重新问一遍，白白压着网络和 AI 配额。
 *  3. **正在播放的那首优先**。用户最在意的是眼前这首有没有图、有没有词。
 *  4. **不抢手动流程**。用户在「封面匹配」页点了批处理时，这里等它跑完再继续，
 *     否则同一首歌会被两套流程同时请求。
 *  5. **可关闭**。两个开关各自独立（封面 / 歌词），存 SharedPreferences，
 *     有的用户就是不想让应用自己联网。
 */
object AutoFill {
    private const val TAG = "LMAutoFill"
    private const val PREFS = "lm_autofill"
    private const val KEY_COVER = "autoCover"
    private const val KEY_LYRIC = "autoLyric"

    /** 启动后等这么久再开工：先让首屏和曲库渲染出来，别和冷启动抢 IO。 */
    private const val START_DELAY_MS = 1500L

    data class Progress(
        val running: Boolean = false,
        val total: Int = 0,
        val done: Int = 0,
        /** 补到封面的首数 */
        val covers: Int = 0,
        /** 补到歌词的首数 */
        val lyrics: Int = 0,
        /** 当前正在处理哪首 */
        val current: String = "",
        val message: String = "",
    ) {
        val text: String
            get() = when {
                running && total > 0 ->
                    "自动补齐 $done/$total" + if (current.isBlank()) "" else " · $current"
                running -> current.ifBlank { "正在检查曲库…" }
                message.isNotBlank() -> message
                else -> ""
            }
    }

    private val _state = MutableStateFlow(Progress())
    val state: StateFlow<Progress> = _state.asStateFlow()

    private val _coverOn = MutableStateFlow(true)
    val coverOn: StateFlow<Boolean> = _coverOn.asStateFlow()

    private val _lyricOn = MutableStateFlow(true)
    val lyricOn: StateFlow<Boolean> = _lyricOn.asStateFlow()

    private val scope = CoroutineScope(SupervisorJob() + Dispatchers.Main.immediate)
    private var job: Job? = null
    private var prefs: SharedPreferences? = null

    /**
     * 已经问过的歌（进程内）。
     *
     * 注意封面和歌词分开记：一首歌封面失败了，歌词该问还得问 —— 两个来源
     * 完全没有关系。
     */
    private val triedCover = HashSet<String>()
    private val triedLyric = HashSet<String>()

    /** 跑的过程中又有新曲库（下载入库），跑完接着处理。 */
    private var queued: List<Song>? = null
    private var queuedPriority: String? = null

    fun init(ctx: Context) {
        if (prefs != null) return
        prefs = ctx.getSharedPreferences(PREFS, Context.MODE_PRIVATE)
        _coverOn.value = prefs?.getBoolean(KEY_COVER, true) ?: true
        _lyricOn.value = prefs?.getBoolean(KEY_LYRIC, true) ?: true
    }

    fun setCoverAuto(on: Boolean) {
        _coverOn.value = on
        prefs?.edit()?.putBoolean(KEY_COVER, on)?.apply()
        if (on) schedule(Store.state.value.songs)
    }

    fun setLyricAuto(on: Boolean) {
        _lyricOn.value = on
        prefs?.edit()?.putBoolean(KEY_LYRIC, on)?.apply()
        if (on) schedule(Store.state.value.songs)
    }

    /**
     * 清掉「这个进程里已经试过」的记忆，重新补一轮。
     *
     * 典型场景：用户刚开始没填 AI Key，B 站那种「歌手 - 歌名 - 高音质完整版」
     * 的脏标题搜不到词/图；填完 Key 之后想立刻重试，而不是等下次冷启动。
     */
    fun retryAll() {
        triedCover.clear()
        triedLyric.clear()
        schedule(Store.state.value.songs)
    }

    fun cancel() {
        job?.cancel()
        job = null
        queued = null
        _state.value = _state.value.copy(running = false, message = "已停止自动补齐")
    }

    /**
     * 曲库就绪/刷新后调用。重复调用是安全的：正在跑时只记下最新曲库，
     * 跑完再接着处理，不会起第二个并发流程。
     */
    fun schedule(songs: List<Song>, priorityId: String? = null) {
        if (!_coverOn.value && !_lyricOn.value) return
        if (songs.isEmpty()) return
        if (job?.isActive == true) {
            queued = songs
            queuedPriority = priorityId
            return
        }
        val prio = priorityId ?: Player.state.value.song?.id
        job = scope.launch {
            try {
                delay(START_DELAY_MS)
                run(songs, prio)
                // 跑的过程中曲库又变了：接着处理新增的那些
                while (true) {
                    val next = synchronized(this@AutoFill) {
                        val q = queued ?: return@synchronized null
                        queued = null
                        q
                    } ?: break
                    run(next, queuedPriority)
                }
            } catch (t: Throwable) {
                Log.w(TAG, "自动补齐异常", t)
                _state.value = _state.value.copy(
                    running = false,
                    current = "",
                    message = "自动补齐中断：${t.message ?: "未知原因"}",
                )
            } finally {
                job = null
            }
        }
    }

    /* --------------------------------------------------------------- 主流程 */

    private class Task(val song: Song, val cover: Boolean, val lyric: Boolean)

    private suspend fun run(songs: List<Song>, priorityId: String?) = withContext(Dispatchers.IO) {
        // 覆盖表还没拉到的话，hasCover 会把「已有匹配封面」的歌也判成缺，
        // 于是一启动就整库重匹一遍。这里先确保表是最新的。
        runCatching { Covers.pullOverrides() }

        val ordered = if (priorityId == null) songs
        else songs.sortedBy { if (it.id == priorityId) 0 else 1 }

        _state.value = Progress(running = true, current = "正在检查曲库…")

        val pending = ArrayList<Task>()
        var missCover = 0
        var missLyric = 0
        var skippedKnown = 0
        for (s in ordered) {
            if (!isActive) return@withContext
            // 用户可能中途把开关关掉了
            val wantCover = _coverOn.value
            val wantLyric = _lyricOn.value
            if (!wantCover && !wantLyric) break

            // 「缺什么」和「这次要不要做」是两件事：缺项统计用前者（界面上要
            // 如实显示还剩几首没有），是否真的联网用后者（本次已试过的不重复问）。
            val coverMissing = wantCover && !Covers.hasCover(s)
            val lyricMissing = wantLyric && !hasLocalLyrics(s)
            if (coverMissing) missCover++
            if (lyricMissing) missLyric++

            val doCover = coverMissing && triedCover.add(s.id)
            val doLyric = lyricMissing && triedLyric.add(s.id)
            if (!doCover && coverMissing) skippedKnown++
            if (!doLyric && lyricMissing) skippedKnown++
            if (doCover || doLyric) pending += Task(s, doCover, doLyric)
        }
        Log.i(
            TAG,
            "预筛完成：曲库 ${songs.size} 首，缺封面 $missCover，缺歌词 $missLyric，" +
                "本轮处理 ${pending.size} 首，跳过已尝试 $skippedKnown 项",
        )

        if (pending.isEmpty()) {
            _state.value = Progress(
                running = false,
                total = 0,
                message = when {
                    songs.isEmpty() -> ""
                    missCover == 0 && missLyric == 0 -> "封面与歌词都已补齐"
                    else -> "还有 ${maxOf(missCover, missLyric)} 首没找到" +
                        "（缺封面 $missCover / 缺歌词 $missLyric），可以用上方按钮重试"
                },
            )
            return@withContext
        }

        val total = pending.size
        var done = 0
        var covers = 0
        var lyrics = 0
        var dirty = false
        _state.value = Progress(running = true, total = total)

        for (t in pending) {
            if (!isActive) return@withContext
            // 用户在手动跑批处理时避让，避免同一首歌被两条流程同时请求
            while (Covers.state.value.running) {
                if (!isActive) return@withContext
                delay(400)
            }
            _state.value = _state.value.copy(current = t.song.displayTitle)

            if (t.cover) {
                val ok = runCatching { Covers.matchOne(t.song) }.getOrDefault(false)
                if (ok) {
                    covers++
                    dirty = true
                }
            }
            if (t.lyric) {
                if (matchLyrics(t.song)) {
                    lyrics++
                    // 详情页/歌词面板读的是进程内 memo，不失效的话已经打开过的
                    // 那首歌仍然显示「暂无歌词」
                    Lyrics.invalidate(t.song.id)
                }
            }

            done++
            _state.value = _state.value.copy(done = done, covers = covers, lyrics = lyrics)
            // 每 5 首刷一次：封面地址变了要重新拉曲库/覆盖表才看得到，
            // 但逐首刷会让大曲库反复做两次 JSON 往返。
            if (dirty && done % 5 == 0) {
                runCatching { Covers.pullOverrides() }
                runCatching { Store.refreshSongs(notifyAutoFill = false) }
                dirty = false
            }
        }

        if (dirty) {
            runCatching { Covers.pullOverrides() }
            runCatching { Store.refreshSongs(notifyAutoFill = false) }
        }
        Log.i(TAG, "本轮完成：封面 $covers 首，歌词 $lyrics 首，共 $total 首")
        _state.value = Progress(
            running = false,
            total = total,
            done = done,
            covers = covers,
            lyrics = lyrics,
            message = buildString {
                append("自动补齐完成：")
                append("封面 $covers 首")
                append("，歌词 $lyrics 首")
                val miss = total - maxOf(covers, lyrics)
                if (miss > 0) append("（$miss 首没找到）")
            },
        )
    }

    /**
     * 本地有没有歌词（内嵌 / 同名 .lrc / 缓存），**不联网**。
     *
     * 用后端的 Load 判断：它只读本地，AutoMatch 才联网 —— 与桌面版分工一致。
     */
    private suspend fun hasLocalLyrics(song: Song): Boolean = runCatching {
        Bridge.callObj("LyricsService.Load", song.id).str("lrc").isNotBlank()
    }.getOrDefault(false)

    /** 联网自动匹配一次（后端会落缓存，详情页打开时就能命中）。 */
    private suspend fun matchLyrics(song: Song): Boolean {
        val r = runCatching { Bridge.callObj("LyricsService.AutoMatch", song.id) }
        val o = r.getOrNull()
        val lrc = o?.str("lrc").orEmpty()
        Log.i(
            TAG,
            "\u6b4c\u8bcd\u5339\u914d " + song.displayTitle + ": " + lrc.length + " chars, source=" +
                o?.str("source") + (r.exceptionOrNull()?.let { ", err=" + it.message } ?: ""),
        )
        return lrc.isNotBlank()
    }
}
