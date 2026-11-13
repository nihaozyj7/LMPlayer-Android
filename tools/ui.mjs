/* ui.mjs -- tiny CDP driver for the app WebView.
   usage:
     node tools/ui.mjs eval "<expr>"
     node tools/ui.mjs tap <x> <y>
     node tools/ui.mjs swipe <x1> <y1> <x2> <y2> [steps] [ms]
     node tools/ui.mjs hold <x> <y> <dx> <dy> <steps>   # leaves finger down, prints mid state
*/
const port = process.argv[2] && process.argv[2].startsWith("9") ? process.argv[2] : "9223";
const argv = process.argv.slice(2).filter((a) => !(a.startsWith("9") && a.length === 4));
const cmd = argv[0];

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
  if (r.exceptionDetails) return "ERR " + JSON.stringify(r.exceptionDetails.exception?.description || r.exceptionDetails.text);
  return r.result.value;
};
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const touch = (type, x, y) =>
  send("Input.dispatchTouchEvent", {
    type,
    touchPoints: type === "touchEnd" ? [] : [{ x, y, radiusX: 2, radiusY: 2, force: 1 }],
  });

const out = (v) => console.log(typeof v === "string" ? v : JSON.stringify(v));

if (cmd === "eval") {
  out(await ev(argv.slice(1).join(" ")));
} else if (cmd === "tap") {
  const x = Number(argv[1]);
  const y = Number(argv[2]);
  await touch("touchStart", x, y);
  await sleep(40);
  await touch("touchEnd", x, y);
  out("ok");
} else if (cmd === "swipe") {
  const [x1, y1, x2, y2] = argv.slice(1, 5).map(Number);
  const steps = Number(argv[5] || 12);
  const gap = Number(argv[6] || 12);
  await touch("touchStart", x1, y1);
  for (let i = 1; i <= steps; i++) {
    await touch("touchMove", x1 + ((x2 - x1) * i) / steps, y1 + ((y2 - y1) * i) / steps);
    await sleep(gap);
  }
  await touch("touchEnd", x2, y2);
  out("ok");
} else if (cmd === "hold") {
  const [x, y, dx, dy] = argv.slice(1, 5).map(Number);
  const steps = Number(argv[5] || 10);
  await touch("touchStart", x, y);
  for (let i = 1; i <= steps; i++) {
    await touch("touchMove", x + (dx * i) / steps, y + (dy * i) / steps);
    await sleep(14);
  }
  out("holding");
} else if (cmd === "release") {
  await touch("touchEnd", 0, 0);
  out("ok");
} else {
  out("usage: eval|tap|swipe|hold|release");
}
ws.close();
