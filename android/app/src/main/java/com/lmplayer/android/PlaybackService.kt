package com.lmplayer.android

import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.app.Service
import android.content.Context
import android.content.Intent
import android.graphics.Bitmap
import android.media.MediaMetadata
import android.media.session.MediaSession
import android.media.session.PlaybackState
import android.os.Build
import android.os.IBinder
import android.util.Log
import kotlinx.coroutines.Job
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.delay
import kotlinx.coroutines.isActive
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

/**
 * 后台播放 + 通知栏/耳机键控制。
 *
 * 用系统的 MediaSession（framework API，无需 androidx.media）：
 * 前台服务保证进程在后台不被回收，通知栏用 Notification.MediaStyle 显示
 * 封面/标题/上一首/播放/下一首，耳机键与锁屏的媒体控制走同一套回调。
 */
class PlaybackService : Service() {

    companion object {
        private const val TAG = "LMPlayback"
        private const val NOTIF_ID = 0x4C4D

        fun start(context: Context) {
            val i = Intent(context, PlaybackService::class.java)
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                context.startForegroundService(i)
            } else {
                context.startService(i)
            }
        }

        fun stop(context: Context) {
            context.stopService(Intent(context, PlaybackService::class.java))
        }
    }

    override fun onBind(intent: Intent?): IBinder? = null

    override fun onCreate() {
        super.onCreate()
        MediaSessionHub.attach(this)
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        // 先挂一个空通知进前台，否则 startForegroundService 5 秒内没通知会被系统杀
        val notif = MediaSessionHub.buildNotification(this, Player.state.value, null)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            startForeground(
                NOTIF_ID, notif,
                android.content.pm.ServiceInfo.FOREGROUND_SERVICE_TYPE_MEDIA_PLAYBACK
            )
        } else {
            startForeground(NOTIF_ID, notif)
        }
        when (intent?.action) {
            MediaSessionHub.ACT_PLAY -> Player.resume()
            MediaSessionHub.ACT_PAUSE -> Player.pause()
            MediaSessionHub.ACT_PREV -> Player.prev()
            MediaSessionHub.ACT_NEXT -> Player.next()
        }
        return START_STICKY
    }

    override fun onTaskRemoved(rootIntent: Intent?) {
        // 用户从最近任务里划掉：如果还在播就继续播（常见播放器的行为）
        if (!Player.state.value.playing) stopSelf()
        super.onTaskRemoved(rootIntent)
    }

    override fun onDestroy() {
        MediaSessionHub.detach()
        super.onDestroy()
    }
}

/**
 * MediaSession 的持有者。
 *
 * 单独抽出来是因为播放状态的变化点在 Player 里（播放/暂停/切歌/进度），
 * 而 Session 与通知只能由 Service 持有 —— 两边用这个单例对接，
 * Player 不需要知道 Service 存不存在。
 */
object MediaSessionHub {
    private const val TAG = "LMSession"

    private val io = kotlinx.coroutines.CoroutineScope(
        kotlinx.coroutines.SupervisorJob() + kotlinx.coroutines.Dispatchers.IO
    )

    private var session: MediaSession? = null
    private var ctx: Context? = null
    private var lastSongId: String? = null
    private var lastPlaying: Boolean? = null

    /** 最近一次设置成功的封面（通知重建时复用，避免异步取图失败就丢图）。 */
    private var lastArt: Bitmap? = null

    /** 封面已重试过一次（避免每次状态回调都去下载一张不存在的图）。 */
    private var artRetried = false

    /** 播放中每秒推一次 PlaybackState（通知上的进度条靠它走）。 */
    private var progressJob: Job? = null

    /** 主题色（与 Theme.kt 的 accent 一致），通知的着色用。 */
    private const val ACCENT = 0xFF6A56E8.toInt()

    /** 通知渠道 id：Service 侧 startForeground 与这里必须用同一个。 */
    const val CHANNEL = "lmplayer.playback"

    fun attach(context: Context) {
        ctx = context.applicationContext
        if (session != null) return
        val s = MediaSession(ctx!!, "LMPlayer")
        s.setCallback(object : MediaSession.Callback() {
            override fun onPlay() = Player.resume()
            override fun onPause() = Player.pause()
            override fun onSkipToNext() = Player.next()
            override fun onSkipToPrevious() = Player.prev()
            override fun onSeekTo(pos: Long) = Player.seekTo(pos)
            override fun onStop() = Player.pause()
        })
        s.isActive = true
        session = s
    }

    fun detach() {
        session?.isActive = false
        session?.release()
        session = null
        ctx = null
    }

