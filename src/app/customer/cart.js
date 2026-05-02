import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "../../theme/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";

/**
 * CUSTOMER CART - LOGISTICS QUEUE
 * Logic: Asset management before final transaction verification.
 */
export default function Cart() {
  const router = useRouter();
  const { colors } = useTheme();
  const { userData } = useAuth();
  const [cartItems, setCartItems] = useState([]);

  const currency = userData?.currencyCode || "THB";

  const calculateTotal = () => {
    return cartItems
      .reduce((sum, item) => sum + parseFloat(item.price), 0)
      .toFixed(2);
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      Alert.alert(
        "QUEUE EMPTY",
        "No assets selected for logistics processing.",
      );
      return;
    }
    // Corrected Path for Expo Router (Parentheses structure)
    router.replace("/(customer)/orders");
  };

  const renderItem = ({ item }) => (
    <View style={[styles.cartItem, { borderBottomColor: colors.border }]}>
      <View>
        <Text style={[styles.itemName, { color: colors.textMain }]}>
          {item.itemName}
        </Text>
        <Text style={[styles.itemSub, { color: colors.textDim }]}>
          VERIFIED ASSET
        </Text>
      </View>
      <Text style={[styles.itemPrice, { color: colors.primary }]}>
        {item.price} {currency}
      </Text>
    </View>
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <Animatable.View animation="fadeInDown" style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color={colors.textMain} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textMain }]}>
          LOGISTICS QUEUE
        </Text>
        <View style={{ width: 24 }} />
      </Animatable.View>

      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="cube-outline" size={50} color={colors.border} />
            <Text style={[styles.emptyText, { color: colors.textDim }]}>
              NO ASSETS IN QUEUE
            </Text>
          </View>
        }
      />

      <Animatable.View
        animation="fadeInUp"
        style={[styles.footer, { backgroundColor: colors.cardBg }]}
      >
        <View style={styles.totalRow}>
          <Text style={[styles.totalLabel, { color: colors.textDim }]}>
            TOTAL VALUATION
          </Text>
          <Text style={[styles.totalValue, { color: colors.primary }]}>
            {calculateTotal()} {currency}
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.checkoutBtn, { backgroundColor: colors.primary }]}
          onPress={handleCheckout}
        >
          <Text style={styles.btnText}>CONFIRM LOGISTICS</Text>
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
    padding: 20,
    marginTop: 10,
  },
  headerTitle: { fontSize: 12, fontWeight: "900", letterSpacing: 3 },
  listContent: { padding: 25 },
  cartItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 20,
    borderBottomWidth: 1,
  },
  itemName: { fontSize: 16, fontWeight: "bold" },
  itemSub: { fontSize: 10, marginTop: 4, letterSpacing: 1 },
  itemPrice: { fontSize: 14, fontWeight: "900" },
  emptyContainer: { alignItems: "center", marginTop: 100 },
  emptyText: {
    marginTop: 20,
    fontSize: 10,
    fontWeight: "bold",
    letterSpacing: 2,
  },
  footer: {
    padding: 30,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    elevation: 20,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 25,
    alignItems: "center",
  },
  totalLabel: { fontSize: 10, fontWeight: "900", letterSpacing: 1 },
  totalValue: { fontSize: 22, fontWeight: "900" },
  checkoutBtn: {
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
  },
  btnText: { color: "#000", fontWeight: "900", letterSpacing: 2, fontSize: 12 },
});
