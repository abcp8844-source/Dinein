import React from 'react';
import { View, Text, StyleSheet, FlatContainer, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '../context/ThemeContext';

export default function MenuView() {
  const { colors } = useTheme();

  const dummyMenu = [
    { id: '1', name: 'Signature Steak', price: '450 THB', desc: 'Premium wagyu with gold leaf garnish' },
    { id: '2', name: 'Royal Thai Curry', price: '280 THB', desc: 'Authentic spices with coconut cream' }
  ];

  return (
    <View style={[styles.container, { backgroundColor: '#8B0000' }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>EXQUISITE MENU</Text>
        <View style={styles.goldLine} />
      </View>

      <ScrollView style={styles.menuList}>
        {dummyMenu.map((item) => (
          <View key={item.id} style={styles.menuCard}>
            <View style={styles.cardInfo}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemDesc}>{item.desc}</Text>
            </View>
            <View style={styles.priceTag}>
              <Text style={styles.priceText}>{item.price}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.orderBtn}>
        <Text style={styles.btnText}>PROCEED TO ORDER</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 25 },
  header: { marginTop: 50, marginBottom: 30, alignItems: 'center' },
  headerTitle: { color: '#D4AF37', fontSize: 22, fontWeight: 'bold', letterSpacing: 5 },
  goldLine: { width: 40, height: 2, backgroundColor: '#D4AF37', marginTop: 8 },
  menuList: { flex: 1 },
  menuCard: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    paddingVertical: 20, 
    borderBottomWidth: 0.5, 
    borderBottomColor: 'rgba(212, 175, 55, 0.3)',
    alignItems: 'center'
  },
  cardInfo: { flex: 0.7 },
  itemName: { color: '#D4AF37', fontSize: 18, fontWeight: '600', marginBottom: 5 },
  itemDesc: { color: '#FDF5E6', fontSize: 12, opacity: 0.8 },
  priceTag: { flex: 0.3, alignItems: 'flex-end' },
  priceText: { color: '#D4AF37', fontWeight: 'bold', fontSize: 14 },
  orderBtn: { 
    backgroundColor: '#D4AF37', 
    height: 55, 
    justifyContent: 'center', 
    alignItems: 'center', 
    borderRadius: 2, 
    marginBottom: 20 
  },
  btnText: { color: '#660000', fontWeight: 'bold', letterSpacing: 2 }
});
