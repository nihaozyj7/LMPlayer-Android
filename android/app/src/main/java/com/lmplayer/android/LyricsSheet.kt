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
import androidx.compose.foundation.lazy.itemsIndexed
import androidx.compose.foundation.lazy.rememberLazyListState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableLongStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.SolidColor
import androidx.compose.ui.text.SpanStyle
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.buildAnnotatedString
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.text.withStyle
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import kotlinx.coroutines.launch

/**
 * 歌词面板（含手动匹配工作台）。
 *
 * 与桌面版「歌词工作台」的对应关系：
 *   打开 → 本地（内嵌 / .lrc / 缓存）→ 没有才在线自动匹配（后端 AutoMatch）
 *   匹配不准 → 手动搜索候选（后端 SearchLyrics）→ 逐字/逐行标记（ProbeLyricsFormat）
 *            → 采用（FetchLyrics + LyricsService.Save 落缓存）
 *   时间轴对不上 → ±0.5s 偏移校正（本地持久化，按歌记住）
 *
 * 逐字歌词（增强 LRC）按字点亮；没有逐字时间轴的行整行高亮。
 */

private const val OFFSET_STEP = 500L

@Composable
fun LyricsSheet(state: PlayerState, onDismiss: () -> Unit) {
    val song = state.song
    val scope = rememberCoroutineScope()

    var loading by remember(song?.id) { mutableStateOf(true) }
    var result by remember(song?.id) { mutableStateOf(LyricsResult()) }
    var note by remember(song?.id) { mutableStateOf("") }
    var offset by remember(song?.id) { mutableLongStateOf(if (song == null) 0L else Lyrics.offsetMs(song.id)) }
    var matching by remember(song?.id) { mutableStateOf(false) }

    var keyword by remember(song?.id) { mutableStateOf("") }
    var searching by remember(song?.id) { mutableStateOf(false) }
    var candidates by remember(song?.id) { mutableStateOf<List<LyricCandidate>>(emptyList()) }
    var wordFlags by remember(song?.id) { mutableStateOf<Map<String, Boolean>>(emptyMap()) }
    var matchNote by remember(song?.id) { mutableStateOf("") }

    LaunchedEffect(song?.id) {
        if (song == null) {
            loading = false
            note = "未在播放"
            return@LaunchedEffect
        }
        loading = true
        note = ""
        result = runCatching { Lyrics.load(song) }.getOrElse {
            note = "歌词加载失败：${it.message}"
            LyricsResult()
        }
        if (result.empty) note = "没有找到这首歌的歌词"
        loading = false
        // 本地只有行级时，后台再问一次在线有没有逐字版本（不挡显示）
        if (!result.empty && !result.wordLevel) {
            runCatching { Lyrics.upgradeWordLevel(song) }.getOrNull()?.let { up ->
                if (!up.empty && up.wordLevel) result = up
            }
        }
    }

    LaunchedEffect(offset) {
        if (song != null) Lyrics.setOffset(song.id, offset)
    }

    Sheet(onDismiss) { dismiss ->
        Column(Modifier.fillMaxWidth()) {
            val searchAction: @Composable () -> Unit = {
                IconButtonBox({
                    matching = true
                    if (keyword.isBlank()) keyword = song?.displayTitle.orEmpty()
                }, 36) { LmIcon(Icon.Search, Dimens.iconS, Lm.cur.textSecondary) }
            }
            PanelTitle(
                text = if (matching) "匹配歌词" else "歌词",
                onClose = dismiss,
                onBack = if (matching) {
                    { matching = false }
                } else null,
                actions = if (matching) null else searchAction,
            )

            if (matching && song != null) {
                MatchPanel(
                    song = song,
                    keyword = keyword,
                    onKeyword = { keyword = it },
                    searching = searching,
                    candidates = candidates,
                    flags = wordFlags,
                    note = matchNote,
                    onSearch = {
                        scope.launch {
                            searching = true
                            matchNote = ""
                            wordFlags = emptyMap()
                            val list = runCatching {
                                Lyrics.search(keyword.trim(), song.displayTitle, song.artist, song.durationMs)
                            }.getOrElse {
                                matchNote = "搜索失败：${it.message}"
                                emptyList()
                            }
                            candidates = list
                            searching = false
                            if (list.isEmpty() && matchNote.isBlank()) matchNote = "没有找到候选歌词"
                            // 逐字/逐行标记：格式在抓取前无从知道，只能一个个探测。
                            // 串行探测但每探到一个就更新界面，用户不必等全部完成。
                            for (c in list) {
                                val word = runCatching { Lyrics.probe(c.provider, c.id) }.getOrDefault(false)
                                wordFlags = wordFlags + ("${c.provider}|${c.id}" to word)
                            }
                        }
                    },
                    onAdopt = { c ->
                        scope.launch {
                            searching = true
                            val r = runCatching { Lyrics.adopt(song, c.provider, c.id) }
                            searching = false
                            r.onSuccess {
                                if (!it.empty) {
                                    result = it
                                    note = ""
                                    matching = false
                                    offset = 0L
                                    Lyrics.setOffset(song.id, 0L)
                                } else {
                                    matchNote = "这份候选没有歌词内容"
                                }
                            }.onFailure { matchNote = "采用失败：${it.message}" }
                        }
                    },
                )
            } else {
                Column(Modifier.padding(horizontal = Dimens.xl)) {
                    Text(
                        song?.displayTitle ?: "未在播放",
                        color = Lm.cur.textPrimary,
                        style = LmText.rowSub,
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis,
                    )
                    Spacer(Modifier.height(2.dp))
                    Text(
                        sourceLabel(result),
                        color = Lm.cur.textTertiary,
                        style = LmText.caption,
                    )
                    Spacer(Modifier.height(Dimens.m))
                    // 偏移微调：0.5s 粗调 + 0.1s 精调，值点一下归零
                    // 整行居中：这组按钮只在「对不齐」时才用，居中而不是贴左，
                    // 视线不用从歌词区往左下角跳。
                    Row(
                        Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.Center,
                        verticalAlignment = Alignment.CenterVertically,
                    ) {
                        TinyChip("−0.5s") { offset -= 500L }
                        Spacer(Modifier.width(Dimens.xs))
                        TinyChip("−0.1s") { offset -= 100L }
                        Spacer(Modifier.width(Dimens.s))
                        Box(
                            Modifier
                                .width(62.dp)
                                .clickable { offset = 0L },
                            contentAlignment = Alignment.Center,
                        ) {
                            Text(
                                if (offset == 0L) "对齐" else "${if (offset > 0) "+" else ""}${"%.1f".format(offset / 1000.0)}s",
                                color = Lm.cur.textSecondary,
                                style = LmText.caption,
                                textAlign = TextAlign.Center,
                            )
                        }
                        Spacer(Modifier.width(Dimens.s))
                        TinyChip("+0.1s") { offset += 100L }
                        Spacer(Modifier.width(Dimens.xs))
                        TinyChip("+0.5s") { offset += 500L }
                    }
                    Spacer(Modifier.height(Dimens.s))
                    Text(
                        "偏差点数字归零；微调按歌记住",
                        color = Lm.cur.textTertiary,
                        style = LmText.caption,
                        textAlign = TextAlign.Center,
                        modifier = Modifier.fillMaxWidth(),
                    )
                }
                Spacer(Modifier.height(Dimens.m))

                when {
                    loading -> Box(
                        Modifier.fillMaxWidth().height(160.dp),
                        contentAlignment = Alignment.Center,
                    ) { CircularProgressIndicator(color = Lm.cur.accent, strokeWidth = 2.dp) }

                    result.empty -> Box(
                        Modifier.fillMaxWidth().height(160.dp),
                        contentAlignment = Alignment.Center,
                    ) {
                        Column(horizontalAlignment = Alignment.CenterHorizontally) {
                            Text(
                                note.ifBlank { "暂无歌词" },
                                color = Lm.cur.textTertiary,
                                style = LmText.rowSub,
                                textAlign = TextAlign.Center,
                            )
                            Spacer(Modifier.height(Dimens.m))
                            if (song != null) {
                                ChipButton("搜索歌词") {
                                    matching = true
                                    keyword = song.displayTitle
                                }
                            }
                        }
                    }

                    else -> LyricList(
                        lines = result.lines,
                        positionMs = state.positionMs + offset,
                        onSeek = { Player.seekTo((it - offset).coerceAtLeast(0)) },
                    )
                }
            }
            Spacer(Modifier.height(Dimens.s))
        }
    }
}

