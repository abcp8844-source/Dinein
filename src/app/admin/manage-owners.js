import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

/**
 * SUPER ADMIN CONTROL PANEL
 * Features: Regional Owner Monitoring | Help & Support Alerts
 * Security: Restricted to Admin Role Only
 */
export default function ManageOwners() {
  const { colors } = useTheme();
  
  // Logic: Extended to include Region and Support Alerts
  const [partners, setPartners] = useState([
    { id: '1', email: 'owner1@th.com', shopName: 'Thai Delight', status: 'active', region: 'Thailand', pendingHelp: true },
    { id: '2', email: 'owner2@ae.com', shopName: 'Dubai Grill', status: 'active', region: 'UAE', pendingHelp: false }
  ]);

  const togglePartnerStatus = (id, currentStatus) => {
    const nextStatus = currentStatus === 'active' ? 'suspended' : 'active';
    Alert.alert("System Control", `Proceed to ${nextStatus} this partner?`, [
      { text: "Cancel", style: "cancel" },
      { text: "Confirm", onPress: () => console.log(`${id} status updated`) }
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
          <View style={styles.alertBadge}>
            <Ionicons name="alert-circle" size={14} color="#000" />
            <Text style={styles.alertText}>HELP NEEDED</Text>
          </View>
        )}
      </View>

      <View style={styles.actionRow}>
        <TouchableOpacity 
          style={[styles.actionBtn, { backgroundColor: item.status === 'active' ? '#1a1a1a' : '#FF4444' }]}
          onPress={() => togglePartnerStatus(item.id, item.status)}
        >
          <Text style={styles.btnText}>{item.status.toUpperCase()}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.supportBtn}>
          <Text style={[styles.btnText, { color: colors.primary }]}>VIEW REQUEST</Text>
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
  card: { backgroundColor: '#050505', padding: 20, borderRadius: 22, marginBottom: 15, borderWidth: 1 },
  partnerDetails: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  shopName: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  metaText: { color: '#444', fontSize: 10, marginTop: 4, fontWeight: '600' },
  alertBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#D4AF37', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  alertText: { color: '#000', fontSize: 8, fontWeight: '900', marginLeft: 4 },
  actionRow: { flexDirection: 'row', marginTop: 20, borderTopWidth: 1, borderTopColor: '#111', paddingTop: 15 },
  actionBtn: { paddingHorizontal: 15, paddingVertical: 8, borderRadius: 8, marginRight: 10 },
  supportBtn: { paddingVertical: 8, justifyContent: 'center' },
  btnText: { fontSize: 10, fontWeight: '900', letterSpacing: 1 }
});
              style={[styles.statusBtn, { backgroundColor: item.status === 'active' ? '#dc3545' : '#28a745' }]}
            >
              <Text style={styles.btnText}>{item.status === 'active' ? 'Block' : 'Activate'}</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 25 },
  title: { fontSize: 28, fontWeight: 'bold' },
  card: { margin: 15, padding: 20, backgroundColor: '#111', borderRadius: 15, borderWidth: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  shopName: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  statusBtn: { paddingVertical: 8, paddingHorizontal: 15, borderRadius: 8 },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 12 }
});
