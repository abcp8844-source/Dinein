import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import PremiumButton from '../../components/PremiumButton';
import PremiumInput from '../../components/PremiumInput';

/**
 * GLOBAL CUSTOMER REGISTRY
 * Cleaned & Synchronized for 15 Strategic Markets (Including Türkiye)
 */
export default function CustomerRegister() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(null);
  
  const { register } = useAuth();
  const { colors } = useTheme();
  const router = useRouter();

  // 🌍 Strictly 15 Markets - Vietnam replaced by Türkiye
  const globalMarkets = [
    { id: 'USA', name: 'United States', currency: 'USD', flag: '🇺🇸' },
    { id: 'CHN', name: 'China', currency: 'CNY', flag: '🇨🇳' },
    { id: 'JPN', name: 'Japan', currency: 'JPY', flag: '🇯🇵' },
    { id: 'KOR', name: 'South Korea', currency: 'KRW', flag: '🇰🇷' },
    { id: 'THA', name: 'Thailand', currency: 'THB', flag: '🇹🇭' },
    { id: 'TUR', name: 'Türkiye', currency: 'TRY', flag: '🇹🇷' }, // ✅ Added Türkiye
    { id: 'ARE', name: 'UAE', currency: 'AED', flag: '🇦🇪' },
    { id: 'SAU', name: 'Saudi Arabia', currency: 'SAR', flag: '🇸🇦' },
    { id: 'IDN', name: 'Indonesia', currency: 'IDR', flag: '🇮🇩' },
    { id: 'MYS', name: 'Malaysia', currency: 'MYR', flag: '🇲🇾' },
    { id: 'SGP', name: 'Singapore', currency: 'SGD', flag: '🇸🇬' },
    { id: 'HKG', name: 'Hong Kong', currency: 'HKD', flag: '🇭🇰' },
    { id: 'GBR', name: 'United Kingdom', currency: 'GBP', flag: '🇬🇧' },
    { id: 'DEU', name: 'Germany', currency: 'EUR', flag: '🇩🇪' },
    { id: 'FRA', name: 'France', currency: 'EUR', flag: '🇫🇷' },
  ];

  const handleRegister = async () => {
    if (!email || !password || !selectedCountry) {
      Alert.alert("System Notification", "Select your region to initialize international profile.");
      return;
    }
    try {
      // Locking user to the 15-market grid to prevent cross-region data issues
      await register(email, password, 'customer', {
        countryName: selectedCountry.name,
        isoCode: selectedCountry.id,
        currencyCode: selectedCountry.currency,
        joinedAt: new Date().toISOString()
      });
      router.replace('/customer/home');
    } catch (error) {
      Alert.alert("Registry Error", error.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.secondary }]}>Global Registry</Text>
        <Text style={styles.subtitle}>Select region for secure currency & law sync.</Text>
      </View>

      <PremiumInput placeholder="Email Address" value={email} onChangeText={setEmail} keyboardType="email-address" />
      
      <Text style={[styles.label, { color: colors.primary }]}>REGIONAL MARKET SELECTION</Text>
      <View style={styles.grid}>
        {globalMarkets.map((item) => (
          <TouchableOpacity 
            key={item.id}
            activeOpacity={0.8}
            onPress={() => setSelectedCountry(item)}
            style={[styles.marketCard, { borderColor: selectedCountry?.id === item.id ? colors.primary : '#222' }]}
          >
            <Text style={styles.flag}>{item.flag}</Text>
            <Text style={styles.isoText}>{item.id}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <PremiumInput placeholder="Access Password" value={password} onChangeText={setPassword} secureTextEntry={true} />

      <View style={styles.actionArea}>
        <PremiumButton 
          title={selectedCountry ? `Continue in ${selectedCountry.name}` : "Selection Required"} 
          onPress={handleRegister} 
          disabled={!selectedCountry}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#000', padding: 25, justifyContent: 'center' },
  header: { marginBottom: 30 },
  title: { fontSize: 34, fontWeight: '900', letterSpacing: 1 },
  subtitle: { color: '#666', fontSize: 13, marginTop: 5 },
  label: { fontSize: 10, fontWeight: 'bold', letterSpacing: 2, marginBottom: 15, marginTop: 10 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 20 },
  marketCard: {
    width: '18%', 
    aspectRatio: 1, 
    backgroundColor: '#0A0A0A', 
    borderRadius: 15, 
    borderWidth: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginBottom: 12 
  },
  flag: { fontSize: 24 },
  isoText: { color: '#444', fontSize: 9, fontWeight: 'bold', marginTop: 4 },
  actionArea: { marginTop: 20, width: '100%' }
});
