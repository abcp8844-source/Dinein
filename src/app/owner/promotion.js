import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Alert,
  StatusBar
} from "react-native";
import { dbService } from "../../services/dbService";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../theme/ThemeContext";
import PremiumButton from "../../components/PremiumButton";
import { Ionicons } from "@expo/vector-icons";

/**
 * OWNER PROMOTION HUB
 * Logic: Owner-led Boost System with Admin Rate Synchronization.
 * Theme: Dark Navy High-Visibility Architecture.
 */
export default function OwnerPromotion() {
  const { userData } = useAuth();
  const [myItems, setMyItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);

  const THEME = {
    bg: "#001529",         
    card: "#002F56",       
    accent: "#D4AF37",     
    textMain: "#FFFFFF",
    textSecondary: "#A6B1BB",
    border: "#004B87"
  };

  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = async () => {
    try {
      const data = await dbService.getMenuItems();
      const filtered = data.filter((item) => item.ownerId === userData.uid);
      setMyItems(filtered);
    } catch (error) {
      console.error("Data Retrieval Error");
    }
  };

  const toggleBoost = async (item) => {
    try {
      const newStatus = !item.isBoosted;
      await dbService.updateItemBoost(item.id, newStatus);
      Alert.alert("System Sync", `${item.name} visibility status updated.`);
      loadInventory();
    } catch (error) {
      Alert.alert("Update Failed", "Requires Admin Authorization.");
    }
  };

  const renderItem = ({ item }) => (
    <View style={[styles.itemCard, { backgroundColor: THEME.card, borderColor: THEME.border }]}>
      <View style={styles.cardInfo}>
        <Text style={[styles.itemName, { color: THEME.textMain }]}>{item.name}</Text>
        <Text style={{ color: THEME.accent, fontSize: 12, fontWeight: "600" }}>
          {item.price} {userData?.currencyCode || "THB"}
        </Text>
      </View>
      
      <TouchableOpacity 
        onPress={() => toggleBoost(item)}
        style={[styles.boostBtn, { backgroundColor: item.isBoosted ? THEME.accent : 'transparent' }]}
      >
        <Ionicons 
          name={item.isBoosted ? "rocket" : "rocket-outline"} 
          size={18} 
          color={item.isBoosted ? "#000" : THEME.accent} 
        />
        <Text style={[styles.boostText, { color: item.isBoosted ? "#000" : THEME.accent }]}>
          {item.isBoosted ? "ACTIVE" : "BOOST"}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: THEME.bg }]}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <Text style={[styles.title, { color: THEME.textMain }]}>Growth Center</Text>
        <TouchableOpacity onPress={() => Alert.alert("Admin Sync", "Fetching latest rates...")}>
          <Ionicons name="cloud-download-outline" size={24} color={THEME.accent} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={myItems}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 20 }}
        ListEmptyComponent={
          <Text style={[styles.emptyText, { color: THEME.textSecondary }]}>No items available for promotion.</Text>
        }
      />

      <View style={[styles.footer, { borderTopColor: THEME.border }]}>
        <Text style={styles.disclaimer}>* Pricing & tiers managed by Admin protocol</Text>
        <PremiumButton 
          title="INITIALIZE NEW CAMPAIGN" 
          onPress={() => Alert.alert("Request Sent", "Admin will review your growth request.")} 
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 25, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 28, fontWeight: "900", letterSpacing: 1 },
  itemCard: {
    padding: 20,
    borderRadius: 18,
    marginBottom: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1.5,
  },
  cardInfo: { flex: 1 },
  itemName: { fontSize: 17, fontWeight: "bold" },
  boostBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: "#D4AF37"
  },
  boostText: { fontSize: 9, fontWeight: '900', marginLeft: 6, letterSpacing: 1 },
  footer: { padding: 25, borderTopWidth: 1 },
  disclaimer: { color: "#444", fontSize: 9, textAlign: 'center', marginBottom: 15, letterSpacing: 0.5 },
  emptyText: { textAlign: 'center', marginTop: 50, fontSize: 12 }
});
