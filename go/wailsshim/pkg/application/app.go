// Package application 是 Wails v3 的最小替身，供 Android 端复用桌面版服务代码。
//
// 桌面版的服务结构体（app/*.go，由 tools/sync-desktop-src.py 从桌面项目复制）
// 只用到 Wails 的三样东西：App.Event.Emit（往 WebView 推事件）、
// App.Dialog.OpenFile（系统文件对话框）、以及若干窗口类型。
// Android 端没有 Wails 运行时，所以这里提供同名同形的空实现：
// 事件转交给 androidhost 注册的钩子（HTTP/SSE 广播），对话框一律不支持。
package application

import "sync"

// RGBA 与 Wails 一致的颜色类型（Android 端不使用，仅为编译兼容）。
type RGBA struct {
	Red   uint8
	Green uint8
	Blue  uint8
	Alpha uint8
}

// NewRGBA 构造颜色。
func NewRGBA(r, g, b, a uint8) RGBA { return RGBA{Red: r, Green: g, Blue: b, Alpha: a} }

// NewRGB 构造不透明颜色。
func NewRGB(r, g, b uint8) RGBA { return NewRGBA(r, g, b, 255) }

// Context 是菜单/托盘回调参数（Android 端不存在这些 UI）。
type Context struct{}

var (
	emitMu   sync.RWMutex
	emitHook func(name string, data any)
	quitHook func()
)

// SetEmitHook 注册事件出口（由 androidhost 在启动时设置）。
func SetEmitHook(fn func(name string, data any)) {
	emitMu.Lock()
	emitHook = fn
	emitMu.Unlock()
}

// SetQuitHook 注册「退出应用」的实现（由 androidhost 设置）。
func SetQuitHook(fn func()) {
	emitMu.Lock()
	quitHook = fn
	emitMu.Unlock()
}

// EmitEvent 是给宿主用的直接投递入口。
func EmitEvent(name string, data any) {
	emitMu.RLock()
	fn := emitHook
	emitMu.RUnlock()
	if fn != nil {
		fn(name, data)
	}
}

// EventProcessor 对应 Wails 的事件处理器，只保留 Emit。
type EventProcessor struct{}

// Emit 把事件推给前端。
func (e *EventProcessor) Emit(name string, data ...any) {
	var payload any
	if len(data) == 1 {
		payload = data[0]
	} else if len(data) > 1 {
		payload = data
	}
	EmitEvent(name, payload)
}

// App 是 Wails 应用对象的替身。
type App struct {
	Event   *EventProcessor
	Dialog  *DialogManager
	Window  *WindowManager
	Browser *BrowserManager
}

// NewApp 构造一个替身应用对象。
func NewApp() *App {
	return &App{
		Event:   &EventProcessor{},
		Dialog:  &DialogManager{},
		Window:  &WindowManager{},
		Browser: &BrowserManager{},
	}
}

// BrowserManager 是系统浏览器的替身：真正打开链接由宿主（Kotlin）完成。
type BrowserManager struct{}

var (
	openURLHook func(url string) error
)

// SetOpenURLHook 由宿主注册「用系统浏览器打开链接」的实现。
func SetOpenURLHook(fn func(url string) error) {
	emitMu.Lock()
	openURLHook = fn
	emitMu.Unlock()
}

// OpenURL 用系统浏览器打开链接。
func (b *BrowserManager) OpenURL(url string) error {
	emitMu.RLock()
	fn := openURLHook
	emitMu.RUnlock()
	if fn == nil {
		return nil
	}
	return fn(url)
}

// Emit 与服务里 s.app.Emit(...) 的调用方式对齐。
func (a *App) Emit(name string, data any) { EmitEvent(name, data) }

// Quit 请求退出应用。
func (a *App) Quit() {
	emitMu.RLock()
	fn := quitHook
	emitMu.RUnlock()
	if fn != nil {
		fn()
	}
}

// WindowManager 是窗口管理器的替身：Android 端只有一个 WebView，没有多窗口。
type WindowManager struct{}

// Window 是窗口抽象接口，Android 端不实现任何真实窗口。
type Window interface {
	Show()
	Hide()
	Close()
}

// Current 永远返回 nil（没有可聚焦窗口的概念）。
func (m *WindowManager) Current() Window { return nil }

// GetByName 永远返回 nil。
func (m *WindowManager) GetByName(string) (Window, bool) { return nil, false }
