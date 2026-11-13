/* screencast.mjs — 用 CDP 录一段合成器真实产出的帧，统计转场期间的帧数与间隔
   usage: node tools/screencast.mjs [port] [triggerExpr] [ms] */
import fs from "node:fs";

const port = process.argv[2] || "9223";
const trigger = process.argv[3] || "document.getElementById('bar-cover').click()";
const runMs = Number(process.argv[4] || 1500);

const list = await (await fetch(`http://127.0.0.1:${port}/json`)).json();
const page = list.find((t) => t.type === "page") || list[0];
const ws = new WebSocket(page.webSocketDebuggerUrl);
await new Promise((res, rej) => {
  ws.addEventListener("open", res, { once: true });
  ws.addEventListener("error", rej, { once: true });
});
let id = 0;
const pending = new Map();
const frames = [];
ws.addEventListener("message", (e) => {
  const m = JSON.parse(e.data);
  if (m.id && pending.has(m.id)) {
    pending.get(m.id)(m);
    pending.delete(m.id);
    return;
  }
  if (m.method === "Page.screencastFrame") {
    frames.push({ ts: m.params.metadata.timestamp, data: m.params.data });
    ws.send(JSON.stringify({ id: ++id, method: "Page.screencastFrameAck", params: { sessionId: m.params.sessionId } }));
  }
});
const send = (method, params) =>
  new Promise((resolve, reject) => {
    const mid = ++id;
    pending.set(mid, (m) => (m.error ? reject(new Error(JSON.stringify(m.error))) : resolve(m.result)));
    ws.send(JSON.stringify({ id: mid, method, params }));
  });

fs.mkdirSync(".shots/sweep", { recursive: true });
for (const f of fs.readdirSync(".shots/sweep")) fs.unlinkSync(".shots/sweep/" + f);

await send("Page.enable", {});
await send("Page.startScreencast", { format: "jpeg", quality: 70, maxWidth: 411, maxHeight: 838, everyNthFrame: 1 });
await new Promise((r) => setTimeout(r, 250));
const t0 = Date.now();
await send("Runtime.evaluate", { expression: `(() => { ${trigger}; return 1; })()` });
await new Promise((r) => setTimeout(r, runMs));
const t1 = Date.now();
await send("Page.stopScreencast", {});
ws.close();

const rel = frames.map((f) => Math.round(f.ts * 1000 - t0));
console.log("wall(ms)", t1 - t0, "frames", frames.length);
console.log("frame times(ms):", rel.join(" "));
const gaps = rel.slice(1).map((v, i) => v - rel[i]);
if (gaps.length) {
  const sorted = [...gaps].sort((a, b) => a - b);
  console.log("gap median", sorted[Math.floor(sorted.length / 2)], "p90", sorted[Math.floor(sorted.length * 0.9)], "max", sorted[sorted.length - 1]);
}
frames.forEach((f, i) => {
  if (i % Math.max(1, Math.floor(frames.length / 8)) !== 0 && i !== frames.length - 1) return;
  fs.writeFileSync(`.shots/sweep/f${String(i).padStart(3, "0")}.jpg`, Buffer.from(f.data, "base64"));
});
console.log("saved", fs.readdirSync(".shots/sweep").length, "frames");
