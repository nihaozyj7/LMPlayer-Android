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
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

/**
 * 歌单详情页的头部。
 *
 * 和「全部歌曲」刻意长得不一样：那个页面是「一堆歌，随手点一首」，工具条要给
 * 排序、重扫、计数；歌单是「一个集合，我要管理它」，所以头部换成
 * 封面拼贴（这个歌单长什么样）+ 名称与统计 + 一个「⋮」把重命名/加歌/删除收进去，
 * 下面紧跟「播放全部 / 随机播放」两个主动作。
 *
 * 歌单里歌曲的**顺序是用户自己排的**，所以这里有意识地不放排序切换 —— 一旦
 * 被排序字段改写，用户拖出来的顺序就白排了。
 *
 * 三个操作全部做成**页面内联展开**，不用底部面板也不用对话框：
 * `ModalBottomSheet` 和 `AlertDialog` 在主页这一层都会建出一个窗口、
 * 却不绘制任何内容（实测窗口确实存在、也会吃掉点击，屏幕上却一个字都没多），
 * 同一个 Sheet 在播放详情页里却完全正常。与其去赌这个组合环境，
 * 不如把操作直接展开在页面里 —— 少一层窗口，交互链路也更短。
 */
@Composable
internal fun PlaylistHeader(st: UiState, pl: Playlist) {
    var menu by remember { mutableStateOf(false) }
    var renaming by remember { mutableStateOf(false) }
    var adding by remember { mutableStateOf(false) }
    var draft by remember { mutableStateOf("") }

    val songs = remember(pl.songIds, st.songs) {
        val byId = st.songs.associateBy { it.id }
        pl.songIds.mapNotNull { byId[it] }
    }
    val totalMs = songs.sumOf { it.durationMs }

    Column(Modifier.fillMaxWidth()) {
        Row(
            Modifier
                .fillMaxWidth()
                .padding(horizontal = Dimens.l, vertical = Dimens.s),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            CoverStack(songs, 84.dp)
            Spacer(Modifier.width(Dimens.l))
            Column(Modifier.weight(1f)) {
                Text(
                    pl.name,
                    color = Lm.cur.textPrimary,
                    style = LmText.screenTitle,
                    maxLines = 2,
                    overflow = TextOverflow.Ellipsis,
                )
                Spacer(Modifier.height(Dimens.xs))
                Text(
                    buildString {
                        append("${songs.size} 首")
                        if (totalMs > 0) {
                            append(" · ")
                            append(totalText(totalMs))
                        }
                    },
                    color = Lm.cur.textTertiary,
                    style = LmText.caption,
                )
            }
            IconButtonBox({ menu = !menu; if (menu) renaming = false }, 40, Lm.cur.bgRaised) {
                LmIcon(if (menu) Icon.Close else Icon.More, 20.dp, Lm.cur.textPrimary)
            }
        }

        Row(
            Modifier
                .fillMaxWidth()
                .padding(horizontal = Dimens.l, vertical = Dimens.xs),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            ActionChip("播放全部", Icon.Play, enabled = songs.isNotEmpty(), primary = true) {
                songs.firstOrNull()?.let { Player.play(it, songs) }
            }
            Spacer(Modifier.width(Dimens.s))
            ActionChip("随机播放", Icon.Shuffle, enabled = songs.isNotEmpty(), primary = false) {
                Player.playShuffled(songs)
            }
        }

        /* -------------------------------------------------------- 操作（内联） */

        if (menu) {
            Row(
                Modifier
                    .fillMaxWidth()
                    .padding(horizontal = Dimens.l, vertical = Dimens.xs),
                verticalAlignment = Alignment.CenterVertically,
            ) {
                ActionChip("重命名", Icon.Edit, enabled = true, primary = false) {
                    draft = pl.name
                    renaming = !renaming
                }
                Spacer(Modifier.width(Dimens.s))
                ActionChip("添加歌曲", Icon.Add, enabled = true, primary = false) {
                    adding = !adding
                }
                Spacer(Modifier.width(Dimens.s))
                DangerChip("删除歌单", Icon.Trash) {
                    // 只删歌单这个集合，磁盘上的文件与曲库都不动（可以立刻重建）
                    Store.deletePlaylist(pl.id)
                }
            }
        }

        if (renaming) {
            Column(Modifier.fillMaxWidth().padding(horizontal = Dimens.l)) {
                OutlinedTextField(
                    value = draft,
                    onValueChange = { draft = it },
                    singleLine = true,
                    modifier = Modifier.fillMaxWidth(),
                    placeholder = { Text("歌单名称", color = Lm.cur.textTertiary, fontSize = 15.sp) },
                    textStyle = androidx.compose.ui.text.TextStyle(
                        color = Lm.cur.textPrimary,
                        fontSize = 15.sp,
                    ),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedBorderColor = Lm.cur.accent,
                        unfocusedBorderColor = Lm.cur.divider,
                        cursorColor = Lm.cur.accent,
                    ),
                )
                Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.End) {
                    TextButton({ renaming = false }) {
                        Text("取消", color = Lm.cur.textSecondary)
                    }
                    TextButton({
                        val name = draft.trim()
                        if (name.isNotEmpty()) Store.renamePlaylist(pl.id, name)
                        renaming = false
                    }) { Text("确定", color = Lm.cur.accent) }
                }
            }
        }

        if (adding) {
            val candidates = remember(pl.songIds, st.songs, st.hiddenIds) {
                val inList = pl.songIds.toSet()
                st.songs.filter { it.id !in inList && it.id !in st.hiddenIds }
            }
            Column(
                Modifier
                    .fillMaxWidth()
                    .padding(horizontal = Dimens.l)
                    .clip(Radii.card)
                    .background(Lm.cur.bgElevated)
            ) {
                Row(
                    Modifier
                        .fillMaxWidth()
                        .padding(start = Dimens.m, end = Dimens.xs),
                    verticalAlignment = Alignment.CenterVertically,
                ) {
                    Column(Modifier.weight(1f)) {
                        Text(
                            "添加歌曲",
                            color = Lm.cur.textPrimary,
                            style = LmText.rowTitle,
                            fontWeight = FontWeight.SemiBold,
                        )
                        Text(
                            "还有 ${candidates.size} 首不在这个歌单里",
                            color = Lm.cur.textTertiary,
                            style = LmText.caption,
                        )
                    }
                    TextButton({
                        if (candidates.isNotEmpty()) {
                            Store.addSongsToPlaylist(pl.id, candidates.map { it.id })
                        }
                        adding = false
                    }) { Text("全部加入", color = Lm.cur.accent) }
                    TextButton({ adding = false }) {
                        Text("收起", color = Lm.cur.textSecondary)
                    }
                }
                HorizontalDivider(color = Lm.cur.divider)
                if (candidates.isEmpty()) {
                    Text(
                        "曲库里的歌都已经在这个歌单里了",
                        color = Lm.cur.textTertiary,
                        fontSize = 13.sp,
                        modifier = Modifier.padding(Dimens.m),
                    )
                } else {
                    LazyColumn(Modifier.heightIn(max = 260.dp)) {
                        items(candidates, key = { it.id }) { s ->
                            Row(
                                Modifier
                                    .fillMaxWidth()
                                    .height(Dimens.row - Dimens.l)
                                    .clickable {
                                        // 列表不收起：连着加好几首时每次都要重开太难受
                                        Store.addSongsToPlaylist(pl.id, listOf(s.id))
                                    }
                                    .padding(horizontal = Dimens.m),
                                verticalAlignment = Alignment.CenterVertically,
                            ) {
                                Cover(Covers.imageFor(s), Dimens.coverMini, Radii.cover)
                                Spacer(Modifier.width(Dimens.m))
                                Column(Modifier.weight(1f)) {
                                    Text(
                                        s.displayTitle,
                                        color = Lm.cur.textPrimary,
                                        style = LmText.rowTitle,
                                        maxLines = 1,
                                        overflow = TextOverflow.Ellipsis,
                                    )
                                    Text(
                                        s.displayArtist,
                                        color = Lm.cur.textTertiary,
                                        style = LmText.rowSub,
                                        maxLines = 1,
                                    )
                                }
                                LmIcon(Icon.Add, Dimens.iconS, Lm.cur.textTertiary)
                            }
                        }
                    }
                }
            }
            Spacer(Modifier.height(Dimens.s))
        }
    }
}

