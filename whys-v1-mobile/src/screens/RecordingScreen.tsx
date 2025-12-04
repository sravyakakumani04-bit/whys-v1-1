// // src/screens/RecordingScreen.tsx
// import React, { useEffect, useMemo, useRef, useState } from "react";
// import {
//   View, Text, StyleSheet, Pressable, Animated, Easing,
//   Platform, LayoutAnimation, UIManager, PanResponder,
// } from "react-native";
// import { MaterialIcons, Ionicons } from "@expo/vector-icons";
// import { Audio } from "expo-av";
// import { v, vs } from "../utils/size";
// import { colors } from "../constants/colors";

// if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
//   UIManager.setLayoutAnimationEnabledExperimental(true);
// }

// type RecState = "idle" | "recording" | "stopping" | "error";

// /* -------------------------- Swipe-to-Stop control -------------------------- */
// function SwipeToStop({
//   width = v(300),
//   height = vs(48),
//   onComplete,
//   disabled,
// }: { width?: number; height?: number; onComplete: () => void; disabled?: boolean }) {
//   const trackRadius = height / 2;
//   const maxX = width - height;
//   const x = useRef(new Animated.Value(0)).current;
//   const fill = x.interpolate({ inputRange: [0, maxX], outputRange: [0, 1] });
//   const reset = () => Animated.spring(x, { toValue: 0, useNativeDriver: false, bounciness: 6 }).start();

//   const pan = useRef(
//     PanResponder.create({
//       onStartShouldSetPanResponder: () => !disabled,
//       onMoveShouldSetPanResponder: () => !disabled,
//       onPanResponderMove: (_, g) => { if (!disabled) x.setValue(Math.max(0, Math.min(maxX, g.dx))); },
//       onPanResponderRelease: (_, g) => {
//         const nx = Math.max(0, Math.min(maxX, g.dx));
//         if (nx > maxX * 0.62) {
//           Animated.timing(x, { toValue: maxX, duration: 150, easing: Easing.out(Easing.quad), useNativeDriver: false })
//             .start(() => onComplete());
//         } else reset();
//       },
//       onPanResponderTerminate: reset,
//     })
//   ).current;

//   const shimmer = useRef(new Animated.Value(0)).current;
//   useEffect(() => {
//     Animated.loop(
//       Animated.sequence([
//         Animated.timing(shimmer, { toValue: 1, duration: 1200, useNativeDriver: true }),
//         Animated.timing(shimmer, { toValue: 0, duration: 1200, useNativeDriver: true }),
//       ])
//     ).start();
//   }, [shimmer]);

//   return (
//     <View style={{ width, alignItems: "center" }}>
//       <View style={[styles.sliderTrack, { width, height, borderRadius: trackRadius, backgroundColor: "#E9EDF2" }]}>
//         <Animated.View
//           style={[StyleSheet.absoluteFillObject, { borderRadius: trackRadius, width: Animated.multiply(fill, width), backgroundColor: colors.C2 }]}
//         />
//         <Animated.View
//           {...pan.panHandlers}
//           style={[
//             styles.sliderThumb,
//             {
//               width: height, height, borderRadius: trackRadius, transform: [{ translateX: x }],
//               backgroundColor: colors.C3, shadowColor: colors.C3,
//               shadowOpacity: Platform.OS === "ios" ? 0.25 : 0.5, shadowRadius: v(10),
//               shadowOffset: { width: 0, height: vs(6) }, elevation: 5,
//             },
//           ]}
//         >
//           <Ionicons name="stop" size={v(16)} color="#fff" />
//         </Animated.View>
//         <Animated.Text
//           style={[
//             styles.sliderHint,
//             { transform: [{ translateX: shimmer.interpolate({ inputRange: [0, 1], outputRange: [0, v(8)] }) }] },
//           ]}
//         >
//           Swipe to stop & save ⟶
//         </Animated.Text>
//       </View>
//     </View>
//   );
// }

// /* ------------------------------- Helpers ---------------------------------- */
// function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }
// function lerpColor(hex1: string, hex2: string, t: number) {
//   const p = (h: string) => h.replace("#", "");
//   const n = (h: string, i: number) => parseInt(p(h).slice(i, i + 2), 16);
//   const r = Math.round(lerp(n(hex1, 0), n(hex2, 0), t));
//   const g = Math.round(lerp(n(hex1, 2), n(hex2, 2), t));
//   const b = Math.round(lerp(n(hex1, 4), n(hex2, 4), t));
//   return `rgb(${r},${g},${b})`;
// }

