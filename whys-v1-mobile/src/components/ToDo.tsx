
// // src/components/ToDo.tsx
// import React, {
//   useEffect,
//   useMemo,
//   useRef,
//   useState,
//   useCallback,
//   forwardRef,
//   useImperativeHandle,
// } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   Pressable,
//   Animated as RNAnimated,
//   ViewStyle,
//   RefreshControl,
//   ActivityIndicator,
// } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import * as Haptics from "expo-haptics";
// import { v, vs } from "../utils/size";
// import { colors } from "../constants/colors";
// import {
//   CheckboxAnimVals,
//   createCheckboxAnimVals,
//   runCompleteAnim,
//   runUncheckAnim,
//   syncToChecked,
// } from "../utils/todo_ani";
// import {
//   TOUCH_SLOP,
//   TOUCH_SLOP_LARGE,
//   PRESS_RECT,
//   PRESS_RECT_LARGE,
// } from "../constants/touch";
// import { ActionItem, ActionData } from "../types/actionItems";
// import { fetchActionItems, deleteActionItem } from "../api/actionitems";
// import { fmtMonthDay } from "../utils/dateformatter";
// import SwipeToDelete from "./swiprToDelete";

// /* ─────────────────────── Types ─────────────────────── */
// type Props = {
//   data?: ActionData;
//   style?: ViewStyle;
// };

// const CHIP_SIZE = v(28);

// /* ─────────────────────── Helpers ─────────────────────── */
// const sortItems = (arr: ActionItem[]) =>
//   [...arr].sort((a, b) => {
//     if (a.completed !== b.completed) return a.completed ? 1 : -1;
//     const ad = a.dueDate ? new Date(a.dueDate).getTime() : Number.POSITIVE_INFINITY;
//     const bd = b.dueDate ? new Date(b.dueDate).getTime() : Number.POSITIVE_INFINITY;
//     if (ad !== bd) return ad - bd;
//     return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
//   });

// /* ─────────────────────── Animated Checkbox ─────────────────────── */
// export type AnimatedCheckboxRef = { playComplete: () => void; playUncheck: () => void };

// const AnimatedCheckbox = forwardRef(function AnimatedCheckbox(
//   {
//     checked,
//     size,
//     onToggleAfterAnim,
//   }: { checked: boolean; size: number; onToggleAfterAnim: () => void },
//   ref: React.Ref<AnimatedCheckboxRef>
// ) {
//   const vals = useRef<CheckboxAnimVals>(createCheckboxAnimVals(checked)).current;

//   useEffect(() => {
//     syncToChecked(vals, checked);
//   }, [checked, vals]);

//   const handlePress = () => {
//     Haptics.selectionAsync();
//     if (!checked) runCompleteAnim(vals, onToggleAfterAnim);
//     else runUncheckAnim(vals, onToggleAfterAnim);
//   };

//   const radius = size / 2;

//   useImperativeHandle(ref, () => ({
//     playComplete: () => runCompleteAnim(vals, onToggleAfterAnim),
//     playUncheck: () => runUncheckAnim(vals, onToggleAfterAnim),
//   }));

//   return (
//     <RNAnimated.View
//       style={{
//         width: size,
//         height: size,
//         alignItems: "center",
//         justifyContent: "center",
//         transform: [{ scale: vals.boxScale }],
//       }}
//     >
//       <RNAnimated.View
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
//       <Pressable
//         onPress={handlePress}
//         hitSlop={TOUCH_SLOP}
//         pressRetentionOffset={PRESS_RECT}
//         android_ripple={{ color: "rgba(130,136,93,0.15)", borderless: true }}
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
//         <RNAnimated.View
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
//         <RNAnimated.View
//           pointerEvents="none"
//           style={{ opacity: vals.checkOpacity, transform: [{ scale: vals.checkScale }] }}
//         >
//           <Ionicons name="checkmark" size={v(18)} color="#fff" />
//         </RNAnimated.View>
//       </Pressable>
//     </RNAnimated.View>
//   );
// });

