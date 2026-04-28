import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';

/**
 * GLOBAL INVENTORY MANAGER
 * Purpose: Real-time Stock Control (In-Stock / Sold-Out)
 * Support: 15-Market Localization
 */
export default function ManageMenu() {
  const { userData } = useAuth();
  const { colors } = useTheme();
  const router = useRouter();

  // Optimized State for Inventory
  const [inventory, setInventory] = useState([
    { id: '1', name: 'Spicy Basil Chicken', price: '150', isAvailable: true },
    { id: '2', name: 'Iced Matcha Latte', price: '85', isAvailable: false },
    { id: '3', name: 'Mango Sticky Rice', price: '120', isAvailable: true },
  ]);

  const toggleAvailability = (id) => {
    setInventory(prev => prev.map(item => 
      item.id === id ? { ...item, isAvailable: !item.isAvailable } : item
    ));
    // Implementation for DB Sync should be added here
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
          onValueChange={() => toggleAvailability(item.id)}
          value={item.isAvailable}
        />
      </View>
    </Animatable.View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* --- CLEAN HEADER --- */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={26} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>INVENTORY CONTROL</Text>
        <TouchableOpacity onPress={() => router.push('/owner/upload-menu')}>
          <Ionicons name="add" size={26} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* --- STATUS BRIEF --- */}
      <View style={styles.statusBanner}>
        <Text style={styles.bannerText}>
          Broadcast active for {userData?.countryName || 'Regional'} Market
        </Text>
      </View>

      <FlatList
        data={inventory}
        keyExtractor={item => item.id}
        renderItem={renderInventoryItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
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
  stockStatus: { fontSize: 8, fontWeight: '900', marginBottom: 8, letterSpacing: 1 }
});
