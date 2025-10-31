// // src/constants/touch.ts
// import { v, vs } from "../utils/size";

// /** Default hit-slop padding around small touch targets */
// export const TOUCH_SLOP = {
//   top: vs(12),
//   bottom: vs(12),
//   left: v(12),
//   right: v(12),
// } as const;

// /** Larger hit-slop padding for bigger buttons or gesture zones */
// export const TOUCH_SLOP_LARGE = {
//   top: vs(16),
//   bottom: vs(16),
//   left: v(16),
//   right: v(16),
// } as const;

// export type HitSlop = typeof TOUCH_SLOP;
// src/constants/touch.ts
import { v, vs } from "../utils/size";

/** Default hit-slop padding around small touch targets */
export const TOUCH_SLOP = {
  top: vs(12),
  bottom: vs(12),
  left: v(12),
  right: v(12),
} as const;

/** Larger hit-slop padding for bigger buttons or gesture zones */
export const TOUCH_SLOP_LARGE = {
  top: vs(16),
  bottom: vs(16),
  left: v(16),
  right: v(16),
} as const;

/** Default press-retention offset (how far the finger can move and still count as a press) */
export const PRESS_RECT = {
  top: vs(20),
  bottom: vs(20),
  left: v(20),
  right: v(20),
} as const;

/** Larger press-retention offset for bigger buttons or draggable zones */
export const PRESS_RECT_LARGE = {
  top: vs(28),
  bottom: vs(28),
  left: v(28),
  right: v(28),
} as const;

export type HitSlop = typeof TOUCH_SLOP;
export type PressRect = typeof PRESS_RECT;
