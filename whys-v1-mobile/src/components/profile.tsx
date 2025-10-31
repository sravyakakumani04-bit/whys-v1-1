
import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Animated,
  Pressable,
  Image,
  ScrollView,
  Dimensions,
  Easing,
} from "react-native";
import { BlurView } from "expo-blur";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { v, vs } from "../utils/size";
import { colors } from "../constants/colors";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/types";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const DRAWER_WIDTH = SCREEN_WIDTH * 0.75;

// Animation speeds
const OPEN_MS = 800;
const CLOSE_MS = 550;

type ProfileDrawerProps = {
  visible: boolean;
  onClose: () => void;
  userName?: string;
  avatarUri?: string;
};

type ProfileDrawerNavigation = NativeStackNavigationProp<RootStackParamList>;

export default function ProfileDrawer({
  visible,
  onClose,
  userName = "Sravya",
  avatarUri = "https://i.pravatar.cc/120?img=5",
}: ProfileDrawerProps) {
  const navigation = useNavigation<ProfileDrawerNavigation>();
  const slideAnim = useRef(new Animated.Value(-DRAWER_WIDTH)).current;

  useEffect(() => {
    slideAnim.stopAnimation(() => {
      if (visible) {
        slideAnim.setValue(-DRAWER_WIDTH);
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: OPEN_MS,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
          useNativeDriver: true,
        }).start();
      } else {
        Animated.timing(slideAnim, {
          toValue: -DRAWER_WIDTH,
          duration: CLOSE_MS,
          easing: Easing.bezier(0.4, 0, 0.6, 1),
          useNativeDriver: true,
        }).start();
      }
    });
  }, [visible, slideAnim]);

  const menuItems = [
    {
      icon: "record-voice-over",
      label: "Voice Prints",
      action: "VoicePrints",
      iconType: "material",
    },
    {
      icon: "person-outline",
      label: "Edit Profile",
      action: "editProfile",
      iconType: "ionicon",
    },
    {
      icon: "settings-outline",
      label: "Settings",
      action: "settings",
      iconType: "ionicon",
    },
    {
      icon: "notifications-outline",
      label: "Notifications",
      action: "notifications",
      iconType: "ionicon",
    },
    {
      icon: "shield-checkmark-outline",
      label: "Privacy",
      action: "privacy",
      iconType: "ionicon",
    },
    {
      icon: "help-circle-outline",
      label: "Help & Support",
      action: "help",
      iconType: "ionicon",
    },
    {
      icon: "information-circle-outline",
      label: "About",
      action: "about",
      iconType: "ionicon",
    },
  ];

  const handleMenuPress = (action: string) => {
    onClose?.();

    if (action === "VoicePrints") {
      navigation.navigate("VoicePrints");
      return;
    }

    // Handle other menu items here
    console.log("Menu action:", action);
  };

  const renderIcon = (iconName: string, iconType: string) => {
    if (iconType === "material") {
      return (
        <MaterialIcons name={iconName as any} size={v(20)} color={colors.C3} />
      );
    }
    return (
      <Ionicons name={iconName as any} size={v(20)} color={colors.C3} />
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.modalContainer}>
        {/* Blur Background */}
        <Pressable style={StyleSheet.absoluteFillObject} onPress={onClose}>
          <BlurView
            intensity={20}
            tint="dark"
            style={StyleSheet.absoluteFillObject}
          />
        </Pressable>

        {/* Slide Drawer */}
        <Animated.View
          style={[
            styles.drawer,
            {
              transform: [{ translateX: slideAnim }],
            },
          ]}
        >
          {/* Header Section */}
          <View style={styles.drawerHeader}>
            <View style={styles.profileRow}>
              <View style={styles.avatarLarge}>
                <Image
                  source={{ uri: avatarUri }}
                  style={styles.avatarImage}
                />
              </View>

              <View style={styles.nameCol}>
                <Text style={styles.userName} numberOfLines={2}>
                  {userName} Kakumani
                </Text>
              </View>
            </View>
          </View>

          {/* Menu Items */}
          <ScrollView
            style={styles.menuContainer}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: vs(20) }}
          >
            {menuItems.map((item, index) => (
              <Pressable
                key={index}
                style={({ pressed }) => [
                  styles.menuItem,
                  pressed && styles.menuItemPressed,
                ]}
                onPress={() => handleMenuPress(item.action)}
              >
                <View style={styles.menuIconContainer}>
                  {renderIcon(item.icon, item.iconType)}
                </View>
                <Text style={styles.menuLabel}>{item.label}</Text>
                <Ionicons
                  name="chevron-forward"
                  size={v(18)}
                  color={colors.C3}
                  style={{ opacity: 0.3 }}
                />
              </Pressable>
            ))}

            {/* Logout Button */}
            <Pressable
              style={({ pressed }) => [
                styles.logoutButton,
                pressed && styles.logoutButtonPressed,
              ]}
              onPress={() => console.log("Logout")}
            >
              <Ionicons name="log-out-outline" size={v(22)} color="#E74C3C" />
              <Text style={styles.logoutText}>Logout</Text>
            </Pressable>
          </ScrollView>

          {/* Version Footer */}
          <View style={styles.footer}>
            <Text style={styles.versionText}>Version 1.0.0</Text>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
  },
  drawer: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: DRAWER_WIDTH,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 20,
    shadowOffset: { width: 5, height: 0 },
    elevation: 16,
  },
  drawerHeader: {
    backgroundColor: colors.C1,
    paddingTop: vs(40),
    paddingBottom: vs(0),
    paddingHorizontal: v(20),
  },
  profileRow: {
    flexDirection: "row",
    marginLeft: vs(-10),
    paddingBottom: vs(10),
    paddingTop: vs(19),
  },
  nameCol: {
    flex: 1,
    marginLeft: v(16),
  },
  avatarLarge: {
    width: v(62),
    height: v(62),
    borderRadius: v(45),
    backgroundColor: "rgba(255,255,255,0.25)",
    alignItems: "center",
    justifyContent: "center",
    padding: v(0),
  },
  avatarImage: {
    width: v(52),
    height: v(52),
    borderRadius: v(41),
    borderWidth: v(3),
    borderColor: "#fff",
  },
  userName: {
    fontSize: v(24),
    fontWeight: "700",
    color: "#fff",
    opacity: 0.65,
    marginBottom: vs(4),
  },
  menuContainer: {
    flex: 1,
    marginTop: vs(20),
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: vs(14),
    paddingHorizontal: v(20),
    marginHorizontal: v(12),
    borderRadius: v(12),
    backgroundColor: "#fff",
  },
  menuItemPressed: {
    backgroundColor: colors.C4,
  },
  menuIconContainer: {
    width: v(30),
    height: v(30),
    borderRadius: v(12),
    backgroundColor: colors.C4,
    alignItems: "center",
    justifyContent: "center",
    marginRight: v(12),
  },
  menuLabel: {
    flex: 1,
    fontSize: v(14),
    fontWeight: "600",
    color: colors.C3,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: v(20),
    marginTop: vs(20),
    paddingVertical: vs(14),
    borderRadius: v(12),
    backgroundColor: "#FFF5F5",
    borderWidth: v(1),
    borderColor: "rgba(231,76,60,0.2)",
  },
  logoutButtonPressed: {
    backgroundColor: "#FFE5E5",
  },
  logoutText: {
    fontSize: v(15),
    fontWeight: "700",
    color: "#E74C3C",
    marginLeft: v(8),
  },
  footer: {
    paddingVertical: vs(16),
    alignItems: "center",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "rgba(40,71,102,0.1)",
  },
  versionText: {
    fontSize: v(12),
    fontWeight: "600",
    color: colors.C3,
    opacity: 0.4,
  },
});
