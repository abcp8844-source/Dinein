import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { db } from '../../services/firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';
import { useAuth } from '../../context/AuthContext';

/**
 * SHOP PROFILE SYSTEM - AI & GLOBAL SYNCED
 * Designed to outperform Grab & Line Man via Precision Data
 */
export default function ShopSetup() {
  const { userData } = useAuth();
  const [shopName, setShopName] = useState('');
  const [contact, setContact] = useState('');
  const [openingHours, setOpeningHours] = useState('');
  
  // 📍 Precision Location (Grab-Style Breakdown)
  const [city, setCity] = useState(userData?.locationData?.city || '');
  const [area, setArea] = useState(userData?.locationData?.area || '');
  const [street, setStreet] = useState(userData?.locationData?.street || '');
  const [landmark, setLandmark] = useState(userData?.locationData?.landmark || '');

  const handleSaveProfile = async () => {
    // 🛡️ Strict Validation for International Standards
    if (!shopName || !city || !area || !street || !contact) {
      Alert.alert("System Protocol", "Exact location data is required for Global Indexing.");
      return;
    }

    try {
      await setDoc(doc(db, 'shops', userData.uid), {
        name: shopName,
        contact: contact,
        hours: openingHours,
        country: userData?.countryName || 'Global Market',
        isoCode: userData?.isoCode || 'INTL',
        currency: userData?.currencyCode || 'USD',
        
        // 🤖 AI-Optimized Location Object
        locationData: {
          city,
          area,
          street,
          landmark,
          formattedAddress: `${street}, ${area}, ${city}`,
          geoSync: true // Ready for Google Maps/Gemini integration
        },
        
        updatedAt: new Date().toISOString()
      }, { merge: true });

      Alert.alert("Global Success", "Your business profile is now live across the 15-market network.");
    } catch (error) {
      Alert.alert("Sync Error", "Failed to broadcast profile to regional servers.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>EXECUTIVE SHOP SETUP</Text>
        <Text style={styles.regionStatus}>SYNCED WITH: {userData?.countryName || 'Global System'}</Text>
        <View style={styles.goldLine} />
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>BUSINESS IDENTITY</Text>
        <TextInput
          style={styles.input}
          placeholder="Official Business Name"
          placeholderTextColor="#444"
          value={shopName}
          onChangeText={setShopName}
        />

        <Text style={styles.label}>PRECISE LOGISTICS (MAP DATA)</Text>
        <View style={styles.row}>
          <TextInput
            style={[styles.input, { flex: 1, marginRight: 10 }]}
            placeholder="City"
            placeholderTextColor="#444"
            value={city}
            onChangeText={setCity}
          />
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="District / Area"
            placeholderTextColor="#444"
            value={area}
            onChangeText={setArea}
          />
        </View>

        <TextInput
          style={styles.input}
          placeholder="Street Name, Building & Door Number"
          placeholderTextColor="#444"
          value={street}
          onChangeText={setStreet}
        />

        <TextInput
          style={styles.input}
          placeholder="Landmark (e.g., Near Medical Center)"
          placeholderTextColor="#444"
          value={landmark}
          onChangeText={setLandmark}
        />

        <Text style={styles.label}>GLOBAL CONTACT & TIMING</Text>
        <TextInput
          style={styles.input}
          placeholder="International Contact Number"
          placeholderTextColor="#444"
          keyboardType="phone-pad"
          value={contact}
          onChangeText={setContact}
        />

        <TextInput
          style={styles.input}
          placeholder="Operational Hours (e.g., 24/7 or 08:00 - 22:00)"
          placeholderTextColor="#444"
          value={openingHours}
          onChangeText={setOpeningHours}
        />

        <TouchableOpacity style={styles.saveBtn} onPress={handleSaveProfile} activeOpacity={0.7}>
          <Text style={styles.btnText}>ESTABLISH GLOBAL PROFILE</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#000', padding: 30 },
  header: { marginTop: 50, marginBottom: 40, alignItems: 'center' },
  headerTitle: { color: '#D4AF37', fontSize: 24, fontWeight: '900', letterSpacing: 2 },
  regionStatus: { color: '#666', fontSize: 10, marginTop: 8, fontWeight: 'bold', letterSpacing: 1 },
  goldLine: { width: 50, height: 2, backgroundColor: '#D4AF37', marginTop: 15 },
  label: { color: '#D4AF37', fontSize: 10, fontWeight: 'bold', letterSpacing: 2, marginBottom: 12, marginTop: 10, opacity: 0.8 },
  form: { width: '100%' },
  row: { flexDirection: 'row' },
  input: {
    height: 55,
    borderBottomWidth: 1,
    borderBottomColor: '#1A1A1A',
    color: '#FFF',
    marginBottom: 20,
    fontSize: 15,
    paddingHorizontal: 5
  },
  saveBtn: {
    backgroundColor: '#D4AF37',
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginTop: 30,
    shadowColor: '#D4AF37',
    shadowOpacity: 0.2,
    shadowRadius: 10, elevation: 5
  },
  btnText: { color: '#000', fontWeight: 'bold', letterSpacing: 2, fontSize: 13 }
});
