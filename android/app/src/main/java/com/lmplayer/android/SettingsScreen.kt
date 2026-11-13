package com.lmplayer.android

import android.content.Intent
import androidx.activity.compose.BackHandler
import androidx.compose.animation.AnimatedContent
import androidx.compose.animation.slideInHorizontally
import androidx.compose.animation.slideOutHorizontally
import androidx.compose.animation.togetherWith
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Switch
import androidx.compose.material3.SwitchDefaults
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
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import kotlinx.coroutines.launch

private enum class SettingsPage(val title: String) {
    Root("设置"),
    Library("曲库"),
    PlayerSection("播放"),
    Loudness("响度"),
    Covers("封面匹配"),
    Hidden("已隐藏的歌曲"),
    Ai("智能匹配"),
    Ui("界面"),
    Download("下载"),
    About("关于"),
}

/**
 * 设置：整页 + 分类导航。
 *
 * 手机上把设置做成「分类 → 分区页」而不是一长条（更不是弹层）：
 * 一屏能放下的行数有限，左右两栏的键值布局在窄屏上会把标签挤成两行，
 * 所以每一项都是「标题在上、说明在下、控件单独一行」的竖向结构。
 */
@Composable
fun SettingsScreen(
    config: AppConfig,
    folders: List<Folder>,
    onBack: () -> Unit,
    onPickFolder: () -> Unit,
    onReset: () -> Unit,
) {
    var page by remember { mutableStateOf(SettingsPage.Root) }
    // 单击歌曲的行为存在本地（不是后端配置），所以要在页面里留一份可变状态
    var clickAction by remember { mutableStateOf(Persist.clickAction) }
    val ctx = LocalContext.current

    // 系统返回键：先退回设置首页，再按一次才离开设置。
    // 与 AppRoot 里那条（page != Home 时回主页）配合：子页面后注册，优先命中。
    BackHandler(enabled = page != SettingsPage.Root) { page = SettingsPage.Root }

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
            IconButtonBox({ if (page == SettingsPage.Root) onBack() else page = SettingsPage.Root }) {
                LmIcon(Icon.Back, 22.dp, Lm.cur.textPrimary)
            }
            Text(
                page.title,
                color = Lm.cur.textPrimary,
                fontSize = 22.sp,
                fontWeight = FontWeight.SemiBold,
                modifier = Modifier.padding(horizontal = 6.dp),
            )
        }
        HorizontalDivider(color = Lm.cur.divider)

        AnimatedContent(
            targetState = page,
            transitionSpec = {
                // 前进从右进、后退从左进 —— 与「层级变深」的空间关系一致
                val forward = targetState.ordinal >= initialState.ordinal
                val dir = if (forward) 1 else -1
                (slideInHorizontally { it * dir / 4 } + androidx.compose.animation.fadeIn())
                    .togetherWith(
                        slideOutHorizontally { -it * dir / 4 } + androidx.compose.animation.fadeOut()
                    )
            },
            label = "settings",
        ) { p ->
            when (p) {
                SettingsPage.Root -> Column(Modifier.fillMaxSize()) {
                    SettingsCategory("曲库", "文件夹、扫描与统计", Icon.Folder) { page = SettingsPage.Library }
                    SettingsCategory("播放", "循环、跳过静音", Icon.Play) { page = SettingsPage.PlayerSection }
                    SettingsCategory("响度均衡", "按 EBU R128 统一各首歌的音量", Icon.Volume) { page = SettingsPage.Loudness }
                    SettingsCategory("封面匹配", "逐首查看匹配结果与失败原因", Icon.Image) { page = SettingsPage.Covers }
                    SettingsCategory("已隐藏的歌曲", "从曲库移除过的歌，可以放回来", Icon.Off) { page = SettingsPage.Hidden }
                    SettingsCategory("智能匹配", "AI 清洗歌名，提升封面与歌词命中率", Icon.Search) { page = SettingsPage.Ai }
                    SettingsCategory("界面", "明暗模式、动效", Icon.Theme) { page = SettingsPage.Ui }
                    SettingsCategory("下载", "下载目录与任务", Icon.Download) { page = SettingsPage.Download }
                    SettingsCategory("关于", "版本与经典界面", Icon.Settings) { page = SettingsPage.About }
                }

                SettingsPage.Library -> LazyColumn(Modifier.fillMaxSize()) {
                    item {
                        SectionTitle("音乐文件夹")
                        folders.forEach { f ->
                            FolderRow(f) { Store.removeFolder(f.id) }
                        }
                        if (folders.isEmpty()) {
                            Hint("还没有添加文件夹。选一个本机目录，里面的音频会自动加进曲库。")
                        }
                        ActionRow("添加文件夹", "从系统目录选择器里挑一个本机目录", Icon.Add) { onPickFolder() }
                        ActionRow("重新扫描全部", "也可以直接在列表里下拉刷新", Icon.Refresh) { Store.rescan() }
                        ActionRow(
                            "封面匹配",
                            "逐首查看匹配结果与失败原因（脏标题会先用 AI 清洗）",
                            Icon.Image,
                        ) { page = SettingsPage.Covers }
                    }
                }

                SettingsPage.PlayerSection -> Column(
                    Modifier
                        .fillMaxSize()
                        .verticalScroll(rememberScrollState())
                ) {
                    SectionTitle("播放")
                    Hint(
                        "手机上的音频由系统解码器播放（mp3 / flac / aac / ogg / wav / m4a）。" +
                            "ape / wma 需要 ffmpeg 转码，APK 里没有内置，暂时无法播放。"
                    )
                    ChoiceRow(
                        title = "单击歌曲时",
                        desc = if (clickAction == "append")
                            "点歌后接在现有播放队列末尾，不打乱已经排好的顺序；" +
                                "这首歌已经在队列里时直接跳过去播"
                        else "点歌后用当前列表整体替换播放队列，从这首开始往后播",
                        options = listOf("append" to "加入播放队列", "list" to "整个列表设为队列"),
                        current = clickAction,
                    ) {
                        clickAction = it
                        Persist.clickAction = it
                    }
                    ActionRow("清空播放队列", "停止当前播放并清空队列", Icon.Trash) {
                        Player.clearQueue()
                    }
                }

                SettingsPage.Loudness -> LoudnessSection()

                SettingsPage.Covers -> CoversBody()

                SettingsPage.Hidden -> HiddenSongsSection()

                SettingsPage.Ai -> AiSection(config)

                SettingsPage.Ui -> Column(
                    Modifier
                        .fillMaxSize()
                        .verticalScroll(rememberScrollState())
                ) {
                    SectionTitle("外观")
                    ChoiceRow(
                        title = "明暗模式",
                        desc = "跟随系统时会随手机的深色模式切换",
                        options = listOf("system" to "跟随系统", "dark" to "深色", "light" to "浅色"),
                        current = config.themeMode,
                    ) { Store.patchConfig("themeMode" to it) }
                    ToggleRow(
                        title = "界面动效",
                        desc = "关闭后页面切换与抽屉不再做过渡动画",
                        checked = config.animations,
                    ) { Store.patchConfig("animations" to it) }
                    ChoiceRow(
                        title = "动效速度",
                        desc = "影响页面转场时间",
                        options = listOf("fast" to "快", "medium" to "中", "slow" to "慢"),
                        current = config.animationsSpeed,
                    ) { Store.patchConfig("animationsSpeed" to it) }
                }

                SettingsPage.Download -> Column(
                    Modifier
                        .fillMaxSize()
                        .verticalScroll(rememberScrollState())
                ) {
                    SectionTitle("下载")
                    Hint(
                        "下载的歌曲会放进下面这个目录，下载完成后会自动加进曲库。" +
                            "存到公共的「音乐」目录需要系统授权，未授权时会自动使用应用专属目录。"
                    )
                    // 权限入口：这是「下载点了没反应」的真正原因，必须能点得到
                    ActionRow(
                        "文件访问权限",
                        if (StorageAccess.granted()) "已授权：可写入 音乐/LMPlayer"
                        else "未授权：只能存到应用专属目录，点此去系统设置授权",
                        Icon.Folder,
                    ) {
                        if (StorageAccess.granted()) {
                            Store.pushError("已获得「所有文件访问」权限，无需重复授权")
                        } else {
                            StorageAccess.openSettings(ctx)
                        }
                    }
                    ActionRow("存到 音乐/LMPlayer", "公共音乐目录（需要上面的权限）", Icon.Folder) {
                        val dir = android.os.Environment
                            .getExternalStoragePublicDirectory(android.os.Environment.DIRECTORY_MUSIC)
                        if (dir == null) {
                            Store.pushError("取不到公共音乐目录")
                        } else if (!StorageAccess.granted()) {
                            Store.pushError("还没有「所有文件访问」权限，请先授权")
                        } else {
                            applyDownloadDir("${dir.absolutePath}/LMPlayer")
                        }
                    }
                    ActionRow("存到应用专属目录", "不需要任何权限，卸载 App 时一起删除", Icon.Download) {
                        applyDownloadDir(StorageAccess.appMusicDir(ctx))
                    }
                    SectionTitle("下载队列")
                    DownloadsContent(null)
                    ActionRow("清空已完成任务", "只清理列表，不删已下载的文件", Icon.Trash) {
                        kotlinx.coroutines.MainScope().launch {
                            runCatching { Bridge.call("DownloadService.ClearFinished") }
                        }
                    }
                }

                SettingsPage.About -> Column(
                    Modifier
                        .fillMaxSize()
                        .verticalScroll(rememberScrollState())
                ) {
                    SectionTitle("关于")
                    Hint("LMPlayer 原生界面版。后端（曲库扫描、标签解析、在线试听、下载、AI 标签）" +
                        "仍是桌面版同一份 Go 代码，通过 gomobile 在进程内运行。")
                    ActionRow("打开经典界面", "旧版 WebView 界面（排查问题用）", Icon.Lyrics) {
                        ctx.startActivity(Intent(ctx, MainActivity::class.java))
                    }
                    ActionRow("重置设置", "恢复默认配置（不会删除歌曲与歌单）", Icon.Refresh) { onReset() }
                    Spacer(Modifier.height(30.dp))
                }
            }
        }
    }
}

