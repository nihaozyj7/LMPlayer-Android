package com.lmplayer.android

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Switch
import androidx.compose.material3.SwitchDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

/**
 * 设置 → 智能匹配（AI）。
 *
 * 这一页存在的唯一理由：**用户只想填一个 API Key**。
 *
 * 后端（Go 的 AiService）早就会用模型把「【SOUTH.SEA】别这么说 - 高音质完整版」
 * 这种 B 站视频标题还原成「SOUTH.SEA - 别这么说」，歌词匹配与封面匹配都会先走
 * 这一步（见 services_online.go / services_cover.go 的 setAI 注入点）。缺的只是
 * 手机上一个能填密钥的入口 —— 桌面版有，原生界面一直没有，所以 AI 在手机上
 * 等于关着，封面和歌词的命中率明显不如桌面版。
 *
 * 三个决定：
 *
 *  1. **接口地址与模型名给默认值**。用户只需要粘 Key，其余三项（地址、模型、
 *     关闭思考）已经按 DeepSeek 官方预置好，想换网关再改。
 *  2. **思考模式默认关**。清洗题目这种任务不需要推理，开着只会慢几倍；后端
 *     按厂商发对应字段（thinking / enable_thinking / reasoning_effort），见
 *     ai_vendor.go。
 *  3. **密钥只写不读**。后端返回的是打码串，这里只显示「已配置」，输入框永远
 *     空白；不填就不会覆盖已有密钥（services.go 里忽略打码串回传）。
 */
@Composable
fun AiSection(config: AppConfig) {
    var key by remember { mutableStateOf("") }
    var baseUrl by remember(config.aiBaseUrl) { mutableStateOf(config.aiBaseUrl) }
    var model by remember(config.aiModelId) { mutableStateOf(config.aiModelId) }

    Column(
        Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
    ) {
        AiTitle("智能匹配（AI）")
        AiHint(
            "B 站上的歌名其实是视频标题（带【】、翻唱、高音质、完整版之类的噪声），" +
                "直接拿去搜封面和歌词经常一条都搜不到。配好一个模型后，匹配前会先把" +
                "歌名清洗成「歌手 - 歌名」再去搜，命中率会明显提高。"
        )
        AiHint(
            "思考模式默认关闭：清洗歌名不需要推理，关掉之后一次调用从十几秒降到一两秒。"
        )

        // ---- 状态
        Row(
            Modifier
                .fillMaxWidth()
                .padding(horizontal = 16.dp, vertical = 10.dp),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            Box(
                Modifier
                    .width(8.dp)
                    .height(8.dp)
                    .background(
                        if (config.aiReady) Lm.cur.success else Lm.cur.textTertiary,
                        RoundedCornerShape(4.dp),
                    )
            )
            Spacer(Modifier.width(10.dp))
            Column(Modifier.weight(1f)) {
                Text(
                    if (config.aiReady) "已配置" else "还没有配置密钥",
                    color = Lm.cur.textPrimary,
                    fontSize = 15.sp,
                )
                if (config.aiReady) {
                    Text(
                        "${config.aiBaseUrl} · ${config.aiModelId.ifBlank { "默认模型" }}",
                        color = Lm.cur.textTertiary,
                        fontSize = 12.sp,
                    )
                }
                if (config.aiBaseUrlProblem.isNotBlank()) {
                    Text(
                        "接口地址有问题：${config.aiBaseUrlProblem}",
                        color = Lm.cur.danger,
                        fontSize = 12.sp,
                    )
                }
            }
        }
        HorizontalDivider(color = Lm.cur.divider)

        // ---- 一键预置
        AiTitle("快速配置")
        AiChipRow(
            listOf(
                "DeepSeek 官方" to {
                    baseUrl = "https://api.deepseek.com"
                    model = "deepseek-chat"
                    // 点了就落盘：用户的心智是「一键预设」，不是「填好还得再保存」
                    Store.patchConfig(
                        "aiBaseUrl" to baseUrl,
                        "aiModelId" to model,
                    )
                },
                "DeepSeek 4.1（dsf-4.1）" to {
                    model = "dsf-4.1"
                    Store.patchConfig("aiModelId" to model)
                },
            )
        )
        AiHint("点「DeepSeek 官方」会把地址与模型填成官方默认值并保存，你只要再填 Key 就能用。")

        // ---- API Key
        AiTitle("API Key")
        AiField(
            value = key,
            onChange = { key = it },
            placeholder = if (config.aiApiKeySet) "已保存（留空则不修改）" else "sk-…",
            password = true,
        )
        AiAction("保存密钥", enabled = key.isNotBlank()) {
            // 地址与模型一起推：预设 + 填 Key 就是全部步骤，不要让用户再点两次保存
            Store.patchConfig(
                "aiApiKey" to key.trim(),
                "aiBaseUrl" to baseUrl.trim(),
                "aiModelId" to model.trim(),
            )
            key = ""
            Store.pushError("密钥已保存")
        }

        // ---- 接口地址
        AiTitle("接口地址")
        AiField(
            value = baseUrl,
            onChange = { baseUrl = it },
            placeholder = "https://api.deepseek.com",
            password = false,
        )
        AiAction("保存地址", enabled = baseUrl.isNotBlank()) {
            Store.patchConfig("aiBaseUrl" to baseUrl.trim())
        }

        // ---- 模型
        AiTitle("模型")
        AiField(
            value = model,
            onChange = { model = it },
            placeholder = "deepseek-chat / dsf-4.1 …",
            password = false,
        )
        AiChipRow(
            listOf(
                "deepseek-chat" to { model = "deepseek-chat"; Store.patchConfig("aiModelId" to model) },
                "deepseek-reasoner" to { model = "deepseek-reasoner"; Store.patchConfig("aiModelId" to model) },
                "dsf-4.1" to { model = "dsf-4.1"; Store.patchConfig("aiModelId" to model) },
            )
        )
        AiAction("保存模型", enabled = model.isNotBlank()) {
            Store.patchConfig("aiModelId" to model.trim())
        }

        // ---- 开关
        AiTitle("行为")
        AiToggle(
            title = "关闭思考模式",
            desc = "清洗歌名不需要推理，关掉更快（默认关）",
            checked = !config.aiThinking,
        ) { off -> Store.patchConfig("aiThinking" to !off) }

        AiToggle(
            title = "匹配歌词前用 AI 清洗歌名",
            desc = "关掉后歌词匹配只走本地整形，不再等待模型返回",
            checked = config.aiLyricsClean,
        ) { on -> Store.patchConfig("aiLyricsClean" to on) }

        AiToggle(
            title = "下载完成后用 AI 整理标签",
            desc = "会改写音乐文件的标签（可撤销的只有曲库，文件本身不可回滚）",
            checked = config.aiDownloadTag,
        ) { on -> Store.patchConfig("aiDownloadTag" to on) }

        AiHint(
            "封面自动匹配在「曲库」页里；歌词面板的在线搜索也会用到这里的配置。" +
                "密钥只保存在本机配置里，界面上永远显示已打码的状态。"
        )
        Spacer(Modifier.height(30.dp))
    }
}

