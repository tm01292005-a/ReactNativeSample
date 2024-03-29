import * as appPlugin from './config/app.plugin.js';

module.exports = ({config}) => {
  const defaultAppConfig = {
    ...config,
    name: 'tutorial1',
    version: '1.0',
    icon: './assets/icon.png',
    splash: {
      image: './assets/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff',
    },
    android: {
      package: 'com.tutorial1',
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#ffffff',
      },
      allowBackup: false,
      blockedPermissions: [
        'android.permission.READ_EXTERNAL_STORAGE',
        'android.permission.SYSTEM_ALERT_WINDOW',
        'android.permission.VIBRATE',
        'android.permission.WRITE_EXTERNAL_STORAGE',
      ],
    },
    ios: {
      bundleIdentifier: 'org.name.tutorial1',
      supportsTablet: true,
    },
    disabledPlugins: [
      // default plugin を無効化するために patch-package を使用して機能拡張している
      'withScheme', // カスタムスキーマ 削除
    ],
    plugins: [
      [
        'expo-build-properties',
        {
          android: {
            extraProguardRules: `
# ExpoModulesPakage.ktから、自動生成されたクラスを参照するためにクラス名を利用しているので、クラス名が変わるとアプリが起動しなくなる。
# https://github.com/expo/expo/blob/sdk-46/packages/expo/android/src/main/java/expo/modules/ExpoModulesPackage.kt#L23
-keep class expo.modules.ExpoModulesPackageList { *; }
`,
          },
        },
      ],
      appPlugin.withAndroidMoveDevSettingsActivityToDebugAndroidManifest,
      appPlugin.withAndroidRemoveUsesClearTextTrafficForRelease,
      appPlugin.withIosAddPersonalAccountConfig,
      [
        appPlugin.withIosSetCredentials,
        {
          developmentTeam: '${DEVELOPMENT_TEAM}',
          codeSignStyle: '${CODE_SIGN_STYLE}',
          bundleIdentifier: 'personal.org.name.tutorial1.${PERSONAL_IDENTIFIER}',
        },
      ],
    ],
    updates: {
      enabled: false,
    },
  };
  return defaultAppConfig;
};
