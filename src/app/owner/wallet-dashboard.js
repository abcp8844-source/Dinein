import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  FlatList
} from "react-native";
import { useAuth } from "../../context/AuthContext";
import * as Animatable from "react-native-animatable";
import { Ionicons } from "@expo/vector-icons";

/**
 * EXECUTIVE WALLET NODE - PREMIUM ARCHITECTURE
 * Sync: 20-Market Global Network (LOCKED)
 * Theme: Deep Dark Gold & Obsidian
 */
export default function OwnerWallet() {
  const { userData } = useAuth();

  const THEME = {
    bg: "#020B18",          // Deep Obsidian
    card: "#051121",        // Midnight Blue
    gold: "#D4AF37",        // Premium Dark Gold
    goldLight: "#F1D592",   // Highlight Gold
    border: "#1A2A3A",      // Subtle Definition
    success: "#00FF00",
    danger: "#FF3B30"
  };

  const currency = userData?.currencyCode || "USD";
  const [balance, setBalance] = useState(5850.75);

  // Mock Data: Financial Flow
  const transactions = [
    { id: '1', type: 'IN', label: 'Order Settlement', amount: '+120.00', date: 'May 02, 2026' },
    { id: '2', type: 'OUT', label: 'Market Promotion Fee', amount: '-500.00', date: 'May 02, 2026' },
    { id: '3', type: 'IN', label: 'Regional Bonus Sync', amount: '+50.00', date: 'May 01, 2026' },
  ];

  const renderTransaction = ({ item }) => (
    <View style={[styles.ledgerRow, { backgroundColor: THEME.card, borderColor: THEME.border }]}>
      <View style={styles.iconCircle}>
        <Ionicons 
          name={item.type === 'IN' ? "arrow-down-circle" : "arrow-up-circle"} 
          size={24} 
          color={item.type === 'IN' ? THEME.success : THEME.danger} 
        />
      </View>
      <View style={{ flex: 1, marginLeft: 15 }}>
        <Text style={[styles.ledgerLabel, { color: "#FFF" }]}>{item.label}</Text>
        <Text style={styles.ledgerDate}>{item.date}</Text>
      </View>
      <Text style={[styles.ledgerAmount, { color: item.type === 'IN' ? THEME.success : THEME.danger }]}>
        {item.amount}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: THEME.bg }}>
      <StatusBar barStyle="light-content" />
      <ScrollView showsVerticalScrollIndicator={false}>
        
        {/* PREMIUM GOLD HEADER */}
        <Animatable.View animation="fadeIn" style={styles.header}>
          <Text style={[styles.marketTitle, { color: THEME.gold }]}>GLOBAL REVENUE NODE</Text>
          <View style={[styles.balanceBox, { borderColor: THEME.gold }]}>
            <Text style={styles.totalLabel}>AVAILABLE BALANCE</Text>
            <Text style={[styles.mainAmount, { color: "#FFF" }]}>
              {balance.toLocaleString()} <Text style={{ color: THEME.gold }}>{currency}</Text>
            </Text>
          </View>
          <View style={styles.nodeStatus}>
            <Text style={styles.statusText}>● 20-MARKET REGISTRY: SECURE</Text>
          </View>
        </Animatable.View>

        {/* FINANCIAL FLOW CONTROL */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: THEME.gold }]}>FINANCIAL LOGISTICS</Text>
          <FlatList
            data={transactions}
            keyExtractor={(item) => item.id}
            renderItem={renderTransaction}
            scrollEnabled={false}
          />
        </View>

        {/* ACTION PANEL */}
        <View style={styles.actionRow}>
          <TouchableOpacity style={[styles.actionBtn, { backgroundColor: THEME.gold }]}>
            <Text style={styles.btnText}>WITHDRAW TO BANK</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: { padding: 40, alignItems: "center", marginTop: 20 },
  marketTitle: { fontSize: 10, fontWeight: "900", letterSpacing: 3, marginBottom: 20 },
  balanceBox: { padding: 30, borderRadius: 25, borderWidth: 1, alignItems: "center", width: '100%', backgroundColor: 'rgba(212, 175, 55, 0.05)' },
  totalLabel: { color: "#5D6D7E", fontSize: 9, fontWeight: "bold", letterSpacing: 1.5 },
  mainAmount: { fontSize: 40, fontWeight: "200", marginTop: 10 },
  nodeStatus: { marginTop: 20, paddingHorizontal: 15, paddingVertical: 5, backgroundColor: "rgba(0,255,0,0.1)", borderRadius: 10 },
  statusText: { color: "#00FF00", fontSize: 8, fontWeight: "900" },
  section: { paddingHorizontal: 25, marginTop: 20 },
  sectionTitle: { fontSize: 10, fontWeight: "900", letterSpacing: 2, marginBottom: 15 },
  ledgerRow: { flexDirection: "row", alignItems: "center", padding: 18, borderRadius: 20, borderWidth: 1, marginBottom: 12 },
  iconCircle: { width: 45, height: 45, borderRadius: 22.5, backgroundColor: "rgba(255,255,255,0.03)", justifyContent: "center", alignItems: "center" },
  ledgerLabel: { fontSize: 14, fontWeight: "bold" },
  ledgerDate: { fontSize: 9, color: "#5D6D7E", marginTop: 3 },
  ledgerAmount: { fontSize: 15, fontWeight: "900" },
  actionRow: { padding: 25, marginTop: 10 },
  actionBtn: { height: 60, borderRadius: 18, justifyContent: "center", alignItems: "center", elevation: 8 },
  btnText: { color: "#000", fontWeight: "900", letterSpacing: 1.5 }
});
