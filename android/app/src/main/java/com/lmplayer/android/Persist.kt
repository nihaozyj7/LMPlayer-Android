package com.lmplayer.android

import android.content.Context

/**
 * 需要「关掉应用还在」的少量状态。
 *
 * 只放三类东西：主页停在哪（我喜欢 / 某个歌单）、播放队列、当前歌曲与进度。
 * 曲库、歌单、配置都在 Go 后端（它自己落盘），这里不重复存 —— 存两遍就会
 * 出现「以哪份为准」的问题。
 *
 * 不用 MMKV/DataStore：总共就四条值，SharedPreferences 的 apply() 已经够快，
 * 而播放进度每 2 秒才写一次，不会出现掉帧。
 */
object Persist {
    private const val NAME = "lm_persist"
    private var sp: android.content.SharedPreferences? = null

    fun init(c: Context) {
        if (sp == null) sp = c.getSharedPreferences(NAME, Context.MODE_PRIVATE)
    }

    /* ------------------------------------------------------------ 主页位置 */

    /** 主页当前展示的内容，序列化成 "all" / "liked" / "pl:<id>"。 */
    var sectionKey: String
        get() = sp?.getString("section", "all") ?: "all"
        set(v) {
            sp?.edit()?.putString("section", v)?.apply()
        }

    fun keyOf(s: Section): String = when (s) {
        Section.AllSongs -> "all"
        Section.Liked -> "liked"
        is Section.InPlaylist -> "pl:" + s.id
    }

    /**
     * 反解上次的位置。
     *
     * 歌单可能已经被删掉，这时必须退回「全部歌曲」—— 否则启动后停在一个
     * 空列表上，用户会以为曲库丢了。
     */
    fun sectionOf(playlists: List<Playlist>): Section? = when {
        sectionKey == "all" -> Section.AllSongs
        sectionKey == "liked" -> Section.Liked
        sectionKey.startsWith("pl:") -> {
            val id = sectionKey.removePrefix("pl:")
            playlists.firstOrNull { it.id == id }?.let { Section.InPlaylist(it.id, it.name) }
                ?: Section.AllSongs
        }
        else -> null
    }

    /* ------------------------------------------------------ 队列 / 当前歌曲 */

    var songId: String?
        get() = sp?.getString("song", null)
        set(v) {
            sp?.edit()?.putString("song", v)?.apply()
        }

    var positionMs: Long
        get() = sp?.getLong("pos", 0L) ?: 0L
        set(v) {
            sp?.edit()?.putLong("pos", v)?.apply()
        }

    var queueIds: List<String>
        get() {
            val raw = sp?.getString("queue", null) ?: return emptyList()
            return runCatching {
                val a = org.json.JSONArray(raw)
                (0 until a.length()).map { a.getString(it) }
            }.getOrDefault(emptyList())
        }
        set(v) {
            val a = org.json.JSONArray()
            v.forEach { a.put(it) }
            sp?.edit()?.putString("queue", a.toString())?.apply()
        }

    /* ---------------------------------------------------- 单击歌曲的行为 */

    /**
     * 单击歌曲时做什么：
     *   "append"（默认）= 追加进现有播放队列
     *   "list"           = 把当前列表整体设为播放队列
     *
     * 存本地 SharedPreferences 而不是后端配置：这是纯界面行为，Go 后端不关心，
     * 也没有对应字段 —— 往后端配置里塞未知 key 只会让「改了不生效」的困惑变多。
     */
    var clickAction: String
        get() = sp?.getString("click_action", "append") ?: "append"
        set(v) {
            sp?.edit()?.putString("click_action", v)?.apply()
        }

    fun savePlayback(songId: String?, positionMs: Long) {
        sp?.edit()
            ?.putString("song", songId)
            ?.putLong("pos", positionMs)
            ?.apply()
    }
}
