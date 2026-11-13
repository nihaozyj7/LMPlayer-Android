/* ==========================================================================
   loudness.go — 给 Kotlin 的响度扫描器
   --------------------------------------------------------------------------
   桌面版的响度测量靠 ffmpeg 解 PCM 再算 BS.1770；安卓 APK 里没有可执行的
   ffmpeg（见 README-android「音频」一节），所以解码这一段交给系统的
   MediaCodec（Kotlin 侧），算响度这一段仍然用桌面版同一份实现
   （internal/ffmpeg 的 LoudnessScanner）—— 结果与桌面版可比、可混用缓存。

   为什么导出「流式」而不是「一次传完整个文件」：
   一首 5 分钟的歌解码出来是 50MB 级的 PCM，gomobile 每次跨 JNI 都要复制
   一份；分块（Kotlin 侧用 256KB）喂进来，峰值内存只有一块的大小。
   ========================================================================== */

package mobile

import (
	"encoding/json"

	"localmusicplayer/internal/ffmpeg"
)

// LoudnessScan 是流式响度扫描器句柄。
//
// 生命周期由调用方控制：NewLoudnessScan → 反复 WritePCM → ResultJSON。
// 不并发安全（与 internal/ffmpeg 的同名类型一致）。
type LoudnessScan struct {
	s *ffmpeg.LoudnessScanner
}

// NewLoudnessScan 创建扫描器。rate 是采样率（44100/48000…），channels 只支持 1~2。
func NewLoudnessScan(rate, channels int) *LoudnessScan {
	return &LoudnessScan{s: ffmpeg.NewLoudnessScanner(rate, channels)}
}

// WritePCM 喂一段**交错** 16bit 小端 PCM（MediaCodec 默认输出格式）。
// 任意长度都接受，不足一帧的尾巴由扫描器自己缓存。
func (l *LoudnessScan) WritePCM(pcm []byte) {
	if l == nil || l.s == nil || len(pcm) == 0 {
		return
	}
	l.s.Write(pcm)
}

// ResultJSON 汇总响度结论，返回：
//
//	{"integrated":-14.3,"truePeak":-1.2,"lra":6.4,"threshold":-24.3,
//	 "frames":12582912,"silenceHead":0,"silenceTail":0,"totalFrames":12582912}
//
// integrated 为 0 表示整段静音或太短；truePeak 为 0 表示没有数据。
func (l *LoudnessScan) ResultJSON() string {
	if l == nil || l.s == nil {
		return "{}"
	}
	r := l.s.Result()
	head, tail, total := l.s.Silence()
	out, err := json.Marshal(map[string]any{
		"integrated":  r.Integrated,
		"truePeak":    r.TruePeak,
		"lra":         r.LRA,
		"threshold":   r.Threshold,
		"frames":      r.Frames,
		"silenceHead": head,
		"silenceTail": tail,
		"totalFrames": total,
	})
	if err != nil {
		return "{}"
	}
	return string(out)
}

// 说明：不需要单独导出 AlgoVersion —— Kotlin 侧把测量结果交给
// LoudnessService.StoreMeasurement 时，Go 侧会自己填上当前算法版本
// （见 internal/loudness/manager.go 的 Store）。
