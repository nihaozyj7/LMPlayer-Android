package com.lmplayer.android

import android.content.Context
import android.net.Uri
import android.os.Environment
import android.provider.DocumentsContract

/**
 * 把 SAF（Storage Access Framework）选中的目录转成真实文件系统路径。
 *
 * Go 后端只会做 os.ReadDir，认不得 content:// URI，所以必须转换。
 * 主存储（primary）能可靠推导；云盘、SD 卡卷 id 不是 primary 的也能按
 * /storage/<vol> 拼出来；真正的云文档（authority 不是 externalstorage）
 * 拿不到路径，返回 null 由调用方提示。
 */
object Documents {
    fun pathOf(ctx: Context, uri: Uri): String? {
        if (uri.scheme == "file") return uri.path
        val authority = uri.authority ?: return null
        if (authority != "com.android.externalstorage.documents") return null

        val docId = runCatching { DocumentsContract.getTreeDocumentId(uri) }.getOrNull() ?: return null
        val parts = docId.split(":", limit = 2)
        val volume = parts[0]
        val rel = if (parts.size > 1) parts[1].trim('/') else ""
        val root = when {
            volume.equals("primary", ignoreCase = true) ->
                Environment.getExternalStorageDirectory()?.absolutePath ?: return null
            else -> "/storage/$volume"
        }
        return if (rel.isEmpty()) root else "$root/$rel"
    }
}
