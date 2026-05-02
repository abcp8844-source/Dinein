import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../services/firebaseConfig"; // Added for Real Data
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
} from "firebase/firestore"; // Added for Real Sync
import { Ionicons } from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";

export default function OwnerDashboard() {
  const { userData } = useAuth();
  const router = useRouter();

  const [isOnline, setIsOnline] = useState(true);
  const [orders, setOrders] = useState([]); // Now empty, will fill from DB
  const [loading, setLoading] = useState(true);
  const [todayRevenue, setTodayRevenue] = useState(0);

  const THEME = {
    bg: "#001529",
    card: "#002140",
    accent: "#D4AF37",
    textMain: "#FFFFFF",
    textSecondary: "#A6B1BB",
  };

  // --- REAL-TIME DATA SYNC ---
  useEffect(() => {
    if (!userData?.uid) return;

    // Listen for orders assigned to this owner
    const q = query(
      collection(db, "orders"),
      where("ownerId", "==", userData.uid),
      orderBy("createdAt", "desc"),
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const ordersList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setOrders(ordersList);

        // REAL REVENUE CALCULATION: Sum of all orders price
        const total = ordersList.reduce(
          (sum, order) => sum + (Number(order.price) || 0),
          0,
        );
        setTodayRevenue(total);

        setLoading(false);
      },
      (error) => {
        console.log("Dashboard Sync Error:", error);
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, [userData]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: THEME.bg }]}>
      <StatusBar barStyle="light-content" />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* --- BRAND & STATUS HEADER --- */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.brandTitle, { color: THEME.textSecondary }]}>
              OWNER PANEL
            </Text>
            <Text style={[styles.storeName, { color: THEME.accent }]}>
              {userData?.restaurantName || "AB&CP Official"}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => setIsOnline(!isOnline)}
            style={[
              styles.statusToggle,
              { backgroundColor: isOnline ? "#06402B" : "#4D0F0F" },
            ]}
          >
            <View
              style={[
                styles.statusDot,
                { backgroundColor: isOnline ? "#00FF00" : "#FF0000" },
              ]}
            />
            <Text
              style={[
                styles.statusText,
                { color: isOnline ? "#00FF00" : "#FF0000" },
              ]}
            >
              {isOnline ? "STORE OPEN" : "STORE CLOSED"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* --- REAL REVENUE SNAPSHOT --- */}
        <Animatable.View
          animation="fadeInUp"
          style={[styles.revenueCard, { backgroundColor: THEME.card }]}
        >
          <Text style={[styles.cardLabel, { color: THEME.textSecondary }]}>
            TODAY'S REVENUE
          </Text>
          <Text style={[styles.revenueAmount, { color: THEME.accent }]}>
            {loading ? "..." : todayRevenue.toLocaleString()}{" "}
            <Text style={styles.currency}>
              {userData?.currencyCode || "THB"}
            </Text>
          </Text>
          <View style={[styles.aiBriefing, { borderTopColor: THEME.bg }]}>
            <Ionicons name="trending-up" size={16} color={THEME.accent} />
            <Text style={[styles.aiBriefText, { color: THEME.textMain }]}>
              Real-time sync active for {userData?.idOrigin || "Thailand"}.
            </Text>
          </View>
        </Animatable.View>

        {/* --- QUICK ACTION GRID --- */}
        <View style={styles.actionGrid}>
          <TouchableOpacity
            style={[styles.actionBox, { backgroundColor: THEME.card }]}
            onPress={() => router.push("/owner/manage-menu")}
          >
            <Ionicons
              name="fast-food-outline"
              size={24}
              color={THEME.textMain}
            />
            <Text style={[styles.actionLabel, { color: THEME.textSecondary }]}>
              MANAGE MENU
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionBox, { backgroundColor: THEME.card }]}
            onPress={() => router.push("/owner/wallet")}
          >
            <Ionicons name="wallet-outline" size={24} color={THEME.accent} />
            <Text style={[styles.actionLabel, { color: THEME.textSecondary }]}>
              MY WALLET
            </Text>
          </TouchableOpacity>
        </View>

        {/* --- LIVE ORDERS SECTION --- */}
        <View style={styles.orderSection}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: THEME.textSecondary }]}>
              LIVE INCOMING ORDERS
            </Text>
            <Text style={[styles.orderCount, { color: THEME.accent }]}>
              {orders.length} ACTIVE
            </Text>
          </View>

          {loading ? (
            <ActivityIndicator color={THEME.accent} />
          ) : (
            orders.map((order) => (
              <Animatable.View
                key={order.id}
                animation="fadeInLeft"
                style={[styles.orderCard, { backgroundColor: THEME.card }]}
              >
                <View style={styles.orderMeta}>
                  <Text
                    style={[styles.orderId, { color: THEME.textSecondary }]}
                  >
                    #{order.id.slice(-5)}
                  </Text>
                  <Text style={[styles.orderTime, { color: THEME.accent }]}>
                    ACTIVE
                  </Text>
                </View>
                <Text style={[styles.orderItem, { color: THEME.textMain }]}>
                  {order.itemName}
                </Text>
                <View style={styles.orderFooter}>
                  <Text style={[styles.orderPrice, { color: THEME.textMain }]}>
                    {order.price} {userData?.currencyCode || "THB"}
                  </Text>
                  <TouchableOpacity
                    style={[
                      styles.acceptBtn,
                      { backgroundColor: THEME.accent },
                    ]}
                    onPress={() => router.push("/owner/manage-orders")}
                  >
                    <Text style={styles.acceptBtnText}>VIEW DETAILS</Text>
                  </TouchableOpacity>
                </View>
              </Animatable.View>
            ))
          )}

          {!loading && orders.length === 0 && (
            <Text
              style={{
                color: THEME.textSecondary,
                textAlign: "center",
                marginTop: 20,
              }}
            >
              No orders yet today.
            </Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Styles remain exactly as you provided to keep the UI beautiful
const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    padding: 30,
    paddingTop: 50,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  brandTitle: { fontSize: 10, fontWeight: "900", letterSpacing: 2 },
  storeName: { fontSize: 24, fontWeight: "900", marginTop: 5 },
  statusToggle: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  statusDot: { width: 6, height: 6, borderRadius: 3, marginRight: 8 },
  statusText: { fontSize: 8, fontWeight: "900", letterSpacing: 1 },
  revenueCard: {
    marginHorizontal: 25,
    padding: 30,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  cardLabel: {
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 2,
    marginBottom: 10,
  },
  revenueAmount: { fontSize: 36, fontWeight: "900" },
  currency: { fontSize: 14, fontWeight: "400" },
  aiBriefing: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
    borderTopWidth: 1,
    paddingTop: 15,
  },
  aiBriefText: { fontSize: 10, marginLeft: 10, fontWeight: "600" },
  actionGrid: {
    flexDirection: "row",
    paddingHorizontal: 25,
    marginTop: 20,
    justifyContent: "space-between",
  },
  actionBox: {
    width: "48%",
    padding: 25,
    borderRadius: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  actionLabel: {
    fontSize: 8,
    fontWeight: "900",
    marginTop: 12,
    letterSpacing: 1,
  },
  orderSection: { marginTop: 40, paddingHorizontal: 25, paddingBottom: 100 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  sectionTitle: { fontSize: 10, fontWeight: "900", letterSpacing: 2 },
  orderCount: { fontSize: 10, fontWeight: "bold" },
  orderCard: {
    padding: 20,
    borderRadius: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  orderMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  orderId: { fontSize: 10, fontWeight: "900" },
  orderTime: { fontSize: 10, fontWeight: "bold" },
  orderItem: { fontSize: 16, fontWeight: "bold", marginBottom: 15 },
  orderFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  orderPrice: { fontSize: 14, fontWeight: "bold" },
  acceptBtn: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10 },
  acceptBtnText: { color: "#000", fontSize: 10, fontWeight: "900" },
});
