// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   SectionList,
//   SectionListData,
//   Pressable,
//   ActivityIndicator,
// } from "react-native";
// import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
// import { v, vs } from "../utils/size";
// import { colors } from "../constants/colors";
// import BottomNav from "../components/NavigationBar";
// import { fetchJournalSections, JournalItem, JournalSection } from "../api/journals";

// /* ───────────────────── Date helpers (no local-time conversion) ─────────────────────
//    - If backend sends "YYYY-MM-DD", we use it directly (no Date()).
//    - If backend sends full ISO, we extract *UTC* parts (to avoid device TZ shifts).
// */
// const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"] as const;

// type YMD = { y: number; m: number; d: number; fromYMD: boolean };

// const getYMD = (iso: string): YMD => {
//   const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso ?? "");
//   if (m) {
//     return { y: Number(m[1]), m: Number(m[2]), d: Number(m[3]), fromYMD: true };
//   }
//   // Fallback: full ISO -> use UTC parts to avoid local conversion
//   const dt = new Date(iso);
//   return {
//     y: dt.getUTCFullYear(),
//     m: dt.getUTCMonth() + 1,
//     d: dt.getUTCDate(),
//     fromYMD: false,
//   };
// };

// const isTodayNoTZ = (iso: string) => {
//   // Compare by calendar parts without converting the given string
//   const { y, m, d } = getYMD(iso);
//   const now = new Date();
//   const ty = now.getFullYear();
//   const tm = now.getMonth() + 1;
//   const td = now.getDate();
//   return y === ty && m === tm && d === td;
// };

// /* ───────────────────── Icon mapping (multi-pack) ───────────────────── */
// type IconSpec = { pack: "ion" | "mdc"; name: string };

// const getIconForCategory = (cat?: string): IconSpec => {
//   const c = (cat ?? "").toLowerCase().trim();
//   switch (c) {
//     case "vent":
//       return { pack: "ion", name: "megaphone-outline" };      // Ionicons
//     case "deep-thoughts":
//       return { pack: "mdc", name: "head-cog-outline" };        // MaterialCommunityIcons
//     default:
//       return { pack: "ion", name: "document-outline" };
//   }
// };

// export default function TimelineMemories() {
//   const [sections, setSections] = useState<JournalSection[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [err, setErr] = useState<string | null>(null);

//   // TODO: replace with real userId
//   const userId = "99a99eea-d4dd-41b8-9ae3-efaec9f62a21";

//   useEffect(() => {
//     (async () => {
//       try {
//         setLoading(true);
//         const s = await fetchJournalSections(userId);
//         setSections(s);
//         setErr(null);
//       } catch (e: any) {
//         setErr(e?.message ?? "Failed to load journals");
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, [userId]);

//   const renderItem = ({ item }: { item: JournalItem; section: SectionListData<JournalItem> }) => {
//     const { y, m, d } = getYMD(item.date);
//     const today = isTodayNoTZ(item.date);
//     const { pack, name } = getIconForCategory(item.category);
//     const IconCmp = pack === "ion" ? Ionicons : MaterialCommunityIcons;

//     const onPress = () => {
//       // navigation.navigate('JournalDetail', { id: item.id })
//     };

//     return (
//       <View style={styles.row}>
//         {/* left rail */}
//         <View style={styles.leftRail}>
//           <View style={styles.lineTop} />
//           <View style={[styles.dateChip, today && styles.todayChip]}>
//             <Text style={[styles.chipTopText, today && styles.todayTopText]}>
//               {today ? "Today" : MONTHS[m - 1]}
//             </Text>
//             <Text style={[styles.chipBottomText, today && styles.todayBottomText]}>
//               {String(d).padStart(2, "0")}
//             </Text>
//           </View>
//           <View style={styles.lineBottom} />
//         </View>

//         {/* card */}
//         <Pressable style={styles.card} onPress={onPress}>
//           <View style={styles.cardRow}>
//             <View style={styles.iconWrap}>
//               <IconCmp name={name as any} size={v(18)} color={colors.C3} />
//             </View>
//             <View style={{ flex: 1 }}>
//               <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
//               <Text style={styles.cardSub} numberOfLines={2} ellipsizeMode="tail">
//                 {item.summary || ""}
//               </Text>
//             </View>
//           </View>
//         </Pressable>
//       </View>
//     );
//   };

//   if (loading) {
//     return (
//       <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
//         <ActivityIndicator />
//       </View>
//     );
//   }
//   if (err) {
//     return (
//       <View style={[styles.container, { padding: v(16) }]}>
//         <Text style={{ color: "crimson" }}>Error: {err}</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       {/* top bar */}
//       <View style={styles.topBar}>
//         <Text style={styles.topTitle}>Journals</Text>
//       </View>

//       <SectionList
//         sections={sections}
//         keyExtractor={(it) => `${it.id}-${it.date}`}
//         renderItem={renderItem}
//         renderSectionHeader={({ section }) => (
//           <Text style={styles.sectionHeader}>{section.title}</Text>
//         )}
//         contentContainerStyle={{ paddingBottom: vs(110) }}
//         showsVerticalScrollIndicator={false}
//       />

