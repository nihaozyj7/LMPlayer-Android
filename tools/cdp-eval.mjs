/* cdp-eval.mjs -- evaluate an expression inside the app WebView and print the result.
   usage: node tools/cdp-eval.mjs "<js expression>" [port]
*/
import fs from "node:fs";

const expr = process.argv[2];
const port = process.argv[3] || "9223";
if (!expr) {
  console.error("usage: node tools/cdp-eval.mjs \"<expr>\" [port]");
  process.exit(1);
}

const list = await (await fetch(`http://127.0.0.1:${port}/json`)).json();
const page = list.find((t) => t.type === "page") || list[0];
if (!page) throw new Error("no page target");

const ws = new WebSocket(page.webSocketDebuggerUrl);
await new Promise((res, rej) => {
  ws.addEventListener("open", res, { once: true });
  ws.addEventListener("error", rej, { once: true });
});

const result = await new Promise((resolve, reject) => {
  const timer = setTimeout(() => reject(new Error("timeout")), 20000);
  ws.addEventListener("message", (ev) => {
    const msg = JSON.parse(ev.data);
    if (msg.id !== 1) return;
    clearTimeout(timer);
    if (msg.error) return reject(new Error(JSON.stringify(msg.error)));
    resolve(msg.result);
  });
  ws.send(JSON.stringify({
    id: 1,
    method: "Runtime.evaluate",
    params: { expression: expr, returnByValue: true, awaitPromise: true },
  }));
});

ws.close();
if (result.exceptionDetails) {
  console.error("EXCEPTION:", JSON.stringify(result.exceptionDetails.exception || result.exceptionDetails));
  process.exit(2);
}
const v = result.result.value;
console.log(typeof v === "string" ? v : JSON.stringify(v, null, 2));
