package com.lmplayer.android

import android.util.Log
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.cancel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import org.json.JSONArray
import org.json.JSONObject

/** 主区域当前展示的是哪一类内容。 */
sealed class Section {
    data object AllSongs : Section()
    data object Liked : Section()
    data class InPlaylist(val id: String, val name: String) : Section()

    val title: String
        get() = when (this) {
            AllSongs -> "全部歌曲"
            Liked -> "我喜欢"
            is InPlaylist -> name
        }
}

data class UiState(
    val songs: List<Song> = emptyList(),
    val folders: List<Folder> = emptyList(),
    val playlists: List<Playlist> = emptyList(),
    val likedIds: Set<String> = emptySet(),
    /** 用户主动从曲库移除的歌（只隐藏，不删文件）。 */
    val hiddenIds: Set<String> = emptySet(),
    val config: AppConfig = AppConfig(),
    val themes: List<ThemeInfo> = emptyList(),
    val section: Section = Section.AllSongs,
    val sort: SortKey = SortKey.ADDED,
    val sortAsc: Boolean = false,
    val loading: Boolean = true,
    val scanning: Boolean = false,
    val scanText: String = "",
    val error: String? = null,
) {
    /** 当前视图要显示的歌曲（按歌单过滤 + 排序）。 */
    val visibleSongs: List<Song>
        get() {
            val base = when (val s = section) {
                Section.AllSongs -> songs
                Section.Liked -> songs.filter { it.id in likedIds }
                is Section.InPlaylist -> {
                    val order = playlists.firstOrNull { it.id == s.id }?.songIds ?: emptyList()
                    val byId = songs.associateBy { it.id }
                    // 歌单里的顺序是用户拖出来的，不能重排；丢了的歌曲（已删除）要跳过
                    order.mapNotNull { byId[it] }
                }
            }
            val cmp: Comparator<Song> = when (sort) {
                SortKey.ADDED -> compareBy { it.addedAt }
                SortKey.TITLE -> compareBy(String.CASE_INSENSITIVE_ORDER) { it.displayTitle }
                SortKey.ARTIST -> compareBy(String.CASE_INSENSITIVE_ORDER) { it.displayArtist }
                SortKey.ALBUM -> compareBy(String.CASE_INSENSITIVE_ORDER) { it.album }
                SortKey.DURATION -> compareBy { it.durationMs }
                SortKey.PLAYED -> compareBy { it.playCount }
            }
            // 歌单视图的默认顺序就是歌单顺序：只有用户主动换了排序字段才重排
            // 被移除的歌只是不显示，文件仍在磁盘上、也还在后端的曲库里
            val shown = base.filter { it.id !in hiddenIds }
            if (section is Section.InPlaylist && sort == SortKey.ADDED && !sortAsc) return shown
            return if (sortAsc) shown.sortedWith(cmp) else shown.sortedWith(cmp.reversed())
        }
}

/**
 * 全应用唯一的可变状态。
 *
 * 没有 ViewModel：原生界面是单 Activity + 若干 Composable，状态跟着进程走
 * 才是用户期望的（旋转屏幕、进设置再回来都不该重扫曲库）。
 */
object Store {
    private const val TAG = "LMStore"
    private val scope = CoroutineScope(SupervisorJob() + Dispatchers.Main.immediate)

    private val _state = MutableStateFlow(UiState())
    val state: StateFlow<UiState> = _state.asStateFlow()

    private var started = false

    fun start() {
        if (started) return
        started = true
        Bridge.onEvent { name, data -> onBackendEvent(name, data) }
        // 下载任务与曲库状态是两套数据源：它有自己的 StateFlow，不塞进 UiState
        // （每一条进度事件都会让主页列表整体重组，见 Downloads 的注释）。
        Downloads.start()
        // 封面覆盖表先拉（一条 RPC，很快），这样紧跟其后的曲库加载完成时
        // 界面第一帧就能带上「自动匹配来的」封面
        Covers.refreshOverrides(alsoSongs = false)
        scope.launch { reloadAll() }
    }

