/* ==========================================================================
   z_host_http.go — 安卓端的 HTTP 宿主
   --------------------------------------------------------------------------
   桌面版前端跑在 Wails 的虚拟主机上，调后端走 Wails 的 JS↔Go 消息通道；
   安卓端没有这条通道，改成最普通的三样东西（同源，都在 127.0.0.1 上）：

     GET  /                   前端静态资源（Kotlin 把 APK 里的 assets 解到磁盘）
     POST /rpc                {"m":"LibraryService.Folders","a":[]} → {"result":…}
     GET  /events             Server-Sent Events，推后端事件（scan:done、player:state…）

   /audio/ /online/ /cover/ /skins/ 四个前缀直接接桌面版已有的 handler ——
   它们本来就是「给 WebView 用的本地 HTTP 服务」，换个宿主照样能用。
   ========================================================================== */

package app

import (
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"log"
	"net"
	"net/http"
	"path/filepath"
	"reflect"
	"strings"
	"sync"
	"time"

	"github.com/wailsapp/wails/v3/pkg/application"

	"localmusicplayer/internal/covercache"
	"localmusicplayer/internal/media"
	"localmusicplayer/internal/skins"
)

// Event 是一条推给前端的事件
type Event struct {
	Name string `json:"name"`
	Data any    `json:"data"`
}

// Server 是安卓端的 HTTP 宿主
type Server struct {
	host   *Host
	wwwDir string
	srv    *http.Server
	ln     net.Listener

	mu   sync.RWMutex
	subs map[chan Event]struct{}
}

// StartServer 装配后端、起 HTTP 服务，返回随机端口。
//
// wwwDir 是前端静态资源的磁盘目录（由 Kotlin 侧把 APK assets 解开后给出）。
func StartServer(wwwDir string) (*Server, int, error) {
	s := &Server{wwwDir: wwwDir, subs: map[chan Event]struct{}{}}
	application.SetEmitHook(s.broadcast)
	application.SetOpenURLHook(func(string) error { return nil })

	host, err := NewHost()
	if err != nil {
		return nil, 0, err
	}
	s.host = host

	ln, err := net.Listen("tcp", "127.0.0.1:0")
	if err != nil {
		return nil, 0, fmt.Errorf("监听失败: %w", err)
	}
	s.ln = ln

	mux := http.NewServeMux()
	mux.HandleFunc("/rpc", s.handleRPC)
	mux.HandleFunc("/events", s.handleEvents)
	mux.HandleFunc("/healthz", func(w http.ResponseWriter, r *http.Request) {
		io.WriteString(w, "ok")
	})
	s.mountSubServers(mux)
	mux.Handle("/", s.staticHandler())

	s.srv = &http.Server{
		Handler:           mux,
		ReadHeaderTimeout: 10 * time.Second,
	}
	host.Start()
	go func() {
		if err := s.srv.Serve(ln); err != nil && !errors.Is(err, http.ErrServerClosed) {
			log.Printf("[host] HTTP 服务退出: %v", err)
		}
	}()
	return s, ln.Addr().(*net.TCPAddr).Port, nil
}

// Stop 关闭 HTTP 服务与后端
func (s *Server) Stop() {
	if s.srv != nil {
		_ = s.srv.Close()
	}
	if s.host != nil {
		s.host.Stop()
	}
}

// Host 返回后端宿主（供调试/扩展用）
func (s *Server) Host() *Host { return s.host }

/* --------------------------------------------------------------------------
   静态资源
   -------------------------------------------------------------------------- */

func (s *Server) staticHandler() http.Handler {
	fileServer := http.FileServer(http.Dir(s.wwwDir))
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// 桌面版由 Wails 侧的中间件提供的几个「启动期接口」，安卓端给等价的最小应答：
		//   /boot/reveal、/boot/booted 是首帧握手（外壳不需要，直接 204）；
		//   /early-theme.js / early-theme.css 是主题首帧快照（安卓端主题
		//   走正常加载，返回空内容即可，否则会以 404 的 text/plain 被浏览器拒绝执行）。
		switch r.URL.Path {
		case "/boot/reveal", "/boot/booted":
			w.WriteHeader(http.StatusNoContent)
			return
		case "/early-theme.js":
			w.Header().Set("Content-Type", "application/javascript; charset=utf-8")
			io.WriteString(w, "/* android: no early theme snapshot */\n")
			return
		case "/early-theme.css":
			w.Header().Set("Content-Type", "text/css; charset=utf-8")
			io.WriteString(w, "/* android: no early theme snapshot */\n")
			return
		}
		if strings.HasSuffix(strings.ToLower(r.URL.Path), ".html") || r.URL.Path == "/" {
			w.Header().Set("Content-Security-Policy", "frame-ancestors 'none'")
		}
		// 模块与样式不做长缓存：外壳升级后清一次浏览器缓存就够
		w.Header().Set("Cache-Control", "no-cache")
		fileServer.ServeHTTP(w, r)
	})
}

