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
  ActivityIndicator,
} from "react-native";
import { db } from "../../services/firebaseConfig"; // Direct Firebase Import
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  updateDoc,
  orderBy,
} from "firebase/firestore"; // Added Firestore Methods
import { useAuth } from "../../context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function ManageOrders() {
  const { userData } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const THEME = {
    bg: "#001529",
    card: "#002F56",
    accent: "#D4AF37",
    textMain: "#FFFFFF",
    textSecondary: "#A6B1BB",
    addressBox: "#003A6B",
    border: "#004B87",
  };

  useEffect(() => {
    if (!userData?.uid) return;

    // REAL-TIME LISTENER: This replaces the dummy loadIncomingOrders
    const ordersRef = collection(db, "orders");
    const q = query(
      ordersRef,
      where("ownerId", "==", userData.uid), // Pulling real owner orders
      orderBy("createdAt", "desc"), // Latest orders first
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const allOrders = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setOrders(allOrders);
        setLoading(false);
      },
      (error) => {
        console.error("Real-time Sync Error:", error);
        setLoading(false);
      },
    );

    return () => unsubscribe(); // Cleanup on unmount
  }, [userData]);

  const updateStatus = async (orderId, status) => {
    try {
      const orderRef = doc(db, "orders", orderId);
      await updateDoc(orderRef, {
        status: status,
        updatedAt: new Date().toISOString(),
      });

      Alert.alert(
        "Success",
        `Order status updated to: ${status.toUpperCase()}`,
      );
    } catch (error) {
      Alert.alert("System Error", "Failed to update order status.");
      console.error(error);
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

      <View style={[styles.addressBox, { backgroundColor: THEME.addressBox }]}>
        <Text style={[styles.addressLabel, { color: THEME.accent }]}>
          DELIVERY TO:
        </Text>
        <Text style={[styles.addressText, { color: THEME.textMain }]}>
          📍 {item.customerLocation?.street || "No Street Provided"}
        </Text>
        <Text style={[styles.cityText, { color: THEME.textSecondary }]}>
          {item.customerLocation?.city || "Unknown City"},{" "}
          {item.customerLocation?.country || "N/A"}
        </Text>
      </View>

      <View style={styles.statusRow}>
        <Text style={{ color: THEME.textSecondary, fontSize: 12 }}>
          Current Status:
        </Text>
        <Text style={[styles.statusText, { color: THEME.accent }]}>
          {item.status.toUpperCase()}
        </Text>
      </View>

      {item.status === "pending" && (
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
      )}
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

      {loading ? (
        <ActivityIndicator
          size="large"
          color={THEME.accent}
          style={{ marginTop: 50 }}
        />
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id}
          renderItem={renderOrder}
          contentContainerStyle={{ padding: 20 }}
          ListEmptyComponent={
            <Text style={[styles.emptyText, { color: THEME.textSecondary }]}>
              No active orders found.
            </Text>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topHeader: { padding: 25, flexDirection: "row", alignItems: "center" },
  headerText: { fontSize: 24, fontWeight: "900", marginLeft: 15 },
  card: { padding: 20, borderRadius: 20, borderWidth: 1.5, marginBottom: 20 },
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