// /** Build a nice “clustered peaks” envelope (two main humps + center hint). */
// function buildEnvelope(count: number) {
//   const peaks = [0.33, 0.66, 0.5]; // left, right, subtle center
//   const widths = [0.12, 0.12, 0.06];
//   const amps = [1.0, 1.0, 0.5];
//   const arr = new Array(count).fill(0).map((_, i) => {
//     const x = i / (count - 1);
//     let v = 0.12; // base level
//     for (let k = 0; k < peaks.length; k++) {
//       const d = (x - peaks[k]) / widths[k];
//       v += amps[k] * Math.exp(-0.5 * d * d);
//     }
//     return Math.min(1, v);
//   });
//   return arr;
// }

// /** Build per-bar visual spec: variable width + gradient color. */
// function buildBarSpec(count: number) {
//   const specs = [];
//   const left = colors.C2;      // deep blue
//   const right = colors.C1;     // cyan-ish
//   for (let i = 0; i < count; i++) {
//     const t = i / (count - 1);
//     const width = v(3) + (i % 4 === 0 ? v(2) : 0); // every 4th a bit wider
//     const color = lerpColor(left, right, t);
//     const margin = v(5); // spacing between bars
//     specs.push({ width, color, margin });
//   }
//   return specs;
// }

// /* -------------------------------- Screen ---------------------------------- */
// export default function RecordingScreen() {
//   const [recState, setRecState] = useState<RecState>("idle");
//   const [permission, setPermission] = useState<boolean | null>(null);
//   const [timerMs, setTimerMs] = useState(0);
//   const [fileUri, setFileUri] = useState<string | null>(null);
//   const [tipsOpen, setTipsOpen] = useState(true);

//   const recordingRef = useRef<Audio.Recording | null>(null);
//   const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

//   // --- Waveform setup like the reference image ---
//   const BAR_COUNT = 30;
//   const bars = useMemo(() => Array.from({ length: BAR_COUNT }, () => new Animated.Value(0.35)), []);
//   const ENVELOPE = useMemo(() => buildEnvelope(BAR_COUNT), [BAR_COUNT]);
//   const SPEC = useMemo(() => buildBarSpec(BAR_COUNT), [BAR_COUNT]);

//   // subtle border pulse for record pad
//   const padPulse = useRef(new Animated.Value(0)).current;

//   useEffect(() => {
//     (async () => {
//       const { status } = await Audio.requestPermissionsAsync();
//       setPermission(status === "granted");
//       await Audio.setAudioModeAsync({
//         allowsRecordingIOS: true,
//         playsInSilentModeIOS: true,
//         interruptionModeIOS: 1,
//         shouldDuckAndroid: true,
//       });
//     })();
//     return () => { cleanupTimers(); stopAndUnload().catch(() => {}); };
//   }, []);

//   useEffect(() => {
//     if (recState === "recording") {
//       Animated.loop(Animated.timing(padPulse, { toValue: 1, duration: 1100, useNativeDriver: false })).start();
//     } else { padPulse.stopAnimation(); padPulse.setValue(0); }
//   }, [recState, padPulse]);

//   // Drive the waveform: random jitter modulated by the envelope (gives clustered peaks)
//   useEffect(() => {
//     let raf: number | null = null;
//     const step = () => {
//       if (recState !== "recording") return;
//       bars.forEach((b, i) => {
//         const env = ENVELOPE[i];
//         const amp = 0.45 + Math.random() * 0.45; // 0.25..1.0
//         const target = Math.min(1, env * amp);
//         Animated.timing(b, {
//           toValue: target,
//           duration: 140 + ((i * 13) % 120),
//           easing: Easing.out(Easing.quad),
//           useNativeDriver: false,
//         }).start();
//       });
//       raf = requestAnimationFrame(step);
//     };
//     if (recState === "recording") step();
//     else bars.forEach((b) => Animated.timing(b, { toValue: 0.25, duration: 200, useNativeDriver: false }).start());
//     return () => { if (raf) cancelAnimationFrame(raf); };
//   }, [recState, bars, ENVELOPE]);

//   const startTimer = () => {
//     const t0 = Date.now();
//     intervalRef.current = setInterval(() => setTimerMs(Date.now() - t0), 100);
//   };
//   const cleanupTimers = () => { if (intervalRef.current) clearInterval(intervalRef.current); intervalRef.current = null; };
//   const fmt = (ms: number) => {
//     const s = Math.floor(ms / 1000), m = Math.floor(s / 60), ss = s % 60, cs = Math.floor((ms % 1000) / 10);
//     return `${String(m).padStart(2, "0")}:${String(ss).padStart(2, "0")}.${String(cs).padStart(2, "0")}`;
//   };

