import React from "react";
import {
  View, Text, StyleSheet, Pressable, TextInput,
  Modal, FlatList, KeyboardAvoidingView, Platform,
  ActivityIndicator, Alert
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { v, vs } from "../utils/size";
import { colors } from "../constants/colors";
import { createActionItem, fetchExistingCategories } from "../api/actionitems";

// If you already use @react-native-community/datetimepicker, uncomment this and use it.
// import DateTimePicker from "@react-native-community/datetimepicker";

type RootStackParamList = {
  Home: undefined;
  ToDoEntry: undefined;
};
type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function ToDoEntryScreen() {
  const navigation = useNavigation<Nav>();

  // TODO: provide the actual userId from your auth/context/route
  const userId =  "99a99eea-d4dd-41b8-9ae3-efaec9f62a21";

  const [loadingCats, setLoadingCats] = React.useState(true);
  const [categories, setCategories] = React.useState<string[]>([]);
  const [catOpen, setCatOpen] = React.useState(false);

  const [action, setAction] = React.useState("");
  const [category, setCategory] = React.useState<string>(""); // blank means skip
  const [customCategory, setCustomCategory] = React.useState<string>(""); // when user types new
  const [dueDateStr, setDueDateStr] = React.useState<string>(""); // manual text YYYY-MM-DD (or full ISO)
  const [submitting, setSubmitting] = React.useState(false);

  // Optional local calendar picker visibility and date state
  const [calendarOpen, setCalendarOpen] = React.useState(false);
  const [calendarDate, setCalendarDate] = React.useState<Date>(new Date());

  React.useEffect(() => {
    (async () => {
      try {
        setLoadingCats(true);
        const cats = await fetchExistingCategories(userId);
        setCategories(cats);
      } catch (e) {
        console.log("Failed to fetch categories", e);
        setCategories([]);
      } finally {
        setLoadingCats(false);
      }
    })();
  }, [userId]);

  const finalCategory = (() => {
    const typed = customCategory.trim();
    if (typed.length) return typed;
    const picked = category.trim();
    return picked || ""; // '' means skip
  })();

  // Convert dueDateStr to ISO if valid; else null when empty
  const computeDueDateISO = (): string | null => {
    const s = dueDateStr.trim();
    if (!s) return null;
    // If user typed only YYYY-MM-DD, convert to ISO end-of-day (or set a default time)
    const looksYMD = /^\d{4}-\d{2}-\d{2}$/.test(s);
    try {
      const d = new Date(looksYMD ? `${s}T23:59:59` : s);
      if (isNaN(d.getTime())) throw new Error("Invalid date");
      return d.toISOString();
    } catch {
      return null; // let server reject if needed; or show validation below
    }
  };

  const onSubmit = async () => {
    const name = action.trim();
    if (!name) {
      Alert.alert("Missing name", "Please enter a to-do name.");
      return;
    }

    const dueISO = computeDueDateISO();
    if (dueDateStr && !dueISO) {
      Alert.alert("Invalid date", "Enter YYYY-MM-DD or a valid ISO date/time.");
      return;
    }

    setSubmitting(true);
    try {
      
      // ✅ correct order
await createActionItem(
  { action: name, category: finalCategory || null, dueDate: dueISO ?? null },
  userId
);

      // Optionally toast/haptic here
      navigation.goBack();
    } catch (e: any) {
      console.log("Create failed:", e?.message ?? e);
      Alert.alert("Error", "Could not create the to-do. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // If you use DateTimePicker, wire it here; otherwise keep the manual field & simple calendar modal
  const openCalendar = () => {
    setCalendarDate(new Date());
    setCalendarOpen(true);
  };

  const applyCalendarDate = () => {
    // store as YYYY-MM-DD
    const y = calendarDate.getFullYear();
    const m = String(calendarDate.getMonth() + 1).padStart(2, "0");
    const d = String(calendarDate.getDate()).padStart(2, "0");
    setDueDateStr(`${y}-${m}-${d}`);
    setCalendarOpen(false);
  };

  const CategoryRow = ({ label, onPress }: { label: string; onPress: () => void }) => (
    <Pressable style={({ pressed }) => [styles.catRow, pressed && { opacity: 0.8 }]} onPress={onPress}>
      <Text style={styles.catRowText}>{label}</Text>
    </Pressable>
  );

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: "#fff" }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.iconBtn}>
          <Ionicons name="arrow-back" size={v(22)} color="#fff" style={{ opacity: 0.7 }} />
        </Pressable>
        <Text style={styles.headerTitle}>New To-Do</Text>
        <View style={styles.iconBtn} />
      </View>

      {/* Form */}
      <View style={styles.form}>
        {/* Name */}
        <Text style={styles.label}>Name <Text style={{ color: "#c00" }}>*</Text></Text>
        <TextInput
          value={action}
          onChangeText={setAction}
          placeholder="e.g., Review project proposal"
          placeholderTextColor="rgba(40,71,102,0.4)"
          style={styles.input}
          autoCapitalize="sentences"
          returnKeyType="done"
        />

        {/* Category (dropdown + custom + skip) */}
        <Text style={styles.label}>Category <Text style={styles.optional}>(optional)</Text></Text>
        <View style={{ flexDirection: "row", gap: v(8) }}>
          <Pressable
            style={({ pressed }) => [styles.dropdownBtn, pressed && { opacity: 0.85 }]}
            onPress={() => setCatOpen(true)}
            disabled={loadingCats}
          >
            <Text style={styles.dropdownText}>
              {loadingCats ? "Loading…" : (category ? category : "Pick from existing")}
            </Text>
            <Ionicons name="chevron-down" size={v(16)} color={colors.C3} style={{ opacity: 0.6 }} />
          </Pressable>

          <TextInput
            value={customCategory}
            onChangeText={setCustomCategory}
            placeholder="Or type new / leave blank"
            placeholderTextColor="rgba(40,71,102,0.4)"
            style={[styles.input, { flex: 1 }]}
          />
        </View>

        {/* Due date (manual or calendar) */}
        <Text style={styles.label}>Due date <Text style={styles.optional}>(optional)</Text></Text>
        <View style={{ flexDirection: "row", gap: v(8), alignItems: "center" }}>
          <TextInput
            value={dueDateStr}
            onChangeText={setDueDateStr}
            placeholder="YYYY-MM-DD or ISO"
            placeholderTextColor="rgba(40,71,102,0.4)"
            style={[styles.input, { flex: 1 }]}
            keyboardType="numbers-and-punctuation"
          />
          <Pressable style={({ pressed }) => [styles.smallBtn, pressed && { opacity: 0.85 }]} onPress={openCalendar}>
            <Ionicons name="calendar-outline" size={v(18)} color="#fff" />
          </Pressable>
          {Boolean(dueDateStr) && (
            <Pressable style={({ pressed }) => [styles.smallBtnClear, pressed && { opacity: 0.85 }]} onPress={() => setDueDateStr("")}>
              <Ionicons name="close" size={v(18)} color={colors.C3} />
            </Pressable>
          )}
        </View>

        {/* Submit */}
        <Pressable
          onPress={onSubmit}
          disabled={submitting}
          style={({ pressed }) => [styles.submit, (pressed || submitting) && { opacity: 0.9 }]}
        >
          {submitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitText}>Create To-Do</Text>}
        </Pressable>
      </View>

      {/* Category picker modal */}
      <Modal visible={catOpen} transparent animationType="fade" onRequestClose={() => setCatOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setCatOpen(false)}>
          <View style={styles.sheet}>
            <Text style={styles.sheetTitle}>Pick a category</Text>
            <FlatList
              data={categories}
              keyExtractor={(x) => x}
              renderItem={({ item }) => (
                <CategoryRow
                  label={item}
                  onPress={() => {
                    setCategory(item);
                    setCustomCategory("");
                    setCatOpen(false);
                  }}
                />
              )}
              ItemSeparatorComponent={() => <View style={{ height: vs(6) }} />}
              ListEmptyComponent={
                loadingCats ? (
                  <View style={{ padding: v(12), alignItems: "center" }}>
                    <ActivityIndicator />
                  </View>
                ) : (
                  <Text style={{ padding: v(12), color: colors.C3, opacity: 0.6 }}>
                    No categories yet—type one above, or skip.
                  </Text>
                )
              }
            />
            <Pressable
              style={({ pressed }) => [styles.sheetBtn, pressed && { opacity: 0.9 }]}
              onPress={() => {
                setCategory("");
                setCatOpen(false);
              }}
            >
              <Text style={styles.sheetBtnText}>Skip (none)</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>

      {/* Simple calendar modal (no library) */}
      <Modal visible={calendarOpen} transparent animationType="fade" onRequestClose={() => setCalendarOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setCalendarOpen(false)}>
          <View style={styles.sheet}>
            <Text style={styles.sheetTitle}>Select date</Text>
            {/* If you use @react-native-community/datetimepicker, replace below with it */}
            <View style={{ padding: v(8), alignItems: "center" }}>
              <Text style={{ color: colors.C3, opacity: 0.7, marginBottom: vs(8) }}>
                (Using system date UI recommended)
              </Text>
              {/* Fallback: simple increment/decrement controls */}
              <View style={{ flexDirection: "row", alignItems: "center", gap: v(8), marginTop: vs(6) }}>
                <Pressable style={styles.smallBtn} onPress={() => setCalendarDate(new Date(calendarDate.getTime() - 24*3600*1000))}>
                  <Ionicons name="remove" size={v(18)} color="#fff" />
                </Pressable>
                <Text style={{ fontWeight: "700", color: colors.C3 }}>
                  {calendarDate.toDateString()}
                </Text>
                <Pressable style={styles.smallBtn} onPress={() => setCalendarDate(new Date(calendarDate.getTime() + 24*3600*1000))}>
                  <Ionicons name="add" size={v(18)} color="#fff" />
                </Pressable>
              </View>
            </View>

            <View style={{ flexDirection: "row", justifyContent: "flex-end", gap: v(8), marginTop: vs(10) }}>
              <Pressable style={styles.sheetBtn} onPress={() => setCalendarOpen(false)}>
                <Text style={styles.sheetBtnText}>Cancel</Text>
              </Pressable>
              <Pressable style={styles.sheetBtnPrimary} onPress={applyCalendarDate}>
                <Text style={styles.sheetBtnPrimaryText}>Use this date</Text>
              </Pressable>
            </View>
          </View>
        </Pressable>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.C1,
    paddingTop: vs(48),
    paddingBottom: vs(16),
    paddingHorizontal: v(16),
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitle: {
    flex: 1, textAlign: "center", color: "#fff",
    fontSize: v(20), fontWeight: "800", marginRight: v(36), opacity: 0.75,
  },
  iconBtn: { width: v(36), height: v(36), alignItems: "center", justifyContent: "center" },

  form: { padding: v(16), gap: vs(12) },
  label: { fontSize: v(13), fontWeight: "800", color: colors.C3 },
  optional: { color: "rgba(40,71,102,0.6)", fontWeight: "600" },
  input: {
    borderWidth: 1, borderColor: "rgba(40,71,102,0.15)", borderRadius: v(12),
    paddingHorizontal: v(12), paddingVertical: vs(10),
    color: colors.C3, backgroundColor: "#fff",
  },

  dropdownBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    borderWidth: 1, borderColor: "rgba(40,71,102,0.15)", borderRadius: v(12),
    paddingHorizontal: v(12), paddingVertical: vs(10),
    minWidth: v(180), backgroundColor: "#fff", flex: 0,
  },
  dropdownText: { color: colors.C3, fontWeight: "700" },

  smallBtn: {
    backgroundColor: colors.C3, borderRadius: v(10),
    height: vs(42), paddingHorizontal: v(12),
    alignItems: "center", justifyContent: "center",
  },
  smallBtnClear: {
    backgroundColor: "rgba(40,71,102,0.12)", borderRadius: v(10),
    height: vs(42), paddingHorizontal: v(12),
    alignItems: "center", justifyContent: "center",
  },

  submit: {
    marginTop: vs(8),
    backgroundColor: colors.C3,
    borderRadius: v(14),
    height: vs(48),
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000", shadowOpacity: 0.15, shadowRadius: v(10),
    shadowOffset: { width: 0, height: vs(4) }, elevation: 3,
  },
  submitText: { color: "#fff", fontWeight: "800", fontSize: v(14) },

  // Modal
  backdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.35)", alignItems: "center", justifyContent: "flex-end", padding: v(16) },
  sheet: { width: "100%", backgroundColor: "#fff", borderRadius: v(16), padding: v(16) },
  sheetTitle: { fontSize: v(16), fontWeight: "800", color: colors.C3, marginBottom: vs(10) },
  sheetBtn: {
    backgroundColor: colors.C4, borderRadius: v(12),
    alignSelf: "flex-end", paddingVertical: vs(8), paddingHorizontal: v(14),
  },
  sheetBtnText: { color: colors.C3, fontWeight: "800" },
  sheetBtnPrimary: {
    backgroundColor: colors.C3, borderRadius: v(12),
    paddingVertical: vs(8), paddingHorizontal: v(14),
  },
  sheetBtnPrimaryText: { color: "#fff", fontWeight: "800" },

  catRow: {
    paddingVertical: vs(10),
    paddingHorizontal: v(10),
    backgroundColor: "#fff",
    borderRadius: v(10),
    borderWidth: 1,
    borderColor: "rgba(40,71,102,0.12)",
  },
  catRowText: { color: colors.C3, fontWeight: "700" },
});
