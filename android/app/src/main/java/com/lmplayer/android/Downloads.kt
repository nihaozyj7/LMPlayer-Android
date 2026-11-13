package com.lmplayer.android

import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import org.json.JSONObject

/**
 * 一条下载任务的快照（字段与 Go 侧 DownloadTask 一一对应）。
 *
 * 为什么要镜像整份任务而不是只看「在不在下载」：
 * 搜索页要把「点了下载之后到底怎么了」说清楚 —— 排队中、百分之几、失败了
 * 为什么失败、下完了落到哪个路径。这些都不是一个布尔能表达的。
 */
data class DownloadTask(
    val id: String,
    val bvid: String,
    val title: String,
    val state: String,
    val done: Long,
    val total: Long,
    val path: String,
    val dir: String,
    val message: String,
    val durationMs: Long,
    val startedAt: Long,
    val finishedAt: Long,
) {
    val running: Boolean get() = state == "running"
    val failed: Boolean get() = state == "failed"
    val ok: Boolean get() = state == "done"

    /** 0..1；总长未知（服务端没给 Content-Length）时保持 0。 */
    val progress: Float
        get() = if (total > 0) (done.toFloat() / total).coerceIn(0f, 1f) else 0f

    /** 状态短句：面板与搜索页共用同一套说法。 */
    val statusText: String
        get() = when {
            running && total > 0 -> "${(progress * 100).toInt()}%"
            running -> "下载中"
            ok -> "已完成"
            failed -> message.ifBlank { "下载失败" }
            else -> state
        }

    companion object {
        fun from(o: JSONObject) = DownloadTask(
            id = o.str("id"),
            bvid = o.str("bvid"),
            title = o.str("title", o.str("bvid")),
            state = o.str("state"),
            done = o.long("done"),
            total = o.long("total"),
            path = o.str("path"),
            dir = o.str("dir"),
            message = o.str("message"),
            durationMs = o.long("duration"),
            startedAt = o.long("startedAt"),
            finishedAt = o.long("finishedAt"),
        )
    }
}

/**
 * 下载任务中心。
 *
 * 数据来源只有两个：打开时拉一次 DownloadService.Tasks，之后靠
 * `download:tasks` 事件整份替换（Go 侧有意推整份快照，前端不做增量合并，
 * 见 services_download.go#emitTasks 的注释）。
 *
 * 为什么单独一个对象而不是塞进 Store：下载任务只在「下载队列面板」和
 * 「搜索结果行」两处被读，塞进 UiState 会让每次进度事件都刷新整个主页列表
 * （List<Song> 的相等性要逐首比对，几十次/秒）。这里单独一条 StateFlow，
 * 只有订阅了它的 composable 会重组。
 */
object Downloads {
    private val _tasks = MutableStateFlow<List<DownloadTask>>(emptyList())
    val tasks: StateFlow<List<DownloadTask>> = _tasks.asStateFlow()

    private val _active = MutableStateFlow(0)
    /** 正在下载的条数（抽屉角标用）。 */
    val active: StateFlow<Int> = _active.asStateFlow()

    /** 最近一次操作给用户的提示（搜索页顶部条）。 */
    private val _hint = MutableStateFlow("")
    val hint: StateFlow<String> = _hint.asStateFlow()

    private var hooked = false

    /** 由 Store.start() 调用一次。 */
    fun start() {
        if (hooked) return
        hooked = true
        Bridge.onEvent { name, data ->
            if (name == "download:tasks") {
                apply(data)
            } else if (name == "download:failed") {
                val msg = data?.str("message") ?: "下载失败"
                _hint.value = "下载失败：$msg"
            }
        }
        refresh()
    }

    fun hint(text: String) {
        _hint.value = text
    }

    fun clearHint() {
        _hint.value = ""
    }

    private fun apply(data: JSONObject?) {
        if (data == null) return
        val list = data.arr("tasks").objects().map(DownloadTask::from)
        _tasks.value = list
        _active.value = data.int("active", list.count { it.running })
    }

    /** 拉一次全量任务（面板打开、或事件丢失后兜底刷新）。 */
    fun refresh() {
        kotlinx.coroutines.MainScope().launch {
            runCatching { Bridge.callObj("DownloadService.Tasks") }
                .onSuccess { apply(it) }
        }
    }

    fun clearFinished() {
        kotlinx.coroutines.MainScope().launch {
            runCatching { Bridge.callObj("DownloadService.ClearFinished") }
                .onSuccess { apply(it) }
        }
    }

    /** 某首歌（按 bvid）当前的任务，没有就 null。 */
    fun taskOf(bvid: String): DownloadTask? = _tasks.value.firstOrNull { it.bvid == bvid }

    /**
     * 开始下载一首在线曲目。
     *
     * 返回给用户看的一句话：成功是「已加入下载队列」，失败要把原因带上 ——
     * 以前这里只有「已加入下载」，但后端拒绝时（已在任务中、目录不可写）
     * 界面上什么都不会变，用户只能看到按钮点了没反应。
     */
    fun startDownload(t: OnlineTrack) {
        kotlinx.coroutines.MainScope().launch {
            try {
                val r = Bridge.callObj("DownloadService.Start", t.bvid, t.title, t.durationMs)
                if (r.bool("started", true)) {
                    _hint.value = "已加入下载队列：《${t.title}》"
                } else {
                    val reason = r.str("reason", "已在任务中")
                    val why = if (reason == "already-running") "这首已经在下载队列里" else reason
                    _hint.value = "没有开始下载：《${t.title}》（$why）"
                }
            } catch (e: Throwable) {
                _hint.value = "下载失败：《${t.title}》 —— " + (e.message ?: "未知错误")
            }
            refresh()
        }
    }
}
