import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, SafeAreaView } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { dbService } from '../../services/dbService';
import PremiumButton from '../../components/PremiumButton';

export default function CustomerHome() {
  const { userData, logout } = useAuth();
  const { colors } = useTheme();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMenu();
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
    <View style={[styles.card, { backgroundColor: '#1A1A1A', borderColor: colors.primary }]}>
      <View style={styles.cardInfo}>
        <Text style={[styles.itemName, { color: colors.secondary }]}>{item.name}</Text>
        <Text style={[styles.itemDesc, { color: colors.textDim }]}>{item.description}</Text>
      </View>
      <View style={styles.priceTag}>
        <Text style={[styles.priceText, { color: colors.primary }]}>{item.price} THB</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.welcomeText, { color: colors.textMain }]}>Welcome to AB&CP</Text>
        <Text style={[styles.locationText, { color: colors.primary }]}>📍 {userData?.country || 'Thailand'}</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} style={{ flex: 1 }} />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <Text style={[styles.emptyText, { color: colors.textDim }]}>No items available yet.</Text>
          }
        />
      )}

      <View style={styles.footer}>
        <PremiumButton title="Sign Out" type="outline" onPress={logout} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 20, marginTop: 20 },
  welcomeText: { fontSize: 24, fontWeight: 'bold' },
  locationText: { fontSize: 14, marginTop: 5, fontWeight: '600' },
  listContent: { padding: 20 },
  card: {
    flexDirection: 'row',
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 15,
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  cardInfo: { flex: 1, marginRight: 10 },
  itemName: { fontSize: 18, fontWeight: 'bold' },
  itemDesc: { fontSize: 12, marginTop: 4 },
  priceTag: { padding: 8, borderRadius: 8, backgroundColor: 'rgba(212, 175, 55, 0.1)' },
  priceText: { fontWeight: 'bold', fontSize: 16 },
  emptyText: { textAlign: 'center', marginTop: 50 },
  footer: { padding: 20 }
});
