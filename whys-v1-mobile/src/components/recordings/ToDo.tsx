// import React from "react";
// import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
// import { v, vs } from "../../utils/size";
// import { colors } from "../../constants/colors";


// type TodoItem = {
// id: string;
// text: string;
// done?: boolean;
// };


// type Props = {
// items: TodoItem[];
// onToggle?: (id: string) => void; // UI-only toggle; lift state if needed
// };


// export default function TodoTab({ items, onToggle }: Props) {
// return (
// <FlatList
// data={items}
// keyExtractor={(it) => it.id}
// ItemSeparatorComponent={() => <View style={{ height: vs(8) }} />}
// renderItem={({ item }) => (
// <Pressable onPress={() => onToggle?.(item.id)} style={[s.row, item.done && { opacity: 0.6 }]}
// >
// <View style={[s.check, item.done && s.checkOn]} />
// <Text style={[s.text, item.done && { textDecorationLine: "line-through" }]}>{item.text}</Text>
// </Pressable>
// )}
// />
// );
// }


// const s = StyleSheet.create({
// row: {
// flexDirection: "row",
// alignItems: "center",
// gap: v(10),
// backgroundColor: "#FFF",
// borderRadius: v(14),
// paddingHorizontal: v(12),
// paddingVertical: vs(12),
// borderWidth: StyleSheet.hairlineWidth,
// borderColor: "rgba(40,71,102,0.10)",
// },
// check: {
// width: v(18),
// height: v(18),
// borderRadius: v(6),
// borderWidth: 2,
// borderColor: colors.C1,
// backgroundColor: "transparent",
// },
// checkOn: { backgroundColor: colors.C1 },
// text: { flex: 1, fontSize: v(14), color: "#1E2B33" },
// });
import React from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { v, vs } from "../../utils/size";
import { colors } from "../../constants/colors";

type TodoItem = {
  id: string;
  text: string;
  done?: boolean;
};

type Props = {
  items: TodoItem[];
  onToggle?: (id: string) => void;
};

export default function TodoTab({ items, onToggle }: Props) {
  return (
    <FlatList
      data={items}
      keyExtractor={(it) => it.id}
      ItemSeparatorComponent={() => <View style={{ height: vs(8) }} />}
      renderItem={({ item }) => (
        <Pressable 
          onPress={() => onToggle?.(item.id)} 
          style={[s.row, item.done && { opacity: 0.6 }]}
        >
          <View style={[s.check, item.done && s.checkOn]} />
          <Text style={[s.text, item.done && { textDecorationLine: "line-through" }]}>
            {item.text}
          </Text>
        </Pressable>
      )}
      scrollEnabled={false}
      nestedScrollEnabled={true}
    />
  );
}

const s = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: v(10),
    backgroundColor: "#FFF",
    borderRadius: v(14),
    paddingHorizontal: v(12),
    paddingVertical: vs(12),
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(40,71,102,0.10)",
  },
  check: {
    width: v(18),
    height: v(18),
    borderRadius: v(6),
    borderWidth: 2,
    borderColor: colors.C1,
    backgroundColor: "transparent",
  },
  checkOn: { backgroundColor: colors.C1 },
  text: { flex: 1, fontSize: v(14), color: "#1E2B33" },
});