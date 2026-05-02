import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { useTheme } from "../../theme/ThemeContext";
import { db } from "../../services/firebaseConfig";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";

export default function MenuView() {
  const { colors } = useTheme();
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const menuRef = collection(db, "menus");
    const q = query(menuRef, where("active", "==", true));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMenuItems(items);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const renderItem = ({ item, index }) => (
    <Animatable.View
      animation="fadeInUp"
      duration={600}
      delay={index * 50}
      style={[
        styles.menuCard,
        { backgroundColor: "#0A1A2F", borderColor: "#1B2631" },
      ]}
    >
      <View style={styles.cardInfo}>
        <Text style={styles.itemName}>{item.itemName?.toUpperCase()}</Text>
        <Text style={styles.itemDesc}>{item.description}</Text>
      </View>
      <View style={styles.priceContainer}>
        <Text style={[styles.priceText, { color: colors.primary }]}>
          {item.currency || "$"} {item.price}
        </Text>
      </View>
    </Animatable.View>
  );

  return (
    <View style={[styles.container, { backgroundColor: "#020B18" }]}>
      <StatusBar barStyle="light-content" />

      <Animatable.View animation="fadeInDown" style={styles.header}>
        <MaterialCommunityIcons
          name="silverware-clean"
          size={24}
          color={colors.primary}
        />
        <Text style={[styles.headerTitle, { color: colors.primary }]}>
          CUISINE SELECTION
        </Text>
        <View style={[styles.goldLine, { backgroundColor: colors.primary }]} />
      </Animatable.View>

      <FlatList
        data={menuItems}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {loading ? "SYNCHRONIZING CORE..." : "NO DATA IN SECTOR"}
            </Text>
          </View>
        }
      />

      <TouchableOpacity
        activeOpacity={0.8}
        style={[styles.orderBtn, { backgroundColor: colors.primary }]}
      >
        <Text style={styles.btnText}>PROCEED TO RESERVATION</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 25 },
  header: { marginTop: 60, marginBottom: 30, alignItems: "center" },
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
    borderRadius: 20,
    marginBottom: 15,
    borderWidth: 1,
    alignItems: "center",
  },
  cardInfo: { flex: 0.7 },
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
  priceContainer: { flex: 0.3, alignItems: "flex-end" },
  priceText: { fontSize: 18, fontWeight: "900", letterSpacing: 0.5 },
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
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  btnText: { color: "#000", fontWeight: "900", letterSpacing: 2, fontSize: 12 },
});
