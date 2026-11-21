package com.showdowninsight.mobile;

import android.app.Activity;
import android.os.Bundle;
import android.webkit.WebChromeClient;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.view.ViewGroup;
import android.widget.FrameLayout;
import android.widget.TextView;
import android.widget.Button;
import android.widget.LinearLayout;
import android.graphics.Color;
import android.os.Handler;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;

public class MainActivity extends Activity {
    WebView web;
    Handler handler = new Handler();
    String script = "";
    boolean loaded = false;
    @Override public void onCreate(Bundle b) {
        super.onCreate(b);
        try (InputStream in = getAssets().open("insight.js")) { script = new String(in.readAllBytes(), StandardCharsets.UTF_8); } catch(Exception e) { script=""; }
        FrameLayout root = new FrameLayout(this);
        web = new WebView(this);
        web.getSettings().setJavaScriptEnabled(true);
        web.getSettings().setDomStorageEnabled(true);
        web.getSettings().setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);
        web.getSettings().setMediaPlaybackRequiresUserGesture(true);
        web.setWebChromeClient(new WebChromeClient());
        web.setWebViewClient(new WebViewClient() {
            @Override public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                String url = request.getUrl().toString();
                return !(url.startsWith("https://play.pokemonshowdown.com/") || url.startsWith("https://pokemonshowdown.com/"));
            }
            @Override public void onPageFinished(WebView view, String url) { loaded = url.startsWith("https://play.pokemonshowdown.com/"); inject(); }
        });
        root.addView(web, new FrameLayout.LayoutParams(-1,-1));
        Button button = new Button(this); button.setText("INSIGHT"); button.setTextSize(11); button.setAllCaps(false);
        FrameLayout.LayoutParams params = new FrameLayout.LayoutParams(230,110); params.leftMargin=8; params.topMargin=8;
        root.addView(button,params);
        button.setOnClickListener(v -> web.evaluateJavascript("window.ShowdownInsight && window.ShowdownInsight.toggle()", null));
        setContentView(root);
        web.loadUrl("https://play.pokemonshowdown.com/");
        handler.postDelayed(new Runnable(){ @Override public void run(){ inject(); handler.postDelayed(this, 3500); } },3500);
    }
    void inject() { if(loaded && !script.isEmpty()) web.evaluateJavascript(script,null); }
    @Override public void onBackPressed(){ if(web.canGoBack()) web.goBack(); else super.onBackPressed(); }
    @Override protected void onDestroy(){ handler.removeCallbacksAndMessages(null); web.destroy(); super.onDestroy(); }
}
