import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, Switch, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { dbService } from '../../services/dbService'; // Importing our master service
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';

export default function ManageMenu() {
  const { userData, marketISO } = useAuth();
  const { colors } = useTheme();
  const router = useRouter();

  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch real items from the correct 15-market node
  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = async () => {
    try {
      setLoading(true);
      const items = await dbService.getMenuItems(marketISO);
      setInventory(items);
    } catch (error) {
      console.error("LOAD_ERROR:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleAvailability = async (id, currentStatus) => {
    try {
      // Optimistic Update for UI Speed
      setInventory(prev => prev.map(item => 
        item.id === id ? { ...item, isAvailable: !currentStatus } : item
      ));

      // Real DB Sync to specific market node
      await dbService.updateMenuItemStatus(id, marketISO, !currentStatus);
    } catch (error) {
      console.error("SYNC_ERROR:", error);
      loadInventory(); // Revert on failure
    }
  };

  const renderInventoryItem = ({ item, index }) => (
    <Animatable.View animation="fadeInRight" delay={index * 50} style={styles.card}>
      <View style={styles.info}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={[styles.itemPrice, {color: colors.primary}]}>
          {item.price} {userData?.currencyCode || 'THB'}
        </Text>
      </View>
      
      <View style={styles.actionContainer}>
        <Text style={[styles.stockStatus, { color: item.isAvailable ? colors.primary : '#FF4444' }]}>
          {item.isAvailable ? 'AVAILABLE' : 'SOLD OUT'}
        </Text>
        <Switch
          trackColor={{ false: "#1A1A1A", true: colors.primary }}
          thumbColor={item.isAvailable ? "#FFF" : "#444"}
          onValueChange={() => toggleAvailability(item.id, item.isAvailable)}
          value={item.isAvailable}
        />
      </View>
    </Animatable.View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={26} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>INVENTORY CONTROL</Text>
        <TouchableOpacity onPress={() => router.push('/(owner)/upload-menu')}>
          <Ionicons name="add" size={26} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.statusBanner}>
        <Text style={styles.bannerText}>
          Broadcast active for {userData?.countryName || 'Regional'} Market ({marketISO})
        </Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={inventory}
          keyExtractor={item => item.id}
          renderItem={renderInventoryItem}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={<Text style={styles.emptyText}>No items in menu</Text>}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 25, paddingTop: 40 },
  headerTitle: { color: '#FFF', fontSize: 12, fontWeight: '900', letterSpacing: 2 },
  statusBanner: { backgroundColor: '#050505', marginHorizontal: 25, padding: 12, borderRadius: 12, marginBottom: 20, borderWidth: 1, borderColor: '#111' },
  bannerText: { color: '#444', fontSize: 9, fontWeight: 'bold', textAlign: 'center', letterSpacing: 1 },
  listContainer: { paddingHorizontal: 25, paddingBottom: 100 },
  card: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#080808', padding: 22, borderRadius: 24, marginBottom: 15, borderWidth: 1, borderColor: '#111' },
  info: { flex: 1 },
  itemName: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  itemPrice: { fontSize: 14, fontWeight: '900', marginTop: 5 },
  actionContainer: { alignItems: 'flex-end' },
  stockStatus: { fontSize: 8, fontWeight: '900', marginBottom: 8, letterSpacing: 1 },
  emptyText: { color: '#444', textAlign: 'center', marginTop: 50, fontSize: 12, fontWeight: 'bold' }
});
