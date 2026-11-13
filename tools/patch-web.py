#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Patch the desktop web build into an Android-friendly web root.

Two things differ from the desktop build:
  1. the generated bindings call the backend through `$Call.ByID(<hash>)`;
     on Android the hash is meaningless, so each call is rewritten to
     `$Call('Service.Method', ...)` which the local runtime understands.
  2. `/wails/runtime.js` is injected by Wails on desktop; here we install
     tools/web/wails-runtime.js in its place.

Run from the workspace root: python tools/patch-web.py
"""

import os
import re
import shutil
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
WWW = os.path.join(ROOT, "android", "app", "src", "main", "assets", "www")
RUNTIME_SRC = os.path.join(ROOT, "tools", "web", "wails-runtime.js")

# bindings file stem -> service name used in the bindings' own doc comments
SERVICE_NAMES = {
    "appservice": "AppService",
    "configservice": "ConfigService",
    "coverservice": "CoverService",
    "downloadservice": "DownloadService",
    "libraryservice": "LibraryService",
    "loudnessservice": "LoudnessService",
    "lyricsservice": "LyricsService",
    "mediakeyservice": "MediaKeyService",
    "mediaservice": "MediaService",
    "onlineservice": "OnlineService",
    "packservice": "PackService",
    "playerservice": "PlayerService",
    "playlistservice": "PlaylistService",
    "skinservice": "SkinService",
    "themeservice": "ThemeService",
    "unplayableservice": "UnplayableService",
    "updateservice": "UpdateService",
    "windowservice": "WindowService",
}

FUNC_RE = re.compile(r"^export function (\w+)\s*\(")
BYID_RE = re.compile(r"\$Call\.ByID\(\s*\d+")


def patch_file(path, service):
    with open(path, "r", encoding="utf-8") as f:
        lines = f.readlines()
    current = None
    changed = 0
    out = []
    for line in lines:
        m = FUNC_RE.match(line)
        if m:
            current = m.group(1)
        if current and BYID_RE.search(line):
            line, n = BYID_RE.subn('$Call("%s.%s"' % (service, current), line)
            changed += n
        out.append(line)
    if changed:
        with open(path, "w", encoding="utf-8", newline="\n") as f:
            f.writelines(out)
    return changed


def main():
    if not os.path.isdir(WWW):
        sys.exit("web root not found: " + WWW + " (copy the desktop frontend/dist first)")

    total = 0
    bindings = os.path.join(WWW, "bindings", "localmusicplayer")
    for name in sorted(os.listdir(bindings)):
        if not name.endswith(".js") or name in ("index.js", "models.js"):
            continue
        stem = name[: -len(".js")]
        service = SERVICE_NAMES.get(stem)
        if not service:
            print("  ? unknown service file:", name)
            continue
        n = patch_file(os.path.join(bindings, name), service)
        total += n
        print("  %-24s %3d calls -> %s" % (name, n, service))

    runtime_dir = os.path.join(WWW, "wails")
    os.makedirs(runtime_dir, exist_ok=True)
    shutil.copyfile(RUNTIME_SRC, os.path.join(runtime_dir, "runtime.js"))
    print("installed /wails/runtime.js")

    inject_shell()
    print("patched calls:", total)


CSS_SRC = os.path.join(ROOT, "tools", "web", "android.css")
JS_SRC = os.path.join(ROOT, "tools", "web", "android.js")
CSS_TAG = '<link rel="stylesheet" href="/android.css" />'
JS_TAG = '<script src="/android.js" defer></script>'


def inject_shell():
    """Drop the mobile layout overrides into the page (idempotent)."""
    shutil.copyfile(CSS_SRC, os.path.join(WWW, "android.css"))
    shutil.copyfile(JS_SRC, os.path.join(WWW, "android.js"))

    index = os.path.join(WWW, "index.html")
    with open(index, "r", encoding="utf-8") as f:
        html = f.read()
    if "/android.css" not in html:
        html = html.replace("</head>", "    " + CSS_TAG + "\n  </head>", 1)
    if "/android.js" not in html:
        html = html.replace("</body>", "    " + JS_TAG + "\n  </body>", 1)
    with open(index, "w", encoding="utf-8", newline="\n") as f:
        f.write(html)
    print("injected android.css / android.js")


if __name__ == "__main__":
    main()
