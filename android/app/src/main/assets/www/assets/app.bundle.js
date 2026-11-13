var jd=Object.defineProperty;var Cm=(e,t,n)=>t in e?jd(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n;var ae=(e,t)=>()=>(e&&(t=e(e=0)),t);var we=(e,t)=>{for(var n in t)jd(e,n,{get:t[n],enumerable:!0})};var Re=(e,t,n)=>Cm(e,typeof t!="symbol"?t+"":t,n);function Im(e,t){let n=new AbortController;return{controller:n,run:async()=>{let a=await fetch(Am,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({m:e,a:t}),signal:n.signal});if(!a.ok)throw new Error(`\u540E\u7AEF\u8FD4\u56DE ${a.status}`);let r=await a.json();if(r&&r.error)throw new Error(r.error);return r?r.result:null}}}function za(e,...t){let{controller:n,run:s}=Im(String(e),t),a=new yo((r,o)=>{s().then(r,o)});return a._abort=n,a}function Tm(){vo||bo||(bo=new Promise(e=>{try{let t=new EventSource(Mm);vo=t,t.addEventListener("hello",()=>e(!0)),t.onmessage=n=>{let s=null;try{s=JSON.parse(n.data)}catch{return}let a=Bs.get(s?.name);if(a)for(let r of a)try{r(s)}catch(o){console.error("[runtime] \u4E8B\u4EF6\u56DE\u8C03\u5F02\u5E38:",s?.name,o)}},t.onerror=()=>{t.close(),vo=null,bo=null},setTimeout(()=>e(!1),3e3)}catch{e(!1)}}))}var Am,Mm,yo,f,Bs,vo,bo,Vd,Ee=ae(()=>{Am="/rpc",Mm="/events",yo=class extends Promise{cancel(){return this._abort&&this._abort.abort(),this}};za.ByID=(e,...t)=>za(e,...t);f=za,Bs=new Map,vo=null,bo=null;Vd={On(e,t){Tm();let n=Bs.get(e);return n||(n=new Set,Bs.set(e,n)),n.add(t),()=>{n.delete(t),n.size===0&&Bs.delete(e)}},OnMultiple(e,t){let n=e.map(s=>Vd.On(s,t));return()=>n.forEach(s=>s())},Off(e,t){let n=Bs.get(e);n&&n.delete(t)},Emit(){}};typeof window<"u"&&(window._wails=window._wails||{},window._wails.Events=Vd,window._wails.Call=za)});var _o={};we(_o,{OpenURL:()=>Em,Version:()=>Pm});function Em(e){return f("AppService.OpenURL",e)}function Pm(){return f("AppService.Version")}var Kd=ae(()=>{Ee()});var Us=ae(()=>{});var wo={};we(wo,{Get:()=>Dm,Path:()=>Lm,Reset:()=>Om,Set:()=>Rm});function Dm(){return f("ConfigService.Get")}function Lm(){return f("ConfigService.Path")}function Om(){return f("ConfigService.Reset")}function Rm(e){return f("ConfigService.Set",e)}var Gd=ae(()=>{Ee();Us()});var Gn=ae(()=>{});var $o={};we($o,{Add:()=>qm,AddMany:()=>Nm,Apply:()=>Fm,ApplyWith:()=>Bm,CacheStats:()=>Um,CachedPreviews:()=>Wm,CachedSets:()=>zm,ClearCache:()=>Hm,Current:()=>jm,Fetch:()=>Vm,List:()=>Km,Lookup:()=>Gm,LookupAll:()=>Ym,OpenCacheDir:()=>Xm,PickLocal:()=>Jm,Remove:()=>Qm,Reset:()=>Zm,SetActive:()=>eg,WriteCacheToFiles:()=>tg});function qm(e,t,n,s){return f("CoverService.Add",e,t,n,s)}function Nm(e,t,n){return f("CoverService.AddMany",e,t,n)}function Fm(e,t,n){return f("CoverService.Apply",e,t,n)}function Bm(e,t,n,s){return f("CoverService.ApplyWith",e,t,n,s)}function Um(){return f("CoverService.CacheStats")}function Wm(){return f("CoverService.CachedPreviews")}function zm(){return f("CoverService.CachedSets")}function Hm(){return f("CoverService.ClearCache")}function jm(e){return f("CoverService.Current",e)}function Vm(e){return f("CoverService.Fetch",e)}function Km(e){return f("CoverService.List",e)}function Gm(e,t){return f("CoverService.Lookup",e,t)}function Ym(e,t){return f("CoverService.LookupAll",e,t)}function Xm(e){return f("CoverService.OpenCacheDir",e)}function Jm(){return f("CoverService.PickLocal")}function Qm(e,t){return f("CoverService.Remove",e,t)}function Zm(e){return f("CoverService.Reset",e)}function eg(e,t){return f("CoverService.SetActive",e,t)}function tg(){return f("CoverService.WriteCacheToFiles")}var Yd=ae(()=>{Ee();Gn()});var ko={};we(ko,{ApplyDir:()=>ng,Busy:()=>sg,ClearFinished:()=>ag,Dir:()=>ig,OpenDir:()=>rg,PickDir:()=>og,SetDir:()=>lg,Start:()=>cg,Status:()=>dg,Tasks:()=>ug});function ng(e,t){return f("DownloadService.ApplyDir",e,t)}function sg(){return f("DownloadService.Busy")}function ag(){return f("DownloadService.ClearFinished")}function ig(){return f("DownloadService.Dir")}function rg(e){return f("DownloadService.OpenDir",e)}function og(){return f("DownloadService.PickDir")}function lg(e){return f("DownloadService.SetDir",e)}function cg(e,t,n){return f("DownloadService.Start",e,t,n)}function dg(){return f("DownloadService.Status")}function ug(){return f("DownloadService.Tasks")}var Xd=ae(()=>{Ee()});var So={};we(So,{AddFolder:()=>pg,DropSong:()=>hg,Folders:()=>fg,LookupSong:()=>mg,PickDirectory:()=>gg,RefreshWatchers:()=>vg,RemoveFolder:()=>bg,RevealInExplorer:()=>yg,Scan:()=>_g,SetWatchers:()=>wg,Songs:()=>$g,Stats:()=>kg,ToggleLike:()=>Sg});function pg(e){return f("LibraryService.AddFolder",e)}function hg(e){return f("LibraryService.DropSong",e)}function fg(){return f("LibraryService.Folders")}function mg(e){return f("LibraryService.LookupSong",e)}function gg(){return f("LibraryService.PickDirectory")}function vg(){return f("LibraryService.RefreshWatchers")}function bg(e){return f("LibraryService.RemoveFolder",e)}function yg(e){return f("LibraryService.RevealInExplorer",e)}function _g(e){return f("LibraryService.Scan",e)}function wg(e){return f("LibraryService.SetWatchers",e)}function $g(){return f("LibraryService.Songs")}function kg(){return f("LibraryService.Stats")}function Sg(e){return f("LibraryService.ToggleLike",e)}var Jd=ae(()=>{Ee();Us()});var Qd=ae(()=>{});var xo={};we(xo,{AlbumGains:()=>xg,Cancel:()=>Cg,Clear:()=>Ag,GainMap:()=>Mg,Get:()=>Ig,InvalidateTarget:()=>Tg,Measure:()=>Eg,MeasureAll:()=>Pg,RefreshTools:()=>Dg,State:()=>Lg,StoreMeasurement:()=>Og});function xg(e){return f("LoudnessService.AlbumGains",e)}function Cg(){return f("LoudnessService.Cancel")}function Ag(){return f("LoudnessService.Clear")}function Mg(e){return f("LoudnessService.GainMap",e)}function Ig(e,t){return f("LoudnessService.Get",e,t)}function Tg(e){return f("LoudnessService.InvalidateTarget",e)}function Eg(e,t){return f("LoudnessService.Measure",e,t)}function Pg(e){return f("LoudnessService.MeasureAll",e)}function Dg(){return f("LoudnessService.RefreshTools")}function Lg(){return f("LoudnessService.State")}function Og(e,t){return f("LoudnessService.StoreMeasurement",e,t)}var Zd=ae(()=>{Ee();Us();Qd()});var eu=ae(()=>{});var Co={};we(Co,{AutoMatch:()=>Rg,Load:()=>qg,LoadCached:()=>Ng,Save:()=>Fg,UpgradeWordLyrics:()=>Bg});function Rg(e){return f("LyricsService.AutoMatch",e)}function qg(e){return f("LyricsService.Load",e)}function Ng(e){return f("LyricsService.LoadCached",e)}function Fg(e,t,n,s){return f("LyricsService.Save",e,t,n,s)}function Bg(e){return f("LyricsService.UpgradeWordLyrics",e)}var tu=ae(()=>{Ee();eu()});var Ao={};we(Ao,{FrontendReady:()=>Ug,Start:()=>Wg,Stop:()=>zg});function Ug(){return f("MediaKeyService.FrontendReady")}function Wg(){return f("MediaKeyService.Start")}function zg(){return f("MediaKeyService.Stop")}var nu=ae(()=>{Ee()});var Mo={};we(Mo,{CacheStats:()=>Hg,ClearTranscodeCache:()=>jg,State:()=>Vg,URL:()=>Kg});function Hg(){return f("MediaService.CacheStats")}function jg(){return f("MediaService.ClearTranscodeCache")}function Vg(){return f("MediaService.State")}function Kg(e){return f("MediaService.URL",e)}var su=ae(()=>{Ee()});var au=ae(()=>{});var Io={};we(Io,{Busy:()=>Gg,CacheDir:()=>Yg,CacheStats:()=>Xg,CleanupCache:()=>Jg,ClearCache:()=>Qg,CoverLookup:()=>Zg,CoverProviders:()=>ev,EnsureCached:()=>tv,FetchLyrics:()=>nv,Handler:()=>sv,InvalidateCovers:()=>av,Lyrics:()=>iv,LyricsProviders:()=>rv,ProbeLyricsFormat:()=>ov,ProtectIDs:()=>lv,PruneSources:()=>cv,Search:()=>dv,SearchLyrics:()=>uv,SetCacheDir:()=>pv,SourceIndex:()=>hv});function Gg(){return f("OnlineService.Busy")}function Yg(){return f("OnlineService.CacheDir")}function Xg(){return f("OnlineService.CacheStats")}function Jg(){return f("OnlineService.CleanupCache")}function Qg(){return f("OnlineService.ClearCache")}function Zg(e,t,n,s,a){return f("OnlineService.CoverLookup",e,t,n,s,a)}function ev(){return f("OnlineService.CoverProviders")}function tv(e){return f("OnlineService.EnsureCached",e)}function nv(e,t){return f("OnlineService.FetchLyrics",e,t)}function sv(){return f("OnlineService.Handler")}function av(){return f("OnlineService.InvalidateCovers")}function iv(e,t,n){return f("OnlineService.Lyrics",e,t,n)}function rv(){return f("OnlineService.LyricsProviders")}function ov(e,t){return f("OnlineService.ProbeLyricsFormat",e,t)}function lv(e){return f("OnlineService.ProtectIDs",e)}function cv(){return f("OnlineService.PruneSources")}function dv(e,t,n){return f("OnlineService.Search",e,t,n)}function uv(e,t,n,s){return f("OnlineService.SearchLyrics",e,t,n,s)}function pv(e){return f("OnlineService.SetCacheDir",e)}function hv(){return f("OnlineService.SourceIndex")}var iu=ae(()=>{Ee();au()});var ru=ae(()=>{});var To={};we(To,{Catalog:()=>fv,Install:()=>mv,SetSource:()=>gv,Source:()=>vv});function fv(e,t){return f("PackService.Catalog",e,t)}function mv(e,t){return f("PackService.Install",e,t)}function gv(e){return f("PackService.SetSource",e)}function vv(){return f("PackService.Source")}var ou=ae(()=>{Ee();ru()});var Eo={};we(Eo,{Available:()=>bv,CancelTrackGap:()=>yv,Diagnostics:()=>_v,Effect:()=>wv,Load:()=>$v,Pause:()=>kv,Play:()=>Sv,Playing:()=>xv,Seek:()=>Cv,SetEffect:()=>Av,SetLoudnessGain:()=>Mv,SetPlaybackOptions:()=>Iv,SetVolume:()=>Tv,Spectrum:()=>Ev,Start:()=>Pv,State:()=>Dv,Stop:()=>Lv,Tick:()=>Ov,Unload:()=>Rv});function bv(){return f("PlayerService.Available")}function yv(){return f("PlayerService.CancelTrackGap")}function _v(){return f("PlayerService.Diagnostics")}function wv(){return f("PlayerService.Effect")}function $v(e){return f("PlayerService.Load",e)}function kv(){return f("PlayerService.Pause")}function Sv(){return f("PlayerService.Play")}function xv(){return f("PlayerService.Playing")}function Cv(e){return f("PlayerService.Seek",e)}function Av(e){return f("PlayerService.SetEffect",e)}function Mv(e){return f("PlayerService.SetLoudnessGain",e)}function Iv(e,t,n){return f("PlayerService.SetPlaybackOptions",e,t,n)}function Tv(e,t){return f("PlayerService.SetVolume",e,t)}function Ev(e){return f("PlayerService.Spectrum",e)}function Pv(){return f("PlayerService.Start")}function Dv(){return f("PlayerService.State")}function Lv(){return f("PlayerService.Stop")}function Ov(){return f("PlayerService.Tick")}function Rv(){return f("PlayerService.Unload")}var lu=ae(()=>{Ee()});var Po={};we(Po,{AddSongs:()=>qv,Create:()=>Nv,Delete:()=>Fv,Export:()=>Bv,List:()=>Uv,RemoveSongs:()=>Wv,Rename:()=>zv,Reorder:()=>Hv,ReorderPlaylists:()=>jv});function qv(e,t){return f("PlaylistService.AddSongs",e,t)}function Nv(e){return f("PlaylistService.Create",e)}function Fv(e){return f("PlaylistService.Delete",e)}function Bv(e){return f("PlaylistService.Export",e)}function Uv(){return f("PlaylistService.List")}function Wv(e,t){return f("PlaylistService.RemoveSongs",e,t)}function zv(e,t){return f("PlaylistService.Rename",e,t)}function Hv(e,t,n){return f("PlaylistService.Reorder",e,t,n)}function jv(e,t){return f("PlaylistService.ReorderPlaylists",e,t)}var cu=ae(()=>{Ee();Us()});var du=ae(()=>{});var Do={};we(Do,{Delete:()=>Vv,Dir:()=>Kv,Import:()=>Gv,List:()=>Yv,Reference:()=>Xv,Reload:()=>Jv,RevealDir:()=>Qv,Token:()=>Zv});function Vv(e){return f("SkinService.Delete",e)}function Kv(){return f("SkinService.Dir")}function Gv(){return f("SkinService.Import")}function Yv(){return f("SkinService.List")}function Xv(e){return f("SkinService.Reference",e)}function Jv(){return f("SkinService.Reload")}function Qv(){return f("SkinService.RevealDir")}function Zv(){return f("SkinService.Token")}var uu=ae(()=>{Ee();du();Gn()});var pu=ae(()=>{});var Lo={};we(Lo,{Delete:()=>eb,Dir:()=>tb,Import:()=>nb,List:()=>sb,Load:()=>ab,Reference:()=>ib,Reload:()=>rb,RevealDir:()=>ob});function eb(e){return f("ThemeService.Delete",e)}function tb(){return f("ThemeService.Dir")}function nb(){return f("ThemeService.Import")}function sb(){return f("ThemeService.List")}function ab(e){return f("ThemeService.Load",e)}function ib(e){return f("ThemeService.Reference",e)}function rb(){return f("ThemeService.Reload")}function ob(){return f("ThemeService.RevealDir")}var hu=ae(()=>{Ee();pu();Gn()});var Oo={};we(Oo,{Clear:()=>lb,Count:()=>cb,Forget:()=>db,List:()=>ub,Remove:()=>pb,Report:()=>hb});function lb(){return f("UnplayableService.Clear")}function cb(){return f("UnplayableService.Count")}function db(e){return f("UnplayableService.Forget",e)}function ub(){return f("UnplayableService.List")}function pb(e){return f("UnplayableService.Remove",e)}function hb(e,t,n){return f("UnplayableService.Report",e,t,n)}var fu=ae(()=>{Ee()});var mu=ae(()=>{});var Ro={};we(Ro,{CancelDownload:()=>fb,Check:()=>mb,CheckSilently:()=>gb,Download:()=>vb,Install:()=>bb,Mirrors:()=>yb,OpenDownloadDir:()=>_b,SetChannel:()=>wb,SetCheckOnStart:()=>$b,SkipVersion:()=>kb,State:()=>Sb,Version:()=>xb});function fb(){return f("UpdateService.CancelDownload")}function mb(e){return f("UpdateService.Check",e)}function gb(){return f("UpdateService.CheckSilently")}function vb(){return f("UpdateService.Download")}function bb(){return f("UpdateService.Install")}function yb(){return f("UpdateService.Mirrors")}function _b(){return f("UpdateService.OpenDownloadDir")}function wb(e){return f("UpdateService.SetChannel",e)}function $b(e){return f("UpdateService.SetCheckOnStart",e)}function kb(e){return f("UpdateService.SkipVersion",e)}function Sb(){return f("UpdateService.State")}function xb(){return f("UpdateService.Version")}var gu=ae(()=>{Ee();mu()});var qo={};we(qo,{Close:()=>Cb,DesktopLyricsState:()=>Ab,DesktopLyricsTouched:()=>Mb,DesktopWallpaperState:()=>Ib,DesktopWallpaperTouched:()=>Tb,HideMain:()=>Eb,IsFullscreen:()=>Pb,IsMaximized:()=>Db,MainWindowBooted:()=>Lb,MainWindowShown:()=>Ob,MarkBooted:()=>Rb,MarkDesktopLyricsReady:()=>qb,MarkDesktopWallpaperPainted:()=>Nb,MarkDesktopWallpaperReady:()=>Fb,MarkReady:()=>Bb,MarkReadyAsync:()=>Ub,Minimize:()=>Wb,ResetDesktopLyricsPosition:()=>zb,ResetMainWindowGeometry:()=>Hb,SetDesktopLyrics:()=>jb,SetDesktopWallpaper:()=>Vb,SetFullscreen:()=>Kb,SetMinimizeToTray:()=>Gb,SetWindowCorners:()=>Yb,ShowMain:()=>Xb,ToggleFullscreen:()=>Jb,ToggleMaximize:()=>Qb,UpdateDesktopLyrics:()=>Zb,UpdateDesktopWallpaper:()=>ey});function Cb(){return f("WindowService.Close")}function Ab(){return f("WindowService.DesktopLyricsState")}function Mb(){return f("WindowService.DesktopLyricsTouched")}function Ib(){return f("WindowService.DesktopWallpaperState")}function Tb(){return f("WindowService.DesktopWallpaperTouched")}function Eb(){return f("WindowService.HideMain")}function Pb(){return f("WindowService.IsFullscreen")}function Db(){return f("WindowService.IsMaximized")}function Lb(){return f("WindowService.MainWindowBooted")}function Ob(){return f("WindowService.MainWindowShown")}function Rb(){return f("WindowService.MarkBooted")}function qb(){return f("WindowService.MarkDesktopLyricsReady")}function Nb(){return f("WindowService.MarkDesktopWallpaperPainted")}function Fb(){return f("WindowService.MarkDesktopWallpaperReady")}function Bb(){return f("WindowService.MarkReady")}function Ub(){return f("WindowService.MarkReadyAsync")}function Wb(){return f("WindowService.Minimize")}function zb(){return f("WindowService.ResetDesktopLyricsPosition")}function Hb(){return f("WindowService.ResetMainWindowGeometry")}function jb(e){return f("WindowService.SetDesktopLyrics",e)}function Vb(e){return f("WindowService.SetDesktopWallpaper",e)}function Kb(e){return f("WindowService.SetFullscreen",e)}function Gb(e){return f("WindowService.SetMinimizeToTray",e)}function Yb(e){return f("WindowService.SetWindowCorners",e)}function Xb(){return f("WindowService.ShowMain")}function Jb(){return f("WindowService.ToggleFullscreen")}function Qb(){return f("WindowService.ToggleMaximize")}function Zb(e){return f("WindowService.UpdateDesktopLyrics",e)}function ey(e){return f("WindowService.UpdateDesktopWallpaper",e)}var vu=ae(()=>{Ee();Gn()});var No={};we(No,{AppService:()=>_o,ConfigService:()=>wo,CoverService:()=>$o,DownloadService:()=>ko,LibraryService:()=>So,LoudnessService:()=>xo,LyricsService:()=>Co,MediaKeyService:()=>Ao,MediaService:()=>Mo,OnlineService:()=>Io,PackService:()=>To,PlayerService:()=>Eo,PlaylistService:()=>Po,SkinService:()=>Do,ThemeService:()=>Lo,UnplayableService:()=>Oo,UpdateService:()=>Ro,WindowService:()=>qo});var Fo=ae(()=>{Kd();Gd();Yd();Xd();Jd();Zd();tu();nu();su();iu();ou();lu();cu();uu();hu();fu();gu();vu();Gn()});var $u={};we($u,{D:()=>Xe,P:()=>Xa,a:()=>Xn,b:()=>y,c:()=>Ga,d:()=>Wo,e:()=>zo,f:()=>N,g:()=>Qt,h:()=>Rt,i:()=>x,j:()=>At,k:()=>Ws,l:()=>Va,m:()=>ja,n:()=>Ka,o:()=>ie,p:()=>wn,q:()=>Ya,r:()=>Uo,s:()=>qt,t:()=>dy,u:()=>Ct,w:()=>zs});function Qt(e){if(!Number.isFinite(e)||e<=0)return"00:00";let t=Math.floor(e/1e3),n=Math.floor(t/60),s=t%60;return`${String(n).padStart(2,"0")}:${String(s).padStart(2,"0")}`}function Ws(e){let t=Math.floor((e||0)/1e3),n=Math.floor(t/3600),s=Math.floor(t%3600/60);return n>0?`${n} \u5C0F\u65F6 ${s} \u5206`:s>0?`${s} \u5206`:`${t} \u79D2`}function wn(e){if(!Number.isFinite(e)||e<0)return"-";let t=["B","KB","MB","GB"],n=e,s=0;for(;n>=1024&&s<t.length-1;)n/=1024,s+=1;return`${n>=100||s===0?Math.round(n):n.toFixed(1)} ${t[s]}`}function N(e){return ty.format(e||0)}function Ct(e="id"){return bu+=1,`${e}_${Date.now().toString(36)}_${bu.toString(36)}`}function Xn(e){return Array.from(new Set(e))}function Uo(e){let t=!1,n=null;return(...s)=>{n=s,!t&&(t=!0,requestAnimationFrame(()=>{t=!1,e(...n)}))}}function At(e,t,n){return Math.min(n,Math.max(t,e))}function ja(e,t,n){if(t===n||t<0||t>=e.length)return e.slice();let s=e.slice(),[a]=s.splice(t,1),r=At(n,0,s.length);return s.splice(r,0,a),s}function Va(e){return`url("${String(e??"").replace(/\\/g,"\\\\").replace(/"/g,'\\"').replace(/[\u0000-\u001f\u007f]/g," ")}")`}function Rt(e){return e&&(sy(e.id)||Ka(e))||Xe}function Ka(e){return e?(typeof e.coverUrl=="string"?e.coverUrl.trim():"")||(typeof e.cover=="string"?e.cover.trim():""):""}function Wo(e){Bo=e}function sy(e){return!e||typeof Bo!="function"?"":Bo(e)||""}function zo(e){return String(e||"")===Xe}function x(){return Ot}async function Ga(){if(Ot)return!0;try{let e=await Promise.resolve().then(()=>(Fo(),No));if(!e?.LibraryService)return!1;await e.LibraryService.Folders(),b={App:e.AppService,MediaKeys:e.MediaKeyService,Library:e.LibraryService,Playlist:e.PlaylistService,Lyrics:e.LyricsService,Themes:e.ThemeService,Config:e.ConfigService,Media:e.MediaService,Player:e.PlayerService,Loudness:e.LoudnessService,Window:e.WindowService,Online:e.OnlineService,Download:e.DownloadService,Cover:e.CoverService,Skins:e.SkinService,Packs:e.PackService,Unplayable:e.UnplayableService,Update:e.UpdateService},Ot=!0;try{let t=await b.Media.State();_n.sameOrigin=t?.sameOrigin!==!1,_n.mediaBaseUrl=t?.baseUrl??"",_n.canTranscode=!!t?.canTranscode}catch{}try{_n.configPath=await b.Config.Path()}catch{}return console.info(`[bridge] \u5DF2\u8FDE\u63A5 Go \u540E\u7AEF\uFF08\u97F3\u9891\u540C\u6E90\uFF1A${_n.sameOrigin?"\u662F":"\u5426"}\uFF0C\u8F6C\u7801\uFF1A${_n.canTranscode?"\u53EF\u7528":"\u4E0D\u53EF\u7528"}\uFF09`),!0}catch(e){return b=null,Ot=!1,console.info("[bridge] \u672A\u68C0\u6D4B\u5230 Go \u540E\u7AEF\uFF0C\u4F7F\u7528\u6D4F\u89C8\u5668\u9884\u89C8\u6570\u636E\uFF1A",e?.message??e),!1}}async function ry(){if(Yn)return Yn;if(!Ot)return null;try{Yn=await import(ay)}catch{try{Yn=await import(iy)}catch{Yn=null}}return Yn}function ie(e,t){if(Ot){let s=null,a=!1;return ry().then(r=>{a||r?.Events?.On&&(s=r.Events.On(e,o=>t(o?.data??o)))}),()=>{a=!0,s?.(),s=null}}let n=s=>t(s.detail);return window.addEventListener(`dsh:${e}`,n),()=>window.removeEventListener(`dsh:${e}`,n)}function _u(e,t){window.dispatchEvent(new CustomEvent(`dsh:${e}`,{detail:t}))}async function _(e,...t){return!Ot||!b||typeof e!="function"?null:e(...t)}function zs(e,t,n="backend"){if(!(t>0))return e;let s=null,a=new Promise((r,o)=>{s=setTimeout(()=>{o(new Ha(n,t))},t)});return Promise.race([e,a]).finally(()=>{s!==null&&clearTimeout(s)})}async function oy(e,t,n,...s){return!Ot||!b||typeof n!="function"?null:zs(Promise.resolve().then(()=>n(...s)),e,t)}function Ya(){return Ot?()=>{}:(yu=setInterval(()=>{_u("scan:progress",{phase:"watch",message:"\u5DF2\u76D1\u542C\u6587\u4EF6\u5939\u53D8\u5316"})},6e4),()=>clearInterval(yu))}function qt(e,t){let n=Number(e),s=Number(t);return Number.isFinite(s)?!Number.isFinite(n)||n<0||s>=n?s:n-s<=Xa?n:s:Number.isFinite(n)&&n>=0?n:0}var bu,ty,ny,Xe,Bo,ay,iy,b,Ot,_n,Yn,Ha,wu,ly,cy,y,yu,dy,Xa,Hs=ae(()=>{(function(){let e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(let s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(let a of s)if(a.type==="childList")for(let r of a.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&n(r)}).observe(document,{childList:!0,subtree:!0});function t(s){let a={};return s.integrity&&(a.integrity=s.integrity),s.referrerPolicy&&(a.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?a.credentials="include":s.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function n(s){if(s.ep)return;s.ep=!0;let a=t(s);fetch(s.href,a)}})();bu=0;ty=new Intl.NumberFormat("zh-CN");ny=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300">
<defs>
<linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
<stop offset="0" stop-color="#26262c"/>
<stop offset="1" stop-color="#101014"/>
</linearGradient>
<radialGradient id="glow" cx="32%" cy="24%" r="78%">
<stop offset="0" stop-color="#ffffff" stop-opacity=".12"/>
<stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
</radialGradient>
</defs>
<rect width="300" height="300" fill="url(#bg)"/>
<rect width="300" height="300" fill="url(#glow)"/>
<circle cx="150" cy="150" r="104" fill="none" stroke="#ffffff" stroke-opacity=".07" stroke-width="1.2"/>
<circle cx="150" cy="150" r="86" fill="none" stroke="#ffffff" stroke-opacity=".1" stroke-width="1.2"/>
<circle cx="150" cy="150" r="68" fill="none" stroke="#ffffff" stroke-opacity=".07" stroke-width="1.2"/>
<circle cx="150" cy="150" r="50" fill="#ffffff" fill-opacity=".05"/>
<g transform="translate(150 150) scale(1.32) translate(-12 -12)" fill="none" stroke="#ffffff" stroke-opacity=".42" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
<path d="M9 18V5.5a1 1 0 0 1 .8-1l9-1.8a1 1 0 0 1 1.2 1V16"/>
<circle cx="6.5" cy="18" r="2.5"/>
<circle cx="17.5" cy="16" r="2.5"/>
</g>
</svg>`,Xe=`data:image/svg+xml;charset=UTF-8,${encodeURIComponent(ny)}`;Bo=null;ay="/wails/runtime.js",iy="../bindings/github.com/wailsapp/wails/v3/internal/eventcreate.js",b=null,Ot=!1;_n={mediaBaseUrl:"",sameOrigin:!0,canTranscode:!1,configPath:""};Yn=null;Ha=class extends Error{constructor(t,n){super(`[bridge] ${t} \u8D85\u8FC7 ${Math.round(n/1e3)}s \u6CA1\u6709\u8FD4\u56DE\uFF08\u5DF2\u653E\u5F03\u7B49\u5F85\uFF09`),this.name="BridgeTimeoutError",this.isTimeout=!0,this.label=t,this.timeoutMs=n}};wu=12e3,ly={appVersion:()=>_(b?.App?.Version),openExternalUrl:e=>_(b?.App?.OpenURL,String(e)),mediaKeysReady:()=>_(b?.MediaKeys?.FrontendReady),scan:(e=[])=>_(b?.Library?.Scan,e),songs:()=>_(b?.Library?.Songs),folders:()=>_(b?.Library?.Folders),addFolder:(e="")=>_(b?.Library?.AddFolder,e),removeFolder:e=>_(b?.Library?.RemoveFolder,e),setWatchers:e=>_(b?.Library?.SetWatchers,e),toggleLike:e=>_(b?.Library?.ToggleLike,e),revealInExplorer:e=>_(b?.Library?.RevealInExplorer,e),pickDirectory:()=>_(b?.Library?.PickDirectory),stats:()=>_(b?.Library?.Stats),refreshWatchers:()=>_(b?.Library?.RefreshWatchers),playlists:()=>_(b?.Playlist?.List),createPlaylist:e=>_(b?.Playlist?.Create,e),renamePlaylist:(e,t)=>_(b?.Playlist?.Rename,e,t),deletePlaylist:e=>_(b?.Playlist?.Delete,e),addSongsToPlaylist:(e,t)=>_(b?.Playlist?.AddSongs,e,t),removeSongsFromPlaylist:(e,t)=>_(b?.Playlist?.RemoveSongs,e,t),reorderPlaylist:(e,t,n)=>_(b?.Playlist?.Reorder,e,t,n),reorderPlaylists:(e,t)=>_(b?.Playlist?.ReorderPlaylists,e,t),exportPlaylist:e=>_(b?.Playlist?.Export,e),loadLyrics:e=>_(b?.Lyrics?.Load,e),lyricsAutoMatch:e=>_(b?.Lyrics?.AutoMatch,e),lyricsSave:(e,t,n="user",s=null)=>_(b?.Lyrics?.Save,e,t,n,s),lyricsCached:e=>_(b?.Lyrics?.LoadCached,e),lyricsUpgradeWord:e=>_(b?.Lyrics?.UpgradeWordLyrics,e),onlineLyrics:(e,t,n)=>_(b?.Online?.Lyrics,e,t,n),listThemes:()=>_(b?.Themes?.List),loadTheme:e=>_(b?.Themes?.Load,e),reloadThemes:()=>_(b?.Themes?.Reload),themeDir:()=>_(b?.Themes?.Dir),revealThemeDir:()=>_(b?.Themes?.RevealDir),themeReference:e=>_(b?.Themes?.Reference,e),importTheme:()=>_(b?.Themes?.Import),deleteTheme:e=>_(b?.Themes?.Delete,e),packCatalog:(e,t)=>_(b?.Packs?.Catalog,e,t===!0),packInstall:(e,t)=>_(b?.Packs?.Install,e,t),packSource:()=>_(b?.Packs?.Source),packSetSource:e=>_(b?.Packs?.SetSource,e),getConfig:()=>_(b?.Config?.Get),setConfig:e=>_(b?.Config?.Set,e),configPath:()=>_(b?.Config?.Path),resetConfig:()=>_(b?.Config?.Reset),mediaUrl:e=>_(b?.Media?.URL,e),mediaState:()=>_(b?.Media?.State),unplayableList:()=>_(b?.Unplayable?.List),unplayableCount:()=>_(b?.Unplayable?.Count),unplayableReport:(e,t,n="")=>_(b?.Unplayable?.Report,e,t,n),unplayableRemove:e=>_(b?.Unplayable?.Remove,e),unplayableForget:e=>_(b?.Unplayable?.Forget,e),unplayableClear:()=>_(b?.Unplayable?.Clear),playerAvailable:()=>oy(wu,"Player.Available",b?.Player?.Available),playerLoad:e=>_(b?.Player?.Load,e),playerPlay:()=>_(b?.Player?.Play),playerPause:()=>_(b?.Player?.Pause),playerSeek:e=>_(b?.Player?.Seek,e),playerCancelGap:()=>_(b?.Player?.CancelTrackGap),playerStop:()=>_(b?.Player?.Unload),playerUnload:()=>_(b?.Player?.Unload),playerState:()=>_(b?.Player?.State),playerSetVolume:(e,t)=>_(b?.Player?.SetVolume,e,!!t),playerSetPlaybackOptions:(e,t,n)=>_(b?.Player?.SetPlaybackOptions,!!e,!!t,Number(n)||0),playerSetLoudness:e=>_(b?.Player?.SetLoudnessGain,e),playerSetEffect:e=>_(b?.Player?.SetEffect,String(e||"off")),playerEffect:()=>_(b?.Player?.Effect),playerSpectrum:e=>_(b?.Player?.Spectrum,e),playerDiagnostics:()=>_(b?.Player?.Diagnostics),loudnessState:()=>_(b?.Loudness?.State),loudnessLookup:(e,t)=>_(b?.Loudness?.Get,e,t),loudnessMeasure:(e,t)=>_(b?.Loudness?.Measure,e,t),loudnessMeasureAll:e=>_(b?.Loudness?.MeasureAll,e),loudnessCancel:()=>_(b?.Loudness?.Cancel),loudnessClear:()=>_(b?.Loudness?.Clear),loudnessInvalidateTarget:e=>_(b?.Loudness?.InvalidateTarget,e),loudnessGainMap:e=>_(b?.Loudness?.GainMap,e),loudnessAlbumGains:e=>_(b?.Loudness?.AlbumGains,e),loudnessRefresh:()=>_(b?.Loudness?.RefreshTools),windowReady:()=>_(b?.Window?.MarkReady),minimizeToTray:e=>_(b?.Window?.SetMinimizeToTray,!!e),setWindowCorners:e=>_(b?.Window?.SetWindowCorners,String(e)),windowMinimize:()=>_(b?.Window?.Minimize),windowToggleMaximize:()=>_(b?.Window?.ToggleMaximize),windowClose:()=>_(b?.Window?.Close),windowSetFullscreen:e=>_(b?.Window?.SetFullscreen,e),windowToggleFullscreen:()=>_(b?.Window?.ToggleFullscreen),windowIsFullscreen:()=>_(b?.Window?.IsFullscreen),desktopLyrics:e=>_(b?.Window?.SetDesktopLyrics,!!e),desktopLyricsState:()=>_(b?.Window?.DesktopLyricsState),desktopLyricsReady:()=>_(b?.Window?.MarkDesktopLyricsReady),updateDesktopLyrics:e=>_(b?.Window?.UpdateDesktopLyrics,e),desktopLyricsResetPos:()=>_(b?.Window?.ResetDesktopLyricsPosition),mainWindowResetGeometry:()=>_(b?.Window?.ResetMainWindowGeometry),desktopWallpaper:e=>_(b?.Window?.SetDesktopWallpaper,!!e),desktopWallpaperState:()=>_(b?.Window?.DesktopWallpaperState),desktopWallpaperReady:()=>_(b?.Window?.MarkDesktopWallpaperReady),desktopWallpaperPainted:()=>_(b?.Window?.MarkDesktopWallpaperPainted),updateDesktopWallpaper:e=>_(b?.Window?.UpdateDesktopWallpaper,e),onlineSearch:(e,t,n)=>_(b?.Online?.Search,e,t,n),coverLookup:(e,t,n,s,a)=>_(b?.Online?.CoverLookup,e,t,n,s,a),coverProviders:()=>_(b?.Online?.CoverProviders),coverInvalidate:()=>_(b?.Online?.InvalidateCovers),onlineSourceIndex:()=>_(b?.Online?.SourceIndex),onlineProtectIDs:e=>_(b?.Online?.ProtectIDs,e),onlineCleanupCache:()=>_(b?.Online?.CleanupCache),onlineCacheStats:()=>_(b?.Online?.CacheStats),downloadStart:(e,t,n)=>_(b?.Download?.Start,e,t,n),downloadStatus:()=>_(b?.Download?.Status),downloadTasks:()=>_(b?.Download?.Tasks),downloadClearFinished:()=>_(b?.Download?.ClearFinished),downloadPickDir:()=>_(b?.Download?.PickDir),downloadSetDir:e=>_(b?.Download?.SetDir,e),downloadApplyDir:(e,t)=>_(b?.Download?.ApplyDir,e,t),downloadOpenDir:e=>_(b?.Download?.OpenDir,e),listSkins:()=>_(b?.Skins?.List),skinsToken:()=>_(b?.Skins?.Token),reloadSkins:()=>_(b?.Skins?.Reload),skinDir:()=>_(b?.Skins?.Dir),revealSkinDir:()=>_(b?.Skins?.RevealDir),skinReference:e=>_(b?.Skins?.Reference,e),importSkin:()=>_(b?.Skins?.Import),deleteSkin:e=>_(b?.Skins?.Delete,e),coverLookupSong:(e,t={})=>_(b?.Cover?.Lookup,e,t),coverLookupSongAll:(e,t={})=>_(b?.Cover?.LookupAll,e,t),coverPickLocal:()=>_(b?.Cover?.PickLocal),coverList:e=>_(b?.Cover?.List,e),coverAdd:(e,t,n,s=null)=>_(b?.Cover?.Add,e,t,n,s),coverAddMany:(e,t,n=null)=>_(b?.Cover?.AddMany,e,t,n),coverSetActive:(e,t)=>_(b?.Cover?.SetActive,e,t),coverRemove:(e,t)=>_(b?.Cover?.Remove,e,t),coverCurrent:e=>_(b?.Cover?.Current,e),coverCachedSets:()=>_(b?.Cover?.CachedSets),coverCachedPreviews:()=>_(b?.Cover?.CachedPreviews),coverCacheStats:()=>_(b?.Cover?.CacheStats),coverOpenCacheDir:e=>_(b?.Cover?.OpenCacheDir,e),coverClearCache:()=>_(b?.Cover?.ClearCache),coverWriteCacheToFiles:()=>_(b?.Cover?.WriteCacheToFiles),updateState:()=>_(b?.Update?.State),updateVersion:()=>_(b?.Update?.Version),updateCheck:(e=!1)=>_(b?.Update?.Check,!!e),updateDownload:()=>_(b?.Update?.Download),updateInstall:()=>_(b?.Update?.Install),updateCancel:()=>_(b?.Update?.CancelDownload),updateMirrors:()=>_(b?.Update?.Mirrors),updateSetChannel:e=>_(b?.Update?.SetChannel,String(e)),updateSetCheckOnStart:e=>_(b?.Update?.SetCheckOnStart,!!e),updateSkipVersion:e=>_(b?.Update?.SkipVersion,String(e??"")),updateOpenDir:()=>_(b?.Update?.OpenDownloadDir)},cy=new Set(["then","toJSON","constructor","valueOf","toString","inspect"]),y=new Proxy(ly,{get(e,t,n){if(typeof t=="string"&&!(t in e)&&!cy.has(t)){let s=`[bridge] backend.${t} \u672A\u63A5\u7EBF\uFF1Abridge.js \u91CC\u7F3A\u5C11\u8FD9\u4E2A\u952E\u3002\u82E5 Go \u4FA7/\u7ED1\u5B9A\u5C42\u5B58\u5728\u540C\u540D\u65B9\u6CD5\uFF08\u770B frontend/bindings/localmusicplayer/\uFF09\uFF0C\u5728\u90A3\u4E2A\u5BF9\u8C61\u91CC\u8865\u4E00\u884C\u5373\u53EF\u3002`;return console.error(s),()=>{throw new Error(s)}}return Reflect.get(e,t,n)}}),yu=null;dy=Object.freeze(Object.defineProperty({__proto__:null,BridgeTimeoutError:Ha,PLAYER_AVAILABLE_TIMEOUT_MS:wu,backend:y,backendState:_n,connect:Ga,emit:_u,isWails:x,on:ie,startMockWatcher:Ya,withTimeout:zs},Symbol.toStringTag,{value:"Module"})),Xa=300});var Hl={};we(Hl,{$:()=>ri,A:()=>A,B:()=>Ni,C:()=>je,D:()=>Be,E:()=>Je,F:()=>ot,G:()=>ft,H:()=>Dn,I:()=>vs,J:()=>Si,K:()=>Ui,L:()=>He,M:()=>qe,N:()=>Wi,O:()=>Ut,P:()=>sn,Q:()=>vl,R:()=>bl,S:()=>mt,T:()=>It,U:()=>ms,V:()=>Ci,W:()=>xi,X:()=>pa,Y:()=>ua,Z:()=>Ei,_:()=>ls,a:()=>Tn,a$:()=>gl,a0:()=>Di,a1:()=>Ii,a2:()=>Pi,a3:()=>nn,a4:()=>Ti,a5:()=>Mi,a6:()=>ha,a7:()=>Bt,a8:()=>Mt,a9:()=>la,aA:()=>El,aB:()=>Pl,aC:()=>li,aD:()=>is,aE:()=>oi,aF:()=>wl,aG:()=>$l,aH:()=>_l,aI:()=>yl,aJ:()=>kl,aK:()=>Sl,aL:()=>ci,aM:()=>na,aN:()=>ea,aO:()=>xl,aP:()=>Ll,aQ:()=>Ol,aR:()=>Cl,aS:()=>Dl,aT:()=>Al,aU:()=>Ml,aV:()=>Il,aW:()=>Tl,aX:()=>Wt,aY:()=>zi,aZ:()=>fs,a_:()=>ji,aa:()=>ps,ab:()=>ra,ac:()=>ki,ad:()=>ia,ae:()=>cs,af:()=>fi,ag:()=>aa,ah:()=>Li,ai:()=>Oi,aj:()=>oa,ak:()=>$i,al:()=>da,am:()=>on,an:()=>ui,ao:()=>ca,ap:()=>pi,aq:()=>wi,ar:()=>Ri,as:()=>ml,at:()=>Fi,au:()=>Bi,av:()=>gs,aw:()=>hl,ax:()=>hs,ay:()=>En,az:()=>sa,b:()=>u,b0:()=>Ai,b1:()=>Hi,b2:()=>fa,b3:()=>Cn,b4:()=>rn,b5:()=>di,b6:()=>h_,c:()=>$,d:()=>Se,e:()=>ta,f:()=>ma,g:()=>Ve,h:()=>g,i:()=>tn,j:()=>pl,k:()=>qi,l:()=>ge,m:()=>an,n:()=>yi,o:()=>ue,p:()=>gt,q:()=>gi,r:()=>os,s:()=>i,t:()=>m,u:()=>us,v:()=>bi,w:()=>vi,x:()=>_i,y:()=>ds,z:()=>Ft});function Gu(e,t){if(!ul(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return Mu!==void 0?Mu.createHTML(t):t}function ts(e,t,n=e,s){if(t===Je)return t;let a=s!==void 0?n._$Co?.[s]:n._$Cl,r=Qs(t)?void 0:t._$litDirective$;return a?.constructor!==r&&(a?._$AO?.(!1),r===void 0?a=void 0:(a=new r(e),a._$AT(e,n,s)),s!==void 0?(n._$Co??(n._$Co=[]))[s]=a:n._$Cl=a),a!==void 0&&(t=ts(e,a._$AS(e,t.values),a,s)),t}function My(){let e=document.getElementById(Lu);return e||(e=document.createElement("style"),e.id=Lu,document.head.appendChild(e)),e.sheet}function Yu(){let e=My();if(!e)return;let t=null;for(let s=0;s<e.cssRules.length;s+=1){let a=e.cssRules[s];if(a&&a.selectorText===":root"){t=a;break}}if(!Nt.size){for(let s=e.cssRules.length-1;s>=0;s-=1)e.deleteRule(s);return}if(t){let s=new Set(Nt.keys()),a=[];for(let r=0;r<t.style.length;r+=1){let o=t.style[r];s.has(o)||a.push(o)}for(let r of a)t.style.removeProperty(r);for(let[r,o]of Nt)t.style.setProperty(r,String(o),"important");return}let n=[...Nt.entries()].map(([s,a])=>`${s}:${a} !important`).join(";");try{e.insertRule(`:root{${n}}`,0)}catch(s){console.warn("[runtime-tokens] \u89C4\u5219\u63D2\u5165\u5931\u8D25",s)}}function nn(e,t){t==null||t===""?Nt.delete(e):Nt.set(e,t),Yu()}function Tn(e){for(let[t,n]of Object.entries(e))n==null||n===""?Nt.delete(t):Nt.set(t,n);Yu()}function hl(){return Object.fromEntries(Nt)}function ta(e){if(!e||e.animations===!1)return"0.001ms";let t=e.animationsSpeed;return!t||t==="fast"?null:`${ai[t]??ai.fast}ms`}function Iy(){return Math.round(sn()*.6)}function sn(){let e=getComputedStyle(document.documentElement).getPropertyValue("--dur").trim();if(!e)return ai.fast;let t=parseFloat(e);if(!Number.isFinite(t))return ai.fast;let n=e.endsWith("ms")?t:e.endsWith("s")?t*1e3:t;return Math.max(0,n)}function os(e,t){let n=document.getElementById(e);n||(n=document.createElement("style"),n.id=e,document.head.appendChild(n));let s=n.sheet;if(!s)return;for(let r=s.cssRules.length-1;r>=0;r-=1)s.deleteRule(r);if(!t)return;let a=Ty(t);for(let r of a)try{s.insertRule(r,s.cssRules.length)}catch(o){console.warn("[runtime-tokens] \u8DF3\u8FC7\u65E0\u6548\u89C4\u5219",r,o)}}function Ty(e){let t=[],n=0,s="";for(let a of e)s+=a,a==="{"?n+=1:a==="}"&&(n-=1,n===0&&(t.push(s.trim()),s=""));return s.trim()&&t.push(s.trim()),t.filter(Boolean)}function tl(e,t=""){return u`<svg class=${t||A} aria-hidden="true"><use href="#i-${e}"></use></svg>`}function fl(e,t,n={}){let s=document.getElementById(e);if(!s){s=document.createElement("div"),s.id=e,s.className=t;for(let[a,r]of Object.entries(n))s.setAttribute(a,r);document.body.appendChild(s)}return s}function an({x:e,y:t,items:n,anchor:s,onPick:a,align:r="left"}){let o=Ey(),l=++jo;kn&&(clearTimeout(kn),kn=null);let c=S=>{Cn(),a?.(S)},d=n.filter((S,q)=>S.kind!=="sep"?!0:q===0||q===n.length-1?!1:n[q-1].kind!=="sep");as(d.map(S=>{if(S.kind==="sep")return u`<div class="menu__sep"></div>`;if(S.kind==="label")return u`<div class="menu__label">${S.label}</div>`;let q=S.checked!==void 0?tl("check","menu__check"):null;return u` <button
        class=${S.danger?"menu__item menu__item--danger":"menu__item"}
        type="button"
        role="menuitem"
        data-id=${S.id}
        ?disabled=${!!S.disabled}
        aria-checked=${S.checked!==void 0?String(S.checked):A}
        @click=${()=>{S.disabled||c(S.id)}}
      >
        ${S.icon?tl(S.icon):A}<span>${S.label}</span>
        ${q||(S.hint?u`<span class="u-num u-dim">${S.hint}</span>`:A)}
      </button>`}),o),o.dataset.state="",o.hidden=!1;let p=o.getBoundingClientRect(),h=window.innerWidth,v=window.innerHeight,w=e,k=t;if(s){let S=s.getBoundingClientRect();w=r==="right"?S.right-p.width:S.left,k=S.bottom+6,k+p.height>v-8&&(k=S.top-p.height-6)}w=Math.max(8,Math.min(w,h-p.width-8)),k=Math.max(8,Math.min(k,v-p.height-8)),o.style.left=`${w}px`,o.style.top=`${k}px`;let C=S=>{o.contains(S.target)||Cn()},L=S=>{S.key==="Escape"&&Cn()},O=()=>Cn();requestAnimationFrame(()=>{l===jo&&(o.dataset.state="open")}),setTimeout(()=>{document.addEventListener("pointerdown",C,!0),document.addEventListener("keydown",L),window.addEventListener("resize",O)},0),nl=()=>{document.removeEventListener("pointerdown",C,!0),document.removeEventListener("keydown",L),window.removeEventListener("resize",O),nl=null,o.dataset.state="closed",kn&&clearTimeout(kn),kn=setTimeout(()=>{kn=null,l===jo&&(o.hidden=!0,as(A,o))},Iy()+20)}}function Cn(){nl?.()}function ue(e){let t=Py(),n=Ct("ok");Sn&&(clearTimeout(Sn),Sn=null);let s=++Vo,a=!1,r=()=>{a||(a=!0,document.removeEventListener("keydown",d),t.dataset.state="closed",Sn&&clearTimeout(Sn),Sn=setTimeout(()=>{Sn=null,s===Vo&&(t.hidden=!0,as(A,t))},sn()+20))},o=async()=>{let v=t.querySelector(".modal");await e.onCancel?.(v)!==!1&&r()},l=v=>{let w={};return v.querySelectorAll("[data-field]").forEach(k=>{w[k.dataset.field]=k.type==="checkbox"?k.checked:k.value}),w},c=async()=>{let v=t.querySelector(".modal"),w=await e.onOk?.(l(v),v);if(w!==!1){if(typeof w=="string"){let k=t.querySelector("#modal-error");k&&(k.textContent=w,k.classList.remove("u-hidden"));return}r()}},d=v=>{v.key==="Escape"&&o(),v.key==="Enter"&&!v.shiftKey&&v.target.tagName!=="TEXTAREA"&&(v.preventDefault(),c())};as(u`
      <div class="modal" role="dialog" aria-modal="true" aria-label=${e.title}>
        <div class="modal__head">${e.title}</div>
        ${e.desc?u`<div class="modal__desc">${e.desc}</div>`:A}
        <div class="modal__body">${e.body??A}</div>
        <div class="modal__error u-hidden" id="modal-error"></div>
        <div class="modal__foot">
          <button class="btn btn--ghost" type="button" @click=${o}>${e.cancelText||"\u53D6\u6D88"}</button>
          <button
            class=${e.danger?"btn btn--danger":"btn btn--primary"}
            type="button"
            id=${n}
            @click=${c}
          >
            ${e.okText||"\u786E\u5B9A"}
          </button>
        </div>
      </div>
    `,t),t.dataset.state="",t.hidden=!1,requestAnimationFrame(()=>{s===Vo&&(t.dataset.state="open")});let p=t.querySelector(".modal");t.onclick=v=>{v.target===t&&o()};let h=p.querySelector("input, select, textarea");return setTimeout(()=>h?.focus({preventScroll:!0}),30),document.addEventListener("keydown",d),{close:r,root:p}}function Ja(){as(Qn.map(e=>u` <div class="toast ${e.leaving?"is-leaving":""}" data-tone=${e.tone}>
          <span class="toast__dot"></span>
          ${e.icon?tl(e.icon):A}
          <span>${e.message}</span>
        </div>`),Dy())}function m(e,{tone:t="info",duration:n=2800,icon:s=null}={}){let a={id:Ct("toast"),message:e,tone:t,icon:s,leaving:!1};Qn=[...Qn,a],Ja();let r=null,o=c=>{r&&clearTimeout(r),c>0&&(r=setTimeout(()=>l(),c))},l=()=>{let c=Qn.find(d=>d.id===a.id);!c||c.leaving||(c.leaving=!0,Ja(),setTimeout(()=>{Qn=Qn.filter(d=>d.id!==a.id),Ja()},sn()+20))};return o(n),{update(c,d=t){a.message=c,a.tone=d,Ja()},close(){l()}}}function Ly(e){return e.currentSrc===Xe||e.src===Xe||e.getAttribute("src")===Xe}function ml(e){!e||e.dataset.coverFallback==="1"||(e.dataset.coverFallback="1",e.addEventListener("error",()=>{Ly(e)||(e.src=Xe)},!0))}function gl(){let e=document.getElementById("app-tip");e||(e=document.createElement("div"),e.className="app-tip",e.id="app-tip",e.setAttribute("role","tooltip"),document.body.appendChild(e));let t=null,n=()=>{let o=getComputedStyle(document.documentElement).getPropertyValue("--h-titlebar").trim(),l=parseFloat(o);return Number.isFinite(l)?l:36};function s(){if(!t)return;let o=t.getBoundingClientRect();e.style.left="0px",e.style.top="0px";let l=e.offsetWidth,c=e.offsetHeight,d=window.innerWidth,p=window.innerHeight,h=n(),v=o.left+o.width/2-l/2,w=o.top-c-6;w<h+4&&(w=o.bottom+6),v=Math.max(8,Math.min(v,d-l-8)),w=Math.max(h+4,Math.min(w,p-c-8)),e.style.left=`${v}px`,e.style.top=`${w}px`}function a(o){let l=o?.getAttribute?.("data-tip");if(!l){r();return}e.textContent=l,e.dataset.visible="true",t=o,s()}function r(){delete e.dataset.visible,t=null}document.addEventListener("mouseover",o=>{let l=o.target.closest?.("[data-tip]");l?a(l):r()}),document.addEventListener("mouseout",o=>{let l=o.target.closest?.("[data-tip]");l&&!l.contains(o.relatedTarget)&&r()}),document.addEventListener("pointerdown",r,!0),window.addEventListener("scroll",r,!0),window.addEventListener("resize",r)}function ls(e){let t=String(e||"").trim();return ea.find(n=>n.id===t)||ea[0]}function Dl(e){let t=String(e?.version||"").trim();return!t||t==="\u2014"?String(e?.name||""):`${e.name} ${t}`}function Ll(){return[...Ny.map(e=>({...e,kind:"\u8FD0\u884C\u65F6"})),...Fy.map(e=>({...e,kind:"\u968F Wails \u5F15\u5165"}))]}function Ol(e){let t=new Map;for(let n of e)t.set(n.license,(t.get(n.license)||0)+1);return[...t.entries()].sort((n,s)=>s[1]-n[1]||n[0].localeCompare(s[0])).map(([n,s])=>({license:n,count:s}))}function By(){return{songs:[],folders:[],playlists:[],filterRules:[],allSongsRaw:[],lastScan:null,scanning:!1,onlineSongs:new Map,view:"library",playlistId:null,playlistSelecting:!1,selectedIds:new Set,playerOpen:!1,queueOpen:!1,optionsOpen:!1,sleepOpen:!1,update:{check:null,checking:!1,progress:null,pending:null,channel:"auto",checkOnStart:!0,skippedVersion:"",error:""},updateRev:0,pvMode:"classic",query:"",searchOpen:!1,sortKey:"addedAt",sortDir:"desc",coverSets:new Map,settingsOpen:!1,settingsSection:"library",settingsRev:0,scanText:"\u6B63\u5728\u626B\u63CF\u97F3\u4E50\u6587\u4EF6\u5939\u2026",unplayableFiles:[],unplayableLoaded:!1,unplayableOpen:!1,playlistVersion:0,queue:[],queueOrigin:null,progress:{},pendingResumeMs:0,currentId:null,playing:!1,position:0,duration:0,playNonce:0,playMode:"sequence",volume:.8,muted:!1,shuffleOrder:[],forcedNextId:"",sleepTimer:null,loudnessGains:{},loudnessState:null,appVersion:"",coverProviders:[],coverBreaker:{},desktopWallpaperSupport:null,floatingLyrics:{show:!1,text:""},lyricsOpen:!1,config:{...Qu},coverCache:null,visibleSongs:[],visibleFingerprint:"",visibleVersion:0,likedIds:new Set}}function Ft(e){return sl.add(e),()=>sl.delete(e)}function Go(){Zn!==null&&typeof cancelAnimationFrame=="function"&&cancelAnimationFrame(Zn),An!==null&&clearTimeout(An),Zn=null,An=null,je()}function Wy(){if(!(Zn!==null||An!==null)){if(typeof document<"u"&&typeof document.visibilityState=="string"&&document.visibilityState==="hidden"||typeof requestAnimationFrame!="function"){An=setTimeout(Go,0);return}Zn=requestAnimationFrame(Go),An=setTimeout(Go,Uy)}}function je(){for(let e of sl)try{e(i)}catch(t){console.error("[store] \u8BA2\u9605\u8005\u629B\u51FA\u5F02\u5E38\uFF08\u5DF2\u8DF3\u8FC7\uFF0C\u5176\u4F59\u8BA2\u9605\u8005\u7EE7\u7EED\uFF09",t)}}function $(e,t={}){if(typeof e=="function"&&e(i),i.updateRev=(i.updateRev||0)+1,Xy(),t.persist!==!1&&vs(),t.immediate){je();return}Zn!==null||An!==null||Wy()}function zy(e,t){let n=String(e??"").replace(/[^\d.+-]/g,"");if(n==="")return NaN;let s=Number(n);if(!Number.isFinite(s))return NaN;let a=1;switch(String(t||"B").toUpperCase()){case"KB":a=1024;break;case"MB":a=1024*1024;break;case"GB":a=1024*1024*1024;break;default:a=1}let r=Math.trunc(s*a);return r<Ru&&r>=-Ru?r:NaN}function sa(e,t="i"){if(!e)return null;try{return new RegExp(e,t)}catch{return null}}function Zu(e){return(e||[]).filter(t=>t.enabled).map(t=>({rule:t,re:t.type==="regex"?sa(t.value):null,bytes:t.type==="size"?zy(t.value,t.unit):NaN}))}function ep(e,t){if(!t.length)return{excluded:!1,reason:null};let n=t.some(a=>a.rule.scope==="include"),s=!1;for(let a of t){let r=a.rule,o=!1;if(r.type==="size"){if(!Number.isFinite(a.bytes)||a.bytes<0)continue;o=(Ou[r.op]||Ou.lt)(e.size,a.bytes)}else if(r.type==="regex"){if(!a.re)continue;o=a.re.test(e.path)||a.re.test(Qy(e.path))}if(o){if(r.scope==="include"){s=!0;continue}return{excluded:!0,reason:r.id}}}return n&&!s?{excluded:!0,reason:"include-miss"}:{excluded:!1,reason:null}}function Hy(e,t){return ep(e,Zu(t))}function En(e,t){let n=Zu(t),s=[],a=0;for(let r of e)ep(r,n).excluded?a+=1:s.push(r);return{kept:s,excluded:a,total:e.length}}function tp(){Rl=Mn.join(",")}function ql(e){return String(e||"").trim().replace(/\//g,"\\").toLowerCase()}function np(){if(!rs.length||!i.songs.length)return!1;let e=new Map(rs.map((n,s)=>[n,s])),t=[];for(let n of i.songs){if(ii.has(n.id))continue;let s=e.get(ql(n.path));s!==void 0&&t.push([s,n.id])}return t.length?(t.sort((n,s)=>n[0]-s[0]),Mn=[...t.map(([,n])=>n),...Mn],ii=new Set(Mn),tp(),!0):!1}function di(e){let t=ql(e);t&&!rs.includes(t)&&rs.unshift(t),np(),$()}function Nl(){!rs.length&&!Mn.length||(rs=[],Mn=[],ii=new Set,tp())}function ui(){return Rl}function pi(e){return ii.has(e)}function sp(e,t=Mn){if(!t.length||!e.length)return e;let n=new Map(t.map((r,o)=>[r,o])),s=[],a=[];for(let r of e)n.has(r.id)?s.push(r):a.push(r);return s.length?(s.sort((r,o)=>n.get(r.id)-n.get(o.id)),[...s,...a]):e}function cs(e){return aa.find(t=>t.key===e)}function fi(e){return e==="desc"?"\u964D\u5E8F":"\u5347\u5E8F"}function Fl(e){return cs(e)?.descFirst?"desc":"asc"}function mi(e){return e==="desc"?"desc":"asc"}function jy(){let{view:e,playlistId:t,playlists:n,queue:s,songs:a}=i;if(e!=="queue"&&!(e==="playlist"&&t))return a;let r=Bl();return e==="queue"?s.map(o=>r.get(o)||i.onlineSongs.get(o)).filter(Boolean):(n.find(o=>o.id===t)?.songIds||[]).map(o=>r.get(o)||i.onlineSongs.get(o)).filter(Boolean)}function Vy(){let e=i.view==="playlist"&&i.playlistId?ge(i.playlistId):null;return[i.view,i.playlistId,i.query,i.sortKey,i.sortDir,i.songs,i.songs.length,i.queue,i.queue.length,e?e.songIds:null,e?e.songIds.length:0,i.playlistVersion,i.onlineSongs.size,Rl]}function Ky(e){if(!ei||ei.length!==e.length)return!1;for(let t=0;t<e.length;t+=1)if(ei[t]!==e[t])return!1;return!0}function Bl(){return al===i.songs?ap:new Map(i.songs.map(e=>[e.id,e]))}function ds(e){if(!Array.isArray(e)||!e.length)return[];let t=Bl();return e.filter(n=>t.has(n)||i.onlineSongs.has(n))}function Gy(e){if(Nu===e)return Fu;let t=new Map;for(let n of e)t.set(n.id,`${n.title}${ti}${n.artist}${ti}${n.album}${ti}${n.ext}`.toLowerCase());return Nu=e,Fu=t,t}function ip(e,t){let n=String(t??"").trim().toLowerCase();if(!n)return e;if(n.includes(ti))return e.filter(a=>a.title.toLowerCase().includes(n)||a.artist.toLowerCase().includes(n)||a.album.toLowerCase().includes(n)||a.ext.toLowerCase().includes(n));let s=Gy(e);return e.filter(a=>{let r=s.get(a.id);return r===void 0?a.title.toLowerCase().includes(n)||a.artist.toLowerCase().includes(n)||a.album.toLowerCase().includes(n)||a.ext.toLowerCase().includes(n):r.includes(n)})}function Yy(){let e=jy(),t=ip(e,i.query);return i.view==="queue"?t:sp(rp(t))}function rp(e,t){let n=t?.key??i.sortKey,s=mi(t?.dir??i.sortDir),a=hi[n];if(!a)return e;let r=s==="desc"?-1:1;return e.slice().sort((o,l)=>{let c=a(o,l);return c===0?0:c*r})}function Xy(){al!==i.songs&&(ap=new Map(i.songs.map(s=>[s.id,s])),al=i.songs,np());let e=Vy();Ky(e)||(ei=e,qu=Yy());let t=qu;i.visibleSongs=t;let n=Jy(t);n!==i.visibleFingerprint&&(i.visibleFingerprint=n,i.visibleVersion=(i.visibleVersion||0)+1)}function Jy(e){let t=2166136261;t=Math.imul(t^e.length,16777619)>>>0;for(let s=0;s<e.length;s+=1){let a=String(e[s].id??"");for(let r=0;r<a.length;r+=1)t^=a.charCodeAt(r),t=Math.imul(t,16777619)>>>0;t^=31,t=Math.imul(t,16777619)>>>0}let n=i.songs!==Bu?1:0;return Bu=i.songs,`${e.length}:${t>>>0}:${n}`}function Qy(e){let t=String(e||""),n=Math.max(t.lastIndexOf("/"),t.lastIndexOf("\\"));return n>=0?t.slice(n+1):t}function Bt(){return i.view==="queue"?{type:"queue",id:null}:i.view==="playlist"&&i.playlistId?{type:"playlist",id:i.playlistId}:{type:"library",id:null}}function ge(e){return i.playlists.find(t=>t.id===e)||null}function us(e){return ds(e?.songIds)}function ia(e=i.folders){return(e||[]).filter(t=>t.id!==op)}function ht(){i.playlistVersion=(i.playlistVersion||0)+1}function Pn(e,t){!t||typeof t.catch!="function"||t.catch(n=>{console.error(`[store] ${e}\u5199\u5165\u540E\u7AEF\u5931\u8D25\uFF0C\u5185\u5B58\u72B6\u6001\u53EF\u80FD\u5DF2\u4E0E\u540E\u7AEF\u4E0D\u4E00\u81F4`,n),m(`${e}\u4FDD\u5B58\u5931\u8D25\uFF1A${n?.message??n}`,{tone:"error",duration:6e3})})}function mt(e){return i.likedIds.has(e)}function It(e){let t=ge(He),n=new Set(i.likedIds);n.has(e)?n.delete(e):n.add(e),i.likedIds=n,t&&(t.songIds=n.has(e)?Xn([...t.songIds,e]):t.songIds.filter(s=>s!==e),ht()),$(void 0,{immediate:!0}),x()&&Pn("\u6536\u85CF\u72B6\u6001",y.toggleLike(e)),n.has(e)&&gp(e,"like")}async function gi(e){let t=String(e||"").trim();if(!t)return null;let n=Ct("pl"),s=Date.now();if(x()){let r=null;try{r=await y.createPlaylist(t)}catch(o){return console.error("[store] \u65B0\u5EFA\u6B4C\u5355\u5931\u8D25",o),m(`\u65B0\u5EFA\u6B4C\u5355\u5931\u8D25\uFF1A${o?.message??o}`,{tone:"error",duration:6e3}),null}r?.id&&(n=r.id,r.createdAt&&(s=r.createdAt))}let a={id:n,name:t,locked:!1,builtin:!1,songIds:[],createdAt:s};return i.playlists=[...i.playlists,a],ht(),$(),a}function vi(e,t){let n=ge(e);if(!n||n.locked)return!1;let s=String(t||"").trim();return s?(n.name=s,ht(),$(),x()&&Pn("\u91CD\u547D\u540D\u6B4C\u5355",y.renamePlaylist(e,s)),!0):!1}function bi(e){let t=ge(e);return!t||t.locked?!1:(i.playlists=i.playlists.filter(n=>n.id!==e),ht(),i.playlistId===e&&(i.view="library",i.playlistId=null),$(),x()&&Pn("\u5220\u9664\u6B4C\u5355",y.deletePlaylist(e)),!0)}function yi(e,t){let n=ge(e);if(!n)return 0;let s=n.songIds.length,a=new Set(n.songIds);n.songIds=Xn([...n.songIds,...t]),e===He&&(i.likedIds=new Set(n.songIds)),ht(),$(),x()&&Pn("\u6DFB\u52A0\u6B4C\u66F2",y.addSongsToPlaylist(e,t));for(let r of t)a.has(r)||gp(r,"playlist");return n.songIds.length-s}function ra(e,t){let n=ge(e);if(!n)return 0;let s=new Set(t),a=n.songIds.length;return n.songIds=n.songIds.filter(r=>!s.has(r)),e===He&&(i.likedIds=new Set(n.songIds)),ht(),$(),x()&&Pn("\u79FB\u9664\u6B4C\u66F2",y.removeSongsFromPlaylist(e,t)),a-n.songIds.length}function _i(e,t){let n=i.playlists.filter(r=>r.id!==He);if(e<0||e>=n.length)return;let s=ja(n,e,t),a=ge(He);i.playlists=[a,...s].filter(Boolean),ht(),$(),x()&&Pn("\u6B4C\u5355\u6392\u5E8F",y.reorderPlaylists(e,t))}function oa(e){i.playlistSelecting=!!e,i.playlistSelecting||(i.selectedIds=new Set),$()}function wi(e){if(!e)return;let t=new Set(i.selectedIds);t.has(e)?t.delete(e):t.add(e),i.selectedIds=t,$()}function $i(e){i.selectedIds=new Set(Array.isArray(e)?e:[]),$()}function ki(e){i.queue=Xn([...i.queue,...e]),$()}function la(e){if(!e||e===i.currentId)return;let t=i.queue.filter(s=>s!==e),n=i.currentId?t.indexOf(i.currentId):-1;n>=0?t.splice(n+1,0,e):t.unshift(e),i.queue=t,i.playMode==="shuffle"&&(i.forcedNextId=e),$()}function ps(e){let t=i.queue.indexOf(e);i.queue=i.queue.filter(n=>n!==e),i.forcedNextId===e&&(i.forcedNextId=""),i.currentId===e&&(i.currentId=i.queue[Math.min(t,i.queue.length-1)]??null),$()}function ca(e,t){i.queue=ja(i.queue,e,t),Ul("sequence"),$();let n=i.queueOrigin?.id?ge(i.queueOrigin.id):null;x()&&n&&Zy(n.songIds,i.queue)?Pn("\u6B4C\u5355\u5185\u6392\u5E8F",y.reorderPlaylist(n.id,e,t)):n&&(i.queueOrigin=null)}function Zy(e,t){if(!Array.isArray(e)||!Array.isArray(t)||e.length!==t.length)return!1;for(let n=0;n<e.length;n+=1)if(e[n]!==t[n])return!1;return!0}function da(){i.queue=[],i.forcedNextId="",i.currentId=null,i.playing=!1,i.position=0,i.onlineSongs.clear(),$()}function Be(e){return e&&(Bl().get(e)||i.onlineSongs.get(e))||null}function Si(e){if(!e)return!1;let t=i.allSongsRaw.length,n=i.allSongsRaw.filter(s=>s.id!==e);return n.length===t&&!i.onlineSongs.has(e)?!1:(i.allSongsRaw=n,i.songs=i.songs.filter(s=>s.id!==e),i.queue=i.queue.filter(s=>s!==e),i.onlineSongs.delete(e),i.currentId===e&&(i.currentId=null),$(),!0)}async function rn(){if(!x())return i.unplayableLoaded=!0,$(),[];let e=await y.unplayableList();return i.unplayableFiles=Array.isArray(e)?e:[],i.unplayableLoaded=!0,$(),i.unplayableFiles}function ua(e=null){i.unplayableOpen=e===null?!i.unplayableOpen:!!e,i.unplayableOpen&&!i.unplayableLoaded&&rn().catch(()=>{}),$()}async function pa(e){if(!e)return!1;let t=i.unplayableFiles.length;if(i.unplayableFiles=i.unplayableFiles.filter(n=>n.songId!==e),$(),!x())return i.unplayableFiles.length!==t;try{await y.unplayableRemove(e)}catch(n){return console.warn("[store] \u79FB\u9664\u300C\u653E\u4E0D\u51FA\u6765\u300D\u8BB0\u5F55\u5931\u8D25",n),await rn().catch(()=>{}),!1}return!0}async function xi(e,{rescan:t=!0}={}){if(!e)return!1;let n=await pa(e);return n&&t&&t({silent:!1}).catch(()=>{}),n}async function Ci(){let e=i.unplayableFiles.length;if(i.unplayableFiles=[],$(),!x())return e;try{await y.unplayableClear()}catch(t){return console.warn("[store] \u6E05\u7A7A\u300C\u653E\u4E0D\u51FA\u6765\u300D\u6E05\u5355\u5931\u8D25",t),await rn().catch(()=>{}),0}return e}async function Ai(){if(!x())return i.update;let e=await y.updateState();return e&&typeof e=="object"&&e_(e),i.update}function lp(){i.updateRev=(i.updateRev||0)+1}function e_(e){let t=i.update;e.check&&(t.check=e.check),typeof e.checking=="boolean"&&(t.checking=e.checking),typeof e.downloading=="boolean"&&(e.downloading||(t.progress=null)),e.channel&&(t.channel=String(e.channel)),typeof e.checkOnStart=="boolean"&&(t.checkOnStart=e.checkOnStart),typeof e.skippedVersion=="string"&&(t.skippedVersion=e.skippedVersion),e.pending?t.pending=e.pending:e.downloading||(t.pending=null),lp(),$()}async function ha({force:e=!1}={}){let t=i.update;if(t.checking)return null;if(t.checking=!0,t.error="",$(),!x())return t.checking=!1,t.check={current:i.appVersion||is,latest:i.appVersion||is,hasUpdate:!1,assetAvailable:!1,checkedAt:Date.now(),error:"\u6D4F\u89C8\u5668\u9884\u89C8\u6A21\u5F0F\u65E0\u6CD5\u8054\u7F51\u68C0\u67E5\u66F4\u65B0"},$(),t.check;try{let n=await y.updateCheck(e);n&&(t.check=n,t.error=n.error||"")}catch(n){t.error=String(n?.message??n),console.warn("[store] \u68C0\u67E5\u66F4\u65B0\u5931\u8D25",n)}finally{t.checking=!1,$()}return t.check}async function Mi(){let e=i.update;if(!x())return e.error="\u6D4F\u89C8\u5668\u9884\u89C8\u6A21\u5F0F\u65E0\u6CD5\u4E0B\u8F7D\u66F4\u65B0",$(),null;if(!e.check?.downloadUrl)return e.error="\u6CA1\u6709\u53EF\u4E0B\u8F7D\u7684\u5B89\u88C5\u5305",$(),null;e.error="",e.progress={percent:-1,done:0,total:e.check.assetSize||0,message:"\u6B63\u5728\u8FDE\u63A5\u2026",attempt:1},$();try{let t=await y.updateDownload();t?.path&&(e.pending={name:e.check.assetName,path:t.path,bytes:t.bytes,verified:t.verified,mirrorId:t.mirrorId}),e.progress=null}catch(t){e.error=String(t?.message??t),e.progress=null,console.warn("[store] \u4E0B\u8F7D\u66F4\u65B0\u5931\u8D25",t)}finally{$()}return e.pending}async function Ii(){if(!x())return!1;try{let e=await y.updateCancel();return e&&(i.update.progress=null,$()),!!e}catch(e){return console.warn("[store] \u53D6\u6D88\u4E0B\u8F7D\u5931\u8D25",e),!1}}async function Ti(){let e=i.update;if(!x())return e.error="\u6D4F\u89C8\u5668\u9884\u89C8\u6A21\u5F0F\u65E0\u6CD5\u5B89\u88C5\u66F4\u65B0",$(),!1;if(!e.pending)return e.error="\u8FD8\u6CA1\u6709\u4E0B\u8F7D\u597D\u53EF\u5B89\u88C5\u7684\u66F4\u65B0",$(),!1;e.error="",$();try{return await y.updateInstall(),!0}catch(t){return e.error=String(t?.message??t),$(),console.warn("[store] \u5B89\u88C5\u66F4\u65B0\u5931\u8D25",t),!1}}async function Ei(e){let t=i.update,n=t.channel;if(t.channel=String(e||"auto"),$(),!x())return t.channel;try{await y.updateSetChannel(t.channel)}catch(s){t.channel=n,$(),console.warn("[store] \u8BBE\u7F6E\u4E0B\u8F7D\u901A\u9053\u5931\u8D25",s)}return t.channel}async function Pi(e){let t=i.update,n=!!e;if(t.checkOnStart=n,$(),!x())return n;try{await y.updateSetCheckOnStart(n)}catch(s){t.checkOnStart=!n,$(),console.warn("[store] \u8BBE\u7F6E\u81EA\u52A8\u68C0\u67E5\u5931\u8D25",s)}return t.checkOnStart}async function Di(e=""){let t=i.update,n=String(e??"");if(t.skippedVersion=n,t.check&&!n&&(t.check={...t.check,hasUpdate:!1}),$(),!x())return n;try{await y.updateSkipVersion(n),await ha({force:!0})}catch(s){console.warn("[store] \u8DF3\u8FC7\u7248\u672C\u5931\u8D25",s)}return n}function on(){return cp}function dp(){cp+=1}function up(e){let t=i.coverSets.get(e);return t?(Array.isArray(t.items)||(t.items=[]),t):{items:[],active:0}}function pp(e){if(!e)return"";let t=up(e);return(t.items[t.active]||t.items[0])?.preview||""}function hs(e,t){if(e){if(!t||!Array.isArray(t.items)||!t.items.length)i.coverSets.delete(e);else{let n=t.items.filter(s=>s&&s.preview);i.coverSets.set(e,{items:n,active:Math.max(0,Math.min(Number(t.active)||0,n.length-1))})}dp(),$()}}function fa(e){if(!(!e||typeof e!="object")){for(let[t,n]of Object.entries(e)){if(!n||!Array.isArray(n.items))continue;let s=n.items.filter(a=>a&&a.preview);s.length&&i.coverSets.set(t,{items:s,active:Math.max(0,Math.min(Number(n.active)||0,s.length-1))})}dp(),$()}}function hp(e){return pp(e)}function Li(e,t){if(!e||!hi[e])return;let n=i.sortKey!==e;i.sortKey=e,t?i.sortDir=mi(t):n&&(i.sortDir=Fl(e)),Nl(),$()}function Oi(e){i.sortDir=mi(e),Nl(),$()}function Ri(e){!e||!hi[e]||(i.sortKey===e?i.sortDir=i.sortDir==="asc"?"desc":"asc":(i.sortKey=e,i.sortDir=Fl(e)),Nl(),$())}function qi(e){if(!e?.id)return null;let t={...i.onlineSongs.get(e.id)||{},...e,online:!0};return i.onlineSongs.set(e.id,t),t}function ot(){return Be(i.currentId)}function Mt(e,t={}){let n=Be(e);if(!n)return;let s=i.currentId===e;i.forcedNextId&&i.forcedNextId!==e&&(i.forcedNextId=""),t.queue&&t.queue.length?(i.queue=t.queue.slice(),i.queueOrigin=t.origin??null):i.queue.includes(e)||(i.queue=Xn([...i.queue,e])),t.auto||s_(e),i.currentId=e,i.position=0,i.duration=n.duration||0,i.playing=!0,s&&(i.playNonce+=1),$()}function gt(e,t=0,n=null){e.length&&(i.queue=e.slice(),i.queueOrigin=n,i.forcedNextId="",Mt(e[t],{queue:e,origin:n}))}function Ut(){if(!i.currentId){i.visibleSongs.length&&gt(i.visibleSongs.map(e=>e.id),0,Bt());return}i.playing=!i.playing,$()}function fp(e){let t=Array.from({length:e},(n,s)=>s);for(let n=e-1;n>0;n-=1){let s=Math.floor(Math.random()*(n+1));[t[n],t[s]]=[t[s],t[n]]}return t}function t_(){let e=i.queue.length;if(!e){i.shuffleOrder=[];return}i.shuffleOrder.length!==e&&(i.shuffleOrder=fp(e))}function mp(){i.shuffleOrder=fp(i.queue.length)}function fs(e=1){let{queue:t,currentId:n,playMode:s}=i;if(!t.length)return-1;let a=t.indexOf(n);if(s==="shuffle"){t_();let r=i.shuffleOrder;if(!r.length)return-1;if(t.length===1)return 0;let o=r.indexOf(a);o<0&&(o=e>0?-1:r.length);let l=o+e;if(l<0&&(l=r.length-1),l>=r.length){if(e<0||i.config.shuffleMode==="once")return-1;mp(),l=0}return r[l]}return a<0?0:(a+e+t.length)%t.length}function ft(e=!1){if(e&&i.sleepTimer?.type==="after-song"){i.sleepTimer=null,i.playing=!1,i.position=i.duration||0,$();return}if(i.playMode==="shuffle"&&i.forcedNextId){let n=i.forcedNextId;if(i.forcedNextId="",i.queue.includes(n)&&n!==i.currentId){Mt(n);return}}let t=fs(1);if(t<0){e&&(i.playing=!1,i.position=0,$());return}Mt(i.queue[t])}function ms(){let e=fs(-1);e<0||Mt(i.queue[e])}function Ni(e){i.position=Math.max(0,Math.min(e,i.duration||0)),Dn(i.position),$()}function Dn(e){let t=i.currentId;!t||i.config.resumeProgress!==!0||!Number.isFinite(e)||e<0||((!i.progress||typeof i.progress!="object")&&(i.progress={}),Object.prototype.hasOwnProperty.call(i.progress,t)&&delete i.progress[t],i.progress[t]=Math.round(e))}function n_(e){let t=Object.keys(e||{});if(t.length<=Uu)return e||{};let n={};for(let s of t.slice(t.length-Uu))n[s]=e[s];return n}function gs(e){i.volume=Math.max(0,Math.min(1,e)),i.muted=i.volume===0,i.config.volume=i.volume,i.config.muted=i.muted,$()}function Fi(){i.muted=!i.muted,$()}function Bi(){let e=Ys.indexOf(i.playMode);Ul(Ys[(e+1)%Ys.length])}function Ul(e){let t=Ys.includes(e)||e==="loop-all"?e:"sequence";t!==i.playMode&&(i.playMode=t,i.forcedNextId=""),i.config.playMode=i.playMode,i.playMode==="shuffle"&&mp(),$()}function Ui(e){il=typeof e=="function"?e:null}function Wi(e){rl=typeof e=="function"?e:null}function s_(e){if(rl)try{rl(e)}catch(t){console.warn("[store] \u7528\u6237\u70B9\u64AD\u94A9\u5B50\u629B\u51FA\u5F02\u5E38\uFF08\u5DF2\u5FFD\u7565\uFF09",t)}}function zi(e){ol=typeof e=="function"?e:null}function gp(e,t){if(!ol)return;let n=Be(e);if(n)try{ol(n,t)}catch(s){console.warn("[store] \u6536\u85CF\u94A9\u5B50\u629B\u51FA\u5F02\u5E38\uFF08\u5DF2\u5FFD\u7565\uFF09",s)}}function a_(){if(il)try{if(il())return!0}catch{}let e=document.getElementById("audio-engine");return!!(e&&e.src)}function Hi(){Wu||(Wu=setInterval(()=>{if(!(!i.playing||!i.currentId)&&!a_()){if(i.position+=250,Dn(i.position),i.position>=i.duration){if(i.sleepTimer?.type==="after-song"){ft(!0);return}if(i.playMode==="loop-one")i.position=0;else{ft(!0);return}}je()}},250))}function i_(){i.allSongsRaw=Xu.slice(),i.folders=Oy.slice(),i.filterRules=qy.slice(),i.playlists=Ry.map(s=>({...s,songIds:s.songIds.slice()})),i.likedIds=new Set(ge(He)?.songIds||[]),ht();let{kept:e,excluded:t}=En(i.allSongsRaw,i.filterRules);i.songs=e,i.lastScan={at:Date.now(),found:i.allSongsRaw.length,kept:e.length,excluded:t,added:0,removed:0};let n=new Map(i.songs.map(s=>[s.id,s]));i.queue=i.songs.slice(0,5).map(s=>s.id),i.currentId=i.songs[0]?.id??null,i.duration=n.get(i.currentId)?.duration??0,i.position=0}function r_(){try{let e=localStorage.getItem(Ju);return e?JSON.parse(e):null}catch{return null}}function vs(){c_(),!Xs&&(Xs=setTimeout(Wl,180))}function Wl(){Xs&&(clearTimeout(Xs),Xs=null),o_()}function o_(){try{let e={config:i.config,view:i.view,playlistId:i.playlistId,pvMode:i.pvMode,sortKey:i.sortKey,sortDir:i.sortDir,playMode:i.playMode,...i.config.rememberVolume!==!1?{volume:i.volume,muted:i.muted}:{},queue:i.queue,currentId:i.currentId,progress:n_(i.progress),filterRules:i.filterRules,folders:i.folders,userPlaylists:i.playlists.filter(t=>!t.builtin),liked:[...i.likedIds]};localStorage.setItem(Ju,JSON.stringify(e))}catch{}}function c_(){x()&&(es&&clearTimeout(es),es=setTimeout(Wt,400))}function zl(e){let t=e?e.aiApiKey:null;return ll=e&&e.aiApiKeySet&&typeof t=="string"&&t!==""?t:null,ll}function vp(e){let t={};for(let n of l_){if(n==="filterRules"){t.filterRules=e.filterRules||[];continue}n in e.config&&(t[n]=e.config[n])}return typeof t.aiApiKey=="string"&&t.aiApiKey!==""&&t.aiApiKey===ll&&delete t.aiApiKey,t.playMode=e.playMode,e.config.rememberVolume!==!1&&(t.volume=e.volume,t.muted=e.muted),t}async function Wt(){if(Wl(),!x())return;es&&(clearTimeout(es),es=null);let e=vp(i);try{let t=await y.setConfig(e);t&&typeof t=="object"&&(typeof t.aiBaseUrl=="string"&&(i.config.aiBaseUrl=t.aiBaseUrl),i.config.aiBaseUrlProblem=t.aiBaseUrlProblem||"",i.updateRev=(i.updateRev||0)+1,je())}catch(t){console.warn("[store] \u914D\u7F6E\u5199\u5165\u540E\u7AEF\u5931\u8D25",t)}}function d_(e){if(e){if(Object.assign(i.config,e.config||{}),zl(e.config),i.view=e.view||i.view,i.playlistId=e.playlistId??null,i.pvMode=e.pvMode||i.pvMode,i.sortKey=e.sortKey||i.sortKey,i.sortDir=e.sortDir||i.sortDir,i.playMode=e.playMode||i.playMode,i.config.rememberVolume!==!1&&(i.volume=typeof e.volume=="number"?e.volume:i.volume,i.muted=!!e.muted),e.progress&&typeof e.progress=="object"&&(i.progress=e.progress),Array.isArray(e.filterRules)&&e.filterRules.length&&(i.filterRules=e.filterRules),Array.isArray(e.folders)&&e.folders.length&&(i.folders=e.folders),Array.isArray(e.userPlaylists)){let t=i.playlists.find(n=>n.id===He);i.playlists=[t,...e.userPlaylists].filter(Boolean),ht()}if(Array.isArray(e.liked)){let t=ge(He);t&&(t.songIds=e.liked.slice()),i.likedIds=new Set(e.liked),ht()}ni={queue:Array.isArray(e.queue)?e.queue.slice():[],currentId:e.currentId||null}}}function bp(){if(!ni||!i.songs.length)return!1;let e=new Set(i.songs.map(s=>s.id)),t=ni;ni=null;let n=t.queue.filter(s=>e.has(s));if(n.length&&(i.queue=n),t.currentId&&e.has(t.currentId)?i.currentId=t.currentId:!i.currentId&&i.queue.length&&(i.currentId=i.queue[0]),i.duration=Be(i.currentId)?.duration??0,i.config.resumeProgress===!0){let s=Number(i.progress?.[i.currentId]),a=i.duration||0;Number.isFinite(s)&&s>1e3&&(!a||s<a-3e3)&&(i.pendingResumeMs=s,i.position=s)}return!0}async function yp(){if(!await Ga())return!1;let e=(l,c,d)=>c.catch(p=>(console.warn(`[store] \u542F\u52A8\u6C34\u5408\uFF1A${l} \u5931\u8D25\uFF0C\u8FD9\u4E00\u5757\u4FDD\u6301\u9ED8\u8BA4`,p),d)),[t,n,s,a,r]=await Promise.all([e("\u66F2\u5E93",y.songs(),null),e("\u6587\u4EF6\u5939",y.folders(),null),e("\u914D\u7F6E",y.getConfig(),null),e("\u6B4C\u5355",y.playlists(),null),e("\u7248\u672C\u53F7",y.appVersion(),null)]);if(r&&(i.appVersion=String(r)),Array.isArray(t)&&(i.allSongsRaw=t,i.songs=t,i.likedIds=new Set(s?.likedIds||[]),i.lastScan={at:Date.now(),found:t.length,kept:t.length,excluded:0,added:0,removed:0}),Array.isArray(n)&&(i.folders=n),s&&(Object.assign(i.config,s),zl(s),i.playMode=s.playMode||i.playMode,i.config.rememberVolume!==!1&&(i.volume=typeof s.volume=="number"?s.volume:i.volume,i.muted=!!s.muted),Array.isArray(s.filterRules)&&s.filterRules.length&&(i.filterRules=s.filterRules)),Array.isArray(a)&&a.length){i.playlists=a.map(c=>({id:c.id,name:c.name,locked:!!c.locked,builtin:!!c.builtin,songIds:Array.isArray(c.songIds)?c.songIds.slice():[],createdAt:c.createdAt??0}));let l=i.playlists.find(c=>c.id===He);l&&(i.likedIds=new Set(l.songIds)),ht()}rn().catch(()=>{});let o=new Set(i.songs.map(l=>l.id));return i.queue=i.queue.filter(l=>o.has(l)),bp(),i.queue.length===0&&i.songs.length&&(i.queue=i.songs.slice(0,5).map(l=>l.id)),i.currentId&&!o.has(i.currentId)&&(i.currentId=i.queue[0]??null),!i.currentId&&i.queue.length&&(i.currentId=i.queue[0]),i.duration=Be(i.currentId)?.duration??0,$(),!0}async function ji(){x()||i_();let e=r_();d_(e),i.view==="playlist"&&!ge(i.playlistId)&&(i.view="library",i.playlistId=null),$(),await yp(),bp()&&$()}async function ma({silent:e=!1}={}){if(i.scanning)return null;e||(i.scanning=!0),$();try{return await u_({silent:e})}finally{i.scanning=!1,$()}}async function u_({silent:e}){let t=null;if(x())if((await y.scan(i.folders.map(c=>c.id)))?.started){let c=await p_();Array.isArray(c)&&(t=c)}else t=await y.songs();if(!t){if(x())return i.lastScan;await new Promise(c=>setTimeout(c,e?400:1500)),t=Xu.slice()}let n=new Set(i.songs.map(c=>c.id));i.allSongsRaw=t;let{kept:s,excluded:a}=En(t,i.filterRules);i.songs=s;let r=new Set(s.map(c=>c.id)),o=s.filter(c=>!n.has(c.id)),l=[...n].filter(c=>!r.has(c));return i.lastScan={at:Date.now(),found:t.length,kept:s.length,excluded:a,added:o.length,removed:l.length},$(),i.lastScan}function p_(){return new Promise(e=>{let t=()=>{},n=setTimeout(()=>{t(),y.songs().then(e)},6e5);t=ie("scan:done",async()=>{clearTimeout(n),t();let s=i.allSongsRaw;if(!await _p(()=>i.allSongsRaw!==s,{waitMs:2e3,stepMs:10})){let a=await y.songs().catch(()=>null);e(Array.isArray(a)?a:null);return}e(Array.isArray(i.allSongsRaw)?i.allSongsRaw:null)})})}async function _p(e,{waitMs:t=1e3,stepMs:n=10}={}){let s=Date.now()+t;for(;;){if(e())return!0;if(Date.now()>=s)return!1;await new Promise(a=>setTimeout(a,n))}}function g(e,t=""){return u`<svg class=${t||A} aria-hidden="true"><use href="#i-${e}"></use></svg>`}function f_(e,t){if(e===t)return!0;if(!e||!t||e.length!==t.length)return!1;for(let n=0;n<e.length;n+=1)if(e[n]!==t[n])return!1;return!0}function Ve(){for(let e of cl)e.revalidate()}function Se(e,t){customElements.get(e)||customElements.define(e,t)}var Za,dl,zu,ku,uy,py,hy,Su,fy,my,gy,vy,by,yy,en,xu,_y,wy,Vs,Yo,Hu,Cu,Jn,Ks,Au,si,Mu,ju,Zt,Vu,$y,In,Js,Qs,ul,ky,Ho,js,Iu,Tu,$n,Eu,Pu,Ku,Sy,u,Je,A,Du,xn,xy,Zs,Xo,ns,ss,Jo,Qo,Zo,el,pl,Cy,as,Gs,tn,Ay,Lu,Nt,ai,ri,Ey,Py,Dy,kn,jo,nl,Sn,Vo,Qn,Oy,Xu,Ry,qy,vl,bl,oi,yl,_l,wl,is,$l,kl,Ko,Sl,xl,Ny,Fy,Cl,Al,Ml,Il,li,Tl,El,Pl,ci,na,ea,Ju,Ys,Qu,i,sl,Uy,Zn,An,Ou,Ru,rs,Mn,ii,Rl,Qa,hi,aa,ei,qu,al,ap,Nu,Fu,ti,Bu,He,op,cp,Uu,Wu,il,rl,ol,Xs,l_,es,ll,ni,h_,cl,qe,Vi=ae(()=>{Hs();Za=globalThis,dl=Za.ShadowRoot&&(Za.ShadyCSS===void 0||Za.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,zu=Symbol(),ku=new WeakMap,uy=class{constructor(e,t,n){if(this._$cssResult$=!0,n!==zu)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o,t=this.t;if(dl&&e===void 0){let n=t!==void 0&&t.length===1;n&&(e=ku.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),n&&ku.set(t,e))}return e}toString(){return this.cssText}},py=e=>new uy(typeof e=="string"?e:e+"",void 0,zu),hy=(e,t)=>{if(dl)e.adoptedStyleSheets=t.map(n=>n instanceof CSSStyleSheet?n:n.styleSheet);else for(let n of t){let s=document.createElement("style"),a=Za.litNonce;a!==void 0&&s.setAttribute("nonce",a),s.textContent=n.cssText,e.appendChild(s)}},Su=dl?e=>e:e=>e instanceof CSSStyleSheet?(t=>{let n="";for(let s of t.cssRules)n+=s.cssText;return py(n)})(e):e,{is:fy,defineProperty:my,getOwnPropertyDescriptor:gy,getOwnPropertyNames:vy,getOwnPropertySymbols:by,getPrototypeOf:yy}=Object,en=globalThis,xu=en.trustedTypes,_y=xu?xu.emptyScript:"",wy=en.reactiveElementPolyfillSupport,Vs=(e,t)=>e,Yo={toAttribute(e,t){switch(t){case Boolean:e=e?_y:null;break;case Object:case Array:e=e==null?e:JSON.stringify(e)}return e},fromAttribute(e,t){let n=e;switch(t){case Boolean:n=e!==null;break;case Number:n=e===null?null:Number(e);break;case Object:case Array:try{n=JSON.parse(e)}catch{n=null}}return n}},Hu=(e,t)=>!fy(e,t),Cu={attribute:!0,type:String,converter:Yo,reflect:!1,useDefault:!1,hasChanged:Hu};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),en.litPropertyMetadata??(en.litPropertyMetadata=new WeakMap);Jn=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??(this.l=[])).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=Cu){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){let n=Symbol(),s=this.getPropertyDescriptor(e,n,t);s!==void 0&&my(this.prototype,e,s)}}static getPropertyDescriptor(e,t,n){let{get:s,set:a}=gy(this.prototype,e)??{get(){return this[t]},set(r){this[t]=r}};return{get:s,set(r){let o=s?.call(this);a?.call(this,r),this.requestUpdate(e,o,n)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??Cu}static _$Ei(){if(this.hasOwnProperty(Vs("elementProperties")))return;let e=yy(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(Vs("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(Vs("properties"))){let t=this.properties,n=[...vy(t),...by(t)];for(let s of n)this.createProperty(s,t[s])}let e=this[Symbol.metadata];if(e!==null){let t=litPropertyMetadata.get(e);if(t!==void 0)for(let[n,s]of t)this.elementProperties.set(n,s)}this._$Eh=new Map;for(let[t,n]of this.elementProperties){let s=this._$Eu(t,n);s!==void 0&&this._$Eh.set(s,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){let t=[];if(Array.isArray(e)){let n=new Set(e.flat(1/0).reverse());for(let s of n)t.unshift(Su(s))}else e!==void 0&&t.push(Su(e));return t}static _$Eu(e,t){let n=t.attribute;return n===!1?void 0:typeof n=="string"?n:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??(this._$EO=new Set)).add(e),this.renderRoot!==void 0&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){let e=new Map,t=this.constructor.elementProperties;for(let n of t.keys())this.hasOwnProperty(n)&&(e.set(n,this[n]),delete this[n]);e.size>0&&(this._$Ep=e)}createRenderRoot(){let e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return hy(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,n){this._$AK(e,n)}_$ET(e,t){let n=this.constructor.elementProperties.get(e),s=this.constructor._$Eu(e,n);if(s!==void 0&&n.reflect===!0){let a=(n.converter?.toAttribute!==void 0?n.converter:Yo).toAttribute(t,n.type);this._$Em=e,a==null?this.removeAttribute(s):this.setAttribute(s,a),this._$Em=null}}_$AK(e,t){let n=this.constructor,s=n._$Eh.get(e);if(s!==void 0&&this._$Em!==s){let a=n.getPropertyOptions(s),r=typeof a.converter=="function"?{fromAttribute:a.converter}:a.converter?.fromAttribute!==void 0?a.converter:Yo;this._$Em=s;let o=r.fromAttribute(t,a.type);this[s]=o??this._$Ej?.get(s)??o,this._$Em=null}}requestUpdate(e,t,n,s=!1,a){if(e!==void 0){let r=this.constructor;if(s===!1&&(a=this[e]),n??(n=r.getPropertyOptions(e)),!((n.hasChanged??Hu)(a,t)||n.useDefault&&n.reflect&&a===this._$Ej?.get(e)&&!this.hasAttribute(r._$Eu(e,n))))return;this.C(e,t,n)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(e,t,{useDefault:n,reflect:s,wrapped:a},r){n&&!(this._$Ej??(this._$Ej=new Map)).has(e)&&(this._$Ej.set(e,r??t??this[e]),a!==!0||r!==void 0)||(this._$AL.has(e)||(this.hasUpdated||n||(t=void 0),this._$AL.set(e,t)),s===!0&&this._$Em!==e&&(this._$Eq??(this._$Eq=new Set)).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}let e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(let[s,a]of this._$Ep)this[s]=a;this._$Ep=void 0}let n=this.constructor.elementProperties;if(n.size>0)for(let[s,a]of n){let{wrapped:r}=a,o=this[s];r!==!0||this._$AL.has(s)||o===void 0||this.C(s,void 0,a,o)}}let e=!1,t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(n=>n.hostUpdate?.()),this.update(t)):this._$EM()}catch(n){throw e=!1,this._$EM(),n}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&(this._$Eq=this._$Eq.forEach(t=>this._$ET(t,this[t]))),this._$EM()}updated(e){}firstUpdated(e){}};Jn.elementStyles=[],Jn.shadowRootOptions={mode:"open"},Jn[Vs("elementProperties")]=new Map,Jn[Vs("finalized")]=new Map,wy?.({ReactiveElement:Jn}),(en.reactiveElementVersions??(en.reactiveElementVersions=[])).push("2.1.2");Ks=globalThis,Au=e=>e,si=Ks.trustedTypes,Mu=si?si.createPolicy("lit-html",{createHTML:e=>e}):void 0,ju="$lit$",Zt=`lit$${Math.random().toFixed(9).slice(2)}$`,Vu="?"+Zt,$y=`<${Vu}>`,In=document,Js=()=>In.createComment(""),Qs=e=>e===null||typeof e!="object"&&typeof e!="function",ul=Array.isArray,ky=e=>ul(e)||typeof e?.[Symbol.iterator]=="function",Ho=`[ 	
\f\r]`,js=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Iu=/-->/g,Tu=/>/g,$n=RegExp(`>|${Ho}(?:([^\\s"'>=/]+)(${Ho}*=${Ho}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Eu=/'/g,Pu=/"/g,Ku=/^(?:script|style|textarea|title)$/i,Sy=e=>(t,...n)=>({_$litType$:e,strings:t,values:n}),u=Sy(1),Je=Symbol.for("lit-noChange"),A=Symbol.for("lit-nothing"),Du=new WeakMap,xn=In.createTreeWalker(In,129);xy=(e,t)=>{let n=e.length-1,s=[],a,r=t===2?"<svg>":t===3?"<math>":"",o=js;for(let l=0;l<n;l++){let c=e[l],d,p,h=-1,v=0;for(;v<c.length&&(o.lastIndex=v,p=o.exec(c),p!==null);)v=o.lastIndex,o===js?p[1]==="!--"?o=Iu:p[1]!==void 0?o=Tu:p[2]!==void 0?(Ku.test(p[2])&&(a=RegExp("</"+p[2],"g")),o=$n):p[3]!==void 0&&(o=$n):o===$n?p[0]===">"?(o=a??js,h=-1):p[1]===void 0?h=-2:(h=o.lastIndex-p[2].length,d=p[1],o=p[3]===void 0?$n:p[3]==='"'?Pu:Eu):o===Pu||o===Eu?o=$n:o===Iu||o===Tu?o=js:(o=$n,a=void 0);let w=o===$n&&e[l+1].startsWith("/>")?" ":"";r+=o===js?c+$y:h>=0?(s.push(d),c.slice(0,h)+ju+c.slice(h)+Zt+w):c+Zt+(h===-2?l:w)}return[Gu(e,r+(e[n]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),s]},Zs=class e{constructor({strings:t,_$litType$:n},s){let a;this.parts=[];let r=0,o=0,l=t.length-1,c=this.parts,[d,p]=xy(t,n);if(this.el=e.createElement(d,s),xn.currentNode=this.el.content,n===2||n===3){let h=this.el.content.firstChild;h.replaceWith(...h.childNodes)}for(;(a=xn.nextNode())!==null&&c.length<l;){if(a.nodeType===1){if(a.hasAttributes())for(let h of a.getAttributeNames())if(h.endsWith(ju)){let v=p[o++],w=a.getAttribute(h).split(Zt),k=/([.?@])?(.*)/.exec(v);c.push({type:1,index:r,name:k[2],strings:w,ctor:k[1]==="."?Jo:k[1]==="?"?Qo:k[1]==="@"?Zo:ss}),a.removeAttribute(h)}else h.startsWith(Zt)&&(c.push({type:6,index:r}),a.removeAttribute(h));if(Ku.test(a.tagName)){let h=a.textContent.split(Zt),v=h.length-1;if(v>0){a.textContent=si?si.emptyScript:"";for(let w=0;w<v;w++)a.append(h[w],Js()),xn.nextNode(),c.push({type:2,index:++r});a.append(h[v],Js())}}}else if(a.nodeType===8)if(a.data===Vu)c.push({type:2,index:r});else{let h=-1;for(;(h=a.data.indexOf(Zt,h+1))!==-1;)c.push({type:7,index:r}),h+=Zt.length-1}r++}}static createElement(t,n){let s=In.createElement("template");return s.innerHTML=t,s}};Xo=class{constructor(t,n){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=n}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){let{el:{content:n},parts:s}=this._$AD,a=(t?.creationScope??In).importNode(n,!0);xn.currentNode=a;let r=xn.nextNode(),o=0,l=0,c=s[0];for(;c!==void 0;){if(o===c.index){let d;c.type===2?d=new ns(r,r.nextSibling,this,t):c.type===1?d=new c.ctor(r,c.name,c.strings,this,t):c.type===6&&(d=new el(r,this,t)),this._$AV.push(d),c=s[++l]}o!==c?.index&&(r=xn.nextNode(),o++)}return xn.currentNode=In,a}p(t){let n=0;for(let s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,n),n+=s.strings.length-2):s._$AI(t[n])),n++}},ns=class e{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,n,s,a){this.type=2,this._$AH=A,this._$AN=void 0,this._$AA=t,this._$AB=n,this._$AM=s,this.options=a,this._$Cv=a?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode,n=this._$AM;return n!==void 0&&t?.nodeType===11&&(t=n.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,n=this){t=ts(this,t,n),Qs(t)?t===A||t==null||t===""?(this._$AH!==A&&this._$AR(),this._$AH=A):t!==this._$AH&&t!==Je&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):ky(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==A&&Qs(this._$AH)?this._$AA.nextSibling.data=t:this.T(In.createTextNode(t)),this._$AH=t}$(t){let{values:n,_$litType$:s}=t,a=typeof s=="number"?this._$AC(t):(s.el===void 0&&(s.el=Zs.createElement(Gu(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===a)this._$AH.p(n);else{let r=new Xo(a,this),o=r.u(this.options);r.p(n),this.T(o),this._$AH=r}}_$AC(t){let n=Du.get(t.strings);return n===void 0&&Du.set(t.strings,n=new Zs(t)),n}k(t){ul(this._$AH)||(this._$AH=[],this._$AR());let n=this._$AH,s,a=0;for(let r of t)a===n.length?n.push(s=new e(this.O(Js()),this.O(Js()),this,this.options)):s=n[a],s._$AI(r),a++;a<n.length&&(this._$AR(s&&s._$AB.nextSibling,a),n.length=a)}_$AR(t=this._$AA.nextSibling,n){for(this._$AP?.(!1,!0,n);t!==this._$AB;){let s=Au(t).nextSibling;Au(t).remove(),t=s}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}},ss=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,n,s,a,r){this.type=1,this._$AH=A,this._$AN=void 0,this.element=t,this.name=n,this._$AM=a,this.options=r,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=A}_$AI(t,n=this,s,a){let r=this.strings,o=!1;if(r===void 0)t=ts(this,t,n,0),o=!Qs(t)||t!==this._$AH&&t!==Je,o&&(this._$AH=t);else{let l=t,c,d;for(t=r[0],c=0;c<r.length-1;c++)d=ts(this,l[s+c],n,c),d===Je&&(d=this._$AH[c]),o||(o=!Qs(d)||d!==this._$AH[c]),d===A?t=A:t!==A&&(t+=(d??"")+r[c+1]),this._$AH[c]=d}o&&!a&&this.j(t)}j(t){t===A?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},Jo=class extends ss{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===A?void 0:t}},Qo=class extends ss{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==A)}},Zo=class extends ss{constructor(t,n,s,a,r){super(t,n,s,a,r),this.type=5}_$AI(t,n=this){if((t=ts(this,t,n,0)??A)===Je)return;let s=this._$AH,a=t===A&&s!==A||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,r=t!==A&&(s===A||a);a&&this.element.removeEventListener(this.name,this,s),r&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},el=class{constructor(t,n,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=n,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){ts(this,t)}},pl={I:ns},Cy=Ks.litHtmlPolyfillSupport;Cy?.(Zs,ns),(Ks.litHtmlVersions??(Ks.litHtmlVersions=[])).push("3.3.3");as=(e,t,n)=>{let s=n?.renderBefore??t,a=s._$litPart$;if(a===void 0){let r=n?.renderBefore??null;s._$litPart$=a=new ns(t.insertBefore(Js(),r),r,void 0,n??{})}return a._$AI(e),a},Gs=globalThis,tn=class extends Jn{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var n;let t=super.createRenderRoot();return(n=this.renderOptions).renderBefore??(n.renderBefore=t.firstChild),t}update(t){let n=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=as(n,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return Je}};tn._$litElement$=!0,tn.finalized=!0,Gs.litElementHydrateSupport?.({LitElement:tn});Ay=Gs.litElementPolyfillSupport;Ay?.({LitElement:tn});(Gs.litElementVersions??(Gs.litElementVersions=[])).push("4.2.2");Lu="runtime-tokens",Nt=new Map;ai={fast:250,medium:500,slow:750};ri=(e,t=document)=>t.querySelector(e);Ey=()=>fl("menu","menu",{hidden:"",role:"menu"}),Py=()=>fl("modal-backdrop","modal-backdrop",{hidden:""}),Dy=()=>fl("toasts","toasts",{"aria-live":"polite"}),kn=null,jo=0,nl=null;Sn=null,Vo=0;Qn=[];Oy=[],Xu=[],Ry=[],qy=[],vl="",bl="",oi="\u672C\u5730\u97F3\u4E50\u64AD\u653E\u5668",yl="localMusicPlayer",_l="LMPlayer",wl="\u672C\u5730\u66F2\u5E93 + \u5728\u7EBF\u8BD5\u542C\u7684\u684C\u9762\u97F3\u4E50\u64AD\u653E\u5668",is="1.0.3",$l="Apache-2.0",kl="Copyright 2026 The localMusicPlayer Authors",Ko="https://github.com/nihaozyj7/localMusicPlayer",Sl=[{id:"home",label:"\u9879\u76EE\u4E3B\u9875",icon:"external",url:Ko},{id:"issues",label:"\u95EE\u9898\u53CD\u9988",icon:"external",url:`${Ko}/issues`},{id:"releases",label:"\u66F4\u65B0\u65E5\u5FD7",icon:"external",url:`${Ko}/releases`},{id:"license",label:"Apache-2.0 \u534F\u8BAE\u5168\u6587",icon:"scale",url:"https://www.apache.org/licenses/LICENSE-2.0"}],xl=[{name:"Go",version:"1.25",role:"\u540E\u7AEF\uFF1A\u76EE\u5F55\u626B\u63CF\u3001\u6807\u7B7E\u89E3\u6790\u3001\u97F3\u9891 HTTP \u670D\u52A1\u3001\u54CD\u5EA6\u6D4B\u91CF\u3001\u5728\u7EBF\u63A5\u53E3\u805A\u5408",url:"https://go.dev/"},{name:"Wails",version:"v3\uFF08beta.14\uFF09",role:"\u684C\u9762\u5916\u58F3\uFF1AGo \u2194 WebView \u6865\u3001\u65E0\u8FB9\u6846\u7A97\u53E3\u3001\u6258\u76D8\u3001\u5355\u5B9E\u4F8B\u3001\u7CFB\u7EDF\u6587\u4EF6\u5BF9\u8BDD\u6846",url:"https://v3.wails.io/"},{name:"WebView2",version:"\u7CFB\u7EDF\u81EA\u5E26",role:"\u754C\u9762\u6E32\u67D3\u5F15\u64CE\uFF08Windows\uFF09\uFF1B\u5E94\u7528\u4E0D\u5185\u5D4C\u6D4F\u89C8\u5668\u5185\u6838\uFF0C\u56E0\u6B64\u5B89\u88C5\u5305\u5F88\u5C0F",url:"https://developer.microsoft.com/microsoft-edge/webview2/"},{name:"Lit",version:"3",role:"\u524D\u7AEF\u89C6\u56FE\u5C42\uFF1A\u8BBE\u7F6E\u3001\u66F2\u76EE\u8868\u3001\u5404\u5F39\u5C42\u90FD\u662F\u589E\u91CF\u66F4\u65B0\u7684\u81EA\u5B9A\u4E49\u5143\u7D20",url:"https://lit.dev/"},{name:"\u539F\u751F ES Module + Vite",version:"7",role:"\u754C\u9762\u4EE3\u7801\u672C\u8EAB\u662F\u53EF\u76F4\u63A5\u9605\u8BFB\u7684 JS\uFF0CVite \u53EA\u505A\u4F9D\u8D56\u89E3\u6790\u4E0E\u4EA7\u7269\u6253\u5305",url:"https://vite.dev/"},{name:"npm workspaces",version:"\u2014",role:"\u5355\u4ED3\u591A\u5305\uFF1A\u5E94\u7528\u58F3 + \u64AD\u653E\u754C\u9762\u6837\u5F0F\u5305\uFF08frontend/packages/player-skins\uFF09",url:"https://docs.npmjs.com/cli/using-npm/workspaces"},{name:"ffmpeg",version:"8.1.2\uFF08\u81EA\u884C\u7F16\u8BD1\u7684\u7CBE\u7B80\u7248\uFF09",role:"\u89E3\u7801 WebView \u653E\u4E0D\u4E86\u7684\u683C\u5F0F\u3001\u8F6C\u7801\u4E3A PCM/WAV\u3001loudnorm \u54CD\u5EA6\u6D4B\u91CF",url:"https://ffmpeg.org/"},{name:"ESLint / Prettier / TypeScript",version:"9 / 3 / 5",role:"\u4EE3\u7801\u68C0\u67E5\u4E0E\u7C7B\u578B\u68C0\u67E5\uFF08JSDoc + checkJs\uFF0C\u9010\u4E2A\u6587\u4EF6\u6536\u7D27\uFF09",url:"https://eslint.org/"}],Ny=[{name:"Wails",version:"v3.0.0-beta.14",license:"MIT",role:"\u684C\u9762\u5916\u58F3\u4E0E Go\u2194JS \u6865",url:"https://github.com/wailsapp/wails"},{name:"dhowden/tag",version:"2024-04-17",license:"BSD-2-Clause",role:"mp3 / m4a / flac / ogg \u6807\u7B7E\u89E3\u6790",url:"https://github.com/dhowden/tag"},{name:"fsnotify/fsnotify",version:"1.9.0",license:"BSD-3-Clause",role:"\u97F3\u4E50\u6587\u4EF6\u5939\u7684\u5B9E\u65F6\u76D1\u542C",url:"https://github.com/fsnotify/fsnotify"},{name:"Lit",version:"3.3.3",license:"BSD-3-Clause",role:"\u524D\u7AEF\u89C6\u56FE\u5C42",url:"https://github.com/lit/lit"},{name:"SortableJS",version:"1.15.7",license:"MIT",role:"\u64AD\u653E\u961F\u5217\u4E0E\u6B4C\u5355\u7684\u62D6\u62FD\u6392\u5E8F",url:"https://github.com/SortableJS/Sortable"}],Fy=[{name:"coder/websocket",version:"1.8.14",license:"ISC",role:"Wails \u7684 WebSocket \u4F20\u8F93",url:"https://github.com/coder/websocket"},{name:"go-ole/go-ole",version:"1.3.0",license:"MIT",role:"Windows COM \u7ED1\u5B9A",url:"https://github.com/go-ole/go-ole"},{name:"godbus/dbus/v5",version:"5.2.2",license:"BSD-2-Clause",role:"Linux \u684C\u9762\u96C6\u6210",url:"https://github.com/godbus/dbus"},{name:"jchv/go-winloader",version:"2025-04-06",license:"ISC",role:"Windows \u4F9D\u8D56\u52A0\u8F7D",url:"https://github.com/jchv/go-winloader"},{name:"adrg/xdg",version:"0.5.3",license:"MIT",role:"\u8DE8\u5E73\u53F0\u6807\u51C6\u76EE\u5F55",url:"https://github.com/adrg/xdg"},{name:"mattn/go-colorable",version:"0.1.14",license:"MIT",role:"Windows \u63A7\u5236\u53F0\u5F69\u8272\u8F93\u51FA",url:"https://github.com/mattn/go-colorable"},{name:"mattn/go-isatty",version:"0.0.20",license:"MIT",role:"\u5224\u65AD stdout \u662F\u5426\u4E3A\u7EC8\u7AEF",url:"https://github.com/mattn/go-isatty"},{name:"golang.org/x/sys",version:"0.46.0",license:"BSD-3-Clause",role:"Go \u5B98\u65B9\u7CFB\u7EDF\u8C03\u7528\u6269\u5C55",url:"https://pkg.go.dev/golang.org/x/sys"}],Cl=[{name:"FFmpeg",version:"8.1.2",license:"LGPL-2.1-or-later",role:"\u7531\u672C\u9879\u76EE\u7528 build/ffmpeg/build-minimal.sh \u4ECE\u5B98\u65B9\u6E90\u7801\u81EA\u884C\u7F16\u8BD1\u7684\u7CBE\u7B80\u7248\uFF08\u7EA6 5.6MB\uFF09\uFF0C\u53EA\u4FDD\u7559\u97F3\u9891\u89E3\u7801 / \u8F6C\u7801 / loudnorm\uFF0C\u672A\u542F\u7528 GPL \u7EC4\u4EF6",url:"https://ffmpeg.org/legal.html"}],Al=[{label:"\u672C\u9879\u76EE",value:"Apache License 2.0",tone:"ok",desc:"\u53EF\u81EA\u7531\u4F7F\u7528\u3001\u4FEE\u6539\u3001\u5206\u53D1\uFF08\u542B\u5546\u7528\uFF09\uFF0C\u9700\u4FDD\u7559\u7248\u6743\u4E0E\u8BB8\u53EF\u58F0\u660E\uFF0C\u5E76\u9644\u5E26\u53D8\u66F4\u8BF4\u660E\u3002\u4ED3\u5E93\u6839\u76EE\u5F55\u7684 LICENSE \u662F\u5B8C\u6574\u534F\u8BAE\u6587\u672C\u3002"},{label:"\u5185\u5D4C FFmpeg",value:"LGPL-2.1-or-later",tone:"note",desc:"\u4EE5\u72EC\u7ACB\u53EF\u6267\u884C\u6587\u4EF6\u5F62\u5F0F\u968F\u5E94\u7528\u89E3\u5305\u5230\u6570\u636E\u76EE\u5F55\uFF0C\u7528\u6237\u53EF\u4EE5\u76F4\u63A5\u66FF\u6362\uFF1B\u672C\u5E94\u7528\u672A\u4FEE\u6539 FFmpeg \u6E90\u7801\u3002\u8BE6\u89C1 internal/ffmpeg/bin/FFMPEG-LICENSE.txt\u3002"},{label:"\u7B2C\u4E09\u65B9\u5E93",value:"MIT / BSD / ISC",tone:"note",desc:"\u5747\u4E3A\u5BBD\u677E\u8BB8\u53EF\u8BC1\uFF0C\u5141\u8BB8\u5728 Apache-2.0 \u9879\u76EE\u4E2D\u4F7F\u7528\uFF1B\u5B8C\u6574\u6E05\u5355\u4E0E\u7248\u672C\u89C1\u4E0B\u65B9\u8868\u683C\u3002"}],Ml=[{name:"LRCLIB",role:"\u6B4C\u8BCD\uFF08\u65E0\u9700\u9274\u6743\u7684\u5F00\u653E\u6B4C\u8BCD\u5E93\uFF09",url:"https://lrclib.net/"},{name:"\u7F51\u6613\u4E91\u97F3\u4E50",role:"\u6B4C\u8BCD / \u5C01\u9762\u5907\u9009\u6765\u6E90",url:"https://music.163.com/"},{name:"QQ \u97F3\u4E50",role:"\u6B4C\u8BCD\uFF08\u9010\u5B57 / \u9010\u884C\uFF09/ \u5C01\u9762\u5907\u9009\u6765\u6E90",url:"https://y.qq.com/"},{name:"\u9177\u72D7\u97F3\u4E50",role:"\u6B4C\u8BCD\uFF08\u9010\u5B57 / \u9010\u884C\uFF09\u6765\u6E90",url:"https://www.kugou.com/"},{name:"iTunes Search API",role:"\u5C01\u9762\uFF08Apple \u5B98\u65B9\u516C\u5F00\u63A5\u53E3\uFF09",url:"https://performance-partners.apple.com/search-api"},{name:"Deezer",role:"\u5C01\u9762\u5907\u9009\u6765\u6E90",url:"https://developers.deezer.com/api"},{name:"MusicBrainz",role:"\u5C01\u9762\uFF08\u914D\u5408 Cover Art Archive\uFF09",url:"https://musicbrainz.org/"},{name:"\u54D4\u54E9\u54D4\u54E9",role:"\u5728\u7EBF\u8BD5\u542C\u4E0E\u4E0B\u8F7D\uFF08\u516C\u5F00 Web \u63A5\u53E3\uFF09",url:"https://www.bilibili.com/"}],Il=[{title:"\u5F00\u6E90\u793E\u533A",body:"Go\u3001Wails\u3001Lit\u3001Vite\u3001FFmpeg \u4EE5\u53CA\u4E0A\u9762\u5217\u51FA\u7684\u6BCF\u4E00\u4E2A\u5E93 \u2014\u2014 \u6CA1\u6709\u5B83\u4EEC\uFF0C\u8FD9\u4E2A\u64AD\u653E\u5668\u4E0D\u4F1A\u5B58\u5728\u3002"},{title:"FFmpeg \u9879\u76EE",body:"\u8BA9\u300C\u653E\u4E0D\u51FA\u6765\u7684\u683C\u5F0F\u300D\u6709\u4E86\u7EDF\u4E00\u7684\u89E3\u6CD5\uFF1BEBU R128 \u54CD\u5EA6\u6D4B\u91CF\u4E5F\u5EFA\u7ACB\u5728\u5B83\u7684 loudnorm \u6EE4\u955C\u4E4B\u4E0A\u3002"},{title:"\u6570\u636E\u670D\u52A1\u63D0\u4F9B\u65B9",body:"LRCLIB\u3001\u7F51\u6613\u4E91\u97F3\u4E50\u3001QQ \u97F3\u4E50\u3001\u9177\u72D7\u97F3\u4E50\u3001Apple\u3001Deezer\u3001MusicBrainz\u3001\u54D4\u54E9\u54D4\u54E9 \u63D0\u4F9B\u4E86\u6B4C\u8BCD\u4E0E\u5C01\u9762\u7B49\u516C\u5F00\u6570\u636E\u3002\u672C\u9879\u76EE\u7684\u8C03\u7528\u5747\u6765\u81EA\u5B98\u65B9\u6216\u516C\u5F00\u63A5\u53E3\uFF0C\u7248\u6743\u5F52\u5404\u81EA\u6743\u5229\u4EBA\u6240\u6709\u3002"},{title:"\u6BCF\u4E00\u4F4D\u53CD\u9988\u8005",body:"\u754C\u9762\u7EC6\u8282\u3001\u683C\u5F0F\u517C\u5BB9\u6027\u3001\u6027\u80FD\u95EE\u9898\u7684\u6BCF\u4E00\u6761\u53CD\u9988\u90FD\u76F4\u63A5\u53D8\u6210\u4E86\u4EE3\u7801\u91CC\u7684\u4FEE\u590D\u3002"}],li=["\u8BD5\u542C\u4E0E\u4E0B\u8F7D\u4F1A\u5728\u672C\u673A\u5F62\u6210\u97F3\u9891\u526F\u672C\uFF0C\u5185\u5BB9\u7248\u6743\u5F52\u539F\u4F5C\u8005\u4E0E\u6743\u5229\u4EBA\u6240\u6709\uFF1A\u8BF7\u4EC5\u7528\u4E8E\u4E2A\u4EBA\u5B66\u4E60\u4E0E\u6B23\u8D4F\uFF0C\u4E0D\u8981\u4F20\u64AD\u3001\u4E8C\u6B21\u5206\u53D1\u6216\u5546\u7528\u3002","\u81EA\u52A8\u5339\u914D\u7684\u5C01\u9762\u4E0E\u6B4C\u8BCD\u540C\u5C5E\u53D7\u7248\u6743\u4FDD\u62A4\u7684\u4F5C\u54C1\uFF0C\u4E0D\u4FDD\u8BC1\u4E0E\u6B4C\u66F2\u5B8C\u5168\u5BF9\u5E94\uFF0C\u8BF7\u81EA\u884C\u6838\u5BF9\u540E\u518D\u5199\u56DE\u6587\u4EF6\u3002"],Tl=["\u672C\u8F6F\u4EF6\u53EA\u505A\u672C\u5730\u97F3\u4E50\u7684\u6574\u7406\u4E0E\u64AD\u653E\uFF0C\u4E0D\u63D0\u4F9B\u3001\u4E0D\u5B58\u50A8\u3001\u4E0D\u5206\u53D1\u4EFB\u4F55\u97F3\u4E50\u5185\u5BB9\u3002","\u5728\u7EBF\u641C\u7D22 / \u8BD5\u542C / \u4E0B\u8F7D\u4F9D\u8D56\u7B2C\u4E09\u65B9\u516C\u5F00\u63A5\u53E3\uFF0C\u5176\u53EF\u7528\u6027\u4E0E\u5185\u5BB9\u5747\u7531\u5BF9\u5E94\u5E73\u53F0\u51B3\u5B9A\u3002",...li,"\u9010\u5B57\u6B4C\u8BCD\uFF08QQ \u97F3\u4E50 QRC / \u9177\u72D7 KRC\uFF09\u662F\u5BF9\u7B2C\u4E09\u65B9\u79C1\u6709\u7F16\u7801\u7684\u517C\u5BB9\u6027\u89E3\u6790\uFF0C\u53EA\u7528\u4E8E\u5728\u672C\u673A\u663E\u793A\u9010\u5B57\u65F6\u95F4\u8F74\uFF1B\u4E0D\u5E0C\u671B\u4F7F\u7528\u65F6\u53EF\u5728\u300C\u4E0B\u8F7D\u4E0E\u7F13\u5B58\u300D\u91CC\u5173\u6389\u3002"],El=[{what:"\u5728\u7EBF\u641C\u7D22 / \u8BD5\u542C / \u4E0B\u8F7D",where:"api.bilibili.com\u3001*.bilivideo.com",when:"\u53EA\u5728\u4F60\u4E3B\u52A8\u641C\u7D22\u3001\u70B9\u300C\u8BD5\u542C\u300D\u6216\u70B9\u300C\u4E0B\u8F7D\u300D\u65F6",off:"\u4E0D\u4F7F\u7528\u8FD9\u4E9B\u6309\u94AE\u5C31\u4E0D\u4F1A\u8054\u7F51"},{what:"\u6B4C\u8BCD\u5339\u914D\u4E0E\u5728\u7EBF\u6B4C\u8BCD\u641C\u7D22",where:"lrclib.net\u3001music.163.com\u3001u.y.qq.com / c.y.qq.com\u3001songsearch.kugou.com / krcs.kugou.com / lyrics.kugou.com",when:"\u81EA\u52A8\u5339\u914D\u53D1\u751F\u5728\u5207\u6B4C\u65F6\uFF08\u672C\u673A\u6CA1\u6709\u53EF\u7528\u6B4C\u8BCD\u624D\u53BB\u8054\u7F51\uFF09\uFF0C\u624B\u52A8\u641C\u7D22\u53EA\u5728\u70B9\u300C\u641C\u7D22\u300D\u65F6",off:"\u89C1\u4E0B\u65B9\u300C\u4F18\u5148\u4F7F\u7528\u9010\u5B57\u6B4C\u8BCD\u300D\uFF1B\u4E0D\u624B\u52A8\u641C\u7D22\u5728\u7EBF\u6B4C\u8BCD\u5373\u53EF\u51CF\u5C11\u8BF7\u6C42"},{what:"\u5C01\u9762\u5339\u914D",where:"itunes.apple.com\u3001music.163.com\u3001c.y.qq.com\u3001api.deezer.com\u3001musicbrainz.org / coverartarchive.org",when:"\u6B4C\u66F2\u7F3A\u5C11\u5C01\u9762\u65F6\u81EA\u52A8\u5339\u914D\uFF08\u5728\u7EBF\u6B4C\u66F2\u4E0E\u672C\u5730\u6B4C\u66F2\u90FD\u53EF\u80FD\u89E6\u53D1\uFF09",off:"\u5173\u95ED\u300C\u8054\u7F51\u83B7\u53D6\u5C01\u9762\u300D"},{what:"AI \u5143\u6570\u636E\u6E05\u6D17\uFF08\u53EF\u9009\u529F\u80FD\uFF09",where:"\u4F60\u81EA\u5DF1\u586B\u5199\u7684\u63A5\u53E3\u5730\u5740 \u2014\u2014 \u901A\u5E38\u5728\u5883\u5916",when:"\u542F\u7528 AI \u540E\uFF1A\u81EA\u52A8\u5339\u914D\u6B4C\u8BCD\u524D\u3001\u4E0B\u8F7D\u5B8C\u6210\u540E\u6574\u7406\u6807\u7B7E\u65F6",off:"\u4E0D\u586B Base URL / API Key\uFF0C\u6216\u5173\u6389\u300C\u81EA\u52A8\u5339\u914D\u6B4C\u8BCD\u65F6\u4F7F\u7528 AI\u300D\u4E0E\u300C\u4E0B\u8F7D\u6B4C\u66F2\u65F6\u7528 AI \u6574\u7406\u5143\u6570\u636E\u300D"},{what:"\u68C0\u67E5\u66F4\u65B0",where:"api.github.com\uFF1B\u4E0B\u8F7D\u5B89\u88C5\u5305\u65F6\u8D70\u4F60\u9009\u62E9\u7684\u52A0\u901F\u4EE3\u7406\u57DF\u540D",when:"\u542F\u52A8\u65F6\u9759\u9ED8\u68C0\u67E5\u4E00\u6B21\uFF08\u53EF\u5173\uFF09\uFF0C\u4EE5\u53CA\u4F60\u4E3B\u52A8\u70B9\u300C\u68C0\u67E5\u66F4\u65B0\u300D\u65F6",off:"\u5173\u95ED\u300C\u542F\u52A8\u65F6\u81EA\u52A8\u68C0\u67E5\u66F4\u65B0\u300D"}],Pl=["\u66F2\u5E93\u3001\u64AD\u653E\u8BB0\u5F55\u3001\u6B4C\u5355\u3001\u6536\u85CF\u90FD\u53EA\u5B58\u5728\u672C\u673A\uFF0C\u4E0D\u4F1A\u4E0A\u4F20\u5230\u4EFB\u4F55\u670D\u52A1\u5668\uFF08\u672C\u7A0B\u5E8F\u4E5F\u6CA1\u6709\u670D\u52A1\u5668\uFF09\u3002","\u8054\u7F51\u8BF7\u6C42\u53EA\u5E26\u5FC5\u8981\u53C2\u6570\uFF1A\u641C\u7D22\u5173\u952E\u8BCD\u3001\u6B4C\u66F2\u7684\u6807\u9898 / \u6B4C\u624B / \u4E13\u8F91 / \u65F6\u957F\uFF1BAI \u6E05\u6D17\u989D\u5916\u5E26\u6587\u4EF6\u540D\uFF08\u53EA\u6709\u6587\u4EF6\u540D\uFF0C\u4E0D\u542B\u5B8C\u6574\u8DEF\u5F84\uFF09\u3002","AI \u7684 API Key \u53EA\u5199\u5165\u672C\u673A\u914D\u7F6E\u6587\u4EF6\uFF0C\u754C\u9762\u56DE\u4F20\u65F6\u4E00\u5F8B\u6253\u7801\uFF0C\u4E5F\u4E0D\u4F1A\u53D1\u5F80\u4F60\u586B\u5199\u7684\u63A5\u53E3\u4EE5\u5916\u7684\u4EFB\u4F55\u5730\u65B9\u3002","\u4E0B\u8F7D\u4E0E\u8BD5\u542C\u7F13\u5B58\u3001\u5C01\u9762\u4E0E\u6B4C\u8BCD\u7F13\u5B58\u90FD\u5728\u4F60\u672C\u673A\u7684\u6570\u636E\u76EE\u5F55 / \u4E34\u65F6\u76EE\u5F55\u91CC\uFF0C\u53EF\u4EE5\u5728\u8BBE\u7F6E\u91CC\u67E5\u770B\u4F4D\u7F6E\u5E76\u6E05\u7A7A\u3002"],ci="https://github.com/nihaozyj7/localMusicPlayer",na=`${ci}/releases`,ea=[{id:"auto",name:"\u81EA\u52A8\u9009\u62E9\uFF08\u63A8\u8350\uFF09",note:"\u5148\u8BD5\u76F4\u8FDE\uFF0C\u5931\u8D25\u81EA\u52A8\u6362\u4E0B\u4E00\u4E2A\u4EE3\u7406\uFF0C\u76F4\u5230\u6210\u529F"},{id:"direct",name:"\u76F4\u8FDE GitHub",note:"\u4E0D\u4F7F\u7528\u4EE3\u7406\uFF1B\u7F51\u7EDC\u901A\u7545\u65F6\u6700\u5FEB"},{id:"ghproxy.net",name:"ghproxy.net",note:"\u901A\u7528\u52A0\u901F\uFF0C\u7A33\u5B9A\u6027\u8F83\u597D"},{id:"ghfast.top",name:"ghfast.top",note:"\u901A\u7528\u52A0\u901F\uFF0C\u901F\u5EA6\u8F83\u5FEB"},{id:"githubproxy.cc",name:"githubproxy.cc",note:"\u901A\u7528\u52A0\u901F"},{id:"gh-proxy.com",name:"gh-proxy.com",note:"\u901A\u7528\u52A0\u901F\uFF0C\u5076\u6709\u9650\u6D41"},{id:"ghproxy.homeboyc.cn",name:"ghproxy.homeboyc.cn",note:"\u5BF9\u5927\u6587\u4EF6\u652F\u6301\u8F83\u597D"},{id:"gh.llkk.cc",name:"gh.llkk.cc",note:"\u901A\u7528\u52A0\u901F\uFF0C\u53EF\u7528\u6027\u6CE2\u52A8\u8F83\u5927"},{id:"ghp.ci",name:"ghp.ci",note:"\u8001\u724C\u4EE3\u7406\uFF0C\u90E8\u5206\u5730\u533A\u5DF2\u4E0D\u53EF\u7528"}];Ju="music-player.state.v1",Ys=["sequence","loop-one","shuffle"],Qu={theme:"flat-dark",themeMode:"dark",glassBlur:22,glassBlurCustom:!1,glassAlpha:62,glassAlphaCustom:!1,windowCorners:"system",minimizeToTray:!0,animations:!0,animationsSpeed:"fast",skinPerformanceMode:"smooth",accentFromCover:!1,coverSeed:"",coverSeed2:"",showAlbumColumn:!0,showLyrics:!0,playMode:"sequence",volume:.8,muted:!1,autoScanOnStart:!0,watchFolders:!0,playerViewMode:"classic",lyricsSources:["embedded","lrc-file","cache","online"],lyricsFontSize:16,lyricsLines:7,showDesktopLyrics:!1,showDesktopWallpaper:!1,autoStartDesktopWallpaper:!0,sleepAfterSong:!1,shuffleMode:"reshuffle",aiBaseUrl:"",aiApiKey:"",aiThinking:!1,aiVendor:"auto",aiModelId:"",aiLyricsClean:!0,aiDownloadTag:!0,autoDownloadOnCollect:!0,cacheDir:"%APPDATA%\\LocalMusicPlayer\\cache",scanConcurrency:4,loudnessMode:"off",loudnessTarget:-16,loudnessLimit:!0,effectPreset:"off",downloadDir:"",onlineCover:!0,onlineWordLyrics:!0,embedMeta:!1,rowClickAction:"play",resumeProgress:!0,rememberVolume:!0,listDensity:"cozy",coverCarousel:!1,coverCarouselInterval:10,skipSilenceHead:!0,skipSilenceTail:!0,trackGapSeconds:1};i=By(),sl=new Set;Uy=200,Zn=null,An=null;Ou={lt:(e,t)=>e<t,lte:(e,t)=>e<=t,gt:(e,t)=>e>t,gte:(e,t)=>e>=t,eq:(e,t)=>e===t};Ru=9223372036854776e3;rs=[],Mn=[],ii=new Set,Rl="";Qa=new Intl.Collator("zh-Hans-CN"),hi={title:(e,t)=>Qa.compare(String(e.title),String(t.title)),artist:(e,t)=>Qa.compare(String(e.artist),String(t.artist)),album:(e,t)=>Qa.compare(String(e.album),String(t.album)),duration:(e,t)=>e.duration-t.duration,size:(e,t)=>e.size-t.size,ext:(e,t)=>Qa.compare(String(e.ext),String(t.ext)),playCount:(e,t)=>(e.playCount??0)-(t.playCount??0),addedAt:(e,t)=>(e.addedAt??0)-(t.addedAt??0)},aa=[{key:"addedAt",label:"\u6DFB\u52A0\u65F6\u95F4",descFirst:!0},{key:"title",label:"\u6807\u9898",descFirst:!1},{key:"artist",label:"\u6B4C\u624B",descFirst:!1},{key:"album",label:"\u4E13\u8F91",descFirst:!1},{key:"duration",label:"\u65F6\u957F",descFirst:!1},{key:"size",label:"\u6587\u4EF6\u5927\u5C0F",descFirst:!1},{key:"playCount",label:"\u64AD\u653E\u6B21\u6570",descFirst:!0}];ei=null,qu=null,al=null,ap=new Map;Nu=null,Fu=new Map,ti="\0";Bu=null;He="liked",op="auto_downloads";cp=0;Wo(hp);Uu=1500;Wu=null,il=null;rl=null,ol=null;Xs=null;l_=["theme","themeMode","glassBlur","glassAlpha","windowCorners","minimizeToTray","animations","animationsSpeed","skinPerformanceMode","accentFromCover","coverSeed","coverSeed2","showAlbumColumn","showLyrics","playMode","volume","muted","playerViewMode","autoScanOnStart","watchFolders","scanConcurrency","lyricsFontSize","lyricsLines","lyricsSources","showDesktopLyrics","showDesktopWallpaper","autoStartDesktopWallpaper","sleepAfterSong","shuffleMode","aiBaseUrl","aiApiKey","aiThinking","aiVendor","aiModelId","aiLyricsClean","aiDownloadTag","autoDownloadOnCollect","cacheDir","loudnessMode","loudnessTarget","loudnessLimit","downloadDir","onlineCover","onlineWordLyrics","embedMeta","rowClickAction","resumeProgress","rememberVolume","listDensity","coverCarousel","coverCarouselInterval","skipSilenceHead","skipSilenceTail","trackGapSeconds","effectPreset","filterRules"],es=null;ll=null;ni=null;h_=Object.freeze(Object.defineProperty({__proto__:null,DEFAULT_CONFIG:Qu,DOWNLOAD_FOLDER_ID:op,LIKED_ID:He,PLAY_MODES:Ys,SORTERS:hi,SORT_FIELDS:aa,activeCoverOf:pp,addNextInQueue:la,addSongsToPlaylist:yi,appendToQueue:ki,applyRules:En,bootstrap:ji,buildConfigPatch:vp,cancelUpdateDownload:Ii,checkForUpdate:ha,clearQueue:da,clearUnplayable:Ci,commit:$,compileRegex:sa,computeSorted:rp,coverOverrideOf:hp,coverSetOf:up,coverVersion:on,createPlaylist:gi,currentContext:Bt,currentSong:ot,cyclePlayMode:Bi,defaultSortDir:Fl,deletePlaylist:bi,dismissUnplayable:pa,downloadUpdate:Mi,filterByQuery:ip,flushConfigSync:Wt,freshDownloadsKey:ui,hoistFreshDownloads:sp,hydrateFromBackend:yp,installUpdate:Ti,isFreshDownload:pi,isLiked:mt,loadUnplayableFiles:rn,loadUpdateState:Ai,markDownloaded:di,matchRules:Hy,movePlaylist:_i,nextIndex:fs,normDownloadPath:ql,normalizeSortDir:mi,noteMaskedApiKey:zl,noteProgress:Dn,notify:je,persist:vs,persistNow:Wl,playContext:gt,playNext:ft,playPrev:ms,playSong:Mt,playlistById:ge,playlistSongIds:us,registerOnlineSong:qi,removeFromQueue:ps,removeSongFromLibrary:Si,removeSongsFromPlaylist:ra,renamePlaylist:vi,reorderQueue:ca,rescan:ma,resolvableSongIds:ds,restoreUnplayable:xi,seek:Ni,setCollectHook:zi,setCoverSet:hs,setCoverSets:fa,setPlayMode:Ul,setPlaylistSelecting:oa,setRealAudioProbe:Ui,setSelectedSongs:$i,setSort:Li,setSortDir:Oi,setUpdateChannel:Ei,setUpdateCheckOnStart:Pi,setUserPlayProbe:Wi,setVolume:gs,skipUpdateVersion:Di,songById:Be,sortDirLabel:fi,sortField:cs,startMockTicker:Hi,state:i,subscribe:Ft,toggleLike:It,toggleMute:Fi,togglePlay:Ut,toggleSelectedSong:wi,toggleSort:Ri,toggleUnplayableOpen:ua,touchUpdate:lp,userFolders:ia,waitUntil:_p},Symbol.toStringTag,{value:"Module"}));cl=new Set;qe=class extends tn{createRenderRoot(){return this}constructor(){super(),this._deps=void 0,this._unsubscribers=[]}connectedCallback(){super.connectedCallback(),cl.add(this),this._unsubscribers.push(Ft(()=>this.revalidate())),this.onConnected?.()}disconnectedCallback(){cl.delete(this);for(let t of this._unsubscribers)t();this._unsubscribers=[],this.onDisconnected?.(),super.disconnectedCallback()}deps(){let t=this.constructor.deps;return typeof t=="function"?t(i):null}revalidate(){let t=this.deps();if(t===null){this.requestUpdate();return}f_(t,this._deps)||(this._deps=t,this.requestUpdate())}forceUpdate(){this._deps=void 0,this.requestUpdate()}$(t){return this.querySelector(t)}$$(t){return Array.from(this.querySelectorAll(t))}}});var Jp={};we(Jp,{runProbe:()=>u0});function dn(e){let t=document.querySelector(e);if(!t)return null;let n=t.getBoundingClientRect();return{w:Math.round(n.width),h:Math.round(n.height),x:Math.round(n.left),y:Math.round(n.top)}}function d0(e){let t=e.parentElement;for(;t&&t!==document.body&&t!==document.documentElement;){let n=getComputedStyle(t);if(n.overflowY!=="visible"&&n.overflowY!=="clip")return t;t=t.parentElement}return null}function Yp(e){let t=String(e).match(/rgba?\(([^)]+)\)/);if(!t)return null;let n=t[1].split(/[,\s/]+/).filter(Boolean).map(Number);return{r:n[0],g:n[1],b:n[2],a:n[3]??1}}function Xp({r:e,g:t,b:n}){let s=a=>{let r=a/255;return r<=.03928?r/12.92:((r+.055)/1.055)**2.4};return .2126*s(e)+.7152*s(t)+.0722*s(n)}function u0(){let e={},t=[],n=getComputedStyle(document.documentElement),s=window.innerWidth,a=window.innerHeight,r=c0.filter(M=>!n.getPropertyValue(M).trim());r.length&&t.push(`\u7F3A\u5C11\u4E3B\u9898\u4EE4\u724C: ${r.join(", ")}`),document.documentElement.scrollWidth>s+1&&t.push(`\u9875\u9762\u6A2A\u5411\u6EA2\u51FA: scrollWidth=${document.documentElement.scrollWidth} > ${s}`),document.body.scrollWidth>s+1&&t.push(`body \u6A2A\u5411\u6EA2\u51FA: ${document.body.scrollWidth} > ${s}`);let o={".titlebar":{h:parseFloat(n.getPropertyValue("--h-titlebar"))},".sidebar":{w:parseFloat(n.getPropertyValue("--w-sidebar"))},".playerbar":{h:parseFloat(n.getPropertyValue("--h-playerbar"))},".content-header":{h:parseFloat(n.getPropertyValue("--h-header"))}};for(let[M,T]of Object.entries(o)){let R=dn(M);if(!R){t.push(`\u627E\u4E0D\u5230\u5173\u952E\u533A\u57DF: ${M}`);continue}e[M]=R,T.h&&Math.abs(R.h-T.h)>2&&t.push(`${M} \u9AD8\u5EA6 ${R.h}px \u2260 \u8BBE\u8BA1 ${T.h}px`),T.w&&Math.abs(R.w-T.w)>2&&t.push(`${M} \u5BBD\u5EA6 ${R.w}px \u2260 \u8BBE\u8BA1 ${T.w}px`)}let l=[];document.querySelectorAll(".playerbar__tools, .playerbar__center, .content-header__tools").forEach(M=>{let T=M.getBoundingClientRect();(T.right>s+1||T.left<-1)&&l.push(`${M.className} right=${Math.round(T.right)}`)}),l.length&&t.push(`\u5143\u7D20\u8D85\u51FA\u89C6\u53E3: ${l.join(" | ")}`);let c=document.querySelector(".playerbar");if(c){let M=c.getBoundingClientRect(),T=dn(".playerbar__progress"),R=dn(".playerbar__row"),X=dn(".playerbar__now"),z=dn(".playerbar__center"),se=dn(".playerbar__tools");e.playerbar={bar:{w:Math.round(M.width),h:Math.round(M.height)},prog:T,row:R,now:X,center:z,tools:se},!T||!R?t.push("\u5E95\u680F\u7F3A\u5C11\u8FDB\u5EA6\u6761\u6216\u63A7\u5236\u884C"):(T.y+T.h>R.y+2&&t.push("\u5E95\u680F\u8FDB\u5EA6\u6761\u4E0E\u63A7\u5236\u884C\u91CD\u53E0"),X&&z&&X.x+X.w>z.x+1&&t.push("\u5E95\u680F\u300C\u5F53\u524D\u66F2\u76EE\u300D\u4E0E\u4F20\u8F93\u63A7\u5236\u91CD\u53E0"),z&&se&&z.x+z.w>se.x+1&&t.push("\u5E95\u680F\u4F20\u8F93\u63A7\u5236\u4E0E\u53F3\u4FA7\u5DE5\u5177\u91CD\u53E0"),R.y+R.h>M.bottom+1&&t.push("\u5E95\u680F\u63A7\u5236\u884C\u8D85\u51FA\u64AD\u653E\u63A7\u4EF6\u533A\u57DF"));for(let[me,le]of[["\u8FDB\u5EA6\u6761",T],["\u63A7\u5236\u884C",R]])le&&(le.y<M.top-1||le.y+le.h>M.bottom+1)&&t.push(`\u5E95\u680F${me}\u8D85\u51FA\u8303\u56F4: y=${le.y} h=${le.h} bar=[${Math.round(M.top)},${Math.round(M.bottom)}]`)}let d=dn("#btn-theme-toggle"),p=dn("#btn-settings");e.titlebar={themeBtn:d,settingsBtn:p},p?d&&p.x<d.x&&t.push("\u6807\u9898\u680F\u8BBE\u7F6E\u6309\u94AE\u4E0D\u5728\u4E3B\u9898\u5207\u6362\u53F3\u4FA7"):t.push("\u6807\u9898\u680F\u7F3A\u5C11\u8BBE\u7F6E\u6309\u94AE"),document.querySelector(".sidebar__foot")&&t.push("\u4FA7\u8FB9\u680F\u5E95\u90E8\u4ECD\u5B58\u5728\u65E7\u7684\u64CD\u4F5C\u533A");let h=document.getElementById("playerview");if(h?.dataset.skin==="immersive"&&h.dataset.state==="opened"){let M=document.querySelector(".immersive__card"),T=M?getComputedStyle(M):null;e.immersive=T?{background:T.backgroundColor,borderWidth:T.borderTopWidth,boxShadow:T.boxShadow}:null,T&&(T.borderTopWidth!=="0px"&&t.push(`\u6C89\u6D78\u6A21\u5F0F\u6B4C\u8BCD\u533A\u4ECD\u6709\u8FB9\u6846: ${T.borderTopWidth}`),T.backgroundColor!=="rgba(0, 0, 0, 0)"&&t.push(`\u6C89\u6D78\u6A21\u5F0F\u6B4C\u8BCD\u533A\u4ECD\u6709\u80CC\u666F\u8272: ${T.backgroundColor}`),T.boxShadow!=="none"&&t.push(`\u6C89\u6D78\u6A21\u5F0F\u6B4C\u8BCD\u533A\u4ECD\u6709\u9634\u5F71: ${T.boxShadow}`));let R=document.querySelector(".skin-bg"),X=R?R.getBoundingClientRect():null;e.immersiveBg=X?{hidden:R.hidden,w:Math.round(X.width),h:Math.round(X.height)}:null,!R||R.hidden?t.push("\u6C89\u6D78\u6837\u5F0F\u7F3A\u5C11\u6574\u7A97\u80CC\u666F\u5C42"):(X.width<s-1||X.height<a-1)&&t.push(`\u6C89\u6D78\u80CC\u666F\u672A\u94FA\u6EE1\u7A97\u53E3: ${Math.round(X.width)}x${Math.round(X.height)} \u2260 ${s}x${a}`);let z=c?getComputedStyle(c).backgroundColor:"",se=getComputedStyle(document.querySelector(".titlebar")).backgroundColor;z!=="rgba(0, 0, 0, 0)"&&t.push(`\u6C89\u6D78\u6A21\u5F0F\u64AD\u653E\u63A7\u4EF6\u4ECD\u6709\u80CC\u666F\u8272: ${z}`),se!=="rgba(0, 0, 0, 0)"&&t.push(`\u6C89\u6D78\u6A21\u5F0F\u6807\u9898\u680F\u4ECD\u6709\u80CC\u666F\u8272: ${se}`)}if(h?.dataset.state==="opened"&&h.dataset.skinBackground==="yes"){let M=document.getElementById("playerview-stage"),T=document.querySelector(".playerview__head"),R=parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--h-titlebar"))||0,X=M?M.offsetWidth:0,z=M?M.offsetHeight:0,se=h.getBoundingClientRect(),me=T?T.getBoundingClientRect().top-se.top:null;e.fullBleed={view:`${h.offsetWidth}x${h.offsetHeight}`,stage:`${X}x${z}`,headOffset:me},M?(h.offsetWidth!==s||h.offsetHeight!==a||X<s-1||z<a-1)&&t.push(`\u6574\u7A97\u80CC\u666F\u578B\u6837\u5F0F\u7684\u821E\u53F0\u672A\u94FA\u6EE1\u7A97\u53E3: \u8BE6\u60C5\u9875=${h.offsetWidth}x${h.offsetHeight} \u821E\u53F0=${X}x${z} \u2260 ${s}x${a}`):t.push("\u6574\u7A97\u80CC\u666F\u578B\u6837\u5F0F\u7F3A\u5C11\u821E\u53F0"),me!==null&&Math.abs(me-R)>1&&t.push(`\u6574\u7A97\u80CC\u666F\u578B\u6837\u5F0F\u7684\u5934\u90E8\u884C\u79BB\u5F00\u4E86\u6807\u9898\u680F\u4E4B\u4E0B: \u8DDD\u8BE6\u60C5\u9875\u9876 ${Math.round(me)} \u2260 ${R}`)}let v=document.querySelector("#pv-lyrics .lyrics__scroll");if(v&&h?.dataset.state==="opened"){let M=v.scrollHeight-v.clientHeight,T=v.querySelector('.lyric[aria-current="true"]');e.lyrics={scrollHeight:v.scrollHeight,clientHeight:v.clientHeight,scrollTop:Math.round(v.scrollTop),hasActive:!!T},v.scrollHeight<=v.clientHeight&&t.push("\u6B4C\u8BCD\u533A\u4E0D\u53EF\u6EDA\u52A8\uFF08\u5185\u5BB9\u6CA1\u6709\u8D85\u51FA\u5BB9\u5668\uFF09"),!T&&v.querySelector(".lyric")&&t.push("\u6B4C\u8BCD\u533A\u6CA1\u6709\u5B9A\u4F4D\u5230\u5F53\u524D\u884C"),T&&M>0&&v.scrollTop===0&&T.offsetTop>v.clientHeight&&t.push("\u6B4C\u8BCD\u672A\u81EA\u52A8\u6EDA\u52A8\u5230\u5F53\u524D\u884C")}let w=[[".content-header__title","\u6807\u9898"],[".track__title","\u66F2\u76EE\u6807\u9898"],[".track__time","\u65F6\u957F"],[".navitem__text","\u4FA7\u8FB9\u680F\u6587\u5B57"]];e.contrast={};for(let[M,T]of w){let R=document.querySelector(M);if(!R)continue;let X=getComputedStyle(R),z=Yp(X.color);if(!z)continue;let se=Yp(getComputedStyle(document.body).backgroundColor)||{r:8,g:8,b:10},me=Xp(z),le=Xp(se),ke=(Math.max(me,le)+.05)/(Math.min(me,le)+.05);e.contrast[T]=Number(ke.toFixed(2));let Le=M===".track__time"||M===".navitem__text"?2.2:3.5;ke<Le&&t.push(`${T} \u5BF9\u6BD4\u5EA6\u504F\u4F4E: ${ke.toFixed(2)} (\u9608\u503C ${Le})`)}let k=document.querySelectorAll(".track");if(e.trackRows=k.length,k.length){let M=k[0].getBoundingClientRect(),T=document.querySelector(".tracks__head")?.getBoundingClientRect();T&&Math.abs(M.left-T.left)>1&&t.push("\u8868\u5934\u4E0E\u884C\u5DE6\u8FB9\u754C\u4E0D\u5BF9\u9F50");let R=parseFloat(n.getPropertyValue("--row-h"));Math.abs(M.height-R)>2&&t.push(`\u884C\u9AD8 ${Math.round(M.height)}px \u2260 \u8BBE\u8BA1 ${R}px`)}let C=document.querySelector(".tracks__head"),L=document.querySelector(".tracks__body .track");if(C&&L){let M=getComputedStyle(C).gridTemplateColumns,T=getComputedStyle(L).gridTemplateColumns;if(e.gridColumns={head:M,row:T},M!==T){let R=X=>X.split(/\s+/).filter(Boolean).length;t.push(`\u8868\u5934\u4E0E\u6570\u636E\u884C\u7F51\u683C\u5217\u4E0D\u4E00\u81F4\uFF08\u8868\u5934 ${R(M)} \u5217 / \u884C ${R(T)} \u5217\uFF09\uFF0C\u8868\u5934\u4F1A\u9519\u4F4D`)}}if(C){let M=document.getElementById("content-body"),T=d0(C);e.stickyHead={top:parseFloat(getComputedStyle(C).top),scroller:T?T.className||T.tagName:null},M&&!M.contains(C)?t.push("\u8868\u5934\u4E0D\u5728\u6EDA\u52A8\u5BB9\u5668 .content-body \u5185\uFF0C\u65E0\u6CD5\u5438\u9876"):T&&T!==M&&t.push(`\u8868\u5934\u88AB .${T.className||T.tagName} \u622A\u6210\u4E86\u6EDA\u52A8\u5BB9\u5668\uFF0Csticky \u4F1A\u5931\u6548\uFF08\u8BE5\u7956\u5148\u5E94\u4F7F\u7528 overflow: clip\uFF09`)}if(C){let M=getComputedStyle(C).gridTemplateRows,T=M.split(/\s+/).map(parseFloat).filter(z=>!Number.isNaN(z)),R=T.length?Math.max(...T):0;e.headGrid={height:C.getBoundingClientRect().height,rows:M,maxRow:R},R>C.getBoundingClientRect().height+1&&t.push(`\u8868\u5934\u5185\u90E8\u884C\u9AD8 ${Math.round(R)}px \u8D85\u8FC7\u8868\u5934\u9AD8\u5EA6 ${Math.round(C.getBoundingClientRect().height)}px\uFF0C\u8868\u5934\u6587\u5B57\u4F1A\u88AB\u63A8\u4E0B`);let X=Array.from(C.querySelectorAll("svg, img")).filter(z=>{let se=z.getBoundingClientRect();return se.width>100||se.height>50});for(let z of X){let se=z.getBoundingClientRect();t.push(`\u8868\u5934\u5185\u56FE\u6807\u5C3A\u5BF8\u5931\u63A7 ${Math.round(se.width)}\xD7${Math.round(se.height)}\uFF08\u5BB9\u5668 .${z.parentElement?.className}\uFF09\uFF0C\u5E94\u663E\u5F0F\u7ED9\u5BBD\u9AD8`)}}let O=document.querySelector(".playerbar"),S=O?getComputedStyle(O):null;e.backdropFilter=S?.backdropFilter||S?.webkitBackdropFilter||"none",e.chromeGradient={top:getComputedStyle(document.getElementById("app"),"::before").backgroundImage,bottom:getComputedStyle(document.getElementById("app"),"::after").backgroundImage,titlebarBg:getComputedStyle(document.querySelector(".titlebar")).backgroundColor,playerbarBg:S?.backgroundColor??""},/gradient/.test(e.chromeGradient.top)||t.push("\u9876\u90E8 chrome \u6E10\u53D8\u672A\u751F\u6548"),/gradient/.test(e.chromeGradient.bottom)||t.push("\u5E95\u90E8 chrome \u6E10\u53D8\u672A\u751F\u6548"),e.chromeGradient.titlebarBg!=="rgba(0, 0, 0, 0)"&&t.push(`\u6807\u9898\u680F\u4E0D\u5E94\u81EA\u94FA\u5E95\u8272: ${e.chromeGradient.titlebarBg}`),e.chromeGradient.playerbarBg!=="rgba(0, 0, 0, 0)"&&t.push(`\u64AD\u653E\u63A7\u4EF6\u4E0D\u5E94\u81EA\u94FA\u5E95\u8272: ${e.chromeGradient.playerbarBg}`);let q={ok:t.length===0,issues:t,info:e,viewport:{vw:s,vh:a},theme:document.documentElement.dataset.theme},W=document.createElement("pre");return W.id="probe-report",W.textContent=JSON.stringify(q,null,2),document.body.appendChild(W),document.title=t.length?`PROBE-FAIL(${t.length})`:"PROBE-OK",q}var c0,Qp=ae(()=>{c0=["--bg-app","--glass-bg","--glass-blur","--glass-border","--accent","--text-1","--text-2","--text-3","--border-1","--r-md","--h-titlebar","--w-sidebar","--h-playerbar","--h-header","--row-h","--dur","--ease"]});Hs();Vi();Hs();var nc=128,m_=1e3/30,zt=null,Xl=0,wp=0,jl=!1;async function g_(){try{let e=(await y.playerSpectrum(nc))?.bands;if(!e||!e.length){zt=null;return}(!zt||zt.length!==e.length)&&(zt=new Float32Array(e.length));for(let t=0;t<e.length;t+=1)zt[t]=e[t];Xl=performance.now()}catch{}}function Op(){if(!x())return zt?{bands:zt,at:Xl}:null;let e=performance.now();return e-wp>=m_&&!jl&&(wp=e,jl=!0,g_().finally(()=>{jl=!1})),zt?{bands:zt,at:Xl}:null}var $p="3.0",Rp="3.0",v_=["id","mount"];function kp(e){let t=String(e??"").trim(),n=/^(\d+)(?:\.(\d+))?$/.exec(t);return n?{major:Number(n[1]),minor:Number(n[2]??0),raw:t}:null}function qp(e){let t=kp(e);if(!t)return{ok:!1,reason:`apiVersion \u975E\u6CD5\uFF1A${JSON.stringify(e)}\uFF08\u5E94\u5F62\u5982 "3.0"\uFF09`};let n=kp(Rp);return n?t.major!==n.major?{ok:!1,reason:`\u5951\u7EA6\u4E3B\u7248\u672C\u4E0D\u5339\u914D\uFF1A\u63D2\u4EF6\u8981\u6C42 ${t.raw}\uFF0C\u5BBF\u4E3B\u662F ${n.raw}\uFF08\u4E3B\u7248\u672C\u5FC5\u987B\u76F8\u540C\uFF09`}:t.minor>n.minor?{ok:!1,reason:`\u63D2\u4EF6\u8981\u6C42\u5951\u7EA6 ${t.raw}\uFF0C\u5BBF\u4E3B\u53EA\u5B9E\u73B0\u5230 ${n.raw}\uFF08\u8BF7\u5347\u7EA7\u5E94\u7528\uFF09`}:{ok:!0}:{ok:!1,reason:"\u5BBF\u4E3B\u7248\u672C\u53F7\u5F02\u5E38"}}function b_(e,t,n={}){let s=e?.default??e?.skin??null;if(!s||typeof s!="object")throw new Error("\u5165\u53E3\u6A21\u5757\u6CA1\u6709\u5BFC\u51FA\u63D2\u4EF6\u5BF9\u8C61\uFF08\u5E94\u4E3A `export default { \u2026 }`\uFF09");for(let l of v_)if(l!=="id"&&!s[l])throw new Error(`\u63D2\u4EF6\u7F3A\u5C11\u5FC5\u9700\u5B57\u6BB5\uFF1A${l}`);if(typeof s.mount!="function")throw new Error(`\u63D2\u4EF6 ${t.id} \u7684 mount \u5FC5\u987B\u662F\u51FD\u6570`);if(s.apiVersion!=null&&String(s.apiVersion)!==String(t.apiVersion))throw new Error(`apiVersion \u4E0D\u4E00\u81F4\uFF1A\u6E05\u5355\u662F ${t.apiVersion}\uFF0C\u5165\u53E3\u6A21\u5757\u5199\u7684\u662F ${s.apiVersion}\uFF08\u8BF7\u53EA\u4FDD\u7559\u4E00\u5904\uFF09`);if(s.id!=null&&String(s.id)!==String(t.id))throw new Error(`id \u4E0D\u4E00\u81F4\uFF1A\u6E05\u5355\u662F ${t.id}\uFF0C\u5165\u53E3\u6A21\u5757\u5199\u7684\u662F ${s.id}`);let a=t.capabilities||{},r=t.colors&&typeof t.colors=="object"?t.colors:{},o=t.performance||{};return{id:String(t.id),name:String(t.name??s.name??t.id),apiVersion:String(t.apiVersion),version:String(t.version??""),author:String(t.author??""),description:String(t.description??s.description??""),icon:t.icon?.sprite?String(t.icon.sprite):"disc",iconUrl:n.iconUrl||"",order:Number.isFinite(Number(t.order))?Number(t.order):100,background:a.background===!0,spectrum:a.spectrum===void 0?!1:a.spectrum,interactive:a.interactive!==!1,paintSelf:a.paintSelf!==!1,budgetFps:Number.isFinite(Number(o.budgetFps))?Number(o.budgetFps):30,colors:r,colorsMissing:n.colorsMissing||[],styles:Array.isArray(t.styles)?t.styles.map(String):[],builtin:n.builtin===!0,source:n.source||"",mount:s.mount,update:typeof s.update=="function"?s.update:null,destroy:typeof s.destroy=="function"?s.destroy:null}}function Np(e){if(!e||typeof e!="object")throw new Error("\u76AE\u80A4\u5FC5\u987B\u662F\u4E00\u4E2A\u5BF9\u8C61");if(!e.id)throw new Error("\u76AE\u80A4\u7F3A\u5C11\u5FC5\u9700\u5B57\u6BB5\uFF1Aid");if(typeof e.mount!="function")throw new Error(`\u76AE\u80A4 ${e.id} \u7684 mount \u5FC5\u987B\u662F\u51FD\u6570`);let t=qp(e.apiVersion??$p);if(!t.ok)throw new Error(`\u76AE\u80A4 ${e.id}\uFF1A${t.reason}`);return{name:e.id,icon:"disc",order:100,apiVersion:$p,colors:{},colorsMissing:[],styles:[],update:null,destroy:null,...e}}function y_(e,t,n={}){try{return{ok:!0,skin:b_(e,t,n)}}catch(s){return{ok:!1,reason:s?.message??String(s)}}}function Vl(e){if(typeof e!="string")return null;let t=e.trim().toLowerCase();if(!t)return null;if(t.startsWith("#")){let p=t.slice(1);if(!/^[0-9a-f]+$/.test(p))return null;let h=v=>parseInt(v,16);return p.length===3||p.length===4?{r:h(p[0]+p[0]),g:h(p[1]+p[1]),b:h(p[2]+p[2]),a:p.length===4?h(p[3]+p[3])/255:1}:p.length===6||p.length===8?{r:h(p.slice(0,2)),g:h(p.slice(2,4)),b:h(p.slice(4,6)),a:p.length===8?h(p.slice(6,8))/255:1}:null}let n=/^(rgba?|hsla?)\(([^)]+)\)$/.exec(t);if(!n)return null;let s=n[1],a=n[2].replace(/\//g," ").split(/[\s,]+/).filter(Boolean);if(a.length<3||a.length>4)return null;let r=(p,h)=>{let v=p.endsWith("%"),w=parseFloat(p);return Number.isFinite(w)?v?w/100*h:w:null},o=a[3]===void 0?1:r(a[3],1);if(o===null)return null;if(s==="rgb"||s==="rgba"){let p=r(a[0],255),h=r(a[1],255),v=r(a[2],255);return p===null||h===null||v===null?null:{r:vt(p),g:vt(h),b:vt(v),a:Ki(o)}}let l=parseFloat(String(a[0]).replace(/deg$/,"")),c=r(a[1],1),d=r(a[2],1);return!Number.isFinite(l)||c===null||d===null?null:{...__((l%360+360)%360,Ki(c),Ki(d)),a:Ki(o)}}function vt(e){return Math.max(0,Math.min(255,Math.round(e)))}function Ki(e){return Math.max(0,Math.min(1,e))}function __(e,t,n){let s=(1-Math.abs(2*n-1))*t,a=e/60,r=s*(1-Math.abs(a%2-1)),o=0,l=0,c=0;a<1?[o,l,c]=[s,r,0]:a<2?[o,l,c]=[r,s,0]:a<3?[o,l,c]=[0,s,r]:a<4?[o,l,c]=[0,r,s]:a<5?[o,l,c]=[r,0,s]:[o,l,c]=[s,0,r];let d=n-s/2;return{r:vt((o+d)*255),g:vt((l+d)*255),b:vt((c+d)*255)}}function at(e){return`rgb(${vt(e.r)} ${vt(e.g)} ${vt(e.b)})`}function Gi(e){let t=n=>vt(n).toString(16).padStart(2,"0");return`#${t(e.r)}${t(e.g)}${t(e.b)}`}function Jl(e){let t=n=>{let s=vt(n)/255;return s<=.03928?s/12.92:((s+.055)/1.055)**2.4};return .2126*t(e.r)+.7152*t(e.g)+.0722*t(e.b)}function Ln(e,t){let n=Jl(e),s=Jl(t),a=Math.max(n,s),r=Math.min(n,s);return(a+.05)/(r+.05)}var Ql=4.5,w_=2;function Kl(e,t){if(Ln(e,t)>=Ql)return{color:t,corrected:!1};let n=Jl(e)<.5?{r:255,g:255,b:255}:{r:0,g:0,b:0};if(Ln(e,t)>=w_)for(let r=1;r<=10;r+=1){let o=r/10,l={r:Math.round(t.r+(n.r-t.r)*o),g:Math.round(t.g+(n.g-t.g)*o),b:Math.round(t.b+(n.b-t.b)*o),a:1};if(Ln(e,l)>=Ql)return{color:l,corrected:!0}}let s={r:0,g:0,b:0,a:1},a={r:255,g:255,b:255,a:1};return{color:Ln(e,s)>=Ln(e,a)?s:a,corrected:!0}}function Zi(e){let t=e&&typeof e=="object"?e:{};if(t.theme===!0)return{theme:!0,vars:{},missing:[],corrected:!1,contrast:0,preview:{bg:null,fg:null,accent:null,declaredFg:null},readable:null};let n=[],s={},a=Vl(t.bg),r=Vl(t.fg),o=Vl(t.accent);a||n.push("bg"),r||n.push("fg"),t.accent!=null&&!o&&n.push("accent");let l=r,c=!1;if(a&&r){let v=Kl(a,r);l=v.color,c=v.corrected}let d=null,p=null,h=o??l;return h&&(d=a?Kl(a,h).color:h,p=Kl(d,a??{r:255,g:255,b:255,a:1}).color),a&&(s["--chrome-bg"]=`color-mix(in oklab, ${at(a)} 82%, transparent)`,s["--chrome-bg-soft"]=`color-mix(in oklab, ${at(a)} 62%, transparent)`,s["--skin-bg"]=at(a)),l&&(s["--chrome-fg"]=at(l),s["--chrome-fg-dim"]=`color-mix(in oklab, ${at(l)} 60%, transparent)`,s["--chrome-hover"]=`color-mix(in oklab, ${at(l)} 10%, transparent)`,s["--chrome-active"]=`color-mix(in oklab, ${at(l)} 16%, transparent)`,s["--chrome-border"]=`color-mix(in oklab, ${at(l)} 18%, transparent)`,s["--skin-fg"]=at(l)),d&&(s["--chrome-accent"]=at(d),s["--chrome-accent-text"]=at(p),s["--chrome-accent-weak"]=`color-mix(in oklab, ${at(d)} 16%, transparent)`,s["--chrome-accent-weak-hover"]=`color-mix(in oklab, ${at(d)} 24%, transparent)`),{theme:!1,vars:s,missing:n,corrected:c,contrast:a&&l?Math.round(Ln(a,l)*100)/100:0,preview:{bg:a?Gi(a):null,fg:l?Gi(l):null,accent:o?Gi(o):null,declaredFg:r?Gi(r):null},readable:a&&r?Ln(a,l)>=Ql:null}}function $_(e,t){if(e){for(let[n,s]of Object.entries(t.vars))e.style.setProperty(n,s);e.dataset.chrome="on"}}function Gl(e){if(e){for(let t of k_)e.style.removeProperty(t);delete e.dataset.chrome}}var k_=["--chrome-bg","--chrome-bg-soft","--chrome-fg","--chrome-fg-dim","--chrome-hover","--chrome-active","--chrome-border","--chrome-accent","--chrome-accent-text","--chrome-accent-weak","--chrome-accent-weak-hover","--skin-bg","--skin-fg"],Ji=/\[(\d{1,2}):(\d{1,2})(?:[.:](\d{1,3}))?\]/g,Sp=/\[(\d{1,3}):(\d{1,2})(?:[.:](\d{1,3}))?\]/y,xp=/\[(\d{1,7}),(\d{1,7})\]/y,S_=/<(\d{1,3}):(\d{1,2})(?:[.:](\d{1,3}))?>/g;function On(e){let t=String(e??"");if(!t)return[];if(typeof Intl<"u"&&typeof Intl.Segmenter=="function")try{let n=new Intl.Segmenter(void 0,{granularity:"grapheme"});return Array.from(n.segment(t),s=>s.segment)}catch{}return Array.from(t)}function Fp(e){let t=e.indexOf(":");if(t<=0)return null;let n=e.slice(0,t),s=e.slice(t+1),a="",r=s.search(/[.:]/);if(r>=0&&(a=s.slice(r+1),s=s.slice(0,r)),!/^\d+$/.test(n)||!/^\d+$/.test(s))return null;let o=0;if(a){if(!/^\d+$/.test(a))return null;o=Number(a.slice(0,3).padEnd(3,"0"))}return(Number(n)*60+Number(s))*1e3+o}function Cp(e){let t=String(e).split(",");if(t.length<2||t.length>3)return null;let n=t[0].trim(),s=t[1].trim();return!/^\d+$/.test(n)||!/^\d+$/.test(s)?null:[Number(n),Number(s)]}function x_(e){let t={stamps:[],text:"",words:null},n=String(e).replace(/^[ \t]+/,""),s=[],a=!1;for(;;){Sp.lastIndex=0;let d=Sp.exec(n);if(d&&d.index===0){s.push(Fp(d[0].slice(1,-1))??0),n=n.slice(d[0].length);continue}xp.lastIndex=0;let p=xp.exec(n);if(p&&p.index===0){s.push(Number(p[1])),a=!0,n=n.slice(p[0].length);continue}break}if(!s.length)return t;n=n.replace(/^[ \t]+/,"");let{segs:r,wordy:o}=A_(n,s[0],a);if(!r.length)return{stamps:s,text:"",words:null};for(r[0].text=r[0].text.replace(/^[ \t]+/,""),r[r.length-1].text=r[r.length-1].text.replace(/[ \t]+$/,"");r.length&&!r[0].text;)r.shift();for(;r.length&&!r[r.length-1].text;)r.pop();if(!r.length)return{stamps:s,text:"",words:null};let l=r.map(d=>d.text).join("");if(!l)return{stamps:s,text:"",words:null};let c=o?C_(r,l):null;if(c&&c.length&&c[0]<s[0]){let d=s[0]-c[0];for(let p=0;p<c.length;p+=1)c[p]+=d}return{stamps:s,text:l,words:c}}function C_(e,t){let n=[];for(let s of e){let a=On(s.text).length;for(let r=0;r<a;r+=1)n.push(s.start)}return!n.length||n.length!==On(t).length?null:n}function A_(e,t,n){let s=[],a="",r=t,o=!1,l=d=>{a&&(s.push({start:d,text:a}),a="")},c=0;for(;c<e.length;){let d=e[c];if(d!=="<"&&d!=="("&&d!=="["){a+=d,c+=1;continue}let p=d==="<"?">":d==="("?")":"]",h=e.indexOf(p,c+1);if(h<0){a+=d,c+=1;continue}let v=e.slice(c+1,h),w=h+1;if(d==="("){let L=Cp(v);if(L&&n){l(L[0]),r=L[0]+L[1],o=!0,c=w;continue}a+=d,c+=1;continue}let k=Fp(v);if(k!==null){l(r),r=k,o=!0,c=w;continue}let C=Cp(v);if(C&&n){let L=d==="<"?t+C[0]:C[0];l(r),r=L,o=!0,c=w;continue}a+=d,c+=1}return l(r),{segs:s,wordy:o}}function bs(e){if(!e)return[];let t=[];for(let s of String(e).split(/\r?\n/)){if(!s.trim())continue;let a=x_(s);if(!a.stamps.length||!a.text)continue;let r=a.stamps[0];for(let o of a.stamps){let l={time:o,text:a.text};a.words&&(l.words=o===r?a.words:a.words.map(c=>c+(o-r))),t.push(l)}}t.sort((s,a)=>s.time-a.time);let n=[];for(let s of t){let a=n[n.length-1];a&&a.time===s.time?a.trans?a.trans.push(s.text):a.trans=[s.text]:n.push(s)}return M_(n)}function M_(e){for(let t=0;t<e.length;t+=1){let n=e[t].words;if(!Array.isArray(n)||n.length<2)continue;let s=!1;for(let d=1;d<n.length;d+=1)if(n[d]===n[d-1]){s=!0;break}if(!s)continue;let a=[];for(let d=1;d<n.length;d+=1){let p=n[d]-n[d-1];p>0&&a.push(p)}a.sort((d,p)=>d-p);let r=a.length?a[a.length>>1]:320,o=Math.max(400,Math.min(r*2,1400)),l=e[t+1]?.time,c=0;for(;c<n.length;){let d=c;for(;d+1<n.length&&n[d+1]===n[c];)d+=1;let p=d-c+1;if(p>1){let h=n[c],v;if(d+1<n.length)v=n[d+1]-h;else{let w=Number.isFinite(l)&&l>h?l-h:0;v=Math.min(w||o,o)}if(v>0)for(let w=1;w<p;w+=1)n[c+w]=h+Math.round(w*v/p)}c=d+1}}return e}function ys(e,t=" \xB7 "){if(!e)return"";let n=String(e.text??""),s=e.trans;return!Array.isArray(s)||!s.length?n:[n,...s].join(t)}var Ap=60;function sc(e,t){let n=Array.isArray(e)?e.length:0;if(!n)return[];let s=new Array(n);for(let d=0;d<n;d+=1)s[d]=d+1<n?e[d+1]:0;let a=[];for(let d=1;d<n;d+=1){let p=e[d]-e[d-1];p>0&&a.push(p)}a.sort((d,p)=>d-p);let r=a.length?a[a.length>>1]:320,o=Math.max(400,Math.min(r*2,1400)),l=n-1,c=Number.isFinite(t)&&t>e[l]?t:0;s[l]=e[l]+Math.min(c?c-e[l]:o,o);for(let d=0;d<n;d+=1)s[d]-e[d]<Ap&&(s[d]=e[d]+Ap);return s}function I_(e,t,n){let s=t-e;if(!(s>0))return n>=e?1:0;let a=(n-e)/s;return a<=0?0:a>=1?1:Math.round(a*100)/100}function ln(e,t){if(!e||!e.length)return-1;let n=0,s=e.length-1,a=-1;for(;n<=s;){let r=n+s>>1;e[r].time<=t?(a=r,n=r+1):s=r-1}return a}function cn(e){let t=Math.max(0,Math.round(Number(e)||0)),n=Math.round(t/10),s=Math.floor(n/6e3),a=((n-s*6e3)/100).toFixed(2).padStart(5,"0");return`[${String(s).padStart(2,"0")}:${a}]`}function ac(e){let t=[];if(!e)return t;for(let n of String(e).split(/\r?\n/)){let s=[];Ji.lastIndex=0;let a;for(;a=Ji.exec(n);){let o=Number(a[1]),l=Number(a[2]),c=a[3]?+`0.${a[3].padEnd(3,"0")}`:0;s.push(Math.round((o*60+l+c)*1e3))}let r=n.replace(Ji,"").trim();if(r)if(s.length)for(let o of s)t.push({time:o,text:r});else t.push({time:null,text:r})}return t}function ic(e){return(e||[]).filter(t=>t&&t.text&&typeof t.time=="number"&&Number.isFinite(t.time)).slice().sort((t,n)=>t.time-n.time).map(t=>`${cn(t.time)}${t.text}`).join(`
`)}function Mp(e,t,n){let s=n?Number(String(n).padEnd(3,"0")):0;return(Number(e)*60+Number(t))*1e3+s}function T_(e){let t=Math.max(0,Math.round(Number(e)||0)),n=Math.floor(t/6e4),s=t%6e4,a=Math.floor(s/1e3),r=s%1e3;return`<${String(n).padStart(2,"0")}:${String(a).padStart(2,"0")}.${String(r).padStart(3,"0")}>`}function Bp(e,t){let n=Number(t)||0;return n?(e||"").split(/\r?\n/).map(s=>{let a=!1,r=s.replace(Ji,(o,l,c,d)=>(a=!0,cn(Mp(l,c,d)+n)));return a?r.replace(S_,(o,l,c,d)=>T_(Mp(l,c,d)+n)):s}).join(`
`):String(e||"")}function Up(e,t){let n=Array.isArray(e)?e:[],s=new Array(n.length).fill(!1),a=new Array(t.length).fill(null);for(let r=0;r<t.length;r+=1){if(r<n.length&&!s[r]&&n[r].text===t[r].text){a[r]=n[r].time,s[r]=!0;continue}for(let o=1;o<n.length;o+=1){let l=r+o,c=r-o;if(l<n.length&&!s[l]&&n[l].text===t[r].text){a[r]=n[l].time,s[l]=!0;break}if(c>=0&&c<n.length&&!s[c]&&n[c].text===t[r].text){a[r]=n[c].time,s[c]=!0;break}}}if(n.length===t.length)for(let r=0;r<t.length;r+=1)a[r]===null&&!s[r]&&(a[r]=n[r].time,s[r]=!0);return t.map((r,o)=>({time:typeof r.time=="number"?r.time:a[o],text:r.text}))}var Ip=1200;function E_(e,t={}){let n=t.escape||P_,s=t.interactive!==!1,a=document.createElement("div");a.className="lyrics",a.id="pv-lyrics",s||(a.dataset.passive="1");let r=document.createElement("div");r.className="lyrics__scroll",a.appendChild(r),e.appendChild(a);let o=[],l=-1,c=0,d=null,p=!1,h=-1,v=[],w=null,k=null,C=-1,L=null,O=0,S=0,q=!1,W=0,M=-1,T=()=>{c=Date.now()+Ip,d&&clearTimeout(d),d=setTimeout(()=>{d=null,!p&&(l=-2,pe(z,{immediate:!0}))},Ip+40)};s&&(r.addEventListener("wheel",T,{passive:!0}),r.addEventListener("touchmove",T,{passive:!0}),r.addEventListener("pointerdown",T,{passive:!0}));function R(P){let U=P.target.closest?.(".lyric");if(!U){P.target.closest?.("[data-lyrics-act='open-folder']")&&t.onOpenFolder?.();return}let K=Number(U.dataset.time);Number.isFinite(K)&&t.onSeek?.(K)}function X(P){if(P.key!=="Enter"&&P.key!==" ")return;let U=P.target.closest?.(".lyric");if(!U)return;P.preventDefault();let K=Number(U.dataset.time);Number.isFinite(K)&&t.onSeek?.(K)}s&&(r.addEventListener("click",R),r.addEventListener("keydown",X));let z=-1;function se(P,{immediate:U=!1}={}){if(P<0){r.scrollTo({top:0,behavior:U?"auto":"smooth"});return}let K=r.querySelector(`.lyric[data-lyric-index="${P}"]`);if(!K)return;let _e=K.offsetTop-(r.clientHeight-K.offsetHeight)/2,st=Math.max(0,r.scrollHeight-r.clientHeight),pt=Math.max(0,Math.min(_e,st));Math.abs(r.scrollTop-pt)<4||r.scrollTo({top:pt,behavior:U?"auto":"smooth"})}function me(P){let U=Array.isArray(P.trans)&&P.trans.length?P.trans.map(K=>`<span class="lyric__trans">${n(K)}</span>`).join(""):"";return`${n(P.text)}${U}`}function le(P,U){let K=`data-time="${P.time}" data-lyric-index="${U}"`;return s?`<div class="lyric" role="button" tabindex="0" ${K}>${me(P)}</div>`:`<div class="lyric" ${K}>${me(P)}</div>`}function ke(P){let U=o[P],K=ye(P),_e=U?.words;if(!K||!Array.isArray(_e)||!_e.length)return;let st=On(U.text);if(!st.length||st.length!==_e.length)return;let pt=Array.isArray(U.trans)&&U.trans.length?U.trans.map(go=>`<span class="lyric__trans">${n(go)}</span>`).join(""):"",Sm=st.map((go,xm)=>`<span class="lyric__word" data-i="${xm}" data-active="false">${n(go)}</span>`).join("");K.innerHTML=Sm+pt,h=P,v=Array.from(K.querySelectorAll(".lyric__word")),w=_e,k=sc(_e,o[P+1]?.time),L=new Array(_e.length).fill(-1),C=-1}function Le(P){if(P<0)return;let U=o[P],K=ye(P);U&&K&&(K.innerHTML=me(U))}function Fe(){h>=0&&h!==l&&(Le(h),h=-1,v=[],w=null,k=null,L=null,C=-1),l>=0&&h!==l&&ke(l)}function Y(P){if(h<0||!w||!v.length)return;for(let K=0;K<v.length;K+=1){let _e=w[K],st=k?.[K]??_e,pt=I_(_e,st,P);L&&L[K]===pt||(L&&(L[K]=pt),v[K].style.setProperty("--w",String(pt)))}let U=0;for(;U<w.length&&w[U]<=P;)U+=1;if(U!==C){C=U;for(let K=0;K<v.length;K+=1){let _e=K<U?"true":"false",st=v[K];st.dataset.active!==_e&&(st.dataset.active=_e)}}}let Z=700;function Ie(){return typeof performance<"u"&&performance.now?performance.now():Date.now()}function Te(){return l>=0&&h===l&&Array.isArray(w)&&w.length>0}function Jt(){if(W=0,p||!q||!Te())return;let P=Ie()-S;if(P>Z){he(O);return}he(O+P),W=requestAnimationFrame(Jt)}function V(){if(!(q&&Te()&&typeof requestAnimationFrame=="function"&&typeof cancelAnimationFrame=="function")){W&&(cancelAnimationFrame(W),W=0);return}W||(W=requestAnimationFrame(Jt))}function de(P){if(q=!!P,q)S=Ie();else{let U=Math.min(Math.max(0,Ie()-S),Z);O=he(O+U),S=Ie()}V()}function ee(P,U={}){if(o=Array.isArray(P)?P:[],l=-1,h=-1,v=[],w=null,k=null,L=null,C=-1,M=-1,V(),!o.length){ce(U);return}r.innerHTML=o.map((K,_e)=>le(K,_e)).join(""),r.scrollTop=0}function ce(P={}){let U=P.emptyText||"\u6682\u65E0\u6B4C\u8BCD",K=P.emptyHint?`<div class="lyrics__empty-text">${n(P.emptyHint)}</div>`:"",_e=s&&P.showOpenFolder!==!1?'<button class="btn btn--sm" type="button" data-lyrics-act="open-folder"><span>\u6253\u5F00\u6240\u5728\u6587\u4EF6\u5939</span></button>':"";r.innerHTML=`
      <div class="lyrics__empty">
        <svg class="lyrics__empty-icon" aria-hidden="true"><use href="#i-lyrics"/></svg>
        <div class="lyrics__empty-text">${n(U)}</div>
        ${K}
        ${_e}
      </div>`}function ye(P){return r.querySelector(`.lyric[data-lyric-index="${P}"]`)}function pe(P,U={}){if(z=P,p||!r.querySelector(".lyric")||P===l&&!U.immediate)return;let K=l>=0&&l!==P?ye(l):null;l=P,r.querySelectorAll(".lyric").forEach((_e,st)=>{let pt=st===P;_e.setAttribute("aria-current",String(pt)),_e.dataset.past=String(P>=0&&st<P),pt&&_e.removeAttribute("data-exit")}),K&&(K.dataset.exit="1"),Fe(),he(O),!(Date.now()<c)&&se(P,{immediate:!!U.immediate})}function xt(P,U={}){typeof U.playing=="boolean"&&(q=U.playing),O=U.immediate?P:qt(M,P),S=Ie(),M=O,pe(ln(o,O),U),Y(O),V()}function he(P){return M=qt(M,P),Y(M),M}function Oe(){p=!0,d&&clearTimeout(d),d=null,W&&(cancelAnimationFrame(W),W=0),r.removeEventListener("wheel",T),r.removeEventListener("touchmove",T),r.removeEventListener("pointerdown",T),r.removeEventListener("click",R),r.removeEventListener("keydown",X),a.remove()}return{element:a,scrollElement:r,setLines:ee,setActive:pe,setPosition:xt,setPlaying:de,destroy:Oe,get lines(){return o},get activeIndex(){return l}}}function P_(e){return String(e??"").replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}var Tp=1200;function D_(e){return String(e??"").replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}function L_(e,t={}){let n=t.escape||D_,s=t.interactive!==!1,a=document.createElement("div");a.className="fxl",s||(a.dataset.passive="1");let r=document.createElement("div");r.className="fxl__scroll";let o=document.createElement("div");o.className="fxl__inner",r.appendChild(o),a.appendChild(r),e.appendChild(a);let l=[],c=[],d=[],p=-1,h=-1,v=0,w=null,k=!1,C=-1,L=-1,O=700,S=0,q=0,W=!1,M=0;function T(){return typeof performance<"u"&&performance.now?performance.now():Date.now()}let R=()=>{v=Date.now()+Tp,w&&clearTimeout(w),w=setTimeout(()=>{w=null,!k&&(p=-2,ke(C,{immediate:!0}))},Tp+40)};s&&(r.addEventListener("wheel",R,{passive:!0}),r.addEventListener("touchmove",R,{passive:!0}),r.addEventListener("pointerdown",R,{passive:!0}));function X(V){let de=V.target.closest?.(".fxl__line");if(!de)return;let ee=Number(de.dataset.time);Number.isFinite(ee)&&t.onSeek?.(ee)}function z(V){if(V.key!=="Enter"&&V.key!==" ")return;let de=V.target.closest?.(".fxl__line");if(!de)return;V.preventDefault();let ee=Number(de.dataset.time);Number.isFinite(ee)&&t.onSeek?.(ee)}s&&(r.addEventListener("click",X),r.addEventListener("keydown",z));function se(V,de){if(V<0){r.scrollTo({top:0,behavior:de?"auto":"smooth"});return}let ee=d[V];if(!ee)return;let ce=ee.offsetTop-(r.clientHeight-ee.offsetHeight)/2,ye=Math.max(0,r.scrollHeight-r.clientHeight),pe=Math.max(0,Math.min(ce,ye));Math.abs(r.scrollTop-pe)<4||r.scrollTo({top:pe,behavior:de?"auto":"smooth"})}function me(V,de={}){if(l=Array.isArray(V)?V:[],c=[],d=[],p=-1,h=-1,C=-1,L=-1,Ie(),!l.length){o.innerHTML=`<div class="fxl__empty">${n(de.emptyText||"\u6682\u65E0\u6B4C\u8BCD")}</div>`;return}let ee=[];for(let ce=0;ce<l.length;ce+=1){let ye=l[ce].text??"",pe=On(ye);c.push(pe);let xt=pe.map((P,U)=>{let K=n(P);return`<span class="fxl__u"${/^\s+$/.test(P)?' data-space="1"':""} style="--i:${U};--n:${pe.length}">${K}</span>`}).join(""),he=s?`<div class="fxl__line" role="button" tabindex="0" data-index="${ce}" data-time="${l[ce].time}" data-state="todo" data-text="${n(ye)}">`:`<div class="fxl__line" data-index="${ce}" data-time="${l[ce].time}" data-state="todo" data-text="${n(ye)}">`,Oe=Array.isArray(l[ce].trans)&&l[ce].trans.length?l[ce].trans.map(P=>`<span class="fxl__trans">${n(P)}</span>`).join(""):"";ee.push(`${he}<span class="fxl__text">${xt}</span>${Oe}</div>`)}o.innerHTML=ee.join(""),d=Array.from(o.children)}function le(V,de){let ee=d[V];if(!ee)return;let ce=(c[V]||[]).length;if(!ce)return;let ye=l[V].words,pe;if(Array.isArray(ye)&&ye.length===ce)for(pe=0;pe<ce&&ye[pe]<=de;)pe+=1;else{let he=l[V].time,Oe=l[V+1]?.time??he+4e3,P=Math.max(1,Oe-he),U=Math.max(0,Math.min(1,(de-he)/P));pe=Math.max(0,Math.min(ce,Math.ceil(U*ce)))}if(pe===h)return;h=pe;let xt=Array.from(ee.querySelector(".fxl__text").children);for(let he=0;he<xt.length;he+=1){let Oe=xt[he],P=he<pe-1?"done":he===pe-1?"now":"todo";Oe.dataset.hold!==P&&(Oe.dataset.hold=P)}}function ke(V,de={}){if(C=V,!k&&d.length&&!(V===p&&!de?.immediate)){if(p>=0&&p<d.length){let ee=d[p];ee.dataset.state="past",ee.removeAttribute("aria-current");let ce=Array.from(ee.querySelector(".fxl__text").children);for(let ye=0;ye<ce.length;ye+=1)ce[ye].dataset.hold!=="done"&&(ce[ye].dataset.hold="done");p!==V&&(ee.dataset.exit="1")}if(p=V,h=-1,V>=0&&d[V]){let ee=d[V];ee.dataset.state="active",ee.setAttribute("aria-current","true"),ee.removeAttribute("data-exit"),ee.dataset.enter=String(Number(ee.dataset.enter||0)+1)}Date.now()<v||se(V,!!de?.immediate)}}function Le(V,de={}){typeof de.playing=="boolean"&&(W=de.playing),S=de.immediate?V:qt(L,V),L=S,q=T();let ee=ln(l,S);ee!==p&&ke(ee,de),ee>=0&&le(ee,S),Ie()}function Fe(V){return L=qt(L,V),p>=0&&le(p,L),L}function Y(V){if(W=!!V,W)q=T();else if(p>=0){let de=Math.min(Math.max(0,T()-q),O);S=Fe(S+de),q=T()}Ie()}function Z(){if(M=0,k||!W||p<0||!Array.isArray(l[p]?.words))return;let V=T()-q;if(V>O){Fe(S);return}Fe(S+V),M=requestAnimationFrame(Z)}function Ie(){if(!(W&&p>=0&&Array.isArray(l[p]?.words)&&typeof requestAnimationFrame=="function"&&typeof cancelAnimationFrame=="function")){M&&(cancelAnimationFrame(M),M=0);return}M||(M=requestAnimationFrame(Z))}function Te(){p>=0&&se(p,!0)}function Jt(){k=!0,w&&clearTimeout(w),w=null,M&&(cancelAnimationFrame(M),M=0),r.removeEventListener("wheel",R),r.removeEventListener("touchmove",R),r.removeEventListener("pointerdown",R),r.removeEventListener("click",X),r.removeEventListener("keydown",z),a.remove(),l=[],c=[],d=[]}return{element:a,scrollElement:r,setLines:me,setActive:ke,setPosition:Le,setPlaying:Y,markMeasure:Te,destroy:Jt,get lines(){return l},get activeIndex(){return p}}}function Wp(){if(typeof window>"u"||typeof window.matchMedia!="function")return!1;try{return window.matchMedia("(prefers-reduced-motion: reduce)").matches}catch{return!1}}var O_=[{id:"wide",x:0,y:0,r:0,z:0},{id:"dolly-in",x:.08,y:-.14,r:.1,z:.5},{id:"truck-left",x:-.9,y:.06,r:-.32,z:.1},{id:"truck-right",x:.9,y:-.06,r:.32,z:.1},{id:"crane-up",x:.14,y:-.85,r:.2,z:.16},{id:"crane-down",x:-.14,y:.85,r:-.2,z:.16},{id:"orbit-left",x:.6,y:-.34,r:-.9,z:.28},{id:"orbit-right",x:-.6,y:.34,r:.9,z:.28},{id:"dolly-out",x:-.1,y:.1,r:-.08,z:-.4}],R_={ampX:58,ampY:38,rot:2.4,zoom:.03,base:1.012,handX:16,handY:12,handR:.45,handZ:.008,speed:1,seed:0,maxFps:60,shotMin:9,shotMax:16,shots:null},Yl=(e,t,n)=>Math.max(t,Math.min(n,e)),q_=e=>e*e*(3-2*e),Yi=(e,t,n)=>e+(t-e)*n;function N_(e,t={}){let n={...R_,...t},s=Array.isArray(n.shots)&&n.shots.length?n.shots:O_,a={addLayer:()=>()=>{},pulse(){},setEnabled(){},setMaxFps(){},destroy(){},sample:()=>null,get enabled(){return!1}};if(!e)return a;let r=n.seed*1.37+.7,o=n.seed*2.11+2.3,l=n.seed*.73+4.1,c=n.maxFps>0?1e3/n.maxFps-1:0,d=[{el:e,depth:1,scale:!0}],p=!0,h=!1,v=0,w=0,k=s[0],C=s[0],L=-1e9,O=1,S=0,q=Math.floor(n.seed*9301+49297)%233280||12345;function W(){return q=(q*9301+49297)%233280,q/233280}let M=-1e9,T=1.2,R=0,X={x:0,y:0,r:0,z:1};function z(Y){if(Y<S)return;k={id:"blend",...se(1)};let Z=s[Math.floor(W()*s.length)];Z===C&&s.length>1&&(Z=s[(s.indexOf(Z)+1)%s.length]),C=Z,L=Y,O=Math.max(1e3,(n.shotMin+W()*Math.max(.1,n.shotMax-n.shotMin))*1e3),S=Y+O}function se(Y){let Z=q_(Yl(Y,0,1));return{x:Yi(k.x,C.x,Z),y:Yi(k.y,C.y,Z),r:Yi(k.r,C.r,Z),z:Yi(k.z,C.z,Z)}}function me(Y){z(Y);let Z=Yl((Y-L)/O,0,1),Ie=se(Z),Te=Y/1e3*n.speed,Jt=Math.sin(Te*.11+r)*.6+Math.sin(Te*.047+r*1.7)*.4,V=Math.sin(Te*.083+o)*.6+Math.sin(Te*.037+o*1.7)*.4,de=Math.sin(Te*.059+l)*.6+Math.sin(Te*.029+l*1.7)*.4,ee=Math.sin(Te*.041+r*.6)*.6+Math.sin(Te*.017+o*.6)*.4,ce=Ie.x*n.ampX+Jt*n.handX,ye=Ie.y*n.ampY+V*n.handY,pe=Ie.r*n.rot+de*n.handR,xt=n.base+Ie.z*n.zoom+ee*n.handZ;if(R>0){let he=(Y-M)/(T*1e3);if(he>=1)R=0;else if(he>=0){let Oe=Math.pow(Math.sin(Math.PI*he),2);ce+=Oe*R*150,ye+=Oe*R*-28,pe+=Oe*R*2.6,xt+=Oe*R*.05}}X={x:ce,y:ye,r:pe,z:xt};for(let he of d){let Oe=he.depth,P="translate3d("+(ce*Oe).toFixed(2)+"px, "+(ye*Oe).toFixed(2)+"px, 0) rotate("+(pe*Oe).toFixed(3)+"deg)";he.scale&&(P+=" scale("+(1+(xt-1)*Oe).toFixed(4)+")"),he.el.style.transform=P}}function le(Y){if(v=0,!(!p||h)){if(c>0&&Y-w<c){v=requestAnimationFrame(le);return}w=Y,me(Y),v=requestAnimationFrame(le)}}function ke(){v||!p||h||Wp()||(v=requestAnimationFrame(le))}function Le(){v&&cancelAnimationFrame(v),v=0}function Fe(){document.hidden?Le():ke()}return document.addEventListener("visibilitychange",Fe),S=0,me(performance.now()),ke(),{addLayer(Y,Z={}){if(!Y)return()=>{};let Ie={el:Y,depth:typeof Z.depth=="number"?Z.depth:1,scale:Z.scale!==!1};return d.push(Ie),()=>{let Te=d.indexOf(Ie);Te>=0&&d.splice(Te,1),Y.style.transform=""}},pulse(Y=1,Z=1.2){M=performance.now(),R=Yl(Y,0,1.5),T=Z},setEnabled(Y){if(p=!!Y,p)ke();else{Le();for(let Z of d)Z.el.style.transform=""}},setMaxFps(Y){let Z=Number(Y);c=Number.isFinite(Z)&&Z>0?1e3/Z-1:0,w=0},destroy(){h=!0,Le(),document.removeEventListener("visibilitychange",Fe);for(let Y of d)Y.el.style.transform="";d.length=1},sample(){return{...X}},get enabled(){return p}}}function F_(e){if(!e)throw new Error("createBackgroundLayer: \u7F3A\u5C11\u5BBF\u4E3B\u5BB9\u5668\uFF08ctx.backgroundRoot\uFF09");e.innerHTML=`
    <img class="skin-bg__img" alt="" />
    <div class="skin-bg__veil"></div>
    <div class="skin-bg__grain"></div>`;let t=e.querySelector(".skin-bg__img"),n="",s=!1;t&&(t.addEventListener("load",()=>{t.style.opacity="1"}),t.addEventListener("error",()=>{t.style.opacity="0"}));function a(){e.hidden=!s||!n}function r(o){let l=o||"";l!==n&&(n=l,t&&(t.naturalWidth||(t.style.opacity="0"),t.src=l),a())}return{element:e,setEnabled(o){s=!!o,a()},setImage:r,setStyle(o={}){typeof o.blur=="number"&&e.style.setProperty("--skin-bg-blur",`${o.blur}px`),typeof o.scale=="number"&&e.style.setProperty("--skin-bg-scale",String(o.scale)),typeof o.brightness=="number"&&e.style.setProperty("--skin-bg-brightness",String(o.brightness)),o.veil&&e.style.setProperty("--skin-bg-veil",o.veil)},destroy(){e.hidden=!0,e.innerHTML="",e.removeAttribute("style"),n="",s=!1}}}var B_=42,U_=.1,W_=1;function z_(e){let t=e;if(t.__mpMarquee)return t.__mpMarquee;let n=e.querySelector(":scope > .mp-marquee__text");n||(n=document.createElement("span"),n.className="mp-marquee__text",e.replaceChildren(n)),e.classList.add("mp-marquee");let s={text:n,value:null,ro:null};return t.__mpMarquee=s,typeof ResizeObserver=="function"&&(s.ro=new ResizeObserver(()=>zp(e,s)),s.ro.observe(e)),s}function zp(e,t){let n=e.clientWidth,s=Math.max(t.text.scrollWidth,t.text.offsetWidth)-n;if(n<=0||s<=W_){e.removeAttribute("data-marquee"),e.style.removeProperty("--mp-marquee-shift"),e.style.removeProperty("--mp-marquee-dur");return}let a=s/B_/(1-U_*2);e.style.setProperty("--mp-marquee-shift",`-${Math.round(s)}px`),e.style.setProperty("--mp-marquee-dur",`${a.toFixed(2)}s`),e.setAttribute("data-marquee","on")}function H_(e,t){if(!e)return;let n=z_(e),s=t==null?"":String(t);n.value!==s&&(n.value=s,n.text.textContent=s),zp(e,n)}var j_=700,V_=.82,K_=2.8;function Zl(e,t){let n=Number(e)>0?Number(e):0,s=Number(t)>0?Number(t):0,a=Math.min(n||Number.POSITIVE_INFINITY,s||Number.POSITIVE_INFINITY);return Number.isFinite(a)?Math.max(V_,Math.min(K_,a/j_)):1}function Hp(e){return e&&(e.clientWidth||e.clientHeight)?Zl(e.clientWidth,e.clientHeight):typeof window<"u"?Zl(window.innerWidth,window.innerHeight):1}function G_(e,t){let n=Hp(e);return e&&t&&e.style.setProperty(t,n.toFixed(4)),n}var Y_=Object.freeze({id:"",title:"",artist:"",album:"",duration:0,kind:"local"});function Ep(e){return String(e??"").replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}function X_(e,t,n){if(!e)return;let s=t||n;s&&e.getAttribute("src")!==s&&(e.dataset.failed="",e.src=s),e.onerror=()=>{e.dataset.failed!=="1"&&(e.dataset.failed="1",n&&(e.src=n))}}function J_(e){let t=typeof e?.statusText=="string"?e.statusText.trim():"";if(t)return t;switch(e?.status){case"loading":case"matching":return"\u6B4C\u8BCD\u5339\u914D\u4E2D\u2026";case"failed":return"\u6B4C\u8BCD\u5339\u914D\u5931\u8D25";case"none":return"\u6682\u65E0\u6B4C\u8BCD"}return e?.source==="online"?"\u5728\u7EBF\u5339\u914D\u5931\u8D25":"\u6682\u65E0\u6B4C\u8BCD"}function Q_(e,t){let n=String(e??"").trim(),s=String(t??"").trim();return n&&s?`${n} \xB7 ${s}`:n||s||"\u2014"}function Z_(e,t,n){return Math.min(n,Math.max(t,Number(e)||0))}function e0(e,t=200){let n=0;return(...s)=>{clearTimeout(n),n=setTimeout(()=>e(...s),t)}}function t0(){return{define:Np,createLyricsView:E_,createFxLyrics:L_,createCamera:N_,createBackgroundLayer:F_,marqueeText:H_,steadyPosition:qt,POSITION_HOLD_MS:Xa,applyFit:G_,fitScale:Zl,fitScaleOf:Hp,parseLrc:bs,splitGraphemes:On,findLyricIndex:ln,formatLrcTime:cn,lyricDisplayText:ys,html:{EMPTY_TRACK:Y_,escapeHtml:Ep,setCoverImage:X_,subtitleOf:Q_,lyricsEmptyText:J_},util:{clamp:Z_,esc:Ep,debounce:e0,prefersReducedMotion:Wp},version:Rp}}var n0="classic",er=new Map,ga=[];function rc(e){if(!e)return;let t=ga.findIndex(n=>n.id===e.id);t>=0?ga[t]=e:ga.push(e)}function jp(){ga.length=0}function s0(e){let t=Np(e);return er.set(t.id,t),t}function Rn(){return[...er.values()].sort((e,t)=>e.order-t.order||String(e.id).localeCompare(String(t.id)))}function Qi(e){return er.get(e)??null}function Vp(e){let t=String(e??"").trim();return!t||ga.some(n=>n.id===t)?!1:(tc(t),er.delete(t))}function va(e){let t=Qi(e);return t?{skin:t,fellBack:!1}:{skin:Qi(n0)||Rn()[0],fellBack:!0}}var ec=new Map;function Pp(e){return String(e).replace(/["\\]/g,"\\$&")}function a0(){return typeof CSSScopeRule<"u"}function i0(e,t,n){let s=[`.playerview[data-skin="${Pp(t)}"]`];n&&s.push(`.skin-bg[data-skin="${Pp(t)}"]`);let a=`@scope (${s.join(", ")})`;return a0()?`@layer skin {
${a} {
${e}
}
}`:(console.warn("[skins] \u5F53\u524D\u5185\u6838\u4E0D\u652F\u6301 @scope\uFF0C\u63D2\u4EF6 CSS \u53EA\u505A\u4E86 @layer \u5305\u88C5\uFF08\u5EFA\u8BAE\u66F4\u65B0 WebView2\uFF09"),`@layer skin {
${e}
}`)}function tc(e){let t=String(e??"").trim();if(t&&(ec.get(t)?.remove(),ec.delete(t),!(typeof document>"u"||typeof document.querySelectorAll!="function")))for(let n of document.querySelectorAll("style[data-skin]"))n.getAttribute("data-skin")===t&&n.remove()}var Xi=new Map;function r0(e,t){return`${e.join("\0")}${t?.background===!0}`}function o0(e,t,n={}){let s=String(e??""),a=(t||[]).filter(Boolean),r=r0(a,n),o=Xi.get(s);if(o&&o.signature===r)return o.chain;let l={signature:r,chain:null};return l.chain=(o?o.chain.catch(()=>{}):Promise.resolve()).then(()=>l0(s,a,n)).finally(()=>{Xi.get(s)===l&&Xi.delete(s)}),Xi.set(s,l),l.chain}async function l0(e,t,n){if(!t.length){tc(e);return}let s=await Promise.all(t.map(async r=>{let o=await fetch(r,{cache:"no-store"});if(!o.ok)throw new Error(`\u8BFB\u53D6\u6837\u5F0F\u8868\u5931\u8D25\uFF08${o.status}\uFF09\uFF1A${r}`);return o.text()})),a=document.createElement("style");a.dataset.skin=e,a.textContent=i0(s.join(`
`),e,n.background===!0),tc(e),document.head.appendChild(a),ec.set(e,a)}async function Kp(e){let t=e?.manifest;if(!t||!t.id)throw new Error("\u6E05\u5355\u7F3A\u5C11 id");if(!t.name)throw new Error(`\u6837\u5F0F ${t.id} \u7684\u6E05\u5355\u7F3A\u5C11 name`);let n=qp(t.apiVersion);if(!n.ok)throw new Error(n.reason);let s=await import(String(e.moduleUrl)),a=Zi(t.colors),r=y_(s,t,{builtin:e.builtin===!0,source:e.source||"",iconUrl:e.iconUrl||"",colorsMissing:a.missing});if(!r.ok||!r.skin)throw new Error(r.reason||"\u63D2\u4EF6\u4E0D\u5408\u6CD5");let o=r.skin;return o.chrome=a,await o0(o.id,e.cssUrls||o.styles,{background:o.background}),s0(o),o.builtin&&rc(o),o}var Dp=5;function Gp(e){let t=e.root,n=e.view||null,s=e.app||null,a=e.source,r=t0(),o=new Map,l=null,c=null,d=null,p=0,h=!1,v=!1;function w(){return{root:t,backgroundRoot:e.backgroundRoot,sdk:r,defaultCover:a.defaultCover,get themeId(){return document.documentElement.dataset.theme||""},get mode(){return document.documentElement.dataset.mode==="light"?"light":"dark"},get interactive(){return a.options().interactive!==!1},playback:()=>a.playback(),media:()=>a.media(),track:()=>a.media().song,lyrics:()=>a.media().lyrics,covers:()=>{let S=a.media();return{list:S.covers,index:S.coverIndex,current:S.cover}},options:()=>a.options(),env:()=>a.env(),spectrum(){return l?l.spectrum?a.spectrum?.()??null:(v||(v=!0,console.warn(`[skins] ${l.id} \u8BFB\u4E86 ctx.spectrum()\uFF0C\u4F46\u6E05\u5355\u6CA1\u58F0\u660E capabilities.spectrum \u2014\u2014 \u5DF2\u8FD4\u56DE null\u3002\u8981\u9891\u8C31\u8BF7\u5728 skin.json \u91CC\u52A0 "capabilities": { "spectrum": true }`)),null):null},actions:a.actions,on(S,q){return typeof q!="function"?()=>{}:(o.has(S)||o.set(S,new Set),o.get(S).add(q),()=>o.get(S)?.delete(q))}}}function k(S){if(!(!l||!d)){try{l.update?.(d,S),p=0}catch(q){p+=1,console.warn(`[skins] ${c} \u5904\u7406 ${S.type} \u66F4\u65B0\u5931\u8D25`,q),p===Dp&&console.error(`[skins] ${c} \u8FDE\u7EED ${Dp} \u6B21\u66F4\u65B0\u629B\u9519\uFF1B\u5BBF\u4E3B\u4F1A\u7EE7\u7EED\u63A8\uFF0C\u4F46\u8FD9\u5957\u6837\u5F0F\u5F88\u53EF\u80FD\u5DF2\u7ECF\u663E\u793A\u5F02\u5E38`)}for(let[q,W]of o)if(!(q!==S.type&&q!=="*"))for(let M of W)try{M(S)}catch(T){console.warn(`[skins] ${q} \u8BA2\u9605\u56DE\u8C03\u5931\u8D25`,T)}}}function C(S){h=!!S&&!!s;let q=document.documentElement;if(!h||!l)return Gl(q),e.onChromeApplied?.(!1,null),!1;let W=l.chrome||Zi(l.colors),M=W.vars||{};return W.theme||!M["--chrome-bg"]||!M["--chrome-fg"]?(Gl(q),e.onChromeApplied?.(!1,l),!1):($_(q,W),e.onChromeApplied?.(!0,l),!0)}function L(S,q={}){O(),l=S,c=S.id,p=0,v=!1,n&&(n.dataset.skin=S.id,n.dataset.theme=S.id,n.dataset.skinBackground=S.background?"yes":"no"),s&&(s.dataset.skinBackground=S.background?"yes":"no"),e.backgroundRoot&&(e.backgroundRoot.dataset.skin=S.id),d=w();try{S.mount(d)}catch(W){return console.error(`[skins] ${S.id} \u6302\u8F7D\u5931\u8D25`,W),t.innerHTML=`<div class="skin-error">\u6837\u5F0F\u300C${Lp(S.name)}\u300D\u52A0\u8F7D\u5931\u8D25\uFF1A${Lp(W?.message??W)}</div>`,!1}return k({type:"mount",...a.media(),...a.playback(),options:a.options()}),!0}function O(){if(l){k({type:"close"}),k({type:"destroy"});try{l.destroy?.(d)}catch(S){console.warn(`[skins] ${c} \u5378\u8F7D\u5931\u8D25`,S)}t.innerHTML="";for(let S of o.values())S.clear();l=null,d=null,c=null,p=0,Gl(document.documentElement)}}return{sdk:r,push:k,mount:L,unmount:O,applyChrome:C,get skin(){return l},get mountedId(){return c},get ctx(){return d},get chromeActive(){return h}}}function Lp(e){return String(e??"").replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}var _d=(e,t=_d,n=t.f||(t.f=["assets/base-CHhaFQkA.js","assets/position-DUwumgXj.js"]))=>e.map(s=>n[s]),p0="modulepreload",h0=function(e){return"/"+e},Zp={},Vn=function(e,t,n){let s=Promise.resolve();if(t&&t.length>0){let r=function(c){return Promise.all(c.map(d=>Promise.resolve(d).then(p=>({status:"fulfilled",value:p}),p=>({status:"rejected",reason:p}))))};document.getElementsByTagName("link");let o=document.querySelector("meta[property=csp-nonce]"),l=o?.nonce||o?.getAttribute("nonce");s=r(t.map(c=>{if(c=h0(c),c in Zp)return;Zp[c]=!0;let d=c.endsWith(".css"),p=d?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${c}"]${p}`))return;let h=document.createElement("link");if(h.rel=d?"stylesheet":p0,d||(h.as="script"),h.crossOrigin="",h.href=c,l&&h.setAttribute("nonce",l),document.head.appendChild(h),d)return new Promise((v,w)=>{h.addEventListener("load",v),h.addEventListener("error",()=>w(new Error(`Unable to preload CSS for ${c}`)))})}))}function a(r){let o=new Event("vite:preloadError",{cancelable:!0});if(o.payload=r,window.dispatchEvent(o),!o.defaultPrevented)throw r}return s.then(r=>{for(let o of r||[])o.status==="rejected"&&a(o.reason);return e().catch(a)})},f0={CHILD:2},wd=e=>(...t)=>({_$litDirective$:e,values:t}),$d=class{constructor(e){}get _$AU(){return this._$AM._$AU}_$AT(e,t,n){this._$Ct=e,this._$AM=t,this._$Ci=n}_$AS(e,t){return this.update(e,t)}update(e,t){return this.render(...t)}},{I:m0}=pl,eh=e=>e,th=()=>document.createComment(""),ba=(e,t,n)=>{let s=e._$AA.parentNode,a=t===void 0?e._$AB:t._$AA;if(n===void 0){let r=s.insertBefore(th(),a),o=s.insertBefore(th(),a);n=new m0(r,o,e,e.options)}else{let r=n._$AB.nextSibling,o=n._$AM,l=o!==e;if(l){let c;n._$AQ?.(e),n._$AM=e,n._$AP!==void 0&&(c=e._$AU)!==o._$AU&&n._$AP(c)}if(r!==a||l){let c=n._$AA;for(;c!==r;){let d=eh(c).nextSibling;eh(s).insertBefore(c,a),c=d}}}return n},qn=(e,t,n=e)=>(e._$AI(t,n),e),g0={},tf=(e,t=g0)=>e._$AH=t,v0=e=>e._$AH,oc=e=>{e._$AR(),e._$AA.remove()},nh=(e,t,n)=>{let s=new Map;for(let a=t;a<=n;a++)s.set(e[a],a);return s},ut=wd(class extends $d{constructor(e){if(super(e),e.type!==f0.CHILD)throw Error("repeat() can only be used in text expressions")}dt(e,t,n){let s;n===void 0?n=t:t!==void 0&&(s=t);let a=[],r=[],o=0;for(let l of e)a[o]=s?s(l,o):o,r[o]=n(l,o),o++;return{values:r,keys:a}}render(e,t,n){return this.dt(e,t,n).values}update(e,[t,n,s]){let a=v0(e),{values:r,keys:o}=this.dt(t,n,s);if(!Array.isArray(a))return this.ut=o,r;let l=this.ut??(this.ut=[]),c=[],d,p,h=0,v=a.length-1,w=0,k=r.length-1;for(;h<=v&&w<=k;)if(a[h]===null)h++;else if(a[v]===null)v--;else if(l[h]===o[w])c[w]=qn(a[h],r[w]),h++,w++;else if(l[v]===o[k])c[k]=qn(a[v],r[k]),v--,k--;else if(l[h]===o[k])c[k]=qn(a[h],r[k]),ba(e,c[k+1],a[h]),h++,k--;else if(l[v]===o[w])c[w]=qn(a[v],r[w]),ba(e,a[h],a[v]),v--,w++;else if(d===void 0&&(d=nh(o,w,k),p=nh(l,h,v)),d.has(l[h]))if(d.has(l[v])){let C=p.get(o[w]),L=C!==void 0?a[C]:null;if(L===null){let O=ba(e,a[h]);qn(O,r[w]),c[w]=O}else c[w]=qn(L,r[w]),ba(e,a[h],L),a[C]=null;w++}else oc(a[v]),v--;else oc(a[h]),h++;for(;w<=k;){let C=ba(e,c[k+1]);qn(C,r[w]),c[w++]=C}for(;h<=v;){let C=a[h++];C!==null&&oc(C)}return this.ut=o,tf(e,c),Je}}),Hr=14,jr=72,b0=16;function kd(e){let t=Math.round(Number(e));return!Number.isFinite(t)||t<=0?`${b0}px`:`${Math.min(jr,Math.max(Hr,t))}px`}var y0=[{id:"flat-dark",name:"\u7B80\u7EA6\u6DF1\u8272",mode:"dark",builtin:!0,swatch:["#101113","#1b1d21","#3b4048","#e6e8eb","#4d95ff"]},{id:"flat-light",name:"\u7B80\u7EA6\u6D45\u8272",mode:"light",builtin:!0,swatch:["#f5f6f7","#ffffff","#d7dae0","#1a1c20","#43536b"]},{id:"cover-dark",name:"\u5C01\u9762\u53D6\u8272 \xB7 \u6DF1\u8272",mode:"dark",builtin:!0,swatch:["#0b0b12","#2a2a31","#6b6b76","#f7f7fa","#ff4d6d"]}],ze=y0.slice(),nf=0;function _0(){return nf}function Fs(){return ze}function Kc(e){return ze.find(t=>t.id===e)||ze[0]}async function Na(){if(!x())return ze;try{let e=await y.listThemes();if(!Array.isArray(e)||!e.length)return ze;for(let t of e){if(!t?.id)continue;let n=await y.loadTheme(t.id);typeof n=="string"&&n.trim()&&k0(t.id,n)}w0(e)}catch(e){console.warn("[theme] \u4E3B\u9898\u76EE\u5F55\u626B\u63CF\u5931\u8D25",e)}return ze}function w0(e){let t=[],n=new Set;for(let s of e){if(!s?.id||n.has(s.id))continue;n.add(s.id);let a={id:s.id,name:s.name||s.id,mode:s.mode||"dark",swatch:Array.isArray(s.swatch)?s.swatch:[],builtin:!!s.builtin},r=ze.find(o=>o.id===s.id);r?(Object.assign(r,a),t.push(r)):t.push(a)}for(let s of ze)t.includes(s)||os(`theme-file-${s.id}`,"");return ze.length=0,ze.push(...t),nf+=1,ze}async function $0(e){return await y.deleteTheme(e),await Na(),{removed:!ze.some(t=>t.id===e),themeIds:ze.map(t=>t.id)}}function k0(e,t){os(`theme-file-${e}`,t)}var S0=["--seed","--seed-2","--bg-app","--bg-window"],x0=["--seed","--seed-2"];function C0(e){return document.documentElement.style.getPropertyValue(e).trim()?String(document.documentElement.style.getPropertyValue(e)):null}function A0(){let e=document.documentElement,t={};for(let n of x0){let s=C0(n);s&&(t[n]=s)}for(let n of S0)e.style.removeProperty(n);return t}var fr="cover-dark";function Ra(e){return!!e&&!zo(e)}var sh=null,lc=null,cc=null;async function Dt(e){let t=document.documentElement,n=window.matchMedia("(prefers-color-scheme: dark)").matches,s=A0();s["--seed"]&&(lc=s["--seed"]),s["--seed-2"]&&(cc=s["--seed-2"]);let a=e.theme||"flat-dark";if(e.themeMode==="system"){let p=n?"dark":"light",h=ze.find(v=>v.mode===p&&v.id!=="cover-dark");h&&(a=h.id)}else if(ze.find(p=>p.id===a)?.mode!==e.themeMode){let p=ze.find(h=>h.mode===e.themeMode&&h.id!=="cover-dark");p&&(a=p.id)}t.dataset.theme=a,t.dataset.mode=ze.find(p=>p.id===a)?.mode||e.themeMode||"dark",e.theme=a;let r=ah(e,a),o=ah(e,a,!0),l=e.accentFromCover!==!1;(e.accentFromCover===!1||sh!==null&&a!==fr)&&(lc=null,cc=null);let c=r??(l?lc:null),d=o??cc??c;return Tn({"--glass-blur":e.glassBlurCustom?`${e.glassBlur}px`:null,"--dur":ta(e),"--lyric-size":kd(e.lyricsFontSize),"--seed":c,"--seed-2":d}),sh=c&&a===fr?fr:null,E0(),I0(),e.glassAlphaCustom&&Sd(e.glassAlpha),a}function ah(e,t,n=!1){return!e||e.accentFromCover!==!0||t!=="cover-dark"?null:Ds(n?e.coverSeed2:e.coverSeed)||null}function Gc(e=i.config.theme){let t=Fs();if(!t.length)return null;let n=t.findIndex(s=>s.id===e);return t[(n+1)%t.length]}async function M0(){let e=Gc();e&&(i.config.theme=e.id,i.config.themeMode=e.mode,await Dt(i.config),$(),m(`\u5DF2\u5207\u6362\u5230\u4E3B\u9898\u300C${e.name}\u300D`,{duration:1500}))}var _s=null;function mr(e){return _s||(_s=document.createElement("div"),_s.style.cssText="position:absolute;left:-9999px;top:-9999px;width:1px;height:1px;pointer-events:none;",document.body.appendChild(_s)),_s.style.backgroundColor=e,getComputedStyle(_s).backgroundColor}function dc(e,t){let n=Math.max(0,Math.min(1,t)),s=String(e),a=s.match(/rgba?\(([^)]+)\)/);if(a){let o=a[1].split(/[,/]/).map(p=>parseFloat(p.trim())),[l,c,d]=o;if([l,c,d].every(p=>Number.isFinite(p)))return`rgba(${Math.round(l)}, ${Math.round(c)}, ${Math.round(d)}, ${n})`}let r=s.match(/color\(\s*srgb\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)/i);if(r){let[o,l,c]=r.slice(1,4).map(d=>Math.round(parseFloat(d)*255));if([o,l,c].every(d=>Number.isFinite(d)))return`rgba(${o}, ${l}, ${c}, ${n})`}return null}function Yc(){let e=String(mr("var(--glass-bg)")),t=e.match(/rgba\(\s*[\d.]+\s*,\s*[\d.]+\s*,\s*[\d.]+\s*,\s*([\d.]+)\s*\)/),n=e.match(/\/\s*([\d.]+)\s*\)/),s=parseFloat(t&&t[1]||n&&n[1]||"");return Number.isFinite(s)?Math.round(s*100):62}var gr=null;function I0(){gr=null}function T0(){return gr||(Tn({"--glass-bg":null,"--glass-bg-strong":null,"--glass-bg-weak":null}),gr={bg:mr("var(--glass-bg)"),strong:mr("var(--glass-bg-strong)"),weak:mr("var(--glass-bg-weak)")},gr)}function Sd(e){let t=Math.max(0,Math.min(1,(Number(e)||0)/100)),n=T0();Tn({"--glass-bg":dc(n.bg,t),"--glass-bg-strong":dc(n.strong,Math.min(1,t+.18)),"--glass-bg-weak":dc(n.weak,Math.max(0,t-.22))})}function E0(){let e=document.body;e&&(e.dataset.styleEpoch=String((Number(e.dataset.styleEpoch)||0)+1))}function P0(){let e=getComputedStyle(document.documentElement).getPropertyValue("--glass-blur"),t=parseFloat(e);return Number.isFinite(t)?t:22}function Ds(e){let t=String(e??"").trim();if(!t)return"";let n=t.match(/^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/);if(n){let a=n[1].toLowerCase();return a.length===3&&(a=a[0]+a[0]+a[1]+a[1]+a[2]+a[2]),`#${a}`}let s=t.match(/rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)/i);if(s){let a=r=>Math.max(0,Math.min(255,Math.round(Number(r)))).toString(16).padStart(2,"0");return`#${a(s[1])}${a(s[2])}${a(s[3])}`}return""}var ih="";function D0(e){let t=document.documentElement.dataset.theme||"",n=typeof e=="string"?e.trim():"",s=t===fr?n:"";s!==ih&&(ih=s,Tn({"--cover-bg":s?`url("${s.replace(/["\\]/g,"\\$&")}")`:null}))}function L0(e,t){let n=Ds(e),s=Ds(t)||n;return n?(Tn({"--seed":n,"--seed-2":s}),i.config.coverSeed!==n||i.config.coverSeed2!==s?(i.config.coverSeed=n,i.config.coverSeed2=s,R0(),!0):!1):!1}var O0="music-player.cover-seed.v1";function R0(){try{localStorage.setItem(O0,JSON.stringify({seed:i.config.coverSeed||"",seed2:i.config.coverSeed2||"",theme:i.config.theme||""}))}catch{}}function rh(e){try{let t=document.createElement("canvas"),n=32;t.width=n,t.height=n;let s=t.getContext("2d",{willReadFrequently:!0});s.drawImage(e,0,0,n,n);let{data:a}=s.getImageData(0,0,n,n),r=0,o=0,l=0,c=0,d=0,p=0,h=0,v=0;for(let k=0;k<a.length;k+=4){if(a[k+3]<8)continue;let C=a[k],L=a[k+1],O=a[k+2];d+=C,p+=L,h+=O,v+=1;let S=Math.max(C,L,O),q=Math.min(C,L,O);if(S<26)continue;let W=S===0?0:(S-q)/S;if(W<.12)continue;let M=W*W*(.35+S/255);r+=C*M,o+=L*M,l+=O*M,c+=M}let w=c>0?[r/c,o/c,l/c]:v>0?[d/v,p/v,h/v]:null;return w?`rgb(${w.map(k=>Math.round(Math.max(0,Math.min(255,k)))).join(", ")})`:null}catch{return null}}function uc(){i.query="",$()}var pc=null;function q0(e){let t=typeof document>"u"?null:document,n=globalThis.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;if(!t?.startViewTransition||n||pc){e();return}let s=t.startViewTransition(async()=>{e(),await new Promise(r=>setTimeout(r,0))});pc=s;let a=()=>{pc=null};s.finished.then(a,a)}function As(e,t=null){if(i.settingsOpen&&Vr(),e==="settings"){sf();return}q0(()=>{i.view=e,i.playlistId=e==="playlist"?t:null,i.playerOpen=!1,i.query="",i.playlistSelecting=!1,i.selectedIds=new Set,i.queueOpen=!1,$()})}function sf(e=null){i.settingsOpen=!0,e&&(i.settingsSection=e),$()}function Vr(){i.settingsOpen=!1,$()}function N0(e=null){i.settingsOpen?Vr():sf(e)}function af(){return i.settingsOpen===!0}function F0(){i.settingsOpen&&(i.settingsRev=(i.settingsRev||0)+1,$(),Ve())}async function qa({manual:e=!1}={}){if(!i.scanning){i.scanText="\u6B63\u5728\u626B\u63CF\u97F3\u4E50\u6587\u4EF6\u5939\u2026",$();try{let t=await ma({silent:!e});t&&m(`\u626B\u63CF\u5B8C\u6210\uFF1A\u4FDD\u7559 ${N(t.kept)} \u9996${t.excluded?`\uFF0C\u8FC7\u6EE4 ${N(t.excluded)} \u4E2A`:""}${t.added?`\uFF0C\u65B0\u589E ${N(t.added)}`:""}${t.removed?`\uFF0C\u79FB\u9664 ${N(t.removed)}`:""}`,{tone:"success",duration:3600})}finally{i.scanning=!1,$()}}}var rf="music-player.search.history.v1",B0=20;function hc(){try{let e=localStorage.getItem(rf),t=e?JSON.parse(e):[];return Array.isArray(t)?t.filter(n=>typeof n=="string"&&n.trim()):[]}catch{return[]}}function fc(e){try{localStorage.setItem(rf,JSON.stringify(e.slice(0,B0)))}catch{}}var te={keyword:"",seq:0,results:[],query:"",loading:!1,message:"",rev:0,sources:{}};function _t(){te.rev+=1,Ve()}async function xd(){if(x())try{let e=(await y.onlineSourceIndex())?.downloads;te.sources=e&&typeof e=="object"?e:{},_t()}catch(e){console.warn("[search] \u8BFB\u53D6\u5728\u7EBF\u6765\u6E90\u7D22\u5F15\u5931\u8D25\uFF08\u4E0D\u5F71\u54CD\u641C\u7D22\u4E0E\u8BD5\u542C\uFF09",e)}}function U0(e){let t=e?.bvid||String(e?.id||"").replace(/^bili:/,"");if(!t)return null;let n=te.sources[t];return W0(n)?n:null}function W0(e){return!!(e&&e.exists===!0)}var vr=class extends qe{get panelEl(){return this.querySelector("#search-overlay")}updated(){let t=this.panelEl;if(t){if(i.searchOpen){this._closeTimer&&(clearTimeout(this._closeTimer),this._closeTimer=null),t.hidden&&(t.hidden=!1,t.dataset.state="",requestAnimationFrame(()=>{i.searchOpen&&(t.dataset.state="opened")}),requestAnimationFrame(()=>{let n=this.querySelector("#search-input");n?.focus(),n?.select()}));return}t.hidden||(t.dataset.state="closed",this._closeTimer||(this._closeTimer=setTimeout(()=>{this._closeTimer=null,!i.searchOpen&&t&&(t.hidden=!0)},260)))}}disconnectedCallback(){this._closeTimer&&clearTimeout(this._closeTimer),super.disconnectedCallback()}render(){let t=te,n=hc(),s=!!t.keyword.trim(),a=this.headline();return u`
      <section
        class="search-overlay"
        id="search-overlay"
        data-state="closed"
        hidden
        aria-label="搜索"
        @click=${r=>this.onClick(r)}
        @keydown=${r=>this.onKey(r)}
      >
        <div class="search-overlay__panel" role="dialog" aria-modal="true" aria-label="在线搜索">
          <div class="search-overlay__head">
            <span class="search-overlay__title">在线搜索</span>
            <span class="u-spacer"></span>
            <button
              class="search-overlay__close u-hit"
              type="button"
              data-search-close
              data-tip="关闭（结果会保留）"
              aria-label="关闭搜索"
              @click=${()=>br()}
            >
              ${g("close")}
            </button>
          </div>

          <div class="search-overlay__search">
            <div class="search-overlay__field">
              ${g("search","search-overlay__search-icon")}
              <input
                class="search-overlay__input"
                id="search-input"
                type="text"
                placeholder="输入关键词后按回车搜索"
                autocomplete="off"
                spellcheck="false"
                aria-label="搜索关键词"
                .value=${t.keyword}
                @input=${r=>{te.keyword=r.target.value,_t()}}
                @keydown=${r=>{r.key==="Enter"&&(r.preventDefault(),this.submitSearch()),r.key==="Escape"&&(r.preventDefault(),te.keyword.trim()?this.clearSearch({focus:!0}):br())}}
              />
              <button
                class="search-overlay__clear u-hit"
                id="search-clear"
                type="button"
                data-tip="清空搜索"
                aria-label="清空搜索"
                ?hidden=${!s}
                @click=${()=>this.clearSearch({focus:!0})}
              >
                ${g("close")}
              </button>
            </div>
          </div>

          <div class="search-overlay__history" id="search-history" ?hidden=${s||!n.length}>
            ${!s&&n.length?u`
                    <div class="search-overlay__history-title">
                      <span>搜索历史</span>
                      <button
                        type="button"
                        class="search-overlay__history-clear"
                        data-history-act="clear"
                        @click=${()=>this.clearHistory()}
                      >
                        清空
                      </button>
                    </div>
                    <div class="search-overlay__history-list">
                      ${n.map(r=>u`
                          <span class="search-overlay__history-chip" data-history-keyword=${r}>
                            <button
                              type="button"
                              class="search-overlay__history-key"
                              data-history-act="use"
                              @click=${()=>this.useHistory(r)}
                            >
                              ${r}
                            </button>
                            <button
                              type="button"
                              class="search-overlay__history-del"
                              data-history-act="del"
                              aria-label="删除「${r}」"
                              @click=${()=>this.removeHistory(r)}
                            >
                              ${g("close")}
                            </button>
                          </span>
                        `)}
                    </div>
                  `:A}
          </div>

          <div class="search-overlay__status" ?hidden=${!a}>
            <span class="search-overlay__headline" id="search-headline">${a}</span>
          </div>
          <div class="search-overlay__body" id="search-body">${this.bodyContent()}</div>
        </div>
      </section>
    `}headline(){let t=te;return t.loading?"\u641C\u7D22\u4E2D\u2026":t.query?`\u5728\u7EBF\u300C${t.query}\u300D${N(t.results.length)} \u4E2A\u7ED3\u679C`:""}bodyContent(){let t=te;return t.loading?u`<div class="search-overlay__loading">
        <span class="search-overlay__spinner"></span>正在搜索「${t.keyword.trim()}」…
      </div>`:t.message?this.empty(t.message):t.results.length?ut(t.results,n=>n.id,n=>{let s=U0(n);return u`
          <div
            class="search-row"
            data-search-id=${n.id}
            data-search-online="1"
            data-downloaded=${s?"1":"0"}
            role="button"
            tabindex="0"
            @click=${()=>mc(n.id)}
          >
            <span class="search-row__cover">
              ${n.coverUrl?u`<img src=${n.coverUrl} alt="" loading="lazy" />`:u`<span class="search-row__cover-fallback">${g("music")}</span>`}
            </span>
            <span class="search-row__main">
              <span class="search-row__title">${n.title||"\u672A\u547D\u540D"}</span>
              <span class="search-row__sub">${n.artist||"\u672A\u77E5"} · ${Qt(n.duration)}</span>
            </span>
            ${s?u`<span class="search-row__badge" data-tip=${s.dir?`\u5DF2\u4E0B\u8F7D\u5230 ${s.dir}`:"\u5DF2\u4E0B\u8F7D"}
                    >已下载</span
                  >`:A}
            <span class="search-row__actions">
              <button
                class="btn btn--sm btn--primary"
                type="button"
                data-search-act="preview"
                data-id=${n.id}
                @click=${a=>{a.stopPropagation(),mc(n.id)}}
              >
                ${g("play")}<span>试听</span>
              </button>
              <button
                class="btn btn--sm"
                type="button"
                data-search-act="download"
                data-id=${n.id}
                @click=${a=>{a.stopPropagation(),G0(n)}}
              >
                ${g("file")}<span>${s?"\u518D\u4E0B\u8F7D":"\u4E0B\u8F7D"}</span>
              </button>
            </span>
          </div>
        `}):this.empty(t.query?"\u6CA1\u6709\u641C\u5230\u5728\u7EBF\u6B4C\u66F2\uFF0C\u6362\u4E2A\u5173\u952E\u8BCD\u8BD5\u8BD5":"\u8F93\u5165\u5173\u952E\u8BCD\u540E\u6309\u56DE\u8F66\u641C\u7D22\u5728\u7EBF\u6B4C\u66F2")}empty(t){return u`<div class="search-overlay__empty">${g("search")}<span>${t}</span></div>`}onClick(t){(t.target.closest("[data-search-close]")||t.target===this.panelEl)&&br()}onKey(t){if(t.key!=="Enter"&&t.key!==" ")return;let n=t.target.closest?.("[data-search-id]");n&&(t.preventDefault(),mc(n.dataset.searchId))}addHistory(t){let n=(t||"").trim();if(!n)return;let s=hc().filter(a=>a!==n);s.unshift(n),fc(s),_t()}removeHistory(t){fc(hc().filter(n=>n!==t)),_t()}clearHistory(){fc([]),_t()}useHistory(t){te.keyword=t,_t(),this.submitSearch()}submitSearch(){let t=(te.keyword||"").trim();if(!t){this.clearSearch({focus:!0});return}this.addHistory(t),this.runOnlineSearch(t)}clearSearch({focus:t=!1}={}){te.keyword="",te.results=[],te.query="",te.message="",te.loading=!1,te.seq+=1,_t(),t&&requestAnimationFrame(()=>this.querySelector("#search-input")?.focus())}async runOnlineSearch(t){te.query="",te.results=[],te.message="",te.loading=!0,_t();let n=++te.seq;if(!x()){te.loading=!1,te.message="\u6D4F\u89C8\u5668\u9884\u89C8\u4E0B\u6CA1\u6709\u5728\u7EBF\u641C\u7D22\u540E\u7AEF\uFF0C\u8BF7\u5728\u5E94\u7528\u91CC\u8BD5",_t();return}try{let s=await y.onlineSearch(t,1,24);if(n!==te.seq)return;te.results=Array.isArray(s)?s:[],te.query=t,te.loading=!1,_t(),xd()}catch(s){if(n!==te.seq)return;te.results=[],te.query=t,te.loading=!1,te.message=`\u5728\u7EBF\u641C\u7D22\u5931\u8D25\uFF1A${s?.message??s}`,_t()}}};Re(vr,"deps",t=>[t.searchOpen,te.rev]);Se("mp-search-overlay",vr);function z0(e){i.searchOpen?br():of()}function of(){i.searchOpen=!0,$(),xd()}function br(){i.searchOpen=!1,$()}function H0(){document.addEventListener("keydown",e=>{!(e.ctrlKey||e.metaKey)||e.key.toLowerCase()!=="f"||(e.preventDefault(),of())}),ie("download:done",()=>{xd()})}function mc(e){let t=te.results.find(r=>r.id===e);if(!t)return;let n=qi({id:t.id,title:t.title||"\u672A\u547D\u540D",artist:t.artist||"\u672A\u77E5",album:t.album||"\u5728\u7EBF",ext:t.ext||"m4a",duration:t.duration||0,size:0,sampleRate:0,bitrate:0,addedAt:Date.now(),playCount:0,path:"",cover:"",coverUrl:t.coverUrl||"",streamUrl:t.streamUrl||"",downloadUrl:t.downloadUrl||"",bvid:t.bvid||"",online:!0}),s=i.queue.includes(n.id)?i.queue.slice():[...i.queue,n.id],a=s.indexOf(n.id);gt(s,a,{type:"online",id:null}),m(`\u5DF2\u52A0\u5165\u64AD\u653E\u5217\u8868\u5E76\u5F00\u59CB\u8BD5\u542C\uFF1A${n.title}`,{tone:"success",duration:2200})}var lf="music-player.download.notice.v1";function j0(){try{return localStorage.getItem(lf)==="1"}catch{return!1}}function V0(){try{localStorage.setItem(lf,"1")}catch{}}function K0(e){return new Promise(t=>{ue({title:"\u4E0B\u8F7D\u524D\u8BF7\u786E\u8BA4",desc:`\u5373\u5C06\u628A\u300A${e.title||"\u672A\u547D\u540D"}\u300B\u7684\u97F3\u9891\u4FDD\u5B58\u5230\u4F60\u7684\u4E0B\u8F7D\u76EE\u5F55\u3002`,body:u`
        <div class="about-note">
          <div class="about-note__body">· 下载内容来自第三方平台，版权归原作者与权利人所有。</div>
          <div class="about-note__body">· 仅限个人学习、欣赏使用，请勿传播、二次分发或用于商业用途。</div>
          <div class="about-note__body">· 各平台对其内容的使用另有服务条款，请一并遵守。</div>
        </div>
        <label class="setting__hint"><input type="checkbox" data-field="dontAsk" /> 不再提示</label>
      `,okText:"\u6211\u5DF2\u77E5\u6653\uFF0C\u5F00\u59CB\u4E0B\u8F7D",onOk:n=>(n.dontAsk&&V0(),t(!0),!0),onCancel:()=>{t(!1)}})})}async function G0(e){if(!x()){m("\u6D4F\u89C8\u5668\u9884\u89C8\u65E0\u6CD5\u4E0B\u8F7D",{tone:"warning"});return}if(!(!j0()&&!await K0(e)))try{let t=await y.downloadStart(e.bvid||String(e.id).replace(/^bili:/,""),e.title||"",e.duration||0);if(!t?.started){m(t?.reason==="already-running"?"\u8FD9\u9996\u6B4C\u6B63\u5728\u4E0B\u8F7D\u4E2D":"\u65E0\u6CD5\u5F00\u59CB\u4E0B\u8F7D",{tone:"warning"});return}m(`\u5F00\u59CB\u4E0B\u8F7D\u5230 ${t.dir}`,{duration:2600})}catch(t){m(`\u4E0B\u8F7D\u5931\u8D25\uFF1A${t?.message??t}`,{tone:"error",duration:6e3})}}var jt=[],Kr=!1,cf=0,gc=0;function Ms(){cf+=1,Ve()}function Ca(){let e=jt.filter(t=>t?.state==="running").length;return{tasks:jt,running:e,revision:cf,open:Kr,visible:jt.length>0,badge:e>0?String(e):""}}function df(e){Kr=typeof e=="boolean"?e:!Kr,Ms()}function Y0(){df(!1)}async function X0(){if(!x()){jt=jt.filter(e=>e?.state==="running"),Ms();return}try{let e=await y.downloadClearFinished();Xc(e)}catch(e){m(`\u6E05\u9664\u5931\u8D25\uFF1A${e?.message??e}`,{tone:"error"})}}function J0(){let e=jt.find(t=>t?.dir)?.dir||"";y.downloadOpenDir(e).catch(t=>m(`\u6253\u5F00\u76EE\u5F55\u5931\u8D25\uFF1A${t?.message??t}`,{tone:"error"}))}function Q0(e){let t=jt.find(s=>s.id===e),n=t?.path||t?.dir;n&&y.downloadOpenDir(n).catch(s=>m(`\u6253\u5F00\u5931\u8D25\uFF1A${s?.message??s}`,{tone:"error"}))}function Xc(e){!e||!Array.isArray(e.tasks)||(jt=e.tasks,Ms())}async function Z0(){if(ie("download:tasks",t=>{gc+=1,Xc(t)}),!x()){if(ew()){Ms(),Kr=!0,Ms();return}Ms();return}let e=gc;try{let t=await y.downloadTasks();gc===e&&Xc(t)}catch(t){console.info("[downloads] \u62C9\u53D6\u4E0B\u8F7D\u4EFB\u52A1\u5931\u8D25",t?.message??t)}}function ew(){return x()||new URLSearchParams(location.search).get("downloads")!=="1"?!1:(jt=[{id:"preview-1",bvid:"BV1xx411c7mD",title:"\u6674\u5929 - \u5468\u6770\u4F26",state:"running",done:231e4,total:47e5,dir:"C:\\Users\\Me\\Music\\downloads"},{id:"preview-2",bvid:"BV1yy411c7mE",title:"\u5B64\u52C7\u8005 - \u9648\u5955\u8FC5",state:"done",done:39e5,total:39e5,path:"C:\\Users\\Me\\Music\\downloads\\\u5B64\u52C7\u8005 - \u9648\u5955\u8FC5.m4a",dir:"C:\\Users\\Me\\Music\\downloads"},{id:"preview-3",bvid:"BV1zz411c7mF",title:"\u4E00\u9996\u6807\u9898\u5F88\u957F\u5F88\u957F\u3001\u957F\u5230\u9762\u677F\u91CC\u5FC5\u987B\u88AB\u7701\u7565\u53F7\u622A\u65AD\u7684\u6D4B\u8BD5\u6B4C\u66F2",state:"failed",done:12e4,total:5e6,message:"\u4E0B\u8F7D\u5230\u7684\u5185\u5BB9\u4E3A\u7A7A",dir:"C:\\Users\\Me\\Music\\downloads"}],!0)}var yr=class extends qe{render(){let t=Kc(i.config.theme)?.mode!=="light",n=Ca(),s=Gc(i.config.theme);return u`
      <header class="titlebar" id="titlebar">
        <div class="titlebar__brand">
          <svg class="titlebar__logo"><use href="#i-music"></use></svg>
          <span>LMPlayer</span>
        </div>
        <div class="titlebar__drag"></div>
        <div class="titlebar__actions">
          <button
            class="titlebar__btn"
            id="btn-search"
            type="button"
            data-tip="搜索（Ctrl+F）"
            aria-label="搜索"
            aria-pressed=${String(i.searchOpen)}
            @click=${()=>z0()}
          >
            ${g("search")}
          </button>
          <button
            class="titlebar__btn titlebar__btn--download"
            id="btn-downloads"
            type="button"
            data-tip="下载任务"
            aria-label="下载任务"
            aria-pressed="false"
            ?hidden=${!n.visible}
            @click=${()=>df()}
          >
            ${g("download")}
            <span class="titlebar__badge" id="download-badge" ?hidden=${!n.badge}>${n.badge}</span>
          </button>
          <button
            class="titlebar__btn"
            id="btn-theme-toggle"
            type="button"
            data-tip=${s?`\u4E0B\u4E00\u4E2A\u4E3B\u9898\uFF1A${s.name}`:"\u5207\u6362\u4E3B\u9898"}
            aria-label="切换主题（按设置里的列表循环）"
            @click=${()=>M0()}
          >
            ${g(t?"sun":"moon")}
          </button>
          <button
            class="titlebar__btn"
            id="btn-settings"
            type="button"
            data-tip="设置"
            aria-label="设置"
            @click=${()=>N0()}
          >
            ${g("settings")}
          </button>
          <button
            class="titlebar__btn"
            id="btn-win-min"
            type="button"
            aria-label="最小化"
            @click=${()=>vc("min")}
          >
            ${g("minimize")}
          </button>
          <button
            class="titlebar__btn"
            id="btn-win-max"
            type="button"
            aria-label="最大化"
            @click=${()=>vc("max")}
          >
            ${g("maximize")}
          </button>
          <button
            class="titlebar__btn titlebar__btn--close"
            id="btn-win-close"
            type="button"
            aria-label="关闭"
            @click=${()=>vc("close")}
          >
            ${g("close")}
          </button>
        </div>
      </header>
    `}};Re(yr,"deps",()=>{let t=Kc(i.config.theme)?.mode!=="light",n=Ca();return[t,i.config.themeMode,i.config.theme,Gc(i.config.theme)?.id,i.searchOpen,n.visible,n.badge]});function vc(e){if(!x()){e==="close"&&window.close();return}e==="min"?y.windowMinimize():e==="max"?y.windowToggleMaximize():y.windowClose()}Se("mp-titlebar",yr);function tw(e,t,n){return(t=iw(t))in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function Yt(){return Yt=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var s in n)({}).hasOwnProperty.call(n,s)&&(e[s]=n[s])}return e},Yt.apply(null,arguments)}function oh(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(e);t&&(s=s.filter(function(a){return Object.getOwnPropertyDescriptor(e,a).enumerable})),n.push.apply(n,s)}return n}function Lt(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]!=null?arguments[t]:{};t%2?oh(Object(n),!0).forEach(function(s){tw(e,s,n[s])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):oh(Object(n)).forEach(function(s){Object.defineProperty(e,s,Object.getOwnPropertyDescriptor(n,s))})}return e}function nw(e,t){if(e==null)return{};var n,s,a=sw(e,t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);for(s=0;s<r.length;s++)n=r[s],t.indexOf(n)===-1&&{}.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}function sw(e,t){if(e==null)return{};var n={};for(var s in e)if({}.hasOwnProperty.call(e,s)){if(t.indexOf(s)!==-1)continue;n[s]=e[s]}return n}function aw(e,t){if(typeof e!="object"||!e)return e;var n=e[Symbol.toPrimitive];if(n!==void 0){var s=n.call(e,t);if(typeof s!="object")return s;throw new TypeError("@@toPrimitive must return a primitive value.")}return(t==="string"?String:Number)(e)}function iw(e){var t=aw(e,"string");return typeof t=="symbol"?t:t+""}function Jc(e){"@babel/helpers - typeof";return Jc=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(t){return typeof t}:function(t){return t&&typeof Symbol=="function"&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},Jc(e)}var rw="1.15.7";function Vt(e){if(typeof window<"u"&&window.navigator)return!!navigator.userAgent.match(e)}var Xt=Vt(/(?:Trident.*rv[ :]?11\.|msie|iemobile|Windows Phone)/i),Fa=Vt(/Edge/i),lh=Vt(/firefox/i),Aa=Vt(/safari/i)&&!Vt(/chrome/i)&&!Vt(/android/i),Cd=Vt(/iP(ad|od|hone)/i),uf=Vt(/chrome/i)&&Vt(/android/i),pf={capture:!1,passive:!1};function ne(e,t,n){e.addEventListener(t,n,!Xt&&pf)}function Q(e,t,n){e.removeEventListener(t,n,!Xt&&pf)}function Gr(e,t){if(t){if(t[0]===">"&&(t=t.substring(1)),e)try{if(e.matches)return e.matches(t);if(e.msMatchesSelector)return e.msMatchesSelector(t);if(e.webkitMatchesSelector)return e.webkitMatchesSelector(t)}catch{return!1}return!1}}function hf(e){return e.host&&e!==document&&e.host.nodeType&&e.host!==e?e.host:e.parentNode}function wt(e,t,n,s){if(e){n=n||document;do{if(t!=null&&(t[0]===">"?e.parentNode===n&&Gr(e,t):Gr(e,t))||s&&e===n)return e;if(e===n)break}while(e=hf(e))}return null}var ch=/\s+/g;function it(e,t,n){if(e&&t)if(e.classList)e.classList[n?"add":"remove"](t);else{var s=(" "+e.className+" ").replace(ch," ").replace(" "+t+" "," ");e.className=(s+(n?" "+t:"")).replace(ch," ")}}function B(e,t,n){var s=e&&e.style;if(s){if(n===void 0)return document.defaultView&&document.defaultView.getComputedStyle?n=document.defaultView.getComputedStyle(e,""):e.currentStyle&&(n=e.currentStyle),t===void 0?n:n[t];!(t in s)&&t.indexOf("webkit")===-1&&(t="-webkit-"+t),s[t]=n+(typeof n=="string"?"":"px")}}function Is(e,t){var n="";if(typeof e=="string")n=e;else do{var s=B(e,"transform");s&&s!=="none"&&(n=s+" "+n)}while(!t&&(e=e.parentNode));var a=window.DOMMatrix||window.WebKitCSSMatrix||window.CSSMatrix||window.MSCSSMatrix;return a&&new a(n)}function ff(e,t,n){if(e){var s=e.getElementsByTagName(t),a=0,r=s.length;if(n)for(;a<r;a++)n(s[a],a);return s}return[]}function Pt(){var e=document.scrollingElement;return e||document.documentElement}function Ae(e,t,n,s,a){if(!(!e.getBoundingClientRect&&e!==window)){var r,o,l,c,d,p,h;if(e!==window&&e.parentNode&&e!==Pt()?(r=e.getBoundingClientRect(),o=r.top,l=r.left,c=r.bottom,d=r.right,p=r.height,h=r.width):(o=0,l=0,c=window.innerHeight,d=window.innerWidth,p=window.innerHeight,h=window.innerWidth),(t||n)&&e!==window&&(a=a||e.parentNode,!Xt))do if(a&&a.getBoundingClientRect&&(B(a,"transform")!=="none"||n&&B(a,"position")!=="static")){var v=a.getBoundingClientRect();o-=v.top+parseInt(B(a,"border-top-width")),l-=v.left+parseInt(B(a,"border-left-width")),c=o+r.height,d=l+r.width;break}while(a=a.parentNode);if(s&&e!==window){var w=Is(a||e),k=w&&w.a,C=w&&w.d;w&&(o/=C,l/=k,h/=k,p/=C,c=o+p,d=l+h)}return{top:o,left:l,bottom:c,right:d,width:h,height:p}}}function dh(e,t,n){for(var s=mn(e,!0),a=Ae(e)[t];s;){var r=Ae(s)[n],o=void 0;if(o=a>=r,!o)return s;if(s===Pt())break;s=mn(s,!1)}return!1}function Ls(e,t,n,s){for(var a=0,r=0,o=e.children;r<o.length;){if(o[r].style.display!=="none"&&o[r]!==F.ghost&&(s||o[r]!==F.dragged)&&wt(o[r],n.draggable,e,!1)){if(a===t)return o[r];a++}r++}return null}function Ad(e,t){for(var n=e.lastElementChild;n&&(n===F.ghost||B(n,"display")==="none"||t&&!Gr(n,t));)n=n.previousElementSibling;return n||null}function lt(e,t){var n=0;if(!e||!e.parentNode)return-1;for(;e=e.previousElementSibling;)e.nodeName.toUpperCase()!=="TEMPLATE"&&e!==F.clone&&(!t||Gr(e,t))&&n++;return n}function uh(e){var t=0,n=0,s=Pt();if(e)do{var a=Is(e),r=a.a,o=a.d;t+=e.scrollLeft*r,n+=e.scrollTop*o}while(e!==s&&(e=e.parentNode));return[t,n]}function ow(e,t){for(var n in e)if(e.hasOwnProperty(n)){for(var s in t)if(t.hasOwnProperty(s)&&t[s]===e[n][s])return Number(n)}return-1}function mn(e,t){if(!e||!e.getBoundingClientRect)return Pt();var n=e,s=!1;do if(n.clientWidth<n.scrollWidth||n.clientHeight<n.scrollHeight){var a=B(n);if(n.clientWidth<n.scrollWidth&&(a.overflowX=="auto"||a.overflowX=="scroll")||n.clientHeight<n.scrollHeight&&(a.overflowY=="auto"||a.overflowY=="scroll")){if(!n.getBoundingClientRect||n===document.body)return Pt();if(s||t)return n;s=!0}}while(n=n.parentNode);return Pt()}function lw(e,t){if(e&&t)for(var n in t)t.hasOwnProperty(n)&&(e[n]=t[n]);return e}function bc(e,t){return Math.round(e.top)===Math.round(t.top)&&Math.round(e.left)===Math.round(t.left)&&Math.round(e.height)===Math.round(t.height)&&Math.round(e.width)===Math.round(t.width)}var Ma;function mf(e,t){return function(){if(!Ma){var n=arguments,s=this;n.length===1?e.call(s,n[0]):e.apply(s,n),Ma=setTimeout(function(){Ma=void 0},t)}}}function cw(){clearTimeout(Ma),Ma=void 0}function gf(e,t,n){e.scrollLeft+=t,e.scrollTop+=n}function vf(e){var t=window.Polymer,n=window.jQuery||window.Zepto;return t&&t.dom?t.dom(e).cloneNode(!0):n?n(e).clone(!0)[0]:e.cloneNode(!0)}function bf(e,t,n){var s={};return Array.from(e.children).forEach(function(a){var r,o,l,c;if(!(!wt(a,t.draggable,e,!1)||a.animated||a===n)){var d=Ae(a);s.left=Math.min((r=s.left)!==null&&r!==void 0?r:1/0,d.left),s.top=Math.min((o=s.top)!==null&&o!==void 0?o:1/0,d.top),s.right=Math.max((l=s.right)!==null&&l!==void 0?l:-1/0,d.right),s.bottom=Math.max((c=s.bottom)!==null&&c!==void 0?c:-1/0,d.bottom)}}),s.width=s.right-s.left,s.height=s.bottom-s.top,s.x=s.left,s.y=s.top,s}var et="Sortable"+new Date().getTime();function dw(){var e=[],t;return{captureAnimationState:function(){if(e=[],!!this.options.animation){var n=[].slice.call(this.el.children);n.forEach(function(s){if(!(B(s,"display")==="none"||s===F.ghost)){e.push({target:s,rect:Ae(s)});var a=Lt({},e[e.length-1].rect);if(s.thisAnimationDuration){var r=Is(s,!0);r&&(a.top-=r.f,a.left-=r.e)}s.fromRect=a}})}},addAnimationState:function(n){e.push(n)},removeAnimationState:function(n){e.splice(ow(e,{target:n}),1)},animateAll:function(n){var s=this;if(!this.options.animation){clearTimeout(t),typeof n=="function"&&n();return}var a=!1,r=0;e.forEach(function(o){var l=0,c=o.target,d=c.fromRect,p=Ae(c),h=c.prevFromRect,v=c.prevToRect,w=o.rect,k=Is(c,!0);k&&(p.top-=k.f,p.left-=k.e),c.toRect=p,c.thisAnimationDuration&&bc(h,p)&&!bc(d,p)&&(w.top-p.top)/(w.left-p.left)===(d.top-p.top)/(d.left-p.left)&&(l=pw(w,h,v,s.options)),bc(p,d)||(c.prevFromRect=d,c.prevToRect=p,l||(l=s.options.animation),s.animate(c,w,p,l)),l&&(a=!0,r=Math.max(r,l),clearTimeout(c.animationResetTimer),c.animationResetTimer=setTimeout(function(){c.animationTime=0,c.prevFromRect=null,c.fromRect=null,c.prevToRect=null,c.thisAnimationDuration=null},l),c.thisAnimationDuration=l)}),clearTimeout(t),a?t=setTimeout(function(){typeof n=="function"&&n()},r):typeof n=="function"&&n(),e=[]},animate:function(n,s,a,r){if(r){B(n,"transition",""),B(n,"transform","");var o=Is(this.el),l=o&&o.a,c=o&&o.d,d=(s.left-a.left)/(l||1),p=(s.top-a.top)/(c||1);n.animatingX=!!d,n.animatingY=!!p,B(n,"transform","translate3d("+d+"px,"+p+"px,0)"),this.forRepaintDummy=uw(n),B(n,"transition","transform "+r+"ms"+(this.options.easing?" "+this.options.easing:"")),B(n,"transform","translate3d(0,0,0)"),typeof n.animated=="number"&&clearTimeout(n.animated),n.animated=setTimeout(function(){B(n,"transition",""),B(n,"transform",""),n.animated=!1,n.animatingX=!1,n.animatingY=!1},r)}}}}function uw(e){return e.offsetWidth}function pw(e,t,n,s){return Math.sqrt(Math.pow(t.top-e.top,2)+Math.pow(t.left-e.left,2))/Math.sqrt(Math.pow(t.top-n.top,2)+Math.pow(t.left-n.left,2))*s.animation}var ws=[],yc={initializeByDefault:!0},Ba={mount:function(e){for(var t in yc)yc.hasOwnProperty(t)&&!(t in e)&&(e[t]=yc[t]);ws.forEach(function(n){if(n.pluginName===e.pluginName)throw"Sortable: Cannot mount plugin ".concat(e.pluginName," more than once")}),ws.push(e)},pluginEvent:function(e,t,n){var s=this;this.eventCanceled=!1,n.cancel=function(){s.eventCanceled=!0};var a=e+"Global";ws.forEach(function(r){t[r.pluginName]&&(t[r.pluginName][a]&&t[r.pluginName][a](Lt({sortable:t},n)),t.options[r.pluginName]&&t[r.pluginName][e]&&t[r.pluginName][e](Lt({sortable:t},n)))})},initializePlugins:function(e,t,n,s){ws.forEach(function(o){var l=o.pluginName;if(!(!e.options[l]&&!o.initializeByDefault)){var c=new o(e,t,e.options);c.sortable=e,c.options=e.options,e[l]=c,Yt(n,c.defaults)}});for(var a in e.options)if(e.options.hasOwnProperty(a)){var r=this.modifyOption(e,a,e.options[a]);typeof r<"u"&&(e.options[a]=r)}},getEventProperties:function(e,t){var n={};return ws.forEach(function(s){typeof s.eventProperties=="function"&&Yt(n,s.eventProperties.call(t[s.pluginName],e))}),n},modifyOption:function(e,t,n){var s;return ws.forEach(function(a){e[a.pluginName]&&a.optionListeners&&typeof a.optionListeners[t]=="function"&&(s=a.optionListeners[t].call(e[a.pluginName],n))}),s}};function hw(e){var t=e.sortable,n=e.rootEl,s=e.name,a=e.targetEl,r=e.cloneEl,o=e.toEl,l=e.fromEl,c=e.oldIndex,d=e.newIndex,p=e.oldDraggableIndex,h=e.newDraggableIndex,v=e.originalEvent,w=e.putSortable,k=e.extraEventProperties;if(t=t||n&&n[et],!!t){var C,L=t.options,O="on"+s.charAt(0).toUpperCase()+s.substr(1);window.CustomEvent&&!Xt&&!Fa?C=new CustomEvent(s,{bubbles:!0,cancelable:!0}):(C=document.createEvent("Event"),C.initEvent(s,!0,!0)),C.to=o||n,C.from=l||n,C.item=a||n,C.clone=r,C.oldIndex=c,C.newIndex=d,C.oldDraggableIndex=p,C.newDraggableIndex=h,C.originalEvent=v,C.pullMode=w?w.lastPutMode:void 0;var S=Lt(Lt({},k),Ba.getEventProperties(s,t));for(var q in S)C[q]=S[q];n&&n.dispatchEvent(C),L[O]&&L[O].call(t,C)}}var fw=["evt"],Qe=function(e,t){var n=arguments.length>2&&arguments[2]!==void 0?arguments[2]:{},s=n.evt,a=nw(n,fw);Ba.pluginEvent.bind(F)(e,t,Lt({dragEl:E,parentEl:$e,ghostEl:H,rootEl:fe,nextEl:Un,lastDownEl:_r,cloneEl:ve,cloneHidden:hn,dragStarted:$a,putSortable:We,activeSortable:F.active,originalEvent:s,oldIndex:xs,oldDraggableIndex:Ia,newIndex:rt,newDraggableIndex:un,hideGhostForTarget:$f,unhideGhostForTarget:kf,cloneNowHidden:function(){hn=!0},cloneNowShown:function(){hn=!1},dispatchSortableEvent:function(r){Ye({sortable:t,name:r,originalEvent:s})}},a))};function Ye(e){hw(Lt({putSortable:We,cloneEl:ve,targetEl:E,rootEl:fe,oldIndex:xs,oldDraggableIndex:Ia,newIndex:rt,newDraggableIndex:un},e))}var E,$e,H,fe,Un,_r,ve,hn,xs,rt,Ia,un,tr,We,Ss=!1,Yr=!1,Xr=[],Nn,bt,_c,wc,ph,hh,$a,$s,Ta,Ea=!1,nr=!1,wr,Ke,$c=[],Qc=!1,Jr=[],ao=typeof document<"u",sr=Cd,fh=Fa||Xt?"cssFloat":"float",mw=ao&&!uf&&!Cd&&"draggable"in document.createElement("div"),yf=function(){if(ao){if(Xt)return!1;var e=document.createElement("x");return e.style.cssText="pointer-events:auto",e.style.pointerEvents==="auto"}}(),_f=function(e,t){var n=B(e),s=parseInt(n.width)-parseInt(n.paddingLeft)-parseInt(n.paddingRight)-parseInt(n.borderLeftWidth)-parseInt(n.borderRightWidth),a=Ls(e,0,t),r=Ls(e,1,t),o=a&&B(a),l=r&&B(r),c=o&&parseInt(o.marginLeft)+parseInt(o.marginRight)+Ae(a).width,d=l&&parseInt(l.marginLeft)+parseInt(l.marginRight)+Ae(r).width;if(n.display==="flex")return n.flexDirection==="column"||n.flexDirection==="column-reverse"?"vertical":"horizontal";if(n.display==="grid")return n.gridTemplateColumns.split(" ").length<=1?"vertical":"horizontal";if(a&&o.float&&o.float!=="none"){var p=o.float==="left"?"left":"right";return r&&(l.clear==="both"||l.clear===p)?"vertical":"horizontal"}return a&&(o.display==="block"||o.display==="flex"||o.display==="table"||o.display==="grid"||c>=s&&n[fh]==="none"||r&&n[fh]==="none"&&c+d>s)?"vertical":"horizontal"},gw=function(e,t,n){var s=n?e.left:e.top,a=n?e.right:e.bottom,r=n?e.width:e.height,o=n?t.left:t.top,l=n?t.right:t.bottom,c=n?t.width:t.height;return s===o||a===l||s+r/2===o+c/2},vw=function(e,t){var n;return Xr.some(function(s){var a=s[et].options.emptyInsertThreshold;if(!(!a||Ad(s))){var r=Ae(s),o=e>=r.left-a&&e<=r.right+a,l=t>=r.top-a&&t<=r.bottom+a;if(o&&l)return n=s}}),n},wf=function(e){function t(a,r){return function(o,l,c,d){var p=o.options.group.name&&l.options.group.name&&o.options.group.name===l.options.group.name;if(a==null&&(r||p))return!0;if(a==null||a===!1)return!1;if(r&&a==="clone")return a;if(typeof a=="function")return t(a(o,l,c,d),r)(o,l,c,d);var h=(r?o:l).options.group.name;return a===!0||typeof a=="string"&&a===h||a.join&&a.indexOf(h)>-1}}var n={},s=e.group;(!s||Jc(s)!="object")&&(s={name:s}),n.name=s.name,n.checkPull=t(s.pull,!0),n.checkPut=t(s.put),n.revertClone=s.revertClone,e.group=n},$f=function(){!yf&&H&&B(H,"display","none")},kf=function(){!yf&&H&&B(H,"display","")};ao&&!uf&&document.addEventListener("click",function(e){if(Yr)return e.preventDefault(),e.stopPropagation&&e.stopPropagation(),e.stopImmediatePropagation&&e.stopImmediatePropagation(),Yr=!1,!1},!0);var Fn=function(e){if(E){e=e.touches?e.touches[0]:e;var t=vw(e.clientX,e.clientY);if(t){var n={};for(var s in e)e.hasOwnProperty(s)&&(n[s]=e[s]);n.target=n.rootEl=t,n.preventDefault=void 0,n.stopPropagation=void 0,t[et]._onDragOver(n)}}},bw=function(e){E&&E.parentNode[et]._isOutsideThisEl(e.target)};function F(e,t){if(!(e&&e.nodeType&&e.nodeType===1))throw"Sortable: `el` must be an HTMLElement, not ".concat({}.toString.call(e));this.el=e,this.options=t=Yt({},t),e[et]=this;var n={group:null,sort:!0,disabled:!1,store:null,handle:null,draggable:/^[uo]l$/i.test(e.nodeName)?">li":">*",swapThreshold:1,invertSwap:!1,invertedSwapThreshold:null,removeCloneOnHide:!0,direction:function(){return _f(e,this.options)},ghostClass:"sortable-ghost",chosenClass:"sortable-chosen",dragClass:"sortable-drag",ignore:"a, img",filter:null,preventOnFilter:!0,animation:0,easing:null,setData:function(r,o){r.setData("Text",o.textContent)},dropBubble:!1,dragoverBubble:!1,dataIdAttr:"data-id",delay:0,delayOnTouchOnly:!1,touchStartThreshold:(Number.parseInt?Number:window).parseInt(window.devicePixelRatio,10)||1,forceFallback:!1,fallbackClass:"sortable-fallback",fallbackOnBody:!1,fallbackTolerance:0,fallbackOffset:{x:0,y:0},supportPointer:F.supportPointer!==!1&&"PointerEvent"in window&&(!Aa||Cd),emptyInsertThreshold:5};Ba.initializePlugins(this,e,n);for(var s in n)!(s in t)&&(t[s]=n[s]);wf(t);for(var a in this)a.charAt(0)==="_"&&typeof this[a]=="function"&&(this[a]=this[a].bind(this));this.nativeDraggable=t.forceFallback?!1:mw,this.nativeDraggable&&(this.options.touchStartThreshold=1),t.supportPointer?ne(e,"pointerdown",this._onTapStart):(ne(e,"mousedown",this._onTapStart),ne(e,"touchstart",this._onTapStart)),this.nativeDraggable&&(ne(e,"dragover",this),ne(e,"dragenter",this)),Xr.push(this.el),t.store&&t.store.get&&this.sort(t.store.get(this)||[]),Yt(this,dw())}F.prototype={constructor:F,_isOutsideThisEl:function(e){!this.el.contains(e)&&e!==this.el&&($s=null)},_getDirection:function(e,t){return typeof this.options.direction=="function"?this.options.direction.call(this,e,t,E):this.options.direction},_onTapStart:function(e){if(e.cancelable){var t=this,n=this.el,s=this.options,a=s.preventOnFilter,r=e.type,o=e.touches&&e.touches[0]||e.pointerType&&e.pointerType==="touch"&&e,l=(o||e).target,c=e.target.shadowRoot&&(e.path&&e.path[0]||e.composedPath&&e.composedPath()[0])||l,d=s.filter;if(Cw(n),!E&&!(/mousedown|pointerdown/.test(r)&&e.button!==0||s.disabled)&&!c.isContentEditable&&!(!this.nativeDraggable&&Aa&&l&&l.tagName.toUpperCase()==="SELECT")&&(l=wt(l,s.draggable,n,!1),!(l&&l.animated)&&_r!==l)){if(xs=lt(l),Ia=lt(l,s.draggable),typeof d=="function"){if(d.call(this,e,l,this)){Ye({sortable:t,rootEl:c,name:"filter",targetEl:l,toEl:n,fromEl:n}),Qe("filter",t,{evt:e}),a&&e.preventDefault();return}}else if(d&&(d=d.split(",").some(function(p){if(p=wt(c,p.trim(),n,!1),p)return Ye({sortable:t,rootEl:p,name:"filter",targetEl:l,fromEl:n,toEl:n}),Qe("filter",t,{evt:e}),!0}),d)){a&&e.preventDefault();return}s.handle&&!wt(c,s.handle,n,!1)||this._prepareDragStart(e,o,l)}}},_prepareDragStart:function(e,t,n){var s=this,a=s.el,r=s.options,o=a.ownerDocument,l;if(n&&!E&&n.parentNode===a){var c=Ae(n);if(fe=a,E=n,$e=E.parentNode,Un=E.nextSibling,_r=n,tr=r.group,F.dragged=E,Nn={target:E,clientX:(t||e).clientX,clientY:(t||e).clientY},ph=Nn.clientX-c.left,hh=Nn.clientY-c.top,this._lastX=(t||e).clientX,this._lastY=(t||e).clientY,E.style["will-change"]="all",l=function(){if(Qe("delayEnded",s,{evt:e}),F.eventCanceled){s._onDrop();return}s._disableDelayedDragEvents(),!lh&&s.nativeDraggable&&(E.draggable=!0),s._triggerDragStart(e,t),Ye({sortable:s,name:"choose",originalEvent:e}),it(E,r.chosenClass,!0)},r.ignore.split(",").forEach(function(d){ff(E,d.trim(),kc)}),ne(o,"dragover",Fn),ne(o,"mousemove",Fn),ne(o,"touchmove",Fn),r.supportPointer?(ne(o,"pointerup",s._onDrop),!this.nativeDraggable&&ne(o,"pointercancel",s._onDrop)):(ne(o,"mouseup",s._onDrop),ne(o,"touchend",s._onDrop),ne(o,"touchcancel",s._onDrop)),lh&&this.nativeDraggable&&(this.options.touchStartThreshold=4,E.draggable=!0),Qe("delayStart",this,{evt:e}),r.delay&&(!r.delayOnTouchOnly||t)&&(!this.nativeDraggable||!(Fa||Xt))){if(F.eventCanceled){this._onDrop();return}r.supportPointer?(ne(o,"pointerup",s._disableDelayedDrag),ne(o,"pointercancel",s._disableDelayedDrag)):(ne(o,"mouseup",s._disableDelayedDrag),ne(o,"touchend",s._disableDelayedDrag),ne(o,"touchcancel",s._disableDelayedDrag)),ne(o,"mousemove",s._delayedDragTouchMoveHandler),ne(o,"touchmove",s._delayedDragTouchMoveHandler),r.supportPointer&&ne(o,"pointermove",s._delayedDragTouchMoveHandler),s._dragStartTimer=setTimeout(l,r.delay)}else l()}},_delayedDragTouchMoveHandler:function(e){var t=e.touches?e.touches[0]:e;Math.max(Math.abs(t.clientX-this._lastX),Math.abs(t.clientY-this._lastY))>=Math.floor(this.options.touchStartThreshold/(this.nativeDraggable&&window.devicePixelRatio||1))&&this._disableDelayedDrag()},_disableDelayedDrag:function(){E&&kc(E),clearTimeout(this._dragStartTimer),this._disableDelayedDragEvents()},_disableDelayedDragEvents:function(){var e=this.el.ownerDocument;Q(e,"mouseup",this._disableDelayedDrag),Q(e,"touchend",this._disableDelayedDrag),Q(e,"touchcancel",this._disableDelayedDrag),Q(e,"pointerup",this._disableDelayedDrag),Q(e,"pointercancel",this._disableDelayedDrag),Q(e,"mousemove",this._delayedDragTouchMoveHandler),Q(e,"touchmove",this._delayedDragTouchMoveHandler),Q(e,"pointermove",this._delayedDragTouchMoveHandler)},_triggerDragStart:function(e,t){t=t||e.pointerType=="touch"&&e,!this.nativeDraggable||t?this.options.supportPointer?ne(document,"pointermove",this._onTouchMove):t?ne(document,"touchmove",this._onTouchMove):ne(document,"mousemove",this._onTouchMove):(ne(E,"dragend",this),ne(fe,"dragstart",this._onDragStart));try{document.selection?$r(function(){document.selection.empty()}):window.getSelection().removeAllRanges()}catch{}},_dragStarted:function(e,t){if(Ss=!1,fe&&E){Qe("dragStarted",this,{evt:t}),this.nativeDraggable&&ne(document,"dragover",bw);var n=this.options;!e&&it(E,n.dragClass,!1),it(E,n.ghostClass,!0),F.active=this,e&&this._appendGhost(),Ye({sortable:this,name:"start",originalEvent:t})}else this._nulling()},_emulateDragOver:function(){if(bt){this._lastX=bt.clientX,this._lastY=bt.clientY,$f();for(var e=document.elementFromPoint(bt.clientX,bt.clientY),t=e;e&&e.shadowRoot&&(e=e.shadowRoot.elementFromPoint(bt.clientX,bt.clientY),e!==t);)t=e;if(E.parentNode[et]._isOutsideThisEl(e),t)do{if(t[et]){var n=void 0;if(n=t[et]._onDragOver({clientX:bt.clientX,clientY:bt.clientY,target:e,rootEl:t}),n&&!this.options.dragoverBubble)break}e=t}while(t=hf(t));kf()}},_onTouchMove:function(e){if(Nn){var t=this.options,n=t.fallbackTolerance,s=t.fallbackOffset,a=e.touches?e.touches[0]:e,r=H&&Is(H,!0),o=H&&r&&r.a,l=H&&r&&r.d,c=sr&&Ke&&uh(Ke),d=(a.clientX-Nn.clientX+s.x)/(o||1)+(c?c[0]-$c[0]:0)/(o||1),p=(a.clientY-Nn.clientY+s.y)/(l||1)+(c?c[1]-$c[1]:0)/(l||1);if(!F.active&&!Ss){if(n&&Math.max(Math.abs(a.clientX-this._lastX),Math.abs(a.clientY-this._lastY))<n)return;this._onDragStart(e,!0)}if(H){r?(r.e+=d-(_c||0),r.f+=p-(wc||0)):r={a:1,b:0,c:0,d:1,e:d,f:p};var h="matrix(".concat(r.a,",").concat(r.b,",").concat(r.c,",").concat(r.d,",").concat(r.e,",").concat(r.f,")");B(H,"webkitTransform",h),B(H,"mozTransform",h),B(H,"msTransform",h),B(H,"transform",h),_c=d,wc=p,bt=a}e.cancelable&&e.preventDefault()}},_appendGhost:function(){if(!H){var e=this.options.fallbackOnBody?document.body:fe,t=Ae(E,!0,sr,!0,e),n=this.options;if(sr){for(Ke=e;B(Ke,"position")==="static"&&B(Ke,"transform")==="none"&&Ke!==document;)Ke=Ke.parentNode;Ke!==document.body&&Ke!==document.documentElement?(Ke===document&&(Ke=Pt()),t.top+=Ke.scrollTop,t.left+=Ke.scrollLeft):Ke=Pt(),$c=uh(Ke)}H=E.cloneNode(!0),it(H,n.ghostClass,!1),it(H,n.fallbackClass,!0),it(H,n.dragClass,!0),B(H,"transition",""),B(H,"transform",""),B(H,"box-sizing","border-box"),B(H,"margin",0),B(H,"top",t.top),B(H,"left",t.left),B(H,"width",t.width),B(H,"height",t.height),B(H,"opacity","0.8"),B(H,"position",sr?"absolute":"fixed"),B(H,"zIndex","100000"),B(H,"pointerEvents","none"),F.ghost=H,e.appendChild(H),B(H,"transform-origin",ph/parseInt(H.style.width)*100+"% "+hh/parseInt(H.style.height)*100+"%")}},_onDragStart:function(e,t){var n=this,s=e.dataTransfer,a=n.options;if(Qe("dragStart",this,{evt:e}),F.eventCanceled){this._onDrop();return}Qe("setupClone",this),F.eventCanceled||(ve=vf(E),ve.removeAttribute("id"),ve.draggable=!1,ve.style["will-change"]="",this._hideClone(),it(ve,this.options.chosenClass,!1),F.clone=ve),n.cloneId=$r(function(){Qe("clone",n),!F.eventCanceled&&(n.options.removeCloneOnHide||fe.insertBefore(ve,E),n._hideClone(),Ye({sortable:n,name:"clone"}))}),!t&&it(E,a.dragClass,!0),t?(Yr=!0,n._loopId=setInterval(n._emulateDragOver,50)):(Q(document,"mouseup",n._onDrop),Q(document,"touchend",n._onDrop),Q(document,"touchcancel",n._onDrop),s&&(s.effectAllowed="move",a.setData&&a.setData.call(n,s,E)),ne(document,"drop",n),B(E,"transform","translateZ(0)")),Ss=!0,n._dragStartId=$r(n._dragStarted.bind(n,t,e)),ne(document,"selectstart",n),$a=!0,window.getSelection().removeAllRanges(),Aa&&B(document.body,"user-select","none")},_onDragOver:function(e){var t=this.el,n=e.target,s,a,r,o=this.options,l=o.group,c=F.active,d=tr===l,p=o.sort,h=We||c,v,w=this,k=!1;if(Qc)return;function C(Z,Ie){Qe(Z,w,Lt({evt:e,isOwner:d,axis:v?"vertical":"horizontal",revert:r,dragRect:s,targetRect:a,canSort:p,fromSortable:h,target:n,completed:O,onMove:function(Te,Jt){return ar(fe,t,E,s,Te,Ae(Te),e,Jt)},changed:S},Ie))}function L(){C("dragOverAnimationCapture"),w.captureAnimationState(),w!==h&&h.captureAnimationState()}function O(Z){return C("dragOverCompleted",{insertion:Z}),Z&&(d?c._hideClone():c._showClone(w),w!==h&&(it(E,We?We.options.ghostClass:c.options.ghostClass,!1),it(E,o.ghostClass,!0)),We!==w&&w!==F.active?We=w:w===F.active&&We&&(We=null),h===w&&(w._ignoreWhileAnimating=n),w.animateAll(function(){C("dragOverAnimationComplete"),w._ignoreWhileAnimating=null}),w!==h&&(h.animateAll(),h._ignoreWhileAnimating=null)),(n===E&&!E.animated||n===t&&!n.animated)&&($s=null),!o.dragoverBubble&&!e.rootEl&&n!==document&&(E.parentNode[et]._isOutsideThisEl(e.target),!Z&&Fn(e)),!o.dragoverBubble&&e.stopPropagation&&e.stopPropagation(),k=!0}function S(){rt=lt(E),un=lt(E,o.draggable),Ye({sortable:w,name:"change",toEl:t,newIndex:rt,newDraggableIndex:un,originalEvent:e})}if(e.preventDefault!==void 0&&e.cancelable&&e.preventDefault(),n=wt(n,o.draggable,t,!0),C("dragOver"),F.eventCanceled)return k;if(E.contains(e.target)||n.animated&&n.animatingX&&n.animatingY||w._ignoreWhileAnimating===n)return O(!1);if(Yr=!1,c&&!o.disabled&&(d?p||(r=$e!==fe):We===this||(this.lastPutMode=tr.checkPull(this,c,E,e))&&l.checkPut(this,c,E,e))){if(v=this._getDirection(e,n)==="vertical",s=Ae(E),C("dragOverValid"),F.eventCanceled)return k;if(r)return $e=fe,L(),this._hideClone(),C("revert"),F.eventCanceled||(Un?fe.insertBefore(E,Un):fe.appendChild(E)),O(!0);var q=Ad(t,o.draggable);if(!q||$w(e,v,this)&&!q.animated){if(q===E)return O(!1);if(q&&t===e.target&&(n=q),n&&(a=Ae(n)),ar(fe,t,E,s,n,a,e,!!n)!==!1)return L(),q&&q.nextSibling?t.insertBefore(E,q.nextSibling):t.appendChild(E),$e=t,S(),O(!0)}else if(q&&ww(e,v,this)){var W=Ls(t,0,o,!0);if(W===E)return O(!1);if(n=W,a=Ae(n),ar(fe,t,E,s,n,a,e,!1)!==!1)return L(),t.insertBefore(E,W),$e=t,S(),O(!0)}else if(n.parentNode===t){a=Ae(n);var M=0,T,R=E.parentNode!==t,X=!gw(E.animated&&E.toRect||s,n.animated&&n.toRect||a,v),z=v?"top":"left",se=dh(n,"top","top")||dh(E,"top","top"),me=se?se.scrollTop:void 0;$s!==n&&(T=a[z],Ea=!1,nr=!X&&o.invertSwap||R),M=kw(e,n,a,v,X?1:o.swapThreshold,o.invertedSwapThreshold==null?o.swapThreshold:o.invertedSwapThreshold,nr,$s===n);var le;if(M!==0){var ke=lt(E);do ke-=M,le=$e.children[ke];while(le&&(B(le,"display")==="none"||le===H))}if(M===0||le===n)return O(!1);$s=n,Ta=M;var Le=n.nextElementSibling,Fe=!1;Fe=M===1;var Y=ar(fe,t,E,s,n,a,e,Fe);if(Y!==!1)return(Y===1||Y===-1)&&(Fe=Y===1),Qc=!0,setTimeout(_w,30),L(),Fe&&!Le?t.appendChild(E):n.parentNode.insertBefore(E,Fe?Le:n),se&&gf(se,0,me-se.scrollTop),$e=E.parentNode,T!==void 0&&!nr&&(wr=Math.abs(T-Ae(n)[z])),S(),O(!0)}if(t.contains(E))return O(!1)}return!1},_ignoreWhileAnimating:null,_offMoveEvents:function(){Q(document,"mousemove",this._onTouchMove),Q(document,"touchmove",this._onTouchMove),Q(document,"pointermove",this._onTouchMove),Q(document,"dragover",Fn),Q(document,"mousemove",Fn),Q(document,"touchmove",Fn)},_offUpEvents:function(){var e=this.el.ownerDocument;Q(e,"mouseup",this._onDrop),Q(e,"touchend",this._onDrop),Q(e,"pointerup",this._onDrop),Q(e,"pointercancel",this._onDrop),Q(e,"touchcancel",this._onDrop),Q(document,"selectstart",this)},_onDrop:function(e){var t=this.el,n=this.options;if(rt=lt(E),un=lt(E,n.draggable),Qe("drop",this,{evt:e}),$e=E&&E.parentNode,rt=lt(E),un=lt(E,n.draggable),F.eventCanceled){this._nulling();return}Ss=!1,nr=!1,Ea=!1,clearInterval(this._loopId),clearTimeout(this._dragStartTimer),Zc(this.cloneId),Zc(this._dragStartId),this.nativeDraggable&&(Q(document,"drop",this),Q(t,"dragstart",this._onDragStart)),this._offMoveEvents(),this._offUpEvents(),Aa&&B(document.body,"user-select",""),B(E,"transform",""),e&&($a&&(e.cancelable&&e.preventDefault(),!n.dropBubble&&e.stopPropagation()),H&&H.parentNode&&H.parentNode.removeChild(H),(fe===$e||We&&We.lastPutMode!=="clone")&&ve&&ve.parentNode&&ve.parentNode.removeChild(ve),E&&(this.nativeDraggable&&Q(E,"dragend",this),kc(E),E.style["will-change"]="",$a&&!Ss&&it(E,We?We.options.ghostClass:this.options.ghostClass,!1),it(E,this.options.chosenClass,!1),Ye({sortable:this,name:"unchoose",toEl:$e,newIndex:null,newDraggableIndex:null,originalEvent:e}),fe!==$e?(rt>=0&&(Ye({rootEl:$e,name:"add",toEl:$e,fromEl:fe,originalEvent:e}),Ye({sortable:this,name:"remove",toEl:$e,originalEvent:e}),Ye({rootEl:$e,name:"sort",toEl:$e,fromEl:fe,originalEvent:e}),Ye({sortable:this,name:"sort",toEl:$e,originalEvent:e})),We&&We.save()):rt!==xs&&rt>=0&&(Ye({sortable:this,name:"update",toEl:$e,originalEvent:e}),Ye({sortable:this,name:"sort",toEl:$e,originalEvent:e})),F.active&&((rt==null||rt===-1)&&(rt=xs,un=Ia),Ye({sortable:this,name:"end",toEl:$e,originalEvent:e}),this.save()))),this._nulling()},_nulling:function(){Qe("nulling",this),fe=E=$e=H=Un=ve=_r=hn=Nn=bt=$a=rt=un=xs=Ia=$s=Ta=We=tr=F.dragged=F.ghost=F.clone=F.active=null;var e=this.el;Jr.forEach(function(t){e.contains(t)&&(t.checked=!0)}),Jr.length=_c=wc=0},handleEvent:function(e){switch(e.type){case"drop":case"dragend":this._onDrop(e);break;case"dragenter":case"dragover":E&&(this._onDragOver(e),yw(e));break;case"selectstart":e.preventDefault();break}},toArray:function(){for(var e=[],t,n=this.el.children,s=0,a=n.length,r=this.options;s<a;s++)t=n[s],wt(t,r.draggable,this.el,!1)&&e.push(t.getAttribute(r.dataIdAttr)||xw(t));return e},sort:function(e,t){var n={},s=this.el;this.toArray().forEach(function(a,r){var o=s.children[r];wt(o,this.options.draggable,s,!1)&&(n[a]=o)},this),t&&this.captureAnimationState(),e.forEach(function(a){n[a]&&(s.removeChild(n[a]),s.appendChild(n[a]))}),t&&this.animateAll()},save:function(){var e=this.options.store;e&&e.set&&e.set(this)},closest:function(e,t){return wt(e,t||this.options.draggable,this.el,!1)},option:function(e,t){var n=this.options;if(t===void 0)return n[e];var s=Ba.modifyOption(this,e,t);typeof s<"u"?n[e]=s:n[e]=t,e==="group"&&wf(n)},destroy:function(){Qe("destroy",this);var e=this.el;e[et]=null,Q(e,"mousedown",this._onTapStart),Q(e,"touchstart",this._onTapStart),Q(e,"pointerdown",this._onTapStart),this.nativeDraggable&&(Q(e,"dragover",this),Q(e,"dragenter",this)),Array.prototype.forEach.call(e.querySelectorAll("[draggable]"),function(t){t.removeAttribute("draggable")}),this._onDrop(),this._disableDelayedDragEvents(),Xr.splice(Xr.indexOf(this.el),1),this.el=e=null},_hideClone:function(){if(!hn){if(Qe("hideClone",this),F.eventCanceled)return;B(ve,"display","none"),this.options.removeCloneOnHide&&ve.parentNode&&ve.parentNode.removeChild(ve),hn=!0}},_showClone:function(e){if(e.lastPutMode!=="clone"){this._hideClone();return}if(hn){if(Qe("showClone",this),F.eventCanceled)return;E.parentNode==fe&&!this.options.group.revertClone?fe.insertBefore(ve,E):Un?fe.insertBefore(ve,Un):fe.appendChild(ve),this.options.group.revertClone&&this.animate(E,ve),B(ve,"display",""),hn=!1}}};function yw(e){e.dataTransfer&&(e.dataTransfer.dropEffect="move"),e.cancelable&&e.preventDefault()}function ar(e,t,n,s,a,r,o,l){var c,d=e[et],p=d.options.onMove,h;return window.CustomEvent&&!Xt&&!Fa?c=new CustomEvent("move",{bubbles:!0,cancelable:!0}):(c=document.createEvent("Event"),c.initEvent("move",!0,!0)),c.to=t,c.from=e,c.dragged=n,c.draggedRect=s,c.related=a||t,c.relatedRect=r||Ae(t),c.willInsertAfter=l,c.originalEvent=o,e.dispatchEvent(c),p&&(h=p.call(d,c,o)),h}function kc(e){e.draggable=!1}function _w(){Qc=!1}function ww(e,t,n){var s=Ae(Ls(n.el,0,n.options,!0)),a=bf(n.el,n.options,H),r=10;return t?e.clientX<a.left-r||e.clientY<s.top&&e.clientX<s.right:e.clientY<a.top-r||e.clientY<s.bottom&&e.clientX<s.left}function $w(e,t,n){var s=Ae(Ad(n.el,n.options.draggable)),a=bf(n.el,n.options,H),r=10;return t?e.clientX>a.right+r||e.clientY>s.bottom&&e.clientX>s.left:e.clientY>a.bottom+r||e.clientX>s.right&&e.clientY>s.top}function kw(e,t,n,s,a,r,o,l){var c=s?e.clientY:e.clientX,d=s?n.height:n.width,p=s?n.top:n.left,h=s?n.bottom:n.right,v=!1;if(!o){if(l&&wr<d*a){if(!Ea&&(Ta===1?c>p+d*r/2:c<h-d*r/2)&&(Ea=!0),Ea)v=!0;else if(Ta===1?c<p+wr:c>h-wr)return-Ta}else if(c>p+d*(1-a)/2&&c<h-d*(1-a)/2)return Sw(t)}return v=v||o,v&&(c<p+d*r/2||c>h-d*r/2)?c>p+d/2?1:-1:0}function Sw(e){return lt(E)<lt(e)?1:-1}function xw(e){for(var t=e.tagName+e.className+e.src+e.href+e.textContent,n=t.length,s=0;n--;)s+=t.charCodeAt(n);return s.toString(36)}function Cw(e){Jr.length=0;for(var t=e.getElementsByTagName("input"),n=t.length;n--;){var s=t[n];s.checked&&Jr.push(s)}}function $r(e){return setTimeout(e,0)}function Zc(e){return clearTimeout(e)}ao&&ne(document,"touchmove",function(e){(F.active||Ss)&&e.cancelable&&e.preventDefault()});F.utils={on:ne,off:Q,css:B,find:ff,is:function(e,t){return!!wt(e,t,e,!1)},extend:lw,throttle:mf,closest:wt,toggleClass:it,clone:vf,index:lt,nextTick:$r,cancelNextTick:Zc,detectDirection:_f,getChild:Ls,expando:et};F.get=function(e){return e[et]};F.mount=function(){for(var e=arguments.length,t=new Array(e),n=0;n<e;n++)t[n]=arguments[n];t[0].constructor===Array&&(t=t[0]),t.forEach(function(s){if(!s.prototype||!s.prototype.constructor)throw"Sortable: Mounted plugin must be a constructor function, not ".concat({}.toString.call(s));s.utils&&(F.utils=Lt(Lt({},F.utils),s.utils)),Ba.mount(s)})};F.create=function(e,t){return new F(e,t)};F.version=rw;var xe=[],ka,ed,td=!1,Sc,xc,Qr,Sa;function Aw(){function e(){this.defaults={scroll:!0,forceAutoScrollFallback:!1,scrollSensitivity:30,scrollSpeed:10,bubbleScroll:!0};for(var t in this)t.charAt(0)==="_"&&typeof this[t]=="function"&&(this[t]=this[t].bind(this))}return e.prototype={dragStarted:function(t){var n=t.originalEvent;this.sortable.nativeDraggable?ne(document,"dragover",this._handleAutoScroll):this.options.supportPointer?ne(document,"pointermove",this._handleFallbackAutoScroll):n.touches?ne(document,"touchmove",this._handleFallbackAutoScroll):ne(document,"mousemove",this._handleFallbackAutoScroll)},dragOverCompleted:function(t){var n=t.originalEvent;!this.options.dragOverBubble&&!n.rootEl&&this._handleAutoScroll(n)},drop:function(){this.sortable.nativeDraggable?Q(document,"dragover",this._handleAutoScroll):(Q(document,"pointermove",this._handleFallbackAutoScroll),Q(document,"touchmove",this._handleFallbackAutoScroll),Q(document,"mousemove",this._handleFallbackAutoScroll)),mh(),kr(),cw()},nulling:function(){Qr=ed=ka=td=Sa=Sc=xc=null,xe.length=0},_handleFallbackAutoScroll:function(t){this._handleAutoScroll(t,!0)},_handleAutoScroll:function(t,n){var s=this,a=(t.touches?t.touches[0]:t).clientX,r=(t.touches?t.touches[0]:t).clientY,o=document.elementFromPoint(a,r);if(Qr=t,n||this.options.forceAutoScrollFallback||Fa||Xt||Aa){Cc(t,this.options,o,n);var l=mn(o,!0);td&&(!Sa||a!==Sc||r!==xc)&&(Sa&&mh(),Sa=setInterval(function(){var c=mn(document.elementFromPoint(a,r),!0);c!==l&&(l=c,kr()),Cc(t,s.options,c,n)},10),Sc=a,xc=r)}else{if(!this.options.bubbleScroll||mn(o,!0)===Pt()){kr();return}Cc(t,this.options,mn(o,!1),!1)}}},Yt(e,{pluginName:"scroll",initializeByDefault:!0})}function kr(){xe.forEach(function(e){clearInterval(e.pid)}),xe=[]}function mh(){clearInterval(Sa)}var Cc=mf(function(e,t,n,s){if(t.scroll){var a=(e.touches?e.touches[0]:e).clientX,r=(e.touches?e.touches[0]:e).clientY,o=t.scrollSensitivity,l=t.scrollSpeed,c=Pt(),d=!1,p;ed!==n&&(ed=n,kr(),ka=t.scroll,p=t.scrollFn,ka===!0&&(ka=mn(n,!0)));var h=0,v=ka;do{var w=v,k=Ae(w),C=k.top,L=k.bottom,O=k.left,S=k.right,q=k.width,W=k.height,M=void 0,T=void 0,R=w.scrollWidth,X=w.scrollHeight,z=B(w),se=w.scrollLeft,me=w.scrollTop;w===c?(M=q<R&&(z.overflowX==="auto"||z.overflowX==="scroll"||z.overflowX==="visible"),T=W<X&&(z.overflowY==="auto"||z.overflowY==="scroll"||z.overflowY==="visible")):(M=q<R&&(z.overflowX==="auto"||z.overflowX==="scroll"),T=W<X&&(z.overflowY==="auto"||z.overflowY==="scroll"));var le=M&&(Math.abs(S-a)<=o&&se+q<R)-(Math.abs(O-a)<=o&&!!se),ke=T&&(Math.abs(L-r)<=o&&me+W<X)-(Math.abs(C-r)<=o&&!!me);if(!xe[h])for(var Le=0;Le<=h;Le++)xe[Le]||(xe[Le]={});(xe[h].vx!=le||xe[h].vy!=ke||xe[h].el!==w)&&(xe[h].el=w,xe[h].vx=le,xe[h].vy=ke,clearInterval(xe[h].pid),(le!=0||ke!=0)&&(d=!0,xe[h].pid=setInterval(function(){s&&this.layer===0&&F.active._onTouchMove(Qr);var Fe=xe[this.layer].vy?xe[this.layer].vy*l:0,Y=xe[this.layer].vx?xe[this.layer].vx*l:0;typeof p=="function"&&p.call(F.dragged.parentNode[et],Y,Fe,e,Qr,xe[this.layer].el)!=="continue"||gf(xe[this.layer].el,Y,Fe)}.bind({layer:h}),24))),h++}while(t.bubbleScroll&&v!==c&&(v=mn(v,!1)));td=d}},30),Sf=function(e){var t=e.originalEvent,n=e.putSortable,s=e.dragEl,a=e.activeSortable,r=e.dispatchSortableEvent,o=e.hideGhostForTarget,l=e.unhideGhostForTarget;if(t){var c=n||a;o();var d=t.changedTouches&&t.changedTouches.length?t.changedTouches[0]:t,p=document.elementFromPoint(d.clientX,d.clientY);l(),c&&!c.el.contains(p)&&(r("spill"),this.onSpill({dragEl:s,putSortable:n}))}};function Md(){}Md.prototype={startIndex:null,dragStart:function(e){var t=e.oldDraggableIndex;this.startIndex=t},onSpill:function(e){var t=e.dragEl,n=e.putSortable;this.sortable.captureAnimationState(),n&&n.captureAnimationState();var s=Ls(this.sortable.el,this.startIndex,this.options);s?this.sortable.el.insertBefore(t,s):this.sortable.el.appendChild(t),this.sortable.animateAll(),n&&n.animateAll()},drop:Sf};Yt(Md,{pluginName:"revertOnSpill"});function Id(){}Id.prototype={onSpill:function(e){var t=e.dragEl,n=e.putSortable,s=n||this.sortable;s.captureAnimationState(),t.parentNode&&t.parentNode.removeChild(t),s.animateAll()},drop:Sf};Yt(Id,{pluginName:"removeOnSpill"});F.mount(new Aw);F.mount(Id,Md);var Sr=class extends qe{constructor(){super(),this.playlistId="",this._query=""}deps(){return[i.playlistVersion,i.songs,this.playlistId,this._query]}get already(){let t=i.playlists.find(n=>n.id===this.playlistId);return new Set(t?.songIds||[])}get filtered(){let t=this._query.trim().toLowerCase();return t?i.songs.filter(n=>`${n.title} ${n.artist} ${n.album}`.toLowerCase().includes(t)):i.songs}render(){let t=this.already,n=this.filtered,s=i.songs.filter(a=>!t.has(a.id)).length;return u`
      <input
        class="input"
        id="addsongs-filter"
        type="text"
        placeholder="筛选歌曲（标题 / 歌手 / 专辑）"
        autocomplete="off"
        spellcheck="false"
        .value=${this._query}
        @input=${a=>{this._query=a.target.value,this.requestUpdate()}}
        @keydown=${a=>{a.key==="Enter"&&(a.preventDefault(),a.stopPropagation())}}
      />
      <div class="addsongs__head">
        <span id="addsongs-count">
          ${this._query.trim()?`\u5339\u914D ${N(n.length)} \u9996`:`\u5171 ${N(i.songs.length)} \u9996 \xB7 \u5176\u4E2D ${N(s)} \u9996\u5C1A\u672A\u52A0\u5165`}
        </span>
        <span class="addsongs__actions">
          <button class="btn btn--sm" type="button" data-addsongs="none" @click=${()=>this.setAll(!1)}>
            清空选择
          </button>
          <button class="btn btn--sm" type="button" data-addsongs="all" @click=${()=>this.setAll(!0)}>
            全选
          </button>
        </span>
      </div>
      <div class="addsongs" id="addsongs-list">
        ${n.length?ut(n,a=>a.id,a=>{let r=t.has(a.id);return u`
                    <label class="addsongs__row">
                      <input type="checkbox" data-song-check=${a.id} ?checked=${r} ?disabled=${r} />
                      <span class="addsongs__text">
                        <span class="addsongs__title u-ellipsis">${a.title}</span>
                        <span class="addsongs__sub u-ellipsis">${a.artist}${a.album?` \xB7 ${a.album}`:""}</span>
                      </span>
                      ${r?u`<span class="addsongs__tag">已在歌单</span>`:A}
                    </label>
                  `}):u`<div class="addsongs__empty">没有匹配的歌曲</div>`}
      </div>
    `}setAll(t){for(let n of this.querySelectorAll("[data-song-check]:not(:disabled)"))n.checked=t}};Re(Sr,"properties",{playlistId:{type:String}});Se("mp-add-songs",Sr);function xf(e){ue({title:"\u65B0\u5EFA\u6B4C\u5355",desc:"\u6B4C\u5355\u540D\u79F0\u53EF\u4EE5\u968F\u65F6\u4FEE\u6539\u3002",body:u`<input class="input" data-field="name" type="text" placeholder="例如：深夜循环" maxlength="40" />`,okText:"\u521B\u5EFA",onOk:async t=>{let n=String(t.name||"").trim();if(!n)return"\u8BF7\u8F93\u5165\u6B4C\u5355\u540D\u79F0";if(i.playlists.some(a=>a.name===n))return"\u5DF2\u5B58\u5728\u540C\u540D\u6B4C\u5355";let s=await gi(n);return s?(e?.(s),m(`\u5DF2\u521B\u5EFA\u6B4C\u5355\u300C${n}\u300D`,{tone:"success"}),!0):"\u65B0\u5EFA\u6B4C\u5355\u5931\u8D25\uFF0C\u8BF7\u67E5\u770B\u63D0\u793A"}})}function Mw(e,t){let n=ge(e);!n||n.locked||ue({title:"\u91CD\u547D\u540D\u6B4C\u5355",body:u`<input class="input" data-field="name" type="text" .value=${n.name} maxlength="40" />`,okText:"\u4FDD\u5B58",onOk:s=>{let a=String(s.name||"").trim();return a?(vi(e,a),!0):"\u540D\u79F0\u4E0D\u80FD\u4E3A\u7A7A"}})}function Iw(e,t){let n=ge(e);!n||n.locked||ue({title:`\u5220\u9664\u6B4C\u5355\u300C${n.name}\u300D\uFF1F`,desc:"\u53EA\u4F1A\u5220\u9664\u6B4C\u5355\u672C\u8EAB\uFF0C\u672C\u5730\u97F3\u4E50\u6587\u4EF6\u4E0D\u4F1A\u88AB\u5220\u9664\u3002",okText:"\u5220\u9664",danger:!0,onOk:()=>(bi(e),t?.(),m("\u6B4C\u5355\u5DF2\u5220\u9664"),!0)})}function Zr(e,t){let n=ge(e);if(!n)return;let s=yi(e,t);s?m(`\u5DF2\u6DFB\u52A0 ${s} \u9996\u5230\u300C${n.name}\u300D`,{tone:"success"}):m("\u6240\u9009\u6B4C\u66F2\u5DF2\u5728\u8BE5\u6B4C\u5355\u4E2D")}function Tw(e){let t=ge(e);if(!t)return;if(!i.songs.length){m("\u672C\u5730\u66F2\u5E93\u8FD8\u662F\u7A7A\u7684\uFF0C\u5148\u626B\u63CF\u97F3\u4E50\u6587\u4EF6\u5939\u5427",{tone:"warning"});return}let n=new Set(t.songIds);ue({title:`\u6DFB\u52A0\u6B4C\u66F2\u5230\u300C${t.name}\u300D`,desc:"\u52FE\u9009\u8981\u52A0\u5165\u7684\u6B4C\u66F2\uFF1B\u5DF2\u7ECF\u5728\u6B4C\u5355\u91CC\u7684\u4F1A\u4FDD\u6301\u9009\u4E2D\u3002",body:u`<mp-add-songs .playlistId=${e}></mp-add-songs>`,okText:"\u52A0\u5165\u6B4C\u5355",onOk:(s,a)=>{let r=[...a.querySelectorAll("[data-song-check]:checked")].map(o=>o.dataset.songCheck).filter(o=>!n.has(o));return r.length?(Zr(e,r),!0):"\u6CA1\u6709\u9009\u4E2D\u65B0\u7684\u6B4C\u66F2"}})}function gh(e,t){let n=ge(e);if(!n)return;let s=[{id:"play",label:"\u64AD\u653E\u8FD9\u4E2A\u6B4C\u5355",icon:"play"},{id:"queue",label:"\u52A0\u5165\u64AD\u653E\u5217\u8868",icon:"queue"},{id:"sep1",kind:"sep"}];n.locked||(s.push({id:"rename",label:"\u91CD\u547D\u540D",icon:"edit"}),s.push({id:"delete",label:"\u5220\u9664\u6B4C\u5355",icon:"trash",danger:!0}));let a=t.getBoundingClientRect();an({x:a.left,y:a.bottom+6,align:"right",items:s,onPick:async r=>{switch(r){case"play":Ew(n);break;case"queue":{let o=us(n);if(!o.length){m(`\u300C${n.name}\u300D\u91CC\u6CA1\u6709\u53EF\u64AD\u653E\u7684\u6B4C\u66F2`,{tone:"warning"});break}(await Vn(()=>Promise.resolve().then(()=>(Vi(),Hl)).then(l=>l.b6),_d([0,1]))).appendToQueue(o),m(`\u5DF2\u628A ${N(o.length)} \u9996\u52A0\u5165\u64AD\u653E\u5217\u8868`,{tone:"success"});break}case"rename":Mw(n.id);break;case"delete":Iw(n.id,()=>As("library"));break}}})}function Ew(e){let t=us(e);if(!t.length){m(`\u300C${e.name}\u300D\u91CC\u6CA1\u6709\u53EF\u64AD\u653E\u7684\u6B4C\u66F2`,{tone:"warning"});return}Vn(async()=>{let{playContext:n}=await Promise.resolve().then(()=>(Vi(),Hl)).then(s=>s.b6);return{playContext:n}},_d([0,1])).then(({playContext:n})=>{n(t,0,{type:"playlist",id:e.id})})}var vh=0,xr=class extends qe{firstUpdated(){this.bindDrag()}bindDrag(){let t=this.querySelector("#playlist-nav");!t||this._sortable||(this._sortable=F.create(t,{draggable:".navitem",filter:'[data-locked="true"]',animation:0,ghostClass:"is-dragging",onEnd:n=>this.onDragEnd(n)}))}onDragEnd(t){vh=Date.now();let n=t.oldIndex,s=t.newIndex;if(n==null||s==null||n===s)return;let a=t.from,r=Array.from(a.children).filter(o=>o!==t.item);a.insertBefore(t.item,r[n]??null),_i(n-1,s-1),m("\u5DF2\u8C03\u6574\u6B4C\u5355\u987A\u5E8F",{duration:1400})}onSidebarClick(t){if(Date.now()-vh<260)return;let n=t.target.closest('[data-act="pl-more"]');if(n){t.stopPropagation(),gh(n.dataset.id,n);return}let s=t.target.closest("[data-nav]");if(!s)return;let a=s.dataset.nav;a==="playlist"?As("playlist",s.dataset.playlist):As(a)}render(){let t=i.playlists.filter(s=>s.id!==He),n=[ge(He),...t].filter(Boolean);return u`
      <aside
        class="sidebar"
        id="sidebar"
        @click=${s=>this.onSidebarClick(s)}
        @contextmenu=${s=>{let a=s.target.closest('[data-nav="playlist"]');a&&(s.preventDefault(),gh(a.dataset.playlist,a))}}
      >
        <div class="sidebar__scroll">
          <nav class="sidebar__group" aria-label="曲库">
            <div class="sidebar__label">曲库</div>
            <button
              class="navitem"
              type="button"
              data-nav="library"
              aria-selected=${String(i.view==="library")}
            >
              ${g("music","navitem__icon")}
              <span class="navitem__text">本地歌曲</span>
              <span class="navitem__tail">
                <span class="navitem__badge" id="badge-library">${N(i.songs.length)}</span>
              </span>
            </button>
            <button class="navitem" type="button" data-nav="queue" aria-selected=${String(i.view==="queue")}>
              ${g("queue","navitem__icon")}
              <span class="navitem__text">播放列表</span>
              <span class="navitem__tail">
                <span class="navitem__badge" id="badge-queue"
                  >${N(ds(i.queue).length)}</span
                >
              </span>
            </button>
          </nav>

          <nav class="sidebar__group" aria-label="歌单">
            <div class="sidebar__label">
              <span>歌单</span>
              <button
                class="sidebar__label-btn"
                id="btn-new-playlist-sm"
                type="button"
                data-tip="新建歌单"
                aria-label="新建歌单"
                @click=${()=>xf(s=>s&&As("playlist",s.id))}
              >
                ${g("plus")}
              </button>
            </div>
            <div id="playlist-nav">
              ${ut(n,s=>s.id,s=>this.playlistItem(s))}
            </div>
          </nav>
        </div>
      </aside>
    `}playlistItem(t){let n=i.view==="playlist"&&i.playlistId===t.id;return u`
      <button
        class="navitem"
        type="button"
        data-nav="playlist"
        data-playlist=${t.id}
        data-locked=${String(!!t.locked)}
        draggable=${t.locked?"false":"true"}
        aria-selected=${String(n)}
      >
        ${g(t.id===He?"heart":"playlist","navitem__icon")}
        <span class="navitem__text">${t.name}</span>
        <span class="navitem__tail">
          <span class="navitem__badge">${N(us(t).length)}</span>
          <span class="navitem__more" data-act="pl-more" data-id=${t.id} role="button" aria-label="${t.name}操作"
            >${g("more")}</span
          >
        </span>
      </button>
    `}};Re(xr,"deps",t=>[t.view,t.playlistId,t.playlistVersion,t.songs,t.queue,t.onlineSongs.size]);Se("mp-sidebar",xr);var Pw=wd(class extends $d{constructor(){super(...arguments),this.key=A}render(e,t){return this.key=e,t}update(e,[t,n]){return t!==this.key&&(tf(e),this.key=t),n}}),Td=[{id:"auto",label:"\u81EA\u52A8\u8BC6\u522B\uFF08\u6309\u63A5\u53E3\u5730\u5740\u4E0E\u6A21\u578B\u540D\u5224\u65AD\uFF09",hint:"\u8BC6\u522B\u4E0D\u51FA\u65F6\u6309 OpenAI \u517C\u5BB9\u63A5\u53E3\u5904\u7406"},{id:"openai",label:"OpenAI\uFF08GPT-5 \u7CFB\u5217 / o \u7CFB\u5217\uFF09",hint:"o \u7CFB\u5217\u65E0\u6CD5\u5B8C\u5168\u5173\u95ED\u601D\u8003\uFF0C\u53EA\u80FD\u964D\u5230\u6700\u4F4E\u6863"},{id:"deepseek",label:"DeepSeek\uFF08deepseek-chat / reasoner\uFF09",hint:"\u601D\u8003\u6A21\u5F0F\u4E0B temperature \u4F1A\u88AB\u5FFD\u7565"},{id:"anthropic",label:"Anthropic Claude",hint:"\u5F00\u542F\u601D\u8003\u65F6 temperature \u5FC5\u987B\u4E3A 1\uFF0C\u7A0B\u5E8F\u4F1A\u81EA\u52A8\u53BB\u6389\u5B83"},{id:"gemini",label:"Google Gemini",hint:"Pro \u7CFB\u5217\u65E0\u6CD5\u5173\u95ED\u601D\u8003"},{id:"qwen",label:"\u963F\u91CC\u901A\u4E49\u5343\u95EE Qwen",hint:"\u4EC5\u300C\u6DF7\u5408\u601D\u8003\u300D\u6A21\u578B\u53EF\u5173\u95ED\uFF1B\u90E8\u5206\u5F00\u6E90\u6A21\u578B\u53EA\u652F\u6301\u6D41\u5F0F"},{id:"glm",label:"\u667A\u8C31 GLM",hint:"GLM-5.3 \u7CFB\u5217\u4F20 disabled \u4F1A\u62A5\u9519"},{id:"kimi",label:"\u6708\u4E4B\u6697\u9762 Kimi",hint:"kimi-k3 / k2.7-code \u59CB\u7EC8\u601D\u8003\uFF0C\u4F20 thinking \u4F1A\u62A5\u9519"},{id:"minimax",label:"MiniMax",hint:"\u5B98\u65B9\u672A\u63D0\u4F9B\u5173\u95ED\u601D\u8003\u7684\u53C2\u6570\uFF0C\u53EA\u80FD\u4FDD\u6301\u9ED8\u8BA4"},{id:"xai",label:"xAI Grok",hint:"reasoning_effort=none \u53EF\u771F\u6B63\u5173\u95ED"},{id:"openrouter",label:"OpenRouter\uFF08\u7EDF\u4E00\u7F51\u5173\uFF09",hint:"\u7EDF\u4E00 reasoning \u5B57\u6BB5\uFF1B\u6807\u8BB0 mandatory \u7684\u6A21\u578B\u4E0D\u63A5\u53D7\u5173\u95ED"},{id:"siliconflow",label:"SiliconFlow\uFF08\u7845\u57FA\u6D41\u52A8\uFF09",hint:"R1 \u7C7B\u7EAF\u63A8\u7406\u6A21\u578B\u65E0\u6CD5\u5173\u95ED"},{id:"ollama",label:"Ollama\uFF08\u672C\u5730\uFF0COpenAI \u517C\u5BB9\uFF09",hint:"\u672C\u5730\u517C\u5BB9\u5C42\u7528 reasoning_effort\uFF1BGPT-OSS \u65E0\u6CD5\u5B8C\u5168\u5173\u95ED"}];function Dw(e){return Td.find(t=>t.id===e)?.label||e||"\u81EA\u52A8\u8BC6\u522B"}function Cf(e){return Td.find(t=>t.id===e)?.hint||""}var Af=[{key:"aiLyricsClean",label:"\u5339\u914D\u6B4C\u8BCD\u524D\u7528 AI \u6E05\u6D17\u5143\u6570\u636E",when:"\u6BCF\u6B21\u81EA\u52A8\u5339\u914D\u6B4C\u8BCD\u4E4B\u524D\uFF08\u672C\u5730\u6807\u7B7E\u5339\u914D\u4E0D\u5230\u3001\u8981\u8054\u7F51\u627E\u6B4C\u8BCD\u65F6\uFF09",detail:"AI \u4ECE\u6587\u4EF6\u540D\u8FD8\u539F\u771F\u5B9E\u7684\u6807\u9898 / \u6B4C\u624B\uFF0C\u518D\u62FF\u5B83\u53BB\u5339\u914D\uFF1B\u4E00\u6B21\u8C03\u7528\u53EF\u80FD\u8981\u5341\u51E0\u79D2"},{key:"aiDownloadTag",label:"\u4E0B\u8F7D\u5B8C\u6210\u540E\u7528 AI \u6574\u7406\u5143\u6570\u636E",when:"\u6BCF\u6B21\u4E0B\u8F7D\u7ED3\u675F\u4E4B\u540E\uFF0C\u5728\u540E\u53F0\u8FDB\u884C\uFF08\u542B\u4ECE\u8BD5\u542C\u7F13\u5B58\u590D\u5236\u7684\u90A3\u6761\u8DEF\u5F84\uFF09",detail:"AI \u8FD8\u539F\u6807\u9898 / \u6B4C\u624B / \u4E13\u8F91\uFF0C\u5E76**\u5199\u56DE\u6B4C\u66F2\u6587\u4EF6\u7684\u6807\u7B7E**\uFF08m4a / flac\uFF09\uFF0C\u4E0D\u53EF\u64A4\u9500"}];function Mf(e={}){return Af.map(t=>({...t,on:e?.[t.key]!==!1}))}function Lw(e={}){return Mf(e).some(t=>t.on)}function Ow(e){let t=Af.find(n=>n.key===e);return t?e==="aiDownloadTag"?`\u5DF2\u5F00\u542F\u300C${t.label}\u300D\uFF1A${t.when}\u4F1A\u628A\u6587\u4EF6\u540D\u4E0E\u73B0\u6709\u6807\u7B7E\u4EA4\u7ED9 AI\uFF0C\u5E76\u5199\u56DE\u6587\u4EF6\u6807\u7B7E\uFF08\u4E0D\u53EF\u64A4\u9500\uFF09\uFF1B\u968F\u65F6\u53EF\u5728\u8BBE\u7F6E\u91CC\u5173\u6389`:`\u5DF2\u5F00\u542F\u300C${t.label}\u300D\uFF1A${t.when}\u4F1A\u5148\u7B49\u4E00\u6B21 AI \u8C03\u7528\uFF08\u53EF\u80FD\u5341\u51E0\u79D2\uFF09\uFF1B\u968F\u65F6\u53EF\u5728\u8BBE\u7F6E\u91CC\u5173\u6389`:""}function Rw(e){if(!Array.isArray(e))return[];let t=new Set,n=[];for(let s of e){let a=typeof s=="string"?s:s?.id;typeof a!="string"||!a.startsWith("bili:")||a.length<=5||t.has(a)||(t.add(a),n.push(a))}return n}function qw(){if(!x())return;let e=null,t=()=>{let n=Rw(i.queue),s=n.join(`
`);s!==e&&(e=s,y.onlineProtectIDs(n).catch(a=>{console.warn("[online-cache] \u4E0A\u62A5\u64AD\u653E\u961F\u5217\u5F15\u7528\u5931\u8D25\uFF08\u53EA\u5F71\u54CD\u7A7A\u95F2\u6E05\u7406\u7684\u4FDD\u5B88\u7A0B\u5EA6\uFF09",a)}))};Ft(t),t()}var nd=null,If=0;function bh(){return{stats:nd,rev:If}}async function Tf(){if(!x())return null;try{let e=await y.onlineCacheStats();return nd=e&&typeof e=="object"?e:null,If+=1,Ve(),nd}catch(e){return console.warn("[online-cache] \u8BFB\u53D6\u8BD5\u542C\u7F13\u5B58\u5360\u7528\u5931\u8D25",e),null}}function Nw(e){let t=e?.stats;if(!t)return"\u6B63\u5728\u8BFB\u53D6\u2026";let n=((Number(t.bytes)||0)/1024/1024).toFixed(1);return`\u5DF2\u7F13\u5B58 ${Number(t.count)||0} \u4E2A\u8BD5\u542C\u6587\u4EF6\uFF0C\u5171 ${n} MB`}function Fw(e){if(!e)return"\u6E05\u7406\u5931\u8D25";if(e.skipped)return`\u672A\u6E05\u7406\uFF1A${e.skipped}`;let t=Number(e.deleted)||0,n=((Number(e.bytes)||0)/1024/1024).toFixed(1),s=Number(e.kept)||0,a=s>0?`\uFF0C\u4FDD\u7559 ${s} \u4E2A\u8FD8\u5728\u64AD\u653E\u5217\u8868 / \u6B4C\u5355 / \u559C\u6B22\u91CC\u7684`:"";return t===0?`\u6CA1\u6709\u53EF\u6E05\u7406\u7684\u8BD5\u542C\u7F13\u5B58${s>0?`\uFF08${s} \u4E2A\u90FD\u8FD8\u5728\u5F15\u7528\u4E2D\uFF09`:""}`:`\u5DF2\u6E05\u7406 ${t} \u4E2A\u672A\u5F15\u7528\u7684\u8BD5\u542C\u7F13\u5B58\uFF08${n} MB\uFF09${a}`}async function Bw(){if(!x())return m("\u6D4F\u89C8\u5668\u9884\u89C8\u65E0\u6CD5\u6E05\u7406\u7F13\u5B58",{tone:"warning"}),null;let e=m("\u6B63\u5728\u6E05\u7406\u672A\u5F15\u7528\u7684\u8BD5\u542C\u7F13\u5B58\u2026",{duration:0});try{let t=await y.onlineCleanupCache();return await Tf(),m(Fw(t),{duration:4200}),t}catch(t){return m(`\u6E05\u7406\u5931\u8D25\uFF1A${t?.message??t}`,{tone:"error",duration:6e3}),null}finally{e?.close?.()}}var Ne=!1,yh=!1,Ac="",Ge=null,_h=0,kt=null,fn=0,gn=null,Ts=null,be=null,vn=-1,ir=-1,eo=0,Mc=null,Kt=!1,Ic=[],Gt=null,Pa=0,wh=5,Ze=null,Cr=!1,Tt=null,Et=null,$h=null,pn=null,Cs=null,bn=null,Es="idle",Wn="loading",ct=Es,zn=null,Hn=!1,Tc=0,sd=0,kh=1500,Uw=12e3;async function Ww(){if(yh)return Ne;if(yh=!0,!x())return!1;try{let e=await y.playerAvailable();Ne=e?.available===!0,Ac=e?.reason||"",Ne||console.warn("[audio] \u540E\u7AEF\u97F3\u9891\u4E0D\u53EF\u7528\uFF0C\u56DE\u9000\u5230 <audio> \u64AD\u653E\uFF1A",Ac||"\u672A\u77E5\u539F\u56E0")}catch(e){Ne=!1,Ac=e?.message||String(e),console.warn("[audio] \u63A2\u6D4B\u540E\u7AEF\u97F3\u9891\u5931\u8D25\uFF0C\u56DE\u9000\u5230 <audio> \u64AD\u653E",e)}return Ne}Ui(()=>{if(Ne&&i.currentId)return!0;let e=document.getElementById("audio-engine");return!!(e&&e.src)});Wi(e=>Gw(e));function zw(){x()&&(Ic.push(ie("player:state",e=>{e&&Ef(e)})),Ic.push(ie("player:error",e=>{e&&ro(e.songId||i.currentId,e.reason,"backend")})),Ic.push(ie("player:ended",()=>{Df()})),Mc&&clearInterval(Mc),Mc=setInterval(Hw,250))}function Ef(e){if(Kt)return;let t=Number(e.durationMs)||0;be={positionMs:Number(e.positionMs)||0,atMs:Number(e.atMs)||0,durationMs:t,playing:e.playing===!0,at:performance.now()},gn=be.playing;let n=!1;t>0&&i.duration!==t&&(i.duration=t,n=!0),i.playing!==be.playing&&(i.playing=be.playing,n=!0),Pf(io(),!0),n?$():je()}function Hw(){!be||!Ne||i.currentId&&(Kt||Pf(io(),!1))}function io(){if(!be||!Ne||Kt)return ir=-1,i.position;let e=be.positionMs;return be.playing&&(e=be.positionMs+(performance.now()-be.at)),be.durationMs>0&&(e=Math.min(e,be.durationMs)),ir=qt(ir,e),Math.round(ir)}function Pf(e,t){if(!Number.isFinite(e)||e<0)return;let n=Math.round(e);!t&&Math.round(n/250)===Math.round(vn/250)||(vn=n,i.position=n,Dn(n),i.config.resumeProgress===!0&&performance.now()-eo>5e3&&(eo=performance.now(),vs()),je())}function Df(){if(i.sleepTimer?.type==="after-song"){ft(!0);return}if(i.playMode==="loop-one"){s$(0);return}ft(!0)}async function Ed(){if(Ne)try{await y.playerSetPlaybackOptions(i.config.skipSilenceHead===!0,i.config.skipSilenceTail===!0,Number(i.config.trackGapSeconds)||0)}catch(e){console.warn("[audio] \u540C\u6B65\u8DF3\u8FC7\u9759\u97F3/\u5207\u6B4C\u95F4\u9694\u5931\u8D25",e)}}async function Lf(){if(!Ne)return;let e=i.config.effectPreset||"off";try{let t=await y.playerSetEffect(e);t&&typeof t.preset=="string"&&t.preset!==e&&(console.warn(`[audio] \u97F3\u6548\u6863\u4F4D ${e} \u975E\u6CD5\uFF0C\u540E\u7AEF\u6536\u655B\u4E3A ${t.preset}`),i.config.effectPreset=t.preset,$?.())}catch(t){console.warn("[audio] \u540C\u6B65\u97F3\u6548\u6863\u4F4D\u5931\u8D25",t)}}var jw=null;function ro(e,t,n="unknown"){let s=e?Be(e)||ot():ot(),a=s?.id||e||null,r=s?.title||a||"\u5F53\u524D\u6B4C\u66F2",o=String(t||"").trim()||"\u672A\u77E5\u539F\u56E0";if(a&&a===Gt){console.warn(`[audio] \u5FFD\u7565\u91CD\u590D\u7684\u64AD\u653E\u5931\u8D25\u62A5\u544A\uFF08${n}\uFF09\uFF1A${r}`);return}a&&(Gt=a),console.warn(`[audio] \u64AD\u653E\u5931\u8D25\uFF08${n}\uFF09\uFF1A${r} \u2014\u2014 ${o}`),Kw(s,o),kt===a&&(kt=null),Ge===a&&(Ge=null),be=null,gn=null,Pa+=1;let l=Pa>=wh,c=!l&&i.playing&&i.sleepTimer?.type!=="after-song"&&i.playMode!=="loop-one";if(l){i.playing=!1,$(),Gt=null,Pa=0,m(`\u8FDE\u7EED ${wh} \u9996\u90FD\u65E0\u6CD5\u64AD\u653E\uFF08${o}\uFF09\uFF0C\u5DF2\u505C\u6B62\u81EA\u52A8\u8DF3\u8FC7`,{tone:"error",duration:8e3});return}if(m(`\u65E0\u6CD5\u64AD\u653E\uFF1A${r}\uFF08${o}\uFF09${c?"\uFF0C\u5DF2\u8DF3\u5230\u4E0B\u4E00\u9996":""}`,{tone:"error",duration:5e3}),!c){i.playing&&(i.playing=!1,$());return}ft(!0)}function Vw(){Pa=0,Gt=null}function Kw(e,t){if(!(!x()||!e?.id)&&!e.online)try{y.unplayableReport(e.id,String(t||""),e.path||"").then(()=>{Si(e.id)}).catch(n=>{console.warn("[audio] \u767B\u8BB0\u300C\u653E\u4E0D\u51FA\u6765\u300D\u5931\u8D25\uFF08\u4E0D\u5F71\u54CD\u64AD\u653E\uFF09",n)})}catch(n){console.warn("[audio] \u767B\u8BB0\u300C\u653E\u4E0D\u51FA\u6765\u300D\u5931\u8D25\uFF08\u4E0D\u5F71\u54CD\u64AD\u653E\uFF09",n)}}function Gw(e){(!e||e===Gt)&&(Gt=null,Pa=0)}function Of(){return i.playNonce===_h?!1:(_h=i.playNonce,!0)}async function Yw(){if(!x())return;if(!Ne){await c$();return}let e=ot();if(!e){Ge!==null&&await Xw();return}if(Of()&&Ge===e.id&&(Ge=null,kt=null,gn=null,be=null,vn=-1),Ge!==e.id){if(e.id===Gt)return;await e$(e);return}n$()}async function Xw(){fn++,Kt=!1,Ge=null,kt=null,gn=null,be=null,vn=-1;try{await y.playerUnload()}catch{}}var Jw=420*1e3;function Qw(e){return e?.isTimeout===!0}function Zw(e,t={}){let n=typeof t.commit=="function"?t.commit:$,s=typeof t.toast=="function"?t.toast:m,a=e?.title||e?.id||"\u5F53\u524D\u6B4C\u66F2";Ge=null,kt=null,be=null,vn=-1,Kt=!1,e?.id&&(Gt=e.id),i.playing=!1,console.warn("[audio] \u88C5\u8F7D\u8D85\u65F6\uFF08\u64AD\u653E\u5F15\u64CE\u65E0\u54CD\u5E94\uFF0C\u672A\u767B\u8BB0\u4E3A\u300C\u653E\u4E0D\u51FA\u6765\u300D\uFF09\uFF1A",a,t.reason||""),n(),s(`\u64AD\u653E\u5F15\u64CE\u65E0\u54CD\u5E94\uFF1A${a}\uFF08\u4E0D\u662F\u6587\u4EF6\u635F\u574F\uFF1B\u53EF\u7A0D\u540E\u91CD\u8BD5\uFF09`,{tone:"error",duration:8e3})}async function e$(e){Ge=e.id;let t=++fn;be=null,vn=-1,Kt=!0;try{await y.playerCancelGap()}catch{}if(t===fn){bn=null,await to(null);try{let n=await zs(y.playerLoad(e.id),Jw,"Player.Load");if(t!==fn||n?.superseded)return;Vw(),kt=e.id,n?.durationMs>0&&(i.duration=n.durationMs),jw={headMs:Number(n?.skippedHeadMs)||0,tailMs:Number(n?.skippedTailMs)||0};let s=Nf(e);s>0&&await y.playerSeek(s),await to(e.id),await Pd(),bn=qf(),Ld(e.id),i.playing&&await y.playerPlay(),gn=!!i.playing;let a=await y.playerState();if(t!==fn)return;Kt=!1,a&&Ef(a)}catch(n){if(t!==fn)return;if(Qw(n)){Zw(e,{reason:n?.message});return}Ge=null,kt=null,Kt=!1,ro(e.id,n?.message??"\u88C5\u8F7D\u5931\u8D25","load")}}}function t$(){return Kt}async function n$(){let e=!!i.playing;if(gn!==e)try{e?await y.playerPlay():await y.playerPause(),gn=e}catch(t){console.warn("[audio] \u540C\u6B65\u64AD\u653E\u72B6\u6001\u5931\u8D25",t)}}async function s$(e){if(!Ne)return;let t=Math.max(0,e);be&&(be={...be,positionMs:t,at:performance.now()}),vn=-1;try{await y.playerSeek(t),await y.playerPlay(),gn=!0}catch(n){console.warn("[audio] \u91CD\u65B0\u8D77\u64AD\u5931\u8D25",n)}}function Rf(){let e=10**(Dd(i.currentId)/20);return(i.muted?0:i.volume)*e}function qf(){let e=10**(Dd(kt)/20);return(i.muted?0:i.volume)*e}function ad(){if(!Ne){lo();return}Pd()}async function Pd(){try{await y.playerSetVolume(i.volume??1,i.muted===!0)}catch(e){console.warn("[audio] \u540C\u6B65\u97F3\u91CF\u5931\u8D25",e)}}function Dd(e){if((i.config.loudnessMode||"off")==="off"||!e)return 0;let t=i.loudnessGains?.[e];return Number.isFinite(t)?t:0}async function to(e){let t=Dd(e);try{await y.playerSetLoudness(t)}catch(n){console.warn("[audio] \u540C\u6B65\u54CD\u5EA6\u8865\u507F\u5931\u8D25",n)}}function Os(){if(!Ne){u$();return}let e=qf();e!==bn&&(bn=e,Pd(),to(kt))}function $t(e){Ni(e),a$(e)}function a$(e){if(!x())return;let t=Math.max(0,Math.min(e,i.duration||0));if(be&&(be={...be,positionMs:t,at:performance.now()}),vn=t,!Ne){p$(e);return}y.playerSeek(t).catch(n=>{console.warn("[audio] \u8DF3\u8F6C\u5931\u8D25",n)})}function i$(){if(!Ne){let e=h$(nc);return e?{bands:e,at:performance.now()}:null}return Op()}var rr=new Map;async function Ld(e){let t=i.config.loudnessMode||"off";if(t==="off"||!x()||!e)return;if(i.loudnessGains?.[e]!==void 0){Ne&&kt===e&&to(e);return}if(rr.has(e))return rr.get(e);let n=(async()=>{try{let s=i.config.loudnessTarget??-16,a=await y.loudnessLookup(e,s);if(a?.measured){Sh(e,a.gainDB);return}if(t==="album")return;let r=await y.loudnessMeasure(e,s);r?.measured&&Sh(e,r.gainDB??r$(r,s))}catch(s){console.warn("[audio] \u54CD\u5EA6\u8865\u507F\u83B7\u53D6\u5931\u8D25",s)}finally{rr.delete(e)}})();return rr.set(e,n),n}function r$(e,t){if(!e?.integrated)return 0;let n=t-e.integrated;if(e.truePeak){let s=-1-e.truePeak;n>s&&(n=s)}return n>24&&(n=24),n<-24&&(n=-24),Math.round(n*100)/100}function Sh(e,t){i.loudnessGains||(i.loudnessGains={}),i.loudnessGains[e]=t,e===kt&&(Ne?Os():lo()),je()}async function o$(){let e=i.config.loudnessTarget??-16;if(i.loudnessGains={},Os(),je(),!!x())try{await y.loudnessInvalidateTarget(e)}catch(t){console.warn("[loudness] \u5931\u6548\u65E7\u8865\u507F\u5931\u8D25",t)}}async function oo(){if(!x())return;let e=i.config.loudnessMode||"off";if(e==="off"){i.loudnessGains={},Os();return}let t=i.config.loudnessTarget??-16;try{let n=e==="album"?await y.loudnessAlbumGains(t):await y.loudnessGainMap(t);i.loudnessGains=n||{},Os(),je(),e==="track"&&i.currentId&&Ld(i.currentId)}catch(n){console.warn("[loudness] \u62C9\u53D6\u8865\u507F\u589E\u76CA\u5931\u8D25",n)}}async function Da(){if(!x())return null;try{let e=await y.loudnessState();return e&&(i.loudnessState=e),e}catch{return null}}function Nf(e){let t=Number(i.pendingResumeMs)||0;if(i.pendingResumeMs=0,!t||i.config.resumeProgress!==!0)return 0;let n=e?.duration||i.duration||0;return n&&t>=n-3e3?0:t}function Ff(){return Ze||(Ze=document.getElementById("audio-engine"),Ze||(Ze=document.createElement("audio"),Ze.id="audio-engine",Ze.preload="auto",Ze.hidden=!0,document.body.appendChild(Ze)),Ze.crossOrigin="anonymous",l$(Ze),Ze)}function l$(e){e.dataset.bound!=="1"&&(e.dataset.bound="1",e.addEventListener("loadedmetadata",()=>{if(Number.isFinite(e.duration)&&e.duration>0&&(i.duration=e.duration*1e3,je(),$()),Ts!=null){let t=Ts;Ts=null;try{e.currentTime=Math.max(0,Math.min(t,i.duration||0)/1e3)}catch{}}Bf(e)}),e.addEventListener("timeupdate",()=>{document.getElementById("progress")?.dataset.dragging!=="true"&&(i.position=e.currentTime*1e3,Dn(i.position),i.config.resumeProgress===!0&&performance.now()-eo>5e3&&(eo=performance.now(),vs()),je())}),e.addEventListener("play",()=>{ct!==Wn&&(Hn=!1,i.playing=!0,Tt?.state==="suspended"&&Tt.resume().catch(()=>{}),je())}),e.addEventListener("pause",()=>{if(Hn){Hn=!1;return}if(ct===Wn||e.ended)return;let t=Number.isFinite(e.duration)&&e.duration>0?e.duration*1e3:i.duration||0;t&&(Number.isFinite(e.currentTime)?e.currentTime*1e3:i.position)>=t-300||Tc&&performance.now()-Tc<kh||(i.playing=!1,je())}),e.addEventListener("ended",()=>{Tc=performance.now(),Df()}),e.addEventListener("error",()=>{ct=Es,Hn=!1;let t=ot();if(!t||sd&&performance.now()-sd<kh||!e.error||!e.error.code)return;let n=e.error?.code,s=n===4?"\u683C\u5F0F\u65E0\u6CD5\u64AD\u653E\uFF08\u89E3\u7801\u5931\u8D25\uFF09":n===3?"\u97F3\u9891\u6570\u636E\u635F\u574F":n===2?"\u7F51\u7EDC\u4E2D\u65AD":"\u97F3\u9891\u52A0\u8F7D\u5931\u8D25";ro(t.id,s,"legacy")}))}async function c$(){let e=Ff(),t=ot();if(!t){Ge!==null&&(e.pause(),e.removeAttribute("src"),e.load(),Ge=null,ct=Es);return}if(Of()&&Ge===t.id&&ct!==Wn)try{e.currentTime=0}catch{}if(Ge!==t.id){if(t.id===Gt)return;Ge=t.id,ct=Wn,Hn=!1,zn&&clearTimeout(zn),zn=setTimeout(()=>{zn=null,ct===Wn&&Bf(Ze)},Uw);let n=++fn,s=null;try{s=t.streamUrl||await y.mediaUrl(t.id)}catch(a){ct=Es,Ge=null,ro(t.id,a?.message??"\u53D6\u64AD\u653E\u5730\u5740\u5931\u8D25","legacy-url");return}if(n!==fn)return;if(!s){ct=Es;return}Ts=Nf(t),e.src=s,sd=performance.now(),e.load(),d$(e),lo(),Ld(t.id),i.playing&&e.paused&&e.play().catch(a=>{let r=a?.name||"";r==="AbortError"||r==="NotAllowedError"||console.warn("[audio] \u64AD\u653E\u5931\u8D25",a)});return}ct!==Wn&&(i.playing&&e.paused?e.play().catch(()=>{}):!i.playing&&!e.paused&&(Hn=!0,e.pause()))}function Bf(e){if(zn&&(clearTimeout(zn),zn=null),ct!==Wn)return;ct=Es;let t=e||Ze;t&&(i.playing&&t.paused?t.play().catch(()=>{}):!i.playing&&!t.paused&&(Hn=!0,t.pause()))}function d$(e){if(Cr)return!1;if(Tt&&Et)return!0;let t=window.AudioContext||window.webkitAudioContext;if(!t)return Cr=!0,!1;try{Tt=new t,Et=Tt.createGain(),Et.gain.value=1,$h=Tt.createMediaElementSource(e),$h.connect(Et),Et.connect(Tt.destination);try{pn=Tt.createAnalyser(),pn.fftSize=512,pn.smoothingTimeConstant=.76,Cs=new Uint8Array(pn.frequencyBinCount),Et.connect(pn)}catch{pn=null,Cs=null}return bn=null,!0}catch(n){return console.warn("[audio] Web Audio \u94FE\u8DEF\u5EFA\u7ACB\u5931\u8D25\uFF0C\u9000\u56DE\u5143\u7D20\u97F3\u91CF",n),Cr=!0,!1}}function lo(){let e=Ze,t=Rf();if(Tt&&Et&&!Cr){let n=Tt.currentTime;try{Et.gain.cancelScheduledValues(n),Et.gain.setTargetAtTime(t,n,.015)}catch{Et.gain.value=t}e&&(e.volume=1),bn=t;return}e&&(e.volume=Math.max(0,Math.min(1,t))),bn=t}function u$(){Rf()!==bn&&lo()}function p$(e){let t=Ff();if(!t.src){Ts=e;return}let n=Math.max(0,Math.min(e,i.duration||0))/1e3;try{t.currentTime=n}catch{Ts=e}}function h$(e=32){if(!pn||!Cs)return null;pn.getByteFrequencyData(Cs);let t=Math.max(1,Math.min(128,Math.floor(e)||32)),n=new Float32Array(t),s=Cs.length;for(let a=0;a<t;a+=1){let r=Math.floor(s*(a/t)**1.7),o=Math.min(s,Math.max(r+1,Math.floor(s*((a+1)/t)**1.7))),l=0;for(let c=r;c<o;c+=1)l+=Cs[c];n[a]=l/((o-r)*255)}return n}var f$={itunes:"iTunes",netease:"\u7F51\u6613\u4E91\u97F3\u4E50",qq:"QQ \u97F3\u4E50",deezer:"Deezer",musicbrainz:"MusicBrainz",lrclib:"LRCLIB",kugou:"\u9177\u72D7\u97F3\u4E50",kuwo:"\u9177\u6211\u97F3\u4E50",migu:"\u54AA\u5495\u97F3\u4E50"},m$=["itunes","netease","qq","deezer","musicbrainz"];function id(e){let t=String(e||"").trim().toLowerCase();return f$[t]||String(e||"")}function Od(e,t=""){let n=Array.isArray(e)?e.filter(Boolean):[];return n.length?n.map(s=>id(s)).join(" / "):t}function Uf(){return Od(m$)}var or=null;async function Ec(){if(or)return or;try{let e=await Promise.resolve().then(()=>(Fo(),No));or=e&&e.OnlineService?e.OnlineService:null}catch(e){console.info("[online] backend unavailable",e)}return or}var g$=new Set(["m4a","mp4","m4b","alac","aac","flac"]),Ce="online";function Pc(e,t){let n=String(e?.note||"").trim()||t;m(n,{tone:"success",duration:Math.min(6500,1800+n.length*55)})}var I={songId:"",title:"",lines:[],cursor:0,undo:[],dirty:!1,kept:0,stale:!1},Ar=class extends qe{constructor(){super(),this._nowIndex=-1,this._onlineError="",this._searched=!1,this._candidates=[],this._searching=!1,this._onlineKeyword="",this._lastNowPaint=0,this._lastNudgeActive=-1,this._lastScrolledNow=-1,this._lastScrolledCursor=-1,this._followHold=0,this._followAutoUntil=0,this._lastOnlineHint="\u5728\u7EBF\u6B4C\u8BCD\u6765\u6E90",this._formats=new Map,this._searchSeq=0,this._appliedKey="",this._appliedTimer=null}onConnected(){this._onKeyDownCapture=t=>this.onPanelKeyDown(t),document.addEventListener("keydown",this._onKeyDownCapture,!0),this._unsubscribers.push(Ft(()=>{this.open&&(Ce==="nudge"?this.paintNudgeFollow():Ce==="edit"&&this.paintEditorFollow())}))}onDisconnected(){document.removeEventListener("keydown",this._onKeyDownCapture,!0),clearTimeout(this._appliedTimer)}get open(){return i.lyricsOpen===!0}get panelEl(){return this.querySelector("#lyrics-panel")}updated(){let t=this.panelEl;t&&(t.hidden=!this.open,t.dataset.open=this.open?"true":"false",this.open&&(Ce==="nudge"&&this.paintNudgeFollow(),Ce==="edit"&&this.paintEditorFollow()))}_refreshHeader(){re()}render(){let t=dt(),n=t.song,s=t.lines.some(a=>Array.isArray(a.words)&&a.words.length>0);return u`
      <section
        class="lyricspanel"
        id="lyrics-panel"
        role="dialog"
        aria-label="歌词工作台"
        data-open=${this.open?"true":"false"}
        data-tab=${Ce}
        hidden
        @click=${a=>this.onClick(a)}
        @input=${a=>this.onInput(a)}
      >
        <header class="lyricspanel__head">
          <img class="lyricspanel__cover" data-song-cover alt="" src=${n?Rt(n):A} />
          <div class="lyricspanel__meta">
            <div class="lyricspanel__title" data-song-title>${n?n.title||"\u672A\u547D\u540D":"\u672A\u5728\u64AD\u653E"}</div>
            <div class="lyricspanel__sub">
              <span
                class="lyricspanel__badge${t.text?"":" is-empty"}"
                data-song-source
                data-src=${t.source}
              >
                ${t.status==="matching"||t.status==="loading"?"\u6B4C\u8BCD\u5339\u914D\u4E2D\u2026":t.status==="failed"?"\u6B4C\u8BCD\u5339\u914D\u5931\u8D25":`${Eh(t.source)}${s?" \xB7 \u9010\u5B57":""}`}
              </span>
              <span class="lyricspanel__artist" data-song-artist>${n&&n.artist||""}</span>
            </div>
          </div>
          <button
            class="lyricspanel__close u-hit"
            type="button"
            data-act="close"
            aria-label="关闭"
            @click=${()=>rd()}
          >
            ${g("close")}
          </button>
        </header>

        <nav class="lyricspanel__tabs" role="tablist">
          ${["online","nudge","edit"].map(a=>u`
              <button
                class="lyricspanel__tab${Ce===a?" is-active":""}"
                type="button"
                role="tab"
                data-tab=${a}
                aria-selected=${String(Ce===a)}
                @click=${()=>ya(a)}
              >
                ${a==="online"?"\u5728\u7EBF\u5339\u914D":a==="nudge"?"\u5FAE\u8C03":"\u624B\u52A8\u7F16\u8F91"}
              </button>
            `)}
        </nav>

        ${this.noticeTemplate(t)}
        <div class="lyricspanel__body">
          ${this.open?u`${this.onlinePane()} ${this.nudgePane(t)} ${this.editPane()}`:A}
        </div>
      </section>
    `}noticeTemplate(t){let n=Ce==="nudge"||Ce==="edit",s=t.source==="embedded"||t.source==="lrc-file";if(!n||!s)return A;let a=Eh(t.source),r=b$(t.song),o=g$.has(r);return u`
      <div class="lyricspanel__notice" data-notice>
        ${o?u`<label class="lyricspanel__notice-opt" data-notice-opt>
                <input type="checkbox" data-embed-toggle checked />
                <span
                  class="lyricspanel__notice-opt-text"
                  data-tip="这首歌的歌词来自「${a}」，优先级高于歌词缓存：只存缓存的话，下次打开会显示回旧歌词。勾上则同时写进歌曲文件本身（会改动音乐文件）。"
                >
                  同时写入歌曲文件<span class="lyricspanel__notice-opt-badge" aria-hidden="true">!</span>
                </span>
              </label>`:u`<span class="lyricspanel__notice-badge" aria-hidden="true">!</span>
                <div class="lyricspanel__notice-text" data-notice-text>
                  这首歌的歌词来自「${a}」，优先级高于歌词缓存；${r?"."+r:"\u8BE5\u683C\u5F0F"}
                  不能写入歌词标签，所以本次改动<b>只在本次运行内</b>生效，重启后会变回旧歌词。
                </div>`}
      </div>
    `}onlinePane(){return u`
      <section class="lyricspanel__pane" data-pane="online" ?hidden=${Ce!=="online"}>
        <div class="lyricspanel__row">
          <input
            class="lyricspanel__input"
            data-online-input
            placeholder="输入歌词搜索关键词"
            .value=${this._onlineKeyword}
            @input=${t=>{this._onlineKeyword=t.target.value}}
            @keydown=${t=>{t.key==="Enter"&&this.searchLyrics()}}
          />
          <button
            class="btn btn--primary"
            type="button"
            data-act="lyrics-search"
            ?disabled=${this._searching}
            @click=${()=>this.searchLyrics()}
          >
            ${this._searching?"\u641C\u7D22\u4E2D":"\u641C\u7D22"}
          </button>
        </div>
        <div class="lyricspanel__hint" data-online-hint>${this._lastOnlineHint}</div>
        <div class="lyricspanel__list" data-online-results>${this.onlineResults()}</div>
      </section>
    `}onlineResults(){if(this._searching)return u`
        <div class="lyricspanel__state" data-online-state="searching">
          <span class="lyricspanel__spinner"></span>
          <div class="lyricspanel__state-title">正在搜索歌词</div>
          <div class="lyricspanel__state-desc">正在已启用的在线歌词来源里查找候选…</div>
        </div>
      `;if(this._onlineError)return u`
        <div class="lyricspanel__state lyricspanel__state--error" data-online-state="error">
          ${g("warning")}
          <div class="lyricspanel__state-title">搜索失败</div>
          <div class="lyricspanel__state-desc">
            在线歌词来源没有响应。检查网络后重试，或者切到「手动编辑」自己贴一份。
          </div>
          <div class="lyricspanel__state-detail">${this._onlineError}</div>
          <div class="lyricspanel__state-actions">
            <button class="btn btn--sm" type="button" data-act="lyrics-search" @click=${()=>this.searchLyrics()}>
              重试
            </button>
            <button class="btn btn--sm" type="button" @click=${()=>ya("edit")}>手动编辑歌词</button>
          </div>
        </div>
      `;if(this._candidates.length)return ut(this._candidates,(t,n)=>`${t.provider||""}-${t.id||n}`,(t,n)=>{let s=!!this._appliedKey&&this._appliedKey===lr(t);return u`
            <div class="candidate ${s?"candidate--applied":""}" data-applied=${s?"1":A}>
              <div class="candidate__main">
                <div class="candidate__title">${(t.title||"\u672A\u547D\u540D")+" - "+(t.artist||"\u672A\u77E5")}</div>
                <div class="candidate__sub">
                  ${this.formatChip(t)}
                  ${(t.provider||"")+" \xB7 score "+(t.score||0)+" \xB7 "+Qt(t.duration)}
                </div>
              </div>
              <button
                class="btn btn--sm ${s?"btn--applied":"btn--primary"}"
                type="button"
                data-act="use-lyric"
                data-i=${n}
                @click=${()=>this.applyCandidate(n)}
              >
                ${s?u`${g("check")}<span>已应用</span>`:"\u4F7F\u7528"}
              </button>
            </div>
          `});if(this._searched){let t=_a()?.title||"",n=!!t&&t!==this._onlineKeyword;return u`
        <div class="lyricspanel__state" data-online-state="empty">
          ${g("lyrics")}
          <div class="lyricspanel__state-title">没有找到候选歌词</div>
          <div class="lyricspanel__state-desc">换个更短的关键词通常更有效（只留歌名、去掉括号里的后缀）。</div>
          <div class="lyricspanel__state-actions">
            ${n?u`<button class="btn btn--sm" type="button" @click=${()=>this.retryWithTitle()}>
                    只用歌名重搜
                  </button>`:A}
            <button class="btn btn--sm" type="button" @click=${()=>ya("edit")}>手动编辑歌词</button>
          </div>
        </div>
      `}return u`
      <div class="lyricspanel__state" data-online-state="idle">
        ${g("search")}
        <div class="lyricspanel__state-title">还没有开始搜索</div>
        <div class="lyricspanel__state-desc">搜索框里已经填好了当前歌曲，点「搜索」或按回车就能在线匹配歌词。</div>
        <div class="lyricspanel__state-actions">
          <button
            class="btn btn--sm btn--primary"
            type="button"
            data-act="lyrics-search"
            @click=${()=>this.searchLyrics()}
          >
            搜索歌词
          </button>
        </div>
      </div>
    `}async retryWithTitle(){let t=_a()?.title?.trim();t&&(this._onlineKeyword=t,re(),await this.searchLyrics())}nudgePane(t){let n=t.songId?Ps(t.songId):0,s=n<0?t.lines.filter(r=>r.time+n<0).length:0,a=Rd();return u`
      <section class="lyricspanel__pane lyricspanel__pane--nudge" data-pane="nudge" ?hidden=${Ce!=="nudge"}>
        <div class="nudge__bar">
          <span class="nudge__label">偏移</span>
          <b class="nudge__value" data-nudge-value>${(n>0?"+":"")+(n/1e3).toFixed(2)} 秒</b>
          <span class="nudge__dirty" data-nudge-dirty ?hidden=${n===0}>未应用</span>
          <span class="nudge__warn" data-nudge-clamp ?hidden=${s===0}>
            ${s?`\u6709 ${s} \u884C\u88AB\u538B\u5230 0:00`:""}
          </span>
          <span class="nudge__spacer"></span>
          <div class="nudge__steps">
            ${[-1e3,-500,-100,100,500,1e3].map(r=>u`<button
                  class="btn btn--sm"
                  type="button"
                  data-act="nudge-step"
                  data-delta=${r}
                  @click=${()=>Dc(r)}
                >
                  ${r>0?"+":"\u2212"}${(Math.abs(r)/1e3).toFixed(1)}
                </button>`)}
          </div>
        </div>
        <div class="nudge__bar">
          <button
            class="btn btn--sm nudge__feel"
            type="button"
            data-act="nudge-feel"
            data-delta="500"
            data-tip="歌词出现得太早：整体往后挪 0.5 秒"
            @click=${()=>Dc(500)}
          >
            歌词快了 ${g("arrow-right")} 延后 0.5s
          </button>
          <button
            class="btn btn--sm nudge__feel"
            type="button"
            data-act="nudge-feel"
            data-delta="-500"
            data-tip="歌词出现得太晚：整体往前挪 0.5 秒"
            @click=${()=>Dc(-500)}
          >
            歌词慢了 ${g("arrow-left")} 提前 0.5s
          </button>
          <input
            class="nudge__range"
            type="range"
            min=${String(a.lower)}
            max=${String(a.upper)}
            step="50"
            .value=${String(n)}
            ?disabled=${!t.text}
            data-act="nudge-range"
            aria-label="整体偏移（毫秒）"
            @input=${r=>Ah(Number(r.target.value))}
          />
        </div>
        <div class="lyricspanel__list nudge__preview" data-nudge-preview @scroll=${()=>this.onFollowScroll()}>
          ${this.nudgePreview(t,n)}
        </div>
        <div class="lyricspanel__foot">
          <button class="btn btn--sm" type="button" data-act="nudge-reset" @click=${()=>y$()}>重置</button>
          <button
            class="btn btn--sm"
            type="button"
            data-act="nudge-guide"
            data-tip="微调介绍与使用指引"
            @click=${()=>_$()}
          >
            ${g("info")}说明
          </button>
          <span class="nudge__spacer"></span>
          <button class="btn btn--primary" type="button" data-act="nudge-apply" @click=${()=>this.applyNudge()}>
            应用到歌词
          </button>
        </div>
      </section>
    `}nudgePreview(t,n){if(!t.text)return u`
        <div class="lyricspanel__state">
          ${g("lyrics")}
          <div class="lyricspanel__state-title">这首歌还没有歌词</div>
          <div class="lyricspanel__state-desc">先用「在线匹配」找一份，或者切到「手动编辑」自己贴一份。</div>
          <div class="lyricspanel__state-actions">
            <button class="btn btn--sm" type="button" @click=${()=>ya("online")}>去在线匹配</button>
            <button class="btn btn--sm" type="button" @click=${()=>ya("edit")}>去手动编辑</button>
          </div>
        </div>
      `;let s=t.lines,a=Ch(s,n);return ut(s,(r,o)=>o,(r,o)=>{let l=Math.max(0,r.time+n);return u`
          <div
            class="nudge__line${o===a?" is-active":""}"
            data-act="nudge-seek"
            data-ms=${l}
            data-index=${o}
          >
            <span class="nudge__time">${cn(l).slice(1,-1)}</span>
            <span class="nudge__text">${ys(r)}</span>
          </div>
        `})}paintNudgeFollow(){if(Ce!=="nudge")return;let t=this.querySelector("[data-nudge-preview]");if(!t)return;let n=dt();if(!n.lines.length)return;let s=this._nudgeBox!==t;this._nudgeBox=t;let a=n.songId?Ps(n.songId):0,r=Ch(n.lines,a);if(!s&&r===this._lastNudgeActive)return;this._lastNudgeActive=r;let o=t.querySelectorAll(".nudge__line");if(!o.length)return;let l=null;o.forEach(c=>{let d=Number(c.dataset.index)===r;c.classList.toggle("is-active",d),d&&(l=c)}),l&&this.followScroll(t,l,s)}editPane(){let t=I.lines.filter(o=>typeof o.time=="number").length,n=jf(),s=I.lines.length-t,a=n?`\u8349\u7A3F\u5C5E\u4E8E\u300A${Be(I.songId)?.title||"\u4E0A\u4E00\u9996"}\u300B`:s>0&&t>0?`\u8FD8\u6709 ${s} \u884C\u6CA1\u6709\u65F6\u95F4`:"",r=n?"\u5DF2\u5207\u6B4C\uFF0C\u8349\u7A3F\u4ECD\u5C5E\u4E8E\u4E0A\u4E00\u9996":I.kept>0?`\u5DF2\u6CBF\u7528 ${I.kept} \u884C\u539F\u6709\u65F6\u95F4`:I.dirty?"\u672A\u4FDD\u5B58":"";return u`
      <section class="lyricspanel__pane" data-pane="edit" ?hidden=${Ce!=="edit"}>
        <div class="editor__source">
          <button
            class="btn btn--sm"
            type="button"
            data-act="editor-text-open"
            data-tip="粘贴 / 修改歌词文本"
            @click=${()=>x$()}
          >
            ${g("edit")}编辑歌词文本
          </button>
          <span class="lyricspanel__hint" data-editor-source>
            ${I.lines.length?`\u5171 ${I.lines.length} \u884C`:"\u8FD8\u6CA1\u6709\u6B4C\u8BCD\u6587\u672C"}
          </span>
          <span class="editor__spacer"></span>
          <button class="btn btn--sm" type="button" data-act="editor-clear-times" @click=${()=>S$()}>
            清空全部时间
          </button>
        </div>

        <div class="editor__transport">
          <button
            class="btn btn--icon"
            type="button"
            data-act="editor-play"
            data-tip="播放 / 暂停"
            @click=${()=>M$()}
          >
            ${g(i.playing?"pause":"play")}
          </button>
          <button
            class="btn btn--sm"
            type="button"
            data-act="editor-back"
            @click=${()=>$t(Math.max(0,i.position-5e3))}
          >
            −5s
          </button>
          <button
            class="btn btn--sm"
            type="button"
            data-act="editor-fwd"
            @click=${()=>$t(i.position+5e3)}
          >
            +5s
          </button>
          <span class="editor__clock" data-editor-clock>${cn(i.position).slice(1,-1)}</span>
          <span class="editor__spacer"></span>
          <span class="lyricspanel__hint" data-editor-progress>已打轴 ${t} / ${I.lines.length}</span>
        </div>

        <button class="editor__tap" type="button" data-act="editor-tap" @click=${()=>Lc()}>
          <span class="editor__tap-main">打轴并下一行</span>
          <span class="editor__tap-hint"><kbd>空格</kbd> 或点这里</span>
        </button>

        <div class="editor__tools">
          <button class="btn btn--sm" type="button" data-act="editor-undo" @click=${()=>w$()}>撤销</button>
          <button class="btn btn--sm" type="button" data-act="editor-prev" @click=${()=>Mh(-1)}>
            上一行
          </button>
          <button class="btn btn--sm" type="button" data-act="editor-next" @click=${()=>Mh(1)}>
            下一行
          </button>
          <span class="lyricspanel__hint" data-editor-tip>${r}</span>
        </div>

        <div class="editor__list" data-editor-list @scroll=${()=>this.onFollowScroll()}>${this.draftList()}</div>

        <div class="lyricspanel__foot">
          <button class="btn btn--sm" type="button" data-act="editor-copy" @click=${()=>this.copyLrc()}>
            复制 LRC
          </button>
          <span class="lyricspanel__hint" data-editor-save-hint>${a}</span>
          <button class="btn btn--primary" type="button" data-act="editor-save" @click=${()=>this.saveDraft()}>
            保存并应用
          </button>
        </div>
      </section>
    `}draftList(){return I.lines.length?ut(I.lines,(t,n)=>n,(t,n)=>{let s=typeof t.time=="number",a=["drow"];return n===I.cursor&&a.push("is-cursor"),s||a.push("is-untimed"),n===this._nowIndex&&a.push("is-now"),u`
          <div class=${a.join(" ")} data-act="editor-cursor" data-i=${n}>
            <span class="drow__no">${n+1}</span>
            <button
              class="drow__time"
              type="button"
              data-act="edit-seek"
              data-i=${n}
              data-tip="跳到这一句"
              @click=${r=>{r.stopPropagation(),C$(n)}}
            >
              ${s?cn(t.time).slice(1,-1):"\u672A\u6253\u8F74"}
            </button>
            <span class="drow__text">${t.text}</span>
            <button
              class="drow__clear"
              type="button"
              data-act="edit-clear"
              data-i=${n}
              aria-label="清除这一行的时间"
              ?hidden=${!s}
              @click=${r=>{r.stopPropagation(),k$(n)}}
            >
              ${g("close")}
            </button>
          </div>
        `}):u`<div class="editor__empty">
        还没有歌词文本。点上面的「编辑歌词文本」粘贴一份，或载入这首歌已有的歌词。
      </div>`}onClick(t){let n=t.target.closest("[data-act], [data-tab]");if(!n||!this.contains(n))return;let s=n.dataset.act,a=Number(n.dataset.i);switch(s){case"close":rd();return;case"nudge-seek":$t(Number(n.dataset.ms));return;case"editor-cursor":$$(a);return;case"editor-tap":Lc();return}}onInput(t){let n=t.target;n.matches('[data-act="nudge-range"]')&&Ah(Number(n.value))}onPanelKeyDown(t){if(!this.open||Ce!=="edit"||t.key!==" "||t.ctrlKey||t.metaKey||t.altKey)return;let n=t.target;n&&(n.tagName==="TEXTAREA"||n.tagName==="INPUT")||this.contains(n)&&(t.preventDefault(),t.stopPropagation(),Lc())}onFollowScroll(){Date.now()<this._followAutoUntil||(this._followHold=Date.now()+4e3)}followScroll(t,n,s=!1){if(!t||!n||!s&&Date.now()<this._followHold)return;let a=t.getBoundingClientRect(),r=n.getBoundingClientRect(),o=Math.max(0,t.scrollTop+(r.top-a.top)-(t.clientHeight-r.height)/2);Math.abs(t.scrollTop-o)<2||(this._followAutoUntil=Date.now()+700,t.scrollTo({top:o,behavior:"smooth"}))}prefillOnlineKeyword(){let t=_a();if(!t)return;let n=[t.title,t.artist].filter(Boolean).join(" ").trim();!n||n===this._onlineKeyword||(this._onlineKeyword=n,re())}async refreshOnlineHint(){let t=await Ec();if(t)try{let n=await t.LyricsProviders?.(),s=Array.isArray(n?.providers)?n.providers:[];s.length&&(this._lastOnlineHint="\u5728\u7EBF\u6B4C\u8BCD\u6765\u6E90\uFF1A"+Od(s),re())}catch{}}formatChip(t){let n=this._formats.get(lr(t));return n==="word"?u`<span class="candidate__format candidate__format--word" title="带逐字时间轴，播放时按字点亮"
        >逐字</span
      >`:n==="line"?u`<span class="candidate__format" title="只有整行时间轴">逐行</span>`:n==="fail"?u`<span class="candidate__format candidate__format--pending" title="这条取不到歌词内容">未知</span>`:u`<span class="candidate__format candidate__format--pending">检测中…</span>`}async probeFormats(t,n){if(!t?.ProbeLyricsFormat||!this._candidates.length)return;let s=[...this._candidates].sort((a,r)=>+(a?.provider==="netease")-+(r?.provider==="netease"));for(let a of s){if(n!==this._searchSeq)return;let r=lr(a);if(!(!r||this._formats.has(r))){try{let o=await t.ProbeLyricsFormat(a.provider,a.id);this._formats.set(r,o?.format==="word"?"word":"line")}catch{this._formats.set(r,"fail")}re()}}}async searchLyrics(){let t=(this._onlineKeyword||"").trim();if(!t){m("\u8BF7\u8F93\u5165\u6B4C\u8BCD\u641C\u7D22\u5173\u952E\u8BCD",{duration:1500});return}let n=await Ec();if(!n){this._candidates=[],this._formats=new Map,this._onlineError="\u5728\u7EBF\u6B4C\u8BCD\u670D\u52A1\u4E0D\u53EF\u7528\uFF08\u9700\u8981\u5E94\u7528\u540E\u7AEF\uFF09",this._searched=!0,re();return}let s=_a();this._searching=!0,this._onlineError="",re();try{let a=await n.SearchLyrics(t,s?s.title:"",s?s.artist:"",s?s.duration:0);this._candidates=Array.isArray(a)?a:[],this._formats=new Map,this._searchSeq+=1}catch(a){this._candidates=[],this._formats=new Map,this._onlineError=String(a?.message||a)}finally{this._searching=!1,this._searched=!0,re()}this.probeFormats(n,this._searchSeq)}async applyCandidate(t){let n=this._candidates[t];if(!n)return;let s=_a();if(!s){m("\u8BF7\u5148\u64AD\u653E\u4E00\u9996\u6B4C\u66F2",{tone:"warning"});return}let a=await Ec();if(!a){m("\u5728\u7EBF\u6B4C\u8BCD\u670D\u52A1\u6682\u4E0D\u53EF\u7528\uFF0C\u8BF7\u7A0D\u540E\u518D\u8BD5",{tone:"error"});return}try{let r=await a.FetchLyrics(n.provider,n.id);if(!r||!r.lrc){m("\u6CA1\u6709\u53D6\u5230\u6B4C\u8BCD",{tone:"warning"});return}let o=await qc(s.id,r.lrc,r.source||"online",{embed:i.config.embedMeta===!0});jn(s.id,0),I.songId="",Pc(o,"\u6B4C\u8BCD\u5DF2\u5E94\u7528\u5E76\u4FDD\u5B58"),this.markApplied(lr(n)),re()}catch(r){m("\u83B7\u53D6\u6B4C\u8BCD\u5931\u8D25\uFF1A"+(r.message||r),{tone:"error"})}}markApplied(t){t&&(this._appliedKey=t,re(),clearTimeout(this._appliedTimer),this._appliedTimer=setTimeout(()=>{this._appliedKey===t&&(this._appliedKey="",re())},2600))}async applyNudge(){let t=dt();if(!t.songId){m("\u8BF7\u5148\u64AD\u653E\u4E00\u9996\u6B4C\u66F2",{tone:"warning"});return}let n=Ps(t.songId);if(!n){m("\u5F53\u524D\u6CA1\u6709\u9700\u8981\u5E94\u7528\u7684\u8C03\u6574",{duration:1800});return}if(!t.text){m("\u8FD9\u9996\u6B4C\u8FD8\u6CA1\u6709\u6B4C\u8BCD",{tone:"warning"});return}let s=Bp(t.text,n),a=await qc(t.songId,s,"edit:offset",{embed:xh(t,this)});a!==!1&&(jn(t.songId,0),re(),Pc(a,"\u5DF2\u5E94\u7528\u5E76\u4FDD\u5B58"))}async ensureDraft(t=!1){let n=dt();!t&&I.songId===n.songId&&I.lines.length||(I.songId=n.songId,I.title=n.song?.title||"",I.lines=n.text?ac(n.text):[],I.cursor=0,I.undo=[],I.dirty=!1,I.kept=0,I.stale=!1,this._nowIndex=-1,this._lastScrolledNow=-1,this._lastScrolledCursor=-1,this._followHold=0,this._followAutoUntil=0,re())}applyDraftText(t){let n=ac(t||""),s=Up(I.lines,n);if(!s.length)return m("\u6587\u672C\u662F\u7A7A\u7684\uFF0C\u6CA1\u6709\u53EF\u5E94\u7528\u7684\u6B4C\u8BCD",{duration:1800}),!1;let a=s.filter((r,o)=>typeof r.time=="number"&&!(n[o]&&typeof n[o].time=="number")).length;return co(),I.lines=s,I.cursor>=s.length&&(I.cursor=Math.max(0,s.length-1)),I.dirty=!0,I.kept=a,I.songId||(I.songId=dt().songId),this._nowIndex=-1,this._lastScrolledNow=-1,this._lastScrolledCursor=-1,re(),m(a?`\u5DF2\u5E94\u7528\u6587\u672C\uFF0C\u6CBF\u7528\u4E86 ${a} \u884C\u539F\u6709\u65F6\u95F4`:"\u5DF2\u5E94\u7528\u6587\u672C",{duration:2e3}),!0}setDraftText(t){let n=document.querySelector("#modal-backdrop [data-editor-text]");n&&(n.value=t),re()}async saveDraft(){let t=dt(I.songId);if(!t.songId){m("\u8FD8\u6CA1\u6709\u53EF\u4FDD\u5B58\u7684\u5185\u5BB9\uFF1A\u5148\u64AD\u653E\u4E00\u9996\u6B4C\u518D\u7F16\u8F91",{tone:"warning"});return}let n=I.lines.filter(c=>typeof c.time=="number"&&Number.isFinite(c.time));if(!n.length){m("\u81F3\u5C11\u8981\u5148\u7ED9\u4E00\u884C\u6253\u4E0A\u65F6\u95F4",{tone:"warning"});return}let s=I.lines.length-n.length,a=!1,r=-1/0;for(let c of I.lines)if(typeof c.time=="number"){if(c.time<r){a=!0;break}r=c.time}if(s||a){let c=u`
        ${s?u`<div class="lyricspanel__hint">
                还有 <b>${s}</b> 行没有时间：LRC 里没有时间标签的行会被忽略，保存后这些行不会显示。
              </div>`:A}
        ${a?u`<div class="lyricspanel__hint">时间不是升序，播放时高亮可能会跳来跳去。</div>`:A}
      `;if(!await I$({title:s?"\u8FD8\u6709\u6B4C\u8BCD\u6CA1\u6709\u6253\u8F74":"\u65F6\u95F4\u4E0D\u662F\u5347\u5E8F",body:c,okText:"\u7EE7\u7EED\u4FDD\u5B58",cancelText:"\u8FD4\u56DE\u7F16\u8F91"}))return}let o=ic(I.lines),l=await qc(t.songId,o,"manual",{embed:xh(t,this)});l!==!1&&(jn(t.songId,0),I.undo=[],I.dirty=!1,I.songId=t.songId,re(),Pc(l,"\u6B4C\u8BCD\u5DF2\u4FDD\u5B58"))}async copyLrc(){let t=ic(I.lines);if(!t){m("\u8FD8\u6CA1\u6709\u53EF\u590D\u5236\u7684\u6B4C\u8BCD",{duration:1800});return}try{await navigator.clipboard.writeText(t),m("LRC \u5DF2\u590D\u5236\u5230\u526A\u8D34\u677F",{tone:"success"})}catch{let n=document.createElement("textarea");n.value=t,n.style.cssText="position:fixed;left:-9999px;top:0;",document.body.appendChild(n),n.select();let s=!1;try{s=document.execCommand("copy")}catch{s=!1}n.remove(),m(s?"LRC \u5DF2\u590D\u5236\u5230\u526A\u8D34\u677F":"\u590D\u5236\u5931\u8D25\uFF0C\u8BF7\u624B\u52A8\u9009\u4E2D\u6587\u672C",{tone:s?"success":"warning"})}}paintNowRow(){let t=performance.now();if(t-this._lastNowPaint<200)return;this._lastNowPaint=t;let n=-1;for(let s=0;s<I.lines.length;s+=1){let a=I.lines[s].time;typeof a=="number"&&a<=i.position&&(n=s)}n!==this._nowIndex&&(this._nowIndex=n,re())}paintEditorFollow(){this.paintNowRow(),this.scrollDraftRows()}scrollDraftRows(){let t=this.querySelector("[data-editor-list]");if(t){if(I.cursor!==this._lastScrolledCursor){let n=t.querySelector(`[data-i="${I.cursor}"]`);n&&(this._lastScrolledCursor=I.cursor,this.followScroll(t,n,!0))}if(this._nowIndex!==this._lastScrolledNow){let n=t.querySelector(`[data-i="${this._nowIndex}"]`);n&&this._nowIndex>=0&&(this._lastScrolledNow=this._nowIndex,this.followScroll(t,n))}}}};Re(Ar,"deps",t=>[t.lyricsOpen,t.currentId,t.playing,Ce,Wf,i.config.embedMeta]);Se("mp-lyrics-panel",Ar);var Wf=0;function re(){Wf+=1,Ve()}var yn=()=>document.querySelector("mp-lyrics-panel");function lr(e){return!e||!e.provider||!e.id?"":`${e.provider}:${e.id}`}function v$(e){i.lyricsOpen=!0,re();let t=yn();t&&(t._refreshHeader(),t.prefillOnlineKeyword(),dd().then(()=>{Ce==="edit"&&t.ensureDraft(!0),Ce==="online"&&t.refreshOnlineHint(),re()}))}function rd(){i.lyricsOpen=!1;let e=dt();e.songId&&Ps(e.songId)&&(jn(e.songId,0),m("\u672A\u5E94\u7528\u7684\u5FAE\u8C03\u5DF2\u4E22\u5F03",{duration:1800})),re()}function zf(e){i.lyricsOpen?rd():v$()}function ya(e){Ce=e==="nudge"||e==="edit"?e:"online";let t=yn();t&&(Ce==="edit"&&t.ensureDraft().then(()=>re()),Ce==="online"&&t.refreshOnlineHint?.()),re()}function _a(){return Be(i.currentId)||null}function b$(e){return String(e?.ext||"").replace(/^\./,"").toLowerCase()}function xh(e,t){let n=t?.querySelector("[data-embed-toggle]"),s=t?.querySelector("[data-notice-opt]");return(e.source==="embedded"||e.source==="lrc-file")&&s&&n?!!n.checked:i.config.embedMeta===!0}function Ch(e,t){let n=-1;for(let s=0;s<e.length&&e[s].time+t<=i.position;s+=1)n=s;return n}function Rd(){return{lower:-1e4,upper:1e4}}function Dc(e){let t=dt();if(!t.songId){m("\u8BF7\u5148\u64AD\u653E\u4E00\u9996\u6B4C\u66F2",{tone:"warning"});return}if(!t.text){m("\u8FD9\u9996\u6B4C\u8FD8\u6CA1\u6709\u6B4C\u8BCD\uFF0C\u5148\u53BB\u5728\u7EBF\u5339\u914D\u6216\u624B\u52A8\u7F16\u8F91",{tone:"warning",duration:2600});return}let n=Rd(),s=Math.max(n.lower,Math.min(n.upper,Ps(t.songId)+e));jn(t.songId,s),re()}function Ah(e){let t=dt();if(!t.songId||!t.text)return;let n=Rd(),s=Math.max(n.lower,Math.min(n.upper,Math.round(Number(e)||0)));jn(t.songId,s),re()}function y$(){let e=dt();e.songId&&(jn(e.songId,0),re())}function _$(){ue({title:"\u6B4C\u8BCD\u5FAE\u8C03\uFF1A\u4ECB\u7ECD\u4E0E\u6307\u5F15",body:u`
      <div class="lguide">
        <section class="lguide__sec">
          <h4 class="lguide__title">微调在改什么</h4>
          <p class="lguide__text">
            把整首歌的歌词时间轴一起平移，<b>不改歌词文字</b>。适合「整首歌都偏早或都偏晚」的情况：
            歌词来源的时间轴本来就不准，或者蓝牙 / 外放有明显的出声延迟。
          </p>
        </section>
        <section class="lguide__sec">
          <h4 class="lguide__title">怎么判断该往哪边调</h4>
          <p class="lguide__text">听副歌的第一句，看是歌词先出来还是人声先出来：</p>
          <div class="lguide__kv">
            <span class="lguide__k">歌词先出现</span><span>歌词快了 → 点「歌词快了 → 延后 0.5s」</span>
          </div>
          <div class="lguide__kv">
            <span class="lguide__k">歌词后出现</span><span>歌词慢了 → 点「歌词慢了 → 提前 0.5s」</span>
          </div>
        </section>
        <section class="lguide__sec">
          <h4 class="lguide__title">界面上的数字</h4>
          <div class="lguide__kv"><span class="lguide__k">+0.50 秒</span><span>整体延后，歌词出现得更晚</span></div>
          <div class="lguide__kv"><span class="lguide__k">−0.50 秒</span><span>整体提前，歌词出现得更早</span></div>
          <p class="lguide__text">
            6 个按钮是常用档位（±0.1 / ±0.5 / ±1.0 秒），下面是连续滑条，范围 ±10 秒。
            负偏移时靠近开头的那几行会被压到 0:00，界面会提示有几行受影响。
          </p>
        </section>
        <section class="lguide__sec">
          <h4 class="lguide__title">预览区怎么用</h4>
          <p class="lguide__text">
            高亮的那一行就是当前唱到的那句，它会跟着播放实时前进 —— 调整偏移后盯着它，
            就能看出歌词是变早了还是变晚了。点任意一行会跳到那一句，方便反复对比。
          </p>
        </section>
        <section class="lguide__sec">
          <h4 class="lguide__title">微调还是手动编辑</h4>
          <p class="lguide__text">
            只有少数几句对不上（某句没打轴、某句错位）用「手动编辑」逐行修正；
            整首歌统一偏移才用微调。两者都改不了「来源优先级」—— 如果这首歌的歌词来自内嵌歌词或同目录
            .lrc，界面会提示要不要同时写入歌曲文件。
          </p>
        </section>
        <section class="lguide__sec">
          <h4 class="lguide__title">什么时候真的写进去</h4>
          <p class="lguide__text">
            点「应用到歌词」才会保存：先写歌词缓存，设置允许时同时写入歌曲文件。
            直接关掉面板会丢弃未应用的调整，歌词回到原样。
          </p>
        </section>
      </div>
    `,okText:"\u77E5\u9053\u4E86"}).root.classList.add("modal--wide","modal--scroll","modal--single")}function co(){I.undo.push({lines:I.lines.map(e=>({...e})),cursor:I.cursor}),I.undo.length>50&&I.undo.shift()}function w$(){let e=I.undo.pop();if(!e){m("\u6CA1\u6709\u53EF\u64A4\u9500\u7684\u64CD\u4F5C",{duration:1500});return}I.lines=e.lines,I.cursor=Math.min(e.cursor,Math.max(0,e.lines.length-1)),I.dirty=!0,yn()?.setDraftText(Ua()),re()}function Ua(){return I.lines.map(e=>typeof e.time=="number"?cn(e.time)+e.text:e.text).join(`
`)}function Mh(e){if(!I.lines.length)return;let t=Math.max(0,Math.min(I.lines.length-1,I.cursor+e));t!==I.cursor&&(I.cursor=t,re())}function Hf(e){!Number.isFinite(e)||e<0||e>=I.lines.length||e===I.cursor||(I.cursor=e,re())}function $$(e){Hf(e);let t=I.lines[e];t&&typeof t.time=="number"&&$t(t.time);let n=yn();n&&(n._followHold=Date.now()+4e3)}function Lc(){if(!I.lines.length){m("\u5148\u70B9\u300C\u7F16\u8F91\u6B4C\u8BCD\u6587\u672C\u300D\u628A\u6B4C\u8BCD\u8D34\u8FDB\u6765",{tone:"warning",duration:2600});return}if(jf()){m("\u5DF2\u5207\u6B4C\uFF1A\u5148\u51B3\u5B9A\u8FD9\u4EFD\u8349\u7A3F\u600E\u4E48\u529E\uFF08\u4FDD\u5B58\u5B83\uFF0C\u6216\u70B9\u300C\u8F7D\u5165\u5F53\u524D\u6B4C\u8BCD\u300D\u91CD\u6765\uFF09",{tone:"warning",duration:4200});return}let e=I.lines[I.cursor];e&&(co(),e.time=Math.round(i.position/10)*10,I.dirty=!0,I.cursor<I.lines.length-1&&(I.cursor+=1),yn()?.setDraftText(Ua()),re())}function k$(e){let t=I.lines[e];!t||typeof t.time!="number"||(co(),t.time=null,I.dirty=!0,yn()?.setDraftText(Ua()),re())}function S$(){I.lines.length&&(co(),I.lines.forEach(e=>{e.time=null}),I.cursor=0,I.dirty=!0,yn()?.setDraftText(Ua()),m("\u5DF2\u6E05\u7A7A\u5168\u90E8\u65F6\u95F4\uFF0C\u53EF\u4EE5\u91CD\u65B0\u6253\u8F74",{duration:2e3}),re())}function x$(){let e=dt(),t=I.lines.length?Ua():e.text||"",n=ue({title:"\u7F16\u8F91\u6B4C\u8BCD\u6587\u672C",desc:"\u4E00\u884C\u4E00\u53E5\uFF0C\u7EAF\u6587\u672C\u5373\u53EF\uFF1B\u5DF2\u7ECF\u6253\u8FC7\u8F74\u7684\u884C\u4F1A\u5E26\u4E0A [mm:ss.xx] \u65F6\u95F4\u6807\u7B7E\u3002\u6539\u5B8C\u70B9\u300C\u5E94\u7528\u6587\u672C\u300D\u56DE\u5230\u6253\u8F74\u5217\u8868\u3002",body:u`
      <div class="lyricspanel__row lyricspanel__row--between">
        <span class="lyricspanel__hint">共 ${I.lines.length} 行</span>
        <span class="lyricspanel__row-actions">
          <button
            class="btn btn--sm"
            type="button"
            data-act="modal-load"
            @click=${a=>Ih(a,e.text||"")}
          >
            载入当前歌词
          </button>
          <button class="btn btn--sm" type="button" data-act="modal-clear" @click=${a=>Ih(a,"")}>
            清空文本
          </button>
        </span>
      </div>
      <textarea
        class="editor__text editor__text--modal"
        data-editor-text
        spellcheck="false"
        placeholder="第一句&#10;第二句&#10;第三句&#10;…"
      ></textarea>
    `,okText:"\u5E94\u7528\u6587\u672C",cancelText:"\u53D6\u6D88",onOk:(a,r)=>{let o=r.querySelector("[data-editor-text]");return yn()?.applyDraftText(o?o.value:"")!==!1}});n.root.classList.add("modal--wide","modal--scroll");let s=n.root.querySelector("[data-editor-text]");s&&(s.value=t)}function Ih(e,t){let n=e.target.closest(".modal")?.querySelector("[data-editor-text]");n&&(n.value=t,n.focus())}function C$(e){let t=I.lines[e];if(!t)return;let n=t.time;if(typeof n!="number"){for(let s=e-1;s>=0;s-=1)if(typeof I.lines[s].time=="number"){n=I.lines[s].time;break}}if(typeof n!="number"){m("\u8FD9\u4E00\u884C\u8FD8\u6CA1\u6709\u65F6\u95F4\uFF0C\u65E0\u6CD5\u8DF3\u8F6C",{duration:1600});return}$t(n),Hf(e)}function jf(){return!!I.songId&&dt().songId!==I.songId&&A$()}function A$(){return I.lines.some(e=>typeof e.time=="number")}function M$(){Ut()}function I$({title:e,body:t,okText:n,cancelText:s}){return new Promise(a=>{let r=!1,o=l=>{r||(r=!0,a(l))};ue({title:e,body:t,okText:n,cancelText:s,onOk:()=>(o(!0),!0),onCancel:()=>(o(!1),!0)})})}function T$(){return Math.round(sn()*1.3)}var Th="/skins/",E$={loading:"\u6B4C\u8BCD\u5339\u914D\u4E2D\u2026",matching:"\u6B4C\u8BCD\u5339\u914D\u4E2D\u2026",failed:"\u6B4C\u8BCD\u5339\u914D\u5931\u8D25",none:"\u6682\u65E0\u6B4C\u8BCD"},qd=300,no=class extends Map{constructor(t,n){super(n),this.max=t}set(t,n){for(super.has(t)&&super.delete(t),super.set(t,n);this.size>this.max;){let s=super.keys().next();if(s.done)break;super.delete(s.value)}return this}touch(t){if(!super.has(t))return;let n=super.get(t);return this.set(t,n),n}},od=class extends Set{constructor(t,n){super(n),this.max=t}add(t){if(super.has(t))return this;for(super.add(t);this.size>this.max;){let n=super.values().next();if(n.done)break;super.delete(n.value)}return this}},tt=new no(qd),ld=new od(qd),Oc=new Set;function P$(e,t){if(!e?.id)return;let n=tt.get(e.id)||{lines:[],text:"",source:"none"};n.status!==t&&(tt.set(e.id,{...n,status:t}),G.lyricsStatus=null,De()?.id===e.id&&nt({type:"lyrics",...St()}))}function De(){return Be(i.currentId)}function Rc(){let e=i.config.lyricsSources;return!Array.isArray(e)||!e.length?!0:e.includes("online")}async function Vf(e){if(!e)return{lines:[],text:"",source:"none",status:"none"};if(tt.has(e.id))return tt.get(e.id);let t="",n="none",s=!1;if(tt.set(e.id,{lines:[],text:"",source:"none",status:"loading"}),x()){let r=await y.loadLyrics(e.id);r&&typeof r=="object"&&typeof r.lrc=="string"?(t=r.lrc,n=r.source||"backend"):typeof r=="string"&&(t=r,n="backend"),s=!!t,!t&&Rc()&&(P$(e,"matching"),t=await L$(e),t&&(n="online"))}if(!t){if(x()){let o=Rc()?"failed":"none",l={lines:[],text:"",source:"none",status:o};return tt.set(e.id,l),l}let r=i.songs.findIndex(o=>o.id===e.id);t=r===0?vl:r===1?bl:O$(e),n="preview"}let a={lines:bs(t),text:t,source:n,status:"ok"};return tt.set(e.id,a),x()&&s&&Rc()&&!Kf(a)&&D$(e),a}function Kf(e){return!!e?.lines?.some(t=>Array.isArray(t.words)&&t.words.length)}async function D$(e){try{let t=await y.lyricsUpgradeWord(e.id),n=typeof t?.lrc=="string"?t.lrc:"";if(!n)return;let s={lines:bs(n),text:n,source:t?.source||"online",status:"ok"};if(!Kf(s))return;tt.set(e.id,s),G.lyricsText=null,De()?.id===e.id&&nt({type:"lyrics",...St()})}catch(t){console.warn("[lyrics] \u9010\u5B57\u6B4C\u8BCD\u5347\u7EA7\u5931\u8D25",t)}}async function L$(e){if(ld.has(e.id))return"";ld.add(e.id);try{if(e.online){let n=await y.onlineLyrics(e.title||"",e.artist||"",e.duration||0),s=typeof n?.lrc=="string"?n.lrc:"";return s?(y.lyricsSave(e.id,s,n?.source||"online",!1).catch(()=>{}),s):""}let t=await y.lyricsAutoMatch(e.id);return typeof t?.lrc=="string"?t.lrc:""}catch(t){return console.warn("[lyrics] \u5728\u7EBF\u81EA\u52A8\u5339\u914D\u5931\u8D25",t),""}}function O$(e){let t=[];for(let n=12;n<Math.max(60,Math.floor((e.duration||18e4)/1e3)-10);n+=9)t.push(`[00:${String(n).padStart(2,"0")}.00]\uFF08${e.title} \xB7 \u6682\u65E0\u6B4C\u8BCD\u6587\u4EF6\uFF0C\u63A5\u5165\u540E\u7AEF\u540E\u53EF\u8BFB\u53D6 .lrc \u6216\u5185\u5D4C\u6B4C\u8BCD\uFF09`);return t.join(`
`)}var cd=new no(qd);function Ps(e){return cd.get(e)||0}function jn(e,t){if(!e)return 0;let n=Math.round(Number(t)||0);return n?cd.set(e,n):cd.delete(e),G.lyricsText=null,D.skinHost&&De()?.id===e&&nt({type:"lyrics",...St()}),n}var cr={songId:"",offset:0,lines:[]};function uo(e){let t=(e?tt.get(e.id):null)?.lines||[],n=Ps(e?.id);if(!n||!t.length)return t;if(cr.songId===e.id&&cr.offset===n)return cr.lines;let s=t.map(a=>{let r={time:a.time+n,text:a.text};return a.trans&&(r.trans=a.trans),a.words&&(r.words=a.words.map(o=>o+n)),r});return cr={songId:e.id,offset:n,lines:s},s}function dt(e){let t=e?Be(e):De(),n=t?tt.get(t.id):null;return{song:t||null,songId:t?.id||"",text:n?.text||"",source:n?.source||"none",status:n?.status||(n?.lines?.length?"ok":"none"),lines:n?.lines||[]}}function Eh(e){switch(e){case"embedded":return"\u5185\u5D4C\u6B4C\u8BCD";case"lrc-file":return"\u540C\u76EE\u5F55 .lrc";case"cache":return"\u6B4C\u8BCD\u7F13\u5B58";case"online":return"\u5728\u7EBF\u81EA\u52A8\u5339\u914D";case"manual":return"\u624B\u52A8\u7F16\u8F91";case"preview":return"\u9884\u89C8\u6570\u636E";default:return"\u6682\u65E0"}}async function dd(){let e=De();if(!(!e||tt.has(e.id)||Oc.has(e.id))){Oc.add(e.id);try{await Vf(e)}finally{Oc.delete(e.id)}}}function R$(){let e={text:"",chars:[],trans:[],words:[],wordEnds:[]},t=De();if(!t)return e;let n=uo(t);if(!n.length)return e;let s=ln(n,i.position);if(s<0)return e;let a=n[s],r=String(a.text??""),o=Array.isArray(a.words)&&a.words.length?a.words:[],l=o.length?On(r):[],c=l.length===o.length;return{text:r,chars:c?l:[],trans:Array.isArray(a.trans)?a.trans.filter(Boolean):[],words:c?o:[],wordEnds:c?sc(o,n[s+1]?.time):[]}}function q$(){let e={prev:"",text:"",next:""},t=De();if(!t)return e;let n=uo(t);if(!n.length)return e;let s=ln(n,i.position);return s<0?e:{prev:ys(n[s-1])||"",text:ys(n[s])||"",next:ys(n[s+1])||""}}async function qc(e,t,n="online",s={}){if(!e||!t)return!1;tt.set(e,{lines:bs(t),text:t,source:n,status:"ok"}),ld.add(e),G.lyricsText=null,G.lyricsStatus=null;let a=null;if(!s.transient&&x()){let r=s.embed??i.config.embedMeta===!0;try{let o=await y.lyricsSave(e,t,n,r);a=o||null;let l=typeof o?.lrc=="string"&&o.lrc?o.lrc:t;l!==t&&(tt.set(e,{lines:bs(l),text:l,source:n,status:"ok"}),G.lyricsText=null,G.lyricsStatus=null)}catch(o){console.warn("[lyrics] \u5199\u5165\u7F13\u5B58\u5931\u8D25",o)}}return D.skinHost&&De()?.id===e&&nt({type:"lyrics",...St()}),a||{ok:!0}}var ud=[],Nc=new Set,Mr=null;async function Nd(){return Mr||(Mr=B$()),Mr}async function N$(){try{await Nd()}catch(e){console.warn("[skins] \u542F\u52A8\u626B\u63CF\u6837\u5F0F\u5931\u8D25",e)}return Jf(),Rn()}async function F$(){if(x()){let e=await y.listSkins(),t="";try{t=String(await y.skinsToken()||"")}catch(n){console.warn("[skins] \u8BFB\u53D6\u76AE\u80A4\u8BBF\u95EE\u4EE4\u724C\u5931\u8D25",n)}return{items:Array.isArray(e)?e:[],base:n=>`${Th}${encodeURIComponent(n)}/`,suffix:t?`?t=${encodeURIComponent(t)}`:""}}try{let e=await fetch("/preview-skins/__list.json",{cache:"no-store"});if(!e.ok)throw new Error(`HTTP ${e.status}`);let t=await e.json();return{items:Array.isArray(t)?t:[],base:n=>`/preview-skins/${encodeURIComponent(n)}/`,suffix:""}}catch(e){return console.warn("[skins] \u9884\u89C8\u6A21\u5F0F\u8BFB\u53D6\u6837\u5F0F\u6E05\u5355\u5931\u8D25",e),{items:[],base:t=>`${Th}${encodeURIComponent(t)}/`,suffix:""}}}async function B$(){try{let{items:e,base:t,suffix:n}=await F$();ud.length=0;let s=new Set;jp();for(let a of e){if(!a?.id||!a?.module||!a?.manifest)continue;let r=t(a.id),o=c=>r+String(c).replace(/^\/+/,"")+n,l=a.manifest?.icon?.file;try{await Kp({manifest:a.manifest,moduleUrl:o(a.module),cssUrls:(Array.isArray(a.styles)?a.styles:[]).map(o),iconUrl:l?o(l):"",builtin:a.builtin===!0,source:a.source||""}),a.builtin===!0?rc(Qi(a.id)):Nc.add(a.id),s.add(a.id)}catch(c){ud.push({id:a.id,reason:c?.message??String(c)}),console.warn(`[skins] \u6837\u5F0F\u300C${a.id}\u300D\u52A0\u8F7D\u5931\u8D25\uFF1A`,c)}}for(let a of[...Nc])s.has(a)||(Nc.delete(a),Vp(a))}catch(e){console.warn("[skins] \u76AE\u80A4\u76EE\u5F55\u626B\u63CF\u5931\u8D25",e)}return Rn()}async function po(){Mr=null,await Nd(),Jf()}async function U$(e){await y.deleteSkin(e),await po();let t=Rn().some(n=>n.id===e);return!t&&(i.pvMode===e||i.config.playerViewMode===e)&&Rs(va("").skin?.id||""),{removed:!t,skinIds:Rn().map(n=>n.id)}}function Gf(){return ud.slice()}var Yf=0;function Xf(){return Yf}function Jf(){Yf+=1,Ve()}var D={view:null,stage:null,backgroundRoot:null,skinHost:null,get skin(){return D.skinHost?.skin||null},get mountedId(){return D.skinHost?.mountedId||null},closeTimer:null,resizeObserver:null,themeObserver:null,carouselTimer:null,carouselIndex:0,carouselLastAdvance:0,carouselSongId:null},G={songId:null,cover:null,lyricsText:null,lyricsStatus:null,options:null,playing:null,themeId:null};function Fd(){return{position:io(),duration:i.duration,playing:i.playing,volume:i.volume,muted:i.muted}}function Bd(e){if(!e)return[Xe];let t=i.coverSets.get(e.id)?.items,n=Array.isArray(t)?t.map(s=>s.preview).filter(Boolean):[];return n.length?n:[Rt(e)]}function W$(e){return e?ln(uo(e),i.position):-1}function Qf(e){let t=e?tt.get(e.id):null,n=uo(e),s=t?.status||(n.length?"ok":"none");return{lines:n,text:t?.text||"",source:t?.source||"none",status:s,statusText:n.length?"":E$[s]||"\u6682\u65E0\u6B4C\u8BCD",index:ln(n,i.position)}}function z$(e){return e?{id:e.id??"",title:e.title||"",artist:e.artist||"",album:e.album||"",duration:e.duration||0,kind:e.online?"online":"local"}:null}function St(){let e=De(),t=Bd(e),n=At(D.carouselIndex,0,Math.max(0,t.length-1));return{song:z$(e),cover:t[n]||Xe,covers:t,coverIndex:n,lyrics:Qf(e)}}function Ud(){return{showLyrics:i.config.showLyrics!==!1,lyricsFontSize:i.config.lyricsFontSize,animations:i.config.animations!==!1,coverCarousel:i.config.coverCarousel===!0,coverCarouselInterval:em().seconds,interactive:!0,performanceMode:i.config.skinPerformanceMode==="performance"?"performance":"smooth"}}function H$(){return St()}function Zf(){return Fd()}function j$(e={}){return{...Ud(),...e}}function V$(){return D.skinHost||(D.skinHost=Gp({root:D.stage,backgroundRoot:D.backgroundRoot,view:D.view,app:document.getElementById("app"),source:{playback:Fd,media:St,options:Ud,env:K$,defaultCover:Xe,spectrum:()=>i.playing?i$():null,actions:{seek(e){$t(e),Ir({force:!0})},seekBy(e){$t(Math.max(0,Number(i.position||0)+Number(e||0))),Ir({force:!0})},seekRatio(e){let t=Math.max(0,Math.min(1,Number(e)||0));i.duration&&($t(t*i.duration),Ir({force:!0}))},togglePlay:Ut,next:()=>ft(!1),prev:()=>ms(),toggleLike(){let e=De();e&&It(e.id)},like(){let e=De();e&&!mt(e.id)&&It(e.id)},unlike(){let e=De();e&&mt(e.id)&&It(e.id)},openFolder(){let e=De();e?.path&&y.revealInExplorer(e.path).catch(()=>{})},openCoverPanel(){let e=De();!e||e.online||Vn(()=>Promise.resolve().then(()=>Hd),[]).then(t=>t.openCoverPanel(e.id))},openLyricsPanel(){zf()},reportBackdrop(e){let t=D.skin;!t||!e||typeof e!="object"||(t.colors={...t.colors,...e},t.chrome=Zi(t.colors),D.skinHost?.applyChrome(i.playerOpen&&!D.view?.hidden))}}}})),D.skinHost}function K$(){let e=D.stage?.getBoundingClientRect?.()||{width:0,height:0};return{themeId:document.documentElement.dataset.theme||"",mode:document.documentElement.dataset.mode==="light"?"light":"dark",width:Math.round(e.width||0),height:Math.round(e.height||0),dpr:Number(window.devicePixelRatio)||1,reducedMotion:!!window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches,foreground:!!i.playerOpen&&!D.view?.hidden}}function nt(e){D.skinHost?.push(e)}function G$(e){let{skin:t,fellBack:n}=va(e);t&&(n&&console.warn(`[skins] \u6837\u5F0F\u300C${e}\u300D\u4E0D\u5B58\u5728\uFF0C\u5DF2\u56DE\u9000\u5230\u300C${t.name}\u300D`),i.pvMode=t.id,document.getElementById("app")?.setAttribute("data-mode",t.id),V$().mount(t),D.skinHost.applyChrome(i.playerOpen&&!D.view?.hidden),X$(),pd("closed"))}function pd(e){let t=D.backgroundRoot;t&&(t.dataset.state=e)}function Y$(){D.skin&&(D.skinHost?.unmount(),D.resizeObserver&&(D.resizeObserver.disconnect(),D.resizeObserver=null),D.carouselTimer&&(clearInterval(D.carouselTimer),D.carouselTimer=null))}function X$(){D.resizeObserver||typeof ResizeObserver!="function"||(D.resizeObserver=new ResizeObserver(()=>{let e=D.stage.getBoundingClientRect();nt({type:"resize",width:Math.round(e.width),height:Math.round(e.height)})}),D.resizeObserver.observe(D.stage,{box:"border-box"}))}function em(){let e=Number(i.config.coverCarouselInterval),t=Number.isFinite(e)&&e>0?Math.max(2,e):10;return{enabled:i.config.coverCarousel===!0,seconds:t,intervalMs:t*1e3}}function J$(){let e=De();D.carouselSongId!==(e?.id??null)&&(D.carouselSongId=e?.id??null,D.carouselIndex=i.coverSets.get(e?.id)?.active??0,D.carouselLastAdvance=Date.now());let{enabled:t,intervalMs:n}=em(),s=Bd(e);!t||!i.playerOpen||!i.playing||s.length<2||Date.now()-D.carouselLastAdvance<n||(D.carouselLastAdvance=Date.now(),D.carouselIndex=(D.carouselIndex+1)%s.length,nt({type:"media",...St()}))}function Q$(){D.carouselTimer||(D.carouselTimer=setInterval(J$,1e3))}function Z$(){let e=Bd(De());return e.length<2?!1:(D.carouselIndex=(D.carouselIndex+1)%e.length,D.carouselLastAdvance=Date.now(),nt({type:"media",...St()}),!0)}function Ph(){G.cover=null,D.skinHost&&nt({type:"media",...St()})}function Fc(e={},t=e.type==="song"||e.type==="lyrics"||e.type==="media"){let n=St(),s=n.cover!==G.cover||n.song?.id!==G.songId;G.cover=n.cover,!(!s&&!t)&&nt({...e,...n})}function Dh(){let e=Ud();G.options&&G.options.showLyrics===e.showLyrics&&G.options.lyricsFontSize===e.lyricsFontSize&&G.options.animations===e.animations&&G.options.coverCarousel===e.coverCarousel&&G.options.coverCarouselInterval===e.coverCarouselInterval&&G.options.interactive===e.interactive&&G.options.performanceMode===e.performanceMode||(G.options=e,nt({type:"options",options:e}))}function Lh(){let e=!!i.playerOpen&&!!D.view?.dataset.theme;return D.skinHost?.applyChrome(e)??!1}async function Oh(){if(!D.view){if(D.view=ri("#playerview"),D.stage=ri("#playerview-stage"),D.backgroundRoot=document.getElementById("skin-background"),!D.view||!D.stage)return;ek(),Q$()}let e=D.view,t=De();if(!i.playerOpen){e.dataset.state!=="closed"&&(e.dataset.state="closed",Lh(),pd("closed"),D.closeTimer&&clearTimeout(D.closeTimer),D.closeTimer=setTimeout(()=>{D.closeTimer=null,!i.playerOpen&&(e.hidden=!0,Y$(),so())},T$()+20));return}D.closeTimer&&(clearTimeout(D.closeTimer),D.closeTimer=null),e.hidden=!1,await Nd();let n=i.pvMode||i.config.playerViewMode||"",s=D.mountedId!==n;if(s&&(G$(n),so()),(e.dataset.state!=="opened"||s)&&(e.offsetHeight,e.dataset.state="opened",pd("opened"),Lh()),!D.skin)return;if(G.songId!==(t?.id??null)){G.songId=t?.id??null,G.cover=null,G.lyricsText=null,D.carouselSongId=t?.id??null,D.carouselIndex=i.coverSets.get(t?.id)?.active??0,Fc({type:"song"});let r=t?.id??null,o=await Vf(t);if((De()?.id??null)!==r)return;G.lyricsText=o.text,G.lyricsStatus=o.status||"",Fc({type:"lyrics"}),Dh();return}Fc({type:"media"},!1);let a=Qf(t);(a.text!==G.lyricsText||a.status!==G.lyricsStatus)&&(G.lyricsText=a.text,G.lyricsStatus=a.status,nt({type:"lyrics",...St()})),Dh(),Ir()}function so(){G.songId=null,G.cover=null,G.lyricsText=null,G.lyricsStatus=null,G.options=null,G.playing=null}function Ir({force:e=!1,lyricIndex:t}={}){if(!i.playerOpen||!D.skin)return;let n=Fd();(G.playing!==n.playing||e)&&(G.playing=n.playing,nt({type:"state",...n}));let s=typeof t=="number"?t:W$(De());nt({type:"progress",...n,lyricIndex:s})}function ek(){D.themeObserver||(G.themeId=document.documentElement.dataset.theme||"",D.themeObserver=new MutationObserver(()=>{let e=document.documentElement.dataset.theme||"",t=document.documentElement.dataset.mode||"dark";e!==G.themeId&&(G.themeId=e,nt({type:"theme",themeId:e,mode:t}))}),D.themeObserver.observe(document.documentElement,{attributes:!0,attributeFilter:["data-theme","data-mode"]}))}function Rs(e){let{skin:t,fellBack:n}=va(e);t&&(i.pvMode=t.id,i.config.playerViewMode=t.id,so(),$(),n&&console.warn(`[skins] \u6837\u5F0F\u300C${e}\u300D\u4E0D\u53EF\u7528\uFF0C\u5DF2\u5207\u6362\u5230\u300C${t.name}\u300D`))}function tm(){i.playerOpen=!0,i.pvMode=va(i.config.playerViewMode||"").skin?.id||i.pvMode,so(),$()}function ho(){i.playerOpen=!1,$()}function hd(){i.playerOpen?ho():tm()}function qs(){return Rn().map(e=>({id:e.id,name:e.name,icon:e.icon||"disc",iconUrl:e.iconUrl||"",builtin:e.builtin===!0,source:e.source||"",version:e.version||"",author:e.author||"",description:e.description||"",colorsMissing:Array.isArray(e.colorsMissing)?e.colorsMissing.slice():[],chrome:e.chrome||null,background:e.background===!0,spectrum:e.spectrum||!1}))}var tk=/^#(?:[0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i,nk=/^(?:rgb|rgba|hsl|hsla)\(\s*[0-9.,%\s/]+\)$/i;function Rh(e){let t=String(e??"").trim();return tk.test(t)||nk.test(t)?t:""}function sk(e){let t=[];for(let n of e)for(let s of n?.swatch||[]){let a=Rh(s);a&&!t.includes(a)&&t.push(a)}return os("packstore-swatches",t.map((n,s)=>`[data-packswatch="${s}"]{background:${n}}`).join(`
`)),n=>(n?.swatch||[]).map(Rh).filter(Boolean).map(s=>t.indexOf(s))}var fd=class extends qe{static deps(){return[]}constructor(){super(),this.kind="theme",this.localBody=A,this.onChanged=null,this._tab="local",this._status="idle",this._items=[],this._swatchIndex=()=>[],this._cached=!1,this._stale="",this._error="",this._busy="",this._source={source:"",default:"",channel:""},this._editing=!1,this._draft=""}open(t){this.kind=t.kind==="style"?"style":"theme",this.localBody=t.localBody??A,this.onChanged=t.onChanged??null,this._tab="local",this._status="idle"}get _kindLabel(){return this.kind==="style"?"\u6837\u5F0F\u5305":"\u4E3B\u9898"}_ensureRepo(){this._status==="idle"&&(this._loadSource(),this.load(!1))}get _canEditSource(){return this._status==="ok"||this._status==="error"}async _loadSource(){try{let t=await y.packSource();t&&(this._source={source:String(t.source||""),default:String(t.default||""),channel:String(t.channel||""),problem:String(t.problem||"")},this._draft=this._source.source,this.requestUpdate())}catch(t){console.warn("[packstore] \u8BFB\u53D6\u63D2\u4EF6\u4ED3\u5E93\u5730\u5740\u5931\u8D25",t)}}async load(t){this._status="loading",this._error="",this.requestUpdate(),this._loadSource();try{let n=await y.packCatalog(this.kind,t===!0);if(!n){this._status="preview",this.requestUpdate();return}this._items=Array.isArray(n.items)?n.items:[],this._swatchIndex=sk(this._items),this._cached=n.cached===!0,this._stale=String(n.staleReason||""),this._status="ok"}catch(n){this._error=n?.message||String(n),this._cached=!1,this._stale="",this._status="error"}this.requestUpdate()}_installedIds(){let t=this.kind==="style"?qs():Fs();return new Set(t.map(n=>n.id))}_localVersion(t){if(this.kind!=="style")return"";let n=qs().find(s=>s.id===t);return String(n?.version||"")}async install(t){if(this._busy)return;let n=String(t?.id||"");if(!n)return;this._busy=n,this.requestUpdate();let s=m(`\u6B63\u5728\u5B89\u88C5\u300C${t.name||n}\u300D\u2026`,{duration:0});try{let a=await y.packInstall(this.kind,n);s.close(),await this._refreshLocal();let r=t.name||n,o=Array.isArray(a?.backups)?a.backups.length:0;m(`\u5DF2\u5B89\u88C5\u300C${r}\u300D${o?`\uFF08\u6709 ${o} \u4E2A\u539F\u6587\u4EF6\u5907\u4EFD\u6210\u4E86 .bak\uFF09`:""}`,{tone:"success",duration:4200})}catch(a){s.close(),m(`\u5B89\u88C5\u5931\u8D25\uFF1A${a?.message??a}`,{tone:"error",duration:6e3})}this._busy="",this.requestUpdate()}async _refreshLocal(){try{this.kind==="style"?await po():await Na()}catch(t){console.warn("[packstore] \u91CD\u626B\u672C\u673A\u63D2\u4EF6\u5931\u8D25\uFF08\u5B89\u88C5\u7ED3\u679C\u4E0D\u53D7\u5F71\u54CD\uFF09",t)}this.onChanged?.()}_startEdit(){this._editing=!0,this._draft=this._source.source,this.requestUpdate(),this.updateComplete.then(()=>this.$(".packsrc__input")?.focus())}_onSrcInput(t){this._draft=String(t.target.value??"")}_cancelEdit(){this._editing=!1,this.requestUpdate()}_onSrcKey(t){if(t.key==="Enter"){t.preventDefault(),t.stopPropagation(),this._saveSource();return}t.key==="Escape"&&(t.stopPropagation(),this._editing=!1,this.requestUpdate())}async _saveSource(){let t=this._draft.trim();try{let n=await y.packSetSource(t);n&&(this._source={source:String(n.source||""),default:String(n.default||""),channel:String(n.channel||""),problem:String(n.problem||"")}),this._editing=!1,this.requestUpdate(),this._source.problem?m(this._source.problem,{tone:"error",duration:7e3}):m(`\u63D2\u4EF6\u4ED3\u5E93\u5DF2\u6307\u5411 ${this._source.source}`,{tone:"success",duration:3600}),this._items=[],this._status="loading",this.load(!0)}catch(n){m(`\u4FDD\u5B58\u5931\u8D25\uFF1A${n?.message??n}`,{tone:"error",duration:6e3})}}render(){return u` <div class="packdlg">
      <div class="packtabs" role="tablist">
        ${this._tabButton("local","\u4ECE\u672C\u5730\u5BFC\u5165")} ${this._tabButton("repo","\u4ECE\u4ED3\u5E93\u83B7\u53D6")}
      </div>
      ${this._tab==="repo"?this._repoPanel():this.localBody}
    </div>`}_tabButton(t,n){let s=this._tab===t;return u`<button
      class="packtab"
      type="button"
      role="tab"
      data-tab=${t}
      data-active=${String(s)}
      aria-selected=${String(s)}
      @click=${()=>{this._tab=t,t==="repo"&&this._ensureRepo(),this.requestUpdate()}}
    >
      ${n}
    </button>`}_repoPanel(){return u`
      <div class="packsrc">
        <span class="packsrc__label">来源</span>
        ${this._editing?u`<input
                  class="input packsrc__input"
                  type="text"
                  .value=${this._draft}
                  placeholder="https://raw.githubusercontent.com/<owner>/<repo>/<branch>/plugins"
                  @input=${t=>this._onSrcInput(t)}
                  @keydown=${t=>this._onSrcKey(t)}
                />
                <button class="btn btn--sm btn--primary" type="button" @click=${()=>this._saveSource()}>
                  保存
                </button>
                <button class="btn btn--sm" type="button" @click=${()=>this._cancelEdit()}>取消</button>`:u`<span class="packsrc__url" title=${this._source.source}
                  >${this._source.source||"\uFF08\u9ED8\u8BA4\u5730\u5740\uFF09"}</span
                >
                ${this._canEditSource?u`<button class="btn btn--sm" type="button" @click=${()=>this._startEdit()}>修改</button>`:A}`}
        <button
          class="btn btn--sm"
          type="button"
          ?disabled=${this._status==="loading"}
          @click=${()=>this.load(!0)}
        >
          ${g("refresh")}<span>刷新</span>
        </button>
      </div>

      ${this._source.problem?u`<div class="packnote" data-tone="warn" role="alert">
              ${this._source.problem}（明文 http 取回的脚本会在同源页面里执行，链路上任何一跳都能改写它）
            </div>`:A}
      ${this._status==="preview"?u`<div class="packnote" data-tone="warn">
              拿不到仓库清单：没有后端（浏览器预览），或者后端还没就绪。请在播放器里打开这个面板，或点「刷新」重试。
            </div>`:A}
      ${this._cached?u`<div class="packnote" data-tone="warn">
              <b>这是本机缓存的清单</b>，刚才没能连上仓库：${this._stale}
            </div>`:A}
      ${this._status==="error"?u`<div class="packnote" data-tone="error">获取清单失败：${this._error}</div>`:A}
      ${this._status==="loading"?u`<div class="packnote">正在获取清单…</div>`:A}
      ${this._status==="ok"?this._list():A}
    `}_list(){if(!this._items.length)return u`<div class="packnote">仓库里还没有${this._kindLabel}。</div>`;let t=this._installedIds();return u` <div class="packlist">${this._items.map(n=>this._item(n,t))}</div>`}_item(t,n){let s=String(t?.id||""),a=n.has(s),r=a?this._localVersion(s):"",o=String(t?.version||""),l=a&&o&&r&&o!==r,c=this._busy===s,d=!a||l,p=Array.isArray(t?.files)?t.files.length:0;return u` <div class="packitem">
      <div class="packitem__main">
        <div class="packitem__name">
          <span>${t?.name||s}</span>
          ${o?u`<span class="packitem__ver">v${o}</span>`:A}
          ${a?u`<span class="packitem__badge">已安装</span>`:A}
        </div>
        <div class="packitem__meta">
          ${t?.author?u`<span>${t.author}</span>`:A}
          <span>${p} 个文件</span>
          ${t?.mode==="light"||t?.mode==="dark"?u`<span>${t.mode==="light"?"\u6D45\u8272":"\u6DF1\u8272"}</span>`:A}
        </div>
        ${t?.description?u`<div class="packitem__desc">${t.description}</div>`:A}
        <div class="packitem__swatch">${this._swatchIndex(t).map(h=>u`<i data-packswatch=${h}></i>`)}</div>
      </div>
      <div class="packitem__side">
        <button
          class=${d?"btn btn--sm btn--primary":"btn btn--sm"}
          type="button"
          data-id=${s}
          ?disabled=${c||!!this._busy}
          @click=${()=>this.install(t)}
        >
          ${c?"\u5B89\u88C5\u4E2D\u2026":l?"\u66F4\u65B0":a?"\u91CD\u65B0\u5B89\u88C5":"\u5B89\u88C5"}
        </button>
      </div>
    </div>`}};Se("mp-pack-store",fd);function nm(e){let t=ue({title:e.title,body:u`<mp-pack-store></mp-pack-store>`,okText:"\u5173\u95ED",onOk:()=>!0});return t.root.classList.add("modal--wide","modal--scroll","modal--single"),t.root.querySelector("mp-pack-store")?.open({kind:e.kind,localBody:e.localBody,onChanged:e.onChanged}),t}var ak=[{value:"play",label:"\u64AD\u653E"},{value:"play-list",label:"\u64AD\u653E\u5F53\u524D\u5217\u8868"},{value:"next",label:"\u4E0B\u4E00\u9996\u64AD\u653E"}],ik=[{value:"system",label:"\u8DDF\u968F\u7CFB\u7EDF"},{value:"round",label:"\u6807\u51C6"},{value:"small",label:"\u5C0F\u5706\u89D2"},{value:"square",label:"\u76F4\u89D2"}],rk=[{value:"compact",label:"\u7D27\u51D1"},{value:"cozy",label:"\u6807\u51C6"},{value:"roomy",label:"\u5BBD\u677E"}],ok=[{value:"fast",label:"\u5FEB\u901F 0.25s"},{value:"medium",label:"\u9002\u4E2D 0.5s"},{value:"slow",label:"\u7F13\u6162 0.75s"}],lk=[{value:"smooth",label:"\u6D41\u7545\u4F18\u5148"},{value:"performance",label:"\u6027\u80FD\u4F18\u5148"}],ck={embedded:"\u5185\u5D4C\u6B4C\u8BCD","lrc-file":"\u540C\u76EE\u5F55 .lrc",cache:"\u6B4C\u8BCD\u7F13\u5B58",online:"\u5728\u7EBF\u81EA\u52A8\u5339\u914D"};function dk(){let e=(Array.isArray(i.config.lyricsSources)?i.config.lyricsSources:[]).map(t=>ck[t]||t);return e.length?e.join(" \u2192 "):"\uFF08\u672A\u914D\u7F6E\uFF09"}function Wd(){let e=i.coverCache;if(!e)return"\u6B63\u5728\u8BFB\u53D6\u2026";let t=((e.bytes||0)/1024/1024).toFixed(1);return`\u5DF2\u7F13\u5B58 ${N(e.covers||0)} \u5F20\u5C01\u9762\u3001${N(e.lyrics||0)} \u4EFD\u6B4C\u8BCD\uFF0C\u5171 ${t} MB`}function sm(){let e=i.coverCache||{};return(Number(e.covers)||0)+(Number(e.lyrics)||0)}function uk(){let e="\u9ED8\u8BA4\u5173\u95ED\uFF1A\u5C01\u9762\u4E0E\u6B4C\u8BCD\u90FD\u53EA\u653E\u5728\u7F13\u5B58\u76EE\u5F55\u91CC\u3002\u5F00\u542F\u540E\u4E0B\u8F7D / \u66F4\u6362\u5C01\u9762\u65F6\u4F1A\u628A\u5B83\u4EEC\u5199\u8FDB\u6587\u4EF6\u6807\u7B7E\uFF0C\u8FD9\u6837\u628A\u6587\u4EF6\u62F7\u5230\u522B\u7684\u64AD\u653E\u5668\u4E0A\u4E5F\u80FD\u770B\u5230\u5C01\u9762\u4E0E\u6B4C\u8BCD\uFF08m4a / flac \u652F\u6301\uFF0Cmp3 \u7B49\u683C\u5F0F\u4F1A\u660E\u786E\u8DF3\u8FC7\uFF09";return i.coverCache?sm()===0?`${e}\u3002\u5F53\u524D\u7F13\u5B58\u91CC\u8FD8\u6CA1\u6709\u5C01\u9762\u6216\u6B4C\u8BCD\u53EF\u5199`:`${e}\u3002\u7F13\u5B58\u91CC\u5DF2\u7ECF\u6709 ${Wd()}`:e}function pk(){return`\u8FD9\u4E2A\u5F00\u5173\u53EA\u5BF9\u4E4B\u540E\u4E0B\u8F7D\u6216\u66F4\u6362\u7684\u5C01\u9762\u751F\u6548\uFF1B\u5DF2\u7ECF\u5B58\u5728\u7F13\u5B58\u91CC\u7684\u5C01\u9762\u4E0E\u6B4C\u8BCD\uFF08${Wd()}\uFF09\u53EF\u4EE5\u7528\u4E0B\u9762\u7684\u6309\u94AE\u4E00\u6B21\u6027\u5199\u8FDB\u6B4C\u66F2\u6587\u4EF6\u3002mp3 / wav \u7B49\u6682\u4E0D\u652F\u6301\u5199\u6807\u7B7E\u7684\u683C\u5F0F\u4F1A\u88AB\u8DF3\u8FC7\uFF0C\u4E0D\u4F1A\u52A8\u4F60\u7684\u6587\u4EF6\u3002`}function qh(){let e=Fs(),t=[];for(let s of e)for(let a of s.swatch||[])t.includes(a)||t.push(a);let n=t.map((s,a)=>`[data-swatch="${a}"]{background:${s}}`).join(`
`);return os("swatch-styles",n),s=>(s.swatch||[]).map(a=>t.indexOf(a))}function hk(e){if(!e?.dir)return`\uFF08\u6D4F\u89C8\u5668\u9884\u89C8\u6A21\u5F0F\u8BFB\u4E0D\u5230\u672C\u673A\u76EE\u5F55\uFF0C\u4EE5\u4E0B\u662F\u6E90\u7801\u4ED3\u5E93\u91CC\u7684\u53C2\u8003\u6587\u4EF6\uFF09
1. \u63A5\u53E3\u552F\u4E00\u5B9A\u4E49\uFF08\u542B JSDoc \u7C7B\u578B\u4E0E\u5B8C\u6574\u5B57\u6BB5\u8BF4\u660E\uFF09\uFF1Afrontend/packages/player-skins/src/contract.js
2. \u5185\u7F6E\u6837\u5F0F\u5305\uFF08\u7ED3\u6784\u4E0E\u5199\u6CD5\u53EF\u76F4\u63A5\u53C2\u8003\uFF0C\u5185\u7F6E\u4E0E\u7B2C\u4E09\u65B9\u73B0\u5728\u540C\u6784\uFF09\uFF1Ainternal/skins/resources/player-skins/classic/\u3001immersive/
3. \u53EF\u76F4\u63A5\u590D\u5236\u6539\u540D\u7684\u6700\u5C0F\u793A\u4F8B\u5305\uFF1Ainternal/skins/template/\uFF08skin.json / skin.js / skin.css / assets/\uFF09
4. \u8BF4\u660E\u6587\u6863\uFF1Afrontend/packages/player-skins/README.md \u4E0E internal/skins/template/\u76AE\u80A4\u8BF4\u660E.md`;let t=["\u672C\u673A\u771F\u5B9E\u8DEF\u5F84\u5982\u4E0B\u3002\u5982\u679C\u4F60\u80FD\u8BFB\u6587\u4EF6\uFF0C\u8BF7\u5148\u6253\u5F00\u5B83\u4EEC\u5F53\u8303\u4F8B\uFF1B\u5982\u679C\u8BFB\u4E0D\u5230\uFF08\u4F8B\u5982\u7EAF\u804A\u5929\u73AF\u5883\uFF09\uFF0C\u8BF7\u8BA9\u4F7F\u7528\u8005\u628A\u4E0B\u9762\u7B2C 2 \u6761\u7684\u6587\u4EF6\u5185\u5BB9\u8D34\u7ED9\u4F60\uFF0C\u518D\u5F00\u59CB\u5199\u3002",`1. \u6837\u5F0F\uFF08\u76AE\u80A4\uFF09\u76EE\u5F55 \u2014\u2014 \u7B2C\u4E09\u65B9\u6837\u5F0F\u5305\u90FD\u653E\u5728\u8FD9\u91CC\uFF0C\u626B\u63CF\u53EA\u8BA4\u5B83\u4E0B\u9762\u7684\u4E00\u5C42\u5B50\u76EE\u5F55\uFF1A${e.dir}`];e.example?t.push(`2. \u793A\u4F8B\u6837\u5F0F\u5305\uFF08\u5B8C\u6574\u53EF\u8FD0\u884C\u7684 skin.js / skin.css / skin.json\uFF0C\u590D\u5236\u6539\u540D\u5C31\u662F\u4E00\u4EFD\u65B0\u6837\u5F0F\uFF09\uFF1A${e.example}`):t.push("2. \u793A\u4F8B\u6837\u5F0F\u5305\uFF1A\u672C\u673A\u6CA1\u6709\u627E\u5230 _template \u76EE\u5F55\uFF0C\u8BF7\u53EA\u6309\u672C\u89C4\u683C\u7684\u63A5\u53E3\u5B9A\u4E49\u5199\u3002"),e.current?t.push(`3. \u5F53\u524D\u6B63\u5728\u4F7F\u7528\u7684\u6837\u5F0F\u5305\uFF08\u6700\u8D34\u8FD1\u73B0\u72B6\u7684\u53C2\u8003\uFF09\uFF1A${e.current}`):t.push(`3. \u5F53\u524D\u6B63\u5728\u4F7F\u7528\u7684\u662F\u5185\u7F6E\u6837\u5F0F\uFF08${e.currentId||"classic / immersive"}\uFF09\uFF1A\u5B83\u7684\u6587\u4EF6\u5185\u5D4C\u5728\u7A0B\u5E8F\u91CC\uFF0C\u78C1\u76D8\u4E0A\u6CA1\u6709\u5BF9\u5E94\u76EE\u5F55\uFF0C\u8BF7\u4EE5\u7B2C 2 \u6761\u7684\u793A\u4F8B\u5305\u4E3A\u51C6\u3002`);let n=Array.isArray(e.packs)?e.packs:[];if(n.length){t.push("4. \u8BE5\u76EE\u5F55\u91CC\u5DF2\u6709\u7684\u7B2C\u4E09\u65B9\u6837\u5F0F\u5305\uFF08\u53EF\u4EE5\u76F4\u63A5\u8BFB\u5B83\u4EEC\u7684\u5165\u53E3\u4E0E\u6837\u5F0F\uFF09\uFF1A");for(let s of n){let a=[s.module,...Array.isArray(s.styles)?s.styles:[]].filter(Boolean);t.push(`   \xB7 ${s.name||s.id}\uFF08id: ${s.id}\uFF09\uFF1A${a.join("\u3001")||s.dir}`)}}else t.push("4. \u8BE5\u76EE\u5F55\u91CC\u76EE\u524D\u8FD8\u6CA1\u6709\u7B2C\u4E09\u65B9\u6837\u5F0F\u5305 \u2014\u2014 \u4F60\u5199\u7684\u8FD9\u4E2A\u4F1A\u662F\u7B2C\u4E00\u4E2A\u3002");return t.push('5. \u6E05\u5355\u91CC apiVersion \u5FC5\u987B\u662F "3.0"\uFF08major \u4E0D\u540C\u4F1A\u88AB\u76F4\u63A5\u62D2\u7EDD\uFF1Bminor \u53EF\u4EE5\u6BD4\u5BBF\u4E3B\u65E7\uFF09\u3002'),t.join(`
`)}function fk(e){if(!e?.dir)return`\uFF08\u6D4F\u89C8\u5668\u9884\u89C8\u6A21\u5F0F\u8BFB\u4E0D\u5230\u672C\u673A\u76EE\u5F55\uFF0C\u4EE5\u4E0B\u662F\u6E90\u7801\u4ED3\u5E93\u91CC\u7684\u53C2\u8003\u6587\u4EF6\uFF09
1. \u4EE4\u724C\u9ED8\u8BA4\u503C\u4E0E\u6CE8\u91CA\uFF1Afrontend/src/styles/tokens.css\u3001frontend/src/styles/themes/_template.css
2. \u5185\u7F6E\u4E3B\u9898\uFF08\u53EF\u76F4\u63A5\u5BF9\u7167\u5199\u6CD5\uFF09\uFF1Afrontend/src/styles/themes/flat-dark.css\u3001flat-light.css\u3001cover-dark.css
3. \u626B\u63CF\u4E0E\u6307\u4EE4\u89E3\u6790\u5B9E\u73B0\uFF1Ainternal/theme/theme.go`;let t=["\u672C\u673A\u771F\u5B9E\u8DEF\u5F84\u5982\u4E0B\u3002\u5982\u679C\u4F60\u80FD\u8BFB\u6587\u4EF6\uFF0C\u8BF7\u5148\u6253\u5F00\u5B83\u4EEC\u5F53\u8303\u4F8B\uFF1B\u5982\u679C\u8BFB\u4E0D\u5230\uFF08\u4F8B\u5982\u7EAF\u804A\u5929\u73AF\u5883\uFF09\uFF0C\u8BF7\u8BA9\u4F7F\u7528\u8005\u628A\u4E0B\u9762\u7B2C 2 \u6761\u7684\u6587\u4EF6\u5185\u5BB9\u8D34\u7ED9\u4F60\uFF0C\u518D\u5F00\u59CB\u5199\u3002",`1. \u4E3B\u9898\u76EE\u5F55 \u2014\u2014 \u7528\u6237\u4E3B\u9898\u90FD\u653E\u5728\u8FD9\u91CC\uFF0C\u53EA\u626B\u4E00\u5C42\u3001\u4E0D\u9012\u5F52\uFF1B\u6587\u4EF6\u540D\u9ED8\u8BA4\u5C31\u662F\u4E3B\u9898 id\uFF0C\u663E\u793A\u540D\u7531 @theme-name \u51B3\u5B9A\uFF1A${e.dir}`];e.currentFile?t.push(`2. \u5F53\u524D\u6B63\u5728\u4F7F\u7528\u7684\u4E3B\u9898\uFF1A${e.currentName||e.currentId}\uFF08id: ${e.currentId}\uFF09\u2192 \u6587\u4EF6\uFF1A${e.currentFile}`):t.push("2. \u5F53\u524D\u4E3B\u9898\u7684\u6587\u4EF6\u6CA1\u627E\u5230\uFF0C\u8BF7\u4EE5\u7B2C 3 \u6761\u5217\u51FA\u7684\u6587\u4EF6\u4E3A\u51C6\u3002");let n=Array.isArray(e.files)?e.files:[];if(n.length){t.push("3. \u4E3B\u9898\u76EE\u5F55\u91CC\u5DF2\u6709\u7684\u4E3B\u9898\u6587\u4EF6\uFF08\u90FD\u662F\u5408\u6CD5\u793A\u4F8B\uFF0C\u53EF\u76F4\u63A5\u5BF9\u7167\u5199\u6CD5\uFF09\uFF1A");for(let s of n)t.push(`   \xB7 ${s.file}\uFF08${s.name||s.id}\uFF0Cid: ${s.id}\uFF0C\u6A21\u5F0F ${s.mode}\uFF0C${s.builtin?"\u5185\u7F6E":"\u7528\u6237\u5BFC\u5165"}\uFF09`)}else t.push("3. \u4E3B\u9898\u76EE\u5F55\u91CC\u6682\u65F6\u6CA1\u6709 .css \u6587\u4EF6\u3002");return t.join(`
`)}function mk(e=null){return`\u8BF7\u4E3A\u300C\u672C\u5730\u97F3\u4E50\u64AD\u653E\u5668\u300D\uFF08Go + WebView2 \u7684 Windows \u684C\u9762\u5E94\u7528\uFF09\u4EA7\u51FA\u4E00\u4E2A\u7B2C\u4E09\u65B9\u300C\u64AD\u653E\u754C\u9762\u6837\u5F0F\uFF08\u63D2\u4EF6\uFF09\u300D\u5305\u3002\u8FD9\u4E2A\u5305\u4F1A\u88AB\u5E94\u7528\u76F4\u63A5\u626B\u63CF\u5E76\u52A0\u8F7D\uFF0C\u56E0\u6B64\u5FC5\u987B\u4E25\u683C\u6EE1\u8DB3\u4E0B\u9762\u7684\u89C4\u683C\u3002

\u672C\u8BF4\u660E\u53EA\u7EA6\u5B9A\u300C\u4EA7\u7269\u5FC5\u987B\u6EE1\u8DB3\u54EA\u4E9B\u89C4\u5219\u3001\u683C\u5F0F\u3001\u73AF\u5883\u4E0E\u53C2\u8003\u300D\uFF0C\u4E0D\u89C4\u5B9A\u4E5F\u4E0D\u6697\u793A\u89C6\u89C9\u98CE\u683C\uFF1B\u98CE\u683C\u7531\u4F7F\u7528\u8005\u81EA\u884C\u6784\u601D\u3002

\u3010\u4E00\u3001\u4EA4\u4ED8\u7269\u4E0E\u76EE\u5F55\u7ED3\u6784\u3011
\u8F93\u51FA\u4E00\u4E2A\u81EA\u5305\u542B\u76EE\u5F55\uFF0C\u76EE\u5F55\u540D\u5C31\u662F\u6837\u5F0F id\uFF08\u5EFA\u8BAE\u5C0F\u5199\u5B57\u6BCD\u3001\u6570\u5B57\u3001\u77ED\u6A2A\u7EBF\uFF0C\u4F8B\u5982 aurora\uFF1B\u4E0D\u80FD\u4EE5 _ \u6216 . \u5F00\u5934\uFF0C\u4E0D\u8981\u7528\u7A7A\u683C\u4E0E\u4E2D\u6587\uFF09\uFF1A
  <\u6837\u5F0Fid>/
    skin.json    \u5FC5\u9700\uFF0C\u6E05\u5355\uFF08\u5143\u6570\u636E + \u80FD\u529B\u58F0\u660E + \u914D\u8272\u58F0\u660E\uFF09
    skin.js      \u5FC5\u9700\uFF0C\u5165\u53E3 ES module\uFF08\u6E05\u5355\u91CC\u7684 entry \u9ED8\u8BA4\u5C31\u662F skin.js\uFF09
    skin.css     \u5FC5\u9700\uFF0C\u6837\u5F0F\u8868\uFF08\u6E05\u5355\u91CC\u7684 styles \u5199\u5B83\uFF09
    assets/      \u53EF\u9009\uFF0C\u81EA\u5E26\u56FE\u6807\u4E0E\u8D34\u56FE\uFF08icon.file \u4E4B\u7C7B\u90FD\u76F8\u5BF9\u5305\u76EE\u5F55\u5F15\u7528\uFF09
    lib/         \u53EF\u9009\uFF0C\u81EA\u5E26\u7684\u79C1\u6709\u6A21\u5757\uFF08\u53EA\u5141\u8BB8\u5305\u5185\u76F8\u5BF9 import\uFF09
\u6E05\u5355\u793A\u4F8B\uFF08\u5B57\u6BB5\u6309\u9700\u589E\u51CF\uFF0CapiVersion \u5FC5\u987B\u5199 "3.0"\uFF09\uFF1A
{
  "id": "aurora",
  "name": "\u663E\u793A\u540D",
  "version": "1.0.0",
  "apiVersion": "3.0",
  "author": "\u2026",
  "description": "\u4E00\u53E5\u8BDD\u8BF4\u660E",
  "entry": "skin.js",
  "styles": ["skin.css"],
  "icon": { "file": "assets/icon.svg" },
  "order": 200,
  "capabilities": { "spectrum": true, "background": false, "interactive": true },
  "colors": { "bg": "#0b1020", "fg": "#f2f4ff", "accent": "#7aa2ff" },
  "performance": { "budgetFps": 45 }
}
\u89C4\u5219\uFF1A
1. colors \u5FC5\u586B\uFF0C\u4E8C\u9009\u4E00\uFF1A{"bg":\u2026,"fg":\u2026} \u6216 {"theme":true}\uFF08\u8DDF\u968F\u5BBF\u4E3B\u4E3B\u9898\uFF09\u3002\u5BBF\u4E3B\u7528\u5B83\u51B3\u5B9A**\u81EA\u5DF1\u7684\u63A7\u4EF6\u680F\u4E0E\u6D6E\u5C42**\u914D\u8272\u5E76\u505A\u5BF9\u6BD4\u5EA6\u515C\u5E95\uFF1Abg \u662F\u58F3\u7684\u5E95\u8272\uFF08\u53EA\u753B\u821E\u53F0\u7684\u6837\u5F0F\uFF0C\u5BBF\u4E3B\u4F1A\u628A\u6807\u9898\u680F/\u5E95\u680F/\u821E\u53F0\u5E95\u8272\u4E00\u5E76\u6362\u6210\u5B83\uFF09\uFF0Cfg \u662F\u58F3\u4E0A\u7684\u6587\u5B57\u8272\uFF0C\u53EF\u9009 accent \u662F\u58F3\u91CC"\u88AB\u5F3A\u8C03"\u7684\u5730\u65B9\uFF08\u5207\u6362\u6309\u94AE\u7684\u9009\u4E2D\u5757\u3001\u9009\u4E2D\u884C\u3001\u4E3B\u6309\u94AE\u4E0E\u5F00\u5173\u7C7B\u56FE\u6807\u7684\u5F3A\u8C03\u6001\uFF1B\u5E95\u680F\u7684\u64AD\u653E/\u6682\u505C\u4E0E\u8FDB\u5EA6\u3001\u97F3\u91CF\u586B\u5145\u8D70\u4E2D\u6027\u5B57\u8272\u3001\u4E0D\u5403\u5F3A\u8C03\u8272\uFF09\u7684\u4E13\u8272\uFF0C\u4E0D\u7ED9\u5C31\u7528 fg\u3002\u7F3A\u4E86\u4E0D\u62A5\u9519\uFF0C\u4F46\u8BBE\u7F6E\u9875\u4F1A\u5728\u4F60\u7684\u6837\u5F0F\u5361\u7247\u4E0A\u663E\u793A\u4E00\u4E2A\u8B66\u544A\u56FE\u6807\uFF0C\u4E14\u5BBF\u4E3B\u628A\u63A7\u4EF6\u680F\u6574\u5757\u964D\u7EA7\u6210\u4E3B\u9898\u914D\u8272\uFF08\u53EA\u58F0\u660E\u4E86\u4E00\u534A\u4E5F\u7B97 \u2014\u2014 \u4E0D\u4F1A"\u4E0A\u4E00\u534A"\uFF09\u3002
2. colors \u91CC\u80FD\u7528\u7EAF hex / rgb() / hsl() / oklch() / color-mix()\uFF1B\u4E0D\u8981\u653E var(--\u2026) \u8FD9\u79CD\u5BBF\u4E3B\u4EE4\u724C\uFF08\u5BBF\u4E3B\u65E0\u6CD5\u636E\u6B64\u7B97\u5BF9\u6BD4\u5EA6\uFF09\u3002
3. capabilities.spectrum = true \u8868\u793A"\u6211\u8981\u7528\u5B9E\u65F6\u9891\u8C31"\uFF08\u5199 true \u5373\u53EF\uFF0C\u6BB5\u6570\u56FA\u5B9A\u7531\u5BBF\u4E3B\u7ED9 128 \u6BB5\u5168\u8C31\uFF0C\u4F60\u8981\u51E0\u6839\u67F1\u5B50\u81EA\u5DF1\u5207\uFF09\uFF1B\u4E0D\u58F0\u660E\u5C31\u4E00\u6B21\u90FD\u6536\u4E0D\u5230\uFF08ctx.spectrum() \u8FD4\u56DE null\uFF0C\u4E14\u5BBF\u4E3B\u4E00\u6B21\u90FD\u4E0D\u91C7\u6837\uFF09\u3002\u6570\u636E\u662F**\u62C9\u53D6\u5F0F**\u7684\uFF1A\u771F\u7684\u8C03 ctx.spectrum() \u624D\u91C7\u6837\uFF0C\u4E0D\u8C03\u5C31\u96F6\u5F00\u9500\u3002capabilities.background = true \u8868\u793A\u4F60\u8981\u6574\u7A97\u80CC\u666F\u5C42\uFF08ctx.backgroundRoot\uFF09\uFF0C\u5BBF\u4E3B\u4F1A\u636E\u6B64\u628A\u6807\u9898\u680F/\u5E95\u680F/\u4FA7\u8FB9\u680F\u9000\u6210\u534A\u900F\u660E\u3002capabilities.interactive \u9ED8\u8BA4 true\uFF1Bfalse \u8868\u793A\u4F60\u53EF\u80FD\u88AB\u6302\u5230"\u53EA\u80FD\u770B"\u7684\u821E\u53F0\uFF08\u684C\u9762\u80CC\u666F\u6B4C\u8BCD\u7A97\u53E3\uFF09\u3002
4. entry \u4E0E styles \u5FC5\u987B\u662F\u672C\u76EE\u5F55\u5185\u7684\u76F8\u5BF9\u8DEF\u5F84\uFF0C\u4E0D\u80FD\u542B .. \u6216\u5199\u7EDD\u5BF9\u8DEF\u5F84\u3002
5. \u76EE\u5F55\u91CC\u53EF\u653E\u5B50\u76EE\u5F55\u4E0E\u9759\u6001\u8D44\u6E90\uFF08.js .mjs .css .json .png .jpg .jpeg .webp .gif .svg .woff .woff2\uFF09\uFF1B\u4EE5 _ \u6216 . \u5F00\u5934\u7684\u6587\u4EF6\u4E0E\u76EE\u5F55\u4E0D\u4F1A\u88AB\u63D0\u4F9B\uFF0C\u8BF7\u907F\u5F00\u3002
6. \u4E0D\u8981\u4F9D\u8D56\u6253\u5305\u5668\u3001npm \u5305\u3001CDN\u3001\u5916\u94FE\u5B57\u4F53\u6216\u56FE\u7247\uFF1B\u4EA7\u7269\u5FC5\u987B\u80FD\u76F4\u63A5\u653E\u8FDB\u76EE\u5F55\u5C31\u8FD0\u884C\u3002

\u3010\u4E8C\u3001\u8FD0\u884C\u73AF\u5883\u3011
1. \u539F\u751F ES module\uFF0C\u6D4F\u89C8\u5668\u76F4\u63A5 import\uFF0C\u6CA1\u6709\u6253\u5305\u4E0E\u8F6C\u8BD1\uFF1Askin.js \u5FC5\u987B export default \u4E00\u4E2A\u63D2\u4EF6\u5BF9\u8C61\uFF08\u5BBF\u4E3B\u4E5F\u63A5\u53D7\u540D\u4E3A skin \u7684\u5177\u540D\u5BFC\u51FA\uFF09\u3002**\u4E0D\u8981** import \u4EFB\u4F55\u5E94\u7528\u6A21\u5757\uFF08\u4E0D\u8BB8 import defineSkin \u4E4B\u7C7B\uFF0C\u4E5F\u4E0D\u8BB8 import store / utils / @localmusicplayer/player-skins\uFF09\uFF1B\u516C\u5171\u96F6\u4EF6\u4ECE ctx.sdk \u62FF\uFF08\u89C1\u3010\u4E09\u3011\uFF09\u3002
2. \u9875\u9762 CSP\uFF1Ascript-src 'self'\uFF1Bstyle-src 'self' 'unsafe-inline'\uFF1Bimg-src 'self' data: blob: file:\uFF1Bmedia-src 'self' blob: file:\u3002\u56E0\u6B64\uFF1A
   \xB7 \u4E0D\u80FD\u52A0\u8F7D\u4EFB\u4F55\u5916\u90E8\u8D44\u6E90\uFF08\u8FDC\u7A0B JS / CSS / \u5B57\u4F53 / \u56FE\u7247 / \u63A5\u53E3\u8BF7\u6C42\u90FD\u4F1A\u88AB\u62E6\u622A\uFF09\uFF1B
   \xB7 \u4E0D\u80FD import CSS\uFF08\u6D4F\u89C8\u5668\u539F\u751F\u4E0D\u652F\u6301\uFF09\uFF0Cskin.css \u7531\u5BBF\u4E3B\u6309\u6E05\u5355\u63D2\u5165\uFF1B
   \xB7 \u53EF\u4EE5\u76F8\u5BF9\u8DEF\u5F84 import **\u672C\u5305\u5185**\u7684 .js\uFF08lib/ \u4E0B\u7684\u79C1\u6709\u6A21\u5757\uFF09\uFF0C\u56FE\u7247\u4E0E\u5B57\u4F53\u4E5F\u7528\u76F8\u5BF9\u8DEF\u5F84\u5F15\u7528\u3002
3. \u5185\u6838\u662F\u73B0\u4EE3 Chromium\uFF08WebView2\uFF09\uFF1A@layer / @scope / color-mix() / oklch() / :has() / CSS \u5D4C\u5957\u90FD\u53EF\u7528\u3002
4. \u63D2\u4EF6\u53EA\u5728\u300C\u64AD\u653E\u8BE6\u60C5\u9875\u300D\u7684\u821E\u53F0\u91CC\u751F\u6548\uFF1A\u5BBF\u4E3B\u628A\u6E05\u5355\u91CC\u7684 CSS \u5305\u6210
     @layer skin { @scope (.playerview[data-skin="<\u6837\u5F0Fid>"], .skin-bg[data-skin="<\u6837\u5F0Fid>"]) { \u2026\u4F60\u7684 CSS\u2026 } }
   \u6240\u4EE5**\u4F60\u7684\u9009\u62E9\u5668\u662F\u76F8\u5BF9\u821E\u53F0\u6839\u5199\u7684**\uFF08\u89C1\u3010\u56DB\u3011\uFF09\uFF1Bctx.root \u5C31\u662F\u90A3\u4E2A\u821E\u53F0\uFF0C\u6574\u7A97\u80CC\u666F\u5C42\u5BB9\u5668\u662F ctx.backgroundRoot\u3002
5. \u6DF1\u6D45\u8272\u4E3B\u9898\u3001\u5F3A\u8C03\u8272\u3001\u6BDB\u73BB\u7483\u5F3A\u5EA6\u7B49\u7531\u5E94\u7528\u7684\u4E3B\u9898\u4EE4\u724C\u51B3\u5B9A\uFF0C\u63D2\u4EF6\u5E94\u8DDF\u968F\uFF0C\u4E0D\u8981\u5199\u6B7B\u3002

\u3010\u4E09\u3001\u63A5\u53E3\u5951\u7EA6\uFF08\u5FC5\u987B\u4E25\u683C\u9075\u5B88\uFF09\u3011
export default {
  id: "<\u6837\u5F0Fid>",               // \u53EF\u9009\uFF1B\u5199\u4E86\u5C31\u5FC5\u987B\u4E0E\u6E05\u5355 id \u4E00\u81F4
  mount(ctx) {},                // \u5FC5\u9700\uFF0C\u51FD\u6570
  update(ctx, patch) {},        // \u53EF\u9009
  destroy(ctx) {}               // \u53EF\u9009
};
1. \u5143\u6570\u636E\uFF08name / version / order / icon / colors / capabilities\uFF09\u5168\u90E8\u5199\u5728 skin.json \u91CC\uFF0C\u4E0D\u8981\u5728 skin.js \u91CC\u91CD\u590D\u5199\uFF1B\u5199\u5728\u6A21\u5757\u91CC\u4E14\u4E0E\u6E05\u5355\u51B2\u7A81\u4F1A\u76F4\u63A5\u52A0\u8F7D\u5931\u8D25\uFF08id\u3001apiVersion \u4E24\u5904\u4E0D\u4E00\u81F4\u5C31\u62A5\u9519\uFF09\u3002
2. \u7F3A mount\uFF08\u6216 mount \u4E0D\u662F\u51FD\u6570\uFF09\u4F1A\u5BFC\u81F4\u52A0\u8F7D\u5931\u8D25\uFF0C\u63A7\u5236\u53F0\u4F1A\u7ED9\u51FA\u539F\u56E0\u3002

ctx \u662F\u63D2\u4EF6\u552F\u4E00\u7684\u5165\u53E3\uFF08\u53EA\u8BFB\uFF0C\u76F4\u63A5\u6539\u5B83\u4E0D\u4F1A\u751F\u6548\uFF09\uFF1A
- ctx.root            \u6302\u8F7D\u70B9\uFF08\u5BBF\u4E3B\u5DF2\u6E05\u7A7A\uFF0C\u5F80\u8FD9\u91CC\u5199 DOM\uFF09
- ctx.backgroundRoot  \u6574\u7A97\u80CC\u666F\u5C42\u5BB9\u5668\uFF08\u6E05\u5355\u58F0\u660E capabilities.background \u624D\u6709\u5185\u5BB9\uFF09
- ctx.track()         \u8FD4\u56DE { id, title, artist, album, duration, kind }
                      \xB7 kind \u662F "local" | "online"\uFF08\u53EA\u6807\u8BB0\u6765\u6E90\uFF0C\u4E0D\u66B4\u9732 URL\uFF09
- ctx.media()         \u8FD4\u56DE { song, cover, covers, coverIndex, lyrics }\uFF08\u805A\u5408\u5FEB\u7167\uFF09
                      \xB7 song\uFF1A\u5F53\u524D\u66F2\u76EE\uFF08\u53EF\u80FD\u4E3A null\uFF09\uFF0C\u5373 track() \u90A3\u4E00\u4EFD
                      \xB7 cover\uFF1A\u5F53\u524D\u5C01\u9762\uFF08data URL \u6216\u540C\u6E90 URL\uFF09\uFF1Bcovers\uFF1A\u5168\u90E8\u5C01\u9762\uFF08\u81F3\u5C11\u4E00\u5F20\uFF09\uFF1BcoverIndex\uFF1A\u8F6E\u64AD\u4E0B\u6807
                      \xB7 lyrics\uFF1A{ lines: [{ time, text, trans?, words? }], text, source, index, status, statusText }
                        \uFF08trans = \u540C\u4E00\u65F6\u95F4\u6233\u4E0A\u7684\u5176\u5B83\u8BED\u8A00\u884C\uFF1A\u591A\u8BED\u8A00\u6B4C\u8BCD\u5728\u89E3\u6790\u65F6\u5DF2\u6298\u53E0\u6210\u4E00\u884C\uFF0C
                         \u7B2C\u4E00\u884C\u662F text\u3001\u5176\u4F59\u8FDB trans \u2014\u2014 \u8981\u4E48\u4E00\u8D77\u753B\uFF0C\u8981\u4E48\u7528 sdk.lyricDisplayText \u62FC\u6210\u4E00\u884C\uFF1B
                         words = \u5B57\u7EA7\uFF08\u9010\u5B57\uFF09\u65F6\u95F4\u8F74\uFF0C\u6BCF\u4E2A**\u5B57\u7D20**\u4E00\u4E2A\u8D77\u59CB\u6BEB\u79D2\uFF0C\u4E0E sdk.splitGraphemes(text)
                         \u4E00\u4E00\u5BF9\u5E94 \u2014\u2014 \u884C\u7EA7\u6B4C\u8BCD\u6CA1\u6709\u8FD9\u4E2A\u952E\uFF09
- ctx.lyrics()        \u540C\u4E0A\u6B4C\u8BCD\u90A3\u4E00\u4EFD\uFF1Bctx.covers() \u540C\u4E0A\u5C01\u9762\u90A3\u4E00\u4EFD
- ctx.playback()      \u8FD4\u56DE { position, duration, playing, volume, muted }\uFF0C\u65F6\u95F4\u5355\u4F4D\u6BEB\u79D2
- ctx.options()       \u8FD4\u56DE { showLyrics, lyricsFontSize, animations, coverCarousel, coverCarouselInterval, interactive, performanceMode }
- ctx.env()           \u8FD4\u56DE { themeId, mode, width, height, dpr, reducedMotion, foreground }
- ctx.spectrum()      \u5B9E\u65F6\u9891\u8C31\uFF08**\u62C9\u53D6\u5F0F**\uFF09\uFF1A\u8FD4\u56DE { bands: Float32Array(128 \u6BB5\u5BF9\u6570\u5168\u8C31, 0..1), at: \u91C7\u6837\u65F6\u523B } \u6216 null\uFF1B
                      \u8C03\u7528\u672C\u8EAB\u5C31\u662F\u91C7\u6837\u95E8\u63A7\uFF08\u4E0D\u8C03\u5C31\u4E0D\u91C7\uFF0C\u8282\u6D41 ~30Hz\uFF09\uFF1Bnull = \u6CA1\u5728\u64AD\u653E / \u521A\u5F00\u64AD / \u6CA1\u58F0\u660E capabilities.spectrum
- ctx.sdk             \u590D\u7528\u96F6\u4EF6\uFF1AcreateLyricsView / createFxLyrics / createCamera / createBackgroundLayer / applyFit / fitScale / marqueeText / parseLrc / splitGraphemes / findLyricIndex / formatLrcTime / lyricDisplayText / html / util
- ctx.actions         \u53D7\u63A7\u52A8\u4F5C\uFF1Aseek(ms) / seekBy(ms) / seekRatio(0~1) / togglePlay / next / prev / toggleLike / like / unlike / openFolder / openCoverPanel / openLyricsPanel / reportBackdrop({bg,fg})
- ctx.on(type, fn)    \u8BA2\u9605\u5BBF\u4E3B\u63A8\u9001\uFF0C\u8FD4\u56DE\u53D6\u6D88\u8BA2\u9605\u7684\u51FD\u6570
- ctx.defaultCover    \u5C01\u9762\u515C\u5E95\u56FE\uFF08\u5185\u8054 SVG data URL\uFF09\uFF0C\u5C01\u9762\u52A0\u8F7D\u5931\u8D25\u65F6\u7528\u5B83
- ctx.themeId / ctx.mode\uFF08getter\uFF09

\u5BBF\u4E3B\u63A8\u9001\uFF1Aupdate(ctx, patch) \u4E0E ctx.on() \u6536\u5230\u540C\u4E00\u4EFD patch\uFF0Cpatch.type \u53D6\u503C\uFF1A
mount\uFF08\u6302\u8F7D\u540E\u7ACB\u5373\u4E00\u6B21\uFF0C\u5E26\u5168\u91CF\u5FEB\u7167\uFF09/ song\uFF08\u6362\u6B4C\uFF09/ media\uFF08\u5C01\u9762\u53D8\u5316\u6216\u8F6E\u64AD\u5207\u56FE\uFF09/ lyrics\uFF08\u6B4C\u8BCD\u88C5\u8F7D\u5B8C\u6210\u6216\u5339\u914D\u72B6\u6001\u53D8\u5316\uFF09/ progress\uFF08\u64AD\u653E\u8FDB\u5EA6\uFF0C\u7EA6 4Hz \u2014\u2014 \u4F4D\u7F6E\u6309 250ms \u4E00\u6863\u91CF\u5316\uFF0C\u63D2\u4EF6\u8981\u81EA\u5DF1\u5728\u5E27\u5FAA\u73AF\u91CC\u63D2\u503C\uFF09/ state\uFF08\u64AD\u653E\u3001\u6682\u505C\u3001\u97F3\u91CF\uFF09/ options / theme / resize / visibility\uFF08\u8BE6\u60C5\u9875\u5F00\u5173\uFF0C\u636E\u6B64\u505C\u5E27\uFF09/ close / destroy\u3002
\u6CA1\u6709 spectrum \u8865\u4E01\uFF1A\u5B9E\u65F6\u9891\u8C31\u662F**\u62C9\u53D6\u5F0F**\uFF08ctx.spectrum()\uFF0C\u89C1\u4E0A\uFF09\uFF0C\u63A8\u7684\u90A3\u5957\u5DF2\u5220\u9664\u3002
patch \u53EA\u5E26\u4E0E\u8BE5\u7C7B\u578B\u76F8\u5173\u7684\u5B57\u6BB5\uFF1B\u4E0D\u786E\u5B9A\u65F6\u7528 ctx.track() / ctx.lyrics() / ctx.playback() \u73B0\u53D6\u5FEB\u7167\uFF08\u63A8\u9001\u4E4B\u540E\u5FEB\u7167\u4E0E\u8F7D\u8377\u4E00\u5B9A\u4E00\u81F4\uFF09\u3002

\u3010\u56DB\u3001CSS \u7EA6\u5B9A\u3011
1. \u9009\u62E9\u5668**\u76F8\u5BF9\u821E\u53F0\u6839**\u5199\uFF0C\u4E0D\u8981\u81EA\u5DF1\u518D\u52A0 .playerview[data-skin="<\u6837\u5F0Fid>"] \u524D\u7F00\uFF08\u5BBF\u4E3B\u5DF2\u7ECF\u5305\u4E86 @scope\uFF0C\u52A0\u4E86\u53CD\u800C\u53EF\u80FD\u5339\u914D\u4E0D\u5230\uFF09\uFF1A
   \xB7 \u821E\u53F0\u91CC\u9762\u7684\u5143\u7D20 \u2192 \u76F4\u63A5\u5199\uFF1A.demo { \u2026 }\u3001.playerview__stage { \u2026 }
   \xB7 \u821E\u53F0**\u81EA\u8EAB**   \u2192 \u7528 :scope { \u2026 }
2. \u4E0D\u8981\u5199 :root / html / body / * \u7EA7\u522B\u6216\u88F8\u6807\u7B7E\u9009\u62E9\u5668\uFF0C\u4E0D\u8981\u7528 !important \u53BB\u8986\u76D6\u522B\u4EBA\u7684\u89C4\u5219\u3002
3. \u4F60\u7684 CSS \u5728 @layer skin \u91CC\uFF0C**\u538B\u4E0D\u8FC7**\u5BBF\u4E3B\u58F3\u7684\u89C4\u5219\uFF1B\u4E5F**\u78B0\u4E0D\u5230**\u5BBF\u4E3B UI\uFF08\u6807\u9898\u680F\u3001\u5E95\u680F\u3001\u4FA7\u8FB9\u680F\u3001\u64AD\u653E\u961F\u5217\u7B49\u90FD\u4E0D\u5728\u4F5C\u7528\u57DF\u5185\uFF09\u3002\u60F3\u5F71\u54CD\u5BBF\u4E3B\u63A7\u4EF6\u7684\u89C2\u611F\u53EA\u6709\u4E00\u6761\u8DEF\uFF1A\u5728\u6E05\u5355 colors \u91CC\u58F0\u660E\u914D\u8272\uFF08\u5BBF\u4E3B\u4F1A\u4FDD\u8BC1\u5BF9\u6BD4\u5EA6\uFF09\u3002
4. \u53EF\u4EE5\u76F4\u63A5\u4F7F\u7528\u4E3B\u9898\u4EE4\u724C\uFF0C\u6DF1\u6D45\u8272\u4F1A\u81EA\u52A8\u8DDF\u968F\uFF1A
   --accent / --accent-weak / --accent-text / --accent-contrast / --text-1 / --text-2 / --text-3 / --text-inverse / --surface-1 / --surface-2 / --surface-3 / --surface-hover / --surface-active / --glass-bg / --glass-bg-strong / --glass-blur / --glass-saturate / --glass-border / --border-1 / --border-2 / --divider / --r-sm / --r-md / --r-lg / --r-xl / --dur / --ease / --lyric-size
   \uFF08\u5176\u4E2D --lyric-size \u662F**\u7528\u6237\u8BBE\u7F6E**\u300C\u6B4C\u8BCD\u5B57\u53F7\u300D\uFF1A\u5BBF\u4E3B\u5199\u5728 :root \u4E0A\uFF0C\u6B4C\u8BCD\u96F6\u4EF6\u5DF2\u7ECF
    \u8BFB\u5B83\u3002\u6837\u5F0F\u5305\u60F3\u6539\u5B57\u53F7\u5C31\u5728\u81EA\u5DF1\u7684\u4F5C\u7528\u57DF\u91CC\u8986\u76D6\u5B83\uFF1B\u4F46**\u4E0D\u8981**\u4E3A\u4E86"\u56FA\u5B9A\u4E00\u4E2A\u597D\u770B\u7684
    \u5B57\u53F7"\u800C\u65E0\u6761\u4EF6\u5199\u6B7B \u2014\u2014 \u90A3\u7B49\u4E8E\u66FF\u7528\u6237\u5173\u6389\u4E86\u8FD9\u4E2A\u8BBE\u7F6E\u3002\u76F8\u5173\u65CB\u94AE\u8FD8\u6709
    --lyric-size-active\uFF08\u5F53\u524D\u884C\u5B57\u53F7\uFF09\u4E0E --lyric-dim\uFF08\u975E\u5F53\u524D\u884C\u538B\u6697\u7A0B\u5EA6\uFF09\uFF0C
    \u90FD\u6309\u4F7F\u7528\u70B9\u515C\u5E95\u8BFB\u53D6\uFF0C\u5199\u5728 :scope \u4E0A\u5373\u53EF\u751F\u6548\u3002\uFF09
5. \u4E0D\u8981\u6539\u5E03\u5C40\u4EE4\u724C\uFF08--h-titlebar / --w-sidebar / --h-playerbar / --h-header / --row-h / --row-h-compact\uFF09\uFF0C\u6539\u4E86\u4F1A\u7834\u574F\u56FA\u5B9A\u5E03\u5C40\u3002
6. \u9700\u8981\u79C1\u6709\u53D8\u91CF\u65F6\u5B9A\u4E49\u5728\u81EA\u5DF1\u7684\u4F5C\u7528\u57DF\u91CC\uFF08:scope { --my-\u2026: \u2026 }\uFF09\uFF0C\u4E0D\u8981\u5199\u5230 :root\u3002

\u3010\u4E94\u3001\u884C\u4E3A\u7EA6\u675F\u3011
1. \u4E0D\u8981 import \u5E94\u7528\u5185\u90E8\u6A21\u5757\uFF08store / bridge / utils / playerhost / @localmusicplayer/player-skins \u7B49\uFF09\uFF1B\u6570\u636E\u53EA\u4ECE ctx \u62FF\uFF0C\u52A8\u4F5C\u53EA\u8D70 ctx.actions\uFF1B\u4E0D\u8981\u76F4\u63A5\u64CD\u4F5C\u97F3\u9891\u5143\u7D20\u6216\u5E94\u7528\u72B6\u6001\u3002
2. \u4E0D\u8981\u8F6E\u8BE2\uFF1A\u7981\u6B62\u7528 setInterval \u6216\u5B9A\u65F6 setTimeout \u53CD\u590D\u62C9\u6570\u636E\uFF08\u52A8\u753B\u3001\u9632\u6296\u3001\u4E00\u6B21\u6027\u5EF6\u65F6\u9664\u5916\uFF09\u3002
3. \u6B4C\u8BCD\u9AD8\u4EAE\u4F18\u5148\u7528 ctx.sdk.createLyricsView\uFF08\u6216 ctx.lyrics().index \u4E0E lines\uFF09\uFF0C\u4E0D\u8981\u81EA\u5DF1\u89E3\u6790 LRC \u6587\u672C\u3002
   \u884C\u4E0A\u5E26 words \u5C31\u662F\u5B57\u7EA7\uFF08\u9010\u5B57\uFF09\u6B4C\u8BCD\uFF0C\u4E0A\u9762\u4E24\u4E2A\u6E32\u67D3\u96F6\u4EF6\u4F1A\u81EA\u5DF1\u6309\u5B57\u70B9\u4EAE\uFF1B\u518D\u628A
   setPosition(pos, { playing })\uFF08\u6216 setPlaying(playing)\uFF09\u4E5F\u5582\u4E0A\uFF0C\u9010\u5B57\u9AD8\u4EAE\u624D\u4F1A\u5728\u4E24\u6B21
   250ms \u8FDB\u5EA6\u63A8\u9001\u4E4B\u95F4\u5E73\u6ED1\u63A8\u8FDB\uFF0C\u5426\u5219\u662F 4Hz \u7684\u9636\u68AF\u503C\u3002
4. \u52A8\u6548\u8981\u5C0A\u91CD ctx.options().animations\uFF08false \u65F6\u4E0D\u8981\u505A\u4F4D\u79FB\u52A8\u6548\uFF09\u4E0E\u65F6\u957F\u4E0E\u7F13\u52A8\u4EE4\u724C\uFF1B\u8981\u505C\u6389\u5E27\u5FAA\u73AF\u5C31\u8BA4 patch.type === "close"\uFF08\u7D27\u63A5\u7740\u4E00\u5B9A\u4F1A\u6765\u4E00\u6B21 destroy\uFF09\uFF0C\u4E0D\u8981\u53BB\u7B49"visibility"\u8FD9\u7C7B\u5BBF\u4E3B\u6839\u672C\u4E0D\u63A8\u7684\u8865\u4E01 \u2014\u2014 \u5B8C\u6574\u7684\u7C7B\u578B\u6E05\u5355\u89C1 contract.js \u7684 PATCH_TYPES\u3002
5. destroy(ctx) \u91CC\u6E05\u6389\u5B9A\u65F6\u5668\u3001\u4E8B\u4EF6\u76D1\u542C\u3001ResizeObserver \u4E0E\u5927\u5BF9\u8C61\u5F15\u7528\uFF1B\u5207\u6362\u63D2\u4EF6\u4F1A\u5148 destroy \u518D mount\uFF0C\u4E24\u4E2A\u65B9\u6CD5\u90FD\u53EF\u80FD\u88AB\u591A\u6B21\u8C03\u7528\u3002
6. \u4E0D\u8981\u5F80 window / document \u4E0A\u6302\u5168\u5C40\u53D8\u91CF\u6216\u6837\u5F0F\uFF0C\u4E0D\u8981\u6539 document.documentElement \u4E0A\u7684 data-* \u5C5E\u6027\u3002
7. \u4E0D\u8981\u53D1\u7F51\u7EDC\u8BF7\u6C42\uFF08CSP \u4E5F\u4F1A\u62E6\uFF09\uFF0C\u4E0D\u8981\u7528 eval / new Function\u3002
8. \u7528\u5230\u5B9E\u65F6\u9891\u8C31\u5C31\u5FC5\u987B\u5728\u6E05\u5355 capabilities.spectrum \u91CC\u58F0\u660E true\uFF1B\u6CA1\u58F0\u660E\u5C31\u522B\u8C03 ctx.spectrum()\uFF08\u8FD4\u56DE null \u5E76\u5728\u63A7\u5236\u53F0\u63D0\u9192\u4E00\u6B21\uFF09\u3002\u9891\u8C31\u662F\u62C9\u53D6\u5F0F\u7684\uFF1A\u5728\u4F60\u81EA\u5DF1\u7684\u5E27\u5FAA\u73AF/\u66F4\u65B0\u91CC\u73B0\u53D6\u5373\u53EF\uFF0C\u4E0D\u8981\u6307\u671B\u5BBF\u4E3B\u63A8\u7ED9\u4F60\u3002
9. \u81EA\u7ED8\u5C01\u9762\u53D6\u8272\u7C7B\u6548\u679C\u7B97\u51FA\u7684\u914D\u8272\uFF0C\u7528 ctx.actions.reportBackdrop({bg, fg}) \u56DE\u62A5\u7ED9\u5BBF\u4E3B\uFF08\u5BBF\u4E3B\u636E\u6B64\u91CD\u7B97\u63A7\u4EF6\u680F\u914D\u8272\uFF09\uFF0C\u4E0D\u8981\u81EA\u5DF1\u53BB\u6539\u5BBF\u4E3B DOM\u3002

\u3010\u516D\u3001\u4EA4\u4ED8\u524D\u81EA\u68C0\u6E05\u5355\u3011
1. \u76EE\u5F55\u540D = skin.json \u7684 id = skin.js \u91CC\u7684 id\uFF08\u82E5\u5199\u4E86\uFF09\uFF1B
2. skin.json \u6709 apiVersion "3.0"\uFF0C\u6709 entry/styles\uFF0C\u4E14 colors \u662F bg/fg \u6216 theme:true \u4E8C\u9009\u4E00\uFF1B
3. skin.js \u662F export default \u63D2\u4EF6\u5BF9\u8C61\uFF0C\u96F6\u88F8\u5305\u540D import\uFF0C\u6709 mount\uFF1B
4. CSS \u9009\u62E9\u5668\u662F\u76F8\u5BF9\u821E\u53F0\u6839\u5199\u7684\uFF08\u821E\u53F0\u81EA\u8EAB\u7528 :scope\uFF09\uFF0C\u6CA1\u6709\u52A0 .playerview[data-skin=\u2026] \u524D\u7F00\uFF1B
5. \u6CA1\u6709 fetch\u3001\u6CA1\u6709 setInterval \u8F6E\u8BE2\u3001\u6CA1\u6709\u5168\u5C40\u9009\u62E9\u5668\u3001\u6CA1\u6709 !important\u3001\u6CA1\u6709\u78B0\u5BBF\u4E3B UI \u7684\u9009\u62E9\u5668\uFF1B
6. \u6362\u6B4C\u3001\u6B4C\u8BCD\u88C5\u8F7D\u3001\u8FDB\u5EA6\u66F4\u65B0\u3001\u6DF1\u6D45\u8272\u5207\u6362\u3001\u7A97\u53E3\u7F29\u653E\u3001\u5207\u8D70\u518D\u5207\u56DE\u90FD\u4E0D\u4F1A\u62A5\u9519\uFF0C\u4E5F\u4E0D\u7559\u6B8B\u4F59\u8282\u70B9\u6216\u76D1\u542C\uFF1B
7. \u58F0\u660E\u4E86 spectrum \u624D\u8C03 ctx.spectrum()\uFF08\u62C9\u53D6\u5F0F\uFF0C\u4E0D\u8C03\u4E0D\u91C7\u6837\uFF09\uFF1B\u7528\u4E86\u80CC\u666F\u5C42\u624D\u58F0\u660E background\u3002

\u3010\u4E03\u3001\u53C2\u8003\u8D44\u6599\u3011
${hk(e)}

\u3010\u516B\u3001\u8F93\u51FA\u683C\u5F0F\u3011
1. \u5148\u5199\u6E05\u76EE\u5F55\u540D\u4E0E\u6587\u4EF6\u6E05\u5355\uFF1B
2. \u518D\u9010\u4E2A\u6587\u4EF6\u8F93\u51FA\u5B8C\u6574\u4EE3\u7801\uFF0C\u6BCF\u4E2A\u6587\u4EF6\u5355\u72EC\u4E00\u4E2A\u4EE3\u7801\u5757\uFF0C\u5E76\u5728\u4EE3\u7801\u5757\u7B2C\u4E00\u884C\u7528\u6CE8\u91CA\u6807\u660E\u6587\u4EF6\u540D\uFF1B
3. \u4E0D\u8981\u7701\u7565\u3001\u4E0D\u8981\u7528\u7701\u7565\u53F7\u5360\u4F4D\u3001\u4E0D\u8981\u7559 __SKIN_ID__ \u4E4B\u7C7B\u7684\u5360\u4F4D\u7B26\uFF0C\u4EE3\u7801\u8981\u80FD\u76F4\u63A5\u8FD0\u884C\u3002

\u3010\u4E5D\u3001\u98CE\u683C\u3011
\u672C\u63D0\u793A\u8BCD\u53EA\u7EA6\u5B9A\u4EA7\u7269\u5FC5\u987B\u6EE1\u8DB3\u7684\u89C4\u5219\u3001\u683C\u5F0F\u3001\u73AF\u5883\u4E0E\u53C2\u8003\uFF0C\u4E0D\u89C4\u5B9A\u4E5F\u4E0D\u6697\u793A\u89C6\u89C9\u98CE\u683C\uFF1B\u5177\u4F53\u6837\u5F0F\uFF08\u5E03\u5C40\u3001\u914D\u8272\u3001\u52A8\u6548\u3001\u6C14\u8D28\uFF09\u7531\u4F7F\u7528\u8005\u81EA\u884C\u6784\u601D\u3002
\u8BF7\u4EE5\u4F7F\u7528\u8005\u968F\u9644\u7684\u98CE\u683C\u8BF4\u660E\u4E3A\u51C6\uFF1B\u82E5\u4F7F\u7528\u8005\u6CA1\u6709\u7ED9\u51FA\uFF0C\u5148\u5411\u4F7F\u7528\u8005\u786E\u8BA4\uFF0C\u4E0D\u8981\u81EA\u884C\u5047\u8BBE\u3002

\u3010\u98CE\u683C\u8981\u6C42 \xB7 \u7531\u4F7F\u7528\u8005\u81EA\u884C\u586B\u5199\uFF08\u672C\u884C\u53EA\u662F\u5360\u4F4D\uFF0C\u672C\u63D0\u793A\u8BCD\u4E0D\u63D0\u4F9B\u4EFB\u4F55\u98CE\u683C\u5EFA\u8BAE\uFF09\u3011
`}function gk(e=null){return`\u8BF7\u4E3A\u300C\u672C\u5730\u97F3\u4E50\u64AD\u653E\u5668\u300D\uFF08Go + WebView2 \u7684 Windows \u684C\u9762\u5E94\u7528\uFF09\u4EA7\u51FA\u4E00\u4E2A\u300C\u5916\u89C2\u4E3B\u9898\u300DCSS \u6587\u4EF6\u3002

\u672C\u8BF4\u660E\u53EA\u7EA6\u5B9A\u300C\u4EA7\u7269\u5FC5\u987B\u6EE1\u8DB3\u54EA\u4E9B\u89C4\u5219\u3001\u683C\u5F0F\u3001\u73AF\u5883\u4E0E\u53C2\u8003\u300D\uFF0C\u4E0D\u89C4\u5B9A\u4E5F\u4E0D\u6697\u793A\u914D\u8272\u4E0E\u6C14\u8D28\uFF1B\u4E3B\u9898\u98CE\u683C\u7531\u4F7F\u7528\u8005\u81EA\u884C\u6784\u601D\u3002

\u3010\u4E00\u3001\u4EA4\u4ED8\u7269\u4E0E\u683C\u5F0F\u3011
1. \u53EA\u4EA4\u4ED8 1 \u4E2A .css \u6587\u4EF6\uFF08\u4E0D\u8981 HTML / JS / JSON\uFF0C\u4E0D\u8981\u6253\u5305\uFF0C\u4E0D\u8981 @import \u5916\u90E8\u8D44\u6E90\uFF09\u3002
2. \u6587\u4EF6\u540D\u5C31\u662F\u4E3B\u9898 id\uFF0C\u5EFA\u8BAE\u5C0F\u5199\u5B57\u6BCD\u3001\u6570\u5B57\u3001\u77ED\u6A2A\u7EBF\uFF08\u4F8B\u5982 sunset\uFF09\uFF1B\u4E0D\u80FD\u4EE5 _ \u6216 . \u5F00\u5934\uFF08\u4F1A\u88AB\u5F53\u6A21\u677F / \u9690\u85CF\u6587\u4EF6\u8DF3\u8FC7\uFF09\uFF0C\u4E0D\u8981\u7528\u7A7A\u683C\u4E0E\u4E2D\u6587\u3002
3. \u6587\u4EF6\u91CC\u53EA\u6709\u4E00\u6761\u89C4\u5219\uFF0C\u9009\u62E9\u5668\u56FA\u5B9A\u4E3A :root[data-theme="<\u4E3B\u9898id>"]\uFF0C\u4E0E\u6587\u4EF6\u540D\u4E00\u81F4\u6700\u7701\u4E8B\uFF1A

:root[data-theme="sunset"] {
  color-scheme: dark;
  /* \u53EA\u58F0\u660E\u4F60\u60F3\u8986\u76D6\u7684\u4EE4\u724C\uFF0C\u672A\u58F0\u660E\u7684\u4F1A\u81EA\u52A8\u56DE\u9000\u5230\u9ED8\u8BA4\u4E3B\u9898 */
}

4. \u6587\u4EF6\u5934\u53EF\u4EE5\u5199\u4E09\u884C\u53EF\u9009\u6307\u4EE4\uFF08\u5EFA\u8BAE\u5199\uFF09\uFF0C\u4F9B\u5E94\u7528\u8BFB\u53D6\u4E3B\u9898\u540D / \u6DF1\u6D45\u6A21\u5F0F / \u8272\u677F\u7F29\u7565\u56FE\uFF1A

/* @theme-name \u843D\u65E5\u6A58
   @theme-mode dark
   @theme-swatch #1a1020 #ff8a3d #ffd166 #fff4e6 #ff5a5f */

   \xB7 @theme-name \u540E\u8DDF\u663E\u793A\u540D\uFF0C\u53EF\u7528\u4E2D\u6587\uFF1B
   \xB7 @theme-mode \u53EA\u80FD\u662F dark \u6216 light\uFF1B
   \xB7 @theme-swatch \u540E\u8DDF\u82E5\u5E72\uFF08\u5EFA\u8BAE 5 \u4E2A\uFF09\u4EE3\u8868\u8272\uFF0C\u7B2C\u4E00\u4E2A\u5F53\u5E95\u8272\u3001\u6700\u540E\u4E00\u4E2A\u5F53\u5F3A\u8C03\u8272\uFF1B
   \xB7 \u4E0D\u5199\u4E5F\u80FD\u7528\uFF1A\u540D\u79F0\u53D6\u6587\u4EF6\u540D\uFF0C\u6A21\u5F0F\u6309\u6587\u4EF6\u540D\u91CC\u7684 dark / light \u6216 \u6DF1\u8272 / \u6D45\u8272 \u731C\uFF08\u731C\u4E0D\u5230\u6309 dark\uFF09\uFF0C\u8272\u677F\u4ECE\u6587\u4EF6\u91CC\u7684\u989C\u8272\u5B57\u9762\u91CF\u53D6\u524D 5 \u4E2A\u3002

\u3010\u4E8C\u3001\u52A0\u8F7D\u4E0E\u6821\u9A8C\u73AF\u5883\uFF08\u51B3\u5B9A\u54EA\u4E9B\u5199\u6CD5\u4F1A\u88AB\u62D2\u7EDD\uFF09\u3011
1. \u5E94\u7528\u626B\u63CF\u4E3B\u9898\u76EE\u5F55\u4E0B\u7684 *.css\uFF0C\u53EA\u626B\u4E00\u5C42\uFF0C\u4E0D\u652F\u6301\u5B50\u76EE\u5F55\u3002
2. \u6587\u4EF6\u540D\u4EE5 _ \u6216 . \u5F00\u5934\u7684\u4F1A\u8DF3\u8FC7\uFF08_template.css \u8FD9\u7C7B\u6A21\u677F\u4E0D\u53C2\u4E0E\uFF09\u3002
3. \u6587\u4EF6\u91CC\u5FC5\u987B\u80FD\u5339\u914D\u5230 :root[data-theme="\u2026"]\uFF0C\u5426\u5219\u5BFC\u5165\u65F6\u4F1A\u88AB\u5224\u4E3A\u300C\u4E0D\u50CF\u4E3B\u9898\u300D\u5E76\u8DF3\u8FC7\u3002
4. \u4E3B\u9898 id \u53D6\u81EA\u8FD9\u4E2A\u9009\u62E9\u5668\u91CC\u7684\u503C\uFF1B\u540C id \u4F1A\u4E92\u76F8\u8986\u76D6\uFF0C\u6240\u4EE5\u8BF7\u4FDD\u8BC1 id \u552F\u4E00\u3002
5. \u4E3B\u9898 CSS \u88AB\u5F53\u4F5C\u666E\u901A\u6837\u5F0F\u8868\u6CE8\u5165\u9875\u9762\uFF1B\u9009\u4E2D\u8BE5\u4E3B\u9898\u65F6\uFF0C\u6587\u6863\u6839\u5143\u7D20\u4E0A\u4F1A\u6709 data-theme="<\u4E3B\u9898id>" \u4E0E data-mode="dark|light"\u3002
6. \u9875\u9762 CSP \u662F style-src 'self' 'unsafe-inline'\uFF1A\u4E0D\u80FD @import \u8FDC\u7A0B CSS\uFF0C\u4E0D\u80FD url() \u5916\u94FE\u7F51\u7EDC\u5B57\u4F53\u6216\u56FE\u7247\uFF08\u540C\u6E90\u3001data: \u53EF\u4EE5\u7528\uFF09\u3002
7. \u5185\u6838\u662F\u73B0\u4EE3 Chromium\uFF08WebView2\uFF09\uFF1Acolor-mix()\u3001oklch()\u3001\u76F8\u5BF9\u989C\u8272\u3001\u6E10\u53D8\u3001\u5D4C\u5957\u90FD\u53EF\u7528\uFF0C\u5185\u7F6E\u4E3B\u9898\u5C31\u7528\u4E86 color-mix()\u3002

\u3010\u4E09\u3001\u4EA7\u7269\u5FC5\u987B\u6EE1\u8DB3\u7684\u89C4\u5219\u3011
1. \u53EA\u58F0\u660E\u8BBE\u8BA1\u4EE4\u724C\uFF08CSS \u81EA\u5B9A\u4E49\u5C5E\u6027\uFF09\uFF0C\u4E0D\u8981\u5199\u4EFB\u4F55\u7EC4\u4EF6\u9009\u62E9\u5668\u3001\u7ED3\u6784\u6837\u5F0F\u3001@media \u6216\u5173\u952E\u5E27\u3002
2. \u53EA\u5199 :root[data-theme="<\u4E3B\u9898id>"] \u8FD9\u4E00\u6761\u89C4\u5219\uFF0C\u4E0D\u8981\u7528 !important\uFF0C\u4E0D\u8981\u5199 html / body / * \u89C4\u5219\u3002
3. \u4E0D\u8981\u6539\u5E03\u5C40\u4EE4\u724C\uFF1A--h-titlebar / --w-sidebar / --h-playerbar / --h-header / --row-h / --row-h-compact\uFF0C\u6539\u4E86\u4F1A\u7834\u574F\u56FA\u5B9A\u5E03\u5C40\u3002
4. \u4E0D\u8981\u8986\u76D6 --bg-window\uFF08\u5B83\u7531 tokens.css \u4ECE --bg-app \u6D3E\u751F\uFF09\u3002
5. \u989C\u8272\u8981\u6709\u660E\u786E\u5C42\u7EA7\u548C\u8DB3\u591F\u5BF9\u6BD4\u5EA6\uFF1A--text-1 \u5BF9 --bg-app \u4E0E --surface-1 \u7684\u6B63\u6587\u5BF9\u6BD4\u5EA6\u5E94\u4E0D\u4F4E\u4E8E 4.5:1\uFF0C--text-2 / --text-3 \u4ECD\u8981\u53EF\u8BFB\u3002
6. \u6DF1\u6D45\u6A21\u5F0F\u8981\u81EA\u6D3D\uFF1A\u5199 dark \u5C31\u6574\u5957\u6309\u6DF1\u8272\u7ED9\u503C\uFF0C\u5199 light \u5C31\u6574\u5957\u6309\u6D45\u8272\u7ED9\u503C\uFF0C\u4E0D\u8981\u4E00\u534A\u6DF1\u4E00\u534A\u6D45\u3002
7. \u6587\u4EF6\u5FC5\u987B\u81EA\u5305\u542B\u3001\u53EF\u79BB\u7EBF\uFF1A\u4E0D\u5F15\u7528\u4EFB\u4F55\u5916\u90E8\u8D44\u6E90\uFF0C\u4E0D\u542B JS\u3002
8. \u53EF\u4EE5\u53EA\u8986\u76D6\u4E00\u90E8\u5206\u4EE4\u724C\uFF0C\u5176\u4F59\u56DE\u9000\u9ED8\u8BA4\uFF1B\u4F46 --bg-app / --text-1 / --accent / --accent-text / --accent-contrast \u8FD9\u51E0\u9879\u5EFA\u8BAE\u4E00\u8D77\u7ED9\uFF0C\u514D\u5F97\u5F3A\u8C03\u8272\u4E0E\u6587\u5B57\u8272\u4E92\u76F8\u6253\u67B6\u3002

\u3010\u56DB\u3001\u53EF\u58F0\u660E\u7684\u4EE4\u724C\uFF08\u53C2\u8003\u6E05\u5355\uFF0C\u6309\u9700\u8986\u76D6\uFF09\u3011
- \u8868\u9762\uFF1A--bg-app\uFF08\u7A97\u53E3\u5E95\u8272\uFF09\u3001--bg-canvas\uFF08\u80CC\u666F\u6E10\u53D8 / \u7EB9\u7406\uFF09\u3001--surface-1 / --surface-2 / --surface-3 / --surface-hover / --surface-active
- \u6BDB\u73BB\u7483\uFF1A--glass-bg / --glass-bg-strong / --glass-bg-weak / --glass-blur\uFF080 \u8868\u793A\u5173\u95ED\u6BDB\u73BB\u7483\uFF09/ --glass-saturate / --glass-border / --glass-highlight / --glass-shadow
- \u62DF\u6001\u9634\u5F71\uFF1A--neu-raised\uFF08\u6D6E\u8D77\uFF09/ --neu-raised-sm\uFF08\u5C0F\u6D6E\u8D77\uFF09/ --neu-inset\uFF08\u51F9\u9677\uFF09/ --neu-pressed\uFF08\u6309\u4E0B\uFF09/ --neu-knob\uFF08\u6ED1\u5757\uFF09/ --neu-accent\uFF08\u5F3A\u8C03\u8272\u5B9E\u5E95\u6309\u94AE\uFF09/ --neu-under\uFF08\u4EC5\u5916\u6295\u5F71\uFF09/ --neu-edge-bottom / --neu-edge-top\uFF08\u533A\u57DF\u8FB9\u7F18\u5206\u5C42\uFF09
- \u6587\u5B57\uFF1A--text-1 / --text-2 / --text-3 / --text-inverse
- \u63CF\u8FB9\uFF1A--border-1 / --border-2 / --divider / --focus-ring
- \u5F3A\u8C03\u8272\uFF1A--accent / --accent-weak / --accent-weak-hover / --accent-text / --accent-contrast
- \u72B6\u6001\u8272\uFF1A--heart / --heart-off / --danger / --success / --warning
- \u64AD\u653E\u9875\uFF1A--immersive-veil / --vinyl\uFF08\u5531\u7247\u5E95\u7EB9\uFF09
- \u906E\u7F69\u4E0E\u5C0F\u6D6E\u5C42\uFF1A--scrim-bg / --scrim-blur\uFF08\u8BBE\u7F6E / \u5C01\u9762 / \u641C\u7D22\u90A3\u51E0\u5C42\u7684\u5168\u5C4F\u906E\u7F69\uFF09/ --scrim-tint\uFF08\u906E\u7F69\u5185\u7684\u6B21\u7EA7\u6761\uFF09/ --veil-blur\uFF08\u5F39\u7A97\u80CC\u540E\u90A3\u5C42\u8F7B\u906E\u7F69\uFF09/ --scan-blur / --popover-blur\uFF08tip\u3001\u6ED1\u6761\u6C14\u6CE1\uFF09
- \u5C01\u9762\u865A\u5316\uFF08\u53EA\u6709\u300C\u5C01\u9762\u53D6\u8272\u300D\u7C7B\u4E3B\u9898\u7528\u5F97\u4E0A\uFF09\uFF1A--cover-blur / --cover-blur-strong / --cover-saturate / --cover-brightness / --cover-veil\uFF08\u538B\u5728\u5C01\u9762\u4E0A\u7684\u6E10\u53D8\u538B\u6697\uFF0C\u4FDD\u8BC1\u6587\u5B57\u8BFB\u5F97\u6E05\uFF09
- \u96F6\u6563\u9634\u5F71\u4E0E\u6EE4\u955C\uFF1A--thumb-shadow\uFF08\u6ED1\u6761\u624B\u67C4\uFF09/ --accent-hover-filter\uFF08\u5F3A\u8C03\u8272\u6309\u94AE\u60AC\u505C\u7684\u52A0\u6DF1\uFF09/ --slider-idle-filter\uFF08\u5E95\u680F\u8FDB\u5EA6\u6761\u672A\u805A\u7126\u65F6\u7684\u538B\u6697\uFF0C\u5199 none \u5373\u5173\u95ED\uFF09
- \u89C6\u89C9\u5F3A\u5EA6\uFF1A--op-strong / --op-icon / --op-dim / --op-soft / --op-hint / --op-half / --op-disabled\uFF08\u4E0D\u53EF\u7528\u63A7\u4EF6\uFF09/ --op-dragging\uFF08\u62D6\u62FD\u4E2D\u7684\u884C\uFF09/ --op-ghost\uFF08\u6574\u7A97\u80CC\u666F\u578B\u6837\u5F0F\u4E0B\u5BBF\u4E3B\u58F3\u8BA9\u4F4D\uFF09
- \u843D\u70B9\u63D0\u793A\uFF1A--locate-dur / --locate-ring / --locate-ring-mid\uFF08\u300C\u5B9A\u4F4D\u5230\u5F53\u524D\u64AD\u653E\u300D\u7684\u63CF\u8FB9\u547C\u5438\uFF09
- \u5706\u89D2\u4E0E\u52A8\u6548\uFF1A--r-sm / --r-md / --r-lg / --r-xl / --dur / --ease
\u5B8C\u6574\u9ED8\u8BA4\u503C\u89C1 frontend/src/styles/tokens.css \u4E0E\u73B0\u6210\u793A\u4F8B frontend/src/styles/themes/_template.css\u3002

\u3010\u4E94\u3001\u53C2\u8003\u8D44\u6599\u3011
${fk(e)}

\u3010\u516D\u3001\u4EA4\u4ED8\u524D\u81EA\u68C0\u6E05\u5355\u3011
1. \u53EA\u6709\u4E00\u4E2A :root[data-theme="<\u4E3B\u9898id>"] \u89C4\u5219\uFF0C\u4E14 id \u4E0E\u6587\u4EF6\u540D\u4E00\u81F4\uFF1B
2. \u4E09\u884C @theme-* \u6307\u4EE4\u9F50\u5907\uFF0C@theme-mode \u662F dark \u6216 light\uFF1B
3. \u6CA1\u6709\u7EC4\u4EF6\u9009\u62E9\u5668\u3001\u6CA1\u6709\u5E03\u5C40\u4EE4\u724C\u3001\u6CA1\u6709 --bg-window\u3001\u6CA1\u6709 @import / url() \u5916\u94FE\u3001\u6CA1\u6709 !important\uFF1B
4. \u660E\u6697\u5C42\u7EA7\u6E05\u695A\uFF0C\u6B63\u6587\u5BF9\u6BD4\u5EA6\u4E0D\u4F4E\u4E8E 4.5:1\u3002

\u3010\u4E03\u3001\u8F93\u51FA\u683C\u5F0F\u3011
\u76F4\u63A5\u8F93\u51FA\u8FD9\u4E2A CSS \u6587\u4EF6\u7684\u5B8C\u6574\u5185\u5BB9\uFF1A\u4E00\u4E2A\u4EE3\u7801\u5757\uFF0C\u7B2C\u4E00\u884C\u7528\u6CE8\u91CA\u6807\u660E\u6587\u4EF6\u540D\u3002\u4E0D\u8981\u7701\u7565\u3001\u4E0D\u8981\u7528\u7701\u7565\u53F7\u5360\u4F4D\u3001\u4E0D\u8981\u9644\u52A0\u5176\u5B83\u6587\u4EF6\u3002

\u3010\u516B\u3001\u98CE\u683C\u3011
\u672C\u63D0\u793A\u8BCD\u53EA\u7EA6\u5B9A\u4EA7\u7269\u5FC5\u987B\u6EE1\u8DB3\u7684\u89C4\u5219\u3001\u683C\u5F0F\u3001\u73AF\u5883\u4E0E\u53C2\u8003\uFF0C\u4E0D\u89C4\u5B9A\u4E5F\u4E0D\u6697\u793A\u89C6\u89C9\u98CE\u683C\uFF1B\u914D\u8272\u4E0E\u6C14\u8D28\u7531\u4F7F\u7528\u8005\u81EA\u884C\u6784\u601D\u3002
\u8BF7\u4EE5\u4F7F\u7528\u8005\u968F\u9644\u7684\u98CE\u683C\u8BF4\u660E\u4E3A\u51C6\uFF1B\u82E5\u4F7F\u7528\u8005\u6CA1\u6709\u7ED9\u51FA\uFF0C\u5148\u5411\u4F7F\u7528\u8005\u786E\u8BA4\uFF0C\u4E0D\u8981\u81EA\u884C\u5047\u8BBE\u3002

\u3010\u98CE\u683C\u8981\u6C42 \xB7 \u7531\u4F7F\u7528\u8005\u81EA\u884C\u586B\u5199\uFF08\u672C\u884C\u53EA\u662F\u5360\u4F4D\uFF0C\u672C\u63D0\u793A\u8BCD\u4E0D\u63D0\u4F9B\u4EFB\u4F55\u98CE\u683C\u5EFA\u8BAE\uFF09\u3011
`}function am({copyKey:e,importKind:t,importLabel:n}){return u` <div class="card__actions">
    <button class="btn btn--sm btn--primary" type="button" data-copy-prompt=${e}>
      <svg aria-hidden="true"><use href="#i-file"></use></svg><span>复制提示词</span>
    </button>
    <button class="btn btn--sm" type="button" data-import=${t}>
      <svg aria-hidden="true"><use href="#i-folder"></use></svg><span>${n}</span>
    </button>
  </div>`}async function vk(){if(!x())return null;try{let e=document.documentElement.dataset.theme||i.config.theme||"";return await y.themeReference(e)||null}catch(e){return console.warn("[settings] \u8BFB\u53D6\u4E3B\u9898\u53C2\u8003\u8D44\u6599\u5931\u8D25",e),null}}async function bk(){if(!x())return null;try{let e=i.pvMode||i.config.playerViewMode||"";return await y.skinReference(e)||null}catch(e){return console.warn("[settings] \u8BFB\u53D6\u6837\u5F0F\u53C2\u8003\u8D44\u6599\u5931\u8D25",e),null}}async function yk(e){let t=e==="theme"?gk(await vk()):mk(await bk());try{await navigator.clipboard.writeText(t),m("\u63D0\u793A\u8BCD\u5DF2\u590D\u5236\uFF0C\u7C98\u8D34\u7ED9 AI \u5373\u53EF",{tone:"success",duration:2e3});return}catch{}let n=document.createElement("textarea");n.value=t,n.setAttribute("readonly",""),n.style.cssText="position:fixed;left:-9999px;top:0;opacity:0;",document.body.appendChild(n),n.select();let s=!1;try{s=document.execCommand("copy")}catch{s=!1}n.remove(),m(s?"\u63D0\u793A\u8BCD\u5DF2\u590D\u5236\uFF0C\u7C98\u8D34\u7ED9 AI \u5373\u53EF":"\u590D\u5236\u5931\u8D25\uFF0C\u8BF7\u624B\u52A8\u590D\u5236",{tone:s?"success":"warning",duration:2600})}async function _k(e,t={}){let n=e==="theme";if(!x()){m("\u6D4F\u89C8\u5668\u9884\u89C8\u6A21\u5F0F\u65E0\u6CD5\u5BFC\u5165\uFF0C\u8BF7\u624B\u52A8\u628A\u6587\u4EF6\u653E\u8FDB\u76EE\u5F55",{tone:"warning",duration:3600});return}let s=m(n?"\u6B63\u5728\u5BFC\u5165\u4E3B\u9898\u2026":"\u6B63\u5728\u5BFC\u5165\u6837\u5F0F\u5305\u2026",{duration:0});try{let a=n?await y.importTheme():await y.importSkin();if(s.close(),a?.cancelled)return;let r=n?Array.isArray(a?.imported)?a.imported:[]:a?.id?[a.id]:[],o=Array.isArray(a?.skipped)?a.skipped:[];n?(await Na(),t.commit?.(),t.render?.()):(await po(),t.render?.());let l=n?r.length?`\u5DF2\u5BFC\u5165 ${r.length} \u4E2A\u4E3B\u9898\uFF1A${r.join("\u3001")}`:"\u6CA1\u6709\u5BFC\u5165\u4EFB\u4F55\u4E3B\u9898":r.length?`\u5DF2\u5BFC\u5165\u6837\u5F0F\u300C${r[0]}\u300D`:"\u6CA1\u6709\u5BFC\u5165\u4EFB\u4F55\u6837\u5F0F";o.length&&(l+=`\uFF1B\u53E6\u6709 ${o.length} \u4E2A\u6587\u4EF6\u88AB\u8DF3\u8FC7`),m(l,{tone:r.length?o.length?"warning":"success":"warning",duration:4600}),o.length&&ue({title:"\u90E8\u5206\u6587\u4EF6\u6CA1\u6709\u5BFC\u5165",body:u`<div class="setting__hint setting__hint--steps">
          ${o.map((c,d)=>u`${d?u`<br />`:A}${c}`)}
        </div>`,okText:"\u77E5\u9053\u4E86",cancelText:"\u5173\u95ED",onOk:()=>!0})}catch(a){s.close(),m(`\u5BFC\u5165\u5931\u8D25\uFF1A${a?.message??a}`,{tone:"error",duration:6e3})}}function im(e,t={}){e.addEventListener("click",n=>{let s=n.target.closest("[data-copy-prompt]");if(s){yk(s.dataset.copyPrompt);return}let a=n.target.closest("[data-import]");a&&_k(a.dataset.import,t)})}function wk(e={}){let t=u` <div class="setting__hint setting__hint--steps">
      · 点「复制提示词」把它粘贴给
      AI：提示词里只有产物的目录结构、接口契约与硬性规则，不含任何风格建议，风格请在末尾那条「风格要求」里自己补一句，它会直接产出一个样式包目录；<br />
      · 提示词里的「参考资料」会自动带上本机的真实路径（样式目录、示例包 _template、当前样式包），AI
      能读文件就会直接照着写；<br />
      · 生成好后回到这里点「导入样式包」，选中那个目录即可（目录里必须有 skin.js）；<br />
      · 也可以手动放进「样式目录/&lt;样式id&gt;/」，回来点「重新扫描样式」。
    </div>
    ${am({copyKey:"skin",importKind:"skin",importLabel:"\u5BFC\u5165\u6837\u5F0F\u5305\u2026"})}
    <div class="setting__hint">
      接口的唯一定义在 frontend/packages/player-skins/src/contract.js；样式目录里也有现成的 _template
      示例可以直接复制改名。
    </div>`,{root:n}=nm({kind:"style",title:"\u6DFB\u52A0\u64AD\u653E\u754C\u9762\u6837\u5F0F",localBody:t,onChanged:()=>{e.commit?.(),e.render?.()}});im(n,e)}function $k(e={}){let t=u` <div class="setting__hint setting__hint--steps">
      · 点「复制提示词」把它粘贴给
      AI：提示词里只有文件格式、令牌清单与校验规则，不含任何配色建议，风格请在末尾那条「风格要求」里自己补一句，它会产出一个主题
      CSS；<br />
      · 提示词里的「参考资料」会自动带上本机的真实路径（主题目录、当前主题文件、目录里已有的主题 CSS），AI
      能读文件就会直接照着写；<br />
      · 生成好后回到这里点「导入主题」，选中放着那个 CSS 的文件夹即可；<br />
      · 也可以手动放进主题文件夹（上面有「打开主题文件夹」按钮），回来点「重新扫描主题」。
    </div>
    ${am({copyKey:"theme",importKind:"theme",importLabel:"\u5BFC\u5165\u4E3B\u9898\u2026"})}
    <div class="setting__hint setting__hint--steps">
      主题只声明颜色，不需要写组件样式，因此换主题不会破坏布局：<br />
      · 选择器写 <b>:root[data-theme="你的文件名"]</b>，与文件名一致最省事；<br />
      · 只改你想要的颜色，其余保持默认即可；<br />
      · 没写到的颜色会自动沿用默认主题，缺失也不会弄坏布局。
    </div>`,{root:n}=nm({kind:"theme",title:"\u6DFB\u52A0\u81EA\u5B9A\u4E49\u4E3B\u9898",localBody:t,onChanged:()=>{e.commit?.(),e.render?.()}});im(n,e)}async function kk(e,t,n){if(!x()){m("\u6D4F\u89C8\u5668\u9884\u89C8\u6A21\u5F0F\u4E0B\u4E0D\u80FD\u79FB\u9664\uFF0C\u8BF7\u624B\u52A8\u5220\u9664\u4E3B\u9898\u6587\u4EF6",{tone:"warning",duration:3600});return}let s=m("\u6B63\u5728\u79FB\u9664\u4E3B\u9898\u2026",{duration:0});try{let a=await $0(e);if(s.close(),!a.removed){m(`\u6CA1\u6709\u79FB\u9664\u300C${t}\u300D`,{tone:"warning"});return}await Dt(i.config),n.commit?.(),n.render?.(),m(`\u5DF2\u79FB\u9664\u4E3B\u9898\u300C${t}\u300D`,{tone:"success"})}catch(a){s.close(),m(`\u79FB\u9664\u5931\u8D25\uFF1A${a?.message??a}`,{tone:"error",duration:6e3})}}function Sk(e,t){let n=e.dataset.id,s=e.dataset.name||n;ue({title:`\u79FB\u9664\u4E3B\u9898\u300C${s}\u300D\uFF1F`,desc:"\u4F1A\u5220\u9664\u8FD9\u4E2A\u4E3B\u9898\u5BF9\u5E94\u7684\u6837\u5F0F\u6587\u4EF6\u3002\u5185\u7F6E\u4E3B\u9898\u4E0D\u80FD\u79FB\u9664\u3002",okText:"\u79FB\u9664",danger:!0,onOk:async()=>(await kk(n,s,t),!0)})}async function xk(e,t,n){if(!x()){m("\u6D4F\u89C8\u5668\u9884\u89C8\u6A21\u5F0F\u4E0B\u4E0D\u80FD\u79FB\u9664\uFF0C\u8BF7\u624B\u52A8\u5220\u9664\u6837\u5F0F\u76EE\u5F55",{tone:"warning",duration:3600});return}let s=m("\u6B63\u5728\u79FB\u9664\u6837\u5F0F\u2026",{duration:0});try{let a=await U$(e);if(s.close(),!a.removed){m(`\u6CA1\u6709\u79FB\u9664\u300C${t}\u300D`,{tone:"warning"});return}n.commit?.(),n.render?.(),m(`\u5DF2\u79FB\u9664\u6837\u5F0F\u300C${t}\u300D`,{tone:"success"})}catch(a){s.close(),m(`\u79FB\u9664\u5931\u8D25\uFF1A${a?.message??a}`,{tone:"error",duration:6e3})}}function Ck(e,t){let n=e.dataset.id,s=e.dataset.name||n;ue({title:`\u79FB\u9664\u6837\u5F0F\u300C${s}\u300D\uFF1F`,desc:"\u4F1A\u628A\u6837\u5F0F\u76EE\u5F55\u91CC\u5BF9\u5E94\u7684\u6574\u4E2A\u6587\u4EF6\u5939\u5220\u6389\uFF08\u91CC\u9762\u53EA\u6709\u8FD9\u4E2A\u6837\u5F0F\u7684\u6587\u4EF6\uFF0C\u4E0D\u542B\u6B4C\u66F2\uFF09\u3002",okText:"\u79FB\u9664",danger:!0,onOk:async()=>(await xk(n,s,t),!0)})}async function md(e,t={}){let n=e.dataset.act,s=e.dataset.id;switch(n){case"about-open-url":{let a=String(e.dataset.url||"").trim();if(!a)return;if(!x()){try{await navigator.clipboard.writeText(a),m("\u9884\u89C8\u6A21\u5F0F\u6CA1\u6709\u7CFB\u7EDF\u6D4F\u89C8\u5668\uFF1A\u94FE\u63A5\u5DF2\u590D\u5236",{duration:2600})}catch{m(a,{duration:5200})}return}try{await y.openExternalUrl(a)}catch(r){m(`\u6253\u5F00\u94FE\u63A5\u5931\u8D25\uFF1A${r?.message??r}`,{tone:"error",duration:5e3})}return}case"update-check":{if(!x()){m("\u6D4F\u89C8\u5668\u9884\u89C8\u6A21\u5F0F\u65E0\u6CD5\u8054\u7F51\u68C0\u67E5\u66F4\u65B0",{tone:"warning",duration:3200});return}m("\u6B63\u5728\u68C0\u67E5\u66F4\u65B0\u2026",{duration:2200});try{let a=await ha({force:!0});if(!a)return;a.error?m(`\u68C0\u67E5\u5931\u8D25\uFF1A${a.error}`,{tone:"error",duration:7e3}):a.hasUpdate&&!a.assetAvailable?m(`\u6709\u65B0\u7248\u672C ${a.latest}\uFF0C\u4F46\u6CA1\u6709\u5F53\u524D\u5E73\u53F0\u7684\u5B89\u88C5\u5305`,{tone:"warning",duration:6e3}):a.hasUpdate?m(`\u53D1\u73B0\u65B0\u7248\u672C ${a.latest}`,{tone:"success",duration:4e3}):m(`\u5DF2\u662F\u6700\u65B0\u7248\u672C\uFF08v${a.current}\uFF09`,{tone:"success",duration:3e3})}catch(a){m(`\u68C0\u67E5\u5931\u8D25\uFF1A${a?.message??a}`,{tone:"error",duration:6e3})}return}case"update-download":{if(!x()){m("\u6D4F\u89C8\u5668\u9884\u89C8\u6A21\u5F0F\u65E0\u6CD5\u4E0B\u8F7D\u66F4\u65B0",{tone:"warning",duration:3200});return}Mi().catch(a=>{m(`\u4E0B\u8F7D\u5931\u8D25\uFF1A${a?.message??a}`,{tone:"error",duration:7e3})});return}case"update-cancel":{let a=await Ii();m(a?"\u5DF2\u53D6\u6D88\u4E0B\u8F7D":"\u5F53\u524D\u6CA1\u6709\u6B63\u5728\u8FDB\u884C\u7684\u4E0B\u8F7D",{duration:2600});return}case"update-install":{if(!x()){m("\u6D4F\u89C8\u5668\u9884\u89C8\u6A21\u5F0F\u65E0\u6CD5\u5B89\u88C5\u66F4\u65B0",{tone:"warning",duration:3200});return}let a=i.update?.pending;if(!a){m("\u8FD8\u6CA1\u6709\u4E0B\u8F7D\u597D\u53EF\u5B89\u88C5\u7684\u66F4\u65B0",{tone:"warning",duration:3200});return}let r=!a.verified;ue({title:r?"\u5B89\u88C5\u672A\u6821\u9A8C\u7684\u66F4\u65B0\u5305\uFF1F":"\u5B89\u88C5\u66F4\u65B0\u5E76\u91CD\u542F\uFF1F",desc:`\u5373\u5C06\u5B89\u88C5 ${a.name}\u3002\u7A0B\u5E8F\u4F1A\u5148\u9000\u51FA\uFF0C\u7531\u5F15\u5BFC\u811A\u672C\u66FF\u6362\u6587\u4EF6\u540E\u81EA\u52A8\u91CD\u542F\u3002`+(a.verified?"\u5B89\u88C5\u5305\u5DF2\u901A\u8FC7 SHA-256 \u6821\u9A8C\u3002":`\u6CE8\u610F\uFF1A\u6CA1\u6709\u53D6\u5230\u53EF\u7528\u7684 SHA-256 \u6821\u9A8C\u503C${a.mirrorId?`\uFF08\u6765\u6E90\u901A\u9053\uFF1A${ls(a.mirrorId).name}\uFF09`:""}\uFF0C\u65E0\u6CD5\u786E\u8BA4\u5B83\u4E0E\u5B98\u65B9\u53D1\u5E03\u7684\u662F\u540C\u4E00\u4EFD\u6587\u4EF6\u3002\u5EFA\u8BAE\u53D6\u6D88\u540E\u6539\u7528\u300C\u76F4\u8FDE GitHub\u300D\u91CD\u65B0\u4E0B\u8F7D\uFF0C\u6216\u5230\u53D1\u5E03\u9875\u624B\u52A8\u4E0B\u8F7D\u3002`),body:r?u`<label class="setting__hint">
              <input type="checkbox" data-field="confirmUnverified" />
              我确认这个安装包没有被校验过，并自行承担风险
            </label>`:A,danger:r,okText:r?"\u4ECD\u7136\u5B89\u88C5\u5E76\u91CD\u542F":"\u5B89\u88C5\u5E76\u91CD\u542F",onOk:async o=>r&&!o.confirmUnverified?"\u8BF7\u5148\u52FE\u9009\u4E0A\u9762\u7684\u786E\u8BA4\u9879":await Ti()?(m("\u6B63\u5728\u5B89\u88C5\u66F4\u65B0\uFF0C\u7A0B\u5E8F\u5373\u5C06\u91CD\u542F\u2026",{duration:4e3}),!0):(m(`\u5B89\u88C5\u5931\u8D25\uFF1A${i.update?.error||"\u672A\u77E5\u539F\u56E0"}`,{tone:"error",duration:7e3}),!1)});return}case"update-skip":{let a=String(e.dataset.version||"");await Di(a),m(a?`\u5DF2\u8DF3\u8FC7 ${a}\uFF0C\u4E4B\u540E\u518D\u63D0\u793A\u66F4\u65B0\u7684\u7248\u672C`:"\u5DF2\u53D6\u6D88\u8DF3\u8FC7\uFF0C\u5C06\u91CD\u65B0\u63D0\u793A\u8BE5\u7248\u672C",{duration:3600});return}case"update-open-dir":{if(!x()){m("\u6D4F\u89C8\u5668\u9884\u89C8\u6A21\u5F0F\u6CA1\u6709\u6587\u4EF6\u7BA1\u7406\u5668",{tone:"warning",duration:3e3});return}try{await y.updateOpenDir()}catch(a){m(`\u6253\u5F00\u66F4\u65B0\u76EE\u5F55\u5931\u8D25\uFF1A${a?.message??a}`,{tone:"error",duration:5e3})}return}case"update-channel":{let a=String(e.value||"auto");await Ei(a);let r=ls(a).name;m(`\u4E0B\u8F7D\u901A\u9053\u5DF2\u8BBE\u4E3A\u300C${r}\u300D`,{duration:3e3});return}case"reset-main-window-geometry":{if(!x()){m("\u6D4F\u89C8\u5668\u9884\u89C8\u6A21\u5F0F\u4E0B\u6CA1\u6709\u72EC\u7ACB\u7A97\u53E3",{duration:2200});return}try{let a=await y.mainWindowResetGeometry();a&&a.ok===!1?m(`\u91CD\u7F6E\u5931\u8D25\uFF1A${a.reason||"\u672A\u77E5\u539F\u56E0"}`,{tone:"error",duration:5e3}):m("\u7A97\u53E3\u5DF2\u79FB\u56DE\u5C4F\u5E55\u4E2D\u592E\u5E76\u6062\u590D\u9ED8\u8BA4\u5927\u5C0F",{tone:"success",duration:2400})}catch(a){m(`\u91CD\u7F6E\u5931\u8D25\uFF1A${a?.message??a}`,{tone:"error",duration:5e3})}return}case"ai-field":{let a=e.dataset.key;if(!a)return;let r=e.value;if(a==="aiApiKey"&&r===(i.config?.aiApiKey??""))return;let o=Bh();i.config[a]=r,t.commit?.(),!o&&Bh()&&await Tk();return}case"add-folder":{if(x()){let r=null;try{r=await y.addFolder("")}catch(o){m(`\u6DFB\u52A0\u6587\u4EF6\u5939\u5931\u8D25\uFF1A${o?.message??o}`,{tone:"error",duration:6e3});return}if(r?.cancelled)return;if(r?.duplicated){m(`\u8BE5\u6587\u4EF6\u5939\u5DF2\u5728\u66F2\u5E93\u4E2D\uFF1A${r.path}`,{tone:"warning"});return}r?.folder?(i.folders=[...i.folders.filter(o=>o.id!==r.folder.id),r.folder],t.commit?.(),m(`\u5DF2\u6DFB\u52A0\u5E76\u5F00\u59CB\u626B\u63CF\uFF1A${r.folder.path}`,{tone:"success"})):m("\u6DFB\u52A0\u6587\u4EF6\u5939\u5931\u8D25\uFF0C\u8BF7\u91CD\u8BD5",{tone:"error",duration:6e3});return}let a=await Ek();if(!a)return;i.folders.push({id:Ct("folder"),path:a,trackCount:0,status:"ok",watching:i.config.watchFolders,addedAt:Date.now()}),t.commit?.(),m(`\u5DF2\u6DFB\u52A0\u6587\u4EF6\u5939\uFF1A${a}`,{tone:"success"}),t.rescan?.();break}case"remove-folder":{let a=i.folders.find(r=>r.id===s);if(!a)return;ue({title:"\u79FB\u9664\u97F3\u4E50\u6587\u4EF6\u5939\uFF1F",desc:`${a.path}
\u4EC5\u4ECE\u66F2\u5E93\u4E2D\u79FB\u9664\uFF0C\u4E0D\u4F1A\u5220\u9664\u4EFB\u4F55\u672C\u5730\u6587\u4EF6\u3002`,okText:"\u79FB\u9664",danger:!0,onOk:async()=>(x()&&await y.removeFolder(s),i.folders=i.folders.filter(r=>r.id!==s),t.commit?.(),m("\u5DF2\u79FB\u9664\u6587\u4EF6\u5939"),t.rescan?.({manual:!1}),!0)});break}case"scan-now":t.rescan?.({manual:!0});break;case"rescan-folder":m("\u6B63\u5728\u91CD\u65B0\u626B\u63CF\u8BE5\u6587\u4EF6\u5939\u2026"),t.rescan?.({manual:!0});break;case"unplayable-toggle":ua();break;case"unplayable-dismiss":await pa(s);break;case"unplayable-restore":{let a=(i.unplayableFiles||[]).find(r=>r.songId===s);ue({title:"\u91CD\u65B0\u626B\u63CF\u5E76\u653E\u56DE\u66F2\u5E93\uFF1F",desc:`\u5C06\u6E05\u6389\u300C${a?.title||s}\u300D\u7684\u5931\u8D25\u8BB0\u5F55\uFF0C\u5E76\u91CD\u65B0\u626B\u63CF\u97F3\u4E50\u6587\u4EF6\u5939\u3002
\u5982\u679C\u6587\u4EF6\u786E\u5B9E\u5DF2\u7ECF\u4FEE\u597D\uFF0C\u5B83\u5C31\u4F1A\u56DE\u5230\u66F2\u5E93\u91CC\u3002`,okText:"\u91CD\u65B0\u626B\u63CF",onOk:async()=>(await xi(s),m("\u5DF2\u91CD\u65B0\u626B\u63CF",{tone:"success"}),!0)});break}case"unplayable-clear":{let a=(i.unplayableFiles||[]).length;if(!a)break;ue({title:`\u6E05\u7A7A\u8FD9 ${N(a)} \u6761\u8BB0\u5F55\uFF1F`,desc:"\u53EA\u6E05\u6389\u8FD9\u5F20\u6E05\u5355\uFF0C\u4E0D\u4F1A\u6539\u52A8\u4EFB\u4F55\u6587\u4EF6\uFF0C\u4E5F\u4E0D\u4F1A\u8BA9\u5B83\u4EEC\u56DE\u5230\u66F2\u5E93\u3002",okText:"\u6E05\u7A7A",danger:!0,onOk:async()=>{let r=await Ci();return m(`\u5DF2\u6E05\u7A7A ${N(r)} \u6761\u8BB0\u5F55`),!0}});break}case"rule-add":i.filterRules.push({id:Ct("rule"),type:"regex",op:"match",value:"",scope:"exclude",enabled:!0}),t.commit?.();break;case"rule-del":i.filterRules=i.filterRules.filter(a=>a.id!==s),t.commit?.(),t.refreshRules?.();break;case"rule-toggle":{let a=i.filterRules.find(r=>r.id===s);a&&(a.enabled=!a.enabled),t.commit?.(),t.refreshRules?.();break}case"rule-scope":{let a=i.filterRules.find(r=>r.id===s);a&&(a.scope=e.dataset.scope),t.commit?.(),t.refreshRules?.();break}case"rule-type":{let a=i.filterRules.find(r=>r.id===s);if(a){a.type=e.value==="regex"?"regex":"size";let r=["lt","lte","gt","gte","eq"];a.type==="regex"?a.op="match":r.includes(a.op)||(a.op="lt"),a.type==="size"&&!a.unit&&(a.unit="B")}t.commit?.(),t.refreshRules?.();break}case"rule-op":{let a=i.filterRules.find(r=>r.id===s);a&&(a.op=e.value),t.commit?.(),t.refreshRules?.();break}case"preset-small":i.filterRules.push({id:Ct("rule"),type:"size",op:"lt",value:"10240",unit:"B",scope:"exclude",enabled:!0}),t.commit?.(),t.refreshRules?.(),m("\u5DF2\u6DFB\u52A0\uFF1A\u6392\u9664\u5C0F\u4E8E 10KB \u7684\u6587\u4EF6",{tone:"success"});break;case"preset-mp4":i.filterRules.push({id:Ct("rule"),type:"regex",op:"match",value:"\\.mp4$",scope:"exclude",enabled:!0}),t.commit?.(),t.refreshRules?.(),m("\u5DF2\u6DFB\u52A0\uFF1A\u6392\u9664 .mp4 \u6587\u4EF6",{tone:"success"});break;case"theme-pick":{let a=Fs().find(r=>r.id===s);if(!a)return;i.config.theme=a.id,i.config.themeMode=a.mode,await Dt(i.config),t.commit?.(),t.render?.(),m(`\u5DF2\u5207\u6362\u5230\u4E3B\u9898\u300C${a.name}\u300D`,{tone:"success",duration:1600});break}case"open-theme-dir":{if(!x()){m("\u4E3B\u9898\u76EE\u5F55\uFF1Afrontend/src/styles/themes/",{duration:3200});break}try{let a=await y.themeDir();await y.revealThemeDir(),m(a?`\u5DF2\u6253\u5F00\u4E3B\u9898\u76EE\u5F55\uFF1A${a}`:"\u5DF2\u6253\u5F00\u4E3B\u9898\u76EE\u5F55",{duration:3200})}catch(a){m(`\u6253\u5F00\u4E3B\u9898\u76EE\u5F55\u5931\u8D25\uFF1A${a?.message??a}`,{tone:"error",duration:5e3})}break}case"theme-help":$k(t);break;case"theme-remove":Sk(e,t);break;case"reload-themes":if(x()){let a=await y.reloadThemes();await Na(),await Dt(i.config),t.commit?.(),m(`\u5DF2\u91CD\u65B0\u626B\u63CF\u5230 ${a?.length??0} \u4E2A\u4E3B\u9898`,{tone:"success"})}else m("\u6D4F\u89C8\u5668\u9884\u89C8\u6A21\u5F0F\u4E0B\u4EC5\u5185\u7F6E\u4E3B\u9898\u53EF\u7528",{tone:"warning"});break;case"skin-pick":{let a=qs().find(r=>r.id===s);if(!a)return;Rs(a.id),t.commit?.(),t.render?.(),m(`\u64AD\u653E\u754C\u9762\u5DF2\u5207\u6362\u5230\u300C${a.name}\u300D`,{tone:"success",duration:1600});break}case"open-skin-dir":{if(!x()){m("\u6837\u5F0F\u76EE\u5F55\uFF1Afrontend/packages/player-skins/",{duration:3200});break}try{let a=await y.skinDir();await y.revealSkinDir(),m(a?`\u5DF2\u6253\u5F00\u6837\u5F0F\u76EE\u5F55\uFF1A${a}`:"\u5DF2\u6253\u5F00\u6837\u5F0F\u76EE\u5F55",{duration:3200})}catch(a){m(`\u6253\u5F00\u6837\u5F0F\u76EE\u5F55\u5931\u8D25\uFF1A${a?.message??a}`,{tone:"error",duration:5e3})}break}case"reload-skins":try{x()&&await y.reloadSkins(),await po(),Rs(i.pvMode||i.config.playerViewMode||""),t.render?.();let a=qs().length,r=Gf();m(r.length?`\u5DF2\u626B\u63CF\u5230 ${a} \u4E2A\u6837\u5F0F\uFF0C${r.length} \u4E2A\u52A0\u8F7D\u5931\u8D25`:`\u5DF2\u626B\u63CF\u5230 ${a} \u4E2A\u6837\u5F0F`,{tone:r.length?"warning":"success"})}catch(a){m(`\u91CD\u65B0\u626B\u63CF\u5931\u8D25\uFF1A${a?.message??a}`,{tone:"error"})}break;case"skin-help":wk(t);break;case"skin-remove":Ck(e,t);break;case"ai-vendor":{let a=String(e.value||"auto");if(a===(i.config.aiVendor||"auto"))break;i.config.aiVendor=a,t.commit?.(),t.render?.();let r=Cf(a);m(`\u6A21\u578B\u7C7B\u578B\u5DF2\u8BBE\u4E3A\u300C${Dw(a)}\u300D${r?"\uFF1A"+r:""}`,{duration:3600});break}case"loudness-refresh":{if(!x())return;await oo();let a=await Da();t.commit?.(),m(`\u5DF2\u91CD\u65B0\u83B7\u53D6\u54CD\u5EA6\u6570\u636E\uFF08\u5DF2\u6D4B\u91CF ${a?.measured??0} \u9996\uFF09`,{tone:"success"});break}case"loudness-clear":{if(!x())return;ue({title:"\u6E05\u9664\u54CD\u5EA6\u6D4B\u91CF\u6570\u636E\uFF1F",desc:"\u53EA\u4F1A\u5220\u9664\u6D4B\u91CF\u7F13\u5B58\uFF0C\u4E0D\u4F1A\u52A8\u4F60\u7684\u97F3\u4E50\u6587\u4EF6\u3002\u6E05\u9664\u540E\u518D\u6B21\u542F\u7528\u54CD\u5EA6\u5747\u8861\u4F1A\u91CD\u65B0\u6D4B\u91CF\u3002",okText:"\u6E05\u9664",danger:!0,onOk:async()=>(await y.loudnessClear(),i.loudnessGains={},await Da(),t.commit?.(),t.render?.(),m("\u5DF2\u6E05\u9664\u54CD\u5EA6\u6D4B\u91CF\u6570\u636E",{tone:"success"}),!0)});break}case"loudness-target":{let a=Number(e.value),r=i.config.loudnessTarget;if(a===r)break;i.config.loudnessTarget=a,t.commit?.(),await o$(),await Da(),t.render?.(),m("\u76EE\u6807\u54CD\u5EA6\u5DF2\u5207\u6362\uFF0C\u54CD\u5EA6\u6570\u636E\u5C06\u91CD\u65B0\u8BA1\u7B97",{tone:"success",duration:3200});break}case"download-dir-pick":{if(!x()){m("\u6D4F\u89C8\u5668\u9884\u89C8\u65E0\u6CD5\u8C03\u7528\u7CFB\u7EDF\u76EE\u5F55\u9009\u62E9\u5668",{tone:"warning"});break}try{let a=await y.downloadPickDir();if(a?.cancelled)break;await Nh(a,t)}catch(a){m(`\u65E0\u6CD5\u66F4\u6539\u4E0B\u8F7D\u4F4D\u7F6E\uFF1A${a?.message??a}`,{tone:"error",duration:6e3})}break}case"download-dir-open":{if(!x())break;try{await y.downloadOpenDir(i.config.downloadDir||"")}catch(a){m(`\u6253\u5F00\u5931\u8D25\uFF1A${a?.message??a}`,{tone:"error",duration:5e3})}break}case"download-dir-reset":{if(!x())break;try{let a=await y.downloadSetDir("");if(a?.cancelled)break;let r=a?.next?a:await y.downloadSetDir("");await Nh(r,t)}catch(a){m(`\u6062\u590D\u9ED8\u8BA4\u5931\u8D25\uFF1A${a?.message??a}`,{tone:"error",duration:6e3})}break}case"cache-open-covers":case"cache-open-lyrics":{if(!x())break;try{await y.coverOpenCacheDir(n==="cache-open-covers"?"covers":"lyrics")}catch(a){m(`\u6253\u5F00\u7F13\u5B58\u76EE\u5F55\u5931\u8D25\uFF1A${a?.message??a}`,{tone:"error",duration:5e3})}break}case"cover-refresh":{if(!x())break;try{let a=await y.coverClearCache();i.coverCache=await y.coverCacheStats(),await om(),t.commit?.(),t.render?.(),m(`\u5DF2\u6E05\u7A7A\u7F13\u5B58\uFF08\u5C01\u9762 ${a?.covers??0} \u5F20\u3001\u6B4C\u8BCD ${a?.lyrics??0} \u4EFD\uFF09`,{tone:"success"})}catch(a){m(`\u6E05\u7A7A\u5931\u8D25\uFF1A${a?.message??a}`,{tone:"error",duration:5e3})}break}case"online-cache-cleanup":await Bw(),t.render?.();break;case"embed-cache-write":await rm({ctx:t,force:!0});break}}async function rm({ctx:e={},force:t=!1}={}){if(!x()){t&&m("\u5199\u5165\u6B4C\u66F2\u6587\u4EF6\u9700\u8981\u540E\u7AEF\u652F\u6301\uFF0C\u6D4F\u89C8\u5668\u9884\u89C8\u4E0D\u53EF\u7528",{tone:"warning"});return}for(let a=0;a<20&&!i.coverCache;a++)await new Promise(r=>setTimeout(r,100));if(!i.coverCache&&t)try{i.coverCache=await y.coverCacheStats()}catch{}if(sm()===0){t?m(i.coverCache?"\u7F13\u5B58\u91CC\u8FD8\u6CA1\u6709\u5C01\u9762\u6216\u6B4C\u8BCD\uFF0C\u6682\u65F6\u6CA1\u6709\u53EF\u5199\u5165\u7684\u5185\u5BB9":"\u6682\u65F6\u8BFB\u4E0D\u5230\u7F13\u5B58\u7EDF\u8BA1\uFF0C\u8BF7\u7A0D\u540E\u518D\u8BD5",{duration:3400}):i.coverCache&&m("\u5DF2\u5F00\u542F\uFF1A\u4EE5\u540E\u4E0B\u8F7D / \u66F4\u6362\u5C01\u9762\u65F6\u4F1A\u628A\u5C01\u9762\u4E0E\u6B4C\u8BCD\u5199\u8FDB\u6B4C\u66F2\u6587\u4EF6",{duration:3600});return}let n=Number(i.coverCache?.covers)||0,s=Number(i.coverCache?.lyrics)||0;ue({title:"\u8981\u628A\u5DF2\u6709\u7684\u7F13\u5B58\u5199\u8FDB\u6B4C\u66F2\u6587\u4EF6\u5417\uFF1F",body:u` <div class="setting__hint">
        缓存目录里已经有 <b>${N(n)}</b> 张封面、<b>${N(s)}</b> 份歌词。
        它们现在只放在缓存目录里；写进歌曲文件之后，把文件拷到别的播放器上也能看到。
      </div>
      <div class="setting__hint">
        写入只会在原文件的标签里做最小插入 / 替换（m4a 的 covr 与 ©lyr、FLAC 的 PICTURE 与 LYRICS），
        不动音频数据；mp3、wav、ogg 等格式会被跳过。这一步无法撤销，但不会影响播放。
      </div>`,okText:"\u5199\u5165\u6587\u4EF6",cancelText:"\u6682\u4E0D\u5199\u5165",onOk:async()=>(await Ak(e),!0)})}async function Ak(e={}){let t=m("\u6B63\u5728\u628A\u7F13\u5B58\u5199\u5165\u6B4C\u66F2\u6587\u4EF6\u2026",{duration:0}),n=ie("meta:embed-progress",s=>{let a=Number(s?.done)||0,r=Number(s?.total)||0,o=s?.title?" \xB7 "+s.title:"";t.update(r?"\u6B63\u5728\u5199\u5165\u6B4C\u66F2\u6587\u4EF6 "+a+"/"+r+o:"\u6B63\u5728\u628A\u7F13\u5B58\u5199\u5165\u6B4C\u66F2\u6587\u4EF6\u2026")});try{let s=await y.coverWriteCacheToFiles(),a=Number(s?.written)||0,r=Number(s?.skipped)||0,o=Number(s?.failed)||0,l=Number(s?.total)||0;if(t.close(),!l){m("\u7F13\u5B58\u91CC\u8FD8\u6CA1\u6709\u5C01\u9762\u6216\u6B4C\u8BCD\uFF0C\u6682\u65F6\u6CA1\u6709\u53EF\u5199\u5165\u7684\u5185\u5BB9",{duration:3200});return}let c=`\u5DF2\u5199\u5165 ${N(a)} \u9996`;s?.covers&&(c+=`\uFF08\u5C01\u9762 ${N(s.covers)}\uFF09`),s?.lyrics&&(c+=`\uFF08\u6B4C\u8BCD ${N(s.lyrics)}\uFF09`),r&&(c+=`\uFF0C\u8DF3\u8FC7 ${N(r)} \u9996`),o&&(c+=`\uFF0C\u5931\u8D25 ${N(o)} \u9996`),m(c,{tone:o?"warning":r?"info":"success",duration:5200});let d=Array.isArray(s?.reasons)?s.reasons:[];d.length&&ue({title:o?"\u90E8\u5206\u6B4C\u66F2\u6CA1\u80FD\u5199\u5165":"\u90E8\u5206\u6B4C\u66F2\u5DF2\u8DF3\u8FC7",body:u`<div class="setting__hint setting__hint--steps">
          ${d.map((p,h)=>u`${h?u`<br />`:A}${p}`)}
        </div>`,okText:"\u77E5\u9053\u4E86",cancelText:"\u5173\u95ED",onOk:()=>!0}),i.coverCache=await y.coverCacheStats(),e.commit?.(),e.render?.()}catch(s){t.close(),m(`\u5199\u5165\u5931\u8D25\uFF1A${s?.message??s}`,{tone:"error",duration:6e3})}finally{n()}}async function Nh(e,t){if(!e||e.cancelled)return;let n=e.next;if(!n)return;if(e.same){m("\u8FD9\u5DF2\u7ECF\u662F\u5F53\u524D\u7684\u4E0B\u8F7D\u76EE\u5F55",{duration:2200});return}let s=Number(e.count)||0,a=((Number(e.bytes)||0)/1024/1024).toFixed(1),r=Number(e.nextCount)||0;if(s===0){await Bc(n,!1,t);return}let o=u` <div class="setting__hint">
      当前下载目录里有 <b>${N(s)}</b> 首歌曲（约 ${a} MB）。 要一并搬到新目录吗？
    </div>
    <div class="dir-compare">
      <div class="dir-compare__row">
        <span class="dir-compare__tag">从</span>
        <span class="dir-compare__path u-selectable">${e.current||""}</span>
      </div>
      <div class="dir-compare__row">
        <span class="dir-compare__tag">到</span>
        <span class="dir-compare__path u-selectable">${n}</span>
      </div>
    </div>
    ${r?u`<div class="setting__hint">新目录里已经有 ${N(r)} 首歌曲，同名的不会被覆盖。</div>`:A}
    <div class="setting__hint">不迁移的话，旧目录里的歌曲会留在原地；新目录会成为新的默认保存位置。</div>`;ue({title:"\u66F4\u6539\u4E0B\u8F7D\u4F4D\u7F6E",body:o,okText:"\u8FC1\u79FB\u5E76\u66F4\u6539",cancelText:"\u4E0D\u8FC1\u79FB\uFF0C\u53EA\u66F4\u6539\u4F4D\u7F6E",onOk:async()=>(await Bc(n,!0,t),!0),onCancel:async()=>{await Bc(n,!1,t)}})}async function Bc(e,t,n){try{let s=await y.downloadApplyDir(e,t);if(s?.dir&&(i.config.downloadDir=s.dir),n.commit?.(),n.render?.(),!t){m(`\u4E0B\u8F7D\u4F4D\u7F6E\u5DF2\u6539\u4E3A\uFF1A${s?.dir||e}`,{tone:"success",duration:3200});return}let a=Number(s?.migrated)||0,r=Number(s?.skipped)||0,o=Array.isArray(s?.failed)?s.failed:[],l=`\u5DF2\u8FC1\u79FB ${N(a)} \u9996`;r&&(l+=`\uFF0C\u8DF3\u8FC7 ${N(r)} \u9996\uFF08\u65B0\u76EE\u5F55\u5DF2\u6709\u540C\u540D\u6587\u4EF6\uFF09`),o.length&&(l+=`\uFF0C${N(o.length)} \u9996\u5931\u8D25`),m(`${l}\uFF1B\u65B0\u4F4D\u7F6E\uFF1A${s?.dir||e}`,{tone:o.length?"warning":"success",duration:4200})}catch(s){m(`\u66F4\u6539\u4E0B\u8F7D\u4F4D\u7F6E\u5931\u8D25\uFF1A${s?.message??s}`,{tone:"error",duration:6e3})}}async function om(){if(!x())return i.coverProviders=[],i.coverBreaker={},null;try{let e=await y.coverProviders();return i.coverProviders=Array.isArray(e?.providers)?e.providers:[],i.coverBreaker=e?.breaker&&typeof e.breaker=="object"?e.breaker:{},e}catch{return i.coverProviders=[],i.coverBreaker={},null}}var Fh=!1;function Mk(){if(Fh)return;Fh=!0;let e=x()?y.coverCacheStats().then(t=>(i.coverCache=t,t)).catch(()=>null):Promise.resolve(null);Promise.all([om(),e]).then(()=>{Tf(),Ve()})}function Bh(){let e=i.config||{},t=!!e.aiApiKeySet||!!String(e.aiApiKey||"").trim();return!!(String(e.aiBaseUrl||"").trim()&&t)}var lm="music-player.ai.notice.v1";function Ik(){try{return localStorage.getItem(lm)==="1"}catch{return!1}}async function Tk(){return Ik()?!1:new Promise(e=>{let t=()=>{try{localStorage.setItem(lm,"1")}catch{}e(!0)};ue({title:"\u542F\u7528 AI \u524D\u8BF7\u786E\u8BA4",desc:`\u6B4C\u66F2\u4FE1\u606F\u4F1A\u53D1\u5F80\u4F60\u586B\u5199\u7684\u63A5\u53E3\u5730\u5740\uFF0C\u800C\u4E0D\u662F\u672C\u673A\uFF1A${String(i.config?.aiBaseUrl||"").trim()}`,body:u`
        <div class="about-note">
          <div class="about-note__body">
            · 发送的内容：歌曲标题、歌手、专辑、时长，以及文件名（只有文件名，不含完整路径）。
          </div>
          <div class="about-note__body">· 不发：曲库列表、播放记录、文件路径、任何设备标识。</div>
          <div class="about-note__body">· 接口地址通常在境外：请自行确认该服务的隐私政策与数据处理方式。</div>
          <div class="about-note__body">· 随时可关：清空 Base URL / API Key，或关掉 AI 的两个开关。</div>
        </div>
      `,okText:"\u6211\u5DF2\u77E5\u6653\uFF0C\u542F\u7528 AI",cancelText:"\u7A0D\u540E\u518D\u8BF4",onOk:()=>(t(),!0),onCancel:()=>{e(!1)}})})}function Ek(){return new Promise(e=>{ue({title:"\u6DFB\u52A0\u97F3\u4E50\u6587\u4EF6\u5939",desc:"\u6D4F\u89C8\u5668\u9884\u89C8\u6A21\u5F0F\u4E0B\u65E0\u6CD5\u8C03\u7528\u7CFB\u7EDF\u76EE\u5F55\u9009\u62E9\u5668\uFF0C\u8BF7\u624B\u52A8\u8F93\u5165\u8DEF\u5F84\u3002",body:u`<input class="input" data-field="path" type="text" placeholder="D:\\Music" />`,okText:"\u6DFB\u52A0",onOk:t=>{let n=String(t.path||"").trim();return n?(e(n),!0):"\u8BF7\u8F93\u5165\u8DEF\u5F84"}})})}function Pk(e,t={}){let n=e.dataset.toggle;if(n){let a=e.getAttribute("aria-checked")!=="true";if(e.setAttribute("aria-checked",String(a)),n==="updateCheckOnStart")return Pi(a).then(()=>t.commit?.()).catch(r=>{console.warn("[settings] \u8BBE\u7F6E\u81EA\u52A8\u68C0\u67E5\u5931\u8D25",r)}),!0;if(n in i.config){if(i.config[n]=a,a&&(n==="aiLyricsClean"||n==="aiDownloadTag")){let r=Ow(n);r&&m(r,{tone:"warning",duration:8e3})}n==="animations"&&nn("--dur",ta(i.config)),(n==="skipSilenceHead"||n==="skipSilenceTail")&&Ed(),n==="minimizeToTray"&&x()&&y.minimizeToTray(a).catch(r=>{console.warn("[settings] \u540C\u6B65\u6258\u76D8\u5F00\u5173\u5931\u8D25",r)}),n==="watchFolders"&&(i.folders.forEach(r=>r.watching=a),x()&&y.setWatchers(a).catch(r=>{console.warn("[settings] \u5207\u6362\u5B9E\u65F6\u76D1\u542C\u5931\u8D25",r)}))}return t.commit?.(),n==="embedMeta"&&a&&rm(),!0}let s=e.closest("[data-segment]")?.dataset.segment;if(s){let a=e.dataset.value;if(e.parentElement.querySelectorAll(".segmented__btn").forEach(r=>{r.setAttribute("aria-pressed",String(r===e))}),s==="themeMode"){i.config.themeMode=a;let r=Fs(),o=window.matchMedia("(prefers-color-scheme: dark)").matches,l=a==="system"?o?"dark":"light":a,c=r.find(d=>d.mode===l&&d.id!=="cover-dark")||r[0];i.config.theme=c.id,Dt(i.config)}else if(s in i.config){let r=["lyricsLines","scanConcurrency"];i.config[s]=r.includes(s)?Number(a):a,s==="lyricsLines"&&nn("--lyric-pad",`${50-Number(a)*4}%`),s==="animationsSpeed"&&nn("--dur",ta(i.config)),s==="loudnessMode"&&oo(),s==="windowCorners"&&x()&&y.setWindowCorners(a).catch(o=>{console.warn("[settings] \u8BBE\u7F6E\u7A97\u53E3\u5706\u89D2\u5931\u8D25",o)})}return t.commit?.(),!0}return!1}function Dk(e,{silent:t=!1}={}){let n=e?.dataset?.id;if(!n)return;let s=i.config.rowClickAction||"play";if(s==="play"){Mt(n);return}if(s==="play-list"){let a=i.visibleSongs.map(r=>r.id);gt(a,Number(e.dataset.index),Bt());return}la(n),t||m("\u5DF2\u8BBE\u4E3A\u4E0B\u4E00\u9996\u64AD\u653E",{tone:"success",duration:1500})}var Uc=[{id:"album",label:"\u4E13\u8F91",icon:"album",isOn:()=>i.config.showAlbumColumn!==!1,set:e=>{i.config.showAlbumColumn=e}}];function Lk(e,t){let n=[{kind:"label",label:"\u663E\u793A\u7684\u5217"}];for(let s of Uc)n.push({id:`col-${s.id}`,label:s.label,icon:s.icon,checked:s.isOn()});n.push({kind:"sep"}),n.push({id:"col-reset",label:"\u6062\u590D\u9ED8\u8BA4\u5217",icon:"refresh"}),an({x:e,y:t,items:n,onPick:s=>{if(s==="col-reset"){for(let o of Uc)o.set(!0);$(),m("\u5DF2\u6062\u590D\u9ED8\u8BA4\u5217",{duration:1400});return}let a=Uc.find(o=>`col-${o.id}`===s);if(!a)return;let r=!a.isOn();a.set(r),$(),m(r?`\u5DF2\u663E\u793A\u300C${a.label}\u300D\u5217`:`\u5DF2\u9690\u85CF\u300C${a.label}\u300D\u5217`,{duration:1400})}})}function Uh(e,t,n=null){let s=Be(t);if(!s)return;let a=!!s.online,r=mt(t),o=i.queue.includes(t),l=[{id:"play",label:"\u64AD\u653E",icon:"play"},{id:"play-next",label:"\u4E0B\u4E00\u9996\u64AD\u653E",icon:"arrow-right"},{id:"sep1",kind:"sep"},{id:"queue-add",label:o?"\u4ECE\u64AD\u653E\u5217\u8868\u79FB\u9664":"\u52A0\u5165\u64AD\u653E\u5217\u8868",icon:"queue"},{id:"like",label:r?"\u53D6\u6D88\u559C\u6B22":"\u52A0\u5165\u6211\u559C\u6B22",icon:"heart"},{id:"add-to",label:"\u52A0\u5165\u6B4C\u5355\u2026",icon:"plus"}];if(a||l.push({id:"cover",label:"\u66F4\u6362\u5C01\u9762\u2026",icon:"image"}),i.view==="queue")l.push({id:"sep2",kind:"sep"}),l.push({id:"remove-here",label:"\u4ECE\u64AD\u653E\u5217\u8868\u79FB\u9664",icon:"trash",danger:!0});else if(i.view==="playlist"&&i.playlistId){let d=ge(i.playlistId);d&&!d.locked&&(l.push({id:"sep2",kind:"sep"}),l.push({id:"remove-here",label:`\u4ECE\u300C${d.name}\u300D\u79FB\u9664`,icon:"trash",danger:!0}))}a||(l.push({id:"sep3",kind:"sep"}),l.push({id:"reveal",label:"\u5728\u6587\u4EF6\u5939\u4E2D\u663E\u793A",icon:"folder"}));let c=d=>{switch(d){case"play":{let p=i.visibleSongs.map(v=>v.id),h=p.indexOf(t);h<0?gt([t],0,{type:"online",id:null}):gt(p,h,Bt());break}case"cover":Vn(()=>Promise.resolve().then(()=>Hd),void 0).then(p=>p.openCoverPanel(t));break;case"play-next":la(t),m("\u5DF2\u8BBE\u4E3A\u4E0B\u4E00\u9996\u64AD\u653E",{tone:"success",duration:1500});break;case"queue-add":o?(ps(t),m("\u5DF2\u4ECE\u64AD\u653E\u5217\u8868\u79FB\u9664")):(ki([t]),m("\u5DF2\u52A0\u5165\u64AD\u653E\u5217\u8868",{tone:"success",duration:1500}));break;case"like":It(t),m(r?"\u5DF2\u4ECE\u300C\u6211\u559C\u6B22\u300D\u79FB\u9664":"\u5DF2\u52A0\u5165\u300C\u6211\u559C\u6B22\u300D",{tone:r?"info":"success",duration:1500});break;case"add-to":Ok(t);break;case"remove-here":i.view==="queue"?(ps(t),m("\u5DF2\u4ECE\u64AD\u653E\u5217\u8868\u79FB\u9664")):i.playlistId&&(ra(i.playlistId,[t]),m("\u5DF2\u4ECE\u6B4C\u5355\u79FB\u9664"));break;case"reveal":Vn(()=>Promise.resolve().then(()=>(Hs(),$u)).then(p=>p.t),[]).then(async p=>{try{await p.backend.revealInExplorer(s.path),m("\u5DF2\u5728\u6587\u4EF6\u5939\u4E2D\u663E\u793A",{duration:1800})}catch(h){m(`\u65E0\u6CD5\u5728\u6587\u4EF6\u5939\u4E2D\u663E\u793A\uFF1A${h?.message??h}`,{tone:"error",duration:4e3})}});break}};if(n)an({x:n.x,y:n.y,items:l,onPick:c});else{let d=e.getBoundingClientRect();an({x:d.left,y:d.bottom+6,items:l,onPick:c,align:"right"})}}function Ok(e){let t=i.playlists,{root:n}=ue({title:"\u52A0\u5165\u6B4C\u5355",body:u`
      <div class="setting__hint">点击歌单即可把这首歌加进去。</div>
      <div class="u-row u-wrap">
        ${t.map(s=>u` <button class="btn btn--sm" type="button" data-pl=${s.id}>
              <svg aria-hidden="true"><use href="#i-${s.id===He?"heart":"playlist"}"></use></svg>
              <span>${s.name}</span>
            </button>`)}
      </div>
    `,okText:"\u5B8C\u6210",cancelText:"\u5173\u95ED",onOk:()=>!0});n.addEventListener("click",s=>{let a=s.target.closest("[data-pl]");a&&Zr(a.dataset.pl,[e])})}var Rk=1500,qk=140,Nk=800,Wh=new WeakMap,Wc=new WeakMap;function Fk(e){e&&(clearTimeout(Wh.get(e)),e.classList.remove("is-located"),e.offsetWidth,e.classList.add("is-located"),Wh.set(e,window.setTimeout(()=>e.classList.remove("is-located"),Rk)))}function Tr(e){if(!e)return;let t=(Wc.get(e)??0)+1;Wc.set(e,t);try{e.scrollIntoView({block:"nearest",inline:"nearest"})}catch{Bk(e)}Wk(e,()=>{Wc.get(e)!==t||!e.isConnected||Fk(e)})}function Bk(e){let t=e.closest(".content-body, .queue-panel__body");if(!t)return;let n=e.getBoundingClientRect(),s=t.getBoundingClientRect(),a=t.classList.contains("content-body")?50:8,r=s.top+a;n.top<r?t.scrollTop-=r-n.top:n.bottom>s.bottom&&(t.scrollTop+=n.bottom-s.bottom)}function Uk(e){let t=e.parentElement;for(;t&&t!==document.documentElement;){let{overflowY:n}=getComputedStyle(t);if(n==="auto"||n==="scroll"||n==="overlay")return t;t=t.parentElement}return null}function Wk(e,t){let n=Uk(e);if(!n){requestAnimationFrame(t);return}let s=!1,a=0,r=0,o=n.scrollTop,l=n.scrollLeft,c=performance.now(),d=()=>{s||(s=!0,cancelAnimationFrame(a),clearTimeout(r),n.removeEventListener("scrollend",d),t())},p=()=>{let h=n.scrollTop,v=n.scrollLeft;if((h!==o||v!==l)&&(o=h,l=v,c=performance.now()),performance.now()-c>=qk){d();return}a=requestAnimationFrame(p)};n.addEventListener("scrollend",d),a=requestAnimationFrame(p),r=window.setTimeout(d,Nk)}function zc(e){let t=i.currentId;if(!t)return null;let n=e.querySelector(`.track[data-id="${CSS.escape(t)}"]`);return n?{el:n}:null}function zk(){let e=i.currentId;return e&&document.querySelector("#queue-panel-body")?.querySelector(`.queue-item[data-queue-id="${CSS.escape(e)}"]`)||null}function Hk({notify:e=!0}={}){if(!i.currentId)return e&&m("\u5F53\u524D\u6CA1\u6709\u6B63\u5728\u64AD\u653E\u7684\u6B4C\u66F2",{tone:"info",duration:1600}),!1;let t=document.getElementById("content-body"),n=t?zc(t):null;if(n)return Tr(n.el),!0;let s=t?.querySelector("mp-track-table");if(s?.revealRow?.(i.currentId)){let a=()=>{let r=t?zc(t):null;if(r){Tr(r.el);return}requestAnimationFrame(()=>{let o=t?zc(t):null;o&&Tr(o.el)})};return typeof s.updateComplete?.then=="function"?s.updateComplete.then(a):requestAnimationFrame(a),!0}return e&&m("\u5F53\u524D\u64AD\u653E\u7684\u6B4C\u66F2\u4E0D\u5728\u8FD9\u4E2A\u5217\u8868\u91CC",{tone:"info",duration:2200}),!1}function cm({notify:e=!0}={}){if(!i.queue.length)return e&&m("\u64AD\u653E\u5217\u8868\u662F\u7A7A\u7684",{tone:"info",duration:1600}),!1;let t=zk();return t?(Tr(t),!0):(e&&m("\u5F53\u524D\u64AD\u653E\u7684\u6B4C\u66F2\u4E0D\u5728\u64AD\u653E\u5217\u8868\u91CC",{tone:"info",duration:2200}),!1)}var dm=0;function um(){dm=Date.now()}function pm(){return Date.now()-dm<260}function jk(e=!1){let t=i.visibleSongs.map(n=>n.id);if(t.length){if(e)for(let n=t.length-1;n>0;n-=1){let s=Math.floor(Math.random()*(n+1));[t[n],t[s]]=[t[s],t[n]]}gt(t,0,Bt()),m(e?"\u5DF2\u968F\u673A\u64AD\u653E":`\u5F00\u59CB\u64AD\u653E ${N(t.length)} \u9996`,{duration:1600})}}var Vk={library:"\u672C\u5730\u6B4C\u66F2",queue:"\u64AD\u653E\u5217\u8868",playlist:"\u6B4C\u5355"},Kk=120;function Gk(){let e=null,t=()=>{e!==null&&(clearTimeout(e),e=null,$())},n=()=>{e!==null&&clearTimeout(e),e=setTimeout(t,Kk)};return n.flush=t,n}var Yk={commit:$,rescan:()=>qa({manual:!0})},Er=class extends qe{constructor(){super(),this._commitFilter=Gk()}onDisconnected(){this._commitFilter?.flush?.()}render(){let t=i.view,n=t==="playlist"?ge(i.playlistId):null;return u`
      <main class="main" id="main" @click=${s=>this.onMainClick(s)}>
        <div class="content-header" id="content-header" @click=${s=>this.onHeaderClick(s)}>
          <div class="content-header__titles">
            <h1 class="content-header__title" id="content-title">
              ${t==="playlist"&&n?n.name:Vk[t]||"\u672C\u5730\u6B4C\u66F2"}
            </h1>
            <p class="content-header__subtitle" id="content-subtitle" data-scanning=${String(i.scanning)}>
              ${this.subtitle(t,n)}
            </p>
          </div>
          <div class="content-header__actions">
            <div class="content-filter" id="content-filter" ?hidden=${t!=="library"}>
              <div class="content-filter__field">
                ${g("search","content-filter__icon")}
                <input
                  class="content-filter__input"
                  id="content-filter-input"
                  type="text"
                  placeholder="筛选本地歌曲"
                  autocomplete="off"
                  spellcheck="false"
                  aria-label="筛选本地歌曲"
                  .value=${i.query}
                  @input=${s=>{i.query=s.target.value,this._commitFilter()}}
                  @keydown=${s=>{s.key==="Escape"&&(s.preventDefault(),uc(),s.target.blur())}}
                />
                <button
                  class="content-filter__clear u-hit"
                  id="content-filter-clear"
                  type="button"
                  aria-label="清空筛选"
                  ?hidden=${i.query.length===0}
                  @click=${()=>{uc(),this.querySelector("#content-filter-input")?.focus()}}
                >
                  ${g("close")}
                </button>
              </div>
              <span class="content-filter__count" id="content-filter-count">
                ${i.query.trim()?`\u5339\u914D ${N(i.visibleSongs.length)} \u9996`:""}
              </span>
            </div>
            <div class="content-header__tools" id="content-tools">${this.toolbar()}</div>
          </div>
        </div>
        <div class="content-body" id="content-body">${this.body()}</div>
      </main>
    `}subtitle(t,n){let s=i.visibleSongs,a=s.reduce((r,o)=>r+o.duration,0);if(t==="library"){let r=i.lastScan;return`${N(s.length)} \u9996 \xB7 \u5171 ${Ws(a)} \xB7 ${N(ia().length)} \u4E2A\u6587\u4EF6\u5939${r&&r.excluded?` \xB7 \u5DF2\u8FC7\u6EE4 ${N(r.excluded)} \u4E2A\u6587\u4EF6`:""}`}if(t==="queue"){let r=i.currentId?s.findIndex(o=>o.id===i.currentId):-1;return`${N(s.length)} \u9996 \xB7 \u5171 ${Ws(a)}${r>=0?` \xB7 \u6B63\u5728\u64AD\u653E\u7B2C ${r+1} \u9996`:""}`}return t==="playlist"&&n?`${N(s.length)} \u9996 \xB7 \u5171 ${Ws(a)} \xB7 ${n.locked?"\u9ED8\u8BA4\u6B4C\u5355\uFF08\u4E0D\u53EF\u5220\u9664\uFF09":"\u81EA\u5B9A\u4E49\u6B4C\u5355"}`:t==="playlist"?"\u6B4C\u5355\u4E0D\u5B58\u5728":""}toolbar(){let t=i.view,n=u`<button class="btn btn--primary" type="button" data-tool="play-all">
      ${g("play")}<span>播放全部</span>
    </button>`,s=u`<button
      class="btn btn--icon"
      type="button"
      data-tool="locate"
      data-tip="定位到当前播放"
      aria-label="定位到当前播放"
    >
      ${g("disc")}
    </button>`,a=cs(i.sortKey),r=u`
      <button
        class="btn btn--sort"
        type="button"
        data-tool="sort"
        data-dir=${i.sortDir}
        data-tip="排序方式"
        aria-haspopup="menu"
        aria-label="排序方式：${a?.label??"\u6DFB\u52A0\u65F6\u95F4"}，${fi(i.sortDir)}"
      >
        ${g("sort")}
        <span>${a?.label??"\u6DFB\u52A0\u65F6\u95F4"}</span>
        <span class="btn__dir" aria-hidden="true"
          >${g(i.sortDir==="desc"?"chevron-down":"chevron-up")}</span
        >
      </button>
    `;if(t==="queue")return u`
        <button class="btn" type="button" data-tool="queue-clear">${g("trash")}<span>清空列表</span></button>
        ${n}${s}
      `;if(t==="playlist"){if(i.playlistSelecting){let o=i.selectedIds.size,l=i.visibleSongs.length>0&&i.visibleSongs.every(c=>i.selectedIds.has(c.id));return u`
          <span class="toolbar__selinfo">已选 ${N(o)} 首</span>
          <button class="btn btn--sm" type="button" data-tool="sel-all">
            ${g("check")}<span>${l?"\u53D6\u6D88\u5168\u9009":"\u5168\u9009"}</span>
          </button>
          <button class="btn btn--sm btn--danger" type="button" data-tool="sel-remove" ?disabled=${!o}>
            ${g("trash")}<span>移除所选</span>
          </button>
          <button class="btn btn--sm btn--primary" type="button" data-tool="pl-select">
            ${g("close")}<span>完成</span>
          </button>
        `}return u`
        ${r}${n}
        <button class="btn" type="button" data-tool="pl-select">${g("check")}<span>多选</span></button>
        <button class="btn" type="button" data-tool="pl-add">${g("plus")}<span>添加</span></button>
        ${s}
      `}return u`
      <button class="btn" type="button" data-tool="rescan">${g("refresh")}<span>重新扫描</span></button>
      ${r}${n}${s}
    `}body(){let t=i.view;if(!i.visibleSongs.length){let n=i.query.trim()?"search":t==="library"?"library":t==="queue"?"queue":"playlist";return this.empty(n)}return Pw(`${t}|${i.playlistId??""}`,u`<div class="page"><mp-track-table></mp-track-table></div>`)}empty(t){let n={library:{icon:"music",title:"\u66F2\u5E93\u8FD8\u6CA1\u6709\u6B4C\u66F2",desc:"\u5728\u8BBE\u7F6E\u91CC\u6DFB\u52A0\u672C\u5730\u97F3\u4E50\u6587\u4EF6\u5939\uFF0C\u7A0B\u5E8F\u4F1A\u81EA\u52A8\u626B\u63CF\u5E76\u76D1\u542C\u8FD9\u4E9B\u6587\u4EF6\u5939\u7684\u53D8\u5316\u3002",ok:"\u6DFB\u52A0\u97F3\u4E50\u6587\u4EF6\u5939",act:"add-folder"},queue:{icon:"queue",title:"\u64AD\u653E\u5217\u8868\u662F\u7A7A\u7684",desc:"\u4ECE\u300C\u672C\u5730\u6B4C\u66F2\u300D\u6216\u4EFB\u610F\u6B4C\u5355\u91CC\u9009\u62E9\u6B4C\u66F2\u52A0\u5165\u64AD\u653E\u5217\u8868\u3002",ok:"\u53BB\u672C\u5730\u6B4C\u66F2",act:"goto-library"},playlist:{icon:"playlist",title:"\u8FD9\u4E2A\u6B4C\u5355\u8FD8\u6CA1\u6709\u6B4C\u66F2",desc:"\u5728\u300C\u672C\u5730\u6B4C\u66F2\u300D\u91CC\u70B9\u51FB\u6BCF\u9996\u6B4C\u540E\u9762\u7684\u7231\u5FC3\u6216\u66F4\u591A\u83DC\u5355\uFF0C\u628A\u6B4C\u66F2\u52A0\u8FDB\u6765\u3002",ok:"\u53BB\u672C\u5730\u6B4C\u66F2",act:"goto-library"},search:{icon:"search",title:"\u6CA1\u6709\u627E\u5230\u5339\u914D\u7684\u6B4C\u66F2",desc:"\u6362\u4E2A\u5173\u952E\u8BCD\u8BD5\u8BD5\uFF0C\u6216\u6E05\u7A7A\u641C\u7D22\u6846\u3002",ok:"\u6E05\u7A7A\u641C\u7D22",act:"clear-search"}},s=n[t]||n.library;return u`
      <div class="empty" data-empty=${t}>
        <svg class="empty__art" aria-hidden="true"><use href="#i-${s.icon}"></use></svg>
        <div class="empty__title">${s.title}</div>
        ${s.desc?u`<div class="empty__desc">${s.desc}</div>`:A}
        ${s.ok?u`<div class="empty__actions">
                <button class="btn btn--primary" type="button" data-empty-act=${s.act}>${s.ok}</button>
              </div>`:A}
      </div>
    `}async onMainClick(t){let n=t.target.closest("[data-empty-act]")?.dataset.emptyAct;n&&(n==="add-folder"?await md({dataset:{act:"add-folder"}},Yk):n==="goto-library"?As("library"):n==="clear-search"&&uc())}async onHeaderClick(t){let n=t.target.closest("[data-tool]")?.dataset.tool;n&&await this.handleTool(n)}openSortMenu(){let t=this.querySelector('[data-tool="sort"]'),n=[{id:"hdr-field",kind:"label",label:"\u6392\u5E8F\u65B9\u5F0F"},...aa.map(s=>({id:`field:${s.key}`,label:s.label,checked:s.key===i.sortKey})),{id:"sep-dir",kind:"sep"},{id:"hdr-dir",kind:"label",label:"\u6392\u5217\u987A\u5E8F"},{id:"dir:asc",label:"\u5347\u5E8F",checked:i.sortDir==="asc"},{id:"dir:desc",label:"\u964D\u5E8F",checked:i.sortDir==="desc"}];an({anchor:t,align:"left",items:n,onPick:s=>{if(s.startsWith("field:")){let a=s.slice(6);if(a===i.sortKey){m(`\u5DF2\u7ECF\u6309\u300C${cs(a)?.label??a}\u300D\u6392\u5E8F`,{duration:1400});return}Li(a);return}if(s.startsWith("dir:")){let a=s.slice(4);if(a===i.sortDir)return;Oi(a)}}})}async handleTool(t){switch(t){case"rescan":qa({manual:!0});break;case"sort":this.openSortMenu();break;case"play-all":jk(!1);break;case"locate":Hk();break;case"queue-clear":da(),m("\u64AD\u653E\u5217\u8868\u5DF2\u6E05\u7A7A");break;case"pl-select":oa(!i.playlistSelecting);break;case"pl-add":i.playlistId&&Tw(i.playlistId);break;case"sel-all":{let n=i.visibleSongs.length>0&&i.visibleSongs.every(s=>i.selectedIds.has(s.id));$i(n?[]:i.visibleSongs.map(s=>s.id));break}case"sel-remove":{let n=[...i.selectedIds];if(!n.length)break;let s=ge(i.playlistId),a=ra(i.playlistId,n);oa(!1),m(`\u5DF2\u4ECE\u300C${s?.name??"\u6B4C\u5355"}\u300D\u79FB\u9664 ${N(a)} \u9996`,{tone:"success"});break}}}};Re(Er,"deps",t=>[t.view,t.playlistId,t.playlistVersion,t.query,t.visibleVersion,t.visibleSongs.length,t.sortKey,t.sortDir,t.songs.length,t.folders.length,t.scanning,t.playlistSelecting,t.selectedIds,t.lastScan?.at??0,t.config.listDensity]);Se("mp-content",Er);var Xk=wd(class extends $d{render(){return Je}update(e,[t]){let n=e.element;if(!n)return Je;ml(n);let s=t||Xe;if(n.getAttribute("src")===s)return Je;if(s.startsWith("data:"))return n.src=s,Je;n.__coverWant=s;let a=new Image;a.decoding="async";let r=()=>{n.__coverWant===s&&(n.src=s)};return a.addEventListener("load",r),a.addEventListener("error",r),a.src=s,Je}}),zd=e=>Xk(e),Jk=300,Qk=8,hm=56;function Zk(e,t,n,s,a=Qk){let r=Math.max(0,Math.floor(Number(e))||0),o=Number(s)>0?Number(s):hm,l=Math.max(0,Math.floor(Number(a))||0),c=Math.max(0,Number(t)||0),d=Math.max(0,Number(n)||0),p=Math.max(1,Math.ceil(d/o)+l*2+1),h=Math.min(r,Math.max(0,Math.floor(c/o)-l)),v=Math.min(r,h+p);return r>0&&v<=h&&(v=r,h=Math.max(0,r-p)),{start:h,end:v,padTop:h*o,padBottom:Math.max(0,(r-v)*o),rowH:o}}function eS(e,t){return e==="library"&&(Math.floor(Number(t))||0)>Jk}var Pr=class extends qe{get mode(){return i.view==="queue"?"playlist":"library"}get selecting(){return i.view==="playlist"&&i.playlistSelecting}constructor(){super(),this._rowH=0,this._scroller=null,this._scrollRaf=0,this._resizeBound=!1,this._onScroll=()=>this.scheduleWindowUpdate(),this._onResize=()=>this.scheduleWindowUpdate()}onConnected(){this._resizeBound||(window.addEventListener("resize",this._onResize),this._resizeBound=!0)}scheduleWindowUpdate(){this._scrollRaf||(this._scrollRaf=requestAnimationFrame(()=>{this._scrollRaf=0,this.windowing()&&this.requestUpdate()}))}updated(){i.view==="queue"?this.bindQueueSort():this._sortable&&(this._sortable.destroy(),this._sortable=null),this.syncWindowState()}disconnectedCallback(){this._scrollRaf&&cancelAnimationFrame(this._scrollRaf),this._scrollRaf=0,this._resizeBound&&(window.removeEventListener("resize",this._onResize),this._resizeBound=!1),this._scroller?.removeEventListener("scroll",this._onScroll),this._scroller=null,this._sortable?.destroy(),this._sortable=null,super.disconnectedCallback()}windowing(){return eS(this.mode,i.visibleSongs.length)}syncScroller(){let t=this.closest(".content-body");t!==this._scroller&&(this._scroller?.removeEventListener("scroll",this._onScroll),this._scroller=t,t?.addEventListener("scroll",this._onScroll,{passive:!0}))}syncWindowState(){this.syncScroller();let t=this.querySelector(".track");if(!t)return;let n=t.getBoundingClientRect().height;!(n>0)||Math.abs(n-this._rowH)<=.5||(this._rowH=n,this.windowing()&&this.requestUpdate())}rowHeight(){if(this._rowH>0)return this._rowH;let t=getComputedStyle(this.querySelector(".tracks")||this),n=a=>{let r=parseFloat(t.getPropertyValue(a));return Number.isFinite(r)&&r>0?r:0},s=n("--row-h")||hm;return i.config.listDensity==="compact"?n("--row-h-compact")||44:i.config.listDensity==="roomy"?s+12:s}headHeight(){return this.querySelector(".tracks__head")?.getBoundingClientRect().height||0}scrolledPx(){let t=this._scroller,n=this.querySelector(".tracks__body");if(!t||!n)return 0;let s=t.getBoundingClientRect(),a=n.getBoundingClientRect();return Math.max(0,s.top+this.headHeight()-a.top)}viewportH(){let t=this._scroller;return t?Math.max(0,t.clientHeight-this.headHeight()):Math.max(0,window.innerHeight*.6)}windowRange(){return this.windowing()?Zk(i.visibleSongs.length,this.scrolledPx(),this.viewportH(),this.rowHeight()):null}revealRow(t){let n=i.visibleSongs.findIndex(h=>h.id===t);if(n<0)return!1;if(!this.windowing())return!0;let s=this._scroller,a=this.querySelector(".tracks__body");if(!s||!a)return!0;let r=this.rowHeight(),o=this.headHeight(),l=s.getBoundingClientRect(),c=a.getBoundingClientRect().top-l.top+s.scrollTop,d=Math.max(1,Math.floor(Math.max(0,s.clientHeight-o)/r)),p=Math.max(0,c+Math.max(0,n-Math.floor(d/2))*r-o);return typeof s.scrollTo=="function"?s.scrollTo({top:p,behavior:"instant"}):s.scrollTop=p,this.requestUpdate(),!0}bindQueueSort(){let t=this.querySelector(".tracks__body");t&&(this._sortable&&this._sortable.el===t||(this._sortable?.destroy(),this._sortable=F.create(t,{handle:"[data-handle]",draggable:".track",animation:0,ghostClass:"is-dragging",chosenClass:"is-dragging",onEnd:n=>{um();let s=n.oldIndex,a=n.newIndex;if(s==null||a==null||s===a)return;let r=n.from,o=Array.from(r.children).filter(l=>l!==n.item);r.insertBefore(n.item,o[s]??null),ca(s,a),m("\u5DF2\u8C03\u6574\u64AD\u653E\u987A\u5E8F \xB7 \u64AD\u653E\u6A21\u5F0F\u5DF2\u5207\u56DE\u5217\u8868\u5FAA\u73AF",{duration:1800})}})))}render(){let t=this.mode,n=i.visibleSongs,s=this.windowRange();return u`
      <!-- 事件委托挂在 .tracks 上（范围含表头）：排序按钮在 .tracks__head 里，
           只挂 .tracks__body 的话点表头排序会没有反应。 -->
      <div
        class="tracks"
        data-mode=${t}
        data-density=${i.config.listDensity||"cozy"}
        data-album=${i.config.showAlbumColumn===!1?"off":"on"}
        @click=${a=>this.onClick(a)}
        @dblclick=${a=>this.onDblClick(a)}
        @contextmenu=${a=>this.onContextMenu(a)}
      >
        ${this.headTemplate(t)}
        <div class="tracks__body">
          ${s?u`<div
                    class="tracks__pad"
                    data-pad="top"
                    style=${"height:"+s.padTop+"px"}
                    aria-hidden="true"
                  ></div>
                  ${ut(n.slice(s.start,s.end),a=>a.id,(a,r)=>this.rowTemplate(a,s.start+r,t))}
                  <div
                    class="tracks__pad"
                    data-pad="bottom"
                    style=${"height:"+s.padBottom+"px"}
                    aria-hidden="true"
                  ></div>`:ut(n,a=>a.id,(a,r)=>this.rowTemplate(a,r,t))}
        </div>
      </div>
    `}headTemplate(t){let n=t!=="playlist",s=(a,r,o="")=>{if(!n)return u`<div class="tracks__sort ${o}" data-static="1">${r}</div>`;let l=["tracks__sort",o,i.sortKey===a&&i.sortDir==="asc"?"is-asc":""].filter(Boolean).join(" ");return u`<button
        class=${l}
        type="button"
        data-sort=${a}
        data-dir=${i.sortKey===a?i.sortDir:A}
      >
        ${r}${g("chevron-down")}
      </button>`};return u`
      <div class="tracks__head" data-mode=${t}>
        <div class="col-index">#</div>
        <div class="col-cover"></div>
        ${s("title","\u6807\u9898")} ${s("album","\u4E13\u8F91","col-album")} ${s("duration","\u65F6\u957F")}
        <div class="col-heart" title="我喜欢">${g("heart")}</div>
        <div class="col-more"></div>
      </div>
    `}rowTemplate(t,n,s){let a=this.selecting,r=t.id===i.currentId,o=mt(t.id),l=a&&i.selectedIds.has(t.id);return u`
      <div
        class="track"
        data-id=${t.id}
        data-index=${n}
        data-selectable=${a?"1":"0"}
        aria-selected=${String(l)}
        aria-current=${String(r)}
        data-playing=${r&&i.playing?"true":"false"}
      >
        ${s==="playlist"?u`<div class="track__handle" data-handle="1" title="拖动排序">${g("grip")}</div>`:A}
        <div class="track__index">${this.indexCell(t,n,a)}</div>
        <div class="track__cover">
          <img src=${zd(Rt(t))} alt="" loading="lazy" draggable="false" />
        </div>
        <div class="track__main">
          <div class="track__title" data-new=${pi(t.id)?"1":A}>${t.title}</div>
          <div class="track__sub">
            <span class="track__artist">${t.artist}</span>
            <span class="track__tag">${t.ext}</span>
          </div>
        </div>
        <div class="track__album u-ellipsis">${t.album}</div>
        <div class="track__time">${Qt(t.duration)}</div>
        <button
          class="track__heart"
          type="button"
          data-act="like"
          aria-pressed=${String(o)}
          aria-label="加入我喜欢"
          data-tip=${o?"\u53D6\u6D88\u559C\u6B22":"\u52A0\u5165\u6211\u559C\u6B22"}
        >
          ${g("heart")}
        </button>
        <button class="track__more" type="button" data-act="more" aria-label="更多操作" aria-expanded="false">
          ${g("more")}
        </button>
      </div>
    `}indexCell(t,n,s){if(s){let a=i.selectedIds.has(t.id);return u`<span class="track__check" role="checkbox" aria-checked=${String(a)}>${g("check")}</span>`}return u`
      <span class="track__num u-num">${n+1}</span>
      <div class="track__bars"><span></span><span></span><span></span><span></span></div>
      <button class="track__play" type="button" data-act="play" aria-label="播放 ${t.title}">
        ${g("play")}
      </button>
    `}onClick(t){if(pm())return;let n=t.target.closest(".track");if(n&&i.view==="playlist"&&i.playlistSelecting){t.preventDefault(),wi(n.dataset.id);return}let s=t.target.closest("[data-sort]");if(s){Ri(s.dataset.sort);return}let a=t.target.closest("[data-act]");if(!a){let l=t.target.closest(".track");l&&Dk(l,{silent:!1});return}let r=a.closest(".track"),o=r?.dataset.id;if(o)switch(a.dataset.act){case"play":{let l=i.visibleSongs.map(c=>c.id);gt(l,Number(r.dataset.index),Bt());break}case"like":{It(o);let l=mt(o);m(l?"\u5DF2\u52A0\u5165\u300C\u6211\u559C\u6B22\u300D":"\u5DF2\u4ECE\u300C\u6211\u559C\u6B22\u300D\u79FB\u9664",{tone:l?"success":"info",duration:1500});break}case"more":Uh(a,o);break}}onDblClick(t){if(i.view==="playlist"&&i.playlistSelecting)return;let n=t.target.closest(".track");if(!n)return;let s=i.visibleSongs.map(a=>a.id);gt(s,Number(n.dataset.index),Bt()),i.playerOpen=!0,i.pvMode=i.config.playerViewMode,$()}onContextMenu(t){if(t.target.closest(".tracks__head")){t.preventDefault(),Lk(t.clientX,t.clientY);return}let n=t.target.closest(".track");n&&(t.preventDefault(),Uh(null,n.dataset.id,{x:t.clientX,y:t.clientY}))}};Re(Pr,"deps",t=>[t.view,t.playlistId,t.visibleVersion,t.sortKey,t.sortDir,t.config.listDensity,t.config.showAlbumColumn,t.playlistSelecting,t.selectedIds,t.currentId,t.playing,t.likedIds,on(),t.visibleSongs.length,ui()]);Se("mp-track-table",Pr);var Dr=class extends qe{onConnected(){this._unsubscribers.push(Ft(()=>Oh()))}updated(){Oh()}render(){let t=ot(),n=this.coverList(t).length>1,s=i.config.coverCarousel===!0&&n,a=!t||!!t.online,r=qs();return u`
      <section
        class="playerview"
        id="playerview"
        hidden
        data-state="closed"
        data-skin="classic"
        data-lyrics=${i.config.showLyrics===!1?"off":"on"}
        aria-label="播放界面"
      >
        <div class="playerview__head">
          <button class="playerview__back" id="btn-player-back" type="button" @click=${()=>ho()}>
            ${g("arrow-left")}
            <span>返回</span>
          </button>
          <span class="u-spacer"></span>
          <div class="viewmode" id="playerview-cover-group" role="group" aria-label="封面">
            <button
              class="viewmode__btn"
              id="btn-player-cover"
              type="button"
              data-tip="更换封面"
              aria-label="更换封面"
              ?disabled=${a}
              @click=${()=>this.openCoverPanel(t)}
            >
              ${g("image")}
            </button>
            <button
              class="viewmode__btn"
              id="btn-cover-carousel"
              type="button"
              aria-pressed=${String(s)}
              ?disabled=${!n}
              data-tip=${this.carouselTip(n,s)}
              aria-label="封面轮播"
              @click=${()=>this.toggleCarousel()}
            >
              ${g("slideshow")}
            </button>
          </div>
          <div class="viewmode" id="playerview-mode" role="group" aria-label="播放界面样式">
            ${ut(r,o=>o.id,o=>u`
                <button
                  class="viewmode__btn"
                  type="button"
                  data-pv-skin=${o.id}
                  data-pv-mode=${o.id}
                  aria-pressed=${String(i.pvMode===o.id)}
                  data-tip=${o.name||o.id}
                  aria-label=${o.name||o.id}
                  @click=${()=>Rs(o.id)}
                >
                  ${this.skinIcon(o)}
                </button>
              `)}
          </div>
        </div>
        <div
          class="playerview__stage"
          id="playerview-stage"
          @click=${o=>{o.target.closest(".disc__label, .disc__platter")&&Z$()}}
        ></div>
      </section>
    `}skinIcon(t){return t.iconUrl?u`<i class="skin-icon" style=${`--skin-icon:${Va(t.iconUrl)}`}></i>`:g(t.icon||"disc")}coverList(t){if(!t)return[];let n=i.coverSets.get(t.id)?.items;return Array.isArray(n)?n.filter(s=>s?.preview):[]}carouselTip(t,n){if(!t)return"\u8FD9\u9996\u6B4C\u53EA\u6709\u4E00\u5F20\u5C01\u9762";let s=Number(i.config.coverCarouselInterval)||10;return n?"\u5173\u95ED\u5C01\u9762\u8F6E\u64AD":`\u5F00\u542F\u5C01\u9762\u8F6E\u64AD\uFF08\u6BCF ${s} \u79D2\u6362\u4E00\u5F20\uFF09`}openCoverPanel(t){!t||t.online||Vn(()=>Promise.resolve().then(()=>Hd),void 0).then(n=>n.openCoverPanel(t.id))}toggleCarousel(){i.config.coverCarousel=!i.config.coverCarousel,$(),m(i.config.coverCarousel?`\u5DF2\u5F00\u542F\u5C01\u9762\u8F6E\u64AD\uFF08\u6BCF ${Number(i.config.coverCarouselInterval)||10} \u79D2\u6362\u4E00\u5F20\uFF09`:"\u5DF2\u5173\u95ED\u5C01\u9762\u8F6E\u64AD",{duration:1600})}};Re(Dr,"deps",t=>[t.playerOpen,t.pvMode,t.currentId,t.playing,t.duration,t.config.showLyrics,t.config.coverCarousel,t.config.coverCarouselInterval,on(),Xf()]);Se("mp-playerview",Dr);function Ns(e,t={}){let n=t.min??0,s=t.max??1,a=t.step??.001,r=At(t.value??n,n,s),o=!1,l=e.querySelector(".slider__fill"),c=e.querySelector(".slider__thumb"),d=e.querySelector(".slider__bubble");e.setAttribute("aria-valuemin",String(n)),e.setAttribute("aria-valuemax",String(s));function p(){let k=s===n?0:(r-n)/(s-n)*100;l&&(l.style.transform=`scaleX(${k/100})`),c&&(c.style.left=`${k}%`),d&&t.format&&(d.textContent=t.format(r)),e.setAttribute("aria-valuenow",String(Math.round(k)))}function h(k){let C=e.getBoundingClientRect();if(C.width<=0)return r;let L=At((k.clientX-C.left)/C.width,0,1),O=n+L*(s-n),S=Math.round(O/a)*a;return At(Number(S.toFixed(6)),n,s)}function v(k){if(!d)return;let C=e.getBoundingClientRect(),L=At(k.clientX-C.left,0,C.width);d.style.left=`${L}px`}e.addEventListener("pointerdown",k=>{e.dataset.disabled!=="true"&&(k.preventDefault(),o=!0,e.dataset.dragging="true",e.setPointerCapture?.(k.pointerId),r=h(k),p(),v(k),t.onChange?.(r))}),e.addEventListener("pointermove",k=>{v(k),o&&(r=h(k),p(),t.onChange?.(r))});let w=k=>{o&&(o=!1,e.dataset.dragging="false",e.releasePointerCapture?.(k.pointerId),t.onCommit?.(r))};return e.addEventListener("pointerup",w),e.addEventListener("pointercancel",w),e.addEventListener("keydown",k=>{if(e.dataset.disabled==="true")return;let C=(s-n)/10,L=a*10,O=r;switch(k.key){case"ArrowRight":case"ArrowUp":O=r+L;break;case"ArrowLeft":case"ArrowDown":O=r-L;break;case"PageUp":O=r+C;break;case"PageDown":O=r-C;break;case"Home":O=n;break;case"End":O=s;break;default:return}k.preventDefault(),r=At(Number(O.toFixed(6)),n,s),p(),t.onChange?.(r),t.onCommit?.(r)}),p(),{get value(){return r},set(k,{silent:C=!1}={}){let L=At(k,n,s);L===r&&!C||(r=L,p(),C||t.onChange?.(r))},setDisabled(k){e.dataset.disabled=k?"true":"false"},text(k=r){return t.format?t.format(k):String(k)},paint:p}}var Hc={sequence:{icon:"repeat",label:"\u5217\u8868\u5FAA\u73AF"},"loop-all":{icon:"repeat",label:"\u5217\u8868\u5FAA\u73AF"},"loop-one":{icon:"repeat-one",label:"\u5355\u66F2\u5FAA\u73AF"},shuffle:{icon:"shuffle",label:"\u968F\u673A\u64AD\u653E"}};function fm(e){let t=typeof e=="boolean"?e:!i.queueOpen;i.queueOpen=t,t&&(i.optionsOpen=!1),$()}function mm(e){let t=typeof e=="boolean"?e:!i.optionsOpen;i.optionsOpen=t,t&&(i.queueOpen=!1),$()}function gm(e){let t=typeof e=="boolean"?e:!i.sleepOpen;i.sleepOpen=t,$()}function tS(e){let t=Math.round(Number(e)||0);if(t<=0){vm("\u5DF2\u53D6\u6D88\u5B9A\u65F6\u505C\u6B62");return}i.sleepTimer={type:"duration",until:Date.now()+t*6e4,minutes:t},$(),m(`${t} \u5206\u949F\u540E\u505C\u6B62\u64AD\u653E`,{duration:1800})}function vm(e){i.sleepTimer=null,$(),m(e,{duration:1400})}function nS(e){i.config.sleepAfterSong=!!e,$(),m(i.config.sleepAfterSong?"\u5DF2\u5F00\u542F\uFF1A\u5012\u8BA1\u65F6\u7ED3\u675F\u540E\u7B49\u5F53\u524D\u6B4C\u66F2\u64AD\u5B8C\u518D\u505C":"\u5DF2\u5173\u95ED\uFF1A\u5012\u8BA1\u65F6\u7ED3\u675F\u540E\u7ACB\u5373\u505C\u6B62",{duration:2200})}function sS(){let e=i.sleepTimer;if(!(e?.type!=="duration"||Date.now()<e.until)){if(i.config.sleepAfterSong===!0&&i.playing&&i.currentId){i.sleepTimer={type:"after-song"},$(),m("\u5B9A\u65F6\u5230\u70B9\uFF1A\u7B49\u8FD9\u9996\u64AD\u5B8C\u5C31\u505C",{duration:2400});return}i.sleepTimer=null,i.playing?Ut():$(),m("\u5DF2\u6309\u5B9A\u65F6\u505C\u6B62\u64AD\u653E",{duration:1800})}}var Lr=class extends qe{constructor(){super(),this._progress=null,this._volume=null,this._tick=null}onConnected(){this._tick=setInterval(()=>{i.sleepTimer&&this.requestUpdate()},1e3),this._unsubscribers.push(Ft(()=>{this.isConnected&&this.paintProgress()}))}onDisconnected(){this._tick&&clearInterval(this._tick),this._tick=null}paintProgress(){if(t$()){let r=this.querySelector("#time-current");r&&r.textContent!=="--:--"&&(r.textContent="--:--"),this._progress?.set(0,{silent:!0}),this._progress?.setDisabled(!0);return}let t=Math.round(i.position),n=Math.round(i.duration||0),s=this.querySelector("#time-current");if(s){let r=Qt(i.position);s.textContent!==r&&(s.textContent=r)}let a=this.querySelector("#progress");a&&a.dataset.dragging!=="true"&&n>0&&this._progress?.set(t/n*1e3,{silent:!0}),this._progress?.setDisabled(n<=0)}firstUpdated(){let t=this.querySelector("#progress");this._progress=Ns(t,{min:0,max:1e3,step:1,value:0,format:n=>Qt(n/1e3*(i.duration||0)),onChange:n=>{i.duration&&(i.position=n/1e3*i.duration,this.requestUpdate())},onCommit:n=>{i.duration&&$t(n/1e3*i.duration)}}),this._volume=Ns(this.querySelector("#volume"),{min:0,max:1,step:.01,value:i.volume,format:n=>`${Math.round(n*100)}`,onChange:n=>{gs(n),ad(),this.requestUpdate()}})}updated(){this.paintProgress();let t=i.muted?0:i.volume,n=this.querySelector("#volume");n&&n.dataset.dragging!=="true"&&this._volume?.set(t,{silent:!0}),sS()}render(){let t=ot(),n=i.currentId?mt(i.currentId):!1,s=Hc[i.playMode]||Hc.sequence,a=i.muted?0:i.volume,r=a===0?"volume-mute":a<.5?"volume-low":"volume-high",o=t?Rt(t):"",l=i.sleepTimer,c=l?.type==="duration"?Math.max(1,Math.ceil((l.until-Date.now())/6e4)):0,d=ds(i.queue).length;return u`
      <footer class="playerbar" id="playerbar">
        <div class="playerbar__progress">
          <!-- #time-current 的文本由 updated() 直接写入，这里刻意不绑定（见那里的说明） -->
          <span class="progress__time" id="time-current"></span>
          <div
            class="slider"
            id="progress"
            role="slider"
            tabindex="0"
            aria-label="播放进度"
            aria-valuemin="0"
            aria-valuemax="100"
            aria-valuenow="0"
            data-disabled="false"
          >
            <!-- 注意：.slider 内部（轨道 / 滑块 / 气泡）由 slider.js 直接写样式与文本，
                 所以这里**不能**给它们挂 Lit 绑定 —— 两方都写同一个节点会让
                 Lit 的标记节点被 textContent 覆盖掉（Lit 会报 "Cannot set properties
                 of null"）。气泡里的时间由 createSlider 的 format 负责。 -->
            <div class="slider__rail">
              <div class="slider__fill" id="progress-fill"></div>
            </div>
            <div class="slider__thumb"></div>
            <div class="slider__bubble" id="progress-bubble"></div>
          </div>
          <span class="progress__time progress__time--total" id="time-total">${Qt(i.duration)}</span>
        </div>

        <div class="playerbar__row">
          <div class="playerbar__now">
            <button
              class="playerbar__cover"
              id="bar-cover"
              type="button"
              data-tip="播放详情页"
              aria-label="播放详情页"
              @click=${()=>hd()}
            >
              <img id="bar-cover-img" alt=${t?`${t.title} \u5C01\u9762`:""} src=${zd(o)} />
              <svg class="playerbar__cover-icon"><use href="#i-expand"></use></svg>
            </button>
            <div class="playerbar__meta" id="bar-meta" data-tip="播放详情页" @click=${()=>hd()}>
              <span class="playerbar__title" id="bar-title">${t?t.title:"\u672A\u5728\u64AD\u653E"}</span>
              <span class="playerbar__sub" id="bar-sub">
                ${t?`${t.artist} \xB7 ${t.album}`:"\u9009\u62E9\u4E00\u9996\u6B4C\u66F2\u5F00\u59CB"}
              </span>
            </div>
            <button
              class="playerbar__heart"
              id="bar-heart"
              type="button"
              aria-pressed=${String(n)}
              data-tip=${n?"\u53D6\u6D88\u559C\u6B22":"\u52A0\u5165\u6211\u559C\u6B22"}
              aria-label="加入我喜欢"
              @click=${()=>this.onLike()}
            >
              ${g("heart")}
            </button>
            <button
              class="playerbar__heart playerbar__add"
              id="bar-add"
              type="button"
              data-tip="添加到歌单"
              aria-label="添加到歌单"
              ?disabled=${!t}
              @click=${p=>this.openAddToPlaylistMenu(p.currentTarget)}
            >
              ${g("playlist-plus")}
            </button>
          </div>

          <div class="playerbar__center">
            <div class="transport">
              <button
                class="transport__btn"
                id="btn-prev"
                type="button"
                data-tip="上一曲"
                aria-label="上一曲"
                @click=${()=>ms()}
              >
                ${g("prev")}
              </button>
              <button
                class="transport__btn transport__btn--main"
                id="btn-play"
                type="button"
                data-tip=${i.playing?"\u6682\u505C":"\u64AD\u653E"}
                aria-label=${i.playing?"\u6682\u505C":"\u64AD\u653E"}
                @click=${()=>Ut()}
              >
                <svg id="icon-play"><use href="#i-${i.playing?"pause":"play"}"></use></svg>
              </button>
              <button
                class="transport__btn"
                id="btn-next"
                type="button"
                data-tip="下一曲"
                aria-label="下一曲"
                @click=${()=>ft(!1)}
              >
                ${g("next")}
              </button>
            </div>
          </div>

          <div class="playerbar__tools">
            <div class="volume">
              <button
                class="volume__btn"
                id="btn-mute"
                type="button"
                data-tip=${i.muted?"\u53D6\u6D88\u9759\u97F3":"\u9759\u97F3"}
                aria-label=${i.muted?"\u53D6\u6D88\u9759\u97F3":"\u9759\u97F3"}
                @click=${()=>{Fi(),ad()}}
              >
                <svg id="icon-volume"><use href="#i-${r}"></use></svg>
              </button>
              <div
                class="slider volume__slider"
                id="volume"
                role="slider"
                tabindex="0"
                aria-label="音量"
                aria-valuemin="0"
                aria-valuemax="100"
              >
                <div class="slider__rail">
                  <div class="slider__fill" id="volume-fill"></div>
                </div>
                <div class="slider__thumb"></div>
                <div class="slider__bubble" id="volume-bubble"></div>
              </div>
            </div>
            <button
              class="mode-btn"
              id="btn-mode"
              type="button"
              data-mode=${i.playMode}
              data-tip=${s.label}
              aria-label=${s.label}
              @click=${()=>{Bi(),m((Hc[i.playMode]||s).label,{duration:1400})}}
            >
              <svg id="icon-mode"><use href="#i-${s.icon}"></use></svg>
              <span class="mode-btn__badge">1</span>
            </button>
            <button
              class="mode-btn"
              id="btn-lyrics"
              type="button"
              data-tip="歌词"
              aria-label="歌词"
              aria-expanded=${String(!!i.lyricsOpen)}
              aria-haspopup="dialog"
              @click=${()=>zf()}
            >
              ${g("lyric-match")}
            </button>
            <button
              class="mode-btn"
              id="btn-sleep"
              type="button"
              aria-pressed=${String(!!l)}
              data-tip=${this.sleepTip(l)}
              aria-label="定时停止"
              @click=${()=>gm()}
            >
              ${g("clock")}
              <span class="mode-btn__badge" id="sleep-count" ?hidden=${!c}>${c}</span>
            </button>
            <button
              class="mode-btn"
              id="btn-options"
              type="button"
              aria-pressed=${String(!!i.optionsOpen)}
              data-tip="选项"
              aria-label="选项"
              @click=${()=>mm()}
            >
              ${g("options")}
            </button>
            <button
              class="mode-btn"
              id="btn-playlist"
              type="button"
              aria-pressed=${String(!!i.queueOpen)}
              data-tip="播放列表"
              aria-label="播放列表"
              @click=${()=>{aS()}}
            >
              ${g("playlist")}
              <span class="mode-btn__badge" id="queue-count"
                >${d===0?"":d>99?"99+":String(d)}</span
              >
            </button>
          </div>
        </div>
      </footer>
    `}sleepTip(t){return t?.type==="duration"?`\u5B9A\u65F6\u505C\u6B62 \xB7 \u5269\u4F59 ${Math.max(0,Math.round((t.until-Date.now())/1e3))} \u79D2`:t?.type==="after-song"?"\u5B9A\u65F6\u505C\u6B62 \xB7 \u64AD\u5B8C\u5F53\u524D\u6B4C\u66F2":"\u5B9A\u65F6\u505C\u6B62"}onLike(){if(!i.currentId)return;It(i.currentId);let t=mt(i.currentId);m(t?"\u5DF2\u52A0\u5165\u300C\u6211\u559C\u6B22\u300D":"\u5DF2\u4ECE\u300C\u6211\u559C\u6B22\u300D\u79FB\u9664",{tone:t?"success":"info",duration:1500})}openAddToPlaylistMenu(t){let n=ot();if(!n){m("\u8FD8\u6CA1\u6709\u6B63\u5728\u64AD\u653E\u7684\u6B4C\u66F2",{duration:1600});return}let s=[];for(let a of i.playlists.filter(r=>!r.locked))s.push({id:a.id,label:a.name,icon:a.id==="liked"?"heart":"playlist",checked:a.songIds.includes(n.id)});s.length||s.push({id:"__none",label:"\u8FD8\u6CA1\u6709\u53EF\u7528\u7684\u6B4C\u5355",disabled:!0}),s.push({id:"__sep",kind:"sep"}),s.push({id:"__new",label:"\u65B0\u5EFA\u6B4C\u5355\u2026",icon:"plus"}),an({anchor:t,x:0,y:0,align:"right",items:s,onPick:async a=>{if(!(a==="__none"||a==="__sep")){if(a==="__new"){xf(r=>{r&&Zr(r.id,[n.id])});return}Zr(a,[n.id])}}})}};Re(Lr,"deps",t=>[t.currentId,t.playing,t.duration,t.volume,t.muted,t.playMode,t.likedIds,t.queue,t.songs,t.onlineSongs.size,t.queueOpen,t.optionsOpen,t.sleepOpen,t.sleepTimer,t.lyricsOpen,on()]);function aS(){let e=i.queueOpen;fm(),!e&&i.currentId&&iS(()=>cm({notify:!1}))}function iS(e){let t=null,n=!1,s=0,a=()=>{n||(n=!0,clearTimeout(s),t?.removeEventListener("transitionend",r),i.queueOpen&&e())},r=o=>{o.target===t&&a()};requestAnimationFrame(()=>{if(t=document.getElementById("queue-panel"),!t||t.hidden){a();return}t.addEventListener("transitionend",r),s=window.setTimeout(a,rS(t)+80)})}function rS(e){let t=0;for(let n of getComputedStyle(e).transitionDuration.split(",")){let s=n.trim(),a=parseFloat(s);Number.isFinite(a)&&(t=Math.max(t,s.endsWith("ms")?a:a*1e3))}return t}Se("mp-playerbar",Lr);var gd="";function Wa(){return i.config.showDesktopLyrics===!0}async function zh(e,{force:t=!1}={}){let n=!!e,s=Wa()!==n;if(i.config.showDesktopLyrics=n,gd="",!s&&!t)return Ve(),{ok:!0,enabled:n,unchanged:!0};if(!x())return fo({enabled:n}),{ok:!0,preview:!0,enabled:n};try{let a=await y.desktopLyrics(n);return n&&a?.ok===!1&&(i.config.showDesktopLyrics=!1,Ve()),a}catch(a){return console.warn("[desktop-lyrics] \u6253\u5F00/\u5173\u95ED\u684C\u9762\u6B4C\u8BCD\u5931\u8D25",a),i.config.showDesktopLyrics=!1,Ve(),{ok:!1,enabled:n,error:String(a?.message??a)}}}function oS({text:e="",trans:t=[],chars:n=[],words:s=[],wordEnds:a=[],posMs:r=0,atMs:o=0,playing:l=!1,fontSize:c=26}={}){if(!Wa())return;let d=Array.isArray(s)&&s.length>1,p=[e,l?1:0,Math.round(c),d?s.join(","):"",d?Math.round(r/250):""].join("|");if(p!==gd){if(gd=p,!x()){fo({text:e,playing:l});return}y.updateDesktopLyrics({text:e,trans:t,chars:d?n:[],words:d?s:[],wordEnds:d?a:[],posMs:Math.round(r),atMs:Math.round(o),playing:l,fontSize:c}).catch(h=>{console.warn("[desktop-lyrics] \u540C\u6B65\u6B4C\u8BCD\u5931\u8D25",h?.message??h)})}}function fo({text:e="",playing:t=!1,enabled:n=null}={}){let s=n===null?Wa():!!n,a=!x()&&s&&t&&!!e;i.floatingLyrics={show:a,text:e},Ve()}function mo(){return i.config.showDesktopWallpaper===!0}function jc(){Ve()}async function lS(){if(!x())return!0;let e=!0,t="";try{let n=await y.desktopWallpaperState();e=n?.supported!==!1,t=n?.reason||""}catch(n){return console.info("[desktop-wallpaper] \u80FD\u529B\u63A2\u6D4B\u5931\u8D25",n?.message??n),!0}return e?!0:(i.desktopWallpaperSupport={supported:!1,reason:t||"\u5F53\u524D\u7CFB\u7EDF\u4E0D\u652F\u6301\u684C\u9762\u80CC\u666F\u6B4C\u8BCD"},Ve(),!1)}async function Hh(e,{force:t=!1}={}){let n=!!e,s=mo()!==n;if(i.config.showDesktopWallpaper=n,jc(),!s&&!t)return{ok:!0,enabled:n,unchanged:!0};if(!x())return n?(vd(),{ok:!0,preview:!0,enabled:n}):(fo({enabled:!1}),{ok:!0,preview:!0,enabled:n});try{let a=await y.desktopWallpaper(n);return n&&a?.ok===!1?(i.config.showDesktopWallpaper=!1,jc(),$()):n&&(cS(),vd()),a}catch(a){return console.warn("[desktop-wallpaper] \u6253\u5F00/\u5173\u95ED\u684C\u9762\u80CC\u666F\u6B4C\u8BCD\u5931\u8D25",a),i.config.showDesktopWallpaper=!1,jc(),$(),{ok:!1,enabled:n,error:String(a?.message??a)}}}var j={setup:"",songId:"\0",cover:"\0",lyricsText:"\0",lyricsStatus:"\0",options:"",playing:null,volume:null,muted:null,duration:-1,lyricIndex:-2,position:-1,progressPlaying:null};function cS(){j.setup="",j.songId="\0",j.cover="\0",j.lyricsText="\0",j.options="",j.playing=null,j.volume=null,j.muted=null,j.duration=-1,j.lyricIndex=-2,j.position=-1,j.progressPlaying=null}function dS(){let e=[],t=uS();t.signature!==j.setup&&(j.setup=t.signature,e.push({type:"theme",skinId:t.skinId,themeId:t.theme,theme:t.theme,mode:t.mode,density:t.density,tokens:t.tokens}));let n=H$(),s=Zf(),a=j$({interactive:!1}),r=n.song?.id??"";r!==j.songId?(j.songId=r,j.cover=n.cover,j.lyricsText=n.lyrics.text,j.lyricIndex=n.lyrics.index,j.duration=s.duration,j.progressPlaying=s.playing,e.push({type:"song",song:n.song,cover:n.cover,covers:n.covers,coverIndex:n.coverIndex,lyrics:n.lyrics})):(n.cover!==j.cover&&(j.cover=n.cover,e.push({type:"media",cover:n.cover,covers:n.covers,coverIndex:n.coverIndex})),(n.lyrics.text!==j.lyricsText||n.lyrics.status!==j.lyricsStatus)&&(j.lyricsText=n.lyrics.text,j.lyricsStatus=n.lyrics.status,j.lyricIndex=n.lyrics.index,e.push({type:"lyrics",lyrics:n.lyrics})));let o=JSON.stringify(a);return o!==j.options&&(j.options=o,e.push({type:"options",options:a})),(s.playing!==j.playing||s.volume!==j.volume||s.muted!==j.muted)&&(j.playing=s.playing,j.volume=s.volume,j.muted=s.muted,e.push({type:"state",playing:s.playing,volume:s.volume,muted:s.muted})),(s.position!==j.position||n.lyrics.index!==j.lyricIndex||s.duration!==j.duration||s.playing!==j.progressPlaying)&&(j.position=s.position,j.lyricIndex=n.lyrics.index,j.duration=s.duration,j.progressPlaying=s.playing,e.push({type:"progress",position:s.position,duration:s.duration,playing:s.playing,lyricIndex:n.lyrics.index})),e}function vd(){if(mo()){if(!x()){let e=q$();fo({text:e.text,playing:Zf().playing});return}for(let e of dS())y.updateDesktopWallpaper(e).catch(t=>{console.warn("[desktop-wallpaper] \u540C\u6B65\u80CC\u666F\u6B4C\u8BCD\u5931\u8D25",t?.message??t)})}}function uS(){let e=hS(),t=i.pvMode||i.config.playerViewMode||"",n=document.documentElement.dataset.theme||"",s=document.documentElement.dataset.mode||"dark",a=document.documentElement.dataset.density||"";return{skinId:t,theme:n,mode:s,density:a,tokens:e.values,signature:[t,n,s,a,e.signature].join("|")}}function pS(){let e=i.config||{};return[document.documentElement.dataset.theme||"",document.documentElement.dataset.mode||"",document.documentElement.dataset.density||"",e.glassBlurCustom?e.glassBlur:"",e.glassAlphaCustom?e.glassAlpha:"",e.accentFromCover?1:0,e.coverSeed||"",e.coverSeed2||"",e.animations===!1?0:1,e.animationsSpeed||"",e.lyricsFontSize,e.listDensity||""].join("|")}var jh="\0",Vh={};function hS(){let e=pS();return e!==jh&&(jh=e,Vh=fS()),{signature:e,values:Vh}}function fS(){let e=new Set(Object.keys(hl()));for(let s of document.styleSheets){let a=null;try{a=s.cssRules}catch{continue}bm(a,e,0)}let t=getComputedStyle(document.documentElement),n={};for(let s of e){let a=t.getPropertyValue(s).trim();!a||/[;{}]/.test(a)||(n[s]=a)}return n}function bm(e,t,n){if(!(!e||n>3))for(let s of e){if(s.style)for(let a of s.style)a.startsWith("--")&&t.add(a);s.cssRules&&bm(s.cssRules,t,n+1)}}var Me=Object.freeze({off:"off",lyrics:"lyrics",wallpaper:"wallpaper"});function bd(){return i.config.showDesktopWallpaper===!0?Me.wallpaper:i.config.showDesktopLyrics===!0?Me.lyrics:Me.off}async function mS(e){let t=gS(e),n=bd();if(t===n)return{ok:!0,mode:t,unchanged:!0};let s=await Kh(t);return s?.ok!==!1?{ok:!0,...s,mode:t}:n!==Me.off&&(await Kh(n))?.ok!==!1?{ok:!1,...s,mode:n,restored:!0}:{ok:!1,...s,mode:Me.off}}async function Kh(e){return e!==Me.lyrics&&await zh(!1),e!==Me.wallpaper&&await Hh(!1),e===Me.lyrics?zh(!0):e===Me.wallpaper?Hh(!0):{ok:!0}}function gS(e){return e===Me.lyrics?Me.lyrics:e===Me.wallpaper?Me.wallpaper:Me.off}var vS=[{value:"off",label:"\u5173\u95ED"},{value:"vocal",label:"\u6E05\u6F88\u4EBA\u58F0"},{value:"bass",label:"\u4F4E\u97F3\u589E\u5F3A"},{value:"surround",label:"3D \u73AF\u7ED5"}],ym=[{id:"opt-desktop-off",value:Me.off,label:"\u5173\u95ED",tip:"\u4E0D\u5728\u684C\u9762\u4E0A\u663E\u793A\u6B4C\u8BCD"},{id:"opt-desktop-lyrics",value:Me.lyrics,label:"\u60AC\u6D6E",tip:"\u5728\u684C\u9762\u4E0A\u663E\u793A\u4E00\u884C\u7F6E\u9876\u6B4C\u8BCD\uFF08\u72EC\u7ACB\u900F\u660E\u7A97\u53E3\uFF0C\u6574\u5757\u90FD\u80FD\u62D6\u52A8\uFF1B\u9F20\u6807\u79FB\u5165\u53EF\u8C03\u6837\u5F0F\u4E0E\u5B57\u53F7\uFF09"},{id:"opt-desktop-wallpaper",value:Me.wallpaper,label:"\u80CC\u666F",tip:"\u628A\u64AD\u653E\u754C\u9762\u7684\u80CC\u666F\u94FA\u6EE1\u684C\u9762\u3001\u57AB\u5728\u684C\u9762\u56FE\u6807\u4E4B\u4E0B\uFF0C\u6B4C\u8BCD\u8DDF\u7740\u753B\u5728\u4E0A\u9762\uFF08\u4EC5 Windows\uFF09"}];async function bS(e){let t=await mS(e);$();let n=ym.find(s=>s.value===e)?.label||"";return t.ok!==!1?(m(e===Me.off?"\u5DF2\u5173\u95ED\u684C\u9762\u6B4C\u8BCD":`\u684C\u9762\u6B4C\u8BCD\uFF1A${n}`,{duration:1400}),t):(m(`\u6253\u4E0D\u5F00\uFF1A${t.reason||t.error||"\u672A\u77E5\u539F\u56E0"}`,{tone:"warning",duration:3200}),t.restored&&m("\u5DF2\u4FDD\u7559\u539F\u6765\u7684\u684C\u9762\u6B4C\u8BCD\u8BBE\u7F6E",{duration:1800}),t)}var Kn=class extends qe{get open(){return!1}get panelEl(){return null}updated(){let t=this.panelEl;if(t){if(this.open){this._closeTimer&&(clearTimeout(this._closeTimer),this._closeTimer=null),t.hidden?(t.hidden=!1,t.dataset.state="",requestAnimationFrame(()=>{this.open&&(t.dataset.state="opened")})):t.dataset.state!=="opened"&&(t.dataset.state="opened");return}t.hidden||(t.dataset.state="closed",!this._closeTimer&&(this._closeTimer=setTimeout(()=>{this._closeTimer=null,!this.open&&t&&(t.hidden=!0)},sn()+40)))}}disconnectedCallback(){this._closeTimer&&clearTimeout(this._closeTimer),this._closeTimer=null,super.disconnectedCallback()}bindDismiss(t){let n=a=>{let r=this.panelEl;!r||r.hidden||r.contains(a.target)||a.target.closest?.(t)||this.close()},s=a=>{if(a.key!=="Escape")return;let r=this.panelEl;r&&!r.hidden&&this.close()};document.addEventListener("pointerdown",n),document.addEventListener("keydown",s),this._undismiss=()=>{document.removeEventListener("pointerdown",n),document.removeEventListener("keydown",s)}}close(){}},Or=class extends Kn{get open(){return!!i.queueOpen}get panelEl(){return this.querySelector("#queue-panel")}close(){fm(!1)}firstUpdated(){this.bindDismiss("#btn-playlist"),this.bindDrag()}updated(){super.updated(),this.bindDrag()}bindDrag(){let t=this.querySelector("#queue-panel-body");t&&(this._sortable&&this._sortable.el===t||(this._sortable?.destroy(),this._sortable=F.create(t,{draggable:".queue-item",animation:0,ghostClass:"is-dragging",onEnd:n=>{um();let s=n.oldIndex,a=n.newIndex;if(s==null||a==null||s===a)return;let r=n.from,o=Array.from(r.children).filter(l=>l!==n.item);r.insertBefore(n.item,o[s]??null),ca(s,a),m("\u5DF2\u8C03\u6574\u64AD\u653E\u987A\u5E8F \xB7 \u64AD\u653E\u6A21\u5F0F\u5DF2\u5207\u56DE\u5217\u8868\u5FAA\u73AF",{duration:1600})}})))}disconnectedCallback(){this._sortable?.destroy(),this._sortable=null,this._undismiss?.(),super.disconnectedCallback()}render(){let t=i.queueOpen?i.queue.map(s=>Be(s)).filter(Boolean):[],n=new Map;if(i.queueOpen)for(let s=0;s<i.queue.length;s+=1)n.set(i.queue[s],s);return u`
      <section class="queue-panel" id="queue-panel" hidden data-state="closed" aria-label="播放列表">
        <div class="queue-panel__head">
          <span class="queue-panel__title">播放列表</span>
          <span class="u-spacer"></span>
          <span class="queue-panel__count" id="queue-panel-count">${t.length} 首</span>
          <button
            class="queue-panel__btn u-hit"
            id="queue-locate"
            type="button"
            data-tip="定位到当前播放"
            aria-label="定位到当前播放"
            @click=${()=>cm()}
          >
            ${g("disc")}
          </button>
          <button
            class="queue-panel__btn u-hit"
            id="queue-clear"
            type="button"
            data-tip="清空列表"
            aria-label="清空列表"
            @click=${()=>{da(),m("\u64AD\u653E\u5217\u8868\u5DF2\u6E05\u7A7A")}}
          >
            ${g("trash")}
          </button>
          <button
            class="queue-panel__btn u-hit"
            id="queue-close"
            type="button"
            data-tip="关闭"
            aria-label="关闭播放列表"
            @click=${()=>this.close()}
          >
            ${g("close")}
          </button>
        </div>
        <div
          class="queue-panel__body"
          id="queue-panel-body"
          @click=${s=>this.onClick(s)}
          @keydown=${s=>this.onKey(s)}
        >
          ${t.length?ut(t,s=>s.id,s=>this.item(s,n.get(s.id)??-1)):u`<div class="queue-panel__empty">播放列表是空的<br />从曲库把歌曲加进来</div>`}
        </div>
      </section>
    `}item(t,n){let s=t.id===i.currentId;return u`
      <div
        class="queue-item"
        data-queue-id=${t.id}
        aria-current=${String(s)}
        role="button"
        tabindex="0"
        draggable="true"
      >
        <span class="queue-item__index">${s&&i.playing?g("play"):n+1}</span>
        <span class="queue-item__cover"><img src=${zd(Rt(t))} alt="" loading="lazy" /></span>
        <span class="queue-item__main">
          <span class="queue-item__title">${t.title}</span>
          <span class="queue-item__sub">${t.artist}${t.album?` \xB7 ${t.album}`:""}</span>
        </span>
        <button
          class="queue-item__del"
          type="button"
          data-queue-del=${t.id}
          data-tip="从列表移除"
          aria-label="从列表移除"
        >
          ${g("close")}
        </button>
      </div>
    `}onClick(t){if(pm())return;let n=t.target.closest("[data-queue-del]");if(n){t.stopPropagation(),ps(n.dataset.queueDel);return}let s=t.target.closest("[data-queue-id]");s&&Mt(s.dataset.queueId)}onKey(t){if(t.key!=="Enter"&&t.key!==" ")return;let n=t.target.closest?.("[data-queue-id]");n&&(t.preventDefault(),Mt(n.dataset.queueId))}};Re(Or,"deps",t=>[t.queueOpen,t.queue,t.currentId,t.playing,on()]);Se("mp-queue-panel",Or);var Rr=class extends Kn{get open(){return!!i.optionsOpen}get panelEl(){return this.querySelector("#options-panel")}close(){mm(!1)}firstUpdated(){this.bindDismiss("#btn-options"),this._sliders={size:Ns(this.querySelector("#opt-lyric-size"),{min:Hr,max:jr,step:1,value:i.config.lyricsFontSize,format:t=>`${Math.round(t)}px`,onChange:t=>{i.config.lyricsFontSize=t,nn("--lyric-size",kd(t)),this.requestUpdate()},onCommit:()=>$()}),alpha:Ns(this.querySelector("#opt-alpha"),{min:20,max:95,step:1,value:i.config.glassAlphaCustom?i.config.glassAlpha:Yc(),format:t=>`${Math.round(t)}%`,onChange:t=>{i.config.glassAlpha=t,i.config.glassAlphaCustom=!0,Sd(t),this.requestUpdate()},onCommit:()=>$()})}}disconnectedCallback(){this._undismiss?.(),super.disconnectedCallback()}render(){let t=Math.round(i.config.lyricsFontSize),n=Math.round(i.config.glassAlphaCustom?i.config.glassAlpha:Yc()),s=bd();return u`
      <section class="options-panel" id="options-panel" hidden data-state="closed" aria-label="播放选项">
        <div class="options-panel__head">
          <svg class="options-panel__icon" aria-hidden="true"><use href="#i-options"></use></svg>
          <span class="options-panel__title">播放选项</span>
          <span class="u-spacer"></span>
          <button
            class="options-panel__btn u-hit"
            id="options-close"
            type="button"
            data-tip="关闭"
            aria-label="关闭选项"
            @click=${()=>this.close()}
          >
            ${g("close")}
          </button>
        </div>
        <div class="options-panel__body" id="options-panel-body">
          <div class="opt" data-opt="lyric-size">
            <div class="opt__head">
              <span class="opt__icon">${g("text-size")}</span>
              <span class="opt__label">歌词字号</span>
              <span class="opt__value" id="opt-lyric-size-val">${t}px</span>
            </div>
            <div class="opt__control">
              <span class="opt__range">${Hr}</span>
              <div class="slider" id="opt-lyric-size" role="slider" tabindex="0" aria-label="歌词字号">
                <div class="slider__rail"><div class="slider__fill"></div></div>
                <div class="slider__thumb"></div>
                <div class="slider__bubble"></div>
              </div>
              <span class="opt__range">${jr}</span>
            </div>
          </div>
          <div class="opt" data-opt="show-lyrics">
            <div class="opt__head">
              <span class="opt__icon">${g("lyrics")}</span>
              <span class="opt__label">显示歌词</span>
              <span class="u-spacer"></span>
              <button
                class="switch"
                type="button"
                role="switch"
                id="opt-show-lyrics"
                aria-checked=${String(i.config.showLyrics!==!1)}
                aria-label="显示歌词"
                @click=${()=>this.toggleShowLyrics()}
              ></button>
            </div>
          </div>
          <div class="opt" data-opt="desktop">
            <div class="opt__head">
              <span class="opt__icon">${g("desktop-lyrics")}</span>
              <span class="opt__label">桌面歌词</span>
            </div>
            <div class="opt__control">
              <div class="segmented" role="radiogroup" aria-label="桌面歌词">
                ${ym.map(a=>u`<button
                      class="segmented__btn"
                      type="button"
                      role="radio"
                      id=${a.id}
                      data-mode=${a.value}
                      aria-checked=${String(a.value===s)}
                      ?disabled=${a.value===Me.wallpaper&&i.desktopWallpaperSupport?.supported===!1}
                      data-tip=${a.value===Me.wallpaper&&i.desktopWallpaperSupport?.supported===!1?i.desktopWallpaperSupport.reason:a.tip}
                      @click=${()=>this.pickDesktopMode(a)}
                    >
                      ${a.label}
                    </button>`)}
              </div>
            </div>
          </div>
          <div class="opt" data-opt="effect">
            <div class="opt__head">
              <span class="opt__icon">${g("eq")}</span>
              <span class="opt__label">音效</span>
            </div>
            <div class="opt__control">
              <div class="segmented segmented--wrap" data-segment="effectPreset">
                ${vS.map(a=>u`<button
                      class="segmented__btn"
                      type="button"
                      data-value=${a.value}
                      aria-pressed=${String(a.value===(i.config.effectPreset||"off"))}
                      @click=${()=>this.pickEffect(a.value)}
                    >
                      ${a.label}
                    </button>`)}
              </div>
            </div>
          </div>
          <div class="opt" data-opt="alpha">
            <div class="opt__head">
              <span class="opt__icon">${g("opacity")}</span>
              <span class="opt__label">背景不透明度</span>
              <span class="opt__value" id="opt-alpha-val">${n}%</span>
            </div>
            <div class="opt__control">
              <span class="opt__swatch" aria-hidden="true"></span>
              <div class="slider" id="opt-alpha" role="slider" tabindex="0" aria-label="背景不透明度">
                <div class="slider__rail"><div class="slider__fill"></div></div>
                <div class="slider__thumb"></div>
                <div class="slider__bubble"></div>
              </div>
              <span class="opt__swatch opt__swatch--solid" aria-hidden="true"></span>
            </div>
          </div>
        </div>
      </section>
    `}pickDesktopMode(t){t.value!==bd()&&bS(t.value)}toggleShowLyrics(){i.config.showLyrics=i.config.showLyrics===!1,$()}pickEffect(t){t!==(i.config.effectPreset||"off")&&(i.config.effectPreset=t,Lf(),$())}};Re(Rr,"deps",t=>[t.optionsOpen,t.config.lyricsFontSize,t.config.glassAlpha,t.config.glassAlphaCustom,t.config.effectPreset,t.config.showLyrics,t.config.showDesktopLyrics,t.config.showDesktopWallpaper]);Se("mp-options-panel",Rr);var qr=class extends Kn{get open(){return!!i.sleepOpen}get panelEl(){return this.querySelector("#sleep-panel")}close(){gm(!1)}constructor(){super(),this._tick=null,this._pendingMinutes=null}onConnected(){this._tick=setInterval(()=>{i.sleepOpen&&i.sleepTimer&&this.requestUpdate()},1e3)}onDisconnected(){this._tick&&clearInterval(this._tick),this._tick=null}firstUpdated(){this.bindDismiss("#btn-sleep"),this._slider=Ns(this.querySelector("#sleep-slider"),{min:0,max:300,step:1,value:0,format:t=>`${Math.round(t)} \u5206\u949F`,onChange:t=>{this._pendingMinutes=Math.round(t),this.requestUpdate()},onCommit:t=>{this._pendingMinutes=null,tS(t)}})}disconnectedCallback(){this._undismiss?.(),super.disconnectedCallback()}updated(){super.updated();let t=i.sleepTimer,n=this.querySelector("#sleep-slider");if(t?.type==="duration"){let s=Math.max(0,t.until-Date.now());n?.dataset.dragging!=="true"&&this._slider?.set(Math.max(0,Math.round(s/6e4)),{silent:!0})}else n?.dataset.dragging!=="true"&&this._slider?.set(0,{silent:!0})}render(){let t=i.sleepTimer,n=yS(t,this._pendingMinutes);return u`
      <section class="sleep-panel" id="sleep-panel" hidden data-state="closed" aria-label="定时停止">
        <div class="sleep-panel__head">
          <svg class="sleep-panel__icon" aria-hidden="true"><use href="#i-clock"></use></svg>
          <span class="sleep-panel__title">定时停止</span>
          <span class="u-spacer"></span>
          <button
            class="options-panel__btn u-hit"
            id="sleep-close"
            type="button"
            data-tip="关闭"
            aria-label="关闭定时停止"
            @click=${()=>this.close()}
          >
            ${g("close")}
          </button>
        </div>
        <div class="sleep-panel__body" id="sleep-panel-body">
          <div class="sleep-panel__bar">
            <div class="sleep-panel__readout">
              <span class="sleep-panel__value" id="sleep-value">${n.value}</span>
              <span class="sleep-panel__sub" id="sleep-sub">${n.sub}</span>
            </div>
            <div
              class="slider sleep-panel__slider"
              id="sleep-slider"
              role="slider"
              tabindex="0"
              aria-label="定时停止分钟数"
              aria-valuemin="0"
              aria-valuemax="300"
              aria-valuenow="0"
            >
              <div class="slider__rail"><div class="slider__fill"></div></div>
              <div class="slider__thumb"></div>
              <div class="slider__bubble"></div>
            </div>
            <div class="sleep-panel__scale"><span>0</span><span>150</span><span>300 分钟</span></div>
          </div>
          <div class="sleep-panel__option">
            <div class="sleep-panel__option-main">
              <span class="sleep-panel__option-label">歌曲播放完成后停止</span>
              <span class="sleep-panel__option-sub">倒计时结束后不立刻停，等这首播完再停</span>
            </div>
            <button
              class="switch"
              type="button"
              role="switch"
              data-sleep-act="after-song"
              aria-checked=${String(i.config.sleepAfterSong===!0)}
              aria-label="歌曲播放完成后停止"
              @click=${()=>nS(!i.config.sleepAfterSong)}
            ></button>
          </div>
          <div class="sleep-panel__row">
            <button
              class="btn btn--sm"
              type="button"
              data-sleep-act="off"
              @click=${()=>vm("\u5DF2\u53D6\u6D88\u5B9A\u65F6\u505C\u6B62")}
            >
              ${g("close")}<span>取消定时</span>
            </button>
          </div>
          <div class="sleep-panel__hint">
            「歌曲播放完成后停止」打开时，倒计时到点如果这首还没播完，会等它播完再停 （不会在歌曲中途打断）。拖到 0
            分钟即取消定时；设置从松手那一刻开始倒计时。
          </div>
        </div>
      </section>
    `}};Re(qr,"deps",t=>[t.sleepOpen,t.sleepTimer,t.config.sleepAfterSong,t.playing,t.currentId]);function yS(e,t){if(typeof t=="number")return t<=0?{value:"\u672A\u5F00\u542F",sub:"\u62D6\u5230 0 \u5373\u53D6\u6D88"}:{value:`${t} \u5206\u949F`,sub:"\u677E\u624B\u5F00\u59CB\u5012\u8BA1\u65F6"};if(e?.type==="after-song")return{value:"\u7B49\u5F85\u672C\u9996\u64AD\u5B8C",sub:"\u5012\u8BA1\u65F6\u5DF2\u7ED3\u675F\uFF0C\u8FD9\u9996\u64AD\u5B8C\u5C31\u6682\u505C"};if(e?.type==="duration"){let n=Math.max(0,e.until-Date.now());return{value:`\u5269\u4F59 ${_S(n)}`,sub:`\u5171 ${e.minutes} \u5206\u949F`}}return{value:"\u672A\u5F00\u542F",sub:"\u62D6\u52A8\u6ED1\u5757\u8BBE\u7F6E\u65F6\u957F"}}function _S(e){let t=Math.max(0,Math.round(e/1e3)),n=Math.floor(t/3600),s=Math.floor(t%3600/60),a=t%60;return n>0?`${n} \u5C0F\u65F6 ${String(s).padStart(2,"0")} \u5206`:`${String(s).padStart(2,"0")}:${String(a).padStart(2,"0")}`}Se("mp-sleep-panel",qr);var Nr=class extends Kn{get open(){return Ca().open}get panelEl(){return this.querySelector("#download-panel")}close(){Y0()}firstUpdated(){this.bindDismiss("#btn-downloads")}disconnectedCallback(){this._undismiss?.(),super.disconnectedCallback()}render(){let{tasks:t,running:n}=Ca(),s=t.some(a=>a?.state!=="running");return u`
      <section class="download-panel" id="download-panel" hidden data-state="closed" aria-label="下载任务">
        <div class="download-panel__head">
          <svg class="download-panel__icon" aria-hidden="true"><use href="#i-download"></use></svg>
          <span class="download-panel__title">下载任务</span>
          <span class="download-panel__count" id="download-panel-count">
            ${n?`${n} \u4E2A\u4E0B\u8F7D\u4E2D`:`\u5171 ${t.length} \u4E2A`}
          </span>
          <button
            class="download-panel__btn"
            id="download-open-dir"
            type="button"
            data-tip="打开下载目录"
            aria-label="打开下载目录"
            @click=${()=>J0()}
          >
            ${g("folder")}
          </button>
          <button
            class="download-panel__btn u-hit"
            id="download-clear"
            type="button"
            data-tip="清除已完成"
            aria-label="清除已完成"
            ?disabled=${!s}
            @click=${()=>X0()}
          >
            ${g("trash")}
          </button>
          <button
            class="download-panel__btn u-hit"
            id="download-close"
            type="button"
            data-tip="关闭"
            aria-label="关闭下载任务面板"
            @click=${()=>this.close()}
          >
            ${g("close")}
          </button>
        </div>
        <div class="download-panel__body" id="download-panel-body">
          ${t.length?ut(t,a=>a.id,a=>this.item(a)):u`<div class="download-panel__empty">还没有下载任务</div>`}
        </div>
      </section>
    `}item(t){let n=t.state==="running"?"running":t.state==="failed"?"failed":"done",s=Number(t.total)||0,a=Number(t.done)||0,r=s>0?Math.min(100,Math.round(a/s*100)):0,o=Math.max(0,Math.min(100,Math.round(r/5)*5)),l=n==="running",c=`${r}%`;n==="done"?c="\u5DF2\u5B8C\u6210":n==="failed"?c="\u5931\u8D25":s<=0&&(c="\u4E0B\u8F7D\u4E2D");let d;return l?d=s>0?`${dr(a)} / ${dr(s)}`:dr(a):n==="done"?d=`${dr(a||s)} \xB7 ${t.path?wS(t.path):t.dir||""}`:d=t.message||"\u4E0B\u8F7D\u5931\u8D25",u`
      <div
        class="download-item"
        data-state=${n}
        data-download-id=${t.id}
        role=${n==="done"?"button":A}
        tabindex=${n==="done"?"0":A}
        data-tip=${n==="done"?"\u5728\u6587\u4EF6\u5939\u4E2D\u663E\u793A":A}
        @click=${()=>Q0(t.id)}
      >
        <div class="download-item__title">${t.title||t.bvid||"\u672A\u547D\u540D"}</div>
        <div class="download-item__state">${c}</div>
        <div class="download-item__bar" ?hidden=${!l} data-unknown=${s>0?"false":"true"}>
          <div class="download-item__fill" data-value=${o}></div>
        </div>
        <div class="download-item__meta${n==="failed"?" download-item__meta--error":""}">${d}</div>
      </div>
    `}};Re(Nr,"deps",()=>{let t=Ca();return[t.open,t.revision]});Se("mp-download-panel",Nr);function dr(e){let t=Number(e)||0;if(t<=0)return"0 B";let n=["B","KB","MB","GB"],s=0,a=t;for(;a>=1024&&s<n.length-1;)a/=1024,s+=1;return`${a>=10||s===0?Math.round(a):a.toFixed(1)} ${n[s]}`}function wS(e){let t=String(e||""),n=Math.max(t.lastIndexOf("\\"),t.lastIndexOf("/"));return n>=0?t.slice(n+1):t}var Fr=class extends Kn{get open(){return oe.open}get panelEl(){return this.querySelector("#cover-layer")}close(){xa()}render(){let t=this.song();return u`
      <div
        class="cover-layer"
        id="cover-layer"
        data-state="closed"
        hidden
        aria-label="封面管理"
        @click=${n=>this.onClick(n)}
        @keydown=${n=>this.onKey(n)}
      >
        <div class="cover-layer__panel" role="dialog" aria-modal="true" aria-label="封面管理">
          <div class="cover-layer__head">
            <svg class="cover-layer__icon" aria-hidden="true"><use href="#i-image"></use></svg>
            <span class="cover-layer__title">封面管理</span>
            <span class="u-spacer"></span>
            <button
              class="cover-layer__close u-hit"
              type="button"
              data-cover-close
              aria-label="关闭封面管理"
              @click=${()=>xa()}
            >
              ${g("close")}
            </button>
          </div>
          <div class="cover-layer__body" id="cover-layer-body">${t&&this.open?this.panel(t):A}</div>
        </div>
      </div>
    `}song(){let t=oe.songId;return t&&i.songs.find(n=>n.id===t)||null}panel(t){let n=oe,s=Ka(t);return u`
      <div class="cover-panel">
        <div class="cover-panel__current">
          <div class="cover-panel__frame" id="cover-current-frame">
            ${s?u`<img src=${s} alt=${t.title} 原始封面 />`:u`<span class="cover-panel__none">${g("music")}</span>`}
          </div>
          <div class="cover-panel__meta">
            <div class="cover-panel__title">${t.title}</div>
            <div class="cover-panel__sub">${t.artist}${t.album?` \xB7 ${t.album}`:""}</div>
            <div class="cover-panel__hint">
              选中的封面会立刻写入（缓存目录 + 按下面的开关写进歌曲文件）。
              这首歌可以保存多张封面，右上角的轮播开关会让详情页按时间轮换显示。
            </div>
          </div>
        </div>

        <div class="cover-panel__section">
          <div class="cover-panel__section-head">
            <span class="cover-panel__section-title">这首歌的封面</span>
            <span class="u-spacer"></span>
            <button
              class="btn btn--sm"
              type="button"
              data-cover-act="embed"
              id="cover-embed-btn"
              aria-pressed=${String(i.config.embedMeta===!0)}
              data-tip=${i.config.embedMeta?"\u5173\u95ED\u540E\u5C01\u9762\u53EA\u5B58\u5728\u7F13\u5B58\u76EE\u5F55\u91CC":"\u6253\u5F00\u540E\u5C01\u9762\u4F1A\u5199\u8FDB\u6B4C\u66F2\u6587\u4EF6\u672C\u8EAB\uFF08\u4F1A\u4FEE\u6539\u97F3\u4E50\u6587\u4EF6\uFF09"}
              @click=${()=>this.toggleEmbed()}
            >
              ${g("tag")}<span>写入歌曲文件</span>
            </button>
            <button
              class="btn btn--sm"
              type="button"
              data-cover-act="carousel"
              id="cover-carousel-btn"
              aria-pressed=${String(i.config.coverCarousel===!0)}
              @click=${()=>this.toggleCarousel()}
            >
              ${g("slideshow")}<span>轮播</span>
            </button>
          </div>
          <div class="cover-set" id="cover-set">${this.setItems()}</div>
        </div>

        <div class="cover-panel__section">
          <div class="cover-panel__search">
            <input
              class="field"
              id="cover-keyword"
              type="text"
              placeholder="输入关键词（歌名 / 歌手 / 专辑都可以）"
              autocomplete="off"
              spellcheck="false"
              aria-label="封面搜索关键词"
              .value=${n.keyword||t.title||""}
              @input=${a=>{oe.keyword=a.target.value}}
            />
            <button
              class="btn btn--primary btn--sm"
              type="button"
              data-cover-act="search"
              ?disabled=${n.busy}
              @click=${()=>this.runSearch()}
            >
              ${g("search")}<span>联网搜索</span>
            </button>
            <button class="btn btn--sm" type="button" data-cover-act="local" @click=${()=>this.pickLocal()}>
              ${g("image")}<span>选择本地图片</span>
            </button>
          </div>
          <div class="cover-panel__hint">
            下载来的文件常常没有标签，标题是从文件名推出来的，直接搜不容易命中；
            在这里填一个更准确的关键词会准很多。也可以直接选一张本地图片 ——
            两种结果都会出现在下面：联网搜索默认不勾选，本地图片默认已勾选， 确认后点「应用」。
          </div>
        </div>

        <div class="cover-panel__status" id="cover-status">${n.status}</div>
        <div class="cover-panel__grid" id="cover-grid">${this.cards()}</div>
        <div class="cover-panel__selectbar" id="cover-selectbar" ?hidden=${!n.candidates.length}>
          ${n.candidates.length?this.selectbar():A}
        </div>

        <div class="cover-panel__foot">
          <button class="btn btn--sm" type="button" data-cover-act="open-cache" @click=${()=>this.openCacheDir()}>
            ${g("folder")}<span>打开缓存目录</span>
          </button>
        </div>
      </div>
    `}setItems(){let t=oe,n=t.currentSet?.items||[],s=t.currentSet?.embedded||[],a=Number(t.currentSet?.active)||0;return!n.length&&!s.length?u`<div class="cover-set__empty">还没有换过封面，这首歌现在用的是文件自带的封面。</div>`:u`
      ${n.map((r,o)=>u`
          <div class="cover-set__item" data-set-index=${o} data-active=${String(o===a)}>
            <img src=${r.preview} alt="" />
            ${o===a?u`<span class="cover-set__badge">当前</span>`:A}
            <div class="cover-set__ops">
              <button class="btn btn--xs" type="button" data-set-act="use" ?disabled=${o===a}>
                ${g("check")}<span>设为当前</span>
              </button>
              <button class="btn btn--xs btn--danger" type="button" data-set-act="remove">
                ${g("trash")}<span>删除</span>
              </button>
            </div>
          </div>
        `)}
      ${s.map(r=>u`
          <div class="cover-set__item cover-set__item--embedded" data-embedded="1">
            <img src=${r?.preview||""} alt="" />
            <span class="cover-set__badge cover-set__badge--ghost">文件内嵌</span>
            <div class="cover-set__ops">
              <button class="btn btn--xs" type="button" data-set-act="use" @click=${()=>this.useEmbedded(r)}>
                ${g("plus")}<span>收进缓存</span>
              </button>
            </div>
          </div>
        `)}
    `}cards(){let t=oe;return ut(t.candidates,n=>n.preview,(n,s)=>{let a=t.selected.has(n);return u`
          <button
            class="cover-card"
            type="button"
            role="checkbox"
            aria-checked=${String(a)}
            data-cover-act="toggle"
            data-cover-idx=${s}
            data-selected=${String(a)}
            @click=${()=>this.toggleCandidate(s)}
          >
            <img src=${n.preview} alt="" loading="lazy" />
            <span class="cover-card__check">${g("check")}</span>
            <span class="cover-card__meta">
              <span class="cover-card__provider">${n.provider||"\u6765\u6E90"}</span>
              <span class="cover-card__score">
                ${n.width&&n.height?`${n.width}\xD7${n.height}`:`\u5339\u914D\u5EA6 ${Number(n.score)||0}`}
              </span>
            </span>
          </button>
        `})}selectbar(){let t=oe,n=t.selected.size===t.candidates.length;return u`
      <span class="cover-panel__selectinfo">已选 ${t.selected.size} / ${t.candidates.length} 张</span>
      <span class="u-spacer"></span>
      <button class="btn btn--sm" type="button" data-cover-act="select-all" @click=${()=>this.selectAll()}>
        ${g("check")}<span>${n?"\u53D6\u6D88\u5168\u9009":"\u5168\u9009"}</span>
      </button>
      <button
        class="btn btn--primary btn--sm"
        type="button"
        data-cover-act="apply"
        ?disabled=${!t.selected.size}
        @click=${()=>this.applySelected()}
      >
        ${g("plus")}<span>应用${t.selected.size?`\uFF08${t.selected.size}\uFF09`:""}</span>
      </button>
    `}onClick(t){if(t.target.closest("[data-cover-close]")||t.target===this.panelEl){xa();return}let n=t.target.closest("[data-set-act]");if(n){let s=Number(n.closest("[data-set-index]")?.dataset.setIndex);n.dataset.setAct==="use"&&this.useExisting(s),n.dataset.setAct==="remove"&&this.removeExisting(s)}}onKey(t){if(t.key!=="Escape")return;let n=this.querySelector("#cover-keyword");if(n&&document.activeElement===n&&n.value.trim()){oe.keyword="",n.value="";return}xa()}toggleCandidate(t){let n=oe.candidates[t];n&&(oe.selected.has(n)?oe.selected.delete(n):oe.selected.add(n),Ht())}selectAll(){let t=oe;t.selected.size===t.candidates.length?t.selected.clear():t.candidates.forEach(n=>t.selected.add(n)),Ht()}async runSearch(){let t=oe;if(t.busy)return;if(!x()){Ue("\u6D4F\u89C8\u5668\u9884\u89C8\u4E0B\u6CA1\u6709\u8054\u7F51\u5C01\u9762\u540E\u7AEF\uFF0C\u8BF7\u5728\u5E94\u7528\u91CC\u8BD5");return}t.busy=!0;let n=t.candidates.filter(a=>a.local);t.candidates=[...n],t.selected=new Set(n),Ht();let s=(this.querySelector("#cover-keyword")?.value||"").trim();Ue(s?`\u6B63\u5728\u6309\u300C${s}\u300D\u540C\u65F6\u67E5\u8BE2\u591A\u4E2A\u6765\u6E90\uFF08${Gh()}\uFF09\u2026`:`\u6B63\u5728\u540C\u65F6\u67E5\u8BE2\u591A\u4E2A\u6765\u6E90\uFF08${Gh()}\uFF09\u2026`);try{let a=s?{keyword:s}:{},r=await y.coverLookupSongAll(t.songId,a),o=Array.isArray(r)?r.filter(l=>l?.ok&&l.preview):[];if(o.length){t.candidates=[...n,...o.map(c=>({...c,local:!1}))];let l=[...new Set(o.map(c=>c.provider).filter(Boolean))];Ue(`\u627E\u5230 ${o.length} \u5F20\uFF08\u6765\u6E90\uFF1A${l.join(" / ")||"\u672A\u77E5"}\uFF09\uFF0C\u52FE\u9009\u540E\u70B9\u300C\u5E94\u7528\u300D`)}else{t.candidates=[...n];let l=Array.isArray(r)?r.find(c=>c?.message)?.message:"";Ue(l||"\u6CA1\u6709\u627E\u5230\u5339\u914D\u7684\u5C01\u9762\uFF08\u4E5F\u53EF\u80FD\u662F\u5339\u914D\u5230\u7684\u90FD\u662F\u7A7A\u767D\u56FE\uFF0C\u5DF2\u81EA\u52A8\u4E22\u5F03\uFF09")}}catch(a){Ue(`\u641C\u7D22\u5931\u8D25\uFF1A${a?.message??a}`)}finally{t.busy=!1,Ht()}}async pickLocal(){let t=oe;if(!x()){Ue("\u6D4F\u89C8\u5668\u9884\u89C8\u4E0B\u6CA1\u6709\u7CFB\u7EDF\u6587\u4EF6\u9009\u62E9\u5668\uFF0C\u8BF7\u5728\u5E94\u7528\u91CC\u8BD5");return}Ue("\u6B63\u5728\u8BFB\u53D6\u56FE\u7247\u2026");try{let n=await y.coverPickLocal();if(!n||n.cancelled){Ue("");return}if(!n.ok||!n.preview){Ue(n?.message||"\u8FD9\u5F20\u56FE\u7247\u6CA1\u6CD5\u7528\u4F5C\u5C01\u9762");return}let s={preview:n.preview,provider:n.provider||"\u672C\u5730\u56FE\u7247",source:n.source||"",width:n.width,height:n.height,local:!0};t.candidates.unshift(s),t.selected.add(s),Ht(),Ue(`\u5DF2\u52A0\u5165\u672C\u5730\u56FE\u7247${n.source?`\uFF08${n.source}\uFF09`:""}\uFF0C\u786E\u8BA4\u540E\u70B9\u300C\u5E94\u7528\u300D`)}catch(n){Ue(`\u9009\u62E9\u56FE\u7247\u5931\u8D25\uFF1A${n?.message??n}`)}}async applySelected(){let t=oe.candidates.filter(n=>oe.selected.has(n)).map(n=>n.preview).filter(Boolean);if(!t.length){Ue("\u5148\u52FE\u9009\u81F3\u5C11\u4E00\u5F20\u5C01\u9762");return}await this.writeCovers(()=>y.coverAddMany(oe.songId,t,i.config.embedMeta===!0))}async useExisting(t){Number.isFinite(t)&&await this.writeCovers(()=>y.coverSetActive(oe.songId,t))}async useEmbedded(t){t?.preview&&await this.writeCovers(()=>y.coverAdd(oe.songId,"",t.preview,i.config.embedMeta===!0))}async removeExisting(t){Number.isFinite(t)&&await this.writeCovers(()=>y.coverRemove(oe.songId,t))}async openCacheDir(){try{await y.coverOpenCacheDir("covers")}catch(t){m(`\u6253\u5F00\u7F13\u5B58\u76EE\u5F55\u5931\u8D25\uFF1A${t?.message??t}`,{tone:"error",duration:5e3})}}async writeCovers(t){let n=oe;if(!x()){Ue("\u6D4F\u89C8\u5668\u9884\u89C8\u4E0B\u6CA1\u6709\u5C01\u9762\u540E\u7AEF\uFF0C\u8BF7\u5728\u5E94\u7528\u91CC\u8BD5");return}Ue("\u6B63\u5728\u4FDD\u5B58\u2026");try{let s=await t();s&&Array.isArray(s.items)&&(n.currentSet=s,hs(n.songId,s)),Ue(s?.message||"\u5DF2\u66F4\u65B0\u5C01\u9762"),Ph(),m(s?.message||"\u5C01\u9762\u5DF2\u66F4\u65B0",{tone:"success",duration:1800})}catch(s){Ue(`\u4FDD\u5B58\u5931\u8D25\uFF1A${s?.message??s}`)}}toggleCarousel(){i.config.coverCarousel=!i.config.coverCarousel,$(),m(i.config.coverCarousel?`\u5DF2\u5F00\u542F\u5C01\u9762\u8F6E\u64AD\uFF08\u6BCF ${Number(i.config.coverCarouselInterval)||10} \u79D2\u6362\u4E00\u5F20\uFF09`:"\u5DF2\u5173\u95ED\u5C01\u9762\u8F6E\u64AD",{duration:1600})}toggleEmbed(){i.config.embedMeta=!i.config.embedMeta,$(),m(i.config.embedMeta?"\u4E4B\u540E\u7684\u5C01\u9762\u4F1A\u5199\u8FDB\u6B4C\u66F2\u6587\u4EF6\u672C\u8EAB":"\u5C01\u9762\u53EA\u4FDD\u5B58\u5728\u7F13\u5B58\u76EE\u5F55\uFF08\u4E0D\u6539\u52A8\u97F3\u4E50\u6587\u4EF6\uFF09",{duration:2200})}async refreshSet(){let t=oe;if(!(!x()||!t.songId))try{let n=await y.coverList(t.songId);n&&Array.isArray(n.items)&&(t.currentSet=n,hs(t.songId,n),Ph())}catch(n){Ue(`\u8BFB\u53D6\u73B0\u6709\u5C01\u9762\u5931\u8D25\uFF1A${n?.message??n}`)}}};Re(Fr,"deps",()=>[oe.open,oe.songId,oe.rev,on(),i.config.coverCarousel,i.config.embedMeta]);Se("mp-cover-layer",Fr);var oe={open:!1,songId:"",candidates:[],selected:new Set,currentSet:null,busy:!1,status:"",keyword:"",rev:0};function Ht(){oe.rev+=1,Ve()}function Ue(e){oe.status=e||"",Ht()}var $S=()=>document.querySelector("mp-cover-layer");function Gh(){return Od(i.coverProviders,Uf())}function kS(e){if(!i.songs.find(t=>t.id===e)){m("\u8FD9\u9996\u6B4C\u4E0D\u5728\u672C\u5730\u66F2\u5E93\u91CC\uFF0C\u65E0\u6CD5\u66F4\u6362\u5C01\u9762",{tone:"warning"});return}Object.assign(oe,{open:!0,songId:e,candidates:[],selected:new Set,currentSet:i.coverSets.get(e)||null,status:"",keyword:""}),Ht(),$S()?.refreshSet(),SS()}function xa(){oe.open=!1,Ht()}async function SS(){if(!(i.coverProviders?.length||!x()))try{let e=await y.coverProviders();Array.isArray(e?.providers)&&e.providers.length&&(i.coverProviders=e.providers,Ht())}catch{}}var ks=[{id:"library",label:"\u66F2\u5E93"},{id:"player",label:"\u64AD\u653E\u5668"},{id:"ui",label:"\u7528\u6237\u754C\u9762"},{id:"data",label:"\u4E0B\u8F7D\u4E0E\u7F13\u5B58"},{id:"ai",label:"AI"},{id:"about",label:"\u5173\u4E8E"}],xS=[{value:-14,label:"\u8F83\u54CD\uFF08\u6D41\u5A92\u4F53\u5E38\u89C1\uFF09"},{value:-16,label:"\u63A8\u8350\uFF08\u9ED8\u8BA4\uFF09"},{value:-18,label:"\u6E29\u548C"},{value:-23,label:"\u5E7F\u64AD\u7EA7"}],CS=[{value:"off",label:"\u5173\u95ED"},{value:"track",label:"\u9010\u66F2\u5747\u8861"},{value:"album",label:"\u540C\u4E13\u8F91\u7EDF\u4E00"}];function J({label:e,hint:t,control:n}){return u` <div class="setting">
    <div class="setting__main">
      <div class="setting__label">${e}</div>
      ${t?u`<div class="setting__hint">${t}</div>`:A}
    </div>
    <div class="setting__control">${n}</div>
  </div>`}function Pe(e,t,n){return u`<button
    class="switch"
    type="button"
    role="switch"
    aria-checked=${String(!!t)}
    data-toggle=${e}
    aria-label=${n}
  ></button>`}function yt(e,t,n){return u` <div class="segmented" data-segment=${e}>
    ${t.map(s=>u`<button
          class="segmented__btn"
          type="button"
          data-value=${s.value}
          aria-pressed=${String(String(s.value)===String(n))}
        >
          ${s.label}
        </button>`)}
  </div>`}function AS(e){let t=e.aiVendor||"auto",n=Cf(t),s="\u5F00\u542F\u540E\u6A21\u578B\u4F1A\u5148\u63A8\u7406\u518D\u7ED9\u7ED3\u8BBA\uFF0C\u54CD\u5E94\u66F4\u6162\uFF1B\u5173\u95ED\u5219\u76F4\u63A5\u4F5C\u7B54";return t==="auto"?s+"\uFF1B\u81EA\u52A8\u8BC6\u522B\uFF1A"+(n||"\u6309\u63A5\u53E3\u5730\u5740\u4E0E\u6A21\u578B\u540D\u5224\u65AD\u5382\u5546"):n?s+"\uFF1B\u8BE5\u5382\u5546\uFF1A"+n:s}function wa(e,t,n){return u` <div class="rangeslider">
    <div class="slider" id=${e} role="slider" tabindex="0" aria-label=${n} data-slider=${t}>
      <div class="slider__rail"><div class="slider__fill"></div></div>
      <div class="slider__thumb"></div>
      <div class="slider__bubble"></div>
    </div>
    <!-- 数值由滑杆自己写（见 sliderOptions 的 onChange）：同一个节点只允许一个写入方 -->
    <span class="rangeslider__value"></span>
  </div>`}function MS(e){let t=Number(e);i.config.trackGapSeconds=Number.isFinite(t)?t:1,Ed()}function IS(e,t){if(e===t)return!0;if(!e||!t||e.length!==t.length)return!1;for(let n=0;n<e.length;n+=1)if(e[n]!==t[n])return!1;return!0}var Br=class extends qe{constructor(){super(),this._activeSection=ks[0].id,this._navPausedUntil=0,this._navResumeTimer=null,this._sliders=new WeakMap,this._derivedKey=null,this._derived=null,this._throttledNavFollow=Uo(t=>this.navFollow(t))}settingsDerived(){let t=[i.songs,i.allSongsRaw,i.folders,i.filterRules,i.songs.length,i.allSongsRaw.length];if(this._derivedKey&&IS(this._derivedKey,t))return this._derived;let n=new Map;for(let o of i.folders){let l=0;for(let c of i.songs)c.path.startsWith(o.path)&&(l+=1);n.set(o.id,l)}let s=En(i.allSongsRaw,i.filterRules),a=0,r=0;for(let o of i.songs)a+=o.duration,r+=o.size;return this._derivedKey=t,this._derived={perFolder:n,rules:s,totalDuration:a,totalBytes:r},this._derived}get open(){return af()}get panelEl(){return this.querySelector("#settings-layer")}updated(){let t=this.panelEl;if(t){if(this.open){if(this._closeTimer&&(clearTimeout(this._closeTimer),this._closeTimer=null),t.hidden){t.hidden=!1,t.dataset.state="",requestAnimationFrame(()=>{this.open&&(t.dataset.state="opened")});let n=this.querySelector(".settings-layer__body");n&&(n.scrollTop=0)}this.bindSliders(),Mk();return}t.hidden||(t.dataset.state="closed",!this._closeTimer&&(this._closeTimer=setTimeout(()=>{this._closeTimer=null,!this.open&&t&&(t.hidden=!0)},sn()+40)))}}onConnected(){this._onScrollCapture=t=>this.onScroll(t),this.addEventListener("scroll",this._onScrollCapture,!0)}onDisconnected(){this._onScrollCapture&&(this.removeEventListener("scroll",this._onScrollCapture,!0),this._onScrollCapture=null),this._navResumeTimer&&clearTimeout(this._navResumeTimer),this._navResumeTimer=null}disconnectedCallback(){this._closeTimer&&clearTimeout(this._closeTimer),this._closeTimer=null,super.disconnectedCallback()}render(){return qh(),u`
      <section
        class="settings-layer"
        id="settings-layer"
        data-state="closed"
        hidden
        aria-label="设置"
        @click=${t=>this.onClick(t)}
        @change=${t=>this.onChange(t)}
        @input=${t=>this.onInput(t)}
      >
        <div class="settings-layer__panel" role="dialog" aria-modal="true" aria-label="设置">
          <div class="settings-layer__head">
            <svg class="settings-layer__icon" aria-hidden="true"><use href="#i-settings"></use></svg>
            <span class="settings-layer__title">设置</span>
            <span class="u-spacer"></span>
            <button
              class="settings-layer__close u-hit"
              type="button"
              data-settings-close
              aria-label="关闭设置"
              @click=${()=>Vr()}
            >
              ${g("close")}
            </button>
          </div>
          <div class="settings-layer__body">
            <div class="settings">
              <div class="settings__nav" role="tablist">
                ${ks.map(t=>u`<button
                      class="settings__nav-item"
                      type="button"
                      role="tab"
                      data-goto=${t.id}
                      aria-selected=${String(t.id===this._activeSection)}
                    >
                      ${t.label}
                    </button>`)}
              </div>
              <!--
                卡片顺序 = 导航条顺序（SECTIONS 的顺序），同一分类的卡片必须连成一段。
                navFollow() 是按文档顺序取 [data-section] 算高亮的，所以顺序不能随意调：
                某个分类的卡片被别的分类夹断，滚到后一段时高亮就会跳回去。

                分类内部按「常用的靠前」排：
                  · 用户界面 —— 主题（常换）在最前，接着是播放界面样式（装完基本不动）、
                                歌曲列表，最后是窗口与系统（一次设定基本不再动）；
                  · 关于 —— 版本更新在前，应用信息与资料（看过一次就够）在后。
              -->
              ${this.foldersCard()} ${this.rulesCard()} ${this.playbackCard()} ${this.lyricsCard()}
              ${this.loudnessCard()} ${this.themeCard()} ${this.playerCard()} ${this.listCard()} ${this.systemCard()}
              ${this.onlineCard()} ${this.aiCard()} ${this.updateCard()} ${this.aboutCard()} ${this.techCard()}
              ${this.libsCard()} ${this.licenseCard()} ${this.creditsCard()}
            </div>
          </div>
        </div>
      </section>
    `}foldersCard(){let t=this.settingsDerived(),n=ia(),s=n.length?n.map(a=>{let r=a.status==="ok"?u`<span class="chip chip--ok"
                  ><i class="chip__dot"></i>${a.watching?"\u76D1\u542C\u4E2D":"\u5DF2\u505C\u6B62\u76D1\u542C"}</span
                >`:a.status==="missing"?u`<span class="chip chip--error"><i class="chip__dot"></i>路径不存在</span>`:a.status==="denied"?u`<span class="chip chip--warn"><i class="chip__dot"></i>无访问权限</span>`:a.status==="partial"?u`<span class="chip chip--warn"><i class="chip__dot"></i>部分子目录读不到</span>`:a.status==="error"?u`<span class="chip chip--error"><i class="chip__dot"></i>扫描出错</span>`:u`<span class="chip chip--warn"><i class="chip__dot"></i>状态未知</span>`,o=t.perFolder.get(a.id)??0;return u` <div class="pathrow" data-folder=${a.id}>
            <svg class="pathrow__icon" aria-hidden="true"><use href="#i-folder"></use></svg>
            <div class="pathrow__main">
              <div class="pathrow__path u-selectable" title=${a.path}>${a.path}</div>
              <div class="pathrow__meta">${r}<span>${N(o)} 首</span></div>
            </div>
            <button class="btn btn--ghost btn--sm" type="button" data-act="rescan-folder" data-id=${a.id}>
              ${g("refresh")}<span>重新扫描</span>
            </button>
            <button
              class="btn btn--ghost btn--sm"
              type="button"
              data-act="remove-folder"
              data-id=${a.id}
              aria-label="移除文件夹"
            >
              ${g("trash")}
            </button>
          </div>`}):u`<div class="setting__hint">还没有添加音乐文件夹。</div>`;return u` <section class="card" id="sec-folders" data-section="library">
      <div class="card__head">
        <div class="card__icon">${g("folder")}</div>
        <div class="card__titles">
          <div class="card__title">音乐文件夹</div>
          <div class="card__desc">添加本地音乐目录，程序会扫描并实时监听其中的变化</div>
        </div>
        <div class="card__actions">
          <button class="btn" type="button" data-act="scan-now">${g("refresh")}<span>重新扫描</span></button>
          <button class="btn btn--primary" type="button" data-act="add-folder">
            ${g("folder-plus")}<span>添加文件夹</span>
          </button>
        </div>
      </div>
      <div class="card__body">
        ${s}
        <div class="setting setting--group-start">
          <div class="setting__main">
            <div class="setting__label">启动时自动扫描</div>
            <div class="setting__hint">应用启动后在后台增量扫描一次</div>
          </div>
          <div class="setting__control">
            ${Pe("autoScanOnStart",i.config.autoScanOnStart,"\u542F\u52A8\u65F6\u81EA\u52A8\u626B\u63CF")}
          </div>
        </div>
        ${J({label:"\u5B9E\u65F6\u76D1\u542C\u6587\u4EF6\u5939\u53D8\u5316",hint:"\u65B0\u589E\u3001\u5220\u9664\u3001\u91CD\u547D\u540D\u6587\u4EF6\u540E\u81EA\u52A8\u66F4\u65B0\u66F2\u5E93\uFF08\u9700\u8981\u540E\u7AEF\u6587\u4EF6\u76D1\u542C\uFF09",control:Pe("watchFolders",i.config.watchFolders,"\u5B9E\u65F6\u76D1\u542C")})}
        ${J({label:"\u5143\u6570\u636E\u5E76\u53D1\u8BFB\u53D6",hint:"\u540C\u65F6\u89E3\u6790\u7684\u97F3\u9891\u6587\u4EF6\u6570\u91CF\uFF0C\u673A\u68B0\u786C\u76D8\u5EFA\u8BAE\u8C03\u4F4E",control:yt("scanConcurrency",[2,4,8].map(a=>({value:String(a),label:`${a}`})),String(i.config.scanConcurrency))})}
      </div>
      <div class="card__foot">
        <span>支持格式：mp3 · flac · wav · m4a · ogg · aac（ape / wma 需转码）</span>
        <span class="u-num">${N(n.length)} 个文件夹</span>
      </div>
      ${this.unplayableSection()}
    </section>`}unplayableSection(){let t=i.unplayableFiles||[],n=t.length,s=!i.unplayableLoaded,a=i.unplayableOpen===!0;return!n&&!s?u` <div class="unplayable unplayable--empty">
        <span class="unplayable__ok">${g("check")}</span>
        <span>没有发现放不出来的文件</span>
        <span class="unplayable__hint">播放时若某个文件解不出来，会自动记录到这里</span>
      </div>`:u` <div class="unplayable">
      <button
        class="unplayable__head"
        type="button"
        data-act="unplayable-toggle"
        aria-expanded=${String(a)}
        ?disabled=${s}
      >
        <span class="unplayable__icon">${g("info")}</span>
        <span class="unplayable__label">
          ${s?u`正在读取清单…`:u`发现 <b>${N(n)}</b> 个无法播放的文件`}
        </span>
        ${s?A:u`<span class="unplayable__cta">${a?"\u6536\u8D77":"\u67E5\u770B\u662F\u54EA\u4E9B\u6587\u4EF6"}</span>`}
        ${s?A:u`<span class="unplayable__chev" data-open=${String(a)}
                >${g(a?"chevron-down":"chevron-right")}</span
              >`}
      </button>
      ${a&&n?this.unplayableList(t):A}
    </div>`}unplayableList(t){return u` <div class="unplayable__body">
      <div class="unplayable__rows">
        ${t.map(n=>{let s=n.path?n.path:n.songId||"";return u` <div class="unplayable__row">
            <div class="unplayable__main">
              <div class="unplayable__title" title=${n.title||""}>${n.title||n.songId||"\uFF08\u672A\u77E5\u6587\u4EF6\uFF09"}</div>
              <div class="unplayable__sub">
                ${n.artist?u`<span>${n.artist}</span>`:A}
                ${n.ext?u`<span class="unplayable__tag">.${n.ext}</span>`:A}
                ${n.attempts>1?u`<span>失败 ${N(n.attempts)} 次</span>`:A}
                ${n.at?u`<span>${new Date(n.at).toLocaleString("zh-CN")}</span>`:A}
              </div>
              <!-- 路径可选中复制：用户要拿它去文件管理器里找 / 重新下载 -->
              <div class="unplayable__path u-selectable" title=${s}>${s}</div>
              <div class="unplayable__reason" title=${n.reason||""}>${n.reason||"\u672A\u77E5\u539F\u56E0"}</div>
            </div>
            <div class="unplayable__acts">
              <button
                class="btn btn--ghost btn--sm"
                type="button"
                data-act="unplayable-restore"
                data-id=${n.songId}
                data-tip="文件已修好，重新扫描并放回曲库"
              >
                ${g("refresh")}<span>已修好</span>
              </button>
              <button
                class="btn btn--ghost btn--sm"
                type="button"
                data-act="unplayable-dismiss"
                data-id=${n.songId}
                data-tip="只从清单里去掉这条记录"
              >
                ${g("check")}<span>忽略</span>
              </button>
            </div>
          </div>`})}
      </div>
      <div class="unplayable__foot">
        <span>
          这些文件在播放时解不出来，已从曲库移除（<b>磁盘文件没有被删除</b>）。
          修好文件后点「已修好」重新扫描即可回到曲库。
        </span>
        <button class="btn btn--ghost btn--sm" type="button" data-act="unplayable-clear">
          ${g("trash")}<span>清空清单</span>
        </button>
      </div>
    </div>`}ruleRow(t){let n=t.type==="regex"&&t.value&&!sa(t.value);return u` <div class="rule" data-rule=${t.id} data-enabled=${String(t.enabled)}>
      <button
        class="switch"
        type="button"
        role="switch"
        aria-checked=${String(t.enabled)}
        data-act="rule-toggle"
        data-id=${t.id}
        aria-label="启用规则"
      ></button>
      <select class="rule__field" data-act="rule-type" data-id=${t.id}>
        <option value="size" ?selected=${t.type==="size"}>按文件大小</option>
        <option value="regex" ?selected=${t.type==="regex"}>按正则表达式</option>
      </select>
      <select class="rule__op" data-act="rule-op" data-id=${t.id}>
        ${t.type==="size"?[["lt","\u5C0F\u4E8E"],["lte","\u5C0F\u4E8E\u7B49\u4E8E"],["gt","\u5927\u4E8E"],["gte","\u5927\u4E8E\u7B49\u4E8E"],["eq","\u7B49\u4E8E"]].map(([s,a])=>u`<option value=${s} ?selected=${t.op===s}>${a}</option>`):u`<option value="match" ?selected=${t.op==="match"}>匹配</option>`}
      </select>
      <input
        class="rule__value${n?" input--invalid":""}"
        type="text"
        data-act="rule-value"
        data-id=${t.id}
        .value=${t.value}
        placeholder=${t.type==="size"?"\u4F8B\u5982 10240":"\u4F8B\u5982 \\.mp4$"}
      />
      <div class="rule__scope">
        <button
          class="rule__scope-btn"
          type="button"
          data-act="rule-scope"
          data-id=${t.id}
          data-scope="exclude"
          aria-pressed=${String(t.scope==="exclude")}
        >
          排除
        </button>
        <button
          class="rule__scope-btn"
          type="button"
          data-act="rule-scope"
          data-id=${t.id}
          data-scope="include"
          aria-pressed=${String(t.scope==="include")}
        >
          仅包含
        </button>
      </div>
      <button class="rule__del" type="button" data-act="rule-del" data-id=${t.id} aria-label="删除规则">
        ${g("trash")}
      </button>
    </div>`}rulesCard(){let{kept:t,excluded:n,total:s}=this.settingsDerived().rules;return u` <section class="card" id="sec-filters" data-section="library">
      <div class="card__head">
        <div class="card__icon">${g("filter")}</div>
        <div class="card__titles">
          <div class="card__title">过滤规则</div>
          <div class="card__desc">按文件大小或正则表达式排除不需要的文件，规则可开关、可组合</div>
        </div>
        <div class="card__actions">
          <button class="btn btn--sm" type="button" data-act="preset-small">
            ${g("plus")}<span>排除 &lt;10KB</span>
          </button>
          <button class="btn btn--sm" type="button" data-act="preset-mp4">
            ${g("plus")}<span>排除 *.mp4</span>
          </button>
          <button class="btn btn--primary btn--sm" type="button" data-act="rule-add">
            ${g("plus")}<span>新增规则</span>
          </button>
        </div>
      </div>
      <div class="card__body">
        ${i.filterRules.length?i.filterRules.map(a=>this.ruleRow(a)):u`<div class="setting__hint">还没有规则。下面的预置规则可以一键添加。</div>`}
        <div class="rule__preview">
          当前规则下：共扫描 <b>${N(s)}</b> 个文件，保留 <b>${N(t.length)}</b> 首，过滤掉
          <b>${N(n)}</b> 个
        </div>
      </div>
      <div class="card__foot">
        <span>「排除」优先于「仅包含」；支持正则表达式（忽略大小写）</span>
        <span>大小单位在数值后填写，默认字节</span>
      </div>
    </section>`}themeCard(){let t=Fs(),n=qh(),s=window.matchMedia("(prefers-color-scheme: dark)").matches;return u` <section class="card" id="sec-appearance" data-section="ui">
      <div class="card__head">
        <div class="card__icon">${g("palette")}</div>
        <div class="card__titles">
          <div class="card__title">外观</div>
          <div class="card__desc">主题以独立 CSS 文件存在，把文件放进主题目录即可自动出现</div>
        </div>
        <div class="card__actions">
          <button class="btn btn--sm" type="button" data-act="reload-themes">
            ${g("refresh")}<span>重新扫描</span>
          </button>
          <button class="btn btn--sm" type="button" data-act="open-theme-dir">
            ${g("folder")}<span>打开主题文件夹</span>
          </button>
        </div>
      </div>
      <div class="themes">
        ${t.map(a=>{let r=i.config.theme===a.id;return u` <div class="themecard" data-active=${String(r)}>
            <!-- 卡片本体是一个 button：点它换主题。
                     删除按钮必须放在它**外面**（HTML 不允许 button 套 button）。 -->
            <button
              class="themecard__pick"
              type="button"
              data-act="theme-pick"
              data-id=${a.id}
              aria-pressed=${String(r)}
              aria-label=${`\u4F7F\u7528\u4E3B\u9898 ${a.name}`}
            >
              <span class="themecard__swatch">${n(a).map(o=>u`<i data-swatch=${o}></i>`)}</span>
              <span class="themecard__name">${a.name}</span>
              <span class="themecard__id">${a.id}.css</span>
            </button>
            ${a.builtin?u`<span class="themecard__badge">内置</span>`:u`<button
                    class="carddel"
                    type="button"
                    data-act="theme-remove"
                    data-id=${a.id}
                    data-name=${a.name}
                    data-tip="移除主题"
                    aria-label=${`\u79FB\u9664\u4E3B\u9898 ${a.name}`}
                  >
                    ${g("trash")}<span>移除</span>
                  </button>`}
          </div>`})}
        <button class="themes__add" type="button" data-act="theme-help">
          ${g("plus")}
          <span>添加自定义主题</span>
          <span class="u-num u-fs-xs">导入本地文件，也可以从仓库获取或让 AI 写一个</span>
        </button>
      </div>
      <div class="card__body">
        ${J({label:"\u6DF1\u6D45\u8272\u6A21\u5F0F",hint:`\u5F53\u524D\u7CFB\u7EDF\u504F\u597D\uFF1A${s?"\u6DF1\u8272":"\u6D45\u8272"}`,control:yt("themeMode",[{value:"dark",label:"\u6DF1\u8272"},{value:"light",label:"\u6D45\u8272"},{value:"system",label:"\u8DDF\u968F\u7CFB\u7EDF"}],i.config.themeMode)})}
        ${J({label:"\u6BDB\u73BB\u7483\u6A21\u7CCA\u5F3A\u5EA6",hint:"\u63A7\u5236\u9762\u677F\u80CC\u540E\u5185\u5BB9\u7684\u6A21\u7CCA\u7A0B\u5EA6",control:wa("set-blur","glassBlur","\u6A21\u7CCA\u5F3A\u5EA6")})}
        ${J({label:"\u9762\u677F\u4E0D\u900F\u660E\u5EA6",hint:"\u9762\u677F\u80CC\u666F\u7684\u900F\u660E\u7A0B\u5EA6\uFF0C\u6570\u503C\u8D8A\u5927\u8D8A\u900F",control:wa("set-alpha","glassAlpha","\u4E0D\u900F\u660E\u5EA6")})}
        ${J({label:"\u754C\u9762\u52A8\u753B",hint:"\u5173\u95ED\u540E\u53D6\u6D88\u8FC7\u6E21\u4E0E\u65CB\u8F6C\u52A8\u753B\uFF0C\u4F4E\u6027\u80FD\u8BBE\u5907\u66F4\u6D41\u7545",control:Pe("animations",i.config.animations,"\u754C\u9762\u52A8\u753B")})}
        ${J({label:"\u8FC7\u6E21\u901F\u5EA6",hint:"\u5F39\u51FA\u5C42\u3001\u83DC\u5355\u3001\u9762\u677F\u7684\u8FDB\u51FA\u52A8\u753B\u65F6\u957F\uFF1B\u9ED8\u8BA4\u5FEB\u901F 0.25 \u79D2",control:yt("animationsSpeed",ok,i.config.animationsSpeed||"fast")})}
        ${J({label:"\u80CC\u666F\u52A8\u6548\uFF08\u64AD\u653E\u754C\u9762\uFF09",hint:"\u53EA\u5F71\u54CD\u64AD\u653E\u8BE6\u60C5\u9875\u91CC\u6837\u5F0F\u7ED8\u5236\u7684\u80CC\u666F\u52A8\u753B\u3002\u300C\u6D41\u7545\u4F18\u5148\u300D\u8DDF\u968F\u5C4F\u5E55\u5237\u65B0\u7387\uFF08\u9AD8\u5237\u5C4F\u66F4\u987A\u6ED1\uFF09\uFF1B\u300C\u6027\u80FD\u4F18\u5148\u300D\u9650\u5236\u5E27\u7387\u5E76\u8BA9\u6682\u505C\u540E\u7684\u753B\u9762\u505C\u4F4F\uFF0C\u66F4\u7701\u7535\u3002\u5176\u4ED6\u754C\u9762\uFF08\u8BBE\u7F6E\u3001\u66F2\u5E93\u5217\u8868\uFF09\u59CB\u7EC8\u6EE1\u5E27\uFF0C\u4E0D\u53D7\u6B64\u9879\u5F71\u54CD\u3002",control:yt("skinPerformanceMode",lk,i.config.skinPerformanceMode||"smooth")})}
        ${J({label:"\u4E3B\u9898\u8272\u8DDF\u968F\u5C01\u9762",hint:"\u4ECE\u5F53\u524D\u5C01\u9762\u63D0\u53D6\u4E3B\u8272\u8C03\uFF0C\u4F5C\u4E3A\u754C\u9762\u4E3B\u9898\u8272",control:Pe("accentFromCover",i.config.accentFromCover,"\u4E3B\u9898\u8272\u8DDF\u968F\u5C01\u9762")})}
      </div>
    </section>`}listCard(){return u` <section class="card" id="sec-list" data-section="ui">
      <div class="card__head">
        <div class="card__icon">${g("density")}</div>
        <div class="card__titles">
          <div class="card__title">歌曲列表</div>
          <div class="card__desc">列表显示哪些列、每行多高</div>
        </div>
      </div>
      <div class="card__body">
        ${J({label:"\u663E\u793A\u4E13\u8F91\u5217",hint:"\u7A84\u7A97\u53E3\u4E0B\u4F1A\u81EA\u52A8\u9690\u85CF\u8BE5\u5217",control:Pe("showAlbumColumn",i.config.showAlbumColumn,"\u663E\u793A\u4E13\u8F91\u5217")})}
        ${J({label:"\u5217\u8868\u5BC6\u5EA6",hint:"\u5BF9\u300C\u672C\u5730\u6B4C\u66F2\u300D\u300C\u64AD\u653E\u5217\u8868\u300D\u300C\u6B4C\u5355\u300D\u4E09\u4E2A\u5217\u8868\u540C\u65F6\u751F\u6548",control:yt("listDensity",rk,i.config.listDensity||"cozy")})}
      </div>
    </section>`}systemCard(){return u` <section class="card" id="sec-system" data-section="ui">
      <div class="card__head">
        <div class="card__icon">${g("options")}</div>
        <div class="card__titles">
          <div class="card__title">窗口与系统</div>
          <div class="card__desc">圆角与关闭行为；这些设置与系统能力相关</div>
        </div>
      </div>
      <div class="card__body">
        ${J({label:"\u7A97\u53E3\u5706\u89D2",hint:"\u4E3B\u7A97\u53E3\u56DB\u89D2\u7684\u5706\u89D2\u5E45\u5EA6\u3002\u5706\u89D2\u7531\u7CFB\u7EDF\u7ED8\u5236\uFF0C\u53EA\u6709\u8FD9\u51E0\u6863\uFF08\u4EC5 Windows 11 \u6709\u6548\uFF09",control:yt("windowCorners",ik,i.config.windowCorners||"system")})}
        ${J({label:"\u5173\u95ED\u65F6\u6700\u5C0F\u5316\u5230\u6258\u76D8",hint:"\u6253\u5F00\u540E\u70B9\u5173\u95ED\u6309\u94AE\u53EA\u628A\u7A97\u53E3\u6536\u8FDB\u7CFB\u7EDF\u6258\u76D8\uFF08\u4EFB\u52A1\u680F\u53F3\u4E0B\u89D2\uFF09\uFF0C\u97F3\u4E50\u7167\u5E38\u64AD\u653E\uFF1B\u8981\u771F\u6B63\u9000\u51FA\u8BF7\u7528\u6258\u76D8\u56FE\u6807\u7684\u53F3\u952E\u83DC\u5355",control:Pe("minimizeToTray",i.config.minimizeToTray,"\u5173\u95ED\u65F6\u6700\u5C0F\u5316\u5230\u6258\u76D8")})}
        ${J({label:"\u8BB0\u5FC6\u7A97\u53E3\u4F4D\u7F6E\u4E0E\u5927\u5C0F",hint:"\u9000\u51FA\u65F6\u8BB0\u4F4F\u4E3B\u7A97\u53E3\u7684\u4F4D\u7F6E\u3001\u5C3A\u5BF8\u548C\u6700\u5927\u5316\u72B6\u6001\uFF0C\u4E0B\u6B21\u6253\u5F00\u56DE\u5230\u539F\u5904\u3002\u6362\u663E\u793A\u5668\u6216\u6539\u5206\u8FA8\u7387\u540E\u5982\u679C\u7A97\u53E3\u8DD1\u5230\u5C4F\u5E55\u5916\uFF0C\u4F1A\u81EA\u52A8\u56DE\u5230\u5C45\u4E2D\u9ED8\u8BA4\u5927\u5C0F\uFF1B\u4E5F\u53EF\u4EE5\u5728\u8FD9\u91CC\u624B\u52A8\u91CD\u7F6E",control:u`<button
            class="btn btn--ghost btn--sm"
            type="button"
            data-act="reset-main-window-geometry"
            data-tip="把主窗口移回屏幕中央并恢复默认大小"
          >
            重置窗口位置
          </button>`})}
      </div>
    </section>`}playerCard(){let t=qs(),n=Gf();return u` <section class="card" id="sec-player" data-section="ui">
      <div class="card__head">
        <div class="card__icon">${g("disc")}</div>
        <div class="card__titles">
          <div class="card__title">播放界面样式</div>
          <div class="card__desc">
            内置 ${t.filter(s=>s.builtin).length} 款样式；把第三方样式包放进样式目录即可使用
          </div>
        </div>
        <div class="card__actions">
          <button class="btn btn--sm" type="button" data-act="reload-skins">
            ${g("refresh")}<span>重新扫描</span>
          </button>
          <button class="btn btn--sm" type="button" data-act="open-skin-dir">
            ${g("folder")}<span>打开样式目录</span>
          </button>
        </div>
      </div>
      <div class="themes">
        ${t.map(s=>{let a=i.config.playerViewMode===s.id,r=Array.isArray(s.colorsMissing)?s.colorsMissing:[],o=s.chrome||null,l=!o||o.theme===!0,c=l?null:o.preview,d=r.length?`\u672A\u58F0\u660E\u914D\u8272\uFF08\u7F3A ${r.join(" / ")}\uFF09\uFF1A\u5BBF\u4E3B\u5DF2\u7528\u4E3B\u9898\u914D\u8272\u515C\u5E95`:l?"\u8DDF\u968F\u5BBF\u4E3B\u4E3B\u9898\u914D\u8272":o.contrast?`\u5E95\u8272 / \u524D\u666F \xB7 \u5BF9\u6BD4\u5EA6 ${o.contrast}:1${o.corrected?"\uFF08\u5BBF\u4E3B\u5DF2\u81EA\u52A8\u7EA0\u6B63\u5230\u53EF\u8BFB\uFF09":""}`:"\u5DF2\u58F0\u660E\u914D\u8272",p=r.length?`\u6E05\u5355\u91CC\u7684\u914D\u8272\u4E0D\u5B8C\u6574\uFF08${r.join(" / ")}\uFF09\uFF1A\u5BBF\u4E3B\u63A7\u4EF6\u680F\u5DF2\u964D\u7EA7\u4F7F\u7528\u4E3B\u9898\u914D\u8272\u3002\u5EFA\u8BAE\u5728 skin.json \u7684 colors \u91CC\u8865\u4E0A bg / fg`:"";return u` <div class="skincard" data-active=${String(a)}>
            <button
              class="skincard__pick"
              type="button"
              data-act="skin-pick"
              data-id=${s.id}
              aria-pressed=${String(a)}
              aria-label=${`\u4F7F\u7528\u6837\u5F0F ${s.name}`}
            >
              <span class="skincard__icon">${this.skinIcon(s)}</span>
              <span class="skincard__name">${s.name}</span>
              <span class="skincard__id">${s.id}</span>
              <span class="skincard__colors" data-tip=${d} aria-label=${d}>
                <i
                  class="skincard__swatch"
                  style=${c?.bg?`background:${c.bg}`:"background:var(--surface-2)"}
                ></i>
                <i
                  class="skincard__swatch skincard__swatch--fg"
                  style=${c?.fg?`background:${c.fg}`:"background:var(--text-1)"}
                ></i>
              </span>
              ${r.length?u`<span class="skincard__warn" data-tip=${p} aria-label=${p}
                      >${g("warning")}</span
                    >`:A}
            </button>
            ${s.builtin?A:u`<span class="skincard__badge">第三方</span>
                    <button
                      class="carddel"
                      type="button"
                      data-act="skin-remove"
                      data-id=${s.id}
                      data-name=${s.name}
                      data-tip="移除样式"
                      aria-label=${`\u79FB\u9664\u6837\u5F0F ${s.name}`}
                    >
                      ${g("trash")}<span>移除</span>
                    </button>`}
          </div>`})}
        <button class="themes__add" type="button" data-act="skin-help">
          ${g("plus")}
          <span>自定义样式</span>
          <span class="u-num u-fs-xs">导入本地文件，也可以从仓库获取或让 AI 写一个</span>
        </button>
      </div>
      ${n.length?u`<div class="card__body">
              ${n.map(s=>u` <div class="setting">
                    <div class="setting__main">
                      <div class="setting__label">样式「${s.id}」加载失败</div>
                      <div class="setting__hint">${s.reason}</div>
                    </div>
                  </div>`)}
            </div>`:A}
      <div class="card__body">
        ${J({label:"\u5C01\u9762\u8F6E\u64AD",hint:"\u4E00\u9996\u6B4C\u6709\u591A\u5F20\u5C01\u9762\u65F6\uFF0C\u64AD\u653E\u8BE6\u60C5\u9875\u6309\u4E0B\u9762\u7684\u95F4\u9694\u8F6E\u6362\u663E\u793A\uFF08\u4E0D\u5F71\u54CD\u5217\u8868\u7F29\u7565\u56FE\uFF09",control:Pe("coverCarousel",i.config.coverCarousel===!0,"\u5C01\u9762\u8F6E\u64AD")})}
        ${J({label:"\u8F6E\u64AD\u95F4\u9694",hint:"\u6BCF\u9694\u591A\u5C11\u79D2\u5207\u6362\u4E00\u5F20",control:wa("set-carousel","coverCarouselInterval","\u8F6E\u64AD\u95F4\u9694")})}
      </div>
    </section>`}skinIcon(t){return t.iconUrl?u`<i class="skin-icon" style=${`--skin-icon:${Va(t.iconUrl)}`}></i>`:g(t.icon||"disc")}playbackCard(){return u` <section class="card" id="sec-playback" data-section="player">
      <div class="card__head">
        <div class="card__icon">${g("headphones")}</div>
        <div class="card__titles">
          <div class="card__title">播放</div>
          <div class="card__desc">播放模式、随机方式与单击歌曲时的行为</div>
        </div>
      </div>
      <div class="card__body">
        ${J({label:"\u9ED8\u8BA4\u64AD\u653E\u6A21\u5F0F",hint:"\u70B9\u51FB\u5E95\u680F\u5FAA\u73AF\u6309\u94AE\u53EF\u968F\u65F6\u5207\u6362",control:yt("playMode",[{value:"sequence",label:"\u5217\u8868\u5FAA\u73AF"},{value:"loop-one",label:"\u5355\u66F2\u5FAA\u73AF"},{value:"shuffle",label:"\u968F\u673A"}],i.config.playMode==="loop-all"?"sequence":i.config.playMode)})}
        ${J({label:"\u968F\u673A\u64AD\u653E\u65B9\u5F0F",hint:"\u968F\u673A\u64AD\u653E\u4F1A\u5148\u6253\u4E71\u5F53\u524D\u64AD\u653E\u5217\u8868\uFF0C\u518D\u6309\u6253\u4E71\u540E\u7684\u987A\u5E8F\u64AD\u653E",control:yt("shuffleMode",[{value:"reshuffle",label:"\u64AD\u5B8C\u91CD\u65B0\u6253\u4E71"},{value:"once",label:"\u53EA\u6253\u4E71\u4E00\u6B21"}],i.config.shuffleMode||"reshuffle")})}
        ${J({label:"\u8BB0\u5FC6\u97F3\u91CF",hint:"\u8BB0\u4F4F\u4E0A\u6B21\u7684\u97F3\u91CF\uFF0C\u4E0B\u6B21\u542F\u52A8\u65F6\u6062\u590D",control:Pe("rememberVolume",i.config.rememberVolume!==!1,"\u8BB0\u5FC6\u97F3\u91CF")})}
        ${J({label:"\u4FDD\u7559\u6B4C\u66F2\u64AD\u653E\u8FDB\u5EA6",hint:"\u8BB0\u4F4F\u6BCF\u9996\u6B4C\u4E0A\u6B21\u64AD\u5230\u54EA\u513F\uFF1B\u9000\u51FA\u540E\u91CD\u65B0\u6253\u5F00\u4F1A\u56DE\u5230\u90A3\u4E2A\u4F4D\u7F6E\u3002\u53EA\u6062\u590D\u8FDB\u5EA6\u6761\uFF0C\u4E0D\u4F1A\u81EA\u52A8\u5F00\u59CB\u64AD\u653E",control:Pe("resumeProgress",i.config.resumeProgress===!0,"\u4FDD\u7559\u6B4C\u66F2\u64AD\u653E\u8FDB\u5EA6")})}
        ${J({label:"\u8DF3\u8FC7\u5F00\u5934\u65E0\u58F0\u7247\u6BB5",hint:u`开头有一段空白时，播放会自动从出声处开始，不必干等（现场录音与转录文件常见）。<br />
            只跳过开头连续 0.2 秒以上的静音，乐句之间的短暂停顿不会被误伤。<br />
            <span class="u-dim">歌曲长度与进度条仍按原曲显示，歌词与播放进度不会因此错位。</span>`,control:Pe("skipSilenceHead",i.config.skipSilenceHead===!0,"\u8DF3\u8FC7\u5F00\u5934\u65E0\u58F0\u7247\u6BB5")})}
        ${J({label:"\u8DF3\u8FC7\u7ED3\u5C3E\u65E0\u58F0\u7247\u6BB5",hint:u`结尾拖着一长段空白时，播到最后一个声音就结束，紧接着切下一首（CD 抓轨与整轨转录常见）。<br />
            <span class="u-dim">歌曲长度仍按原曲显示；进度条会在原曲的静音起点处停住。</span>`,control:Pe("skipSilenceTail",i.config.skipSilenceTail===!0,"\u8DF3\u8FC7\u7ED3\u5C3E\u65E0\u58F0\u7247\u6BB5")})}
        ${J({label:"\u5207\u6B4C\u95F4\u9694",hint:"\u81EA\u52A8\u5207\u5230\u4E0B\u4E00\u9996\u65F6\u4E2D\u95F4\u7559\u51FA\u7684\u505C\u987F\u3002\u624B\u52A8\u70B9\u300C\u4E0B\u4E00\u9996\u300D\u4E0D\u53D7\u5F71\u54CD\uFF08\u90A3\u662F\u5373\u65F6\u7684\u64CD\u4F5C\uFF09\uFF1B\u8C03\u5230 0 \u8868\u793A\u7D27\u63A5\u7740\u64AD",control:wa("set-track-gap","trackGapSeconds","\u5207\u6B4C\u95F4\u9694")})}
        ${J({label:"\u5355\u51FB\u6B4C\u66F2\u65F6\u7684\u884C\u4E3A",hint:u`双击始终是「立即播放这一首」，此设置只影响单击。<br />
            播放：立刻播放这首歌，并加入播放列表；<br />
            播放当前列表：用当前整个列表替换播放队列，从这首歌开始播；<br />
            下一首播放：插到当前歌曲后面，下一次「下一曲」时播放。`,control:yt("rowClickAction",ak,i.config.rowClickAction||"play")})}
      </div>
    </section>`}lyricsCard(){return u` <section class="card" id="sec-lyrics" data-section="player">
      <div class="card__head">
        <div class="card__icon">${g("lyrics")}</div>
        <div class="card__titles">
          <div class="card__title">歌词</div>
          <div class="card__desc">歌词来源优先级与显示效果</div>
        </div>
      </div>
      <div class="card__body">
        ${J({label:"\u6B4C\u8BCD\u6765\u6E90\u4F18\u5148\u7EA7",hint:"\u5185\u5D4C\u6B4C\u8BCD \u2192 \u540C\u76EE\u5F55 .lrc \u2192 \u6B4C\u8BCD\u7F13\u5B58 \u2192 \u5728\u7EBF\u81EA\u52A8\u5339\u914D\uFF1B\u672C\u5730\u8BFB\u4E0D\u5230\u65F6\u4F1A\u81EA\u52A8\u8054\u7F51\u5339\u914D\u5E76\u5B58\u5165\u7F13\u5B58",control:u`<span class="chip"><i class="chip__dot"></i>${dk()}</span>`})}
        ${J({label:"\u6B4C\u8BCD\u5B57\u53F7",hint:"\u6B4C\u8BCD\u6587\u5B57\u5927\u5C0F\uFF0C\u5F53\u524D\u64AD\u653E\u7684\u90A3\u4E00\u884C\u4F1A\u7565\u5FAE\u653E\u5927\uFF08\u5E95\u680F\u300C\u9009\u9879\u300D\u91CC\u4E5F\u80FD\u8C03\uFF09",control:wa("set-lyric-size","lyricsFontSize","\u6B4C\u8BCD\u5B57\u53F7")})}
        ${J({label:"\u5C45\u4E2D\u9AD8\u4EAE\u884C\u6570",hint:"\u5F53\u524D\u884C\u4E0A\u4E0B\u5404\u663E\u793A\u7684\u884C\u6570",control:yt("lyricsLines",[3,5,7,9].map(t=>({value:String(t),label:String(t)})),String(i.config.lyricsLines))})}
      </div>
    </section>`}loudnessCard(){let t=i.config,n=i.loudnessState||{},s=n.measured??0,a=n.missing??Math.max(0,i.songs.length-s),r=n.total??i.songs.length,o=n.available!==!1,l=(i.ffmpegState||{}).describe||n.describe||"\u68C0\u6D4B\u4E2D\u2026";return u` <section class="card" id="sec-loudness" data-section="player">
      <div class="card__head">
        <div class="card__icon">${g("scale")}</div>
        <div class="card__titles">
          <div class="card__title">响度均衡</div>
          <div class="card__desc">
            让不同来源的歌曲音量听起来一样大。播放到哪首就测哪首，测好后自动记住，下次播放直接用；改动目标响度后会自动重新计算。
          </div>
        </div>
      </div>

      <div class="setting">
        <div class="setting__label">
          <span>均衡模式</span>
          <small class="u-fs-xs u-dim"
            >逐曲：每首歌都调到相同响度；同专辑：整张专辑用同一次调整，保留专辑内部的强弱对比</small
          >
        </div>
        <div class="setting__control">${yt("loudnessMode",CS,t.loudnessMode||"off")}</div>
      </div>

      <div class="setting">
        <div class="setting__label">
          <span>目标响度</span>
          <small class="u-fs-xs u-dim">数值越小整体越轻，推荐用默认档。改动后会自动重新计算</small>
        </div>
        <div class="setting__control">
          <div class="select">
            <select class="select__field" data-act="loudness-target" aria-label="目标响度">
              ${xS.map(c=>u`<option value=${c.value} ?selected=${Number(t.loudnessTarget)===c.value}>
                    ${c.label}
                  </option>`)}
            </select>
            ${g("chevron-down","select__icon")}
          </div>
        </div>
      </div>

      <div class="setting">
        <div class="setting__label">
          <span>真峰值保护</span>
          <small class="u-fs-xs u-dim">音量抬高时自动限制幅度，避免声音破音</small>
        </div>
        <div class="setting__control">
          <button
            class="switch"
            type="button"
            role="switch"
            data-toggle="loudnessLimit"
            aria-checked=${String(!!t.loudnessLimit)}
          >
            <span class="switch__thumb"></span>
          </button>
        </div>
      </div>

      <div class="setting setting--stack">
        <div class="card__actions">
          <button class="btn btn--sm" type="button" data-act="loudness-refresh">
            ${g("refresh")}<span>重新获取响度数据</span>
          </button>
          <button class="btn btn--sm btn--danger" type="button" data-act="loudness-clear">
            ${g("trash")}<span>清除测量数据</span>
          </button>
        </div>

        <div class="setting__hint">
          当前设置下已算好 <b>${s}</b> / ${r}
          首${a?u`，其余 <b>${N(a)}</b> 首会在播放时计算`:"\uFF08\u5168\u90E8\u5DF2\u7B97\u597D\uFF09"}<br />
          响度来源：<b>${o?l:"\u4E0D\u53EF\u7528"}</b>
        </div>
      </div>
    </section>`}onlineCard(){let t=i.config.downloadDir||"\uFF08\u9ED8\u8BA4\uFF1A\u7CFB\u7EDF\u97F3\u4E50\u76EE\u5F55 / downloads\uFF09",n=i.coverProviders||[],s=i.coverBreaker||{},a=n.length?n.map(r=>s[r]?`${id(r)}\uFF08\u6682\u65F6\u4E0D\u53EF\u7528\uFF09`:id(r)).join(" \xB7 "):"\u6B63\u5728\u8BFB\u53D6\u2026";return u` <section class="card" id="sec-online" data-section="data">
      <div class="card__head">
        <div class="card__icon">${g("music")}</div>
        <div class="card__titles">
          <div class="card__title">在线歌曲</div>
          <div class="card__desc">下载位置、封面来源与缓存。试听只加入播放列表，不会混进本地曲库</div>
        </div>
      </div>
      <div class="card__body">
        <div class="setting setting--stack">
          <div class="setting__main">
            <div class="setting__label">下载保存位置</div>
            <div class="setting__hint">
              这个目录会作为曲库的扫描根自动生效，下载完的歌直接出现在「本地歌曲」里， 不需要手动添加文件夹
            </div>
          </div>
          <div class="pathrow">
            <svg class="pathrow__icon" aria-hidden="true"><use href="#i-folder"></use></svg>
            <div class="pathrow__main">
              <div class="pathrow__path u-selectable" title=${t}>${t}</div>
            </div>
            <button class="btn btn--sm" type="button" data-act="download-dir-pick">
              ${g("folder")}<span>更改</span>
            </button>
            <button class="btn btn--ghost btn--sm" type="button" data-act="download-dir-open">
              ${g("expand")}<span>打开</span>
            </button>
            <button
              class="btn btn--ghost btn--sm"
              type="button"
              data-act="download-dir-reset"
              data-tip="恢复默认（系统音乐目录 / downloads）"
            >
              ${g("refresh")}
            </button>
          </div>
        </div>

        ${J({label:"\u6536\u85CF\u65F6\u81EA\u52A8\u4E0B\u8F7D\u5230\u672C\u5730",hint:"\u628A\u53EA\u6709\u8BD5\u542C\u7F13\u5B58\u7684\u5728\u7EBF\u6B4C\u66F2\u52A0\u8FDB\u300C\u6211\u559C\u6B22\u300D\u6216\u67D0\u4E2A\u6B4C\u5355\u65F6\uFF0C\u81EA\u52A8\u4FDD\u5B58\u4E00\u4EFD\u5230\u4E0B\u8F7D\u76EE\u5F55\u3002\u8BD5\u542C\u7F13\u5B58\u653E\u5728\u4E34\u65F6\u76EE\u5F55\u91CC\uFF08\u4F1A\u88AB\u6E05\u7406\u3001\u4E5F\u53EF\u80FD\u88AB\u7CFB\u7EDF\u6E05\u6389\uFF09\uFF0C\u6536\u85CF\u5374\u662F\u957F\u671F\u610F\u56FE \u2014\u2014 \u4E0D\u8865\u8FD9\u4E00\u4EFD\uFF0C\u6536\u85CF\u5939\u91CC\u4F1A\u6DF7\u8FDB\u4E00\u6279\u8FC7\u51E0\u5929\u5C31\u6253\u4E0D\u5F00\u7684\u6B4C\u3002\u5DF2\u7ECF\u4E0B\u8F7D\u8FC7\u6216\u6B63\u5728\u4E0B\u8F7D\u7684\u4E0D\u4F1A\u91CD\u590D\u4E0B\u8F7D",control:Pe("autoDownloadOnCollect",i.config.autoDownloadOnCollect!==!1,"\u6536\u85CF\u65F6\u81EA\u52A8\u4E0B\u8F7D\u5230\u672C\u5730")})}
        ${J({label:"\u8054\u7F51\u83B7\u53D6\u5C01\u9762",hint:`\u5728\u7EBF\u641C\u7D22\u5230\u7684\u6B4C\u66F2\u4F1A\u81EA\u52A8\u53BB\u516C\u5F00\u66F2\u5E93\u5339\u914D\u5C01\u9762\uFF1A${a}`,control:Pe("onlineCover",i.config.onlineCover!==!1,"\u8054\u7F51\u83B7\u53D6\u5C01\u9762")})}
        ${J({label:"\u4F18\u5148\u4F7F\u7528\u9010\u5B57\u6B4C\u8BCD",hint:"\u9010\u5B57\uFF08\u5361\u62C9OK\uFF09\u6B4C\u8BCD\u6765\u81EA QQ \u97F3\u4E50 QRC / \u9177\u72D7 KRC \u8FD9\u4E24\u79CD\u7B2C\u4E09\u65B9\u79C1\u6709\u7F16\u7801\uFF0C\u672C\u7A0B\u5E8F\u53EA\u505A\u517C\u5BB9\u6027\u89E3\u6790\u4EE5\u4FBF\u663E\u793A\u9010\u5B57\u65F6\u95F4\u8F74\u3002\u5173\u6389\u540E\u53EA\u7528\u884C\u7EA7\u6765\u6E90\uFF08LRCLIB / \u7F51\u6613\u4E91\u7B49\uFF09\uFF0C\u6B4C\u8BCD\u4ECD\u7136\u53EF\u7528\uFF0C\u53EA\u662F\u6CA1\u6709\u9010\u5B57\u9AD8\u4EAE\u3002",control:Pe("onlineWordLyrics",i.config.onlineWordLyrics!==!1,"\u4F18\u5148\u4F7F\u7528\u9010\u5B57\u6B4C\u8BCD")})}
        ${J({label:"\u628A\u5C01\u9762/\u6B4C\u8BCD\u5199\u8FDB\u6B4C\u66F2\u6587\u4EF6",hint:uk(),control:Pe("embedMeta",i.config.embedMeta===!0,"\u5199\u8FDB\u6B4C\u66F2\u6587\u4EF6")})}

        <div class="setting setting--stack">
          <div class="setting__main">
            <div class="setting__label">把已有缓存补写进文件</div>
            <div class="setting__hint">${pk()}</div>
          </div>
          <div class="card__actions">
            <button class="btn btn--sm" type="button" data-act="embed-cache-write">
              ${g("tag")}<span>写入缓存到文件</span>
            </button>
          </div>
        </div>

        <div class="setting setting--stack">
          <div class="setting__main">
            <div class="setting__label">缓存目录</div>
            <div class="setting__hint">封面与歌词的缓存位置；${Wd()}</div>
          </div>
          <div class="pathrow">
            <svg class="pathrow__icon" aria-hidden="true"><use href="#i-folder"></use></svg>
            <div class="pathrow__main">
              <div class="pathrow__path u-selectable" data-role="cache-dir" title=${i.coverCache?.dir||""}>
                ${i.coverCache?.dir||"\uFF08\u8FDE\u63A5\u540E\u663E\u793A\uFF09"}
              </div>
            </div>
            <button class="btn btn--sm" type="button" data-act="cache-open-covers">
              ${g("image")}<span>封面</span>
            </button>
            <button class="btn btn--ghost btn--sm" type="button" data-act="cache-open-lyrics">
              ${g("lyrics")}<span>歌词</span>
            </button>
          </div>
        </div>

        <!-- 试听缓存清理：在线歌曲只为试听下载的那份音频（临时目录里的派生数据）。
             需求原话是「清理掉播放器中没有引用的缓存歌曲，比如还在播放列表的歌曲」，
             所以这里必须把「什么会被保留」写在按钮旁边 —— 否则用户不敢点。 -->
        <div class="setting setting--stack" id="online-cache-block">
          <div class="setting__main">
            <div class="setting__label">试听缓存</div>
            <div class="setting__hint">
              在线歌曲只为试听下载的那一份音频（在临时目录里，不是下载目录里的文件）。清理只删<b>没有被引用</b>的：还在播放列表、歌单或「我喜欢」里的会保留，正在播放的那首也保留。当前
              ${Nw(bh())}
            </div>
          </div>
          <div class="card__actions">
            <button class="btn btn--sm" type="button" data-act="online-cache-cleanup">
              ${g("refresh")}<span>清理未引用的缓存</span>
            </button>
          </div>
        </div>

        <!-- 联网与隐私：让用户不读源码也能知道「什么时候联网 / 连到哪 / 怎么关」。
             清单本体在 about-info.js（NETWORK_USAGE / PRIVACY_NOTES），
             改默认开关时要同步那一份。 -->
        <div class="about-subtitle">联网与隐私</div>
        <div class="about-note">
          <div class="about-note__title"><span>会联网的功能</span></div>
          ${El.map(r=>u`<div class="about-note__body">· ${r.what} → ${r.where}（${r.when}；关闭方式：${r.off}）</div>`)}
        </div>
        <div class="about-note">
          <div class="about-note__title"><span>什么留在本机</span></div>
          ${Pl.map(r=>u`<div class="about-note__body">· ${r}</div>`)}
        </div>
        <div class="about-note">
          <div class="about-note__title"><span>下载内容的使用范围</span></div>
          ${li.map(r=>u`<div class="about-note__body">· ${r}</div>`)}
        </div>
      </div>
      <div class="card__foot">
        <span>封面来自公开曲库（${Uf()}），匹配结果不保证完全准确</span>
        <button class="btn btn--sm" type="button" data-act="cover-refresh">
          ${g("refresh")}<span>清空封面与歌词缓存</span>
        </button>
      </div>
    </section>`}aiCard(){let t=i.config||{},n=!!t.aiApiKeySet||!!String(t.aiApiKey||"").trim(),s=!!(String(t.aiBaseUrl||"").trim()&&n),a=String(t.aiBaseUrlProblem||"").trim(),r=(o,l,c,d,p="text")=>u` <div class="setting setting--stack">
        <div class="setting__main">
          <div class="setting__label">${o}</div>
          <div class="setting__hint">${l}</div>
        </div>
        <input
          class="input"
          type=${p}
          data-act="ai-field"
          data-key=${c}
          .value=${c==="aiApiKey"?"":t[c]||""}
          placeholder=${c==="aiApiKey"&&n?"\u5DF2\u4FDD\u5B58\uFF08\u7559\u7A7A\u5219\u4FDD\u6301\u4E0D\u53D8\uFF0C\u8F93\u5165\u65B0\u503C\u53EF\u66FF\u6362\uFF09":d}
          autocomplete="off"
          spellcheck="false"
        />
      </div>`;return u` <section class="card" id="sec-ai" data-section="ai">
      <div class="card__head">
        <div class="card__icon">${g("settings")}</div>
        <div class="card__titles">
          <div class="card__title">AI 相关</div>
          <div class="card__desc">自动匹配歌词 / 封面时，用 AI 从文件名中还原歌曲信息</div>
        </div>
      </div>
      <div class="card__body">
        ${r("\u63A5\u53E3\u5730\u5740\uFF08Base URL\uFF09","OpenAI \u517C\u5BB9\u63A5\u53E3\uFF0C\u4F8B\u5982 https://api.openai.com/v1","aiBaseUrl","https://api.openai.com/v1")}
        ${a?u`<div class="setting__warn" role="alert">
                <span>这个接口地址不会被使用：${a}</span>
                <span class="setting__warn-sub"
                  >本机模型服务（LM Studio / Ollama）请填 http://127.0.0.1:端口；其它地址必须是 https://，且不要用
                  IP。地址不合规时程序不会把 API Key 发出去。</span
                >
              </div>`:null}
        ${r("API Key","\u53EA\u5199\u5165\u672C\u5730\u914D\u7F6E\uFF0C\u4E0D\u4F1A\u53D1\u5F80\u8BE5\u63A5\u53E3\u4EE5\u5916\u7684\u4EFB\u4F55\u5730\u65B9","aiApiKey","sk-...","password")}
        ${r("\u6A21\u578B ID","\u4F8B\u5982 gpt-4o-mini\u3001deepseek-chat\uFF1B\u7559\u7A7A\u9ED8\u8BA4 gpt-4o-mini","aiModelId","gpt-4o-mini")}
        ${J({label:"\u6A21\u578B\u7C7B\u578B",hint:"\u4E0D\u540C\u5382\u5546\u5BF9\u601D\u8003\u6A21\u5F0F\u7684\u652F\u6301\u65B9\u5F0F\u4E0D\u540C\uFF0C\u9009\u9519\u4F1A\u5BFC\u81F4\u8FD9\u4E2A\u5F00\u5173\u4E0D\u751F\u6548\uFF1B\u9009\u300C\u81EA\u52A8\u8BC6\u522B\u300D\u53EF\u81EA\u52A8\u5224\u65AD",control:u` <select class="select__field" data-act="ai-vendor" aria-label="模型类型">
            ${Td.map(o=>u`<option value=${o.id} ?selected=${o.id===(t.aiVendor||"auto")}>${o.label}</option>`)}
          </select>`})}
        ${J({label:"\u542F\u7528\u601D\u8003\u6A21\u5F0F",hint:AS(t),control:Pe("aiThinking",!!t.aiThinking,"\u542F\u7528\u601D\u8003\u6A21\u5F0F")})}
        <!-- AI 自动化提示：这两个开关的效果都发生在用户看不见的时候
             （下载结束后台改写标签 / 匹配歌词前多等一次 AI），所以必须在设置里
             把「会自动做什么、什么时候做、现在开着没有」摆出来。
             清单本体在 ai-automation.js（唯一一份，与开启时的提醒共用）。 -->
        <div class="about-note" id="ai-automation-note">
          <div class="about-note__title"><span>AI 自动化（不用你点，它自己会跑）</span></div>
          ${Mf(t).map(o=>u`<div class="about-note__body">
                · <strong>${o.label}</strong>：${o.when} —— 当前<b>${o.on?"\u5DF2\u5F00\u542F":"\u5DF2\u5173\u95ED"}</b>（${o.detail}）
              </div>`)}
          <div class="about-note__body">
            ${Lw(t)?"\u5F00\u7740\u7684\u65F6\u5019\uFF0C\u64AD\u653E\u5668\u4F1A\u5728\u540E\u53F0\u81EA\u5DF1\u8C03\u7528\u4F60\u586B\u7684\u90A3\u4E2A\u63A5\u53E3\uFF08\u4F1A\u6D88\u8017\u4F60\u7684\u989D\u5EA6\uFF09\u3002\u5173\u6389\u5BF9\u5E94\u7684\u5F00\u5173\u5373\u7ACB\u523B\u505C\u6B62\uFF0C\u5DF2\u5199\u8FDB\u6587\u4EF6\u7684\u6807\u7B7E\u4E0D\u4F1A\u56E0\u6B64\u56DE\u6EDA\u3002":"\u4E24\u9879\u90FD\u5173\u7740\uFF1AAI \u53EA\u5728\u4F60\u624B\u52A8\u89E6\u53D1\u65F6\uFF08\u4F8B\u5982\u8BE6\u60C5\u9875\u7684\u300CAI \u6E05\u6D17\u300D\uFF09\u624D\u4F1A\u8FD0\u884C\u3002"}
          </div>
        </div>
        ${J({label:"\u81EA\u52A8\u5339\u914D\u6B4C\u8BCD\u65F6\u4F7F\u7528 AI \u6E05\u6D17\u5143\u6570\u636E",hint:"\u81EA\u52A8\u5339\u914D\u6B4C\u8BCD\u524D\u5148\u7528 AI \u4ECE\u6587\u4EF6\u540D\u91CC\u8FD8\u539F\u771F\u5B9E\u7684\u6807\u9898 / \u6B4C\u624B\u3002AI \u4E00\u6B21\u8C03\u7528\u53EF\u80FD\u8981\u5341\u51E0\u79D2\uFF0C\u5173\u6389\u540E\u53EA\u505A\u672C\u5730\u6574\u7406\uFF1A\u5339\u914D\u66F4\u5FEB\uFF0C\u4F46\u6587\u4EF6\u540D\u4E0D\u89C4\u8303\u65F6\u547D\u4E2D\u7387\u4F1A\u4F4E\u4E00\u4E9B",control:Pe("aiLyricsClean",i.config.aiLyricsClean!==!1,"\u81EA\u52A8\u5339\u914D\u6B4C\u8BCD\u65F6\u4F7F\u7528 AI \u6E05\u6D17\u5143\u6570\u636E")})}
        ${J({label:"\u4E0B\u8F7D\u6B4C\u66F2\u65F6\u7528 AI \u6574\u7406\u5143\u6570\u636E",hint:"\u4E0B\u8F7D\u5B8C\u6210\uFF08\u76F4\u63A5\u4E0B\u8F7D\u6216\u4ECE\u8BD5\u542C\u7F13\u5B58\u642C\u8FD0\uFF09\u540E\uFF0C\u5728\u540E\u53F0\u628A\u6587\u4EF6\u540D\u4E0E\u73B0\u6709\u4FE1\u606F\u4EA4\u7ED9 AI\uFF0C\u8FD8\u539F\u51FA\u771F\u5B9E\u7684\u6807\u9898 / \u6B4C\u624B / \u4E13\u8F91\u5E76\u5199\u56DE\u6B4C\u66F2\u6587\u4EF6\u3002\u6574\u7406\u5728\u4E0B\u8F7D\u7ED3\u675F\u540E\u624D\u53D1\u751F\uFF0C\u4E0D\u4F1A\u62D6\u6162\u4E0B\u8F7D\uFF1B\u5199\u56DE\u4F1A\u6539\u5199\u6587\u4EF6\u6807\u7B7E\u4E14\u4E0D\u53EF\u64A4\u9500\uFF0C\u53EA\u5728 AI \u7ED9\u51FA\u975E\u7A7A\u5B57\u6BB5\u65F6\u624D\u5199\u3002\u652F\u6301 m4a / flac\uFF0C\u5176\u5B83\u683C\u5F0F\u53EA\u66F4\u65B0\u66F2\u5E93",control:Pe("aiDownloadTag",i.config.aiDownloadTag!==!1,"\u4E0B\u8F7D\u6B4C\u66F2\u65F6\u7528 AI \u6574\u7406\u5143\u6570\u636E")})}
        <!-- 发送内容的常驻说明：横幅式的「首次确认」只在第一次弹（见 settings.js#confirmAIFirstUse），
             真正要能随时查到的是这一段。 -->
        <div class="about-note">
          <div class="about-note__title"><span>AI 会收到什么</span></div>
          <div class="about-note__body">
            · 发送：歌曲的标题 / 歌手 / 专辑 / 时长，以及文件名（只有文件名，不含完整路径）。
          </div>
          <div class="about-note__body">· 不发：曲库列表、播放记录、文件路径与任何设备标识。</div>
          <div class="about-note__body">
            · 接口地址由你自己填写，通常在境外；请自行确认该服务的隐私政策与数据处理方式。
          </div>
          <div class="about-note__body">· 随时可关：清空 Base URL / API Key，或关掉下面两个使用 AI 的开关。</div>
        </div>
        <div class="setting__hint">
          ${s?"\u5DF2\u914D\u7F6E\uFF1A\u81EA\u52A8\u5339\u914D\u5C01\u9762\u65F6\uFF0C\u4F1A\u5148\u628A\u6587\u4EF6\u540D\u4E0E\u73B0\u6709\u5143\u6570\u636E\u4EA4\u7ED9 AI \u6E05\u6D17\uFF0C\u518D\u53BB\u5339\u914D\u3002":"\u5C1A\u672A\u914D\u7F6E\uFF1A\u586B\u5165 Base URL \u4E0E API Key \u540E\u81EA\u52A8\u542F\u7528\u3002"}
        </div>
      </div>
    </section>`}aboutCard(){let t=i.appVersion||is,n=i.lastScan,{totalDuration:s,totalBytes:a}=this.settingsDerived();return u` <section class="card" id="sec-about" data-section="about">
      <div class="card__head">
        <div class="card__icon">${g("info")}</div>
        <div class="card__titles">
          <div class="card__title">关于 ${oi}</div>
          <div class="card__desc">${wl}</div>
        </div>
      </div>
      <div class="card__body">
        <div class="about-hero">
          <div class="about-hero__main">
            <div class="about-hero__title">
              <span class="about-hero__name">${oi}</span>
              <span class="about-hero__version">v${t}</span>
              <span class="chip chip--ok"><i class="chip__dot"></i>${$l}</span>
            </div>
            <div class="about-hero__meta">${_l} · ${yl}</div>
            <div class="about-hero__meta">${kl}</div>
          </div>
          <div class="about-hero__links">
            ${Sl.map(r=>u`<button
                  class="btn btn--sm"
                  type="button"
                  data-act="about-open-url"
                  data-url=${r.url}
                  title=${r.url}
                >
                  ${g(r.icon)}<span>${r.label}</span>
                </button>`)}
          </div>
        </div>
        <div class="setting__hint">
          界面与后端都在本机运行：曲库、封面、歌词缓存在你自己的磁盘上；只有在你主动搜索 / 匹配 / 下载时才会联网。
        </div>
        <div class="kv">
          <div class="kv__k">曲库文件</div>
          <div class="kv__v">${N(i.allSongsRaw.length)} 个</div>
          <div class="kv__k">过滤后歌曲</div>
          <div class="kv__v">${N(i.songs.length)} 首</div>
          <div class="kv__k">被规则过滤</div>
          <div class="kv__v">${N(n?.excluded??0)} 个</div>
          <div class="kv__k">总时长</div>
          <div class="kv__v">${Math.floor(s/36e5)} 小时 ${Math.floor(s%36e5/6e4)} 分</div>
          <div class="kv__k">占用空间</div>
          <div class="kv__v">${wn(a)}</div>
          <div class="kv__k">上次扫描</div>
          <div class="kv__v">${n?new Date(n.at).toLocaleString("zh-CN"):"\u2014"}</div>
          <div class="kv__k">缓存目录</div>
          <div class="kv__v">${i.config.cacheDir}</div>
        </div>
      </div>
      <div class="card__foot">
        <span>版本号来自后端常量（services_app.go#appVersion），与安装包元数据同源</span>
      </div>
    </section>`}updateCard(){let t=i.update||{},n=t.check,s=n?.current||i.appVersion||is,a=n?.latest||"",r=ls(t.channel),o=t.pending,l=t.progress;return u` <section class="card" data-section="about" id="sec-update">
      <div class="card__head">
        <div class="card__icon">${g("refresh")}</div>
        <div class="card__titles">
          <div class="card__title">版本更新</div>
          <div class="card__desc">从 GitHub Releases 检测新版本；网络不好时可走加速代理下载</div>
        </div>
        <span class="u-spacer"></span>
        <span class="chip ${a?"chip--ok":""}"><i class="chip__dot"></i>当前 v${s}</span>
      </div>
      <div class="card__body">
        ${this.updateStatusBlock({check:n,current:s,latest:a,pending:o,progress:l})}
        ${t.error&&!n?.error?u`<div class="setting__hint" style="color:var(--danger,#e5484d)">${t.error}</div>`:A}
        ${l?this.updateProgressBlock(l,n):A}
        ${o?this.updatePendingBlock(o):A}
        ${n?.notes&&n.hasUpdate?this.updateNotesBlock(n):A}

        <div class="setting">
          <div class="setting__main">
            <div class="setting__label">下载通道</div>
            <div class="setting__hint">
              下载安装包时使用。选「自动」会先试直连，失败后自动换下一个代理 ——
              当前：${r.name}${r.note?`\uFF08${r.note}\uFF09`:""}
            </div>
          </div>
          <div class="setting__control">
            <select class="select" data-act="update-channel" aria-label="下载通道">
              ${ea.map(c=>u`<option value=${c.id} ?selected=${c.id===(t.channel||"auto")}>${c.name}</option>`)}
            </select>
          </div>
        </div>

        ${J({label:"\u542F\u52A8\u65F6\u81EA\u52A8\u68C0\u67E5\u66F4\u65B0",hint:"\u53EA\u5728\u53D1\u73B0\u65B0\u7248\u672C\u65F6\u63D0\u793A\uFF1B\u68C0\u67E5\u5931\u8D25\u4E0D\u4F1A\u6253\u6270\u4F60\uFF08\u53EF\u4EE5\u968F\u65F6\u70B9\u4E0A\u9762\u7684\u300C\u68C0\u67E5\u66F4\u65B0\u300D\uFF09",control:Pe("updateCheckOnStart",t.checkOnStart!==!1,"\u542F\u52A8\u65F6\u81EA\u52A8\u68C0\u67E5\u66F4\u65B0")})}

        <div class="setting">
          <div class="setting__main">
            <div class="setting__label">仓库</div>
            <div class="setting__hint">${ci}</div>
          </div>
          <div class="setting__control">
            <button
              class="btn btn--ghost btn--sm"
              type="button"
              data-act="about-open-url"
              data-url=${na}
            >
              ${g("external")}<span>全部版本</span>
            </button>
            <button class="btn btn--ghost btn--sm" type="button" data-act="update-open-dir">
              ${g("folder")}<span>更新目录</span>
            </button>
          </div>
        </div>
      </div>
      <div class="card__foot">
        <span>安装时会退出当前程序，由引导脚本替换文件并自动重启；配置与曲库不受影响</span>
      </div>
    </section>`}updateStatusBlock({check:t,current:n,latest:s,pending:a,progress:r}){let o=i.update||{};if(o.checking)return u` <div class="about-note">
        <div class="about-note__title"><span>正在检查…</span></div>
        <div class="about-note__body">正在向 GitHub 查询最新版本。</div>
        <button class="btn btn--sm" type="button" disabled>${g("refresh")}<span>检查中</span></button>
      </div>`;if(!t)return u` <div class="about-note">
        <div class="about-note__title"><span>尚未检查</span></div>
        <div class="about-note__body">点右边的按钮查询有没有新版本。检查只读取版本信息，不会下载任何东西。</div>
        <button class="btn btn--sm" type="button" data-act="update-check">
          ${g("refresh")}<span>检查更新</span>
        </button>
      </div>`;if(t.error)return u` <div class="about-note">
        <div class="about-note__title">
          <span style="color:var(--danger,#e5484d)">检查失败</span>
        </div>
        <div class="about-note__body">${t.error}</div>
        <button class="btn btn--sm" type="button" data-act="update-check">${g("refresh")}<span>重试</span></button>
      </div>`;if(t.hasUpdate)return t.assetAvailable?u` <div class="about-note">
        <div class="about-note__title">
          <span>发现新版本 ${s}</span>
          <span class="chip chip--ok"><i class="chip__dot"></i>${a?"\u5DF2\u4E0B\u8F7D\uFF0C\u53EF\u4EE5\u5B89\u88C5":r?"\u6B63\u5728\u4E0B\u8F7D":"\u53EF\u4EE5\u66F4\u65B0"}</span>
          ${t.prerelease?u`<span class="chip chip--warn"><i class="chip__dot"></i>预发布</span>`:A}
        </div>
        <div class="about-note__body">
          ${t.assetName} · ${t.assetSizeText||"\u4F53\u79EF\u672A\u77E5"}
          ${t.publishedAt?` \xB7 \u53D1\u5E03\u4E8E ${new Date(t.publishedAt).toLocaleDateString("zh-CN")}`:""}
        </div>
        <div class="setting__control">
          ${r?u`<button class="btn btn--sm" type="button" data-act="update-cancel">
                  ${g("close")}<span>取消下载</span>
                </button>`:a?u`<button class="btn btn--sm" type="button" data-act="update-install">
                    ${g("refresh")}<span>立即安装并重启</span>
                  </button>`:u`<button class="btn btn--sm" type="button" data-act="update-download">
                    ${g("download")}<span>下载更新</span>
                  </button>`}
          <button
            class="btn btn--ghost btn--sm"
            type="button"
            data-act="about-open-url"
            data-url=${t.releaseUrl||na}
          >
            ${g("external")}<span>说明</span>
          </button>
          <button class="btn btn--ghost btn--sm" type="button" data-act="update-skip" data-version=${s}>
            <span>跳过此版本</span>
          </button>
        </div>
      </div>`:u` <div class="about-note">
          <div class="about-note__title">
            <span style="color:var(--warn,#d29922)">新版本 ${s} 没有提供当前平台的安装包</span>
          </div>
          <div class="about-note__body">
            可以到发布页面看看有没有其它形式的分发包，或稍后再试（发行流程可能在补充资产）。
          </div>
          <button
            class="btn btn--sm"
            type="button"
            data-act="about-open-url"
            data-url=${t.releaseUrl||na}
          >
            ${g("external")}<span>去发布页面</span>
          </button>
        </div>`;let l=o.skippedVersion&&s&&o.skippedVersion===s;return u` <div class="about-note">
      <div class="about-note__title">
        <span>已是最新版本（v${n}）</span>
        ${l?u`<span class="chip chip--warn"><i class="chip__dot"></i>已跳过 ${s}</span>`:A}
      </div>
      <div class="about-note__body">
        ${t.checkedAt?`\u4E0A\u6B21\u68C0\u67E5\uFF1A${new Date(t.checkedAt).toLocaleString("zh-CN")}`:""}
      </div>
      ${l?u`<button class="btn btn--sm" type="button" data-act="update-skip" data-version="">
              ${g("refresh")}<span>不再跳过</span>
            </button>`:A}
      <button class="btn btn--ghost btn--sm" type="button" data-act="update-check">
        ${g("refresh")}<span>重新检查</span>
      </button>
    </div>`}updateProgressBlock(t,n){let s=Number(t.total)||0,a=Number(t.done)||0,r=typeof t.percent=="number"&&t.percent>=0?t.percent:s>0?Math.round(a/s*100):0,o=!s&&r===0;return u` <div class="about-note">
      <div class="about-note__title">
        <span>${t.message||"\u6B63\u5728\u4E0B\u8F7D\u2026"}</span>
        ${t.mirrorName?u`<span class="chip"><i class="chip__dot"></i>${t.mirrorName}</span>`:A}
        ${t.attempt>1?u`<span class="chip chip--warn">第 ${t.attempt} 次尝试</span>`:A}
      </div>
      <div
        class="progress"
        role="progressbar"
        aria-valuemin="0"
        aria-valuemax="100"
        aria-valuenow=${o?0:r}
        style="height:6px;border-radius:3px;background:var(--surface-2,#2a2a2e);overflow:hidden"
      >
        <div
          style="height:100%;background:var(--accent,#4c8dff);transition:width .2s ease;width:${o?100:r}%;opacity:${o?.35:1}"
        ></div>
      </div>
      <div class="about-note__body">
        ${o?"\u6B63\u5728\u8FDE\u63A5\u2026":s>0?`${r}% \xB7 ${wn(a)} / ${wn(s)}${t.speedText?` \xB7 ${t.speedText}`:""}`:wn(a)}
        ${n?.assetSizeText?u` <span>（共 ${n.assetSizeText}）</span>`:A}
      </div>
    </div>`}updatePendingBlock(t){return u` <div class="about-note">
      <div class="about-note__title">
        <span>更新包已就绪</span>
        ${t.verified?u`<span class="chip chip--ok"><i class="chip__dot"></i>SHA-256 已校验</span>`:u`<span class="chip chip--warn"><i class="chip__dot"></i>未能校验</span>`}
      </div>
      <div class="about-note__body">
        ${t.name} · ${wn(t.bytes||0)}
        ${t.mirrorId?` \xB7 \u6765\u81EA ${ls(t.mirrorId).name}`:""}
      </div>
      ${t.verified?A:u`<div class="setting__hint">这一版没有找到可用的 SHA-256 校验值，安装前请自行确认来源可信。</div>`}
      <div class="setting__control">
        <button class="btn btn--sm" type="button" data-act="update-install">
          ${g("refresh")}<span>立即安装并重启</span>
        </button>
        <button class="btn btn--ghost btn--sm" type="button" data-act="update-check">
          <span>重新检查</span>
        </button>
      </div>
    </div>`}updateNotesBlock(t){let n=String(t.notes||"").trim(),s=n.length>1200?`${n.slice(0,1200)}\u2026`:n;return s?u` <details class="about-note">
      <summary class="about-note__title" style="cursor:pointer">更新说明</summary>
      <div class="about-note__body" style="white-space:pre-wrap">${s}</div>
    </details>`:A}techCard(){return u` <section class="card" id="sec-tech" data-section="about">
      <div class="card__head">
        <div class="card__icon">${g("bolt")}</div>
        <div class="card__titles">
          <div class="card__title">技术栈</div>
          <div class="card__desc">这个播放器由哪些技术搭起来</div>
        </div>
      </div>
      <div class="card__body">
        ${xl.map(t=>u` <div class="about-row">
              <div class="about-row__main">
                <div class="about-row__title">
                  <button class="linkbtn" type="button" data-act="about-open-url" data-url=${t.url} title=${t.url}>
                    <span>${t.name}</span>${g("external")}
                  </button>
                  <span class="about-row__version">${t.version}</span>
                </div>
                <div class="about-row__desc">${t.role}</div>
              </div>
            </div>`)}
      </div>
      <div class="card__foot">
        <span>界面代码是无需构建即可阅读的原生 ESM；需要类型的地方用 JSDoc + tsc 检查</span>
      </div>
    </section>`}libsCard(){let t=Ll(),n=Ol(t).map(s=>`${s.license} \xD7 ${s.count}`).join(" \xB7 ");return u` <section class="card" id="sec-libs" data-section="about">
      <div class="card__head">
        <div class="card__icon">${g("options")}</div>
        <div class="card__titles">
          <div class="card__title">开源依赖</div>
          <div class="card__desc">随程序一起分发的第三方库；点名字可以打开它的仓库</div>
        </div>
      </div>
      <div class="card__body">
        <div class="libtable">
          <div class="libtable__head"><span>库 / 版本</span><span>许可证</span><span>用途</span></div>
          ${t.map(s=>u` <div class="libtable__row">
                <div class="libtable__cell libtable__cell--name">
                  <button class="linkbtn" type="button" data-act="about-open-url" data-url=${s.url} title=${s.url}>
                    <span>${s.name}</span>${g("external")}
                  </button>
                  <span class="libtable__version">${s.version}</span>
                </div>
                <div class="libtable__cell"><span class="tagchip">${s.license}</span></div>
                <div class="libtable__cell libtable__cell--role">
                  <span class="libtable__kind">${s.kind}</span>${s.role}
                </div>
              </div>`)}
        </div>
        ${Cl.map(s=>u` <div class="about-note">
              <div class="about-note__title">
                <span>${Dl(s)}</span><span class="tagchip tagchip--warn">${s.license}</span>
              </div>
              <div class="about-note__body">${s.role}</div>
              <button class="linkbtn" type="button" data-act="about-open-url" data-url=${s.url} title=${s.url}>
                <span>FFmpeg 许可说明</span>${g("external")}
              </button>
            </div>`)}
      </div>
      <div class="card__foot">
        <span>${n}</span>
      </div>
    </section>`}licenseCard(){return u` <section class="card" id="sec-license" data-section="about">
      <div class="card__head">
        <div class="card__icon">${g("scale")}</div>
        <div class="card__titles">
          <div class="card__title">开源协议</div>
          <div class="card__desc">你可以对这份代码做什么</div>
        </div>
      </div>
      <div class="card__body">
        ${Al.map(t=>u` <div class="about-note">
              <div class="about-note__title">
                <span>${t.label}</span>
                <span class=${t.tone==="ok"?"tagchip tagchip--ok":"tagchip"}>${t.value}</span>
              </div>
              <div class="about-note__body">${t.desc}</div>
            </div>`)}
      </div>
      <div class="card__foot">
        <span>第三方许可证的完整文本随仓库分发（见 THIRD-PARTY-NOTICES.md）</span>
        <button
          class="btn btn--sm"
          type="button"
          data-act="about-open-url"
          data-url="https://www.apache.org/licenses/LICENSE-2.0"
        >
          ${g("external")}<span>阅读 Apache-2.0</span>
        </button>
      </div>
    </section>`}creditsCard(){return u` <section class="card" id="sec-credits" data-section="about">
      <div class="card__head">
        <div class="card__icon">${g("heart")}</div>
        <div class="card__titles">
          <div class="card__title">参考与致谢</div>
          <div class="card__desc">在线能力所依赖的公开数据来源，以及要感谢的人</div>
        </div>
      </div>
      <div class="card__body">
        <div class="about-subtitle">在线数据来源</div>
        ${Ml.map(t=>u` <div class="about-row">
              <div class="about-row__main">
                <div class="about-row__title">
                  <button class="linkbtn" type="button" data-act="about-open-url" data-url=${t.url} title=${t.url}>
                    <span>${t.name}</span>${g("external")}
                  </button>
                </div>
                <div class="about-row__desc">${t.role}</div>
              </div>
            </div>`)}
        <div class="about-subtitle about-subtitle--gap">致谢</div>
        ${Il.map(t=>u` <div class="about-note">
              <div class="about-note__title"><span>${t.title}</span></div>
              <div class="about-note__body">${t.body}</div>
            </div>`)}
      </div>
      <div class="card__foot card__foot--stack">${Tl.map(t=>u`<span>· ${t}</span>`)}</div>
    </section>`}async onClick(t){if(t.target.closest("[data-settings-close]")||t.target===this.panelEl){Vr();return}let n=t.target.closest("[data-goto]")?.dataset.goto;if(n){this.scrollToSection(n);return}let s=t.target.closest("[data-toggle],[data-segment] .segmented__btn");if(s){Pk(s,{commit:$})&&Wt(),this.requestUpdate();return}let a=t.target.closest("[data-act]");a&&(await md(a,{commit:$,render:()=>{i.settingsRev=(i.settingsRev||0)+1,$()},rescan:()=>qa({manual:!0})}),Wt())}async onChange(t){if(t.target.dataset.act)try{await md(t.target,{commit:$,render:()=>{i.settingsRev=(i.settingsRev||0)+1,$()},rescan:()=>qa({manual:!0})}),Wt(),this.requestUpdate()}catch(n){console.error("[settings] \u5904\u7406\u4E0B\u62C9\u6846\u5931\u8D25",n),m(`\u8BBE\u7F6E\u672A\u751F\u6548\uFF1A${n?.message??n}`,{tone:"error",duration:5e3})}}onInput(t){if(t.target.dataset.act!=="rule-value")return;let n=i.filterRules.find(s=>s.id===t.target.dataset.id);n&&(n.value=t.target.value,$(),this.requestUpdate())}onScroll(t){let n=t.target;if(n.classList?.contains("settings-layer__body")){if(this._navPausedUntil){this.deferNavResume();return}this._throttledNavFollow(n)}}navFollow(t){if(this._navPausedUntil)return;let n=t.getBoundingClientRect().top+80,s=ks[0].id;for(let a of ks){let r=this.querySelector(`[data-section="${a.id}"]`);r&&r.getBoundingClientRect().top<=n&&(s=a.id)}t.scrollHeight>t.clientHeight+2&&t.scrollTop+t.clientHeight>=t.scrollHeight-2&&(s=ks[ks.length-1].id),s!==this._activeSection&&(this._activeSection=s,this.paintNav())}paintNav(){for(let t of this.querySelectorAll(".settings__nav-item"))t.setAttribute("aria-selected",String(t.dataset.goto===this._activeSection))}deferNavResume(){clearTimeout(this._navResumeTimer),this._navResumeTimer=setTimeout(()=>{this._navResumeTimer=null,this._navPausedUntil=0},140)}scrollToSection(t){let n=this.querySelector(`[data-section="${t}"]`),s=this.querySelector(".settings-layer__body");if(!n||!s)return;this._activeSection=t,this.paintNav(),this._navPausedUntil=1,this.deferNavResume();let a=this.querySelector(".settings__nav"),r=a?a.offsetHeight:0,o=n.getBoundingClientRect().top-s.getBoundingClientRect().top,l=Math.max(0,s.scrollTop+o-r-8);s.scrollTo({top:l,behavior:"smooth"})}bindSliders(){for(let t of this.querySelectorAll("[data-slider]")){let n=t.dataset.slider;if(!n)continue;let s=this._sliders.get(t);if(!s){s=Ns(t,this.sliderOptions(t,n)),this._sliders.set(t,s);let a=t.parentElement.querySelector(".rangeslider__value");a&&(a.textContent=s.text(this.sliderValue(n)))}s.set(this.sliderValue(n),{silent:!0})}}sliderOptions(t,n){let s=n==="glassBlur",a=n==="glassAlpha",r=n==="coverCarouselInterval",o=n==="trackGapSeconds",l=n==="lyricsFontSize",c=o?0:r?2:l?Hr:s?0:a?20:0,d=o?10:r?60:l?jr:s?48:a?95:100,p=r||o?" \u79D2":s?"px":a?"%":"px",h=o?.1:1,v=o?1:0,w=k=>`${k.toFixed(v)}${p}`;return{min:c,max:d,step:h,value:this.sliderValue(n),format:w,onChange:k=>{i.config[n]=o?Math.round(k*10)/10:k;let C=t.parentElement.querySelector(".rangeslider__value");C&&(C.textContent=w(k)),s&&(i.config.glassBlurCustom=!0,nn("--glass-blur",`${k}px`)),a&&(i.config.glassAlphaCustom=!0,Sd(k)),n==="lyricsFontSize"&&nn("--lyric-size",kd(k)),o&&MS(i.config[n])},onCommit:()=>$()}}sliderValue(t){if(t==="glassBlur")return i.config.glassBlurCustom?i.config.glassBlur:P0();if(t==="glassAlpha")return i.config.glassAlphaCustom?i.config.glassAlpha:Yc();if(t==="trackGapSeconds"){let n=Number(i.config.trackGapSeconds);return Number.isFinite(n)?n:1}return i.config[t]??0}};Re(Br,"deps",t=>[t.settingsOpen,t.settingsRev,t.settingsSection,t.view,t.folders,t.filterRules,t.songs,t.allSongsRaw,t.lastScan?.at??0,t.scanning,_0(),Xf(),t.config,t.coverProviders,t.coverBreaker,t.coverCache,bh().rev,t.loudnessState,t.ffmpegState,t.updateRev]);Se("mp-settings-layer",Br);var Ur=class extends qe{render(){let t=i.floatingLyrics||{show:!1,text:""};return u`
      <div class="desktop-lyrics" id="desktop-lyrics" ?hidden=${!t.show} aria-hidden="true">
        <div class="desktop-lyrics__line" id="desktop-lyrics-line">${t.text}</div>
      </div>
    `}};Re(Ur,"deps",t=>[t.floatingLyrics?.show,t.floatingLyrics?.text]);Se("mp-floating-lyrics",Ur);var Wr=class extends qe{updated(){let t=document.documentElement,n=i.config.listDensity||"cozy";t.dataset.density!==n&&(t.dataset.density=n)}render(){return u`
      <div class="app-bg" id="app-bg" aria-hidden="true"></div>

      <div class="app" id="app" data-view=${i.playerOpen?"player":"library"} data-mode="">
        <div class="skin-bg" id="skin-background" hidden aria-hidden="true"></div>
        <mp-titlebar></mp-titlebar>
        <mp-sidebar></mp-sidebar>
        <mp-content></mp-content>
        <mp-playerview></mp-playerview>
        <mp-playerbar></mp-playerbar>
      </div>

      <mp-queue-panel></mp-queue-panel>
      <mp-options-panel></mp-options-panel>
      <mp-sleep-panel></mp-sleep-panel>
      <mp-download-panel></mp-download-panel>
      <mp-search-overlay></mp-search-overlay>
      <mp-lyrics-panel></mp-lyrics-panel>
      <mp-cover-layer></mp-cover-layer>
      <mp-settings-layer></mp-settings-layer>
      <mp-floating-lyrics></mp-floating-lyrics>

      <div class="scanning" id="scanning" ?hidden=${!i.scanning}>
        <div class="scanning__box">
          <div class="scanning__ring"></div>
          <div class="scanning__text" id="scanning-text">${i.scanText||"\u6B63\u5728\u626B\u63CF\u97F3\u4E50\u6587\u4EF6\u5939\u2026"}</div>
        </div>
      </div>
    `}};Re(Wr,"deps",t=>[t.playerOpen,t.scanning,t.scanText,t.config.listDensity]);Se("mp-app",Wr);var La="",TS=200,yd=class extends Map{set(t,n){for(super.has(t)&&super.delete(t),super.set(t,n);this.size>TS;){let s=super.keys().next();if(s.done)break;super.delete(s.value)}return this}},Vc=new yd,ur=new Map;function ES(){let e=new Image;return e.decoding="async",e.alt="",e}function PS(e){return!i.config.accentFromCover||!Ra(e)?!1:e!==La}function _m(e){if(!Ra(e))return Promise.resolve("");if(Vc.has(e))return Promise.resolve(Vc.get(e));if(ur.has(e))return ur.get(e);let t=new Promise(n=>{let s=o=>{Vc.set(e,o),ur.delete(e),n(o)},a=document.getElementById("bar-cover-img");if(a&&a.getAttribute("src")===e&&a.complete&&a.naturalWidth>0){s(Ds(rh(a)));return}let r=ES();r.addEventListener("load",()=>s(Ra(e)?Ds(rh(r)):"")),r.addEventListener("error",()=>s("")),r.src=e});return ur.set(e,t),t}async function wm(e){e&&L0(e,e)&&(await Wt(),await Dt(i.config))}async function DS(){if(!i.config.accentFromCover||Ds(i.config.coverSeed))return;let e=i.currentId?Be(i.currentId):null,t=e?Rt(e):"";t&&(La=t,await wm(await _m(t)))}function LS(e){if(!i.config.accentFromCover){La="";return}if(e){if(!Ra(e)){La=e;return}PS(e)&&(La=e,_m(e).then(wm))}}function OS(e){D0(Ra(e)?e:"")}var pr=new Set;function $m(e){let t=typeof e?.bvid=="string"?e.bvid.trim():"";if(t)return t;let n=typeof e?.id=="string"?e.id:"";return n.startsWith("bili:")?n.slice(5).trim():""}function RS(e,t,n,s=!0){return s?$m(e)?n===!0?"downloaded":t!==!0?"not-cached":"ok":"local":"disabled"}async function qS(){try{let e=await y.onlineSourceIndex();return{downloads:e?.downloads||{},cache:e?.cache||{}}}catch(e){return console.warn("[auto-download] \u8BFB\u53D6\u5728\u7EBF\u6765\u6E90\u7D22\u5F15\u5931\u8D25",e),{downloads:{},cache:{}}}}async function NS(e,t="collect"){if(!x())return!1;let n=$m(e);if(!n||pr.has(n))return!1;let s=i.config?.autoDownloadOnCollect!==!1,a=await qS();if(RS(e,a.cache?.[n]?.exists===!0,a.downloads?.[n]?.exists===!0,s)!=="ok")return!1;pr.add(n);try{let r=await y.downloadStart(n,e.title||"",e.duration||0);return r?.started?(m(`\u5DF2${t==="like"?"\u6536\u85CF":"\u52A0\u5165\u6B4C\u5355"}\uFF0C\u540C\u65F6\u5728\u540E\u53F0\u4E0B\u8F7D\u4E00\u4EFD\u5230\u672C\u5730`,{duration:3200}),!0):(r?.reason!=="already-running"&&pr.delete(n),!1)}catch(r){return pr.delete(n),console.warn("[auto-download] \u81EA\u52A8\u4E0B\u8F7D\u5931\u8D25\uFF08\u6536\u85CF\u672C\u8EAB\u5DF2\u751F\u6548\uFF09",r),!1}}function FS(){zi((e,t)=>{NS(e,t).catch(()=>{})})}var Yh="";function BS(e){return[i.currentId??"",i.playing?1:0,Math.round((i.position||0)/250),i.duration||0,i.volume,i.muted?1:0,i.config.loudnessMode||"off",Wa()?1:0,mo()?1:0,Math.round(Number(i.config.lyricsFontSize)||16),e].join("|")}function Xh(){let e=i.currentId?Be(i.currentId):null,t=e?Rt(e):"",n=BS(t);if(n!==Yh){if(Yh=n,Yw(),Os(),Wa()){i.playing&&dd();let s=i.playing?R$():null;oS({text:s?s.text:"",trans:s?s.trans:[],chars:s?s.chars:[],words:s?s.words:[],wordEnds:s?s.wordEnds:[],posMs:io(),atMs:Date.now(),playing:!!i.playing,fontSize:Math.round((Number(i.config.lyricsFontSize)||16)*1.5)})}mo()&&(i.playing&&dd(),vd()),LS(t),OS(t)}}function US(){Ft(Xh),Xh()}var zr=null;function WS(){zS(),zr=ie("media:key",e=>{e?.action==="toggle"&&Ut()}),Promise.resolve(y.mediaKeysReady()).catch(e=>{console.warn("[media-keys] \u5411\u540E\u7AEF\u62A5\u5230\u5931\u8D25\uFF08\u5A92\u4F53\u952E\u5728\u6B64\u4E4B\u524D\u6309\u5F15\u64CE\u515C\u5E95\u5904\u7406\uFF09",e)})}function zS(){if(zr){try{zr()}catch{}zr=null}}var Oa=document.getElementById("boot-splash"),hr=document.getElementById("boot-splash__frame");function Jh(){Oa&&(Oa.dataset.hasframe="1")}hr&&(hr.complete?hr.naturalWidth>0&&Jh():hr.addEventListener("load",Jh,{once:!0}));var Qh=!1;function HS(){Qh||(Qh=!0,fetch("/boot/reveal",{cache:"no-store",keepalive:!0}).catch(()=>{}),y.windowReady().catch(()=>{}))}var Zh=!1;function km(){Zh||!Oa||(Zh=!0,Oa.dataset.hide="1",setTimeout(()=>Oa.remove(),400))}HS();setTimeout(km,12e3);var Bn=new Map;async function jS(){await Na(),await DS(),await Dt(i.config),window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change",async()=>{i.config.themeMode==="system"&&(await Dt(i.config),$())})}async function VS(){if(x())try{let e=await y.coverCachedSets();if(!e||typeof e!="object")return;fa(e);let t=Object.keys(e).length;t&&console.info(`[cover] \u5DF2\u4ECE\u7F13\u5B58\u56DE\u586B ${t} \u9996\u6B4C\u7684\u5C01\u9762\uFF08\u542B\u591A\u5C01\u9762\uFF09`)}catch(e){console.info("[cover] \u5C01\u9762\u7F13\u5B58\u56DE\u586B\u8DF3\u8FC7",e?.message??e)}}function KS(){document.addEventListener("keydown",e=>{let t=e.target.tagName,n=t==="INPUT"||t==="TEXTAREA"||t==="SELECT"||e.target.isContentEditable;if(e.key==="Escape"){if(document.getElementById("modal-backdrop")?.hidden===!1)return;Cn(),i.playerOpen&&ho();return}if(!n)switch(e.key){case" ":e.preventDefault(),Ut();break;case"ArrowRight":e.ctrlKey||e.metaKey?ft(!1):$t(i.position+5e3);break;case"ArrowLeft":e.ctrlKey||e.metaKey?ms():$t(i.position-5e3);break;case"ArrowUp":e.preventDefault(),gs(i.volume+.05);break;case"ArrowDown":e.preventDefault(),gs(i.volume-.05);break;case"l":case"L":i.currentId&&It(i.currentId);break;case"p":case"P":hd();break;case"f":case"F":GS();break}})}async function GS(){if(x()){let e=!document.fullscreenElement;await y.windowSetFullscreen(e);return}document.fullscreenElement?await document.exitFullscreen():await document.documentElement.requestFullscreen().catch(()=>{})}function YS(){ie("scan:start",()=>{i.scanning=!0,i.scanText="\u6B63\u5728\u626B\u63CF\u97F3\u4E50\u6587\u4EF6\u5939\u2026",$()}),ie("scan:progress",e=>{e&&(e.phase==="walk"?i.scanText="\u6B63\u5728\u904D\u5386\u97F3\u4E50\u6587\u4EF6\u5939\u2026":e.total&&(i.scanText=`\u6B63\u5728\u8BFB\u53D6\u5143\u6570\u636E ${e.current} / ${e.total}`),$())}),ie("scan:done",async e=>{i.scanning=!1;let t=await y.songs();if(Array.isArray(t)){let s=new Set(i.songs.map(l=>l.id));i.allSongsRaw=t;let{kept:a,excluded:r}=En(t,i.filterRules);i.songs=a;let o=new Set(a.map(l=>l.id));i.lastScan={at:Date.now(),found:t.length,kept:a.length,excluded:r,added:a.filter(l=>!s.has(l.id)).length,removed:[...s].filter(l=>!o.has(l)).length}}let n=await y.folders();Array.isArray(n)&&(i.folders=n),$(),e?.added&&!e?.firstRun&&m(`\u6587\u4EF6\u5939\u53D8\u5316\uFF1A\u65B0\u589E ${e.added} \u9996`,{tone:"success"})}),ie("scan:failed",e=>{i.scanning=!1,$(),m(`\u626B\u63CF\u5931\u8D25\uFF1A${e?.message??"\u672A\u77E5\u9519\u8BEF"}`,{tone:"error",duration:5e3})}),ie("library:unplayable",e=>{if(!e)return;rn().catch(()=>{});let t=e.title||e.songId||"\u8FD9\u9996\u6B4C";m(`\u65E0\u6CD5\u64AD\u653E\uFF1A${t}\uFF08\u5DF2\u8BB0\u5165\u300C\u97F3\u4E50\u6587\u4EF6\u5939\u300D\u6E05\u5355\uFF09`,{tone:"error",duration:6e3}),ua(!0)}),ie("theme:changed",e=>{i.config.theme=e,Dt(i.config),$()}),ie("cover:changed",async e=>{let t=String(e?.id||"");try{if(!t){let s=await y.coverCachedSets();s&&typeof s=="object"&&fa(s);return}let n=await y.coverList(t);n&&Array.isArray(n.items)&&hs(t,n)}catch(n){console.info("[cover] \u540C\u6B65\u5C01\u9762\u5931\u8D25",n?.message??n)}}),ie("loudness:progress",e=>{e&&(i.loudnessState={...i.loudnessState||{},...e,running:!0},$())}),ie("loudness:done",async e=>{i.loudnessState={...i.loudnessState||{},running:!1},$();let t=e?.failed??0;m(t?`\u54CD\u5EA6\u6D4B\u91CF\u5B8C\u6210\uFF1A\u6210\u529F ${e?.done-t} \u9996\uFF0C\u5931\u8D25 ${t} \u9996`:`\u54CD\u5EA6\u6D4B\u91CF\u5B8C\u6210\uFF1A\u5171 ${e?.done??0} \u9996`,{tone:t?"warning":"success",duration:4e3}),await Da(),await oo()}),ie("loudness:failed",e=>{i.loudnessState={...i.loudnessState||{},running:!1},$(),m(`\u54CD\u5EA6\u6D4B\u91CF\u5931\u8D25\uFF1A${e?.message??"\u672A\u77E5\u9519\u8BEF"}`,{tone:"error",duration:6e3})}),ie("ffmpeg:ready",e=>{e&&(i.ffmpegState=e,$(),console.info(`[ffmpeg] ${e.available?e.describe:"\u4E0D\u53EF\u7528"}`))}),ie("download:progress",e=>{if(!e?.bvid)return;let t=e.title||e.bvid,n=Number(e.total)||0,s=Number(e.done)||0,a=n>0?Math.round(s/n*100):0,r=n>0?`\u4E0B\u8F7D\u4E2D ${a}% \xB7 ${t}`:`\u4E0B\u8F7D\u4E2D ${t}`;Bn.has(e.bvid)?Bn.get(e.bvid).update(r):Bn.set(e.bvid,m(r,{duration:0}))}),ie("download:done",e=>{let t=Bn.get(e?.bvid);Bn.delete(e?.bvid);let n=`\u5DF2\u4E0B\u8F7D\uFF1A${e?.title||e?.bvid} \u2192 ${e?.path||e?.dir||""}`;t?t.update(n,"success"):m(n,{tone:"success",duration:5e3}),setTimeout(()=>t?.close(),4e3),di(e?.path)}),ie("download:failed",e=>{let t=Bn.get(e?.bvid);Bn.delete(e?.bvid);let n=`\u4E0B\u8F7D\u5931\u8D25\uFF1A${e?.message??"\u672A\u77E5\u9519\u8BEF"}`;t?t.update(n,"error"):m(n,{tone:"error",duration:6e3}),setTimeout(()=>t?.close(),6e3)}),ie("update:checked",e=>{e&&(i.update.check=e,i.update.checking=!1,i.update.error=e.error||"",$(),e.hasUpdate&&e.assetAvailable&&m(`\u53D1\u73B0\u65B0\u7248\u672C ${e.latest}\uFF0C\u53EF\u5728\u300C\u8BBE\u7F6E \u2192 \u5173\u4E8E\u300D\u4E2D\u66F4\u65B0`,{tone:"success",duration:6e3}))}),ie("update:progress",e=>{e&&(i.update.progress={...i.update.progress||{},...e},$())}),ie("update:downloaded",e=>{e&&(i.update.progress=null,i.update.pending={name:e.name,path:e.path,bytes:e.bytes,verified:e.verified,mirrorId:e.mirrorId},$(),m(`\u66F4\u65B0\u5305\u5DF2\u4E0B\u8F7D\uFF08${e.verified?"\u5DF2\u6821\u9A8C":"\u672A\u6821\u9A8C"}\uFF09\uFF1A${e.name}`,{tone:e.verified?"success":"warning",duration:5e3}))}),ie("update:failed",e=>{i.update.progress=null,i.update.error=e?.message||"\u4E0B\u8F7D\u5931\u8D25",$()}),ie("update:installing",e=>{i.update.progress=null,$(),m(`\u6B63\u5728\u5B89\u88C5 ${e?.name||"\u66F4\u65B0"} \u5E76\u91CD\u542F\u2026`,{duration:4e3})})}function ef(){let e=new URLSearchParams(location.search);if(!e.toString())return;let t=e.get("theme");if(t){i.config.theme=t;let o=Kc(t);o?.mode&&(i.config.themeMode=o.mode)}let n=e.get("tab");n==="settings"?i.settingsOpen=!0:n==="queue"?i.view="queue":n==="playlist"&&(i.view="playlist",i.playlistId=e.get("pl")||i.playlists[1]?.id||null);let s=e.get("pv");s&&(i.pvMode=s,i.config.playerViewMode=s),e.get("view")==="player"&&(i.playerOpen=!0),e.get("playing")==="1"&&(i.playing=!0,i.position=Number(e.get("pos")||62e3)),e.get("scan")==="1"&&(i.scanning=!0,setTimeout(()=>{i.scanning=!1,$()},8e3)),e.get("query")&&(i.query=e.get("query"));let a=Number(e.get("songs"));if(!x()&&Number.isFinite(a)&&a>i.songs.length){let o=i.songs.slice(),l=o.slice();for(;l.length<a;){let c=l.length,d=o[c%o.length];l.push({...d,id:`bench_${c}`,path:`C:/bench/${c}.${d.ext||"mp3"}`})}i.songs=l,i.allSongsRaw=l.slice(),$()}let r=e.get("density");r&&["compact","cozy","roomy"].includes(r)&&(i.config.listDensity=r),e.get("album")==="off"&&(i.config.showAlbumColumn=!1)}async function XS(){await ji(),ef();let e=VS();if(await jS(),N$().then(()=>{Rs(i.config.playerViewMode||""),af()&&F0()}),gl(),H0(),await Z0(),qw(),FS(),lS(),KS(),YS(),ef(),await Ww(),zw(),Ed(),Lf(),WS(),US(),await e,await Dt(i.config),ad(),requestAnimationFrame(()=>requestAnimationFrame(km)),await Da(),await oo(),Ai().catch(()=>{}),Hi(),Ya(),window.addEventListener("beforeunload",()=>{Wt()}),document.body.dataset.ready="true",fetch("/boot/booted",{cache:"no-store",keepalive:!0}).catch(()=>{}),new URLSearchParams(location.search).get("probe")==="1"){let{runProbe:t}=await Vn(async()=>{let{runProbe:n}=await Promise.resolve().then(()=>(Qp(),Jp));return{runProbe:n}},[]);setTimeout(()=>{let n=t();window.__probeReport=n,console.info("[probe]",n)},600)}x()||console.info(`%c\u6D4F\u89C8\u5668\u9884\u89C8\u6A21\u5F0F%c
\u5F53\u524D\u4F7F\u7528\u5047\u6570\u636E\u6E32\u67D3\u754C\u9762\u3002\u63A5\u5165 Go + Wails3 \u540E\u7AEF\u540E\uFF0C\u540C\u540D\u524D\u7AEF\u7684 store/bridge \u4F1A\u81EA\u52A8\u6539\u8D70\u540E\u7AEF\u65B9\u6CD5\u3002`,"background:#fff;color:#000;padding:2px 6px;border-radius:4px;font-weight:700","color:#888")}XS().catch(e=>{console.error("[app] \u542F\u52A8\u5931\u8D25",e),m(`\u542F\u52A8\u5931\u8D25\uFF1A${e.message}`,{tone:"error",duration:6e3})});window.addEventListener("unhandledrejection",e=>{let t=e.reason,n=t?.message||String(t||"\u672A\u77E5\u9519\u8BEF");/no backend|preview:/i.test(n)||(console.error("[app] \u672A\u5904\u7406\u7684\u5F02\u6B65\u9519\u8BEF",t),m(n.length>120?`${n.slice(0,120)}\u2026`:n,{tone:"error",duration:6e3}))});window.addEventListener("error",e=>{e.message&&console.error("[app] \u8FD0\u884C\u65F6\u9519\u8BEF",e.error||e.message)});window.__app={state:i,commit:$,navigate:As,openPlayer:tm,closePlayer:ho,rescan:ma,doRescan:qa,currentSong:ot,isLiked:mt,nextIndex:fs,setPlayerViewMode:Rs,applyGainForSong:Os,skinsToken:()=>y.skinsToken(),sourceIndex:()=>y.onlineSourceIndex(),protectIDs:e=>y.onlineProtectIDs(e),cleanupCache:()=>y.onlineCleanupCache(),searchState:te};var Hd=Object.freeze(Object.defineProperty({__proto__:null,closeCoverPanel:xa,openCoverPanel:kS},Symbol.toStringTag,{value:"Module"}));
