import React from "react";
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, StatusBar } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../theme/ThemeContext";
import PremiumButton from "../../components/PremiumButton";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";

export default function OrderSuccess() {
  const { orderId, itemName, amount } = useLocalSearchParams();
  const { userData } = useAuth();
  const { colors } = useTheme();
  const router = useRouter();

  const currency = userData?.currencyCode || "USD";

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: "#020B18" }]}>
      <StatusBar barStyle="light-content" />
      
      <Animatable.View animation="zoomIn" duration={800} style={styles.successCard}>
        
        <Animatable.View
          animation="pulse"
          iterationCount="infinite"
          style={[styles.iconCircle, { backgroundColor: colors.primary }]}
        >
          <MaterialCommunityIcons name="check-bold" size={45} color="#000" />
        </Animatable.View>

        <Text style={styles.title}>ORDER SECURED</Text>
        <Text style={styles.subtitle}>VERIFIED ON GLOBAL MARKET NODE</Text>

        <Animatable.View
          animation="fadeInUp"
          delay={500}
          style={[styles.receiptContainer, { backgroundColor: "#051121", borderColor: "#0A1A2F" }]}
        >
          <View style={styles.receiptHeader}>
            <Text style={styles.receiptLabel}>DIGITAL RECEIPT</Text>
            <View style={[styles.statusDot, { backgroundColor: colors.primary }]} />
          </View>

          <View style={styles.receiptRow}>
            <Text style={styles.label}>TRANSACTION ID</Text>
            <Text style={styles.value}>#{orderId?.slice(-8).toUpperCase() || "PENDING"}</Text>
          </View>

          <View style={styles.receiptRow}>
            <Text style={styles.label}>ASSET ACQUIRED</Text>
            <Text style={styles.value}>{itemName?.toUpperCase()}</Text>
          </View>

          <View style={[styles.divider, { backgroundColor: "#0A1A2F" }]} />

          <View style={styles.receiptRow}>
            <Text style={[styles.totalLabel, { color: "#5D6D7E" }]}>TOTAL SETTLED</Text>
            <View style={styles.priceStack}>
              <Text style={[styles.totalAmount, { color: colors.primary }]}>{amount}</Text>
              <Text style={styles.currencyCode}>{currency}</Text>
            </View>
          </View>
        </Animatable.View>

        <Animatable.View animation="fadeInUp" delay={800} style={styles.footer}>
          <PremiumButton
            title="LAUNCH LOGISTICS TRACKER"
            onPress={() => router.replace("/(customer)/orders")}
          />
          <TouchableOpacity
            onPress={() => router.replace("/(customer)/home")}
            style={styles.homeLink}
          >
            <Text style={styles.homeLinkText}>RETURN TO DISCOVER</Text>
          </TouchableOpacity>
        </Animatable.View>
      </Animatable.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 30 },
  successCard: { alignItems: "center" },
  iconCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 25,
    shadowColor: "#D4AF37",
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 10,
  },
  title: { fontSize: 26, fontWeight: "900", letterSpacing: 2, marginBottom: 10, color: "#FFF" },
  subtitle: { fontSize: 9, color: "#5D6D7E", marginBottom: 40, letterSpacing: 2, fontWeight: "900" },
  receiptContainer: { width: "100%", padding: 30, borderRadius: 30, borderWidth: 1, marginBottom: 40 },
  receiptHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 25 },
  receiptLabel: { color: "#5D6D7E", fontSize: 9, fontWeight: "900", letterSpacing: 2 },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  receiptRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 20, alignItems: "center" },
  label: { color: "#2C3E50", fontSize: 10, fontWeight: "900", letterSpacing: 0.5 },
  value: { color: "#FFF", fontSize: 14, fontWeight: "700" },
  divider: { height: 1, width: "100%", marginVertical: 10 },
  totalLabel: { fontSize: 10, fontWeight: "900", letterSpacing: 1 },
  priceStack: { alignItems: "flex-end" },
  totalAmount: { fontSize: 28, fontWeight: "300" },
  currencyCode: { fontSize: 10, color: "#5D6D7E", fontWeight: "900", marginTop: 2 },
  footer: { width: "100%" },
  homeLink: { marginTop: 25, alignItems: "center" },
  homeLinkText: { color: "#2C3E50", fontSize: 10, fontWeight: "900", letterSpacing: 1.5 },
});
