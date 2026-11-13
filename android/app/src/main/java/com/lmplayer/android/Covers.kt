package com.lmplayer.android

import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.Job
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.isActive
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import org.json.JSONObject

/**
 * 封面自动匹配。
 *
 * 曲库里大量文件的封面是空的（B 站下载来的音频本来就没有内嵌封面，扫描时
 * 也读不到同名图片）。桌面版的做法是「点一首 → 找候选 → 应用」，手机上逐个
 * 点太累，所以这里做成批处理：只处理**没有封面**的歌，每首取评分最高的一张
 * 直接应用。
 *
 * 三件事决定了这里的实现方式：
 *
 *  1. **串行、不并发**。封面源（iTunes / 网易云 / Deezer / MusicBrainz）对并发
 *     请求很敏感，而且后端在自动匹配前可能先等一次 AI 清洗（8~18 秒）。并发
 *     只会让所有请求一起变慢。
 *  2. **可中断**。几十首歌要跑好几分钟，用户随时可能去干别的，必须能停。
 *  3. **有进度**。没有进度的批处理在用户眼里就是「点了没反应」，这正是这轮
 *     要修的问题之一。
 */
object Covers {
    /** 一次批处理的进度。running=false 时 done/total 保留上一次的结果，便于回看。 */
    data class Progress(
        val running: Boolean = false,
        val done: Int = 0,
        val total: Int = 0,
        val matched: Int = 0,
        val skipped: Int = 0,
        val current: String = "",
        val message: String = "",
    ) {
        val text: String
            get() = when {
                running -> "正在匹配 $done/$total${if (current.isBlank()) "" else " · $current"}"
                total > 0 && message.isNotBlank() -> message
                total > 0 -> "已匹配 $matched 张，跳过 $skipped 首"
                else -> ""
            }
    }

    private val _state = MutableStateFlow(Progress())
    val state: StateFlow<Progress> = _state.asStateFlow()

    private val scope = CoroutineScope(SupervisorJob() + Dispatchers.Main.immediate)

    @Volatile
    private var job: Job? = null

    /** 停止批处理（已经应用到文件上的封面不会回滚）。 */
    fun cancel() {
        job?.cancel()
        job = null
        _state.value = _state.value.copy(running = false, message = "已停止")
    }

    /**
     * 给缺封面的歌批处理。
     *
     * @param songs 候选（通常是整个曲库，这里自己筛 coverUrl 为空的）
     * @param limit 最多处理几首（0=不限）。设置页默认 0，菜单里单首时用 1。
     */
    fun autoMatchMissing(songs: List<Song>, limit: Int = 0, embed: Boolean = false) {
        if (job?.isActive == true) return
        val todo = songs.filter { !hasCover(it) }
            .let { if (limit > 0) it.take(limit) else it }
        if (todo.isEmpty()) {
            _state.value = Progress(total = 0, message = "没有缺封面的歌曲")
            return
        }

        _state.value = Progress(running = true, total = todo.size, current = "")
        job = scope.launch {
            var done = 0
            var matched = 0
            var skipped = 0
            var dirty = false
            for (s in todo) {

                _state.value = _state.value.copy(current = s.displayTitle)
                val ok = runCatching { matchOne(s, embed) }.getOrDefault(false)
                done++
                if (ok) {
                    matched++
                    dirty = true
                } else {
                    skipped++
                }
                _state.value = _state.value.copy(done = done, matched = matched, skipped = skipped)
                // 每 5 首刷一次曲库：封面地址变了要重新拉列表才看得到，
                // 但每一首都刷会让大曲库（几千首）反复做 JSON 往返。
                if (dirty && done % 5 == 0) {
                    runCatching { Store.refreshSongs() }
                    dirty = false
                }
            }
            if (dirty) refreshOverrides()
            _state.value = _state.value.copy(
                running = false,
                current = "",
                message = if (matched == 0 && skipped > 0 && lastMessage.isNotBlank()) {
                    "没换成封面：$lastMessage"
                } else {
                    "完成：匹配到 $matched 张，$skipped 首没找到"
                },
            )
            job = null
        }
    }

    /**
     * 单首歌匹配一张最佳封面并应用。
     * @return 是否真的应用了封面
     */
    suspend fun matchOne(song: Song, embed: Boolean = false): Boolean {
        // 收敛到 autoApply -> apply()：那里的成功判据是「界面真的能显示这张图」。
        // 原来这里自己判 ApplyWith 的 ok，和界面链路（CachedPreviews 回填）
        // 不是同一条，才会出现「提示匹配成功、封面一点没变」。
        val r = autoApply(song)
        if (!r.ok) android.util.Log.w("LMCovers", "${song.displayTitle}: ${r.message}")
        return r.ok
    }