//   const beginRecording = async () => {
//     if (!permission) { setRecState("error"); return; }
//     try {
//       setRecState("recording"); setFileUri(null); setTimerMs(0);
//       const rec = new Audio.Recording();
//       await rec.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
//       await rec.startAsync();
//       recordingRef.current = rec;
//       startTimer();
//     } catch { setRecState("error"); }
//   };

//   const stopAndUnload = async () => {
//     const rec = recordingRef.current;
//     if (!rec) return;
//     try {
//       await rec.stopAndUnloadAsync();
//       const uri = rec.getURI();
//       if (uri) setFileUri(uri);
//     } finally { recordingRef.current = null; }
//   };

//   const endRecording = async () => {
//     setRecState("stopping"); cleanupTimers(); await stopAndUnload(); setRecState("idle");
//   };

//   const onToggleTips = () => {
//     LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
//     setTipsOpen((s) => !s);
//   };

//   const borderColor = padPulse.interpolate({ inputRange: [0, 1], outputRange: ["#E6EBF2", colors.C3] });

//   return (
//     <View style={styles.screen}>
//       {/* Header */}
//       <View style={styles.header}>
//         <Text style={styles.title}>New Session</Text>
//         <Pressable style={styles.tipsToggle} onPress={onToggleTips}>
//           <Ionicons name={tipsOpen ? "chevron-up" : "chevron-down"} size={v(18)} color={colors.C3} />
//           <Text style={styles.tipsToggleText}>{tipsOpen ? "Hide tips" : "Show tips"}</Text>
//         </Pressable>
//       </View>

//       {/* Tips */}
//       {tipsOpen && (
//         <View style={styles.tipsCard}>
//           <View style={styles.tipRow}>
//             <MaterialIcons name="record-voice-over" size={v(18)} color={colors.C3} />
//             <Text style={styles.tipText}>Tap the card to start. While recording, swipe the pill to the right to stop & save.</Text>
//           </View>
//           <View style={styles.tipRow}>
//             <Ionicons name="ear-outline" size={v(18)} color={colors.C3} />
//             <Text style={styles.tipText}>Speak clearly; avoid covering the mic area.</Text>
//           </View>
//           <View style={styles.tipRow}>
//             <Ionicons name="wifi" size={v(18)} color={colors.C3} />
//             <Text style={styles.tipText}>Stay online to auto-upload after saving.</Text>
//           </View>
//         </View>
//       )}

//       {/* Record Pad */}
//       <Pressable
//         android_ripple={{ color: "#00000010", borderless: false }}
//         onPress={recState === "idle" ? beginRecording : undefined}
//         style={({ pressed }) => [styles.pad, { opacity: recState === "idle" && pressed ? 0.95 : 1 }]}
//       >
//         <Animated.View style={[styles.padInner, { borderColor }]}>
//           {recState === "idle" ? (
//             <>
//               <MaterialIcons name="record-voice-over" size={v(26)} color={colors.C3} />
//               <Text style={styles.padTitle}>Tap to start your session</Text>
//               <Text style={styles.padSub}>We’ll capture audio and show a live waveform.</Text>
//             </>
//           ) : (
//             <>
//               <Text style={styles.liveBadge}>LIVE</Text>
//               <Text style={styles.timer}>{fmt(timerMs)}</Text>

//               {/* ---- Mirrored gradient waveform (like the image) ---- */}
//               <View style={styles.waveWrap}>
//                 {bars.map((b, i) => {
//                   const halfHeight = b.interpolate({ inputRange: [0, 1], outputRange: [vs(4), vs(80)] });
//                   const spec = SPEC[i];
//                   const radius = spec.width / 2;
//                   return (
//                     <View key={i} style={{ width: spec.width, alignItems: "center", marginHorizontal: spec.margin / 2 }}>
//                       <Animated.View style={[styles.barHalf, { height: halfHeight, width: spec.width, borderRadius: radius, backgroundColor: spec.color }]} />
//                       <View style={[styles.midline, { width: spec.width }]} />
//                       <Animated.View style={[styles.barHalf, { height: halfHeight, width: spec.width, borderRadius: radius, backgroundColor: spec.color }]} />
//                     </View>
//                   );
//                 })}
//               </View>
//             </>
//           )}
//         </Animated.View>
//       </Pressable>

//       {/* Status / saved path */}
//       <View style={{ alignItems: "center", marginTop: vs(10) }}>
//         <View style={styles.statusRow}>
//           <View style={[styles.dot, recState === "recording" ? styles.dotActive : undefined]} />
//           <Text style={styles.statusText}>
//             {recState === "recording" ? "Recording…" : recState === "stopping" ? "Saving…" : recState === "error" ? "Mic permission required" : "Ready"}
//           </Text>
//         </View>
//         {fileUri ? <Text style={styles.fileText} numberOfLines={1}>Saved: {fileUri.replace("file://", "")}</Text> : null}
//       </View>

