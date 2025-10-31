
// import React, { useMemo } from "react";
// import { View, StyleSheet, Pressable, Text, Platform } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import FontAwesome6 from "@expo/vector-icons/FontAwesome6"; // FA6
// import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons"; // MCI for lightbulb-on
// import { useNavigation } from "@react-navigation/native";
// import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
// import { v, vs } from "../utils/size";
// import { colors } from "../constants/colors";

// export type TabKey = "home" | "journal" | "chat" | "todos" | "profile";
// type Props = { active?: TabKey };

// type RootStackParamList = {
//   Home: undefined;
//   Journal: undefined;
//   chat: undefined;
//   todos: undefined;
//   Insights: undefined;
// };

// /** Small wrapper to support multiple icon libraries (Ionicons by default, FA6/MCI on demand) */
// function AppIcon({
//   lib = "ion",
//   name,
//   size,
//   color,
// }: {
//   lib?: "ion" | "fa6" | "mci";
//   name: string;
//   size: number;
//   color: string;
// }) {
//   if (lib === "fa6") {
//     return (
//       <FontAwesome6
//         name={name as React.ComponentProps<typeof FontAwesome6>["name"]}
//         size={size}
//         color={color}
//       />
//     );
//   }
//   if (lib === "mci") {
//     return (
//       <MaterialCommunityIcons
//         name={name as React.ComponentProps<typeof MaterialCommunityIcons>["name"]}
//         size={size}
//         color={color}
//       />
//     );
//   }
//   return (
//     <Ionicons
//       name={name as React.ComponentProps<typeof Ionicons>["name"]}
//       size={size}
//       color={color}
//     />
//   );
// }

// export default function BottomNav({ active = "home" }: Props) {
//   const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

//   const routeByKey = useMemo<Record<TabKey, keyof RootStackParamList>>(
//     () => ({
//       home: "Home",
//       journal: "Journal",
//       chat: "chat",
//       todos: "todos",
//       profile: "Insights",
//     }),
//     []
//   );

//   const go = (k: TabKey) => navigation.navigate(routeByKey[k]);

//   const Tab = ({
//     icon,
//     iconLib = "ion",
//     label,
//     keyVal,
//   }: {
//     icon: string;                // name in the chosen library
//     iconLib?: "ion" | "fa6" | "mci"; // which library
//     label: string;
//     keyVal: TabKey;
//   }) => {
//     const tint = active === keyVal ? colors.C3 : "#8A97A4";
//     // 🔥 Only change: make Insights (profile) bulb bigger, everything else same
//     const iconSize = keyVal === "profile" ? v(28) : v(22);

//     return (
//       <Pressable
//         style={s.item}
//         onPress={() => go(keyVal)}
//         hitSlop={8}
//         accessibilityRole="button"
//         accessibilityLabel={label}
//       >
//         <AppIcon lib={iconLib} name={icon} size={iconSize} color={tint} />
//         <Text style={[s.label, { color: tint }]}>{label}</Text>
//       </Pressable>
//     );
//   };

//   return (
//     <View style={s.wrap}>
//       <Tab icon="home-outline" label="Home" keyVal="home" />
//       <Tab icon="book-outline" label="Journal" keyVal="journal" />

//       <Pressable
//         style={s.fab}
//         onPress={() => go("chat")}
//         accessibilityRole="button"
//         accessibilityLabel="Open chat"
//       >
//         <Ionicons name="chatbubble-ellipses" size={v(26)} color="#fff" />
//       </Pressable>

//       {/* ✅ Use FontAwesome6 for ToDo's */}
//       <Tab iconLib="fa6" icon="pen-to-square" label="Notes" keyVal="todos" />

//       {/* ✅ Insights uses MaterialCommunityIcons lightbulb-on, enlarged */}
//       <Tab iconLib="mci" icon="lightbulb-on-outline" label="Insights" keyVal="profile" />
//     </View>
//   );
// }

// const NAV_HEIGHT = vs(64);
// const s = StyleSheet.create({
//   wrap: {
//     position: "absolute",
//     left: 0,
//     right: 0,
//     bottom: v(10),
//     height: NAV_HEIGHT,
//     backgroundColor: "#fff",
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     paddingHorizontal: v(18),
//     shadowColor: "#000",
//     shadowOpacity: 0.1,
//     shadowRadius: v(12),
//     shadowOffset: { width: 0, height: vs(6) },
//     elevation: 10,
//   },
//   item: { width: v(70),height:v(50), alignItems: "center", justifyContent: "center", gap: vs(2) ,backgroundColor:"#fff"},
//   label: { fontSize: v(10), fontWeight: "700" },
//   fab: {
//     alignSelf: "center",
//     left: "50%",
//     transform: [{ translateX: -v(170) }, { translateY: -vs(18) }],
//     width: v(64),
//     height: v(64),
//     borderRadius: 999,
//     backgroundColor: colors.C1,
//     alignItems: "center",
//     justifyContent: "center",
    
