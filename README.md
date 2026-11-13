# LMPlayer for Android

> 当前版本 **1.1** · Android 8.0+（minSdk 26）· 原生 Kotlin + Jetpack Compose 界面 + 进程内 Go 后端
> 安装包见 [Releases](../../releases)。

把桌面的 [localMusicPlayer](https://github.com/nihaozyj7/localMusicPlayer)（Go + Wails3 + Lit）搬到安卓。
**前端与后端在安卓端是两套独立实现**：界面用 Kotlin + Jetpack Compose 原生重写
（小屏、手势、转场按移动端重新设计），后端逻辑仍然是桌面那份 Go 代码
（曲库扫描、标签解析、歌词、在线、下载、AI），通过 gomobile 跑在同一进程里。

```
┌───────────────────────────────────────────────────────────────┐
│ APK                                                           │
│  NativeActivity (Kotlin + Compose)  ← 主界面                   │
│    ├─ Bridge（object）：Mobile.rpc("Svc.Method", argsJSON)     │
│    ├─ Store：UiState（StateFlow，曲库/歌单/配置）              │
│    ├─ Player：MediaPlayer + MediaSessionHub                   │
│    └─ PlaybackService：前台服务 + 通知栏/耳机键控制            │
│                         │                                     │
│                         ▼                                     │
│              libgojni.so（Go 后端，进程内）                    │
│                ├─ CallJSON  ← 反射调用服务方法（同步，无网络）  │
│                ├─ Subscribe ← 事件回调推给 Kotlin              │
│                └─ 127.0.0.1 上的静态/媒体/在线/封面 handler     │
│                                                               │
│  MainActivity (Java) + WebView ← 经典界面（设置 → 关于里进入）  │
└───────────────────────────────────────────────────────────────┘
```

**原生界面不再走网络**：`Mobile.rpc` 直接把参数 JSON 递进 Go 的反射调用，
省掉「本机 HTTP 一趟」；只有音频流（ExoPlayer/MediaPlayer 的 URL）与封面图
仍走 `127.0.0.1` 的 handler，因为它们本来就是给播放器/图片加载器用的。
经典 WebView 界面（旧版）仍保留完整的一套 `/rpc` + `/events` 通道，
两条路共用同一个 `Server.call`，语义不会分叉。

## 目录

| 路径 | 说明 |
| --- | --- |
| `go/internal/*` | 从桌面项目同步（`tools/sync-desktop-src.py`），未改动 |
| `go/app/*` | 同步来的服务层（`package main` → `package app`），外加 `z_host_*.go`（安卓宿主装配 + HTTP + `CallJSON`/`Subscribe`） |
| `go/appext/` | 桌面专属服务（窗口/托盘/媒体键）的安卓替身 |
| `go/wailsshim/` | Wails v3 的最小替身，`go.mod` 里 replace 掉真模块，服务代码零改动 |
| `go/mobile/` | gomobile 入口：`Start` / `RPC` / `SetListener` / `BaseURL` |
| `go/cmd/httpdev/` | 本机（Windows）跑同一套后端，方便用 curl 调 RPC |
| `android/.../NativeActivity.kt` | 原生界面入口：启动后端、挂桥、权限、SAF 选目录 |
| `android/.../Bridge.kt` | Kotlin ⇄ Go：`call(name, args)`、事件回调、JSON 取值工具 |
| `android/.../Store.kt` | 全局状态（曲库/歌单/配置/事件）+ 所有 RPC 封装 |
| `android/.../Player.kt` | MediaPlayer 封装：播放/切歌/循环/随机/seek/队列 |
| `android/.../PlaybackService.kt` | 前台服务 + MediaSession + 通知栏（`MediaSessionHub`） |
| `android/.../AppRoot.kt` | 主界面：appbar / 列表 / 播放条 / 抽屉 / 页面路由 |
| `android/.../PlayerScreen.kt` | 播放详情：`p` 单自由度跟手转场、横滑切歌、队列 sheet |
| `android/.../SettingsScreen.kt` | 设置：分类页 → 分区页（竖向条目，控件单独一行） |
| `android/.../SearchScreen.kt` | 搜索：在线 / 本地两段，默认在线 |
| `android/.../Icons.kt` | 自绘图标（不引 material-icons-extended，省几 MB） |
| `tools/sync-desktop-src.py` | 从桌面仓库同步 Go 源码 |
| `tools/patch-web.py` | 改写 bindings、装 `/wails/runtime.js`、注入 `android.css/js`（**只影响经典界面**） |
| `tools/web/android.css` `android.js` | 经典 WebView 界面的手机骨架与手势 |
| `tools/bundle-web.mjs` | 把 34 个前端模块打成一个 bundle（只影响经典界面） |
| `tools/theme-tokens.py` | 把 UI 里硬编码的 `LmColors.X` 换成跟随明暗的 `Lm.cur.x` |
| `tools/shot-cdp.mjs` `ui.mjs` `gesture-test.mjs` | CDP 截图 / 手势驱动（仅经典界面需要） |
| `tools/build-android.cmd` | 一键：同步 → patch → gomobile bind → gradle；`debug`/`release` 选构建类型，加 `--install` 装机 |
| `tools/apk-size.py` | 按目录/单文件列出 APK 体积构成（排查「包怎么这么大」时先用它） |


## 构建

前置：JDK 21、Android SDK（platform 36、build-tools）、NDK r27、Go 1.27、Node（仅调试用）。

```bat
tools\build-android.cmd                     :: 出 debug APK
tools\build-android.cmd --install           :: 出 debug APK 并装到已连接的设备/模拟器
tools\build-android.cmd release             :: 出 release APK
tools\build-android.cmd release --install   :: 出 release APK 并装机
```

产物：`android/app/build/outputs/apk/debug/app-debug.apk`、
`android/app/build/outputs/apk/release/app-release.apk`。两种构建类型目前共用 debug
keystore（`app/build.gradle` 的 `signingConfig signingConfigs.debug`），因此可以互相覆盖安装；
release 不是 `debuggable`，所以装机后 `tools\dev-push.cmd` 的 `run-as` 会失败——**热更新只在 debug 包下可用**，改界面想热更就先装 debug。

### 包体积

`app-release.apk` 约 **13.4 MB**（`python tools\apk-size.py` 可随时复核）。体积几乎全在 Go 那一份 `.so`：

| 内容 | 大小 | 说明 |
|---|---|---|
| `lib/arm64-v8a/libgojni.so` | 11.9 MB | Go runtime + `internal/*` 全部逻辑 + miniaudio(cgo) |
| `classes.dex` | 2.8 MB | Kotlin 外壳 + androidx.webkit |
| `assets/www` | 1.4 MB | 前端（`app.bundle.js` 0.53 MB + 皮肤 CSS + 外壳） |

两条关键约束，别改回去：

1. **release 只打 `arm64-v8a`**（`app/build.gradle` 的 `defaultConfig.ndk.abiFilters`；debug 才另外补 `x86_64` 给模拟器）。
   以前两个 ABI 都打，`lib` 目录直接 48.6 MB。副作用：**arm64-only 的 release 装不进 x86_64 模拟器**，要在模拟器上验 release 就临时给 release 的 `buildTypes` 也加一个 `abiFilters 'x86_64', 'arm64-v8a'`，验完删掉。
2. **gomobile bind 必须带 `-ldflags="-s -w"`**：Go 默认会把 DWARF 写进 `.so`，实测 `.debug_*` 段约 11.4 MB（23.9 MB → 11.9 MB）。
   `.gopclntab` 会保留，所以 panic 栈里仍有函数名与行号，只是 dlv 断点调试不可用。
   `.so` 在 APK 里**不压缩存储**（`useLegacyPackaging false`）：安装后直接 mmap，不用解压到 `/data`，多占的那点 APK 体积换启动速度，是划算的。

还能再压但暂未做：`minifyEnabled true` 能把 dex 缩到约一半（但 gomobile 的 `go.Seq` 走 JNI 反射，要写 keep 规则，risk/收益不划算）；`assets/www` 里有约 0.6 MB 是 bundle 之后没人引用的旧 Vite chunk（`index-*.js`、`base-*.js` 等），清掉要保证 bundle 里没有残留的动态 `import()`，收益 4%、风险不小，也没做。

手动步骤等价于：

```bat
python tools\sync-desktop-src.py
python tools\patch-web.py
cd go
set ANDROID_NDK_HOME=<sdk>\ndk\27.2.12479018
gomobile bind -target=android/amd64,android/arm64 -androidapi 26 ^
    -javapkg=com.lmplayer.core -ldflags="-s -w" -o ..\android\app\libs\mobile.aar ./mobile
cd ..\android
gradle assembleDebug
```

## 调试

```bat
:: 后端日志（Go 的 log 走 GoLog tag）
adb logcat -s GoLog

:: 在页面里执行 JS（需先在 MainActivity 里打开 WebView 调试）
adb shell "cat /proc/net/unix | grep webview_devtools"   :: 拿到 remote 名字里的 pid
adb forward tcp:9223 localabstract:webview_devtools_remote_<pid>
node tools\diag.mjs "document.title"
node tools\diag.mjs "fetch('/rpc',{method:'POST',body:JSON.stringify({m:'LibraryService.Stats',a:[]})}).then(r=>r.text())"
```

本机跑同一套后端（不开模拟器）：

```bat
cd go
go run ./cmd/httpdev -www ..\android\app\src\main\assets\www -data %TEMP%\lmplayer-dev
curl -X POST -d "{\"m\":\"LibraryService.Stats\",\"a\":[]}" http://127.0.0.1:<port>/rpc
```

## 原生界面（主界面）

用 Kotlin + Compose 重写，不是把桌面网页塞进 WebView。设计上的几条硬规则：

| 位置 | 原生形态 |
| --- | --- |
| 顶部 | 56dp：`☰` + **当前视图标题**（跟着抽屉里选的视图走）+ 搜索 |
| 列表头 | 一行：左侧「排序字段 ↓ · 首数」点一下换排序字段，右侧纯图标（播放全部 / 重新扫描） |
| 主内容 | 单列曲目行 60dp（封面 44 + 标题/歌手 + 时长 + 更多），**单击即播** |
| 底部 | **只有一条** 64dp 播放条（2dp 进度线 + 封面 + 标题/歌手 + 播放暂停 + 队列），整条点按进详情，**上滑跟手展开** |
| 侧栏 | `☰` 拉出抽屉（跟手，左滑或点遮罩关闭）：LMPlayer / 全部歌曲 / 我喜欢 / 各歌单（含新建、删除）/ 设置 |
| 设置 | 整页，**分类列表 → 分区页**；条目一律「标题 + 说明」上下两行、控件另起一行，不做左右两栏 |
| 搜索 | 整页，`在线 / 本地` 两段，**默认在线**；在线结果点一条即下载入库 |
| 播放详情 | 全屏层：`p` 一个自由度驱动整块滑动 + 封面由小变大 + 文案淡入；横滑切歌、下滑收起，**任何阶段都能打断** |

为什么详情页只有一个自由度：早期版本把「面板滑入 / 底栏长高 / 头部位移 /
封面飞行」拆成五条时间轴，结果是动作叠在一起、看起来杂乱且不可预测；
现在只有一个 `Animatable<Float>`，自动动画与手指拖动写的是同一个值。

## 移动端 UI（经典 WebView 界面）

> 这一节描述的是 `MainActivity` 里的 WebView 界面 —— 现在只在
> 「设置 → 关于 → 打开经典界面」里进入，用于对照排查问题。
> 它加载的是桌面 dist + `tools/web/android.css` 的手机骨架。


桌面产物是**按鼠标设计的**：标题栏 + 常显侧栏 + 底部一条播放控件，一行十来个
图标、靠 hover 出提示。手机上没有这些前提，所以 `tools/web/android.css` 不是
"给桌面布局打补丁"，而是换一套骨架（只改样式与少量 DOM 增强，不动 dist 里的
id / class / 事件绑定）：

| 位置 | 手机上的形态 |
| --- | --- |
| 顶部 | 56dp appbar：菜单图标 + **当前视图标题**（跟着 `#content-title` 走，如「全部歌曲 / 播放列表 / 我喜欢 / 歌单名」）+ 搜索图标 |
| 头部第二行 | 一行搞定：左侧表头「排序字段 ↓ + 首数」，右侧一排**纯图标**按钮（播放全部 / 多选 / 添加 / 清空，随视图变） |
| 主内容 | 单列：曲目行 68dp（封面 52 + 标题/歌手 + 时长 + 更多），**单击行即播放** |
| 底部 | **只有一条** 68dp 播放栏（2dp 进度线 + 封面 + 标题/歌手 + 播放暂停 + 队列），整条点按进详情页 |
| 悬浮 | 右下角圆形按钮 = **定位到当前播放**（队列视图与多选态自动收起） |
| 手势 | 列表在顶部时**下拉刷新**（等于「重新扫描」）；点表头左侧字段名弹排序 sheet |
| 分类抽屉 | 菜单图标拉出：LMPlayer、**切换主题**、曲库导航（全部歌曲 / 播放列表）、歌单（含新建）、**设置**、下载任务 |
| 播放详情 | 全屏；控件从"横向一条"改成**三行**：进度（两端时间）/ 主控三键（64dp 主按钮）/ 工具行（循环 / 词 / 定时 / 选项 / 队列）；音量条收起（手机音量归系统） |
| 设置 | **独立整页**（全屏、无遮罩、无圆角卡片）：分类列表页 → 分区页，左上角返回箭头逐级退回 |
| 搜索 | **整页**：在线 / 本地两个分段，**默认在线**；本地结果由 `android.js` 自己渲染，点按即播 |
| 弹出菜单 | 桌面那套"贴着按钮的小浮层"统一改成**贴底 sheet**（`.menu` 被样式强制重新定位） |
| 其它浮层 | 队列 / 选项 / 定时 / 下载 → 贴底 sheet；歌词面板、封面层 → 整页 |
| sheet 关闭 | 每个贴底 sheet 顶部注入一条 `.m-grip` 把手，**按住把手往下拖**即可关闭（拖动跟手、过 90px 或甩一下就关）；面板里的滚动列表不受影响 |
| 设置项 | **上下两行**：说明文字占满一行，控件另起一行从左排（放不下自动换行）；桌面那种「左说明 / 右控件」的两栏在手机上会把长文案挤成竖排 |

实现上的几个要点：

- appbar 标题**直接取桌面的 `#content-title`**（它已经算好了视图名），不另写映射；
  映射只有一条：侧栏「本地歌曲」在手机上改叫「全部歌曲」。
- 排序**不**复用桌面的 `.tracks__head`：实测它的 `grid-template-columns` 在窄屏断点下和
  数据行对不上（head 3 列 / row 7 列），显示出来必然错位。改为自建一行表头，点它
  `click()` 掉被 CSS 隐掉的 `[data-tool="sort"]`（`display:none` 不影响程序化 click），
  弹出的是桌面那份**字段 + 升降序**齐全的排序面板。
- 判当前视图要用 `window.__app.state.view`，**不能**用 `.app[data-view]`：切视图时后者
  会滞后一拍（切到队列后属性还是 `library`），拿它做显隐判断会让浮标留在队列列表上。
- 下拉刷新的手势监听挂在 `#content-body` 上：只在「`scrollTop === 0` + 单指往下」时接管，
  其余一律交还原生滚动；松手过阈值调 `__app.doRescan({manual:true})`（任何视图都能刷，
  不必依赖只在曲库渲染的重扫按钮）。
- **抽屉遮罩必须挂在 `#app` 内，不能挂 `body`**：`#app` 是 `position:relative; z-index:10`
  的层叠上下文，挂到 body 下的遮罩（`z-index:9400`）会把整个 `#app` 连同里面
  `z-index:9500` 的抽屉一起压住 —— 表现是「抽屉拉出来了，但点任何一行都没反应」。
- `--h-playerbar` 在手机上只等于播放栏高度，于是桌面浮层里所有
  `bottom: calc(var(--h-playerbar) + …)` 的定位自动让开。详情态用 `.app[data-view="player"]`
  把它换成三行控件的高度（`playerview` 的 `bottom` 也要跟着让，否则会盖住底栏）。
- **详情态底栏用 flex column，不用 grid**：桌面把进度/主控/工具三块都做成了
  "绝对定位 + `translateX(-50%)` 居中 + `max-width: calc(50% - 130px)`"，放进 grid 会带着这些
  残留属性亂跑（工具行会被压成 59px）。
- 桌面 CSS 为"把窗口拉窄"准备的三级精简表（`@media (max-width: 1180/1040/900px)`）
  会砍掉**封面列、更多菜单、播放栏副标题**；手机端必须用 `!important` 显式恢复。
- 桌面产物里若干规则用 id 选择器（`#btn-mode`…）压着窄屏隐藏，详情态要恢复它们
  必须用同样带 id 的选择器。
- **不要用 `env(safe-area-inset-*)`**：外壳（`MainActivity.applyEdgeToEdge`）已经按 systemBars
  insets 给 WebView 容器加了上下 padding，WebView 里的 env 仍会再报一次，叠加就是
  "顶上凭空多一条 52px 空白"。
- 触屏没有 hover：`android.js` 会定期清掉 `[data-tip]`，否则点过一次的按钮上会永久
  挂着一个浮标。
- 设置页的分区导航不是"隐藏桌面导航条"就完事：桌面的 `.settings__nav` 是居中
  chip 条，手机上换成分类列表页（`.settings-layer[data-msec]` 控制只显示某一分区的卡片）。

### 播放详情页转场：一整张卡片滑上来（单一自由度）

桌面版是**一次性 CSS 过渡**（`.playerview[data-state="opened"]` + `--pv-slide-dur`），
触屏上接不住手指。手机端踩过三轮坑，最后收敛成「一个 p 只驱动两个 transform」：

| 坑 | 后果 |
| --- | --- |
| rAF 每帧写 CSS 变量 | 主线程被皮肤 import / 封面歌词 RPC 的回调一卡，rAF 整段停；实测打开动画只跑 3 帧，中间空档 300~450ms 直接跳到终点 |
| 面板尺寸跟着进度变 | 底栏 `height` 68 → 190 每帧重排，整块舞台（含皮肤 DOM）跟着重新布局，单帧 9~18ms |
| **一个动作拆成好几套动画** | 面板滑入 + 底栏长高 + 头部差速 + 舞台差速 + 封面替身飞行，五条时间轴叠在一起 = 用户说的「杂乱、闪现、不可预测」 |

现在的做法：

- **只有两个 transform + 一次交叉淡化**（`pvPaint`）：面板 `translateY((1-p)*100%)`、
  底栏 `translateY(122*(1-p)px)`，其余只有 `.playerbar__now` 与三行控件的 `opacity`，
  区间不重叠。手指停在哪一帧，画面就停在哪一帧。
- **底栏布尔盒恒定**：`height: 190px` 两种状态不变，主页态整块下移 122dp，露出来的
  正是**元素顶部 68dp**（`align-content: start` + `padding-top: 8px`）。详情态的
  `.playerbar__now` 也钉在 `top: 8px`，所以来回切是同一块像素，**不可能闪**。
  以前靠改 `height` 实现，关闭那一下底栏会自己缩一下 —— 这就是「控件栏闪烁」。
- **关闭时不要加 `.m-pv-pending`**：那段规则把底栏/标题栏背景强制改回主页配色，
  底栏本来就露在屏幕最底下，一加就闪。它只在**打开**时（底栏要先按主页样式站住位置）用。
- **封面没有替身了**：面板就是一整张卡，封面随它一起滑进来。早先的 `.m-pv-ghost`
  是第二条时间轴，最容易「飘出面板」。
- **跟手**：`pvPaint(p, 0)` 逐帧写行内样式，`.m-pv-drag` 关掉过渡；松手
  `pvAnimateTo()` 把当前值当起点再切到停点（先 `offsetHeight` 落地起点）。
  动画中途按下手指时 `pvMeasuredP()` 用 `DOMMatrix` 读回此刻的视觉位置接着拖。
- **手势兜底**：`document` 上挂了 `touchend / touchcancel → pvAnyEnd()`。
  手势绑在具体元素上，起手那块被重渲染替换或系统吞掉 touchend 时，进度会永远停在
  `dragging`（「卡在半路，之后所有手势都不灵」）。
- **手势**：播放栏**上滑**进入 / 详情页**下滑**退出（行程 = 屏高 40%，松手看进度或甩速）；
  详情页**横滑**切上一首/下一首（第一次位移 > 12px 才定轴，横轴要 `preventDefault`）。
  触摸点在已滚动的容器里时不抢手势（交还歌词滚动）。
- **底栏在详情态必须实心**：桌面为了皮肤背景把它设成透明，手机上会「透过底栏看到
  面板里的封面和歌名」。
- **皮肤的 `filter: blur()` 在手机端要关掉**：经典皮肤给每行歌词挂了 `blur(0.3px)`
  （实测 64 行 = 64 个独立合成层），盘片影子是 `blur(38px)`；面板做 transform 动画时
  这些层要一起合成，模拟器帧率直接掉到 8fps。
- 验收钩子：`__mPv.open() / preview(0.5) / apply(p) / sweep(1)`；
  跟手行为用 `node tools/ui.mjs swipe …` 或 `node tools/gesture-test.mjs`（CDP 发真实触摸），
  帧率用 `node tools/screencast.mjs` 数合成器真实产帧 —— **注意模拟器合成上限只有
  8~15fps，帧率数字在这台模拟器上没有参考价值**，只能用来验证「有没有中间帧」。

- **列表不能滚？那是有东西抢了手势**：队列 / 曲库列表挂了 SortableJS 做拖拽排序，
  默认 `delay: 0` —— 手指一碰就被判成「开始拖动排序」（元素上立刻出现
  `sortable-chosen is-dragging`），列表完全滚不动。`android.js` 的 `tameSortables()`
  把每个实例改成 `delay: 240 + delayOnTouchOnly`（长按才拖，滑动还给滚动）。
  Sortable 没暴露全局句柄，实例只能按元素上的 `Sortable<ver>` expando 属性找。



### 其它跟手 / 可打断的交互

| 位置 | 手势 |
| --- | --- |
| 播放栏 | 上滑 → 详情页（行程 = 屏高 40%，松手按进度或甩速决定完成/回弹） |
| 详情页 | 下滑 → 返回（触摸点所在滚动容器已滚动时不算，交还歌词滚动） |
| 详情页 | 横滑 → 上一首 / 下一首（第一次位移 > 12px 才定轴；整块横移 + 淡出，切歌后从另一侧进来） |
| 贴底 sheet | 按住**把手或头部**下拉 → 关闭（过 90px 或甩一下）；列表内部滚动不受影响 |
| 抽屉 | 点任意一行（全部歌曲 / 我喜欢 / 歌单 / 设置…）**立刻收起并进入**；打开后左滑也能关（跟手，过半或甩一下） |

抽屉点行会自动收起这件事以前是漏的：桌面侧栏一直可见，所以它点完不关；手机端只
给注入的那几行加了关闭，桌面原生的 `.navitem` / 歌单行点了不关，用户以为「点了没反应」。
现在 `.sidebar__scroll` 上做了事件委托（`新建歌单` 那个小按钮除外，它弹输入框）。

两条必须记住的坑（都实测过）：

- **播放栏与 sheet 头部要写 `touch-action`**：不写的话 WebView 在第一个 touchmove
  之前就把手势判成"页面滚动"，后续 `touchmove` 变成 `touchcancel`，表现是
  「上滑没反应」。所以 `.playerbar { touch-action: none }`（横滑留给
  `.playerbar__tools` 的 `pan-x`），把手与各面板 head 同样是 `none`。
- **不要做「屏幕左缘右滑打开抽屉」**：Android 手势导航的返回热区就在左缘
  （整屏高度），从边缘接管的结果是直接触发系统返回、应用被切后台 ——
  比没有手势更糟。抽屉只保留「打开后左滑关闭」。

### 只改界面时的热更新

APK 只在 `lastUpdateTime` 变化时才把 `assets/www` 解到 `files/www`
（`MainActivity.extractWebAssets`），所以改完 `tools/web/android.css` / `android.js` **不需要**
重跑 gomobile bind + gradle：

```bat
tools\dev-push.cmd    :: patch-web.py → tar → adb push → run-as 解开 → 重启 app
```

出安装包时再走完整的 `tools\build-android.cmd release --install`（注意 release 包不是 debuggable，`run-as` 不可用，装机后热更新会失效）。

**装过新 APK 之后必须先启动一次再热更**：`adb install` 会改 `lastUpdateTime`，
下一次启动时 `extractWebAssets` 会把 APK 里那份旧的 `www` 解出来，盖掉你刚 push 的
文件（表现为「改了没生效」）。正确顺序是：装完 → 启动一次（等它解完）→ 再 `dev-push`。

## 当前状态

**1.1 已实现的能力**：

- **曲库**：扫描系统 Music 目录（可用 SAF 添加任意目录）、按标题/歌手/专辑/时长排序、
  隐藏歌曲（只从曲库隐藏，不删文件）、搜索页聚合「本地 + 在线」一次出结果。
- **播放**：系统解码器播放，后台前台服务 + 通知栏（自绘图标、圆角封面、进度条跟播）。
  队列可单曲移除、可清空；单击歌曲的行为（加入队列 / 整表替换队列）可在设置里选。
- **播放详情**：封面作毛玻璃背景的沉浸式页面；封面下方滚动歌词（逐字 / 逐行两种都能点亮到单字）；
  上排 喜欢 / 定时 / 歌词 / 音效 / 更多，下排 播放模式 / 上一首 / 播放 / 下一首 / 队列。
  底栏上滑、详情下滑、抽屉左滑关闭均为跟手转场，支持甩速。
- **歌词**：内嵌 → 同名 `.lrc` → 缓存 → 在线自动匹配，四级回退；面板支持按关键词在线搜索候选、
  逐字标记探测、±0.1s / ±0.5s 偏移微调（按歌持久化）。
- **封面**：文件内嵌封面优先；缺失时后台自动补齐（启动后与下载入库后各触发一次，正在播放的歌优先），
  另有独立「封面匹配」工作台：关键词框、候选网格（标注来源）、自动匹配（逐张校验可用性，
  纯白/过小/解码失败的图会被跳过并说明原因）。
- **响度均衡**：BS.1770（K 加权 + 真峰值 + 两级门限 + LRA）从桌面版原样移植，
  MediaCodec 解 PCM 喂进同一份 Go 实现；增益按目标 LUFS 计算并受 −1 dBTP 真峰值保护，
  负增益走衰减、正增益走 `LoudnessEnhancer`。
- **在线**：B 站作为音源，搜索 → 试听（直链流播）→ 下载入库；下载队列在抽屉里可见，
  每行显示进度与失败原因。无存储权限时自动降级到应用专属目录。
- **歌单**：新建 / 重命名 / 删除 / 加歌 / 排序；详情页用前 4 首封面错位拼贴作歌单图标，
  下排 播放全部 / 随机播放，`⋮` 展开 重命名 / 添加歌曲 / 删除歌单。
- **AI 清洗**：填一个 DeepSeek API Key 即可（默认 `deepseek-chat`、关闭思考模式），
  用来把 B 站视频标题清洗成「歌手 - 歌名」再拿去匹配封面与歌词；未配置时安全跳过。
- **状态持久化**：主页分区、播放队列、当前曲目与进度都会保存，冷启动恢复（不自动播放）。

## 已知限制

1. **没有内置 ffmpeg**：`ape / wma` 这类系统解码器不支持的格式播不了。
2. **release 只打 `arm64-v8a`**：x86_64 模拟器装不上 release 包（要调试就用 debug 包）。
3. **没有第三方 DSP 音效**：均衡器 / 环绕 / 混响需要换播放内核（如 ExoPlayer + AudioEffect），
   当前的「音效」面板是音量 + 倍速 + 响度均衡。
4. **在线音源是 B 站**：平台只有视频标题，不做 AI 清洗时封面/歌词匹配命中率明显偏低。
5. **「所有文件访问」需要手动授权**：读取 MediaStore 之外的目录（含默认下载目录）
   要在系统设置里给 `MANAGE_EXTERNAL_STORAGE`；不给也能用，下载会落到应用专属目录。
6. **两种构建类型共用 debug keystore**（`app/build.gradle` 的 `signingConfig signingConfigs.debug`），
   可以互相覆盖安装；自己出正式包请替换成自己的签名。
7. 桌面专属能力（系统托盘、桌面歌词、桌面壁纸、自动更新、窗口装饰）在安卓端
   stub 掉，接口存在但返回「不支持」。

## 许可

[MIT](LICENSE)
