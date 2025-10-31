// // src/components/SwipeToDelete.tsx
// import React from "react";
// import { View, Pressable, StyleSheet, ViewStyle } from "react-native";
// import { GestureDetector, Gesture } from "react-native-gesture-handler";
// import Animated, {
//   useSharedValue,
//   useAnimatedStyle,
//   withSpring,
//   withTiming,
//   runOnJS,
// } from "react-native-reanimated";

// // Local scaler fallback; replace with your own if desired
// const v = (n: number) => n;

// type Props = {
//   children: React.ReactNode;           // Foreground row content
//   onDelete?: () => void;               // Called after full swipe or action press
//   actionWidth?: number;                // Visible width of right action
//   triggerRatio?: number;               // 0..1 (e.g., 0.9 → 90% to trigger)
//   radius?: number;                     // Corner radius for clipping
//   disabled?: boolean;                  // Disable swipe
//   style?: ViewStyle;                   // Wrapper style
//   actionStyle?: ViewStyle;             // Style for right action bar
//   actionContent?: React.ReactNode;     // Icon/label inside the action bar
//   actionOnPressAlsoDeletes?: boolean;  // Default true
//   snapDamping?: number;                // Spring damping
//   snapStiffness?: number;              // Spring stiffness
// };

// export default function SwipeToDelete({
//   children,
//   onDelete,
//   actionWidth = v(84),
//   triggerRatio = 0.9,
//   radius = v(16),
//   disabled = false,
//   style,
//   actionStyle,
//   actionContent,
//   actionOnPressAlsoDeletes = true,
//   snapDamping = 18,
//   snapStiffness = 220,
// }: Props) {
//   const tx = useSharedValue(0);
//   const open = useSharedValue(false);
//   const isDeleting = useSharedValue(false);
//   const scaleY = useSharedValue(1);

//   const SNAP_OPEN_X = -actionWidth;
//   const TRIGGER_DELETE_X = -actionWidth * triggerRatio;
//   const OFFSCREEN_X = -v(500);

//   const pan = Gesture.Pan()
//     .enabled(!disabled)
//     .activeOffsetX([-10, 10])
//     .failOffsetY([-10, 10])
//     .onUpdate((e) => {
//       const next = Math.min(0, e.translationX);
//       tx.value = next;
//       open.value = next < SNAP_OPEN_X * 0.6; // "peek open" feel
//     })
//     .onEnd(() => {
//       if (tx.value <= TRIGGER_DELETE_X && onDelete) {
//         // Full-swipe delete
//         isDeleting.value = true;
//         tx.value = withTiming(OFFSCREEN_X, { duration: 140 }, (done) => {
//           if (done) {
//             scaleY.value = withTiming(0, { duration: 140 }, (collapsed) => {
//               if (collapsed) runOnJS(onDelete)();
//             });
//           }
//         });
//       } else if (open.value) {
//         tx.value = withSpring(SNAP_OPEN_X, { damping: snapDamping, stiffness: snapStiffness });
//       } else {
//         tx.value = withSpring(0, { damping: snapDamping, stiffness: snapStiffness });
//       }
//     });

//   // Foreground (your content) translate X
//   const fgStyle = useAnimatedStyle(() => ({
//     transform: [{ translateX: tx.value }],
//     opacity: isDeleting.value ? 0.6 : 1,
//   }));

//   // Collapse the entire row on delete (scaleY)
//   const containerStyle = useAnimatedStyle(() => ({
//     transform: [{ scaleY: scaleY.value }],
//   }));

//   // Right action slides in from right
//   const actionTranslate = useAnimatedStyle(() => {
//     const translate = actionWidth + Math.max(-actionWidth, tx.value);
//     return { transform: [{ translateX: translate }] };
//   });

//   // STRETCH top↕bottom — no vertical math/jitter
//   const actionMeasuredStyle = { top: 0, bottom: 0 } as const;

//   const onActionPress = () => {
//     if (!onDelete || !actionOnPressAlsoDeletes) return;
//     isDeleting.value = true;
//     tx.value = withTiming(OFFSCREEN_X, { duration: 140 }, (done) => {
//       if (done) {
//         scaleY.value = withTiming(0, { duration: 140 }, (collapsed) => {
//           if (collapsed) runOnJS(onDelete)();
//         });
//       }
//     });
//   };

//   return (
//     <Animated.View style={[containerStyle, style]}>
//       {/* Wrapper clips fg + action with shared radius */}
//       <View style={{ overflow: "hidden", borderRadius: radius }}>
//         {/* Right action (stretched to wrapper height) */}
//         <Animated.View
//           pointerEvents="box-none"
//           style={[
//             styles.actionBase,
//             { right: 0, width: actionWidth, borderRadius: radius },
//             actionStyle,
//             actionMeasuredStyle,
//             actionTranslate,
//           ]}
//         >
//           <Pressable onPress={onActionPress} style={styles.actionPressArea}>
//             {actionContent ?? <View style={styles.defaultActionInner} />}
//           </Pressable>
//         </Animated.View>

//         {/* Foreground (we do NOT animate vertical layout) */}
//         <GestureDetector gesture={pan}>
//           <Animated.View style={[styles.fgRow, fgStyle]}>
//             {children}
//           </Animated.View>
//         </GestureDetector>
//       </View>
//     </Animated.View>
//   );
// }

// const styles = StyleSheet.create({
//   fgRow: { flex: 1 },
//   actionBase: {
//     position: "absolute",
//     backgroundColor: "#D32F2F",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   actionPressArea: {
//     flex: 1,
//     width: "100%",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   defaultActionInner: {
//     width: v(28),
//     height: v(3),
//     backgroundColor: "rgba(255,255,255,0.9)",
//     borderRadius: v(2),
//   },
// });
// src/components/SwipeToDelete.tsx
import React from "react";
import { View, Pressable, StyleSheet, ViewStyle } from "react-native";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
} from "react-native-reanimated";

