import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function AdminHome() {
  const router = useRouter();
  const [stats, setStats] = useState({ users: 0, owners: 0, tickets: 0 });

  // Real-time synchronization for dashboard metrics
  useEffect(() => {
    const fetchGlobalStats = async () => {
      const usersSnap = await getDocs(collection(db, "users"));
      const ticketsSnap = await getDocs(
        query(
          collection(db, "support_tickets"),
          where("status", "==", "pending"),
        ),
      );

      let uCount = 0,
        oCount = 0;
      usersSnap.forEach((doc) => {
        if (doc.data().role === "owner") oCount++;
        else uCount++;
      });
      setStats({ users: uCount, owners: oCount, tickets: ticketsSnap.size });
    };
    fetchGlobalStats();
  }, []);

  const AdminCard = ({ title, value, icon, route, color }) => (
    <TouchableOpacity style={styles.card} onPress={() => router.push(route)}>
      <MaterialCommunityIcons name={icon} size={30} color={color} />
      <Text style={styles.cardValue}>{value}</Text>
      <Text style={styles.cardTitle}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.mainTitle}>NETWORK CONTROL</Text>

        <View style={styles.grid}>
          <AdminCard
            title="CUSTOMERS"
            value={stats.users}
            icon="account-group"
            route="/(admin)/manage-users"
            color="#4CAF50"
          />
          <AdminCard
            title="OWNERS"
            value={stats.owners}
            icon="storefront"
            route="/(admin)/manage-owners"
            color="#D4AF37"
          />
          <AdminCard
            title="PENDING TICKETS"
            value={stats.tickets}
            icon="alert-decagram"
            route="/(admin)/support-tickets"
            color="#FF3B30"
          />
          <AdminCard
            title="FINANCES"
            value="LIVE"
            icon="wallet"
            route="/(admin)/manage-finances"
            color="#2196F3"
          />
        </View>

        <TouchableOpacity
          style={styles.fullWidthBtn}
          onPress={() => router.push("/(admin)/wallet")}
        >
          <MaterialCommunityIcons name="finance" size={24} color="#D4AF37" />
          <Text style={styles.btnText}>GLOBAL LIQUIDITY OVERVIEW</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#020B18" },
  scrollContent: { padding: 20 },
  mainTitle: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "900",
    letterSpacing: 2,
    marginBottom: 30,
    textAlign: "center",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    backgroundColor: "#0A1A2F",
    width: "48%",
    padding: 20,
    borderRadius: 20,
    alignItems: "center",
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#1B2631",
  },
  cardValue: {
    color: "#FFF",
    fontSize: 22,
    fontWeight: "900",
    marginVertical: 8,
  },
  cardTitle: {
    color: "#5D6D7E",
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1,
  },
  fullWidthBtn: {
    backgroundColor: "#0A1A2F",
    padding: 20,
    borderRadius: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 15,
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#D4AF37",
  },
  btnText: { color: "#FFF", fontSize: 12, fontWeight: "900", letterSpacing: 1 },
});