//       {/* Swipe-to-Stop */}
//       {recState === "recording" && (
//         <View style={{ marginTop: vs(18) }}>
//           <SwipeToStop onComplete={endRecording} />
//           <Text style={styles.helperText}>Drag the pill to the right to finish</Text>
//         </View>
//       )}

//       {/* Footer */}
//       <View style={styles.footer}>
//         <Pressable disabled={recState !== "idle" || !fileUri} style={[styles.footerBtn, { opacity: recState === "idle" && fileUri ? 1 : 0.5 }]} onPress={() => setFileUri(null)}>
//           <Ionicons name="trash-outline" size={v(16)} color="#fff" />
//           <Text style={styles.footerBtnText}>Discard</Text>
//         </Pressable>
//         <Pressable disabled={recState !== "idle" || !fileUri} style={[styles.footerBtnPrimary, { opacity: recState === "idle" && fileUri ? 1 : 0.5 }]} onPress={() => { /* navigate or upload */ }}>
//           <Ionicons name="cloud-upload-outline" size={v(16)} color="#fff" />
//           <Text style={styles.footerBtnText}>Use & Upload</Text>
//         </Pressable>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   screen: { flex: 1, backgroundColor: "#fff", paddingTop: vs(18), paddingHorizontal: v(16) },
//   header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: vs(8) },
//   title: { fontSize: v(18), fontWeight: "600", color: colors.C3 },
//   tipsToggle: { flexDirection: "row", alignItems: "center", gap: v(6), padding: v(6) },
//   tipsToggleText: { color: colors.C3, fontSize: v(12) },

//   tipsCard: { backgroundColor: colors.C2, borderRadius: v(14), paddingVertical: vs(10), paddingHorizontal: v(12), marginBottom: vs(10) },
//   tipRow: { flexDirection: "row", alignItems: "center", gap: v(10), paddingVertical: vs(4) },
//   tipText: { flex: 1, color: colors.C3, fontSize: v(12), lineHeight: vs(16) },

//   pad: { marginTop: vs(6) },
//   padInner: {
//     borderWidth: v(2), borderColor: "#E6EBF2", backgroundColor: "#FAFBFD",
//     borderRadius: v(18), paddingVertical: vs(24), paddingHorizontal: v(16),
//     alignItems: "center", justifyContent: "center", gap: vs(8),
//   },
//   padTitle: { fontSize: v(16), fontWeight: "600", color: colors.C3, textAlign: "center" },
//   padSub: { fontSize: v(12), color: "#6B7788", textAlign: "center" },

//   liveBadge: { color: "#fff", backgroundColor: "#E53935", fontSize: v(10), paddingHorizontal: v(8), paddingVertical: vs(2), borderRadius: v(10), overflow: "hidden" },
//   timer: { fontVariant: ["tabular-nums"], color: colors.C3, fontSize: v(28), fontWeight: "700", letterSpacing: 0.5 },

//   /* Mirrored gradient waveform */
//   waveWrap: { flexDirection: "row", alignItems: "center", justifyContent: "center", height: vs(140), marginTop: vs(8) },
//   barHalf: { backgroundColor: colors.C3, opacity: 0.96 },
//   midline: { height: Math.max(1, StyleSheet.hairlineWidth * 2), backgroundColor: "#D9E0E8", marginVertical: vs(2) },

//   statusRow: { marginTop: vs(6), flexDirection: "row", alignItems: "center", gap: v(6) },
//   dot: { width: v(8), height: v(8), borderRadius: v(4), backgroundColor: "#C8CDD4" },
//   dotActive: { backgroundColor: "#E53935" },
//   statusText: { color: "#556270", fontSize: v(12) },
//   fileText: { marginTop: vs(4), color: "#7A8899", fontSize: v(11), maxWidth: "90%" },

//   sliderTrack: { justifyContent: "center", overflow: "hidden", borderWidth: StyleSheet.hairlineWidth, borderColor: "#D9E0E8" },
//   sliderThumb: { alignItems: "center", justifyContent: "center", position: "absolute", left: 0, top: 0 },
//   sliderHint: { position: "absolute", alignSelf: "center", fontSize: v(12), color: "#445266" },

//   helperText: { marginTop: vs(8), color: "#6B7788", fontSize: v(12), textAlign: "center" },

