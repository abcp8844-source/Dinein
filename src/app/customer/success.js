import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTheme } from '../../context/ThemeContext';
import PremiumButton from '../../components/PremiumButton';

export default function OrderSuccess() {
  const { orderId, itemName, amount } = useLocalSearchParams();
  const { colors } = useTheme();
  const router = useRouter();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.successCard}>
        {/* Success Icon Placeholder */}
        <View style={[styles.iconCircle, { backgroundColor: colors.primary }]}>
          <Text style={{ fontSize: 40, color: '#000' }}>✓</Text>
        </View>

        <Text style={[styles.title, { color: colors.secondary }]}>Order Placed!</Text>
        <Text style={[styles.subtitle, { color: colors.textDim }]}>Your digital receipt is ready.</Text>

        <View style={[styles.receiptContainer, { backgroundColor: '#1A1A1A', borderColor: '#333' }]}>
          <View style={styles.receiptRow}>
            <Text style={{ color: colors.textDim }}>Order ID:</Text>
            <Text style={{ color: colors.textMain, fontWeight: 'bold' }}>#{orderId?.slice(-6).toUpperCase()}</Text>
          </View>
          
          <View style={styles.receiptRow}>
            <Text style={{ color: colors.textDim }}>Item:</Text>
            <Text style={{ color: colors.textMain }}>{itemName}</Text>
          </View>

          <View style={[styles.divider, { backgroundColor: '#333' }]} />

          <View style={styles.receiptRow}>
            <Text style={{ color: colors.secondary, fontWeight: 'bold' }}>Total Amount:</Text>
            <Text style={{ color: colors.primary, fontSize: 20, fontWeight: 'bold' }}>{amount} THB</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <PremiumButton 
            title="Track My Order" 
            onPress={() => router.replace('/customer/orders')} 
          />
          <PremiumButton 
            title="Back to Home" 
            type="outline" 
            onPress={() => router.replace('/customer/home')} 
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 25 },
  successCard: { alignItems: 'center' },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#D4AF37',
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 10
  },
  title: { fontSize: 30, fontWeight: 'bold', marginBottom: 10 },
  subtitle: { fontSize: 16, marginBottom: 40 },
  receiptContainer: {
    width: '100%',
    padding: 25,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 40
  },
  receiptRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15
  },
  divider: { height: 1, marginVertical: 15 },
  footer: { width: '100%' }
});
