package com.lmplayer.android

import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.setValue
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import org.json.JSONArray
import org.json.JSONObject

/**
 * 歌词：解析 + 匹配工作台。
 *
 * 移植自桌面版的「歌词工作台」（internal/lyrics + app/LyricsService +
 * OnlineService.SearchLyrics/FetchLyrics），手机端只保留三条主线：
 *
 *  1. 打开歌词先读本地（内嵌 / 同名 .lrc / 缓存），**不联网**——切歌时联网
 *     等待十几秒是桌面版明确修过的坑（见 LyricsService.Load 的注释）；
 *  2. 本地没有才在线自动匹配一次（AutoMatch），匹配到就落缓存；
 *  3. 自动匹配不准时，用户可以手动搜候选、看到「逐字/逐行」标记后选用，
 *     选中的结果写进缓存并可嵌入文件。
 *
 * 时间轴统一是**增强 LRC**（`[00:12.00]<00:12.000>你<00:12.300>好`）：
 * 后端所有来源（QRC / KRC / YRC / klyric）都归一化成这个形式，前端只需认一种。
 */

/** 一个字（或一个词）的时间片。 */
data class LyricWord(val at: Long, val text: String)

/** 一行歌词；words 非空表示这一行有逐字时间轴。 */
data class LyricLine(val at: Long, val text: String, val words: List<LyricWord> = emptyList()) {
    val end: Long get() = words.lastOrNull()?.at ?: at
}

/** 一次歌词加载的结果。source 形如 embedded / lrc-file / cache / online:lrclib / none */
data class LyricsResult(
    val lines: List<LyricLine> = emptyList(),
    val source: String = "none",
    val wordLevel: Boolean = false,
) {
    val empty: Boolean get() = lines.isEmpty()
}

/** 手动匹配的一个候选。 */
data class LyricCandidate(
    val provider: String,
    val id: String,
    val title: String,
    val artist: String,
    val album: String,
    val duration: Long,
    val score: Double,
) {
    val label: String get() = listOf(title, artist).filter { it.isNotBlank() }.joinToString(" - ")
}

object Lyrics {
    private const val PREFS = "lm_lyrics"
    private const val KEY_OFFSET = "offset"

    private var prefs: android.content.SharedPreferences? = null

    /**
     * 歌词内容版本：手动匹配、在线升级逐字之后 +1。
     * 详情页把它当 LaunchedEffect 的 key，改完立刻重载，不用退出重进。
     */
    var contentVersion by androidx.compose.runtime.mutableIntStateOf(0)
        private set

    /** 偏移版本：微调之后 +1，详情页据此重算时间轴。 */
    var offsetVersion by androidx.compose.runtime.mutableIntStateOf(0)
        private set

    /** 进程内缓存：来回切歌不必反复读文件/联网。 */
    private val memo = object : LinkedHashMap<String, LyricsResult>(8, 0.75f, true) {
        override fun removeEldestEntry(eldest: MutableMap.MutableEntry<String, LyricsResult>?) =
            size > 16
    }

    fun init(ctx: android.content.Context) {
        if (prefs == null) prefs = ctx.getSharedPreferences(PREFS, android.content.Context.MODE_PRIVATE)
    }

    /** 这首歌的歌词偏移（毫秒，正数=歌词提前）。对齐不准时用户手动校。 */
    fun offsetMs(songId: String): Long = prefs?.getLong("$KEY_OFFSET:$songId", 0L) ?: 0L

    fun setOffset(songId: String, ms: Long) {
        if (offsetMs(songId) == ms) return
        prefs?.edit()?.putLong("$KEY_OFFSET:$songId", ms)?.apply()
        offsetVersion++
    }

    /* ---------------------------------------------------------------- 解析 */

    private val LINE_TAG = Regex("\\[(\\d{1,3}):(\\d{1,2})(?:[.:](\\d{1,3}))?]")
    private val WORD_TAG = Regex("<(\\d{1,3}):(\\d{1,2})(?:[.:](\\d{1,3}))?>")
    // QRC 原始写法：[起始毫秒,时长毫秒] 行标签，字级是 <起始,时长>
    private val QRC_LINE = Regex("^\\[(\\d{1,8}),(\\d{1,8})]")
    private val QRC_WORD = Regex("<(\\d{1,8}),(\\d{1,8})(?:,\\d{1,8})?>")

