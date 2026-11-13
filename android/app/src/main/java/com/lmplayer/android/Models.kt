package com.lmplayer.android

import org.json.JSONObject

/** 一首本地歌曲；字段名与 Go 侧 bootstrap.Song 的 json tag 一一对应。 */
data class Song(
    val id: String,
    val path: String,
    val title: String,
    val artist: String,
    val album: String,
    val ext: String,
    val durationMs: Long,
    val size: Long,
    val sampleRate: Int,
    val bitrate: Int,
    val addedAt: Long,
    val playCount: Int,
    val coverUrl: String,
) {
    val displayTitle: String get() = title.ifBlank { path.substringAfterLast('/').substringAfterLast('\\') }
    val displayArtist: String get() = artist.ifBlank { "未知艺人" }

    companion object {
        fun from(o: JSONObject) = Song(
            id = o.str("id"),
            path = o.str("path"),
            title = o.str("title"),
            artist = o.str("artist"),
            album = o.str("album"),
            ext = o.str("ext"),
            durationMs = o.long("duration"),
            size = o.long("size"),
            sampleRate = o.int("sampleRate"),
            bitrate = o.int("bitrate"),
            addedAt = o.long("addedAt"),
            playCount = o.int("playCount"),
            coverUrl = o.str("coverUrl"),
        )
    }
}

/** 一个被监听的本地目录。status: ok | missing | denied */
data class Folder(
    val id: String,
    val path: String,
    val trackCount: Int,
    val status: String,
    val watching: Boolean,
) {
    val name: String get() = path.trimEnd('/').substringAfterLast('/').ifBlank { path }

    companion object {
        fun from(o: JSONObject) = Folder(
            id = o.str("id"),
            path = o.str("path"),
            trackCount = o.int("trackCount"),
            status = o.str("status", "ok"),
            watching = o.bool("watching"),
        )
    }
}

/** 歌单；「我喜欢」是受限歌单（locked=true，不能删）。 */
data class Playlist(
    val id: String,
    val name: String,
    val locked: Boolean,
    val builtin: Boolean,
    val songIds: List<String>,
    val createdAt: Long,
) {
    companion object {
        fun from(o: JSONObject) = Playlist(
            id = o.str("id"),
            name = o.str("name"),
            locked = o.bool("locked"),
            builtin = o.bool("builtin"),
            songIds = o.arr("songIds").strings(),
            createdAt = o.long("createdAt"),
        )
    }
}

/**
 * 界面关心的配置子集。
 *
 * 只解析原生界面真的会读/写的字段 —— Go 侧 Config 有几十项，其中一大半
 * （窗口圆角、托盘、玻璃模糊…）在手机上根本没有意义，全量镜像过来只会
 * 让「改了没反应」这种困惑变多。
 */
data class AppConfig(
    val theme: String = "default",
    val themeMode: String = "dark",
    val animations: Boolean = true,
    val animationsSpeed: String = "medium",
    val volume: Double = 1.0,
    val muted: Boolean = false,
    val listDensity: String = "comfy",
    // ---- AI（智能匹配）----
    /** 接口地址（DeepSeek / OpenAI 兼容网关都是它）。非法时 aiBaseUrlProblem 给出原因。 */
    val aiBaseUrl: String = "",
    /** 密钥。后端返回的是打码串（sk-…abcd），没配过时为空。 */
    val aiApiKey: String = "",
    /** 是否已配置密钥（后端派生字段：密钥被打码后前端只能靠它判断）。 */
    val aiApiKeySet: Boolean = false,
    /** 接口地址的问题（空=没问题）。 */
    val aiBaseUrlProblem: String = "",
    val aiModelId: String = "",
    val aiVendor: String = "",
    /** 思考模式。清洗歌名这种任务不需要推理，关掉更快。 */
    val aiThinking: Boolean = false,
    /** 自动匹配歌词前是否先用 AI 清洗元数据。 */
    val aiLyricsClean: Boolean = true,
    /** 下载完成后是否用 AI 提取元数据并写回文件标签。 */
    val aiDownloadTag: Boolean = false,
) {
    val aiReady: Boolean get() = aiApiKeySet && aiBaseUrl.isNotBlank()

    companion object {
        fun from(o: org.json.JSONObject) = AppConfig(
            theme = o.str("theme", "default"),
            themeMode = o.str("themeMode", "dark"),
            animations = o.bool("animations", true),
            animationsSpeed = o.str("animationsSpeed", "medium"),
            volume = o.dbl("volume", 1.0),
            muted = o.bool("muted"),
            listDensity = o.str("listDensity", "comfy"),
            aiBaseUrl = o.str("aiBaseUrl"),
            aiApiKey = o.str("aiApiKey"),
            aiApiKeySet = o.bool("aiApiKeySet"),
            aiBaseUrlProblem = o.str("aiBaseUrlProblem"),
            aiModelId = o.str("aiModelId"),
            aiVendor = o.str("aiVendor"),
            aiThinking = o.bool("aiThinking"),
            aiLyricsClean = o.bool("aiLyricsClean", true),
            aiDownloadTag = o.bool("aiDownloadTag"),
        )
    }
}

