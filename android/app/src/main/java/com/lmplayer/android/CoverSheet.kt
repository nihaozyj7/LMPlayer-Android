package com.lmplayer.android

import androidx.compose.foundation.background
import androidx.compose.foundation.border
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
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.itemsIndexed
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.SolidColor
import androidx.compose.ui.graphics.asImageBitmap
import androidx.compose.ui.platform.LocalSoftwareKeyboardController
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

/**
 * 封面手动匹配面板。
 *
 * 为什么必须有手动入口：在线封面源命中不了是很常见的事（B 站视频标题、
 * 同名的不同版本、纯音乐），自动匹配只能「尽力而为」，成功率永远不到 100%。
 * 桌面版一直是「打开面板 → 看候选 → 自己挑」，手机端之前只有一颗
 * 「自动匹配」按钮，搜不到就只能认命，而且失败时还看不出哪里错了。
 *
 * 面板同时解决「假成功」：应用的结果直接取后端回写的那张图的 data URL，
 * 立刻更新内存覆盖表（见 Covers.apply），所以点完就能在这行缩略图里看到变化。
 */
object CoverPanel {
    private val _song = MutableStateFlow<Song?>(null)
    val song: StateFlow<Song?> = _song.asStateFlow()
    private val scope = CoroutineScope(SupervisorJob() + Dispatchers.Main.immediate)

    fun open(s: Song) {
        _song.value = s
    }

    /**
     * 从另一个底部面板（更多 / 歌曲菜单）里打开。
     *
     * 不能直接打开：那个面板正在播自己的收起动画，两个 ModalBottomSheet
     * 叠在同一帧会闪一下（旧面板还没滑走，新面板已经盖上来了）。
     */
    fun openFromSheet(s: Song) {
        scope.launch {
            delay(330)
            _song.value = s
        }
    }

    fun close() {
        _song.value = null
    }

    /** 当前面板对应的歌（详情页据此判断「封面是否刚换过」）。 */
    fun shownFor(songId: String): Boolean = _song.value?.id == songId
}

/** 在应用根渲染一次即可，任何地方调 [CoverPanel.open] 都会弹出。 */
@Composable
fun CoverSheetHost() {
    val song by CoverPanel.song.collectAsState()
    val s = song ?: return
    CoverSheet(s) { CoverPanel.close() }
}