    fun stop() {
        scope.cancel()
    }

    private fun set(block: (UiState) -> UiState) {
        _state.value = block(_state.value)
    }

    fun selectSection(s: Section) {
        // 主页停在哪一类内容上要跟着进程走：下次打开还是这个歌单
        Persist.sectionKey = Persist.keyOf(s)
        set { it.copy(section = s) }
    }

    fun setSort(key: SortKey) = set {
        if (it.sort == key) it.copy(sortAsc = !it.sortAsc) else it.copy(sort = key, sortAsc = true)
    }

    fun clearError() = set { it.copy(error = null) }

    fun pushError(msg: String) = set { it.copy(error = msg) }

    /* ------------------------------------------------------------------ 加载 */

    private suspend fun reloadAll() {
        try {
            val songs = Bridge.callArray("LibraryService.Songs").objects().map(Song::from)
            val folders = Bridge.callArray("LibraryService.Folders").objects().map(Folder::from)
            val playlists = Bridge.callArray("PlaylistService.List").objects().map(Playlist::from)
            val cfg = Bridge.callObj("ConfigService.Get")
            val themes = runCatching {
                Bridge.callArray("ThemeService.List").objects().map(ThemeInfo::from)
            }.getOrDefault(emptyList())
            val liked = playlists.firstOrNull { it.locked }?.songIds?.toSet() ?: emptySet()
            // 上次停留的主页位置（我喜欢 / 某个歌单）。歌单被删掉时 sectionOf
            // 会退回「全部歌曲」，不会停在空列表上
            val savedSection = Persist.sectionOf(playlists) ?: _state.value.section
            set {
                it.copy(
                    songs = songs,
                    folders = folders,
                    playlists = playlists,
                    likedIds = liked,
                    config = AppConfig.from(cfg),
                    themes = themes,
                    section = savedSection,
                    loading = false,
                )
            }
            // 冷启动时后端可能还没把曲库读起来（那时 Songs 是空数组），补一次重试
            if (songs.isEmpty()) retrySongsIfEmpty()
            // 曲库一就绪就去补「没有封面 / 没有歌词」的歌，不用等用户手动点
            if (songs.isNotEmpty()) AutoFill.schedule(songs)
        } catch (t: Throwable) {
            Log.w(TAG, "加载失败", t)
            set { it.copy(loading = false, error = t.message) }
        }
    }

    /**
     * @param notifyAutoFill 是否把这次曲库变化告诉 AutoFill。自动补齐自己
     *   处理过程中会刷曲库（让新封面显示出来），那种刷新不该再触发一轮预筛。
     */
    suspend fun refreshSongs(notifyAutoFill: Boolean = true) {
        val songs = Bridge.callArray("LibraryService.Songs").objects().map(Song::from)
        set { it.copy(songs = songs) }
        // 新入库的歌（在线下载下来的那些）同样要补封面/歌词
        if (notifyAutoFill) AutoFill.schedule(songs)
    }

    /**
     * 冷启动时后端可能还在初始化曲库，第一次 Songs 会拿到空数组。
     *
     * 表现是「一打开应用曲库是空的，点一下刷新才出来」—— 老版本靠
     * scan:done 事件兜底，但那条事件只在真正扫描时才有。所以这里补一次
     * 轻量重试：只在「拿到空列表」时重试两次，不改变任何其它行为。
     */
    private fun retrySongsIfEmpty() {
        scope.launch {
            repeat(3) { i ->
                kotlinx.coroutines.delay(1200L * (i + 1))
                if (_state.value.songs.isNotEmpty()) return@launch
                runCatching { refreshSongs() }
            }
        }
    }

    suspend fun refreshPlaylists() {
        val playlists = Bridge.callArray("PlaylistService.List").objects().map(Playlist::from)
        val liked = playlists.firstOrNull { it.locked }?.songIds?.toSet() ?: emptySet()
        set { it.copy(playlists = playlists, likedIds = liked) }
    }

    /* ------------------------------------------------------------------ 曲库 */

