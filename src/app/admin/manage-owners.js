import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

export default function ManageOwners() {
  const { colors } = useTheme();
  
  // Mock data for now - will connect to Firebase
  const [owners, setOwners] = useState([
    { id: '1', email: 'owner1@test.com', shopName: 'Thai Delight', status: 'active' },
    { id: '2', email: 'owner2@test.com', shopName: 'Pizza Hub', status: 'pending' }
  ]);

  const handleStatusChange = (id, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'deactivated' : 'active';
    Alert.alert("DiningTable Control", `Set status to ${newStatus}?`);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: '#000' }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.secondary }]}>DiningTable Partners</Text>
        <Text style={{ color: colors.textDim }}>Manage shop access and visibility.</Text>
      </View>

      <FlatList
        data={owners}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.card, { borderColor: item.status === 'active' ? colors.primary : '#dc3545' }]}>
            <View>
              <Text style={styles.shopName}>{item.shopName}</Text>
              <Text style={{ color: '#666' }}>{item.email}</Text>
            </View>
            <TouchableOpacity 
              onPress={() => handleStatusChange(item.id, item.status)}
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
