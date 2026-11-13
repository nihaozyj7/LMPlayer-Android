package com.lmplayer.android

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.lazy.rememberLazyListState
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.runtime.rememberCoroutineScope
import kotlin.math.roundToInt
import kotlinx.coroutines.launch
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

/**
 * 播放详情页的四个面板：定时 / 歌词 / 音效 / 更多。
 *
 * 详情页第一排按钮（喜欢 定时 歌词 音效 更多）与桌面版底栏一一对应，
 * 每个按钮点开的都是移动端标准做法 —— 底部面板，而不是二级页面。
 */

/* ------------------------------------------------------------------ 通用件 */

@Composable
internal fun PanelTitle(
    text: String,
    onClose: () -> Unit,
    onBack: (() -> Unit)? = null,
    /** 标题栏右侧、关闭按钮左边的附加操作（如歌词面板的「在线匹配」）。 */
    actions: (@Composable () -> Unit)? = null,
) {
    Row(
        Modifier.fillMaxWidth().padding(start = Dimens.xl, end = Dimens.s, top = Dimens.s, bottom = Dimens.m),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        if (onBack != null) {
            IconButtonBox(onBack, 36) { LmIcon(Icon.Back, Dimens.iconS, Lm.cur.textSecondary) }
            Spacer(Modifier.width(4.dp))
        }
        Text(text, color = Lm.cur.textPrimary, style = LmText.rowTitle, fontWeight = FontWeight.SemiBold)
        Spacer(Modifier.weight(1f))
        if (actions != null) {
            actions()
            Spacer(Modifier.width(4.dp))
        }
        IconButtonBox(onClose, 36) { LmIcon(Icon.Close, Dimens.iconS, Lm.cur.textSecondary) }
    }
}

@Composable
private fun PickChip(text: String, active: Boolean, modifier: Modifier = Modifier, onClick: () -> Unit) {
    Box(
        modifier
            .height(38.dp)
            .clip(RoundedCornerShape(19.dp))
            .background(if (active) Lm.cur.accent else Lm.cur.bgRaised)
            .clickable(onClick = onClick),
        contentAlignment = Alignment.Center,
    ) {
        Text(
            text,
            color = if (active) Lm.cur.bgElevated else Lm.cur.textSecondary,
            fontSize = 13.sp,
            fontWeight = if (active) FontWeight.SemiBold else FontWeight.Normal,
        )
    }
}

/* ------------------------------------------------------------ 定时停止 */

