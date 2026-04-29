import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { useAuth } from "../../context/AuthContext";

export default function AdminDashboard() {
  const { logout, marketISO, userData } = useAuth();

  // Simple formatting for the UI
  const adminName = userData?.name || "Master Admin";

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.adminTitle}>ADMIN CONTROL</Text>
        <Text style={styles.nodeStatus}>NODE: {marketISO} | AUTH: SECURE</Text>
      </View>

      <ScrollView style={styles.container}>
        {/* TOTAL REVENUE SUMMARY */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>TOTAL REVENUE (GLOBAL)</Text>
          <Text style={styles.cardValue}>$ 0.00</Text>
        </View>

        {/* MARKET MANAGEMENT SECTION */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>MARKET OPERATIONS</Text>

          <View style={styles.row}>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.btnText}>OWNER REQUESTS</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button}>
              <Text style={styles.btnText}>ACTIVE STORES</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.row}>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.btnText}>TRANSACTIONS</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button}>
              <Text style={styles.btnText}>SYSTEM LOGS</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* LOGOUT */}
        <TouchableOpacity style={styles.exitBtn} onPress={logout}>
          <Text style={styles.exitBtnText}>CLOSE SESSION</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#000" },
  header: {
    padding: 25,
    borderBottomWidth: 1,
    borderBottomColor: "#111",
    alignItems: "center",
  },
  adminTitle: {
    color: "#D4AF37",
    fontSize: 14,
    fontWeight: "bold",
    letterSpacing: 2,
  },
  nodeStatus: { color: "#444", fontSize: 8, marginTop: 4 },
  container: { flex: 1, padding: 15 },
  card: {
    backgroundColor: "#050505",
    padding: 25,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#111",
    alignItems: "center",
    marginBottom: 20,
  },
  cardLabel: { color: "#333", fontSize: 10, fontWeight: "bold" },
  cardValue: { color: "#FFF", fontSize: 28, fontWeight: "bold", marginTop: 5 },
  section: { marginBottom: 20 },
  sectionTitle: {
    color: "#444",
    fontSize: 9,
    fontWeight: "bold",
    marginBottom: 10,
    marginLeft: 5,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  button: {
    width: "48%",
    backgroundColor: "#0A0A0A",
    padding: 18,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#111",
    alignItems: "center",
  },
  btnText: { color: "#AAA", fontSize: 10, fontWeight: "bold" },
  exitBtn: { marginTop: 20, padding: 20, alignItems: "center" },
  exitBtnText: {
    color: "#FF4444",
    fontSize: 10,
    fontWeight: "bold",
    letterSpacing: 1,
  },
});