// /* ─────────────────────── Row Component (uses SwipeToDelete) ─────────────────────── */

// const ItemRow = ({
//   item,
//   disabled,
//   onDelete,
//   onToggle,
// }: {
//   item: ActionItem;
//   disabled: boolean;
//   onDelete: () => void;
//   onToggle: () => void;
// }) => {
//   const cbRef = React.createRef<AnimatedCheckboxRef>();

//   return (
//     // Apply vertical spacing OUTSIDE the swipe container (steadier layout)
//     <View style={{ marginBottom: vs(8), paddingHorizontal: v(16) }}>
//       <SwipeToDelete
//         onDelete={onDelete}
//         actionWidth={v(84)}
//         radius={v(16)}
        
//         actionStyle={{
//     backgroundColor: colors.C4,
//     borderWidth: StyleSheet.hairlineWidth,
//     borderColor: "rgba(130,136,93,0.20)", // ← your color
//     borderRadius: v(16),                   // usually match radius
//   }}
//         actionContent={
//           <View style={{ alignItems: "center" }}>
//             <Ionicons name="trash-outline" size={v(18)} color="red" opacity="0.5" />
//           </View>
//         }
//         disabled={disabled}
//       >
//         {/* Foreground row content */}
//         <View style={{ flexDirection: "row", alignItems: "center" }}>
//           {/* Left rail — center the toggle vertically (no stretch) */}
//           <View style={s.leftRail}>
//             <AnimatedCheckbox
//               ref={cbRef}
//               checked={item.completed}
//               size={CHIP_SIZE}
//               onToggleAfterAnim={onToggle}
//             />
//           </View>

//           {/* Card */}
//           <Pressable
//             hitSlop={TOUCH_SLOP_LARGE}
//             pressRetentionOffset={PRESS_RECT_LARGE}
//             android_ripple={{ color: "rgba(40,71,102,0.08)", borderless: false }}
//             style={[s.card, item.completed && s.cardCompleted, disabled && { opacity: 0.4 }]}
//             onPress={() => {
//               Haptics.selectionAsync();
//               item.completed ? cbRef.current?.playUncheck() : cbRef.current?.playComplete();
//             }}
//             disabled={disabled}
//           >
//             <View style={s.oneLineRow}>
//               <View style={s.leftTitleWrap}>
//                 <Text
//                   style={[s.nameAndCategory, item.completed && s.cardTitleCompleted]}
//                   numberOfLines={3}
//                   ellipsizeMode="tail"
//                 >
//                   {item.action}
//                 </Text>
//               </View>
//               {!!item.dueDate && <Text style={s.monthYearRight}>{fmtMonthDay(item.dueDate)}</Text>}
//             </View>
//           </Pressable>
//         </View>
//       </SwipeToDelete>
//     </View>
//   );
// };

// /* ─────────────────────── Main Component ─────────────────────── */

// export default function ActionItemsSection({ data: overrideData, style }: Props) {
//   const [serverData, setServerData] = useState<ActionData | null>(overrideData ?? null);
//   const [loading, setLoading] = useState<boolean>(!overrideData);
//   const [error, setError] = useState<string | null>(null);
//   const [selectedCategory, setSelectedCategory] = useState<string>("All");
//   const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());

//   const fetchList = useCallback(async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const data = await fetchActionItems();
//       setServerData(data);
//     } catch (e: any) {
//       console.error("Failed to load action items:", e);
//       setError(e?.message || "Failed to load action items");
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     if (!overrideData) fetchList();
//   }, [overrideData, fetchList]);

//   const items: ActionItem[] = useMemo(() => {
//     if (!serverData) return [];
//     const all = [...serverData.pending, ...serverData.completed];
//     return sortItems(all);
//   }, [serverData]);

//   const [localItems, setLocalItems] = useState<ActionItem[]>(items);
//   useEffect(() => setLocalItems(items), [items]);

//   const toggleComplete = (id: string) => {
//     setLocalItems((prev) =>
//       sortItems(prev.map((it) => (it.id === id ? { ...it, completed: !it.completed } : it)))
//     );
//     // TODO: persist PATCH
//   };

