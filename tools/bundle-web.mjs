/* ==========================================================================
   bundle-web.mjs — 把 dist 里的 ES module 依赖图打成单个 JS
   --------------------------------------------------------------------------
   为什么需要：桌面 dist 由 Vite 产出，bindings（每个服务一个 .js）与若干
   chunk 被保留成独立文件，靠静态 import 逐层解析。在手机上实测每个模块
   加载 600~780ms，37 个模块瀑布下来 DCL ≈ 3.0s（冷启动 5.1s 的大头）。
   打成一个 bundle 后请求数 37 → 2，瀑布消失。

   用法：node tools/bundle-web.mjs [wwwDir]
   幂等：重复运行只是重新生成 /assets/app.bundle.js 并重写 index.html 引用。
   ========================================================================== */

import { build } from "./node_modules/esbuild/lib/main.js";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const WWW = process.argv[2]
  ? path.resolve(process.argv[2])
  : path.join(ROOT, "android", "app", "src", "main", "assets", "www");

const OUT_NAME = "app.bundle.js";
const OUT_REL = "/assets/" + OUT_NAME;

if (!fs.existsSync(path.join(WWW, "index.html"))) {
  console.error("index.html not found in " + WWW);
  process.exit(1);
}

/**
 * 两件事：
 *  1. 把以 "/" 开头的导入路径映射到 www 根目录（页面里的绝对路径）；
 *  2. 把 `const x = "../bindings/…/index.js"; await import(x)` 这种「路径藏在
 *     变量里」的动态 import 拉平成字面量 —— 否则打包器看不见它，bindings 的
 *     37 个文件会继续在运行时逐个瀑布加载（这正是冷启动 3s 的来源）。
 */
const BINDINGS_DYN = [
  /const\s+(\w+)\s*=\s*"\.\.\/bindings\/localmusicplayer\/index\.js"/g,
  /const\s+(\w+)\s*=\s*"\/bindings\/localmusicplayer\/index\.js"/g,
];

const webRootPlugin = {
  name: "web-root",
  setup(b) {
    b.onResolve({ filter: /^\// }, (args) => {
      const abs = path.join(WWW, args.path);
      for (const cand of [abs, abs + ".js", path.join(abs, "index.js")]) {
        if (fs.existsSync(cand) && fs.statSync(cand).isFile()) {
          return { path: cand };
        }
      }
      // 找不到就交给 esbuild 当外部依赖（运行时仍按原 URL 取）
      return { path: args.path, external: true };
    });

    b.onLoad({ filter: /\.js$/ }, (args) => {
      let src = fs.readFileSync(args.path, "utf8");
      let touched = false;
      for (const re of BINDINGS_DYN) {
        re.lastIndex = 0;
        let m;
        while ((m = re.exec(src))) {
          const v = m[1];
          const dyn = new RegExp("import\\(\\s*" + v + "\\s*\\)", "g");
          if (dyn.test(src)) {
            src = src.replace(dyn, 'import("/bindings/localmusicplayer/index.js")');
            touched = true;
          }
        }
      }
      if (!touched) return null; // 没改动就交给 esbuild 默认加载
      return { contents: src, loader: "js" };
    });
  },
};

function findEntry(html) {
  const m = html.match(/<script[^>]*type="module"[^>]*src="([^"]+)"/);
  return m ? m[1] : null;
}

const htmlPath = path.join(WWW, "index.html");
let html = fs.readFileSync(htmlPath, "utf8");
const entry = findEntry(html);
if (!entry) {
  console.log("no module entry found — already bundled?");
  process.exit(0);
}
if (entry === OUT_REL) {
  console.log("already bundled:", OUT_REL);
  process.exit(0);
}

const entryAbs = path.join(WWW, entry);
if (!fs.existsSync(entryAbs)) {
  console.error("entry not found: " + entryAbs);
  process.exit(1);
}

const t0 = Date.now();
const result = await build({
  entryPoints: [entryAbs],
  outfile: path.join(WWW, "assets", OUT_NAME),
  bundle: true,
  format: "esm",
  target: "es2020",
  minify: true,
  legalComments: "none",
  plugins: [webRootPlugin],
  logLevel: "warning",
  metafile: true,
});

const inputs = Object.keys(result.metafile.outputs[Object.keys(result.metafile.outputs)[0]].inputs);
const size = fs.statSync(path.join(WWW, "assets", OUT_NAME)).size;

// 重写 index.html：入口 + modulepreload 合并成一条
html = html.replace(/[ \t]*<link[^>]*rel="modulepreload"[^>]*>\r?\n?/g, "");
html = html.replace(
  /<script[^>]*type="module"[^>]*src="[^"]+"[^>]*><\/script>/,
  '<script type="module" crossorigin src="' + OUT_REL + '"></script>'
);
fs.writeFileSync(htmlPath, html, "utf8");

console.log(
  `bundled ${inputs.length} modules -> ${OUT_REL} (${(size / 1024).toFixed(1)} KB, ${Date.now() - t0}ms)`
);