    /** 最近一次失败原因（界面上显示，避免「说成功其实没换」）。 */
    @Volatile
    var lastMessage: String = ""
        private set

    /**
     * songID → 封面（data URL）。
     *
     * 为什么不直接用 song.coverUrl：那个字段来自**文件内嵌**封面（见
     * internal/library 的 songFromCandidate），而自动匹配/手动换封面写进的是
     * covercache 目录 —— 两条路互不相通，所以换了封面之后曲库里那首歌的
     * coverUrl 仍然是空的，界面上看起来「明明匹配成功却没有图」。
     * 后端为此提供了 CoverService.CachedPreviews（songID → 当前生效那张的
     * data URL），这里拉一份放内存，展示时优先用它。
     */
    private val _overrides = MutableStateFlow<Map<String, String>>(emptyMap())
    val overrides: StateFlow<Map<String, String>> = _overrides.asStateFlow()

    /**
     * 拉一次「缓存里已有的封面」。启动时、批量匹配后、单曲匹配后各调一次。
     *
     * alsoSongs：「覆盖表更新完再刷一遍曲库」。必须这么做 —— 覆盖表是普通
     * StateFlow，界面读它不会触发重组，只有曲库列表换了新实例才会重画。
     */
    fun refreshOverrides(alsoSongs: Boolean = true) {
        scope.launch {
            pullOverrides()
            if (alsoSongs) runCatching { Store.refreshSongs() }
            // 覆盖表到位后补一次通知封面：冷启动时通知往往比这里先发，
            // 那时 imageFor 还是空的，通知就会一直显示成没有大图。
            runCatching { MediaSessionHub.onState(Player.state.value) }
        }
    }

    /**
     * 覆盖表的 suspend 版。
     *
     * AutoFill 开工前必须**等**它完成：hasCover 读的是这张表，表还没拉到时
     * 「已匹配到封面」的歌会被一律判成缺失，于是每次启动都整库重匹一遍。
     *
     * @return 是否真的拿到了（后端没起来时返回 false，调用方忽略即可）
     */
    suspend fun pullOverrides(): Boolean = withContext(Dispatchers.IO) {
        val r = runCatching { Bridge.callObj("CoverService.CachedPreviews") }.getOrNull()
            ?: return@withContext false
        val out = HashMap<String, String>()
        val keys = r.keys()
        while (keys.hasNext()) {
            val k = keys.next()
            val v = if (r.isNull(k)) "" else r.optString(k)
            // 单张超过 512KB 的直接跳过：data URL 全部塞进内存，几百首大图
            // 会把内存吃光（后端本身也限制了回填数量，这里再加一道闸）。
            if (v.isNotBlank() && v.length <= 512 * 1024) out[k] = v
        }
        _overrides.value = out
        true
    }

    /** 这首歌该显示的封面：优先自动/手动匹配的那张，其次文件内嵌的。 */
    fun imageFor(song: Song): String {
        val o = _overrides.value[song.id]
        if (!o.isNullOrBlank()) return o
        return song.coverUrl
    }

    /**
     * 当前这张封面的来历。
     *
     * 面板里必须说清楚：把「文件内嵌的封面」写成「上一步应用的结果」会让用户
     * 以为已经换过了（这正是之前「显示匹配成功、封面没变」的错觉来源之一）。
     */
    fun originOf(song: Song): String {
        val o = _overrides.value[song.id]
        return when {
            !o.isNullOrBlank() -> "当前：已匹配的封面（存在缓存里）"
            song.coverUrl.isNotBlank() -> "当前：文件内嵌封面"
            else -> "当前：没有封面"
        }
    }

    /** 有没有可显示的封面（决定「缺失封面」的判定）。 */
    fun hasCover(song: Song): Boolean = imageFor(song).isNotBlank()

    /* -------------------------------------------------- 手动匹配：候选与应用 */

    /**
     * 一个候选封面。preview 是 data URL，面板直接拿它渲染缩略图 ——
     * 候选列表**不经过**内存覆盖表，所以「列表里的图」和「候选里的图」
     * 是同一条链路，不会出现「候选好看、应用后没变」。
     */
    data class Candidate(
        val provider: String,
        val source: String,
        val preview: String,
        val score: Int,
        val width: Int,
        val height: Int,
    )

    /** 一次「找候选」的结果。ok=false 时 message 就是失败原因（要给用户看）。 */
    data class LookupResult(
        val ok: Boolean,
        val candidates: List<Candidate>,
        val message: String,
    )

    /** 应用一张候选的结果。 */
    data class ApplyResult(val ok: Boolean, val message: String)