// Local scaler fallback; swap for your own if needed
const v = (n: number) => n;

type Props = {
  children: React.ReactNode;           // Foreground row content
  onDelete?: () => void;               // Called after full swipe or action press

  actionWidth?: number;                // Visible width of right action (default 84)
  openGap?: number;                    // Gap between row & bar at snap-open (default 0)
  triggerRatio?: number;               // % of effective width to trigger delete (0..1)
  radius?: number;                     // Corner radius for clipping
  disabled?: boolean;                  // Disable swipe

  style?: ViewStyle;                   // Wrapper style
  actionStyle?: ViewStyle;             // Style override for right action bar
  actionContent?: React.ReactNode;     // Icon/label inside the action bar
  actionOnPressAlsoDeletes?: boolean;  // Default true

  snapDamping?: number;                // Spring damping
  snapStiffness?: number;              // Spring stiffness

  insetRight?: number;                 // Shift bar inward to match outer padding
  actionBorderWidth?: number;          // Border width for delete bar
  actionBorderColor?: string;          // Border color for delete bar
};

export default function SwipeToDelete({
  children,
  onDelete,
  actionWidth = v(84),
  openGap = 0,
  triggerRatio = 0.9,
  radius = v(16),
  disabled = false,
  style,
  actionStyle,
  actionContent,
  actionOnPressAlsoDeletes = true,
  snapDamping = 18,
  snapStiffness = 220,
  insetRight = 0,
  actionBorderWidth,
  actionBorderColor,
}: Props) {
  const tx = useSharedValue(0);
  const open = useSharedValue(false);
  const isDeleting = useSharedValue(false);
  const scaleY = useSharedValue(1);

  // Effective width the row travels when fully open (leaves 'openGap' space)
  const effW = Math.max(0, actionWidth - openGap);
  const SNAP_OPEN_X = -effW;
  const TRIGGER_DELETE_X = -effW * triggerRatio;
  const OFFSCREEN_X = -v(500);

  const pan = Gesture.Pan()
    .enabled(!disabled)
    .activeOffsetX([-10, 10])
    .failOffsetY([-10, 10])
    .onUpdate((e) => {
      const next = Math.min(0, e.translationX);
      tx.value = next;
      open.value = next < SNAP_OPEN_X * 0.6; // "peek open" feel
    })
    .onEnd(() => {
      if (tx.value <= TRIGGER_DELETE_X && onDelete) {
        // Full-swipe delete
        isDeleting.value = true;
        tx.value = withTiming(OFFSCREEN_X, { duration: 140 }, (done) => {
          if (done) {
            scaleY.value = withTiming(0, { duration: 140 }, (collapsed) => {
              if (collapsed) runOnJS(onDelete)();
            });
          }
        });
      } else if (open.value) {
        tx.value = withSpring(SNAP_OPEN_X, { damping: snapDamping, stiffness: snapStiffness });
      } else {
        tx.value = withSpring(0, { damping: snapDamping, stiffness: snapStiffness });
      }
    });

  // Foreground translate X
  const fgStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: tx.value }],
    opacity: isDeleting.value ? 0.6 : 1,
  }));

  // Collapse on delete
  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ scaleY: scaleY.value }],
  }));

  // Delete bar slides in from right. Clamp with effW so snap-open leaves 'openGap'
  const actionTranslate = useAnimatedStyle(() => {
    const clampedTx = Math.max(-effW, tx.value);
    const translate = actionWidth + clampedTx;
    // When tx == -effW → translate == actionWidth - effW == openGap
    return { transform: [{ translateX: translate }] };
  });

  // Stretch vertically — no jitter
  const actionMeasuredStyle = { top: 0, bottom: 0 } as const;

  const onActionPress = () => {
    if (!onDelete || !actionOnPressAlsoDeletes) return;
    isDeleting.value = true;
    tx.value = withTiming(OFFSCREEN_X, { duration: 140 }, (done) => {
      if (done) {
        scaleY.value = withTiming(0, { duration: 140 }, (collapsed) => {
          if (collapsed) runOnJS(onDelete)();
        });
      }
    });
  };

  return (
    <Animated.View style={[containerStyle, style]}>
      {/* Wrapper clips fg + action with shared radius */}
      <View style={{ overflow: "hidden", borderRadius: radius }}>
        {/* Right action (stretched to wrapper height) */}
        <Animated.View
          pointerEvents="box-none"
          style={[
            styles.actionBase,
            {
              right: insetRight,
              width: actionWidth,
              borderRadius: radius,
              ...(actionBorderWidth ? { borderWidth: actionBorderWidth } : null),
              ...(actionBorderColor ? { borderColor: actionBorderColor } : null),
            },
            actionStyle,
            actionMeasuredStyle,
            actionTranslate,
          ]}
        >
          <Pressable onPress={onActionPress} style={styles.actionPressArea}>
            {actionContent ?? <View style={styles.defaultActionInner} />}
          </Pressable>
        </Animated.View>

        {/* Foreground row content */}
        <GestureDetector gesture={pan}>
          <Animated.View style={[styles.fgRow, fgStyle]}>
            {children}
          </Animated.View>
        </GestureDetector>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  fgRow: { flex: 1 },
  actionBase: {
    position: "absolute",
    backgroundColor: "#D32F2F",
    alignItems: "center",
    justifyContent: "center",
  },
  actionPressArea: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  defaultActionInner: {
    width: v(28),
    height: v(3),
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: v(2),
  },
});
