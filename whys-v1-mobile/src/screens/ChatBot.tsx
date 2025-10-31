
// // src/screens/ChatScreen.tsx
// import React, { useMemo, useRef, useState, useEffect, useCallback } from "react";
// import {
//   View, Text, StyleSheet, FlatList, TextInput,
//   KeyboardAvoidingView, Platform, Animated, Keyboard,
// } from "react-native";
// import type { StyleProp, ViewStyle } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import { useSafeAreaInsets } from "react-native-safe-area-context";
// import { v, vs } from "../utils/size";
// import { colors } from "../constants/colors";

// // 👇 import the JSON from assets
// import rawChats from "../assets/chats.json";

// type Msg = { id: string; text: string; from: "me" | "bot"; ts: number };

// // Hydrate JSON (no timestamps/ids) → Msg[]
// function hydrateSeed(json: Array<{ text: string; from: "me" | "bot" }>): Msg[] {
//   const start = Date.now() - json.length * 20_000; // 20s apart in the past
//   return json.map((m, i) => ({
//     id: `${m.from}-${start + i}`,
//     text: m.text,
//     from: m.from,
//     ts: start + i * 20_000,
//   }));
// }

// const initialSeed: Msg[] = hydrateSeed(rawChats as Array<{ text: string; from: "me" | "bot" }>);

// export default function ChatScreen() {
//   const [messages, setMessages] = useState<Msg[]>(initialSeed);
//   const [draft, setDraft] = useState("");
//   const [composerH, setComposerH] = useState(vs(56));
//   const insets = useSafeAreaInsets();
//   const listRef = useRef<FlatList<Msg>>(null);

//   // Keep canonical order: oldest → newest
//   const data = useMemo(() => [...messages].sort((a, b) => a.ts - b.ts), [messages]);

//   const bottomInset = composerH + (insets.bottom || 0) + vs(6);

//   // Initial jump to bottom once (with inverted list, offset 0 is the bottom)
//   useEffect(() => {
//     const t = setTimeout(() => {
//       if (data.length > 0) {
//         listRef.current?.scrollToOffset({ offset: 0, animated: false });
//       }
//     }, 600);
//     return () => clearTimeout(t);
//   }, []);

//   // Don't force-scroll on keyboard events (prevents jank)
//   useEffect(() => {
//     const s1 = Keyboard.addListener("keyboardDidShow", () => {});
//     const s2 = Keyboard.addListener("keyboardDidHide", () => {});
//     return () => { s1.remove(); s2.remove(); };
//   }, []);

//   const scrollToBottom = (animated = true) => {
//     if (data.length === 0) return;
//     listRef.current?.scrollToOffset({ offset: 0, animated });
//   };

//   const send = useCallback(() => {
//     const text = draft.trim();
//     if (!text) return;
//     const now = Date.now();

//     setMessages((p) => [...p, { id: `me-${now}`, text, from: "me", ts: now }]);
//     setDraft("");

//     // keep pinned to bottom on my send
//     requestAnimationFrame(() => scrollToBottom(true));

//     // demo bot reply
//     setTimeout(() => {
//       setMessages((p) => [
//         ...p,
//         { id: `bot-${Date.now()}`, text: "Got it! I'll check and get back to you.", from: "bot", ts: Date.now() },
//       ]);
//       // if still at bottom, keep pinned
//       requestAnimationFrame(() => scrollToBottom(true));
//     }, 600);
//   }, [draft]);

//   return (
//     <KeyboardAvoidingView
//       style={{ flex: 1, backgroundColor: "#fff" }}
//       behavior={Platform.select({ ios: "padding", android: "height" })}
//       keyboardVerticalOffset={vs(20)}
//     >
//       {/* Header */}
//       <View style={s.header}>
       
//         <Text style={s.headerTitle}>ChatBot</Text>
//       </View>
//       <View style ={{height:vs(15),backgroundColor:"#fff"}}/>
      
