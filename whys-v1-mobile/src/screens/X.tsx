import React from "react";
import { View, Text, StyleSheet } from "react-native";
import CircleBadge from "../components/CircularPill";
import ChatBubble from "../components/ChatBubble";
import { Ionicons } from "@expo/vector-icons";

export default function TextToTextDemo() {
  return (
    <View style={styles.root}>
      {/* Header row */}
      <View style={styles.headerRow}>
        {/* thin outline circle (left icon) */}
        <View style={styles.hollowCircle}>
          <Ionicons name="reload" size={20} color="#6C4F2D" />
        </View>

        <Text style={styles.title}>Text to Text</Text>

        {/* "Ready" pill on the right */}
        <View style={styles.readyPill}>
          <Text style={styles.readyTxt}>Ready</Text>
        </View>
      </View>

      {/* Avatar + Bubble row */}
      <View style={styles.row}>
        <CircleBadge
          size={46}
          ringColor="#7AA35B"
          backgroundColor="#EEF5E9"
          source={{ uri: "https://i.imgur.com/0Z8F0lu.png" }} // replace with your asset
        />

        <View style={{ marginLeft: 10 }}>
          <ChatBubble
            text={"Hi, Jerry 😀👋 How’s your day?"}
            borderColor="#7AA35B"
            shadowColor="#7AA35B"
            radius={89}
            paddingH={15}
            paddingV={15}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#F4EFE8", // warm off-white like the mock
    paddingTop: 24,
    paddingHorizontal: 16,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  hollowCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 2,
    borderColor: "#6C4F2D", // brown outline as in the mock
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  title: {
    flex: 1,
    marginLeft: 10,
    fontSize: 22,
    fontWeight: "800",
    color: "#5A4326",
  },
  readyPill: {
    backgroundColor: "#7AA35B",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  readyTxt: { color: "#fff", fontWeight: "800" },

  row: { flexDirection: "row", alignItems: "center", marginTop: 10 },
});
