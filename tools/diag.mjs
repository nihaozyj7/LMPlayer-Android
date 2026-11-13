/* ==========================================================================
   diag.mjs — 用 CDP 在真机/模拟器的 WebView 里执行 JS 并打印结果
   --------------------------------------------------------------------------
   用法：
     node tools/diag.mjs "document.documentElement.scrollWidth"
     node tools/diag.mjs --port 9223 "表达式"

   前置：adb forward tcp:<port> localabstract:webview_devtools_remote_<pid>，
   且外壳里打开了 WebView.setWebContentsDebuggingEnabled(true)。
   ========================================================================== */

const port = process.argv[2] === "--port" ? process.argv[3] : "9223";
const expr = process.argv[2] === "--port" ? process.argv[4] : process.argv[2];

async function pickTarget() {
  const res = await fetch(`http://127.0.0.1:${port}/json`);
  const list = await res.json();
  const page = list.find((t) => t.type === "page") || list[0];
  if (!page) throw new Error("no page target");
  return page.webSocketDebuggerUrl;
}

function evaluate(wsUrl, expression) {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(wsUrl);
    const id = 1;
    const timer = setTimeout(() => {
      ws.close();
      reject(new Error("timeout"));
    }, 15000);
    ws.addEventListener("open", () => {
      ws.send(
        JSON.stringify({
          id,
          method: "Runtime.evaluate",
          params: { expression, returnByValue: true, awaitPromise: true },
        })
      );
    });
    ws.addEventListener("message", (ev) => {
      const msg = JSON.parse(ev.data);
      if (msg.id !== id) return;
      clearTimeout(timer);
      ws.close();
      if (msg.error) return reject(new Error(JSON.stringify(msg.error)));
      const r = msg.result;
      if (r.exceptionDetails) {
        return reject(new Error(r.exceptionDetails.text + " " + JSON.stringify(r.exceptionDetails.exception)));
      }
      resolve(r.result?.value);
    });
    ws.addEventListener("error", (e) => {
      clearTimeout(timer);
      reject(new Error("ws error: " + e.message));
    });
  });
}

const url = await pickTarget();
const value = await evaluate(url, expr);
console.log(typeof value === "string" ? value : JSON.stringify(value, null, 2));
