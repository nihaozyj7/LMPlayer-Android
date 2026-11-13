@echo off
REM Build the Android APK: refresh web assets, rebuild the Go AAR, assemble, install.
REM Usage: tools\build-android.cmd [debug^|release] [--install]
setlocal

set ROOT=%~dp0..
set SDK=C:\Users\Easecat\Application\android-sdk
set NDK=%SDK%\ndk\27.2.12479018

set BTYPE=debug
if /i "%~1"=="release" (
  set BTYPE=release
  shift
)
if /i "%~1"=="debug" shift
set GTASK=assembleDebug
if /i "%BTYPE%"=="release" set GTASK=assembleRelease

echo == sync desktop go sources ==
python "%ROOT%\tools\sync-desktop-src.py" || exit /b 1

echo == patch web assets ==
python "%ROOT%\tools\patch-web.py" || exit /b 1

echo == bundle web assets ==
node "%ROOT%\tools\bundle-web.mjs" || exit /b 1

echo == gomobile bind ==
pushd "%ROOT%\go"
set GOFLAGS=-mod=mod
set CGO_ENABLED=1
set ANDROID_HOME=%SDK%
set ANDROID_NDK_HOME=%NDK%
set PATH=C:\Users\Easecat\go\bin;%PATH%
REM -ldflags "-s -w": strip Go DWARF debug info and symbol table.
REM Measured: libgojni.so 23.9MB -> 11.9MB (about 11.4MB of .debug_* sections).
REM .gopclntab is kept, so panic stacks still show function names and line numbers.
REM NOTE: keep this file ASCII-only -- cmd.exe parses .cmd comments in the OEM
REM code page, and CJK characters in REM lines get mangled into extra commands.
gomobile bind -target=android/amd64,android/arm64 -androidapi 26 -javapkg=com.lmplayer.core -ldflags="-s -w" -o "%ROOT%\android\app\libs\mobile.aar" ./mobile || (popd & exit /b 1)
popd

echo == gradle %GTASK% ==
pushd "%ROOT%\android"
call gradle %GTASK% --console=plain || (popd & exit /b 1)
popd

set APK=%ROOT%\android\app\build\outputs\apk\%BTYPE%\app-%BTYPE%.apk

if /i "%1"=="--install" (
  echo == install ==
  "%SDK%\platform-tools\adb.exe" install -r "%APK%" || exit /b 1
  "%SDK%\platform-tools\adb.exe" shell am force-stop com.lmplayer.android
  "%SDK%\platform-tools\adb.exe" shell am start -n com.lmplayer.android/.NativeActivity
)

echo done.
endlocal
