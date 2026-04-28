import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { dbService } from '../../services/dbService';

/**
 * CUSTOMER HOME COMPONENT
 * Cleaned for International Standards - 15 Countries Support
 */
export default function CustomerHome() {
  const { userData } = useAuth();
  const { colors } = useTheme();
  const router = useRouter();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [aiMessage, setAiMessage] = useState("Analyzing your local trends...");

  // Global Configuration Logic
  const currency = userData?.currency || 'USD';
  const location = userData?.city || 'Global';

  useEffect(() => {
    fetchMenu();
    updateAiAdvice();
  }, []);

  const updateAiAdvice = () => {
    const hours = new Date().getHours();
    if (hours < 12) setAiMessage(`Morning Vibes: Refreshing drinks are popular in ${location} right now! 🍊`);
    else if (hours < 18) setAiMessage(`Afternoon Update: Stay cozy, it's the perfect time to order in ${location}. ⛈️`);
    else setAiMessage(`Dinner Protocol: Top-rated dishes in ${location} are waiting for you. 🔥`);
  };

  const fetchMenu = async () => {
    try {
      const data = await dbService.getMenuItems();
      setItems(data);
    } catch (error) {
      console.error("[System Error]: Menu fetch failed", error);
    } finally {
      setLoading(false);
    }
  };

  const renderMenuItem = ({ item }) => (
    <TouchableOpacity 
      activeOpacity={0.9}
      onPress={() => router.push({ pathname: '/customer/item-details', params: { ...item } })}
      style={[styles.card, { backgroundColor: '#141414', borderColor: item.isFeatured ? colors.primary : '#222' }]}
    >
      <View style={styles.itemMeta}>
        <Text style={[styles.itemName, { color: colors.secondary }]}>{item.name}</Text>
        <Text numberOfLines={1} style={[styles.itemDesc, { color: colors.textDim }]}>{item.description}</Text>
      </View>
      <Text style={[styles.priceTag, { color: colors.primary }]}>{item.price} {currency}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.brandTitle}>AB&CP Premium</Text>
          <Text style={[styles.subTitle, { color: colors.primary }]}>Premium dining experience in {location}</Text>
        </View>

        {/* AI Insight Panel */}
        <View style={[styles.aiPanel, { borderColor: colors.primary }]}>
          <Text style={[styles.aiLabel, { color: colors.primary }]}>AI SYSTEM ADVICE</Text>
          <Text style={styles.aiText}>{aiMessage}</Text>
        </View>

        <Text style={[styles.sectionTitle, { color: colors.secondary }]}>Curated Selection</Text>

        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
        ) : (
          <FlatList
            data={items}
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
  header: { padding: 30 },
  brandTitle: { color: '#FFF', fontSize: 28, fontWeight: '900', letterSpacing: 1 },
  subTitle: { fontSize: 13, fontWeight: '500', marginTop: 5, letterSpacing: 0.5 },
  aiPanel: { margin: 20, padding: 20, borderRadius: 20, borderWidth: 1, backgroundColor: '#0A0A0A', borderStyle: 'dashed' },
  aiLabel: { fontSize: 9, fontWeight: 'bold', letterSpacing: 2, marginBottom: 10 },
  aiText: { color: '#EEE', fontSize: 16, lineHeight: 24, fontWeight: '500' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginHorizontal: 30, marginBottom: 20, letterSpacing: 1 },
  card: { flexDirection: 'row', padding: 20, borderRadius: 20, borderWidth: 1, marginBottom: 15, marginHorizontal: 20, alignItems: 'center' },
  itemMeta: { flex: 1 },
  itemName: { fontSize: 18, fontWeight: '700', marginBottom: 5 },
  itemDesc: { fontSize: 13, opacity: 0.8 },
  priceTag: { fontWeight: '800', fontSize: 17, marginLeft: 15 },
  loader: { marginTop: 50 },
  listPadding: { paddingBottom: 30 }
});