private fun sourceLabel(r: LyricsResult): String = when {
    r.empty -> "没有歌词"
    r.source.startsWith("online:") -> "在线 · ${r.source.removePrefix("online:")}" + if (r.wordLevel) " · 逐字" else ""
    r.source == "embedded" -> "内嵌歌词" + if (r.wordLevel) " · 逐字" else ""
    r.source == "lrc-file" -> "同名 .lrc" + if (r.wordLevel) " · 逐字" else ""
    r.source == "cache" -> "已缓存" + if (r.wordLevel) " · 逐字" else ""
    else -> r.source + if (r.wordLevel) " · 逐字" else ""
}

@Composable
private fun LyricList(lines: List<LyricLine>, positionMs: Long, onSeek: (Long) -> Unit) {
    val listState = rememberLazyListState()
    val current = Lyrics.currentLine(lines, positionMs)

    LaunchedEffect(current) {
        if (current >= 0) runCatching { listState.animateScrollToItem(current) }
    }

    LazyColumn(
        Modifier.fillMaxWidth().height(340.dp),
        state = listState,
    ) {
        itemsIndexed(lines) { i, line ->
            val active = i == current
            Text(
                text = if (active && line.words.isNotEmpty()) {
                    litWords(line, positionMs)
                } else {
                    buildAnnotatedString { append(line.text) }
                },
                color = if (active) Lm.cur.accent else Lm.cur.textSecondary,
                style = if (active) LmText.lyricActive else LmText.lyricIdle,
                fontWeight = if (active) FontWeight.SemiBold else FontWeight.Normal,
                textAlign = TextAlign.Center,
                modifier = Modifier
                    .fillMaxWidth()
                    .clickable { onSeek(line.at) }
                    .padding(horizontal = Dimens.xl, vertical = 7.dp),
            )
        }
    }
}

