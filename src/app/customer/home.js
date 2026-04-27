import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, SafeAreaView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { dbService } from '../../services/dbService';
import PremiumButton from '../../components/PremiumButton';

export default function CustomerHome() {
  const { userData, logout } = useAuth();
  const { colors } = useTheme();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadMenu();
  }, []);

  const loadMenu = async () => {
    try {
      const data = await dbService.getMenuItems();
      setItems(data);
    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      activeOpacity={0.8}
      onPress={() => router.push({
        pathname: '/customer/item-details',
        params: { 
          id: item.id, 
          name: item.name, 
          price: item.price, 
          description: item.description 
        }
      })}
      style={[styles.card, { backgroundColor: '#121212', borderColor: colors.primary }]}
    >
      <View style={styles.cardInfo}>
        <Text style={[styles.itemName, { color: colors.secondary }]}>{item.name}</Text>
        <Text numberOfLines={2} style={[styles.itemDesc, { color: colors.textDim }]}>{item.description}</Text>
      </View>
      <View style={styles.priceContainer}>
        <Text style={[styles.priceText, { color: colors.primary }]}>{item.price} THB</Text>
        <Text style={{ color: colors.secondary, fontSize: 10, marginTop: 4 }}>View Details</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <View>
          <Text style={[styles.welcomeText, { color: colors.textMain }]}>AB&CP Premium</Text>
          <Text style={[styles.locationText, { color: colors.primary }]}>📍 {userData?.country || 'Thailand'}</Text>
        </View>
        <TouchableOpacity onPress={loadMenu} style={styles.refreshBtn}>
          <Text style={{ color: colors.primary }}>Refresh</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} style={{ flex: 1 }} />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text style={[styles.emptyText, { color: colors.textDim }]}>No items available in your area.</Text>
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
  header: { padding: 25, marginTop: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  welcomeText: { fontSize: 26, fontWeight: 'bold', letterSpacing: 1 },
  locationText: { fontSize: 13, marginTop: 4, opacity: 0.8 },
  refreshBtn: { padding: 8, borderRadius: 20, borderWidth: 1, borderColor: '#D4AF37' },
  listContent: { paddingHorizontal: 20, paddingBottom: 30 },
  card: {
    flexDirection: 'row',
    padding: 20,
    borderRadius: 15,
    borderWidth: 0.5,
    marginBottom: 18,
    shadowColor: '#D4AF37',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  cardInfo: { flex: 1, justifyContent: 'center' },
  itemName: { fontSize: 20, fontWeight: '700', marginBottom: 6 },
  itemDesc: { fontSize: 13, lineHeight: 18 },
  priceContainer: { alignItems: 'flex-end', justifyContent: 'center', marginLeft: 10 },
  priceText: { fontWeight: 'bold', fontSize: 18 },
  emptyText: { textAlign: 'center', marginTop: 100, fontSize: 16 },
  footer: { padding: 20, borderTopWidth: 0.5, borderTopColor: '#333' }
});
