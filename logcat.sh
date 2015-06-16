adb logcat -c

cordova run android
adb logcat CordovaActivity:V CordovaWebView:V CordovaWebViewClient:V IceCreamCordovaWebViewClient:V CordovaLog:V SystemWebChromeClient:v *:S


