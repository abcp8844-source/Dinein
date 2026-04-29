import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";

/**
 * GLOBAL CUSTOMER DASHBOARD
 * Features: Profile Management | Wallet Sync | 15-Market Localization
 */
export default function CustomerProfile() {
  const { userData, logout } = useAuth();
  const { colors } = useTheme();
  const router = useRouter();

  const menuOptions = [
    {
      id: "1",
      title: "Order History",
      icon: "time-outline",
      route: "/customer/orders",
    },
    {
      id: "2",
      title: "Payment Methods",
      icon: "card-outline",
      route: "/customer/wallet",
    },
    {
      id: "3",
      title: "Delivery Address",
      icon: "location-outline",
      route: "/customer/address-setup",
    },
    {
      id: "4",
      title: "AI Assistant Settings",
      icon: "sparkles-outline",
      route: "/customer/ai-assistant",
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* --- PROFILE HEADER --- */}
        <Animatable.View animation="fadeIn" style={styles.header}>
          <View style={[styles.avatarBorder, { borderColor: colors.primary }]}>
            <View style={styles.avatarPlaceholder}>
              <Ionicons name="person" size={40} color="#333" />
            </View>
          </View>
          <Text style={styles.userName}>
            {userData?.name || "Global Citizen"}
          </Text>
          <Text style={[styles.userRegion, { color: colors.primary }]}>
            📍 {userData?.location?.city || "Syncing Region..."}
          </Text>
        </Animatable.View>

        {/* --- STATS ROW --- */}
        <View style={styles.statsContainer}>
          <TouchableOpacity
            style={styles.statBox}
            onPress={() => router.push("/customer/wallet")}
          >
            <Text style={styles.statLabel}>BALANCE</Text>
            <Text style={[styles.statValue, { color: colors.primary }]}>
              {userData?.walletBalance || "0.00"}{" "}
              <Text style={styles.currency}>
                {userData?.currencyCode || "THB"}
              </Text>
            </Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity
            style={styles.statBox}
            onPress={() => router.push("/customer/orders")}
          >
            <Text style={styles.statLabel}>ORDERS</Text>
            <Text style={styles.statValue}>12</Text>
          </TouchableOpacity>
        </View>

        {/* --- MENU OPTIONS --- */}
        <View style={styles.menuSection}>
          {menuOptions.map((item, index) => (
            <Animatable.View
              key={item.id}
              animation="fadeInUp"
              delay={index * 100}
            >
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => router.push(item.route)}
              >
                <View style={styles.menuLeft}>
                  <Ionicons name={item.icon} size={20} color="#FFF" />
                  <Text style={styles.menuTitle}>{item.title}</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#222" />
              </TouchableOpacity>
            </Animatable.View>
          ))}
        </View>

        {/* --- LOGOUT --- */}
        <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
          <Text style={styles.logoutText}>TERMINATE SESSION</Text>
        </TouchableOpacity>

        <Text style={styles.versionText}>
          AB&CP PREMIUM v1.0.4 | SECURED BY GEMINI AI
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  header: { alignItems: "center", marginTop: 40, marginBottom: 30 },
  avatarBorder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
  },
  avatarPlaceholder: {
    width: "100%",
    height: "100%",
    borderRadius: 50,
    backgroundColor: "#050505",
    justifyContent: "center",
    alignItems: "center",
  },
  userName: {
    color: "#FFF",
    fontSize: 22,
    fontWeight: "900",
    marginTop: 15,
    letterSpacing: 1,
  },
  userRegion: {
    fontSize: 10,
    fontWeight: "bold",
    marginTop: 5,
    letterSpacing: 2,
  },
  statsContainer: {
    flexDirection: "row",
    backgroundColor: "#050505",
    marginHorizontal: 25,
    borderRadius: 25,
    paddingVertical: 25,
    borderWidth: 1,
    borderColor: "#111",
  },
  statBox: { flex: 1, alignItems: "center" },
  statLabel: {
    color: "#444",
    fontSize: 8,
    fontWeight: "900",
    letterSpacing: 1.5,
    marginBottom: 5,
  },
  statValue: { color: "#FFF", fontSize: 18, fontWeight: "bold" },
  currency: { fontSize: 10, fontWeight: "400" },
  divider: { width: 1, height: "100%", backgroundColor: "#111" },
  menuSection: { marginTop: 30, paddingHorizontal: 25 },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 22,
    borderBottomWidth: 1,
    borderBottomColor: "#0A0A0A",
  },
  menuLeft: { flexDirection: "row", alignItems: "center" },
  menuTitle: { color: "#AAA", fontSize: 14, fontWeight: "600", marginLeft: 15 },
  logoutBtn: {
    margin: 40,
    padding: 20,
    alignItems: "center",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#331111",
  },
  logoutText: {
    color: "#FF4444",
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 2,
  },
  versionText: {
    textAlign: "center",
    color: "#111",
    fontSize: 8,
    fontWeight: "bold",
    marginBottom: 40,
    letterSpacing: 1,
  },
});
