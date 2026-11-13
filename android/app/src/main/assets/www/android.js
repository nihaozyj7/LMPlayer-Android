/* ==========================================================================
   android.js — 手机端外壳交互（不改打包产物里的组件代码）
   --------------------------------------------------------------------------
   主页结构（第三版）：

     顶部 appbar：菜单图标 + 当前视图标题 + 搜索图标
     头部第二行：表头（排序字段 + 首数）+ 一排纯图标按钮
     主内容区  ：曲目列表，顶部下拉刷新
     右下角    ：定位当前播放的悬浮按钮
     底部      ：单条播放栏（封面 / 标题·歌手 / 播放暂停 / 队列）

   这里补的是桌面产物里没有、手机上必须有的东西：

      1. appbar 标题：直接取桌面 #content-title，只有一条映射（本地歌曲→全部歌曲）；
      2. 分类抽屉：汉堡拉出侧栏，并在里面补「切换主题 / 设置 / 下载任务」；
      3. 表头：自建（桌面 .tracks__head 的列与数据行对不上），点它借道桌面的
         排序面板；桌面排序按钮被 CSS 隐掉，用的是程序化 click；
      4. 下拉刷新：替代桌面那个「重新扫描」按钮，任意视图可用；
      5. 浮标：替代桌面的「定位到当前播放」图标按钮；
      6. 播放栏：整条点按进详情页（桌面只有封面和标题可点，手机上那样太难戳中）；
      7. 搜索整页：在线 / 本地分段，默认在线；本地结果自己渲染、点按播放；
      8. 设置整页化：分类列表页 → 分区页，返回箭头逐级退回；
      9. window.__lmAndroidBack：系统返回键接到同一套层级上。
   ========================================================================== */

