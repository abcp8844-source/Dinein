import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';

/**
 * OWNER REVENUE & PROMOTION ENGINE
 * Features: Local Currency Earnings | Auto-Deduction for Ads | Order Ledger
 */
export default function OwnerWallet() {
  const { userData } = useAuth();
  const { colors } = useTheme();

  // Logic: Earnings from orders and promotion costs
  const [balance, setBalance] = useState(2500.00); 
  const currency = userData?.currencyCode || 'THB';

  const handlePurchasePromotion = (cost) => {
    if (balance >= cost) {
      Alert.alert(
        "Promotion Active",
        `Cost of ${cost} ${currency} will be deducted from your current order earnings.`,
        [{ text: "Confirm", onPress: () => setBalance(prev => prev - cost) }]
      );
    } else {
      Alert.alert("Insufficient Funds", "You need more sales to fund this promotion from your earnings.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        
        {/* --- REVENUE HEADER --- */}
        <Animatable.View animation="fadeInDown" style={styles.header}>
          <Text style={styles.label}>TOTAL EARNINGS ({userData?.countryName})</Text>
          <Text style={[styles.amount, {color: colors.primary}]}>
            {balance.toFixed(2)} <Text style={styles.currency}>{currency}</Text>
          </Text>
        </Animatable.View>

        {/* --- PROMOTION SECTION --- */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>GROW YOUR BUSINESS</Text>
          <TouchableOpacity 
            style={styles.promoCard} 
            onPress={() => handlePurchasePromotion(500)}
          >
            <View>
              <Text style={styles.promoTitle}>Market Wide Visibility</Text>
              <Text style={styles.promoDesc}>Push your store to top results for 24h</Text>
            </View>
            <Text style={[styles.promoPrice, {color: colors.primary}]}>-500 {currency}</Text>
          </TouchableOpacity>
        </View>

        {/* --- TRANSACTION LEDGER --- */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>RECENT ORDER SETTLEMENTS</Text>
          <View style={styles.ledgerCard}>
            <View style={styles.ledgerRow}>
              <Text style={styles.orderId}>Order #9921</Text>
              <Text style={styles.credit}>+150.00 {currency}</Text>
            </View>
            <View style={styles.ledgerRow}>
              <Text style={styles.orderId}>Order #9918</Text>
              <Text style={styles.credit}>+320.00 {currency}</Text>
            </View>
            <View style={styles.ledgerRow}>
              <Text style={styles.orderId}>Promo Deduction</Text>
              <Text style={styles.debit}>-200.00 {currency}</Text>
            </View>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  header: { padding: 40, alignItems: 'center', backgroundColor: '#050505', borderBottomWidth: 1, borderBottomColor: '#111' },
  label: { color: '#444', fontSize: 10, fontWeight: '900', letterSpacing: 2 },
  amount: { fontSize: 36, fontWeight: '900', marginTop: 10 },
  currency: { fontSize: 16, fontWeight: '400' },
  section: { marginTop: 30, paddingHorizontal: 25 },
  sectionTitle: { color: '#333', fontSize: 10, fontWeight: '900', letterSpacing: 2, marginBottom: 15 },
  promoCard: { backgroundColor: '#0A0A0A', padding: 20, borderRadius: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: '#111' },
  promoTitle: { color: '#FFF', fontSize: 14, fontWeight: 'bold' },
  promoDesc: { color: '#444', fontSize: 10, marginTop: 4 },
  promoPrice: { fontSize: 12, fontWeight: 'bold' },
  ledgerCard: { backgroundColor: '#050505', borderRadius: 20, padding: 20, borderWidth: 1, borderColor: '#0A0A0A' },
  ledgerRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#111' },
  orderId: { color: '#AAA', fontSize: 12, fontWeight: '600' },
  credit: { color: '#00FF00', fontSize: 12, fontWeight: 'bold' },
  debit: { color: '#FF4444', fontSize: 12, fontWeight: 'bold' }
});