//     borderWidth: Platform.OS === "ios" ? StyleSheet.hairlineWidth : 0,
//     borderColor: "rgba(255,255,255,0.85)",
//   },
// });
import React, { useMemo } from "react";
import { View, StyleSheet, Pressable, Text, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import * as Haptics from "expo-haptics"; // ✅ import haptics
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { v, vs } from "../utils/size";
import { colors } from "../constants/colors";

export type TabKey = "home" | "journal" | "chat" | "notes" | "profile";

type Props = { active?: TabKey };

type RootStackParamList = {
  Home: undefined;
  Journal: undefined;
  chat: undefined;
  Notes: undefined;
  Insights: undefined;
};

/* ------------------------- Icon Wrapper ------------------------- */
function AppIcon({
  lib = "ion",
  name,
  size,
  color,
}: {
  lib?: "ion" | "fa6" | "mci";
  name: string;
  size: number;
  color: string;
}) {
  if (lib === "fa6") {
    return (
      <FontAwesome6
        name={name as React.ComponentProps<typeof FontAwesome6>["name"]}
        size={size}
        color={color}
      />
    );
  }
  if (lib === "mci") {
    return (
      <MaterialCommunityIcons
        name={name as React.ComponentProps<typeof MaterialCommunityIcons>["name"]}
        size={size}
        color={color}
      />
    );
  }
  return (
    <Ionicons
      name={name as React.ComponentProps<typeof Ionicons>["name"]}
      size={size}
      color={color}
    />
  );
}

/* ------------------------- Bottom Nav ------------------------- */
export default function BottomNav({ active = "home" }: Props) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const routeByKey = useMemo<Record<TabKey, keyof RootStackParamList>>(
    () => ({
      home: "Home",
      journal: "Journal",
      chat: "chat",
      notes: "Notes",
      profile: "Insights",
    }),
    []
  );

  const go = async (k: TabKey) => {
    await Haptics.selectionAsync(); // ✅ light haptic tap feedback
    navigation.navigate(routeByKey[k]);
  };

  const Tab = ({
    icon,
    iconLib = "ion",
    label,
    keyVal,
  }: {
    icon: string;
    iconLib?: "ion" | "fa6" | "mci";
    label: string;
    keyVal: TabKey;
  }) => {
    const tint = active === keyVal ? colors.C3 : "#8A97A4";
    const iconSize = keyVal === "profile" ? v(28) : v(22);

    return (
      <Pressable
        style={s.item}
        onPress={() => go(keyVal)}
        hitSlop={8}
        android_ripple={{ color: "rgba(0,0,0,0.1)", borderless: true }} // ✅ ripple
        accessibilityRole="button"
        accessibilityLabel={label}
      >
        <AppIcon lib={iconLib} name={icon} size={iconSize} color={tint} />
        <Text style={[s.label, { color: tint }]}>{label}</Text>
      </Pressable>
    );
  };

  return (
    <View style={s.wrap}>
      <Tab icon="home-outline" label="Home" keyVal="home" />
      <Tab icon="book-outline" label="Journal" keyVal="journal" />

      <Pressable
        style={s.fab}
        onPress={async () => {
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); // ✅ stronger haptic for FAB
          go("chat");
        }}
        accessibilityRole="button"
        accessibilityLabel="Open chat"
      >
        <Ionicons name="chatbubble-ellipses" size={v(26)} color="#fff" />
      </Pressable>

      <Tab iconLib="fa6" icon="pen-to-square" label="Notes" keyVal="notes" />
      <Tab iconLib="mci" icon="lightbulb-on-outline" label="Insights" keyVal="profile" />
    </View>
  );
}

/* ------------------------- Styles ------------------------- */
const NAV_HEIGHT = vs(64);

const s = StyleSheet.create({
  wrap: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: v(10),
    height: NAV_HEIGHT,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: v(18),
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: v(12),
    shadowOffset: { width: 0, height: vs(6) },
    elevation: 10,
  },
  item: {
    width: v(70),
    height: v(50),
    alignItems: "center",
    justifyContent: "center",
    gap: vs(2),
    backgroundColor: "#fff",
  },
  label: {
    fontSize: v(10),
    fontWeight: "700",
  },
  fab: {
    alignSelf: "center",
    left: "50%",
    transform: [{ translateX: -v(170) }, { translateY: -vs(18) }],
    width: v(64),
    height: v(64),
    borderRadius: 999,
    backgroundColor: colors.C1,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: Platform.OS === "ios" ? StyleSheet.hairlineWidth : 0,
    borderColor: "rgba(255,255,255,0.85)",
  },
});