    /** 把播放器状态同步到 session 与通知。高频调用（进度）会被自身过滤。 */
    fun onState(st: PlayerState) {
        val s = session ?: return
        val playing = st.playing
        val song = st.song
        val newSong = lastSongId != song?.id
        if (!newSong && lastPlaying == playing) {
            // 同一首歌、播放态没变：只需偶尔更新一次通知（进度条不显示，没必要每帧刷）。
            // 例外：封面还没取到就再试一次 —— 冷启动时曲库/封面覆盖表往往比播放
            // 状态晚到，第一轮必然取空，不重试的话通知会一直缺图。
            if (lastArt != null || artRetried || song == null) return
        }
        lastSongId = song?.id
        lastPlaying = playing
        if (newSong) {
            lastArt = null
            artRetried = false
        }
        if (newSong && song != null) {
            // 封面走后端缓存，异步取；取不到就不带大图，通知照常显示
            io.launch {
                val url = ImageLoader.absolute(Covers.imageFor(song))
                val bmp = if (url.isBlank()) null else ImageLoader.load(url)
                if (bmp == null) {
                    artRetried = true
                    Log.w(
                        "LMNotif",
                        "封面取不到：" + song.displayTitle + " url=" +
                            (if (url.isBlank()) "(空)" else url.take(48) + "…len=" + url.length)
                    )
                }
                if (bmp != null) withContext(Dispatchers.Main) { setNotificationArt(bmp) }
            }
        }

        s.setPlaybackState(playbackStateOf(st))
        startProgressLoop(playing)
        val song2 = st.song
        if (song2 != null) {
            val meta = MediaMetadata.Builder()
                .putString(MediaMetadata.METADATA_KEY_TITLE, song2.displayTitle)
                .putString(MediaMetadata.METADATA_KEY_ARTIST, song2.displayArtist)
                .putString(MediaMetadata.METADATA_KEY_ALBUM, song2.album)
                .putLong(MediaMetadata.METADATA_KEY_DURATION, st.durationMs)
            s.setMetadata(meta.build())
        }
        updateNotification()
    }

    private fun updateNotification() {
        val c = ctx ?: return
        val st = Player.state.value
        if (st.song == null) return
        val nm = c.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        ensureChannel(c, nm)
        runCatching { nm.notify(0x4C4D, buildNotification(c, st, lastArt)) }
    }

    /** 封面异步补进通知（先出通知再换图，不能阻塞主线程）。 */
    fun setNotificationArt(bmp: Bitmap?) {
        val c = ctx ?: return
        val st = Player.state.value
        val s0 = session
        if (st.song == null) return
        if (bmp != null) lastArt = bmp
        if (bmp != null && s0 != null) {
            runCatching {
                s0.setMetadata(
                    MediaMetadata.Builder()
                        .putString(MediaMetadata.METADATA_KEY_TITLE, st.song.displayTitle)
                        .putString(MediaMetadata.METADATA_KEY_ARTIST, st.song.displayArtist)
                        .putString(MediaMetadata.METADATA_KEY_ALBUM, st.song.album)
                        .putLong(MediaMetadata.METADATA_KEY_DURATION, st.durationMs)
                        .putBitmap(MediaMetadata.METADATA_KEY_ART, bmp)
                        .putBitmap(MediaMetadata.METADATA_KEY_ALBUM_ART, bmp)
                        .build()
                )
            }
        }
        val nm = c.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        ensureChannel(c, nm)
        runCatching { nm.notify(0x4C4D, buildNotification(c, st, bmp)) }
    }

    private fun playbackStateOf(st: PlayerState): PlaybackState {
        return PlaybackState.Builder()
            .setActions(
                PlaybackState.ACTION_PLAY or
                    PlaybackState.ACTION_PAUSE or
                    PlaybackState.ACTION_PLAY_PAUSE or
                    PlaybackState.ACTION_SKIP_TO_NEXT or
                    PlaybackState.ACTION_SKIP_TO_PREVIOUS or
                    PlaybackState.ACTION_SEEK_TO or
                    PlaybackState.ACTION_STOP
            )
            .setState(
                if (st.playing) PlaybackState.STATE_PLAYING else PlaybackState.STATE_PAUSED,
                st.positionMs,
                if (st.playing) st.speed else 0f
            )
            .build()
    }

    /**
     * 播放中每秒推一次位置。
     *
     * MediaStyle 通知（Android 13 的媒体卡片）的进度条读的是 PlaybackState 的
     * position+speed，不会自己去读播放器。原来只在换歌/播放态变化时推一次，
     * 所以进度条要么不动、要么干脆不显示。这里单独起一个 1 秒的循环，
     * 只更新 session 状态（不重建通知），开销可以忽略。
     */
    private fun startProgressLoop(playing: Boolean) {
        if (!playing) {
            progressJob?.cancel()
            progressJob = null
            return
        }
        if (progressJob?.isActive == true) return
        progressJob = io.launch {
            while (true) {
                delay(1000)
                val cur = Player.state.value
                if (!cur.playing) break
                runCatching { session?.setPlaybackState(playbackStateOf(cur)) }
            }
        }
    }