/**
 * 逐字点亮：已唱过的字用主色，未唱的用弱色。
 *
 * 用 SpanStyle 而不是一排 Text：中文歌词一行会有二三十个字，
 * 排成 Row 会破坏自动换行，长句会溢出到屏幕外。
 */
@Composable
private fun litWords(line: LyricLine, positionMs: Long): androidx.compose.ui.text.AnnotatedString {
    val accent = Lm.cur.accent
    // 与详情页一致：未唱的字用普通行颜色，唱过的才用主色；按时间点亮而不是按比例
    val dim = Lm.cur.textSecondary
    return buildAnnotatedString {
        for (w in line.words) {
            withStyle(SpanStyle(color = if (w.at <= positionMs) accent else dim)) { append(w.text) }
        }
    }
}

@Composable
private fun TinyChip(text: String, onClick: () -> Unit) {
    Box(
        Modifier
            .background(Lm.cur.bgRaised, RoundedCornerShape(14.dp))
            .clickable { onClick() }
            .padding(horizontal = 9.dp, vertical = 6.dp),
    ) {
        Text(text, color = Lm.cur.textSecondary, style = LmText.caption)
    }
}

@Composable
private fun ChipButton(text: String, onClick: () -> Unit) {
    Box(
        Modifier
            .background(Lm.cur.bgRaised, RoundedCornerShape(14.dp))
            .clickable { onClick() }
            .padding(horizontal = 12.dp, vertical = 6.dp),
    ) {
        Text(text, color = Lm.cur.textSecondary, style = LmText.caption)
    }
}

/* ------------------------------------------------------- 匹配工作台 */

