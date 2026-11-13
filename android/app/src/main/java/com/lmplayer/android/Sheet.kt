package com.lmplayer.android

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.ModalBottomSheet
import androidx.compose.material3.rememberModalBottomSheetState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import kotlinx.coroutines.launch

/**
 * 底部面板（队列 / 歌曲菜单）。
 *
 * 手势与动画交给 Material3 的 ModalBottomSheet：它跑在独立的 Dialog 窗口里，
 * 用 AnchoredDraggable 做拖拽，滑入/滑出/遮罩淡入淡出/甩速判定都是官方实现，
 * 不需要自己维护「跟手位移 + 回弹 + 遮罩透明度」三条时间轴 —— 自绘那套在
 * 嵌套手势的页面里很容易被上层（详情页的滑动手势）抢掉事件，表现成「拖不动」。
 *
 * 关闭统一走 dismiss()：先播 hide() 动画，动画播完再让调用方卸载它，
 * 否则 showQueue=false 会让面板「啪」地消失。
 */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun Sheet(onDismiss: () -> Unit, content: @Composable (dismiss: () -> Unit) -> Unit) {
    val state = rememberModalBottomSheetState(skipPartiallyExpanded = true)
    val scope = rememberCoroutineScope()

    fun dismiss() {
        scope.launch { state.hide() }.invokeOnCompletion { onDismiss() }
    }

    ModalBottomSheet(
        onDismissRequest = { dismiss() },
        sheetState = state,
        shape = Radii.sheet,
        containerColor = Lm.cur.bgElevated,
        contentColor = Lm.cur.textPrimary,
        scrimColor = Color.Black.copy(alpha = 0.45f),
        tonalElevation = 0.dp,
        dragHandle = {
            // 把手：告诉用户这块可以拖
            Box(Modifier.fillMaxWidth(), contentAlignment = Alignment.Center) {
                Box(
                    Modifier
                        .padding(top = 8.dp, bottom = 6.dp)
                        .width(38.dp)
                        .height(4.dp)
                        .clip(RoundedCornerShape(2.dp))
                        .background(Lm.cur.divider.copy(alpha = 0.8f))
                )
            }
        },
        contentWindowInsets = { WindowInsets(0, 0, 0, 0) },
    ) {
        Column(
            Modifier
                .fillMaxWidth()
                .navigationBarsPadding()
        ) {
            content({ dismiss() })
        }
    }
}
