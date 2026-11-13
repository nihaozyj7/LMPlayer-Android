package com.lmplayer.android

import androidx.activity.compose.BackHandler
import androidx.compose.animation.core.Animatable
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.gestures.Orientation
import androidx.compose.foundation.gestures.awaitEachGesture
import androidx.compose.foundation.gestures.awaitFirstDown
import androidx.compose.foundation.gestures.drag
import androidx.compose.foundation.gestures.draggable
import androidx.compose.foundation.gestures.rememberDraggableState
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.BoxWithConstraints
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.safeDrawing
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.layout.windowInsetsPadding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableFloatStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.asImageBitmap
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.input.pointer.PointerEventPass
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.input.pointer.positionChange
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import kotlinx.coroutines.launch

/** 全屏二级页面（互斥，覆盖在主页之上）。 */
private enum class Page { Home, Settings, Search }

/**
 * 应用根。
 *
 * 页面关系是「一层主页 + 若干全屏页 + 一个可跟手的播放详情层」：
 *   - 主页 = 顶部栏 + 列表 + 底部播放条
 *   - 设置/搜索是全屏页（不是弹层，小屏上弹出层永远不够用）
 *   - 播放详情是从底部整块滑上来的层，手指全程可打断
 */
@Composable
fun AppRoot(onPickFolder: () -> Unit) {
    // 主题要在最外层决定：配置里的 themeMode（跟随系统/深色/浅色）
    val st by Store.state.collectAsState()
    LmTheme(themeMode = st.config.themeMode) {
        AppRootContent(onPickFolder)
    }
}

