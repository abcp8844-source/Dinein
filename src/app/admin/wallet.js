import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from "react-native";
import { doc, onSnapshot } from "firebase/firestore";
// Corrected the path to access src/services/firebaseConfig
import { db } from "../../services/firebaseConfig";
import { MaterialCommunityIcons } from "@expo/vector-icons";

/**
 * ADMIN REVENUE TERMINAL
 * Monitoring: Commissions, Promotion Fees, and Global Liquidity.
 * Version: 2.0 (Clean Architecture - No Urdu)
 */
export default function AdminWallet() {
  const [revenue, setRevenue] = useState({
    commission: 0,
    promotions: 0,
    total: 0,
  });

  useEffect(() => {
    // REAL-TIME SYNC: Global Revenue Node
    const adminRef = doc(db, "admin_stats", "global_revenue");

    const unsubscribe = onSnapshot(adminRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setRevenue({
          commission: data.commissionEarnings || 0,
          promotions: data.promotionFees || 0,
          total: (data.commissionEarnings || 0) + (data.promotionFees || 0),
        });
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* TOTAL EARNINGS DISPLAY */}
        <View style={styles.mainBalanceCard}>
          <Text style={styles.label}>TOTAL NETWORK EARNINGS</Text>
          <Text style={styles.amount}>
            $
            {revenue.total.toLocaleString(undefined, {
              minimumFractionDigits: 2,
            })}
          </Text>
          <View style={styles.divider} />
          <Text style={styles.subLabel}>20 COUNTRIES AGGREGATED</Text>
        </View>

        {/* REVENUE STREAMS */}
        <View style={styles.statsGrid}>
          <View style={styles.statBox}>
            <MaterialCommunityIcons name="percent" size={24} color="#D4AF37" />
            <Text style={styles.statVal}>${revenue.commission.toFixed(2)}</Text>
            <Text style={styles.statLabel}>COMMISSIONS</Text>
          </View>

          <View style={styles.statBox}>
            <MaterialCommunityIcons
              name="bullhorn-outline"
              size={24}
              color="#D4AF37"
            />
            <Text style={styles.statVal}>${revenue.promotions.toFixed(2)}</Text>
            <Text style={styles.statLabel}>PROMOTIONS</Text>
          </View>
        </View>

        {/* AUDIT NOTE */}
        <View style={styles.footerNote}>
          <MaterialCommunityIcons
            name="shield-check"
            size={16}
            color="#5D6D7E"
          />
          <Text style={styles.footerText}>
            SECURE TRANSACTION MONITORING ACTIVE
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#020B18" },
  scrollContent: { padding: 25 },
  mainBalanceCard: {
    backgroundColor: "#0A1A2F",
    padding: 35,
    borderRadius: 30,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D4AF37",
    marginBottom: 25,
  },
  label: {
    color: "#5D6D7E",
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 2,
  },
  amount: {
    color: "#FFF",
    fontSize: 40,
    fontWeight: "900",
    marginVertical: 15,
  },
  divider: {
    height: 1,
    width: "40%",
    backgroundColor: "#1B2631",
    marginVertical: 10,
  },
  subLabel: {
    color: "#D4AF37",
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 1,
  },
  statsGrid: { flexDirection: "row", justifyContent: "space-between" },
  statBox: {
    backgroundColor: "#051121",
    width: "48%",
    padding: 20,
    borderRadius: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#0A1A2F",
  },
  statVal: { color: "#FFF", fontSize: 18, fontWeight: "800", marginTop: 10 },
  statLabel: {
    color: "#5D6D7E",
    fontSize: 8,
    fontWeight: "900",
    letterSpacing: 1,
    marginTop: 5,
  },
  footerNote: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
    gap: 10,
  },
  footerText: {
    color: "#5D6D7E",
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 1,
  },
});
