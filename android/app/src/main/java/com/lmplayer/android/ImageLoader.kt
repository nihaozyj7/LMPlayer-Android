package com.lmplayer.android

import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.util.LruCache
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import java.net.HttpURLConnection
import java.net.URL

/**
 * 封面加载器。
 *
 * 后端已经做了内容寻址缓存（/cover/<hash>），这里只负责「把 URL 变成 Bitmap」
 * 并做一层内存 LRU —— 列表里同一张专辑封面会出现几十次，没有 LRU 就会每次滚动
 * 都重新解一遍图。故意不引 Coil：一条 HTTP + BitmapFactory 就够了，
 * 少一个几 MB 的依赖，冷启动也少一批类加载。
 */
object ImageLoader {
    private val cache = object : LruCache<String, Bitmap>(24 * 1024 * 1024) {
        override fun sizeOf(key: String, value: Bitmap): Int = value.byteCount
    }

    suspend fun load(url: String): Bitmap? {
        if (url.isBlank()) return null
        cache.get(url)?.let { return it }
        // data URL：自动/手动匹配来的封面就是这种形态（CoverService.CachedPreviews
        // 给的是 base64）。它既不该拼 baseUrl 也不该走 HTTP。
        if (url.startsWith("data:")) {
            return withContext(Dispatchers.IO) {
                runCatching { decodeDataUrl(url) }.getOrNull()?.also { cache.put(url, it) }
            }
        }
        return withContext(Dispatchers.IO) {
            runCatching {
                val conn = URL(url).openConnection() as HttpURLConnection
                conn.connectTimeout = 4000
                conn.readTimeout = 6000
                conn.inputStream.use { BitmapFactory.decodeStream(it) }
            }.getOrNull()?.also { cache.put(url, it) }
        }
    }

    private fun decodeDataUrl(url: String): Bitmap? {
        val comma = url.indexOf(',')
        if (comma < 0) return null
        val meta = url.substring(5, comma)
        if (!meta.contains("base64", ignoreCase = true)) return null
        val bytes = android.util.Base64.decode(url.substring(comma + 1), android.util.Base64.DEFAULT)
        return BitmapFactory.decodeByteArray(bytes, 0, bytes.size)
    }

    /**
     * 相对地址拼上后端端口。**data: 与 http(s): 一律原样返回** ——
     * 少了 data: 这一条，自动匹配到的封面会被拼成
     * `http://127.0.0.1:端口data:image/jpeg;base64,…`，永远加载失败，
     * 表现就是「匹配成功但列表里还是默认封面」。
     */
    fun absolute(url: String): String =
        if (url.isBlank() || url.startsWith("http") || url.startsWith("data:")) url
        else Bridge.baseUrl() + url
}

/** 把 song.coverUrl 变成一张 Bitmap（没有封面时为 null）。 */
@Composable
fun rememberCover(url: String?, key: Any? = url): Bitmap? {
    // 不能随 key 重置为 null：切歌那一瞬间新封面还在解码/正在下载，
    // 先回 null 就会闪一下「默认渐变 + 音符图标」，看起来像封面丢了。
    // 保留上一张直到新图就绪，是播放器封面的通用做法。
    var bmp by remember { mutableStateOf<Bitmap?>(null) }
    LaunchedEffect(key, url) {
        val full = ImageLoader.absolute(url ?: "")
        if (full.isBlank()) {
            bmp = null
            return@LaunchedEffect
        }
        val got = ImageLoader.load(full)
        // 加载失败只在日志里留一条：界面上它就是「默认封面」，没有这条线索
        // 排查时完全看不出是「没匹配到」还是「匹配到了但解不出来」。
        if (got == null) {
            android.util.Log.w("LMImg", "load failed: prefix=" + full.take(40) + " len=" + full.length)
        }
        got?.let { bmp = it }
    }
    return bmp
}