//   const handleDelete = useCallback(
//     async (id: string) => {
//       setDeletingIds((prev) => new Set(prev).add(id));
//       const snapshot = localItems;
//       setLocalItems((curr) => curr.filter((i) => i.id !== id));
//       try {
//         await deleteActionItem(id);
//         fetchList();
//       } catch (e) {
//         console.error("Delete failed:", e);
//         Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
//         setError("Delete failed. Please try again.");
//         setLocalItems(snapshot); // rollback
//       } finally {
//         setDeletingIds((prev) => {
//           const s = new Set(prev);
//           s.delete(id);
//           return s;
//         });
//       }
//     },
//     [localItems, fetchList]
//   );

//   const categories = useMemo(() => {
//     const set = new Set<string>();
//     localItems.forEach((i) => set.add(i.category));
//     return ["All", ...Array.from(set).sort()];
//   }, [localItems]);

//   const filteredItems =
//     selectedCategory === "All"
//       ? localItems
//       : localItems.filter((i) => i.category === selectedCategory);

//   const activeItems = filteredItems.filter((i) => !i.completed);
//   const completedItems = filteredItems.filter((i) => i.completed);

//   const showEmpty = !loading && !error && filteredItems.length === 0;

//   return (
//     <View style={[{ backgroundColor: "#fff", width: "100%" }, style]}>
//       {/* Header */}
//       <View style={s.headerRow}>
//         <Text style={s.headerTitle}>Action Items</Text>
//       </View>

//       {/* Category Pills */}
//       <View style={s.categoryContainer}>
//         <ScrollView
//           horizontal
//           showsHorizontalScrollIndicator={false}
//           contentContainerStyle={s.categoryScrollContent}
//         >
//           {categories.map((category) => (
//             <Pressable
//               key={category}
//               hitSlop={TOUCH_SLOP}
//               pressRetentionOffset={PRESS_RECT}
//               android_ripple={{ color: "rgba(40,71,102,0.15)", borderless: false }}
//               style={[
//                 s.categoryPill,
//                 selectedCategory === category ? s.categoryPillActive : undefined,
//               ]}
//               onPress={() => {
//                 Haptics.selectionAsync();
//                 setSelectedCategory(category);
//               }}
//             >
//               <Text
//                 style={[
//                   s.categoryPillText,
//                   selectedCategory === category ? s.categoryPillTextActive : undefined,
//                 ]}
//               >
//                 {category}
//               </Text>
//             </Pressable>
//           ))}
//         </ScrollView>
//       </View>

//       {/* Lists */}
//       <ScrollView
//         contentContainerStyle={{ paddingBottom: vs(110) }}
//         showsVerticalScrollIndicator={false}
//         refreshControl={
//           <RefreshControl refreshing={loading} onRefresh={fetchList} tintColor={colors.C3} />
//         }
//       >
//         {loading && (
//           <View style={s.loadingContainer}>
//             <ActivityIndicator size="large" color={colors.C1} />
//             <Text style={s.loadingText}>Loading…</Text>
//           </View>
//         )}

//         {error && (
//           <View style={s.errorContainer}>
//             <Ionicons name="alert-circle-outline" size={v(48)} color="#b00020" />
//             <Text style={s.errorTitle}>Couldn't load action items</Text>
//             <Text style={s.errorMessage}>{error}</Text>
//             <Pressable onPress={fetchList} style={s.retryButton}>
//               <Text style={s.retryButtonText}>Retry</Text>
//             </Pressable>
//           </View>
//         )}

//         {!loading && !error && activeItems.length > 0 && (
//           <View>
//             {activeItems.map((item) => (
//               <ItemRow
//                 key={item.id}
//                 item={item}
//                 disabled={deletingIds.has(item.id)}
//                 onDelete={() => handleDelete(item.id)}
//                 onToggle={() => toggleComplete(item.id)}
//               />
//             ))}
//           </View>
//         )}

