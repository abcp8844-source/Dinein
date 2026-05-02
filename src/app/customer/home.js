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
import { Ionicons } from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";

export default function Home() {
  const { userData } = useAuth();
  const { colors } = useTheme();
  const router = useRouter();

  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [aiMessage, setAiMessage] = useState("CORE_SYNC_ACTIVE");

  const currency = userData?.currencyCode || "USD";
  const location = userData?.location?.city || "GLOBAL NODE";

  useEffect(() => {
    fetchMenu();
    updateAiProtocol();
  }, []);

  const updateAiProtocol = () => {
    const hours = new Date().getHours();
    if (hours < 12)
      setAiMessage(`AM_PROTOCOL: OPTIMIZING ENERGY LEVELS IN ${location}.`);
    else if (hours < 18)
      setAiMessage(`SYSTEM_SYNC: HIGH-PERFORMANCE SELECTIONS DETECTED.`);
    else setAiMessage(`PM_PROTOCOL: ANALYZING COMFORT-TIER OPTIONS.`);
  };

  const fetchMenu = async () => {
    try {
      const data = await dbService.getMenuItems();
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
        item.name.toLowerCase().includes(text.toLowerCase()) ||
        item.description.toLowerCase().includes(text.toLowerCase()),
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
        style={styles.card}
      >
        <View style={styles.itemMeta}>
          <Text style={styles.itemName}>{item.name?.toUpperCase()}</Text>
          <View style={styles.distanceRow}>
            <Ionicons name="location-sharp" size={10} color="#D4AF37" />
            <Text style={styles.distanceText}>
              {item.restaurantName || "VERIFIED SOURCE"}
            </Text>
          </View>
          <Text numberOfLines={1} style={styles.itemDesc}>
            {item.description}
          </Text>
        </View>
        <View style={styles.priceContainer}>
          <Text style={styles.priceTag}>{item.price}</Text>
          <Text style={styles.currencyLabel}>{currency}</Text>
        </View>
      </TouchableOpacity>
    </Animatable.View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView showsVerticalScrollIndicator={false}>
        <Animatable.View animation="fadeInDown" style={styles.header}>
          <View style={styles.headerTop}>
            <Text style={styles.brandTitle}>DISCOVER</Text>
            <TouchableOpacity onPress={() => router.push("/(customer)/wallet")}>
              <View style={styles.walletIconFrame}>
                <Ionicons name="wallet" size={20} color="#D4AF37" />
              </View>
            </TouchableOpacity>
          </View>
          <Text style={styles.subTitle}>
            📍 {location.toUpperCase()} LOGISTICS
          </Text>
        </Animatable.View>

        <View style={styles.searchSection}>
          <View style={styles.searchBar}>
            <Ionicons
              name="search"
              size={18}
              color="#444"
              style={{ marginRight: 10 }}
            />
            <TextInput
              placeholder="SEARCH GLOBAL ARCHIVE..."
              placeholderTextColor="#333"
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={handleSearch}
            />
          </View>
        </View>

        <Animatable.View
          animation="pulse"
          iterationCount="infinite"
          style={styles.aiPanel}
        >
          <Text style={styles.aiLabel}>SYSTEM CORE ENGINE</Text>
          <Text style={styles.aiText}>{aiMessage}</Text>
        </Animatable.View>

        <Text style={styles.sectionTitle}>PREMIUM SELECTIONS</Text>

        {loading ? (
          <ActivityIndicator
            size="small"
            color="#D4AF37"
            style={styles.loader}
          />
        ) : (
          <FlatList
            data={filteredItems}
            scrollEnabled={false}
            keyExtractor={(item) => item.id}
            renderItem={renderMenuItem}
            contentContainerStyle={styles.listPadding}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
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
    fontWeight: "bold",
    letterSpacing: 2,
    marginTop: 5,
    color: "#D4AF37",
  },
  walletIconFrame: {
    padding: 8,
    backgroundColor: "#111",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#222",
  },
  searchSection: { paddingHorizontal: 25, marginBottom: 10 },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    height: 55,
    borderRadius: 15,
    backgroundColor: "#0A0A0A",
    borderWidth: 1,
    borderColor: "#111",
  },
  searchInput: { flex: 1, fontSize: 11, color: "#FFF", letterSpacing: 1 },
  aiPanel: {
    margin: 25,
    padding: 20,
    borderRadius: 20,
    backgroundColor: "#0A0A0A",
    borderWidth: 1,
    borderColor: "#D4AF3733",
  },
  aiLabel: {
    fontSize: 8,
    fontWeight: "900",
    letterSpacing: 2,
    marginBottom: 8,
    color: "#D4AF37",
  },
  aiText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FFF",
    letterSpacing: 0.5,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: "900",
    marginHorizontal: 25,
    marginBottom: 20,
    letterSpacing: 3,
    color: "#444",
  },
  card: {
    flexDirection: "row",
    padding: 22,
    borderRadius: 20,
    backgroundColor: "#0A0A0A",
    borderWidth: 1,
    borderColor: "#111",
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
    color: "#666",
    marginLeft: 4,
    letterSpacing: 1,
  },
  itemDesc: { fontSize: 10, marginTop: 8, color: "#444" },
  priceContainer: { alignItems: "flex-end" },
  priceTag: { fontWeight: "900", fontSize: 20, color: "#D4AF37" },
  currencyLabel: {
    fontSize: 8,
    fontWeight: "bold",
    color: "#D4AF37",
    opacity: 0.6,
  },
  loader: { marginTop: 50 },
  listPadding: { paddingBottom: 100 },
});
