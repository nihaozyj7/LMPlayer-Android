package com.lmplayer.android

import androidx.compose.animation.core.animate
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.gestures.Orientation
import androidx.compose.foundation.gestures.draggable
import androidx.compose.foundation.gestures.rememberDraggableState
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.BoxWithConstraints
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.itemsIndexed
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Slider
import androidx.compose.material3.SliderDefaults
import androidx.compose.material3.Text
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
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import kotlinx.coroutines.launch

/**
 * 播放详情页。
 *
 * 转场只有一个自由度 p（0=收起成播放条，1=完全展开），所以：
 *   - 自动动画和手指拖动写的是同一个 p，任何阶段都能接管、不会「闪现」；
 *   - 面板整体只做 translateY（合成层动画，主线程卡住也照样跟手）；
 *   - 封面/文字的细节过渡由 p 派生，不存在第二条时间轴，所以不会叠加成
 *     「一个动作好几种动画一起跑」。
 */
@Composable
fun PlayerScreen(
    progress: Float,
    state: PlayerState,
    maxHeight: Dp,
    onDrag: (Float) -> Unit = {},
    onDragEnd: (Float) -> Unit = {},
    onCollapse: () -> Unit = {},
) {
    val scope = rememberCoroutineScope()
    var showQueue by remember { mutableStateOf(false) }
    var showSleep by remember { mutableStateOf(false) }
    var showLyrics by remember { mutableStateOf(false) }
    var showEffect by remember { mutableStateOf(false) }
    var showMore by remember { mutableStateOf(false) }
    var seekPreviewFrac by remember { mutableStateOf<Float?>(null) }

    val ui by Store.state.collectAsState()
    val liked = state.song?.id?.let { it in ui.likedIds } == true

    // 封面下方的滚动歌词。
    // 加载顺序与歌词面板完全一致（缓存/内嵌/同名 .lrc → 在线自动匹配），
    // 只是这里要「怎么切歌都不用等网络」：进程内还有一层 memo。
    val songId = state.song?.id
    var lyricsRes by remember(songId) { mutableStateOf<LyricsResult?>(null) }
    val lyricsVersion = Lyrics.contentVersion          // 手动匹配后自增，触发重载
    val lyricOffset = remember(songId, Lyrics.offsetVersion) {
        songId?.let { Lyrics.offsetMs(it) } ?: 0L      // 微调后自增，触发重算
    }
    LaunchedEffect(songId, lyricsVersion) {
        val s = state.song
        if (s == null) {
            lyricsRes = LyricsResult()
            return@LaunchedEffect
        }
        lyricsRes = null
        val r = runCatching { Lyrics.loadCached(s) }.getOrDefault(LyricsResult())
        lyricsRes = r
        // 本地只有逐行版本时，后台再问一次有没有逐字的（不挡显示）
        if (!r.empty && !r.wordLevel) {
            runCatching { Lyrics.upgradeWordLevel(s) }.getOrNull()?.let { up ->
                if (up.wordLevel && up.lines.isNotEmpty()) lyricsRes = up
            }
        }
    }

    BoxWithConstraints(
        Modifier
            .fillMaxSize()
            .graphicsLayer {
                translationY = (1f - progress) * size.height
                // 跟手时不额外叠加缩放：整块滑动本身就是「真实滑动」的观感
            }
            // 下滑收起：位移门槛放到 15%，并补上甩速判定，
            // 快速轻甩一下即可关闭，不必把整个页面拖到屏幕下半部。
            // 跟手只把 delta 交给上层同步累积，不在这里开协程。
            .draggable(
                orientation = Orientation.Vertical,
                state = rememberDraggableState { delta -> onDrag(delta) },
                onDragStopped = { velocity -> onDragEnd(velocity) },
            )
    ) {
        val w = maxWidth
        val ease = progress
        val contentAlpha = ((ease - 0.15f) / 0.85f).coerceIn(0f, 1f)
        // 封面缩不缩，只在「当前这首歌的歌词真的加载完」之后才决定。
        //
        // 直接用 lyricsRes 会有个很难看的闪动：切歌瞬间 lyricsRes 被清空，封面
        // 先按「无歌词」的尺寸画一遍，等歌词读出来又缩回去 —— 看起来就是封面
        // 突然大了一圈。这里用上一个稳定值兜住，再配动画过渡尺寸。
        var stableHasLyrics by remember { mutableStateOf(false) }
        androidx.compose.runtime.LaunchedEffect(lyricsRes) {
            val r = lyricsRes
            if (r != null) stableHasLyrics = r.lines.isNotEmpty()
        }
        val hasLyrics = stableHasLyrics

        // 封面在「有歌词」时让出一点空间，否则歌词区只剩三四行。
        // 同时按屏高兜一道底：矮屏上宁可封面小一点，也不能把歌词压没。
        val reserved = Dimens.topBar + Dimens.l + 24.dp + Dimens.l + 66.dp +
            Dimens.m + 104.dp + 172.dp + Dimens.s + 80.dp  // 末项是状态栏+导航栏
        val coverMax = (maxHeight - reserved).coerceAtLeast(120.dp)
        // 只对「有没有歌词」这一项做动画，进/出场时的 ease 缩放必须跟手走，
        // 否则拖动过程会被动画拖拍。
        val shrink by androidx.compose.animation.core.animateFloatAsState(
            targetValue = if (hasLyrics) 0.86f else 1f,
            animationSpec = tween(Anim.ms(240)),
            label = "coverShrink",
        )
        val coverSize = minOf(
            (w - 110.dp) * (0.72f + 0.28f * ease) * shrink,
            coverMax,
        )

        // 沉浸式背景：整页铺一层封面毛玻璃，控件区靠底部渐变压暗保证对比度
        val topRadius = 26.dp * (1f - ease)   // 升起过程中是卡片圆角，完全展开后归零
        Box(
            Modifier
                .fillMaxSize()
                .clip(RoundedCornerShape(topStart = topRadius, topEnd = topRadius))
        ) {
        ImmersiveBackdrop(
            url = state.song?.let { Covers.imageFor(it) },
            modifier = Modifier.fillMaxSize(),
        )
        Column(
            Modifier
                .fillMaxSize()
                .statusBarsPadding()
                .navigationBarsPadding()
        ) {
            // 顶部：收起 + 说明
            Row(
                Modifier
                    .fillMaxWidth()
                    .height(Dimens.topBar)
                    .padding(horizontal = Dimens.xs),
                verticalAlignment = Alignment.CenterVertically
            ) {
                IconButtonBox(onCollapse) {
                    LmIcon(Icon.ChevronDown, Dimens.iconL, Lm.cur.textPrimary)
                }
                // 标题就是歌名，不再写「正在播放 / 来自 xx」这种没信息量的副标题；
                // 一行放不下就跑马灯（而不是截断成省略号）。
                MarqueeText(
                    text = state.song?.displayTitle ?: "未在播放",
                    color = Lm.cur.textPrimary,
                    style = LmText.rowTitle.copy(fontWeight = FontWeight.SemiBold),
                    modifier = Modifier
                        .weight(1f)
                        .padding(horizontal = Dimens.s),
                )
            }

            Spacer(Modifier.height(Dimens.l))

            // 封面。横滑切歌已经移除：详情页本身有整页竖滑收起的手势，
            // 横竖两个 draggable 叠在同一块区域上会互相抢事件，实际用起来
            // 是「想切歌却滑出一半又弹回，或者干脆把页面关掉」。
            Box(
                Modifier
                    .fillMaxWidth()
                    .height(coverSize + 24.dp),
                contentAlignment = Alignment.Center
            ) {
                Box(Modifier.graphicsLayer { alpha = 0.4f + 0.6f * ease }) {
                    Cover(
                        url = state.song?.let { Covers.imageFor(it) },
                        size = coverSize,
                        shape = RoundedCornerShape((10 + 10 * ease).dp),
                        active = state.playing,
                    )
                }
            }

            Spacer(Modifier.height(Dimens.l))

            // 标题 / 歌手
            Column(
                Modifier
                    .fillMaxWidth()
                    .graphicsLayer { alpha = contentAlpha }
                    .padding(horizontal = Dimens.xxl + Dimens.s),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Text(
                    state.song?.displayTitle ?: "未在播放",
                    color = Lm.cur.textPrimary,
                    style = LmText.playerTitle,
                    textAlign = TextAlign.Center,
                    maxLines = 2,
                    overflow = TextOverflow.Ellipsis,
                )
                Spacer(Modifier.height(Dimens.xs + 2.dp))
                Text(
                    state.song?.displayArtist ?: "",
                    color = Lm.cur.textSecondary,
                    fontSize = 14.sp,
                    lineHeight = 20.sp,
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis,
                )
            }

            Spacer(Modifier.height(Dimens.m))

            // 封面下方：滚动歌词（逐字 / 逐行），吃掉标题与控件区之间的全部空间
            Box(
                Modifier
                    .fillMaxWidth()
                    .weight(1f)
                    .graphicsLayer { alpha = contentAlpha }
            ) {
                InlineLyrics(
                    state = state,
                    lines = lyricsRes?.lines ?: emptyList(),
                    offsetMs = lyricOffset,
                    onSeek = { at -> Player.seekTo((at - lyricOffset).coerceAtLeast(0)) },
                    loading = lyricsRes == null && state.song != null,
                    emptyText = if (state.song == null) "" else "暂无歌词",
                    onEmptyAction = if (state.song != null) ({ showLyrics = true }) else null,
                    enabled = ease > 0.3f,
                    modifier = Modifier.fillMaxSize(),
                )
            }

            Spacer(Modifier.height(Dimens.s))

            // 控件区：上排图标（喜欢 定时 歌词 音效 更多）→ 进度条 → 下排（模式 上一首 播放 下一首 队列）
            Column(
                Modifier
                    .fillMaxWidth()
                    .graphicsLayer { alpha = contentAlpha }
                    .padding(horizontal = Dimens.l)
            ) {
                val dur = state.durationMs.coerceAtLeast(0)
                val frac = (if (dur > 0) state.positionMs.toFloat() / dur else 0f).coerceIn(0f, 1f)
                val shownFrac = seekPreviewFrac ?: frac
                val pos = if (dur > 0) (shownFrac * dur).toLong() else 0L

                // 上排五个图标：与桌面版底栏的「喜欢 / 定时 / 歌词 / 音效 / 更多」对应
                Row(Modifier.fillMaxWidth(), verticalAlignment = Alignment.CenterVertically) {
                    PlayerAction(
                        Modifier.weight(1f),
                        icon = if (liked) Icon.HeartFilled else Icon.Heart,
                        tint = if (liked) Lm.cur.accent else Lm.cur.textSecondary,
                    ) { state.song?.id?.let { Store.toggleLike(it) } }
                    PlayerAction(
                        Modifier.weight(1f),
                        icon = Icon.Timer,
                        tint = if (state.sleepRemainMs > 0) Lm.cur.accent else Lm.cur.textSecondary,
                    ) { showSleep = true }
                    PlayerAction(Modifier.weight(1f), Icon.Lyrics, Lm.cur.textSecondary) { showLyrics = true }
                    PlayerAction(Modifier.weight(1f), Icon.Effects, Lm.cur.textSecondary) { showEffect = true }
                    PlayerAction(Modifier.weight(1f), Icon.More, Lm.cur.textSecondary) { showMore = true }
                }

                Spacer(Modifier.height(Dimens.m))

                LmProgressBar(
                    progress = shownFrac,
                    onPreview = { seekPreviewFrac = it },
                    onSeek = { f ->
                        if (dur > 0) Player.seekTo((f * dur).toLong())
                        seekPreviewFrac = null
                    },
                )
                Row(Modifier.fillMaxWidth().padding(horizontal = Dimens.s)) {
                    Text(formatDuration(pos), color = Lm.cur.textTertiary, style = LmText.caption)
                    Spacer(Modifier.weight(1f))
                    Text(formatDuration(dur), color = Lm.cur.textTertiary, style = LmText.caption)
                }

                Spacer(Modifier.height(Dimens.s))

                Spacer(Modifier.height(Dimens.xs))

                // 下排：播放模式 / 上一首 / 播放 / 下一首 / 队列
                Row(Modifier.fillMaxWidth(), verticalAlignment = Alignment.CenterVertically) {
                    val modeIcon = when {
                        state.shuffle -> Icon.Shuffle
                        state.repeat == RepeatMode.One -> Icon.RepeatOne
                        else -> Icon.Repeat
                    }
                    val modeOn = state.shuffle || state.repeat != RepeatMode.Off
                    PlayerAction(
                        Modifier.weight(1f),
                        icon = modeIcon,
                        tint = if (modeOn) Lm.cur.accent else Lm.cur.textTertiary,
                        iconSize = Dimens.iconM,
                    ) { Player.cyclePlayMode() }
                    PlayerAction(Modifier.weight(1f), Icon.Prev, Lm.cur.textPrimary, 30.dp) { Player.prev() }
                    Box(Modifier.weight(1f), contentAlignment = Alignment.Center) {
                        Box(
                            Modifier
                                .size(60.dp)
                                .clip(CircleShape)
                                .clickable { Player.toggle() },
                            contentAlignment = Alignment.Center
                        ) {
                            LmIcon(
                                if (state.playing) Icon.Pause else Icon.Play,
                                40.dp,
                                Lm.cur.textPrimary,
                            )
                        }
                    }
                    PlayerAction(Modifier.weight(1f), Icon.Next, Lm.cur.textPrimary, 30.dp) { Player.next() }
                    PlayerAction(Modifier.weight(1f), Icon.Queue, Lm.cur.textSecondary) { showQueue = true }
                }

                Spacer(Modifier.height(Dimens.l))
            }
        }
        }

        if (showQueue) {
            QueueSheet(state) { showQueue = false }
        }
        if (showSleep) {
            SleepSheet(state) { showSleep = false }
        }
        if (showLyrics) {
            LyricsSheet(state) { showLyrics = false }
        }
        if (showEffect) {
            EffectSheet(state) { showEffect = false }
        }
        if (showMore) {
            MoreSheet(state) { showMore = false }
        }
    }
}

