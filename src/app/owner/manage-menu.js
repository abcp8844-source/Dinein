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
import { useTheme } from "../../theme/ThemeContext"; // FIXED: Corrected path
import { dbService } from "../../services/dbService";
import { Ionicons } from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";

/**
 * PREMIUM INVENTORY CONTROL NODE
 * Purpose: Manage stock availability for the specific market node.
 */
export default function ManageMenu() {
  const { userData, marketISO } = useAuth();
  const { colors } = useTheme();
  const router = useRouter();

  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);

  // Theme Constants (Dark Navy Blue)
  const THEME = {
    bg: "#001529",
    card: "#002140",
    accent: "#D4AF37", // Gold
    textMain: "#FFFFFF",
    textSecondary: "#A6B1BB",
  };

  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = async () => {
    try {
      setLoading(true);
      // Logic: Fetching items based on current market ISO (International Standard)
      const items = await dbService.getMenuItems(marketISO || "TH");
      setInventory(items || []);
    } catch (error) {
      console.error("Inventory Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleAvailability = async (id, currentStatus) => {
    // Logic: Updates availability in DB and reflects on customer app instantly
    try {
      await dbService.updateItemStatus(id, !currentStatus);
      setInventory((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, available: !currentStatus } : item,
        ),
      );
    } catch (error) {
      console.log("Status Update Failed");
    }
  };

  const renderItem = ({ item }) => (
    <Animatable.View
      animation="fadeInUp"
      style={[styles.itemCard, { backgroundColor: THEME.card }]}
    >
      <View style={styles.itemInfo}>
        <Text style={[styles.itemName, { color: THEME.textMain }]}>
          {item.name}
        </Text>
        <Text style={[styles.itemPrice, { color: THEME.accent }]}>
          {item.price} {userData?.currencyCode || "THB"}
        </Text>
      </View>
      <View style={styles.actionArea}>
        <Text
          style={[
            styles.statusLabel,
            { color: item.available ? "#00FF00" : "#FF3B30" },
          ]}
        >
          {item.available ? "ACTIVE" : "HIDDEN"}
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
        <TouchableOpacity onPress={loadInventory}>
          <Ionicons name="refresh-outline" size={24} color={THEME.accent} />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loaderArea}>
          <ActivityIndicator size="large" color={THEME.accent} />
          <Text style={{ color: THEME.textSecondary, marginTop: 10 }}>
            Syncing Global Node...
          </Text>
        </View>
      ) : (
        <FlatList
          data={inventory}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              No items found in your regional node.
            </Text>
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
    color: "#444",
    textAlign: "center",
    marginTop: 50,
    fontSize: 12,
  },
});
