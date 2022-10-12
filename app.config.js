import 'dotenv/config';

export default {
  expo: {
    name: 'CHO-MATE',
    slug: 'CHO-MATE',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './app/assets/icon-chomate.png',
    splash: {
      image: './app/assets/chomate-splash.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff',
    },
    runtimeVersion: {
      policy: "sdkVersion"
    },
    updates: {
      url: "https://u.expo.dev/42b38bb0-bc5b-48bf-a15f-c4e67919f70d",
      fallbackToCacheTimeout: 10,
    },
    assetBundlePatterns: ['assets/*'],
    ios: {
      bundleIdentifier: 'com.expo.chomate.chomate',
      supportsTablet: true,
      infoPlist: {
        UIBackgroundModes: [
          "remote-notification",
          "fetch"
        ]
      }
    },
    android: {
      package: 'com.expo.chomate.chomate',
      adaptiveIcon: {
        foregroundImage: './app/assets/icon-chomate.png',
        backgroundColor: '#FFFFFF',
      },
    },
    web: {
      favicon: './app/assets/favicon.png',
    },
    extra: {
      apiKey: process.env.API_KEY,
      authDomain: process.env.AUTH_DOMAIN,
      projectId: process.env.PROJECT_ID,
      storageBucket: process.env.STORAGE_BUCKET,
      messagingSenderId: process.env.MESSAGING_SENDER_ID,
      appId: process.env.APP_ID,
      eas: {
        projectId: "42b38bb0-bc5b-48bf-a15f-c4e67919f70d"
      }
    },
  },
};
