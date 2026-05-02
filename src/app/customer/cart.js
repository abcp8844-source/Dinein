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
import { Ionicons } from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";

export default function Cart() {
  const router = useRouter();
  const { colors } = useTheme();
  const { userData } = useAuth();
  const [cartItems, setCartItems] = useState([]);

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
    router.replace("/(customer)/orders");
  };

  const renderItem = ({ item, index }) => (
    <Animatable.View
      animation="fadeInLeft"
      delay={index * 100}
      style={styles.cartItem}
    >
      <View>
        <Text style={styles.itemName}>{item.itemName?.toUpperCase()}</Text>
        <Text style={styles.itemSub}>
          VERIFIED ASSET • {country.toUpperCase()}
        </Text>
      </View>
      <Text style={styles.itemPrice}>
        {item.price} {currency}
      </Text>
    </Animatable.View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <Animatable.View animation="fadeInDown" style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={20} color="#D4AF37" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>LOGISTICS QUEUE</Text>
        <View style={{ width: 40 }} />
      </Animatable.View>

      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Animatable.View animation="pulse" iterationCount="infinite">
              <Ionicons name="cube-outline" size={60} color="#111" />
            </Animatable.View>
            <Text style={styles.emptyText}>NO ASSETS IN QUEUE</Text>
          </View>
        }
      />

      <Animatable.View animation="fadeInUp" style={styles.footer}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>TOTAL VALUATION</Text>
          <View style={styles.priceContainer}>
            <Text style={styles.totalValue}>{calculateTotal()}</Text>
            <Text style={styles.currencyLabel}>{currency}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.checkoutBtn} onPress={handleCheckout}>
          <Text style={styles.btnText}>CONFIRM LOGISTICS</Text>
        </TouchableOpacity>
      </Animatable.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  backBtn: {
    padding: 10,
    backgroundColor: "#0A0A0A",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#111",
  },
  headerTitle: {
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 4,
    color: "#FFF",
  },
  listContent: { padding: 25 },
  cartItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 22,
    borderBottomWidth: 1,
    borderBottomColor: "#0A0A0A",
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
    color: "#444",
    fontWeight: "bold",
  },
  itemPrice: { fontSize: 13, fontWeight: "900", color: "#D4AF37" },
  emptyContainer: { alignItems: "center", marginTop: 150 },
  emptyText: {
    marginTop: 25,
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 3,
    color: "#222",
  },
  footer: {
    padding: 35,
    backgroundColor: "#0A0A0A",
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    borderWidth: 1,
    borderColor: "#111",
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
    color: "#444",
  },
  priceContainer: { flexDirection: "row", alignItems: "baseline" },
  totalValue: { fontSize: 28, fontWeight: "300", color: "#FFF" },
  currencyLabel: {
    fontSize: 12,
    fontWeight: "900",
    color: "#D4AF37",
    marginLeft: 8,
  },
  checkoutBtn: {
    height: 65,
    backgroundColor: "#D4AF37",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    shadowColor: "#D4AF37",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  btnText: { color: "#000", fontWeight: "900", letterSpacing: 2, fontSize: 12 },
});
