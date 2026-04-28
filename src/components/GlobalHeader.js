import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';

// 🛡️ 15 STRATEGIC MARKETS DATA (No Data Missing)
const MARKETS = [
  { id: 'THA', name: 'Thailand', flag: '🇹🇭', lang: 'Thai/EN' },
  { id: 'ARE', name: 'UAE', flag: '🇦🇪', lang: 'Arabic/EN' },
  { id: 'USA', name: 'USA', flag: '🇺🇸', lang: 'English' },
  { id: 'GBR', name: 'UK', flag: '🇬🇧', lang: 'English' },
  { id: 'CHN', name: 'China', flag: '🇨🇳', lang: 'Chinese/EN' },
  { id: 'JPN', name: 'Japan', flag: '🇯🇵', lang: 'Japanese/EN' },
  { id: 'KOR', name: 'S.Korea', flag: '🇰🇷', lang: 'Korean/EN' },
  { id: 'SGP', name: 'Singapore', flag: '🇸🇬', lang: 'English' },
  { id: 'MYS', name: 'Malaysia', flag: '🇲🇾', lang: 'Malay/EN' },
  { id: 'IDN', name: 'Indonesia', flag: '🇮🇩', lang: 'Indo/EN' },
  { id: 'VNM', name: 'Vietnam', flag: '🇻🇳', lang: 'Viet/EN' },
  { id: 'SAU', name: 'Saudi Arabia', flag: '🇸🇦', lang: 'Arabic/EN' },
  { id: 'HKG', name: 'Hong Kong', flag: '🇭🇰', lang: 'Cantonese/EN' },
  { id: 'DEU', name: 'Germany', flag: '🇩🇪', lang: 'German/EN' },
  { id: 'FRA', name: 'France', flag: '🇫🇷', lang: 'French/EN' },
];

export default function GlobalHeader() {
  const [selectedMarket, setSelectedMarket] = useState(MARKETS[0]); // Default Thailand
  const [currentLang, setCurrentLang] = useState('EN');

  return (
    <View style={styles.container}>
      {/* --- Top Row: Profile & Language --- */}
      <View style={styles.topRow}>
        <View style={styles.profileArea}>
          <View style={styles.avatar} />
          <Text style={styles.welcomeText}>Welcome, Partner</Text>
        </View>

        <TouchableOpacity 
          style={styles.langSelector}
          onPress={() => setCurrentLang(currentLang === 'EN' ? 'UR' : 'EN')}
        >
          <Text style={styles.langLabel}>LANGUAGE:</Text>
          <Text style={styles.langActive}>{currentLang === 'EN' ? 'ENGLISH' : 'اردو'}</Text>
        </TouchableOpacity>
      </View>

      {/* --- Middle Row: Market Flags (The 15 Nodes) --- */}
      <View style={styles.marketBar}>
        <Text style={styles.marketTitle}>SELECT OPERATIONAL MARKET:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.flagScroll}>
          {MARKETS.map((item) => (
            <TouchableOpacity 
              key={item.id} 
              style={[styles.flagBtn, selectedMarket.id === item.id && styles.activeFlagBtn]}
              onPress={() => setSelectedMarket(item)}
            >
              <Text style={styles.flagIcon}>{item.flag}</Text>
              <Text style={[styles.flagText, selectedMarket.id === item.id && styles.activeFlagText]}>
                {item.id}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* --- Bottom Status: Current Node Sync --- */}
      <View style={styles.statusNode}>
        <Text style={styles.nodeText}>
          CONNECTED TO: <Text style={styles.nodeHighlight}>{selectedMarket.name.toUpperCase()} NODE</Text>
        </Text>
        <Text style={styles.nodeText}>
          SYSTEM LANG: <Text style={styles.nodeHighlight}>{currentLang}</Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: '#000', paddingTop: 10, borderBottomWidth: 1, borderBottomColor: '#1A1A1A' },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 15 },
  profileArea: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 35, height: 35, borderRadius: 18, backgroundColor: '#D4AF37', borderWidth: 1, borderColor: '#333' },
  welcomeText: { color: '#FFF', fontSize: 12, fontWeight: 'bold', marginLeft: 10 },
  langSelector: { alignItems: 'flex-end' },
  langLabel: { color: '#444', fontSize: 7, fontWeight: '900', letterSpacing: 1 },
  langActive: { color: '#D4AF37', fontSize: 10, fontWeight: 'bold' },
  marketBar: { paddingLeft: 20, marginBottom: 15 },
  marketTitle: { color: '#333', fontSize: 8, fontWeight: '900', marginBottom: 8, letterSpacing: 1 },
  flagScroll: { flexDirection: 'row' },
  flagBtn: { alignItems: 'center', marginRight: 15, paddingBottom: 5, borderBottomWidth: 2, borderBottomColor: 'transparent' },
  activeFlagBtn: { borderBottomColor: '#D4AF37' },
  flagIcon: { fontSize: 22, marginBottom: 2 },
  flagText: { color: '#444', fontSize: 8, fontWeight: 'bold' },
  activeFlagText: { color: '#D4AF37' },
  statusNode: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    backgroundColor: '#050505', 
    paddingHorizontal: 20, 
    paddingVertical: 6,
    borderTopWidth: 1,
    borderTopColor: '#111'
  },
  nodeText: { color: '#222', fontSize: 7, fontWeight: '900' },
  nodeHighlight: { color: '#D4AF37' }
});
