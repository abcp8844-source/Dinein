import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, SafeAreaView, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { dbService } from '../../services/dbService';

export default function Home() {
  const { userData } = useAuth();
  const { colors } = useTheme();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [aiMessage, setAiMessage] = useState("Analyzing your local vibe... ✨");
  const router = useRouter();

  useEffect(() => {
    loadMenu();
    // AI behavior based on time
    const hour = new Date().getHours();
    if (hour < 12) setAiMessage("The morning breeze in Thailand calls for a fresh brew. ☕");
    else if (hour < 17) setAiMessage("The sun is high! How about some refreshing chilled desserts? 🍧");
    else setAiMessage("The evening trend: Spicy Basil is currently the top choice. 🔥");
  }, []);

  const loadMenu = async () => {
    try {
      const data = await dbService.getMenuItems();
      setItems(data);
    } catch (error) {
      console.error("Error loading menu:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      activeOpacity={0.8}
      onPress={() => router.push({
        pathname: '/customer/item-details',
        params: { id: item.id, name: item.name, price: item.price }
      })}
      style={[styles.card, { backgroundColor: '#111', borderColor: colors.border }]}
    >
      <View style={{ flex: 1 }}>
        <Text style={[styles.itemName, { color: colors.secondary }]}>{item.name}</Text>
        <Text style={{ color: colors.textDim, fontSize: 12 }} numberOfLines={1}>Exclusive selection for you</Text>
      </View>
      <Text style={[styles.price, { color: colors.primary }]}>{item.price} THB</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" />
      <ScrollView showsVerticalScrollIndicator={false}>
        
        <View style={styles.header}>
          <Text style={[styles.greeting, { color: colors.textDim }]}>WELCOME TO</Text>
          <Text style={[styles.brand, { color: colors.primary }]}>DINING TABLE</Text>
        </View>

        {/* AI SMART PANEL */}
        <View style={[styles.aiPanel, { backgroundColor: '#161618', borderColor: colors.primary }]}>
          <Text style={[styles.aiLabel, { color: colors.primary }]}>AI ASSISTANT</Text>
          <Text style={[styles.aiText, { color: colors.textMain }]}>{aiMessage}</Text>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.secondary }]}>CURATED MENU</Text>
          <View style={[styles.smallLine, { backgroundColor: colors.primary }]} />
        </View>

        {loading ? (
          <ActivityIndicator size="small" color={colors.primary} style={{ marginTop: 50 }} />
        ) : (
          <FlatList
            data={items}
            scrollEnabled={false}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={{ paddingHorizontal: 25, paddingBottom: 50 }}
            ListEmptyComponent={
                <Text style={{ color: colors.textDim, textAlign: 'center', marginTop: 20 }}>No items available at the moment.</Text>
            }
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 30, paddingTop: 20 },
  greeting: { fontSize: 10, letterSpacing: 3, fontWeight: 'bold' },
  brand: { fontSize: 32, fontWeight: '300', letterSpacing: 5, marginTop: 5 },
  aiPanel: { margin: 25, padding: 20, borderRadius: 2, borderWidth: 0.5, borderLeftWidth: 4 },
  aiLabel: { fontSize: 8, fontWeight: 'bold', letterSpacing: 2, marginBottom: 8 },
  aiText: { fontSize: 14, fontStyle: 'italic', lineHeight: 20 },
  sectionHeader: { paddingHorizontal: 30, marginBottom: 20 },
  sectionTitle: { fontSize: 12, fontWeight: 'bold', letterSpacing: 2 },
  smallLine: { height: 1, width: 20, marginTop: 5 },
  card: { flexDirection: 'row', padding: 25, marginBottom: 15, borderRadius: 4, borderWidth: 1, alignItems: 'center' },
  itemName: { fontSize: 18, fontWeight: '400', letterSpacing: 1 },
  price: { fontSize: 16, fontWeight: 'bold' }
});
