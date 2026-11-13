package com.lmplayer.android;

import android.Manifest;
import android.app.Activity;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.graphics.Color;
import android.os.Build;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.view.ViewGroup;
import android.view.Window;
import android.view.WindowInsets;
import android.view.WindowInsetsController;
import android.view.WindowManager;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.FrameLayout;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;

import com.lmplayer.core.mobile.Mobile;

/**
 * LMPlayer 安卓外壳。
 *
 * 启动顺序（每一步失败都要能说明白，否则用户看到的就是一块黑屏）：
 *   1. 把 APK 里的前端资源（assets/www）解到 filesDir/www —— Go 用 http.FileServer 提供；
 *   2. 启动 Go 后端（gomobile 的 AAR），它监听 127.0.0.1 的随机端口；
 *   3. WebView 加载 http://127.0.0.1:&lt;port&gt;/ —— 前端与 API 同源，
 *      这样 /rpc、/events、/audio/ 都不需要处理跨域。
 */
public class MainActivity extends Activity {
    private static final String TAG = "LMPlayer";
    private static final String PREF = "lmplayer";
    private static final String PREF_WEB_VERSION = "webVersion";

    private WebView web;
    private long backendPort = 0L;
    private String errorText = null;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        requestWindowFeature(Window.FEATURE_NO_TITLE);
        getWindow().setBackgroundDrawableResource(android.R.color.black);

