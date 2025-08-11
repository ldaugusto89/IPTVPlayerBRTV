package com.iptvplayerbrtv

import android.os.Bundle
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate
import com.swmansion.gesturehandler.react.RNGestureHandlerEnabledRootView

class MainActivity : ReactActivity() {

  override fun getMainComponentName(): String = "IPTVPlayerBRTV"

  override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(null) // Isso evita erro em navigation
    }

   override fun createReactActivityDelegate(): ReactActivityDelegate {
        return object : DefaultReactActivityDelegate(
            this,
            mainComponentName,
            fabricEnabled
        ) {
            override fun createRootView(): RNGestureHandlerEnabledRootView {
                return RNGestureHandlerEnabledRootView(this@MainActivity)
            }
        }
    }
}