@Composable
fun SleepSheet(state: PlayerState, onDismiss: () -> Unit) {
    // 滑块的值就是分钟数，0 = 关闭。步进 5 分钟，上限 120。
    var minutes by remember {
        mutableIntStateOf(
            if (state.sleepRemainMs > 0) {
                ((state.sleepRemainMs / 60_000L).toInt() / 5 * 5).coerceIn(5, 120)
            } else 0
        )
    }
    var afterTrack by remember { mutableStateOf(state.sleepAfterTrack) }
    // 拖动过程中的预览值（松手才真正设给播放器）
    var preview by remember { mutableStateOf<Int?>(null) }

    fun apply(m: Int, at: Boolean) {
        minutes = m
        afterTrack = at
        Player.setSleepTimer(m, at)
    }

    val shownMinutes = preview ?: minutes

    Sheet(onDismiss) { dismiss ->
        Column(Modifier.fillMaxWidth().padding(bottom = Dimens.xl)) {
            PanelTitle("定时停止", dismiss)
            Column(Modifier.padding(horizontal = Dimens.xl)) {
                Text(
                    when {
                        state.sleepArmed -> "本首播完就停"
                        state.sleepRemainMs > 0 && afterTrack -> "还有 ${remainText(state.sleepRemainMs)} 停止（等这首播完）"
                        state.sleepRemainMs > 0 -> "还有 ${remainText(state.sleepRemainMs)} 自动暂停"
                        else -> "到点自动暂停播放，适合睡前听"
                    },
                    color = if (state.sleepRemainMs > 0 || state.sleepArmed) Lm.cur.accent else Lm.cur.textSecondary,
                    style = LmText.rowSub,
                )
                Spacer(Modifier.height(Dimens.l))

                // 滑块选时长：点一下或拖，松手立即生效（不需要再点「确定」）
                Row(Modifier.fillMaxWidth(), verticalAlignment = Alignment.CenterVertically) {
                    Text(
                        if (shownMinutes == 0) "关闭" else "${shownMinutes} 分钟",
                        color = Lm.cur.textPrimary,
                        style = LmText.playerTitle,
                    )
                    Spacer(Modifier.weight(1f))
                    if (shownMinutes > 0) {
                        Text(
                            "点一下停止键可取消",
                            color = Lm.cur.textTertiary,
                            style = LmText.caption,
                        )
                    }
                }
                LmProgressBar(
                    progress = shownMinutes / 120f,
                    onPreview = { f -> preview = if (f == null) null else snapMinutes(f) },
                    onSeek = { f -> preview = null; apply(snapMinutes(f), afterTrack) },
                )
                Row(Modifier.fillMaxWidth()) {
                    listOf(0, 30, 60, 90, 120).forEachIndexed { idx, m ->
                        if (idx > 0) Spacer(Modifier.weight(1f))
                        Text(
                            if (m == 0) "关" else "$m",
                            color = Lm.cur.textTertiary,
                            style = LmText.caption,
                        )
                    }
                }

                Spacer(Modifier.height(Dimens.m))

                // 「等这首播完再停」：到点时如果还在放，就不在句子中间掐断声音，
                // 而是等当前曲目自然结束。实现见 Player.tickSleepTimer / onCompletion。
                Row(Modifier.fillMaxWidth()) {
                    PickChip(
                        "播完这首再停",
                        afterTrack && minutes > 0,
                        Modifier.weight(1f),
                    ) {
                        if (minutes == 0) apply(30, true) else apply(minutes, !afterTrack)
                    }
                }
                Spacer(Modifier.height(Dimens.s))
                Text(
                    "开启后，到点时若当前歌曲还没放完，会等它自然播完再停，不会切到下一首。",
                    color = Lm.cur.textTertiary,
                    style = LmText.caption,
                )
                Spacer(Modifier.height(Dimens.m))
                Row(Modifier.fillMaxWidth()) {
                    PickChip("关闭定时", state.sleepRemainMs <= 0L && !state.sleepArmed, Modifier.weight(1f)) {
                        apply(0, false)
                    }
                }
            }
        }
    }
}

/** 把 0~1 的滑块位置吸到 5 分钟刻度上。 */
private fun snapMinutes(f: Float): Int {
    val raw = (f.coerceIn(0f, 1f) * 120f / 5f).roundToInt() * 5
    return raw.coerceIn(0, 120)
}

private fun remainText(ms: Long): String {
    val total = (ms / 1000).coerceAtLeast(0)
    return "%d:%02d".format(total / 60, total % 60)
}

/* ---------------------------------------------------------------- 音效 */

