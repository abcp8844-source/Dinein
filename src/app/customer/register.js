import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import PremiumButton from '../../components/PremiumButton';
import PremiumInput from '../../components/PremiumInput';
import * as Animatable from 'react-native-animatable'; // ✨ Cinematic UI

/**
 * INTERNATIONAL CUSTOMER REGISTRY
 * Architecture: Global Sync (15 Strategic Markets)
 * Intelligence: AI-Ready Profile Indexing
 */
export default function CustomerRegister() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(null);
  
  const { register } = useAuth();
  const { colors } = useTheme();
  const router = useRouter();

  // 🌍 Global 15-Market Infrastructure (Synchronized with Owner Database)
  const globalMarkets = [
    { id: 'USA', name: 'United States', currency: 'USD', flag: '🇺🇸' },
    { id: 'CHN', name: 'China', currency: 'CNY', flag: '🇨🇳' },
    { id: 'JPN', name: 'Japan', currency: 'JPY', flag: '🇯🇵' },
    { id: 'KOR', name: 'South Korea', currency: 'KRW', flag: '🇰🇷' },
    { id: 'THA', name: 'Thailand', currency: 'THB', flag: '🇹🇭' },
    { id: 'TUR', name: 'Türkiye', currency: 'TRY', flag: '🇹🇷' }, 
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
      Alert.alert("Registry Protocol", "Please select a regional market to synchronize your profile.");
      return;
    }
    try {
      // 🤖 AI Data Mapping: Locking region, currency, and local logistics
      await register(email, password, 'customer', {
        countryName: selectedCountry.name,
        isoCode: selectedCountry.id,
        currencyCode: selectedCountry.currency,
        joinedAt: new Date().toISOString(),
        ai_preferences: { last_market: selectedCountry.id, search_history: [] }
      });
      router.replace('/customer/home');
    } catch (error) {
      Alert.alert("Network Conflict", error.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      
      <Animatable.View animation="fadeInDown" duration={1000} style={styles.header}>
        <Text style={[styles.title, { color: '#FFF' }]}>GLOBAL REGISTRY</Text>
        <Text style={styles.subtitle}>Initialize your identity across 15 premium markets.</Text>
        <View style={[styles.goldLine, { backgroundColor: colors.primary }]} />
      </Animatable.View>

      <Animatable.View animation="fadeInUp" delay={300} duration={1000}>
        <PremiumInput placeholder="Global ID (Email)" value={email} onChangeText={setEmail} keyboardType="email-address" />
        
        <Text style={[styles.label, { color: colors.primary }]}>LOGISTICS REGION SELECTION</Text>
        <View style={styles.grid}>
          {globalMarkets.map((item, index) => (
            <TouchableOpacity 
              key={item.id}
              activeOpacity={0.7}
              onPress={() => setSelectedCountry(item)}
              style={[
                styles.marketCard, 
                { 
                  borderColor: selectedCountry?.id === item.id ? colors.primary : '#111',
                  backgroundColor: selectedCountry?.id === item.id ? '#111' : '#050505'
                }
              ]}
            >
              <Text style={styles.flag}>{item.flag}</Text>
              <Text style={[styles.isoText, { color: selectedCountry?.id === item.id ? '#FFF' : '#444' }]}>{item.id}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <PremiumInput placeholder="Security Access Key" value={password} onChangeText={setPassword} secureTextEntry={true} />

        <View style={styles.actionArea}>
          <PremiumButton 
            title={selectedCountry ? `ESTABLISH PROFILE IN ${selectedCountry.name}` : "SELECT MARKET"} 
            onPress={handleRegister} 
            disabled={!selectedCountry}
          />
          <TouchableOpacity onPress={() => router.back()} style={styles.backLink}>
            <Text style={styles.backLinkText}>ALREADY REGISTERED? LOG IN</Text>
          </TouchableOpacity>
        </View>
      </Animatable.View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#000', padding: 30, justifyContent: 'center' },
  header: { marginBottom: 40, alignItems: 'center' },
  title: { fontSize: 28, fontWeight: '900', letterSpacing: 2 },
  subtitle: { color: '#666', fontSize: 10, marginTop: 10, textAlign: 'center', letterSpacing: 1, fontWeight: 'bold' },
  goldLine: { width: 40, height: 2, marginTop: 15 },
  label: { fontSize: 9, fontWeight: '900', letterSpacing: 2, marginBottom: 15, marginTop: 20 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 20 },
  marketCard: {
    width: '18%', 
    aspectRatio: 1, 
    borderRadius: 12, 
    borderWidth: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginBottom: 12 
  },
  flag: { fontSize: 20 },
  isoText: { fontSize: 8, fontWeight: '900', marginTop: 5, letterSpacing: 0.5 },
  actionArea: { marginTop: 30, width: '100%' },
  backLink: { marginTop: 20, alignItems: 'center' },
  backLinkText: { color: '#444', fontSize: 10, fontWeight: 'bold', letterSpacing: 1 }
});
