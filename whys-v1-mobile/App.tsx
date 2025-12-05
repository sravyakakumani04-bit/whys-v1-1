
// // // App.tsx
// // import React from "react";
// // import { NavigationContainer } from "@react-navigation/native";
// // import { StatusBar } from "expo-status-bar";
// // import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
// // import AppNavigator from "./src/navigation/AppNavigator"; // or @navigation/AppNavigator if aliases
// // import {colors} from "./src/constants/colors";
// // import {View} from "react-native";

// // export default function App() {
// //   return (
// //     <SafeAreaProvider>
// //       <NavigationContainer>
// //         <StatusBar style="dark" />
// //         <SafeAreaView style={{ flex: 1 ,backgroundColor:colors.C1 }} edges={["top", "left", "right"]} >
// //           <View style={{backgroundColor:"#fff",flex:1}}>
// //              <AppNavigator />
// //           </View>
// //         </SafeAreaView>
// //       </NavigationContainer>
// //     </SafeAreaProvider>
// //   );
// // }
// // App.tsx
// import 'react-native-gesture-handler'; // 👈 MUST be first

// import React from "react";
// import { NavigationContainer } from "@react-navigation/native";
// import { StatusBar } from "expo-status-bar";
// import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
// import { GestureHandlerRootView } from "react-native-gesture-handler";
// import AppNavigator from "./src/navigation/AppNavigator";
// import { colors } from "./src/constants/colors";
// import { View } from "react-native";

// export default function App() {
//   return (
//     <GestureHandlerRootView style={{ flex: 1 }}>
//       <SafeAreaProvider>
//         <NavigationContainer>
//           <StatusBar style="dark" />
//           <SafeAreaView
//             style={{ flex: 1, backgroundColor: colors.C1 }}
//             edges={["top", "left", "right"]}
//           >
//             <View style={{ backgroundColor: "#fff", flex: 1 }}>
//               <AppNavigator />
//             </View>
//           </SafeAreaView>
//         </NavigationContainer>
//       </SafeAreaProvider>
//     </GestureHandlerRootView>
//   );
// }
// App.tsx

// App.tsx

import "react-native-gesture-handler"; // 👈 keep this first
import "expo-dev-client";              // 👈 needed for dev builds

import notifee from "@notifee/react-native";
import { Audio, InterruptionModeIOS } from "expo-av";

import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { View, Button } from "react-native"; // Button only for quick testing
import AppNavigator from "./src/navigation/AppNavigator";
import { colors } from "./src/constants/colors";

// 👇 This runs ONCE when the JS bundle loads, not inside React components
notifee.registerForegroundService(() => {
  return new Promise(() => {
    console.log("Foreground service started");
    // You can keep background tracking logic here later if needed
  });
});

// Keep a reference to the active recording
let activeRecording: Audio.Recording | null = null;

// Start recording with background support via Notifee
export async function startRecording() {
  try {
    const permission = await Audio.requestPermissionsAsync();
    if (!permission.granted) {
      console.log("Recording permission not granted");
      return;
    }

    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
      staysActiveInBackground: true,
      interruptionModeIOS: InterruptionModeIOS.DuckOthers,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
    });

    const { recording } = await Audio.Recording.createAsync(
      Audio.RecordingOptionsPresets.HIGH_QUALITY
    );
    activeRecording = recording;

    // Create a notification channel (Android)
    const channelId = await notifee.createChannel({
      id: "recording",
      name: "Recording",
    });

    // Show foreground-service notification
    await notifee.displayNotification({
      title: "Android audio background recording",
      body: "Recording...",
      android: {
        channelId,
        asForegroundService: true,
      },
    });

    console.log("Recording started");
  } catch (err) {
    console.error("Failed to start recording", err);
  }
}

// Stop recording and foreground service
export async function stopRecording() {
  try {
    if (activeRecording) {
      await activeRecording.stopAndUnloadAsync();

      // 🔍 Check where the file was saved
      const uri = activeRecording.getURI();
      console.log("✅ Recording file URI:", uri);

      activeRecording = null;
    }

    // Stop Notifee foreground service + clear notifications
    await notifee.stopForegroundService();
    await notifee.cancelAllNotifications();

    console.log("Recording stopped");
  } catch (err) {
    console.error("Failed to stop recording", err);
  }
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <NavigationContainer>
          <StatusBar style="dark" />
          <SafeAreaView
            style={{ flex: 1, backgroundColor: colors.C1 }}
            edges={["top", "left", "right"]}
          >
            <View style={{ backgroundColor: "#fff", flex: 1 }}>
              <AppNavigator />

              {/* Test buttons – remove later if you want */}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-around",
                  padding: 16,
                }}
              >
                <Button title="Start recording" onPress={startRecording} />
                <Button title="Stop recording" onPress={stopRecording} />
              </View>
            </View>
          </SafeAreaView>
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
