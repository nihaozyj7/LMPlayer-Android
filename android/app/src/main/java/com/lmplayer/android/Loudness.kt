package com.lmplayer.android

import android.content.Context
import android.media.AudioFormat
import android.media.MediaCodec
import android.media.MediaExtractor
import android.media.MediaFormat
import android.util.Log
import com.lmplayer.core.mobile.Mobile
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.launch
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.sync.Mutex
import kotlinx.coroutines.sync.withLock
import kotlinx.coroutines.withContext
import org.json.JSONObject
import java.io.File
import java.nio.ByteBuffer
import java.nio.ByteOrder

/**
 * 响度均衡（EBU R128 + 真峰值保护）。
 *
 * 移植自桌面版 internal/loudness + internal/ffmpeg 的 loudnessscan.go：
 * 算法一份（Go 的 LoudnessScanner 原样编译进 AAR），差别只在**解码**——
 * 桌面用 ffmpeg 解 PCM，APK 里没有可执行的 ffmpeg（见 README-android），
 * 所以这里用系统的 MediaExtractor + MediaCodec 解出 16bit PCM 再喂给 Go。
 *
 * 增益公式与桌面版 cache.go 的 GainDB 完全一致：
 *
 *     gain = 目标响度 − 测得整合响度
 *     再按真峰值收一下：gain ≤ (−1 dBTP − 真峰值)，最后夹到 ±24 dB
 *
 * ★ 为什么测量结果由 Kotlin 自己存（而不是写进 Go 的 loudness 缓存）：
 * bootstrap.Song 的 ModTime 字段 json tag 是 `-`，跨 RPC 传过去必然是 0，
 * 而 Go 的缓存 key 是 path+size+modTime —— 写进去的记录后面按真实 modTime
 * 查就对不上，等于白测。手机端曲库规模远小于桌面，自己存一份 map 足够。
 */
object Loudness {
    private const val TAG = "LMLoudness"
    private const val PREFS = "lm_loudness"
    private const val KEY_MODE = "mode"
    private const val KEY_TARGET = "target"
    private const val KEY_MEASURED = "measured"

    const val MODE_OFF = "off"
    const val MODE_TRACK = "track"

    /** 四个目标挡位（LUFS）。数值与桌面版设置里的一致。 */
    val TARGETS = listOf(-14.0, -16.0, -18.0, -23.0)

    data class State(
        val mode: String = MODE_OFF,
        val target: Double = -16.0,
        /** 本次运行里已经测过（含历史缓存）的曲目数。 */
        val measured: Int = 0,
        val measuring: Boolean = false,
        val done: Int = 0,
        val total: Int = 0,
        val current: String = "",
        /** 最近一次失败原因（解码不了 / 文件不存在 / 静音），界面直接显示。 */
        val note: String = "",
    )

    private var prefs: android.content.SharedPreferences? = null
    private var db: JSONObject = JSONObject()

    /**
     * 串行化测量：一次只解码一首。
     *
     * 连续切歌时「播放哪首就测哪首」会叠加出多个解码任务，而 BS.1770 的
     * K 加权是纯 CPU 浮点运算，并发只会让正在播放的那首卡顿。
     */
    private val measureLock = Mutex()

    /** 预测量专用：不占用播放链路，也不参与界面上的批量进度。 */
    private val io = CoroutineScope(SupervisorJob() + Dispatchers.IO)

    private val _state = MutableStateFlow(State())
    val state: StateFlow<State> = _state.asStateFlow()

    /** 初始化（NativeActivity.onCreate 里调一次）。 */
    fun init(ctx: Context) {
        if (prefs != null) return
        val p = ctx.getSharedPreferences(PREFS, Context.MODE_PRIVATE)
        prefs = p
        db = runCatching { JSONObject(p.getString(KEY_MEASURED, "{}") ?: "{}") }.getOrDefault(JSONObject())
        _state.value = _state.value.copy(
            mode = p.getString(KEY_MODE, MODE_OFF) ?: MODE_OFF,
            target = p.getFloat(KEY_TARGET, -16f).toDouble(),
            measured = db.length(),
        )
    }

    /** 当前是否启用响度补偿。 */
    val enabled: Boolean get() = _state.value.mode != MODE_OFF

    fun setMode(mode: String) {
        prefs?.edit()?.putString(KEY_MODE, mode)?.apply()
        _state.value = _state.value.copy(mode = mode)
    }

    fun setTarget(target: Double) {
        prefs?.edit()?.putFloat(KEY_TARGET, target.toFloat())?.apply()
        _state.value = _state.value.copy(target = target)
    }