    /**
     * 联网找候选（不落盘）。
     *
     * @param keyword 为空 → 按曲目元数据搜，后端会先做一次 AI 清洗；
     *                非空 → **只用这个关键词**（后端会把歌手/专辑清空，
     *                否则原曲元数据会把搜索锁死，关键词等于没生效）。
     */
    suspend fun lookup(song: Song, keyword: String = ""): LookupResult =
        withContext(Dispatchers.IO) {
            val ov = JSONObject()
            if (keyword.isNotBlank()) ov.put("keyword", keyword.trim())
            val arr = runCatching { Bridge.callArray("CoverService.LookupAll", song.id, ov) }
                .getOrElse { t ->
                    return@withContext LookupResult(false, emptyList(), t.message ?: "搜索失败")
                }
            val all = arr.objects()
            val list = all
                .filter { it.bool("ok") && it.str("preview").isNotBlank() }
                .map {
                    Candidate(
                        provider = it.str("provider"),
                        source = it.str("source"),
                        preview = it.str("preview"),
                        score = it.int("score"),
                        width = it.int("width"),
                        height = it.int("height"),
                    )
                }
            if (list.isEmpty()) {
                val why = all.firstOrNull { it.str("message").isNotBlank() }?.str("message").orEmpty()
                // 后端在「设置 → 在线封面」关着时直接回空数组、不报错；不点明这一句，
                // 用户只会看到「没有候选」，永远想不到是自己关掉了一个开关。
                val shown = why.ifBlank {
                    "没有找到匹配的封面（若关过「在线封面」，去 设置 → 曲库 打开）"
                }
                return@withContext LookupResult(false, emptyList(), shown)
            }
            LookupResult(true, list, "找到 ${list.size} 张，点一张选中")
        }

    /**
     * 这张图**真的能显示出来**吗？返回 null 表示可用，否则返回给人看的原因。
     *
     * 为什么必须做这一步：后端 LookupAll 只保证「下载到了、能解码、不是纯白图」，
     * 而「评分最高那张」经常是 B 站视频截图、纯色占位、极小的缩略图。以前的
     * 自动匹配直接拿评分最高的一张去应用，于是出现「自动匹配把封面换成了空
     * 封面，可候选里明明有能用的图」—— 用户手挑能成，自动就一定失败，因为
     * 两者的区别只是「谁挑」。
     *
     * 判定放在本地（BitmapFactory），和界面渲染走同一个解码器：本地解不出来
     * 的图，界面上一定是空白，这一步等于把「空白」在落盘之前拦下来。
     */
    fun unusableReason(dataUrl: String): String? {
        val comma = dataUrl.indexOf(',')
        if (!dataUrl.startsWith("data:") || comma < 0) return "不是内嵌图（拿不到字节）"
        val bytes = runCatching {
            android.util.Base64.decode(dataUrl.substring(comma + 1), android.util.Base64.DEFAULT)
        }.getOrNull() ?: return "图数据坏了（base64 解不开）"

        val head = android.graphics.BitmapFactory.Options()
        head.inJustDecodeBounds = true
        android.graphics.BitmapFactory.decodeByteArray(bytes, 0, bytes.size, head)
        val w = head.outWidth
        val h = head.outHeight
        if (w <= 0 || h <= 0) return "这张图解码不出来"
        // 太小的一定是占位/缩略图：铺到大封面上就是一团色块，用户看到的就是「空封面」
        if (w < 160 || h < 160) return "这张图太小（${w}×${h}）"

        val opt = android.graphics.BitmapFactory.Options()
        opt.inSampleSize = maxOf(1, minOf(w, h) / 24)
        val bmp = runCatching {
            android.graphics.BitmapFactory.decodeByteArray(bytes, 0, bytes.size, opt)
        }.getOrNull() ?: return "这张图解码不出来"

        // 采样算亮度均值/标准差：白图放下采样后几乎全是 255，标准差接近 0；
        // 正常封面（哪怕构图极简）也会有明显的明暗分布。
        var sum = 0.0
        var sum2 = 0.0
        var n = 0
        val stepX = maxOf(1, bmp.width / 16)
        val stepY = maxOf(1, bmp.height / 16)
        var y = 0
        while (y < bmp.height) {
            var x = 0
            while (x < bmp.width) {
                val p = bmp.getPixel(x, y)
                val lum = 0.299 * ((p shr 16) and 0xFF) + 0.587 * ((p shr 8) and 0xFF) + 0.114 * (p and 0xFF)
                sum += lum
                sum2 += lum * lum
                n++
                x += stepX
            }
            y += stepY
        }
        bmp.recycle()
        if (n == 0) return "这张图是空的"
        val mean = sum / n
        val sd = kotlin.math.sqrt(maxOf(0.0, sum2 / n - mean * mean))
        if (mean > 232 && sd < 14) return "这张是纯白占位图"
        if (sd < 4) return "这张几乎是纯色"
        return null
    }

