// // src/screens/JournalDetailScreen.tsx
// import React from "react";
// import { View, Text, StyleSheet, Pressable, ScrollView, Platform } from "react-native";
// import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
// import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
// import { v, vs } from "../utils/size";
// import { colors } from "../constants/colors";
// import type { RootStackParamList } from "../navigation/types";

// /* ───────── Date helpers (no local-time conversion) ───────── */
// const MONTHS_FULL = ["January","February","March","April","May","June","July","August","September","October","November","December"] as const;
// const getYMD = (iso: string) => {
//   const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso ?? "");
//   if (m) return { y: +m[1], m: +m[2], d: +m[3] };           // YYYY-MM-DD stays as-is
//   const dt = new Date(iso);                                  // full ISO -> UTC parts
//   return { y: dt.getUTCFullYear(), m: dt.getUTCMonth() + 1, d: dt.getUTCDate() };
// };
// const fmtYMD = (iso: string) => {
//   const { y, m, d } = getYMD(iso);
//   return `${MONTHS_FULL[m - 1]} ${d}, ${y}`;
// };

// /* icon chooser */
// const getIconForCategory = (cat?: string) => {
//   const c = (cat ?? "").toLowerCase().trim();
//   switch (c) {
//     case "vent":          return { pack: "ion" as const, name: "megaphone-outline" as const };
//     case "deep-thoughts": return { pack: "mdc" as const, name: "head-cog-outline" as const };
//     default:              return { pack: "ion" as const, name: "document-outline" as const };
//   }
// };

// type ScreenRoute = RouteProp<RootStackParamList, "JournalDetail">;

// export default function JournalDetailScreen() {
//   const navigation = useNavigation();
//   const { params } = useRoute<ScreenRoute>();
//   const { item } = params;   // <-- already have all fields from sections

//   const icon = getIconForCategory(item.category);
//   const IconCmp = icon.pack === "ion" ? Ionicons : MaterialCommunityIcons;

//   return (
//     <View style={styles.container}>
//       {/* Top Bar */}
//       <View style={styles.topBar}>
//         <Pressable onPress={() => navigation.goBack()} style={styles.backButtonTop}>
          
//           <Ionicons name="arrow-back" size={v(22)} color={colors.C2} styles={{opacity:0.65}} />
//         </Pressable>
//         <Text style={styles.topTitle}>Journal</Text>
//       </View>

//       <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: vs(24) }}>
//         {/* Header (icon + title + date) */}
//         <View style={styles.headerCard}>
//           <View style={styles.headerRow}>
            
//             <View style={{ flex: 1 }}>
//               <Text style={styles.journalTitle} numberOfLines={5}>
//                 {item.title || "Untitled Journal"}
//               </Text>
//               <Text style={styles.journalMeta}>{fmtYMD(item.date)}</Text>
//             </View>
//           </View>
//         </View>

//         {/* Summary only */}
//         <View style={styles.contentCard}>
//           <Text style={styles.sectionLabel}>Summary</Text>
//           <Text style={styles.summaryText}>
//             {item.summary || "(No summary provided)"}
//           </Text>
//         </View>
//       </ScrollView>
//     </View>
//   );
// }

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
//     position: "relative",
//   },
//   backButtonTop: {
//     position: "absolute",
//     left: v(16),
//     width: v(28),
//     height: v(28),
//     borderRadius: v(16),
//     alignItems: "center",
//     justifyContent: "center",
     
//   },
//   topTitle: { fontSize: v(20), fontWeight: "700", color: "#fff", opacity: 0.65, textAlign: "center" },

//   headerCard: { marginHorizontal: v(8), marginTop: vs(20), borderRadius: v(16), padding: v(14) },
//   headerRow: { flexDirection: "row", alignItems: "center", gap: v(12) },
//   iconWrap: {
//     width: v(40),
//     height: v(40),
//     borderRadius: v(12),
//     backgroundColor: "#fff",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   journalTitle: { fontSize: v(22), fontWeight: "700", color: colors.C3, opacity: 0.9, marginBottom: vs(4) },
//   journalMeta: { fontSize: v(12), color: "#4A5A67", fontWeight: "600" },

//   contentCard: {
//     marginHorizontal: v(16),
//     backgroundColor: colors.C4,
//     borderRadius: v(16),
//     padding: v(12),
//     minHeight: vs(120),
//     ...Platform.select({
//       ios: { shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: v(8), shadowOffset: { width: 0, height: vs(4) } },
//       android: { elevation: 3 },
//     }),
//     borderWidth: StyleSheet.hairlineWidth,
//     borderColor: "rgba(130,136,93,0.20)",
//   },
//   sectionLabel: { fontSize: v(12), fontWeight: "800", color: colors.C3, opacity: 0.6, marginBottom: vs(8) },
//   summaryText: { fontSize: v(14), color: colors.C3, opacity: 0.9, lineHeight: vs(18) },
// });



// src/screens/JournalDetailScreen.tsx
import React from "react";
import { View, Text, StyleSheet, Pressable, ScrollView, Platform } from "react-native";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { v, vs } from "../utils/size";
import { colors } from "../constants/colors";
import type { RootStackParamList } from "../navigation/types";

