// utils/scale.ts
import { Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

// Tune these to your design baseline (iPhone X-ish)
const BASE_WIDTH = 375;
const BASE_HEIGHT = 812;

/** width-based scale (good for horizontal sizes, font sizes, icons) */
export const v = (size: number) => (width / BASE_WIDTH) * size;

/** height-based scale (good for vertical spacings/heights) */
export const vs = (size: number) => (height / BASE_HEIGHT) * size;
