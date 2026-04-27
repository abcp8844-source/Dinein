import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, SafeAreaView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { dbService } from '../../services/dbService';
import PremiumButton from '../../components/PremiumButton';

export default function ItemDetails() {
  const { id, name, price, description } = useLocalSearchParams();
  const { userData } = useAuth();
  const { colors } = useTheme();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      // Placing order in database
      const orderId = await dbService.placeOrder({
        customerId: userData.uid,
        customerEmail: userData.email,
        itemId: id,
        itemName: name,
        itemPrice: price,
        deliveryStatus: 'pending'
      });
      
      // Moving to the Premium Success/Receipt screen
      router.replace({
        pathname: '/customer/order-success',
        params: { orderId: orderId, itemName: name, amount: price }
      });

    } catch (error) {
      Alert.alert("Order Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.secondary }]}>{name}</Text>
        <Text style={[styles.price, { color: colors.primary }]}>{price} THB</Text>
        
        <View style={[styles.divider, { backgroundColor: colors.primary }]} />
        
        <Text style={[styles.descTitle, { color: colors.textMain }]}>Product Details</Text>
        <Text style={[styles.description, { color: colors.textDim }]}>{description}</Text>

        <View style={styles.footer}>
          <PremiumButton 
            title={loading ? "Processing Payment..." : "Confirm & Pay Now"} 
            onPress={handlePlaceOrder} 
            disabled={loading}
          />
          <PremiumButton 
            title="Go Back" 
            type="outline" 
            onPress={() => router.back()} 
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 30, flex: 1, justifyContent: 'center' },
  title: { fontSize: 32, fontWeight: 'bold', marginBottom: 10 },
  price: { fontSize: 24, fontWeight: '600', marginBottom: 20 },
  divider: { height: 2, width: 60, marginBottom: 25 },
  descTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  description: { fontSize: 16, lineHeight: 24, marginBottom: 40 },
  footer: { width: '100%', marginTop: 'auto' }
});
