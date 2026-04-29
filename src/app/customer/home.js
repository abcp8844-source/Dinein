import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, SafeAreaView, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../src/context/AuthContext';
import { useTheme } from '../../src/theme/ThemeContext';
import { dbService } from '../../src/services/dbService';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';

/**
 * CUSTOMER HOME - MAIN INTERFACE
 * Route: /customer/home
 */
export default function Home() {
  const { userData } = useAuth();
  const { colors } = useTheme();
  const router = useRouter();

  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [aiMessage, setAiMessage] = useState("Synchronizing nodes...");

  const currency = userData?.currencyCode || 'USD';
  const location = userData?.location?.city || 'Global Market';

  useEffect(() => {
    fetchMenu();
    updateAiAdvice();
  }, []);

  const updateAiAdvice = () => {
    const hours = new Date().getHours();
    if (hours < 12) setAiMessage(`MORNING PROTOCOL: Refreshing energy hubs in ${location}. ☀️`);
    else if (hours < 18) setAiMessage(`SYSTEM SYNC: High-performance options detected in ${location}. ☁️`);
    else setAiMessage(`NIGHT MODE: Analyzing comfort-tier dining for your cycle. 🌙`);
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    if (!lat1 || !lon1 || !lat2 || !lon2) return "0.0";
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return (R * c).toFixed(1);
  };

  const fetchMenu = async () => {
    try {
      const data = await dbService.getMenuItems();
      setItems(data);
      setFilteredItems(data);
    } catch (error) {
      console.error("FETCH_ERROR:", error);
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
    const filtered = items.filter(item => 
      item.name.toLowerCase().includes(text.toLowerCase()) ||
      item.description.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredItems(filtered);
  };

  const renderMenuItem = ({ item, index }) => {
    const dist = calculateDistance(
      userData?.location?.lat, userData?.location?.lng,
      item.lat, item.lng
    );

    return (
      <Animatable.View animation="fadeInUp" duration={600} delay={index * 50}>
        <TouchableOpacity 
          activeOpacity={0.9}
          onPress={() => router.push({ pathname: '/(customer)/item-details', params: { ...item } })}
          style={[styles.card, { backgroundColor: colors.cardBg, borderColor: item.isFeatured ? colors.primary : colors.border }]}
        >
          <View style={styles.itemMeta}>
            <Text style={[styles.itemName, { color: colors.textMain }]}>{item.name}</Text>
            <View style={styles.distanceRow}>
               <Ionicons name="location-sharp" size={10} color={colors.primary} />
               <Text style={[styles.distanceText, { color: colors.textDim }]}>{dist} KM • {item.restaurantName || 'Verified'}</Text>
            </View>
            <Text numberOfLines={1} style={[styles.itemDesc, { color: colors.textDim }]}>{item.description}</Text>
          </View>
          <View style={styles.priceContainer}>
            <Text style={[styles.priceTag, { color: colors.primary }]}>{item.price}</Text>
            <Text style={[styles.currencyLabel, { color: colors.textDim }]}>{currency}</Text>
          </View>
        </TouchableOpacity>
      </Animatable.View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Animatable.View animation="fadeInDown" style={styles.header}>
          <View style={styles.headerTop}>
            <Text style={[styles.brandTitle, { color: colors.textMain }]}>DISCOVER</Text>
            <TouchableOpacity onPress={() => router.push('/(customer)/wallet')}>
               <Ionicons name="wallet-outline" size={24} color={colors.primary} />
            </TouchableOpacity>
          </View>
          <Text style={[styles.subTitle, { color: colors.primary }]}>📍 {location.toUpperCase()} LOGISTICS</Text>
        </Animatable.View>

        <View style={styles.searchSection}>
          <View style={[styles.searchBar, { backgroundColor: colors.inputBg, borderColor: colors.border }]}>
            <Ionicons name="search" size={18} color={colors.textDim} style={{ marginRight: 10 }} />
            <TextInput 
              placeholder="Search local delicacies..." 
              placeholderTextColor={colors.textDim}
              style={[styles.searchInput, { color: colors.textMain }]}
              value={searchQuery}
              onChangeText={handleSearch}
            />
          </View>
        </View>

        <Animatable.View animation="pulse" iterationCount="infinite" duration={4000} style={[styles.aiPanel, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
          <Text style={[styles.aiLabel, { color: colors.primary }]}>SYSTEM CORE ENGINE</Text>
          <Text style={[styles.aiText, { color: colors.textMain }]}>{aiMessage}</Text>
        </Animatable.View>

        <Text style={[styles.sectionTitle, { color: colors.textDim }]}>NEARBY SELECTIONS</Text>

        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
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
  container: { flex: 1 },
  header: { padding: 25, paddingTop: 40 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  brandTitle: { fontSize: 30, fontWeight: '900', letterSpacing: 2 },
  subTitle: { fontSize: 9, fontWeight: 'bold', letterSpacing: 1.5, marginTop: 5 },
  searchSection: { paddingHorizontal: 25, marginBottom: 10 },
  searchBar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, height: 50, borderRadius: 15, borderWidth: 1 },
  searchInput: { flex: 1, fontSize: 14 },
  aiPanel: { margin: 25, padding: 20, borderRadius: 20, borderWidth: 1 },
  aiLabel: { fontSize: 8, fontWeight: '900', letterSpacing: 2, marginBottom: 8 },
  aiText: { fontSize: 13, lineHeight: 20, fontWeight: '500' },
  sectionTitle: { fontSize: 10, fontWeight: '900', marginHorizontal: 25, marginBottom: 15, letterSpacing: 2 },
  card: { flexDirection: 'row', padding: 20, borderRadius: 20, borderWidth: 1, marginBottom: 12, marginHorizontal: 25, alignItems: 'center' },
  itemMeta: { flex: 1 },
  itemName: { fontSize: 16, fontWeight: 'bold' },
  distanceRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  distanceText: { fontSize: 9, fontWeight: 'bold', marginLeft: 4 },
  itemDesc: { fontSize: 11, marginTop: 6 },
  priceContainer: { alignItems: 'flex-end' },
  priceTag: { fontWeight: '900', fontSize: 18 },
  currencyLabel: { fontSize: 8, fontWeight: 'bold' },
  loader: { marginTop: 50 },
  listPadding: { paddingBottom: 100 }
});
