"""把 UI 文件里的 LmColors.X 换成跟随主题的 Lm.cur.x。

只在 Theme.kt 之外的文件里替换；Theme.kt 自己持有固定调色板常量。
"""
import io
import os
import re

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "android", "app", "src", "main", "java", "com", "lmplayer", "android")

MAP = [
    ("LmColors.AccentSoft", "Lm.cur.accentSoft"),
    ("LmColors.Accent", "Lm.cur.accent"),
    ("LmColors.BgElevated", "Lm.cur.bgElevated"),
    ("LmColors.BgRaised", "Lm.cur.bgRaised"),
    ("LmColors.Bg", "Lm.cur.bg"),
    ("LmColors.Divider", "Lm.cur.divider"),
    ("LmColors.TextPrimary", "Lm.cur.textPrimary"),
    ("LmColors.TextSecondary", "Lm.cur.textSecondary"),
    ("LmColors.TextTertiary", "Lm.cur.textTertiary"),
    ("LmColors.Danger", "Lm.cur.danger"),
    ("LmColors.Success", "Lm.cur.success"),
]

changed = []
for name in os.listdir(ROOT):
    if not name.endswith(".kt") or name in ("Theme.kt",):
        continue
    path = os.path.join(ROOT, name)
    with io.open(path, encoding="utf-8") as f:
        text = f.read()
    orig = text
    for old, new in MAP:
        text = text.replace(old, new)
    if text != orig:
        with io.open(path, "w", encoding="utf-8", newline="\n") as f:
            f.write(text)
        changed.append(name)
print("changed:", changed)
