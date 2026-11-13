package com.lmplayer.android

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Typography
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.staticCompositionLocalOf
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.sp

/**
 * 界面配色。
 *
 * 不跟随桌面版的主题/皮肤体系：那套是给 Web 播放详情页的「沉浸式皮肤」设计的
 * （CSS 变量 + 大面积背景动效 + 每个主题一张样式表），原生版只保留
 * 「深色为主 + 单一强调色」的阅读节奏。
 *
 * 但**必须**跟随系统明暗：所以颜色不是常量，而是一份 [LmPalette]，
 * 由 [LmTheme] 按系统（或用户在设置里选的）模式通过 CompositionLocal 下发。
 * 早期版本把颜色写死成深色常量，结果在浅色系统上文字全是白的、看不见。
 */
data class LmPalette(
    val accent: Color,
    val accentSoft: Color,
    val bg: Color,
    val bgElevated: Color,
    val bgRaised: Color,
    val divider: Color,
    val textPrimary: Color,
    val textSecondary: Color,
    val textTertiary: Color,
    val danger: Color,
    val success: Color,
)

/**
 * 深色：底色压到近黑（不是深灰），层级只靠 5% 的明度差拉，不靠阴影。
 * 这是本地播放器的主流观感 —— 屏幕大部分面积让给封面，界面本身要退到后面去。
 */
val DarkPalette = LmPalette(
    accent = Color(0xFFB4A7F5),
    accentSoft = Color(0xFF2A2540),
    bg = Color(0xFF0B0B0C),
    bgElevated = Color(0xFF1A1A1C),
    bgRaised = Color(0xFF232326),
    divider = Color(0xFF26262A),
    textPrimary = Color(0xFFFFFFFF),
    textSecondary = Color(0xFFA8A8AD),
    textTertiary = Color(0xFF6E6E73),
    danger = Color(0xFFFF6B75),
    success = Color(0xFF5FD3A6),
)

val LightPalette = LmPalette(
    accent = Color(0xFF6A56E8),
    accentSoft = Color(0xFFE8E3FF),
    bg = Color(0xFFF6F6F8),
    bgElevated = Color(0xFFFFFFFF),
    bgRaised = Color(0xFFEDEDF1),
    divider = Color(0xFFE4E4EA),
    textPrimary = Color(0xFF111114),
    textSecondary = Color(0xFF55555C),
    textTertiary = Color(0xFF8A8A92),
    danger = Color(0xFFD3394A),
    success = Color(0xFF1F9D6B),
)

val LocalLmPalette = staticCompositionLocalOf { DarkPalette }

/** 取当前调色板；只能在 @Composable 里用。 */
object Lm {
    val cur: LmPalette
        @Composable get() = LocalLmPalette.current
}

private val DarkScheme = darkColorScheme(
    primary = DarkPalette.accent,
    onPrimary = Color.White,
    primaryContainer = DarkPalette.accentSoft,
    onPrimaryContainer = DarkPalette.textPrimary,
    background = DarkPalette.bg,
    onBackground = DarkPalette.textPrimary,
    surface = DarkPalette.bgElevated,
    onSurface = DarkPalette.textPrimary,
    surfaceVariant = DarkPalette.bgRaised,
    onSurfaceVariant = DarkPalette.textSecondary,
    outline = DarkPalette.divider,
    error = DarkPalette.danger,
)

private val LightScheme = lightColorScheme(
    primary = LightPalette.accent,
    onPrimary = Color.White,
    primaryContainer = LightPalette.accentSoft,
    onPrimaryContainer = Color(0xFF1B1240),
    background = LightPalette.bg,
    onBackground = LightPalette.textPrimary,
    surface = LightPalette.bgElevated,
    onSurface = LightPalette.textPrimary,
    surfaceVariant = LightPalette.bgRaised,
    onSurfaceVariant = LightPalette.textSecondary,
    outline = LightPalette.divider,
    error = LightPalette.danger,
)

/** 统一映射到 [LmText]，避免 Material 默认样式和自定义字号两套并存。 */
private val LmTypography = Typography().run {
    copy(
        headlineMedium = LmText.screenTitle,
        titleLarge = LmText.playerTitle,
        titleMedium = LmText.rowTitle,
        bodyLarge = LmText.rowTitle,
        bodyMedium = LmText.rowSub,
        bodySmall = LmText.caption,
        labelMedium = LmText.sectionLabel,
        labelSmall = LmText.caption,
    )
}

/**
 * @param themeMode 配置里的明暗模式：system | dark | light。
 * 早期版本直接跟 isSystemInDarkTheme()，用户改了设置也没反应。
 */
@Composable
fun LmTheme(themeMode: String = "system", content: @Composable () -> Unit) {
    val dark = when (themeMode) {
        "dark" -> true
        "light" -> false
        else -> isSystemInDarkTheme()
    }
    CompositionLocalProvider(LocalLmPalette provides if (dark) DarkPalette else LightPalette) {
        MaterialTheme(
            colorScheme = if (dark) DarkScheme else LightScheme,
            typography = LmTypography,
            content = content,
        )
    }
}
