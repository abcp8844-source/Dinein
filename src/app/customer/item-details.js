import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { dbService } from '../../services/dbService';
import PremiumButton from '../../components/PremiumButton';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';

/**
 * PREMIUM ITEM VIEW & DUAL-MODE ORDERING SYSTEM
 * Market Sync: 15 Global Regions | Delivery & Dine-in Logic
 */
export default function ItemDetails() {
  const { id, name, price, description } = useLocalSearchParams();
  const { userData } = useAuth();
  const { colors } = useTheme();
  const router = useRouter();
  
  const [loading, setLoading] = useState(false);
  const [orderMode, setOrderMode] = useState('delivery'); // 'delivery' or 'dine_in'

  const currency = userData?.currencyCode || 'USD';

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      const orderId = await dbService.placeOrder({
        customerId: userData.uid,
        customerEmail: userData.email,
        itemId: id,
        itemName: name,
        itemPrice: price,
        currency: currency,
        region: userData?.isoCode || 'Global',
        orderMode: orderMode, // Crucial: Informs owner if it's Delivery or Dine-in
        deliveryStatus: 'pending',
        timestamp: new Date().toISOString(),
        ai_tag: "Direct Order"
      });
      
      router.replace({
        pathname: '/customer/order-success',
        params: { orderId: orderId, itemName: name, amount: price, mode: orderMode }
      });

    } catch (error) {
      Alert.alert("Registry Conflict", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <Animatable.View animation="fadeInDown" style={styles.header}>
          <Text style={[styles.title, { color: '#FFF' }]}>{name}</Text>
          <View style={styles.priceContainer}>
            <Text style={[styles.price, { color: colors.primary }]}>{price}</Text>
            <Text style={styles.currencyLabel}>{currency}</Text>
          </View>
        </Animatable.View>
        
        {/* --- SERVICE MODE SELECTOR (New Logic) --- */}
        <Animatable.View animation="fadeInUp" delay={300} style={styles.selectorContainer}>
          <Text style={styles.sectionLabel}>SELECT SERVICE MODE</Text>
          <View style={styles.modeRow}>
            <TouchableOpacity 
              onPress={() => setOrderMode('delivery')}
              style={[styles.modeBtn, orderMode === 'delivery' && { borderColor: colors.primary, backgroundColor: '#0A0A0A' }]}
            >
              <Ionicons name="bicycle" size={20} color={orderMode === 'delivery' ? colors.primary : '#444'} />
              <Text style={[styles.modeText, { color: orderMode === 'delivery' ? '#FFF' : '#444' }]}>DELIVERY</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => setOrderMode('dine_in')}
              style={[styles.modeBtn, orderMode === 'dine_in' && { borderColor: colors.primary, backgroundColor: '#0A0A0A' }]}
            >
              <Ionicons name="restaurant" size={20} color={orderMode === 'dine_in' ? colors.primary : '#444'} />
              <Text style={[styles.modeText, { color: orderMode === 'dine_in' ? '#FFF' : '#444' }]}>DINE-IN</Text>
            </TouchableOpacity>
          </View>
        </Animatable.View>

        <Animatable.View animation="fadeIn" delay={600} style={styles.detailsBox}>
          <Text style={[styles.descTitle, { color: colors.primary }]}>CHEF'S DESCRIPTION</Text>
          <Text style={[styles.description, { color: '#AAA' }]}>{description}</Text>
        </Animatable.View>

        <Animatable.View animation="fadeInUp" delay={800} style={styles.aiTrustBox}>
          <Text style={styles.aiTrustText}>
            🛡️ AI-Verified: Optimized for {userData?.countryName || 'Local'} Logistics Network.
          </Text>
        </Animatable.View>

        <View style={styles.footer}>
          <PremiumButton 
            title={loading ? "SYNCING..." : "CONFIRM ORDER"} 
            onPress={handlePlaceOrder} 
            disabled={loading}
          />
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.cancelText}>CANCEL & RETURN</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  scrollContent: { padding: 30, flexGrow: 1 },
  header: { marginTop: 20 },
  title: { fontSize: 32, fontWeight: '900', letterSpacing: 1 },
  priceContainer: { flexDirection: 'row', alignItems: 'baseline', marginTop: 5 },
  price: { fontSize: 24, fontWeight: 'bold' },
  currencyLabel: { fontSize: 10, color: '#444', marginLeft: 5, fontWeight: 'bold' },
  selectorContainer: { marginTop: 30 },
  sectionLabel: { color: '#333', fontSize: 9, fontWeight: '900', letterSpacing: 2, marginBottom: 15 },
  modeRow: { flexDirection: 'row', justifyContent: 'space-between' },
  modeBtn: { flex: 0.48, height: 60, borderRadius: 15, borderWidth: 1, borderColor: '#111', justifyContent: 'center', alignItems: 'center', flexDirection: 'row' },
  modeText: { fontSize: 10, fontWeight: '900', marginLeft: 10, letterSpacing: 1 },
  detailsBox: { marginTop: 40 },
  descTitle: { fontSize: 9, fontWeight: 'bold', letterSpacing: 2, marginBottom: 10 },
  description: { fontSize: 15, lineHeight: 24 },
  aiTrustBox: { marginTop: 30, padding: 15, backgroundColor: '#050505', borderRadius: 12, borderWidth: 1, borderColor: '#111' },
  aiTrustText: { color: '#444', fontSize: 10, textAlign: 'center' },
  footer: { marginTop: 'auto', paddingTop: 30 },
  backBtn: { marginTop: 20, alignItems: 'center' },
  cancelText: { color: '#222', fontSize: 10, fontWeight: 'bold', letterSpacing: 1 }
});
