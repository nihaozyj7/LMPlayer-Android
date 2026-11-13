package com.lmplayer.android

import android.content.Context
import android.content.Intent
import android.net.Uri
import android.os.Build
import android.os.Environment
import android.provider.Settings
import java.io.File

/**
 * 「所有文件访问」权限与下载目录兜底。
 *
 * ★ 为什么要这一层：下载目录默认是 /sdcard/Music/LMPlayer（公共目录），而
 * Android 11+ 没有 MANAGE_EXTERNAL_STORAGE 就完全写不进去。后端唯一的表现
 * 就是 DownloadService.Start 卡住 —— 它会在 uniquePath 里用 O_EXCL 逐个试
 * 「歌名 (2).m4a」「歌名 (3).m4a」…直到 999 个候选全部因权限失败，用户只看到
 * 一个「下载失败」，日志里则是几百行 Permission denied。
 *
 * 所以这里做两件事：
 *   1. 提供跳系统设置的入口（设置 → 下载 → 文件访问权限）；
 *   2. 启动时若发现当前下载目录不可写，自动切到应用专属目录（Android/data/
 *      <包名>/files/Music）—— 那个目录不需要任何权限，保证「下载」这个功能
 *      不是死的。用户在系统里授权后可以在设置页切回公共目录。
 *
 * 用「写入探针」而不是只看权限开关：用户可能只给了 MEDIA 权限、或者目录本身
 * 被别的应用占成了只读，这些情况 isExternalStorageManager 都看不出来。
 */
object StorageAccess {

    /** 是否已拿到「所有文件访问」权限（Android 11 以下恒为 true）。 */
    fun granted(): Boolean =
        Build.VERSION.SDK_INT < Build.VERSION_CODES.R || Environment.isExternalStorageManager()

    /** 跳到本应用的「所有文件访问」授权页。 */
    fun openSettings(ctx: Context) {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.R) return
        runCatching {
            ctx.startActivity(
                Intent(Settings.ACTION_MANAGE_APP_ALL_FILES_ACCESS_PERMISSION)
                    .setData(Uri.parse("package:${ctx.packageName}"))
                    .addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            )
        }.onFailure { Store.pushError("打不开系统授权页：${it.message}") }
    }

    /** 应用专属音乐目录（无需任何权限，卸载 App 时一起删除）。 */
    fun appMusicDir(ctx: Context): String =
        File(ctx.getExternalFilesDir(null), "Music").apply { mkdirs() }.absolutePath

    /**
     * 保证下载目录可写：不可写就切到应用专属目录。
     * 返回新目录（切换了）或 null（无需改动）。必须在后端就绪后调用。
     */
    suspend fun ensureDownloadDir(ctx: Context): String? {
        // 已授权就尊重用户设置的目录，不要擅自改
        if (granted()) return null
        val current = runCatching {
            Bridge.call("DownloadService.Dir") as? String
        }.getOrNull().orEmpty()
        if (current.isNotBlank() && writable(current)) return null

        val fallback = appMusicDir(ctx)
        if (!writable(fallback)) return null
        runCatching { Bridge.call("DownloadService.ApplyDir", fallback, false) }
            .onFailure { Store.pushError("切换下载目录失败：${it.message}") }
        return fallback
    }

    /** 往目录里真写一个探针文件，写得进才算可写。 */
    fun writable(dir: String): Boolean = runCatching {
        val d = File(dir).apply { mkdirs() }
        val probe = File(d, ".lm_write_probe")
        probe.writeText("x")
        probe.delete()
        true
    }.getOrDefault(false)
}
