import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import PremiumButton from '../../components/PremiumButton';
import PremiumInput from '../../components/PremiumInput';

// 🛡️ GLOBAL ANCHOR: The Strategic 15 Markets (Final List - No Conflicts)
const GLOBAL_MARKETS = [
  { id: 'USA', name: 'United States', currency: 'USD' },
  { id: 'CHN', name: 'China', currency: 'CNY' },
  { id: 'GBR', name: 'United Kingdom', currency: 'GBP' },
  { id: 'DEU', name: 'Germany', currency: 'EUR' },
  { id: 'FRA', name: 'France', currency: 'EUR' },
  { id: 'JPN', name: 'Japan', currency: 'JPY' },
  { id: 'KOR', name: 'South Korea', currency: 'KRW' },
  { id: 'THA', name: 'Thailand', currency: 'THB' },
  { id: 'SGP', name: 'Singapore', currency: 'SGD' },
  { id: 'MYS', name: 'Malaysia', currency: 'MYR' },
  { id: 'IDN', name: 'Indonesia', currency: 'IDR' },
  { id: 'VNM', name: 'Vietnam', currency: 'VND' },
  { id: 'ARE', name: 'UAE', currency: 'AED' },
  { id: 'SAU', name: 'Saudi Arabia', currency: 'SAR' },
  { id: 'HKG', name: 'Hong Kong', currency: 'HKD' },
];

export default function OwnerRegister() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [businessName, setBusinessName] = useState('');
  
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [city, setCity] = useState('');
  const [area, setArea] = useState('');
  const [street, setStreet] = useState('');
  const [landmark, setLandmark] = useState('');

  const { register } = useAuth();
  const { colors } = useTheme();
  const router = useRouter();

  const handleRegister = async () => {
    if (!email || !password || !businessName || !selectedCountry || !city || !area || !street) {
      Alert.alert("Registry Protocol", "Please complete all fields. Precision location is mandatory.");
      return;
    }
    
    try {
      // 🚀 Injecting precise market & currency data to prevent conflicts
      await register(email, password, 'owner', {
        businessName,
        countryName: selectedCountry.name,
        isoCode: selectedCountry.id,
        currencyCode: selectedCountry.currency,
        locationData: {
          city,
          area,
          street,
          landmark,
          registeredAt: new Date().toISOString()
        }
      });
      router.replace('/owner/dashboard');
    } catch (error) {
      Alert.alert("Registry Conflict", error.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.secondary }]}>Global Partner Entry</Text>
        <Text style={styles.subtitle}>Register business across 15 strategic markets.</Text>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.label}>BUSINESS IDENTITY</Text>
        <PremiumInput placeholder="Legal Business Name" value={businessName} onChangeText={setBusinessName} />
        <PremiumInput placeholder="Corporate Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
        <PremiumInput placeholder="Access Password" value={password} onChangeText={setPassword} secureTextEntry={true} />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>MARKET SELECTION (CURRENCY LOCK)</Text>
        <View style={styles.countryGrid}>
          {GLOBAL_MARKETS.map((c) => (
            <TouchableOpacity 
              key={c.id} 
              onPress={() => setSelectedCountry(c)}
              style={[
                styles.countryChip, 
                { borderColor: selectedCountry?.id === c.id ? colors.primary : '#222',
                  backgroundColor: selectedCountry?.id === c.id ? '#111' : '#050505' }
              ]}
            >
              <Text style={{ color: selectedCountry?.id === c.id ? colors.primary : '#666', fontSize: 10, fontWeight: 'bold' }}>
                {c.name} ({c.currency})
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.label, { color: colors.primary }]}>PRECISE STORE LOCATION</Text>
        <View style={styles.row}>
          <View style={{ flex: 1, marginRight: 10 }}>
            <PremiumInput placeholder="City" value={city} onChangeText={setCity} />
          </View>
          <View style={{ flex: 1 }}>
            <PremiumInput placeholder="Area / District" value={area} onChangeText={setArea} />
          </View>
        </View>
        <PremiumInput placeholder="Street Name & Building No." value={street} onChangeText={setStreet} />
        <PremiumInput placeholder="Landmark (e.g. Near Grand Mall)" value={landmark} onChangeText={setLandmark} />
      </View>

      <View style={styles.footer}>
        <PremiumButton title="Finalize Registration" onPress={handleRegister} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#000', padding: 25 },
  header: { marginTop: 50, marginBottom: 30 },
  title: { fontSize: 32, fontWeight: '900', letterSpacing: 1 },
  subtitle: { color: '#444', fontSize: 13, marginTop: 5, fontWeight: 'bold' },
  section: { marginBottom: 30 },
  label: { fontSize: 10, fontWeight: 'bold', letterSpacing: 2, color: '#444', marginBottom: 15 },
  countryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  countryChip: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8, borderWidth: 1 },
  row: { flexDirection: 'row' },
  footer: { paddingBottom: 50 }
});
