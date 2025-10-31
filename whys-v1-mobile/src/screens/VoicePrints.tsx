// // src/screens/VoicePrintsScreen.tsx
// import React, { useMemo, useState, useEffect } from "react";
// import { View, Text, StyleSheet, FlatList, Pressable, Modal, Alert } from "react-native";
// import { Ionicons, MaterialIcons } from "@expo/vector-icons";
// import { v, vs } from "../utils/size";
// import { colors } from "../constants/colors";
// import { useNavigation, useFocusEffect } from "@react-navigation/native";
// import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

// type VoicePrint = {
//   id: string;
//   name: string;
// };

// type RootStackParamList = {
//   Home: undefined;
//   Journal: undefined;
//   chat: undefined;
//   todos: undefined;
//   RecordingDetail: { id: string };
//   VoicePrints: undefined;
//   Recording: { voicePrintId: string; voicePrintName: string };
// };

// type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// export default function VoicePrintsScreen() {
//   const navigation = useNavigation<NavigationProp>();
//   const [aboutOpen, setAboutOpen] = useState(false);
//   const [voicePrints, setVoicePrints] = useState<VoicePrint[]>([]);

//   // Load voice prints from assets on mount and focus
//   useFocusEffect(
//     React.useCallback(() => {
//       loadVoicePrints();
//     }, [])
//   );

//   const loadVoicePrints = async () => {
//     try {
//       // Import the JSON file from assets
//       const voiceprintsData = require("../assets/voiceprints.json");
      
//       // Extract unique voice prints by id and name
//       const uniquePrints = Array.from(
//         new Map(
//           voiceprintsData.map((item: any) => [
//             item.id,
//             {
//               id: item.id,
//               name: item.name,
//             },
//           ])
//         ).values()
//       ) as VoicePrint[];
      
//       setVoicePrints(uniquePrints);
//     } catch (error) {
//       console.log("Error loading voice prints:", error);
//       setVoicePrints([]);
//     }
//   };

//   const data = useMemo<VoicePrint[]>(() => voicePrints, [voicePrints]);

//   const handleAddVoice = () => {
//     const newId = `vp${Date.now()}`;
//     navigation.navigate("Recording", {
//       voicePrintId: newId,
//       voicePrintName: "",
//     });
//   };

//   const renderItem = ({ item }: { item: VoicePrint }) => (
//     <Pressable
//       style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
//       onPress={() => {
//         navigation.navigate("Recording", {
//           voicePrintId: item.id,
//           voicePrintName: item.name,
//         });
//       }}
//     >
//       <View style={styles.leftIcon}>
//         <MaterialIcons name="record-voice-over" size={v(20)} color={colors.C3} />
//       </View>
//       <View style={{ flex: 1 }}>
//         <Text style={styles.name} numberOfLines={1}>
//           {item.name}
//         </Text>
//       </View>
//       <Ionicons
//         name="chevron-forward"
//         size={v(18)}
//         color={colors.C3}
//         style={{ opacity: 0.35 }}
//       />
//     </Pressable>
//   );

//   return (
//     <View style={styles.screen}>
//       {/* Top bar */}
//       <View style={styles.header}>
//         <Pressable onPress={() => navigation.goBack()} style={styles.iconBtn}>
//           <Ionicons
//             name="arrow-back"
//             size={v(22)}
//             color="#fff"
//             style={{ opacity: 0.65 }}
//           />
//         </Pressable>
//         <Text style={styles.headerTitle}>Voice Prints</Text>
//         <Pressable onPress={() => setAboutOpen(true)} style={styles.iconBtn}>
//           <Ionicons
//             name="information-circle-outline"
//             size={v(22)}
//             color="#fff"
//             style={{ opacity: 0.65 }}
//           />
//         </Pressable>
//       </View>

