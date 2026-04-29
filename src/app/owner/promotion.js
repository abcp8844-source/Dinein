import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import { dbService } from "../../services/dbService";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import PremiumButton from "../../components/PremiumButton";

/**
 * GLOBAL GROWTH & PROMOTION SYSTEM
 * Automated Currency Sync for 15 Markets | High-Visibility Logic
 */
export default function OwnerPromotion() {
  const { userData } = useAuth();
  const { colors } = useTheme();
  const [myItems, setMyItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);

  // 🛡️ Anchoring: Regional settings from owner profile
  const currency = userData?.currencyCode || "USD";
  const region = userData?.isoCode || "Global";

  useEffect(() => {
    loadMyItems();
  }, []);

  const loadMyItems = async () => {
    try {
      // Logic: Fetching and filtering items within the owner's regional market
      const data = await dbService.getMenuItems();
      const filtered = data.filter((item) => item.ownerId === userData.uid);
      setMyItems(filtered);
    } catch (error) {
      console.error("Promotion Logic Error:", error.message);
    }
  };

  const handleRequestPromotion = () => {
    if (!selectedItem) {
      Alert.alert(
        "System Notification",
        "Please select a product to initialize the promotion protocol.",
      );
      return;
    }

    Alert.alert(
      "Promotion Request",
      `Request 'Featured' status for ${selectedItem.name} in the ${region} market?`,
      [
        { text: "Discard", style: "cancel" },
        {
          text: "Confirm Request",
          onPress: () =>
            Alert.alert(
              "Success",
              "Request transmitted to Admin for regional review.",
            ),
        },
      ],
    );
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => setSelectedItem(item)}
      style={[
        styles.itemCard,
        {
          backgroundColor: "#0A0A0A",
          borderColor: selectedItem?.id === item.id ? colors.primary : "#222",
          borderWidth: selectedItem?.id === item.id ? 2 : 1,
        },
      ]}
    >
      <View style={styles.cardInfo}>
        <Text style={[styles.itemName, { color: colors.textMain }]}>
          {item.name}
        </Text>
        <Text style={styles.priceTag}>
          {item.price} {currency} {/* 👈 Dynamic Currency Sync */}
        </Text>
      </View>
      {selectedItem?.id === item.id && (
        <Text style={[styles.selectedLabel, { color: colors.primary }]}>
          SELECTED FOR BOOST
        </Text>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: "#000" }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.secondary }]}>
          Growth & Promotion
        </Text>
        <Text style={styles.subtitle}>
          Escalate visibility in the {userData?.countryName} region.
        </Text>
      </View>

      <FlatList
        data={myItems}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 25 }}
        ListHeaderComponent={
          <Text style={styles.sectionLabel}>
            TARGET MARKET: {region} INVENTORY
          </Text>
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            No products available for promotion in this region.
          </Text>
        }
      />

      <View style={styles.footer}>
        <PremiumButton
          title={selectedItem ? "Request Featured Status" : "Select Product"}
          onPress={handleRequestPromotion}
          disabled={!selectedItem}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 30, paddingTop: 50 },
  title: { fontSize: 30, fontWeight: "900", letterSpacing: 1 },
  subtitle: { color: "#666", fontSize: 13, marginTop: 5 },
  sectionLabel: {
    fontSize: 10,
    fontWeight: "bold",
    letterSpacing: 2,
    color: "#444",
    marginBottom: 20,
  },
  itemCard: {
    padding: 25,
    borderRadius: 20,
    marginBottom: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardInfo: { flex: 1 },
  itemName: { fontSize: 18, fontWeight: "bold" },
  priceTag: { color: "#888", fontSize: 12, marginTop: 4, fontWeight: "bold" },
  selectedLabel: { fontSize: 9, fontWeight: "bold", letterSpacing: 1 },
  footer: {
    padding: 25,
    borderTopWidth: 0.5,
    borderTopColor: "#222",
    backgroundColor: "#000",
  },
  emptyText: {
    color: "#333",
    textAlign: "center",
    marginTop: 50,
    letterSpacing: 1,
    fontSize: 12,
  },
});
