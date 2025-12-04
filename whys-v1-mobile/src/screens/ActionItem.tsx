// // src/screens/ActionItemsScreen.tsx
// import React, { useEffect, useMemo, useRef, useState, forwardRef, useImperativeHandle } from "react";
// import { View, Text, StyleSheet, ScrollView, Pressable, Animated } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import { v, vs } from "../utils/size";
// import { colors } from "../constants/colors";
// import BottomNav from "../components/NavigationBar";
// import actionItemsData from "../assets/actionitems.json";
// import {
//   CheckboxAnimVals,
//   createCheckboxAnimVals,
//   runCompleteAnim,
//   runUncheckAnim,
//   syncToChecked,
// } from "../utils/todo_ani";

// type ActionItem = {
//   id: string;
//   title: string;
//   category: string;
//   completed: boolean;
// };

// const CHIP_SIZE = v(28);

// /* Animated Checkbox (logic calls external anim fns) */
// export type AnimatedCheckboxRef = { playComplete: () => void; playUncheck: () => void };

// const AnimatedCheckbox = forwardRef(function AnimatedCheckbox(
//   {
//     checked,
//     size,
//     onToggleAfterAnim,
//   }: {
//     checked: boolean;
//     size: number;
//     onToggleAfterAnim: () => void;
//   },
//   ref: React.Ref<AnimatedCheckboxRef>
// ) {
//   // animation values are created once and synced to prop
//   const vals = useRef<CheckboxAnimVals>(createCheckboxAnimVals(checked)).current;

//   useEffect(() => {
//     syncToChecked(vals, checked);
//   }, [checked, vals]);

//   const handlePress = () => {
//     if (!checked) runCompleteAnim(vals, onToggleAfterAnim);
//     else runUncheckAnim(vals, onToggleAfterAnim);
//   };

//   // expose methods so card tap can trigger the same animation
//   useImperativeHandle(ref, () => ({
//     playComplete: () => runCompleteAnim(vals, onToggleAfterAnim),
//     playUncheck: () => runUncheckAnim(vals, onToggleAfterAnim),
//   }));

//   const radius = size / 2;

//   return (
//     <Animated.View
//       style={{
//         width: size,
//         height: size,
//         alignItems: "center",
//         justifyContent: "center",
//         transform: [{ scale: vals.boxScale }],
//       }}
//     >
//       {/* pulse ring */}
//       <Animated.View
//         pointerEvents="none"
//         style={{
//           position: "absolute",
//           width: size,
//           height: size,
//           borderRadius: radius,
//           backgroundColor: colors.C1,
//           opacity: vals.ringOpacity,
//           transform: [{ scale: vals.ringScale }],
//         }}
//       />

//       {/* press target base */}
//       <Pressable
//         onPress={handlePress}
//         style={{
//           width: size,
//           height: size,
//           borderRadius: radius,
//           backgroundColor: "#FFFFFF",
//           alignItems: "center",
//           justifyContent: "center",
//           borderWidth: v(2),
//           borderColor: "rgba(130,136,93,0.30)",
//           overflow: "hidden",
//         }}
//       >
//         {/* C1 fill */}
//         <Animated.View
//           pointerEvents="none"
//           style={{
//             position: "absolute",
//             width: size,
//             height: size,
//             borderRadius: radius,
//             backgroundColor: colors.C1,
//             transform: [{ scale: vals.fillScale }],
//           }}
//         />
//         {/* white tick */}
//         <Animated.View
//           pointerEvents="none"
//           style={{
//             opacity: vals.checkOpacity,
//             transform: [{ scale: vals.checkScale }],
//           }}
//         >
//           <Ionicons name="checkmark" size={v(18)} color="#fff" />
//         </Animated.View>
//       </Pressable>
//     </Animated.View>
//   );
// });

// /* Screen */
// export default function ActionItemsScreen() {
//   const [selectedCategory, setSelectedCategory] = useState<string>("All");
//   const [items, setItems] = useState<ActionItem[]>(actionItemsData);

//   const toggleComplete = (id: string) => {
//     setItems(prev =>
//       prev.map(item => (item.id === id ? { ...item, completed: !item.completed } : item))
//     );
//   };