(function () {
  "use strict";

  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));
  const app = () => document.getElementById("app");

  const svg = (id, cls) =>
    '<svg class="' + (cls || "") + '" aria-hidden="true"><use href="#i-' + id + '"></use></svg>';

  /* ------------------------------------------------------------------ 抽屉 */

  function burger() {
    const btn = document.createElement("button");
    btn.id = "android-burger";
    btn.type = "button";
    btn.setAttribute("aria-label", "菜单");
    btn.innerHTML =
      '<svg viewBox="0 0 24 24" aria-hidden="true">' +
      '<path d="M4 7h16M4 12h16M4 17h16"/></svg>';
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      toggleDrawer();
    });
    return btn;
  }

  function backdrop() {
    let el = document.getElementById("sb-backdrop");
    if (el) return el;
    el = document.createElement("button");
    el.id = "sb-backdrop";
    el.type = "button";
    el.setAttribute("aria-label", "关闭菜单");
    el.hidden = true;
    el.addEventListener("click", () => setDrawer(false));
    // 必须挂在 #app 里面，不能挂 body：
    //   #app 是 position:relative + z-index:10 的层叠上下文，挂到 body 下的
    //   遮罩（z-index 9400）会把整个 #app 连同里面 z-index:9500 的抽屉一起压住，
    //   表现就是「抽屉拉出来了，但点任何一行都没反应（其实点是打在遮罩上）」。
    //   放进 #app 内部后，9400 与 9500 才在同一上下文里比较。
    const host = document.getElementById("app") || document.body;
    host.appendChild(el);
    return el;
  }

  function setDrawer(open) {
    const root = app();
    if (!root) return;
    root.classList.toggle("sb-open", open);
    backdrop().hidden = !open;
    document.body.classList.toggle("sb-locked", open);
  }

  function toggleDrawer() {
    const root = app();
    if (!root) return;
    setDrawer(!root.classList.contains("sb-open"));
  }

  function drawerOpen() {
    const root = app();
    return Boolean(root && root.classList.contains("sb-open"));
  }

  /* --------------------------------------------------- 抽屉里的入口（注入） */

  function drawerRow(act, icon, label, extra) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "m-drawer-row";
    btn.dataset.mAct = act;
    btn.innerHTML =
      '<span class="m-drawer-row__icon">' + svg(icon) + "</span>" +
      '<span class="m-drawer-row__label">' + label + "</span>" +
      (extra ? '<span class="m-drawer-row__tail">' + extra + "</span>" : "");
    return btn;
  }

  function injectDrawer() {
    const scroll = $(".sidebar__scroll");
    if (!scroll) return false;
    if (scroll.dataset.mReady === "1") return true;

    const head = document.createElement("div");
    head.className = "m-drawer-head";
    head.innerHTML =
      '<span class="m-drawer-head__logo">' + svg("music") + "</span>" +
      "<span>LMPlayer</span>";

    const themeRow = drawerRow("theme", "palette", "切换主题", "");
    themeRow.id = "m-drawer-theme";
    syncThemeTail();

    const topSep = document.createElement("div");
    topSep.className = "m-drawer-sep";

    scroll.insertBefore(topSep, scroll.firstChild);
    scroll.insertBefore(themeRow, topSep);
    scroll.insertBefore(head, themeRow);

    const botSep = document.createElement("div");
    botSep.className = "m-drawer-sep";
    const settingsRow = drawerRow("settings", "settings", "设置", "");
    settingsRow.id = "m-drawer-settings";
    const downloadsRow = drawerRow("downloads", "download", "下载任务", "");
    downloadsRow.id = "m-drawer-downloads";
    scroll.appendChild(botSep);
    scroll.appendChild(settingsRow);
    scroll.appendChild(downloadsRow);

    scroll.addEventListener("click", (e) => {
      const t = e.target;
      if (!t || !t.closest) return;
      const row = t.closest("[data-m-act]");
      if (!row) return;
      const act = row.dataset.mAct;
      setDrawer(false);
      if (act === "theme") clickIfPresent("#btn-theme-toggle");
      else if (act === "settings") clickIfPresent("#btn-settings");
      else if (act === "downloads") clickIfPresent("#btn-downloads");
    });

    // 桌面的侧栏是一直可见的，所以它点完行不会收；手机上用户点「全部歌曲 /
    // 我喜欢 / 某个歌单」之后抽屉必须自己滑回去 —— 以前只有上面注入的那几行
    // 会关，桌面原生的行点了不关，用户以为「点了没反应」，只能再点遮罩。
    // 「新建歌单」那个小按钮要排除：它弹的是输入框，收抽屉会打断输入。
    scroll.addEventListener("click", (e) => {
      const t = e.target;
      if (!t || !t.closest) return;
      if (!t.closest(".navitem, .playlist__item, [data-playlist-id]")) return;
      setTimeout(() => setDrawer(false), 0);
    });

    scroll.dataset.mReady = "1";
    return true;
  }

  /** 抽屉里的「切换主题」右侧显示当前主题名，切完立刻更新。 */
  function syncThemeTail() {
    const row = document.getElementById("m-drawer-theme");
    if (!row) return;
    const tail = $(".m-drawer-row__tail", row);
    if (!tail) return;
    const name = document.documentElement.dataset.theme || "";
    const text = name
      ? name.replace(/-/g, " ").replace(/(^|\s)\S/g, (c) => c.toUpperCase())
      : "跟随设置";
    if (tail.textContent !== text) tail.textContent = text;
  }

  /* -------------------------------------------------- 顶部：当前视图标题 */

  /** 侧栏第一项「本地歌曲」在手机上叫「全部歌曲」：手机看不到侧栏分组标题，
   *  「本地歌曲」单独出现时容易被读成"只搜本地"，而它就是整个曲库。 */
  function normalizeNav() {
    for (const it of $$("#sidebar .navitem")) {
      const t = $(".navitem__text", it);
      if (t && t.textContent.trim() === "本地歌曲") t.textContent = "全部歌曲";
    }
  }

  function mountAppbar() {
    const bar = $(".titlebar");
    if (!bar) return false;
    let title = document.getElementById("m-appbar-title");
    if (!title) {
      title = document.createElement("div");
      title.id = "m-appbar-title";
      title.className = "m-appbar-title";
      const actions = $(".titlebar__actions", bar);
      bar.insertBefore(title, actions || null);
    }
    return true;
  }

  /** 标题直接取桌面那份 #content-title —— 它已经算好了「全部歌曲 / 播放列表 /
   *  歌单名」，跟着视图走，不用在手机上再写一套映射。 */
  function syncAppbar() {
    const title = document.getElementById("m-appbar-title");
    const src = document.getElementById("content-title");
    if (!title || !src) return;
    let text = (src.textContent || "").trim();
    // 侧栏那一项叫「本地歌曲」，手机上统一叫「全部歌曲」
    if (text === "本地歌曲") text = "全部歌曲";
    if (text && title.textContent !== text) title.textContent = text;
  }

  /* ------------------------------------------ 表头：点一下换排序字段/方向 */

  /** 手机表头只留「排序字段 + 方向 + 数量」，点它弹桌面的排序面板。
   *
   *  桌面 `.tracks__head` 自己有 data-sort 按钮，但它的网格列在窄屏断点下
   *  和数据行对不上（实测 head 3 列 / row 7 列），直接显示必然错位；
   *  而排序面板（openSortMenu，锚点是 [data-tool="sort"]）本来就把所有字段与
   *  升降序列全了，比表头三列还全，所以这里自建表头、复用那个面板。 */
  function mountThead() {
    const header = document.getElementById("content-header");
    if (!header) return false;
    if (document.getElementById("m-thead")) return true;
    const thead = document.createElement("div");
    thead.id = "m-thead";
    thead.className = "m-thead";
    thead.innerHTML =
      '<button type="button" class="m-thead__sort" id="m-thead-sort">' +
      '<span id="m-thead-field"></span>' +
      '<svg class="m-thead__dir" viewBox="0 0 24 24" aria-hidden="true">' +
      '<path d="M12 5v14M6 11l6 6 6-6" fill="none" stroke="currentColor" ' +
      'stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
      "</button>" +
      '<span class="m-thead__count" id="m-thead-count"></span>';
    // 塞进 content-header 内、与工具条图标同一行：手机上头部只留一行
    header.insertBefore(thead, header.firstChild);
    $("#m-thead-sort", thead).addEventListener("click", openSortMenu);
    return true;
  }

  function sortButton() {
    return $('#content-tools [data-tool="sort"]');
  }

  function syncThead() {
    const thead = document.getElementById("m-thead");
    if (!thead) return;
    const root = app();
    const st = window.__app && window.__app.state;
    // 判视图用 state.view：.app[data-view] 会滞后一拍（切到队列后属性还是 library）
    const view = st && st.view ? st.view : root && root.dataset.view;
    const sortable = view === "library" || view === "playlist";
    thead.dataset.sortable = sortable ? "1" : "0";

    const btn = sortable ? sortButton() : null;
    if (btn) {
      const label = $("span", btn);
      const field = document.getElementById("m-thead-field");
      const text = label ? (label.textContent || "").trim() : "";
      if (field && text && field.textContent !== text) field.textContent = text;
      const dirEl = $(".m-thead__dir", thead);
      if (dirEl) dirEl.dataset.dir = btn.dataset.dir === "asc" ? "asc" : "desc";
    }

    const sub = document.getElementById("content-subtitle");
    const count = document.getElementById("m-thead-count");
    const num = sub ? (sub.textContent || "").split("·")[0].trim() : "";
    if (count && num && count.textContent !== num) count.textContent = num;

    // 队列视图与多选态里右下角浮标会挡住行尾的「更多」，收起来
    if (root) {
      const hide = view === "queue" || Boolean(st && st.playlistSelecting);
      const want = hide ? "0" : "1";
      if (root.dataset.mfab !== want) root.dataset.mfab = want;
    }
  }

  /** 点表头 = 点桌面的排序按钮。它在工具条里被 CSS 隐掉了，但 display:none
   *  不影响程序化 click，事件照样冒泡到 content-header 的 onHeaderClick。
   *  面板本身在手机上被样式改成了贴底 sheet，所以不用再管锚点位置。 */
  function openSortMenu() {
    const btn = sortButton();
    if (btn) btn.click();
  }

  /* -------------------------------------------- 右下角悬浮：定位当前播放 */

  function mountFab() {
    const root = app();
    if (!root) return false;
    if (document.getElementById("m-fab-locate")) return true;
    const fab = document.createElement("button");
    fab.type = "button";
    fab.id = "m-fab-locate";
    fab.className = "m-fab";
    fab.setAttribute("aria-label", "定位到当前播放");
    fab.innerHTML = svg("disc", "m-fab__icon");
    fab.addEventListener("click", () =>
      clickIfPresent('#content-tools [data-tool="locate"]')
    );
    root.appendChild(fab);
    return true;
  }

  /* --------------------------------------- 下拉刷新（顶掉「重新扫描」按钮） */

  const PULL_MAX = 84;

  let pullFrom = 0;
  let pullFromX = 0;
  let pullDist = 0;
  let pulling = false;

  function pullIndicator() {
    let el = document.getElementById("m-pull");
    if (el) return el;
    const main = document.getElementById("main");
    if (!main) return null;
    el = document.createElement("div");
    el.id = "m-pull";
    el.className = "m-pull";
    el.innerHTML =
      '<span class="m-pull__dot"></span><span class="m-pull__text">下拉刷新</span>';
    main.appendChild(el);
    return el;
  }

  function setPull(px) {
    const el = pullIndicator();
    const body = document.getElementById("content-body");
    if (el) {
      el.style.opacity = px > 6 ? "1" : "0";
      el.style.transform = "translateY(" + Math.round(px) + "px)";
      el.dataset.hot = px >= PULL_MAX * 0.7 ? "1" : "0";
    }
    if (body) {
      // 拖动中不要过渡，否则指示器与列表会"追手指"
      body.style.transition = px > 0 ? "none" : "";
      body.style.transform = px > 0 ? "translateY(" + Math.round(px) + "px)" : "";
    }
  }

  function pullText(text) {
    const el = document.getElementById("m-pull");
    if (!el) return;
    const t = $(".m-pull__text", el);
    if (t && t.textContent !== text) t.textContent = text;
  }

  function bindPullRefresh() {
    const body = document.getElementById("content-body");
    if (!body || body.dataset.mPull === "1") return false;
    body.dataset.mPull = "1";
    pullIndicator();

    body.addEventListener(
      "touchstart",
      (e) => {
        if (e.touches.length !== 1 || body.scrollTop > 0) return;
        pulling = true;
        pullFrom = e.touches[0].clientY;
        pullFromX = e.touches[0].clientX;
        pullDist = 0;
      },
      { passive: true }
    );

    body.addEventListener(
      "touchmove",
      (e) => {
        if (!pulling || e.touches.length !== 1) return;
        const dy = e.touches[0].clientY - pullFrom;
        const dx = Math.abs(e.touches[0].clientX - pullFromX);
        // 只在「列表已在顶部 + 往下拖」时接管，其余一律交还原生滚动。
        // 横向优先（|dx| > |dy|）也要放行：那是左边缘拉抽屉的手势，
        // 抢过来会把抽屉判成「下拉刷新」。
        if (dy <= 0 || body.scrollTop > 0 || dx > Math.abs(dy)) {
          pulling = false;
          setPull(0);
          return;
        }
        pullDist = Math.min(PULL_MAX, dy * 0.55);
        setPull(pullDist);
      },
      { passive: true }
    );

    const end = () => {
      if (!pulling) return;
      pulling = false;
      const hit = pullDist >= PULL_MAX * 0.7;
      setPull(0);
      if (hit) rescan();
    };
    body.addEventListener("touchend", end);
    body.addEventListener("touchcancel", end);
    return true;
  }

  function rescan() {
    const api = window.__app;
    if (api && api.state && api.state.scanning) return;
    const el = pullIndicator();
    if (el) {
      el.dataset.busy = "1";
      el.style.opacity = "1";
      el.style.transform = "translateY(24px)";
    }
    pullText("正在扫描…");
    // 桌面的扫描按钮只在曲库视图渲染；用后端暴露的 doRescan 保证任何视图都能刷
    if (api && typeof api.doRescan === "function") api.doRescan({ manual: true });
    else clickIfPresent('#content-tools [data-tool="rescan"]');
  }

  function syncPullBusy() {
    const el = document.getElementById("m-pull");
    if (!el || el.dataset.busy !== "1") return;
    const st = window.__app && window.__app.state;
    if (st && st.scanning) return;
    el.dataset.busy = "0";
    el.style.opacity = "0";
    el.style.transform = "translateY(0px)";
    pullText("下拉刷新");
  }

  function clickIfPresent(sel) {
    const el = $(sel);
    if (!el) return false;
    el.click();
    return true;
  }

  /* --------------------------------------------------------- 设置整页化 */

  const SECTION_ICONS = {
    library: "folder",
    player: "headphones",
    ui: "palette",
    data: "refresh",
    ai: "bolt",
    about: "info",
  };

  function settingsLayer() {
    return document.querySelector("mp-settings-layer .settings-layer");
  }

  function settingsOpen() {
    const layer = settingsLayer();
    if (!layer || layer.hidden) return false;
    return layer.dataset.state === "opened";
  }

  const CHEV =
    '<svg class="m-set-item__chev" viewBox="0 0 24 24" aria-hidden="true">' +
    '<path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" ' +
    'stroke-linecap="round" stroke-linejoin="round"/></svg>';

  function enhanceSettings() {
    const layer = settingsLayer();
    if (!layer) return false;
    const head = $(".settings-layer__head", layer);
    const body = $(".settings-layer__body", layer);
    const settings = $(".settings", layer);
    if (!head || !body || !settings) return false;
    if (layer.dataset.mReady === "1") return true;

    const items = $$(".settings__nav-item", settings);
    if (!items.length) return false;

    // ① 分类列表页（设置首页）
    const home = document.createElement("div");
    home.className = "m-set-home";
    for (const it of items) {
      const id = it.dataset.goto;
      const label = (it.textContent || "").trim();
      if (!id) continue;
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "m-set-item";
      btn.dataset.goto = id;
      btn.innerHTML =
        '<span class="m-set-item__icon">' +
        svg(SECTION_ICONS[id] || "options", "") +
        "</span>" +
        '<span class="m-set-item__label">' +
        label +
        "</span>" +
        CHEV;
      btn.addEventListener("click", () => openSection(id, label));
      home.appendChild(btn);
    }
    body.insertBefore(home, body.firstChild);

    // ② 返回箭头（只在分区页出现，标题跟着变成分类名）
    const back = document.createElement("button");
    back.type = "button";
    back.className = "m-set-back";
    back.id = "m-set-back";
    back.setAttribute("aria-label", "返回设置");
    back.innerHTML =
      '<svg viewBox="0 0 24 24" aria-hidden="true">' +
      '<path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="2" ' +
      'stroke-linecap="round" stroke-linejoin="round"/></svg>';
    back.addEventListener("click", () => {
      // 分区页：退一级；分类首页：整个设置页关闭（桌面的 × 被我们藏了，
      // 没有这个按钮的话首页只能靠系统返回键退出）
      if (layer.dataset.msec) closeSection();
      else clickIfPresent("mp-settings-layer [data-settings-close]");
    });
    head.insertBefore(back, head.firstChild);

    layer.dataset.mReady = "1";
    return true;
  }

  function setTitle(text) {
    const layer = settingsLayer();
    if (!layer) return;
    const title = $(".settings-layer__title", layer);
    if (title) title.textContent = text;
  }

  function openSection(id, label) {
    const layer = settingsLayer();
    if (!layer) return;
    layer.dataset.msec = id;
    setTitle(label || "设置");
    const body = $(".settings-layer__body", layer);
    if (body) body.scrollTop = 0;
  }

  function closeSection() {
    const layer = settingsLayer();
    if (!layer) return;
    delete layer.dataset.msec;
    setTitle("设置");
    const body = $(".settings-layer__body", layer);
    if (body) body.scrollTop = 0;
  }

  /* ------------------------------------------------------ 搜索：在线 / 本地 */

  const SEGS = [
    { id: "online", label: "在线" },
    { id: "local", label: "本地" },
  ];

  function searchOverlay() {
    return document.querySelector("#search-overlay");
  }

  function searchPanel() {
    const ov = searchOverlay();
    return ov ? $(".search-overlay__panel", ov) : null;
  }

  function enhanceSearch() {
    const ov = searchOverlay();
    const panel = searchPanel();
    if (!ov || !panel) return false;
    if (panel.dataset.mReady === "1") return true;

    const seg = document.createElement("div");
    seg.className = "m-seg";
    for (const s of SEGS) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "m-seg__btn";
      btn.dataset.mseg = s.id;
      btn.setAttribute("aria-selected", s.id === "online" ? "true" : "false");
      btn.textContent = s.label;
      btn.addEventListener("click", () => setSearchMode(s.id));
      seg.appendChild(btn);
    }
    const searchBox = $(".search-overlay__search", panel);
    if (searchBox) panel.insertBefore(seg, searchBox);
    else panel.appendChild(seg);

    // 桌面只有在线一种来源，标题写着「在线搜索」；手机上多了一个「本地」分段
    const title = $(".search-overlay__title", panel);
    if (title) title.textContent = "搜索";

    const results = document.createElement("div");
    results.id = "m-local-results";
    const body = $(".search-overlay__body", panel);
    if (body) panel.appendChild(results);
    else panel.appendChild(results);

    const input = $("#search-input");
    if (input) {
      input.addEventListener("input", () => {
        if (searchMode() === "local") renderLocal(input.value);
      });
    }

    ov.dataset.mmode = "online";
    panel.dataset.mReady = "1";
    return true;
  }

  function searchMode() {
    const ov = searchOverlay();
    return (ov && ov.dataset.mmode) || "online";
  }

  function setSearchMode(mode) {
    const ov = searchOverlay();
    if (!ov) return;
    ov.dataset.mmode = mode;
    for (const btn of $$(".m-seg__btn", ov)) {
      btn.setAttribute("aria-selected", btn.dataset.mseg === mode ? "true" : "false");
    }
    const input = $("#search-input");
    if (mode === "local") {
      renderLocal(input ? input.value : "");
      if (input) input.focus();
    }
  }

  /** 曲库里的 duration 是毫秒（5000 = 5 秒），这里统一换算成 mm:ss。 */
  function fmtTime(ms) {
    const s = Math.max(0, Math.round((Number(ms) || 0) / 1000));
    const m = Math.floor(s / 60);
    const r = s % 60;
    return m + ":" + String(r).padStart(2, "0");
  }

  function songsForLocalSearch() {
    const st = window.__app && window.__app.state;
    if (!st) return [];
    return Array.isArray(st.songs) ? st.songs : Array.isArray(st.allSongsRaw) ? st.allSongsRaw : [];
  }

  function renderLocal(query) {
    const box = document.getElementById("m-local-results");
    if (!box) return;
    const q = (query || "").trim().toLowerCase();
    if (!q) {
      box.innerHTML = '<div class="m-res-empty">输入关键词搜索本地曲库</div>';
      box.dataset.q = "";
      return;
    }
    const needle = q;
    const hits = songsForLocalSearch()
      .filter((s) => {
        const hay = ((s.title || "") + " " + (s.artist || "") + " " + (s.album || "")).toLowerCase();
        return hay.indexOf(needle) >= 0;
      })
      .slice(0, 200);

    box.textContent = "";
    if (!hits.length) {
      box.innerHTML = '<div class="m-res-empty">没有找到「' + escapeHtml(query.trim()) + "」</div>";
      box.dataset.q = q;
      return;
    }
    for (const s of hits) {
      const row = document.createElement("button");
      row.type = "button";
      row.className = "m-res";
      row.dataset.id = s.id;
      const cover = s.coverUrl || s.cover || "";
      row.innerHTML =
        (cover
          ? '<img class="m-res__cover" alt="" loading="lazy" src="' + escapeAttr(cover) + '" />'
          : '<span class="m-res__cover"></span>') +
        '<span class="m-res__meta">' +
        '<span class="m-res__title">' + escapeHtml(s.title || "") + "</span>" +
        '<span class="m-res__sub">' +
        escapeHtml([s.artist, s.album].filter(Boolean).join(" · ")) +
        "</span></span>" +
        '<span class="m-res__time">' + fmtTime(s.duration) + "</span>";
      row.addEventListener("click", () => playLocalSong(s.id));
      box.appendChild(row);
    }
    box.dataset.q = q;
  }

  /** 本地搜索结果点按 → 播这一首。
   *
   *  播放逻辑在打包产物里（playContext），没有对外暴露，所以走「让列表去播」：
   *  先导航到曲库（保证这一行存在于 DOM），再点那一行的播放按钮。
   *  Lit 是异步渲染，所以按帧重试几次，而不是假设立刻就有节点。 */
  function playLocalSong(id) {
    const api = window.__app;
    if (api && typeof api.navigate === "function") api.navigate("library", null);

    let tries = 0;
    const tick = () => {
      const row = document.querySelector('.track[data-id="' + cssEscape(id) + '"]');
      const btn = row && row.querySelector('[data-act="play"]');
      if (btn) {
        btn.click();
        closeSearch();
        return;
      }
      if (++tries > 16) closeSearch();
      else requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  function closeSearch() {
    clickIfPresent("mp-search-overlay [data-search-close]");
  }

  function cssEscape(v) {
    if (window.CSS && CSS.escape) return CSS.escape(String(v));
    return String(v).replace(/["\\]/g, "\\$&");
  }

  function escapeHtml(v) {
    return String(v == null ? "" : v)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function escapeAttr(v) {
    return escapeHtml(v).replace(/'/g, "&#39;");
  }

  /* ------------------------------------------- 播放栏：整条点按进详情页 */

  function bindPlayerbar() {
    const bar = document.getElementById("playerbar");
    if (!bar || bar.dataset.mReady === "1") return;
    bar.addEventListener("click", (e) => {
      const t = e.target;
      if (!t || !t.closest) return;
      // 按钮自己管自己：播放/暂停、队列、详情态里的工具行
      if (t.closest("#btn-play, #btn-playlist, #btn-prev, #btn-next, .playerbar__tools, .playerbar__progress")) {
        return;
      }
      const root = app();
      if (root && root.dataset.view === "player") return;
      // 不走桌面的 openPlayer：那条路径是「一次性 CSS 过渡」，没有跟手。
      pvOpenAuto();
    });
    bar.dataset.mReady = "1";
  }

  /* --------------------------------------------- 曲目行：单击即播（手机习惯） */
  /* 桌面上单击行是"选中"、双击才播放 —— 手机没有双击这个手势，
     用户点一行就是要点开它。多选模式下保持桌面行为，否则会跟选歌冲突。 */
  function bindTrackRows() {
    const body = document.getElementById("content-body");
    if (!body || body.dataset.mReady === "1") return;
    body.addEventListener("click", (e) => {
      const t = e.target;
      if (!t || !t.closest) return;
      if (t.closest("button, a, input, .track__more, .track__handle")) return;
      const row = t.closest(".track[data-id]");
      if (!row) return;
      const st = window.__app && window.__app.state;
      if (st && st.playlistSelecting) return;
      const btn = row.querySelector('[data-act="play"]');
      if (btn) btn.click();
    });
    body.dataset.mReady = "1";
  }

  /* ------------------------------------------------- 播放详情态与返回键 */

  function syncPlayerView() {
    const pv = document.getElementById("playerview");
    const root = app();
    const st = window.__app && window.__app.state;
    const view = (st && st.view) || (root && root.dataset.view);
    const open =
      Boolean(pv && !pv.hidden && pv.dataset.state === "opened") && view === "player";
    document.body.dataset.pv = open ? "1" : "0";
  }

  function anyVisible(sel) {
    const el = document.querySelector(sel);
    if (!el) return false;
    if (el.hidden) return false;
    const style = getComputedStyle(el);
    if (style.display === "none" || style.visibility === "hidden" || style.opacity === "0") return false;
    const rect = el.getBoundingClientRect();
    return rect.width > 8 && rect.height > 8;
  }

  function searchOpen() {
    const ov = searchOverlay();
    if (!ov || ov.hidden) return false;
    return ov.dataset.state === "opened";
  }

  /* ------------------------------------------------------ 去掉 hover 浮标 */

  function stripTips() {
    for (const el of $$("[data-tip]")) el.removeAttribute("data-tip");
  }

  /* --------------------------------------------------- 抽屉：边缘拉出 + 跟手 */
  /* 桌面的抽屉是「类名切换 + CSS 过渡」：一按下就开始自己跑完，接不住手指。
     手机上要能从左边一路拉着走、中途松手能回弹，所以拖动期间关掉过渡直接写
     transform，松手后再把状态交还给 .sb-open 类。 */

  function bindDrawerSwipe() {
    const root = app();
    const sb = $(".sidebar");
    if (!root || !sb || sb.dataset.mSwipe === "1") return false;
    sb.dataset.mSwipe = "1";

    let sx = 0;
    let sy = 0;
    let w = 0;
    let off = 0;
    let armed = false;
    let dragging = false;
    let wasOpen = false;
    let lastX = 0;
    let lastT = 0;
    let vel = 0;

    const widthOf = () => sb.getBoundingClientRect().width || Math.min(innerWidth * 0.84, 340);

    const begin = (x, y, isOpen) => {
      w = widthOf();
      sx = x;
      sy = y;
      lastX = x;
      lastT = performance.now();
      vel = 0;
      off = isOpen ? 0 : -w;
      armed = true;
      dragging = false;
      sb.classList.add("m-drag");
      sb.style.transform = "translateX(" + off + "px)";
      if (!isOpen) {
        // 先切到「开」的类并把遮罩挂上，之后由 inline transform 控制位置；
        // 中途放弃时 end() 里再 setDrawer(false) 收回去。
        root.classList.add("sb-open");
        const bd = backdrop();
        bd.hidden = false;
        bd.style.opacity = "0";
      }
    };

    const move = (x, y) => {
      const now = performance.now();
      if (now > lastT) vel = (x - lastX) / (now - lastT);
      lastT = now;
      lastX = x;
      if (!dragging) {
        const dx = x - sx;
        const dy = Math.abs(y - sy);
        if (dy > 14 && dy > Math.abs(dx)) {
          armed = false; // 竖向：交还原生滚动
          return;
        }
        if (Math.abs(dx) < 12) return;
        // 关着的抽屉只能往右拉，开着的只能往左推
        if ((wasOpen && dx > 0) || (!wasOpen && dx < 0)) {
          armed = false;
          return;
        }
        dragging = true;
      }
      off = wasOpen
        ? Math.max(-w, Math.min(0, x - sx))
        : Math.max(-w, Math.min(0, -w + (x - sx)));
      sb.style.transform = "translateX(" + off.toFixed(1) + "px)";
      const bd = backdrop();
      if (bd && !bd.hidden) bd.style.opacity = String(Math.max(0, Math.min(1, 1 - Math.abs(off) / w)));
    };

    const end = () => {
      if (!armed) return;
      armed = false;
      sb.classList.remove("m-drag");
      sb.style.transform = "";
      const bd = backdrop();
      if (bd) bd.style.opacity = "";
      if (!dragging) {
        setDrawer(wasOpen); // 只是点了一下
        return;
      }
      dragging = false;
      const vis = 1 - Math.abs(off) / w; // 露出来的比例
      let open = vis > 0.5;
      if (vel > 0.4) open = true;
      else if (vel < -0.4) open = false;
      setDrawer(open);
    };

    document.addEventListener(
      "touchstart",
      (e) => {
        if (e.touches.length !== 1) return;
        const t = e.touches[0];
        wasOpen = drawerOpen();
        // 只做「打开后左滑关闭」。不做「左缘右滑打开」：Android 手势导航的
        // 返回热区就在屏幕左缘（约 20~30dp、整屏高度），我们从边缘接管的结果
        // 是实测直接触发了系统返回 —— 应用被切后台，比没有手势更糟。
        // 打开入口仍然是汉堡按钮。
        if (!wasOpen) return;
        if (!(e.target && e.target.closest && e.target.closest(".sidebar"))) return;
        begin(t.clientX, t.clientY, wasOpen);
      },
      { passive: true, capture: true }
    );

    document.addEventListener(
      "touchmove",
      (e) => {
        if (!armed || e.touches.length !== 1) return;
        const t = e.touches[0];
        move(t.clientX, t.clientY);
        if (dragging) e.preventDefault();
      },
      { passive: false, capture: true }
    );

    document.addEventListener("touchend", end, { passive: true, capture: true });
    document.addEventListener("touchcancel", end, { passive: true, capture: true });
    return true;
  }

  /* ======================================================================
     播放详情页转场
     ----------------------------------------------------------------------
     三条实测出来的前提，决定了这里的写法：

     1) 以前用 rAF 每帧写 --pv-p。主线程一旦被皮肤动态 import、封面/歌词
        RPC 的回调卡住，rAF 就整段停 —— 实测打开动画只跑了 3 帧，然后一个
        307~446ms 的空档直接跳到终点。用户看到的就是「闪现、不可预测」。
        ⇒ 播放在途的动画必须交给合成线程：只动 transform / opacity，
          用 CSS transition 跑，主线程卡住它也不掉帧。

     2) 以前底栏高度写成 bottom: var(--h-playerbar)，而 --h-playerbar 又跟着
        进度变 ⇒ 面板每帧都在变高变矮，整块舞台（含皮肤 DOM）每帧重新布局。
        实测单帧 9~18ms，模拟器上直接掉到个位数帧率。
        ⇒ 面板尺寸在整个转场里恒定（底部 190dp 用 padding 让出来），
          只让 transform 动；底栏自己的高度变化只影响它那个小子树。

     3) 把自定义属性写在 .app 上会让「整棵树」的样式失效（自定义属性可继承，
        引擎会把全部后代标脏），曲库几百行每帧白重算一遍。
        ⇒ 不再用自定义属性驱动，改成直接写那几个元素的行内样式。

     于是结构变成三段：
       · 停点（点开、点返回）：pvPaint(0|1, ms) 直接写带过渡的行内样式；
       · 跟手：pvPaint(p, 0) 逐帧写，transition 关掉，手指到哪就是哪；
       · 松手/打断：把当前值当起点再切到停点，浏览器从「当前值」插值，
         所以拖到 47% 松手不会跳，动画中途按下去也能接住。
     ====================================================================== */

  const PV_MS = 320;
  const PV_EASE = "cubic-bezier(0.22, 0.61, 0.36, 1)";

  const pvS = {
    p: 0, // 0 = 主页播放栏，1 = 详情页完全展开
    open: false, // .m-pv-open 是否在
    phase: "", // "" | "opening" | "closing" | "dragging"
    closing: false, // 这次拖拽的方向（true = 往下关）
    dragging: false,
    ready: false, // 面板内容是否已挂载（data-state=opened）
    refs: null,
    ghost: null,
    ghostOn: false,
    real: null,
    from: null, // 播放栏封面 rect（视口坐标）
    to: null, // 舞台封面 rect（面板内坐标）
    coverSrc: "",
    timer: 0,
  };

  function pvEl() {
    return document.getElementById("playerview");
  }

  function pvBar() {
    return document.getElementById("playerbar") || document.querySelector(".playerbar");
  }

  function pvReady() {
    const el = pvEl();
    return Boolean(el && !el.hidden && el.dataset.state === "opened");
  }

  function openPlayerNow() {
    const root = app();
    if (root && root.dataset.view === "player") return;
    if (window.__app && typeof window.__app.openPlayer === "function") window.__app.openPlayer();
    else clickIfPresent("#bar-cover");
  }

  function closePlayerNow() {
    if (window.__app && typeof window.__app.closePlayer === "function") window.__app.closePlayer();
    else clickIfPresent("#btn-player-back");
  }

  function pvRefs() {
    const el = pvEl();
    const bar = pvBar();
    return {
      el,
      bar,
      now: bar && bar.querySelector(".playerbar__now"),
      prog: bar && bar.querySelector(".playerbar__progress"),
      center: bar && bar.querySelector(".playerbar__center"),
      tools: bar && bar.querySelector(".playerbar__tools"),
      head: el && el.querySelector(".playerview__head"),
      stage: document.getElementById("playerview-stage"),
    };
  }

  /** 舞台里的真实封面：皮肤各有各的 DOM ——
      经典皮肤是 `.disc`（黑胶盘片，里面再贴一张 146px 的封面图），
      其它皮肤可能是 `.cover` / `img`。所以**不能**只按面积挑最大元素：
      整块侧栏（.classic__side）比封面大得多，选错就会「封面飞到歌词上」。
      先按封面语意挑，挑不到才退回 img/canvas。 */
  function pvStageCover() {
    const stage = document.getElementById("playerview-stage");
    if (!stage) return null;
    const sRect = stage.getBoundingClientRect();
    const maxArea = sRect.width * sRect.height * 0.6;
    let best = null;
    let area = 0;
    const pick = (sel) => {
      for (const el of stage.querySelectorAll(sel)) {
        const r = el.getBoundingClientRect();
        if (r.width < 100 || r.height < 100) continue;
        const a = r.width * r.height;
        if (a > maxArea) continue;
        if (a > area) {
          area = a;
          best = el;
        }
      }
    };
    pick('.disc, [class*="disc"], [class*="cover"], [class*="Cover"]');
    if (!best) pick("img, canvas, video");
    return best;
  }

  /** 量一次几何。舞台封面记的是「面板内坐标」而不是视口坐标：
      调用时面板可能整块在屏幕外（translateY(100%)），视口坐标会带上这段位移。 */
  function pvMeasure() {
    const el = pvEl();
    if (!el) return false;
    const barImg = document.getElementById("bar-cover-img");
    const barRect = barImg ? barImg.getBoundingClientRect() : null;
    pvS.from = barRect && barRect.width > 8 ? barRect : null;
    pvS.coverSrc = barImg ? barImg.getAttribute("src") || "" : "";
    const real = pvStageCover();
    pvS.real = real;
    if (real) {
      const r = real.getBoundingClientRect();
      const p = el.getBoundingClientRect();
      pvS.to = { left: r.left - p.left, top: r.top - p.top, width: r.width, height: r.height };
    } else {
      pvS.to = null;
    }
    return true;
  }

  /* ------------------------------------------------------- 封面替身（共享元素）
     替身直接挂在面板里、摆在舞台封面那个槽位上，只把「缩放」从播放栏封面的
     比例长到 1。这样它天然跟着面板走（面板动它动，同一个合成层），不用自己
     算插值路径 —— 之前把替身 fixed 在 body 上、按线性插值飞过去，中途会看
     到封面「飘出面板上沿」，因为面板是被缓动曲线拖着的，两条路径根本不同步。 */

  function pvGhostMake() {
    if (!pvS.to) {
      pvS.ghostOn = false;
      return false;
    }
    const el = pvEl();
    if (!el) return false;
    let g = pvS.ghost;
    if (!g) {
      g = document.createElement("img");
      g.className = "m-pv-ghost";
      g.alt = "";
      el.appendChild(g);
      pvS.ghost = g;
    }
    if (pvS.coverSrc && g.getAttribute("src") !== pvS.coverSrc) g.src = pvS.coverSrc;
    g.style.transition = "none";
    g.style.display = "block";
    g.style.left = pvS.to.left + "px";
    g.style.top = pvS.to.top + "px";
    g.style.width = pvS.to.width + "px";
    g.style.height = pvS.to.height + "px";
    pvS.ghostOn = true;
    pvGhostPaint(pvS.p, 0);
    return true;
  }

  function pvGhostPaint(p, ms) {
    const g = pvS.ghost;
    if (!g || !pvS.ghostOn || !pvS.to) return;
    const toW = pvS.to.width || 1;
    const k = pvS.from && pvS.from.width > 8 ? pvS.from.width / toW : 0.24;
    const s = k + (1 - k) * p; // 从「播放栏封面那么大」长到 1
    const dur = ms | 0;
    g.style.transition = dur
      ? "transform " + dur + "ms " + PV_EASE + ", border-radius " + dur + "ms linear, opacity 120ms linear"
      : "none";
    // 顺带从下方 54px 处升到位，避免「原地放大」那种假感
    g.style.transform =
      "translate3d(0," + ((1 - p) * 54).toFixed(1) + "px,0) scale(" + s.toFixed(4) + ")";
    // 播放栏是圆角方图，舞台封面多是圆形盘片：圆角一路插值过去，
    // 免得最后一下从方块跳成圆盘。
    g.style.borderRadius = (10 + 40 * Math.min(1, p * 1.15)).toFixed(1) + "%";
    g.style.opacity = p > 0.99 ? "0" : "1";
    if (pvS.real) pvS.real.style.opacity = p >= 0.995 ? "" : "0";
  }

  function pvGhostDrop() {
    pvS.ghostOn = false;
    const g = pvS.ghost;
    if (g) {
      g.style.transition = "none";
      g.style.display = "none";
    }
    if (pvS.real) pvS.real.style.opacity = "";
  }

  /* ---------------------------------------------------------------- 落样式 */

  const pvTr = (node, val, ms) => {
    if (!node) return;
    node.style.transition = ms ? "transform " + ms + "ms " + PV_EASE : "none";
    node.style.transform = val;
  };
  const pvOp = (node, val, ms) => {
    if (!node) return;
    node.style.transition = ms ? "opacity " + ms + "ms linear" : "none";
    node.style.opacity = String(val);
  };

  /** 唯一「把进度 p 落成样式」的地方。ms=0 是跟手帧，>0 是带过渡的停点。
      **只有两个 transform + 一组 opacity**，全部是 p 的纯函数：
        · 面板   整个屏幕高，从 100% 滑到 0；
        · 底栏   恒定 190dp，从下移 122dp 滑到 0（露出 68 → 190dp）；
        · 内容   主页那一行先让位，三行控件后浮现（区间不重叠）。
     不是"多个元素各演一段"，所以手指停在哪一帧，画面就停在哪一帧。 */
  const PV_BAR_LIFT = 122;

  function pvPaint(p, ms) {
    p = Math.max(0, Math.min(1, p));
    const r = (pvS.refs = pvS.refs || pvRefs());
    const dur = ms | 0;
    pvTr(r.el, "translate3d(0," + ((1 - p) * 100).toFixed(3) + "%,0)", dur);
    // 底栏：整体从「下移 122dp（只露 68dp）」滑到 0 —— 和面板同一个 p、同一个
    // 方向，看起来就是一张卡片被拉上来，而不是几个元素各演一段。
    pvTr(r.bar, "translate3d(0," + (PV_BAR_LIFT * (1 - p)).toFixed(2) + "px,0)", dur);
    // 内容交叉：主页那一行在前 30% 让位，三行控件在 15%~75% 浮现。
    // 两个区间不重叠，所以不会出现「标题压着工具行」。
    pvOp(r.now, Math.max(0, 1 - p * 3.2), dur);
    const toolOp = Math.max(0, Math.min(1, (p - 0.15) / 0.6));
    pvOp(r.prog, toolOp, dur);
    pvOp(r.center, toolOp, dur);
    pvOp(r.tools, toolOp, dur);
  }

  function pvClearInline() {
    const r = pvS.refs || {};
    for (const node of [r.el, r.bar, r.stack, r.now, r.prog, r.center, r.tools, r.head, r.stage]) {
      if (!node) continue;
      node.style.removeProperty("transition");
      node.style.removeProperty("height");
      node.style.removeProperty("transform");
      node.style.removeProperty("opacity");
    }
    if (pvS.real) pvS.real.style.opacity = "";
  }

  /** 读回面板此刻的视觉位置（过渡被打断时用）。 */
  function pvMeasuredP() {
    const el = pvEl();
    if (!el) return pvS.p;
    const m = getComputedStyle(el).transform;
    if (!m || m === "none") return pvS.open ? 1 : 0;
    let ty = 0;
    try {
      ty = new DOMMatrixReadOnly(m).m42;
    } catch (e) {
      ty = parseFloat(m.split(",")[5]) || 0;
    }
    const h = el.getBoundingClientRect().height || innerHeight;
    return Math.max(0, Math.min(1, 1 - ty / h));
  }

  function pvSettle(target) {
    clearTimeout(pvS.timer);
    pvS.timer = 0;
    const root = app();
    if (!root) return;
    pvS.p = target;
    pvS.open = target === 1;
    pvS.phase = "";
    pvS.dragging = false;
    pvS.closing = false;
    pvS.ready = false;
    root.classList.remove("m-pv-drag");
    root.classList.toggle("m-pv-open", target === 1);
    root.classList.remove("m-pv-pending");
    // 此刻行内值与类给的终态完全一致，撤掉不会跳一帧
    pvGhostDrop();
    pvClearInline();
    if (target === 0) closePlayerNow();
  }

  /** 从「当前进度」补到停点。行内值保持在原处，浏览器从当前值插值到终点。 */
  function pvAnimateTo(target) {
    const root = app();
    if (!root) return;
    pvS.phase = target === 1 ? "opening" : "closing";
    pvS.closing = target === 0;
    if (target === 1) pvS.open = true;
    pvPaint(pvS.p, 0); // 起点=手指离开时的位置
    void (pvEl() && pvEl().offsetHeight); // 让起点先落地，下面才有过渡
    root.classList.toggle("m-pv-open", target === 1);
    root.classList.remove("m-pv-drag");
    pvPaint(target, PV_MS);
    pvS.p = target;
    clearTimeout(pvS.timer);
    pvS.timer = setTimeout(() => pvSettle(target), PV_MS + 90);
  }

  /** 桌面 openPlayer 是异步的（要等皮肤模块 import）。等它就绪期间面板一直
      停在屏外（pvPaint(0)）。超时也放行：以前这里超时就直接 return，busy
      永远留在 true，之后所有手势全失效，表现就是「动画卡在半路、再也不动」。 */
  function pvWhenReady(cb) {
    const t0 = performance.now();
    const tick = () => {
      if (pvReady() || performance.now() - t0 > 5000) {
        pvS.ready = true;
        cb();
        return;
      }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  function pvOpenAuto() {
    if (pvS.phase) return;
    const root = app();
    if (!root) return;
    pvS.phase = "opening";
    pvS.open = true;
    pvS.p = 0;
    pvS.refs = pvRefs();
    // 桌面把 data-view 切到 player 时皮肤还没挂好，底栏/标题栏会先变透明
    // ——「点进去先闪一下」就是它。这一段用 m-pv-pending 顶住主页样式。
    root.classList.add("m-pv-pending");
    pvMeasure();
    pvPaint(0, 0);
    openPlayerNow();
    pvWhenReady(() => {
      if (pvS.phase !== "opening") return; // 用户已经用手势接管了
      pvMeasure();
      pvPaint(0, 0);
      void (pvEl() && pvEl().offsetHeight);
      root.classList.remove("m-pv-pending");
      root.classList.add("m-pv-open");
      pvPaint(1, PV_MS);
      pvS.p = 1;
      clearTimeout(pvS.timer);
      pvS.timer = setTimeout(() => pvSettle(1), PV_MS + 90);
    });
  }

  function pvCloseAuto() {
    if (!pvS.open || pvS.phase) return;
    if (!pvReady()) {
      pvSettle(0);
      return;
    }
    pvS.phase = "closing";
    pvS.refs = pvRefs();
    pvS.p = 1;
    pvMeasure();
    pvPaint(1, 0);
    void (pvEl() && pvEl().offsetHeight);
    // 关闭时**不能**加 m-pv-pending：那段规则会把底栏背景强制改回主页配色，
    // 底栏本来就露在屏幕最下面，一加就"闪一下"。只在打开时（底栏要先按
    // 主页样式站住位置）才用。关闭走的是同一套行内值，不需要它。
    pvPaint(0, PV_MS);
    pvS.p = 0;
    clearTimeout(pvS.timer);
    pvS.timer = setTimeout(() => pvSettle(0), PV_MS + 90);
  }

  /* --------------------------------------------------- 手势：跟手进入 / 退出 */

  /** 手指要走屏高的 40% 才算走完一程 —— 太短会被列表滑动误触发。 */
  function pvTravel() {
    return Math.max(120, Math.round(innerHeight * 0.4));
  }

  /** fromBar=true 从主页播放栏上滑进入；false 从详情页下滑退出。 */
  function pvDragBegin(fromBar) {
    if (pvS.dragging) return false;
    const root = app();
    if (!root) return false;
    // 停点动画还在跑时按下手指：把此刻的视觉位置读回来接着拖，不跳
    if (pvS.phase && pvS.phase !== "dragging") pvS.p = pvMeasuredP();
    clearTimeout(pvS.timer);
    pvS.timer = 0;
    pvS.phase = "dragging";
    pvS.dragging = true;
    pvS.closing = !fromBar;
    pvS.refs = pvRefs();
    root.classList.add("m-pv-drag");
    if (fromBar) {
      if (!pvS.p || pvS.p > 0.98) pvS.p = 0;
      pvS.open = true;
      root.classList.add("m-pv-pending");
      pvMeasure();
      pvPaint(pvS.p, 0);
      openPlayerNow();
      pvWhenReady(() => {
        if (pvS.phase !== "dragging") return;
        pvMeasure();
        pvPaint(pvS.p, 0);
      });
    } else {
      pvS.ready = true;
      pvS.open = true;
      pvMeasure();
      pvPaint(pvS.p, 0);
    }
    return true;
  }

  function pvDragMove(travelPx) {
    if (!pvS.dragging) return;
    const t = pvTravel();
    const raw = pvS.closing ? 1 - travelPx / t : travelPx / t;
    pvS.p = Math.max(0, Math.min(1, raw));
    if (pvS.ready) pvPaint(pvS.p, 0);
  }

  function pvDragEnd(velocity) {
    if (!pvS.dragging) return;
    pvS.dragging = false;
    if (pvS.closing) {
      // 退出方向：往下拖过 35% 或甩得够快就关
      pvAnimateTo(pvS.p < 0.65 || velocity > 0.4 ? 0 : 1);
    } else {
      pvAnimateTo(pvS.p > 0.3 || velocity < -0.4 ? 1 : 0);
    }
  }

  /* 兜底：手势绑定在具体元素上，若起手的那块被重新渲染替换、或者系统把
     touchend 吞掉（切后台、来电），进度就会永远停在 dragging —— 表现是
     「动画卡在半路，之后所有手势都不灵」。document 级监听保证手指一抬就收敛。
     pvDragEnd 自带 !dragging 检查，和元素级监听重复触发也无副作用。 */
  function pvAnyEnd() {
    if (!pvS.dragging) return;
    pvDragEnd(0);
  }
  document.addEventListener("touchend", pvAnyEnd, { passive: true });
  document.addEventListener("touchcancel", pvAnyEnd, { passive: true });

  /* ------------------------------------------------- 详情页：下滑关闭 / 横滑切歌
     两个方向同一套起手，第一次位移超过 12px 才定轴：
       · 竖（下滑）：交给 pvDrag*，跟手收起；
       · 横（左/右）：封面与歌词整体横移，松手按距离/速度切上一首或下一首。
     横滑必须在 touchmove 里 preventDefault：WebView 一旦判成页面滚动，
     后面的 touchmove 会变成 touchcancel，手势整段丢给浏览器（＝没反应）。 */

  const swS = { dx: 0, w: 0, active: false, timer: 0, vel: 0 };

  function swNodes() {
    return {
      head: document.querySelector(".playerview__head"),
      stage: document.getElementById("playerview-stage"),
    };
  }

  function swPaint(dx, ms) {
    const n = swNodes();
    const dur = ms | 0;
    const tr = dur ? "transform " + dur + "ms " + PV_EASE + ", opacity " + dur + "ms linear" : "none";
    for (const el of [n.head, n.stage]) {
      if (!el) continue;
      el.style.transition = tr;
    }
    if (n.stage) n.stage.style.transform = "translate3d(" + dx.toFixed(1) + "px,0,0)";
    if (n.head) n.head.style.transform = "translate3d(" + (dx * 0.32).toFixed(1) + "px,0,0)";
    const w = swS.w || innerWidth;
    const fade = 1 - Math.min(0.45, (Math.abs(dx) / w) * 0.45);
    if (n.stage) n.stage.style.opacity = fade.toFixed(3);
    swS.dx = dx;
  }

  function swReset() {
    const n = swNodes();
    for (const el of [n.head, n.stage]) {
      if (!el) continue;
      el.style.removeProperty("transition");
      el.style.removeProperty("transform");
      el.style.removeProperty("opacity");
    }
    swS.dx = 0;
    swS.active = false;
  }

  function swSongId() {
    try {
      const s = window.__app && window.__app.currentSong ? window.__app.currentSong() : null;
      return s && s.id ? String(s.id) : "";
    } catch (e) {
      return "";
    }
  }

  function swWaitSong(before, ms, cb) {
    const t0 = performance.now();
    const tick = () => {
      const now = swSongId();
      if ((before && now && now !== before) || performance.now() - t0 > ms) {
        cb();
        return;
      }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  /** dir: 1 = 下一首（向左甩），-1 = 上一首 */
  function swCommit(dir) {
    const w = swS.w || innerWidth;
    const btn = document.getElementById(dir > 0 ? "btn-next" : "btn-prev");
    if (!btn) {
      swPaint(0, 220);
      setTimeout(swReset, 240);
      return;
    }
    const before = swSongId();
    swPaint(-dir * w, 170); // 整块甩出去
    setTimeout(() => {
      btn.click();
      swWaitSong(before, 900, () => {
        swPaint(dir * w * 0.55, 0); // 新的内容从另一边进来
        requestAnimationFrame(() => {
          swPaint(0, 230);
          setTimeout(swReset, 260);
        });
      });
    }, 170);
  }

  /** 触摸点往上找可滚动容器：它已经滚动了，这次滑动就不该被当成「关闭」。 */
  function pvScrollAtTop(target) {
    let el = target;
    const root = pvEl();
    while (el && el !== root) {
      const s = getComputedStyle(el);
      if (/(auto|scroll)/.test(s.overflowY) && el.scrollHeight > el.clientHeight + 2) {
        if (el.scrollTop > 0) return false;
      }
      el = el.parentElement;
    }
    return true;
  }

  function bindPvEntry() {
    const bar = document.getElementById("playerbar");
    if (!bar || bar.dataset.mPv === "1") return false;
    bar.dataset.mPv = "1";
    let sy = 0;
    let lastY = 0;
    let lastT = 0;
    let vel = 0;
    let armed = false;
    let drag = false;

    bar.addEventListener(
      "touchstart",
      (e) => {
        armed = false;
        drag = false;
        if (e.touches.length !== 1) return;
        const root = app();
        if (root && root.dataset.view === "player") return;
        const t = e.target;
        if (t && t.closest && t.closest("button, input, .playerbar__progress")) return;
        sy = e.touches[0].clientY;
        lastY = sy;
        lastT = performance.now();
        vel = 0;
        armed = true;
      },
      { passive: true }
    );

    bar.addEventListener(
      "touchmove",
      (e) => {
        if (!armed || e.touches.length !== 1) return;
        const y = e.touches[0].clientY;
        const dy = sy - y; // 上滑为正
        const now = performance.now();
        if (now > lastT) vel = (lastY - y) / (now - lastT);
        lastT = now;
        lastY = y;
        if (!drag) {
          if (dy < 10) return; // 还没往上滑够：点击与横滑照旧
          if (!pvDragBegin(true)) {
            armed = false;
            return;
          }
          drag = true;
        }
        e.preventDefault();
        pvDragMove(dy);
      },
      { passive: false }
    );

    const end = () => {
      if (!armed) return;
      armed = false;
      if (drag) {
        drag = false;
        pvDragEnd(vel);
      }
    };
    bar.addEventListener("touchend", end);
    bar.addEventListener("touchcancel", end);
    return true;
  }

  function bindPvBack() {
    const el = pvEl();
    if (!el || el.dataset.mBack === "1") return false;
    el.dataset.mBack = "1";
    let sx = 0;
    let sy = 0;
    let lastX = 0;
    let lastY = 0;
    let lastT = 0;
    let velY = 0;
    let velX = 0;
    let armed = false;
    let axis = ""; // "" | "y" | "x"

    el.addEventListener(
      "touchstart",
      (e) => {
        armed = false;
        axis = "";
        if (e.touches.length !== 1 || !pvReady()) return;
        if (!pvScrollAtTop(e.target)) return;
        sx = e.touches[0].clientX;
        sy = e.touches[0].clientY;
        lastX = sx;
        lastY = sy;
        lastT = performance.now();
        velX = 0;
        velY = 0;
        armed = true;
      },
      { passive: true }
    );

    el.addEventListener(
      "touchmove",
      (e) => {
        if (!armed || e.touches.length !== 1) return;
        const x = e.touches[0].clientX;
        const y = e.touches[0].clientY;
        const now = performance.now();
        if (now > lastT) {
          velX = (x - lastX) / (now - lastT);
          velY = (y - lastY) / (now - lastT);
        }
        lastT = now;
        lastX = x;
        lastY = y;
        const dx = x - sx;
        const dy = y - sy;
        if (!axis) {
          if (Math.abs(dx) < 12 && Math.abs(dy) < 12) return;
          if (Math.abs(dx) > Math.abs(dy)) {
            // 横滑切歌：只在详情页完全展开、且没有正在跑的转场时接管
            if (pvS.phase || Math.abs(pvS.p - 1) > 0.01) {
              armed = false;
              return;
            }
            axis = "x";
            swS.active = true;
            swS.w = innerWidth;
            e.preventDefault();
            swPaint(dx, 0);
            return;
          }
          if (dy < 0) {
            armed = false; // 上滑：让内容自己滚
            return;
          }
          if (!pvDragBegin(false)) {
            armed = false;
            return;
          }
          axis = "y";
        }
        e.preventDefault();
        if (axis === "x") swPaint(dx, 0);
        else pvDragMove(dy);
      },
      { passive: false }
    );

    const end = () => {
      if (!armed) return;
      armed = false;
      if (axis === "x") {
        const w = swS.w || innerWidth;
        const dx = swS.dx;
        const far = Math.abs(dx) > w * 0.26;
        const fast = Math.abs(velX) > 0.45;
        if (far || fast) swCommit(dx < 0 ? 1 : -1);
        else {
          swPaint(0, 220);
          setTimeout(swReset, 240);
        }
        axis = "";
        return;
      }
      if (axis === "y") pvDragEnd(velY);
      axis = "";
    };
    el.addEventListener("touchend", end);
    el.addEventListener("touchcancel", end);
    return true;
  }

  /** 播放栏里桌面也绑了 openPlayer 的两块（封面、标题区）：捕获阶段抢在
      它们前面，改走带跟手的转场，否则点标题是硬切、点封面是动画，两套并存。 */
  function bindPvTriggers() {
    let ok = true;
    for (const id of ["bar-cover", "bar-meta"]) {
      const el = document.getElementById(id);
      if (!el) {
        ok = false;
        continue;
      }
      if (el.dataset.mPv === "1") continue;
      el.dataset.mPv = "1";
      el.addEventListener(
        "click",
        (e) => {
          e.preventDefault();
          e.stopImmediatePropagation();
          pvOpenAuto();
        },
        true
      );
    }
    const back = document.getElementById("btn-player-back");
    if (back && back.dataset.mPv !== "1") {
      back.dataset.mPv = "1";
      back.addEventListener(
        "click",
        (e) => {
          e.preventDefault();
          e.stopImmediatePropagation();
          pvCloseAuto();
        },
        true
      );
    } else if (!back) ok = false;
    return ok;
  }

  /* =========================================== 贴底 sheet：把手 + 下拉关闭 */
  /* 手机上没有「点空白处」那么从容的操作，sheet 必须能往下拖掉。
     只在把手 / 头部按下时接管：列表内部的滑动仍然归滚动。 */

  const SHEET_SEL = ".menu, .queue-panel, .options-panel, .sleep-panel, .download-panel";
  const SHEET_HEAD_SEL =
    ".m-grip, .menu__head, .queue-panel__head, .options-panel__head, .sleep-panel__head, .download-panel__head";

  function endSheetDrag(el) {
    el.classList.remove("m-drag");
    el.style.transform = "";
    el.style.opacity = "";
  }

  function closeSheet(el) {
    const btn = el.querySelector(
      '[data-close], .menu__close, .panel__close, .u-hit[aria-label*="关闭"]'
    );
    if (btn && btn.offsetParent !== null) {
      btn.click();
      return;
    }
    // 兜底：桌面的每个浮层都监听 Escape（overlays.js / panels.js / cover.js）
    const ev = { key: "Escape", code: "Escape", keyCode: 27, which: 27, bubbles: true };
    document.dispatchEvent(new KeyboardEvent("keydown", ev));
    window.dispatchEvent(new KeyboardEvent("keydown", ev));
  }

  function bindSheetDrag(el) {
    if (el.dataset.mDrag === "1") return;
    el.dataset.mDrag = "1";
    let sy = 0;
    let lastY = 0;
    let lastT = 0;
    let vel = 0;
    let armed = false;
    let drag = false;

    el.addEventListener(
      "touchstart",
      (e) => {
        armed = false;
        drag = false;
        if (e.touches.length !== 1) return;
        const t = e.target;
        if (!t || !t.closest || !t.closest(SHEET_HEAD_SEL)) return;
        sy = e.touches[0].clientY;
        lastY = sy;
        lastT = performance.now();
        vel = 0;
        armed = true;
      },
      { passive: true }
    );

    el.addEventListener(
      "touchmove",
      (e) => {
        if (!armed || e.touches.length !== 1) return;
        const y = e.touches[0].clientY;
        const dy = y - sy;
        const now = performance.now();
        if (now > lastT) vel = (y - lastY) / (now - lastT);
        lastT = now;
        lastY = y;
        if (!drag) {
          if (dy < 6) {
            if (dy < -6) armed = false;
            return;
          }
          drag = true;
          el.classList.add("m-drag");
        }
        e.preventDefault();
        el.style.transform = "translate3d(0," + Math.max(0, dy).toFixed(1) + "px,0)";
        el.style.opacity = String(Math.max(0.25, 1 - dy / 320));
      },
      { passive: false }
    );

    const end = () => {
      if (!armed) return;
      armed = false;
      if (!drag) return;
      drag = false;
      const dy = Math.max(0, lastY - sy);
      const close = dy > 90 || vel > 0.6;
      endSheetDrag(el);
      if (close) closeSheet(el);
    };
    el.addEventListener("touchend", end);
    el.addEventListener("touchcancel", end);
  }

  /* 队列/曲库这些列表挂了 SortableJS 做拖拽排序，默认 delay=0 —— 手指一碰
     就被判成「开始拖动排序」（实测元素上立刻挂上 sortable-chosen is-dragging），
     列表因此完全滚不动。这就是「播放列表无法滑动，和拖拽冲突了」。
     手机上改成「长按 240ms 才拖」：普通上下滑还给滚动，长按才进排序。
     实例上找不到公开句柄（Sortable 没暴露成全局），只能按 expando 属性找。 */
  let tameAt = 0;
  function tameSortables() {
    const now = performance.now();
    if (now - tameAt < 800) return 0;
    tameAt = now;
    let n = 0;
    const tame = (el, depth) => {
      for (const key of Object.keys(el)) {
        if (!/^sortable/i.test(key)) continue;
        const inst = el[key];
        if (!inst || !inst.options || inst.options.mDelay) continue;
        try {
          inst.option("delay", 240);
          inst.option("delayOnTouchOnly", true);
          inst.option("touchStartThreshold", 8);
          inst.options.mDelay = true;
          n += 1;
        } catch (err) {
          /* 拿不到就算了，滚动冲突不至于把整个外壳带崩 */
        }
      }
      if (depth >= 6) return;
      for (const child of el.children) tame(child, depth + 1);
    };
    tame(document.body, 0);
    return n;
  }

  function injectGrips() {
    tameSortables();
    for (const el of $$(SHEET_SEL)) {
      let grip = null;
      for (const child of el.children) {
        if (child.classList && child.classList.contains("m-grip")) {
          grip = child;
          break;
        }
      }
      if (!grip) {
        grip = document.createElement("div");
        grip.className = "m-grip";
        el.insertBefore(grip, el.firstChild);
      }
      bindSheetDrag(el);
    }
    return true;
  }

  /* 验收/调试用：CDP 里能直接推中间进度核对几何（不在正常路径上）。
     用法：__mPv.open() 之后 __mPv.preview(0.5) 看半开状态。 */
  window.__mPv = {
    open: () => pvOpenAuto(),
    close: () => pvCloseAuto(),
    apply: (p) => pvPaint(p, 0),
    preview: (p) => {
      pvS.refs = pvRefs();
      pvMeasure();
      app().classList.add("m-pv-drag");
      pvPaint(p, 0);
    },
    sweep: (dir) => swCommit(dir),
    state: pvS,
  };

  function mount() {
    const root = app();
    const bar = $(".titlebar");
    if (!root || !bar) return false;
    backdrop();
    normalizeNav();

    if (!document.getElementById("android-burger")) {
      bar.insertBefore(burger(), bar.firstChild);
    }
    mountAppbar();
    return true;
  }

  let tries = 0;
  const bootTimer = setInterval(() => {
    tries += 1;
    const mounted = mount();
    const settingsReady = enhanceSettings();
    const searchReady = enhanceSearch();
    const drawerReady = injectDrawer();
    const theadReady = mountThead();
    const fabReady = mountFab();
    const pullReady = bindPullRefresh();
    const pvEntry = bindPvEntry();
    const pvBack = bindPvBack();
    const pvTrig = bindPvTriggers();
    const drawerSwipe = bindDrawerSwipe();
    injectGrips();
    syncAppbar();
    syncThead();
    if (
      mounted &&
      settingsReady &&
      searchReady &&
      drawerReady &&
      theadReady &&
      fabReady &&
      pullReady &&
      pvEntry &&
      pvBack &&
      pvTrig &&
      drawerSwipe
    )
      clearInterval(bootTimer);
    if (tries > 400) clearInterval(bootTimer);
  }, 100);

  // 状态同步：data-view / hidden / data-state 分散在多处，谁先谁后都不一定；
  // 这些都只是读内存里的字符串，比 MutationObserver 观察几棵树省心。
  let lastSignature = "";
  let lastSearchOpen = false;
  setInterval(() => {
    normalizeNav();
    syncAppbar();
    syncThead();
    syncPullBusy();
    syncThemeTail();
    syncPlayerView();
    bindPlayerbar();
    bindTrackRows();
    bindPvEntry();
    bindPvBack();
    bindPvTriggers();
    injectGrips();
    enhanceSettings();
    enhanceSearch();

    // 搜索层每次打开都回到「在线」（默认在线），这跟用户关掉时选的模式无关
    const nowSearch = searchOpen();
    if (nowSearch && !lastSearchOpen) {
      setSearchMode("online");
      const input = $("#search-input");
      if (input) input.value = "";
      const local = document.getElementById("m-local-results");
      if (local) local.textContent = "";
    }
    lastSearchOpen = nowSearch;

    const sig = (app() ? app().dataset.view : "") + "|" + (settingsOpen() ? "1" : "0") + "|" + document.body.dataset.pv;
    if (sig !== lastSignature) {
      lastSignature = sig;
      // 设置层刚关上时回到分类首页：下次进来不该停在某个分区
      const layer = settingsLayer();
      if (layer && !settingsOpen() && layer.dataset.msec) closeSection();
    }
  }, 300);

  setInterval(stripTips, 1000);

  /* --------------------------------------------------------- 系统返回键 */

  window.__lmAndroidBack = function () {
    const root = app();
    if (drawerOpen()) {
      setDrawer(false);
      return "handled";
    }
    const layer = settingsLayer();
    if (layer && settingsOpen()) {
      if (layer.dataset.msec) {
        closeSection();
        return "handled";
      }
      if (clickIfPresent("mp-settings-layer [data-settings-close]")) return "handled";
      return "exit";
    }
    if (anyVisible(".cover-layer")) {
      if (clickIfPresent("mp-cover-layer .cover-layer__close")) return "handled";
    }
    if (anyVisible(".lyrics-panel, .lyricspanel")) {
      if (clickIfPresent("mp-lyrics-panel [data-close], mp-lyrics-panel .lyrics-panel__close"))
        return "handled";
    }
    if (anyVisible(".queue-panel")) {
      if (clickIfPresent("mp-queue-panel [data-close]")) return "handled";
    }
    if (anyVisible(".options-panel")) {
      if (clickIfPresent("mp-options-panel [data-close]")) return "handled";
    }
    if (searchOpen()) {
      // 搜索层里：本地模式先退回在线，再按一次才关
      if (searchMode() === "local") {
        setSearchMode("online");
        return "handled";
      }
      closeSearch();
      return "handled";
    }
    if (root && root.dataset.view === "player") {
      // 走跟手转场的关闭（桌面的 closePlayer 是硬切）
      pvCloseAuto();
      return "handled";
    }
    return "exit";
  };
})();
