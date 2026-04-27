import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { dbService } from '../../services/dbService';

export default function CustomerHome() {
  const { userData } = useAuth();
  const { colors } = useTheme();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // AI Mockup Data (This will later connect to Gemini/Weather API)
  const [aiMessage, setAiMessage] = useState("Checking local vibes... ✨");

  useEffect(() => {
    loadMenu();
    generateAiAdvice();
  }, []);

  const generateAiAdvice = () => {
    // In future, this will call AI based on weather/trends
    const hours = new Date().getHours();
    if (hours < 12) setAiMessage("Good morning! People are loving fresh juices today. 🍊");
    else if (hours < 18) setAiMessage("It might rain soon in Si Racha. Order your comfort food now! ⛈️");
    else setAiMessage("Dinner time! The local favorite is Spicy Basil Chicken right now. 🔥");
  };

  const loadMenu = async () => {
    try {
      const data = await dbService.getMenuItems();
      setItems(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      activeOpacity={0.9}
      onPress={() => router.push({
        pathname: '/customer/item-details',
        params: { id: item.id, name: item.name, price: item.price, description: item.description }
      })}
      style={[styles.card, { backgroundColor: '#1A1A1A', borderColor: item.isFeatured ? colors.primary : '#333' }]}
    >
      {item.isFeatured && <Text style={styles.featuredBadge}>FEATURED</Text>}
      <View style={{ flex: 1 }}>
        <Text style={[styles.itemName, { color: colors.secondary }]}>{item.name}</Text>
        <Text numberOfLines={1} style={{ color: colors.textDim }}>{item.description}</Text>
      </View>
      <Text style={[styles.priceText, { color: colors.primary }]}>{item.price} THB</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={[styles.welcomeText, { color: colors.textMain }]}>AB&CP Premium</Text>
          <Text style={{ color: colors.primary }}>Explore local tastes in {userData?.country || 'Thailand'}</Text>
        </View>

        {/* --- AI SMART ALERT PANEL --- */}
        <View style={[styles.aiPanel, { backgroundColor: 'rgba(212, 175, 55, 0.1)', borderColor: colors.primary }]}>
          <Text style={[styles.aiLabel, { color: colors.primary }]}>AI SMART ADVICE</Text>
          <Text style={[styles.aiText, { color: colors.textMain }]}>{aiMessage}</Text>
        </View>

        {/* --- ADMIN PROMOTION BANNER --- */}
        <View style={styles.promoBanner}>
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>AD: Get 10% Off on your first Wallet Top-up! 💳</Text>
        </View>

        <Text style={[styles.sectionTitle, { color: colors.secondary }]}>Recommended for You</Text>

        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} />
        ) : (
          <FlatList
            data={items}
            scrollEnabled={false} // Since we are inside ScrollView
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={{ paddingHorizontal: 20 }}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 25 },
  welcomeText: { fontSize: 28, fontWeight: 'bold' },
  aiPanel: { margin: 20, padding: 15, borderRadius: 15, borderWidth: 1, borderStyle: 'dashed' },
  aiLabel: { fontSize: 10, fontWeight: 'bold', letterSpacing: 1, marginBottom: 5 },
  aiText: { fontSize: 15, fontWeight: '500' },
  promoBanner: { marginHorizontal: 20, padding: 12, backgroundColor: '#800000', borderRadius: 10, alignItems: 'center' },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', margin: 20 },
  card: { flexDirection: 'row', padding: 20, borderRadius: 15, borderWidth: 1, marginBottom: 15, alignItems: 'center' },
  featuredBadge: { position: 'absolute', top: -10, right: 10, backgroundColor: '#D4AF37', color: '#000', paddingHorizontal: 8, fontSize: 10, fontWeight: 'bold', borderRadius: 5 },
  itemName: { fontSize: 18, fontWeight: '700' },
  priceText: { fontWeight: 'bold', fontSize: 18, marginLeft: 10 }
});
