import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';

/**
 * PREMIUM OWNER COMMAND CENTER
 * Features: Revenue Analytics | Live Order Stream | Store Control
 */
export default function OwnerDashboard() {
  const { userData } = useAuth();
  const { colors } = useTheme();
  const router = useRouter();

  const [isOnline, setIsOnline] = useState(true);
  const [orders] = useState([
    { id: 'ORD-9921', item: 'Spicy Basil Chicken', price: '150', status: 'Pending', time: '2m ago' },
    { id: 'ORD-9920', item: 'Iced Matcha Latte', price: '85', status: 'Preparing', time: '10m ago' },
  ]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        
        {/* --- BRAND & STATUS HEADER --- */}
        <View style={styles.header}>
          <View>
            <Text style={styles.brandTitle}>OWNER PANEL</Text>
            <Text style={[styles.storeName, {color: colors.primary}]}>
              {userData?.restaurantName || 'Premium Hub'}
            </Text>
          </View>
          <TouchableOpacity 
            onPress={() => setIsOnline(!isOnline)}
            style={[styles.statusToggle, { backgroundColor: isOnline ? '#113311' : '#331111' }]}
          >
            <View style={[styles.statusDot, { backgroundColor: isOnline ? '#00FF00' : '#FF0000' }]} />
            <Text style={[styles.statusText, { color: isOnline ? '#00FF00' : '#FF0000' }]}>
              {isOnline ? 'STORE OPEN' : 'STORE CLOSED'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* --- REVENUE SNAPSHOT --- */}
        <Animatable.View animation="fadeInUp" style={styles.revenueCard}>
          <Text style={styles.cardLabel}>TODAY'S REVENUE</Text>
          <Text style={[styles.revenueAmount, {color: colors.primary}]}>
            4,850 <Text style={styles.currency}>{userData?.currencyCode || 'THB'}</Text>
          </Text>
          <View style={styles.aiBriefing}>
            <Ionicons name="trending-up" size={16} color={colors.primary} />
            <Text style={styles.aiBriefText}>AI Forecast: High demand expected in 2 hours.</Text>
          </View>
        </Animatable.View>

        {/* --- QUICK ACTION GRID --- */}
        <View style={styles.actionGrid}>
          <TouchableOpacity style={styles.actionBox} onPress={() => router.push('/owner/ai-consultant')}>
            <Ionicons name="sparkles" size={24} color={colors.primary} />
            <Text style={styles.actionLabel}>AI CONSULTANT</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBox} onPress={() => router.push('/owner/manage-menu')}>
            <Ionicons name="fast-food-outline" size={24} color="#FFF" />
            <Text style={styles.actionLabel}>MANAGE MENU</Text>
          </TouchableOpacity>
        </View>

        {/* --- LIVE ORDERS SECTION --- */}
        <View style={styles.orderSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>LIVE INCOMING ORDERS</Text>
            <Text style={[styles.orderCount, {color: colors.primary}]}>{orders.length} ACTIVE</Text>
          </View>

          {orders.map((order) => (
            <Animatable.View key={order.id} animation="fadeInLeft" style={styles.orderCard}>
              <View style={styles.orderMeta}>
                <Text style={styles.orderId}>{order.id}</Text>
                <Text style={styles.orderTime}>{order.time}</Text>
              </View>
              <Text style={styles.orderItem}>{order.item}</Text>
              <View style={styles.orderFooter}>
                <Text style={styles.orderPrice}>{order.price} {userData?.currencyCode || 'THB'}</Text>
                <TouchableOpacity style={[styles.acceptBtn, {backgroundColor: colors.primary}]}>
                  <Text style={styles.acceptBtnText}>ACCEPT</Text>
                </TouchableOpacity>
              </View>
            </Animatable.View>
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  header: { padding: 30, paddingTop: 50, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  brandTitle: { color: '#444', fontSize: 10, fontWeight: '900', letterSpacing: 2 },
  storeName: { fontSize: 24, fontWeight: '900', marginTop: 5 },
  statusToggle: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20 },
  statusDot: { width: 6, height: 6, borderRadius: 3, marginRight: 8 },
  statusText: { fontSize: 8, fontWeight: '900', letterSpacing: 1 },
  revenueCard: { marginHorizontal: 25, padding: 30, backgroundColor: '#050505', borderRadius: 25, borderWidth: 1, borderColor: '#111' },
  cardLabel: { color: '#444', fontSize: 9, fontWeight: '900', letterSpacing: 2, marginBottom: 10 },
  revenueAmount: { fontSize: 36, fontWeight: '900' },
  currency: { fontSize: 14, fontWeight: '400' },
  aiBriefing: { flexDirection: 'row', alignItems: 'center', marginTop: 15, borderTopWidth: 1, borderTopColor: '#111', paddingTop: 15 },
  aiBriefText: { color: '#EEE', fontSize: 10, marginLeft: 10, fontWeight: '600' },
  actionGrid: { flexDirection: 'row', paddingHorizontal: 25, marginTop: 20, justifyContent: 'space-between' },
  actionBox: { width: '48%', backgroundColor: '#080808', padding: 25, borderRadius: 20, alignItems: 'center', borderWidth: 1, borderColor: '#111' },
  actionLabel: { color: '#AAA', fontSize: 8, fontWeight: '900', marginTop: 12, letterSpacing: 1 },
  orderSection: { marginTop: 40, paddingHorizontal: 25, paddingBottom: 100 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  sectionTitle: { color: '#333', fontSize: 10, fontWeight: '900', letterSpacing: 2 },
  orderCount: { fontSize: 10, fontWeight: 'bold' },
  orderCard: { backgroundColor: '#0A0A0A', padding: 20, borderRadius: 20, marginBottom: 15, borderWidth: 1, borderColor: '#111' },
  orderMeta: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  orderId: { color: '#444', fontSize: 10, fontWeight: '900' },
  orderTime: { color: '#D4AF37', fontSize: 10, fontWeight: 'bold' },
  orderItem: { color: '#FFF', fontSize: 16, fontWeight: 'bold', marginBottom: 15 },
  orderFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  orderPrice: { color: '#FFF', fontSize: 14, fontWeight: 'bold' },
  acceptBtn: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10 },
  acceptBtnText: { color: '#000', fontSize: 10, fontWeight: '900' }
});
