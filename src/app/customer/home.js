import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, SafeAreaView, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { dbService } from '../../services/dbService';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';

/**
 * AI-DRIVEN GLOBAL DISCOVERY HUB
 * Optimized with Proximity Logic for 15-Market Deployment
 */
export default function CustomerHome() {
  const { userData } = useAuth();
  const { colors } = useTheme();
  const router = useRouter();

  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [aiMessage, setAiMessage] = useState("Synchronizing regional data nodes...");

  const currency = userData?.currencyCode || 'USD';
  const location = userData?.location?.city || 'Global Market';

  useEffect(() => {
    fetchMenu();
    updateAiAdvice();
  }, []);

  const updateAiAdvice = () => {
    const hours = new Date().getHours();
    if (hours < 12) setAiMessage(`MORNING PROTOCOL: Refreshing energy hubs in ${location} are now live. ☀️`);
    else if (hours < 18) setAiMessage(`SYSTEM SYNC: High-performance lunch options detected in ${location}. ☁️`);
    else setAiMessage(`NIGHT MODE: Analyzing comfort-tier dining for your current cycle. 🌙`);
  };

  // 📍 GEOLOCATION PROXIMITY LOGIC
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    if (!lat1 || !lon1 || !lat2 || !lon2) return "0.0";
    const R = 6371; // Earth radius in KM
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
      console.error("[System Analytics]: Sync failed", error);
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
    // Dynamic distance calculation between user and restaurant
    const dist = calculateDistance(
      userData?.location?.lat, userData?.location?.lng,
      item.lat, item.lng
    );

    return (
      <Animatable.View animation="fadeInUp" duration={600} delay={index * 50}>
        <TouchableOpacity 
          activeOpacity={0.9}
          onPress={() => router.push({ pathname: '/customer/item-details', params: { ...item } })}
          style={[styles.card, { backgroundColor: '#0A0A0A', borderColor: item.isFeatured ? colors.primary : '#111' }]}
        >
          <View style={styles.itemMeta}>
            <Text style={[styles.itemName, { color: '#FFF' }]}>{item.name}</Text>
            <View style={styles.distanceRow}>
               <Ionicons name="location-sharp" size={10} color={colors.primary} />
               <Text style={styles.distanceText}>{dist} KM • {item.restaurantName || 'Verified Store'}</Text>
            </View>
            <Text numberOfLines={1} style={[styles.itemDesc, { color: '#444' }]}>{item.description}</Text>
          </View>
          <View style={styles.priceContainer}>
            <Text style={[styles.priceTag, { color: colors.primary }]}>{item.price}</Text>
            <Text style={styles.currencyLabel}>{currency}</Text>
          </View>
        </TouchableOpacity>
      </Animatable.View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Animatable.View animation="fadeInDown" style={styles.header}>
          <View style={styles.headerTop}>
            <Text style={styles.brandTitle}>DISCOVER</Text>
            <TouchableOpacity onPress={() => router.push('/customer/wallet')}>
               <Ionicons name="wallet-outline" size={24} color={colors.primary} />
            </TouchableOpacity>
          </View>
          <Text style={[styles.subTitle, { color: colors.primary }]}>📍 {location} LOGISTICS NETWORK</Text>
        </Animatable.View>

        <Animatable.View animation="fadeInUp" delay={200} style={styles.searchSection}>
          <View style={[styles.searchBar, { backgroundColor: '#0D0D0D' }]}>
            <Ionicons name="search" size={18} color="#444" style={{ marginRight: 10 }} />
            <TextInput 
              placeholder="Search local delicacies..." 
              placeholderTextColor="#444"
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={handleSearch}
            />
          </View>
        </Animatable.View>

        <Animatable.View animation="pulse" iterationCount="infinite" duration={4000} style={styles.aiPanel}>
          <Text style={[styles.aiLabel, { color: colors.primary }]}>GEMINI AI ENGINE</Text>
          <Text style={styles.aiText}>{aiMessage}</Text>
        </Animatable.View>

        <Text style={styles.sectionTitle}>NEARBY SELECTIONS</Text>

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
  container: { flex: 1, backgroundColor: '#000' },
  header: { padding: 30, paddingTop: 50 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  brandTitle: { color: '#FFF', fontSize: 34, fontWeight: '900', letterSpacing: 2 },
  subTitle: { fontSize: 9, fontWeight: 'bold', letterSpacing: 1.5, marginTop: 5 },
  searchSection: { paddingHorizontal: 25, marginBottom: 10 },
  searchBar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, height: 55, borderRadius: 15, borderWidth: 1, borderColor: '#111' },
  searchInput: { flex: 1, color: '#FFF', fontSize: 14 },
  aiPanel: { margin: 25, padding: 25, borderRadius: 24, borderWidth: 1, backgroundColor: '#050505', borderColor: '#111' },
  aiLabel: { fontSize: 8, fontWeight: '900', letterSpacing: 2, marginBottom: 10 },
  aiText: { color: '#EEE', fontSize: 14, lineHeight: 22, fontWeight: '500' },
  sectionTitle: { fontSize: 10, fontWeight: '900', marginHorizontal: 30, marginBottom: 15, letterSpacing: 2, color: '#333' },
  card: { flexDirection: 'row', padding: 22, borderRadius: 24, borderWidth: 1, marginBottom: 15, marginHorizontal: 20, alignItems: 'center' },
  itemMeta: { flex: 1 },
  itemName: { fontSize: 17, fontWeight: 'bold' },
  distanceRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  distanceText: { color: '#666', fontSize: 9, fontWeight: 'bold', marginLeft: 4 },
  itemDesc: { fontSize: 11, marginTop: 8 },
  priceContainer: { alignItems: 'flex-end' },
  priceTag: { fontWeight: '900', fontSize: 19 },
  currencyLabel: { fontSize: 8, color: '#444', fontWeight: 'bold' },
  loader: { marginTop: 50 },
  listPadding: { paddingBottom: 100 }
});