@Composable
private fun CoverSheet(song: Song, onDismiss: () -> Unit) {
    val scope = rememberCoroutineScope()
    val kb = LocalSoftwareKeyboardController.current
    var keyword by remember(song.id) { mutableStateOf("") }
    var list by remember(song.id) { mutableStateOf<List<Covers.Candidate>>(emptyList()) }
    var picked by remember(song.id) { mutableStateOf(-1) }
    var busy by remember(song.id) { mutableStateOf(false) }
    var status by remember(song.id) { mutableStateOf("") }
    var bad by remember(song.id) { mutableStateOf(false) }
    // 当前生效的那张：应用成功后立刻换成本次返回的图，不用等覆盖表回填
    var current by remember(song.id) { mutableStateOf(Covers.imageFor(song)) }

    /** 按标题自动匹配（空关键词 → 后端会先做 AI 清洗）。 */
    fun autoMatch() {
        if (busy) return
        busy = true
        bad = false
        status = "正在按标题匹配（脏标题会先清洗）…"
        scope.launch {
            val (r, cands) = Covers.autoApplyDetailed(song)
            if (r.ok) {
                current = Covers.imageFor(song)
                status = "已应用 · ${r.message}"
            } else {
                bad = true
                // 自动匹配失败时立刻把候选摆出来：用户下一步一定是「那我看看
                // 有哪些图」。让他再点一次「搜索候选」等于再等一个来回。
                if (cands.isNotEmpty()) {
                    list = cands
                    picked = -1
                    status = "${r.message}；下方候选可手动挑一张"
                } else {
                    status = r.message
                }
            }
            busy = false
        }
    }

    /** 按用户输入的关键词找候选。关键词为空时等同于「按元数据搜」。 */
    fun search() {
        if (busy) return
        kb?.hide()
        busy = true
        bad = false
        picked = -1
        list = emptyList()
        status = if (keyword.isBlank()) "正在按曲目信息查询…" else "正在按「${keyword.trim()}」查询…"
        scope.launch {
            val r = Covers.lookup(song, keyword)
            list = r.candidates
            bad = !r.ok
            status = r.message
            busy = false
        }
    }

    fun applyPicked() {
        val c = list.getOrNull(picked) ?: return
        if (busy) return
        busy = true
        bad = false
        status = "正在应用…"
        scope.launch {
            val r = Covers.apply(song, c)
            if (r.ok) {
                current = Covers.imageFor(song)
                status = "已应用 · ${r.message}"
                picked = -1
            } else {
                bad = true
                status = r.message
            }
            busy = false
        }
    }

    Sheet(onDismiss) { dismiss ->
        Column(Modifier.fillMaxWidth().padding(bottom = Dimens.m)) {
            PanelTitle("更换封面", dismiss)
            Column(Modifier.padding(horizontal = Dimens.xl)) {

                // 当前生效封面 + 这首歌是谁：换封面时用户得能确认「改的是哪首」
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Cover(current, 58.dp, Radii.cover, true)
                    Spacer(Modifier.width(Dimens.m))
                    Column(Modifier.weight(1f)) {
                        Text(
                            song.displayTitle,
                            color = Lm.cur.textPrimary,
                            style = LmText.rowTitle,
                            maxLines = 2,
                            overflow = TextOverflow.Ellipsis,
                        )
                        Spacer(Modifier.height(Dimens.xs))
                        Text(
                            Covers.originOf(song),
                            color = Lm.cur.textTertiary,
                            style = LmText.caption,
                            maxLines = 1,
                        )
                    }
                }

                Spacer(Modifier.height(Dimens.m))

                // 关键词输入：留空 = 用曲目信息搜（后端会清洗），填了 = 只按这个词搜
                Row(
                    Modifier
                        .fillMaxWidth()
                        .height(42.dp)
                        .background(Lm.cur.bgRaised, RoundedCornerShape(21.dp))
                        .padding(horizontal = 14.dp),
                    verticalAlignment = Alignment.CenterVertically,
                ) {
                    LmIcon(Icon.Search, 16.dp, Lm.cur.textTertiary)
                    Spacer(Modifier.width(Dimens.s))
                    Box(Modifier.weight(1f)) {
                        if (keyword.isEmpty()) {
                            Text(
                                "留空自动清洗标题，或输入「歌手 歌名」",
                                color = Lm.cur.textTertiary,
                                fontSize = 13.sp,
                                maxLines = 1,
                                overflow = TextOverflow.Ellipsis,
                            )
                        }
                        BasicTextField(
                            value = keyword,
                            onValueChange = { keyword = it },
                            singleLine = true,
                            textStyle = TextStyle(color = Lm.cur.textPrimary, fontSize = 14.sp),
                            cursorBrush = SolidColor(Lm.cur.accent),
                            keyboardOptions = KeyboardOptions(imeAction = ImeAction.Search),
                            keyboardActions = KeyboardActions(onSearch = { search() }),
                            modifier = Modifier.fillMaxWidth(),
                        )
                    }
                    if (keyword.isNotEmpty()) {
                        IconButtonBox({ keyword = "" }, 28) {
                            LmIcon(Icon.Close, 13.dp, Lm.cur.textTertiary)
                        }
                    }
                }

                Spacer(Modifier.height(Dimens.s))

                Row(Modifier.fillMaxWidth()) {
                    CoverAction("自动匹配", !busy, Modifier.weight(1f)) { autoMatch() }
                    Spacer(Modifier.width(Dimens.s))
                    CoverAction("搜索候选", !busy, Modifier.weight(1f)) { search() }
                }

                // 状态行：成功走主色，失败走危险色并带原因 —— 之前无论成败都是
                // 一句「已更新封面」，用户没有任何办法知道到底发生了什么。
                if (status.isNotBlank()) {
                    Spacer(Modifier.height(Dimens.s))
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        if (busy) {
                            androidx.compose.material3.CircularProgressIndicator(
                                modifier = Modifier.size(12.dp),
                                color = Lm.cur.accent,
                                strokeWidth = 1.6.dp,
                            )
                            Spacer(Modifier.width(Dimens.s))
                        }
                        Text(
                            status,
                            color = when {
                                busy -> Lm.cur.textSecondary
                                bad -> Lm.cur.danger
                                else -> Lm.cur.accent
                            },
                            style = LmText.caption,
                        )
                    }
                }

                if (list.isNotEmpty()) {
                    Spacer(Modifier.height(Dimens.m))
                    LazyVerticalGrid(
                        columns = GridCells.Fixed(3),
                        modifier = Modifier.fillMaxWidth().height(264.dp),
                        horizontalArrangement = Arrangement.spacedBy(Dimens.s),
                        verticalArrangement = Arrangement.spacedBy(Dimens.s),
                    ) {
                        itemsIndexed(list) { idx, c ->
                            val on = idx == picked
                            // 这张图能不能真的铺开：候选格子小，坏图在这里看不出来，
                            // 标一下免得用户挑了一张必然白屏的。
                            val flaw = remember(c.preview) { Covers.unusableReason(c.preview) }
                            Column(
                                Modifier.clickable {
                                    if (flaw != null) {
                                        bad = true
                                        status = "${Covers.providerLabel(c.provider)}：$flaw"
                                    } else {
                                        picked = if (on) -1 else idx
                                    }
                                }
                            ) {
                                Box(
                                    Modifier
                                        .fillMaxWidth()
                                        .height(98.dp)
                                        .clip(Radii.coverLarge)
                                        .then(
                                            if (on) Modifier.border(2.dp, Lm.cur.accent, Radii.coverLarge)
                                            else Modifier
                                        )
                                ) {
                                    val bmp = rememberCover(c.preview)
                                    if (bmp != null) {
                                        androidx.compose.foundation.Image(
                                            bitmap = bmp.asImageBitmap(),
                                            contentDescription = null,
                                            modifier = Modifier.fillMaxSize(),
                                            contentScale = androidx.compose.ui.layout.ContentScale.Crop,
                                        )
                                    } else {
                                        Box(
                                            Modifier
                                                .fillMaxSize()
                                                .background(Lm.cur.bgRaised)
                                        )
                                    }
                                    if (flaw != null) {
                                        Box(
                                            Modifier
                                                .fillMaxSize()
                                                .background(androidx.compose.ui.graphics.Color(0x99000000))
                                        ) {
                                            Text(
                                                flaw,
                                                color = androidx.compose.ui.graphics.Color.White,
                                                fontSize = 9.5.sp,
                                                textAlign = TextAlign.Center,
                                                maxLines = 2,
                                                overflow = TextOverflow.Ellipsis,
                                                modifier = Modifier
                                                    .align(Alignment.Center)
                                                    .padding(horizontal = 4.dp),
                                            )
                                        }
                                    }
                                }
                                Spacer(Modifier.height(3.dp))
                                Text(
                                    Covers.providerLabel(c.provider),
                                    color = if (on) Lm.cur.accent else Lm.cur.textTertiary,
                                    fontSize = 10.5.sp,
                                    maxLines = 1,
                                    overflow = TextOverflow.Ellipsis,
                                    textAlign = TextAlign.Center,
                                    modifier = Modifier.fillMaxWidth(),
                                )
                            }
                        }
                    }
                    Spacer(Modifier.height(Dimens.m))
                    CoverAction(
                        if (picked >= 0) "应用这张" else "先点一张候选",
                        picked >= 0 && !busy,
                        Modifier.fillMaxWidth(),
                        primary = true,
                    ) { applyPicked() }
                    Spacer(Modifier.height(Dimens.xs))
                    Text(
                        "封面只保存到应用的缓存目录，不会改写音乐文件。",
                        color = Lm.cur.textTertiary,
                        style = LmText.caption,
                    )
                }
            }
        }
    }
}

