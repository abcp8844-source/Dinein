import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Switch,
  ActivityIndicator,
  StatusBar,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../services/firebaseConfig"; // Direct Firebase
import { collection, query, where, onSnapshot } from "firebase/firestore"; // Real-time sync
import { dbService } from "../../services/dbService";
import { Ionicons } from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";

export default function ManageMenu() {
  const { userData } = useAuth();
  const router = useRouter();

  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);

  const THEME = {
    bg: "#001529",
    card: "#002140",
    accent: "#D4AF37",
    textMain: "#FFFFFF",
    textSecondary: "#A6B1BB",
  };

  // --- REAL-TIME INVENTORY LISTENER ---
  useEffect(() => {
    if (!userData?.uid) return;

    // Fetch products only belonging to THIS owner
    const q = query(
      collection(db, "products"),
      where("ownerId", "==", userData.uid),
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const items = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          // Fallback for safety if 'available' field is missing
          available: doc.data().available ?? true,
        }));
        setInventory(items);
        setLoading(false);
      },
      (error) => {
        console.error("Inventory Sync Error:", error);
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, [userData]);

  const toggleAvailability = async (id, currentStatus) => {
    try {
      // Direct call to update status in Firebase
      await dbService.updateItemStatus(id, !currentStatus);
    } catch (error) {
      console.log("Status Update Failed", error);
    }
  };

  const renderItem = ({ item }) => (
    <Animatable.View
      animation="fadeInUp"
      style={[styles.itemCard, { backgroundColor: THEME.card }]}
    >
      <View style={styles.itemInfo}>
        <Text style={[styles.itemName, { color: THEME.textMain }]}>
          {item.itemName} {/* Updated key name from your UploadMenu code */}
        </Text>
        <Text style={[styles.itemPrice, { color: THEME.accent }]}>
          {item.price} {userData?.currencyCode || "THB"}
        </Text>
        <Text
          style={{ color: THEME.textSecondary, fontSize: 10, marginTop: 4 }}
        >
          {item.category}
        </Text>
      </View>
      <View style={styles.actionArea}>
        <Text
          style={[
            styles.statusLabel,
            { color: item.available ? "#00FF00" : "#FF3B30" },
          ]}
        >
          {item.available ? "AVAILABLE" : "OUT OF STOCK"}
        </Text>
        <Switch
          value={item.available}
          onValueChange={() => toggleAvailability(item.id, item.available)}
          trackColor={{ false: "#333", true: THEME.accent }}
          thumbColor={item.available ? "#FFF" : "#f4f3f4"}
        />
      </View>
    </Animatable.View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: THEME.bg }]}>
      <StatusBar barStyle="light-content" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={26} color="#FFF" />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: THEME.textMain }]}>
          INVENTORY CONTROL
        </Text>
        <View style={{ width: 26 }} /> {/* Balance Spacer */}
      </View>

      {loading ? (
        <View style={styles.loaderArea}>
          <ActivityIndicator size="large" color={THEME.accent} />
          <Text style={{ color: THEME.textSecondary, marginTop: 10 }}>
            Syncing Live Inventory...
          </Text>
        </View>
      ) : (
        <FlatList
          data={inventory}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={{ marginTop: 100, alignItems: "center" }}>
              <Text style={[styles.emptyText, { color: THEME.textSecondary }]}>
                No items found in your store.
              </Text>
              <TouchableOpacity
                style={{
                  marginTop: 20,
                  backgroundColor: THEME.accent,
                  padding: 15,
                  borderRadius: 10,
                }}
                onPress={() => router.push("/owner/upload-menu")}
              >
                <Text style={{ fontWeight: "900", fontSize: 12 }}>
                  ADD FIRST ITEM
                </Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}
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
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.05)",
  },
  headerTitle: { fontSize: 14, fontWeight: "900", letterSpacing: 2 },
  listContent: { padding: 20, paddingBottom: 100 },
  itemCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderRadius: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  itemInfo: { flex: 1 },
  itemName: { fontSize: 16, fontWeight: "bold", marginBottom: 5 },
  itemPrice: { fontSize: 14, fontWeight: "600" },
  actionArea: { alignItems: "flex-end" },
  statusLabel: {
    fontSize: 8,
    fontWeight: "900",
    marginBottom: 8,
    letterSpacing: 1,
  },
  loaderArea: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: {
    textAlign: "center",
    fontSize: 14,
    fontWeight: "600",
  },
});
