#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Generate Android launcher icons from the desktop app icon."""

import os

from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "assets", "appicon.png")
SRC_FALLBACK = r"C:\Users\Easecat\Desktop\项目合集\音乐播放器\build\appicon.png"
RES = os.path.join(ROOT, "android", "app", "src", "main", "res")

DENSITIES = {
    "mipmap-mdpi": 48,
    "mipmap-hdpi": 72,
    "mipmap-xhdpi": 96,
    "mipmap-xxhdpi": 144,
    "mipmap-xxxhdpi": 192,
}


def main():
    src = SRC if os.path.exists(SRC) else SRC_FALLBACK
    img = Image.open(src).convert("RGBA")
    # 方形裁切后缩放，避免非等比导致图标变形
    side = min(img.size)
    left = (img.width - side) // 2
    top = (img.height - side) // 2
    img = img.crop((left, top, left + side, top + side))
    for folder, size in DENSITIES.items():
        out_dir = os.path.join(RES, folder)
        os.makedirs(out_dir, exist_ok=True)
        img.resize((size, size), Image.LANCZOS).save(
            os.path.join(out_dir, "ic_launcher.png"), "PNG", optimize=True
        )
        print("wrote", folder, size)


if __name__ == "__main__":
    main()