/* ------------------------------------------------------------------ 组成块 */

/** 切换下载目录。必须是 ApplyDir —— SetDir 只返回「提案」，不落盘也不会迁移。 */
private fun applyDownloadDir(dir: String) {
    kotlinx.coroutines.MainScope().launch {
        runCatching { Bridge.call("DownloadService.ApplyDir", dir, false) }
            .onSuccess { Store.pushError("下载目录已切换到 $dir") }
            .onFailure { Store.pushError(it.message ?: "设置下载目录失败") }
    }
}

@Composable
private fun SectionTitle(text: String) {
    Text(
        text,
        color = Lm.cur.textTertiary,
        fontSize = 12.sp,
        fontWeight = FontWeight.Medium,
        modifier = Modifier.padding(start = 20.dp, top = 18.dp, bottom = 6.dp),
    )
}

@Composable
private fun Hint(text: String) {
    Text(
        text,
        color = Lm.cur.textTertiary,
        fontSize = 12.5.sp,
        lineHeight = 17.sp,
        modifier = Modifier.padding(horizontal = 16.dp, vertical = 8.dp),
    )
}

@Composable
private fun SettingsCategory(title: String, desc: String, icon: Icon, onClick: () -> Unit) {    Row(
        Modifier
            .fillMaxWidth()
            .height(66.dp)
            .clickable(onClick = onClick)
            .padding(horizontal = 16.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        LmIcon(icon, 20.dp, Lm.cur.textSecondary)
        Spacer(Modifier.width(16.dp))
        Column(Modifier.weight(1f)) {
            Text(title, color = Lm.cur.textPrimary, fontSize = 16.sp)
            Text(desc, color = Lm.cur.textTertiary, fontSize = 12.sp)
        }
        LmIcon(Icon.Chevron, 16.dp, Lm.cur.textTertiary)
    }
    HorizontalDivider(color = Lm.cur.divider, modifier = Modifier.padding(start = 56.dp))
}

@Composable
private fun ActionRow(title: String, desc: String, icon: Icon, onClick: () -> Unit) {
    Row(
        Modifier
            .fillMaxWidth()
            .height(62.dp)
            .clickable(onClick = onClick)
            .padding(horizontal = 16.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        LmIcon(icon, 19.dp, Lm.cur.textSecondary)
        Spacer(Modifier.width(16.dp))
        Column(Modifier.weight(1f)) {
            Text(title, color = Lm.cur.textPrimary, fontSize = 16.sp)
            Text(desc, color = Lm.cur.textTertiary, fontSize = 12.sp, maxLines = 2)
        }
    }
    HorizontalDivider(color = Lm.cur.divider, modifier = Modifier.padding(start = 55.dp))
}

/** 设置项：标题 + 说明占满整行，控件另起一行（避免窄屏左右两栏被挤爆）。 */
@Composable
private fun ToggleRow(title: String, desc: String, checked: Boolean, onChange: (Boolean) -> Unit) {
    Column(Modifier.padding(horizontal = 16.dp, vertical = 12.dp)) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            Column(Modifier.weight(1f)) {
                Text(title, color = Lm.cur.textPrimary, fontSize = 16.sp)
                Text(desc, color = Lm.cur.textTertiary, fontSize = 12.sp)
            }
            Switch(
                checked = checked,
                onCheckedChange = onChange,
                colors = SwitchDefaults.colors(
                    checkedThumbColor = Color.White,
                    checkedTrackColor = Lm.cur.accent,
                ),
            )
        }
    }
    HorizontalDivider(color = Lm.cur.divider)
}

