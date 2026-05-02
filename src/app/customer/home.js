import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  TextInput,
  StatusBar,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../theme/ThemeContext";
import { dbService } from "../../services/dbService";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";

/**
 * RESTORED: Future-Tech Market Engine
 * Logic: Global Logistics Node Sync with Real-time Firebase DB
 * Feature: Profile-Aware Location & Currency Mapping
 * Integrity: Standard Deep-Navy #020B18 | No Design Alterations
 */
export default function Home() {
  const { userData } = useAuth();
  const { colors } = useTheme();
  const router = useRouter();

  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [aiMessage, setAiMessage] = useState("CORE_SYNC_ACTIVE");

  // REAL DATA MAPPING: Pulling directly from User Context
  const currency = userData?.currencyCode || "THB";
  const location =
    userData?.locationData?.city || userData?.location?.city || "GLOBAL NODE";

  useEffect(() => {
    fetchMenu();
    updateAiProtocol();
  }, []);

  const updateAiProtocol = () => {
    const hours = new Date().getHours();
    // Logic: Time-based AI protocol matching
    if (hours < 12)
      setAiMessage(
        `AM_PROTOCOL: OPTIMIZING ENERGY IN ${location.toUpperCase()}.`,
      );
    else if (hours < 18)
      setAiMessage(`SYSTEM_SYNC: HIGH-PERFORMANCE DETECTED.`);
    else setAiMessage(`PM_PROTOCOL: ANALYZING COMFORT-TIER OPTIONS.`);
  };

  const fetchMenu = async () => {
    try {
      setLoading(true);
      // REAL DATA RETRIEVAL: Fetching items from Firebase
      const data = await dbService.getMenuItems();

      // OPTIONAL: Filter items based on availability or user's region if needed
      setItems(data);
      setFilteredItems(data);
    } catch (error) {
      console.error("DATA_FETCH_FAILURE:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (text) => {
    setSearchQuery(text);
    if (!text.trim()) {
      setFilteredItems(items);
      return;
    }
    const filtered = items.filter(
      (item) =>
        item.name?.toLowerCase().includes(text.toLowerCase()) ||
        item.description?.toLowerCase().includes(text.toLowerCase()) ||
        item.restaurantName?.toLowerCase().includes(text.toLowerCase()),
    );
    setFilteredItems(filtered);
  };

  const renderMenuItem = ({ item, index }) => (
    <Animatable.View animation="fadeInUp" duration={600} delay={index * 50}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() =>
          router.push({
            pathname: "/(customer)/item-details",
            params: { ...item },
          })
        }
        style={[
          styles.card,
          { backgroundColor: "#0A1A2F", borderColor: "#1B2631" },
        ]}
      >
        <View style={styles.itemMeta}>
          <Text style={styles.itemName}>
            {item.name?.toUpperCase() || "ITEM"}
          </Text>
          <View style={styles.distanceRow}>
            <Ionicons
              name="location-sharp"
              size={10}
              color={colors.primary || "#D4AF37"}
            />
            <Text style={styles.distanceText}>
              {item.restaurantName?.toUpperCase() || "VERIFIED SOURCE"}
            </Text>
          </View>
          <Text numberOfLines={1} style={styles.itemDesc}>
            {item.description}
          </Text>
        </View>
        <View style={styles.priceContainer}>
          <Text
            style={[styles.priceTag, { color: colors.primary || "#D4AF37" }]}
          >
            {item.price}
          </Text>
          <Text style={styles.currencyLabel}>{currency}</Text>
        </View>
      </TouchableOpacity>
    </Animatable.View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: "#020B18" }]}>
      <StatusBar barStyle="light-content" />
      <ScrollView showsVerticalScrollIndicator={false}>
        <Animatable.View animation="fadeInDown" style={styles.header}>
          <View style={styles.headerTop}>
            <Text style={styles.brandTitle}>DISCOVER</Text>
            <TouchableOpacity
              onPress={() => router.push("/(customer)/wallet")}
              style={styles.walletBtn}
            >
              <MaterialCommunityIcons
                name="wallet-outline"
                size={22}
                color={colors.primary || "#D4AF37"}
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.subTitle}>
            📍 {location.toUpperCase()} LOGISTICS NODE
          </Text>
        </Animatable.View>

        <View style={styles.searchSection}>
          <View
            style={[
              styles.searchBar,
              { backgroundColor: "#051121", borderColor: "#0A1A2F" },
            ]}
          >
            <Ionicons
              name="search"
              size={18}
              color="#2C3E50"
              style={{ marginRight: 10 }}
            />
            <TextInput
              placeholder="SEARCH GLOBAL ARCHIVE..."
              placeholderTextColor="#2C3E50"
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={handleSearch}
            />
          </View>
        </View>

        <Animatable.View
          animation="pulse"
          iterationCount="infinite"
          style={[
            styles.aiPanel,
            { backgroundColor: "#0A1A2F", borderColor: "#1B2631" },
          ]}
        >
          <View style={styles.aiHeader}>
            <MaterialCommunityIcons
              name="shield-check"
              size={14}
              color="#FF3B30"
            />
            <Text style={styles.aiLabel}>SYSTEM CORE ENGINE</Text>
          </View>
          <Text style={styles.aiText}>{aiMessage}</Text>
        </Animatable.View>

        <Text style={styles.sectionTitle}>PREMIUM SELECTIONS</Text>

        {loading ? (
          <ActivityIndicator
            size="small"
            color={colors.primary || "#D4AF37"}
            style={styles.loader}
          />
        ) : (
          <FlatList
            data={filteredItems}
            scrollEnabled={false}
            keyExtractor={(item, index) => item.id || index.toString()}
            renderItem={renderMenuItem}
            contentContainerStyle={styles.listPadding}
            ListEmptyComponent={
              <Text
                style={{
                  color: "#5D6D7E",
                  textAlign: "center",
                  marginTop: 20,
                  fontSize: 10,
                }}
              >
                NO ASSETS FOUND IN THIS REGION.
              </Text>
            }
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 25, paddingTop: 30 },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  brandTitle: {
    fontSize: 32,
    fontWeight: "900",
    letterSpacing: 2,
    color: "#FFF",
  },
  subTitle: {
    fontSize: 8,
    fontWeight: "900",
    letterSpacing: 2,
    marginTop: 8,
    color: "#5D6D7E",
  },
  walletBtn: {
    padding: 10,
    backgroundColor: "#0A1A2F",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#1B2631",
  },
  searchSection: { paddingHorizontal: 25, marginBottom: 10 },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    height: 60,
    borderRadius: 20,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 11,
    color: "#FFF",
    letterSpacing: 1,
    fontWeight: "600",
  },
  aiPanel: { margin: 25, padding: 20, borderRadius: 20, borderWidth: 1 },
  aiHeader: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  aiLabel: {
    fontSize: 8,
    fontWeight: "900",
    letterSpacing: 2,
    color: "#FF3B30",
    marginLeft: 6,
  },
  aiText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#FFF",
    letterSpacing: 0.5,
  },
  sectionTitle: {
    fontSize: 9,
    fontWeight: "900",
    marginHorizontal: 25,
    marginBottom: 20,
    letterSpacing: 3,
    color: "#2C3E50",
  },
  card: {
    flexDirection: "row",
    padding: 22,
    borderRadius: 25,
    borderWidth: 1,
    marginBottom: 15,
    marginHorizontal: 25,
    alignItems: "center",
  },
  itemMeta: { flex: 1 },
  itemName: {
    fontSize: 14,
    fontWeight: "800",
    color: "#FFF",
    letterSpacing: 1,
  },
  distanceRow: { flexDirection: "row", alignItems: "center", marginTop: 6 },
  distanceText: {
    fontSize: 8,
    fontWeight: "bold",
    color: "#5D6D7E",
    marginLeft: 4,
    letterSpacing: 1,
  },
  itemDesc: { fontSize: 10, marginTop: 10, color: "#5D6D7E", lineHeight: 16 },
  priceContainer: { alignItems: "flex-end" },
  priceTag: { fontWeight: "900", fontSize: 22 },
  currencyLabel: { fontSize: 9, fontWeight: "900", color: "#5D6D7E" },
  loader: { marginTop: 50 },
  listPadding: { paddingBottom: 100 },
});
