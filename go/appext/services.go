/* ==========================================================================
   appext — 安卓端专属的服务替身
   --------------------------------------------------------------------------
   桌面版里这些服务（窗口 / 媒体键 / 托盘）依赖 Wails 的窗口与系统 API。
   安卓端没有这些概念，但不能让前端「调用即失败」，所以这里提供同名的服务
   与方法，返回「无窗口 / 不支持」的零值。

   为什么单独一个包而不是放进 app/：app/ 目录由 tools/sync-desktop-src.py 从
   桌面项目同步生成，手写文件放在那里容易被同步脚本误删。
   ========================================================================== */

package appext

import (
	"path/filepath"
	"strings"

	"localmusicplayer/internal/bootstrap"
	"localmusicplayer/internal/theme"
)

/* --------------------------------------------------------------------------
   WindowService
   -------------------------------------------------------------------------- */

// WindowService 窗口控制（安卓端替身）
type WindowService struct {
	store    *bootstrap.Store
	themeMgr *theme.Manager

	booted bool
	ready  bool
}

// NewWindowService 构造窗口服务替身
func NewWindowService(store *bootstrap.Store, themeMgr *theme.Manager) *WindowService {
	return &WindowService{store: store, themeMgr: themeMgr}
}

// Close 关闭窗口（安卓上等同退出）
func (s *WindowService) Close() {}

// Minimize 最小化到后台
func (s *WindowService) Minimize() {}

// ToggleMaximize 安卓端没有最大化
func (s *WindowService) ToggleMaximize() {}

// IsMaximized 永远 false
func (s *WindowService) IsMaximized() bool { return false }

// SetFullscreen 切换沉浸式全屏
func (s *WindowService) SetFullscreen(on bool) {}

// ToggleFullscreen 切换全屏
func (s *WindowService) ToggleFullscreen() {}

// IsFullscreen 安卓端不跟踪全屏状态
func (s *WindowService) IsFullscreen() bool { return false }

// ShowMain 显示主窗口
func (s *WindowService) ShowMain() {}

// HideMain 隐藏主窗口
func (s *WindowService) HideMain() {}

// SetWindowCorners 圆角模式：安卓端无窗口装饰
func (s *WindowService) SetWindowCorners(mode string) string { return "" }

// SetMinimizeToTray 最小化到托盘：安卓端不存在
func (s *WindowService) SetMinimizeToTray(on bool) bool { return false }

// MarkReady 首帧就绪
func (s *WindowService) MarkReady() { s.ready = true }

// MarkReadyAsync 异步版首帧就绪
func (s *WindowService) MarkReadyAsync() { s.ready = true }

// MarkBooted 启动画面播完
func (s *WindowService) MarkBooted() { s.booted = true }

// MainWindowShown 主窗口是否已显示（安卓端恒 true）
func (s *WindowService) MainWindowShown() bool { return true }

// MainWindowBooted 启动画面是否结束
func (s *WindowService) MainWindowBooted() bool { return s.booted }

// ResetMainWindowGeometry 重置窗口几何（安卓端无意义）
func (s *WindowService) ResetMainWindowGeometry() map[string]any { return map[string]any{} }

// DesktopLyricsState 桌面歌词状态
func (s *WindowService) DesktopLyricsState() map[string]any {
	return map[string]any{"enabled": false, "supported": false}
}

// DesktopLyricsTouched 用户是否手动开过桌面歌词
func (s *WindowService) DesktopLyricsTouched() bool { return false }

// SetDesktopLyrics 开关桌面歌词
func (s *WindowService) SetDesktopLyrics(on bool) map[string]any {
	return map[string]any{"enabled": false, "supported": false}
}

// UpdateDesktopLyrics 推送歌词到桌面歌词窗口
func (s *WindowService) UpdateDesktopLyrics(payload map[string]any) {}

// MarkDesktopLyricsReady 桌面歌词首帧就绪
func (s *WindowService) MarkDesktopLyricsReady() {}

// ResetDesktopLyricsPosition 重置桌面歌词位置
func (s *WindowService) ResetDesktopLyricsPosition() {}

// DesktopWallpaperState 桌面壁纸状态
func (s *WindowService) DesktopWallpaperState() map[string]any {
	return map[string]any{"enabled": false, "supported": false}
}

// DesktopWallpaperTouched 用户是否手动开过壁纸模式
func (s *WindowService) DesktopWallpaperTouched() bool { return false }

// SetDesktopWallpaper 开关桌面壁纸
func (s *WindowService) SetDesktopWallpaper(on bool) map[string]any {
	return map[string]any{"enabled": false, "supported": false}
}

// UpdateDesktopWallpaper 推送壁纸内容
func (s *WindowService) UpdateDesktopWallpaper(payload map[string]any) {}

// MarkDesktopWallpaperReady 壁纸窗口就绪
func (s *WindowService) MarkDesktopWallpaperReady() {}

// MarkDesktopWallpaperPainted 壁纸首帧已绘制
func (s *WindowService) MarkDesktopWallpaperPainted() {}

/* --------------------------------------------------------------------------
   MediaKeyService
   -------------------------------------------------------------------------- */

// MediaKeyToggle 是「切换播放」的回调
type MediaKeyToggle func()

// MediaKeyService 媒体键服务（安卓端替身）
type MediaKeyService struct {
	onToggle MediaKeyToggle
	emit     func(name string, payload any)

	ready   bool
	started bool
}

// NewMediaKeyService 构造媒体键服务
func NewMediaKeyService(onToggle MediaKeyToggle) *MediaKeyService {
	return &MediaKeyService{onToggle: onToggle}
}

// SetEmitter 注入事件发送器
func (s *MediaKeyService) SetEmitter(emit func(name string, payload any)) {
	s.emit = emit
}

// FrontendReady 前端报到
func (s *MediaKeyService) FrontendReady() { s.ready = true }

// Start 启动热键监听（安卓端无事可做，但报告成功）
func (s *MediaKeyService) Start() bool {
	s.started = true
	return true
}

// Stop 停止热键监听
func (s *MediaKeyService) Stop() { s.started = false }

// DispatchExternal 供安卓外壳（通知栏 / 耳机键）触发一次播放切换
func (s *MediaKeyService) DispatchExternal() {
	if s.onToggle != nil {
		s.onToggle()
	}
}

/* --------------------------------------------------------------------------
   小工具
   -------------------------------------------------------------------------- */

// TranscodeCacheDir 转码缓存的落点（与桌面版口径一致）
func TranscodeCacheDir(cfg bootstrap.Config) string {
	root := strings.TrimSpace(cfg.CacheDir)
	if root == "" {
		root = filepath.Join(cfg.DataDir, "cache")
	}
	return filepath.Join(root, "transcode")
}

// LegacyTranscodeCacheDir 老版本写死的转码缓存落点（只用于清理）
func LegacyTranscodeCacheDir(store *bootstrap.Store) string {
	return filepath.Join(store.DataDir(), "cache", "transcode")
}

// SameCleanPath 判断两个路径是否指向同一位置
func SameCleanPath(a, b string) bool {
	return strings.EqualFold(filepath.Clean(a), filepath.Clean(b))
}
