import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  SafeAreaView,
  RefreshControl,
  StatusBar,
} from "react-native";
import { dbService } from "../../services/dbService";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../theme/ThemeContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";

/**
 * RESTORED: Logistics Archive (Orders)
 * Logic: Real-time Registry Sync & Status Node Tracking
 * Feature: Progress-Based Visual Mapping for 20-Country Framework
 * Integrity: Global Node logic with localized currency synchronization.
 */
export default function Orders() {
  const { userData } = useAuth();
  const { colors } = useTheme();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // GLOBAL SYNC: Pulling currency from the user's localized node
  const currency = userData?.currencyCode || "USD";

  useEffect(() => {
    loadOrders();
  }, [userData?.uid]);

  const loadOrders = async () => {
    try {
      if (userData?.uid) {
        // Logic: Cross-border database retrieval for global transaction history
        const data = await dbService.getCustomerOrders(userData.uid);
        setOrders(data);
      }
    } catch (error) {
      console.error("DATA_FETCH_FAILURE");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "#D4AF37";
      case "preparing":
        return "#3498db";
      case "delivered":
        return "#2ecc71";
      case "cancelled":
        return "#FF3B30";
      default:
        return "#5D6D7E";
    }
  };

  const renderOrder = ({ item, index }) => (
    <Animatable.View
      animation="fadeInRight"
      duration={600}
      delay={index * 100}
      style={[
        styles.orderCard,
        { backgroundColor: "#0A1A2F", borderColor: "#1B2631" },
      ]}
    >
      <View style={styles.cardHeader}>
        <View style={{ flex: 1 }}>
          <Text style={styles.itemName}>
            {item.itemName?.toUpperCase() || "GLOBAL ASSET"}
          </Text>
          <Text style={styles.orderId}>
            NODE ID: #{item.id?.slice(-8).toUpperCase()}
          </Text>
        </View>
        <View
          style={[
            styles.statusBadge,
            { borderColor: getStatusColor(item.status) },
          ]}
        >
          <Text
            style={[styles.statusText, { color: getStatusColor(item.status) }]}
          >
            {item.status?.toUpperCase() || "UNKNOWN"}
          </Text>
        </View>
      </View>

      <View style={styles.detailsRow}>
        <Text style={[styles.price, { color: colors.primary || "#D4AF37" }]}>
          {item.itemPrice} {currency}
        </Text>
        <Text style={styles.dateText}>
          {item.timestamp
            ? new Date(item.timestamp).toLocaleDateString()
            : "SYNC_PENDING"}
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
                    ? "65%"
                    : "100%",
            },
          ]}
        />
      </View>
    </Animatable.View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: "#020B18" }]}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>LOGISTICS ARCHIVE</Text>
        <View
          style={[
            styles.goldLine,
            { backgroundColor: colors.primary || "#D4AF37" },
          ]}
        />
      </View>

      {loading ? (
        <ActivityIndicator
          size="small"
          color={colors.primary || "#D4AF37"}
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
              tintColor={colors.primary || "#D4AF37"}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <MaterialCommunityIcons
                name="folder-open-outline"
                size={40}
                color="#1B2631"
              />
              <Text style={styles.emptyText}>
                NO ACTIVE TRANSACTIONS IN ARCHIVE
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 30, paddingTop: 50 },
  headerTitle: {
    color: "#FFF",
    fontSize: 22,
    fontWeight: "900",
    letterSpacing: 2,
  },
  goldLine: { width: 40, height: 2, marginTop: 12 },
  orderCard: {
    padding: 25,
    borderRadius: 25,
    borderWidth: 1,
    marginBottom: 20,
    marginHorizontal: 25,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 25,
  },
  itemName: {
    fontSize: 15,
    fontWeight: "800",
    color: "#FFF",
    letterSpacing: 1,
  },
  orderId: { color: "#5D6D7E", fontSize: 8, fontWeight: "900", marginTop: 5 },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
  },
  statusText: { fontSize: 8, fontWeight: "900", letterSpacing: 1 },
  detailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  price: { fontSize: 18, fontWeight: "900" },
  dateText: { color: "#2C3E50", fontSize: 9, fontWeight: "900" },
  progressContainer: {
    height: 2,
    width: "100%",
    backgroundColor: "#051121",
    borderRadius: 2,
    marginTop: 25,
  },
  progressBar: { height: "100%", borderRadius: 2 },
  loader: { flex: 1, justifyContent: "center" },
  listContainer: { paddingBottom: 100 },
  emptyContainer: { alignItems: "center", marginTop: 150 },
  emptyText: {
    color: "#1B2631",
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 2,
    marginTop: 20,
  },
});
