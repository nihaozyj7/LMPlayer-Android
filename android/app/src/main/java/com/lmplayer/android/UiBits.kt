package com.lmplayer.android

import android.graphics.Bitmap
import androidx.compose.animation.core.LinearEasing
import androidx.compose.animation.core.animate
import androidx.compose.animation.core.tween
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableFloatStateOf
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.BlurredEdgeTreatment
import androidx.compose.ui.draw.blur
import androidx.compose.ui.draw.clipToBounds
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.FilterQuality
import androidx.compose.ui.graphics.asImageBitmap
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.graphics.lerp
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.layout.onSizeChanged
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.text.AnnotatedString
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.rememberTextMeasurer
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import kotlinx.coroutines.delay

/**
 * 单行「跑马灯」文字：放得下就是静态文字，放不下才循环滚动。
 *
 * 不用 Modifier.basicMarquee 的原因：它滚完立刻跳回起点、中间没有停顿，
 * 长标题看起来像在抽搐；而且不会「只在真的放不下时」才动。
 * 这里的节奏是 停顿 → 匀速滚到底 → 停顿 → 回起点。
 */
@Composable
fun MarqueeText(
    text: String,
    color: Color,
    style: TextStyle,
    modifier: Modifier = Modifier,
    pxPerSecond: Float = 46f,
) {
    var viewWidth by remember { mutableIntStateOf(0) }
    var offset by remember { mutableFloatStateOf(0f) }
    // 关键：不能用 TextLayoutResult.size.width 来量文本宽。Text 在 maxLines=1 +
    // softWrap=false 时，测量结果会被父约束夹到容器宽，于是 textWidth 永远等于
    // viewWidth，「超宽」永不成立 —— 表现就是标题被静态截断、跑马灯瘸了。
    // TextMeasurer 在不给约束时量的是真实文本宽，这才是要比较的那个数。
    val measurer = rememberTextMeasurer()
    val textWidth = remember(text, style) {
        measurer.measure(
            text = AnnotatedString(text),
            style = style,
            softWrap = false,
            maxLines = 1,
        ).size.width
    }
    val density = LocalDensity.current.density
    // 留一点余量：宽度只差一两像素时不出滚动，避免「几乎一样宽却一直抖」
    val overflow = textWidth > viewWidth + (2 * density).toInt()

    LaunchedEffect(text, overflow, textWidth, viewWidth) {
        offset = 0f
        if (!overflow || viewWidth <= 0) return@LaunchedEffect
        val span = (textWidth - viewWidth).toFloat()
        val speed = (pxPerSecond * density).coerceAtLeast(1f)
        while (true) {
            delay(1000)
            val dur = ((span / speed) * 1000f).toInt().coerceIn(700, 14000)
            animate(0f, -span, animationSpec = tween(dur, easing = LinearEasing)) { v, _ -> offset = v }
            delay(1200)
            offset = 0f
        }
    }

    Box(modifier.clipToBounds().onSizeChanged { viewWidth = it.width }) {
        Text(
            text = text,
            color = color,
            style = style,
            maxLines = 1,
            softWrap = false,
            overflow = TextOverflow.Visible,
            modifier = Modifier.graphicsLayer { translationX = offset },
        )
    }
}

/**
 * 播放详情页的沉浸式背景：把当前封面铺满整页，做低频化 + 模糊，再压一层
 * 主题色渐变，保证底部控件区的文字对比度。
 *
 * 两个关键约束：
 *  1. **不能直接上大图**：一张 1500×1500 的封面铺屏后用 Modifier.blur 做
 *     大半径模糊，GPU 每帧都要跑一遍；先缩到 24px 宽再放大，视觉上是同一
 *     团颜色，但代价可以忽略（这也是老版本 Android 的兜底：blur 在
 *     API<31 是 no-op，此时就靠这层降采样的插值当模糊）。
 *  2. **必须保留不透明底**：详情页是滑上来的面板，底下一层不透明色能挡住
 *     主页内容，否则会透出两层界面叠在一起。
 */
@Composable
fun ImmersiveBackdrop(url: String?, modifier: Modifier = Modifier) {
    val full = remember(url) { ImageLoader.absolute(url ?: "") }
    var bmp by remember { mutableStateOf<Bitmap?>(null) }
    LaunchedEffect(full) {
        if (full.isBlank()) {
            bmp = null
            return@LaunchedEffect
        }
        bmp = ImageLoader.load(full)?.let { shrink(it) }
    }

    val bg = Lm.cur.bg
    Box(modifier) {
        // 兜底层：没有封面时保持原来的「主题色微渐变」，不至于变成一块死白/死黑
        Box(
            Modifier.fillMaxSize().background(
                Brush.verticalGradient(
                    listOf(
                        lerp(bg, Lm.cur.accentSoft, 0.45f),
                        bg,
                        bg,
                    )
                )
            )
        )
        val shot = bmp
        if (shot != null) {
            Image(
                bitmap = shot.asImageBitmap(),
                contentDescription = null,
                contentScale = ContentScale.Crop,
                filterQuality = FilterQuality.Low,
                modifier = Modifier
                    .fillMaxSize()
                    .graphicsLayer {
                        alpha = 0.7f
                        // 放大一点：模糊半径为 0 的老设备上，边缘不至于露出色块边界
                        scaleX = 1.1f
                        scaleY = 1.1f
                    }
                    .blur(16.dp, edgeTreatment = BlurredEdgeTreatment.Unbounded),
            )
        }
        // 遮盖层：顶部只压一点点（沉浸感保留），越往下越接近不透明底色
        Box(
            Modifier.fillMaxSize().background(
                Brush.verticalGradient(
                    0.00f to bg.copy(alpha = 0.45f),
                    0.32f to bg.copy(alpha = 0.68f),
                    0.62f to bg.copy(alpha = 0.90f),
                    0.78f to bg,
                    1.00f to bg,
                )
            )
        )
    }
}

/** 把封面缩到 24px 宽（高度按比例）：既是廉价模糊，也把 bitmap 内存降到可忽略。 */
private fun shrink(src: Bitmap): Bitmap {
    val h = (src.height.toFloat() * 96f / src.width).toInt().coerceIn(24, 96)
    return runCatching { Bitmap.createScaledBitmap(src, 96, h, true) }.getOrDefault(src)
}
