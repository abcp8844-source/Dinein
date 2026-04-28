import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext'; // 🛡️ Using our Secure Auth
import { useTheme } from '../../context/ThemeContext';

// 🌍 The Strategic 15 Markets - Fixed to prevent conflicts
const GLOBAL_MARKETS = [
  { id: 'USA', name: 'United States', currency: 'USD', idType: 'SSN / Passport' },
  { id: 'CHN', name: 'China', currency: 'CNY', idType: 'Resident ID / Passport' },
  { id: 'GBR', name: 'United Kingdom', currency: 'GBP', idType: 'National Insurance / Passport' },
  { id: 'DEU', name: 'Germany', currency: 'EUR', idType: 'ID Card / Passport' },
  { id: 'FRA', name: 'France', currency: 'EUR', idType: 'ID Card / Passport' },
  { id: 'JPN', name: 'Japan', currency: 'JPY', idType: 'My Number Card / Passport' },
  { id: 'KOR', name: 'South Korea', currency: 'KRW', idType: 'Resident Registration / Passport' },
  { id: 'THA', name: 'Thailand', currency: 'THB', idType: 'Thai ID / Passport' },
  { id: 'SGP', name: 'Singapore', currency: 'SGD', idType: 'NRIC / Passport' },
  { id: 'MYS', name: 'Malaysia', currency: 'MYR', idType: 'MyKad / Passport' },
  { id: 'IDN', name: 'Indonesia', currency: 'IDR', idType: 'KTP / Passport' },
  { id: 'VNM', name: 'Vietnam', currency: 'VND', idType: 'Citizen ID / Passport' },
  { id: 'ARE', name: 'UAE', currency: 'AED', idType: 'Emirates ID / Passport' },
  { id: 'SAU', name: 'Saudi Arabia', currency: 'SAR', idType: 'Iqama / Passport' },
  { id: 'HKG', name: 'Hong Kong', currency: 'HKD', idType: 'HKID / Passport' },
];

export default function Register() {
  const { colors } = useTheme();
  const { register } = useAuth(); // 🛡️ Hooking into our global register engine
  const router = useRouter();
  
  const [role, setRole] = useState('customer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(GLOBAL_MARKETS[7]); // Default to Thailand

  const handleRegistration = async () => {
    if (!email || !password) {
      Alert.alert("Authentication", "Credentials are required.");
      return;
    }
    
    if (role === 'owner' && !idNumber) {
      Alert.alert("Compliance", `${selectedCountry.idType} is mandatory for Owners.`);
      return;
    }

    try {
      // 🚀 Registering with 15-Market Metadata
      await register(email, password, role, {
        countryName: selectedCountry.name,
        isoCode: selectedCountry.id,
        currencyCode: selectedCountry.currency,
        idVerification: role === 'owner' ? idNumber : 'N/A'
      });
      
      Alert.alert("Success", "Account established within the global node.");
      router.replace(role === 'owner' ? '/owner/dashboard' : '/customer/home');
    } catch (error) {
      Alert.alert("Registry Conflict", error.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.logoCircle}>
          <Text style={styles.brandText}>F&B</Text>
        </View>
        <Text style={styles.tagline}>DINING TABLE</Text>
      </View>

      <View style={styles.roleSwitch}>
        <TouchableOpacity 
          style={[styles.roleOption, role === 'customer' && styles.activeTab]}
          onPress={() => setRole('customer')}
        >
          <Text style={[styles.roleText, { color: role === 'customer' ? '#D4AF37' : '#A68D5F' }]}>CUSTOMER</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.roleOption, role === 'owner' && styles.activeTab]}
          onPress={() => setRole('owner')}
        >
          <Text style={[styles.roleText, { color: role === 'owner' ? '#D4AF37' : '#A68D5F' }]}>OWNER</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.formArea}>
        {/* --- Market Selection Dropdown Logic --- */}
        <Text style={styles.regionLabel}>TARGET MARKET:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.marketList}>
          {GLOBAL_MARKETS.map((m) => (
            <TouchableOpacity 
              key={m.id} 
              onPress={() => setSelectedCountry(m)}
              style={[styles.marketChip, selectedCountry.id === m.id && styles.activeMarket]}
            >
              <Text style={[styles.marketChipText, selectedCountry.id === m.id && {color: '#660000'}]}>{m.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <TextInput 
          style={styles.input}
          placeholder="Email Address"
          placeholderTextColor="#A68D5F"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />
        <TextInput 
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#A68D5F"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        {role === 'owner' && (
          <View>
            <Text style={styles.regionText}>IDENTITY PROOF ({selectedCountry.currency})</Text>
            <TextInput 
              style={styles.input}
              placeholder={selectedCountry.idType}
              placeholderTextColor="#A68D5F"
              value={idNumber}
              onChangeText={setIdNumber}
            />
          </View>
        )}

        <TouchableOpacity style={styles.mainBtn} onPress={handleRegistration}>
          <Text style={styles.btnText}>REGISTER IN {selectedCountry.id}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#8B0000', padding: 40, alignItems: 'center' },
  header: { alignItems: 'center', marginBottom: 30, marginTop: 40 },
  logoCircle: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#660000', borderWidth: 3, borderColor: '#D4AF37', justifyContent: 'center', alignItems: 'center' },
  brandText: { fontSize: 36, fontWeight: 'bold', color: '#D4AF37' },
  tagline: { color: '#D4AF37', letterSpacing: 4, marginTop: 10, fontSize: 10 },
  roleSwitch: { flexDirection: 'row', width: '100%', marginBottom: 20 },
  roleOption: { flex: 1, paddingVertical: 12, alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#660000' },
  activeTab: { borderBottomColor: '#D4AF37', borderBottomWidth: 2 },
  roleText: { fontSize: 11, fontWeight: 'bold' },
  formArea: { width: '100%' },
  regionLabel: { color: '#D4AF37', fontSize: 9, fontWeight: '900', marginBottom: 10 },
  marketList: { flexDirection: 'row', marginBottom: 20 },
  marketChip: { paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: '#D4AF37', marginRight: 10 },
  activeMarket: { backgroundColor: '#D4AF37' },
  marketChipText: { color: '#D4AF37', fontSize: 10, fontWeight: 'bold' },
  input: { height: 50, borderBottomWidth: 1, borderBottomColor: '#D4AF37', color: '#FFFFFF', marginBottom: 15, fontSize: 14 },
  regionText: { color: '#D4AF37', fontSize: 9, marginBottom: 5, fontWeight: 'bold' },
  mainBtn: { backgroundColor: '#D4AF37', height: 55, justifyContent: 'center', alignItems: 'center', marginTop: 20, borderRadius: 4 },
  btnText: { color: '#660000', fontWeight: 'bold', letterSpacing: 2, fontSize: 12 }
});
