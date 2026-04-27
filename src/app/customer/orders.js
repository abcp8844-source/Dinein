import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, SafeAreaView } from 'react-native';
import { dbService } from '../../services/dbService';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import PremiumButton from '../../components/PremiumButton';

export default function CustomerOrders() {
  const { userData } = useAuth();
  const { colors } = useTheme();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Note: We will add getOrders to dbService in the next step
    loadOrders();
  }, []);

  const loadOrders = async () => {
    // Placeholder for now, logic coming in dbService update
    setLoading(false);
  };

  const renderOrder = ({ item }) => (
    <View style={[styles.orderCard, { backgroundColor: '#1A1A1A', borderColor: colors.primary }]}>
      <View>
        <Text style={[styles.itemName, { color: colors.secondary }]}>{item.itemName}</Text>
        <Text style={{ color: colors.textDim }}>Status: <Text style={{ color: colors.primary }}>{item.status.toUpperCase()}</Text></Text>
      </View>
      <Text style={[styles.price, { color: colors.textMain }]}>{item.itemPrice} THB</Text>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.header, { color: colors.secondary }]}>Your Orders</Text>
      
      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} />
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id}
          renderItem={renderOrder}
          contentContainerStyle={{ padding: 20 }}
          ListEmptyComponent={
            <Text style={{ color: colors.textDim, textAlign: 'center', marginTop: 50 }}>No orders found.</Text>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { fontSize: 28, fontWeight: 'bold', padding: 25, marginTop: 10 },
  orderCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    borderRadius: 15,
    borderWidth: 1,
    marginBottom: 15,
    alignItems: 'center'
  },
  itemName: { fontSize: 18, fontWeight: 'bold' },
  price: { fontSize: 16, fontWeight: '600' }
});
