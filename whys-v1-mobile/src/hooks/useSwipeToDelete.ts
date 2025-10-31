// // src/hooks/useSwipeToDelete.ts

// import { useRef } from "react";
// import { Animated, PanResponder } from "react-native";
// import * as Haptics from "expo-haptics";

// export type SwipeToDeleteConfig = {
//   deleteWidth?: number;
//   swipeThreshold?: number;
//   onDelete: () => void;
//   hapticEnabled?: boolean;
// };

// export type SwipeToDeleteReturn = {
//   translateX: Animated.Value;
//   panHandlers: ReturnType<typeof PanResponder.create>["panHandlers"];
//   reset: () => void;
// };

// /**
//  * Custom hook for swipe-to-delete gesture functionality
//  * 
//  * @param config - Configuration object
//  * @param config.deleteWidth - Width of the delete button area (default: 80)
//  * @param config.swipeThreshold - Fraction of deleteWidth to trigger open state (default: 0.5)
//  * @param config.onDelete - Callback function when delete is triggered
//  * @param config.hapticEnabled - Enable haptic feedback (default: true)
//  * 
//  * @returns Object containing translateX animation value, panHandlers, and reset function
//  * 
//  * @example
//  * const { translateX, panHandlers, reset } = useSwipeToDelete({
//  *   deleteWidth: 80,
//  *   onDelete: () => handleDelete(item.id),
//  * });
//  * 
//  * <Animated.View style={{ transform: [{ translateX }] }} {...panHandlers}>
//  *   // Your content
//  * </Animated.View>
//  */
// export const useSwipeToDelete = ({
//   deleteWidth = 80,
//   swipeThreshold = 0.5,
//   onDelete,
//   hapticEnabled = true,
// }: SwipeToDeleteConfig): SwipeToDeleteReturn => {
//   const translateX = useRef(new Animated.Value(0)).current;

//   const reset = () => {
//     Animated.spring(translateX, {
//       toValue: 0,
//       useNativeDriver: true,
//       tension: 100,
//       friction: 8,
//     }).start();
//   };

//   const panResponder = useRef(
//     PanResponder.create({
//       onMoveShouldSetPanResponder: (_, gestureState) => {
//         // Only respond to horizontal swipes (left)
//         return Math.abs(gestureState.dx) > 10 && gestureState.dx < 0;
//       },
//       onPanResponderGrant: () => {
//         if (hapticEnabled) {
//           Haptics.selectionAsync();
//         }
//       },
//       onPanResponderMove: (_, gestureState) => {
//         // Only allow swiping left
//         if (gestureState.dx < 0) {
//           translateX.setValue(Math.max(gestureState.dx, -deleteWidth));
//         }
//       },
//       onPanResponderRelease: (_, gestureState) => {
//         const threshold = -deleteWidth * swipeThreshold;
        
//         if (gestureState.dx < threshold) {
//           // Swipe past threshold - open to reveal delete button
//           Animated.spring(translateX, {
//             toValue: -deleteWidth,
//             useNativeDriver: true,
//             tension: 100,
//             friction: 8,
//           }).start();
          
//           if (hapticEnabled) {
//             Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
//           }
//         } else {
//           // Swipe didn't reach threshold - close
//           reset();
//         }
//       },
//       onPanResponderTerminate: () => {
//         // Reset if gesture is interrupted
//         reset();
//       },
//     })
//   ).current;

//   return {
//     translateX,
//     panHandlers: panResponder.panHandlers,
//     reset,
//   };
// };