    private fun stamp(min: String, sec: String, frac: String): Long {
        val ms = if (frac.isEmpty()) 0L else frac.padEnd(3, '0').take(3).toLongOrNull() ?: 0L
        return (min.toLongOrNull() ?: 0L) * 60_000L + (sec.toLongOrNull() ?: 0L) * 1_000L + ms
    }

    /**
     * 解析歌词文本。同时认三种形态：
     *  - 行级 LRC          [00:12.00]正文
     *  - 增强 LRC（逐字）  [00:12.00]<00:12.000>你<00:12.300>好
     *  - QRC 原始           [12000,3000]正文（字级 <12000,300>你）
     */
    fun parse(raw: String): List<LyricLine> {
        if (raw.isBlank()) return emptyList()
        val out = ArrayList<LyricLine>()
        for (line in raw.lineSequence()) {
            if (line.isBlank()) continue
            val qrc = QRC_LINE.find(line)
            if (qrc != null) {
                val at = qrc.groupValues[1].toLongOrNull() ?: continue
                val body = line.substring(qrc.range.last + 1)
                out.add(LyricLine(at, stripTags(body), parseQrcWords(body)))
                continue
            }
            val marks = LINE_TAG.findAll(line).toList()
            if (marks.isEmpty()) continue
            val body = line.substring(marks.last().range.last + 1)
            val words = parseWords(body)
            val text = stripTags(body)
            if (text.isEmpty()) continue
            if (words.isNotEmpty()) {
                // 有字级时间轴的行只取第一个行标签：增强 LRC 里一个字级行
                // 对应一个行标签，多标签通常出现在行级重复段落上。
                out.add(LyricLine(stamp(marks[0].groupValues[1], marks[0].groupValues[2], marks[0].groupValues[3]), text, words))
            } else {
                for (m in marks) {
                    out.add(LyricLine(stamp(m.groupValues[1], m.groupValues[2], m.groupValues[3]), text))
                }
            }
        }
        return out.sortedBy { it.at }
    }

    private fun parseWords(body: String): List<LyricWord> {
        val marks = WORD_TAG.findAll(body).toList()
        if (marks.isEmpty()) return emptyList()
        val out = ArrayList<LyricWord>(marks.size)
        for ((i, m) in marks.withIndex()) {
            val at = stamp(m.groupValues[1], m.groupValues[2], m.groupValues[3])
            val start = m.range.last + 1
            val end = if (i + 1 < marks.size) marks[i + 1].range.first else body.length
            val t = body.substring(start, end.coerceAtLeast(start))
            if (t.isNotEmpty()) out.add(LyricWord(at, t))
        }
        return out
    }

    private fun parseQrcWords(body: String): List<LyricWord> {
        val marks = QRC_WORD.findAll(body).toList()
        if (marks.isEmpty()) return emptyList()
        val out = ArrayList<LyricWord>(marks.size)
        for ((i, m) in marks.withIndex()) {
            val at = m.groupValues[1].toLongOrNull() ?: continue
            val start = m.range.last + 1
            val end = if (i + 1 < marks.size) marks[i + 1].range.first else body.length
            val t = body.substring(start, end.coerceAtLeast(start))
            if (t.isNotEmpty()) out.add(LyricWord(at, t))
        }
        return out
    }

    private fun stripTags(body: String): String =
        body.replace(WORD_TAG, "").replace(QRC_WORD, "").trim()

    /** 当前行下标；lines 为空时返回 -1。 */
    fun currentLine(lines: List<LyricLine>, positionMs: Long): Int {
        if (lines.isEmpty()) return -1
        val i = lines.indexOfLast { it.at <= positionMs }
        return if (i < 0) 0 else i
    }

    /**
     * 当前逐字进度（0f~1f），用于逐字点亮。
     * 这一行没有字级时间轴时返回 -1（保持整行高亮）。
     */
    fun wordProgress(line: LyricLine, positionMs: Long): Float {
        if (line.words.size < 2) return -1f
        val first = line.words.first().at
        val last = line.words.last().at + 400
        if (last <= first) return -1f
        return ((positionMs - first).toFloat() / (last - first)).coerceIn(0f, 1f)
    }

    /* ------------------------------------------------------------ 加载/匹配 */