@Composable
fun EffectSheet(state: PlayerState, onDismiss: () -> Unit) {
    Sheet(onDismiss) { dismiss ->
        Column(
            Modifier
                .fillMaxWidth()
                // 音效面板现在有音量 / 倍速 / 响度均衡三块，小屏上会超过一屏，
                // 给它一个上限 + 内部滚动，不然底部按钮会被顶出屏幕。
                .heightIn(max = 460.dp)
                .verticalScroll(rememberScrollState())
                .padding(bottom = Dimens.xl)
        ) {
            PanelTitle("音效", dismiss)
            Column(Modifier.padding(horizontal = Dimens.xl)) {
                Row(Modifier.fillMaxWidth(), verticalAlignment = Alignment.CenterVertically) {
                    Text("音量", color = Lm.cur.textSecondary, style = LmText.rowSub)
                    Spacer(Modifier.weight(1f))
                    Text("${(state.volume * 100).toInt()}%", color = Lm.cur.textTertiary, style = LmText.caption)
                }
                LmProgressBar(
                    progress = state.volume,
                    onSeek = { Player.setVolume(it) },
                )
                Spacer(Modifier.height(Dimens.m))
                Text("倍速", color = Lm.cur.textSecondary, style = LmText.rowSub)
                Spacer(Modifier.height(Dimens.s))
                Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(Dimens.s)) {
                    listOf(0.75f, 1f, 1.25f, 1.5f, 2f).forEach { s ->
                        PickChip(
                            if (s == 1f) "原速" else "${s}x",
                            kotlin.math.abs(state.speed - s) < 0.01f,
                            Modifier.weight(1f),
                        ) { Player.setSpeed(s) }
                    }
                }

                Spacer(Modifier.height(Dimens.l))
                HorizontalDivider(color = Lm.cur.divider)
                Spacer(Modifier.height(Dimens.l))

                // 响度均衡：原来是设置里的一个独立页，但那正是「听歌时想调一下」
                // 的东西，藏在设置里要来回复跳十几次，所以搬到这里。
                LoudnessCompact(state.song)

                Spacer(Modifier.height(Dimens.m))
                Text(
                    "均衡器、环绕、混响这些 DSP 只在桌面版的 Go 音频引擎里；" +
                        "移动端走系统解码器，能做的就是音量、倍速与响度均衡（BS.1770 测量 + 真峰值保护）。",
                    color = Lm.cur.textTertiary,
                    style = LmText.caption,
                )
            }
        }
    }
}

/** 音效面板里的响度均衡（设置页里那份的紧凑版）。 */
@Composable
private fun LoudnessCompact(song: Song?) {
    val st by Loudness.state.collectAsState()
    val lib by Store.state.collectAsState()
    val scope = rememberCoroutineScope()

    Row(Modifier.fillMaxWidth(), verticalAlignment = Alignment.CenterVertically) {
        Text("响度均衡", color = Lm.cur.textSecondary, style = LmText.rowSub)
        Spacer(Modifier.weight(1f))
        Text(
            if (st.mode == Loudness.MODE_OFF) "已关闭" else "目标 ${st.target.toInt()} LUFS",
            color = if (st.mode == Loudness.MODE_OFF) Lm.cur.textTertiary else Lm.cur.accent,
            style = LmText.caption,
        )
    }
    Spacer(Modifier.height(Dimens.s))
    Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(Dimens.s)) {
        PickChip("关闭", st.mode == Loudness.MODE_OFF, Modifier.weight(1f)) {
            Loudness.setMode(Loudness.MODE_OFF)
            Player.refreshLoudness()
        }
        PickChip("单曲", st.mode == Loudness.MODE_TRACK, Modifier.weight(1f)) {
            Loudness.setMode(Loudness.MODE_TRACK)
            Player.refreshLoudness()
        }
    }
    Spacer(Modifier.height(Dimens.s))
    Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(Dimens.s)) {
        Loudness.TARGETS.forEach { t ->
            PickChip(
                "${t.toInt()}",
                kotlin.math.abs(st.target - t) < 0.5,
                Modifier.weight(1f),
            ) {
                Loudness.setTarget(t)
                Player.refreshLoudness()
            }
        }
    }
    Spacer(Modifier.height(6.dp))
    // 挡位上只有数字，很容易被读成「越大越响」。实际相反：目标值越小，
    // 最终音量越轻（-23 是广播标准，比 -14 低 9 dB），这也是很多人开了
    // 响度均衡后觉得「歌曲突然变小」的原因。
    Text(
        "目标值越小越轻：-14 接近流媒体（最响），-23 接近广播（最轻）",
        color = Lm.cur.textTertiary,
        style = LmText.caption,
    )
    if (song != null) {
        val g = Loudness.gainFor(song.id)
        Spacer(Modifier.height(6.dp))
        Text(
            when {
                st.mode == Loudness.MODE_OFF -> "当前曲目：未补偿（响度均衡已关闭）"
                g == null -> "当前曲目：还没测过，本次按原音量播放，下次播放起生效"
                kotlin.math.abs(g) < 0.5 -> "当前曲目：无需调整（已经是目标响度）"
                else -> "当前曲目：" + (if (g < 0) "降低 " else "提升 ") +
                    String.format("%.1f", kotlin.math.abs(g)) + " dB"
            },
            color = if (g != null && kotlin.math.abs(g) >= 0.5 && st.mode != Loudness.MODE_OFF)
                Lm.cur.accent else Lm.cur.textTertiary,
            style = LmText.caption,
        )
    }
    Spacer(Modifier.height(Dimens.s))
    Row(Modifier.fillMaxWidth(), verticalAlignment = Alignment.CenterVertically) {
        Text(
            if (st.measuring) "正在测量 ${st.done}/${st.total}"
            else "已测 ${st.measured} 首" + if (lib.songs.isNotEmpty()) " / 共 ${lib.songs.size} 首" else "",
            color = Lm.cur.textTertiary,
            style = LmText.caption,
        )
        Spacer(Modifier.weight(1f))
        PickChip("测量全部", false, Modifier.width(96.dp)) {
            scope.launch { Loudness.measureAll(lib.songs) }
        }
    }
}