@Composable
private fun AppRootContent(onPickFolder: () -> Unit) {
    val ready by Boot.ready.collectAsState()
    val bootError by Boot.error.collectAsState()
    val st by Store.state.collectAsState()
    val ps by Player.state.collectAsState()

    // 设置里的「动效速度」以前只写进配置、没有任何地方读它，所以三挡没区别。
    // 这里每次重组都把配置推给 Anim，改完设置立刻生效（不用重启）。
    Anim.apply(st.config)

    if (!ready) {
        Splash(bootError)
        return
    }

    var page by remember { mutableStateOf(Page.Home) }
    val drawer = remember { Animatable(0f) }        // 0 关，1 全开
    val p = remember { Animatable(0f) }             // 播放详情：0 收起，1 展开
    var showDownloads by remember { mutableStateOf(false) }
    // 底部播放条右侧的队列按钮（不在详情页里，所以需要自己的一份状态）
    var showQueue by remember { mutableStateOf(false) }
    val downloadsActive by Downloads.active.collectAsState()

    // 手势实时位移（px，向右/向下为正）。
    //
    // 关键：跟手期间绝不能对 Animatable 调 snapTo —— snapTo 是 suspend，
    // 每帧一个 launch 会让事件排队、丢失中间位移（实测滑 300px 只生效 117px，
    // 于是松手时进度远低于预期，表现就是「滑了却弹回去」）。
    // 这里用普通 Float state 同步累积，渲染时与 Animatable 的值合成。
    val dragY = remember { mutableFloatStateOf(0f) }
    // 左缘右滑打开抽屉的实时位移（px），与抽屉自身的关闭拖动共用同一套做法
    val edgeDrag = remember { mutableFloatStateOf(0f) }
    val scope = rememberCoroutineScope()

    BoxWithConstraints(
        Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background)
    ) {
        val maxW = maxWidth
        val maxH = maxHeight
        // 60% 屏宽，但不低于 260dp：再窄下去抽屉里的歌单名会被截成一两个字
        val drawerWidth = (maxW * 0.6f).coerceAtLeast(260.dp)
        val density = androidx.compose.ui.platform.LocalDensity.current.density
        // 手势距离换像素；详情页进度 = 动画值 + 当前手指位移（上滑为负，所以是减）
        val maxHpx = maxH.value * density
        val progress = (p.value - dragY.floatValue / maxHpx).coerceIn(0f, 1f)

        // 返回键的第一层：全屏页（搜索 / 设置）退回主页。
        //
        // 放在 `when(page)` 之前组合是有意的：OnBackPressedDispatcher 里
        // 「后注册的优先」，子页面自己注册的 BackHandler 会盖过这一条，于是
        // 「设置分区页 → 设置首页 → 主页 → 桌面」的逐层退出顺序自然成立。
        // 以前一条都没注册，所以任何界面按返回都直接 finish() 回桌面。
        BackHandler(enabled = page != Page.Home) { page = Page.Home }

        // 主页与全屏页放「安全区之内」的容器里；播放详情与抽屉要铺满整屏
        // （含状态栏/导航栏），放在它外面 —— 否则详情页从底部滑入时正好差一条
        // insets 的高度，收起态会在屏幕底部露出播放条的一角。
        Box(
            Modifier
                .fillMaxSize()
                .windowInsetsPadding(WindowInsets.safeDrawing)
        ) {
            when (page) {
                Page.Home -> Box(
                    Modifier
                        .fillMaxSize()
                        // 从屏幕左侧横向拖动打开抽屉。
                        //
                        // 为什么不从最边缘算起：Android 10+ 的手势导航把屏幕左右
                        // 那十几 dp 划给了「返回」，那一段的触摸根本到不了应用
                        // （模拟器上实测：从 x=6 起滑，系统直接执行返回退到了桌面）。
                        // 所以起点要求 x 在 24dp 之外，并且横向位移超过触摸阈值、
                        // 且横向大于纵向时才消费事件 —— 纵向滚动照旧交给列表。
                        .pointerInput(drawerWidth) {
                            val widthPx = drawerWidth.toPx()
                            // 系统手势导航的「返回」热区（左右各十几 dp）触摸根本
                            // 到不了应用：模拟器上从 x=6 起滑，系统直接执行了返回。
                            // 除了那一条之外**全屏都能起手**（原来限制在左侧 35%，
                            // 在右半边滑完全没反应）。
                            val minStart = 24.dp.toPx()
                            awaitEachGesture {
                                val down = awaitFirstDown(
                                    requireUnconsumed = false,
                                    pass = PointerEventPass.Initial,
                                )
                                if (down.position.x < minStart) {
                                    return@awaitEachGesture
                                }
                                var dx = 0f
                                var dy = 0f
                                var active = false
                                while (true) {
                                    val ev = awaitPointerEvent(PointerEventPass.Initial)
                                    val ch = ev.changes.firstOrNull { it.id == down.id } ?: break
                                    if (!ch.pressed) {
                                        // 手抬起的那一下也要吃掉。
                                        // 只在移动时 consume 不够：这次滑动一旦被判成
                                        // 「打开抽屉」，松手的 up 事件会继续传给下面的
                                        // 歌曲行，于是「想滑抽屉却切了歌」。
                                        if (active) ch.consume()
                                        break
                                    }
                                    val d = ch.positionChange()
                                    if (!active) {
                                        dx += d.x
                                        dy += d.y
                                        // 只认向右的横向滑动：向左滑是系统返回手势的
                                        // 方向，不属于抽屉，交给列表自己处理
                                        if (dx > viewConfiguration.touchSlop &&
                                            dx > kotlin.math.abs(dy)
                                        ) {
                                            active = true
                                            edgeDrag.floatValue = dx
                                            ch.consume()
                                        }
                                    } else {
                                        edgeDrag.floatValue =
                                            (edgeDrag.floatValue + d.x).coerceIn(0f, widthPx)
                                        ch.consume()
                                    }
                                }
                                if (active) {
                                    // 同一帧交接：先 snapTo 到当前位移再清零累积
                                    val shown = (edgeDrag.floatValue / widthPx).coerceIn(0f, 1f)
                                    val open = shown > 0.3f
                                    scope.launch(
                                        start = kotlinx.coroutines.CoroutineStart.UNDISPATCHED
                                    ) {
                                        drawer.snapTo(shown)
                                        edgeDrag.floatValue = 0f
                                        drawer.animateTo(
                                            if (open) 1f else 0f,
                                            tween(Anim.ms(220)),
                                        )
                                    }
                                }
                            }
                        }
                ) {
                    HomeScreen(
                        st = st,
                    ps = ps,
                    onMenu = {
                        scope.launch {
                            drawer.animateTo(1f, tween(Anim.ms(260)))
                        }
                    },
                    onSearch = { page = Page.Search },
                    onOpenSettings = { page = Page.Settings },
                    )
                }
                Page.Settings -> SettingsScreen(
                    config = st.config,
                    folders = st.folders,
                    onBack = { page = Page.Home },
                    onPickFolder = onPickFolder,
                    onReset = { Store.resetConfig() },
                )
                Page.Search -> SearchScreen(
                    songs = st.songs,
                    onBack = { page = Page.Home },
                    onPlayLocal = { s, queue -> Player.play(s, queue) },
                    onPickFolder = onPickFolder,
                )
            }

            // 底部播放条：不做「整屏被推上去」的位移——那会让播放条在屏幕中段拖出
            // 一条残影（典型观感是「底栏被顶飞」）。详情页是不透明面板，从底部滑起
            // 本身就把它盖住了，播放条只需要原地留驻、走一小段下沉并快速淡出。
            if (pgLessThanOne(progress)) {
                MiniBar(
                    state = ps,
                    modifier = Modifier
                        .align(Alignment.BottomCenter)
                        .graphicsLayer {
                            val e = progress
                            translationY = e * 18.dp.toPx()               // 轻微下沉，跟面板同向
                            val k = (1f - e / 0.4f).coerceIn(0f, 1f)      // 40% 行程内淡完
                            alpha = k
                            scaleX = 0.98f + 0.02f * k
                            scaleY = 0.98f + 0.02f * k
                        },
                    onOpen = {
                        // 没有在播歌曲时点底栏不该展开一个空详情页
                        if (ps.song != null) {
                            scope.launch { p.animateTo(1f, tween(Anim.ms(320))) }
                        }
                    },
                    onToggle = { Player.toggle() },
                    onQueue = { showQueue = true },
                    // 跟手只改 dragY，不碰 Animatable —— 零协程、零丢帧。
                    // 没有在播歌曲时不累积：点底栏已经挡过这条，手势这条路原先是漏的，
                    // 结果能滑出一个空的「未在播放」详情页。
                    onSwipe = { delta -> if (ps.song != null) dragY.floatValue += delta },
                    onSwipeEnd = { velocity ->
                        val target = (p.value - dragY.floatValue / maxHpx).coerceIn(0f, 1f)
                        // 位移 3% 就够，或者向上快甩（velocity 为负）直接展开。
                        // 原来要求滑过 22% 才展开，配合跟手滞后就是「总回弹」。
                        val open = velocity < -Swipe.fling || target > Swipe.expandAt
                        // UNDISPATCHED：同步把 p 落到当前手势位置、再清零 dragY，
                        // 同一帧内完成交接，视觉上不会跳一下。
                        scope.launch(start = kotlinx.coroutines.CoroutineStart.UNDISPATCHED) {
                            p.snapTo(target)
                            dragY.floatValue = 0f
                            p.animateTo(if (open) 1f else 0f, tween(Anim.ms(240)))
                        }
                    },
                )
            }
        }

        // 播放详情：整块从底部滑上来，手势与动画共用同一套进度
        if (progress > 0.001f || ps.song != null) {
            // 详情页展开时，返回键先收起详情，而不是退出 App
            BackHandler(enabled = p.value > 0.5f) {
                scope.launch { p.animateTo(0f, tween(Anim.ms(260))) }
            }
            PlayerScreen(
                progress = progress,
                state = ps,
                maxHeight = maxH,
                onDrag = { delta -> dragY.floatValue += delta },
                onDragEnd = { velocity ->
                    val target = (p.value - dragY.floatValue / maxHpx).coerceIn(0f, 1f)
                    // velocity > 0 是向下甩（收起方向）
                    val close = velocity > Swipe.fling || target < 1f - Swipe.collapseAt
                    scope.launch(start = kotlinx.coroutines.CoroutineStart.UNDISPATCHED) {
                        p.snapTo(target)
                        dragY.floatValue = 0f
                        p.animateTo(
                            if (close) 0f else 1f,
                            tween(Anim.ms(260)),
                        )
                    }
                },
                onCollapse = {
                    scope.launch { p.animateTo(0f, tween(Anim.ms(260))) }
                },
            )
        }

        // 侧栏抽屉
        DrawerLayer(
            drawer = drawer,
            width = drawerWidth,
            extraDragPx = edgeDrag.floatValue,
            downloadsActive = downloadsActive,
            section = st.section,
            playlists = st.playlists,
            onSelect = { sec ->
                Store.selectSection(sec)
                scope.launch { drawer.animateTo(0f, tween(Anim.ms(220))) }
            },
            onOpenDownloads = {
                scope.launch { drawer.animateTo(0f, tween(Anim.ms(180))) }
                showDownloads = true
            },
            onOpenSettings = {
                scope.launch { drawer.animateTo(0f, tween(Anim.ms(180))) }
                page = Page.Settings
            },
            // 主题切换：深色 ↔ 浅色（「跟随系统」仍然在设置里选）。
            // 抽屉只做高频的两个方向，三态循环在这里反而容易点错。
            onToggleTheme = {
                Store.patchConfig("themeMode" to if (st.config.themeMode == "light") "dark" else "light")
            },
            onCreatePlaylist = { name -> Store.createPlaylist(name) },
            onRenamePlaylist = { id, name -> Store.renamePlaylist(id, name) },
            onDeletePlaylist = { id -> Store.deletePlaylist(id) },
            onClose = { scope.launch { drawer.animateTo(0f, tween(Anim.ms(200))) } },
        )

        // 封面匹配面板（详情页「更多」、歌曲菜单、曲库页都能打开）
        CoverSheetHost()

        // 播放队列面板（底部播放条的队列按钮）
        if (showQueue) {
            QueueSheet(ps) { showQueue = false }
        }

        // 下载队列面板（从抽屉进）
        if (showDownloads) {
            DownloadsSheet { showDownloads = false }
        }

        // 错误提示条：一条足矣，不做弹窗
        st.error?.let { msg ->
            ErrorBar(msg) { Store.clearError() }
        }
    }
}