//       <BottomNav active="journal" />
//     </View>
//   );
// }

// const CHIP_W = v(60);
// const CHIP_H = vs(60);

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#FFFFFF", paddingTop: vs(0) },

//   topBar: {
//     height: vs(50),
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: colors.C1,
//     justifyContent: "center",
//     borderBottomLeftRadius: vs(99),
//     borderBottomRightRadius: vs(99),
//   },
//   topTitle: {
//     fontSize: v(20),
//     fontWeight: "700",
//     color: "#fff",
//     opacity: 0.65,
//     textAlign: "center",
//   },

//   sectionHeader: {
//     paddingHorizontal: v(16),
//     paddingTop: vs(18),
//     paddingBottom: vs(8),
//     fontSize: v(16),
//     fontWeight: "800",
//     color: colors.C3,
//     backgroundColor: "white",
//   },

//   row: { flexDirection: "row", paddingHorizontal: v(16), marginBottom: vs(16) },

//   leftRail: { width: CHIP_W, alignItems: "center" },
//   lineTop: { width: v(2), flexGrow: 1, backgroundColor: "rgba(40,71,102,0.10)" },
//   lineBottom: { width: v(2), flexGrow: 1, backgroundColor: "rgba(40,71,102,0.10)" },

//   dateChip: {
//     width: CHIP_W,
//     height: CHIP_H,
//     borderRadius: CHIP_W / 2,
//     backgroundColor: "#D9D6AF",
//     alignItems: "center",
//     justifyContent: "center",
//     borderWidth: StyleSheet.hairlineWidth,
//     borderColor: "rgba(40,71,102,0.15)",
//   },
//   chipTopText: { fontSize: v(12), fontWeight: "700", color: colors.C3 },
//   chipBottomText: { fontSize: v(12), color: colors.C3, opacity: 0.9 },

//   todayChip: { backgroundColor: "#FFFFFF", borderColor: "#82885D", borderWidth: v(2) },
//   todayTopText: { color: "#82885D" },
//   todayBottomText: { color: "#82885D", fontWeight: "700" },

//   card: {
//     flex: 1,
//     marginLeft: v(12),
//     backgroundColor: colors.C4,
//     borderRadius: v(16),
//     paddingVertical: v(15),
//     paddingHorizontal: v(12),
//     shadowColor: "#000",
//     shadowOpacity: 0.06,
//     shadowRadius: v(8),
//     shadowOffset: { width: 0, height: vs(4) },
//     elevation: 3,
//     borderWidth: StyleSheet.hairlineWidth,
//     borderColor: "rgba(130,136,93,0.20)",
//   },
//   cardRow: { flexDirection: "row", alignItems: "center", gap: v(10) },
//   iconWrap: {
//     width: v(34),
//     height: v(34),
//     borderRadius: v(10),
//     backgroundColor: "#ffff",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   cardTitle: { fontSize: v(15), fontWeight: "700", color: colors.C3, marginBottom: vs(4), opacity: 0.9 },
//   cardSub: { fontSize: v(12), color: "#4A5A67", lineHeight: vs(16) },
// });
// src/screens/TimelineMemories.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SectionList,
  SectionListData,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { v, vs } from "../utils/size";
import { colors } from "../constants/colors";
import BottomNav from "../components/NavigationBar";
import { fetchJournalSections, JournalItem, JournalSection } from "../api/journals";
import { useNavigation } from "@react-navigation/native";
import type { RootStackParamList } from "../navigation/types";
import type { NavigationProp } from "@react-navigation/native";

/* ───────────────────── Date helpers (no local-time conversion) ───────────────────── */
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"] as const;

type YMD = { y: number; m: number; d: number; fromYMD: boolean };

const getYMD = (iso: string): YMD => {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso ?? "");
  if (m) return { y: Number(m[1]), m: Number(m[2]), d: Number(m[3]), fromYMD: true };
  const dt = new Date(iso);
  return { y: dt.getUTCFullYear(), m: dt.getUTCMonth() + 1, d: dt.getUTCDate(), fromYMD: false };
};

const isTodayNoTZ = (iso: string) => {
  const { y, m, d } = getYMD(iso);
  const now = new Date();
  return y === now.getFullYear() && m === now.getMonth() + 1 && d === now.getDate();
};

/* ───────────────────── Icon mapping (multi-pack) ───────────────────── */
type IconSpec = { pack: "ion" | "mdc"; name: string };

const getIconForCategory = (cat?: string): IconSpec => {
  const c = (cat ?? "").toLowerCase().trim();
  switch (c) {
    case "vent":
      return { pack: "ion", name: "megaphone-outline" };      // Ionicons
    case "deep-thoughts":
      return { pack: "mdc", name: "head-cog-outline" };       // MaterialCommunityIcons
    default:
      return { pack: "ion", name: "document-outline" };
  }
};