//       {/* Messages — inverted so newest is at the bottom */}
//       <FlatList
//         ref={listRef}
//         data={[...data].reverse()}   // render reversed + inverted to keep newest visually at bottom
//         inverted
//         keyExtractor={(it) => it.id}
//         renderItem={({ item }) => <Bubble msg={item} />}
//         // keep bottom stable when new messages append (ChatGPT-like)
//         maintainVisibleContentPosition={{ minIndexForVisible: 0 }}
//         keyboardShouldPersistTaps="handled"
//         keyboardDismissMode={Platform.OS === "ios" ? "interactive" : "on-drag"}
//         // With inverted, swap paddings: top = space for composer, bottom = space at the (visual) top
//         contentContainerStyle={{
//           paddingHorizontal: v(10),
//           paddingTop: bottomInset,     // reserve space for composer (because inverted)
//           paddingBottom: vs(20),       // a little space at the very top (oldest)
//         }}
//         // optional: load older when user scrolls up (since inverted)
//         // onEndReached={loadOlder}
//         // onEndReachedThreshold={0.2}
//       />

//       {/* Composer */}
//       <View
//         style={[s.composerWrap, { paddingBottom: insets.bottom || 0 }]}
//         onLayout={(e) => setComposerH(e.nativeEvent.layout.height)}
//       >
//         <View style={[s.composer, { minHeight: vs(55) }]}>
//           <Ionicons name="happy-outline" size={v(20)} color={colors.C3} style={{ opacity: 0.9 }} />
//           <TextInput
//             placeholder="Type a message"
//             placeholderTextColor={colors.C3}
//             style={s.input}
//             value={draft}
//             onChangeText={setDraft}
//             onSubmitEditing={send}
//             returnKeyType="send"
//             onFocus={() => requestAnimationFrame(() => scrollToBottom(true))}
//             multiline
//           />
//           <Ionicons
//             name="send"
//             size={v(20)}
//             color={colors.C3}
//             style={{ opacity: draft.trim() ? 0.9 : 0.8 }}
//             onPress={send}
//           />
//         </View>
//       </View>
//     </KeyboardAvoidingView>
//   );
// }

// function Bubble({ msg }: { msg: Msg }) {
//   const isMe = msg.from === "me";
//   const scale = React.useRef(new Animated.Value(1)).current;

//   const bubbleStyle: StyleProp<ViewStyle> = [
//     s.bubble,
//     isMe ? s.bubbleMe : s.bubbleBot,
//     {
//       alignSelf: isMe ? "flex-end" : "flex-start",
//       borderTopLeftRadius: isMe ? v(16) : v(6),
//       borderTopRightRadius: isMe ? v(6) : v(16),
//       transform: [{ scale }],
//     },
//   ];

//   const handlePressIn = () =>
//     Animated.spring(scale, { toValue: 1.04, useNativeDriver: true, speed: 20, bounciness: 6 }).start();
//   const handlePressOut = () =>
//     Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 18, bounciness: 8 }).start();

//   return (
//     <View style={[s.row, { justifyContent: isMe ? "flex-end" : "flex-start" }]}>
//       {!isMe && (
//         <View style={s.avatarDot}>
//           <Ionicons name="logo-octocat" size={v(16)} color={colors.C3} />
//         </View>
//       )}
//       <Animated.View 
//         style={bubbleStyle} 
//         onTouchStart={handlePressIn} 
//         onTouchEnd={handlePressOut}
//         onTouchCancel={handlePressOut}
//       >
//         <Text style={[s.text, isMe ? s.textMe : s.textBot]}>{msg.text}</Text>
//       </Animated.View>
//     </View>
//   );
// }