/** 曲库页里那行封面匹配进度（没在跑且没有结果时不占位）。 */
@Composable
fun CoverProgressRow() {
    val p by Covers.state.collectAsState()
    val text = p.text
    if (text.isBlank()) return
    Row(
        Modifier
            .fillMaxWidth()
            .padding(horizontal = 20.dp, vertical = 6.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Text(text, color = Lm.cur.textTertiary, fontSize = 12.sp, modifier = Modifier.weight(1f))
        if (p.running) {
            Text(
                "停止",
                color = Lm.cur.accent,
                fontSize = 12.sp,
                modifier = Modifier
                    .clickable { Covers.cancel() }
                    .padding(horizontal = 8.dp, vertical = 4.dp),
            )
        }
    }
    if (p.running && p.total > 0) {
        Box(Modifier.padding(horizontal = 20.dp)) {
            ThinProgress(p.done.toFloat() / p.total.toFloat())
        }
    }
}

/* ------------------------------------------------------------------ 小部件 */

@Composable
private fun AiTitle(text: String) {
    Text(
        text,
        color = Lm.cur.textTertiary,
        fontSize = 12.sp,
        fontWeight = FontWeight.Medium,
        modifier = Modifier.padding(start = 20.dp, top = 18.dp, bottom = 6.dp),
    )
}

@Composable
private fun AiHint(text: String) {
    Text(
        text,
        color = Lm.cur.textTertiary,
        fontSize = 12.5.sp,
        lineHeight = 17.sp,
        modifier = Modifier.padding(horizontal = 16.dp, vertical = 6.dp),
    )
}

@Composable
private fun AiField(
    value: String,
    onChange: (String) -> Unit,
    placeholder: String,
    password: Boolean,
) {
    OutlinedTextField(
        value = value,
        onValueChange = onChange,
        singleLine = true,
        placeholder = { Text(placeholder, color = Lm.cur.textTertiary, fontSize = 13.sp) },
        visualTransformation = if (password) PasswordVisualTransformation() else androidx.compose.ui.text.input.VisualTransformation.None,
        textStyle = androidx.compose.ui.text.TextStyle(color = Lm.cur.textPrimary, fontSize = 14.sp),
        colors = OutlinedTextFieldDefaults.colors(
            focusedBorderColor = Lm.cur.accent,
            unfocusedBorderColor = Lm.cur.divider,
            cursorColor = Lm.cur.accent,
        ),
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp, vertical = 4.dp),
    )
}

@Composable
private fun AiAction(text: String, enabled: Boolean = true, onClick: () -> Unit) {
    Box(
        Modifier
            .padding(horizontal = 16.dp, vertical = 6.dp)
            .background(
                if (enabled) Lm.cur.accent.copy(alpha = 0.18f) else Lm.cur.bgRaised,
                RoundedCornerShape(10.dp),
            )
            .clickable(enabled = enabled, onClick = onClick)
            .padding(horizontal = 16.dp, vertical = 9.dp)
    ) {
        Text(
            text,
            color = if (enabled) Lm.cur.accent else Lm.cur.textTertiary,
            fontSize = 13.sp,
        )
    }
}

@Composable
private fun AiChipRow(items: List<Pair<String, () -> Unit>>) {
    Row(Modifier.padding(horizontal = 16.dp, vertical = 6.dp)) {
        items.forEach { (label, action) ->
            Box(
                Modifier
                    .padding(end = 8.dp)
                    .background(Lm.cur.bgRaised, RoundedCornerShape(9.dp))
                    .clickable(onClick = action)
                    .padding(horizontal = 12.dp, vertical = 7.dp)
            ) {
                Text(label, color = Lm.cur.textSecondary, fontSize = 12.sp)
            }
        }
    }
}

@Composable
private fun AiToggle(title: String, desc: String, checked: Boolean, onChange: (Boolean) -> Unit) {
    Row(
        Modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp, vertical = 10.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Column(Modifier.weight(1f)) {
            Text(title, color = Lm.cur.textPrimary, fontSize = 15.sp)
            Text(desc, color = Lm.cur.textTertiary, fontSize = 12.sp, lineHeight = 16.sp)
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
    HorizontalDivider(color = Lm.cur.divider)
}
