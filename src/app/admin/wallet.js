import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useTheme } from "../../context/ThemeContext";
import * as Animatable from "react-native-animatable";

/**
 * MASTER ADMIN GLOBAL TREASURY
 * Purpose: View and manage promotion revenue from all 15 markets.
 */
export default function AdminWallet() {
  const { colors } = useTheme();

  // Logic: In production, this pulls data from WalletEngine.getAdminGlobalRevenue()
  const [globalRevenue, setGlobalRevenue] = useState([
    { id: "THA", country: "Thailand", amount: 150000, currency: "THB" },
    { id: "ARE", country: "UAE", amount: 4500, currency: "AED" },
    { id: "USA", country: "United States", amount: 1200, currency: "USD" },
    // Other 15 markets will follow...
  ]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>GLOBAL REVENUE NODE</Text>
        <Text style={styles.subTitle}>MASTER ADMIN OVERVIEW</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {globalRevenue.map((market, index) => (
          <Animatable.View
            key={market.id}
            animation="fadeInUp"
            delay={index * 100}
            style={styles.marketCard}
          >
            <View>
              <Text style={styles.marketName}>
                {market.country.toUpperCase()}
              </Text>
              <Text style={styles.marketId}>NODE ID: {market.id}</Text>
            </View>
            <View style={styles.amountContainer}>
              <Text style={[styles.amountText, { color: colors.primary }]}>
                {market.amount.toLocaleString()}
              </Text>
              <Text style={styles.currencyText}>{market.currency}</Text>
            </View>
          </Animatable.View>
        ))}

        <TouchableOpacity style={styles.settleBtn}>
          <Text style={styles.settleText}>
            GENERATE GLOBAL FINANCIAL REPORT
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  header: {
    padding: 30,
    backgroundColor: "#050505",
    borderBottomWidth: 1,
    borderBottomColor: "#1A1A1A",
    alignItems: "center",
  },
  headerTitle: {
    color: "#D4AF37",
    fontSize: 18,
    fontWeight: "900",
    letterSpacing: 2,
  },
  subTitle: { color: "#444", fontSize: 9, marginTop: 5, fontWeight: "bold" },
  scrollContent: { padding: 20 },
  marketCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#0A0A0A",
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#111",
  },
  marketName: { color: "#FFF", fontSize: 14, fontWeight: "bold" },
  marketId: { color: "#444", fontSize: 8, marginTop: 2, fontWeight: "900" },
  amountContainer: { alignItems: "flex-end" },
  amountText: { fontSize: 18, fontWeight: "900" },
  currencyText: { color: "#A68D5F", fontSize: 10, fontWeight: "bold" },
  settleBtn: {
    backgroundColor: "#D4AF37",
    height: 55,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 40,
  },
  settleText: {
    color: "#000",
    fontWeight: "900",
    fontSize: 11,
    letterSpacing: 1,
  },
});
