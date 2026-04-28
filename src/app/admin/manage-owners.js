import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

/**
 * SUPER ADMIN PARTNER MONITOR
 * Clean Architecture: 15-Market Global Sync
 * No Urdu/Non-English characters to prevent system crashes
 */
export default function ManageOwners() {
  const { colors } = useTheme();
  const router = useRouter();
  
  // Mock Data: Syncs with Global Partner Node
  const [partners, setPartners] = useState([
    { id: '1', email: 'owner1@th.com', shopName: 'Thai Delight', status: 'active', region: 'Thailand', pendingHelp: true },
    { id: '2', email: 'owner2@ae.com', shopName: 'Dubai Grill', status: 'active', region: 'UAE', pendingHelp: false }
  ]);

  const togglePartnerStatus = (id, currentStatus) => {
    const nextAction = currentStatus === 'active' ? 'BLOCK' : 'ACTIVATE';
    Alert.alert("Partner Control", `Are you sure you want to ${nextAction} this owner?`, [
      { text: "Cancel", style: "cancel" },
      { text: "Confirm", onPress: () => console.log(`Partner ${id} status changed to ${nextAction}`) }
    ]);
  };

  const renderPartner = ({ item }) => (
    <View style={[styles.card, { borderColor: item.pendingHelp ? colors.primary : '#111' }]}>
      <View style={styles.partnerDetails}>
        <View>
          <Text style={styles.shopName}>{item.shopName}</Text>
          <Text style={styles.metaText}>{item.email} • {item.region}</Text>
        </View>
        {item.pendingHelp && (
          <View style={[styles.alertBadge, { backgroundColor: colors.primary }]}>
            <Ionicons name="alert-circle" size={12} color="#000" />
            <Text style={styles.alertText}>HELP REQUEST</Text>
          </View>
        )}
      </View>

      <View style={styles.actionRow}>
        <TouchableOpacity 
          style={[styles.statusBtn, { backgroundColor: item.status === 'active' ? '#1a1a1a' : '#dc3545' }]}
          onPress={() => togglePartnerStatus(item.id, item.status)}
        >
          <Text style={[styles.btnText, { color: item.status === 'active' ? '#FFF' : '#FFF' }]}>
            {item.status === 'active' ? 'BLOCK PARTNER' : 'ACTIVATE'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.supportBtn}
          onPress={() => router.push('/admin/support-view')}
        >
          <Text style={[styles.btnText, { color: colors.primary }]}>VIEW DETAILS</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: '#FFF' }]}>NETWORK MONITOR</Text>
        <Text style={styles.subTitle}>Supervising 15-Market Operations</Text>
      </View>

      <FlatList
        data={partners}
        keyExtractor={(item) => item.id}
        renderItem={renderPartner}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<Text style={styles.emptyText}>No partners registered in this region.</Text>}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  header: { padding: 25, paddingTop: 40 },
  title: { fontSize: 24, fontWeight: '900', letterSpacing: 2 },
  subTitle: { color: '#444', fontSize: 10, fontWeight: 'bold', marginTop: 5, letterSpacing: 1 },
  list: { paddingHorizontal: 25, paddingBottom: 100 },
  card: { backgroundColor: '#050505', padding: 20, borderRadius: 20, marginBottom: 15, borderWidth: 1 },
  partnerDetails: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  shopName: { color: '#FFF', fontSize: 16, fontWeight: 'bold', letterSpacing: 0.5 },
  metaText: { color: '#444', fontSize: 10, marginTop: 4, fontWeight: '600' },
  alertBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  alertText: { color: '#000', fontSize: 8, fontWeight: '900', marginLeft: 4 },
  actionRow: { flexDirection: 'row', marginTop: 20, borderTopWidth: 1, borderTopColor: '#111', paddingTop: 15, justifyContent: 'space-between' },
  statusBtn: { paddingHorizontal: 15, paddingVertical: 10, borderRadius: 10 },
  supportBtn: { justifyContent: 'center', paddingRight: 10 },
  btnText: { fontSize: 9, fontWeight: '900', letterSpacing: 1 },
  emptyText: { color: '#222', textAlign: 'center', marginTop: 50, fontWeight: 'bold' }
});
