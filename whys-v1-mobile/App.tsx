
// // App.tsx
// import React from "react";
// import { NavigationContainer } from "@react-navigation/native";
// import { StatusBar } from "expo-status-bar";
// import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
// import AppNavigator from "./src/navigation/AppNavigator"; // or @navigation/AppNavigator if aliases
// import {colors} from "./src/constants/colors";
// import {View} from "react-native";

// export default function App() {
//   return (
//     <SafeAreaProvider>
//       <NavigationContainer>
//         <StatusBar style="dark" />
//         <SafeAreaView style={{ flex: 1 ,backgroundColor:colors.C1 }} edges={["top", "left", "right"]} >
//           <View style={{backgroundColor:"#fff",flex:1}}>
//              <AppNavigator />
//           </View>
//         </SafeAreaView>
//       </NavigationContainer>
//     </SafeAreaProvider>
//   );
// }
// App.tsx
import 'react-native-gesture-handler'; // 👈 MUST be first

import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import AppNavigator from "./src/navigation/AppNavigator";
import { colors } from "./src/constants/colors";
import { View } from "react-native";

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
            </View>
          </SafeAreaView>
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