    /**
     * 通知大图裁成圆角方形。
     *
     * 不裁的话是一张直角方图，多数 ROM 的媒体卡片会直接铺满左侧，看起来很糙；
     * 裁成 16% 圆角与 App 内封面卡片的观感一致。
     */
    private fun rounded(src: Bitmap): Bitmap {
        return runCatching {
            val size = minOf(src.width, src.height).coerceAtMost(512)
            if (size <= 0) return src
            val scaled = Bitmap.createScaledBitmap(src, size, size, true)
            val out = Bitmap.createBitmap(size, size, Bitmap.Config.ARGB_8888)
            val cv = android.graphics.Canvas(out)
            val paint = android.graphics.Paint(android.graphics.Paint.ANTI_ALIAS_FLAG)
            val r = size * 0.16f
            cv.drawRoundRect(
                android.graphics.RectF(0f, 0f, size.toFloat(), size.toFloat()), r, r, paint
            )
            paint.xfermode =
                android.graphics.PorterDuffXfermode(android.graphics.PorterDuff.Mode.SRC_IN)
            cv.drawBitmap(scaled, 0f, 0f, paint)
            out
        }.getOrDefault(src)
    }

    private fun ensureChannel(c: Context, nm: NotificationManager) {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) return
        if (nm.getNotificationChannel(CHANNEL) != null) return
        nm.createNotificationChannel(
            NotificationChannel(CHANNEL, "播放控制", NotificationManager.IMPORTANCE_LOW).apply {
                description = "显示当前播放与切歌控制"
                setShowBadge(false)
                enableVibration(false)
            }
        )
    }

    fun buildNotification(c: Context, st: PlayerState, art: Bitmap?): android.app.Notification {
        // 渠道必须先建好：startForeground 用未注册的渠道会抛
        // "Bad notification for startForeground"，而且是进程级崩溃。
        val nm = c.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        ensureChannel(c, nm)
        val open = PendingIntent.getActivity(
            c, 0, Intent(c, NativeActivity::class.java),
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )
        val song = st.song
        val builder = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            android.app.Notification.Builder(c, MediaSessionHub.CHANNEL)
        } else {
            @Suppress("DEPRECATION")
            android.app.Notification.Builder(c)
        }
        builder
            .setContentTitle(song?.displayTitle ?: "LMPlayer")
            .setContentText(song?.displayArtist ?: "未在播放")
            .setSubText(song?.album?.takeIf { it.isNotBlank() } ?: "LMPlayer")
            .setSmallIcon(R.drawable.ic_notif_note)
            .setColor(ACCENT)
            .setContentIntent(open)
            .setOngoing(st.playing)
            .setOnlyAlertOnce(true)
            .setCategory(android.app.Notification.CATEGORY_TRANSPORT)
            .setVisibility(android.app.Notification.VISIBILITY_PUBLIC)
            .setShowWhen(false)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            builder.setForegroundServiceBehavior(
                android.app.Notification.FOREGROUND_SERVICE_IMMEDIATE
            )
        }
        if (art != null) builder.setLargeIcon(rounded(art))

        // 三个动作固定是「上一首 / 播放暂停 / 下一首」，紧凑视图取 0,1,2，
        // 系统就会把播放键摆在正中 —— 之前用的是系统自带的灰色三角图标，
        // 形状宽度各不相同，视觉上看着是歪的。
        val toggle = serviceAction(
            c, if (st.playing) R.drawable.ic_notif_pause else R.drawable.ic_notif_play,
            if (st.playing) "暂停" else "播放", if (st.playing) ACT_PAUSE else ACT_PLAY
        )
        val prev = serviceAction(c, R.drawable.ic_notif_prev, "上一首", ACT_PREV)
        val next = serviceAction(c, R.drawable.ic_notif_next, "下一首", ACT_NEXT)

        val style = android.app.Notification.MediaStyle()
            .setShowActionsInCompactView(0, 1, 2)
            .setMediaSession(MediaSessionTokenCompat.token(session))
        builder.style = style
        builder.addAction(prev)
        builder.addAction(toggle)
        builder.addAction(next)
        return builder.build()
    }

    private fun serviceAction(
        c: Context, icon: Int, title: String, action: String,
    ): android.app.Notification.Action {
        val i = Intent(c, PlaybackService::class.java).setAction(action)
        val pi = PendingIntent.getService(
            c, action.hashCode(), i,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )
        return android.app.Notification.Action.Builder(
            android.graphics.drawable.Icon.createWithResource(c, icon), title, pi
        ).build()
    }

    const val ACT_PLAY = "com.lmplayer.android.PLAY"
    const val ACT_PAUSE = "com.lmplayer.android.PAUSE"
    const val ACT_PREV = "com.lmplayer.android.PREV"
    const val ACT_NEXT = "com.lmplayer.android.NEXT"
}

private object MediaSessionTokenCompat {
    fun token(session: MediaSession?): android.media.session.MediaSession.Token? = session?.sessionToken
}