    /** 重新扫描全部目录（下拉刷新）；进度由 scan:progress 事件推进。 */
    fun rescan() {
        scope.launch {
            set { it.copy(scanning = true, scanText = "正在扫描…") }
            try {
                Bridge.call("LibraryService.Scan", JSONArray())
            } catch (t: Throwable) {
                set { it.copy(scanning = false, scanText = "", error = t.message) }
            }
        }
    }

    /** SAF 选中的目录：拿不到真实路径时退回 content:// URI（后端会记 denied）。 */
    fun addFolder(path: String) {
        if (path.isBlank()) return
        scope.launch {
            try {
                Bridge.callObj("LibraryService.AddFolder", path)
                val folders = Bridge.callArray("LibraryService.Folders").objects().map(Folder::from)
                set { it.copy(folders = folders, scanning = true, scanText = "正在扫描…") }
            } catch (t: Throwable) {
                set { it.copy(error = t.message) }
            }
        }
    }

    fun removeFolder(id: String) {
        scope.launch {
            try {
                Bridge.call("LibraryService.RemoveFolder", id)
                val folders = Bridge.callArray("LibraryService.Folders").objects().map(Folder::from)
                val songs = Bridge.callArray("LibraryService.Songs").objects().map(Song::from)
                set { it.copy(folders = folders, songs = songs) }
            } catch (t: Throwable) {
                set { it.copy(error = t.message) }
            }
        }
    }

    /* ------------------------------------------------------------------ 歌单 */

    fun toggleLike(songId: String) {
        scope.launch {
            try {
                // 后端返回点赞后的新状态，直接本地更新，省一次全量拉取
                val liked = Bridge.call("LibraryService.ToggleLike", songId) as? Boolean ?: return@launch
                set {
                    val ids = it.likedIds.toMutableSet()
                    if (liked) ids.add(songId) else ids.remove(songId)
                    it.copy(likedIds = ids)
                }
            } catch (t: Throwable) {
                set { it.copy(error = t.message) }
            }
        }
    }

    /* ------------------------------------------------------------ 曲库隐藏 */

    /** 启动时把排除表读进 state（NativeActivity 在 Hidden.init 之后调一次）。 */
    fun syncHidden() = set { it.copy(hiddenIds = Hidden.value()) }

    /** 「从曲库移除」：只加入排除表，不碰文件。 */
    fun hideSong(songId: String) {
        Hidden.hide(songId)
        set { it.copy(hiddenIds = Hidden.value()) }
    }

    fun unhideSong(songId: String) {
        Hidden.unhide(songId)
        set { it.copy(hiddenIds = Hidden.value()) }
    }

    fun unhideAll() {
        Hidden.clear()
        set { it.copy(hiddenIds = Hidden.value()) }
    }

    fun createPlaylist(name: String, onDone: (String) -> Unit = {}) {
        if (name.isBlank()) return
        scope.launch {
            try {
                val pl = Bridge.callObj("PlaylistService.Create", name)
                refreshPlaylists()
                onDone(pl.str("id"))
            } catch (t: Throwable) {
                set { it.copy(error = t.message) }
            }
        }
    }

    fun renamePlaylist(id: String, name: String) {
        if (name.isBlank()) return
        scope.launch {
            runCatching { Bridge.call("PlaylistService.Rename", id, name) }
                .onFailure { set { st -> st.copy(error = it.message) } }
            refreshPlaylists()
        }
    }

    fun deletePlaylist(id: String) {
        scope.launch {
            runCatching { Bridge.call("PlaylistService.Delete", id) }
                .onFailure { set { st -> st.copy(error = it.message) } }
            refreshPlaylists()
            set { if ((it.section as? Section.InPlaylist)?.id == id) {
                Persist.sectionKey = Persist.keyOf(Section.AllSongs)
                it.copy(section = Section.AllSongs)
            } else it }
        }
    }

    fun addSongsToPlaylist(playlistId: String, songIds: List<String>) {
        if (songIds.isEmpty()) return
        scope.launch {
            try {
                Bridge.call("PlaylistService.AddSongs", playlistId, JSONArray(songIds))
                refreshPlaylists()
            } catch (t: Throwable) {
                set { it.copy(error = t.message) }
            }
        }
    }

