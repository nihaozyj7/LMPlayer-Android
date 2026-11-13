package com.lmplayer.android

import androidx.compose.animation.core.CubicBezierEasing
import androidx.compose.animation.core.Easing
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.ui.graphics.Shape
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

/**
 * 设计刻度（唯一来源）。
 *
 * 之前间距、圆角、字号全是各文件里的字面量：18.dp / 12.dp / 14.5.sp 混着来，
 * 同一个视觉层级在不同屏幕上差 2~4dp，堆出来的结果就是「拼接感」。
 * 从这里以后，界面上所有尺寸只准引用本文件；新增页面也一样。
 */
object Dimens {
    // 8 点间距刻度
    val xs: Dp = 4.dp
    val s: Dp = 8.dp
    val m: Dp = 12.dp
    val l: Dp = 16.dp
    val xl: Dp = 20.dp
    val xxl: Dp = 24.dp
    val xxxl: Dp = 32.dp

    /** 页面左右内容边距：整个 App 只用这一个值，别处靠嵌套 padding 累加。 */
    val screenH: Dp = 16.dp

    // 结构件高度
    val topBar: Dp = 56.dp
    val toolbar: Dp = 44.dp
    val row: Dp = 68.dp
    val settingsRow: Dp = 60.dp
    val miniBar: Dp = 72.dp

    // 封面
    val coverRow: Dp = 48.dp
    val coverMini: Dp = 40.dp
    val coverSheet: Dp = 52.dp

    // 图标
    val iconL: Dp = 24.dp
    val iconM: Dp = 22.dp
    val iconS: Dp = 18.dp

    /** 命中区域边长：视觉图标 20~24dp，可点区域统一 44dp。 */
    val touch: Dp = 44.dp
    val touchS: Dp = 36.dp

    /** 正文与副标题之间的行内间距。 */
    val lineGap: Dp = 2.dp
}

object Radii {
    val small: Shape = RoundedCornerShape(6.dp)
    val cover: Shape = RoundedCornerShape(8.dp)
    val coverLarge: Shape = RoundedCornerShape(12.dp)
    val chip: Shape = RoundedCornerShape(12.dp)
    val card: Shape = RoundedCornerShape(20.dp)
    val sheet: Shape = RoundedCornerShape(topStart = 24.dp, topEnd = 24.dp)
    val circle: Shape = RoundedCornerShape(50)
}

object Motion {
    val standard: Easing = CubicBezierEasing(0.2f, 0f, 0f, 1f)
    val decel: Easing = CubicBezierEasing(0f, 0f, 0.2f, 1f)

    /** 按下反馈、图标切换。 */
    const val quick: Int = 140
    /** 页面进入、抽屉。 */
    const val normal: Int = 260
    /** 播放详情展开。 */
    const val expand: Int = 320
}

/**
 * 手势判定常量。
 *
 * 所有手势都用「位移 + 甩速」双判定：只按位移判定的话，快速轻扫会掉回原位，
 * 用户体感就是「灵敏度低、老是回弹」。fling 的单位是 px/s，与 Compose
 * draggable 交出的 velocity 一致。
 *
 * 取值依据：Android 触摸屏一次快速轻扫的正常离手速度在 800~3000 px/s，
 * 拖到一半松手约 0~400。取 320 就能明确区分「在拖」和「在甩」，
 * 而不受屏幕密度和手感差异影响。
 */
/**
 * 动效时长换算。
 *
 * 设置里的「动效速度」原来只被写进配置、没有任何地方读它 —— 三挡之所以
 * 感觉没区别，是因为全部时长都是写死的字面量。现在所有过渡时长都过一遍
 * 这里：关闭动效返回 0（直接跳变），否则按挡位缩放。
 *
 * 快 = 0.55 倍（转场更利落），慢 = 1.9 倍（能看清动画过程）。
 */
object Anim {
    @Volatile
    private var enabled = true

    @Volatile
    private var speed = "medium"

    /** 每次 AppRoot 重组都会调用（配置变了立刻生效，不用重启）。 */
    fun apply(c: AppConfig) {
        enabled = c.animations
        speed = c.animationsSpeed
    }

    fun ms(base: Int): Int {
        if (!enabled) return 0
        val f = when (speed) {
            "fast" -> 0.55f
            "slow" -> 1.9f
            else -> 1f
        }
        return (base * f).toInt().coerceAtLeast(1)
    }
}

object Swipe {
    /** 判定为「甩」的最小速度。取 200：轻微快速一划（约 400px/s）也能命中。 */
    const val fling: Float = 200f

    /** 封面横滑切歌的位移门槛（dp）。低于这个值只回弹，不切歌。 */
    const val coverStepDp: Float = 36f

    /** 底栏上滑展开的位移门槛（占屏高比例）。3% ≈ 72px，手指轻扫即生效。 */
    const val expandAt: Float = 0.03f

    /** 详情页下滑收起的位移门槛（占屏高比例）。5% ≈ 120px 就关。 */
    const val collapseAt: Float = 0.05f
}

/**
 * 文字样式。
 *
 * 中文排版和英文不一样：同一 sp 下中文的视觉重量更重、行高要给足，
 * 所以这里每级都显式写了 lineHeight，不要再用 Typography() 的默认值。
 */
object LmText {
    /** 设置页/二级页顶部大标题。 */
    val screenTitle = TextStyle(
        fontSize = 24.sp, lineHeight = 32.sp,
        fontWeight = FontWeight.SemiBold, letterSpacing = 0.2.sp,
    )

    /** 主页顶部栏标题「歌曲」。 */
    val topBarTitle = TextStyle(
        fontSize = 20.sp, lineHeight = 28.sp,
        fontWeight = FontWeight.SemiBold, letterSpacing = 0.3.sp,
    )

    /** 列表主文字：歌名、设置项。 */
    val rowTitle = TextStyle(
        fontSize = 17.sp, lineHeight = 24.sp,
        fontWeight = FontWeight.Medium, letterSpacing = 0.1.sp,
    )

    /** 列表次文字：歌手、专辑、说明。 */
    val rowSub = TextStyle(
        fontSize = 13.sp, lineHeight = 18.sp,
        fontWeight = FontWeight.Normal, letterSpacing = 0.1.sp,
    )

    /** 分组小标题。 */
    val sectionLabel = TextStyle(
        fontSize = 13.sp, lineHeight = 18.sp,
        fontWeight = FontWeight.Medium, letterSpacing = 0.4.sp,
    )

    /** 播放详情页歌名。 */
    val playerTitle = TextStyle(
        fontSize = 22.sp, lineHeight = 30.sp,
        fontWeight = FontWeight.Bold, letterSpacing = 0.2.sp,
    )

    /** 时间、计数等数字。 */
    val caption = TextStyle(
        fontSize = 12.sp, lineHeight = 16.sp,
        fontWeight = FontWeight.Normal, letterSpacing = 0.3.sp,
    )

    val lyricActive = TextStyle(
        fontSize = 19.sp, lineHeight = 30.sp,
        fontWeight = FontWeight.SemiBold, letterSpacing = 0.2.sp,
    )

    val lyricIdle = TextStyle(
        fontSize = 17.sp, lineHeight = 30.sp,
        fontWeight = FontWeight.Normal, letterSpacing = 0.2.sp,
    )
}