    /** 清空测量结果（设置里「清除响度数据」）。 */
    fun clear() {
        db = JSONObject()
        prefs?.edit()?.remove(KEY_MEASURED)?.apply()
        _state.value = _state.value.copy(measured = 0, done = 0, total = 0)
    }

    /**
     * 取某首歌的补偿增益（dB）。返回 null 表示还没测过。
     *
     * 与桌面版 GainFor 的「换挡位零成本」等价：测量结果与挡位无关，
     * 换目标只是重算一次减法。
     */
    fun gainFor(songId: String): Double? {
        val o = db.optJSONObject(songId) ?: return null
        val integrated = o.optDouble("integrated", 0.0)
        if (integrated == 0.0) return null
        var gain = _state.value.target - integrated
        val tp = o.optDouble("truePeak", 0.0)
        if (tp != 0.0) {
            val maxAllowed = -1.0 - tp // truePeakCeiling = -1 dBTP，与桌面一致
            if (gain > maxAllowed) gain = maxAllowed
        }
        return gain.coerceIn(-24.0, 24.0)
    }

    /** 取某首歌的测量摘要（界面显示用）。 */
    fun summaryFor(songId: String): JSONObject? = db.optJSONObject(songId)

    /**
     * 测量正在播放的那首（如果还没测过）。播放链路里异步调用，不挡播放。
     */
    suspend fun ensureMeasured(song: Song): Double? {
        if (!enabled) return null
        gainFor(song.id)?.let { return it }
        val ok = measureLock.withLock { measureOne(song) }
        if (!ok) return null
        val g = gainFor(song.id)
        _state.value = _state.value.copy(measured = db.length())
        return g
    }

    /**
     * 提前测量队列里的下一首（不阻塞播放）。
     *
     * 为什么需要：播放时才开始测，结果常常在听到一半才出来 —— 那一遍只能
     * 等下次播放才生效（见 Player 里的长注释）。提前一首量好，切歌时就有缓存。
     */
    fun prefetch(song: Song?) {
        if (song == null || !enabled) return
        if (gainFor(song.id) != null) return
        io.launch {
            runCatching {
                measureLock.withLock { measureOne(song) }
                _state.value = _state.value.copy(measured = db.length())
            }
        }
    }

    /**
     * 批量测量整库（设置里手动触发）。已测过的跳过。
     *
     * 顺序执行而不是并发：手机上解码是硬解，但 BS.1770 的 K 加权是纯 CPU
     * 浮点运算，并发只会让前台播放卡顿。
     */
    suspend fun measureAll(songs: List<Song>, force: Boolean = false) {
        Log.i(TAG, "measureAll: 曲库 ${songs.size} 首, force=$force")
        if (_state.value.measuring) return
        val todo = if (force) songs else songs.filter { gainFor(it.id) == null }
        _state.value = _state.value.copy(measuring = true, done = 0, total = todo.size, current = "")
        try {
            for ((i, s) in todo.withIndex()) {
                _state.value = _state.value.copy(current = s.displayTitle)
                val ok = measureLock.withLock { measureOne(s) }
                Log.i(TAG, "measure ${s.title}: ${if (ok) "ok" else "skip"} (${s.path})")
                _state.value = _state.value.copy(done = i + 1, measured = db.length())
            }
        } finally {
            _state.value = _state.value.copy(measuring = false, current = "")
            Log.i(TAG, "measureAll done, measured=${db.length()}")
        }
    }

    /* ------------------------------------------------------------ 内部实现 */

    private suspend fun measureOne(song: Song): Boolean = withContext(Dispatchers.IO) {
        val f = File(song.path)
        if (!f.exists() || f.length() <= 0) {
            Log.d(TAG, "跳过（文件不存在）: ${song.path}")
            _state.value = _state.value.copy(note = "文件不存在：${song.displayTitle}")
            return@withContext false
        }
        val res = scanFile(song.path)
        if (res == null) {
            _state.value = _state.value.copy(note = "系统解码器打不开：${song.displayTitle}")
            return@withContext false
        }
        if (res.optDouble("integrated", 0.0) == 0.0) {
            Log.d(TAG, "测量为静音: ${song.title}")
            _state.value = _state.value.copy(note = "整段静音或太短：${song.displayTitle}")
            return@withContext false
        }
        val entry = JSONObject()
            .put("integrated", res.optDouble("integrated"))
            .put("truePeak", res.optDouble("truePeak"))
            .put("lra", res.optDouble("lra"))
            .put("size", f.length())
            .put("at", System.currentTimeMillis())
        db.put(song.id, entry)
        prefs?.edit()?.putString(KEY_MEASURED, db.toString())?.apply()
        true
    }