    /**
     * 详情页用的加载入口：先看进程内缓存，再走 [load]。
     * 已经在播的歌每次展开详情页都重新读盘/联网是纯浪费。
     */
    suspend fun loadCached(song: Song): LyricsResult {
        memo[song.id]?.let { return it }
        val r = load(song)
        memo[song.id] = r
        return r
    }

    /** 歌词内容变了（换了一份），把缓存清掉。 */
    fun invalidate(songId: String? = null) {
        if (songId == null) memo.clear() else memo.remove(songId)
        contentVersion++
    }

    /**
     * 加载一首歌的歌词：本地优先，没有才在线自动匹配一次。
     *
     * 与桌面版的分工一致：Load 只读本地（快），AutoMatch 才联网（慢）。
     */
    suspend fun load(song: Song): LyricsResult = withContext(Dispatchers.IO) {
        val local = runCatching { Bridge.callObj("LyricsService.Load", song.id) }.getOrNull()
        val localLrc = local?.str("lrc").orEmpty()
        if (localLrc.isNotBlank()) {
            val lines = parse(localLrc)
            return@withContext LyricsResult(
                lines = lines,
                source = local?.str("source") ?: "local",
                wordLevel = lines.any { it.words.isNotEmpty() },
            )
        }
        val auto = runCatching { Bridge.callObj("LyricsService.AutoMatch", song.id) }.getOrNull()
        val autoLrc = auto?.str("lrc").orEmpty()
        val lines = parse(autoLrc)
        LyricsResult(
            lines = lines,
            source = auto?.str("source") ?: "none",
            wordLevel = lines.any { it.words.isNotEmpty() },
        )
    }

    /**
     * 手动搜候选。
     *
     * 三个参数分工与桌面版一致：keyword 是用户输入（喂给各来源做全文搜索），
     * title/artist 是元数据（只用于打分排序）。keyword 留空时后端会自己
     * 用元数据 + AI 清洗拼一个。
     */
    suspend fun search(
        keyword: String,
        title: String,
        artist: String,
        durationMs: Long,
    ): List<LyricCandidate> = withContext(Dispatchers.IO) {
        val arr = runCatching {
            Bridge.callArray("OnlineService.SearchLyrics", keyword, title, artist, durationMs)
        }.getOrElse { return@withContext emptyList() }
        (0 until arr.length()).mapNotNull { i ->
            val o = arr.optJSONObject(i) ?: return@mapNotNull null
            LyricCandidate(
                provider = o.str("provider"),
                id = o.str("id"),
                title = o.str("title"),
                artist = o.str("artist"),
                album = o.str("album"),
                duration = o.long("duration"),
                score = o.dbl("score"),
            )
        }
    }

    /** 候选是「逐字」还是「逐行」（抓一次才知道，界面上按序探测）。 */
    suspend fun probe(provider: String, id: String): Boolean = withContext(Dispatchers.IO) {
        runCatching {
            Bridge.callObj("OnlineService.ProbeLyricsFormat", provider, id).bool("wordLevel")
        }.getOrDefault(false)
    }

    /**
     * 采用一个候选：抓歌词 → 写进缓存（并可嵌入文件）。
     * embed=true 时还会写进音频文件的标签，桌面版默认不嵌入（避免破坏文件）。
     */
    suspend fun adopt(song: Song, provider: String, id: String, embed: Boolean = false): LyricsResult =
        withContext(Dispatchers.IO) {
            val fetched = Bridge.callObj("OnlineService.FetchLyrics", provider, id)
            val lrc = fetched.str("lrc")
            if (lrc.isBlank()) return@withContext LyricsResult()
            val source = fetched.str("source", "online:$provider")
            runCatching { Bridge.call("LyricsService.Save", song.id, lrc, source, embed) }
            val lines = parse(lrc)
            invalidate(song.id)
            LyricsResult(lines, source, lines.any { it.words.isNotEmpty() })
        }

    /** 给「本地只有行级」的歌在线找一份逐字版本（后台调用，不挡播放）。 */
    suspend fun upgradeWordLevel(song: Song): LyricsResult? = withContext(Dispatchers.IO) {
        val o = runCatching { Bridge.callObj("LyricsService.UpgradeWordLyrics", song.id) }.getOrNull()
            ?: return@withContext null
        val lrc = o.str("lrc")
        if (lrc.isBlank()) return@withContext null
        val lines = parse(lrc)
        LyricsResult(lines, o.str("source", "cache"), lines.any { it.words.isNotEmpty() })
    }
}
