import React, { useMemo, useState } from "react";
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { RouteProp, useRoute, useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { v, vs } from "../utils/size";
import { colors } from "../constants/colors";
import TranscriptTab from "../components/recordings/TranscriptionTab";
import SummaryTab from "../components/recordings/SummaryTab";
import TodoTab from "../components/recordings/ToDo";
import { RootStackParamList } from "../navigation/types";
type RecordingDetail = {
  id: string;
  title?: string;
  startedAt: string;
  durationSec: number;
  transcript: { ts: number; speaker?: string; text: string }[];
  summary: { bullets: string[]; sentiment?: "positive" | "neutral" | "negative"; keywords?: string[] };
  todos: { id: string; text: string; done?: boolean }[];
};

import s101 from "../assets/recordings/s_101.json";
import s100 from "../assets/recordings/s_100.json";
import s099 from "../assets/recordings/s_099.json";

const registry: Record<string, RecordingDetail> = {
  "s_101": s101 as RecordingDetail,
  "s_100": s100 as RecordingDetail,
  "s_099": s099 as RecordingDetail,
};


type ScreenRoute = RouteProp<RootStackParamList, "RecordingDetail">;

function fmtDate(iso: string) {
  const d = new Date(iso);
  const weekday = d.toLocaleDateString([], { weekday: "long" }).toUpperCase();
  const day = d.getDate();
  const mon = d.toLocaleDateString([], { month: "short" }).toUpperCase();
  return `${weekday}, ${day} ${mon}`;
}

function fmtDuration(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}m ${s}s`;
}

export default function RecordingDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute<ScreenRoute>();
  const recordingId = route.params?.id;
  const rec = recordingId ? registry[recordingId] : null;

  const [tab, setTab] = useState<"Transcript" | "Summary" | "ToDo">("Transcript");

  const Content = useMemo(() => {
    if (!rec) return () => <Text style={{ color: "#C00" }}>Recording not found.</Text>;
    switch (tab) {
      case "Transcript":
        return () => <TranscriptTab data={rec.transcript} />;
      case "Summary":
        return () => <SummaryTab bullets={rec.summary.bullets} sentiment={rec.summary.sentiment} keywords={rec.summary.keywords} />;
      case "ToDo":
        return () => <TodoTab items={rec.todos} />;
      default:
        return () => null;
    }
  }, [tab, rec]);

  if (!rec) {
    return (
      <View style={styles.container}>
        <View style={styles.topBar}>
          <Pressable 
            onPress={() => navigation.goBack()}
            style={styles.backButtonTop}
          >
            <Ionicons name="arrow-back" size={v(22)} color="#fff" />
          </Pressable>
          <Text style={styles.topTitle}>Recording</Text>
        </View>
        
        <View style={styles.emptyState}>
          <Ionicons name="alert-circle-outline" size={v(64)} color={colors.C1} style={{ opacity: 0.3 }} />
          <Text style={styles.emptyText}>Recording not found</Text>
          <Pressable 
            onPress={() => navigation.goBack()}
            style={styles.goBackButton}
          >
            <Text style={styles.goBackText}>Go Back</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Top Bar with Back Button */}
      <View style={styles.topBar}>
        <Pressable 
          onPress={() => navigation.goBack()}
          style={styles.backButtonTop}
        >
          <Ionicons name="arrow-back" size={v(22)} color={colors.C2} styles={{opacity:0.65}} />
        </Pressable>
        <Text style={styles.topTitle}>Recording</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: vs(24) }}
      >
        {/* Recording Header Card */}
        <View style={styles.headerCard}>
          
            
            <View style={{ flex: 1 }}>
              <Text style={styles.recordingTitle} numberOfLines={5}>
                {rec.title || "Untitled Recording"}
              </Text>
              <Text style={styles.recordingMeta}>
                {fmtDate(rec.startedAt)} · {fmtDuration(rec.durationSec)}
              </Text>
            </View>
          </View>
        

        {/* Category Pills */}
        <View style={styles.pillsContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.pillsScrollContent}
          >
            {(["Transcript", "Summary", "ToDo"] as const).map((k) => (
              <Pressable 
                key={k} 
                onPress={() => setTab(k)} 
                style={[styles.pill, tab === k && styles.pillActive]}
              >
                <Text style={[styles.pillText, tab === k && styles.pillTextActive]}>
                  {k === "ToDo" ? "To-Do's" : k}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        

        {/* Content Card */}
        <View style={styles.contentCard}>
          <Content />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#FFFFFF", 
    paddingTop: vs(0) 
  },

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
    //backgroundColor: "rgba(255,255,255,0.2)",
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
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: v(12),
  },
  iconWrap: {
    width: v(40),
    height: v(40),
    borderRadius: v(12),
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  recordingTitle: {
    fontSize: v(22),
    fontWeight: "700",
    color: colors.C3,
    opacity: 0.9,
    marginBottom: vs(4),
  },
  recordingMeta: {
    fontSize: v(12),
    color: "#4A5A67",
    fontWeight: "600",
  },

  pillsContainer: {
    paddingVertical: vs(8),
  },
  pillsScrollContent: {
    paddingHorizontal: v(16),
    gap: v(8),
  },
  pill: {
    paddingHorizontal: v(16),
    paddingVertical: vs(6),
    borderRadius: v(20),
    backgroundColor: colors.C4,
    borderWidth: v(1.5),
    borderColor: "rgba(130,136,93,0.20)",
  },
  pillActive: {
    backgroundColor: colors.C2,
    borderColor: colors.C2,
  },
  pillText: {
    fontSize: v(14),
    fontWeight: "600",
    color: colors.C3,
    opacity: 0.7,
  },
  pillTextActive: {
    color: "black",
    opacity: 0.7,
  },

  

  contentCard: {
    marginHorizontal: v(16),
    backgroundColor: colors.C4,
    borderRadius: v(16),
    padding: v(12),
    minHeight: vs(300),
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowRadius: v(8),
        shadowOffset: { width: 0, height: vs(4) },
      },
      android: {
        elevation: 3,
      },
    }),
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(130,136,93,0.20)",
  },

  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: v(24),
  },
  emptyText: {
    marginTop: vs(16),
    fontSize: v(16),
    color: colors.C3,
    opacity: 0.4,
    fontWeight: "600",
  },
  goBackButton: {
    marginTop: vs(24),
    paddingHorizontal: v(32),
    paddingVertical: vs(12),
    backgroundColor: colors.C1,
    borderRadius: v(20),
  },
  goBackText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: v(14),
  },
})