/** 歌单头部的胶囊按钮（播放全部 / 随机播放 / 歌单操作）。 */
@Composable
private fun ActionChip(
    label: String,
    icon: Icon,
    enabled: Boolean,
    primary: Boolean,
    onClick: () -> Unit,
) {
    val fg = when {
        !enabled -> Lm.cur.textTertiary
        primary -> Lm.cur.accent
        else -> Lm.cur.textPrimary
    }
    Row(
        Modifier
            .clip(Radii.chip)
            .background(if (primary) Lm.cur.accent.copy(alpha = 0.18f) else Lm.cur.bgRaised)
            .clickable(enabled = enabled, onClick = onClick)
            .padding(horizontal = Dimens.m, vertical = Dimens.s),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        LmIcon(icon, 15.dp, fg)
        Spacer(Modifier.width(Dimens.xs + 1.dp))
        Text(label, color = fg, fontSize = 12.5.sp)
    }
}

/** 破坏性动作（删除歌单）：用 danger 色，和普通胶囊按钮区分开。 */
@Composable
private fun DangerChip(label: String, icon: Icon, onClick: () -> Unit) {
    Row(
        Modifier
            .clip(Radii.chip)
            .background(Lm.cur.danger.copy(alpha = 0.16f))
            .clickable(onClick = onClick)
            .padding(horizontal = Dimens.m, vertical = Dimens.s),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        LmIcon(icon, 15.dp, Lm.cur.danger)
        Spacer(Modifier.width(Dimens.xs + 1.dp))
        Text(label, color = Lm.cur.danger, fontSize = 12.5.sp)
    }
}

