import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { useTheme } from "../../theme/ThemeContext";
import { useAuth } from "../../context/AuthContext"; // Profile sync کے لیے
import { db } from "../../services/firebaseConfig";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";
import { useRouter } from "expo-router";

/**
 * RESTORED: Logic-Based Menu View
 * Feature: Real-time Firebase Sync with Active Status Filtering
 * Design: High-Performance UI with Premium Asset Indexing
 * Integrity: Deep-Navy #020B18 | 100% Logic Restoration
 */
export default function MenuView() {
  const { colors } = useTheme();
  const { userData } = useAuth();
  const router = useRouter();
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Profile-based location and currency sync
  const currency = userData?.currencyCode || "THB";

  useEffect(() => {
    // LOGIC: Secure retrieval of active culinary assets from "menus" collection
    const menuRef = collection(db, "menus");
    const q = query(menuRef, where("active", "==", true));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMenuItems(items);
      setLoading(false);
    }, (error) => {
      console.error("SYNC_ERROR:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const renderItem = ({ item, index }) => (
    <Animatable.View
      animation="fadeInUp"
      duration={600}
      delay={index * 50}
    >
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() =>
          router.push({
            pathname: "/(customer)/item-details",
            params: { ...item },
          })
        }
        style={[
          styles.menuCard,
          { backgroundColor: "#0A1A2F", borderColor: "#1B2631" },
        ]}
      >
        <View style={styles.cardInfo}>
          <Text style={styles.itemName}>
            {item.name?.toUpperCase() || item.itemName?.toUpperCase() || "UNKNOWN ASSET"}
          </Text>
          <Text numberOfLines={2} style={styles.itemDesc}>
            {item.description || "NO ARCHIVE DATA AVAILABLE."}
          </Text>
        </View>
        <View style={styles.priceContainer}>
          <Text
            style={[styles.priceText, { color: colors.primary || "#D4AF37" }]}
          >
            {item.price}
          </Text>
          <Text style={styles.currencyLabel}>{currency}</Text>
        </View>
      </TouchableOpacity>
    </Animatable.View>
  );

  return (
    <View style={[styles.container, { backgroundColor: "#020B18" }]}>
      <StatusBar barStyle="light-content" />

      <Animatable.View animation="fadeInDown" style={styles.header}>
        <MaterialCommunityIcons
          name="silverware-clean"
          size={24}
          color={colors.primary || "#D4AF37"}
        />
        <Text
          style={[styles.headerTitle, { color: colors.primary || "#D4AF37" }]}
        >
          CUISINE SELECTION
        </Text>
        <View
          style={[
            styles.goldLine,
            { backgroundColor: colors.primary || "#D4AF37" },
          ]}
        />
      </Animatable.View>

      {loading ? (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="small" color={colors.primary || "#D4AF37"} />
          <Text style={[styles.emptyText, { marginTop: 15 }]}>SYNCHRONIZING CORE...</Text>
        </View>
      ) : (
        <FlatList
          data={menuItems}
          keyExtractor={(item, index) => item.id || index.toString()}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 120, paddingTop: 10 }}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>NO DATA IN SECTOR</Text>
            </View>
          }
        />
      )}

      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => router.push("/(customer)/cart")}
        style={[
          styles.orderBtn,
          { backgroundColor: colors.primary || "#D4AF37" },
        ]}
      >
        <Text style={styles.btnText}>VIEW ACTIVE QUEUE</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 25 },
  header: { marginTop: 60, marginBottom: 20, alignItems: "center" },
  headerTitle: {
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 4,
    marginTop: 10,
  },
  goldLine: { width: 30, height: 2, marginTop: 10, borderRadius: 1 },
  menuCard: {
    flexDirection: "row",
    padding: 22,
    borderRadius: 25,
    marginBottom: 15,
    borderWidth: 1,
    alignItems: "center",
  },
  cardInfo: { flex: 0.75 },
  itemName: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 1,
    marginBottom: 8,
  },
  itemDesc: {
    color: "#5D6D7E",
    fontSize: 10,
    lineHeight: 16,
    fontWeight: "500",
  },
  priceContainer: { flex: 0.25, alignItems: "flex-end" },
  priceText: { fontSize: 18, fontWeight: "900", letterSpacing: 0.5 },
  currencyLabel: { fontSize: 8, fontWeight: "900", color: "#5D6D7E", marginTop: 2 },
  emptyContainer: { marginTop: 150, alignItems: "center" },
  emptyText: {
    color: "#1B2631",
    fontSize: 9,
    letterSpacing: 3,
    fontWeight: "900",
  },
  orderBtn: {
    height: 65,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    position: "absolute",
    bottom: 30,
    left: 25,
    right: 25,
    shadowColor: "#D4AF37",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
  },
  btnText: { color: "#000", fontWeight: "900", letterSpacing: 2, fontSize: 12 },
});
