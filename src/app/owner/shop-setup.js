import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { db } from '../../services/firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';

export default function ShopSetup() {
  const [shopName, setShopName] = useState('');
  const [address, setAddress] = useState('');
  const [contact, setContact] = useState('');
  const [openingHours, setOpeningHours] = useState('');

  const handleSaveProfile = async () => {
    if (!shopName || !address || !contact) {
      Alert.alert("Required Fields", "Please complete all mandatory shop details.");
      return;
    }

    try {
      await setDoc(doc(db, 'shops', 'current_owner_id'), {
        name: shopName,
        address: address,
        contact: contact,
        hours: openingHours,
        updatedAt: new Date().toISOString()
      });
      Alert.alert("Success", "Global shop profile established successfully.");
    } catch (error) {
      Alert.alert("Error", "Failed to update shop profile.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>SHOP PROFILE SETTINGS</Text>
        <View style={styles.goldLine} />
      </View>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Official Shop Name"
          placeholderTextColor="#A68D5F"
          value={shopName}
          onChangeText={setShopName}
        />

        <TextInput
          style={styles.input}
          placeholder="Business Address / Location"
          placeholderTextColor="#A68D5F"
          value={address}
          onChangeText={setAddress}
        />

        <TextInput
          style={styles.input}
          placeholder="Global Contact Number"
          placeholderTextColor="#A68D5F"
          keyboardType="phone-pad"
          value={contact}
          onChangeText={setContact}
        />

        <TextInput
          style={styles.input}
          placeholder="Operating Hours (e.g. 09:00 - 21:00)"
          placeholderTextColor="#A68D5F"
          value={openingHours}
          onChangeText={setOpeningHours}
        />

        <TouchableOpacity style={styles.saveBtn} onPress={handleSaveProfile}>
          <Text style={styles.btnText}>SAVE GLOBAL PROFILE</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#8B0000', padding: 30 },
  header: { marginTop: 40, marginBottom: 40, alignItems: 'center' },
  headerTitle: { color: '#D4AF37', fontSize: 20, fontWeight: 'bold', letterSpacing: 3 },
  goldLine: { width: 40, height: 2, backgroundColor: '#D4AF37', marginTop: 10 },
  form: { width: '100%' },
  input: {
    height: 55,
    borderBottomWidth: 1,
    borderBottomColor: '#D4AF37',
    color: '#FFFFFF',
    marginBottom: 25,
    fontSize: 15,
    paddingHorizontal: 5
  },
  saveBtn: {
    backgroundColor: '#D4AF37',
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 3,
    marginTop: 20
  },
  btnText: { color: '#660000', fontWeight: 'bold', letterSpacing: 2, fontSize: 13 }
});