/** 面板里的动作按钮：主按钮实心，次按钮描边。 */
@Composable
private fun CoverAction(
    text: String,
    enabled: Boolean,
    modifier: Modifier,
    primary: Boolean = false,
    onClick: () -> Unit,
) {
    val bg = when {
        !enabled -> Lm.cur.bgRaised
        primary -> Lm.cur.accent
        else -> Lm.cur.bgRaised
    }
    val fg = when {
        !enabled -> Lm.cur.textTertiary
        // 主按钮上的字：深色主题的强调色是浅紫（配近黑字），浅色主题是深紫（配白字），
        // 而 bg 恰好就是这两种情况的「反色」，所以两边都读得清。
        primary -> Lm.cur.bg
        else -> Lm.cur.textPrimary
    }
    Box(
        modifier
            .height(42.dp)
            .clip(RoundedCornerShape(21.dp))
            .background(bg)
            .clickable(enabled = enabled, onClick = onClick),
        contentAlignment = Alignment.Center,
    ) {
        Text(text, color = fg, fontSize = 14.sp, fontWeight = FontWeight.Medium, maxLines = 1)
    }
}

/** 来源 id → 用户看得懂的名字。 */
internal fun providerName(id: String): String = when (id.lowercase()) {
    "itunes" -> "iTunes"
    "netease" -> "网易云"
    "qq", "qqmusic" -> "QQ 音乐"
    "kugou" -> "酷狗"
    "deezer" -> "Deezer"
    "musicbrainz" -> "MusicBrainz"
    "lastfm", "last.fm" -> "Last.fm"
    "" -> "未知来源"
    else -> id
}
