// src/components/FloatingAddButton.tsx
import React, { useRef } from "react";
import { Pressable, StyleSheet, Animated, ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { v, vs } from "../utils/size";
import { colors } from "../constants/colors";

type Props = {
  onPress: () => void;
  /** Absolute positioning from bottom/right (defaults tuned for BottomNav above) */
  bottom?: number;
  right?: number;
  /** Optional style override (applied to wrapper) */
  style?: ViewStyle;
  /** Optional icon name/size if you ever want a different icon */
  iconName?: keyof typeof Ionicons.glyphMap;
  iconSize?: number;
};

export default function FloatingAddButton({
  onPress,
  bottom = vs(90),
  right = v(20),
  style,
  iconName = "add",
  iconSize = v(28),
}: Props) {
  const scale = useRef(new Animated.Value(1)).current;

  const pressIn = () =>
    Animated.spring(scale, { toValue: 0.96, useNativeDriver: true, speed: 40, bounciness: 6 }).start();
  const pressOut = () =>
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 40, bounciness: 6 }).start();

  return (
    <Animated.View
      style={[
        styles.wrap,
        { bottom, right, transform: [{ scale }] },
        style,
      ]}
      pointerEvents="box-none"
    >
      <Pressable
        onPressIn={pressIn}
        onPressOut={pressOut}
        onPress={onPress}
        style={styles.btn}
      >
        <Ionicons name={iconName} size={iconSize} color="#fff" />
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: "absolute",
    zIndex: 100, // above scroll + content
    elevation: 10,
  },
  btn: {
    width: v(56),
    height: v(56),
    borderRadius: v(28),
    backgroundColor: colors.C1,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: v(8),
    shadowOffset: { width: 0, height: vs(4) },
    elevation: 8,
  },
});
