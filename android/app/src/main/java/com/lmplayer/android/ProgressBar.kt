package com.lmplayer.android

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.gestures.detectHorizontalDragGestures
import androidx.compose.foundation.gestures.detectTapGestures
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableFloatStateOf
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.CornerRadius
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.layout.onSizeChanged
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp

/**
 * 播放进度条。
 *
 * 为什么不用 Material3 的 Slider：它新版的 thumb 是一根 4×44dp 的竖条（不是圆点），
 * 在音乐播放器里看起来像一根突兀的竖线，而且 44dp 的 thumb 会把细轨道撑开。
 * 这里自绘成「一条细圆角线」，圆点滑块只在拖动时出现，静止时进度条是干净的。
 *
 * 交互：点按任意位置跳转、横向拖动跟手预览、松手才真正 seek。
 */
@Composable
fun LmProgressBar(
    progress: Float,
    modifier: Modifier = Modifier,
    trackHeight: Dp = 4.dp,
    thumbRadius: Dp = 6.dp,
    onPreview: (Float?) -> Unit = {},
    onSeek: (Float) -> Unit = {},
) {
    var widthPx by remember { mutableIntStateOf(0) }
    var dragging by remember { mutableStateOf(false) }
    var dragValue by remember { mutableFloatStateOf(0f) }

    val shown = (if (dragging) dragValue else progress).coerceIn(0f, 1f)
    val track = Lm.cur.divider
    val accent = Lm.cur.accent

    Box(
        modifier
            .fillMaxWidth()
            .height(28.dp)
            .onSizeChanged { widthPx = it.width }
            .pointerInput(widthPx) {
                detectTapGestures { off ->
                    if (widthPx > 0) onSeek((off.x / widthPx).coerceIn(0f, 1f))
                }
            }
            .pointerInput(widthPx) {
                if (widthPx <= 0) return@pointerInput
                detectHorizontalDragGestures(
                    onDragStart = { off ->
                        dragging = true
                        dragValue = (off.x / widthPx).coerceIn(0f, 1f)
                        onPreview(dragValue)
                    },
                    onHorizontalDrag = { change, _ ->
                        dragValue = (change.position.x / widthPx).coerceIn(0f, 1f)
                        onPreview(dragValue)
                        change.consume()
                    },
                    onDragEnd = {
                        dragging = false
                        val v = dragValue
                        onSeek(v)
                        onPreview(null)
                    },
                    onDragCancel = {
                        dragging = false
                        onPreview(null)
                    },
                )
            }
    ) {
        Canvas(Modifier.fillMaxWidth().height(28.dp)) {
            val h = trackHeight.toPx()
            val cy = size.height / 2f
            val r = CornerRadius(h / 2f, h / 2f)
            drawRoundRect(
                color = track,
                topLeft = Offset(0f, cy - h / 2f),
                size = Size(size.width, h),
                cornerRadius = r,
            )
            val w = size.width * shown
            if (w > 0.5f) {
                drawRoundRect(
                    color = accent,
                    topLeft = Offset(0f, cy - h / 2f),
                    size = Size(w.coerceAtMost(size.width), h),
                    cornerRadius = r,
                )
            }
            if (dragging) {
                drawCircle(accent, radius = thumbRadius.toPx(), center = Offset(w, cy))
            }
        }
    }
}