    /** 自动挑一张应用（面板里的「自动匹配」走这里）。 */
    suspend fun autoApply(song: Song): ApplyResult = autoApplyDetailed(song).first

    /**
     * 自动挑一张应用，同时把候选交给调用方。
     *
     * 自动匹配不可能 100% 命中（B 站标题、同名版本、纯音乐），失败时面板要能
     * 立刻把候选摆出来让用户自己挑 —— 否则用户只能再点一次「搜索候选」，
     * 白白多等一个来回。
     */
    suspend fun autoApplyDetailed(song: Song): Pair<ApplyResult, List<Candidate>> {
        val r = lookup(song)
        if (!r.ok) return ApplyResult(false, r.message) to r.candidates
        val ordered = r.candidates.sortedByDescending { it.score }
        if (ordered.isEmpty()) return ApplyResult(false, "没有候选封面") to ordered

        val rejects = ArrayList<String>()
        for (c in ordered) {
            val bad = unusableReason(c.preview)
            if (bad != null) {
                rejects.add("${providerLabel(c.provider)}：$bad")
                continue
            }
            val res = apply(song, c)
            if (res.ok) {
                val extra = if (rejects.isEmpty()) "" else "（跳过 ${rejects.size} 张不可用的）"
                val msg = "已应用 ${providerLabel(c.provider)} ${c.width}×${c.height}$extra"
                android.util.Log.i("LMCovers", "auto ${song.displayTitle}: $msg")
                return ApplyResult(true, msg) to ordered
            }
            rejects.add("${providerLabel(c.provider)}：${res.message}")
        }
        val why = rejects.firstOrNull().orEmpty()
        val msg = "候选 ${ordered.size} 张都没能应用，封面保持原样" +
            (if (why.isBlank()) "" else "（$why）")
        lastMessage = msg
        android.util.Log.w("LMCovers", "auto failed ${song.displayTitle}: $msg")
        return ApplyResult(false, msg) to ordered
    }

    /** 面板里显示来源用的短名。 */
    fun providerLabel(provider: String): String = when (provider.lowercase()) {
        "itunes" -> "iTunes"
        "netease" -> "网易云"
        "qq" -> "QQ 音乐"
        "deezer" -> "Deezer"
        "musicbrainz" -> "MusicBrainz"
        "" -> "未知来源"
        else -> provider
    }

    /**
     * 应用一张候选。
     *
     * 成功判据是「界面真的显示出来了」：后端回 ok 之后还必须拿到那张图的
     * data URL，并且**立刻写进内存覆盖表**。以前只调 refreshOverrides()，
     * 它走 CachedPreviews 回填（异步、最多 200 首、单张超 512KB 跳过），
     * 任何一条不满足，界面上就是「提示匹配成功、封面一点没变」。
     */
    suspend fun apply(song: Song, c: Candidate): ApplyResult = withContext(Dispatchers.IO) {
        // 手动挑的那张也要过同一道关：候选网格里的缩略图有 98dp 高，一张
        // 1×1 的占位图在小格子里看不出来，铺到大封面上就是空白。
        unusableReason(c.preview)?.let { return@withContext ApplyResult(false, it) }
        val res = runCatching {
            Bridge.callObj("CoverService.ApplyWith", song.id, c.source, c.preview, false)
        }.getOrElse { t -> return@withContext ApplyResult(false, t.message ?: "应用封面失败") }
        if (!res.bool("ok")) {
            val msg = res.str("message").ifBlank { "应用封面失败" }
            lastMessage = msg
            return@withContext ApplyResult(false, msg)
        }
        val fresh = res.str("preview")
        if (fresh.isBlank()) {
            lastMessage = "封面写进缓存了，但没拿到可显示的图，界面上看不到变化"
            return@withContext ApplyResult(false, lastMessage)
        }
        _overrides.value = _overrides.value + (song.id to fresh)
        runCatching { Store.refreshSongs() }
        ApplyResult(true, res.str("message").ifBlank { "封面已更新" })
    }

    /** 设置页/菜单里的「匹配当前这首」，返回给用户看的一句话。 */
    fun matchOneAndReport(song: Song) {
        scope.launch {
            _state.value = Progress(running = true, total = 1, current = song.displayTitle)
            val ok = runCatching { matchOne(song) }.getOrDefault(false)
            if (ok) refreshOverrides()
            _state.value = Progress(
                running = false,
                done = 1,
                total = 1,
                matched = if (ok) 1 else 0,
                current = "",
                message = if (ok) "已更新封面" else (lastMessage.ifBlank { "没有找到合适的封面" }),
            )
        }
    }
}
