@echo off
REM Hot-reload the mobile shell (android.css / android.js) without rebuilding the APK.
REM
REM The APK only unpacks assets\www into files/www when lastUpdateTime changes
REM (MainActivity.extractWebAssets), so we can patch the on-device copy and restart.
REM Usage: tools\dev-push.cmd
setlocal

set ROOT=%~dp0..
set SDK=C:\Users\Easecat\Application\android-sdk
set ADB=%SDK%\platform-tools\adb.exe
set PKG=com.lmplayer.android
set WWW=%ROOT%\android\app\src\main\assets\www
set TARBALL=%TEMP%\lmwww.tar

echo == patch web assets ==
python "%ROOT%\tools\patch-web.py" || exit /b 1

echo == pack www ==
pushd "%WWW%"
tar -cf "%TARBALL%" * || (popd & exit /b 1)
popd

echo == push ==
"%ADB%" push "%TARBALL%" /data/local/tmp/lmwww.tar || exit /b 1
"%ADB%" shell run-as %PKG% rm -rf files/www || exit /b 1
"%ADB%" shell run-as %PKG% mkdir -p files/www || exit /b 1
"%ADB%" shell run-as %PKG% tar -xf /data/local/tmp/lmwww.tar -C files/www || exit /b 1

echo == restart ==
"%ADB%" shell am force-stop %PKG%
"%ADB%" shell am start -n %PKG%/.MainActivity

echo done.
endlocal
