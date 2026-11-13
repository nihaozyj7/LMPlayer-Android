package com.lmplayer.android

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.collectIsDraggedAsState
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.BoxWithConstraints
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.itemsIndexed
import androidx.compose.foundation.lazy.rememberLazyListState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableLongStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberUpdatedState
import androidx.compose.runtime.setValue
import androidx.compose.runtime.withFrameNanos
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.drawWithContent
import androidx.compose.ui.graphics.BlendMode
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.CompositingStrategy
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.text.AnnotatedString
import androidx.compose.ui.text.SpanStyle
import androidx.compose.ui.text.buildAnnotatedString
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.withStyle
import androidx.compose.ui.unit.dp
import kotlinx.coroutines.delay
import kotlinx.coroutines.isActive
import kotlin.math.abs

/**
 * 详情页封面下方的滚动歌词。
 *
 * 三件事在这里解决：
 *
 * 1. **位置要连续。** Player 的 positionMs 是 200ms 一跳的（够进度条用），
 *    直接拿去点亮逐字歌词会一格一格地蹦。这里用帧时钟在两个 tick 之间线性
 *    补一个连续位置：只用 tick 做锚点，播放中每帧推进。
 *
 * 2. **不能整页重组。** 连续位置放在一个 MutableLongState 里，只有「正在唱
 *    的那一行」在重组时读它（而且是逐字歌词才读）。其它行只是在换行时才重组，
 *    所以 60fps 的成本落在 1 个 Text 上，详情页其余部分纹丝不动。
 *
 * 3. **用户拖了就让他拖。** 手指按住歌词滚动时暂停自动跟随，松手 3.5 秒后
 *    再回到当前行——否则一边看后面几句一边被拽回去，根本没法看。
 */

/** 当前行节奏地往上走，当前行垂直居中。 */
@Composable
fun InlineLyrics(
    state: PlayerState,
    lines: List<LyricLine>,
    offsetMs: Long,
    onSeek: (Long) -> Unit,
    modifier: Modifier = Modifier,
    loading: Boolean = false,
    emptyText: String = "暂无歌词",
    onEmptyAction: (() -> Unit)? = null,
    /** 详情页收起时不用跑帧时钟。 */
    enabled: Boolean = true,
) {
    BoxWithConstraints(modifier) {
        val density = LocalDensity.current
        val viewportH = maxHeight

        // 连续位置：只有下面那一个「当前行」会读它
        val clock = remember { mutableLongStateOf(state.positionMs + offsetMs) }
        val latest by rememberUpdatedState(state)
        val off by rememberUpdatedState(offsetMs)
        var current by remember(lines) { mutableIntStateOf(-1) }

        if (enabled && lines.isNotEmpty()) {
            LaunchedEffect(lines) {
                var base = latest.positionMs
                var baseAt = 0L
                while (isActive) {
                    withFrameNanos { now ->
                        val s = latest
                        if (s.playing) {
                            // tick 之间的线性插值；位置被 seek 打乱（差 >250ms）就重新锚定
                            if (baseAt == 0L || abs(s.positionMs - base) > 250) {
                                base = s.positionMs
                                baseAt = now
                            }
                            val v = base + ((now - baseAt) / 1_000_000.0 * s.speed).toLong() + off
                            clock.longValue = v
                            val idx = Lyrics.currentLine(lines, v)
                            if (idx != current) current = idx
                        } else {
                            val v = s.positionMs + off
                            if (clock.longValue != v) clock.longValue = v
                            val idx = Lyrics.currentLine(lines, v)
                            if (idx != current) current = idx
                        }
                    }
                }
            }
        }

        when {
            loading -> Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                CircularProgressIndicator(
                    color = Lm.cur.accent,
                    strokeWidth = 2.dp,
                    modifier = Modifier.size(18.dp),
                )
            }

            lines.isEmpty() -> Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Text(
                        emptyText,
                        color = Lm.cur.textTertiary,
                        style = LmText.caption,
                        textAlign = TextAlign.Center,
                    )
                    if (onEmptyAction != null) {
                        Spacer(Modifier.height(Dimens.s))
                        Box(
                            Modifier
                                .background(Lm.cur.bgRaised, RoundedCornerShape(14.dp))
                                .clickable { onEmptyAction() }
                                .padding(horizontal = 12.dp, vertical = 6.dp),
                        ) {
                            Text("搜索歌词", color = Lm.cur.accent, style = LmText.caption)
                        }
                    }
                }
            }

            else -> {
                val listState = rememberLazyListState()
                val dragged by listState.interactionSource.collectIsDraggedAsState()
                var resumeAt by remember { mutableLongStateOf(0L) }

                LaunchedEffect(dragged) {
                    if (dragged) resumeAt = System.currentTimeMillis() + 3500
                }

                LaunchedEffect(current, dragged, lines) {
                    if (dragged) return@LaunchedEffect
                    val nowMs = System.currentTimeMillis()
                    if (nowMs < resumeAt) delay(resumeAt - nowMs)
                    if (dragged) return@LaunchedEffect
                    if (current < 0) {
                        runCatching { listState.animateScrollToItem(0) }
                        return@LaunchedEffect
                    }
                    // 居中：contentPadding 给了半屏，再把行高一半往上抬，
                    // 当前行正好落在可视区正中（行高取已布局到的实测值）。
                    val itemH = listState.layoutInfo.visibleItemsInfo
                        .firstOrNull { it.index == current }?.size
                        ?: with(density) { 46.dp.roundToPx() }
                    runCatching { listState.animateScrollToItem(current, scrollOffset = itemH / 2) }
                }

                LazyColumn(
                    Modifier
                        .fillMaxSize()
                        // 上下渐隐：滚出可视区的行不要硬生生切断
                        .graphicsLayer { compositingStrategy = CompositingStrategy.Offscreen }
                        .drawWithContent {
                            drawContent()
                            drawRect(
                                Brush.verticalGradient(
                                    0f to Color.Transparent,
                                    0.10f to Color.Black,
                                    0.90f to Color.Black,
                                    1f to Color.Transparent,
                                ),
                                blendMode = BlendMode.DstIn,
                            )
                        },
                    state = listState,
                    contentPadding = PaddingValues(vertical = viewportH / 2),
                    verticalArrangement = Arrangement.spacedBy(Dimens.xs),
                ) {
                    itemsIndexed(lines, key = { i, l -> "$i:${l.at}" }) { i, line ->
                        val active = i == current
                        LyricRow(
                            line = line,
                            active = active,
                            clock = if (active && line.words.size >= 2) clock else null,
                            onClick = { onSeek((line.at - offsetMs).coerceAtLeast(0)) },
                        )
                    }
                }
            }
        }
    }
}

