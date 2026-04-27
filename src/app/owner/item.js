import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { dbService } from '../../services/dbService';
import PremiumButton from '../../components/PremiumButton';
import PremiumInput from '../../components/PremiumInput';

export default function AddItem() {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const { userData } = useAuth();
  const { colors } = useTheme();
  const router = useRouter();

  const handleAddItem = async () => {
    if (!name || !price || !description) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    try {
      await dbService.addMenuItem(userData.uid, {
        name,
        price,
        description,
      });
      Alert.alert("Success", "Item added to your menu!");
      router.back();
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.secondary }]}>Add New Item</Text>
      
      <PremiumInput 
        placeholder="Item Name (e.g. Special Pasta)" 
        value={name} 
        onChangeText={setName} 
      />
      
      <PremiumInput 
        placeholder="Price (e.g. 25.00)" 
        value={price} 
        onChangeText={setPrice} 
      />

      <PremiumInput 
        placeholder="Short Description" 
        value={description} 
        onChangeText={setDescription} 
      />

      <View style={{ width: '100%', alignItems: 'center', marginTop: 20 }}>
        <PremiumButton title="Save to Menu" onPress={handleAddItem} />
        <PremiumButton title="Cancel" type="outline" onPress={() => router.back()} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 30,
  }
});