// const s = StyleSheet.create({
//   header: {
//     height: vs(50),
//     backgroundColor: colors.C1,
//     borderBottomLeftRadius: v(99),
//     borderBottomRightRadius: v(99),
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   headerTitle: {
//     fontSize: v(20), fontWeight: "700", color: "#fff",
//     opacity: 0.65, textAlign: "center",
//   },
//   row: {
//     flexDirection: "row",
//     alignItems: "flex-end",
//     marginBottom: vs(16),
//     gap: v(8),
//   },
//   avatarDot: {
//     width: v(26),
//     height: v(26),
//     borderRadius: v(13),
//     backgroundColor: "rgba(40,71,102,0.1)",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   bubble: {
//     maxWidth: "78%",
//     paddingHorizontal: v(15),
//     paddingVertical: vs(15),
//     borderRadius: v(20),
//   },
//   bubbleMe: {
//     backgroundColor: colors.C2,
//     //opacity:0.9,
//     borderWidth: vs(1),
//     borderColor: "rgba(40,71,102,0.15)",
//   },
//   bubbleBot: {
//     backgroundColor: colors.C4,
//     borderWidth: StyleSheet.hairlineWidth,
//     borderColor: "rgba(40,71,102,0.15)",
//   },
//   text: { fontSize: v(14), lineHeight: vs(20) },
//   textMe: { color: "BLACK", fontWeight: "600",opacity:0.5},
//   textBot: { color: "BLACK",fontWeight: "600",opacity:0.5 },
//   composerWrap: {
//     paddingHorizontal: v(12),
//     paddingTop: vs(6),
//     backgroundColor: "#fff",
//   },
//   composer: {
//     borderRadius: v(25),
//     backgroundColor: colors.C4,
//     borderWidth: StyleSheet.hairlineWidth,
//     borderColor: "rgba(40,71,102,0.15)",
//     flexDirection: "row",
//     alignItems: "center",
//     paddingHorizontal: v(14),
//     gap: v(10),
//     shadowColor: "#000",
//     shadowOpacity: 0.12,
//     shadowRadius: v(10),
//     shadowOffset: { width: 0, height: vs(6) },
//     elevation: 6,
//   },
//   input: {
//     flex: 1,
//     color: colors.C3,
//     fontSize: v(14),
//     paddingVertical: Platform.OS === "ios" ? vs(10) : 0,
//   },
// });
// src/screens/ChatScreen.tsx
import React, { useMemo, useRef, useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  RefreshControl,
  Dimensions,
} from "react-native";
import type { StyleProp, ViewStyle, ViewToken } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FlashList, ListRenderItemInfo } from "@shopify/flash-list";
import type { FlashListRef } from "@shopify/flash-list";
import { v, vs } from "../utils/size";
import { colors } from "../constants/colors";

// 👇 import the JSON from assets
import rawChats from "../assets/chats.json";

type Msg = { id: string; text: string; from: "me" | "bot"; ts: number };

// Hydrate JSON (no timestamps/ids) → Msg[]
function hydrateSeed(json: Array<{ text: string; from: "me" | "bot" }>): Msg[] {
  const start = Date.now() - json.length * 20_000; // 20s apart in the past
  return json.map((m, i) => ({
    id: `${m.from}-${start + i}`,
    text: m.text,
    from: m.from,
    ts: start + i * 20_000,
  }));
}

const initialSeed: Msg[] = hydrateSeed(rawChats as Array<{ text: string; from: "me" | "bot" }>);
const { height: SCREEN_H } = Dimensions.get("window");

const fmtDate = (ts: number) =>
  new Date(ts).toLocaleDateString(undefined, { month: "short", day: "numeric" }); // Month + Day

