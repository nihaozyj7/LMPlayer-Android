package com.lmplayer.android

import androidx.compose.foundation.Canvas
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
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.CornerRadius
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp

/**
 * 下载队列面板。
 *
 * 存在的理由：下载是**异步且没有终态界面**的操作 —— 点了下载之后，歌不会
 * 立刻出现在列表里（要等文件落盘 + 入库），这中间几分钟用户在界面上什么都
 * 看不到。所以必须有一个能回头查看的地方，且要显示进度、失败原因与落盘路径。
 */
@Composable
fun DownloadsSheet(onDismiss: () -> Unit) {
    Sheet(onDismiss) { dismiss -> DownloadsContent(dismiss) }
}

/**
 * 任务列表本体。dismiss 为 null 时不画标题栏的✕（嵌在设置页里用）。
 */
@Composable
fun DownloadsContent(dismiss: (() -> Unit)? = null) {
    val tasks by Downloads.tasks.collectAsState()
    val active by Downloads.active.collectAsState()

    Column(Modifier.fillMaxWidth().padding(bottom = Dimens.l)) {
        if (dismiss != null) {
            PanelTitle("下载队列", dismiss)
        } else {
            Row(
                Modifier.fillMaxWidth().padding(horizontal = Dimens.xl, vertical = Dimens.s),
                verticalAlignment = Alignment.CenterVertically,
            ) {
                Text(
                    if (active > 0) "下载队列 · $active 个进行中" else "下载队列",
                    color = Lm.cur.textPrimary,
                    style = LmText.rowTitle,
                )
                Spacer(Modifier.weight(1f))
                if (tasks.isNotEmpty()) {
                    Text(
                        "清空已完成",
                        color = Lm.cur.accent,
                        style = LmText.caption,
                        modifier = Modifier
                            .clickable { Downloads.clearFinished() }
                            .padding(horizontal = Dimens.s, vertical = Dimens.xs),
                    )
                }
            }
        }

        if (tasks.isEmpty()) {
            Text(
                "还没有下载任务。到「搜索」里点在线结果右侧的下载按钮即可。",
                color = Lm.cur.textTertiary,
                style = LmText.caption,
                modifier = Modifier.padding(horizontal = Dimens.xl, vertical = Dimens.l),
            )
            return@Column
        }

        LazyColumn(Modifier.heightIn(max = 380.dp)) {
            items(tasks, key = { it.id }) { t -> DownloadRow(t) }
        }

        if (dismiss != null) {
            Spacer(Modifier.height(Dimens.s))
            Row(
                Modifier
                    .fillMaxWidth()
                    .padding(horizontal = Dimens.xl)
                    .clickable { Downloads.clearFinished() },
                verticalAlignment = Alignment.CenterVertically,
            ) {
                LmIcon(Icon.Trash, 16.dp, Lm.cur.textTertiary)
                Spacer(Modifier.width(Dimens.s))
                Text("清空已完成的任务", color = Lm.cur.textSecondary, style = LmText.caption)
            }
        }
    }
}

@Composable
private fun DownloadRow(t: DownloadTask) {
    val color = when {
        t.failed -> Lm.cur.danger
        t.ok -> Lm.cur.success
        else -> Lm.cur.accent
    }
    Column(
        Modifier
            .fillMaxWidth()
            .padding(horizontal = Dimens.xl, vertical = Dimens.s)
    ) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            Column(Modifier.weight(1f)) {
                Text(
                    t.title,
                    color = Lm.cur.textPrimary,
                    style = LmText.rowSub,
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis,
                )
                Spacer(Modifier.height(2.dp))
                Text(
                    buildString {
                        append(t.statusText)
                        if (t.running && t.total > 0) {
                            append(" · ")
                            append(humanSize(t.done))
                            append(" / ")
                            append(humanSize(t.total))
                        } else if (t.ok) {
                            append(" · ")
                            append(humanSize(t.done))
                        }
                    },
                    color = if (t.failed) Lm.cur.danger else Lm.cur.textTertiary,
                    style = LmText.caption,
                    maxLines = 2,
                    overflow = TextOverflow.Ellipsis,
                )
            }
            Spacer(Modifier.width(Dimens.m))
            Box(
                Modifier
                    .size(26.dp)
                    .background(color.copy(alpha = 0.16f), RoundedCornerShape(13.dp)),
                contentAlignment = Alignment.Center,
            ) {
                LmIcon(
                    when {
                        t.failed -> Icon.Close
                        t.ok -> Icon.Check
                        else -> Icon.Download
                    },
                    14.dp,
                    color,
                )
            }
        }
        if (t.running) {
            Spacer(Modifier.height(6.dp))
            ThinProgress(t.progress)
        }
    }
}

/** 一条 3dp 的进度线（不可交互，不抢手势）。 */
@Composable
fun ThinProgress(progress: Float, color: androidx.compose.ui.graphics.Color = Lm.cur.accent) {
    // 颜色必须在组合期读出来：Canvas 的 draw lambda 不是 @Composable，
    // 在里面读 Lm.cur 编译不过（LmProgressBar 也是这么做的）。
    val track = Lm.cur.divider
    Canvas(
        Modifier
            .fillMaxWidth()
            .height(3.dp)
    ) {
        val h = size.height
        val r = CornerRadius(h / 2f, h / 2f)
        drawRoundRect(
            color = track,
            topLeft = Offset(0f, 0f),
            size = Size(size.width, h),
            cornerRadius = r,
        )
        val w = (size.width * progress.coerceIn(0f, 1f))
        if (w > 0.5f) {
            drawRoundRect(
                color = color,
                topLeft = Offset(0f, 0f),
                size = Size(w, h),
                cornerRadius = r,
            )
        }
    }
}

private fun humanSize(bytes: Long): String = when {
    bytes <= 0L -> "0 B"
    bytes >= 1024L * 1024L * 1024L -> "%.2f GB".format(bytes / 1024.0 / 1024.0 / 1024.0)
    bytes >= 1024L * 1024L -> "%.1f MB".format(bytes / 1024.0 / 1024.0)
    else -> "${bytes / 1024} KB"
}

/** 抽屉里那一行「下载」右侧的角标：显示进行中的数量。 */
@Composable
fun DownloadBadge(count: Int) {
    if (count <= 0) return
    Box(
        Modifier
            .background(Lm.cur.accent, RoundedCornerShape(9.dp))
            .padding(horizontal = 7.dp, vertical = 2.dp),
        contentAlignment = Alignment.Center,
    ) {
        Text("$count", color = androidx.compose.ui.graphics.Color.White, style = LmText.caption)
    }
}
