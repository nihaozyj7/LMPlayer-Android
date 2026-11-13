/* ==========================================================================
   z_host_assemble.go — 安卓端的服务装配
   --------------------------------------------------------------------------
   对应桌面项目 main.go 里从 `store, err := bootstrap.NewStore()` 到服务注册
   结束的那一段。区别只有三处：
     · 不建窗口、不建托盘、不建桌面歌词/壁纸窗口（安卓只有一个 WebView）；
     · 事件出口不是 Wails 的消息通道，而是 host 的 SSE 广播（见 z_host_http.go）；
     · 不碰 ffmpeg（安卓端没有内置二进制，见 internal/ffmpeg/embed_nobundle.go）。
   ========================================================================== */

package app

import (
	"context"
	"fmt"
	"log"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/wailsapp/wails/v3/pkg/application"

	"localmusicplayer/appext"
	"localmusicplayer/internal/audioplay"
	"localmusicplayer/internal/bilibili"
	"localmusicplayer/internal/bootstrap"
	"localmusicplayer/internal/coverfetch"
	"localmusicplayer/internal/ffmpeg"
	"localmusicplayer/internal/library"
	"localmusicplayer/internal/loudness"
	"localmusicplayer/internal/media"
	"localmusicplayer/internal/metacache"
	"localmusicplayer/internal/skins"
	"localmusicplayer/internal/theme"
)

// Host 是安卓端的后端宿主：持有所有服务实例，供 HTTP 层按名字调用。
type Host struct {
	Store *bootstrap.Store

	themeMgr *theme.Manager
	skinMgr  *skins.Manager
	lib      *library.Manager
	watch    *library.Watcher
	loud     *loudness.Manager
	mediaSrv *media.Server
	meta     *metacache.Store
	cleanup  *onlineCacheCleanup

	app *application.App

	LibrarySvc    *LibraryService
	PlaylistSvc   *PlaylistService
	LyricsSvc     *LyricsService
	ThemeSvc      *ThemeService
	SkinSvc       *SkinService
	PackSvc       *PackService
	ConfigSvc     *ConfigService
	AppSvc        *AppService
	MediaKeySvc   *appext.MediaKeyService
	MediaSvc      *MediaService
	PlayerSvc     *PlayerService
	LoudnessSvc   *LoudnessService
	WindowSvc     *appext.WindowService
	OnlineSvc     *OnlineService
	DownloadSvc   *DownloadService
	CoverSvc      *CoverService
	UnplayableSvc *UnplayableService

	// Services 是「服务名 → 实例」的注册表，HTTP 层据此做反射调用。
	Services map[string]any
}