/**
 * 封面拼贴：把歌单前几首的封面错位重叠成一张「歌单图标」。
 *
 * 用封面堆叠而不是另外生成一张图：歌单内容一变图标就跟着变，不需要额外的
 * 缓存或失效逻辑；没有封面的歌单退回一个图标占位，不至于出现一块空白。
 */
@Composable
private fun CoverStack(songs: List<Song>, size: Dp) {
    val shown = songs.take(4)
    val inner = size * 0.62f
    val mid = (shown.size - 1) / 2f
    Box(Modifier.size(size), contentAlignment = Alignment.Center) {
        if (shown.isEmpty()) {
            Box(
                Modifier
                    .size(inner)
                    .clip(Radii.coverLarge)
                    .background(Lm.cur.bgRaised),
                contentAlignment = Alignment.Center,
            ) { LmIcon(Icon.Lyrics, Dimens.iconM, Lm.cur.textTertiary) }
        } else {
            shown.forEachIndexed { i, s ->
                val k = i - mid
                Box(
                    Modifier
                        // 横向错开 + 轻微旋转，形成扇形叠压；每张都盖住前一张的一部分
                        .offset(x = (k * size.value * 0.16f).dp)
                        .graphicsLayer { rotationZ = k * 7f }
                        .size(inner)
                ) {
                    Cover(Covers.imageFor(s), inner, Radii.coverLarge)
                }
            }
        }
    }
}

/** 歌单总时长：超过一小时才显示小时，否则「48 分钟」就够了。 */
private fun totalText(ms: Long): String {
    val min = ms / 60_000L
    return when {
        min < 1L -> "不足 1 分钟"
        min < 60L -> "$min 分钟"
        else -> "${min / 60L} 小时 ${min % 60L} 分"
    }
}
