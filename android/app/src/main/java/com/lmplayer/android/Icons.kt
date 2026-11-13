package com.lmplayer.android

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.layout.size
import androidx.compose.material3.LocalContentColor
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.CornerRadius
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Rect
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.drawscope.DrawScope
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp

/**
 * 自绘图标。
 *
 * 不引 material-icons-extended：那个包会把几千个矢量图一起打进 APK（未开 R8），
 * 而这里一共只用得上二十来个形状。全部用几何图形画，尺寸/线宽跟着画布缩放，
 * 在 24dp 和 48dp 下都清晰。
 */
enum class Icon {
    Menu, Search, Close, Back, Play, Pause, Next, Prev, Queue, Heart, HeartFilled,
    Repeat, RepeatOne, Shuffle, More, Sort, Folder, Check, Chevron, ChevronDown, Download,
    Theme, Settings, Refresh, Add, Trash, Edit, Volume, Effects, Lyrics, Timer, Off, Image,
}

@Composable
fun LmIcon(
    icon: Icon,
    size: Dp = 24.dp,
    tint: Color = LocalContentColor.current,
) {
    Canvas(Modifier.size(size)) { drawIconShape(icon, tint) }
}

private fun DrawScope.drawIconShape(icon: Icon, tint: Color) {
    val s = size.minDimension
    val w = s * 0.085f                      // 标准线宽
    val stroke = Stroke(width = w, cap = StrokeCap.Round)
    fun p(vararg pts: Pair<Float, Float>) = Path().apply {
        pts.forEachIndexed { i, (x, y) ->
            if (i == 0) moveTo(x * s, y * s) else lineTo(x * s, y * s)
        }
    }

    when (icon) {
        Icon.Menu -> {
            drawLine(tint, Offset(s * .18f, s * .3f), Offset(s * .82f, s * .3f), w, StrokeCap.Round)
            drawLine(tint, Offset(s * .18f, s * .5f), Offset(s * .82f, s * .5f), w, StrokeCap.Round)
            drawLine(tint, Offset(s * .18f, s * .7f), Offset(s * .62f, s * .7f), w, StrokeCap.Round)
        }
        Icon.Search -> {
            drawCircle(tint, s * .26f, Offset(s * .44f, s * .44f), style = stroke)
            drawLine(tint, Offset(s * .63f, s * .63f), Offset(s * .84f, s * .84f), w * 1.15f, StrokeCap.Round)
        }
        Icon.Close -> {
            drawLine(tint, Offset(s * .26f, s * .26f), Offset(s * .74f, s * .74f), w, StrokeCap.Round)
            drawLine(tint, Offset(s * .74f, s * .26f), Offset(s * .26f, s * .74f), w, StrokeCap.Round)
        }
        Icon.Back -> {
            drawLine(tint, Offset(s * .56f, s * .26f), Offset(s * .3f, s * .5f), w, StrokeCap.Round)
            drawLine(tint, Offset(s * .3f, s * .5f), Offset(s * .56f, s * .74f), w, StrokeCap.Round)
            drawLine(tint, Offset(s * .3f, s * .5f), Offset(s * .82f, s * .5f), w, StrokeCap.Round)
        }
        Icon.Chevron -> {
            drawLine(tint, Offset(s * .4f, s * .3f), Offset(s * .62f, s * .5f), w, StrokeCap.Round)
            drawLine(tint, Offset(s * .62f, s * .5f), Offset(s * .4f, s * .7f), w, StrokeCap.Round)
        }
        Icon.ChevronDown -> {
            drawLine(tint, Offset(s * .28f, s * .42f), Offset(s * .5f, s * .64f), w, StrokeCap.Round)
            drawLine(tint, Offset(s * .5f, s * .64f), Offset(s * .72f, s * .42f), w, StrokeCap.Round)
        }
        Icon.Play -> drawPath(
            Path().apply {
                moveTo(s * .32f, s * .2f); lineTo(s * .82f, s * .5f); lineTo(s * .32f, s * .8f); close()
            }, tint
        )
        Icon.Pause -> {
            drawRoundRect(
                tint, Offset(s * .3f, s * .24f), Size(s * .13f, s * .52f),
                cornerRadius = androidx.compose.ui.geometry.CornerRadius(w * .6f)
            )
            drawRoundRect(
                tint, Offset(s * .57f, s * .24f), Size(s * .13f, s * .52f),
                cornerRadius = androidx.compose.ui.geometry.CornerRadius(w * .6f)
            )
        }
        Icon.Prev, Icon.Next -> {
            val flip = icon == Icon.Prev
            val x1 = if (flip) s * .68f else s * .32f
            val x2 = if (flip) s * .34f else s * .66f
            drawPath(
                Path().apply {
                    moveTo(x1, s * .24f); lineTo(x2, s * .5f); lineTo(x1, s * .76f); close()
                }, tint
            )
            val bx = if (flip) s * .26f else s * .74f
            drawLine(tint, Offset(bx, s * .26f), Offset(bx, s * .74f), w * 1.1f, StrokeCap.Round)
        }
        Icon.Queue -> {
            drawLine(tint, Offset(s * .18f, s * .28f), Offset(s * .58f, s * .28f), w, StrokeCap.Round)
            drawLine(tint, Offset(s * .18f, s * .5f), Offset(s * .58f, s * .5f), w, StrokeCap.Round)
            drawLine(tint, Offset(s * .18f, s * .72f), Offset(s * .46f, s * .72f), w, StrokeCap.Round)
            drawPath(
                Path().apply {
                    moveTo(s * .6f, s * .52f); lineTo(s * .86f, s * .64f); lineTo(s * .6f, s * .76f); close()
                }, tint
            )
        }
        Icon.Heart, Icon.HeartFilled -> {
            val heart = Path().apply {
                moveTo(s * .5f, s * .78f)
                cubicTo(s * .12f, s * .54f, s * .18f, s * .22f, s * .5f, s * .38f)
                cubicTo(s * .82f, s * .22f, s * .88f, s * .54f, s * .5f, s * .78f)
                close()
            }
            if (icon == Icon.HeartFilled) drawPath(heart, tint)
            else drawPath(heart, tint, style = Stroke(w, cap = StrokeCap.Round))
        }
        Icon.Repeat, Icon.RepeatOne -> {
            val path = Path().apply {
                moveTo(s * .26f, s * .34f)
                lineTo(s * .7f, s * .34f)
                moveTo(s * .62f, s * .24f)
                lineTo(s * .74f, s * .34f)
                lineTo(s * .62f, s * .44f)
                moveTo(s * .74f, s * .66f)
                lineTo(s * .3f, s * .66f)
                moveTo(s * .38f, s * .56f)
                lineTo(s * .26f, s * .66f)
                lineTo(s * .38f, s * .76f)
            }
            drawPath(path, tint, style = stroke)
            if (icon == Icon.RepeatOne) {
                drawLine(tint, Offset(s * .5f, s * .44f), Offset(s * .5f, s * .58f), w * .9f, StrokeCap.Round)
            }
        }
        Icon.Shuffle -> {
            val path = Path().apply {
                moveTo(s * .2f, s * .3f)
                lineTo(s * .38f, s * .3f)
                lineTo(s * .66f, s * .7f)
                lineTo(s * .82f, s * .7f)
                moveTo(s * .2f, s * .7f)
                lineTo(s * .36f, s * .7f)
                lineTo(s * .5f, s * .52f)
                moveTo(s * .72f, s * .6f)
                lineTo(s * .82f, s * .7f)
                lineTo(s * .72f, s * .8f)
            }
            drawPath(path, tint, style = stroke)
        }
        Icon.More -> {
            listOf(.3f, .5f, .7f).forEach { y ->
                drawCircle(tint, s * .058f, Offset(s * .5f, s * y))
            }
        }
        Icon.Sort -> {
            drawLine(tint, Offset(s * .3f, s * .24f), Offset(s * .3f, s * .74f), w, StrokeCap.Round)
            drawLine(tint, Offset(s * .3f, s * .74f), Offset(s * .2f, s * .62f), w, StrokeCap.Round)
            drawLine(tint, Offset(s * .3f, s * .74f), Offset(s * .4f, s * .62f), w, StrokeCap.Round)
            drawLine(tint, Offset(s * .58f, s * .3f), Offset(s * .82f, s * .3f), w, StrokeCap.Round)
            drawLine(tint, Offset(s * .58f, s * .5f), Offset(s * .76f, s * .5f), w, StrokeCap.Round)
            drawLine(tint, Offset(s * .58f, s * .7f), Offset(s * .68f, s * .7f), w, StrokeCap.Round)
        }
        Icon.Folder -> {
            val path = Path().apply {
                moveTo(s * .18f, s * .34f)
                lineTo(s * .42f, s * .34f)
                lineTo(s * .5f, s * .26f)
                lineTo(s * .82f, s * .26f)
                lineTo(s * .82f, s * .74f)
                lineTo(s * .18f, s * .74f)
                close()
            }
            drawPath(path, tint, style = stroke)
        }
        Icon.Check -> {
            drawLine(tint, Offset(s * .24f, s * .52f), Offset(s * .43f, s * .71f), w * 1.15f, StrokeCap.Round)
            drawLine(tint, Offset(s * .43f, s * .71f), Offset(s * .78f, s * .3f), w * 1.15f, StrokeCap.Round)
        }
        Icon.Download -> {
            drawLine(tint, Offset(s * .5f, s * .2f), Offset(s * .5f, s * .64f), w, StrokeCap.Round)
            drawLine(tint, Offset(s * .5f, s * .64f), Offset(s * .34f, s * .48f), w, StrokeCap.Round)
            drawLine(tint, Offset(s * .5f, s * .64f), Offset(s * .66f, s * .48f), w, StrokeCap.Round)
            drawLine(tint, Offset(s * .24f, s * .78f), Offset(s * .76f, s * .78f), w, StrokeCap.Round)
        }
        Icon.Theme -> {
            // 明暗切换图标是「半明半暗的圆」：左半描边、右半实心，
            // 一眼就是「对比度/主题」，不再像一颗带点的太阳。
            val r = s * .32f
            drawCircle(tint, r, Offset(s * .5f, s * .5f), style = stroke)
            val half = Path().apply {
                moveTo(s * .5f, s * .5f - r)
                arcTo(
                    Rect(s * .5f - r, s * .5f - r, s * .5f + r, s * .5f + r),
                    -90f, 180f, false,
                )
                close()
            }
            drawPath(half, tint)
        }
        Icon.Settings -> {
            // 外圈是齿轮本体：少了它，那 8 根齿就成了一颗太阳
            drawCircle(tint, s * .27f, Offset(s * .5f, s * .5f), style = stroke)
            drawCircle(tint, s * .11f, Offset(s * .5f, s * .5f), style = stroke)
            for (i in 0 until 8) {
                val a = Math.PI * i / 4.0
                val cx = offsetCos(a)
                val cy = offsetSin(a)
                drawLine(
                    tint,
                    Offset(s * .5f + s * .26f * cx, s * .5f + s * .26f * cy),
                    Offset(s * .5f + s * .34f * cx, s * .5f + s * .34f * cy),
                    w, StrokeCap.Round
                )
            }
        }
        Icon.Refresh -> {
            val oval = androidx.compose.ui.geometry.Rect(
                Offset(s * .26f, s * .26f), Offset(s * .74f, s * .74f)
            )
            drawArc(tint, 40f, 280f, false, topLeft = oval.topLeft, size = oval.size, style = stroke)
            drawLine(tint, Offset(s * .74f, s * .3f), Offset(s * .74f, s * .44f), w, StrokeCap.Round)
            drawLine(tint, Offset(s * .74f, s * .44f), Offset(s * .6f, s * .44f), w, StrokeCap.Round)
        }
        Icon.Add -> {
            drawLine(tint, Offset(s * .5f, s * .22f), Offset(s * .5f, s * .78f), w, StrokeCap.Round)
            drawLine(tint, Offset(s * .22f, s * .5f), Offset(s * .78f, s * .5f), w, StrokeCap.Round)
        }
        Icon.Trash -> {
            drawLine(tint, Offset(s * .22f, s * .3f), Offset(s * .78f, s * .3f), w, StrokeCap.Round)
            drawLine(tint, Offset(s * .42f, s * .22f), Offset(s * .58f, s * .22f), w, StrokeCap.Round)
            val body = Path().apply {
                moveTo(s * .3f, s * .34f); lineTo(s * .35f, s * .8f)
                lineTo(s * .65f, s * .8f); lineTo(s * .7f, s * .34f)
            }
            drawPath(body, tint, style = Stroke(w, cap = StrokeCap.Round))
        }
        Icon.Edit -> {
            drawLine(tint, Offset(s * .24f, s * .76f), Offset(s * .7f, s * .3f), w, StrokeCap.Round)
            drawLine(tint, Offset(s * .24f, s * .76f), Offset(s * .36f, s * .72f), w, StrokeCap.Round)
            drawLine(tint, Offset(s * .62f, s * .22f), Offset(s * .78f, s * .38f), w, StrokeCap.Round)
        }
        Icon.Volume -> {
            drawPath(
                Path().apply {
                    moveTo(s * .2f, s * .4f); lineTo(s * .36f, s * .4f); lineTo(s * .56f, s * .24f)
                    lineTo(s * .56f, s * .76f); lineTo(s * .36f, s * .6f); lineTo(s * .2f, s * .6f); close()
                }, tint
            )
            drawArc(
                tint, -50f, 100f, false,
                topLeft = Offset(s * .4f, s * .3f), size = Size(s * .3f, s * .4f), style = stroke
            )
        }
        Icon.Effects -> {
            // 均衡器：四根底部对齐的竖线，高度错开
            val bars = listOf(.30f, .62f, .42f, .74f)
            bars.forEachIndexed { i, h ->
                val x = s * (.24f + i * .173f)
                drawLine(
                    tint,
                    Offset(x, s * .78f),
                    Offset(x, s * (.78f - h * .62f)),
                    w * 1.15f,
                    StrokeCap.Round,
                )
            }
        }
        Icon.Lyrics -> {
            drawLine(tint, Offset(s * .2f, s * .3f), Offset(s * .8f, s * .3f), w, StrokeCap.Round)
            drawLine(tint, Offset(s * .2f, s * .5f), Offset(s * .68f, s * .5f), w, StrokeCap.Round)
            drawLine(tint, Offset(s * .2f, s * .7f), Offset(s * .56f, s * .7f), w, StrokeCap.Round)
        }
        Icon.Timer -> {
            drawCircle(tint, s * .3f, Offset(s * .5f, s * .56f), style = stroke)
            drawLine(tint, Offset(s * .5f, s * .56f), Offset(s * .5f, s * .4f), w, StrokeCap.Round)
            drawLine(tint, Offset(s * .5f, s * .56f), Offset(s * .62f, s * .56f), w, StrokeCap.Round)
            drawLine(tint, Offset(s * .42f, s * .18f), Offset(s * .58f, s * .18f), w, StrokeCap.Round)
        }
        Icon.Image -> {
            // 相框 + 山 + 太阳：封面/图片
            drawRoundRect(
                tint,
                topLeft = Offset(s * .16f, s * .22f),
                size = Size(s * .68f, s * .56f),
                cornerRadius = CornerRadius(s * .08f, s * .08f),
                style = stroke,
            )
            drawCircle(tint, s * .05f, Offset(s * .34f, s * .38f))
            val hill = Path().apply {
                moveTo(s * .2f, s * .7f)
                lineTo(s * .4f, s * .48f)
                lineTo(s * .55f, s * .64f)
                lineTo(s * .66f, s * .55f)
                lineTo(s * .82f, s * .7f)
            }
            drawPath(hill, tint, style = Stroke(w, cap = StrokeCap.Round))
        }
        Icon.Off -> {
            drawCircle(tint, s * .3f, Offset(s * .5f, s * .5f), style = stroke)
            drawLine(tint, Offset(s * .26f, s * .26f), Offset(s * .74f, s * .74f), w, StrokeCap.Round)
        }
    }
}

private fun offsetCos(a: Double): Float = Math.cos(a).toFloat()
private fun offsetSin(a: Double): Float = Math.sin(a).toFloat()
