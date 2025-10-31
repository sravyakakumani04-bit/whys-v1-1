
// import React, { useMemo } from "react";
// import { FlatList, Pressable, StyleSheet, Text, View, ViewStyle, Platform } from "react-native";
// import { useNavigation } from "@react-navigation/native";
// import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
// import { v, vs } from "../utils/size";
// import { colors } from "../constants/colors";
// import recordings from "../assets/records.json";

// export type RecItem = { id: string; title?: string; startedAt: string; durationSec: number; };

// // Define your navigation stack types
// type RootStackParamList = {
//   Home: undefined;
//   Journal: undefined;
//   chat: undefined;
//   todos: undefined;
//   RecordingDetail: { id: string };
// };

// type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// type Props = {
//   items?: RecItem[];
//   maxItems?: number;
//   onItemPress?: (item: RecItem) => void;
//   style?: ViewStyle;
//   title?: string; // pass "" to hide
// };

// const fmtDur = (s: number) => `${Math.floor(s / 60)}m ${String(s % 60).padStart(2, "0")}s`;
// const fmtWhen = (iso: string) => {
//   const d = new Date(iso);
//   const t = d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
//   const m = d.toLocaleString([], { month: "short" });
//   return `${t} · ${m} ${d.getDate()}`;
// };

// export default function RecordingsListJson({
//   items, maxItems = 6, onItemPress, style, title = "Recordings",
// }: Props) {
//   const navigation = useNavigation<NavigationProp>();

//   const data = useMemo(() => {
//     const src = (items ?? (recordings as RecItem[])).slice();
//     src.sort((a, b) => +new Date(b.startedAt) - +new Date(a.startedAt));
//     return src.slice(0, maxItems);
//   }, [items, maxItems]);

//   const renderItem = ({ item }: { item: RecItem }) => (
//     <Pressable
//       onPress={() => 
//         onItemPress 
//           ? onItemPress(item) 
//           : navigation.navigate("RecordingDetail", { id: item.id })
//       }
//       style={s.row}
//     >
//       <View style={{ flex: 1 }}>
//         <Text numberOfLines={1} style={s.title}>{item.title || "Untitled"}</Text>
//         <Text numberOfLines={2} style={s.meta}>{fmtWhen(item.startedAt)}</Text>
//       </View>
//       <Text style={s.dur}>{fmtDur(item.durationSec)}</Text>
//     </Pressable>
//   );

//   return (
//     <View style={style}>
//       {title !== "" && <Text style={s.header}>{title}</Text>}
//       {data.length ? (
//         <FlatList
//           data={data}
//           keyExtractor={(it) => it.id}
//           renderItem={renderItem}
//           scrollEnabled={false}
//           nestedScrollEnabled={true}
//           ItemSeparatorComponent={() => <View style={{ height: vs(8) }} />}
//           contentContainerStyle={{ paddingTop: vs(20) }}
//         />
//       ) : (
//         <View style={s.empty}><Text style={s.emptyText}>No recordings yet</Text></View>
//       )}
//     </View>
//   );
// }

