
// import React, { useState } from "react";
// import {
//   View, Text, TextInput, Pressable, StyleSheet, Alert,
//   TouchableWithoutFeedback, Keyboard
// } from "react-native";
// import { useNavigation } from "@react-navigation/native";
// import { Ionicons } from "@expo/vector-icons";
// import { validateSignIn } from "../utils/authvalidators";
// import { colors } from "../constants/colors";
// import { vs, v } from "../utils/size";

// export default function SignInScreen() {
//   const navigation: any = useNavigation();
//   const [values, setValues] = useState({ username: "", password: "" });
//   const [err, setErr] = useState<{ username?: string; password?: string }>({});
//   const [showPw, setShowPw] = useState(false);

//   const set =
//     (k: "username" | "password") =>
//     (t: string) =>
//       setValues((s) => ({ ...s, [k]: t }));

//   function handleSignIn() {
//     const e = validateSignIn(values);
//     setErr(e);
//     if (e.username || e.password) return;
//     navigation.replace("Home");
//   }

//   return (
//     <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
//       <View style={styles.root}>
//         {/* TOP: C1 background */}
//         <View style={styles.top}>
//           <Text style={styles.title}>WELCOME BACK</Text>

//           <View style={styles.card}>
//             {/* Username */}
//             <View style={styles.row}>
//               <View style={styles.logoBox}>
//                 <Ionicons name="person-outline" size={v(20)} />
//               </View>
//               <TextInput
//                 style={styles.input}
//                 placeholder="Enter user name"
//                 placeholderTextColor="#666"
//                 autoCapitalize="none"
//                 value={values.username}
//                 onChangeText={set("username")}
//                 returnKeyType="next"
//                 blurOnSubmit={false}
//               />
//             </View>
//             {!!err.username && <Text style={styles.error}>{err.username}</Text>}

//             {/* Password */}
//             <View style={styles.row}>
//               <View style={styles.logoBox}>
//                 <Ionicons name="lock-closed-outline" size={v(20)} />
//               </View>
//               <TextInput
//                 style={[styles.input, { paddingRight: v(44) }]}
//                 placeholder="Enter Password"
//                 placeholderTextColor="#666"
//                 secureTextEntry={!showPw}
//                 value={values.password}
//                 onChangeText={set("password")}
//               />
//               <Pressable onPress={() => setShowPw((s) => !s)} style={styles.eyeBtn}>
//                 <Ionicons name={showPw ? "eye" : "eye-off"} size={v(20)} />
//               </Pressable>
//             </View>
//             {!!err.password && <Text style={styles.error}>{err.password}</Text>}

//             <Pressable
//               onPress={() => Alert.alert("Forgot", "Implement reset flow")}
//               style={styles.rightLink}
//             >
//               <Text style={styles.linkRed1}>forget password</Text>
//             </Pressable>

//             <Pressable style={styles.primaryBtn} onPress={handleSignIn}>
//               <Text style={styles.primaryText}>SIGN IN</Text>
//             </Pressable>

//             <Text style={styles.or}>or</Text>

//             <Pressable style={styles.hollowBtn}>
//               <Text style={styles.hollowText}>SIGN IN WITH</Text>
//             </Pressable>
//           </View>
//         </View>

//         {/* BOTTOM: white footer */}
//         <View style={styles.bottom}>
//           <Text>Don't have an account </Text>
//           <Pressable onPress={() => navigation.navigate("SignUp")}>
//             <Text style={styles.linkRed}>signup</Text>
//           </Pressable>
//         </View>
//       </View>
//     </TouchableWithoutFeedback>
//   );
// }

// const styles = StyleSheet.create({
//   // split screen
//   root: { flex: 1, backgroundColor: "#fff" },
//   top: {
//     flex: 9, // keep your current ratio
//     backgroundColor: colors.C1,
//     paddingTop: vs(60),
//     padding: v(24),
//     borderBottomLeftRadius: v(89),
//     borderBottomRightRadius: v(89),
//   },
//   bottom: {
//     flex: 1,
//     backgroundColor: "#fff",
//     flexDirection: "row",
//     justifyContent: "center",
//     alignItems: "center",
//     gap: 0,
//     paddingHorizontal: v(16),
//   },

//   // content
//   title: {
//     color: colors.C2,
//     fontSize: v(23),
//     fontWeight: "700",
//     textAlign: "center",
//     marginBottom: vs(25),
//   },
//   card: { backgroundColor: "#fff", borderRadius: vs(25), paddingTop: vs(45), padding: v(25) },

//   row: {
//     flexDirection: "row",
//     alignItems: "center",
//     borderRadius: v(12),
//     borderWidth: 1,
//     borderColor: "#e6e6e6",
//     height: vs(55),
//     marginTop: 10,
//     overflow: "hidden",
//     backgroundColor: "#fff",
//   },
//   logoBox: {
//     width: v(52),
//     height: "100%",
//     backgroundColor: "#f2f2f2",
//     borderRightWidth: 1,
//     borderRightColor: "#ececec",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   input: { flex: 1, paddingHorizontal: v(12), fontSize: v(16) },
//   eyeBtn: {
//     width: v(44),
//     height: "100%",
//     alignItems: "center",
//     justifyContent: "center",
//   },

