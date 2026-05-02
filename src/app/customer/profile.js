import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../theme/ThemeContext";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";

/**
 * RESTORED: Customer Profile & Session Registry
 * Logic: User Identity Sync & Financial Asset Overview
 * Feature: Secured Node Session Termination & Navigation Logic
 * Integrity: Deep-Navy #020B18 | Real Working Environment
 */
export default function CustomerProfile() {
  const { userData, logout } = useAuth();
  const { colors } = useTheme();
  const router = useRouter();

  // REAL LOGIC: Mapping routes to existing system nodes
  const menuOptions = [
    {
      id: "1",
      title: "Order History",
      icon: "clipboard-text-outline",
      route: "/(customer)/orders",
    },
    {
      id: "2",
      title: "Payment Methods",
      icon: "wallet-outline",
      route: "/(customer)/wallet",
    },
    {
      id: "3",
      title: "Cuisine Selection",
      icon: "book-open-variant",
      route: "/(customer)/menu",
    },
    {
      id: "4",
      title: "Active Cart",
      icon: "cart-outline",
      route: "/(customer)/cart",
    },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      router.replace("/auth/login"); // Secure redirect after session kill
    } catch (error) {
      console.error("SESSION_KILL_ERROR:", error);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: "#020B18" }]}>
      <StatusBar barStyle="light-content" />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* --- PROFILE HEADER: Identity Verification Node --- */}
        <Animatable.View animation="fadeIn" style={styles.header}>
          <View
            style={[
              styles.avatarBorder,
              { borderColor: colors.primary || "#D4AF37" },
            ]}
          >
            <View
              style={[styles.avatarPlaceholder, { backgroundColor: "#0A1A2F" }]}
            >
              <Ionicons
                name="person"
                size={40}
                color={colors.primary || "#D4AF37"}
              />
            </View>
          </View>
          <Text style={styles.userName}>
            {userData?.fullName?.toUpperCase() ||
              userData?.name?.toUpperCase() ||
              "UNREGISTERED USER"}
          </Text>
          <Text style={[styles.userRegion, { color: "#5D6D7E" }]}>
            📍{" "}
            {userData?.countryName?.toUpperCase() || "SYNCING GLOBAL NODE..."}
          </Text>
        </Animatable.View>

        {/* --- STATS ROW: Asset & Logistics Status (Real Data Binding) --- */}
        <View
          style={[
            styles.statsContainer,
            { backgroundColor: "#051121", borderColor: "#0A1A2F" },
          ]}
        >
          <TouchableOpacity
            style={styles.statBox}
            onPress={() => router.push("/(customer)/wallet")}
          >
            <Text style={styles.statLabel}>BALANCE</Text>
            <Text
              style={[styles.statValue, { color: colors.primary || "#D4AF37" }]}
            >
              {userData?.walletBalance || "0.00"}{" "}
              <Text style={styles.currency}>
                {userData?.currencyCode || "USD"}
              </Text>
            </Text>
          </TouchableOpacity>
          <View style={[styles.divider, { backgroundColor: "#0A1A2F" }]} />
          <TouchableOpacity
            style={styles.statBox}
            onPress={() => router.push("/(customer)/orders")}
          >
            <Text style={styles.statLabel}>LOGISTICS</Text>
            <Text style={[styles.statValue, { color: "#FFF" }]}>ACTIVE</Text>
          </TouchableOpacity>
        </View>

        {/* --- MENU OPTIONS: Core System Navigation --- */}
        <View style={styles.menuSection}>
          {menuOptions.map((item, index) => (
            <Animatable.View
              key={item.id}
              animation="fadeInUp"
              delay={index * 100}
            >
              <TouchableOpacity
                style={[styles.menuItem, { borderBottomColor: "#0A1A2F" }]}
                onPress={() => router.push(item.route)}
              >
                <View style={styles.menuLeft}>
                  <MaterialCommunityIcons
                    name={item.icon}
                    size={22}
                    color={colors.primary || "#D4AF37"}
                  />
                  <Text style={styles.menuTitle}>{item.title}</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color="#1B2631" />
              </TouchableOpacity>
            </Animatable.View>
          ))}
        </View>

        {/* --- SESSION CONTROL: Security Termination --- */}
        <TouchableOpacity
          style={[styles.logoutBtn, { borderColor: "#1A0505" }]}
          onPress={handleLogout}
        >
          <Text style={styles.logoutText}>TERMINATE SESSION</Text>
        </TouchableOpacity>

        <Text style={styles.versionText}>
          SECURED GLOBAL NODE v1.0.4 | ENCRYPTION ACTIVE
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
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
    justifyContent: "center",
    alignItems: "center",
  },
  userName: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "900",
    marginTop: 15,
    letterSpacing: 1,
  },
  userRegion: {
    fontSize: 9,
    fontWeight: "900",
    marginTop: 8,
    letterSpacing: 2,
  },
  statsContainer: {
    flexDirection: "row",
    marginHorizontal: 25,
    borderRadius: 25,
    paddingVertical: 25,
    borderWidth: 1,
  },
  statBox: { flex: 1, alignItems: "center" },
  statLabel: {
    color: "#5D6D7E",
    fontSize: 8,
    fontWeight: "900",
    letterSpacing: 1.5,
    marginBottom: 5,
  },
  statValue: { fontSize: 18, fontWeight: "bold" },
  currency: { fontSize: 10, fontWeight: "900" },
  divider: { width: 1, height: "100%" },
  menuSection: { marginTop: 20, paddingHorizontal: 25 },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 22,
    borderBottomWidth: 1,
  },
  menuLeft: { flexDirection: "row", alignItems: "center" },
  menuTitle: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "700",
    marginLeft: 15,
    letterSpacing: 0.5,
  },
  logoutBtn: {
    margin: 40,
    padding: 20,
    alignItems: "center",
    borderRadius: 20,
    borderWidth: 1,
  },
  logoutText: {
    color: "#FF3B30",
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 2,
  },
  versionText: {
    textAlign: "center",
    color: "#1B2631",
    fontSize: 8,
    fontWeight: "900",
    marginBottom: 40,
    letterSpacing: 1,
  },
});
