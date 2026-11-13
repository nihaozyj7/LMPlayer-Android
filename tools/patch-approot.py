import io
import os

base = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "android", "app", "src", "main", "java", "com", "lmplayer", "android")
app = os.path.join(base, "AppRoot.kt")
frag = os.path.join(base, "_approot_content.kt.txt")

text = io.open(app, encoding="utf-8").read()
new = io.open(frag, encoding="utf-8").read()

a = text.index("    var page by remember")
b = text.index("private fun pgLessThanOne")
out = text[:a] + new + "\n" + text[b:]
io.open(app, "w", encoding="utf-8", newline="\n").write(out)
os.remove(frag)
scratch = os.path.join(base, "_scratch.txt")
if os.path.exists(scratch):
    os.remove(scratch)
print("ok")
