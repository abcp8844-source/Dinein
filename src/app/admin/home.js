import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Alert } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import PremiumButton from '../../components/PremiumButton';

export default function AdminHome() {
  const { colors } = useTheme();
  const [newAiAdvice, setNewAiAdvice] = useState('');

  const updateGlobalAi = () => {
    if (!newAiAdvice) return;
    // This will later be connected to a 'globalSettings' collection in Firebase
    Alert.alert("Admin Power", "AI Smart Advice has been updated for all users!");
    setNewAiAdvice('');
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: '#000' }]}>
      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={{ color: colors.primary, fontSize: 24, fontWeight: 'bold' }}>2.1K</Text>
          <Text style={{ color: colors.textDim, fontSize: 10 }}>TOTAL USERS</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={{ color: '#28a745', fontSize: 24, fontWeight: 'bold' }}>45</Text>
          <Text style={{ color: colors.textDim, fontSize: 10 }}>ACTIVE ORDERS</Text>
        </View>
      </View>

      <Text style={[styles.sectionTitle, { color: colors.secondary }]}>AI SYSTEM CONTROL</Text>
      <View style={styles.controlBox}>
        <TextInput 
          style={[styles.input, { color: '#fff', borderColor: colors.primary }]}
          placeholder="Type new AI Smart Message..."
          placeholderTextColor="#666"
          value={newAiAdvice}
          onChangeText={setNewAiAdvice}
        />
        <PremiumButton title="Push Update to All Users" onPress={updateGlobalAi} />
      </View>

      <Text style={[styles.sectionTitle, { color: colors.secondary, marginTop: 30 }]}>SYSTEM MODERATION</Text>
      
      <PremiumButton 
        title="Approve Promotion Requests" 
        onPress={() => {}} 
      />
      
      <PremiumButton 
        title="Wallet & Refund Manager" 
        type="outline"
        onPress={() => {}} 
      />

      <View style={styles.dangerZone}>
        <Text style={{ color: '#dc3545', fontWeight: 'bold', marginBottom: 10 }}>DANGER ZONE</Text>
        <PremiumButton title="System Maintenance Mode" type="outline" onPress={() => {}} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30 },
  statBox: { flex: 0.48, padding: 20, backgroundColor: '#1A1A1A', borderRadius: 15, alignItems: 'center', borderLeftWidth: 3, borderLeftColor: '#D4AF37' },
  sectionTitle: { fontSize: 14, fontWeight: 'bold', letterSpacing: 2, marginBottom: 15 },
  controlBox: { padding: 20, backgroundColor: '#111', borderRadius: 15, borderWidth: 1, borderColor: '#333' },
  input: { borderBottomWidth: 1, paddingVertical: 10, marginBottom: 20, fontSize: 16 },
  dangerZone: { marginTop: 'auto', padding: 20, borderTopWidth: 1, borderTopColor: '#333' }
});