private fun pgLessThanOne(p: Float) = p < 0.999f

@Composable
private fun Splash(error: String?) {
    Box(
        Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background),
        contentAlignment = Alignment.Center
    ) {
        Column(horizontalAlignment = Alignment.CenterHorizontally) {
            if (error == null) {
                CircularProgressIndicator(color = Lm.cur.accent, strokeWidth = 2.5.dp)
                Spacer(Modifier.height(18.dp))
                Text("正在启动曲库…", color = Lm.cur.textSecondary)
            } else {
                Text("启动失败", color = Lm.cur.danger, fontWeight = FontWeight.SemiBold)
                Spacer(Modifier.height(8.dp))
                Text(error, color = Lm.cur.textSecondary, fontSize = 13.sp)
            }
        }
    }
}

/* ==================================================================== 主页 */

@Composable
private fun HomeScreen(
    st: UiState,
    ps: PlayerState,
    onMenu: () -> Unit,
    onSearch: () -> Unit,
    onOpenSettings: () -> Unit,
) {
    Column(
        Modifier
            .fillMaxSize()
            .padding(bottom = Dimens.miniBar)
    ) {
        TopBar(title = st.section.title, onMenu = onMenu, onSearch = onSearch)
        val pl = (st.section as? Section.InPlaylist)
            ?.let { s -> st.playlists.firstOrNull { it.id == s.id } }
        if (pl != null) {
            // 歌单页有自己的头部（封面拼贴 + 名称信息 + 操作），不再放「排序 + 重扫」
            // 那条工具条：歌单顺序是用户自己排的，被排序字段改写了就失去意义。
            PlaylistHeader(st, pl)
        } else {
            ListHeader(st)
        }
        if (st.loading) {
            Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                CircularProgressIndicator(color = Lm.cur.accent, strokeWidth = 2.dp)
            }
        } else {
            val songs = st.visibleSongs
            LazyColumn(Modifier.fillMaxSize()) {
                items(songs, key = { it.id }) { song ->
                    SongRow(
                        song = song,
                        playing = ps.song?.id == song.id,
                        isPlaying = ps.song?.id == song.id && ps.playing,
                        liked = song.id in st.likedIds,
                        onPlay = { Player.playClicked(song, songs) },
                        onLike = { Store.toggleLike(song.id) },
                        onAddToPlaylist = { pl -> Store.addSongsToPlaylist(pl, listOf(song.id)) },
                        playlists = st.playlists,
                        playlistId = (st.section as? Section.InPlaylist)?.id,
                        onRemoveFromPlaylist = { plId -> Store.removeFromPlaylist(plId, listOf(song.id)) },
                        onSettings = onOpenSettings,
                        onHide = { Store.hideSong(song.id) },
                    )
                }
                item {
                    Spacer(Modifier.height(12.dp))
                    Text(
                        when {
                            st.scanning -> st.scanText
                            songs.isEmpty() && st.section is Section.InPlaylist -> "这个歌单还是空的 —— 点上面的「⋮」→「添加歌曲」"
                            songs.isEmpty() -> "这里还没有歌曲 —— 从左上角菜单进入设置添加文件夹"
                            else -> "共 ${songs.size} 首"
                        },
                        color = Lm.cur.textTertiary,
                        fontSize = 12.5.sp,
                        modifier = Modifier.padding(horizontal = 16.dp, vertical = 10.dp),
                    )
                    Spacer(Modifier.height(20.dp))
                }
            }
        }
    }
}