/** 详情页图标按钮：命中区 46dp，视觉图标大小可调，不带背景色块。 */
@Composable
private fun PlayerAction(
    modifier: Modifier,
    icon: Icon,
    tint: Color,
    iconSize: Dp = Dimens.iconM,
    onClick: () -> Unit,
) {
    Box(modifier.height(48.dp), contentAlignment = Alignment.Center) {
        Box(
            Modifier
                .size(46.dp)
                .clip(CircleShape)
                .clickable(onClick = onClick),
            contentAlignment = Alignment.Center,
        ) {
            LmIcon(icon, iconSize, tint)
        }
    }
}

@Composable
internal fun QueueSheet(state: PlayerState, onDismiss: () -> Unit) {
    Sheet(onDismiss) { dismiss ->
        Column(Modifier.fillMaxWidth()) {
            Row(
                Modifier
                    .fillMaxWidth()
                    .padding(horizontal = Dimens.xl, vertical = Dimens.s),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    "播放队列 · ${state.queue.size} 首",
                    color = Lm.cur.textPrimary,
                    style = LmText.rowTitle,
                )
                Spacer(Modifier.weight(1f))
                IconButtonBox(dismiss, 36) { LmIcon(Icon.Close, Dimens.iconS, Lm.cur.textSecondary) }
            }
            // 用 heightIn 而不是固定高度：队列短的时候不留一大片空白，
            // 高度变化也会带着面板一起（由 Sheet 的实测高度驱动）
            LazyColumn(Modifier.heightIn(max = 360.dp)) {
                itemsIndexed(state.queue, key = { _, s -> s.id }) { i, song ->
                    val active = i == state.index
                    // 「播放这一行」和「移除这一行」是两个并列的点击区，
                    // 不把移除按钮嵌在整行可点击的 Row 里：那样两个 clickable
                    // 上下叠在一起，实测点垃圾桶照样会播歌（外层先吃掉了事件）。
                    // 拆开之后命中区互不重叠，各自 44dp 也好按。
                    Row(
                        Modifier
                            .fillMaxWidth()
                            .height(Dimens.row - Dimens.l)
                            .background(if (active) Lm.cur.accentSoft.copy(alpha = 0.35f) else Color.Transparent),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Row(
                            Modifier
                                .weight(1f)
                                .fillMaxHeight()
                                .clickable { Player.play(song, state.queue, i) }
                                .padding(start = Dimens.xl, end = Dimens.s),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(
                                "${i + 1}",
                                color = if (active) Lm.cur.accent else Lm.cur.textTertiary,
                                style = LmText.caption,
                                modifier = Modifier.width(Dimens.xxl),
                            )
                            Column(Modifier.weight(1f)) {
                                Text(
                                    song.displayTitle,
                                    color = if (active) Lm.cur.accent else Lm.cur.textPrimary,
                                    style = LmText.rowTitle,
                                    maxLines = 1,
                                    overflow = TextOverflow.Ellipsis,
                                )
                                Text(
                                    song.displayArtist,
                                    color = Lm.cur.textTertiary,
                                    style = LmText.rowSub,
                                    maxLines = 1,
                                )
                            }
                            Text(
                                formatDuration(song.durationMs),
                                color = Lm.cur.textTertiary,
                                style = LmText.caption,
                            )
                            Spacer(Modifier.width(Dimens.xs))
                        }
                        // 队列里每一行都能单独移除：原来队列只能整体换掉，
                        // 想把某首踢出去唯一的办法是清空重排。
                        IconButtonBox({ Player.removeAt(i) }, 44) {
                            LmIcon(Icon.Trash, 16.dp, Lm.cur.textTertiary)
                        }
                        Spacer(Modifier.width(Dimens.xs))
                    }
                }
            }
        }
    }
}