//   const categories = useMemo(() => ["All", "Work", "Personal", "School"], []);

//   const filteredItems =
//     selectedCategory === "All"
//       ? items
//       : items.filter(item => item.category === selectedCategory);

//   const activeItems = filteredItems.filter(item => !item.completed);
//   const completedItems = filteredItems.filter(item => item.completed);

//   const renderItem = (item: ActionItem) => {
//     // ref so card tap can also trigger the same animation before toggle
//     const cbRef = React.createRef<AnimatedCheckboxRef>();

//     return (
//       <View key={item.id} style={styles.row}>
//         {/* left rail with checkbox */}
//         <View style={styles.leftRail}>
//           <View style={styles.lineTop} />
//           <AnimatedCheckbox
//             ref={cbRef}
//             checked={item.completed}
//             size={CHIP_SIZE}
//             onToggleAfterAnim={() => toggleComplete(item.id)}
//           />
//           <View style={styles.lineBottom} />
//         </View>

//         {/* card */}
//         <Pressable
//           style={[styles.card, item.completed && styles.cardCompleted]}
//           onPress={() => {
//             if (!item.completed) {
//               // play the same satisfying animation as the circle
//               cbRef.current?.playComplete();
//             } else {
//               cbRef.current?.playUncheck();
//             }
//           }}
//         >
//           <View style={styles.cardRow}>
//             <View style={{ flex: 1 }}>
//               <Text
//                 style={[styles.cardTitle, item.completed && styles.cardTitleCompleted]}
//                 numberOfLines={2}
//               >
//                 {item.title}
//               </Text>
//             </View>
//           </View>
//         </Pressable>
//       </View>
//     );
//   };

//   return (
//     <View style={styles.container}>
//       {/* top bar */}
//       <View style={styles.topBar}>
//         <Text style={styles.topTitle}>Action Items</Text>
//       </View>

//       {/* Category Pills */}
//       <View style={styles.categoryContainer}>
//         <ScrollView
//           horizontal
//           showsHorizontalScrollIndicator={false}
//           contentContainerStyle={styles.categoryScrollContent}
//         >
//           {categories.map((category) => (
//             <Pressable
//               key={category}
//               style={[
//                 styles.categoryPill,
//                 selectedCategory === category && styles.categoryPillActive,
//               ]}
//               onPress={() => setSelectedCategory(category)}
//             >
//               <Text
//                 style={[
//                   styles.categoryPillText,
//                   selectedCategory === category && styles.categoryPillTextActive,
//                 ]}
//               >
//                 {category}
//               </Text>
//             </Pressable>
//           ))}
//         </ScrollView>
//       </View>

//       <ScrollView
//         contentContainerStyle={{ paddingBottom: vs(110) }}
//         showsVerticalScrollIndicator={false}
//       >
//         {activeItems.length > 0 && (
//           <View>
//             <Text style={styles.sectionHeader}>To Do ({activeItems.length})</Text>
//             {activeItems.map(renderItem)}
//           </View>
//         )}

//         {completedItems.length > 0 && (
//           <View>
//             <Text style={styles.sectionHeader}>Completed ({completedItems.length})</Text>
//             {completedItems.map(renderItem)}
//           </View>
//         )}

//         {filteredItems.length === 0 && (
//           <View style={styles.emptyState}>
//             <Ionicons name="checkmark-circle-outline" size={v(64)} color={colors.C1} style={{ opacity: 0.3 }} />
//             <Text style={styles.emptyText}>No items in this category</Text>
//           </View>
//         )}
//       </ScrollView>

//       {/* Add button */}
//       <Pressable style={styles.addButton}>
//         <Ionicons name="add" size={v(28)} color="#fff" />
//       </Pressable>

//       {/* Bottom Navigation */}
//       <BottomNav active="todos" />
//     </View>
//   );
// }

// /* Styles (same as before) */
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

//   categoryContainer: { paddingVertical: vs(12), backgroundColor: "#fff" },
//   categoryScrollContent: { paddingHorizontal: v(16), gap: v(8) },