@Composable
private fun TopBar(title: String, onMenu: () -> Unit, onSearch: () -> Unit) {
    Row(
        Modifier
            .fillMaxWidth()
            .height(Dimens.topBar)
            .padding(horizontal = Dimens.xs),
        verticalAlignment = Alignment.CenterVertically
    ) {
        IconButtonBox(onMenu) { LmIcon(Icon.Menu, Dimens.iconL, Lm.cur.textPrimary) }
        Text(
            title,
            modifier = Modifier
                .weight(1f)
                .padding(horizontal = Dimens.s),
            color = Lm.cur.textPrimary,
            style = LmText.topBarTitle,
            maxLines = 1,
            overflow = TextOverflow.Ellipsis,
        )
        IconButtonBox(onSearch) { LmIcon(Icon.Search, Dimens.iconL, Lm.cur.textPrimary) }
    }
}

@Composable
fun IconButtonBox(
    onClick: () -> Unit,
    size: Int = 44,
    background: Color? = null,
    content: @Composable () -> Unit
) {
    Box(
        Modifier
            .size(size.dp)
            .clip(CircleShape)
            .let { if (background != null) it.background(background) else it }
            .clickable(onClick = onClick),
        contentAlignment = Alignment.Center
    ) { content() }
}

/**
 * 列表工具条：左侧「随机播放 + 当前曲目数」，右侧「排序 + 重扫」。
 * 不放分割线 —— 靠 44dp 的条高和上下留白把它和列表分开就够了。
 */
@Composable
private fun ListHeader(st: UiState) {
    Row(
        Modifier
            .fillMaxWidth()
            .height(Dimens.toolbar)
            .padding(start = Dimens.m, end = Dimens.xs),
        verticalAlignment = Alignment.CenterVertically
    ) {
        IconButtonBox(
            { Player.play(st.visibleSongs.firstOrNull() ?: return@IconButtonBox, st.visibleSongs) },
            40,
        ) { LmIcon(Icon.Shuffle, Dimens.iconM, Lm.cur.textSecondary) }

        Text(
            "${st.visibleSongs.size}",
            color = Lm.cur.textSecondary,
            style = LmText.rowTitle,
            modifier = Modifier.padding(start = Dimens.xs),
        )

        Spacer(Modifier.weight(1f))

        Row(
            Modifier
                .height(36.dp)
                .clip(Radii.small)
                .clickable { nextSort(st.sort) }
                .padding(horizontal = Dimens.s),
            verticalAlignment = Alignment.CenterVertically
        ) {
            LmIcon(Icon.Sort, Dimens.iconS, Lm.cur.textSecondary)
            Spacer(Modifier.width(Dimens.xs + 2.dp))
            Text(
                st.sort.label,
                color = Lm.cur.textSecondary,
                style = LmText.caption,
                maxLines = 1,
            )
            Text(
                if (st.sortAsc) " ↑" else " ↓",
                color = Lm.cur.textTertiary,
                style = LmText.caption,
            )
        }

        IconButtonBox({ Store.rescan() }, 40) {
            LmIcon(Icon.Refresh, Dimens.iconM, Lm.cur.textSecondary)
        }
    }
}

private fun nextSort(cur: SortKey) {
    val all = SortKey.entries
    Store.setSort(all[(all.indexOf(cur) + 1) % all.size])
}

/* ================================================================== 歌曲行 */

/** 列表副标题：「歌手 · 时长」。之前时长单独占一列，把右边挤得很局促。 */
private fun songSubtitle(song: Song): String {
    val parts = ArrayList<String>(2)
    if (song.displayArtist.isNotBlank()) parts.add(song.displayArtist)
    val dur = formatDuration(song.durationMs)
    if (dur.isNotBlank()) parts.add(dur)
    return if (parts.isEmpty()) "未知歌曲" else parts.joinToString(" · ")
}

