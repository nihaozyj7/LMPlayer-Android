/* dump-dom.mjs -- print the live DOM skeleton of the app WebView.
   usage: node tools/dump-dom.mjs [maxDepth] [port]
*/
const maxDepth = Number(process.argv[2] || 6);
const port = process.argv[3] || "9223";

const list = await (await fetch(`http://127.0.0.1:${port}/json`)).json();
const page = list.find((t) => t.type === "page") || list[0];
if (!page) throw new Error("no page target");

const ws = new WebSocket(page.webSocketDebuggerUrl);
await new Promise((res, rej) => {
  ws.addEventListener("open", res, { once: true });
  ws.addEventListener("error", rej, { once: true });
});

const expr = `(() => {
  const skip = new Set(["svg","use","path","defs","symbol","style","script","meta","link"]);
  const out = [];
  const walk = (el, d) => {
    for (const c of el.children) {
      const t = c.tagName.toLowerCase();
      if (skip.has(t)) continue;
      let cls = "";
      if (typeof c.className === "string" && c.className.trim())
        cls = "." + c.className.trim().split(/\\s+/).join(".");
      const id = c.id ? "#" + c.id : "";
      const own = Array.from(c.childNodes).filter(n => n.nodeType === 3).map(n => n.textContent.trim()).join(" ").slice(0, 40);
      const extra = [c.getAttribute("data-view"), c.getAttribute("data-tab"), c.getAttribute("hidden") !== null ? "hidden" : "", c.getAttribute("aria-selected")].filter(Boolean).join(",");
      out.push("  ".repeat(d) + t + id + cls + (extra ? " [" + extra + "]" : "") + (own ? "  | " + own : ""));
      if (d < ${maxDepth}) walk(c, d + 1);
    }
  };
  walk(document.body, 0);
  return out.join("\\n");
})()`;

const result = await new Promise((resolve, reject) => {
  const timer = setTimeout(() => reject(new Error("timeout")), 20000);
  ws.addEventListener("message", (ev) => {
    const msg = JSON.parse(ev.data);
    if (msg.id !== 1) return;
    clearTimeout(timer);
    if (msg.error) return reject(new Error(JSON.stringify(msg.error)));
    resolve(msg.result);
  });
  ws.send(JSON.stringify({ id: 1, method: "Runtime.evaluate", params: { expression: expr, returnByValue: true } }));
});
ws.close();
if (result.exceptionDetails) {
  console.error("EXCEPTION:", JSON.stringify(result.exceptionDetails));
  process.exit(2);
}
console.log(result.result.value);