//         {!loading && !error && completedItems.length > 0 && (
//           <View>
//             <Text style={s.sectionHeader}>Completed ({completedItems.length})</Text>
//             {completedItems.map((item) => (
//               <ItemRow
//                 key={item.id}
//                 item={item}
//                 disabled={deletingIds.has(item.id)}
//                 onDelete={() => handleDelete(item.id)}
//                 onToggle={() => toggleComplete(item.id)}
//               />
//             ))}
//           </View>
//         )}

//         {showEmpty && (
//           <View style={s.emptyState}>
//             <Ionicons
//               name="checkmark-circle-outline"
//               size={v(64)}
//               color={colors.C1}
//               style={{ opacity: 0.3 }}
//             />
//             <Text style={s.emptyText}>No items in this category</Text>
//           </View>
//         )}
//       </ScrollView>
//     </View>
//   );
// }

// /* ─────────────────────── Styles ─────────────────────── */
// const s = StyleSheet.create({
//   headerRow: { paddingHorizontal: v(16), paddingTop: vs(14), paddingBottom: vs(5) },
//   headerTitle: { fontSize: v(18), fontWeight: "800", color: colors.C3, opacity: 0.9 },
//   headerSubtitle: {
//     fontSize: v(12),
//     fontWeight: "600",
//     color: colors.C3,
//     opacity: 0.5,
//     marginTop: vs(2),
//   },

//   categoryContainer: { paddingVertical: vs(12), backgroundColor: "#fff", paddingBottom: vs(20) },
//   categoryScrollContent: { paddingHorizontal: v(16), gap: v(8) },
//   categoryPill: {
//     paddingHorizontal: v(18),
//     paddingVertical: vs(6),
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

//   /* Left rail — keep it fixed width & centered (no vertical stretch) */
//   leftRail: {
//     width: CHIP_SIZE,
//     alignItems: "center",
//     justifyContent: "center",
//   },

//   card: {
//     flex: 1,
//     marginLeft: v(5),
//     backgroundColor: colors.C4,
//     borderRadius: v(16),
//     paddingVertical: v(18),
//     paddingHorizontal: v(12),
//     shadowColor: "#000",
//     shadowOpacity: 0.06,
//     shadowRadius: v(8),
//     shadowOffset: { width: 0, height: vs(4) },
//     elevation: 3,
//     borderWidth: StyleSheet.hairlineWidth,
//     borderColor: "rgba(130,136,93,0.20)",
//     overflow: "hidden",
//   },
//   cardCompleted: { opacity: 0.6, backgroundColor: "#F9F9F9" },

//   oneLineRow: { flexDirection: "row", alignItems: "center" },
//   leftTitleWrap: { flex: 1, paddingRight: v(8) },
//   nameAndCategory: { fontSize: v(14), fontWeight: "700", color: colors.C3, opacity: 0.85 },
//   monthYearRight: { fontSize: v(12), fontWeight: "700", color: colors.C3, opacity: 0.6 },
//   cardTitleCompleted: { textDecorationLine: "line-through", opacity: 0.5 },

//   loadingContainer: { paddingVertical: vs(40), alignItems: "center" },
//   loadingText: { marginTop: vs(8), color: colors.C3, opacity: 0.6, fontSize: v(14), fontWeight: "600" },

//   errorContainer: { paddingHorizontal: v(16), paddingVertical: vs(40), alignItems: "center" },
//   errorTitle: { color: "#b00020", fontWeight: "700", fontSize: v(16), marginTop: vs(12) },
//   errorMessage: { color: colors.C3, opacity: 0.7, marginTop: vs(6), textAlign: "center", fontSize: v(14) },
//   retryButton: {
//     marginTop: vs(16),
//     paddingHorizontal: v(24),
//     paddingVertical: v(10),
//     borderRadius: v(14),
//     backgroundColor: colors.C2,
//   },
//   retryButtonText: { fontWeight: "700", fontSize: v(14) },