    /** 解码一个文件并把 PCM 喂给 Go 的扫描器，返回 {integrated,truePeak,lra,…}。 */
    private fun scanFile(path: String): JSONObject? {
        val ex = MediaExtractor()
        var codec: MediaCodec? = null
        try {
            ex.setDataSource(path)
            var track = -1
            var fmt: MediaFormat? = null
            for (i in 0 until ex.trackCount) {
                val f = ex.getTrackFormat(i)
                val mime = f.getString(MediaFormat.KEY_MIME) ?: continue
                if (mime.startsWith("audio/")) {
                    track = i
                    fmt = f
                    break
                }
            }
            if (track < 0 || fmt == null) return null
            ex.selectTrack(track)

            val rate = fmt.getInteger(MediaFormat.KEY_SAMPLE_RATE)
            // 扫描器只支持 1~2 声道；多声道文件按前两声道算（BS.1770 的声道加权
            // 在手机场景没有必要精确到这里）。
            val channels = fmt.getInteger(MediaFormat.KEY_CHANNEL_COUNT).coerceIn(1, 2)
            val scan = Mobile.newLoudnessScan(rate.toLong(), channels.toLong())

            val mime = fmt.getString(MediaFormat.KEY_MIME)!!
            codec = MediaCodec.createDecoderByType(mime)
            codec.configure(fmt, null, null, 0)
            codec.start()

            val info = MediaCodec.BufferInfo()
            var inputDone = false
            var outputDone = false
            var pcmFloat = false

            while (!outputDone) {
                if (!inputDone) {
                    val inIdx = codec.dequeueInputBuffer(10_000)
                    if (inIdx >= 0) {
                        val buf = codec.getInputBuffer(inIdx)!!
                        val n = ex.readSampleData(buf, 0)
                        if (n < 0) {
                            codec.queueInputBuffer(inIdx, 0, 0, 0, MediaCodec.BUFFER_FLAG_END_OF_STREAM)
                            inputDone = true
                        } else {
                            codec.queueInputBuffer(inIdx, 0, n, ex.sampleTime, 0)
                            ex.advance()
                        }
                    }
                }
                when (val outIdx = codec.dequeueOutputBuffer(info, 10_000)) {
                    MediaCodec.INFO_OUTPUT_FORMAT_CHANGED -> {
                        val of = codec.outputFormat
                        val enc = if (of.containsKey(MediaFormat.KEY_PCM_ENCODING)) {
                            of.getInteger(MediaFormat.KEY_PCM_ENCODING)
                        } else {
                            AudioFormat.ENCODING_PCM_16BIT
                        }
                        pcmFloat = enc == AudioFormat.ENCODING_PCM_FLOAT
                    }
                    MediaCodec.INFO_TRY_AGAIN_LATER -> Unit
                    else -> if (outIdx >= 0) {
                        if (info.size > 0) {
                            val buf = codec.getOutputBuffer(outIdx)!!
                            buf.position(info.offset)
                            buf.limit(info.offset + info.size)
                            val bytes = ByteArray(info.size)
                            buf.get(bytes)
                            scan.writePCM(if (pcmFloat) floatToS16(bytes) else bytes)
                        }
                        codec.releaseOutputBuffer(outIdx, false)
                        if (info.flags and MediaCodec.BUFFER_FLAG_END_OF_STREAM != 0) outputDone = true
                    }
                }
            }
            return runCatching { JSONObject(scan.resultJSON()) }.getOrNull()
        } catch (t: Throwable) {
            Log.w(TAG, "解码失败 $path: ${t.message}")
            return null
        } finally {
            runCatching { codec?.stop() }
            runCatching { codec?.release() }
            runCatching { ex.release() }
        }
    }

    /** float32 PCM → 16bit 小端交错（Go 的扫描器吃 16bit）。 */
    private fun floatToS16(bytes: ByteArray): ByteArray {
        val fb = ByteBuffer.wrap(bytes).order(ByteOrder.nativeOrder()).asFloatBuffer()
        val n = fb.remaining()
        val out = ByteArray(n * 2)
        for (i in 0 until n) {
            val v = (fb.get(i).coerceIn(-1f, 1f) * 32767f).toInt()
            out[i * 2] = (v and 0xFF).toByte()
            out[i * 2 + 1] = ((v shr 8) and 0xFF).toByte()
        }
        return out
    }
}
