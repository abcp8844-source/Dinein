import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import PremiumButton from '../../components/PremiumButton';
import * as Animatable from 'react-native-animatable'; // ✨ Success Animation

/**
 * PREMIUM ORDER SUCCESS & RECEIPT
 * System: 15-Market Global Logistics
 * Features: AI-Generated Receipt ID | Cinematic UI
 */
export default function OrderSuccess() {
  const { orderId, itemName, amount } = useLocalSearchParams();
  const { userData } = useAuth();
  const { colors } = useTheme();
  const router = useRouter();

  // 🛡️ Global Market Currency Sync
  const currency = userData?.currencyCode || 'USD';

  return (
    <SafeAreaView style={styles.container}>
      <Animatable.View animation="zoomIn" duration={800} style={styles.successCard}>
        
        {/* ✨ Glowing Success Icon */}
        <Animatable.View 
          animation="pulse" 
          iterationCount="infinite" 
          style={[styles.iconCircle, { backgroundColor: colors.primary }]}
        >
          <Text style={{ fontSize: 40, color: '#000' }}>✓</Text>
        </Animatable.View>

        <Text style={[styles.title, { color: '#FFF' }]}>ORDER SECURED</Text>
        <Text style={styles.subtitle}>Your transaction is verified on the global grid.</Text>

        {/* 📑 Premium Digital Receipt */}
        <Animatable.View 
          animation="fadeInUp" 
          delay={500} 
          style={[styles.receiptContainer, { backgroundColor: '#050505', borderColor: '#111' }]}
        >
          <View style={styles.receiptHeader}>
            <Text style={styles.receiptLabel}>DIGITAL RECEIPT</Text>
            <View style={[styles.statusDot, { backgroundColor: colors.primary }]} />
          </View>

          <View style={styles.receiptRow}>
            <Text style={styles.label}>TRANSACTION ID</Text>
            <Text style={styles.value}>#{orderId?.slice(-8).toUpperCase()}</Text>
          </View>
          
          <View style={styles.receiptRow}>
            <Text style={styles.label}>ITEM ACQUIRED</Text>
            <Text style={styles.value}>{itemName}</Text>
          </View>

          <View style={[styles.divider, { backgroundColor: '#1A1A1A' }]} />

          <View style={styles.receiptRow}>
            <Text style={[styles.totalLabel, { color: colors.secondary }]}>TOTAL SETTLED</Text>
            <View style={styles.priceStack}>
              <Text style={[styles.totalAmount, { color: colors.primary }]}>{amount}</Text>
              <Text style={styles.currencyCode}>{currency}</Text>
            </View>
          </View>
        </Animatable.View>

        <Animatable.View animation="fadeInUp" delay={800} style={styles.footer}>
          <PremiumButton 
            title="LAUNCH LOGISTICS TRACKER" 
            onPress={() => router.replace('/customer/orders')} 
          />
          <TouchableOpacity 
            onPress={() => router.replace('/customer/home')} 
            style={styles.homeLink}
          >
            <Text style={styles.homeLinkText}>RETURN TO DISCOVER</Text>
          </TouchableOpacity>
        </Animatable.View>

      </Animatable.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', justifyContent: 'center', padding: 30 },
  successCard: { alignItems: 'center' },
  iconCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 25,
    shadowColor: '#D4AF37',
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 15
  },
  title: { fontSize: 28, fontWeight: '900', letterSpacing: 2, marginBottom: 10 },
  subtitle: { fontSize: 10, color: '#444', marginBottom: 40, letterSpacing: 1, fontWeight: 'bold', textTransform: 'uppercase' },
  receiptContainer: { width: '100%', padding: 30, borderRadius: 24, borderWidth: 1, marginBottom: 40 },
  receiptHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 },
  receiptLabel: { color: '#444', fontSize: 9, fontWeight: '900', letterSpacing: 2 },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  receiptRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 18, alignItems: 'center' },
  label: { color: '#333', fontSize: 10, fontWeight: 'bold', letterSpacing: 0.5 },
  value: { color: '#EEE', fontSize: 14, fontWeight: '600' },
  divider: { height: 1, width: '100%', marginVertical: 10 },
  totalLabel: { fontSize: 11, fontWeight: '900', letterSpacing: 1 },
  priceStack: { alignItems: 'flex-end' },
  totalAmount: { fontSize: 26, fontWeight: '900' },
  currencyCode: { fontSize: 9, color: '#444', fontWeight: 'bold' },
  footer: { width: '100%' },
  homeLink: { marginTop: 20, alignItems: 'center' },
  homeLinkText: { color: '#444', fontSize: 10, fontWeight: 'bold', letterSpacing: 1.5 }
});