export default function ChatScreen() {
  const [messages, setMessages] = useState<Msg[]>(initialSeed); // full history (oldest→newest)
  const [visibleData, setVisibleData] = useState<Msg[]>([]);    // start BLANK; user pulls/scrolls to load
  const [draft, setDraft] = useState("");
  const [composerH, setComposerH] = useState(vs(56));
  const [stickyDate, setStickyDate] = useState<string>("");
  const [refreshing, setRefreshing] = useState(false);
  const insets = useSafeAreaInsets();
  const listRef = useRef<FlashListRef<Msg>>(null);

  // Oldest → newest canonical order
  const data = useMemo(() => [...messages].sort((a, b) => a.ts - b.ts), [messages]);
  const bottomInset = composerH + (insets.bottom || 0) + vs(6);

  // Don’t force-scroll on keyboard (prevents jank)
  useEffect(() => {
    const s1 = Keyboard.addListener("keyboardDidShow", () => {});
    const s2 = Keyboard.addListener("keyboardDidHide", () => {});
    return () => { s1.remove(); s2.remove(); };
  }, []);

  // Reveal older messages in chunks from the TOP (start)
  const CHUNK = 40;
  const loadOlder = useCallback(() => {
    if (visibleData.length >= data.length) return;
    const want = Math.min(data.length, visibleData.length + CHUNK);
    setVisibleData(data.slice(-want)); // take last N (oldest→newest)
  }, [data, visibleData.length]);

  // Pull-to-refresh to load from a blank screen too
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    requestAnimationFrame(() => {
      loadOlder();
      setRefreshing(false);
    });
  }, [loadOlder]);

  // Send message (append to both so it appears immediately)
  const send = useCallback(() => {
    const text = draft.trim();
    if (!text) return;
    const now = Date.now();
    const me: Msg = { id: `me-${now}`, text, from: "me", ts: now };

    setMessages((p) => [...p, me]);
    setVisibleData((p) => [...p, me]);
    setDraft("");

    // demo bot reply
    setTimeout(() => {
      const bot: Msg = {
        id: `bot-${Date.now()}`,
        text: "Got it! I'll check and get back to you.",
        from: "bot",
        ts: Date.now(),
      };
      setMessages((p) => [...p, bot]);
      setVisibleData((p) => [...p, bot]);
    }, 600);
  }, [draft]);

  // Sticky date (from topmost visible item; ViewToken is not generic)
  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: Array<ViewToken> }) => {
      if (!viewableItems?.length) return;
      const first = viewableItems[0]?.item as Msg | undefined;
      if (first) setStickyDate(fmtDate(first.ts));
    }
  ).current;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#fff" }}
      behavior={Platform.select({ ios: "padding", android: "height" })}
      keyboardVerticalOffset={vs(20)}
    >
      {/* Header */}
      <View style={s.header}>
        <Text style={s.headerTitle}>ChatBot</Text>
      </View>
      <View style={{ height: vs(15), backgroundColor: "#fff" }} />

      {/* Center sticky date (Month + Day) */}
      {stickyDate ? (
        <View pointerEvents="none" style={[s.stickyDateWrap, { top: vs(58) }]}>
          <View style={s.stickyDatePill}>
            <Text style={s.stickyDateText}>{stickyDate}</Text>
          </View>
        </View>
      ) : null}

      {/* Messages — FlashList v2 (no inversion) */}
      <FlashList
        ref={listRef}
        data={visibleData}
        keyExtractor={(it) => it.id}
        renderItem={({ item, index }: ListRenderItemInfo<Msg>) => {
          const prev = visibleData[index - 1];
          const showDateChip =
            !prev || new Date(prev.ts).toDateString() !== new Date(item.ts).toDateString();
          return (
            <View>
              {showDateChip && (
                <View style={s.inlineDateWrap}>
                  <Text style={s.inlineDateText}>{fmtDate(item.ts)}</Text>
                </View>
              )}
              <Bubble msg={item} />
            </View>
          );
        }}
        maintainVisibleContentPosition={{
          startRenderingFromBottom: true,
          autoscrollToBottomThreshold: 100,
        }}
        onStartReached={loadOlder}
        onStartReachedThreshold={0.1}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ itemVisiblePercentThreshold: 55 }}
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: v(10),
          paddingTop: vs(20),
          paddingBottom: bottomInset,
          minHeight: SCREEN_H * 0.6,
        }}
        ListEmptyComponent={
          <View style={s.emptyWrap}>
            <Text style={s.emptyTitle}>No messages yet</Text>
            <Text style={s.emptySub}>Pull down to load previous chat</Text>
          </View>
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.C3}
            title="Loading previous…"
          />
        }
      />

      {/* Composer */}
      <View
        style={[s.composerWrap, { paddingBottom: insets.bottom || 0 }]}
        onLayout={(e) => setComposerH(e.nativeEvent.layout.height)}
      >
        <View style={[s.composer, { minHeight: vs(55) }]}>
          <Ionicons name="happy-outline" size={v(20)} color={colors.C3} style={{ opacity: 0.9 }} />
          <TextInput
            placeholder="Type a message"
            placeholderTextColor={colors.C3}
            style={s.input}
            value={draft}
            onChangeText={setDraft}
            onSubmitEditing={send}
            returnKeyType="send"
            multiline
            blurOnSubmit={false}
            onKeyPress={(e: any) => {
              if (e.nativeEvent.key === "Enter" && !e.nativeEvent.shiftKey) {
                e.preventDefault?.();
                send();
              }
            }}
            onFocus={() =>
              requestAnimationFrame(() => listRef.current?.scrollToOffset({ offset: 0, animated: true }))
            }
          />
          <Ionicons
            name="send"
            size={v(20)}
            color={colors.C3}
            style={{ opacity: draft.trim() ? 0.9 : 0.8 }}
            onPress={send}
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