//   footer: { marginTop: "auto", marginBottom: vs(12), flexDirection: "row", justifyContent: "space-between", gap: v(10) },
//   footerBtn: { flex: 1, backgroundColor: "#B0B7BF", borderRadius: v(12), paddingVertical: vs(12), alignItems: "center", justifyContent: "center", flexDirection: "row", gap: v(8) },
//   footerBtnPrimary: { flex: 1, backgroundColor: colors.C3, borderRadius: v(12), paddingVertical: vs(12), alignItems: "center", justifyContent: "center", flexDirection: "row", gap: v(8) },
//   footerBtnText: { color: "#fff", fontSize: v(13), fontWeight: "600" },
// });
// src/screens/RecordingScreen.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View, Text, StyleSheet, Pressable, Animated, Easing,
  Platform, LayoutAnimation, UIManager, PanResponder,
} from "react-native";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { Audio } from "expo-av";
import { v, vs } from "../utils/size";
import { colors } from "../constants/colors";

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type RecState = "idle" | "recording" | "stopping" | "error";

/* -------------------------- Swipe-to-Stop control -------------------------- */
function SwipeToStop({
  width = v(300),
  height = vs(48),
  onComplete,
  disabled,
}: { width?: number; height?: number; onComplete: () => void; disabled?: boolean }) {
  const trackRadius = height / 2;
  const maxX = width - height;
  const x = useRef(new Animated.Value(0)).current;
  const fill = x.interpolate({ inputRange: [0, maxX], outputRange: [0, 1] });
  const reset = () => Animated.spring(x, { toValue: 0, useNativeDriver: false, bounciness: 6 }).start();

  const pan = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !disabled,
      onMoveShouldSetPanResponder: () => !disabled,
      onPanResponderMove: (_, g) => { if (!disabled) x.setValue(Math.max(0, Math.min(maxX, g.dx))); },
      onPanResponderRelease: (_, g) => {
        const nx = Math.max(0, Math.min(maxX, g.dx));
        if (nx > maxX * 0.62) {
          Animated.timing(x, { toValue: maxX, duration: 150, easing: Easing.out(Easing.quad), useNativeDriver: false })
            .start(() => onComplete());
        } else reset();
      },
      onPanResponderTerminate: reset,
    })
  ).current;

  const shimmer = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, { toValue: 1, duration: 1200, useNativeDriver: true }),
        Animated.timing(shimmer, { toValue: 0, duration: 1200, useNativeDriver: true }),
      ])
    ).start();
  }, [shimmer]);

  return (
    <View style={{ width, alignItems: "center" }}>
      <View style={[styles.sliderTrack, { width, height, borderRadius: trackRadius, backgroundColor: "#E9EDF2" }]}>
        <Animated.View
          style={[
            StyleSheet.absoluteFillObject,
            {
              borderRadius: trackRadius,
              width: Animated.multiply(fill, width),
              backgroundColor: colors.C2,
            },
          ]}
        />
        <Animated.View
          {...pan.panHandlers}
          style={[
            styles.sliderThumb,
            {
              width: height, height, borderRadius: trackRadius, transform: [{ translateX: x }],
              backgroundColor: colors.C3, shadowColor: colors.C3,
              shadowOpacity: Platform.OS === "ios" ? 0.25 : 0.5, shadowRadius: v(10),
              shadowOffset: { width: 0, height: vs(6) }, elevation: 5,
            },
          ]}
        >
          <Ionicons name="stop" size={v(16)} color="#fff" />
        </Animated.View>
        <Animated.Text
          style={[
            styles.sliderHint,
            { transform: [{ translateX: shimmer.interpolate({ inputRange: [0, 1], outputRange: [0, v(8)] }) }] },
          ]}
        >
          Swipe to stop & save ⟶
        </Animated.Text>
      </View>
    </View>
  );
}

/* ------------------------------- Helpers ---------------------------------- */
function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }
function lerpColor(hex1: string, hex2: string, t: number) {
  const p = (h: string) => h.replace("#", "");
  const n = (h: string, i: number) => parseInt(p(h).slice(i, i + 2), 16);
  const r = Math.round(lerp(n(hex1, 0), n(hex2, 0), t));
  const g = Math.round(lerp(n(hex1, 2), n(hex2, 2), t));
  const b = Math.round(lerp(n(hex1, 4), n(hex2, 4), t));
  return `rgb(${r},${g},${b})`;
}

/** Two big humps + subtle center. */
function buildEnvelope(count: number) {
  const peaks = [0.33, 0.66, 0.5];
  const widths = [0.12, 0.12, 0.06];
  const amps = [1.0, 1.0, 0.5];
  const arr = new Array(count).fill(0).map((_, i) => {
    const x = i / (count - 1);
    let v = 0.12;
    for (let k = 0; k < peaks.length; k++) {
      const d = (x - peaks[k]) / widths[k];
      v += amps[k] * Math.exp(-0.5 * d * d);
    }
    return Math.min(1, v);
  });
  return arr;
}

