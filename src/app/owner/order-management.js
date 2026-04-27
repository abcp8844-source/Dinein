import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { db } from '../services/firebaseConfig';
import { collection, onSnapshot, updateDoc, doc } from 'firebase/firestore';

export default function OrderManagement() {
  const { colors } = useTheme();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const ordersRef = collection(db, 'orders');
    const unsubscribe = onSnapshot(ordersRef, (snapshot) => {
      const activeOrders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setOrders(activeOrders);
    });
    return () => unsubscribe();
  }, []);

  const updateOrderStatus = async (orderId, status) => {
    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, { status: status });
      Alert.alert("Order System", `Order status updated to ${status}`);
    } catch (error) {
      Alert.alert("Error", "Failed to update order status.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>ORDER MANAGEMENT</Text>
        <View style={styles.goldLine} />
      </View>

      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.orderCard}>
            <View style={styles.orderInfo}>
              <Text style={styles.orderId}>ID: {item.id.substring(0, 8)}</Text>
              <Text style={styles.itemText}>{item.itemName} x {item.quantity}</Text>
              <Text style={[styles.statusText, { color: item.status === 'Pending' ? '#D4AF37' : '#FDF5E6' }]}>
                STATUS: {item.status}
              </Text>
            </View>
            
            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={[styles.btn, { backgroundColor: '#D4AF37' }]} 
                onPress={() => updateOrderStatus(item.id, 'Confirmed')}
              >
                <Text style={styles.btnText}>ACCEPT</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.btn, { backgroundColor: '#660000', borderWidth: 1, borderColor: '#D4AF37' }]} 
                onPress={() => updateOrderStatus(item.id, 'Cancelled')}
              >
                <Text style={[styles.btnText, { color: '#D4AF37' }]}>REJECT</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>NO ACTIVE ORDERS FOUND</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 25, backgroundColor: '#8B0000' },
  header: { marginTop: 50, marginBottom: 30, alignItems: 'center' },
  headerTitle: { color: '#D4AF37', fontSize: 20, fontWeight: 'bold', letterSpacing: 4 },
  goldLine: { width: 50, height: 2, backgroundColor: '#D4AF37', marginTop: 8 },
  orderCard: { 
    backgroundColor: '#660000', 
    padding: 20, 
    borderRadius: 5, 
    marginBottom: 15, 
    borderLeftWidth: 4, 
    borderLeftColor: '#D4AF37' 
  },
  orderInfo: { marginBottom: 15 },
  orderId: { color: '#A68D5F', fontSize: 10, letterSpacing: 1, marginBottom: 5 },
  itemText: { color: '#D4AF37', fontSize: 16, fontWeight: 'bold' },
  statusText: { fontSize: 11, marginTop: 5, fontWeight: '600' },
  actionButtons: { flexDirection: 'row', gap: 10 },
  btn: { flex: 1, height: 40, justifyContent: 'center', alignItems: 'center', borderRadius: 2 },
  btnText: { color: '#660000', fontWeight: 'bold', fontSize: 11, letterSpacing: 1 },
  emptyText: { color: '#A68D5F', textAlign: 'center', marginTop: 50, fontSize: 10, letterSpacing: 2 }
});