//       {/* List */}
//       <FlatList
//         data={data}
//         keyExtractor={(it) => it.id}
//         renderItem={renderItem}
//         contentContainerStyle={{ paddingVertical: vs(12) }}
//         ItemSeparatorComponent={() => <View style={{ height: vs(8) }} />}
//       />

//       {/* Add Voice floating button */}
//       <Pressable
//         onPress={handleAddVoice}
//         style={({ pressed }) => [styles.fab, pressed && { opacity: 0.85 }]}
//       >
//         <Ionicons name="add" size={v(22)} color="#fff" />
//         <Text style={styles.fabText}>Add Voice</Text>
//       </Pressable>

//       {/* About Voice Prints modal */}
//       <Modal
//         visible={aboutOpen}
//         transparent
//         animationType="fade"
//         onRequestClose={() => setAboutOpen(false)}
//       >
//         <Pressable style={styles.backdrop} onPress={() => setAboutOpen(false)}>
//           <View style={styles.sheet}>
//             <Text style={styles.sheetTitle}>About Voice Prints</Text>
//             <Text style={styles.sheetText}>
//               Voice Prints help match diarized segments to known speakers. Add at least 3 short samples per person
//               (quiet room, 10–20s each). We'll create robust embeddings and use them to label future sessions.
//             </Text>
//             <Pressable style={styles.sheetBtn} onPress={() => setAboutOpen(false)}>
//               <Text style={styles.sheetBtnText}>Got it</Text>
//             </Pressable>
//           </View>
//         </Pressable>
//       </Modal>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   screen: { flex: 1, backgroundColor: "#fff" },
//   header: {
//     backgroundColor: colors.C1,
//     paddingTop: vs(48),
//     paddingBottom: vs(16),
//     paddingHorizontal: v(16),
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   headerTitle: {
//     flex: 1,
//     textAlign: "center",
//     color: "#fff",
//     fontSize: v(20),
//     fontWeight: "700",
//     marginRight: v(20),
//     opacity: 0.65,
//   },
//   iconBtn: { width: v(36), height: v(36), alignItems: "center", justifyContent: "center" },

//   row: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginHorizontal: v(14),
//     backgroundColor: "#fff",
//     borderRadius: v(14),
//     paddingVertical: vs(14),
//     paddingHorizontal: v(14),
//     shadowColor: "#000",
//     shadowOpacity: 0.06,
//     shadowRadius: v(8),
//     shadowOffset: { width: 0, height: vs(3) },
//     elevation: 2,
//   },
//   rowPressed: { opacity: 0.9 },
//   leftIcon: {
//     width: v(34),
//     height: v(34),
//     borderRadius: v(12),
//     backgroundColor: colors.C4,
//     alignItems: "center",
//     justifyContent: "center",
//     marginRight: v(12),
//   },
//   name: { fontSize: v(15), fontWeight: "700", color: colors.C3 },
//   meta: { marginTop: vs(3), fontSize: v(12), color: "rgba(40,71,102,0.7)", fontWeight: "600" },

//   fab: {
//     position: "absolute",
//     right: v(16),
//     bottom: vs(24),
//     backgroundColor: colors.C3,
//     borderRadius: v(24),
//     paddingHorizontal: v(16),
//     height: vs(44),
//     flexDirection: "row",
//     alignItems: "center",
//     gap: v(8),
//     shadowColor: "#000",
//     shadowOpacity: 0.15,
//     shadowRadius: v(10),
//     shadowOffset: { width: 0, height: vs(4) },
//     elevation: 4,
//   },
//   fabText: { color: "#fff", fontWeight: "700", fontSize: v(14) },

//   backdrop: {
//     flex: 1,
//     backgroundColor: "rgba(0,0,0,0.35)",
//     alignItems: "center",
//     justifyContent: "flex-end",
//     padding: v(16),
//   },
//   sheet: {
//     width: "100%",
//     backgroundColor: "#fff",
//     borderRadius: v(16),
//     padding: v(16),
//   },
//   sheetTitle: { fontSize: v(16), fontWeight: "800", color: colors.C3, marginBottom: vs(8) },
//   sheetText: { fontSize: v(13), color: colors.C3, opacity: 0.85, lineHeight: vs(18) },
//   sheetBtn: {
//     marginTop: vs(14),
//     backgroundColor: colors.C4,
//     borderRadius: v(12),
//     alignSelf: "flex-end",
//     paddingVertical: vs(8),
//     paddingHorizontal: v(14),
//   },
//   sheetBtnText: { color: colors.C3, fontWeight: "700" },
// });
// src/screens/VoicePrintsScreen.tsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  Modal,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { v, vs } from "../utils/size";
import { colors } from "../constants/colors";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { fetchVoiceGuests, type VoiceGuest } from "../api/voice_prints";

type VoicePrint = { id: string; name: string };

type RootStackParamList = {
  Home: undefined;
  Journal: undefined;
  chat: undefined;
  todos: undefined;
  RecordingDetail: { id: string };
  VoicePrints: undefined;
  Recording: { voicePrintId: string; voicePrintName: string };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function VoicePrintsScreen() {
  const navigation = useNavigation<NavigationProp>();

  // TODO: replace with your real userId source (auth store / route param)
  const userId = "99a99eea-d4dd-41b8-9ae3-efaec9f62a21";

  const [aboutOpen, setAboutOpen] = React.useState(false);
  const [voicePrints, setVoicePrints] = React.useState<VoicePrint[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);

  const load = React.useCallback(async (signal?: AbortSignal) => {
    try {
      setLoading(true);
      const apiData: VoiceGuest[] = await fetchVoiceGuests(userId, signal);
      setVoicePrints(apiData.map(g => ({ id: g.guestId, name: g.name })));
    } catch (err: any) {
      if (signal?.aborted) return;
      console.log("Failed to load voice prints:", err?.message ?? err);
      Alert.alert("Error", "Couldn't load voice prints. Please try again.");
      setVoicePrints([]);
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, [userId]);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    try {
      const apiData = await fetchVoiceGuests(userId);
      setVoicePrints(apiData.map(g => ({ id: g.guestId, name: g.name })));
    } catch (err) {
      console.log("Refresh failed:", err);
    } finally {
      setRefreshing(false);
    }
  }, [userId]);

  // Load on screen focus; cancel if user navigates away quickly
  useFocusEffect(
    React.useCallback(() => {
      const ac = new AbortController();
      load(ac.signal);
      return () => ac.abort();
    }, [load])
  );

  const handleAddVoice = () => {
    const newId = `vp${Date.now()}`;
    navigation.navigate("Recording", {
      voicePrintId: newId,
      voicePrintName: "",
    });
  };

  const renderItem = ({ item }: { item: VoicePrint }) => (
    <Pressable
      style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
      onPress={() =>
        navigation.navigate("Recording", {
          voicePrintId: item.id,
          voicePrintName: item.name,
        })
      }
    >
      <View style={styles.leftIcon}>
        <MaterialIcons name="record-voice-over" size={v(20)} color={colors.C3} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.name} numberOfLines={1}>
          {item.name}
        </Text>
      </View>
      <Ionicons
        name="chevron-forward"
        size={v(18)}
        color={colors.C3}
        style={{ opacity: 0.35 }}
      />
    </Pressable>
  );

  const Empty = () => (
    <View style={{ padding: v(16), alignItems: "center" }}>
      <Text style={{ color: colors.C3, opacity: 0.6, fontWeight: "600" }}>
        {loading ? "Loading…" : "No voice prints yet"}
      </Text>
      {!loading && (
        <Text style={{ color: colors.C3, opacity: 0.5, marginTop: vs(6) }}>
          Tap “Add Voice” to create one.
        </Text>
      )}
    </View>
  );

  return (
    <View style={styles.screen}>
      {/* Top bar */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.iconBtn}>
          <Ionicons name="arrow-back" size={v(22)} color="#fff" style={{ opacity: 0.65 }} />
        </Pressable>
        <Text style={styles.headerTitle}>Voice Prints</Text>
        <Pressable onPress={() => setAboutOpen(true)} style={styles.iconBtn}>
          <Ionicons name="information-circle-outline" size={v(22)} color="#fff" style={{ opacity: 0.65 }} />
        </Pressable>
      </View>

      {/* Content */}
      {loading && voicePrints.length === 0 ? (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <ActivityIndicator />
        </View>
      ) : (
        <FlatList
          data={voicePrints}
          keyExtractor={(it) => it.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingVertical: vs(12), flexGrow: 1 }}
          ItemSeparatorComponent={() => <View style={{ height: vs(8) }} />}
          ListEmptyComponent={<Empty />}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}

      {/* FAB */}
      <Pressable
        onPress={handleAddVoice}
        style={({ pressed }) => [styles.fab, pressed && { opacity: 0.85 }]}
      >
        <Ionicons name="add" size={v(22)} color="#fff" />
        <Text style={styles.fabText}>Add Voice</Text>
      </Pressable>

      {/* About modal */}
      <Modal
        visible={aboutOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setAboutOpen(false)}
      >
        <Pressable style={styles.backdrop} onPress={() => setAboutOpen(false)}>
          <View style={styles.sheet}>
            <Text style={styles.sheetTitle}>About Voice Prints</Text>
            <Text style={styles.sheetText}>
              Voice Prints help match diarized segments to known speakers. Add at least 3 short samples per person
              (quiet room, 10–20s each). We’ll create robust embeddings and use them to label future sessions.
            </Text>
            <Pressable style={styles.sheetBtn} onPress={() => setAboutOpen(false)}>
              <Text style={styles.sheetBtnText}>Got it</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#fff" },
  header: {
    backgroundColor: colors.C1,
    paddingTop: vs(48),
    paddingBottom: vs(16),
    paddingHorizontal: v(16),
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    color: "#fff",
    fontSize: v(20),
    fontWeight: "700",
    marginRight: v(20),
    opacity: 0.65,
  },
  iconBtn: { width: v(36), height: v(36), alignItems: "center", justifyContent: "center" },

  row: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: v(14),
    backgroundColor: "#fff",
    borderRadius: v(14),
    paddingVertical: vs(14),
    paddingHorizontal: v(14),
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: v(8),
    shadowOffset: { width: 0, height: vs(3) },
    elevation: 2,
  },
  rowPressed: { opacity: 0.9 },
  leftIcon: {
    width: v(34),
    height: v(34),
    borderRadius: v(12),
    backgroundColor: colors.C4,
    alignItems: "center",
    justifyContent: "center",
    marginRight: v(12),
  },
  name: { fontSize: v(15), fontWeight: "700", color: colors.C3 },

  fab: {
    position: "absolute",
    right: v(16),
    bottom: vs(24),
    backgroundColor: colors.C3,
    borderRadius: v(24),
    paddingHorizontal: v(16),
    height: vs(44),
    flexDirection: "row",
    alignItems: "center",
    gap: v(8),
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: v(10),
    shadowOffset: { width: 0, height: vs(4) },
    elevation: 4,
  },
  fabText: { color: "#fff", fontWeight: "700", fontSize: v(14) },

  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: v(16),
  },
  sheet: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: v(16),
    padding: v(16),
  },
  sheetTitle: { fontSize: v(16), fontWeight: "800", color: colors.C3, marginBottom: vs(8) },
  sheetText: { fontSize: v(13), color: colors.C3, opacity: 0.85, lineHeight: vs(18) },
  sheetBtn: {
    marginTop: vs(14),
    backgroundColor: colors.C4,
    borderRadius: v(12),
    alignSelf: "flex-end",
    paddingVertical: vs(8),
    paddingHorizontal: v(14),
  },
  sheetBtnText: { color: colors.C3, fontWeight: "700" },
});
