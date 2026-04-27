import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, Alert } from 'react-native';
import { dbService } from '../../services/dbService';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import PremiumButton from '../../components/PremiumButton';

export default function OwnerPromotion() {
  const { userData } = useAuth();
  const { colors } = useTheme();
  const [myItems, setMyItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    loadMyItems();
  }, []);

  const loadMyItems = async () => {
    try {
      // Fetching only this owner's items
      const data = await dbService.getMenuItems();
      const filtered = data.filter(item => item.ownerId === userData.uid);
      setMyItems(filtered);
    } catch (error) {
      console.error(error);
    }
  };

  const handleRequestPromotion = () => {
    if (!selectedItem) {
      Alert.alert("Selection Required", "Please select an item to promote.");
      return;
    }
    
    Alert.alert(
      "Confirm Request",
      `Do you want to request a 'Featured' tag for ${selectedItem.name}? This will be reviewed by the Admin.`,
      [
        { text: "Cancel" },
        { text: "Submit", onPress: () => Alert.alert("Success", "Request sent to Admin!") }
      ]
    );
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      onPress={() => setSelectedItem(item)}
      style={[
        styles.itemCard, 
        { 
          backgroundColor: '#1A1A1A', 
          borderColor: selectedItem?.id === item.id ? colors.primary : '#333',
          borderWidth: selectedItem?.id === item.id ? 2 : 1
        }
      ]}
    >
      <Text style={{ color: colors.textMain, fontSize: 18, fontWeight: 'bold' }}>{item.name}</Text>
      <Text style={{ color: colors.textDim }}>Current Price: {item.price} THB</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.secondary }]}>Growth & Promotion</Text>
        <Text style={{ color: colors.textDim }}>Boost your visibility on the home page.</Text>
      </View>

      <FlatList
        data={myItems}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 20 }}
        ListHeaderComponent={<Text style={[styles.sectionLabel, { color: colors.primary }]}>Select an item to Feature:</Text>}
      />

      <View style={styles.footer}>
        <PremiumButton title="Request Featured Status" onPress={handleRequestPromotion} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 25 },
  title: { fontSize: 26, fontWeight: 'bold' },
  sectionLabel: { fontSize: 16, fontWeight: '600', marginBottom: 15 },
  itemCard: { padding: 20, borderRadius: 15, marginBottom: 15 },
  footer: { padding: 25, borderTopWidth: 0.5, borderTopColor: '#333' }
});
