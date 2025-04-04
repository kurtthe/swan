module.exports = {
  expo: {
    name: "Swan Plumbing",
    slug: "Swan",
    privacy: "public",
    platforms: [
      "ios",
      "android"
    ],
    version: "2.2",
    orientation: "portrait",
    icon: "./assets/icon.png",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "cover",
      backgroundColor: "#ffffff"
    },
    updates: {
      fallbackToCacheTimeout: 0,
      url: "https://u.expo.dev/27ee5839-71d0-44b3-bc25-e86c40742718"
    },
    assetBundlePatterns: [
      "**/*"
    ],
    plugins: [
      "@config-plugins/react-native-blob-util",
      "@config-plugins/react-native-pdf",
      [
        "expo-secure-store",
        "expo-font"
      ],
      [
        "expo-build-properties",
        {
          android: {
            usesCleartextTraffic: true,
            compileSdkVersion: 34,
            targetSdkVersion: 34,
            buildToolsVersion: "34.0.0"
          },
          ios: {
            deploymentTarget: "14.0"
          }
        }
      ]
    ],
    ios: {
      config: {
        usesNonExemptEncryption: false
      },
      supportsTablet: true,
      bundleIdentifier: "co.splumbings.SwanPluming",
      buildNumber: "1",
      googleServicesFile: "./GoogleAnalytics/GoogleService-Info.plist",
      userInterfaceStyle: "light",
      infoPlist: {
        NSCameraUsageDescription: "Allow Swan to access your camera to take photos of the products for any requirement in your purchase",
        NSPhotoLibraryUsageDescription: "Allow Swan to access your photos to select photos and then send a requirement of your  purchase",
        UIUserInterfaceStyle: "Light"
      }
    },
    android: {
      config: {
        networkSecurityConfig: "./NetworkSecurity/network_security_config.xml",
        googleMaps: {
          apiKey: "AIzaSyBo1S1NNk3JpmZaiPM_kZSq0yz0vVbf194"
        }
      },
      package: "com.splumbings.Swan",
      permissions: [
        "android.permission.READ_EXTERNAL_STORAGE",
        "android.permission.WRITE_EXTERNAL_STORAGE",
        "android.permission.DOWNLOAD_WITHOUT_NOTIFICATION",
        "android.permission.ACCESS_NETWORK_STATE",
        "android.permission.ACCESS_COARSE_LOCATION",
        "android.permission.ACCESS_FINE_LOCATION",
        "android.permission.FOREGROUND_SERVICE",
      ],
      versionCode:21,
      googleServicesFile: "./GoogleAnalytics/google-services.json"
    },
    description: "Coded by Digital Basis",
    extra: {
      eas: {
        projectId: "27ee5839-71d0-44b3-bc25-e86c40742718"
      }
    },
    runtimeVersion: {
      policy: "sdkVersion"
    }
  }
}
