import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  SafeAreaView,
  RefreshControl,
} from "react-native";
import { dbService } from "../../services/dbService";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import * as Animatable from "react-native-animatable";

export default function Orders() {
  const { userData } = useAuth();
  const { colors } = useTheme();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const currency = userData?.currencyCode || "USD";

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      // 🛡️ Safe Access: Added '?' to prevent crashes if userData is null
      if (userData?.uid) {
        const data = await dbService.getCustomerOrders(userData.uid);
        setOrders(data);
      }
    } catch (error) {
      console.error("Order Load Error:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "#D4AF37";
      case "preparing":
        return "#3498db";
      case "delivered":
        return "#2ecc71";
      case "cancelled":
        return "#e74c3c";
      default:
        return "#555";
    }
  };

  const renderOrder = ({ item, index }) => (
    <Animatable.View
      animation="fadeInRight"
      duration={600}
      delay={index * 100}
      style={[
        styles.orderCard,
        { backgroundColor: "#0A0A0A", borderColor: "#1A1A1A" },
      ]}
    >
      <View style={styles.cardHeader}>
        <Text style={[styles.itemName, { color: "#FFF" }]}>
          {item.itemName}
        </Text>
        <View
          style={[
            styles.statusBadge,
            { borderColor: getStatusColor(item.status) },
          ]}
        >
          <Text
            style={[styles.statusText, { color: getStatusColor(item.status) }]}
          >
            {item.status.toUpperCase()}
          </Text>
        </View>
      </View>

      <View style={styles.detailsRow}>
        <Text style={styles.orderId}>
          ID: #{item.id?.slice(-6).toUpperCase()}
        </Text>
        <Text style={[styles.price, { color: colors.primary }]}>
          {item.itemPrice} {currency}
        </Text>
      </View>

      <View style={styles.progressContainer}>
        <View
          style={[
            styles.progressBar,
            {
              backgroundColor: getStatusColor(item.status),
              width:
                item.status === "pending"
                  ? "25%"
                  : item.status === "preparing"
                    ? "60%"
                    : "100%",
            },
          ]}
        />
      </View>

      <View style={styles.cardFooter}>
        <Text style={styles.dateText}>
          {item.timestamp ? new Date(item.timestamp).toLocaleDateString() : ""}
        </Text>
      </View>
    </Animatable.View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>MY ORDERS</Text>
        <View style={styles.goldLine} />
      </View>

      {loading ? (
        <ActivityIndicator
          size="large"
          color={colors.primary}
          style={styles.loader}
        />
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id}
          renderItem={renderOrder}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                loadOrders();
              }}
              tintColor={colors.primary}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No orders found.</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  header: { padding: 30, paddingTop: 50 },
  headerTitle: {
    color: "#FFF",
    fontSize: 24,
    fontWeight: "900",
    letterSpacing: 2,
  },
  goldLine: { width: 40, height: 2, backgroundColor: "#D4AF37", marginTop: 10 },
  orderCard: {
    padding: 25,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 20,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  itemName: { fontSize: 18, fontWeight: "bold" },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
  },
  statusText: { fontSize: 9, fontWeight: "900" },
  detailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  orderId: { color: "#444", fontSize: 10, fontWeight: "bold" },
  price: { fontSize: 18, fontWeight: "900" },
  progressContainer: {
    height: 3,
    width: "100%",
    backgroundColor: "#1A1A1A",
    borderRadius: 2,
    marginTop: 20,
  },
  progressBar: { height: "100%", borderRadius: 2 },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginTop: 15,
  },
  dateText: { color: "#333", fontSize: 9, fontWeight: "bold" },
  loader: { flex: 1, justifyContent: "center" },
  listContainer: { padding: 25, paddingBottom: 100 },
  emptyContainer: { alignItems: "center", marginTop: 150 },
  emptyText: { color: "#444", fontSize: 12 },
});