//   emptyState: { alignItems: "center", justifyContent: "center", paddingVertical: vs(60) },
//   emptyText: { marginTop: vs(12), fontSize: v(16), color: colors.C3, opacity: 0.4, fontWeight: "600" },
// });
// src/components/ToDo.tsx
import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Animated as RNAnimated,
  ViewStyle,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { v, vs } from "../utils/size";
import { colors } from "../constants/colors";
import {
  CheckboxAnimVals,
  createCheckboxAnimVals,
  runCompleteAnim,
  runUncheckAnim,
  syncToChecked,
} from "../utils/todo_ani";
import {
  TOUCH_SLOP,
  TOUCH_SLOP_LARGE,
  PRESS_RECT,
  PRESS_RECT_LARGE,
} from "../constants/touch";
import { ActionItem, ActionData } from "../types/actionItems";
import {
  fetchActionItems,
  deleteActionItem,
} from "../api/actionitems";
import { toggleActionItem } from "../api/actionitems"; // NEW
import { fmtMonthDay } from "../utils/dateformatter";
import SwipeToDelete from "./swiprToDelete";

/* ─────────────────────── Types ─────────────────────── */
type Props = {
  data?: ActionData;
  style?: ViewStyle;
};

const CHIP_SIZE = v(28);

/* ─────────────────────── Helpers ─────────────────────── */
const sortItems = (arr: ActionItem[]) =>
  [...arr].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    const ad = a.dueDate ? new Date(a.dueDate).getTime() : Number.POSITIVE_INFINITY;
    const bd = b.dueDate ? new Date(b.dueDate).getTime() : Number.POSITIVE_INFINITY;
    if (ad !== bd) return ad - bd;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

/* ─────────────────────── Animated Checkbox ─────────────────────── */
export type AnimatedCheckboxRef = { playComplete: () => void; playUncheck: () => void };

const AnimatedCheckbox = forwardRef(function AnimatedCheckbox(
  {
    checked,
    size,
    onToggleAfterAnim,
  }: { checked: boolean; size: number; onToggleAfterAnim: () => void },
  ref: React.Ref<AnimatedCheckboxRef>
) {
  const vals = useRef<CheckboxAnimVals>(createCheckboxAnimVals(checked)).current;

  useEffect(() => {
    syncToChecked(vals, checked);
  }, [checked, vals]);

  const handlePress = () => {
    Haptics.selectionAsync();
    if (!checked) runCompleteAnim(vals, onToggleAfterAnim);
    else runUncheckAnim(vals, onToggleAfterAnim);
  };

  const radius = size / 2;

  useImperativeHandle(ref, () => ({
    playComplete: () => runCompleteAnim(vals, onToggleAfterAnim),
    playUncheck: () => runUncheckAnim(vals, onToggleAfterAnim),
  }));

  return (
    <RNAnimated.View
      style={{
        width: size,
        height: size,
        alignItems: "center",
        justifyContent: "center",
        transform: [{ scale: vals.boxScale }],
      }}
    >
      <RNAnimated.View
        pointerEvents="none"
        style={{
          position: "absolute",
          width: size,
          height: size,
          borderRadius: radius,
          backgroundColor: colors.C1,
          opacity: vals.ringOpacity,
          transform: [{ scale: vals.ringScale }],
        }}
      />
      <Pressable
        onPress={handlePress}
        hitSlop={TOUCH_SLOP}
        pressRetentionOffset={PRESS_RECT}
        android_ripple={{ color: "rgba(130,136,93,0.15)", borderless: true }}
        style={{
          width: size,
          height: size,
          borderRadius: radius,
          backgroundColor: "#FFFFFF",
          alignItems: "center",
          justifyContent: "center",
          borderWidth: v(2),
          borderColor: "rgba(130,136,93,0.30)",
          overflow: "hidden",
        }}
      >
        <RNAnimated.View
          pointerEvents="none"
          style={{
            position: "absolute",
            width: size,
            height: size,
            borderRadius: radius,
            backgroundColor: colors.C1,
            transform: [{ scale: vals.fillScale }],
          }}
        />
        <RNAnimated.View
          pointerEvents="none"
          style={{ opacity: vals.checkOpacity, transform: [{ scale: vals.checkScale }] }}
        >
          <Ionicons name="checkmark" size={v(18)} color="#fff" />
        </RNAnimated.View>
      </Pressable>
    </RNAnimated.View>
  );
});

