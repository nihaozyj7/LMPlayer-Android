/* gesture-test.mjs — 用真实触摸事件（CDP Input.dispatchTouchEvent）验证跟手手势 */
const port = process.argv[2] || "9223";
const list = await (await fetch(`http://127.0.0.1:${port}/json`)).json();
const page = list.find((t) => t.type === "page") || list[0];
const ws = new WebSocket(page.webSocketDebuggerUrl);
await new Promise((res, rej) => {
  ws.addEventListener("open", res, { once: true });
  ws.addEventListener("error", rej, { once: true });
});
let id = 0;
const pending = new Map();
ws.addEventListener("message", (e) => {
  const m = JSON.parse(e.data);
  if (m.id && pending.has(m.id)) {
    pending.get(m.id)(m);
    pending.delete(m.id);
  }
});
const send = (method, params) =>
  new Promise((resolve, reject) => {
    const mid = ++id;
    pending.set(mid, (m) => (m.error ? reject(new Error(JSON.stringify(m.error))) : resolve(m.result)));
    ws.send(JSON.stringify({ id: mid, method, params }));
  });
const ev = async (expression) => {
  const r = await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true });
  if (r.exceptionDetails) return "ERR " + JSON.stringify(r.exceptionDetails.exception.description || r.exceptionDetails.text);
  return r.result.value;
};
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const touch = (type, x, y) =>
  send("Input.dispatchTouchEvent", {
    type,
    touchPoints: type === "touchEnd" ? [] : [{ x, y, radiusX: 2, radiusY: 2, force: 1 }],
  });

async function dragUp(fromY, toY, steps = 14) {
  await touch("touchStart", 200, fromY);
  for (let i = 1; i <= steps; i++) {
    const y = fromY + ((toY - fromY) * i) / steps;
    await touch("touchMove", 200, y);
    await sleep(12);
  }
}

async function dragDown(fromY, toY, steps = 14) {
  await touch("touchStart", 200, fromY);
  for (let i = 1; i <= steps; i++) {
    const y = fromY + ((toY - fromY) * i) / steps;
    await touch("touchMove", 200, y);
    await sleep(12);
  }
}

console.log("start:", await ev(`JSON.stringify({view: window.__app.state.view, cls: document.getElementById('app').className})`));

// 1) 从播放栏上滑进入（中途取样）
await dragUp(800, 640, 8);
console.log("mid drag:", await ev(`(() => { const b = document.querySelector('.playerbar'); return JSON.stringify({p: Number(window.__mPv.state.p.toFixed(3)), phase: window.__mPv.state.phase, barH: Math.round(b.getBoundingClientRect().height), pvTop: Math.round(document.getElementById('playerview').getBoundingClientRect().top)}); })()`));
await sleep(60);
await dragUp(640, 480, 8);
console.log("far drag:", await ev(`(() => { const b = document.querySelector('.playerbar'); return JSON.stringify({p: Number(window.__mPv.state.p.toFixed(3)), barH: Math.round(b.getBoundingClientRect().height), pvTop: Math.round(document.getElementById('playerview').getBoundingClientRect().top)}); })()`));
await touch("touchEnd", 0, 0);
await sleep(700);
console.log("after up-swipe:", await ev(`JSON.stringify({cls: document.getElementById('app').className, p: window.__mPv.state.p, barH: Math.round(document.querySelector('.playerbar').getBoundingClientRect().height)})`));

// 2) 详情页下滑返回（中途取样，验证可被打断）
await dragDown(300, 420, 8);
console.log("down mid:", await ev(`(() => { const b = document.querySelector('.playerbar'); return JSON.stringify({p: Number(window.__mPv.state.p.toFixed(3)), barH: Math.round(b.getBoundingClientRect().height), pvTop: Math.round(document.getElementById('playerview').getBoundingClientRect().top)}); })()`));
await touch("touchEnd", 0, 0);
await sleep(700);
console.log("after down-swipe:", await ev(`JSON.stringify({cls: document.getElementById('app').className, view: window.__app.state.view, p: window.__mPv.state.p, barH: Math.round(document.querySelector('.playerbar').getBoundingClientRect().height)})`));
ws.close();
