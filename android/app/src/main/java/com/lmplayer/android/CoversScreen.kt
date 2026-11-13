package com.lmplayer.android

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Switch
import androidx.compose.material3.SwitchDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.draw.clip
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import kotlinx.coroutines.Job
import kotlinx.coroutines.launch

/**
 * 封面匹配工作台。
 *
 * 上一版只有一个「自动匹配缺失封面」的按钮：点下去屏幕上一行小字，几十首
 * 跑完才知道结果，而且**哪首失败、为什么失败**一概看不到 —— 用户的实际
 * 反馈就是「匹配成功却没看见效果」。问题有两半：
 *
 *  1. 没有逐首的可见状态；
 *  2. 匹配到的封面写在 covercache 里，而列表读的是文件内嵌封面，
 *     所以「成功」了界面上也可能是旧图（这条在 Covers.imageFor 修掉了）。
 *
 * 所以这里做成一张逐首列表：每行显示当前生效的缩略图 + 状态 + 失败原因，
 * 并且允许单独重匹某一首。
 */

private enum class CoverState { Covered, Pending, Running, Ok, Fail }

private data class CoverRow(
    val state: CoverState,
    val note: String = "",
)

@Composable
fun CoversBody() {
    val lib by Store.state.collectAsState()
    // 订阅覆盖表：匹配成功后缩略图要在这一页立刻变，而不是等退出重进
    val overrides by Covers.overrides.collectAsState()
    // 后台自动补齐（AutoFill）的进度与开关
    val fill by AutoFill.state.collectAsState()
    val autoCover by AutoFill.coverOn.collectAsState()
    val autoLyric by AutoFill.lyricOn.collectAsState()

    val scope = rememberCoroutineScope()
    var results by remember { mutableStateOf<Map<String, CoverRow>>(emptyMap()) }
    var running by remember { mutableStateOf(false) }
    var job by remember { mutableStateOf<Job?>(null) }
    var message by remember { mutableStateOf("") }
    var done by remember { mutableIntStateOf(0) }
    var total by remember { mutableIntStateOf(0) }

    val songs = lib.songs

    fun stateOf(song: Song): CoverRow {
        results[song.id]?.let { return it }
        return if (Covers.hasCover(song)) CoverRow(CoverState.Covered, "已有封面")
        else CoverRow(CoverState.Pending, "还没有封面")
    }

    fun matchOneAsync(song: Song) {
        if (running) return
        scope.launch {
            running = true
            results = results + (song.id to CoverRow(CoverState.Running, "匹配中…"))
            val ok = runCatching { Covers.matchOne(song) }.getOrDefault(false)
            results = results + (
                song.id to CoverRow(
                    if (ok) CoverState.Ok else CoverState.Fail,
                    if (ok) "已匹配" else Covers.lastMessage.ifBlank { "没有候选封面" },
                )
                )
            Covers.refreshOverrides()
            running = false
        }
    }

    fun startBatch(targets: List<Song>, label: String) {
        if (running || targets.isEmpty()) {
            if (targets.isEmpty()) message = "没有需要处理的歌曲"
            return
        }
        total = targets.size
        done = 0
        message = ""
        running = true
        job = scope.launch {
            var okCount = 0
            for (s in targets) {
                results = results + (s.id to CoverRow(CoverState.Running, "匹配中…"))
                val ok = runCatching { Covers.matchOne(s) }.getOrDefault(false)
                if (ok) okCount++
                results = results + (
                    s.id to CoverRow(
                        if (ok) CoverState.Ok else CoverState.Fail,
                        if (ok) "已匹配" else Covers.lastMessage.ifBlank { "没有候选封面" },
                    )
                    )
                done += 1
                // 每 5 首刷一次：逐首刷会让大曲库反复做「曲库 + 覆盖表」两次往返
                if (done % 5 == 0) Covers.refreshOverrides()
            }
            Covers.refreshOverrides()
            running = false
            job = null
            message = "$label 完成：成功 $okCount 首，${targets.size - okCount} 首没找到"
        }
    }

    val missing = songs.filter { !Covers.hasCover(it) }
    val covered = songs.size - missing.size

    Column(Modifier.fillMaxSize()) {
        LazyColumn(Modifier.fillMaxSize()) {
            item(key = "head") {
                Column(Modifier.padding(horizontal = 20.dp)) {
                    Text(
                        "曲库 ${songs.size} 首 · 已有封面 $covered 首 · 缺 ${missing.size} 首",
                        color = Lm.cur.textSecondary,
                        fontSize = 13.sp,
                    )
                    Spacer(Modifier.height(6.dp))
                    Text(
                        "自动匹配命中不了很正常（视频标题、同名版本），所以点任意一行都能" +
                            "自己改关键词挑一张；这里显示成什么样，列表里就是什么样。",
                        color = Lm.cur.textTertiary,
                        fontSize = 11.5.sp,
                    )
                    Spacer(Modifier.height(14.dp))
                    Text("自动补齐", color = Lm.cur.textPrimary, fontSize = 14.sp, fontWeight = FontWeight.SemiBold)
                    Spacer(Modifier.height(4.dp))
                    Text(
                        fill.text.ifBlank {
                            "曲库就绪后自动帮缺封面 / 缺歌词的歌联网匹配，不用手动点。"
                        },
                        color = if (fill.running) Lm.cur.accent else Lm.cur.textTertiary,
                        fontSize = 11.5.sp,
                    )
                    Spacer(Modifier.height(2.dp))
                    AutoToggleRow("没有封面时自动匹配", autoCover) { AutoFill.setCoverAuto(it) }
                    AutoToggleRow("没有歌词时自动匹配", autoLyric) { AutoFill.setLyricAuto(it) }
                    Spacer(Modifier.height(4.dp))
                    MiniAction(
                        if (fill.running) "重新检查（会打断当前）" else "立即补齐一次",
                        enabled = songs.isNotEmpty(),
                    ) { AutoFill.retryAll() }
                    Spacer(Modifier.height(12.dp))
                    Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        MiniAction(
                            "匹配缺失（${missing.size}）",
                            enabled = !running && missing.isNotEmpty(),
                        ) { startBatch(missing, "匹配缺失") }
                        MiniAction(
                            "全部重匹",
                            enabled = !running && songs.isNotEmpty(),
                        ) { startBatch(songs, "全部重匹") }
                        if (running) {
                            MiniAction("停止", enabled = true) {
                                job?.cancel()
                                job = null
                                running = false
                                message = "已停止（匹配好的不会回滚）"
                                results = results.mapValues { (_, r) ->
                                    if (r.state == CoverState.Running) CoverRow(CoverState.Pending, "已取消") else r
                                }
                            }
                        }
                    }
                    if (running) {
                        Spacer(Modifier.height(10.dp))
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            CircularProgressIndicator(
                                color = Lm.cur.accent,
                                strokeWidth = 2.dp,
                                modifier = Modifier.size(14.dp),
                            )
                            Spacer(Modifier.width(8.dp))
                            Text("正在匹配 $done/$total", color = Lm.cur.accent, fontSize = 12.5.sp)
                        }
                    }
                    if (message.isNotBlank()) {
                        Spacer(Modifier.height(8.dp))
                        Text(message, color = Lm.cur.textTertiary, fontSize = 12.sp)
                    }
                    Spacer(Modifier.height(14.dp))
                }
                HorizontalDivider(color = Lm.cur.divider)
            }

            // key 里带上覆盖表的长度：某首换过封面后 key 变化，这一行才会真的重组
            items(songs, key = { it.id + "#" + (overrides[it.id]?.length ?: 0) }) { song ->
                val st = stateOf(song)
                Row(
                    Modifier
                        .fillMaxWidth()
                        // 点整行进手动面板（改关键词、挑候选），自动重匹挪到右侧小按钮：
                        // 之前点一行就是一次不可控的联网匹配，搜错了也没法纠正。
                        .clickable(enabled = !running) { CoverPanel.open(song) }
                        .padding(start = 20.dp, end = 16.dp, top = 8.dp, bottom = 8.dp),
                    verticalAlignment = Alignment.CenterVertically,
                ) {
                    Cover(
                        Covers.imageFor(song),
                        Dimens.coverRow,
                        Radii.cover,
                        active = false,
                    )
                    Spacer(Modifier.width(12.dp))
                    Column(Modifier.weight(1f)) {
                        Text(
                            song.displayTitle,
                            color = Lm.cur.textPrimary,
                            fontSize = 15.sp,
                            maxLines = 1,
                            overflow = TextOverflow.Ellipsis,
                        )
                        Spacer(Modifier.height(2.dp))
                        Text(
                            st.note,
                            color = when (st.state) {
                                CoverState.Ok -> Lm.cur.accent
                                CoverState.Fail -> Lm.cur.danger
                                CoverState.Covered -> Lm.cur.success
                                CoverState.Running -> Lm.cur.accent
                                CoverState.Pending -> Lm.cur.textTertiary
                            },
                            fontSize = 11.5.sp,
                            maxLines = 2,
                            overflow = TextOverflow.Ellipsis,
                        )
                    }
                    if (st.state == CoverState.Running) {
                        CircularProgressIndicator(
                            color = Lm.cur.accent,
                            strokeWidth = 2.dp,
                            modifier = Modifier.size(16.dp),
                        )
                    } else {
                        Text(
                            when (st.state) {
                                CoverState.Covered -> "重匹"
                                CoverState.Ok -> "重匹"
                                CoverState.Fail -> "重试"
                                else -> "匹配"
                            },
                            color = Lm.cur.textTertiary,
                            fontSize = 12.sp,
                            modifier = Modifier
                                .clip(RoundedCornerShape(12.dp))
                                .clickable(enabled = !running) { matchOneAsync(song) }
                                .padding(horizontal = 10.dp, vertical = 8.dp),
                        )
                    }
                }
                HorizontalDivider(color = Lm.cur.divider, modifier = Modifier.padding(start = 20.dp))
            }

            item(key = "tail") { Spacer(Modifier.height(24.dp)) }
        }
    }
}