//   categoryPill: {
//     paddingHorizontal: v(20),
//     paddingVertical: vs(8),
//     borderRadius: v(20),
//     backgroundColor: colors.C4,
//     borderWidth: v(1.5),
//     borderColor: "rgba(130,136,93,0.20)",
//   },
//   categoryPillActive: { backgroundColor: colors.C2, borderColor: colors.C2 },
//   categoryPillText: { fontSize: v(14), fontWeight: "600", color: colors.C3, opacity: 0.7 },
//   categoryPillTextActive: { color: "black", opacity: 0.7 },

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

//   leftRail: { width: CHIP_SIZE, alignItems: "center" },
//   lineTop: { width: v(0), flexGrow: 1, backgroundColor: "rgba(40,71,102,0.10)" },
//   lineBottom: { width: v(0), flexGrow: 1, backgroundColor: "rgba(40,71,102,0.10)" },

//   checkbox: {
//     width: CHIP_SIZE,
//     height: CHIP_SIZE,
//     borderRadius: CHIP_SIZE / 2,
//     backgroundColor: "#FFFFFF",
//     alignItems: "center",
//     justifyContent: "center",
//     borderWidth: v(2),
//     borderColor: "rgba(130,136,93,0.30)",
//   },
//   checkboxCompleted: { backgroundColor: colors.C1, borderColor: colors.C1 },

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
//   cardCompleted: { opacity: 0.6, backgroundColor: "#F9F9F9" },
//   cardRow: { flexDirection: "row", alignItems: "center", gap: v(10) },
//   iconWrap: {
//     width: v(34),
//     height: v(34),
//     borderRadius: v(10),
//     backgroundColor: "#fff",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   categoryBadge: {
//     alignSelf: "flex-start",
//     paddingHorizontal: v(8),
//     paddingVertical: vs(2),
//     borderRadius: v(6),
//     backgroundColor: "rgba(130,136,93,0.15)",
//     marginBottom: vs(6),
//   },
//   categoryText: { fontSize: v(10), fontWeight: "600", color: colors.C3, opacity: 0.7 },
//   cardTitle: { fontSize: v(14), fontWeight: "700", color: colors.C3, opacity: 0.8, lineHeight: vs(20) },
//   cardTitleCompleted: { textDecorationLine: "line-through", opacity: 0.5 },

//   emptyState: { alignItems: "center", justifyContent: "center", paddingVertical: vs(60) },
//   emptyText: { marginTop: vs(12), fontSize: v(16), color: colors.C3, opacity: 0.4, fontWeight: "600" },

//   addButton: {
//     position: "absolute",
//     bottom: vs(90),
//     right: v(20),
//     width: v(56),
//     height: v(56),
//     borderRadius: v(28),
//     backgroundColor: colors.C1,
//     alignItems: "center",
//     justifyContent: "center",
//     shadowColor: "#000",
//     shadowOpacity: 0.2,
//     shadowRadius: v(8),
//     shadowOffset: { width: 0, height: vs(4) },
//     elevation: 5,
//   },
// });
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { v, vs } from "../utils/size";
import { colors } from "../constants/colors";
import RecordingsListJson from "../components/recordingList";
import BottomNav from "../components/NavigationBar";
import FloatingAddButton from "../components/floatinfpill";

export default function RecordingsScreen() {
  return (
    <View style={s.container}>
      {/* Top bar */}
      <View style={s.topBar}>
        <Text style={s.topTitle}>Notes</Text>
      </View>

      {/* Just the recordings list component */}
      <View style={{ paddingHorizontal: v(12), flex: 1 }}>
        <RecordingsListJson title="" />
      </View>

      {/* Bottom navigation (optional) */}
      <BottomNav active="notes" />

     <FloatingAddButton
                    onPress={() => console.log("Add journal")}
                    bottom={vs(90)}
                    right={v(20)}
                    // keep above scroll + nav
                    iconName="mic"
                    style={{ position: "absolute", zIndex: 20, elevation: 20 }}  // ✅ ensure on top
                  />
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  topBar: {
    height: vs(50),
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.C1,
    borderBottomLeftRadius: vs(99),
    borderBottomRightRadius: vs(99),
  },
  topTitle: {
    fontSize: v(20),
    fontWeight: "700",
    color: "#fff",
    opacity: 0.65,
  },
});
