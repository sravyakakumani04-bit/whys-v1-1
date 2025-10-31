
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Linking,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { v, vs } from "../utils/size";
import { colors } from "../constants/colors";
import cards from "../assets/Homecards.json"; // <-- static import

type CardItem = {
  id: string;
  title?: string;
  subtitle?: string;
  link?: string;
};

export default function HomeOverviewCarouselJson() {
  const width = v(333);
  const height = vs(158);
  const gap = v(10);
  const intervalMs = 2000;

  const DOT_SIZE = v(6);
  const DOT_ACTIVE = v(9);

  const [data, setData] = useState<CardItem[] | null>(null);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const listRef = useRef<FlatList<CardItem>>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // “Load” JSON (sync, but keep API identical in case you swap later)
  useEffect(() => {
    setLoading(true);
    try {
      setData(cards as CardItem[]);
    } catch {
      setData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-scroll
  useEffect(() => {
    if (!data?.length) return;
    startTimer();
    return stopTimer;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, data]);

  const startTimer = () => {
    stopTimer();
    timerRef.current = setTimeout(() => {
      if (!data?.length) return;
      const next = (index + 1) % data.length;
      scrollTo(next);
    }, intervalMs);
  };
  const stopTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };
  const scrollTo = (i: number) => {
    setIndex(i);
    listRef.current?.scrollToIndex({ index: i, animated: true });
  };
  const onMomentumEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const x = e.nativeEvent.contentOffset.x;
    const slideW = width + gap;
    const i = Math.round(x / slideW);
    setIndex(i);
  };
  const getItemLayout = (_: CardItem[] | null | undefined, i: number) => ({
    length: width + gap,
    offset: (width + gap) * i,
    index: i,
  });
  const onPressCard = (item: CardItem) => {
    if (item.link) Linking.openURL(item.link).catch(() => {});
    else console.log("Pressed:", item.title);
  };

  const onPressDot = (i: number) => {
    stopTimer();
    scrollTo(i);
    startTimer();
  };

  const renderItem = ({ item }: { item: CardItem }) => (
    <Pressable
      onPress={() => onPressCard(item)}
      style={[
        styles.card,
        { width, height, marginRight: gap, borderRadius: v(16), backgroundColor:colors.C4,borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(130,136,93,0.20)"
    
  },
      ]}
    >
      <Text numberOfLines={1} style={styles.title}>{item.title || "undefined "}</Text>
      {!!item.subtitle && <Text numberOfLines={2} style={styles.subtitle}>{item.subtitle}</Text>}
    </Pressable>
  );

  if (loading) {
    return (
      <View style={{ width, height, justifyContent: "flex-start", alignItems: "flex-start" }}>
        <ActivityIndicator color={colors.C3} />
      </View>
    );
  }
  if (!data || data.length === 0) {
    return (
      <View style={[styles.card, { width, height, borderRadius: v(16), backgroundColor: colors.C2 }]}>
        <Text style={styles.title}>No cards</Text>
        <Text style={styles.subtitle}>Add items to home_cards.json</Text>
      </View>
    );
  }

  return (
    // Slightly taller container so the dots can live under the card
    <View style={{ width, height: height + vs(22),borderRadius:vs(16) }}>
      <FlatList
        ref={listRef}
        horizontal
        data={data}
        keyExtractor={(it) => it.id}
        renderItem={renderItem}
        //getItemLayout={getItemLayout}
        showsHorizontalScrollIndicator={false}
        snapToInterval={width + gap}
        snapToAlignment="start"
        decelerationRate="fast"
        pagingEnabled={false}
        onMomentumScrollEnd={onMomentumEnd}
        onScrollBeginDrag={stopTimer}
        onScrollEndDrag={startTimer}
        contentContainerStyle={{ paddingRight: gap }}
      />

      {/* Inline horizontal dots (centered, under the card) */}
      <View style={styles.dotsRow}>
        {data.map((_, i) => {
          const active = i === index;
          const wh = active ? DOT_ACTIVE : DOT_SIZE;
          return (
            <Pressable
              key={i}
              onPress={() => onPressDot(i)}
              hitSlop={8}
              style={[
                styles.dot,
                {
                  width: wh,
                  height: wh,
                  backgroundColor: active ? colors.C1 : colors.C2,
                },
              ]}
            />
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    paddingHorizontal: v(14),
    paddingVertical: vs(12),
    justifyContent: "center",

    
    

  },
  title: { fontSize: v(16), fontWeight: "800", color: colors.C3 },
  subtitle: { marginTop: vs(6), fontSize: v(12), color: "#233", opacity: 0.8 },

  // Dots
  dotsRow: {
    width: "100%",
    height: vs(22),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

  },
  dot: {
    borderRadius: 999,
    marginHorizontal: v(5),
  },
});
