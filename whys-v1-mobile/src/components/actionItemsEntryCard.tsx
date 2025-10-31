// src/components/ActionItemsEntryCard.tsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  ActivityIndicator,
  Modal,
  Platform,
  StyleProp,
  ViewStyle,
  Animated,
  StatusBar,
  FlatList,
  Keyboard,
} from "react-native";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import { v, vs } from "../utils/size";
import { colors } from "../constants/colors";
import { createActionItem, fetchExistingCategories } from "../api/actionitems";

type Props = {
  visible: boolean;
  userId: string;
  onClose: () => void;
  onCreated?: () => void;
  cardStyle?: StyleProp<ViewStyle>;
};

function firstOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}
function addMonths(base: Date, delta: number) {
  return new Date(base.getFullYear(), base.getMonth() + delta, 1);
}
function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}
function tomorrowStart(): Date {
  const t = new Date();
  t.setDate(t.getDate() + 1);
  return startOfDay(t);
}

export default function ActionItemsEntryCard({
  visible,
  userId,
  onClose,
  onCreated,
  cardStyle,
}: Props) {
  const [action, setAction] = React.useState("");
  const [category, setCategory] = React.useState("");
  const [
    
    selectedDate, setSelectedDate] = React.useState<Date | null>(null);
  const [submitting, setSubmitting] = React.useState(false);

  const [categories, setCategories] = React.useState<string[]>([]);
  const [loadingCats, setLoadingCats] = React.useState(true);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = React.useState(false);
  const [calendarOpen, setCalendarOpen] = React.useState(false);

  // earliest allowed date/month (tomorrow)
  const [minDate] = React.useState<Date>(tomorrowStart());
  const minMonth = React.useMemo(() => firstOfMonth(minDate), [minDate]);

  // month shown in calendar
  const [displayedMonth, setDisplayedMonth] = React.useState<Date>(
    firstOfMonth(new Date())
  );

  const scaleAnim = React.useRef(new Animated.Value(0.95)).current;

  const closeDropdowns = React.useCallback(() => {
    setCategoryDropdownOpen(false);
    setCalendarOpen(false);
  }, []);

  React.useEffect(() => {
    const sub = Keyboard.addListener("keyboardDidShow", closeDropdowns);
    return () => sub.remove();
  }, [closeDropdowns]);

  React.useEffect(() => {
    if (visible) {
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 80,
        friction: 8,
      }).start();
      loadCategories();
      if (selectedDate && startOfDay(selectedDate) < minDate) {
        setSelectedDate(null);
      }
    } else {
      scaleAnim.setValue(0.95);
    }
  }, [visible, userId]);

  const loadCategories = async () => {
    try {
      setLoadingCats(true);
      const cats = await fetchExistingCategories(userId);
      setCategories(cats);
    } catch {
      setCategories([]);
    } finally {
      setLoadingCats(false);
    }
  };

  const resetForm = () => {
    setAction("");
    setCategory("");
    setSelectedDate(null);
    setCategoryDropdownOpen(false);
    setCalendarOpen(false);
    setDisplayedMonth(firstOfMonth(new Date()));
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  React.useEffect(() => {
    if (!visible) resetForm();
  }, [visible]);

  const submit = async () => {
    const name = action.trim();
    if (!name) return;
    const iso = selectedDate ? selectedDate.toISOString() : null;

    setSubmitting(true);
    try {
      await createActionItem(
        { action: name, category: category.trim() || null, dueDate: iso },
        userId
      );
      resetForm();
      onCreated?.();
      handleClose();
    } finally {
      setSubmitting(false);
    }
  };

  const handleCategoryPress = () => {
    setCalendarOpen(false);
    setCategoryDropdownOpen((o) => !o);
  };

  const handleCalendarPress = () => {
    Keyboard.dismiss();
    setCategoryDropdownOpen(false);
    const target =
      selectedDate && startOfDay(selectedDate) >= minDate
        ? selectedDate
        : minDate;
    setDisplayedMonth(firstOfMonth(target));
    setCalendarOpen((o) => !o);
  };

  const selectCategory = (cat: string) => {
    setCategory(cat);
    setCategoryDropdownOpen(false);
  };

  const selectDate = (date: Date) => {
    setSelectedDate(date);
    setCalendarOpen(false);
  };

  const clearDate = () => {
    setSelectedDate(null);
    setCalendarOpen(false);
  };

  const formatDate = (date: Date) =>
    date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  // calendar dates for the displayed month
  const { dates: calendarDates } = React.useMemo(() => {
    const month = displayedMonth.getMonth();
    const year = displayedMonth.getFullYear();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const dates: (Date | null)[] = [];
    const startDay = firstDay.getDay();

    for (let i = 0; i < startDay; i++) dates.push(null);
    for (let day = 1; day <= lastDay.getDate(); day++) {
      dates.push(new Date(year, month, day));
    }
    return { dates };
  }, [displayedMonth]);

  const canGoPrev = displayedMonth.getTime() > minMonth.getTime();

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
      <View style={{ flex: 1, paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0 }}>
        <BlurView intensity={60} tint="dark" style={s.backdrop}>
          <Pressable style={s.backdropTouchable} onPress={handleClose} />

          <Animated.View
            style={[s.card, cardStyle, { transform: [{ scale: scaleAnim }] }]}
            onStartShouldSetResponder={() => true}
            onResponderGrant={closeDropdowns}
          >
            {/* Header - centered title, close pinned right */}
            <View style={s.header}>
              <View style={s.headerSide} />
              <Text style={s.titleCenter}>ADD TASK</Text>
              <Pressable onPress={handleClose} hitSlop={10} style={s.headerSideRight}>
                <Ionicons name="close-circle" size={v(24)} color="#999" />
              </Pressable>
            </View>

            {/* Form */}
            <View style={s.form}>
              {/* Task Name */}
              <View style={s.field}>
                <TextInput
                  value={action}
                  onChangeText={setAction}
                  onFocus={closeDropdowns}
                  placeholder="ENTER A TASK"
                  placeholderTextColor="rgba(0,0,0,0.3)"
                  style={s.input}
                  autoCapitalize="sentences"
                  autoFocus
                  onSubmitEditing={Keyboard.dismiss}
                />
              </View>

              {/* Category */}
              <View style={[s.field, { position: "relative" }]}>
                <View style={s.inputWithIcon}>
                  <TextInput
                    value={category}
                    onChangeText={(text) => {
                      setCategory(text);
                      setCategoryDropdownOpen(false);
                    }}
                    onFocus={() => setCalendarOpen(false)}
                    placeholder="ENTER CATEGORY"
                    placeholderTextColor="rgba(0,0,0,0.3)"
                    style={s.inputFull}
                    autoCapitalize="words"
                    onSubmitEditing={() => {
                      Keyboard.dismiss();
                      setCategoryDropdownOpen(false);
                    }}
                  />
                  <Pressable style={s.iconButton} onPress={handleCategoryPress}>
                    <Ionicons
                      name={categoryDropdownOpen ? "chevron-up" : "chevron-down"}
                      size={v(20)}
                      color="#666"
                    />
                  </Pressable>
                </View>

                {categoryDropdownOpen && (
                  <View style={s.dropdown}>
                    {loadingCats ? (
                      <View style={s.loadingContainer}>
                        <ActivityIndicator size="small" color={colors.C3} />
                      </View>
                    ) : categories.length > 0 ? (
                      <FlatList
                        data={categories}
                        keyExtractor={(item) => item}
                        style={{ maxHeight: vs(150) }}
                        keyboardShouldPersistTaps="handled"
                        renderItem={({ item }) => (
                          <Pressable style={s.dropdownItem} onPress={() => selectCategory(item)}>
                            <Text style={s.dropdownItemText}>{item}</Text>
                          </Pressable>
                        )}
                      />
                    ) : (
                      <Text style={s.emptyText}>No existing categories</Text>
                    )}
                  </View>
                )}
              </View>

              {/* Due Date */}
              <View style={[s.field, { position: "relative" }]}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: v(8) }}>
                  <Pressable style={[s.dropdownInput, { flex: 1 }]} onPress={handleCalendarPress}>
                    <Text style={[s.inputText, !selectedDate && s.placeholderText]}>
                      {selectedDate ? formatDate(selectedDate) : "ENTER DUE DATE"}
                    </Text>
                    <Ionicons
                      name={calendarOpen ? "chevron-up" : "calendar"}
                      size={v(20)}
                      color="#666"
                    />
                  </Pressable>

                  {selectedDate && (
                    <Pressable onPress={clearDate} style={s.clearBtn} hitSlop={8}>
                      <Ionicons name="close-circle" size={v(22)} color="rgba(0,0,0,0.35)" />
                    </Pressable>
                  )}
                </View>

                {calendarOpen && (
                  <View style={s.dateDropdown}>
                    {/* Month header with nav */}
                    <View style={s.calendarHeaderRow}>
                      <Pressable
                        style={[s.monthBtn, !canGoPrev && s.monthBtnDisabled]}
                        onPress={() => {
                          if (canGoPrev) setDisplayedMonth((m) => addMonths(m, -1));
                        }}
                        disabled={!canGoPrev}
                      >
                        <Ionicons
                          name="chevron-back"
                          size={v(18)}
                          color={canGoPrev ? colors.C3 : "#bbb"}
                        />
                      </Pressable>

                      <Text style={s.calendarMonth}>
                        {displayedMonth.toLocaleDateString("en-US", {
                          month: "long",
                          year: "numeric",
                        })}
                      </Text>

                      <Pressable
                        style={s.monthBtn}
                        onPress={() => setDisplayedMonth((m) => addMonths(m, 1))}
                      >
                        <Ionicons name="chevron-forward" size={v(18)} color={colors.C3} />
                      </Pressable>
                    </View>

                    <View style={s.weekRow}>
                      {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                        <Text key={day} style={s.weekday}>
                          {day}
                        </Text>
                      ))}
                    </View>

                    <View style={s.calendarGrid}>
                      {calendarDates.map((date, index) => {
                        if (!date) return <View key={`empty-${index}`} style={s.dateCell} />;

                        const isToday = date.toDateString() === new Date().toDateString();
                        const isSelected =
                          !!selectedDate && date.toDateString() === selectedDate.toDateString();
                        const isDisabled = startOfDay(date).getTime() < minDate.getTime();

                        return (
                          <Pressable
                            key={index}
                            style={[
                              s.dateCell,
                              isToday && s.todayCell,
                              isSelected && s.selectedCell,
                              isDisabled && s.disabledCell,
                            ]}
                            onPress={() => {
                              if (isDisabled) return;
                              selectDate(date);
                              setCalendarOpen(false);
                            }}
                            disabled={isDisabled}
                          >
                            <Text
                              style={[
                                s.dateText,
                                isToday && s.todayText,
                                isSelected && s.selectedText,
                                isDisabled && s.disabledText,
                              ]}
                            >
                              {date.getDate()}
                            </Text>
                          </Pressable>
                        );
                      })}
                    </View>

                    <View style={{ height: vs(8) }} />
                    <Pressable
                      style={{ alignSelf: "flex-end", paddingVertical: vs(6), paddingHorizontal: v(8) }}
                      onPress={clearDate}
                    >
                     
                    </Pressable>
                  </View>
                )}
              </View>
            </View>

            {/* Button */}
            <View style={s.buttons}>
              <Pressable
                onPress={submit}
                disabled={submitting || !action.trim()}
                style={({ pressed }) => [
                  s.createBtn,
                  (!action.trim() || submitting) && s.createBtnDisabled,
                  pressed && { opacity: 0.9 },
                ]}
              >
                {submitting ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={s.createBtnText}>ADD TASK</Text>
                )}
              </Pressable>
            </View>
          </Animated.View>
        </BlurView>
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  backdrop: { flex: 1, alignItems: "center" },
  backdropTouchable: { ...StyleSheet.absoluteFillObject },

  card: {
    width: "85%",
    maxWidth: 400,
    maxHeight: "80%",
    backgroundColor: "#F5F5F5",
    borderRadius: v(16),
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: v(15),
    shadowOffset: { width: 0, height: vs(8) },
    elevation: 6,
    marginTop: "45%",
  },

  /* ───────── Header (centered title, close pinned right) ───────── */
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: v(20),
    paddingTop: vs(20),
    paddingBottom: vs(16),
  },
  headerSide: { width: v(24) },
  headerSideRight: { width: v(24), alignItems: "flex-end" },
  titleCenter: {
    flex: 1,
    textAlign: "center",
    fontSize: v(16),
    fontWeight: "700",
    color: colors.C3,
    letterSpacing: 0.2,
  },

  /* ───────── Form ───────── */
  form: { paddingHorizontal: v(20), gap: vs(12) },
  field: { position: "relative" },

  input: {
    borderWidth: 0,
    borderRadius: v(8),
    paddingHorizontal: v(16),
    paddingVertical: vs(14),
    fontSize: v(14),
    color: colors.C3,
    opacity:0.85,
    backgroundColor: "#fff",
    fontWeight: "500",
  },

  inputWithIcon: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: v(8),
    position: "relative",
  },
  inputFull: {
    flex: 1,
    paddingHorizontal: v(16),
    paddingVertical: vs(14),
    fontSize: v(14),
    color: colors.C3,
    opacity:0.95,
    fontWeight: "500",
  },
  iconButton: { padding: v(12), justifyContent: "center", alignItems: "center" },

  dropdownInput: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 0,
    borderRadius: v(8),
    paddingHorizontal: v(16),
    paddingVertical: vs(14),
    backgroundColor: "#fff",
  },
  inputText: { fontSize: v(14), color: "colors.C3", fontWeight: "500" },
  placeholderText: { color: "rgba(0,0,0,0.3)" },

  clearBtn: {
    height: vs(44),
    paddingHorizontal: v(4),
    alignItems: "center",
    justifyContent: "center",
  },

  // Category dropdown
  dropdown: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderRadius: v(8),
    marginTop: vs(4),
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: v(10),
    shadowOffset: { width: 0, height: vs(4) },
    elevation: 5,
    zIndex: 2000,
    padding: v(8),
  },
  dropdownItem: {
    paddingVertical: vs(10),
    paddingHorizontal: v(12),
    borderRadius: v(6),
  },
  dropdownItemText: { fontSize: v(14), color: colors.C3, fontWeight: "500" },
  loadingContainer: { padding: v(16), alignItems: "center" },
  emptyText: { padding: v(12), fontSize: v(13), color: "#999", textAlign: "center" },

  // Calendar dropdown (anchored)
  dateDropdown: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderRadius: v(8),
    marginTop: vs(4),
    padding: v(12),
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: v(10),
    shadowOffset: { width: 0, height: vs(4) },
    elevation: 5,
    zIndex: 2000,
  },

  calendarHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: vs(6),
  },
  monthBtn: {
    width: v(34),
    height: v(34),
    borderRadius: v(8),
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(40,71,102,0.06)",
  },
  monthBtnDisabled: { backgroundColor: "rgba(0,0,0,0.04)" },
  calendarMonth: { fontSize: v(14), fontWeight: "800", color: colors.C3 },

  weekRow: { flexDirection: "row", justifyContent: "space-around", marginBottom: vs(6) },
  weekday: { width: v(36), fontSize: v(11), fontWeight: "600", color: "#666", textAlign: "center" },

  calendarGrid: { flexDirection: "row", flexWrap: "wrap" },
  dateCell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: v(4),
    borderRadius: v(6),
  },
  todayCell: { backgroundColor: "#E3F2FD" },
  selectedCell: { backgroundColor: colors.C3 },
  disabledCell: { opacity: 0.4 },

  dateText: { fontSize: v(13), fontWeight: "500", color: "#000" },
  todayText: { color: colors.C3, fontWeight: "700" },
  selectedText: { color: "#fff", fontWeight: "700" },
  disabledText: { color: "#999" },

  // Bottom button
  buttons: { padding: v(20), paddingTop: vs(20) },
  createBtn: {
    backgroundColor: colors.C3,
    paddingVertical: vs(14),
    borderRadius: v(24),
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.C3,
    shadowOpacity: 0.25,
    shadowRadius: v(8),
    shadowOffset: { width: 0, height: vs(4) },
    elevation: 4,
  },
  createBtnDisabled: { backgroundColor: "rgba(40,71,102,0.3)", shadowOpacity: 0, elevation: 0 },
  createBtnText: { color: "#fff", fontSize: v(14), fontWeight: "700", letterSpacing: 0.5 },
});