/* ───────── Date helpers (no local-time conversion) ───────── */
const MONTHS_FULL = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
] as const;

const getYMD = (iso: string) => {
  // If plain "YYYY-MM-DD", keep as-is; otherwise read UTC parts from full ISO.
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso ?? "");
  if (m) return { y: +m[1], m: +m[2], d: +m[3] };
  const dt = new Date(iso);
  return { y: dt.getUTCFullYear(), m: dt.getUTCMonth() + 1, d: dt.getUTCDate() };
};

// DAY (caps) in front of month, locked to UTC to avoid local time drift.
// Example: "MONDAY, NOV 2, 2024"
const fmtYMD = (iso: string) => {
  const { y, m, d } = getYMD(iso);
  const utc = new Date(Date.UTC(y, m - 1, d));
  const weekday = utc.toLocaleDateString("en-US", { weekday: "long", timeZone: "UTC" }).toUpperCase();
  const mon = utc.toLocaleDateString("en-US", { month: "short", timeZone: "UTC" }).toUpperCase();
  return `${weekday}, ${mon} ${d}, ${y}`;
};

/* icon chooser (optional) */
const getIconForCategory = (cat?: string) => {
  const c = (cat ?? "").toLowerCase().trim();
  switch (c) {
    case "vent":          return { pack: "ion" as const, name: "megaphone-outline" as const };
    case "deep-thoughts": return { pack: "mdc" as const, name: "head-cog-outline" as const };
    default:              return { pack: "ion" as const, name: "document-outline" as const };
  }
};

type ScreenRoute = RouteProp<RootStackParamList, "JournalDetail">;

export default function JournalDetailScreen() {
  const navigation = useNavigation();
  const { params } = useRoute<ScreenRoute>();
  const { item } = params; // { id, date, title, summary, category }

  const icon = getIconForCategory(item.category);
  const IconCmp = icon.pack === "ion" ? Ionicons : MaterialCommunityIcons;

  return (
    <View style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButtonTop}>
          <Ionicons name="arrow-back" size={v(22)} color={colors.C2} style={{ opacity: 0.65 }} />
        </Pressable>
        <Text style={styles.topTitle}>Journal</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: vs(24) }}>
        {/* Header (icon + title + date) */}
        <View style={styles.headerCard}>
          <View style={styles.headerRow}>
            
            <View style={{ flex: 1 }}>
              <Text style={styles.journalTitle} numberOfLines={5}>
                {item.title || "Untitled Journal"}
              </Text>
              <Text style={styles.journalMeta}>{fmtYMD(item.date)}</Text>
            </View>
          </View>
        </View>

        {/* Summary */}
        <View style={styles.contentCard}>
          <Text style={styles.sectionLabel}>Summary</Text>
          <Text style={styles.summaryText}>
            {item.summary || "(No summary provided)"}
          </Text>
        </View>

        {/* Transcript (placeholder) */}
        <View style={[styles.contentCard, { marginTop: vs(12) }]}>
          <Text style={styles.sectionLabel}>Transcript</Text>
          
            
            <Text style={styles.placeholderText}>
              Transcript will appear here.
            </Text>
          </View>
      
      </ScrollView>
    </View>
  );
}

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
    position: "relative",
  },
  backButtonTop: {
    position: "absolute",
    left: v(16),
    width: v(28),
    height: v(28),
    borderRadius: v(16),
    alignItems: "center",
    justifyContent: "center",
  },
  topTitle: {
    fontSize: v(20),
    fontWeight: "700",
    color: "#fff",
    opacity: 0.65,
    textAlign: "center",
  },

  headerCard: {
    marginHorizontal: v(8),
    marginTop: vs(20),
    borderRadius: v(16),
    padding: v(14),
  },
  headerRow: { flexDirection: "row", alignItems: "center", gap: v(12) },
  iconWrap: {
    width: v(40),
    height: v(40),
    borderRadius: v(12),
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  journalTitle: {
    fontSize: v(22),
    fontWeight: "700",
    color: colors.C3,
    opacity: 0.9,
    marginBottom: vs(4),
  },
  journalMeta: { fontSize: v(12), color: "#4A5A67", fontWeight: "600" },

  contentCard: {
    marginHorizontal: v(16),
    backgroundColor: colors.C4,
    borderRadius: v(16),
    padding: v(12),
    minHeight: vs(120),
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: v(8), shadowOffset: { width: 0, height: vs(4) } },
      android: { elevation: 3 },
    }),
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(130,136,93,0.20)",
  },
  sectionLabel: { fontSize: v(12), fontWeight: "800", color: colors.C3, opacity: 0.6, marginBottom: vs(8) },
  summaryText: { fontSize: v(14), color: colors.C3, opacity: 0.9, lineHeight: vs(18) },

  /* Placeholder styles */
  placeholderBox: {
    paddingVertical: vs(12),
    paddingHorizontal: v(10),
    borderRadius: v(12),
    backgroundColor: "#fff",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(40,71,102,0.12)",
    flexDirection: "row",
    alignItems: "center",
    gap: v(8),
  },
  placeholderText: {
    fontSize: v(13),
    color: colors.C3,
    opacity: 0.55,
    fontWeight: "600",
  },
});

