// src/screens/Home.tsx
import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Image, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { v, vs } from "../utils/size";
import { colors } from "../constants/colors";
import HomeOverviewCarouselJson from "../components/AutoCousel";
import RecordingsListJson from "../components/recordingList";
import BottomNav from "../components/NavigationBar";
import ProfileDrawer from "../components/profile";
import ActionItemsSection from "../components/ToDo";
import FloatingAddButton from "../components/floatinfpill"; // ✅ your floating button
import ActionItemsEntryCard from "../components/actionItemsEntryCard"; 
/* ------------------------------- helpers ------------------------------- */
function greetingByHour(h: number) {
  if (h >= 5 && h < 12) return "Good morning";
  if (h >= 12 && h < 18) return "Good afternoon";
  return "Good evening";
}

/* --------------------------------- Home -------------------------------- */
export default function Home() {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [entryOpen, setEntryOpen] = useState(false);       // ✅ NEW modal state
  const userId = "99a99eea-d4dd-41b8-9ae3-efaec9f62a21";  
  const handleAddPress = () => {
   setEntryOpen(true);
   };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.wrap}>
        {/* ========================== C1 Header =========================== */}
        <View style={styles.c1Container}>
          {/* top status row */}
          <View style={styles.topStatusRow}>
            <View style={styles.iconBtn}>
              <Ionicons name="notifications-outline" size={v(20)} color="#fff" />
            </View>
            <View style={styles.batteryPill}>
              <Text style={styles.batteryText}>82%</Text>
            </View>
          </View>

          {/* profile row */}
          <Pressable style={styles.profileRow} onPress={() => setDrawerVisible(true)}>
            <View style={styles.avatarRing}>
              <Image source={{ uri: "https://i.pravatar.cc/120?img=5" }} style={styles.avatar} />
            </View>

            <View style={{ flex: 1, marginLeft: v(12) }}>
              <Text style={styles.greetingLine} numberOfLines={1}>
                {greetingByHour(new Date().getHours())},{" "}
                <Text style={styles.nameText}>Sravya</Text>
              </Text>
            </View>
          </Pressable>
        </View>

        {/* ============================ Quote Card ============================ */}
        <View style={styles.quoteCard}>
          <Text style={styles.openQuote}>❝</Text>
          <Text style={styles.quoteText} numberOfLines={3}>
            The journey of a thousand miles begins with a single step. Embrace it.
          </Text>
        </View>

        {/* ============================== Content ============================= */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: vs(140) }} 
          style={{ marginTop: vs(30) }}
        >
          <View style={styles.afterQuote}>
            {/* Overview carousel */}
            <HomeOverviewCarouselJson />

            {/* Recordings list */}
            {/* <RecordingsListJson style={{ width: "100%", paddingHorizontal: v(16) }} /> */}

            {/* Action Items inline on Home */}
            <ActionItemsSection style={{ width: "100%", marginTop: vs(10) }} />
          </View>
        </ScrollView>

        {/* ========================= Floating Add ========================= */}
         <FloatingAddButton
          onPress={handleAddPress}
          bottom={vs(90)}
          right={v(20)}
          // keep above scroll + nav
          style={{ position: "absolute", zIndex: 20, elevation: 20 }}  // ✅ ensure on top
        />
    
      </View>

      {/* =========================== Bottom Nav ============================ */}
      <BottomNav active="home" />

      {/* ========================= Profile Drawer ========================== */}
      <ProfileDrawer
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        avatarUri="https://i.pravatar.cc/120?img=5"
      />
      {/* ===================== Action Item Entry Card ====================== */}
      <ActionItemsEntryCard
        visible={entryOpen}               // ✅ show/hide modal card
        userId={userId}                   // ✅ used to POST
        onClose={() => setEntryOpen(false)}
        onCreated={() => {
          // optional: trigger refresh of ActionItemsSection if needed
          // e.g., emit an event or lift state to refetch
        }}
      />
    </View>
  );
}

/* -------------------------------- styles ------------------------------- */
const styles = StyleSheet.create({
  wrap: {
    position: "relative",
    width: "100%",
    backgroundColor: "white",
    flex: 1,
  },
  c1Container: {
    height: vs(150),
    width: "100%",
    backgroundColor: colors.C1,
    borderBottomLeftRadius: v(75),
    borderBottomRightRadius: v(75),
    paddingTop: vs(18),
    paddingHorizontal: v(20),
  },
  topStatusRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: v(8),
    marginBottom: vs(-15),
    marginTop: vs(-10),
  },
  profileRow: {
    paddingTop: vs(5),
    flexDirection: "row",
    alignItems: "center",
  },
  avatarRing: {
    width: v(56),
    height: v(56),
    borderRadius: v(28),
    backgroundColor: "rgba(255,255,255,0.25)",
    alignItems: "center",
    justifyContent: "center",
    padding: v(2),
  },
  avatar: {
    width: v(46),
    height: v(46),
    borderRadius: v(23),
    borderWidth: v(2),
    borderColor: "#fff",
  },
  greetingLine: {
    fontSize: v(23),
    fontWeight: "500",
    color: "#fff",
    opacity: 0.65,
  },
  nameText: {
    fontSize: v(25),
    fontWeight: "700",
  },
  iconBtn: {
    width: v(28),
    height: v(28),
    borderRadius: v(14),
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(255,255,255,0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  batteryPill: {
    width: v(28),
    height: v(28),
    borderRadius: v(14),
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(255,255,255,0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  batteryText: {
    fontSize: v(10),
    fontWeight: "700",
    color: colors.C3,
  },
  quoteCard: {
    position: "absolute",
    top: vs(90),
    alignSelf: "center",
    width: v(333),
    minHeight: vs(80),
    backgroundColor: colors.C2,
    borderRadius: v(16),
    paddingHorizontal: v(20),
    paddingVertical: vs(14),
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: v(10),
    shadowOffset: { width: 0, height: vs(6) },
    elevation: 6,
  },
  openQuote: {
    position: "absolute",
    top: vs(-5),
    left: v(10),
    fontSize: v(40),
    fontWeight: "700",
    color: colors.C1,
    opacity: 0.25,
    lineHeight: v(50),
  },
  quoteText: {
    fontSize: v(15),
    lineHeight: vs(21),
    fontWeight: "600",
    color: colors.C1,
    textAlign: "center",
    marginTop: vs(6),
    marginBottom: vs(6),
    paddingHorizontal: v(8),
  },
  afterQuote: {
    marginTop: vs(25),
    alignItems: "center",
  },
});