// mountSubServers 挂上桌面版已有的几个本地 HTTP 服务
func (s *Server) mountSubServers(mux *http.ServeMux) {
	audio := s.host.mediaSrv.Handler()
	online := s.host.OnlineSvc.Handler()
	covers := s.host.lib.CoversHandler()
	mux.Handle(media.AudioPrefix, audio)
	mux.Handle(onlinePrefix, online)
	mux.Handle(covercache.Prefix, covers)
	if s.host.skinMgr != nil {
		mux.Handle(skins.Prefix, s.host.skinMgr.Handler())
	}
}

/* --------------------------------------------------------------------------
   RPC
   -------------------------------------------------------------------------- */

type rpcRequest struct {
	// M 是 "Service.Method"
	M string            `json:"m"`
	A []json.RawMessage `json:"a"`
}

type rpcResponse struct {
	Result any    `json:"result,omitempty"`
	Error  string `json:"error,omitempty"`
}

func (s *Server) handleRPC(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "POST only", http.StatusMethodNotAllowed)
		return
	}
	body, err := io.ReadAll(io.LimitReader(r.Body, 32<<20))
	if err != nil {
		writeRPC(w, nil, err)
		return
	}
	var req rpcRequest
	if err := json.Unmarshal(body, &req); err != nil {
		writeRPC(w, nil, fmt.Errorf("请求无法解析: %w", err))
		return
	}
	// 服务方法可能 panic（播放链路里有第三方数据），不能让它带走整个进程。
	started := time.Now()
	func() {
		defer func() {
			if rec := recover(); rec != nil {
				writeRPC(w, nil, fmt.Errorf("后端异常: %v", rec))
			}
		}()
		res, err := s.call(req.M, req.A)
		writeRPC(w, res, err)
	}()
	if d := time.Since(started); d > 100*time.Millisecond {
		log.Printf("[rpc] %-40s %dms", req.M, d.Milliseconds())
	}
}

func writeRPC(w http.ResponseWriter, result any, err error) {
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	enc := json.NewEncoder(w)
	if err != nil {
		_ = enc.Encode(rpcResponse{Error: err.Error()})
		return
	}
	if err := enc.Encode(rpcResponse{Result: result}); err != nil {
		log.Printf("[host] 序列化返回值失败: %v", err)
	}
}

// call 按名字反射调用服务方法：参数按方法签名逐个 JSON 反序列化。
func (s *Server) call(name string, args []json.RawMessage) (any, error) {
	dot := strings.IndexByte(name, '.')
	if dot <= 0 || dot == len(name)-1 {
		return nil, fmt.Errorf("方法名无效: %q", name)
	}
	svcName, methodName := name[:dot], name[dot+1:]
	svc, ok := s.host.Services[svcName]
	if !ok || svc == nil {
		return nil, fmt.Errorf("没有这个服务: %s", svcName)
	}
	mv := reflect.ValueOf(svc).MethodByName(methodName)
	if !mv.IsValid() {
		return nil, fmt.Errorf("没有这个方法: %s", name)
	}
	mt := mv.Type()
	if mt.NumIn() != len(args) {
		return nil, fmt.Errorf("%s 需要 %d 个参数，收到 %d 个", name, mt.NumIn(), len(args))
	}
	in := make([]reflect.Value, mt.NumIn())
	for i := range in {
		pt := mt.In(i)
		holder := reflect.New(pt)
		if len(args[i]) > 0 && string(args[i]) != "null" {
			if err := json.Unmarshal(args[i], holder.Interface()); err != nil {
				return nil, fmt.Errorf("%s 的第 %d 个参数类型不匹配: %w", name, i+1, err)
			}
		}
		in[i] = holder.Elem()
	}
	out := mv.Call(in)
	if n := len(out); n > 0 {
		if last := out[n-1]; last.Type().Implements(reflect.TypeOf((*error)(nil)).Elem()) {
			if !last.IsNil() {
				return nil, last.Interface().(error)
			}
			out = out[:n-1]
		}
	}
	switch len(out) {
	case 0:
		return nil, nil
	case 1:
		return out[0].Interface(), nil
	default:
		vals := make([]any, len(out))
		for i := range out {
			vals[i] = out[i].Interface()
		}
		return vals, nil
	}
}

/* --------------------------------------------------------------------------
   事件（SSE）
   -------------------------------------------------------------------------- */

