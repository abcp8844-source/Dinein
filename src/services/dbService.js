import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, SafeAreaView } from 'react-native';
import { dbService } from '../../services/dbService';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export default function ManageOrders() {
  const { userData } = useAuth();
  const { colors } = useTheme();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    loadIncomingOrders();
  }, []);

  const loadIncomingOrders = async () => {
    // Logic to fetch orders for this specific owner
    // For now, let's assume we fetch all and filter
    const allOrders = await dbService.getCustomerOrders(userData.uid); 
    setOrders(allOrders);
  };

  const updateStatus = async (orderId, status) => {
    try {
      await dbService.updateOrderStatus(orderId, status);
      Alert.alert("Success", `Order is now ${status}`);
      loadIncomingOrders();
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  const renderOrder = ({ item }) => (
    <View style={[styles.card, { backgroundColor: '#1A1A1A', borderColor: colors.primary }]}>
      <Text style={{ color: colors.secondary, fontSize: 18, fontWeight: 'bold' }}>{item.itemName}</Text>
      <Text style={{ color: colors.textDim }}>Customer: {item.customerEmail}</Text>
      <Text style={{ color: colors.primary, marginTop: 5 }}>Status: {item.status.toUpperCase()}</Text>
      
      <View style={styles.btnRow}>
        <TouchableOpacity 
          style={[styles.actionBtn, { backgroundColor: '#28a745' }]} 
          onPress={() => updateStatus(item.id, 'preparing')}
        >
          <Text style={styles.btnText}>Accept</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionBtn, { backgroundColor: '#dc3545' }]} 
          onPress={() => updateStatus(item.id, 'cancelled')}
        >
          <Text style={styles.btnText}>Reject</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.header, { color: colors.secondary }]}>Incoming Orders</Text>
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={renderOrder}
        contentContainerStyle={{ padding: 20 }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { fontSize: 28, fontWeight: 'bold', padding: 20 },
  card: { padding: 20, borderRadius: 15, borderWidth: 1, marginBottom: 15 },
  btnRow: { flexDirection: 'row', marginTop: 15, justifyContent: 'space-between' },
  actionBtn: { paddingVertical: 10, paddingHorizontal: 25, borderRadius: 8, flex: 0.48, alignItems: 'center' },
  btnText: { color: 'white', fontWeight: 'bold' }
});
