"""dev helper: ensure app is running and forward webview devtools port.

usage:
  python tools/_dev.py up        # start app (if needed) + forward 9223
  python tools/_dev.py pid       # print webview pid
"""
import subprocess
import sys
import time

PKG = "com.lmplayer.android"
PORT = "9223"


def sh(*args):
    r = subprocess.run(["adb"] + list(args), capture_output=True, text=True)
    return (r.stdout or "") + (r.stderr or "")


def pids():
    out = sh("shell", "pidof", PKG).strip()
    return [p for p in out.split() if p.isdigit()]


def dev_pids():
    out = sh("shell", "ps", "-A").splitlines()
    found = []
    for line in out:
        if "webview_devtools_remote" in line:
            parts = line.split()
            if len(parts) > 1 and parts[1].isdigit():
                found.append(int(parts[1]))
    return found


def forward():
    for pid in dev_pids():
        r = sh("forward", "tcp:%s" % PORT, "localabstract:webview_devtools_remote_%d" % pid)
        print("forward", pid, r.strip())


def main():
    cmd = sys.argv[1] if len(sys.argv) > 1 else "up"
    if cmd == "pid":
        print(pids(), dev_pids())
        return
    if cmd == "up":
        if not pids():
            print(sh("shell", "am", "start", "-n", PKG + "/.MainActivity").strip())
            time.sleep(6)
        forward()
        return
    if cmd == "restart":
        sh("shell", "am", "force-stop", PKG)
        time.sleep(1)
        print(sh("shell", "am", "start", "-n", PKG + "/.MainActivity").strip())
        time.sleep(7)
        forward()


if __name__ == "__main__":
    main()