func (s *Server) broadcast(name string, data any) {
	ev := Event{Name: name, Data: data}
	s.mu.RLock()
	defer s.mu.RUnlock()
	for ch := range s.subs {
		select {
		case ch <- ev:
		default:
			// 订阅端太慢就丢这一条：事件都是「最新状态」语义，丢旧的没影响
		}
	}
}

func (s *Server) handleEvents(w http.ResponseWriter, r *http.Request) {
	flusher, ok := w.(http.Flusher)
	if !ok {
		http.Error(w, "不支持流式响应", http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "text/event-stream; charset=utf-8")
	w.Header().Set("Cache-Control", "no-cache")
	w.Header().Set("Connection", "keep-alive")
	w.Header().Set("X-Accel-Buffering", "no")

	ch := make(chan Event, 256)
	s.mu.Lock()
	s.subs[ch] = struct{}{}
	s.mu.Unlock()
	defer func() {
		s.mu.Lock()
		delete(s.subs, ch)
		s.mu.Unlock()
		close(ch)
	}()

	// 先发一条 hello，让前端知道通道已就绪（runtime.js 据此 resolve 连接）
	fmt.Fprintf(w, "event: hello\ndata: {}\n\n")
	flusher.Flush()

	ping := time.NewTicker(20 * time.Second)
	defer ping.Stop()

	for {
		select {
		case <-r.Context().Done():
			return
		case <-ping.C:
			fmt.Fprintf(w, ": ping\n\n")
			flusher.Flush()
		case ev, ok := <-ch:
			if !ok {
				return
			}
			payload, err := json.Marshal(ev)
			if err != nil {
				continue
			}
			fmt.Fprintf(w, "data: %s\n\n", payload)
			flusher.Flush()
		}
	}
}

// WWWIndex 返回静态根下的 index.html 绝对路径（供外壳判断资源是否就绪）
func (s *Server) WWWIndex() string { return filepath.Join(s.wwwDir, "index.html") }

/* --------------------------------------------------------------------------
   原生外壳（Kotlin）用的直连入口
   --------------------------------------------------------------------------
   WebView 走 HTTP（/rpc + /events），原生界面没必要绕一趟 loopback：
   gomobile 的 AAR 已经能把 Kotlin 直接调进 Go，少一次 JSON over socket。

   协议与 /rpc 完全一样（{"result":…} / {"error":…}），前端与原生共用同一
   套服务方法名，将来两边对齐时不会出现两套语义。
   -------------------------------------------------------------------------- */

// CallJSON 按名字反射调用服务方法；argsJSON 是**参数数组**的 JSON 文本（可空）。
//
// 永远返回可解析的 JSON（失败也包成 {"error":…}），这样 Kotlin 侧只需要
// 一套解析逻辑，不用同时处理异常与错误字段。
func (s *Server) CallJSON(name, argsJSON string) (string, error) {
	var args []json.RawMessage
	if strings.TrimSpace(argsJSON) != "" {
		if err := json.Unmarshal([]byte(argsJSON), &args); err != nil {
			return marshalRPC(nil, fmt.Errorf("参数无法解析: %w", err))
		}
	}
	var (
		res any
		err error
	)
	func() {
		defer func() {
			if rec := recover(); rec != nil {
				err = fmt.Errorf("后端异常: %v", rec)
			}
		}()
		res, err = s.call(name, args)
	}()
	return marshalRPC(res, err)
}

func marshalRPC(result any, err error) (string, error) {
	if err != nil {
		b, mErr := json.Marshal(rpcResponse{Error: err.Error()})
		if mErr != nil {
			return "", mErr
		}
		return string(b), nil
	}
	b, mErr := json.Marshal(rpcResponse{Result: result})
	if mErr != nil {
		return "", fmt.Errorf("序列化返回值失败: %w", mErr)
	}
	return string(b), nil
}

// Subscribe 订阅事件流，返回通道与取消函数。
//
// 通道满时直接丢弃（与 broadcast 的语义一致）：事件是「状态快照」而非「指令」，
// 丢一条也能靠后续事件或主动拉取纠正，宁可丢也不能把后端卡住。
func (s *Server) Subscribe() (<-chan Event, func()) {
	ch := make(chan Event, 256)
	s.mu.Lock()
	s.subs[ch] = struct{}{}
	s.mu.Unlock()

	var once sync.Once
	cancel := func() {
		once.Do(func() {
			s.mu.Lock()
			if _, ok := s.subs[ch]; ok {
				delete(s.subs, ch)
				close(ch)
			}
			s.mu.Unlock()
		})
	}
	return ch, cancel
}
