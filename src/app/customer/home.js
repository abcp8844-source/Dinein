import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { dbService } from '../../services/dbService';
import * as Animatable from 'react-native-animatable'; // ✨ Adding the Animation Layer

/**
 * AI-DRIVEN GLOBAL HOME 
 * Optimized for 15 Countries | Zero-Urdu Code Policy
 */
export default function CustomerHome() {
  const { userData } = useAuth();
  const { colors } = useTheme();
  const router = useRouter();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [aiMessage, setAiMessage] = useState("Initializing Global Market Sync...");

  // 🛡️ Global Market Anchoring
  const currency = userData?.currencyCode || 'USD';
  const location = userData?.locationData?.city || 'Global';

  useEffect(() => {
    fetchMenu();
    updateAiAdvice();
  }, []);

  const updateAiAdvice = () => {
    const hours = new Date().getHours();
    if (hours < 12) setAiMessage(`MORNING PROTOCOL: Refreshing breakfast hubs in ${location} are now trending. ☀️`);
    else if (hours < 18) setAiMessage(`AFTERNOON SYNC: Perfect timing for a signature lunch in ${location}. ☁️`);
    else setAiMessage(`NIGHT MODE: Analyzing top-rated late-night dining in ${location}. 🌙`);
  };

  const fetchMenu = async () => {
    try {
      const data = await dbService.getMenuItems();
      setItems(data);
    } catch (error) {
      console.error("[System Error]: Menu synchronization failed", error);
    } finally {
      setLoading(false);
    }
  };

  const renderMenuItem = ({ item, index }) => (
    <Animatable.View 
      animation="fadeInUp" 
      duration={600} 
      delay={index * 100} // ✨ Staggered Animation
    >
      <TouchableOpacity 
        activeOpacity={0.9}
        onPress={() => router.push({ pathname: '/customer/item-details', params: { ...item } })}
        style={[styles.card, { backgroundColor: '#0D0D0D', borderColor: item.isFeatured ? colors.primary : '#1A1A1A' }]}
      >
        <View style={styles.itemMeta}>
          <Text style={[styles.itemName, { color: '#FFF' }]}>{item.name}</Text>
          <Text numberOfLines={1} style={[styles.itemDesc, { color: '#666' }]}>{item.description}</Text>
        </View>
        <View style={styles.priceContainer}>
          <Text style={[styles.priceTag, { color: colors.primary }]}>{item.price}</Text>
          <Text style={styles.currencyLabel}>{currency}</Text>
        </View>
      </TouchableOpacity>
    </Animatable.View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        
        {/* 🏢 BRANDING HEADER */}
        <Animatable.View animation="fadeInDown" duration={800} style={styles.header}>
          <Text style={styles.brandTitle}>AB&CP PREMIUM</Text>
          <View style={styles.locationBadge}>
            <Text style={[styles.subTitle, { color: colors.primary }]}>📍 {location} MARKET SYSTEM</Text>
          </View>
        </Animatable.View>

        {/* 🤖 AI INSIGHT PANEL (Dynamic & Glowing) */}
        <Animatable.View 
          animation="pulse" 
          iterationCount="infinite" 
          duration={3000} 
          style={[styles.aiPanel, { borderColor: colors.primary }]}
        >
          <Text style={[styles.aiLabel, { color: colors.primary }]}>GEMINI AI ENGINE</Text>
          <Text style={styles.aiText}>{aiMessage}</Text>
        </Animatable.View>

        <Text style={[styles.sectionTitle, { color: '#FFF' }]}>CURATED FOR YOU</Text>

        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
        ) : (
          <FlatList
            data={items}
            scrollEnabled={false}
            keyExtractor={(item) => item.id}
            renderItem={renderMenuItem}
            contentContainerStyle={styles.listPadding}
            ListEmptyComponent={<Text style={styles.emptyText}>No regional items available yet.</Text>}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  header: { padding: 30, paddingTop: 50 },
  brandTitle: { color: '#FFF', fontSize: 32, fontWeight: '900', letterSpacing: 2 },
  locationBadge: { marginTop: 8 },
  subTitle: { fontSize: 10, fontWeight: 'bold', letterSpacing: 1.5, textTransform: 'uppercase' },
  aiPanel: { margin: 20, padding: 25, borderRadius: 24, borderWidth: 1, backgroundColor: '#050505', borderStyle: 'solid', shadowColor: '#D4AF37', shadowOpacity: 0.1, shadowRadius: 10 },
  aiLabel: { fontSize: 9, fontWeight: 'bold', letterSpacing: 2, marginBottom: 12, opacity: 0.8 },
  aiText: { color: '#FFF', fontSize: 15, lineHeight: 22, fontWeight: '600', letterSpacing: 0.5 },
  sectionTitle: { fontSize: 12, fontWeight: '900', marginHorizontal: 30, marginBottom: 20, letterSpacing: 2, color: '#444' },
  card: { flexDirection: 'row', padding: 22, borderRadius: 24, borderWidth: 1, marginBottom: 15, marginHorizontal: 20, alignItems: 'center' },
  itemMeta: { flex: 1 },
  itemName: { fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
  itemDesc: { fontSize: 12, fontWeight: '500' },
  priceContainer: { alignItems: 'flex-end' },
  priceTag: { fontWeight: '900', fontSize: 20 },
  currencyLabel: { fontSize: 9, color: '#444', fontWeight: 'bold' },
  loader: { marginTop: 100 },
  listPadding: { paddingBottom: 50 },
  emptyText: { color: '#333', textAlign: 'center', marginTop: 50, fontSize: 12, letterSpacing: 1 }
});
