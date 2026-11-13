package com.lmplayer.android

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.activity.compose.BackHandler
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.focus.FocusRequester
import androidx.compose.ui.focus.focusRequester
import androidx.compose.ui.platform.LocalSoftwareKeyboardController
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import kotlinx.coroutines.launch

/**
 * 搜索：整页，本地曲库与在线音源聚合成一份结果。
 *
 * 一次输入出两段，本地永远在前：
 *   - 本地段：曲库已在内存里，输入即过滤，不用发一趟 RPC，所以是实时的；
 *   - 在线段：回车（或点「搜索」）才请求 OnlineService.Search，结果追加在本地之后。
 * 手机上不存在「打开外链播放」这条路，在线结果点一下就是下载入库。
 */
@Composable
fun SearchScreen(
    songs: List<Song>,
    onBack: () -> Unit,
    onPlayLocal: (Song, List<Song>) -> Unit,
    onPickFolder: () -> Unit,
) {
    var query by remember { mutableStateOf("") }
    var results by remember { mutableStateOf<List<OnlineTrack>>(emptyList()) }
    var loading by remember { mutableStateOf(false) }
    var searched by remember { mutableStateOf("") }   // 已经向在线发起过的词
    var message by remember { mutableStateOf<String?>(null) }
    val focus = remember { FocusRequester() }
    val keyboard = LocalSoftwareKeyboardController.current
    // 下载任务（按 bvid 对到在线结果上）：点完下载之后这一行会自己变成进度条
    val tasks by Downloads.tasks.collectAsState()
    val downloadHint by Downloads.hint.collectAsState()

    // 系统返回键：退出搜索页而不是退出 App
    BackHandler { onBack() }

    LaunchedEffect(Unit) { runCatching { focus.requestFocus() } }

    fun doSearch() {
        val q = query.trim()
        if (q.isEmpty()) return
        searched = q
        loading = true
        message = null
        results = emptyList()
        kotlinx.coroutines.MainScope().launch {
            try {
                val arr = Bridge.callArray("OnlineService.Search", q, 1, 30)
                val list = arr.objects().map(OnlineTrack::from).filter { it.title.isNotBlank() }
                // 登记代理地址，播放器据此拉在线流（见 Store.registerOnlineStreams）
                Store.registerOnlineStreams(list)
                results = list
            } catch (t: Throwable) {
                message = t.message ?: "在线搜索失败"
            } finally {
                loading = false
            }
        }
    }

    /** 试听：把在线曲目当普通 Song 交给播放器，播的是后端在线代理流。 */
    fun previewOnline(t: OnlineTrack) {
        // 保险：万一结果不是这次搜索登记的（例如恢复状态），补登记一次
        Store.registerOnlineStreams(listOf(t))
        val s = t.toSong()
        Player.play(s, listOf(s))
        message = "正在试听：《${t.title}》"
    }

    /** 下载入库。★ 必须传 bvid，不能传 t.id（后者带 bili: 前缀，后端不认）。 */
    fun downloadOnline(t: OnlineTrack) {
        // 统一走 Downloads：它会立刻把「已加入队列」写进全局提示，并且后续的
        // 进度/失败/完成都通过任务流自动反映到这一行与抽屉里的下载队列。
        Downloads.startDownload(t)
        message = null
    }

    // 本地：即时过滤（曲库在内存，直接筛比再发 RPC 快）
    val local = remember(query, songs) {
        val q = query.trim()
        if (q.isEmpty()) emptyList()
        else songs.filter {
            it.displayTitle.contains(q, true) || it.displayArtist.contains(q, true) ||
                it.album.contains(q, true)
        }
    }

    Column(
        Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background)
            .statusBarsPadding()
            .navigationBarsPadding()
    ) {
        Row(
            Modifier
                .fillMaxWidth()
                .height(56.dp)
                .padding(horizontal = 6.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            IconButtonBox(onBack) { LmIcon(Icon.Back, 22.dp, Lm.cur.textPrimary) }
            Box(
                Modifier
                    .weight(1f)
                    .height(40.dp)
                    .background(Lm.cur.bgRaised, RoundedCornerShape(20.dp))
                    .padding(horizontal = 14.dp),
                contentAlignment = Alignment.CenterStart
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    LmIcon(Icon.Search, 16.dp, Lm.cur.textTertiary)
                    Spacer(Modifier.width(8.dp))
                    Box(Modifier.weight(1f)) {
                        if (query.isEmpty()) {
                            Text(
                                "搜索本地与在线歌曲",
                                color = Lm.cur.textTertiary,
                                fontSize = 14.sp,
                            )
                        }
                        BasicTextField(
                            value = query,
                            onValueChange = { query = it },
                            singleLine = true,
                            textStyle = TextStyle(color = Lm.cur.textPrimary, fontSize = 14.sp),
                            cursorBrush = androidx.compose.ui.graphics.SolidColor(Lm.cur.accent),
                            keyboardOptions = KeyboardOptions(imeAction = ImeAction.Search),
                            keyboardActions = KeyboardActions(onSearch = { doSearch(); keyboard?.hide() }),
                            modifier = Modifier
                                .fillMaxWidth()
                                .focusRequester(focus),
                        )
                    }
                    if (query.isNotEmpty()) {
                        IconButtonBox({ query = ""; results = emptyList(); searched = "" }, 30) {
                            LmIcon(Icon.Close, 14.dp, Lm.cur.textTertiary)
                        }
                    }
                }
            }
            IconButtonBox({ doSearch(); keyboard?.hide() }) {
                Text("搜索", color = Lm.cur.accent, fontSize = 14.sp)
            }
        }
        HorizontalDivider(color = Lm.cur.divider)

        val nothing = !loading && local.isEmpty() && results.isEmpty()

        LazyColumn(
            Modifier.fillMaxSize(),
            // 底部留出播放条高度，否则滚到最后一条时会被播放条压住
            contentPadding = PaddingValues(bottom = Dimens.miniBar + 12.dp),
        ) {
            // 反馈条排在最前面：下载是异步的，提示出现在列表末尾等于没有反馈
            // （30 条在线结果之后根本滚不到）。
            val banner = downloadHint.ifBlank { message ?: "" }
            if (banner.isNotBlank()) {
                item(key = "msg") {
                    Row(
                        Modifier
                            .fillMaxWidth()
                            .padding(horizontal = 16.dp, vertical = 10.dp)
                            .background(Lm.cur.bgRaised, RoundedCornerShape(10.dp))
                            .padding(horizontal = 12.dp, vertical = 10.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            banner,
                            color = Lm.cur.textPrimary,
                            fontSize = 12.5.sp,
                            modifier = Modifier.weight(1f),
                        )
                        IconButtonBox({ Downloads.clearHint(); message = null }, 26) {
                            LmIcon(Icon.Close, 12.dp, Lm.cur.textTertiary)
                        }
                    }
                }
            }
            // ── 本地段（优先）
            if (local.isNotEmpty()) {
                item(key = "label-local") { SectionLabel("本地", local.size) }
                items(local, key = { "L" + it.id }) { song ->
                    Row(
                        Modifier
                            .fillMaxWidth()
                            .height(58.dp)
                            .clickable { onPlayLocal(song, local) }
                            .padding(horizontal = 16.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Cover(Covers.imageFor(song), 40.dp, RoundedCornerShape(6.dp))
                        Spacer(Modifier.width(12.dp))
                        Column(Modifier.weight(1f)) {
                            Text(
                                song.displayTitle,
                                color = Lm.cur.textPrimary,
                                fontSize = 14.sp,
                                maxLines = 1,
                                overflow = TextOverflow.Ellipsis,
                            )
                            Text(
                                song.displayArtist,
                                color = Lm.cur.textTertiary,
                                fontSize = 12.sp,
                                maxLines = 1,
                            )
                        }
                        Text(
                            formatDuration(song.durationMs),
                            color = Lm.cur.textTertiary,
                            fontSize = 12.sp,
                        )
                    }
                    HorizontalDivider(color = Lm.cur.divider, modifier = Modifier.padding(start = 68.dp))
                }
            }

            // ── 在线段（追加在后，加载中就地提示，不遮挡本地结果）
            if (loading) {
                item(key = "label-online-loading") {
                    Row(
                        Modifier
                            .fillMaxWidth()
                            .padding(horizontal = 16.dp, vertical = 14.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        CircularProgressIndicator(
                            color = Lm.cur.accent,
                            strokeWidth = 1.8.dp,
                            modifier = Modifier.size(14.dp),
                        )
                        Spacer(Modifier.width(10.dp))
                        Text("正在搜索在线「$searched」…", color = Lm.cur.textTertiary, fontSize = 12.5.sp)
                    }
                }
            } else if (results.isNotEmpty()) {
                item(key = "label-online") { SectionLabel("在线", results.size) }
                items(results, key = { "O" + it.id + it.title }) { t ->
                    val task = tasks.firstOrNull { it.bvid == t.bvid }
                    Row(
                        Modifier
                            .fillMaxWidth()
                            .height(if (task?.running == true) 70.dp else 58.dp)
                            // 点条目 = 直接试听（走在线代理流，不落盘）
                            .clickable { previewOnline(t) }
                            .padding(start = 16.dp, end = 4.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column(Modifier.weight(1f)) {
                            Text(
                                t.title,
                                color = Lm.cur.textPrimary,
                                fontSize = 14.sp,
                                maxLines = 1,
                                overflow = TextOverflow.Ellipsis,
                            )
                            Text(
                                if (task != null) {
                                    "${t.artist.ifBlank { "未知" }} · ${task.statusText}"
                                } else {
                                    "${t.artist.ifBlank { "未知" }} · ${formatDuration(t.durationMs)}"
                                },
                                color = if (task?.failed == true) Lm.cur.danger else Lm.cur.textTertiary,
                                fontSize = 12.sp,
                                maxLines = 1,
                                overflow = TextOverflow.Ellipsis,
                            )
                            if (task != null && task.running) {
                                Spacer(Modifier.height(5.dp))
                                ThinProgress(task.progress)
                            }
                        }
                        // 右侧按钮跟着任务状态走：未下载=下载图标，进行中=转圈，
                        // 完成=对勾，失败=叉（再点一次不会重复提交，后端也有去重）。
                        if (task == null) {
                            IconButtonBox({ downloadOnline(t) }) {
                                LmIcon(Icon.Download, 19.dp, Lm.cur.textSecondary)
                            }
                        } else {
                            Box(Modifier.width(44.dp), contentAlignment = Alignment.Center) {
                                when {
                                    task.running -> CircularProgressIndicator(
                                        color = Lm.cur.accent,
                                        strokeWidth = 2.dp,
                                        modifier = Modifier.size(16.dp),
                                    )
                                    task.ok -> LmIcon(Icon.Check, 18.dp, Lm.cur.success)
                                    else -> LmIcon(Icon.Close, 18.dp, Lm.cur.danger)
                                }
                            }
                        }
                    }
                    HorizontalDivider(color = Lm.cur.divider, modifier = Modifier.padding(start = 20.dp))
                }
            }


            // ── 空态
            if (nothing) {
                item(key = "empty") {
                    EmptyHint(
                        if (query.isBlank()) "输入关键词，本地与在线一起搜"
                        else if (searched.isBlank()) "本地没有匹配，按「搜索」同时查在线"
                        else "本地和在线都没有找到「$searched」",
                        action = if (songs.isEmpty() && query.isBlank()) "添加音乐文件夹" to onPickFolder
                        else null,
                    )
                }
            }

        }
    }
}

/** 分节小标题：本地 / 在线，带条数。 */
@Composable
private fun SectionLabel(text: String, count: Int) {
    Row(
        Modifier
            .fillMaxWidth()
            .padding(start = 16.dp, end = 16.dp, top = 16.dp, bottom = 6.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Text(
            text,
            color = Lm.cur.textSecondary,
            fontSize = 12.5.sp,
            fontWeight = FontWeight.SemiBold,
        )
        Spacer(Modifier.width(6.dp))
        Text("$count", color = Lm.cur.textTertiary, fontSize = 11.5.sp)
    }
}

@Composable
private fun EmptyHint(text: String, action: Pair<String, () -> Unit>? = null) {
    Box(
        Modifier
            .fillMaxWidth()
            .padding(top = 120.dp),
        contentAlignment = Alignment.Center
    ) {
        Column(horizontalAlignment = Alignment.CenterHorizontally) {
            Text(text, color = Lm.cur.textTertiary, fontSize = 13.sp)
            if (action != null) {
                Spacer(Modifier.height(14.dp))
                Box(
                    Modifier
                        .background(Lm.cur.accent.copy(alpha = 0.2f), RoundedCornerShape(18.dp))
                        .clickable(onClick = action.second)
                        .padding(horizontal = 16.dp, vertical = 9.dp)
                ) {
                    Text(action.first, color = Lm.cur.accent, fontSize = 13.sp)
                }
            }
        }
    }
}
