
// src/anim/checkboxAnim.ts
import { Animated, Easing } from "react-native";

/** Tunables (short + snappy) */
export const CHECK_ANIM = {
  dur: {
    fillIn: 140,
    checkInOpacity: 100,
    checkInScale: 120,
    uncheckAll: 140,
    fade: 100,
  },
  // Optional micro-pop (set >1 to enable, e.g. 1.02). Not used by default.
  microPopScale: 1.0,
  microPopDur: 80,
};

export type CheckboxAnimVals = {
  ringScale: Animated.Value;   // kept for compatibility (not used in simple mode)
  ringOpacity: Animated.Value; // kept for compatibility (not used in simple mode)
  boxScale: Animated.Value;
  fillScale: Animated.Value;
  checkScale: Animated.Value;
  checkOpacity: Animated.Value;
};

export function createCheckboxAnimVals(isChecked: boolean): CheckboxAnimVals {
  return {
    ringScale: new Animated.Value(0.6),
    ringOpacity: new Animated.Value(0),
    boxScale: new Animated.Value(1),
    fillScale: new Animated.Value(isChecked ? 1 : 0),
    checkScale: new Animated.Value(isChecked ? 1 : 0.6),
    checkOpacity: new Animated.Value(isChecked ? 1 : 0),
  };
}

/** Keep visuals in sync when `checked` changes (e.g., list re-render). */
export function syncToChecked(vals: CheckboxAnimVals, checked: boolean) {
  Animated.parallel([
    Animated.timing(vals.fillScale, {
      toValue: checked ? 1 : 0,
      duration: CHECK_ANIM.dur.fillIn, // same for in/out for a consistent feel
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }),
    Animated.timing(vals.checkScale, {
      toValue: checked ? 1 : 0.6,
      duration: CHECK_ANIM.dur.checkInScale,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }),
    Animated.timing(vals.checkOpacity, {
      toValue: checked ? 1 : 0,
      duration: CHECK_ANIM.dur.checkInOpacity,
      useNativeDriver: true,
    }),
  ]).start();
}

/** FAST “check” (same simplicity as uncheck), then call `onEnd`. */
export function runCompleteAnim(
  vals: CheckboxAnimVals,
  onEnd?: () => void
) {
  const anims: Animated.CompositeAnimation[] = [
    Animated.timing(vals.fillScale, {
      toValue: 1,
      duration: CHECK_ANIM.dur.fillIn,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }),
    Animated.timing(vals.checkOpacity, {
      toValue: 1,
      duration: CHECK_ANIM.dur.checkInOpacity,
      useNativeDriver: true,
    }),
    Animated.timing(vals.checkScale, {
      toValue: 1,
      duration: CHECK_ANIM.dur.checkInScale,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }),
  ];

  // Optional micro-pop without changing overall feel (disabled by default)
  if (CHECK_ANIM.microPopScale > 1) {
    anims.push(
      Animated.sequence([
        Animated.timing(vals.boxScale, {
          toValue: CHECK_ANIM.microPopScale,
          duration: CHECK_ANIM.microPopDur,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(vals.boxScale, {
          toValue: 1,
          duration: CHECK_ANIM.microPopDur,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    );
  }

  Animated.parallel(anims).start(({ finished }) => {
    if (finished && onEnd) onEnd();
    // ensure any legacy ring visuals are hidden
    vals.ringOpacity.setValue(0);
    vals.ringScale.setValue(0.6);
  });
}

/** FAST “uncheck”, then call `onEnd`. */
export function runUncheckAnim(
  vals: CheckboxAnimVals,
  onEnd?: () => void
) {
  Animated.parallel([
    Animated.timing(vals.checkOpacity, {
      toValue: 0,
      duration: CHECK_ANIM.dur.fade,
      useNativeDriver: true,
    }),
    Animated.timing(vals.checkScale, {
      toValue: 0.6,
      duration: CHECK_ANIM.dur.fade,
      useNativeDriver: true,
    }),
    Animated.timing(vals.fillScale, {
      toValue: 0,
      duration: CHECK_ANIM.dur.uncheckAll,
      useNativeDriver: true,
    }),
  ]).start(({ finished }) => {
    if (finished && onEnd) onEnd();
  });
}
