/* shot-cdp.mjs — grab a screenshot through the Chrome DevTools Protocol.
   Used when `adb shell screencap` does not reflect what the WebView composites.

   node tools/shot-cdp.mjs out.png [port]
*/

import fs from "node:fs";

const out = process.argv[2] || "shot.png";
const port = process.argv[3] || "9223";

const list = await (await fetch(`http://127.0.0.1:${port}/json`)).json();
const page = list.find((t) => t.type === "page") || list[0];
if (!page) throw new Error("no page target");

const ws = new WebSocket(page.webSocketDebuggerUrl);
await new Promise((res, rej) => {
  ws.addEventListener("open", res, { once: true });
  ws.addEventListener("error", rej, { once: true });
});

const data = await new Promise((resolve, reject) => {
  const timer = setTimeout(() => reject(new Error("timeout")), 20000);
  ws.addEventListener("message", (ev) => {
    const msg = JSON.parse(ev.data);
    if (msg.id !== 1) return;
    clearTimeout(timer);
    if (msg.error) return reject(new Error(JSON.stringify(msg.error)));
    resolve(msg.result.data);
  });
  ws.send(JSON.stringify({ id: 1, method: "Page.captureScreenshot", params: { format: "png" } }));
});

fs.writeFileSync(out, Buffer.from(data, "base64"));
ws.close();
console.log("saved", out, fs.statSync(out).size);
