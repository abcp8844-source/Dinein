import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, SafeAreaView, RefreshControl } from 'react-native';
import { dbService } from '../../services/dbService';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export default function CustomerOrders() {
  const { userData } = useAuth();
  const { colors } = useTheme();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const data = await dbService.getCustomerOrders(userData.uid);
      setOrders(data);
    } catch (error) {
      console.error("Orders Load Error:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#FFA500'; // Orange
      case 'preparing': return colors.primary; // Gold/Main
      case 'delivered': return '#28a745'; // Green
      case 'cancelled': return '#dc3545'; // Red
      default: return colors.textDim;
    }
  };

  const renderOrder = ({ item }) => (
    <View style={[styles.orderCard, { backgroundColor: '#1A1A1A', borderColor: colors.primary }]}>
      <View style={styles.cardHeader}>
        <Text style={[styles.itemName, { color: colors.secondary }]}>{item.itemName}</Text>
        <Text style={[styles.statusBadge, { color: getStatusColor(item.status), borderColor: getStatusColor(item.status) }]}>
          {item.status.toUpperCase()}
        </Text>
      </View>

      <View style={styles.detailsRow}>
        <Text style={{ color: colors.textDim }}>Order ID: #{item.id.slice(-6).toUpperCase()}</Text>
        <Text style={[styles.price, { color: colors.textMain }]}>{item.itemPrice} THB</Text>
      </View>

      {/* Progress Bar for Modern Look */}
      <View style={styles.progressContainer}>
        <View style={[styles.progressBar, { 
          backgroundColor: getStatusColor(item.status), 
          width: item.status === 'pending' ? '33%' : item.status === 'preparing' ? '66%' : '100%' 
        }]} />
      </View>
      
      <Text style={{ color: colors.textDim, fontSize: 12, marginTop: 10 }}>
        Ordered on: {new Date(item.timestamp).toLocaleDateString()}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.secondary }]}>Order Tracking</Text>
      </View>
      
      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} style={{ flex: 1 }} />
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id}
          renderItem={renderOrder}
          contentContainerStyle={{ padding: 20 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); loadOrders(); }} tintColor={colors.primary} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={{ color: colors.textDim }}>No active orders found.</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 25, borderBottomWidth: 0.5, borderBottomColor: '#333' },
  headerTitle: { fontSize: 28, fontWeight: 'bold' },
  orderCard: {
    padding: 20,
    borderRadius: 18,
    borderWidth: 1,
    marginBottom: 20,
    elevation: 4,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  itemName: { fontSize: 20, fontWeight: 'bold' },
  statusBadge: { fontSize: 10, fontWeight: 'bold', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 5, borderWidth: 1 },
  detailsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  price: { fontSize: 18, fontWeight: '700' },
  progressContainer: { height: 4, width: '100%', backgroundColor: '#333', borderRadius: 2, marginTop: 15 },
  progressBar: { height: '100%', borderRadius: 2 },
  emptyContainer: { alignItems: 'center', marginTop: 100 }
});