@Composable
private fun LyricRow(
    line: LyricLine,
    active: Boolean,
    /** 非 null 时这一行每帧重组（逐字点亮）；其它行完全不读帧时钟。 */
    clock: androidx.compose.runtime.MutableLongState?,
    onClick: () -> Unit,
) {
    val plain = remember(line.text) { AnnotatedString(line.text) }
    val text = if (clock != null) litWords(line, clock.longValue) else plain

    Text(
        text = text,
        color = if (active) Lm.cur.accent else Lm.cur.textSecondary,
        style = if (active) LmText.lyricActive else LmText.lyricIdle,
        fontWeight = if (active) FontWeight.SemiBold else FontWeight.Normal,
        textAlign = TextAlign.Center,
        modifier = Modifier
            .fillMaxWidth()
            .clickable { onClick() }
            .padding(horizontal = Dimens.xl, vertical = 4.dp),
    )
}

/**
 * 逐字点亮：已唱过的字用主色，未唱的用弱色。
 *
 * 用 SpanStyle 而不是一排 Text：中文歌词一行二三十个字，排成 Row 会破坏
 * 自动换行，长句直接溢出屏幕。
 */
@Composable
private fun litWords(line: LyricLine, positionMs: Long): AnnotatedString {
    val accent = Lm.cur.accent
    // 未唱的字用「普通行」的颜色，不要用更暗的 textTertiary：
    // 否则这一行刚开始唱时整行发灰，看起来比上下未唱的行还暗，
    // 主次直接颠倒。唱过的字才跳成主色。
    val dim = Lm.cur.textSecondary
    return buildAnnotatedString {
        for (w in line.words) {
            // 直接比时间，不按「比例」点亮：字与字的间隔常常不均，
            // 按比例会让第一个字晚半拍才亮。
            withStyle(SpanStyle(color = if (w.at <= positionMs) accent else dim)) { append(w.text) }
        }
    }
}