/* ─────────────────────── Row Component (uses SwipeToDelete) ─────────────────────── */
const ItemRow = ({
  item,
  disabled,
  onDelete,
  onToggle,
}: {
  item: ActionItem;
  disabled: boolean;
  onDelete: () => void;
  onToggle: () => void;
}) => {
  const cbRef = React.createRef<AnimatedCheckboxRef>();

  return (
    <View style={{ marginBottom: vs(8), paddingHorizontal: v(16) }}>
      <SwipeToDelete
        onDelete={onDelete}
        actionWidth={v(84)}
        radius={v(16)}
        actionStyle={{
          backgroundColor: colors.C4,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: "rgba(130,136,93,0.20)",
          borderRadius: v(16),
        }}
        actionContent={
          <View style={{ alignItems: "center" }}>
            <Ionicons name="trash-outline" size={v(18)} color="red" />
          </View>
        }
        disabled={disabled}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View style={s.leftRail}>
            <AnimatedCheckbox
              ref={cbRef}
              checked={item.completed}
              size={CHIP_SIZE}
              onToggleAfterAnim={onToggle}
            />
          </View>

          <Pressable
            hitSlop={TOUCH_SLOP_LARGE}
            pressRetentionOffset={PRESS_RECT_LARGE}
            android_ripple={{ color: "rgba(40,71,102,0.08)", borderless: false }}
            style={[
              s.card,
              item.completed && s.cardCompleted,
              disabled && { opacity: 0.4 },
            ]}
            onPress={() => {
              Haptics.selectionAsync();
              item.completed ? cbRef.current?.playUncheck() : cbRef.current?.playComplete();
            }}
            disabled={disabled}
          >
            <View style={s.oneLineRow}>
              <View style={s.leftTitleWrap}>
                <Text
                  style={[s.nameAndCategory, item.completed && s.cardTitleCompleted]}
                  numberOfLines={3}
                  ellipsizeMode="tail"
                >
                  {item.action}
                </Text>
              </View>
              {!!item.dueDate && (
                <Text style={s.monthYearRight}>{fmtMonthDay(item.dueDate)}</Text>
              )}
            </View>
          </Pressable>
        </View>
      </SwipeToDelete>
    </View>
  );
};

