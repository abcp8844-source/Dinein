import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native';
import { useAuth } from '../../src/context/AuthContext';
import { useTheme } from '../../src/theme/ThemeContext';
import { aiService } from '../../src/services/aiService';
import { dbService } from '../../src/services/dbService';
import { Ionicons } from '@expo/vector-icons';

export default function SupportScreen() {
  const { userData, user } = useAuth();
  const { colors } = useTheme();
  
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [escalate, setEscalate] = useState(false);

  const handleSupportRequest = async () => {
    if (!query.trim()) return;
    
    setLoading(true);
    setEscalate(false);
    
    try {
      const aiResult = await aiService.generateResponse(query, userData?.role || 'Guest');
      setResponse(aiResult);

      const triggers = ['admin', 'human', 'manual', 'stuck', 'failed', 'issue'];
      if (triggers.some(word => aiResult.toLowerCase().includes(word))) {
        setEscalate(true);
      }
    } catch (error) {
      setResponse("Diagnostic node offline. Please use direct admin link.");
      setEscalate(true);
    } finally {
      setLoading(false);
    }
  };

  const notifyAdmin = async () => {
    setLoading(true);
    try {
      await dbService.sendSupportTicket({
        uid: user.uid,
        query: query,
        role: userData?.role,
        timestamp: new Date().toISOString()
      });
      Alert.alert("Status", "Admin notified via secure channel.");
      setQuery('');
      setResponse('');
      setEscalate(false);
    } catch (e) {
      Alert.alert("Error", "Transmission failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={[styles.brand, { color: colors.primary }]}>SUPPORT CENTER</Text>
        <Text style={[styles.sub, { color: colors.textDim }]}>SECURE AI INTERFACE</Text>
      </View>

      <View style={[styles.box, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
        <Text style={[styles.label, { color: colors.primary }]}>AI RESPONSE</Text>
        <Text style={[styles.text, { color: colors.textMain }]}>
          {response || "System ready for inquiry. Describe your issue for immediate analysis."}
        </Text>
        
        {escalate && (
          <TouchableOpacity style={[styles.btnAdmin, { backgroundColor: colors.primary }]} onPress={notifyAdmin}>
            <Text style={styles.btnText}>CONNECT TO ADMIN</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.inputRow}>
        <TextInput
          style={[styles.input, { color: colors.textMain, borderColor: colors.border, backgroundColor: colors.inputBg }]}
          placeholder="Issue details..."
          placeholderTextColor={colors.textDim}
          value={query}
          onChangeText={setQuery}
          multiline
        />
        <TouchableOpacity style={[styles.btnSend, { backgroundColor: colors.primary }]} onPress={handleSupportRequest} disabled={loading}>
          {loading ? <ActivityIndicator color="#000" /> : <Ionicons name="flash" size={20} color="#000" />}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { marginTop: 40, marginBottom: 25, alignItems: 'center' },
  brand: { fontSize: 22, fontWeight: 'bold', letterSpacing: 2 },
  sub: { fontSize: 8, fontWeight: '900', letterSpacing: 1, marginTop: 4 },
  box: { padding: 20, borderRadius: 20, borderWidth: 1, minHeight: 150 },
  label: { fontSize: 8, fontWeight: '900', marginBottom: 12 },
  text: { fontSize: 14, lineHeight: 22 },
  inputRow: { flexDirection: 'row', gap: 10, marginTop: 20, marginBottom: 40 },
  input: { flex: 1, borderWidth: 1, borderRadius: 15, padding: 15, minHeight: 55 },
  btnSend: { width: 55, height: 55, borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
  btnAdmin: { marginTop: 15, padding: 12, borderRadius: 10, alignItems: 'center' },
  btnText: { color: '#000', fontWeight: 'bold', fontSize: 10 }
});
