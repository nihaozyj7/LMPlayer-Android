package com.lmplayer.android

import android.content.Context
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow

/**
 * 「从曲库移除」的歌。
 *
 * 只记 songID，既不动磁盘文件、也不调后端的删除接口。用户的诉求是列表里
 * 别再出现这首歌，而物理删除是不可撤销的：误点一次文件就没了。所以这里
 * 做成一张本地排除表 —— 曲库照常扫描到这些文件，只是展示时跳过这些 id，
 * 随时能在 设置 → 曲库 → 已隐藏的歌曲 里放回来。
 */
object Hidden {
    private const val PREFS = "lm_hidden"
    private const val KEY_IDS = "ids"

    private val _ids = MutableStateFlow<Set<String>>(emptySet())
    val ids: StateFlow<Set<String>> = _ids.asStateFlow()

    private var prefs: android.content.SharedPreferences? = null

    fun init(ctx: Context) {
        if (prefs != null) return
        val p = ctx.getSharedPreferences(PREFS, Context.MODE_PRIVATE)
        prefs = p
        // getStringSet 返回的集合不保证可变，复制一份再存
        _ids.value = p.getStringSet(KEY_IDS, emptySet())?.toSet() ?: emptySet()
    }

    fun hide(songId: String) = update(_ids.value + songId)

    fun unhide(songId: String) = update(_ids.value - songId)

    fun clear() = update(emptySet())

    fun value(): Set<String> = _ids.value

    private fun update(next: Set<String>) {
        _ids.value = next
        prefs?.edit()?.putStringSet(KEY_IDS, next)?.apply()
    }
}