// const s = StyleSheet.create({
//   header: { width: "100%", marginTop: vs(16), marginBottom: vs(4), fontSize: v(18), fontWeight: "800", color: colors.C3, paddingLeft: v(7) },
//   row: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingHorizontal: v(12),
//     paddingVertical: vs(15),
//     backgroundColor: colors.C4,
//     borderRadius: v(16),
//     borderWidth: StyleSheet.hairlineWidth,
//     borderColor: "rgba(130,136,93,0.20)",
//     ...Platform.select({
//       ios: {
//         shadowColor: "#000",
//         shadowOpacity: 0.08,
//         shadowRadius: v(6),
//         shadowOffset: { width: 0, height: vs(3) },
//       },
//     }),
//   },
//   title: { fontSize: v(15), fontWeight: "700", color: colors.C3, opacity: 0.9 },
//   meta: { marginTop: vs(4), fontSize: v(12), color: "#4A5A67" },
//   dur: { marginLeft: v(12), fontSize: v(13), fontWeight: "700", color: colors.C1 },
//   empty: { paddingVertical: vs(24), alignItems: "center" },
//   emptyText: { fontSize: v(14), color: "#55626E" },
// });
import React, { useMemo } from "react";
import {
  SectionList,
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewStyle,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { v, vs } from "../utils/size";
import { colors } from "../constants/colors";
import recordings from "../assets/records.json";

export type RecItem = { id: string; title?: string; startedAt: string; durationSec: number };

// Define your navigation stack types
type RootStackParamList = {
  Home: undefined;
  Journal: undefined;
  chat: undefined;
  todos: undefined;
  RecordingDetail: { id: string };
};
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

type Props = {
  items?: RecItem[];
  maxItems?: number; // total cap across all sections (kept for compatibility)
  onItemPress?: (item: RecItem) => void;
  style?: ViewStyle;
  title?: string; // pass "" to hide
};

const fmtDur = (s: number) => `${Math.floor(s / 60)}m ${String(s % 60).padStart(2, "0")}s`;
const fmtWhen = (iso: string) => {
  const d = new Date(iso);
  const t = d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  const m = d.toLocaleString([], { month: "short" });
  return `${t} · ${m} ${d.getDate()}`;
};

// "October 2025"
const monthLabel = (iso: string) => {
  const d = new Date(iso);
  const month = d.toLocaleString([], { month: "short" });
  const m3 = month.replace(".", "").slice(0, 3); // "Sep"
  const yy = String(d.getFullYear() % 100).padStart(2, "0");
  //return `${m3} ${yy}`;
  return `${month} ${d.getFullYear()}`;
};

type SectionT = { title: string; data: RecItem[] };

export default function RecordingsListJson({
  items,
  maxItems = 1000,
  onItemPress,
  style,
  title = "Recordings",
}: Props) {
  const navigation = useNavigation<NavigationProp>();

  const sections = useMemo<SectionT[]>(() => {
    const src = (items ?? (recordings as RecItem[])).slice();
    // newest → oldest
    src.sort((a, b) => +new Date(b.startedAt) - +new Date(a.startedAt));

    // apply total cap if provided
    const capped = src.slice(0, maxItems);

    // group by Month YYYY
    const map = new Map<string, RecItem[]>();
    for (const r of capped) {
      const key = monthLabel(r.startedAt);
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(r);
    }

    // keep section order based on first appearance in sorted list
    return Array.from(map.entries()).map(([title, data]) => ({ title, data }));
  }, [items, maxItems]);

  const renderItem = ({ item }: { item: RecItem }) => (
    <Pressable
      onPress={() =>
        onItemPress ? onItemPress(item) : navigation.navigate("RecordingDetail", { id: item.id })
      }
      style={s.row}
    >
      <View style={{ flex: 1 }}>
        <Text numberOfLines={1} style={s.title}>{item.title || "Untitled"}</Text>
        <Text numberOfLines={2} style={s.meta}>{fmtWhen(item.startedAt)}</Text>
      </View>
      <Text style={s.dur}>{fmtDur(item.durationSec)}</Text>
    </Pressable>
  );

  const renderSectionHeader = ({ section }: { section: SectionT }) => (
    <View style={s.sectionHeader}>
       <Text style={s.headerTitle}>{section.title}</Text>
    </View>
  );

  return (
    <View style={style}>
      {title !== "" && <Text style={s.header}>{title}</Text>}

      {sections.length ? (
        <SectionList
          sections={sections}
          keyExtractor={(it) => it.id}
          renderItem={renderItem}
          renderSectionHeader={renderSectionHeader}
          stickySectionHeadersEnabled={true}
          scrollEnabled={true}            // embed-friendly (like your previous FlatList)
          nestedScrollEnabled={true}
          SectionSeparatorComponent={() => <View style={{ height: vs(8) }} />}
          ItemSeparatorComponent={() => <View style={{ height: vs(8) }} />}
          contentContainerStyle={{ paddingTop: vs(12) }}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={s.empty}>
          <Text style={s.emptyText}>No recordings yet</Text>
        </View>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  header: {
    width: "100%",
    marginTop: vs(16),
    marginBottom: vs(0),
    fontSize: v(18),
    fontWeight: "800",
    color: colors.C3,
    paddingLeft: v(7),
    
  },
  sectionHeader: {
    paddingTop: vs(10),
    paddingBottom: vs(8),
    backgroundColor:"white",
    
  },

  headerTitle:{
    fontSize: v(14),
    fontWeight: "800",
    color: colors.C3,
    opacity:0.9,
    
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: v(12),
    paddingVertical: vs(15),
    backgroundColor: colors.C4,
    borderRadius: v(16),
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(130,136,93,0.20)",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: v(6),
        shadowOffset: { width: 0, height: vs(3) },
      },
    }),
  },
  title: { fontSize: v(15), fontWeight: "700", color: colors.C3, opacity: 0.9 },
  meta: { marginTop: vs(4), fontSize: v(12), color: "#4A5A67" },
  dur: { marginLeft: v(12), fontSize: v(13), fontWeight: "700", color: colors.C1 },
  empty: { paddingVertical: vs(24), alignItems: "center" },
  emptyText: { fontSize: v(14), color: "#55626E" },
});
