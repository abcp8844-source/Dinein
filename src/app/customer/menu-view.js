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
import * as Animatable from "react-native-animatable";

export default function MenuView() {
  const { colors } = useTheme();
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const menuRef = collection(db, "menus");
    const q = query(menuRef, where("active", "==", true)); // Production Logic
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map((doc) => ({ 
        id: doc.id, 
        ...doc.data() 
      }));
      setMenuItems(items);
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, []);

  const renderItem = ({ item }) => (
    <Animatable.View 
      animation="fadeInUp" 
      duration={800} 
      style={styles.menuCard}
    >
      <View style={styles.cardInfo}>
        <Text style={styles.itemName}>{item.itemName?.toUpperCase()}</Text>
        <Text style={styles.itemDesc}>{item.description}</Text>
      </View>
      <View style={styles.priceContainer}>
        <Text style={styles.priceText}>
          {item.currency || "$"} {item.price}
        </Text>
      </View>
    </Animatable.View>
  );

  return (
    <View style={[styles.container, { backgroundColor: "#000" }]}>
      <StatusBar barStyle="light-content" />
      
      <Animatable.View animation="fadeInDown" style={styles.header}>
        <Text style={styles.headerTitle}>CUISINE SELECTION</Text>
        <View style={styles.goldLine} />
      </Animatable.View>

      <FlatList
        data={menuItems}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {loading ? "SYNCHRONIZING..." : "NO DATA IN NODE"}
            </Text>
          </View>
        }
      />

      <TouchableOpacity activeOpacity={0.8} style={styles.orderBtn}>
        <Text style={styles.btnText}>PROCEED TO RESERVATION</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20 },
  header: { marginTop: 60, marginBottom: 40, alignItems: "center" },
  headerTitle: { 
    color: "#D4AF37", 
    fontSize: 14, 
    fontWeight: "900", 
    letterSpacing: 5 
  },
  goldLine: { 
    width: 25, 
    height: 1.5, 
    backgroundColor: "#D4AF37", 
    marginTop: 12 
  },
  menuCard: {
    flexDirection: "row",
    padding: 20,
    backgroundColor: "#0A0A0A",
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#111",
    alignItems: "center",
  },
  cardInfo: { flex: 0.7 },
  itemName: { 
    color: "#FFF", 
    fontSize: 13, 
    fontWeight: "800", 
    letterSpacing: 1,
    marginBottom: 6 
  },
  itemDesc: { 
    color: "#666", 
    fontSize: 10, 
    lineHeight: 16,
    fontWeight: "400" 
  },
  priceContainer: { flex: 0.3, alignItems: "flex-end" },
  priceText: { 
    color: "#D4AF37", 
    fontSize: 16, 
    fontWeight: "900",
    letterSpacing: 0.5 
  },
  emptyContainer: { marginTop: 100, alignItems: "center" },
  emptyText: { 
    color: "#222", 
    fontSize: 9, 
    letterSpacing: 3, 
    fontWeight: "bold" 
  },
  orderBtn: {
    backgroundColor: "#D4AF37",
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    position: "absolute",
    bottom: 30,
    left: 20,
    right: 20,
    shadowColor: "#D4AF37",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
  },
  btnText: { 
    color: "#000", 
    fontWeight: "900", 
    letterSpacing: 2, 
    fontSize: 11 
  },
});