/* ---------------------------------------------------------------- 更多 */

@Composable
fun MoreSheet(state: PlayerState, onDismiss: () -> Unit) {
    val ui by Store.state.collectAsState()
    val song = state.song
    val toast = remember { mutableStateOf("") }
    val added = remember { mutableStateOf<Set<String>>(emptySet()) }

    Sheet(onDismiss) { dismiss ->
    Column(Modifier.fillMaxWidth().padding(bottom = Dimens.xl)) {
        PanelTitle("更多", dismiss)
        Column(Modifier.padding(horizontal = Dimens.xl)) {
            if (song == null) {
                Text("未在播放", color = Lm.cur.textTertiary, style = LmText.rowSub)
                return@Column
            }
            Text(
                song.displayTitle,
                color = Lm.cur.textPrimary,
                style = LmText.rowTitle,
                maxLines = 1,
                overflow = TextOverflow.Ellipsis,
            )
            Text(
                song.displayArtist,
                color = Lm.cur.textTertiary,
                style = LmText.rowSub,
                maxLines = 1,
                overflow = TextOverflow.Ellipsis,
            )
            Spacer(Modifier.height(Dimens.m))

            val targets = ui.playlists.filter { !it.locked && !it.builtin }
            // 不再「没有自建歌单就整块不显示」：面板里始终有一个能用的入口
            run {
                Text("添加到歌单", color = Lm.cur.textSecondary, style = LmText.sectionLabel)
                Spacer(Modifier.height(Dimens.xs))
                LazyColumn(Modifier.heightIn(max = 180.dp)) {
                    items(targets, key = { it.id }) { pl ->
                        val done = pl.id in added.value
                        Row(
                            Modifier
                                .fillMaxWidth()
                                .height(44.dp)
                                .clickable(enabled = !done) {
                                    Store.addSongsToPlaylist(pl.id, listOf(song.id))
                                    added.value = added.value + pl.id
                                    toast.value = "已加入「${pl.name}」"
                                },
                            verticalAlignment = Alignment.CenterVertically,
                        ) {
                            LmIcon(if (done) Icon.Check else Icon.Add, 16.dp, if (done) Lm.cur.accent else Lm.cur.textTertiary)
                            Spacer(Modifier.width(Dimens.s))
                            Text(
                                pl.name,
                                color = if (done) Lm.cur.textTertiary else Lm.cur.textPrimary,
                                style = LmText.rowSub,
                                maxLines = 1,
                                overflow = TextOverflow.Ellipsis,
                            )
                        }
                    }
                    item(key = "new") {
                        Row(
                            Modifier
                                .fillMaxWidth()
                                .height(44.dp)
                                .clickable {
                                    Store.createPlaylist("新歌单") { pl ->
                                        Store.addSongsToPlaylist(pl, listOf(song.id))
                                        toast.value = "已新建歌单并加入"
                                    }
                                },
                            verticalAlignment = Alignment.CenterVertically,
                        ) {
                            LmIcon(Icon.Add, 16.dp, Lm.cur.textTertiary)
                            Spacer(Modifier.width(Dimens.s))
                            Text("新建歌单并加入", color = Lm.cur.textPrimary, style = LmText.rowSub)
                        }
                    }
                }
                if (toast.value.isNotBlank()) {
                    Text(toast.value, color = Lm.cur.accent, style = LmText.caption)
                }
                Spacer(Modifier.height(Dimens.m))
            }

            HorizontalDivider(color = Lm.cur.divider)
            Spacer(Modifier.height(Dimens.m))
            Text("封面", color = Lm.cur.textSecondary, style = LmText.sectionLabel)
            Spacer(Modifier.height(Dimens.xs))
            // 不再是一颗「点了就祈祷」的自动匹配按钮：进面板能看到当前封面、
            // 能改关键词、能逐张挑候选，失败还有原因（见 CoverSheet.kt）。
            Row(
                Modifier
                    .fillMaxWidth()
                    .height(56.dp)
                    .clickable {
                        dismiss()
                        CoverPanel.openFromSheet(song)
                    },
                verticalAlignment = Alignment.CenterVertically,
            ) {
                Cover(Covers.imageFor(song), 40.dp, Radii.cover, false)
                Spacer(Modifier.width(Dimens.m))
                Column(Modifier.weight(1f)) {
                    Text("更换封面", color = Lm.cur.textPrimary, style = LmText.rowSub)
                    Text(
                        if (Covers.hasCover(song)) "自动匹配，或搜关键词挑一张" else "还没有封面，点这里匹配",
                        color = Lm.cur.textTertiary,
                        style = LmText.caption,
                    )
                }
            }
            Spacer(Modifier.height(Dimens.m))
            HorizontalDivider(color = Lm.cur.divider)
            Spacer(Modifier.height(Dimens.m))
            Text("歌曲信息", color = Lm.cur.textSecondary, style = LmText.sectionLabel)
            Spacer(Modifier.height(Dimens.xs))
            InfoRow("格式", song.ext.ifBlank { "未知" })
            InfoRow("时长", formatDuration(song.durationMs))
            InfoRow("码率", if (song.bitrate > 0) "${song.bitrate} kbps" else "未知")
            InfoRow("采样率", if (song.sampleRate > 0) "${song.sampleRate} Hz" else "未知")
            InfoRow("大小", formatSize(song.size))
            InfoRow("加入时间", formatTime(song.addedAt))
            // 响度：测过就显示实测值与该挡位下的补偿；没测过就说清楚为什么没有
            val lr = Loudness.summaryFor(song.id)
            if (lr != null) {
                InfoRow("响度", "%.1f LUFS".format(lr.optDouble("integrated")))
                InfoRow("真峰值", "%.1f dBTP".format(lr.optDouble("truePeak")))
                InfoRow("响度范围", "%.1f LU".format(lr.optDouble("lra")))
                val g = Loudness.gainFor(song.id)
                if (g != null) {
                    InfoRow("补偿", (if (g >= 0) "+" else "") + "%.1f dB".format(g))
                }
            } else {
                InfoRow("响度", if (Loudness.enabled) "未测量" else "响度均衡已关闭")
            }
            InfoRow("路径", song.path)
        }
    }
    }
}

@Composable
private fun InfoRow(key: String, value: String) {
    Row(
        Modifier.fillMaxWidth().padding(vertical = 5.dp),
        verticalAlignment = Alignment.Top,
    ) {
        Text(key, color = Lm.cur.textTertiary, style = LmText.caption, modifier = Modifier.width(64.dp))
        Text(value, color = Lm.cur.textSecondary, style = LmText.caption)
    }
}

private fun formatSize(bytes: Long): String = when {
    bytes <= 0L -> "未知"
    bytes >= 1024L * 1024L * 1024L -> "%.2f GB".format(bytes / 1024.0 / 1024.0 / 1024.0)
    bytes >= 1024L * 1024L -> "%.1f MB".format(bytes / 1024.0 / 1024.0)
    else -> "${bytes / 1024} KB"
}

private fun formatTime(ms: Long): String {
    if (ms <= 0L) return "未知"
    return SimpleDateFormat("yyyy-MM-dd HH:mm", Locale.getDefault()).format(Date(ms))
}
