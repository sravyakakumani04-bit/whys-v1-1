// android-manifest.plugin.js
const { withAndroidManifest, AndroidConfig } = require("@expo/config-plugins");

const withForegroundService = (config) => {
  return withAndroidManifest(config, (config) => {
    const manifest = config.modResults;

    // Ensure tools namespace is present
    if (!manifest.manifest.$["xmlns:tools"]) {
      manifest.manifest.$["xmlns:tools"] = "http://schemas.android.com/tools";
    }

    const mainApplication =
      AndroidConfig.Manifest.getMainApplicationOrThrow(manifest);

    // Ensure service array exists
    mainApplication.service = mainApplication.service || [];

    // Add Notifee foreground service declaration
    mainApplication.service.push({
      $: {
        "android:name": "app.notifee.core.ForegroundService",
        "android:foregroundServiceType": "microphone",
        "tools:replace": "android:foregroundServiceType",
      },
    });

    return config;
  });
};

module.exports = withForegroundService;