@Composable
private fun MiniAction(text: String, enabled: Boolean, onClick: () -> Unit) {
    Box(
        Modifier
            .height(34.dp)
            .clip(RoundedCornerShape(17.dp))
            .background(if (enabled) Lm.cur.accent else Lm.cur.bgRaised)
            .clickable(enabled = enabled, onClick = onClick)
            .padding(horizontal = 14.dp),
        contentAlignment = Alignment.Center,
    ) {
        Text(
            text,
            color = if (enabled) Lm.cur.bgElevated else Lm.cur.textTertiary,
            fontSize = 13.sp,
            fontWeight = FontWeight.Medium,
        )
    }
}

/** 自动补齐的开关行（跟设置页的 ToggleRow 同一个视觉：标题在左、开关在右）。 */
@Composable
private fun AutoToggleRow(title: String, checked: Boolean, onChange: (Boolean) -> Unit) {
    Row(
        Modifier
            .fillMaxWidth()
            .height(40.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Text(title, color = Lm.cur.textPrimary, fontSize = 13.5.sp, modifier = Modifier.weight(1f))
        Switch(
            checked = checked,
            onCheckedChange = onChange,
            modifier = Modifier.size(width = 40.dp, height = 24.dp),
            colors = SwitchDefaults.colors(
                checkedThumbColor = Color.White,
                checkedTrackColor = Lm.cur.accent,
            ),
        )
    }
}
