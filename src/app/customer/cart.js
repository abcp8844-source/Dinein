import React, { useState } from "react";
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
import { useRouter } from "expo-router";
import { useTheme } from "../../theme/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";

/**
 * RESTORED: Future-Tech Logistics Queue
 * Logic: Order Valuation & Regional Node Validation (20-Country Sync)
 * Feature: Secured Asset Scanning for Global Settlement
 */
export default function Cart() {
  const router = useRouter();
  const { colors } = useTheme();
  const { userData } = useAuth();
  const [cartItems, setCartItems] = useState([]);

  // RESTORED: Global Currency & Node Synchronization Logic
  const currency = userData?.currencyCode || "USD";
  const country = userData?.countryName || "GLOBAL";

  const calculateTotal = () => {
    return cartItems
      .reduce((sum, item) => sum + parseFloat(item.price), 0)
      .toFixed(2);
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      Alert.alert(
        "QUEUE EMPTY",
        "NO ASSETS SELECTED FOR LOGISTICS PROCESSING.",
      );
      return;
    }
    // Logic: Transition to Order Tracking & History Registry
    router.replace("/(customer)/orders");
  };

  const renderItem = ({ item, index }) => (
    <Animatable.View
      animation="fadeInLeft"
      delay={index * 100}
      style={[styles.cartItem, { borderBottomColor: "#0A1A2F" }]}
    >
      <View>
        <Text style={styles.itemName}>{item.itemName?.toUpperCase()}</Text>
        <Text style={styles.itemSub}>
          SECURED ASSET • {country.toUpperCase()} NODE
        </Text>
      </View>
      <Text style={[styles.itemPrice, { color: colors.primary || "#D4AF37" }]}>
        {item.price} {currency}
      </Text>
    </Animatable.View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: "#020B18" }]}>
      <StatusBar barStyle="light-content" />

      <Animatable.View animation="fadeInDown" style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={20} color={colors.primary || "#D4AF37"} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>LOGISTICS QUEUE</Text>
        <MaterialCommunityIcons
          name="shield-lock-outline"
          size={20}
          color="#FF3B30"
        />
      </Animatable.View>

      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Animatable.View animation="pulse" iterationCount="infinite">
              <MaterialCommunityIcons
                name="package-variant-closed"
                size={60}
                color="#0A1A2F"
              />
            </Animatable.View>
            <Text style={styles.emptyText}>NO ACTIVE ASSETS IN QUEUE</Text>
          </View>
        }
      />

      <Animatable.View
        animation="fadeInUp"
        style={[
          styles.footer,
          { backgroundColor: "#051121", borderColor: "#0A1A2F" },
        ]}
      >
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>TOTAL VALUATION</Text>
          <View style={styles.priceContainer}>
            <Text style={styles.totalValue}>{calculateTotal()}</Text>
            <Text style={[styles.currencyLabel, { color: colors.primary || "#D4AF37" }]}>
              {currency}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.checkoutBtn, { backgroundColor: colors.primary || "#D4AF37" }]}
          onPress={handleCheckout}
        >
          <Text style={styles.btnText}>CONFIRM SETTLEMENT</Text>
        </TouchableOpacity>
      </Animatable.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 25,
    paddingTop: 20,
    paddingBottom: 15,
  },
  backBtn: {
    padding: 10,
    backgroundColor: "#0A1A2F",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#1B2631",
  },
  headerTitle: {
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 3,
    color: "#FFF",
  },
  listContent: { padding: 25 },
  cartItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 25,
    borderBottomWidth: 1,
  },
  itemName: {
    fontSize: 14,
    fontWeight: "800",
    color: "#FFF",
    letterSpacing: 1,
  },
  itemSub: {
    fontSize: 8,
    marginTop: 6,
    letterSpacing: 1,
    color: "#5D6D7E",
    fontWeight: "900",
  },
  itemPrice: { fontSize: 14, fontWeight: "900" },
  emptyContainer: { alignItems: "center", marginTop: 150 },
  emptyText: {
    marginTop: 25,
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 3,
    color: "#1B2631",
  },
  footer: {
    padding: 35,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    borderWidth: 1,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
    alignItems: "center",
  },
  totalLabel: {
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 2,
    color: "#5D6D7E",
  },
  priceContainer: { flexDirection: "row", alignItems: "baseline" },
  totalValue: { fontSize: 32, fontWeight: "300", color: "#FFF" },
  currencyLabel: { fontSize: 12, fontWeight: "900", marginLeft: 8 },
  checkoutBtn: {
    height: 65,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    shadowColor: "#D4AF37",
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 5,
  },
  btnText: { color: "#000", fontWeight: "900", letterSpacing: 2, fontSize: 12 },
});
