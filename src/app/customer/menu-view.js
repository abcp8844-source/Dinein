import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useTheme } from "../context/ThemeContext";
import { db } from "../services/firebaseConfig";
import { collection, onSnapshot } from "firebase/firestore";

export default function MenuView() {
  const { colors } = useTheme();
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    const menuRef = collection(db, "menus");
    const unsubscribe = onSnapshot(menuRef, (snapshot) => {
      const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setMenuItems(items);
    });
    return () => unsubscribe();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>DIGITAL MENU</Text>
        <View style={styles.goldLine} />
      </View>

      <FlatList
        data={menuItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.menuCard}>
            <View style={styles.cardInfo}>
              <Text style={styles.itemName}>{item.itemName}</Text>
              <Text style={styles.itemDesc}>{item.description}</Text>
            </View>
            <View style={styles.priceTag}>
              <Text style={styles.priceText}>{item.price}</Text>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>SYNCING GLOBAL DATA...</Text>
        }
      />

      <TouchableOpacity style={styles.orderBtn}>
        <Text style={styles.btnText}>PROCEED TO ORDER</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 25, backgroundColor: "#8B0000" },
  header: { marginTop: 50, marginBottom: 30, alignItems: "center" },
  headerTitle: {
    color: "#D4AF37",
    fontSize: 22,
    fontWeight: "bold",
    letterSpacing: 5,
  },
  goldLine: { width: 40, height: 2, backgroundColor: "#D4AF37", marginTop: 8 },
  menuCard: {
    flexDirection: "row",
    paddingVertical: 20,
    borderBottomWidth: 0.5,
    borderBottomColor: "rgba(212, 175, 55, 0.3)",
  },
  cardInfo: { flex: 0.7 },
  itemName: { color: "#D4AF37", fontSize: 18, fontWeight: "600" },
  itemDesc: { color: "#FDF5E6", fontSize: 12, opacity: 0.8 },
  priceTag: { flex: 0.3, alignItems: "flex-end" },
  priceText: { color: "#D4AF37", fontWeight: "bold" },
  emptyText: {
    color: "#A68D5F",
    textAlign: "center",
    marginTop: 50,
    fontSize: 10,
    letterSpacing: 2,
  },
  orderBtn: {
    backgroundColor: "#D4AF37",
    height: 55,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 2,
    marginBottom: 20,
  },
  btnText: { color: "#660000", fontWeight: "bold", letterSpacing: 2 },
});