export default function TimelineMemories() {
  const [sections, setSections] = useState<JournalSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  // TODO: replace with real userId
  const userId = "99a99eea-d4dd-41b8-9ae3-efaec9f62a21";

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const s = await fetchJournalSections(userId);
        setSections(s);
        setErr(null);
      } catch (e: any) {
        setErr(e?.message ?? "Failed to load journals");
      } finally {
        setLoading(false);
      }
    })();
  }, [userId]);

  const renderItem = ({ item }: { item: JournalItem; section: SectionListData<JournalItem> }) => {
    const { m, d } = getYMD(item.date);
    const today = isTodayNoTZ(item.date);
    const { pack, name } = getIconForCategory(item.category);
    const IconCmp = pack === "ion" ? Ionicons : MaterialCommunityIcons;

    const onPress = () => {
      // Pass id (preferred). You can also pass the whole item to avoid re-fetching.
      navigation.navigate("JournalDetail", { item }); 
      // or: navigation.navigate("JournalDetail", { item: { id: item.id, title: item.title, date: item.date, category: item.category, summary: item.summary } });
    };

    return (
      <View style={styles.row}>
        {/* left rail */}
        <View style={styles.leftRail}>
          <View style={styles.lineTop} />
          <View style={[styles.dateChip, today && styles.todayChip]}>
            <Text style={[styles.chipTopText, today && styles.todayTopText]}>
              {today ? "Today" : MONTHS[m - 1]}
            </Text>
            <Text style={[styles.chipBottomText, today && styles.todayBottomText]}>
              {String(d).padStart(2, "0")}
            </Text>
          </View>
          <View style={styles.lineBottom} />
        </View>

        {/* card */}
        <Pressable style={styles.card} onPress={onPress}>
          <View style={styles.cardRow}>
            <View style={styles.iconWrap}>
              <IconCmp name={name as any} size={v(18)} color={colors.C3} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
              <Text style={styles.cardSub} numberOfLines={2} ellipsizeMode="tail">
                {item.summary || ""}
              </Text>
            </View>
          </View>
        </Pressable>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator />
      </View>
    );
  }
  if (err) {
    return (
      <View style={[styles.container, { padding: v(16) }]}>
        <Text style={{ color: "crimson" }}>Error: {err}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* top bar */}
      <View style={styles.topBar}>
        <Text style={styles.topTitle}>Journals</Text>
      </View>

      <SectionList
        sections={sections}
        keyExtractor={(it) => `${it.id}-${it.date}`}
        renderItem={renderItem}
        renderSectionHeader={({ section }) => (
          <Text style={styles.sectionHeader}>{section.title}</Text>
        )}
        contentContainerStyle={{ paddingBottom: vs(110) }}
        showsVerticalScrollIndicator={false}
      />

      <BottomNav active="journal" />
    </View>
  );
}

const CHIP_W = v(60);
const CHIP_H = vs(60);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF", paddingTop: vs(0) },

  topBar: {
    height: vs(50),
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.C1,
    justifyContent: "center",
    borderBottomLeftRadius: vs(99),
    borderBottomRightRadius: vs(99),
  },
  topTitle: {
    fontSize: v(20),
    fontWeight: "700",
    color: "#fff",
    opacity: 0.65,
    textAlign: "center",
  },

  sectionHeader: {
    paddingHorizontal: v(16),
    paddingTop: vs(18),
    paddingBottom: vs(8),
    fontSize: v(16),
    fontWeight: "800",
    color: colors.C3,
    backgroundColor: "white",
  },

  row: { flexDirection: "row", paddingHorizontal: v(16), marginBottom: vs(16) },

  leftRail: { width: CHIP_W, alignItems: "center" },
  lineTop: { width: v(2), flexGrow: 1, backgroundColor: "rgba(40,71,102,0.10)" },
  lineBottom: { width: v(2), flexGrow: 1, backgroundColor: "rgba(40,71,102,0.10)" },

  dateChip: {
    width: CHIP_W,
    height: CHIP_H,
    borderRadius: CHIP_W / 2,
    backgroundColor: "#D9D6AF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(40,71,102,0.15)",
  },
  chipTopText: { fontSize: v(12), fontWeight: "700", color: colors.C3 },
  chipBottomText: { fontSize: v(12), color: colors.C3, opacity: 0.9 },

  todayChip: { backgroundColor: "#FFFFFF", borderColor: "#82885D", borderWidth: v(2) },
  todayTopText: { color: "#82885D" },
  todayBottomText: { color: "#82885D", fontWeight: "700" },

  card: {
    flex: 1,
    marginLeft: v(12),
    backgroundColor: colors.C4,
    borderRadius: v(16),
    paddingVertical: v(15),
    paddingHorizontal: v(12),
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: v(8),
    shadowOffset: { width: 0, height: vs(4) },
    elevation: 3,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(130,136,93,0.20)",
  },
  cardRow: { flexDirection: "row", alignItems: "center", gap: v(10) },
  iconWrap: {
    width: v(34),
    height: v(34),
    borderRadius: v(10),
    backgroundColor: "#ffff",
    alignItems: "center",
    justifyContent: "center",
  },
  cardTitle: { fontSize: v(15), fontWeight: "700", color: colors.C3, marginBottom: vs(4), opacity: 0.9 },
  cardSub: { fontSize: v(12), color: "#4A5A67", lineHeight: vs(16) },
});
