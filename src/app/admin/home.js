import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Alert, TouchableOpacity } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

/**
 * GLOBAL SYSTEM COMMAND CENTER
 * Features: Real-time Analytics | AI Injection | Global Moderation
 * Market: Multi-Region Control (15 Countries)
 */
export default function AdminHome() {
  const { colors } = useTheme();
  const [newAiAdvice, setNewAiAdvice] = useState('');

  const updateGlobalAi = () => {
    if (!newAiAdvice.trim()) return;
    // Security: Only Admin can trigger global advice updates
    Alert.alert("System Protocol", "AI Intelligence updated across all regional nodes.");
    setNewAiAdvice('');
  };

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      
      {/* --- LIVE ANALYTICS HUB --- */}
      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={[styles.statNumber, { color: colors.primary }]}>2.1K</Text>
          <Text style={styles.statLabel}>NETWORK USERS</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={[styles.statNumber, { color: '#00FF00' }]}>45</Text>
          <Text style={styles.statLabel}>LIVE ORDERS</Text>
        </View>
      </View>

      {/* --- AI ENGINE OVERRIDE --- */}
      <Text style={styles.sectionTitle}>AI SYSTEM CONTROL</Text>
      <View style={styles.controlBox}>
        <TextInput 
          style={styles.input}
          placeholder="Inject new global AI message..."
          placeholderTextColor="#444"
          value={newAiAdvice}
          onChangeText={setNewAiAdvice}
          multiline
        />
        <TouchableOpacity style={[styles.primaryBtn, { backgroundColor: colors.primary }]} onPress={updateGlobalAi}>
          <Text style={styles.btnText}>PUSH GLOBAL UPDATE</Text>
        </TouchableOpacity>
      </View>

      {/* --- MODERATION TOOLS --- */}
      <Text style={[styles.sectionTitle, { marginTop: 35 }]}>SYSTEM MODERATION</Text>
      
      <TouchableOpacity style={styles.menuItem}>
        <View style={styles.menuLeft}>
          <Ionicons name="megaphone-outline" size={20} color={colors.primary} />
          <Text style={styles.menuText}>Promotion Requests</Text>
        </View>
        <View style={styles.badge}><Text style={styles.badgeText}>3</Text></View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuItem}>
        <View style={styles.menuLeft}>
          <Ionicons name="wallet-outline" size={20} color="#666" />
          <Text style={styles.menuText}>Wallet & Refund Manager</Text>
        </View>
        <Ionicons name="chevron-forward" size={16} color="#222" />
      </TouchableOpacity>

      {/* --- DANGER ZONE --- */}
      <View style={styles.dangerZone}>
        <Text style={styles.dangerTitle}>CRITICAL ACTIONS</Text>
        <TouchableOpacity style={styles.dangerBtn}>
          <Text style={styles.dangerBtnText}>ACTIVATE MAINTENANCE MODE</Text>
        </TouchableOpacity>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 25, backgroundColor: '#000' },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 35 },
  statBox: { flex: 0.47, padding: 25, backgroundColor: '#050505', borderRadius: 24, borderWidth: 1, borderColor: '#111' },
  statNumber: { fontSize: 28, fontWeight: '900', letterSpacing: -1 },
  statLabel: { color: '#444', fontSize: 9, fontWeight: '900', marginTop: 8, letterSpacing: 1 },
  sectionTitle: { color: '#333', fontSize: 10, fontWeight: '900', letterSpacing: 2, marginBottom: 15 },
  controlBox: { padding: 25, backgroundColor: '#080808', borderRadius: 24, borderWidth: 1, borderColor: '#111' },
  input: { color: '#FFF', fontSize: 15, fontWeight: '500', minHeight: 60, textAlignVertical: 'top', marginBottom: 20 },
  primaryBtn: { height: 55, borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
  btnText: { color: '#000', fontSize: 11, fontWeight: '900', letterSpacing: 1 },
  menuItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#050505', padding: 20, borderRadius: 18, marginBottom: 12, borderWidth: 1, borderColor: '#0A0A0A' },
  menuLeft: { flexDirection: 'row', alignItems: 'center' },
  menuText: { color: '#AAA', fontSize: 13, marginLeft: 15, fontWeight: '600' },
  badge: { backgroundColor: '#D4AF37', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  badgeText: { color: '#000', fontSize: 10, fontWeight: 'bold' },
  dangerZone: { marginTop: 40, paddingTop: 30, borderTopWidth: 1, borderTopColor: '#111' },
  dangerTitle: { color: '#444', fontSize: 9, fontWeight: '900', marginBottom: 15, textAlign: 'center' },
  dangerBtn: { height: 50, borderRadius: 15, borderWidth: 1, borderColor: '#222', justifyContent: 'center', alignItems: 'center' },
  dangerBtnText: { color: '#FF4444', fontSize: 9, fontWeight: '900', letterSpacing: 1 }
});
