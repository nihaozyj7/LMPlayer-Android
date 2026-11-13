/* ==========================================================================
   runtime.js — 安卓端的 Wails 运行时替身
   --------------------------------------------------------------------------
   桌面版的前端由 `wails3 generate bindings` 生成，所有后端调用都长这样：

       import { Call as $Call } from "/wails/runtime.js";
       export function Folders() { return $Call.ByID(2416607191); }

   这个文件就是那份 "/wails/runtime.js" 的安卓实现：
     · Call.ByID(方法名, ...参数)  → POST /rpc {"m":方法名,"a":参数}
       （构建脚本 tools/patch-web.py 已把数字 id 换成了 "Service.Method"，
         所以这里不需要还原 Wails 的哈希算法）
     · Events.On(name, cb)        → 单条 SSE 连接（/events），按事件名分发
     · CancellablePromise         → 带 cancel() 的 Promise（Wails 的返回值约定）
   ========================================================================== */

const RPC_URL = "/rpc";
const EVENTS_URL = "/events";

/* --------------------------------------------------------------------------
   调用
   -------------------------------------------------------------------------- */

export class CancellablePromise extends Promise {
  /** 请求取消：后端仍在跑，但调用方的 then/catch 不再被触发 */
  cancel() {
    if (this._abort) this._abort.abort();
    return this;
  }
}

function makeRequest(method, args) {
  const controller = new AbortController();
  const run = async () => {
    const res = await fetch(RPC_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ m: method, a: args }),
      signal: controller.signal,
    });
    if (!res.ok) {
      throw new Error(`后端返回 ${res.status}`);
    }
    const payload = await res.json();
    if (payload && payload.error) {
      throw new Error(payload.error);
    }
    return payload ? payload.result : null;
  };
  return { controller, run };
}

/**
 * Call 是后端调用的入口。
 * 形如 Call("LibraryService.Folders") 或（改写前的写法）Call.ByID("LibraryService.Folders")。
 */
function call(method, ...args) {
  const { controller, run } = makeRequest(String(method), args);
  const p = new CancellablePromise((resolve, reject) => {
    run().then(resolve, reject);
  });
  p._abort = controller;
  return p;
}

// 改写后的 bindings 仍然写成 $Call.ByID("Service.Method", ...)，这里让它等价于 call
call.ByID = (id, ...args) => call(id, ...args);

export const Call = call;

/* --------------------------------------------------------------------------
   事件
   -------------------------------------------------------------------------- */

const listeners = new Map(); // name -> Set<handler>
let source = null;
let connecting = null;

function ensureSource() {
  if (source || connecting) return;
  connecting = new Promise((resolve) => {
    try {
      const es = new EventSource(EVENTS_URL);
      source = es;
      es.addEventListener("hello", () => resolve(true));
      es.onmessage = (e) => {
        let payload = null;
        try {
          payload = JSON.parse(e.data);
        } catch {
          return;
        }
        const set = listeners.get(payload?.name);
        if (!set) return;
        // 与 Wails 一致：回调拿到 {name, data}
        for (const fn of set) {
          try {
            fn(payload);
          } catch (err) {
            console.error("[runtime] 事件回调异常:", payload?.name, err);
          }
        }
      };
      es.onerror = () => {
        // 后端还没起来 / 连接断了：关掉让下次 On 重新连
        es.close();
        source = null;
        connecting = null;
      };
      // 3 秒内没等到 hello 也放行，避免首屏一直被 await 住
      setTimeout(() => resolve(false), 3000);
    } catch {
      resolve(false);
    }
  });
}

const Events = {
  /** On 订阅事件，返回取消订阅函数 */
  On(name, callback) {
    ensureSource();
    let set = listeners.get(name);
    if (!set) {
      set = new Set();
      listeners.set(name, set);
    }
    set.add(callback);
    return () => {
      set.delete(callback);
      if (set.size === 0) listeners.delete(name);
    };
  },
  OnMultiple(names, callback) {
    const offs = names.map((n) => Events.On(n, callback));
    return () => offs.forEach((off) => off());
  },
  Off(name, callback) {
    const set = listeners.get(name);
    if (!set) return;
    set.delete(callback);
  },
  Emit() {
    // 前端不向后端推事件（桌面版也没有这个用法）
  },
};

export { Events };

/** Create 是 Wails 生成的事件模块的构造入口 */
export const Create = { Events };

/** 部分 Wails 版本会往 window 上挂这些对象，一并提供，避免运行时报 undefined */
if (typeof window !== "undefined") {
  window._wails = window._wails || {};
  window._wails.Events = Events;
  window._wails.Call = call;
}
