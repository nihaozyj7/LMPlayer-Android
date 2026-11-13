/* ==========================================================================
   mobile — gomobile 绑定入口
   --------------------------------------------------------------------------
   外壳（Kotlin）只需要两件事：把前端与数据/缓存的目录告诉 Go，拿到本地
   HTTP 端口去加载 WebView；退出时喊一声 Stop。

   为什么用 gomobile bind 而不是 c-shared + 自己写 JNI：
   音频引擎是基于 miniaudio 的 cgo（malgo），JNI 胶水得自己维护；
   gomobile 直接产出 AAR，Kotlin 侧调用普通 Java 静态方法即可。
   ========================================================================== */

package mobile

import (
	"encoding/json"
	"fmt"
	"os"
	"sync"

	"localmusicplayer/app"
)

var (
	mu     sync.Mutex
	server *app.Server
	port   int
)

// Start 启动后端，返回本地 HTTP 端口。
//
//   wwwDir   前端静态资源目录（外壳把 APK assets 解到这里）
//   dataDir  配置与曲库元数据的存放目录
//   cacheDir 缓存目录（封面/歌词/转码）
//   musicDir 默认音乐目录（首次启动自动加进曲库，可为空）
func Start(wwwDir, dataDir, cacheDir, musicDir string) (int, error) {
	mu.Lock()
	defer mu.Unlock()
	if server != nil {
		return port, nil
	}
	if wwwDir == "" || dataDir == "" {
		return 0, fmt.Errorf("wwwDir 与 dataDir 不能为空")
	}
	// 桌面版把这两个位置写死在平台默认路径里，安卓上由外壳给出真实目录，
	// 走它们本来就支持的环境变量覆盖（见 internal/bootstrap/config.go）。
	os.Setenv("LMPLAYER_DATA_DIR", dataDir)
	if cacheDir != "" {
		os.Setenv("LMPLAYER_CACHE_DIR", cacheDir)
	}
	if musicDir != "" {
		os.Setenv("LMPLAYER_MUSIC_DIR", musicDir)
	}

	s, p, err := app.StartServer(wwwDir)
	if err != nil {
		return 0, err
	}
	server = s
	port = p
	startEventPump(s)
	return p, nil
}

// Port 返回已启动的端口（未启动时为 0）
func Port() int {
	mu.Lock()
	defer mu.Unlock()
	return port
}

/* --------------------------------------------------------------------------
   原生界面桥（Kotlin → Go 直调）
   -------------------------------------------------------------------------- */

// Listener 是事件回调；由 Kotlin 侧实现（gomobile 会生成对应的 Java 接口）。
//
// OnEvent 在 Go 的协程里被调用，实现方必须自己切回主线程。
type Listener interface {
	OnEvent(name string, dataJSON string)
}

var (
	lmu      sync.Mutex
	listener Listener
)

// SetListener 注册事件回调。可以反复调用（后注册的替换前一个）。
//
// 订阅在 Start 里就已经建立（早期事件先落在缓冲区里），这里注册后会立刻
// 补发积压的事件 —— 否则原生界面刚启动那几秒（scan:started / library:changed）
// 会整段丢掉，界面就得等下一次全量刷新。
func SetListener(l Listener) {
	lmu.Lock()
	listener = l
	pending := drainPending()
	lmu.Unlock()
	if l != nil {
		for _, ev := range pending {
			l.OnEvent(ev.Name, ev.Data)
		}
	}
}

// RPC 按名字反射调用服务方法，返回 {"result":…} 或 {"error":…} 的 JSON。
//
// name 形如 "LibraryService.Songs"；argsJSON 是参数数组的 JSON 文本。
func RPC(name, argsJSON string) (string, error) {
	mu.Lock()
	s := server
	mu.Unlock()
	if s == nil {
		return "", fmt.Errorf("后端未启动")
	}
	return s.CallJSON(name, argsJSON)
}

// BaseURL 返回本地媒体服务的绝对地址前缀（ExoPlayer / Coil 拼相对路径用）。
func BaseURL() string {
	p := Port()
	if p <= 0 {
		return ""
	}
	return fmt.Sprintf("http://127.0.0.1:%d", p)
}

var (
	pendingMu  sync.Mutex
	pendingEvs []pendingEvent
)

type pendingEvent struct{ Name, Data string }

func drainPending() []pendingEvent {
	pendingMu.Lock()
	defer pendingMu.Unlock()
	out := pendingEvs
	pendingEvs = nil
	return out
}

// startEventPump 在 Start 里调用一次：把后端事件转成 JSON 交给 Listener。
func startEventPump(s *app.Server) {
	ch, _ := s.Subscribe()
	go func() {
		for ev := range ch {
			b, err := json.Marshal(ev.Data)
			if err != nil {
				continue
			}
			data := string(b)
			lmu.Lock()
			l := listener
			if l == nil {
				// 还没注册（Kotlin 侧 SetListener 稍后才调）：先攒着，最多留 64 条
				if len(pendingEvs) < 64 {
					pendingEvs = append(pendingEvs, pendingEvent{Name: ev.Name, Data: data})
				}
				lmu.Unlock()
				continue
			}
			lmu.Unlock()
			l.OnEvent(ev.Name, data)
		}
	}()
}

// Stop 停止后端（外壳退出时调用）
func Stop() {
	mu.Lock()
	s := server
	server = nil
	port = 0
	mu.Unlock()
	if s != nil {
		s.Stop()
	}
}
