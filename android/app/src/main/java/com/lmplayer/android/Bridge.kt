package com.lmplayer.android

import android.os.Handler
import android.os.Looper
import android.util.Log
import com.lmplayer.core.mobile.Mobile
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import org.json.JSONArray
import org.json.JSONObject
import org.json.JSONTokener
import java.util.concurrent.CopyOnWriteArrayList

/**
 * Go 后端的直连桥。
 *
 * 界面是原生的，没必要再绕一趟 loopback HTTP：gomobile 生成的 AAR 允许 Kotlin
 * 直接调进 Go，参数与返回值都是 JSON 文本（和 /rpc 完全同一套协议），
 * 所以两边的方法名、字段名永远一致，不存在「原生一套、网页一套」的分叉。
 */
object Bridge {
    private const val TAG = "LMBridge"

    /** 事件回调一律在主线程分发，订阅方不用自己切线程。 */
    private var main: Handler? = null
    private val listeners = CopyOnWriteArrayList<(String, JSONObject?) -> Unit>()

    @Volatile
    private var base = ""

    /** 后端启动后调用一次：挂事件监听、记住媒体服务地址。 */
    fun attach(baseUrl: String) {
        base = baseUrl
        main = Handler(Looper.getMainLooper())
        Mobile.setListener(object : com.lmplayer.core.mobile.Listener {
            override fun onEvent(name: String, dataJSON: String) {
                val data = runCatching { JSONTokener(dataJSON).nextValue() as? JSONObject }.getOrNull()
                main?.post { listeners.forEach { runCatching { it(name, data) } } }
            }
        })
    }

    fun baseUrl(): String = base

    fun onEvent(l: (String, JSONObject?) -> Unit) {
        listeners.add(l)
    }

    fun offEvent(l: (String, JSONObject?) -> Unit) {
        listeners.remove(l)
    }

    /**
     * 调一个服务方法。args 支持 null / Boolean / Number / String / JSONObject /
     * JSONArray / Collection，其余类型用 toString()。
     */
    suspend fun call(name: String, vararg args: Any?): Any? = withContext(Dispatchers.IO) {
        val arr = JSONArray()
        for (a in args) arr.put(wrap(a))
        val raw = try {
            Mobile.rpc(name, arr.toString())
        } catch (t: Throwable) {
            throw BridgeError("$name 调用失败: ${t.message}")
        }
        if (raw.isNullOrBlank()) return@withContext null
        val obj = JSONTokener(raw).nextValue() as? JSONObject
            ?: throw BridgeError("$name 返回的不是对象")
        if (obj.has("error") && !obj.isNull("error")) {
            throw BridgeError(obj.optString("error"))
        }
        val r = obj.opt("result")
        if (r === JSONObject.NULL) null else r
    }

    /** 调一个返回值为对象的方法，缺字段时返回空对象而不是抛异常。 */
    suspend fun callObj(name: String, vararg args: Any?): JSONObject =
        (call(name, *args) as? JSONObject) ?: JSONObject()

    /** 调一个返回值为数组的方法。 */
    suspend fun callArray(name: String, vararg args: Any?): JSONArray =
        (call(name, *args) as? JSONArray) ?: JSONArray()

    private fun wrap(a: Any?): Any = when (a) {
        null -> JSONObject.NULL
        is JSONObject, is JSONArray -> a
        is Number, is Boolean, is String -> a
        is Collection<*> -> JSONArray().also { arr -> a.forEach { arr.put(wrap(it)) } }
        is Map<*, *> -> JSONObject().also { o -> a.forEach { (k, v) -> o.put(k.toString(), wrap(v)) } }
        else -> a.toString()
    }

    /** 后端的调用成功但业务失败，message 是 Go 侧的错误文本。 */
    class BridgeError(message: String) : Exception(message)
}

/* ------------------------------------------------------------------ JSON 取值 */

fun JSONObject.str(key: String, def: String = ""): String =
    if (isNull(key)) def else optString(key, def)

fun JSONObject.long(key: String, def: Long = 0L): Long =
    if (isNull(key)) def else optLong(key, def)

fun JSONObject.int(key: String, def: Int = 0): Int =
    if (isNull(key)) def else optInt(key, def)

fun JSONObject.dbl(key: String, def: Double = 0.0): Double =
    if (isNull(key)) def else optDouble(key, def)

fun JSONObject.bool(key: String, def: Boolean = false): Boolean =
    if (isNull(key)) def else optBoolean(key, def)

fun JSONObject.obj(key: String): JSONObject? =
    if (isNull(key)) null else optJSONObject(key)

fun JSONObject.arr(key: String): JSONArray =
    if (isNull(key)) JSONArray() else (optJSONArray(key) ?: JSONArray())

fun JSONArray.objects(): List<JSONObject> =
    (0 until length()).mapNotNull { optJSONObject(it) }

fun JSONArray.strings(): List<String> =
    (0 until length()).mapNotNull { if (isNull(it)) null else optString(it) }

/** 后端日志里能看到调用耗时，排查「卡在哪一次 RPC」时不用再猜。 */
suspend fun timedCall(name: String, vararg args: Any?): Any? {
    val t0 = System.nanoTime()
    try {
        return Bridge.call(name, *args)
    } finally {
        val ms = (System.nanoTime() - t0) / 1_000_000
        if (ms > 120) Log.w("LMBridge", "$name 耗时 ${ms}ms")
    }
}
