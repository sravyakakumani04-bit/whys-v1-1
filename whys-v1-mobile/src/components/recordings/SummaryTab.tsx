// import React from "react";
// import { StyleSheet, Text, View } from "react-native";
// import { v, vs } from "../../utils/size";
// import { colors } from "../../constants/colors";


// type Props = {
// bullets: string[];
// sentiment?: "positive" | "neutral" | "negative";
// keywords?: string[];
// };


// export default function SummaryTab({ bullets, sentiment, keywords }: Props) {
// return (
// <View style={{ gap: vs(12) }}>
// <View style={s.card}>
// <Text style={s.h}>Highlights</Text>
// {bullets.map((b, i) => (
// <View key={i} style={{ flexDirection: "row", gap: v(8), marginTop: vs(6) }}>
// <View style={s.dot} />
// <Text style={s.body}>{b}</Text>
// </View>
// ))}
// </View>


// {(sentiment || (keywords && keywords.length)) && (
// <View style={[s.card, { flexDirection: "row", justifyContent: "space-between", alignItems: "center" }]}>
// {sentiment && <Text style={s.kv}>Sentiment: <Text style={{ fontWeight: "800" }}>{sentiment}</Text></Text>}
// {keywords && keywords.length ? (
// <Text style={s.kv}>Keywords: <Text style={{ fontWeight: "800" }}>{keywords.join(", ")}</Text></Text>
// ) : null}
// </View>
// )}
// </View>
// );
// }


// const s = StyleSheet.create({
// card: {
// backgroundColor: "#FFF",
// borderRadius: v(16),
// padding: v(14),
// borderWidth: StyleSheet.hairlineWidth,
// borderColor: "rgba(40,71,102,0.10)",
// },
// h: { fontSize: v(16), fontWeight: "800", color: colors.C3 },
// dot: { width: v(6), height: v(6), borderRadius: v(3), backgroundColor: colors.C1, marginTop: vs(8) },
// body: { flex: 1, fontSize: v(14), color: "#1E2B33" },
// kv: { fontSize: v(13), color: colors.C3 },
// });

import React, { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { v, vs } from "../../utils/size";
import { colors } from "../../constants/colors";

type Props = {
  bullets: string[];
  sentiment?: "positive" | "neutral" | "negative";
  keywords?: string[];
};

export default function SummaryTab({ bullets, sentiment, keywords }: Props) {
  const paragraph = useMemo(
    () => (bullets ?? []).filter(Boolean).join(" "),
    [bullets]
  );

  return (
    <View style={s.wrap}>
      <Text style={s.p}>{paragraph}</Text>

     
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { gap: vs(6) },
  p: {
    fontSize: v(14),
    lineHeight: vs(22),
    color: "#1E2B33",
  },
 
});
