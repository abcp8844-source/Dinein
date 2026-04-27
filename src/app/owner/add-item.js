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
      Alert.alert("Input Error", "All fields are required to continue.");
      return;
    }

    try {
      await dbService.addMenuItem(userData.uid, {
        name,
        price,
        description,
      });
      Alert.alert("Success", "Product has been added successfully.");
      router.back();
    } catch (error) {
      Alert.alert("Database Error", error.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.secondary }]}>New Product Entry</Text>
      
      <PremiumInput 
        placeholder="Product Title" 
        value={name} 
        onChangeText={setName} 
      />
      
      <PremiumInput 
        placeholder="Price Tag" 
        value={price} 
        onChangeText={setPrice} 
        keyboardType="numeric"
      />

      <PremiumInput 
        placeholder="Product Description" 
        value={description} 
        onChangeText={setDescription} 
        multiline={true}
      />

      <View style={styles.buttonContainer}>
        <PremiumButton title="Confirm & Save" onPress={handleAddItem} />
        <PremiumButton title="Go Back" type="outline" onPress={() => router.back()} />
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
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 20
  }
});