@Composable
private fun ChoiceRow(
    title: String,
    desc: String,
    options: List<Pair<String, String>>,
    current: String,
    onPick: (String) -> Unit,
) {
    Column(Modifier.padding(horizontal = 16.dp, vertical = 12.dp)) {
        Text(title, color = Lm.cur.textPrimary, fontSize = 16.sp)
        Text(desc, color = Lm.cur.textTertiary, fontSize = 12.sp)
        Spacer(Modifier.height(9.dp))
        Row(Modifier.fillMaxWidth()) {
            options.forEach { (value, label) ->
                val active = value == current
                Box(
                    Modifier
                        .padding(end = 8.dp)
                        .background(
                            if (active) Lm.cur.accent.copy(alpha = 0.22f) else Lm.cur.bgRaised,
                            RoundedCornerShape(9.dp),
                        )
                        .clickable { onPick(value) }
                        .padding(horizontal = 14.dp, vertical = 8.dp)
                ) {
                    Text(
                        label,
                        color = if (active) Lm.cur.accent else Lm.cur.textSecondary,
                        fontSize = 12.5.sp,
                    )
                }
            }
        }
    }
    HorizontalDivider(color = Lm.cur.divider)
}

@Composable
private fun FolderRow(folder: Folder, onRemove: () -> Unit) {
    val statusColor = when (folder.status) {
        "ok" -> Lm.cur.success
        "denied" -> Lm.cur.danger
        else -> Lm.cur.textTertiary
    }
    val statusText = when (folder.status) {
        "ok" -> "正常"
        "denied" -> "无权限"
        "missing" -> "目录不存在"
        else -> folder.status
    }
    Row(
        Modifier
            .fillMaxWidth()
            .padding(start = 20.dp, end = 6.dp, top = 10.dp, bottom = 10.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Column(Modifier.weight(1f)) {
            Text(
                folder.name,
                color = Lm.cur.textPrimary,
                fontSize = 16.sp,
                maxLines = 1,
                overflow = TextOverflow.Ellipsis,
            )
            Text(
                "${folder.trackCount} 首 · $statusText",
                color = statusColor,
                fontSize = 12.sp,
            )
            Text(
                folder.path,
                color = Lm.cur.textTertiary,
                fontSize = 11.sp,
                maxLines = 1,
                overflow = TextOverflow.Ellipsis,
            )
        }
        IconButtonBox(onRemove, 40) { LmIcon(Icon.Trash, 17.dp, Lm.cur.textTertiary) }
    }
    HorizontalDivider(color = Lm.cur.divider, modifier = Modifier.padding(start = 20.dp))
}

/* ------------------------------------------------------------ 响度均衡页 */

/** 已隐藏的歌曲：恢复或清空排除表。 */
@Composable
private fun HiddenSongsSection() {
    val lib by Store.state.collectAsState()
    val hidden = lib.songs.filter { it.id in lib.hiddenIds }

    Column(Modifier.fillMaxSize()) {
        Hint(
            "「从曲库移除」不会删文件，只是把歌放进这张排除表：曲库照常扫描，列表里不显示。" +
                "随时可以在这里放回来。"
        )
        if (hidden.isEmpty()) {
            Hint("没有隐藏的歌曲。")
        } else {
            ActionRow("全部恢复", "把 ${hidden.size} 首歌重新显示在曲库里", Icon.Refresh) {
                Store.unhideAll()
            }
            LazyColumn(Modifier.fillMaxSize()) {
                items(hidden, key = { it.id }) { song ->
                    Row(
                        Modifier
                            .fillMaxWidth()
                            .padding(start = 20.dp, end = 12.dp, top = 8.dp, bottom = 8.dp),
                        verticalAlignment = Alignment.CenterVertically,
                    ) {
                        Column(Modifier.weight(1f)) {
                            Text(
                                song.displayTitle,
                                color = Lm.cur.textPrimary,
                                fontSize = 15.sp,
                                maxLines = 1,
                                overflow = TextOverflow.Ellipsis,
                            )
                            Text(
                                song.displayArtist,
                                color = Lm.cur.textTertiary,
                                fontSize = 11.5.sp,
                                maxLines = 1,
                                overflow = TextOverflow.Ellipsis,
                            )
                        }
                        IconButtonBox({ Store.unhideSong(song.id) }, 40) {
                            LmIcon(Icon.Add, 17.dp, Lm.cur.textTertiary)
                        }
                    }
                    HorizontalDivider(color = Lm.cur.divider, modifier = Modifier.padding(start = 20.dp))
                }
            }
        }
    }
}

/**
 * 响度均衡设置。
 *
 * 说明文案刻意写清「首次播放会在后台解码测量」：这一步要解码整首歌，
 * 老歌机或长音频上会占几秒 CPU，不提前说清楚就会被当成卡顿。
 */
@Composable
private fun LoudnessSection() {
    val st by Loudness.state.collectAsState()
    val lib by Store.state.collectAsState()
    val scope = rememberCoroutineScope()

    Column(Modifier.fillMaxSize().verticalScroll(rememberScrollState())) {
        SectionTitle("响度均衡")
        Hint(
            "按 EBU R128（BS.1770）测出每首歌的整合响度，播放时把音量拉齐到目标挡位，" +
                "并按真峰值 -1 dBTP 收住，避免抬升后削波。APK 里没有 ffmpeg，" +
                "解码用系统 MediaCodec，算法与桌面版完全相同。"
        )
        Hint(
            "测量要解码整首歌，所以是按需进行的：首次播到某首歌时在后台测，" +
                "测完立刻补上补偿；也可以在这里一次性测完整个曲库。"
        )

        ChoiceRow(
            title = "模式",
            desc = "关闭后完全不做音量补偿（原始音量）",
            options = listOf(Loudness.MODE_OFF to "关闭", Loudness.MODE_TRACK to "单曲"),
            current = st.mode,
        ) {
            Loudness.setMode(it)
            Player.refreshLoudness()
        }

        ChoiceRow(
            title = "目标响度",
            desc = "所有歌向这个响度看齐。数值越小最终音量越轻：-14 接近流媒体（最响），" +
                "-23 是广播标准（最轻），选得太小会觉得歌变轻了",
            options = Loudness.TARGETS.map { t ->
                t.toInt().toString() to when (t) {
                    -14.0 -> "-14 LUFS（最响）"
                    -23.0 -> "-23 LUFS（最轻）"
                    else -> "${t.toInt()} LUFS"
                }
            },
            current = st.target.toInt().toString(),
        ) {
            Loudness.setTarget(it.toDouble())
            Player.refreshLoudness()
        }

        if (st.measuring) {
            Hint("正在测量 ${st.done}/${st.total}" + if (st.current.isBlank()) "" else "：${st.current}")
        } else {
            Hint("已测量 ${st.measured} 首" + if (lib.songs.isNotEmpty()) "（曲库共 ${lib.songs.size} 首）" else "")
        }
        if (st.note.isNotBlank()) Hint(st.note)

        ActionRow("测量全部", "把整个曲库测一遍，已测过的跳过（后台执行，可继续听歌）", Icon.Refresh) {
            scope.launch { Loudness.measureAll(lib.songs) }
        }
        ActionRow("清除响度数据", "清空已测结果，下次播放重新测量", Icon.Trash) { Loudness.clear() }
    }
}