// NewHost 按桌面版的顺序装配全部后端服务。
func NewHost() (*Host, error) {
	h := &Host{Services: map[string]any{}}

	store, err := bootstrap.NewStore()
	if err != nil {
		return nil, fmt.Errorf("加载配置失败: %w", err)
	}
	h.Store = store

	if mgr, err := theme.NewManager(store.DataDir()); err != nil {
		log.Printf("[host] 主题目录不可用: %v", err)
	} else {
		h.themeMgr = mgr
	}
	if mgr, err := skins.NewManager(store.DataDir()); err != nil {
		log.Printf("[host] 皮肤目录不可用: %v", err)
	} else {
		h.skinMgr = mgr
	}

	h.lib = library.NewManager(store)
	h.loud = loudness.NewManager(store.DataDir(), store.Get().ScanConcurrency)

	songs := func(id string) (bootstrap.Song, bool) { return h.lib.SongByID(id) }

	h.mediaSrv = media.New(songs)
	transcodeDir := appext.TranscodeCacheDir(store.Get())
	h.mediaSrv.SetCacheDir(transcodeDir)
	if legacy := appext.LegacyTranscodeCacheDir(store); !appext.SameCleanPath(legacy, transcodeDir) {
		h.mediaSrv.PurgeLeftovers(legacy)
	}

	onlineClient := bilibili.NewClient()
	h.OnlineSvc = newOnlineService(store, onlineClient)

	// ---- 后端原生播放 ----
	h.PlayerSvc = NewPlayerService(func(songID string) (string, int64, error) {
		ctx, cancel := context.WithTimeout(context.Background(), 6*time.Minute)
		defer cancel()

		if bvid, ok := onlineBVID(songID); ok {
			if _, _, err := h.OnlineSvc.EnsureCached(ctx, bvid); err != nil {
				return "", 0, fmt.Errorf("在线试听准备失败: %w", err)
			}
		}

		path, err := h.mediaSrv.PlayableFile(ctx, songID)
		if err != nil {
			return "", 0, err
		}
		if song, ok := songs(songID); ok {
			if head, tail, total, ok := h.mediaSrv.ScanSilence(song); ok {
				audioplay.PrimeSilenceInfo(path, head, tail, total)
			}
		}
		var durMs int64
		if song, ok := songs(songID); ok {
			durMs = song.Duration
		}
		return path, durMs, nil
	})
	h.PlayerSvc.setConfigProvider(func() bootstrap.Config { return store.Get() })

	if base, err := h.mediaSrv.Start(); err != nil {
		log.Printf("[host] 媒体服务启动失败: %v", err)
	} else {
		log.Printf("[host] 媒体服务: %s", base)
	}

	h.OnlineSvc.setVirtualResolver(func(bvid, path, ext string) {
		h.mediaSrv.RegisterVirtual(onlineSongID(bvid), path, ext)
	})
	aiSvc := NewAiService(store)
	h.OnlineSvc.setAI(aiSvc)

	// 安卓端没有 ffmpeg：直接告诉前端「不可用」，让相关能力降级而不是一直转圈。
	go application.EmitEvent("ffmpeg:ready", map[string]any{
		"available": false,
		"source":    "none",
		"describe":  "安卓端未内置 ffmpeg",
	})

	h.watch, err = library.NewWatcher(h.lib)
	if err != nil {
		log.Printf("[host] 文件夹监听不可用: %v", err)
	}

	h.LibrarySvc = NewLibraryService(h.lib, h.watch, store)
	h.UnplayableSvc = NewUnplayableService(store)
	h.UnplayableSvc.setLibrary(h.LibrarySvc)

	h.WindowSvc = appext.NewWindowService(store, h.themeMgr)
	h.AppSvc = NewAppService()
	h.MediaKeySvc = appext.NewMediaKeyService(func() {
		if h.PlayerSvc == nil {
			return
		}
		if h.PlayerSvc.Playing() {
			h.PlayerSvc.Pause()
		} else {
			h.PlayerSvc.Play()
		}
	})
	h.MediaKeySvc.SetEmitter(application.EmitEvent)

	h.LoudnessSvc = NewLoudnessService(h.loud, h.lib)
	h.LoudnessSvc.setVirtualResolver(h.mediaSrv.VirtualSong)
	h.mediaSrv.SetLoudnessSink(func(song bootstrap.Song, scan *ffmpeg.LoudnessScanner) {
		if song.ID == "" {
			return
		}
		if _, isOnline := onlineBVID(song.ID); isOnline {
			return
		}
		res := scan.Result()
		if authoritative, ok := songs(song.ID); ok {
			song = authoritative
		}
		h.LoudnessSvc.StoreMeasurement(song, loudness.Measurement{
			Integrated: res.Integrated,
			TruePeak:   res.TruePeak,
			LRA:        res.LRA,
			Threshold:  res.Threshold,
		})
	})

	h.DownloadSvc = NewDownloadService(store, onlineClient)
	h.DownloadSvc.setCache(h.OnlineSvc.files)
	h.DownloadSvc.setSourceLedger(h.OnlineSvc.sourceLedger())

	h.cleanup = newOnlineCacheCleanup(onlineCleanupDeps{
		store: h.OnlineSvc.files,
		referenced: func() map[string]bool {
			return h.OnlineSvc.referencedOnlineIDs()
		},
		playerState: func() (string, bool) {
			if h.PlayerSvc == nil {
				return "", false
			}
			st := h.PlayerSvc.State()
			songID, _ := st["songId"].(string)
			playing, _ := st["playing"].(bool)
			return songID, playing
		},
		busy: func() bool {
			return h.OnlineSvc.Busy() || (h.DownloadSvc != nil && h.DownloadSvc.Busy())
		},
	})
	h.OnlineSvc.setCleaner(h.cleanup)

	h.meta = metacache.NewStore(filepath.Join(store.Get().CacheDir, "meta"))
	h.CoverSvc = NewCoverService(store, h.meta, coverfetch.New(), songs)
	h.CoverSvc.setAI(aiSvc)

	h.LyricsSvc = NewLyricsService(store, songs)
	h.LyricsSvc.setCache(h.meta)
	h.LyricsSvc.setOnline(newLyricsMatcher(h.OnlineSvc))
	h.LyricsSvc.setAI(aiSvc)

	h.ThemeSvc = NewThemeService(h.themeMgr)
	h.SkinSvc = NewSkinService(h.skinMgr)
	h.PackSvc = NewPackService(store, h.themeMgr, h.skinMgr)

	h.PlaylistSvc = NewPlaylistService(store)
	h.ConfigSvc = NewConfigService(store)
	h.MediaSvc = NewMediaService(h.mediaSrv, songs)

	// ---- 应用句柄注入（桌面版这里是 Wails 的 *application.App）----
	shim := application.NewApp()
	h.app = shim
	h.LibrarySvc.app = shim
	h.AppSvc.app = shim
	h.ThemeSvc.app = shim
	h.SkinSvc.app = shim
	h.DownloadSvc.app = shim
	h.DownloadSvc.setEmitter(application.EmitEvent)
	h.CoverSvc.app = shim
	h.CoverSvc.setEmitter(application.EmitEvent)
	h.UnplayableSvc.setEmitter(application.EmitEvent)

	// 下载完成后把新文件立刻纳入曲库；并交给 AI 打标签（与桌面一致）。
	h.DownloadSvc.setOnFileAdded(func(path string) {
		go func() {
			if _, err := h.lib.RescanPaths(context.Background(), []string{path}); err != nil {
				log.Printf("[host] 新文件入库失败: %v", err)
			}
		}()
	})
	aiTagSvc := NewAITagService(store)
	aiTagSvc.setAI(aiSvc)
	aiTagSvc.setLibrary(h.lib)
	h.DownloadSvc.setOnDownloaded(func(path string) { aiTagSvc.Process(path) })
	h.DownloadSvc.onDirChanged = func() {
		h.lib.ReloadFolders()
		go func() {
			if _, err := h.lib.Scan(context.Background(), false); err != nil {
				log.Printf("[host] 迁移后重扫失败: %v", err)
			}
		}()
	}

	h.registerServices()

	// 首次启动：把系统音乐目录（外壳通过 LMPLAYER_MUSIC_DIR 给出）当作默认曲库。
	// 桌面版让用户自己「添加文件夹」，安卓上那个交互是 SAF 选择器，先用最常见的
	// 位置顶上，用户之后仍可以在设置里增删。
	if len(h.LibrarySvc.Folders()) == 0 {
		if dir := strings.TrimSpace(os.Getenv("LMPLAYER_MUSIC_DIR")); dir != "" {
			if _, err := h.LibrarySvc.AddFolder(dir); err != nil {
				log.Printf("[host] 添加默认音乐目录失败: %v", err)
			} else {
				go func() {
					h.LibrarySvc.Scan(nil)
				}()
			}
		}
	}
	return h, nil
}

