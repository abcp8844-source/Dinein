import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, SafeAreaView } from 'react-native';
import { dbService } from '../../services/dbService';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

/**
 * SMART ORDER MANAGEMENT SYSTEM
 * Built for 15 Global Markets | AI-Ready Structure
 */
export default function ManageOrders() {
  const { userData } = useAuth();
  const { colors } = useTheme();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    loadIncomingOrders();
  }, []);

  const loadIncomingOrders = async () => {
    try {
      // 🛡️ Anchoring: Fetching orders specific to the owner's regional ISO code
      const allOrders = await dbService.getOwnerOrders(userData.uid); 
      setOrders(allOrders);
    } catch (error) {
      console.log("Order Fetch Error:", error.message);
    }
  };

  const updateStatus = async (orderId, status) => {
    try {
      await dbService.updateOrderStatus(orderId, status);
      Alert.alert("System Notification", `Order status synchronized to: ${status.toUpperCase()}`);
      loadIncomingOrders();
    } catch (error) {
      Alert.alert("Process Failed", error.message);
    }
  };

  const renderOrder = ({ item }) => (
    <View style={[styles.card, { backgroundColor: '#0A0A0A', borderColor: colors.primary }]}>
      <View style={styles.cardHeader}>
        <Text style={[styles.itemTitle, { color: colors.secondary }]}>{item.itemName}</Text>
        <Text style={styles.priceTag}>{item.price} {item.currency || 'USD'}</Text>
      </View>

      {/* 📍 PRECISION DELIVERY DATA (The "Door-to-Door" Logic) */}
      <View style={styles.addressBox}>
        <Text style={styles.addressLabel}>DELIVERY TO:</Text>
        <Text style={styles.addressText}>
          📍 {item.customerLocation?.street || 'N/A'}, {item.customerLocation?.area || 'N/A'}
        </Text>
        <Text style={styles.cityText}>{item.customerLocation?.city}, {item.customerLocation?.country}</Text>
      </View>
      
      <View style={styles.statusRow}>
        <Text style={{ color: '#666', fontSize: 12 }}>Current Phase:</Text>
        <Text style={[styles.statusText, { color: colors.primary }]}>{item.status.toUpperCase()}</Text>
      </View>
      
      <View style={styles.btnRow}>
        <TouchableOpacity 
          activeOpacity={0.8}
          style={[styles.actionBtn, { backgroundColor: '#111', borderColor: '#28a745', borderWidth: 1 }]} 
          onPress={() => updateStatus(item.id, 'preparing')}
        >
          <Text style={[styles.btnText, { color: '#28a745' }]}>ACCEPT</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          activeOpacity={0.8}
          style={[styles.actionBtn, { backgroundColor: '#111', borderColor: '#dc3545', borderWidth: 1 }]} 
          onPress={() => updateStatus(item.id, 'cancelled')}
        >
          <Text style={[styles.btnText, { color: '#dc3545' }]}>REJECT</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: '#000' }]}>
      <View style={styles.topHeader}>
        <Text style={[styles.headerText, { color: colors.secondary }]}>Incoming Orders</Text>
        <Text style={styles.marketTag}>Monitoring: {userData?.countryName || 'Global'}</Text>
      </View>
      
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={renderOrder}
        contentContainerStyle={{ padding: 20 }}
        ListEmptyComponent={<Text style={styles.emptyText}>No active orders in this region.</Text>}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topHeader: { padding: 25, paddingTop: 40 },
  headerText: { fontSize: 32, fontWeight: '900', letterSpacing: 1 },
  marketTag: { color: '#444', fontSize: 10, fontWeight: 'bold', letterSpacing: 2, marginTop: 5 },
  card: { padding: 20, borderRadius: 20, borderWidth: 1, marginBottom: 20, shadowColor: '#000', shadowOpacity: 0.5, elevation: 10 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  itemTitle: { fontSize: 20, fontWeight: 'bold', letterSpacing: 0.5 },
  priceTag: { color: '#FFF', fontSize: 14, fontWeight: 'bold' },
  addressBox: { backgroundColor: '#111', padding: 12, borderRadius: 10, marginBottom: 15 },
  addressLabel: { color: '#444', fontSize: 8, fontWeight: 'bold', letterSpacing: 1, marginBottom: 4 },
  addressText: { color: '#CCC', fontSize: 13, fontWeight: '600' },
  cityText: { color: '#666', fontSize: 11, marginTop: 2 },
  statusRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  statusText: { fontWeight: '900', fontSize: 12, letterSpacing: 1 },
  btnRow: { flexDirection: 'row', justifyContent: 'space-between' },
  actionBtn: { paddingVertical: 12, borderRadius: 12, flex: 0.47, alignItems: 'center' },
  btnText: { fontSize: 12, fontWeight: 'bold', letterSpacing: 1 },
  emptyText: { color: '#333', textAlign: 'center', marginTop: 50, letterSpacing: 1 }
});