@Composable
private fun SongRow(
    song: Song,
    playing: Boolean,
    isPlaying: Boolean,
    liked: Boolean,
    playlists: List<Playlist>,
    playlistId: String?,
    onPlay: () -> Unit,
    onLike: () -> Unit,
    onAddToPlaylist: (String) -> Unit,
    onRemoveFromPlaylist: (String) -> Unit,
    onSettings: () -> Unit,
    onHide: () -> Unit,
) {
    var sheet by remember { mutableStateOf(false) }
    Row(
        Modifier
            .fillMaxWidth()
            .height(Dimens.row)
            .clickable(onClick = onPlay)
            .padding(start = Dimens.l, end = Dimens.xs),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Cover(Covers.imageFor(song), Dimens.coverRow, Radii.cover, playing)
        Spacer(Modifier.width(Dimens.m))
        Column(Modifier.weight(1f), verticalArrangement = Arrangement.Center) {
            Text(
                song.displayTitle,
                color = if (playing) Lm.cur.accent else Lm.cur.textPrimary,
                style = LmText.rowTitle,
                fontWeight = if (playing) FontWeight.SemiBold else FontWeight.Medium,
                maxLines = 1,
                overflow = TextOverflow.Ellipsis,
            )
            Spacer(Modifier.height(Dimens.lineGap))
            Text(
                songSubtitle(song),
                color = Lm.cur.textTertiary,
                style = LmText.rowSub,
                maxLines = 1,
                overflow = TextOverflow.Ellipsis,
            )
        }
        // 直接在行尾给个心形：收藏一首歌不应该还要先点开菜单
        IconButtonBox(onClick = onLike, size = 36) {
            LmIcon(
                if (liked) Icon.HeartFilled else Icon.Heart,
                Dimens.iconS,
                if (liked) Lm.cur.accent else Lm.cur.textTertiary,
            )
        }
        Box {
            IconButtonBox({ sheet = true }, 36) {
                LmIcon(Icon.More, Dimens.iconS, Lm.cur.textTertiary)
            }
            if (sheet) {
                SongActionSheet(
                    song = song,
                    liked = liked,
                    isPlaying = isPlaying,
                    playlists = playlists,
                    inPlaylistId = playlistId,
                    onDismiss = { sheet = false },
                    onToggleLike = { onLike(); sheet = false },
                    onAdd = { pl -> onAddToPlaylist(pl); sheet = false },
                    onRemove = { pl -> onRemoveFromPlaylist(pl); sheet = false },
                    onSettings = { sheet = false; onSettings() },
                    onHide = { onHide(); sheet = false },
                )
            }
        }
    }
}

/** 单曲操作：底部可拖面板（移动端标准做法，比上下文菜单好点得多）。 */
@Composable
private fun SongActionSheet(
    song: Song,
    liked: Boolean,
    isPlaying: Boolean,
    playlists: List<Playlist>,
    inPlaylistId: String?,
    onDismiss: () -> Unit,
    onToggleLike: () -> Unit,
    onAdd: (String) -> Unit,
    onRemove: (String) -> Unit,
    onSettings: () -> Unit,
    onHide: () -> Unit,
) {
    Sheet(onDismiss = onDismiss) { _ ->
        var picking by remember { mutableStateOf(false) }
        Column(Modifier.padding(bottom = 12.dp)) {
            Text(
                song.displayTitle,
                color = Lm.cur.textPrimary,
                fontWeight = FontWeight.SemiBold,
                fontSize = 16.sp,
                maxLines = 1,
                overflow = TextOverflow.Ellipsis,
                modifier = Modifier.padding(horizontal = 16.dp, vertical = 6.dp),
            )
            Text(
                song.displayArtist + if (song.ext.isNotBlank()) " · .${song.ext}" else "",
                color = Lm.cur.textTertiary,
                fontSize = 12.5.sp,
                modifier = Modifier.padding(horizontal = 16.dp),
            )
            Spacer(Modifier.height(10.dp))
            SheetRow(if (liked) "取消喜欢" else "加入我喜欢", if (liked) Icon.HeartFilled else Icon.Heart) {
                onToggleLike()
            }
            if (inPlaylistId != null) {
                SheetRow("从这个歌单移除", Icon.Trash) { onRemove(inPlaylistId) }
            }
            // 原来是把每个自建歌单直接铺成一行：没有自建歌单时
            // 这里空的（用户只会看到「加入我喜欢」），歌单一多又会把面板撑爆。
            // 所以收成一个入口，点开才列表，并且总有「新建并加入」。
            if (!picking) {
                SheetRow("添加到歌单", Icon.Add) { picking = true }
            } else {
                val targets = playlists.filter { !it.locked && !it.builtin }
                Text(
                    "添加到歌单",
                    color = Lm.cur.textTertiary,
                    fontSize = 12.sp,
                    modifier = Modifier.padding(start = 16.dp, top = 2.dp, bottom = 2.dp),
                )
                LazyColumn(Modifier.height((52 * (targets.size + 1).coerceAtMost(5)).dp)) {
                    items(targets, key = { it.id }) { pl ->
                        SheetRow(pl.name, Icon.Lyrics) { onAdd(pl.id) }
                    }
                    item(key = "new") {
                        SheetRow("新建歌单并加入", Icon.Add) {
                            Store.createPlaylist("新歌单") { id -> onAdd(id) }
                        }
                    }
                }
            }
            // 换封面必须能从列表直接进：自动匹配命中不了的时候（B 站视频标题、
            // 同名不同版本），用户只能自己搜关键词挑一张，藏到设置页里等于没有。
            SheetRow("更换封面", Icon.Image) {
                onDismiss()
                CoverPanel.openFromSheet(song)
            }
            SheetRow("播放设置", Icon.Settings) { onSettings() }
            // 只从列表里移除（加入排除表），不动磁盘文件：
            // 移动端的误触率远高于桌面，删除必须可撤销。
            SheetRow("从曲库移除（不删文件）", Icon.Off) { onHide() }
        }
    }
}