    fun removeFromPlaylist(playlistId: String, songIds: List<String>) {
        if (songIds.isEmpty()) return
        scope.launch {
            try {
                Bridge.call("PlaylistService.RemoveSongs", playlistId, JSONArray(songIds))
                refreshPlaylists()
            } catch (t: Throwable) {
                set { it.copy(error = t.message) }
            }
        }
    }

    fun reorderPlaylist(id: String, from: Int, to: Int) {
        scope.launch {
            runCatching { Bridge.call("PlaylistService.Reorder", id, from, to) }
            refreshPlaylists()
        }
    }

    /* ------------------------------------------------------------------ 配置 */

    fun patchConfig(vararg pairs: Pair<String, Any?>) {
        val patch = JSONObject()
        pairs.forEach { (k, v) -> patch.put(k, v ?: JSONObject.NULL) }
        scope.launch {
            try {
                val cfg = Bridge.callObj("ConfigService.Set", patch)
                set { it.copy(config = AppConfig.from(cfg)) }
            } catch (t: Throwable) {
                set { it.copy(error = t.message) }
            }
        }
    }

    fun resetConfig() {
        scope.launch {
            runCatching { Bridge.callObj("ConfigService.Reset") }
            reloadAll()
        }
    }

    /* ------------------------------------------------------------------ 事件 */

    private fun onBackendEvent(name: String, data: JSONObject?) {
        when (name) {
            "scan:start" -> set { it.copy(scanning = true, scanText = "正在扫描…") }
            "scan:progress" -> {
                val phase = data?.str("phase") ?: ""
                val cur = data?.int("current") ?: 0
                val total = data?.int("total") ?: 0
                set {
                    it.copy(
                        scanning = true,
                        scanText = if (total > 0) "扫描中 $cur/$total" else phase.ifBlank { "扫描中…" },
                    )
                }
            }
            "scan:done" -> scope.launch {
                set { it.copy(scanning = false, scanText = "") }
                refreshSongs()
                val folders = Bridge.callArray("LibraryService.Folders").objects().map(Folder::from)
                set { it.copy(folders = folders) }
            }
            "scan:failed" -> set {
                it.copy(scanning = false, scanText = "", error = data?.str("message") ?: "扫描失败")
            }
            // 封面抓取完毕：只换封面地址，不重新拉整库
            "cover:changed" -> scope.launch { refreshSongs() }
            "player:error" -> set { it.copy(error = data?.str("message") ?: "播放失败") }
        }
    }

    /**
     * 在线曲目 id → 可直接播的地址（相对路径，形如 /online/audio?id=BV..&t=..）。
     *
     * 为什么不在 audioUrl 里统一走 MediaService.URL：安卓端 MediaService 的取歌
     * 函数只查本地曲库（Go 侧 z_host_assemble.go 里注入的就是 lib.SongByID），
     * 对 bili:xxx 一律回「歌曲不存在」，所以在线曲目必须用搜索结果里带的代理
     * 地址。这张表只在内存里：进程重启后在线曲目本来也不会留在队列里。
     */
    private val onlineStreams = java.util.concurrent.ConcurrentHashMap<String, String>()

    /** 记下这批在线曲目的播放地址（搜索成功后调用）。 */
    fun registerOnlineStreams(tracks: List<OnlineTrack>) {
        for (t in tracks) {
            if (t.streamUrl.isNotBlank()) onlineStreams[t.id] = t.streamUrl
        }
    }

    /** 播放地址（相对路径，拼 baseUrl 后给播放器）。 */
    suspend fun audioUrl(songId: String): String = withContext(Dispatchers.IO) {
        onlineStreams[songId]?.let { return@withContext abs(it) }
        val rel = Bridge.call("MediaService.URL", songId) as? String ?: ""
        if (rel.isBlank()) "" else abs(rel)
    }

    private fun abs(url: String): String = if (url.startsWith("http")) url else Bridge.baseUrl() + url
}
