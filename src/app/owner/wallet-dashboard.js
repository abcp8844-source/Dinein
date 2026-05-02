import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  FlatList,
} from "react-native";
import { useAuth } from "../../context/AuthContext";
import * as Animatable from "react-native-animatable";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router"; // Added for navigation

export default function OwnerWallet() {
  const { userData } = useAuth();
  const router = useRouter();

  const THEME = {
    bg: "#020B18",
    card: "#051121",
    gold: "#D4AF37",
    goldLight: "#F1D592",
    border: "#1A2A3A",
    success: "#00FF00",
    danger: "#FF3B30",
  };

  // --- REAL DATA SYNC ---
  // Using actual fields from your AuthContext/Firebase
  const currency = userData?.currencyCode || "THB";
  const balance = userData?.walletBalance || 0;
  
  // Safely mapping transactions from userData
  const transactions = userData?.transactions || []; 

  const renderTransaction = ({ item }) => (
    <View
      style={[
        styles.ledgerRow,
        { backgroundColor: THEME.card, borderColor: THEME.border },
      ]}
    >
      <View style={styles.iconCircle}>
        <Ionicons
          name={item.type === "CREDIT" || item.type === "IN" ? "arrow-down-circle" : "arrow-up-circle"}
          size={24}
          color={item.type === "CREDIT" || item.type === "IN" ? THEME.success : THEME.danger}
        />
      </View>
      <View style={{ flex: 1, marginLeft: 15 }}>
        <Text style={[styles.ledgerLabel, { color: "#FFF" }]}>
          {item.label || item.description || "Transaction"}
        </Text>
        <Text style={styles.ledgerDate}>
          {item.date || new Date(item.createdAt).toLocaleDateString()}
        </Text>
      </View>
      <Text
        style={[
          styles.ledgerAmount,
          { color: item.type === "CREDIT" || item.type === "IN" ? THEME.success : THEME.danger },
        ]}
      >
        {item.type === "CREDIT" || item.type === "IN" ? "+" : "-"}
        {item.amount}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: THEME.bg }}>
      <StatusBar barStyle="light-content" />
      
      {/* Back Button Added for Functionality */}
      <TouchableOpacity 
        onPress={() => router.back()} 
        style={{paddingHorizontal: 20, paddingTop: 10}}
      >
        <Ionicons name="chevron-back" size={28} color={THEME.gold} />
      </TouchableOpacity>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Animatable.View animation="fadeIn" style={styles.header}>
          <Text style={[styles.marketTitle, { color: THEME.gold }]}>
            EXECUTIVE REVENUE NODE
          </Text>
          <View style={[styles.balanceBox, { borderColor: THEME.gold }]}>
            <Text style={styles.totalLabel}>CURRENT SETTLEMENT BALANCE</Text>
            <Text style={[styles.mainAmount, { color: "#FFF" }]}>
              {Number(balance).toLocaleString(undefined, { minimumFractionDigits: 2 })}{" "}
              <Text style={{ color: THEME.gold }}>{currency}</Text>
            </Text>
          </View>
          <View style={styles.nodeStatus}>
            <Text style={styles.statusText}>● ENCRYPTED LEDGER ACTIVE</Text>
          </View>
        </Animatable.View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: THEME.gold }]}>
            TRANSACTION HISTORY
          </Text>
          {transactions.length > 0 ? (
            <FlatList
              data={transactions}
              keyExtractor={(item, index) => item.id || index.toString()}
              renderItem={renderTransaction}
              scrollEnabled={false}
            />
          ) : (
            <View style={styles.emptyState}>
              <Text style={{ color: "#5D6D7E", fontSize: 12 }}>
                No recent financial activity detected.
              </Text>
            </View>
          )}
        </View>

        <View style={styles.actionRow}>
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: THEME.gold }]}
            onPress={() => {
              // Link to your real withdrawal or top-up screen
              router.push("/owner/withdraw"); 
            }}
          >
            <Text style={styles.btnText}>INITIATE WITHDRAWAL</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 40, paddingBottom: 40, alignItems: "center", marginTop: 10 },
  marketTitle: {
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 3,
    marginBottom: 20,
  },
  balanceBox: {
    padding: 30,
    borderRadius: 25,
    borderWidth: 1,
    alignItems: "center",
    width: "100%",
    backgroundColor: "rgba(212, 175, 55, 0.05)",
  },
  totalLabel: {
    color: "#5D6D7E",
    fontSize: 9,
    fontWeight: "bold",
    letterSpacing: 1.5,
  },
  mainAmount: { fontSize: 32, fontWeight: "300", marginTop: 10 },
  nodeStatus: {
    marginTop: 20,
    paddingHorizontal: 15,
    paddingVertical: 5,
    backgroundColor: "rgba(0,255,0,0.05)",
    borderRadius: 10,
  },
  statusText: { color: "#00FF00", fontSize: 8, fontWeight: "900" },
  section: { paddingHorizontal: 25, marginTop: 10 },
  sectionTitle: {
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 2,
    marginBottom: 15,
  },
  ledgerRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 18,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 12,
  },
  iconCircle: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: "rgba(255,255,255,0.03)",
    justifyContent: "center",
    alignItems: "center",
  },
  ledgerLabel: { fontSize: 14, fontWeight: "bold" },
  ledgerDate: { fontSize: 9, color: "#5D6D7E", marginTop: 3 },
  ledgerAmount: { fontSize: 15, fontWeight: "900" },
  emptyState: {
    padding: 40,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#1A2A3A",
    borderStyle: "dashed",
    borderRadius: 20,
  },
  actionRow: { padding: 25, marginTop: 10, marginBottom: 40 },
  actionBtn: {
    height: 60,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  btnText: { color: "#000", fontWeight: "900", letterSpacing: 1.5 },
});