function Bubble({ msg }: { msg: Msg }) {
  const isMe = msg.from === "me";

  const bubbleStyle: StyleProp<ViewStyle> = [
    s.bubble,
    isMe ? s.bubbleMe : s.bubbleBot,
    {
      alignSelf: isMe ? "flex-end" : "flex-start",
      borderTopLeftRadius: isMe ? v(16) : v(6),
      borderTopRightRadius: isMe ? v(6) : v(16),
      // no transform/scale, no minHeight
    },
  ];

  return (
    <View style={[s.row, { justifyContent: isMe ? "flex-end" : "flex-start" }]}>
      {!isMe && (
        <View style={s.avatarDot}>
          <Ionicons name="logo-octocat" size={v(16)} color={colors.C3} />
        </View>
      )}
      <View style={bubbleStyle}>
        <Text style={[s.text, isMe ? s.textMe : s.textBot]}>{msg.text}</Text>
      </View>
    </View>
  );
}

/* ---------------------- YOUR ORIGINAL STYLES (kept as-is) ---------------------- */
const s = StyleSheet.create({
  header: {
    height: vs(50),
    backgroundColor: colors.C1,
    borderBottomLeftRadius: v(99),
    borderBottomRightRadius: v(99),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: v(20), fontWeight: "700", color: "#fff",
    opacity: 0.65, textAlign: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: vs(16),
    gap: v(8),
  },
  avatarDot: {
    width: v(26),
    height: v(26),
    borderRadius: v(13),
    backgroundColor: "rgba(40,71,102,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  bubble: {
    maxWidth: "78%",
    paddingHorizontal: v(15),
    paddingVertical: vs(15),
    borderRadius: v(20),
  },
  bubbleMe: {
    backgroundColor: colors.C2,
    //opacity:0.9,
    borderWidth: vs(1),
    borderColor: "rgba(40,71,102,0.15)",
  },
  bubbleBot: {
    backgroundColor: colors.C4,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(40,71,102,0.15)",
  },
  text: { fontSize: v(14), lineHeight: vs(20) },
  textMe: { color: "BLACK", fontWeight: "600", opacity: 0.5 },
  textBot: { color: "BLACK", fontWeight: "600", opacity: 0.5 },
  composerWrap: {
    paddingHorizontal: v(12),
    paddingTop: vs(6),
    backgroundColor: "#fff",
  },
  composer: {
    borderRadius: v(25),
    backgroundColor: colors.C4,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(40,71,102,0.15)",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: v(14),
    gap: v(10),
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: v(10),
    shadowOffset: { width: 0, height: vs(6) },
    elevation: 6,
  },
  input: {
    flex: 1,
    color: colors.C3,
    fontSize: v(14),
    paddingVertical: Platform.OS === "ios" ? vs(10) : 0,
  },

  // ⬇️ Added styles for center sticky date + inline date chip + empty state
  stickyDateWrap: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 10,
  },
  stickyDatePill: {
    paddingHorizontal: v(12),
    paddingVertical: vs(6),
    backgroundColor: "rgba(40,71,102,0.08)",
    borderRadius: v(14),
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(40,71,102,0.18)",
  },
  stickyDateText: {
    fontSize: v(12),
    color: colors.C3,
    fontWeight: "600",
    opacity: 0.85,
  },
  inlineDateWrap: {
    alignSelf: "center",
    paddingVertical: vs(8),
  },
  inlineDateText: {
    fontSize: v(11),
    color: colors.C3,
    opacity: 0.6,
  },
  emptyWrap: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: vs(40),
  },
  emptyTitle: {
    fontSize: v(16),
    fontWeight: "700",
    color: colors.C3,
    opacity: 0.9,
  },
  emptySub: {
    marginTop: vs(6),
    fontSize: v(12),
    color: colors.C3,
    opacity: 0.65,
  },
});
