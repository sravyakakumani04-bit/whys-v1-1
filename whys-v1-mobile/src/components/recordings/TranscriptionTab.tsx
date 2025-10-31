

import React, { useMemo } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { v, vs } from "../../utils/size";
import { colors } from "../../constants/colors";

type TranscriptLine = {
  ts: number;
  speaker?: string;
  text: string;
};

type Props = { data: TranscriptLine[] };

const fmtTs = (s: number) => {
  const m = Math.floor(s / 60);
  const ss = Math.floor(s % 60);
  return `${m}:${String(ss).padStart(2, "0")}`;
};

export default function TranscriptTab({ data }: Props) {
  const items = useMemo(() => data ?? [], [data]);

  return (
    <FlatList
      data={items}
      keyExtractor={(_, i) => String(i)}
      contentContainerStyle={s.list}
      ItemSeparatorComponent={() => <View style={{ height: vs(10) }} />}
      renderItem={({ item }) => (
        <View style={s.item}>
          {/* top row: name (left) + time (right) */}
          <View style={s.topRow}>
            <Text style={s.name} numberOfLines={1}>
              {item.speaker || "Speaker"}
            </Text>
            <Text style={s.time}>{fmtTs(item.ts)}</Text>
          </View>

          {/* transcript text */}
          <Text style={s.text}>{item.text}</Text>
        </View>
      )}
      nestedScrollEnabled
      scrollEnabled={false}
    />
  );
}

const s = StyleSheet.create({
  list: { paddingVertical: vs(8), paddingHorizontal: v(12) },

  item: {
    // no background, no border — just spacing
    paddingVertical: vs(4),
  },

  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: vs(2),
  },

  name: {
    fontSize: v(13),
    fontWeight: "700",
    color: colors.C3 ?? "#284766",
    maxWidth: "75%",
  },

  time: {
    fontSize: v(11),
    opacity: 0.6,
  },

  text: {
    fontSize: v(14),
    lineHeight: vs(20),
    color: "#1E2B33",
  },
});
