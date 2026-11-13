/* ==========================================================================
   embed_android.go — 安卓端没有内置 ffmpeg 二进制
   --------------------------------------------------------------------------
   桌面版把 ffmpeg.exe.gz 用 go:embed 打进可执行文件（见桌面项目的
   internal/ffmpeg/embed_production.go）。安卓上：
     · 打包的是 .exe，无法执行；
     · 真要转码得交叉编译一份 android 可用的 ffmpeg 静态二进制并打包。
   所以这里让「内置二进制」恒为空：ffmpeg.Resolve 会转而去找系统 PATH 里的
   ffmpeg（安卓上没有），结论是「不可用」，于是转码/响度测量相关能力降级，
   而播放 mp3/flac/wav/ogg/m4a 这类系统能解码的格式不受影响。
   ========================================================================== */

package ffmpeg

import "errors"

var errNoBundledFFmpeg = errors.New("android build: no bundled ffmpeg")

// bundledIdentity 报告内置二进制身份（安卓端没有）
func bundledIdentity() ([]byte, int64, bool) { return nil, 0, false }

// embeddedFFmpeg 取出内置二进制（安卓端没有）
func embeddedFFmpeg() ([]byte, error) { return nil, errNoBundledFFmpeg }