@Composable
fun SheetRow(label: String, icon: Icon, onClick: () -> Unit) {
    Row(
        Modifier
            .fillMaxWidth()
            .height(52.dp)
            .clickable(onClick = onClick)
            .padding(horizontal = 16.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        LmIcon(icon, 20.dp, Lm.cur.textSecondary)
        Spacer(Modifier.width(16.dp))
        Text(label, color = Lm.cur.textPrimary, fontSize = 16.sp, maxLines = 1)
    }
}

/* ================================================================ 封面组件 */

@Composable
fun Cover(url: String?, size: androidx.compose.ui.unit.Dp, shape: androidx.compose.ui.graphics.Shape, active: Boolean = false) {
    val bmp = rememberCover(url)
    // 切歌换封面：旧图会一直留到新图解好（见 rememberCover），但「同一帧直接
    // 换一张」还是太生硬，这里补一个短淡入 —— 新封面从半透明淡到位。
    val fade = remember { androidx.compose.animation.core.Animatable(1f) }
    androidx.compose.runtime.LaunchedEffect(bmp) {
        if (bmp != null) {
            fade.snapTo(0.35f)
            fade.animateTo(1f, tween(Anim.ms(240)))
        }
    }
    Box(
        Modifier
            .size(size)
            .clip(shape)
            .background(
                if (bmp == null) Brush.linearGradient(listOf(Lm.cur.bgRaised, Lm.cur.accentSoft))
                else Brush.linearGradient(listOf(Color.Transparent, Color.Transparent))
            ),
        contentAlignment = Alignment.Center
    ) {
        if (bmp != null) {
            androidx.compose.foundation.Image(
                bitmap = bmp.asImageBitmap(),
                contentDescription = null,
                modifier = Modifier
                    .fillMaxSize()
                    .graphicsLayer { alpha = fade.value },
                contentScale = androidx.compose.ui.layout.ContentScale.Crop,
            )
        } else {
            LmIcon(Icon.Lyrics, size * 0.34f, if (active) Lm.cur.accent else Lm.cur.textTertiary)
        }
    }
}

/* =============================================================== 底部播放条 */

@Composable
private fun MiniBar(
    state: PlayerState,
    modifier: Modifier = Modifier,
    onOpen: () -> Unit,
    onToggle: () -> Unit,
    onQueue: () -> Unit,
    onSwipe: (Float) -> Unit = {},
    onSwipeEnd: (Float) -> Unit = {},
) {
    val song = state.song
    Surface(
        modifier = modifier
            .fillMaxWidth()
            .height(Dimens.miniBar)
            // 上滑展开详情：手势直接驱动 p，不用等动画结束。
            // 用 draggable 而不是 detectVerticalDragGestures，是因为只有它会把
            // 离手速度交出来 —— 快速轻甩（没滑多远）也能判定为「要展开」，
            // 这正是原先「滑了却弹回去」的主要来源。
            .draggable(
                orientation = Orientation.Vertical,
                state = rememberDraggableState { delta -> onSwipe(delta) },
                onDragStopped = { velocity -> onSwipeEnd(velocity) },
            ),
        color = Lm.cur.bgElevated.copy(alpha = 0.96f),
    ) {
        Column {
            // 顶部一条细进度：不用占地方也能看到播到哪了
            val frac = if (state.durationMs > 0) {
                (state.positionMs.toFloat() / state.durationMs).coerceIn(0f, 1f)
            } else 0f
            Box(
                Modifier
                    .fillMaxWidth()
                    .height(2.dp)
                    .background(Lm.cur.divider)
            ) {
                Box(
                    Modifier
                        .fillMaxWidth(frac)
                        .height(2.dp)
                        .background(Lm.cur.accent)
                )
            }
            Row(
                Modifier
                    .fillMaxSize()
                    .padding(start = Dimens.m, end = Dimens.xs),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(
                    Modifier
                        .weight(1f)
                        .fillMaxHeight()
                        .clickable(onClick = onOpen),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Cover(song?.let { Covers.imageFor(it) }, Dimens.coverMini, Radii.cover, state.playing)
                    Spacer(Modifier.width(Dimens.m))
                    Column(Modifier.weight(1f)) {
                        Text(
                            song?.displayTitle ?: "未在播放",
                            color = Lm.cur.textPrimary,
                            fontSize = 16.sp,
                            lineHeight = 20.sp,
                            fontWeight = FontWeight.Medium,
                            maxLines = 1,
                            overflow = TextOverflow.Ellipsis,
                        )
                        Text(
                            if (state.buffering) "缓冲中…" else song?.displayArtist ?: "选一首歌开始",
                            color = Lm.cur.textTertiary,
                            fontSize = 12.5.sp,
                            lineHeight = 16.sp,
                            maxLines = 1,
                            overflow = TextOverflow.Ellipsis,
                        )
                    }
                }
                IconButtonBox(onToggle, 44) {
                    LmIcon(if (state.playing) Icon.Pause else Icon.Play, Dimens.iconM, Lm.cur.textPrimary)
                }
                // 这里是「播放队列」，和展开详情页是两件事：
                // 绑 onOpen 会让用户点队列图标却弹出整页详情（且底部条被盖住）。
                IconButtonBox(onQueue, 44) {
                    LmIcon(Icon.Queue, Dimens.iconS + 2.dp, Lm.cur.textSecondary)
                }
            }
        }
    }
}

/* ==================================================================== 抽屉 */

@Composable
private fun DrawerLayer(
    drawer: Animatable<Float, *>,
    width: androidx.compose.ui.unit.Dp,
    /** 来自「左缘右滑」的外部位移（px）：抽屉自己没开时也要能跟着外部拖动出现。 */
    extraDragPx: Float = 0f,
    downloadsActive: Int = 0,
    section: Section,
    playlists: List<Playlist>,
    onSelect: (Section) -> Unit,
    onOpenDownloads: () -> Unit,
    onOpenSettings: () -> Unit,
    onToggleTheme: () -> Unit,
    onCreatePlaylist: (String) -> Unit,
    onRenamePlaylist: (String, String) -> Unit,
    onDeletePlaylist: (String) -> Unit,
    onClose: () -> Unit,
) {
    val v = drawer.value
    // 动画值为 0 且没有外部拖动时才完全不上屏。少了后半个条件，左缘右滑的
    // 那一段抽屉根本不会出现（表现为「拖了没反应」）。
    if (v <= 0.001f && extraDragPx <= 0.5f) return
    val scope = rememberCoroutineScope()
    val widthPx = with(androidx.compose.ui.platform.LocalDensity.current) { width.toPx() }
    // 跟手位移同样走同步 Float state（见 AppRoot 里 dragY 的说明）
    var dragDx by remember { mutableFloatStateOf(0f) }
    val shown = (v + (dragDx + extraDragPx) / widthPx).coerceIn(0f, 1f)
    // 抽屉开着时，返回键先收抽屉（它是屏幕上最上层的东西）
    BackHandler(enabled = shown > 0.5f) { onClose() }
    Box(Modifier.fillMaxSize()) {
        // 遮罩：点一下收起。挂在最外层 Box 内，层级自然在内容之上。
        Box(
            Modifier
                .fillMaxSize()
                .graphicsLayer { alpha = shown }
                .background(Color.Black.copy(alpha = 0.5f))
                .clickable(onClick = onClose)
        )
        Box(
            Modifier
                .fillMaxHeight()
                .width(width)
                .graphicsLayer { translationX = (-width.toPx()) + width.toPx() * shown }
                .background(Lm.cur.bgElevated)
                .draggable(
                    orientation = Orientation.Horizontal,
                    state = rememberDraggableState { delta -> dragDx += delta },
                    onDragStopped = { velocity ->
                        // 向左快甩直接关；位移回到 92% 以下就关。
                        // 原来要在 55% 以下才关，等于拖 45% 屏宽才生效。
                        val target = (drawer.value + dragDx / widthPx).coerceIn(0f, 1f)
                        val stay = target > 1f - Swipe.collapseAt && velocity > -Swipe.fling
                        scope.launch(start = kotlinx.coroutines.CoroutineStart.UNDISPATCHED) {
                            drawer.snapTo(target)
                            dragDx = 0f
                            drawer.animateTo(if (stay) 1f else 0f, tween(Anim.ms(180)))
                        }
                    },
                )
        ) {
            DrawerContent(
                section = section,
                playlists = playlists,
                downloadsActive = downloadsActive,
                onSelect = onSelect,
                onOpenDownloads = onOpenDownloads,
                onOpenSettings = onOpenSettings,
                onToggleTheme = onToggleTheme,
                onCreatePlaylist = onCreatePlaylist,
                onRenamePlaylist = onRenamePlaylist,
                onDeletePlaylist = onDeletePlaylist,
            )
        }
    }
}

@Composable
private fun DrawerContent(
    section: Section,
    playlists: List<Playlist>,
    downloadsActive: Int,
    onSelect: (Section) -> Unit,
    onOpenDownloads: () -> Unit,
    onOpenSettings: () -> Unit,
    onToggleTheme: () -> Unit,
    onCreatePlaylist: (String) -> Unit,
    onRenamePlaylist: (String, String) -> Unit,
    onDeletePlaylist: (String) -> Unit,
) {
    // 命名对话框：null=关闭；""=新建；其余=重命名该 id
    var naming by remember { mutableStateOf<String?>(null) }
    var draft by remember { mutableStateOf("") }
    Column(
        Modifier
            .fillMaxSize()
            .statusBarsPadding()
            .navigationBarsPadding()
    ) {
        Spacer(Modifier.height(22.dp))
        // 标题行右侧放「主题切换 + 设置」：抽屉底部那一整行设置项因此去掉，
        // 列表能多放一行歌单，两个最高频的开关也不用滑到底。
        Row(
            Modifier
                .fillMaxWidth()
                .padding(start = 16.dp, end = 8.dp),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            Column(Modifier.weight(1f)) {
                Text(
                    "LMPlayer",
                    color = Lm.cur.textPrimary,
                    fontSize = 20.sp,
                    fontWeight = FontWeight.Bold,
                )
                Text(
                    "本地音乐播放器",
                    color = Lm.cur.textTertiary,
                    fontSize = 12.sp,
                    modifier = Modifier.padding(top = 2.dp),
                )
            }
            // 44dp 圆底 + 22dp 图标：原来 36dp/18dp 在 60% 宽的抽屉里偏小，
            // 也看不出是按钮。加一层 bgRaised 圆底后就一眼可点。
            IconButtonBox(onToggleTheme, 44, Lm.cur.bgRaised) {
                LmIcon(Icon.Theme, 22.dp, Lm.cur.textPrimary)
            }
            Spacer(Modifier.width(6.dp))
            IconButtonBox(onOpenSettings, 44, Lm.cur.bgRaised) {
                LmIcon(Icon.Settings, 22.dp, Lm.cur.textPrimary)
            }
        }
        Spacer(Modifier.height(16.dp))

        DrawerItem("全部歌曲", Icon.Queue, section is Section.AllSongs) { onSelect(Section.AllSongs) }
        DrawerItem("我喜欢", Icon.Heart, section is Section.Liked) { onSelect(Section.Liked) }
        DrawerItem(
            name = "下载队列",
            icon = Icon.Download,
            active = false,
            trailing = { DownloadBadge(downloadsActive) },
        ) { onOpenDownloads() }

        Spacer(Modifier.height(14.dp))
        Row(
            Modifier
                .fillMaxWidth()
                .padding(start = 16.dp, end = 12.dp, bottom = 6.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text("歌单", color = Lm.cur.textTertiary, fontSize = 12.sp)
            Spacer(Modifier.weight(1f))
            IconButtonBox({
                draft = "新歌单"
                naming = ""
            }, 34) {
                LmIcon(Icon.Add, 16.dp, Lm.cur.textTertiary)
            }
        }
        LazyColumn(Modifier.weight(1f)) {
            items(playlists.filter { !it.builtin || !it.locked }, key = { it.id }) { pl ->
                DrawerItem(
                    name = pl.name,
                    icon = Icon.Lyrics,
                    active = (section as? Section.InPlaylist)?.id == pl.id,
                    // 编辑 / 删除搬进歌单详情页的「⋮」：抽屉里每个歌单后面挂
                    // 两个小图标，一是把 60% 宽的抽屉挤得更窄（歌单名被压短），
                    // 二是删除这种不可撤销的操作不该贴着「打开歌单」的手感。
                    trailing = { LmIcon(Icon.Chevron, 15.dp, Lm.cur.textTertiary) },
                ) { onSelect(Section.InPlaylist(pl.id, pl.name)) }
            }
        }
        Spacer(Modifier.height(10.dp))
    }

    val target = naming
    if (target != null) {
        val editing = target.isNotEmpty()
        AlertDialog(
            onDismissRequest = { naming = null },
            containerColor = Lm.cur.bgElevated,
            title = {
                Text(
                    if (editing) "重命名歌单" else "新建歌单",
                    color = Lm.cur.textPrimary,
                    style = LmText.rowTitle,
                    fontWeight = FontWeight.SemiBold,
                )
            },
            text = {
                OutlinedTextField(
                    value = draft,
                    onValueChange = { draft = it },
                    singleLine = true,
                    placeholder = { Text("歌单名称", color = Lm.cur.textTertiary, fontSize = 15.sp) },
                    textStyle = androidx.compose.ui.text.TextStyle(
                        color = Lm.cur.textPrimary,
                        fontSize = 15.sp,
                    ),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedBorderColor = Lm.cur.accent,
                        unfocusedBorderColor = Lm.cur.divider,
                        cursorColor = Lm.cur.accent,
                    ),
                )
            },
            confirmButton = {
                TextButton(onClick = {
                    val name = draft.trim()
                    if (name.isNotEmpty()) {
                        if (editing) onRenamePlaylist(target, name) else onCreatePlaylist(name)
                    }
                    naming = null
                }) { Text("确定", color = Lm.cur.accent) }
            },
            dismissButton = {
                TextButton(onClick = { naming = null }) {
                    Text("取消", color = Lm.cur.textSecondary)
                }
            },
        )
    }
}

@Composable
private fun DrawerItem(
    name: String,
    icon: Icon,
    active: Boolean,
    trailing: (@Composable () -> Unit)? = null,
    onClick: () -> Unit,
) {
    Row(
        Modifier
            .fillMaxWidth()
            .height(48.dp)
            .background(if (active) Lm.cur.accentSoft.copy(alpha = 0.45f) else Color.Transparent)
            .clickable(onClick = onClick)
            .padding(start = 16.dp, end = 8.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        LmIcon(icon, 19.dp, if (active) Lm.cur.accent else Lm.cur.textSecondary)
        Spacer(Modifier.width(14.dp))
        Text(
            name,
            color = if (active) Lm.cur.textPrimary else Lm.cur.textSecondary,
            fontSize = 16.sp,
            fontWeight = if (active) FontWeight.SemiBold else FontWeight.Normal,
            maxLines = 1,
            overflow = TextOverflow.Ellipsis,
            modifier = Modifier.weight(1f),
        )
        trailing?.invoke()
    }
}

/* ================================================================== 错误条 */

@Composable
private fun ErrorBar(msg: String, onDismiss: () -> Unit) {
    Box(
        Modifier
            .fillMaxSize()
            .padding(bottom = 78.dp),
        contentAlignment = Alignment.BottomCenter
    ) {
        Surface(
            color = Lm.cur.danger.copy(alpha = 0.92f),
            shape = RoundedCornerShape(10.dp),
            modifier = Modifier
                .padding(horizontal = 16.dp)
                .clickable(onClick = onDismiss)
        ) {
            Text(
                msg,
                color = Color.White,
                fontSize = 12.5.sp,
                modifier = Modifier.padding(horizontal = 14.dp, vertical = 10.dp),
            )
        }
    }
}
