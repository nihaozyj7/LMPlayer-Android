package com.lmplayer.android

import android.Manifest
import android.content.Intent
import android.content.pm.PackageManager
import android.graphics.Color
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.os.Environment
import android.provider.Settings
import android.util.Log
import android.view.View
import android.view.Window
import android.view.WindowManager
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.activity.result.contract.ActivityResultContracts
import androidx.core.view.WindowCompat
import com.lmplayer.core.mobile.Mobile
import kotlinx.coroutines.launch
import java.io.File

/**
 * 原生界面入口。
 *
 * 与旧版（MainActivity + WebView）的关键差别：这里不再加载网页，界面全部是
 * Compose 写的；Go 后端照旧通过 gomobile 的 AAR 在进程内启动，但 Kotlin 侧
 * 走 Bridge 直调（Mobile.rpc），不再需要把请求发到 127.0.0.1 再绕回来。
 *
 * 旧的 WebView 界面保留为「经典界面」入口（设置 → 关于 → 经典界面），
 * 一是可以对照排查渲染问题，二是万一某个功能原生版还没搬完，用户不至于被卡死。
 */
class NativeActivity : ComponentActivity() {

    companion object {
        private const val TAG = "LMNative"
    }

    private var backendReady = false
    private var bootError: String? = null

    private val requestAudioPermission =
        registerForActivityResult(ActivityResultContracts.RequestMultiplePermissions()) { grants ->
            Log.i(TAG, "权限结果 $grants")
            if (grants.values.all { it }) Store.rescan()
        }

    private val pickFolder =
        registerForActivityResult(ActivityResultContracts.OpenDocumentTree()) { uri: Uri? ->
            if (uri == null) return@registerForActivityResult
            // 持久化授权，否则重启后后端读不到这个目录
            runCatching {
                contentResolver.takePersistableUriPermission(
                    uri, Intent.FLAG_GRANT_READ_URI_PERMISSION
                )
            }
            val path = Documents.pathOf(this, uri)
            Log.i(TAG, "选中目录 $uri → $path")
            if (path != null) {
                Store.addFolder(path)
            } else {
                // 拿不到真实路径（多数是云盘/非主存储）：明确告诉用户原因，
                // 而不是默默什么都没发生 —— 这就是旧版「打不开文件夹」的体感来源。
                Store.pushError("这个目录不在本机存储上（云盘/在线文档），暂不支持；请选择本机存储里的文件夹")
            }
        }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        requestWindowFeature(Window.FEATURE_NO_TITLE)
        enableEdgeToEdge()
        WindowCompat.setDecorFitsSystemWindows(window, false)
        window.setBackgroundDrawableResource(android.R.color.black)

        setContent {
            AppRoot(onPickFolder = { pickFolder.launch(null) })
        }

        askPermissions()
        Thread(this::boot, "backend-boot").start()
    }

    /* ---------------------------------------------------------------- 权限 */

    private fun askPermissions() {
        val want = mutableListOf<String>()
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            if (checkSelfPermission(Manifest.permission.READ_MEDIA_AUDIO) != PackageManager.PERMISSION_GRANTED) {
                want += Manifest.permission.READ_MEDIA_AUDIO
            }
            if (checkSelfPermission(Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED) {
                want += Manifest.permission.POST_NOTIFICATIONS
            }
        } else if (checkSelfPermission(Manifest.permission.READ_EXTERNAL_STORAGE) != PackageManager.PERMISSION_GRANTED) {
            want += Manifest.permission.READ_EXTERNAL_STORAGE
        }
        if (want.isNotEmpty()) requestAudioPermission.launch(want.toTypedArray())
        // Android 11+ 上想读 /sdcard 下任意目录（用户手输的路径、下载目录），
        // 只有 MediaStore 权限是不够的，需要「所有文件访问」。不强行跳转：
        // 只在没授权时记一笔，由设置页提供一个显式入口。
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R && !Environment.isExternalStorageManager()) {
            Log.i(TAG, "尚未获得所有文件访问权限（可用 MediaStore 之外的目录前先授权）")
        }
    }

    fun requestAllFilesAccess() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
            runCatching {
                startActivity(
                    Intent(Settings.ACTION_MANAGE_APP_ALL_FILES_ACCESS_PERMISSION)
                        .setData(Uri.parse("package:$packageName"))
                )
            }
        }
    }

    /* ---------------------------------------------------------------- 启动 */

    private fun boot() {
        try {
            val webDir = File(filesDir, "www").apply { mkdirs() }
            val dataDir = File(filesDir, "data").apply { mkdirs() }
            val cacheDir = File(cacheDir, "lmplayer").apply { mkdirs() }

            val port = Mobile.start(
                webDir.absolutePath,
                dataDir.absolutePath,
                cacheDir.absolutePath,
                defaultMusicDir(),
            )
            val base = "http://127.0.0.1:$port"
            Log.i(TAG, "后端就绪 port=$port")

            runOnUiThread {
                Bridge.attach(base)
                Persist.init(this)
        Store.start()
                Player.start()
                Loudness.init(this)
                Lyrics.init(this)
                Hidden.init(this)
        AutoFill.init(this)
                Store.syncHidden()
                PlaybackService.start(this)
                Boot.ready.value = true
                // 下载目录兜底：没拿到「所有文件访问」权限时，后端写公共目录会
                // 一路失败（见 StorageAccess 的说明），这里换成可写的专属目录。
                kotlinx.coroutines.MainScope().launch {
                    runCatching { StorageAccess.ensureDownloadDir(this@NativeActivity) }
                        .onSuccess { dir ->
                            if (dir != null) {
                                Store.pushError(
                                    "未获得「所有文件访问」权限，下载目录已切到应用专属目录；" +
                                        "如需存到 音乐/LMPlayer，请到 设置 → 下载 里授权"
                                )
                                Log.i(TAG, "下载目录回退到 $dir")
                            }
                        }
                }
            }
        } catch (t: Throwable) {
            Log.e(TAG, "后端启动失败", t)
            runOnUiThread { Boot.error.value = t.message ?: t.toString() }
        }
    }

    private fun defaultMusicDir(): String {
        val music = Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_MUSIC)
        if (music != null && (music.exists() || music.mkdirs())) return music.absolutePath
        val fallback = File(getExternalFilesDir(null), "Music").apply { mkdirs() }
        return fallback.absolutePath
    }

    override fun onDestroy() {
        // 不在这里 Stop 后端：音频服务可能还在前台播。真正退出交给 PlaybackService
        // 与进程回收；界面重建（旋转/低内存）不该把曲库重扫一遍。
        super.onDestroy()
    }
}

/** 启动状态（进程级）：Compose 侧订阅它来切「启动中 / 出错 / 就绪」。 */
object Boot {
    val ready = kotlinx.coroutines.flow.MutableStateFlow(false)
    val error = kotlinx.coroutines.flow.MutableStateFlow<String?>(null)
}