/** 主题条目（名字 + 明暗 + 色卡）。 */
data class ThemeInfo(
    val id: String,
    val name: String,
    val mode: String,
    val swatch: List<String>,
) {
    companion object {
        fun from(o: JSONObject) = ThemeInfo(
            id = o.str("id"),
            name = o.str("name", o.str("id")),
            mode = o.str("mode", "dark"),
            swatch = o.arr("swatch").strings(),
        )
    }
}

/**
 * 在线搜索结果（B 站等），字段与 Go 侧在线源返回一致。
 *
 * ★ id 与 bvid 是两个不同的东西，不能混用：
 *   - id 是「曲目 id」，形如 bili:BV1xx（见 Go 的 onlineSongID），播放队列、
 *     歌单、收藏都只认它，MediaService.URL 也按它换播放地址；
 *   - bvid 是 B 站视频号 BV1xx，只有 DownloadService.Start 认它。
 * Go 的 Search 下发 "id": "bili:"+BVID，之前直接把 id 当 bvid 传给下载，
 * 于是后端拿 "bili:BV..." 去查视频必然失败 —— 这就是「下载点了没反应」。
 */
data class OnlineTrack(
    val id: String,
    val bvid: String,
    val title: String,
    val artist: String,
    val cover: String,
    val durationMs: Long,
    val source: String,
    /** 后端在线音频代理地址（相对路径，形如 /online/audio?id=..&t=..）。 */
    val streamUrl: String,
) {
    /** 转成播放器认的 Song：id 带 bili: 前缀，path 为空（不在本地曲库）。 */
    fun toSong() = Song(
        id = id,
        path = "",
        title = title,
        artist = artist,
        album = "",
        ext = "m4a",
        durationMs = durationMs,
        size = 0,
        sampleRate = 0,
        bitrate = 0,
        addedAt = 0,
        playCount = 0,
        coverUrl = cover,
    )

    companion object {
        fun from(o: JSONObject): OnlineTrack {
            // bvid 优先取独立字段；老格式只有 id 时去掉 bili: 前缀兜底
            val bvid = o.str("bvid").ifBlank {
                o.str("id").removePrefix("bili:").trim()
            }
            return OnlineTrack(
                id = "bili:$bvid",
                bvid = bvid,
                title = o.str("title"),
                artist = o.str("artist", o.str("author")),
                cover = o.str("cover", o.str("pic")),
                durationMs = o.long("duration"),
                source = o.str("source", "bilibili"),
                streamUrl = o.str("streamUrl"),
            )
        }
    }
}

/** 排序字段；label 直接就是表头上显示的字。 */
enum class SortKey(val key: String, val label: String) {
    ADDED("addedAt", "添加时间"),
    TITLE("title", "标题"),
    ARTIST("artist", "歌手"),
    ALBUM("album", "专辑"),
    DURATION("duration", "时长"),
    PLAYED("playCount", "播放次数"),
}

fun formatDuration(ms: Long): String {
    if (ms <= 0) return "--:--"
    val total = ms / 1000
    val h = total / 3600
    val m = (total % 3600) / 60
    val s = total % 60
    return if (h > 0) "%d:%02d:%02d".format(h, m, s) else "%d:%02d".format(m, s)
}