        FrameLayout root = new FrameLayout(this);
        root.setBackgroundColor(Color.BLACK);
        root.setLayoutParams(new ViewGroup.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));
        web = new WebView(this);
        web.setBackgroundColor(Color.BLACK);
        root.addView(web, new FrameLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));
        setContentView(root);
        applyEdgeToEdge(root);

        configureWebView();
        requestAudioPermissionIfNeeded();
        new Thread(this::boot).start();
    }

    /* ---------------------------------------------------------------- 启动 */

    private void boot() {
        try {
            File webDir = new File(getFilesDir(), "www");
            extractWebAssets(webDir);
            File dataDir = new File(getFilesDir(), "data");
            File cacheDir = new File(getCacheDir(), "lmplayer");
            //noinspection ResultOfMethodCallIgnored
            dataDir.mkdirs();
            //noinspection ResultOfMethodCallIgnored
            cacheDir.mkdirs();

            backendPort = Mobile.start(
                    webDir.getAbsolutePath(),
                    dataDir.getAbsolutePath(),
                    cacheDir.getAbsolutePath(),
                    defaultMusicDir());
            Log.i(TAG, "backend started on port " + backendPort);
            runOnUiThread(this::loadApp);
        } catch (Throwable t) {
            Log.e(TAG, "backend start failed", t);
            errorText = String.valueOf(t);
            runOnUiThread(this::showError);
        }
    }

    /** 默认音乐目录：优先系统的 Music 目录，没有就用应用自己的目录。 */
    private String defaultMusicDir() {
        File music = android.os.Environment.getExternalStoragePublicDirectory(
                android.os.Environment.DIRECTORY_MUSIC);
        if (music != null && (music.exists() || music.mkdirs())) {
            return music.getAbsolutePath();
        }
        File fallback = new File(getExternalFilesDir(null), "Music");
        //noinspection ResultOfMethodCallIgnored
        fallback.mkdirs();
        return fallback.getAbsolutePath();
    }

    private void loadApp() {
        web.loadUrl("http://127.0.0.1:" + backendPort + "/");
    }

    private void showError() {
        String html = "<html><body style='background:#0b0b0f;color:#e6e6ee;font:14px system-ui;padding:24px'>"
                + "<h3>后端启动失败</h3><pre style='white-space:pre-wrap;color:#f88'>"
                + (errorText == null ? "" : errorText.replace("<", "&lt;"))
                + "</pre></body></html>";
        web.loadDataWithBaseURL(null, html, "text/html", "utf-8", null);
    }

    /* ------------------------------------------------------------ 资源解压 */

    /** 把 assets/www 解到私有目录；APK 版本变了才重解，避免每次启动都写盘。 */
    private void extractWebAssets(File target) throws IOException {
        long version = currentPackageVersion();
        SharedPreferences sp = getSharedPreferences(PREF, MODE_PRIVATE);
        boolean same = sp.getLong(PREF_WEB_VERSION, -1L) == version;
        if (same && new File(target, "index.html").exists()) {
            return;
        }
        copyAssetDir("www", target);
        sp.edit().putLong(PREF_WEB_VERSION, version).apply();
    }

    private long currentPackageVersion() {
        try {
            return getPackageManager().getPackageInfo(getPackageName(), 0).lastUpdateTime;
        } catch (PackageManager.NameNotFoundException e) {
            return 0L;
        }
    }

    private void copyAssetDir(String assetPath, File target) throws IOException {
        String[] children = getAssets().list(assetPath);
        if (children == null || children.length == 0) {
            copyAssetFile(assetPath, target);
            return;
        }
        //noinspection ResultOfMethodCallIgnored
        target.mkdirs();
        for (String child : children) {
            copyAssetDir(assetPath + "/" + child, new File(target, child));
        }
    }

    private void copyAssetFile(String assetPath, File target) throws IOException {
        File parent = target.getParentFile();
        if (parent != null) {
            //noinspection ResultOfMethodCallIgnored
            parent.mkdirs();
        }
        try (InputStream in = getAssets().open(assetPath);
             OutputStream out = new FileOutputStream(target)) {
            byte[] buf = new byte[64 * 1024];
            int n;
            while ((n = in.read(buf)) > 0) {
                out.write(buf, 0, n);
            }
        }
    }

    /* -------------------------------------------------------------- WebView */

    @SuppressWarnings("SetJavaScriptEnabled")
    private void configureWebView() {
        WebSettings s = web.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);
        s.setDatabaseEnabled(true);
        s.setAllowFileAccess(false);
        s.setAllowContentAccess(true);
        s.setMediaPlaybackRequiresUserGesture(false);
        s.setSupportZoom(false);
        s.setBuiltInZoomControls(false);
        s.setUseWideViewPort(false);
        s.setLoadWithOverviewMode(false);
        s.setTextZoom(100);
        s.setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);
        s.setCacheMode(WebSettings.LOAD_DEFAULT);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            s.setForceDark(WebSettings.FORCE_DARK_OFF);
        }
        web.setWebChromeClient(new WebChromeClient());
        web.setWebViewClient(new WebViewClient());
        WebView.setWebContentsDebuggingEnabled(true);
    }

    private void requestAudioPermissionIfNeeded() {
        String perm = Build.VERSION.SDK_INT >= 33
                ? Manifest.permission.READ_MEDIA_AUDIO
                : Manifest.permission.READ_EXTERNAL_STORAGE;
        if (checkSelfPermission(perm) != PackageManager.PERMISSION_GRANTED) {
            requestPermissions(new String[]{perm}, 1001);
        }
    }

    /* ----------------------------------------------------------- 边到边布局 */

    private void applyEdgeToEdge(View root) {
        Window w = getWindow();
        w.addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
            w.setDecorFitsSystemWindows(false);
            WindowInsetsController c = w.getInsetsController();
            if (c != null) {
                c.setSystemBarsBehavior(WindowInsetsController.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE);
            }
        }
        root.setOnApplyWindowInsetsListener((v, insets) -> {
            int top, bottom;
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
                android.graphics.Insets bars = insets.getInsets(
                        WindowInsets.Type.systemBars() | WindowInsets.Type.displayCutout());
                top = bars.top;
                bottom = bars.bottom;
            } else {
                top = insets.getSystemWindowInsetTop();
                bottom = insets.getSystemWindowInsetBottom();
            }
            v.setPadding(0, top, 0, bottom);
            return insets;
        });
    }

    @Override
    public void onBackPressed() {
        web.evaluateJavascript("window.__lmAndroidBack ? window.__lmAndroidBack() : 'exit'", value -> {
            if (value == null || value.contains("exit")) {
                finish();
            }
        });
    }

    @Override
    protected void onDestroy() {
        if (web != null) {
            web.destroy();
            web = null;
        }
        try {
            Mobile.stop();
        } catch (Throwable t) {
            Log.w(TAG, "backend stop failed", t);
        }
        super.onDestroy();
    }
}