/* ─────────────────────── Main Component ─────────────────────── */
export default function ActionItemsSection({ data: overrideData, style }: Props) {
  const [serverData, setServerData] = useState<ActionData | null>(overrideData ?? null);
  const [loading, setLoading] = useState<boolean>(!overrideData);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());
  const [togglingIds, setTogglingIds] = useState<Set<string>>(new Set());

  const fetchList = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchActionItems();
      setServerData(data);
    } catch (e: any) {
      console.error("Failed to load action items:", e);
      setError(e?.message || "Failed to load action items");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!overrideData) fetchList();
  }, [overrideData, fetchList]);

  const items: ActionItem[] = useMemo(() => {
    if (!serverData) return [];
    const all = [...serverData.pending, ...serverData.completed];
    return sortItems(all);
  }, [serverData]);

  const [localItems, setLocalItems] = useState<ActionItem[]>(items);
  useEffect(() => setLocalItems(items), [items]);

  // NEW: toggle computes next state locally and calls /toggle (no body, 204)
  const toggleComplete = useCallback(
    async (id: string) => {
      if (togglingIds.has(id)) return;

      setTogglingIds((prev) => new Set(prev).add(id));
      const snapshot = localItems;

      // optimistic flip
      setLocalItems((curr) =>
        sortItems(curr.map((it) => (it.id === id ? { ...it, completed: !it.completed } : it)))
      );

      try {
        await toggleActionItem(id); // 204 expected
        // optionally: await fetchList(); // to pick up updatedAt from server
      } catch (e) {
        console.error("Toggle failed:", e);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        setError("Update failed. Please try again.");
        setLocalItems(snapshot); // rollback
      } finally {
        setTogglingIds((prev) => {
          const s = new Set(prev);
          s.delete(id);
          return s;
        });
      }
    },
    [localItems, togglingIds]
  );

  const handleDelete = useCallback(
    async (id: string) => {
      setDeletingIds((prev) => new Set(prev).add(id));
      const snapshot = localItems;
      setLocalItems((curr) => curr.filter((i) => i.id !== id));
      try {
        await deleteActionItem(id);
        fetchList();
      } catch (e) {
        console.error("Delete failed:", e);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        setError("Delete failed. Please try again.");
        setLocalItems(snapshot); // rollback
      } finally {
        setDeletingIds((prev) => {
          const s = new Set(prev);
          s.delete(id);
          return s;
        });
      }
    },
    [localItems, fetchList]
  );

  const categories = useMemo(() => {
    const set = new Set<string>();
    localItems.forEach((i) => set.add(i.category));
    return ["All", ...Array.from(set).sort()];
  }, [localItems]);

  const filteredItems =
    selectedCategory === "All"
      ? localItems
      : localItems.filter((i) => i.category === selectedCategory);

  const activeItems = filteredItems.filter((i) => !i.completed);
  const completedItems = filteredItems.filter((i) => i.completed);

  const showEmpty = !loading && !error && filteredItems.length === 0;

  return (
    <View style={[{ backgroundColor: "#fff", width: "100%" }, style]}>
      {/* Header */}
      <View style={s.headerRow}>
        <Text style={s.headerTitle}>Action Items</Text>
      </View>

      {/* Category Pills */}
      <View style={s.categoryContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={s.categoryScrollContent}
        >
          {categories.map((category) => (
            <Pressable
              key={category}
              hitSlop={TOUCH_SLOP}
              pressRetentionOffset={PRESS_RECT}
              android_ripple={{ color: "rgba(40,71,102,0.15)", borderless: false }}
              style={[
                s.categoryPill,
                selectedCategory === category ? s.categoryPillActive : undefined,
              ]}
              onPress={() => {
                Haptics.selectionAsync();
                setSelectedCategory(category);
              }}
            >
              <Text
                style={[
                  s.categoryPillText,
                  selectedCategory === category ? s.categoryPillTextActive : undefined,
                ]}
              >
                {category}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {/* Lists */}
      <ScrollView
        contentContainerStyle={{ paddingBottom: vs(110) }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={fetchList} tintColor={colors.C3} />
        }
      >
        {loading && (
          <View style={s.loadingContainer}>
            <ActivityIndicator size="large" color={colors.C1} />
            <Text style={s.loadingText}>Loading…</Text>
          </View>
        )}

        {error && (
          <View style={s.errorContainer}>
            <Ionicons name="alert-circle-outline" size={v(48)} color="#b00020" />
            <Text style={s.errorTitle}>Couldn't load action items</Text>
            <Text style={s.errorMessage}>{error}</Text>
            <Pressable onPress={fetchList} style={s.retryButton}>
              <Text style={s.retryButtonText}>Retry</Text>
            </Pressable>
          </View>
        )}

        {!loading && !error && activeItems.length > 0 && (
          <View>
            {activeItems.map((item) => (
              <ItemRow
                key={item.id}
                item={item}
                disabled={deletingIds.has(item.id) || togglingIds.has(item.id)}
                onDelete={() => handleDelete(item.id)}
                onToggle={() => toggleComplete(item.id)} // changed
              />
            ))}
          </View>
        )}

        {!loading && !error && completedItems.length > 0 && (
          <View>
            <Text style={s.sectionHeader}>Completed ({completedItems.length})</Text>
            {completedItems.map((item) => (
              <ItemRow
                key={item.id}
                item={item}
                disabled={deletingIds.has(item.id) || togglingIds.has(item.id)}
                onDelete={() => handleDelete(item.id)}
                onToggle={() => toggleComplete(item.id)} // changed
              />
            ))}
          </View>
        )}

        {showEmpty && (
          <View style={s.emptyState}>
            <Ionicons
              name="checkmark-circle-outline"
              size={v(64)}
              color={colors.C1}
              style={{ opacity: 0.3 }}
            />
            <Text style={s.emptyText}>No items in this category</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

/* ─────────────────────── Styles ─────────────────────── */
const s = StyleSheet.create({
  headerRow: { paddingHorizontal: v(16), paddingTop: vs(14), paddingBottom: vs(5) },
  headerTitle: { fontSize: v(18), fontWeight: "800", color: colors.C3, opacity: 0.9 },
  headerSubtitle: {
    fontSize: v(12),
    fontWeight: "600",
    color: colors.C3,
    opacity: 0.5,
    marginTop: vs(2),
  },

  categoryContainer: { paddingVertical: vs(12), backgroundColor: "#fff", paddingBottom: vs(20) },
  categoryScrollContent: { paddingHorizontal: v(16), gap: v(8) },
  categoryPill: {
    paddingHorizontal: v(18),
    paddingVertical: vs(6),
    borderRadius: v(20),
    backgroundColor: colors.C4,
    borderWidth: v(1.5),
    borderColor: "rgba(130,136,93,0.20)",
  },
  categoryPillActive: { backgroundColor: colors.C2, borderColor: colors.C2 },
  categoryPillText: { fontSize: v(14), fontWeight: "600", color: colors.C3, opacity: 0.7 },
  categoryPillTextActive: { color: "black", opacity: 0.7 },

  sectionHeader: {
    paddingHorizontal: v(16),
    paddingTop: vs(18),
    paddingBottom: vs(8),
    fontSize: v(16),
    fontWeight: "800",
    color: colors.C3,
    backgroundColor: "white",
  },

  leftRail: {
    width: CHIP_SIZE,
    alignItems: "center",
    justifyContent: "center",
  },

  card: {
    flex: 1,
    marginLeft: v(5),
    backgroundColor: colors.C4,
    borderRadius: v(16),
    paddingVertical: v(18),
    paddingHorizontal: v(12),
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: v(8),
    shadowOffset: { width: 0, height: vs(4) },
    elevation: 3,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(130,136,93,0.20)",
    overflow: "hidden",
  },
  cardCompleted: { opacity: 0.6, backgroundColor: "#F9F9F9" },

  oneLineRow: { flexDirection: "row", alignItems: "center" },
  leftTitleWrap: { flex: 1, paddingRight: v(8) },
  nameAndCategory: { fontSize: v(14), fontWeight: "700", color: colors.C3, opacity: 0.85 },
  monthYearRight: { fontSize: v(12), fontWeight: "700", color: colors.C3, opacity: 0.6 },
  cardTitleCompleted: { textDecorationLine: "line-through", opacity: 0.5 },

  loadingContainer: { paddingVertical: vs(40), alignItems: "center" },
  loadingText: { marginTop: vs(8), color: colors.C3, opacity: 0.6, fontSize: v(14), fontWeight: "600" },

  errorContainer: { paddingHorizontal: v(16), paddingVertical: vs(40), alignItems: "center" },
  errorTitle: { color: "#b00020", fontWeight: "700", fontSize: v(16), marginTop: vs(12) },
  errorMessage: { color: colors.C3, opacity: 0.7, marginTop: vs(6), textAlign: "center", fontSize: v(14) },
  retryButton: {
    marginTop: vs(16),
    paddingHorizontal: v(24),
    paddingVertical: v(10),
    borderRadius: v(14),
    backgroundColor: colors.C2,
  },
  retryButtonText: { fontWeight: "700", fontSize: v(14) },

  emptyState: { alignItems: "center", justifyContent: "center", paddingVertical: vs(60) },
  emptyText: { marginTop: vs(12), fontSize: v(16), color: colors.C3, opacity: 0.4, fontWeight: "600" },
});
