/* ==========================================================================
   z_export.go — 给 Android 宿主用的导出包装
   --------------------------------------------------------------------------
   桌面项目里有些装配函数是包内小写（newOnlineService / newLyricsMatcher），
   Android 宿主的装配代码要和它们同包才能访问服务的私有字段，因此宿主也放在
   本包内（z_host_*.go）。这里只补几个一次性用的导出入口，便于测试单独引用。
   ========================================================================== */

package app

import (
	"localmusicplayer/internal/bilibili"
	"localmusicplayer/internal/bootstrap"
)

// NewOnlineServiceDefault 用默认聚合器装配在线服务（与桌面 main 一致）
func NewOnlineServiceDefault(store *bootstrap.Store, client *bilibili.Client) *OnlineService {
	return newOnlineService(store, client)
}

// NewLyricsMatcherDefault 把在线服务适配成歌词匹配接口
func NewLyricsMatcherDefault(svc *OnlineService) LyricsMatcher {
	return newLyricsMatcher(svc)
}
