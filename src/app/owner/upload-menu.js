import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../context/ThemeContext';

export default function UploadMenu() {
  const { colors } = useTheme();
  const router = useRouter();

  const [itemName, setItemName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');

  const handleUpload = () => {
    if (!itemName || !price || !category) {
      Alert.alert("Data Entry", "All mandatory fields must be completed.");
      return;
    }
    Alert.alert("Menu System", "Item has been securely added to your digital menu.");
    router.back();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>ADD MENU ITEM</Text>
        <View style={styles.divider} />
      </View>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Item Name (e.g. Pad Thai)"
          placeholderTextColor="#A68D5F"
          value={itemName}
          onChangeText={setItemName}
        />

        <TextInput
          style={styles.input}
          placeholder="Price (e.g. 150 THB)"
          placeholderTextColor="#A68D5F"
          keyboardType="numeric"
          value={price}
          onChangeText={setPrice}
        />

        <TextInput
          style={styles.input}
          placeholder="Category (e.g. Main Course)"
          placeholderTextColor="#A68D5F"
          value={category}
          onChangeText={setCategory}
        />

        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Description"
          placeholderTextColor="#A68D5F"
          multiline
          numberOfLines={4}
          value={description}
          onChangeText={setDescription}
        />

        <TouchableOpacity style={styles.uploadBtn} onPress={handleUpload}>
          <Text style={styles.btnText}>CONFIRM & PUBLISH</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#8B0000', padding: 30 },
  header: { marginTop: 40, marginBottom: 40, alignItems: 'center' },
  headerTitle: { color: '#D4AF37', fontSize: 24, fontWeight: 'bold', letterSpacing: 3 },
  divider: { width: 50, height: 2, backgroundColor: '#D4AF37', marginTop: 10 },
  form: { width: '100%' },
  input: {
    height: 55,
    borderBottomWidth: 1,
    borderBottomColor: '#D4AF37',
    color: '#FFFFFF',
    marginBottom: 25,
    fontSize: 16,
    paddingHorizontal: 5
  },
  textArea: { height: 100, textAlignVertical: 'top' },
  uploadBtn: {
    backgroundColor: '#D4AF37',
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    marginTop: 20
  },
  btnText: { color: '#660000', fontWeight: 'bold', letterSpacing: 2, fontSize: 14 }
});
