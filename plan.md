目标: 在 llmplayeByAndroid 工作区产出可安装到 Android 模拟器(pixel7_api37 / x86_64)运行的 LMPlayer 安卓端，复用桌面版 Go 后端逻辑与 Lit 前端。

假设:
- Go 后端跨平台复用采用「源码复制 + wails shim（go.mod replace 掉 github.com/wailsapp/wails/v3）」而非改上游仓库；
- 前端沿用桌面 dist 产物，通过自写 /wails/runtime.js（fetch + SSE）替代 Wails IPC，bindings 文件由脚本把 $Call.ByID(n) 改写为 $Call('Service.Method')；
- 桌面专属能力（系统托盘/桌面歌词/桌面壁纸/自动更新/窗口装饰）在安卓端 stub 掉；
- 转码/响度扫描依赖的 ffmpeg 子进程在第一版禁用（Android 走 WebView/系统解码 + miniaudio 内置解码）。
未验证项:
- malgo(miniaudio cgo) 在 android/amd64 + NDK 下能否编译并通过 AAudio/OpenSLES 出声（失败则降级到前端 <audio> 路径）；
- 模拟器 x86_64 音频输出能否被听到（必要时只看 PlayerState 事件判定出声链路）。
- Android 37 模拟器 scoped storage 下 /sdcard/Music 扫描与 SAF 选目录权限行为。

## M0 骨架：能 build 能启动
- [x] R1: android/ Gradle 工程（Kotlin, minSdk 26, compileSdk 36, x86_64）能 assembleDebug 出 APK | 验证: gradlew assembleDebug 成功且 apk 存在 | 依赖: -
- [x] R2: MainActivity 用 WebView 加载内置 assets/www/index.html（桌面 dist 拷入），无后端时进入浏览器预览/mock 模式显示界面 | 验证: 模拟器安装启动后截图能看到曲库界面 | 依赖: R1
- [x] R3: 前端在手机视口下不出横向溢出（截图 412x915 确认） | 验证: screencap + 人工看图无横向滚动/元素截断 | 依赖: R2

## M1 Go 宿主：HTTP + RPC + 事件
- [x] R4: go/ 模块从桌面复制 internal/* 与核心 services 并可用 GOOS=android GOARCH=amd64 cgo 编译 | 验证: go build ./... 通过（含 NDK CC） | 依赖: NDK 安装完成
- [x] R5: wails shim 模块（replace 掉 wails/v3）让 services 编译通过（App/Window/Event/Dialog 最小面） | 验证: go build ./... 通过 | 依赖: R4
- [x] R6: internal/androidhost 起 127.0.0.1 服务：静态 dist + POST /rpc + GET /events(SSE) + 媒体流 | 验证: 本机 GOOS=windows 单测/curl 调通 | 依赖: R5
- [x] R7: gomobile AAR（导出 Start(dataDir,cacheDir) (port,err) / Stop）被 Kotlin 调用，WebView 指向该端口 | 验证: 模拟器里 connect() 成功（logs 显示 Folders() 返回）+ 截图 | 依赖: R6
- [x] R8: 前端 bindings 改写脚本 + /wails/runtime.js（Call/ByID/CancellablePromise/Create.Events/Events.On/Off） | 验证: 模拟器里曲库列表能拉到真实数据（扫描 /sdcard/Music） | 依赖: R7

## M2 播放
- [x] R9: audioplay(malgo) 交叉编译通过并能在设备上初始化（Player.Available=true） | 验证: 模拟器日志 + 截图播放条状态 | 依赖: R5
- [x] R10: 播放本地 mp3/flac 能出声且进度锚点事件到达前端 | 验证: PlayerState 事件 logcat 有 playing=true 与 positionMs 推进 | 依赖: R9
- [ ] R11: 后台播放 + 通知栏/锁屏控制（Android MediaSession） | 验证: 退到后台仍播，通知栏可见 | 依赖: R10

## M3 移动端 UI
- [x] R12: 曲库/播放详情/设置三页在手机宽度下可用（布局重排，非桌面三栏） | 验证: 截图对比 412x915 | 依赖: R3,R8
- [x] R12b: 手机端独立骨架：底部 tab bar(曲库/播放列表/搜索/设置) + 迷你播放条 + 播放详情三行控件 + 设置整页化(分类页→分区页) + 搜索整页/队列 sheet | 验证: CDP 截图 .shots/m1-m6 | 依赖: R12
- [x] R12c: 去掉触屏 hover 浮标；恢复桌面窄窗断点砍掉的封面列/更多菜单/副标题 | 验证: 截图 | 依赖: R12b
- [ ] R13: 歌词页（内嵌/LRC + 在线抓取）在手机端可滚动高亮 | 验证: 截图 | 依赖: R12
- [ ] R14: 播放列表/收藏/搜索/排序在触屏下可用 | 验证: 截图 + 交互 | 依赖: R12

## M4 其余桌面功能对齐
- [ ] R15: 在线搜索试听 + 下载入库（B 站等）在移动端可用 | 验证: 真机/模拟器截图 | 依赖: R10
- [ ] R16: 封面抓取/响度均衡/音效 EQ 迁移（ffmpeg 依赖项按需降级） | 验证: 日志与截图 | 依赖: R10
- [ ] R17: 主题与皮肤（player-skins 播放详情页）在移动端正常 | 验证: 截图 | 依赖: R12
- [ ] R18: AI 标签 / 样式包市场（自动更新在安卓端移除或改为提示） | 验证: 截图 | 依赖: R12

## M5 交付
- [x] R19: release 签名 APK 产出并交付 | 验证: apksigner verify 通过 | 依赖: 全部
