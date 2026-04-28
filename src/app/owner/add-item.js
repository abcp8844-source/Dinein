import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { dbService } from '../../services/dbService';
import PremiumButton from '../../components/PremiumButton';
import PremiumInput from '../../components/PremiumInput';

/**
 * OWNER PRODUCT ENTRY SYSTEM
 * Restricted to the 15 Strategic Global Markets
 */
export default function AddItem() {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  
  const { userData } = useAuth();
  const { colors } = useTheme();
  const router = useRouter();

  // 🛡️ Global Anchor: Automatically fetching owner's registered region and currency
  const currency = userData?.currencyCode || 'USD';
  const country = userData?.countryName || 'Global Market';

  const handleAddItem = async () => {
    if (!name || !price || !description) {
      Alert.alert("System Notification", "All fields are mandatory for international listings.");
      return;
    }

    try {
      // Logic: Attaching the product to the owner's regional identity
      await dbService.addMenuItem(userData.uid, {
        name,
        price: parseFloat(price),
        description,
        currency: currency, // Price is locked to owner's registered currency
        region: userData?.isoCode,
        createdAt: new Date().toISOString()
      });
      
      Alert.alert("Registry Success", `Product successfully listed in ${country} market.`);
      router.back();
    } catch (error) {
      Alert.alert("Database Conflict", error.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: '#000' }]} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.secondary }]}>Inventory Entry</Text>
        <Text style={styles.regionTag}>Listing for: {country} ({currency})</Text>
      </View>
      
      <PremiumInput 
        placeholder="Product Title (e.g. Signature Dish)" 
        value={name} 
        onChangeText={setName} 
      />
      
      <PremiumInput 
        placeholder={`Price in ${currency}`} 
        value={price} 
        onChangeText={setPrice} 
        keyboardType="decimal-pad"
      />

      <PremiumInput 
        placeholder="Product Specifications / Description" 
        value={description} 
        onChangeText={setDescription} 
        multiline={true}
        numberOfLines={4}
      />

      <View style={styles.buttonContainer}>
        <PremiumButton title="Publish to Market" onPress={handleAddItem} />
        <View style={{ height: 12 }} />
        <PremiumButton title="Cancel Entry" type="outline" onPress={() => router.back()} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 25, justifyContent: 'center' },
  header: { marginBottom: 35, width: '100%' },
  title: { fontSize: 30, fontWeight: '900', letterSpacing: 1 },
  regionTag: { color: '#666', fontSize: 12, marginTop: 5, fontWeight: 'bold', letterSpacing: 1 },
  buttonContainer: { width: '100%', marginTop: 30 }
});
