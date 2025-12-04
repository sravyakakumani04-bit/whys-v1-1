
import React, { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet,TouchableWithoutFeedback,Keyboard } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { validateSignUp } from "../utils/authvalidators";
import { colors } from "../constants/colors";
import { vs, v } from "../utils/size";

type Key = "username" | "email" | "password" | "confirm";
type IconName = keyof typeof Ionicons.glyphMap;

type FieldConfig = {
  k: Key;
  ph: string;
  icon: IconName;
  secure?: boolean;  // optional
  email?: boolean;   // optional
};

export default function SignUpScreen() {
  const navigation: any = useNavigation();
  const [values, setValues] = useState({ username: "", email: "", password: "", confirm: "" });
  const [err, setErr] = useState<Record<string, string>>({});
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const set =
    (k: Key) =>
    (t: string) =>
      setValues((s) => ({ ...s, [k]: t }));

  function handleSignUp() {
    const e = validateSignUp(values);
    setErr(e);
    if (Object.values(e).some(Boolean)) return;
    navigation.replace("Home");
  }

  const fields: FieldConfig[] = [
    { k: "username", ph: "Enter user name", icon: "person-outline" },
    { k: "email", ph: "Enter Gmail", icon: "mail-outline", email: true },
    { k: "password", ph: "Enter password", icon: "lock-closed-outline", secure: true },
    { k: "confirm", ph: "Confirm password", icon: "lock-closed-outline", secure: true },
  ];

  return (
     <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
     <View style={styles.root}>
      {/* TOP (C1) */}
      <View style={styles.top}>
        <Text style={styles.title}>CREATE ACCOUNT</Text>

        <View style={styles.card}>
          {fields.map((f) => {
            const isSecure = !!f.secure;
            const isPw = f.k === "password";
            const isConfirm = f.k === "confirm";
            const visible = isPw ? showPw : isConfirm ? showConfirm : false;
            const toggle = () => (isPw ? setShowPw((s) => !s) : setShowConfirm((s) => !s));

            return (
              <View key={f.k} style={{ marginBottom: vs(10) }}>
                <View style={styles.row}>
                  {/* Left icon box */}
                  <View style={styles.logoBox}>
                    <Ionicons name={f.icon} size={v(20)} />
                  </View>

                  {/* Input */}
                  <TextInput
                    style={[styles.input, isSecure ? { paddingRight: v(44) } : undefined]}
                    placeholder={f.ph}
                    autoCapitalize="none"
                    keyboardType={f.email ? "email-address" : "default"}
                    secureTextEntry={isSecure && !visible}
                    value={(values as any)[f.k]}
                    onChangeText={set(f.k)}
                    placeholderTextColor="#666"
                  />

                  {/* Eye toggle for secure fields */}
                  {isSecure && (
                    <Pressable onPress={toggle} style={styles.eyeBtn}>
                      <Ionicons name={visible ? "eye" : "eye-off"} size={v(20)} />
                    </Pressable>
                  )}
                </View>

                {!!err[f.k] && <Text style={styles.error}>{err[f.k]}</Text>}
              </View>
            );
          })}

          <Pressable style={styles.primaryBtn} onPress={handleSignUp}>
            <Text style={styles.primaryText}>SIGN UP</Text>
          </Pressable>

          <Text style={styles.or}>or</Text>

          <Pressable style={styles.hollowBtn}>
            <Text style={styles.hollowText}>SIGN UP WITH</Text>
          </Pressable>
        </View>
      </View>

      {/* BOTTOM (white) */}
      <View style={styles.bottom}>
        <Text>Already have an account?</Text>
        <Pressable onPress={() => navigation.goBack()}>
          <Text style={styles.linkRed}>Sign In</Text>
        </Pressable>
      </View>
    </View>
   
   </TouchableWithoutFeedback>
    
  );
}

const styles = StyleSheet.create({
  // split layout
  root: { flex: 1, backgroundColor: "#fff" },
  top: {
    flex: 9,
    backgroundColor: colors.C1,
    paddingTop: vs(60),
    padding: v(24),
    borderBottomLeftRadius: v(89),
    borderBottomRightRadius: v(89),
  },
  bottom: {
    flex: 1,
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 0,
    paddingHorizontal: v(16),
  },

  // content
  title: {
    color: colors.C2,
    fontSize: v(23),
    fontWeight: "700",
    textAlign: "center",
    marginBottom: vs(25),
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: vs(25),
    paddingTop: vs(45),
    padding: v(25),
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: v(12),
    borderWidth: 1,
    borderColor: "#e6e6e6",
    height: vs(55),
    overflow: "hidden",
    backgroundColor: "#fff",
  },
  logoBox: {
    width: v(52),
    height: "100%",
    backgroundColor: "#f2f2f2",
    borderRightWidth: 1,
    borderRightColor: "#ececec",
    alignItems: "center",
    justifyContent: "center",
  },
  input: { flex: 1, paddingHorizontal: v(12), fontSize: v(16) },
  eyeBtn: {
    width: v(44),
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },

  primaryBtn: {
    marginTop: vs(25),
    height: vs(50),
    borderRadius: v(12),
    backgroundColor: colors.C1,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryText: { color: "#fff", fontWeight: "700" },
  hollowBtn: {
    height: vs(50),
    borderRadius: v(12),
    borderWidth: 1,
    borderColor: "#dadada",
    alignItems: "center",
    justifyContent: "center",
  },
  hollowText: { fontWeight: "700" },
  or: { textAlign: "center", marginVertical: v(10), color: "#333" },

  error: { color: "#b00020", fontSize: v(12), marginTop: vs(4), marginLeft: v(6) },
  linkRed: { color: "#b31b1b", fontWeight: "700", marginLeft: v(4) },
});
