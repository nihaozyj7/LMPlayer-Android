//go:build !android

// Command httpdev 在本机（Windows/macOS/Linux）用同一套宿主代码跑后端，
// 方便不开模拟器就能用 curl 验证 RPC、事件与静态资源。
package main

import (
	"flag"
	"fmt"
	"log"
	"os"
	"os/signal"
	"path/filepath"
	"syscall"

	"localmusicplayer/app"
)

func main() {
	www := flag.String("www", "", "前端静态资源目录")
	data := flag.String("data", "", "数据目录（默认临时目录下的 lmplayer-dev）")
	music := flag.String("music", "", "音乐目录（默认不设置）")
	flag.Parse()

	if *www == "" {
		log.Fatal("-www 必填")
	}
	dataDir := *data
	if dataDir == "" {
		dataDir = filepath.Join(os.TempDir(), "lmplayer-dev")
	}
	os.MkdirAll(dataDir, 0o755)
	os.Setenv("LMPLAYER_DATA_DIR", dataDir)
	if *music != "" {
		os.Setenv("LMPLAYER_MUSIC_DIR", *music)
	}

	srv, port, err := app.StartServer(*www)
	if err != nil {
		log.Fatalf("启动失败: %v", err)
	}
	fmt.Printf("HTTP http://127.0.0.1:%d/  (data=%s)\n", port, dataDir)

	ch := make(chan os.Signal, 1)
	signal.Notify(ch, os.Interrupt, syscall.SIGTERM)
	<-ch
	srv.Stop()
}
