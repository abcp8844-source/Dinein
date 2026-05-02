import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { dbService } from "../../services/dbService";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function ManageOrders() {
  const { userData } = useAuth();
  const { colors } = useTheme();
  const router = useRouter();
  const [orders, setOrders] = useState([]);

  // PREMIUM VISIBILITY COLORS
  const THEME = {
    bg: "#001529", // Dark Navy Background
    card: "#002F56", // Lighter Navy (Box stays visible/clear)
    accent: "#D4AF37", // Premium Gold for highlights
    textMain: "#FFFFFF", // Sharp White for readability
    textSecondary: "#A6B1BB",
    addressBox: "#003A6B", // Even clearer box for delivery info
    border: "#004B87", // Sharp border for definition
  };

  useEffect(() => {
    loadIncomingOrders();
  }, []);

  const loadIncomingOrders = async () => {
    try {
      const allOrders = await dbService.getOwnerOrders(userData.uid);
      setOrders(allOrders || []);
    } catch (error) {
      console.log("Order Fetch Error:", error.message);
    }
  };

  const updateStatus = async (orderId, status) => {
    try {
      await dbService.updateOrderStatus(orderId, status);
      Alert.alert(
        "System Notification",
        `Order is now: ${status.toUpperCase()}`,
      );
      loadIncomingOrders();
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  const renderOrder = ({ item }) => (
    <View
      style={[
        styles.card,
        { backgroundColor: THEME.card, borderColor: THEME.border },
      ]}
    >
      <View style={styles.cardHeader}>
        <Text style={[styles.itemTitle, { color: THEME.textMain }]}>
          {item.itemName}
        </Text>
        <Text style={[styles.priceTag, { color: THEME.accent }]}>
          {item.price} {item.currency || "THB"}
        </Text>
      </View>

      {/* 📍 DELIVERY BOX - High Contrast */}
      <View style={[styles.addressBox, { backgroundColor: THEME.addressBox }]}>
        <Text style={[styles.addressLabel, { color: THEME.accent }]}>
          DELIVERY TO:
        </Text>
        <Text style={[styles.addressText, { color: THEME.textMain }]}>
          📍 {item.customerLocation?.street || "No Street Provided"}
        </Text>
        <Text style={[styles.cityText, { color: THEME.textSecondary }]}>
          {item.customerLocation?.city}, {item.customerLocation?.country}
        </Text>
      </View>

      <View style={styles.statusRow}>
        <Text style={{ color: THEME.textSecondary, fontSize: 12 }}>
          Status:
        </Text>
        <Text style={[styles.statusText, { color: THEME.accent }]}>
          {item.status.toUpperCase()}
        </Text>
      </View>

      <View style={styles.btnRow}>
        <TouchableOpacity
          style={[styles.actionBtn, { backgroundColor: "#1B5E20" }]}
          onPress={() => updateStatus(item.id, "preparing")}
        >
          <Text style={styles.btnText}>ACCEPT</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionBtn, { backgroundColor: "#B71C1C" }]}
          onPress={() => updateStatus(item.id, "cancelled")}
        >
          <Text style={styles.btnText}>REJECT</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: THEME.bg }]}>
      <StatusBar barStyle="light-content" />
      <View style={styles.topHeader}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} color={THEME.textMain} />
        </TouchableOpacity>
        <Text style={[styles.headerText, { color: THEME.textMain }]}>
          Incoming Orders
        </Text>
      </View>

      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={renderOrder}
        contentContainerStyle={{ padding: 20 }}
        ListEmptyComponent={
          <Text style={[styles.emptyText, { color: THEME.textSecondary }]}>
            No active orders.
          </Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topHeader: { padding: 25, flexDirection: "row", alignItems: "center" },
  headerText: { fontSize: 24, fontWeight: "900", marginLeft: 15 },
  card: {
    padding: 20,
    borderRadius: 20,
    borderWidth: 1.5,
    marginBottom: 20,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  itemTitle: { fontSize: 18, fontWeight: "bold" },
  priceTag: { fontSize: 16, fontWeight: "900" },
  addressBox: { padding: 12, borderRadius: 12, marginBottom: 15 },
  addressLabel: { fontSize: 8, fontWeight: "bold", marginBottom: 4 },
  addressText: { fontSize: 13, fontWeight: "600" },
  cityText: { fontSize: 11 },
  statusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  statusText: { fontWeight: "900", fontSize: 12 },
  btnRow: { flexDirection: "row", justifyContent: "space-between" },
  actionBtn: {
    paddingVertical: 12,
    borderRadius: 12,
    flex: 0.47,
    alignItems: "center",
  },
  btnText: { color: "#FFF", fontSize: 12, fontWeight: "bold" },
  emptyText: { textAlign: "center", marginTop: 50 },
});
