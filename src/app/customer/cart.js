import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";

export default function Cart() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState([]); // This will be populated from state/context

  const calculateTotal = () => {
    return cartItems
      .reduce((sum, item) => sum + parseFloat(item.price), 0)
      .toFixed(2);
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      Alert.alert("Cart", "Your selection is empty.");
      return;
    }
    Alert.alert("Dining Table", "Order submitted for verification.");
    router.replace("/order-management");
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>YOUR SELECTION</Text>
        <View style={styles.goldLine} />
      </View>

      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.cartItem}>
            <Text style={styles.itemName}>{item.itemName}</Text>
            <Text style={styles.itemPrice}>{item.price}</Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>NO ITEMS SELECTED</Text>
        }
      />

      <View style={styles.footer}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>TOTAL AMOUNT</Text>
          <Text style={styles.totalValue}>{calculateTotal()} THB</Text>
        </View>

        <TouchableOpacity style={styles.checkoutBtn} onPress={handleCheckout}>
          <Text style={styles.btnText}>CONFIRM ORDER</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 25, backgroundColor: "#8B0000" },
  header: { marginTop: 50, marginBottom: 30, alignItems: "center" },
  headerTitle: {
    color: "#D4AF37",
    fontSize: 20,
    fontWeight: "bold",
    letterSpacing: 3,
  },
  goldLine: { width: 40, height: 2, backgroundColor: "#D4AF37", marginTop: 8 },
  cartItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: "rgba(212, 175, 55, 0.2)",
  },
  itemName: { color: "#FDF5E6", fontSize: 16 },
  itemPrice: { color: "#D4AF37", fontWeight: "bold" },
  emptyText: {
    color: "#A68D5F",
    textAlign: "center",
    marginTop: 50,
    letterSpacing: 1,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: "#D4AF37",
    paddingTop: 20,
    marginBottom: 20,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  totalLabel: { color: "#A68D5F", fontSize: 12, letterSpacing: 1 },
  totalValue: { color: "#D4AF37", fontSize: 18, fontWeight: "bold" },
  checkoutBtn: {
    backgroundColor: "#D4AF37",
    height: 55,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 2,
  },
  btnText: { color: "#660000", fontWeight: "bold", letterSpacing: 2 },
});