/** Configurable width + gap + gradient color. */
function buildBarSpec(count: number, gap = v(6), baseWidth = v(3)) {
  const specs: Array<{ width: number; color: string; gap: number }> = [];
  const left = "#1E3A8A";
  const right = "#4CC9F0";
  for (let i = 0; i < count; i++) {
    const t = i / (count - 1);
    const width = baseWidth + (i % 4 === 0 ? v(2) : 0);
    const color = lerpColor(left, right, t);
    specs.push({ width, color, gap });
  }
  return specs;
}

/* -------------------------------- Screen ---------------------------------- */
export default function RecordingScreen() {
  const [recState, setRecState] = useState<RecState>("idle");
  const [permission, setPermission] = useState<boolean | null>(null);
  const [timerMs, setTimerMs] = useState(0);
  const [fileUri, setFileUri] = useState<string | null>(null);
  const [tipsOpen, setTipsOpen] = useState(true);

  const recordingRef = useRef<Audio.Recording | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // --- Waveform setup (amped) ---
  const BAR_COUNT = 20;
  const BAR_GAP = v(6);        // increase for bigger spacing
  const BASE_BAR_WIDTH = v(3); // reduce slightly if gaps overflow the pad

  const bars = useMemo(() => Array.from({ length: BAR_COUNT }, () => new Animated.Value(0.25)), []);
  const ENVELOPE = useMemo(() => buildEnvelope(BAR_COUNT), [BAR_COUNT]);
  const SPEC = useMemo(() => buildBarSpec(BAR_COUNT, BAR_GAP, BASE_BAR_WIDTH), [BAR_COUNT]);

  // border pulse for record pad
  const padPulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    (async () => {
      const { status } = await Audio.requestPermissionsAsync();
      setPermission(status === "granted");
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        interruptionModeIOS: 1,
        shouldDuckAndroid: true,
      });
    })();
    return () => { cleanupTimers(); stopAndUnload().catch(() => {}); };
  }, []);

  useEffect(() => {
    if (recState === "recording") {
      Animated.loop(Animated.timing(padPulse, { toValue: 1, duration: 700, useNativeDriver: false })).start(); // faster pulse
    } else { padPulse.stopAnimation(); padPulse.setValue(0); }
  }, [recState, padPulse]);

  // Drive the waveform: bigger range, faster updates, random bursts/dips
  useEffect(() => {
    let raf: number | null = null;

    const step = () => {
      if (recState !== "recording") return;

      bars.forEach((b, i) => {
        const env = ENVELOPE[i];

        // Wider amplitude: 0.15..1.35, then clamp
        const amp = 0.15 + Math.random() * 1.20;

        // Nonlinear mix for peakier motion
        let target = Math.pow(env, 0.85) * amp;

        // Random spikes and quick dips
        const r = Math.random();
        if (r < 0.07) target = Math.min(1, target * 1.6);   // burst up
        else if (r > 0.94) target = target * 0.25;          // quick dip

        target = Math.max(0, Math.min(1, target));

        // Faster animation, per-bar jitter
        const dur = 60 + ((i * 9) % 90) + Math.floor(Math.random() * 40);
        Animated.timing(b, {
          toValue: target,
          duration: dur,
          easing: Easing.linear,
          useNativeDriver: false,
        }).start();
      });

      raf = requestAnimationFrame(step);
    };

    if (recState === "recording") step();
    else {
      // Gentle flutter at rest (instead of going flat)
      bars.forEach((b, i) => {
        Animated.timing(b, {
          toValue: 0.35 + 0.05 * Math.sin(i),
          duration: 200,
          useNativeDriver: false,
        }).start();
      });
    }

    return () => { if (raf) cancelAnimationFrame(raf); };
  }, [recState, bars, ENVELOPE]);

  const startTimer = () => {
    const t0 = Date.now();
    intervalRef.current = setInterval(() => setTimerMs(Date.now() - t0), 100);
  };
  const cleanupTimers = () => { if (intervalRef.current) clearInterval(intervalRef.current); intervalRef.current = null; };
  const fmt = (ms: number) => {
    const s = Math.floor(ms / 1000), m = Math.floor(s / 60), ss = s % 60, cs = Math.floor((ms % 1000) / 10);
    return `${String(m).padStart(2, "0")}:${String(ss).padStart(2, "0")}.${String(cs).padStart(2, "0")}`;
  };

  const beginRecording = async () => {
    if (!permission) { setRecState("error"); return; }
    try {
      setRecState("recording"); setFileUri(null); setTimerMs(0);
      const rec = new Audio.Recording();
      await rec.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      await rec.startAsync();
      recordingRef.current = rec;
      startTimer();
    } catch { setRecState("error"); }
  };

  const stopAndUnload = async () => {
    const rec = recordingRef.current;
    if (!rec) return;
    try {
      await rec.stopAndUnloadAsync();
      const uri = rec.getURI();
      if (uri) setFileUri(uri);
    } finally { recordingRef.current = null; }
  };

  const endRecording = async () => {
    setRecState("stopping"); cleanupTimers(); await stopAndUnload(); setRecState("idle");
  };

  const onToggleTips = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setTipsOpen((s) => !s);
  };

  const borderColor = padPulse.interpolate({ inputRange: [0, 1], outputRange: ["#E6EBF2", colors.C3] });

  // Map 0..1 to a much bigger pixel range to visibly “fluctuate a lot”
  const barHalfHeight = (b: Animated.Value) =>
    b.interpolate({ inputRange: [0, 1], outputRange: [vs(2), vs(96)] });

  return (
    <View style={styles.screen}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>New Session</Text>
        <Pressable style={styles.tipsToggle} onPress={onToggleTips}>
          <Ionicons name={tipsOpen ? "chevron-up" : "chevron-down"} size={v(18)} color={colors.C3} />
          <Text style={styles.tipsToggleText}>{tipsOpen ? "Hide tips" : "Show tips"}</Text>
        </Pressable>
      </View>

      {/* Tips */}
      {tipsOpen && (
        <View style={styles.tipsCard}>
          <View style={styles.tipRow}>
            <MaterialIcons name="record-voice-over" size={v(18)} color={colors.C3} />
            <Text style={styles.tipText}>Tap the card to start. While recording, swipe the pill to the right to stop & save.</Text>
          </View>
          <View style={styles.tipRow}>
            <Ionicons name="ear-outline" size={v(18)} color={colors.C3} />
            <Text style={styles.tipText}>Speak clearly; avoid covering the mic area.</Text>
          </View>
          <View style={styles.tipRow}>
            <Ionicons name="wifi" size={v(18)} color={colors.C3} />
            <Text style={styles.tipText}>Stay online to auto-upload after saving.</Text>
          </View>
        </View>
      )}

      {/* Record Pad */}
      <Pressable
        android_ripple={{ color: "#00000010", borderless: false }}
        onPress={recState === "idle" ? beginRecording : undefined}
        style={({ pressed }) => [styles.pad, { opacity: recState === "idle" && pressed ? 0.95 : 1 }]}
      >
        <Animated.View style={[styles.padInner, { borderColor }]}>
          {recState === "idle" ? (
            <>
              <MaterialIcons name="record-voice-over" size={v(26)} color={colors.C3} />
              <Text style={styles.padTitle}>Tap to start your session</Text>
              <Text style={styles.padSub}>We’ll capture audio and show a live waveform.</Text>
            </>
          ) : (
            <>
              <Text style={styles.liveBadge}>LIVE</Text>
              <Text style={styles.timer}>{fmt(timerMs)}</Text>

              {/* ---- Mirrored gradient waveform ---- */}
              <View style={styles.waveWrap}>
                {bars.map((b, i) => {
                  const spec = SPEC[i];
                  const halfHeight = barHalfHeight(b);
                  const radius = spec.width / 2;
                  return (
                    <View
                      key={i}
                      style={{
                        width: spec.width,
                        alignItems: "center",
                        marginHorizontal: spec.gap / 2,
                      }}
                    >
                      <Animated.View
                        style={[
                          styles.barHalf,
                          { height: halfHeight, width: spec.width, borderRadius: radius, backgroundColor: spec.color },
                        ]}
                      />
                      <View style={[styles.midline, { width: spec.width }]} />
                      <Animated.View
                        style={[
                          styles.barHalf,
                          { height: halfHeight, width: spec.width, borderRadius: radius, backgroundColor: spec.color },
                        ]}
                      />
                    </View>
                  );
                })}
              </View>
            </>
          )}
        </Animated.View>
      </Pressable>

      {/* Status / saved path */}
      <View style={{ alignItems: "center", marginTop: vs(10) }}>
        <View style={styles.statusRow}>
          <View style={[styles.dot, recState === "recording" ? styles.dotActive : undefined]} />
          <Text style={styles.statusText}>
            {recState === "recording" ? "Recording…" : recState === "stopping" ? "Saving…" : recState === "error" ? "Mic permission required" : "Ready"}
          </Text>
        </View>
        {fileUri ? <Text style={styles.fileText} numberOfLines={1}>Saved: {fileUri.replace("file://", "")}</Text> : null}
      </View>

      {/* Swipe-to-Stop */}
      {recState === "recording" && (
        <View style={{ marginTop: vs(18) }}>
          <SwipeToStop onComplete={endRecording} />
          <Text style={styles.helperText}>Drag the pill to the right to finish</Text>
        </View>
      )}

      {/* Footer */}
      <View style={styles.footer}>
        <Pressable disabled={recState !== "idle" || !fileUri} style={[styles.footerBtn, { opacity: recState === "idle" && fileUri ? 1 : 0.5 }]} onPress={() => setFileUri(null)}>
          <Ionicons name="trash-outline" size={v(16)} color="#fff" />
          <Text style={styles.footerBtnText}>Discard</Text>
        </Pressable>
        <Pressable disabled={recState !== "idle" || !fileUri} style={[styles.footerBtnPrimary, { opacity: recState === "idle" && fileUri ? 1 : 0.5 }]} onPress={() => { /* navigate or upload */ }}>
          <Ionicons name="cloud-upload-outline" size={v(16)} color="#fff" />
          <Text style={styles.footerBtnText}>Use & Upload</Text>
        </Pressable>
      </View>
      
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#fff", paddingTop: vs(18), paddingHorizontal: v(16) },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: vs(8) },
  title: { fontSize: v(18), fontWeight: "600", color: colors.C3 },
  tipsToggle: { flexDirection: "row", alignItems: "center", gap: v(6), padding: v(6) },
  tipsToggleText: { color: colors.C3, fontSize: v(12) },

  tipsCard: { backgroundColor: colors.C2, borderRadius: v(14), paddingVertical: vs(10), paddingHorizontal: v(12), marginBottom: vs(10) },
  tipRow: { flexDirection: "row", alignItems: "center", gap: v(10), paddingVertical: vs(4) },
  tipText: { flex: 1, color: colors.C3, fontSize: v(12), lineHeight: vs(16) },

  pad: { marginTop: vs(6) },
  padInner: {
    borderWidth: v(2), borderColor: "#E6EBF2", backgroundColor: "#FAFBFD",
    borderRadius: v(18), paddingVertical: vs(24), paddingHorizontal: v(16),
    alignItems: "center", justifyContent: "center", gap: vs(8),
  },
  padTitle: { fontSize: v(16), fontWeight: "600", color: colors.C3, textAlign: "center" },
  padSub: { fontSize: v(12), color: "#6B7788", textAlign: "center" },

  liveBadge: { color: "#fff", backgroundColor: "#E53935", fontSize: v(10), paddingHorizontal: v(8), paddingVertical: vs(2), borderRadius: v(10), overflow: "hidden" },
  timer: { fontVariant: ["tabular-nums"], color: colors.C3, fontSize: v(28), fontWeight: "700", letterSpacing: 0.5 },

  /* Mirrored gradient waveform */
  waveWrap: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: vs(140),
    marginTop: vs(8),
    paddingHorizontal: v(8), // helps when gaps are big
  },
  barHalf: { backgroundColor: colors.C3, opacity: 0.96 },
  midline: { height: Math.max(1, StyleSheet.hairlineWidth * 2), backgroundColor: "#D9E0E8", marginVertical: vs(2) },

  statusRow: { marginTop: vs(6), flexDirection: "row", alignItems: "center", gap: v(6) },
  dot: { width: v(8), height: v(8), borderRadius: v(4), backgroundColor: "#C8CDD4" },
  dotActive: { backgroundColor: "#E53935" },
  statusText: { color: "#556270", fontSize: v(12) },
  fileText: { marginTop: vs(4), color: "#7A8899", fontSize: v(11), maxWidth: "90%" },

  sliderTrack: { justifyContent: "center", overflow: "hidden", borderWidth: StyleSheet.hairlineWidth, borderColor: "#D9E0E8" },
  sliderThumb: { alignItems: "center", justifyContent: "center", position: "absolute", left: 0, top: 0 },
  sliderHint: { position: "absolute", alignSelf: "center", fontSize: v(12), color: "#445266" },

  helperText: { marginTop: vs(8), color: "#6B7788", fontSize: v(12), textAlign: "center" },

  footer: { marginTop: "auto", marginBottom: vs(12), flexDirection: "row", justifyContent: "space-between", gap: v(10) },
  footerBtn: { flex: 1, backgroundColor: "#B0B7BF", borderRadius: v(12), paddingVertical: vs(12), alignItems: "center", justifyContent: "center", flexDirection: "row", gap: v(8) },
  footerBtnPrimary: { flex: 1, backgroundColor: colors.C3, borderRadius: v(12), paddingVertical: vs(12), alignItems: "center", justifyContent: "center", flexDirection: "row", gap: v(8) },
  footerBtnText: { color: "#fff", fontSize: v(13), fontWeight: "600" },
});
