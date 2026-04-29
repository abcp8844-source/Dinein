import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native';
import { useAuth } from '../../src/context/AuthContext';
import { useTheme } from '../../src/theme/ThemeContext';
import { dbService } from '../../src/services/dbService';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';

export default function SupportScreen() {
  const { userData, user } = useAuth();
  const { colors } = useTheme();
  
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [needsAdmin, setNeedsAdmin] = useState(false);

  const processSupportRequest = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setNeedsAdmin(false);

    try {
      const isRelevant = query.length > 10; 

      if (isRelevant) {
        setResponse("Analyzing your request via Dining Engine... Please provide specific details regarding your order or account for a precise solution.");
        if (query.toLowerCase().includes('error') || query.toLowerCase().includes('fail')) {
          setNeedsAdmin(true);
        }
      } else {
        setResponse("I am unable to process this request with the current information. Would you like to escalate this to a Human Administrator?");
        setNeedsAdmin(true);
      }
    } catch (error) {
      setNeedsAdmin(true);
    } finally {
      setLoading(false);
    }
  };

  const transferToAdmin = async () => {
    setLoading(true);
    try {
      await dbService.sendSupportTicket({
        uid: user.uid,
        email: user.email,
        issue: query,
        role: userData?.role,
        timestamp: new Date().toISOString()
      });
      Alert.alert("Success", "Diagnostic data transferred to Admin Control Center.");
      setQuery('');
      setResponse('');
      setNeedsAdmin(false);
    } catch (e) {
      Alert.alert("Sync Error", "Could not connect to Admin node.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={[styles.brand, { color: colors.primary }]}>SYSTEM SUPPORT</Text>
        <Text style={[styles.subText, { color: colors.textDim }]}>AI-DRIVEN DIAGNOSTICS</Text>
      </View>

      <Animatable.View animation="fadeIn" style={[styles.aiBox, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
        <Text style={[styles.aiLabel, { color: colors.primary }]}>CORE ASSISTANT</Text>
        <Text style={[styles.aiContent, { color: colors.textMain }]}>
          {response || "Describe your issue. Our AI will analyze the request before connecting to a human agent."}
        </Text>
        
        {needsAdmin && (
          <TouchableOpacity 
            style={[styles.adminBtn, { backgroundColor: colors.primary }]} 
            onPress={transferToAdmin}
          >
            <Text style={styles.adminBtnText}>REQUEST ADMIN INTERVENTION</Text>
          </TouchableOpacity>
        )}
      </Animatable.View>

      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, { color: colors.textMain, borderColor: colors.border, backgroundColor: colors.inputBg }]}
          placeholder="Enter issue details..."
          placeholderTextColor={colors.textDim}
          value={query}
          onChangeText={setQuery}
          multiline
        />
        <TouchableOpacity 
          style={[styles.actionBtn, { backgroundColor: colors.primary }]} 
          onPress={processSupportRequest}
          disabled={loading}
        >
          {loading ? <ActivityIndicator color="#000" /> : <Ionicons name="analytics" size={20} color="#000" />}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 25 },
  header: { marginTop: 40, marginBottom: 30, alignItems: 'center' },
  brand: { fontSize: 24, fontWeight: '200', letterSpacing: 4 },
  subText: { fontSize: 8, fontWeight: '900', marginTop: 5, letterSpacing: 2 },
  aiBox: { padding: 25, borderRadius: 24, borderWidth: 1, minHeight: 160 },
  aiLabel: { fontSize: 8, fontWeight: '900', marginBottom: 15, letterSpacing: 1.5 },
  aiContent: { fontSize: 14, lineHeight: 22, fontWeight: '500' },
  inputContainer: { flexDirection: 'row', gap: 10, marginTop: 25, marginBottom: 50 },
  input: { flex: 1, borderWidth: 1, borderRadius: 18, padding: 15, minHeight: 60, fontSize: 14 },
  actionBtn: { width: 60, height: 60, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  adminBtn: { marginTop: 20, padding: 15, borderRadius: 12, alignItems: 'center' },
  adminBtnText: { color: '#000', fontWeight: '900', fontSize: 10, letterSpacing: 1 }
});