@Composable
private fun MatchPanel(
    song: Song,
    keyword: String,
    onKeyword: (String) -> Unit,
    searching: Boolean,
    candidates: List<LyricCandidate>,
    flags: Map<String, Boolean>,
    note: String,
    onSearch: () -> Unit,
    onAdopt: (LyricCandidate) -> Unit,
) {
    Column(Modifier.fillMaxWidth().padding(horizontal = Dimens.xl)) {
        Text(
            "歌名与艺人用于排序，关键词用于搜索；搜索词留空时由后端用元数据自动拼",
            color = Lm.cur.textTertiary,
            style = LmText.caption,
        )
        Spacer(Modifier.height(Dimens.m))
        Row(verticalAlignment = Alignment.CenterVertically) {
            Box(
                Modifier
                    .weight(1f)
                    .height(40.dp)
                    .background(Lm.cur.bgRaised, RoundedCornerShape(20.dp))
                    .padding(horizontal = 14.dp),
                contentAlignment = Alignment.CenterStart,
            ) {
                if (keyword.isEmpty()) {
                    Text("歌名 / 艺人 / 关键词", color = Lm.cur.textTertiary, fontSize = 14.sp)
                }
                BasicTextField(
                    value = keyword,
                    onValueChange = onKeyword,
                    singleLine = true,
                    textStyle = TextStyle(color = Lm.cur.textPrimary, fontSize = 14.sp),
                    cursorBrush = SolidColor(Lm.cur.accent),
                    keyboardOptions = KeyboardOptions(imeAction = ImeAction.Search),
                    keyboardActions = KeyboardActions(onSearch = { onSearch() }),
                    modifier = Modifier.fillMaxWidth(),
                )
            }
            Spacer(Modifier.width(Dimens.s))
            Box(
                Modifier
                    .background(Lm.cur.bgRaised, RoundedCornerShape(18.dp))
                    .clickable(enabled = !searching) { onSearch() }
                    .padding(horizontal = 14.dp, vertical = 9.dp),
            ) {
                Text(
                    if (searching) "搜索中…" else "搜索",
                    color = if (searching) Lm.cur.textTertiary else Lm.cur.accent,
                    style = LmText.caption,
                )
            }
        }
        Spacer(Modifier.height(Dimens.m))

        when {
            searching && candidates.isEmpty() -> Box(
                Modifier.fillMaxWidth().height(140.dp),
                contentAlignment = Alignment.Center,
            ) { CircularProgressIndicator(color = Lm.cur.accent, strokeWidth = 2.dp) }

            candidates.isEmpty() -> Box(
                Modifier.fillMaxWidth().height(140.dp),
                contentAlignment = Alignment.Center,
            ) {
                Text(
                    note.ifBlank { "输入关键词后点「搜索」" },
                    color = Lm.cur.textTertiary,
                    style = LmText.rowSub,
                    textAlign = TextAlign.Center,
                )
            }

            else -> {
                if (note.isNotBlank()) {
                    Text(note, color = Lm.cur.textTertiary, style = LmText.caption)
                    Spacer(Modifier.height(Dimens.s))
                }
                LazyColumn(Modifier.fillMaxWidth().heightIn(max = 320.dp)) {
                    items(candidates.size) { i ->
                        val c = candidates[i]
                        val key = "${c.provider}|${c.id}"
                        val flag = flags[key]
                        Row(
                            Modifier
                                .fillMaxWidth()
                                .clickable(enabled = !searching) { onAdopt(c) }
                                .padding(vertical = 10.dp),
                            verticalAlignment = Alignment.CenterVertically,
                        ) {
                            Column(Modifier.weight(1f)) {
                                Text(
                                    c.label.ifBlank { "（无标题）" },
                                    color = Lm.cur.textPrimary,
                                    style = LmText.rowSub,
                                    maxLines = 1,
                                    overflow = TextOverflow.Ellipsis,
                                )
                                Spacer(Modifier.height(2.dp))
                                Row(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                                    Text(c.provider, color = Lm.cur.textTertiary, style = LmText.caption)
                                    if (c.duration > 0) {
                                        Text(
                                            formatDuration(c.duration),
                                            color = Lm.cur.textTertiary,
                                            style = LmText.caption,
                                        )
                                    }
                                    when (flag) {
                                        true -> Text("逐字", color = Lm.cur.accent, style = LmText.caption)
                                        false -> Text("逐行", color = Lm.cur.textTertiary, style = LmText.caption)
                                        null -> Text("…", color = Lm.cur.textTertiary, style = LmText.caption)
                                    }
                                }
                            }
                            Text("使用", color = Lm.cur.accent, style = LmText.caption)
                        }
                    }
                }
            }
        }
        Spacer(Modifier.height(Dimens.m))
        Text(
            "对齐不准时用上面的 ±0.5s 校正：歌词显示的是「播放位置 + 偏移」",
            color = Lm.cur.textTertiary,
            style = LmText.caption,
        )
    }
}