// registerServices 把服务按前端的叫法登记进注册表（名字必须与 bindings 一致）。
func (h *Host) registerServices() {
	h.Services["AppService"] = h.AppSvc
	h.Services["LibraryService"] = h.LibrarySvc
	h.Services["PlaylistService"] = h.PlaylistSvc
	h.Services["LyricsService"] = h.LyricsSvc
	h.Services["ThemeService"] = h.ThemeSvc
	h.Services["SkinService"] = h.SkinSvc
	h.Services["PackService"] = h.PackSvc
	h.Services["ConfigService"] = h.ConfigSvc
	h.Services["MediaKeyService"] = h.MediaKeySvc
	h.Services["MediaService"] = h.MediaSvc
	h.Services["PlayerService"] = h.PlayerSvc
	h.Services["LoudnessService"] = h.LoudnessSvc
	h.Services["WindowService"] = h.WindowSvc
	h.Services["OnlineService"] = h.OnlineSvc
	h.Services["DownloadService"] = h.DownloadSvc
	h.Services["CoverService"] = h.CoverSvc
	h.Services["UnplayableService"] = h.UnplayableSvc
}

// Start 启动后台任务：位置锚点 tick、文件夹监听、试听缓存清理。
func (h *Host) Start() {
	// ---- 后端原生音频（对应桌面版 ApplicationStarted 里的那一段）----
	//
	// 安卓端的一个硬约束：引擎只吃「转码后的 PCM WAV」，而转码要靠 ffmpeg
	// 子进程 —— 安卓上没有可执行的 ffmpeg（见 internal/ffmpeg/embed_nobundle.go）。
	// 所以这里先问一句 ffmpeg 在不在：
	//   · 不在（当前情况）→ 不启动引擎，让前端走 <audio> 路径，
	//     由 WebView（系统解码器）直接播 /audio/<id>，mp3/flac/wav/m4a 都能放；
	//   · 在（以后打包了 android 版 ffmpeg）→ 照常启动后端引擎。
	if h.PlayerSvc != nil && ffmpeg.Resolve().Available() {
		h.PlayerSvc.setApp(eventBridge{emit: application.EmitEvent})
		// 播完自动下一首：回调跑在音频线程上，必须丢到 goroutine 里，
		// 在音频回调里做事件广播会阻塞输出（听感就是卡顿）。
		h.PlayerSvc.setEOFHandler(func() {
			go application.EmitEvent("player:ended", map[string]any{})
		})
		if !h.PlayerSvc.Start() {
			log.Printf("[host] 后端音频不可用，前端会回退到 <audio> 播放")
		}
	} else if h.PlayerSvc != nil {
		log.Printf("[host] 无可用 ffmpeg，跳过后端音频引擎（前端用 <audio> + 系统解码）")
		application.EmitEvent("player:ready", map[string]any{
			"available": false,
			"reason":    "安卓端未内置 ffmpeg，使用系统解码播放",
		})
	}
	if h.MediaKeySvc != nil {
		h.MediaKeySvc.Start()
	}

	// 启动时扫一次：桌面版让用户在设置里点「重新扫描」，手机上希望打开就有歌。
	if h.LibrarySvc != nil && len(h.LibrarySvc.Folders()) > 0 {
		go func() {
			time.Sleep(300 * time.Millisecond)
			h.LibrarySvc.Scan(nil)
		}()
	}

	go func() {
		ticker := time.NewTicker(200 * time.Millisecond)
		defer ticker.Stop()
		for range ticker.C {
			if h.PlayerSvc != nil {
				h.PlayerSvc.Tick()
			}
		}
	}()

	if h.watch != nil {
		if cfg := h.Store.Get(); cfg.WatchFolders {
			folders := cfg.EffectiveFolders()
			roots := make([]string, 0, len(folders))
			for _, f := range folders {
				roots = append(roots, f.Path)
			}
			if len(roots) > 0 {
				if err := h.watch.Start(roots); err != nil {
					log.Printf("[host] 监听启动失败: %v", err)
				}
			}
		}
	}

	if h.cleanup != nil {
		h.cleanup.Start()
	}
}

// Stop 停掉后台任务与媒体服务。
func (h *Host) Stop() {
	if h.cleanup != nil {
		h.cleanup.Stop()
	}
	if h.watch != nil {
		h.watch.Stop()
	}
	if h.PlayerSvc != nil {
		h.PlayerSvc.Stop()
	}
	if h.mediaSrv != nil {
		h.mediaSrv.Stop()
	}
	if h.loud != nil {
		_ = h.loud.Save()
	}
}