//   primaryBtn: {
//     marginTop: vs(12),
//     height: vs(50),
//     borderRadius: v(12),
//     backgroundColor: colors.C1,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   primaryText: { color: "#fff", fontWeight: "700" ,fontSize: v(14)},
//   hollowBtn: {
//     height: vs(50),
//     borderRadius: v(12),
//     borderWidth: 1,
//     borderColor: "#dadada",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   hollowText: { fontWeight: "700",fontSize: v(14),opacity:0.7 },
//   or: { textAlign: "center", marginVertical: v(10), color: "#333" },

//   error: { color: "#b00020", fontSize: v(12), marginTop: vs(4), marginLeft: v(6) },
//   rightLink: { alignItems: "flex-end", marginTop: vs(6) },
//   linkRed: { color: "#b31b1b", fontWeight: "700" },
//   linkRed1: { color: "#ab3939d7", fontWeight: "700", paddingTop: vs(10) },
// });
import React, { useState } from "react";
import {
  View, Text, TextInput, Pressable, StyleSheet, Alert,
  TouchableWithoutFeedback, Keyboard
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { validateSignIn } from "../utils/authvalidators";
import { colors } from "../constants/colors";
import { vs, v } from "../utils/size";

export default function SignInScreen() {
  const navigation: any = useNavigation();
  const [values, setValues] = useState({ username: "", password: "" });
  const [err, setErr] = useState<{ username?: string; password?: string }>({});
  const [showPw, setShowPw] = useState(false);

  // ⬇️ Clear everything whenever this screen becomes focused
  useFocusEffect(
    React.useCallback(() => {
      setValues({ username: "", password: "" });
      setErr({});
      setShowPw(false);
      return () => {};
    }, [])
  );

  const set =
    (k: "username" | "password") =>
    (t: string) =>
      setValues((s) => ({ ...s, [k]: t }));

  function handleSignIn() {
    const e = validateSignIn(values);
    setErr(e);
    if (e.username || e.password) return;
    navigation.replace("Home");
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.root}>
        {/* TOP: C1 background */}
        <View style={styles.top}>
          <Text style={styles.title}>WELCOME BACK</Text>

          <View style={styles.card}>
            {/* Username */}
            <View style={styles.row}>
              <View style={styles.logoBox}>
                <Ionicons name="person-outline" size={v(20)} />
              </View>
              <TextInput
                style={styles.input}
                placeholder="Enter user name"
                placeholderTextColor="#666"
                autoCapitalize="none"
                value={values.username}
                onChangeText={set("username")}
                returnKeyType="next"
                blurOnSubmit={false}
                textContentType="username"
                autoComplete="username"
              />
            </View>
            {!!err.username && <Text style={styles.error}>{err.username}</Text>}

            {/* Password */}
            <View style={styles.row}>
              <View style={styles.logoBox}>
                <Ionicons name="lock-closed-outline" size={v(20)} />
              </View>
              <TextInput
                style={[styles.input, { paddingRight: v(44) }]}
                placeholder="Enter Password"
                placeholderTextColor="#666"
                secureTextEntry={!showPw}
                value={values.password}
                onChangeText={set("password")}
                textContentType="password"
                autoComplete="password"
              />
              <Pressable onPress={() => setShowPw((s) => !s)} style={styles.eyeBtn}>
                <Ionicons name={showPw ? "eye" : "eye-off"} size={v(20)} />
              </Pressable>
            </View>
            {!!err.password && <Text style={styles.error}>{err.password}</Text>}

            <Pressable
              onPress={() => Alert.alert("Forgot", "Implement reset flow")}
              style={styles.rightLink}
            >
              <Text style={styles.linkRed1}>forget password?</Text>
            </Pressable>

            <Pressable style={styles.primaryBtn} onPress={handleSignIn}>
              <Text style={styles.primaryText}>SIGN IN</Text>
            </Pressable>

            <Text style={styles.or}>or</Text>

            <Pressable style={styles.hollowBtn}>
              <Text style={styles.hollowText}>SIGN IN WITH</Text>
            </Pressable>
          </View>
        </View>

        {/* BOTTOM: white footer */}
        <View style={styles.bottom}>
          <Text>Don't have an account? </Text>
          <Pressable onPress={() => navigation.navigate("SignUp")}>
            <Text style={styles.linkRed}>Sign Up</Text>
          </Pressable>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  // split screen
  root: { flex: 1, backgroundColor: "#fff" },
  top: {
    flex: 9, // keep your current ratio
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
  card: { backgroundColor: "#fff", borderRadius: vs(25), paddingTop: vs(45), padding: v(25) },

  row: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: v(12),
    borderWidth: 1,
    borderColor: "#e6e6e6",
    height: vs(55),
    marginTop: 10,
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
    marginTop: vs(12),
    height: vs(50),
    borderRadius: v(12),
    backgroundColor: colors.C1,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryText: { color: "#fff", fontWeight: "700", fontSize: v(14) },
  hollowBtn: {
    height: vs(50),
    borderRadius: v(12),
    borderWidth: 1,
    borderColor: "#dadada",
    alignItems: "center",
    justifyContent: "center",
  },
  hollowText: { fontWeight: "700", fontSize: v(14), opacity: 0.7 },
  or: { textAlign: "center", marginVertical: v(10), color: "#333" },

  error: { color: "#b00020", fontSize: v(12), marginTop: vs(4), marginLeft: v(6) },
  rightLink: { alignItems: "flex-end", marginTop: vs(6) },
  linkRed: { color: "#b31b1b", fontWeight: "700" },
  linkRed1: { color: "#ab3939d7", fontWeight: "700", paddingTop: vs(10) },
});
