// Package events 是 Wails v3 事件类型的最小替身。
//
// 安卓端的应用没有「应用级/窗口级」事件循环，这些常量与类型只为让复用的
// 服务代码编译通过；真正的订阅点在 androidhost 里以别的方式实现。
package events

// ApplicationEventType 应用级事件类型
type ApplicationEventType uint

// WindowEventType 窗口级事件类型
type WindowEventType uint

// Common 各平台共有的事件编号（安卓端只提供被引用到的几个）
var Common = struct {
	ApplicationStarted ApplicationEventType
	ApplicationStopping ApplicationEventType
	WindowClosing      WindowEventType
	WindowDidMove      WindowEventType
	WindowDidResize    WindowEventType
	WindowMaximise     WindowEventType
	WindowUnMaximise   WindowEventType
}{
	ApplicationStarted: 1,
	ApplicationStopping: 2,
	WindowClosing:      3,
	WindowDidMove:      4,
	WindowDidResize:    5,
	WindowMaximise:     6,
	WindowUnMaximise:   7,
}
