#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Sync desktop LMPlayer Go sources into the Android host module.

Copies:
  <desktop>/internal/**            -> go/internal/**        (tests / ffmpeg embed bins skipped)
  <desktop>/<top-level allowlist>  -> go/app/*.go           (package main -> package app)

Run from the workspace root:  python tools/sync-desktop-src.py
"""

import os
import shutil
import sys
import json

DESKTOP = os.environ.get(
    "LM_DESKTOP",
    r"C:\Users\Easecat\Desktop\\项目合集\音乐播放器",
)
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
GO_ROOT = os.path.join(ROOT, "go")

# internal packages copied as-is
INTERNAL_SKIP_FILES = {"embed_dev.go", "embed_production.go"}
INTERNAL_SKIP_DIRS = {"bin"}

# top level files moved into package app
APP_FILES = [
    "services.go",
    "services_ai.go",
    "services_app.go",
    "services_cover.go",
    "services_download.go",
    "services_online.go",
    "services_packs.go",
    "services_player.go",
    "services_reference.go",
    "services_skins.go",
    "services_unplayable.go",
    "ai_tags.go",
    "ai_vendor.go",
    "lyrics_meta.go",
    "online_wiring.go",
    "online_cache_cleanup.go",
    "byte_pipe.go",
    "http_stream_client.go",
]

# Desktop-only chunks removed from an otherwise shared file.
# Anchor pair: (start marker, end marker kept in output)
CUT_RANGES = {
    "services.go": [(
        "// ---------------------------------------------------------------------------\n"
        "// Window 服务（自绘标题栏用）\n"
        "// ---------------------------------------------------------------------------\n",
        "// ---------------------------------------------------------------------------\n"
        "// 工具函数\n"
        "// ---------------------------------------------------------------------------\n",
    )],
}



def copy_internal():
    src_root = os.path.join(DESKTOP, "internal")
    dst_root = os.path.join(GO_ROOT, "internal")
    count = 0
    for base, dirs, files in os.walk(src_root):
        dirs[:] = [d for d in dirs if d not in INTERNAL_SKIP_DIRS]
        rel = os.path.relpath(base, src_root)
        dst = os.path.join(dst_root, rel) if rel != "." else dst_root
        os.makedirs(dst, exist_ok=True)
        for name in files:
            if name.endswith("_test.go"):
                continue
            if rel == "ffmpeg" and name in INTERNAL_SKIP_FILES:
                continue
            shutil.copyfile(os.path.join(base, name), os.path.join(dst, name))
            count += 1
    return count


def copy_app_files():
    dst_root = os.path.join(GO_ROOT, "app")
    os.makedirs(dst_root, exist_ok=True)
    manifest_path = os.path.join(dst_root, ".synced.json")
    previous = []
    if os.path.exists(manifest_path):
        try:
            with open(manifest_path, "r", encoding="utf-8") as f:
                previous = json.load(f)
        except Exception:
            previous = []
    for name in previous:
        if name not in APP_FILES:
            path = os.path.join(dst_root, name)
            if os.path.exists(path):
                os.remove(path)
                print("  - removed stale:", name)
    count = 0
    for name in APP_FILES:
        src = os.path.join(DESKTOP, name)
        if not os.path.exists(src):
            print("  ! missing:", name)
            continue
        with open(src, "r", encoding="utf-8") as f:
            text = f.read()
        for start, end in CUT_RANGES.get(name, []):
            i = text.find(start)
            j = text.find(end) if i >= 0 else -1
            if i < 0 or j < 0 or j <= i:
                print("  ! cut anchors not found in", name)
            else:
                text = text[:i] + text[j:]
                if name == "services.go":
                    # the removed window section was the only user of these
                    text = text.replace('\t"sync/atomic"\n', "")
                    text = text.replace('\t"unsafe"\n', "")
        text = text.replace("package main\n", "package app\n", 1)
        with open(os.path.join(dst_root, name), "w", encoding="utf-8", newline="\n") as f:
            f.write(text)
        count += 1
    with open(manifest_path, "w", encoding="utf-8", newline="\n") as f:
        json.dump(APP_FILES, f, ensure_ascii=False, indent=2)
    return count


def main():
    if not os.path.isdir(DESKTOP):
        sys.exit("desktop project not found: " + DESKTOP)
    n1 = copy_internal()
    n2 = copy_app_files()
    print("copied internal files:", n1)
    print("copied app files:", n2)


if __name__ == "__main__":
    main()
