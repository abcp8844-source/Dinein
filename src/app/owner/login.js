import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import PremiumButton from '../../components/PremiumButton';
import PremiumInput from '../../components/PremiumInput';

export default function OwnerLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const { colors } = useTheme();
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Authentication", "Please provide business credentials to continue.");
      return;
    }
    try {
      // 🛡️ standard login - will automatically fetch regional profile from DB
      await login(email, password);
      router.replace('/owner/dashboard');
    } catch (error) {
      Alert.alert("Access Denied", error.message);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: '#000' }]}>
      <View style={styles.headerArea}>
        <Text style={[styles.title, { color: colors.secondary }]}>Business Access</Text>
        <Text style={styles.subtitle}>Global Partner Login Protocol</Text>
      </View>
      
      <View style={styles.formArea}>
        <PremiumInput 
          placeholder="Corporate Email Address" 
          value={email} 
          onChangeText={setEmail} 
          keyboardType="email-address"
        />
        
        <PremiumInput 
          placeholder="Secure Password" 
          value={password} 
          onChangeText={setPassword} 
          secureTextEntry={true} 
        />

        <View style={styles.buttonWrapper}>
          <PremiumButton title="Authorize & Sign In" onPress={handleLogin} />
        </View>
      </View>
      
      <TouchableOpacity 
        onPress={() => router.push('/owner/register')}
        style={styles.footerLink}
      >
        <Text style={[styles.footerText, { color: '#666' }]}>
          New Partner? <Text style={{ color: colors.primary, fontWeight: 'bold' }}>Register Business</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 30, justifyContent: 'center' },
  headerArea: { marginBottom: 50, alignItems: 'center' },
  title: { fontSize: 36, fontWeight: '900', letterSpacing: 1 },
  subtitle: { color: '#444', fontSize: 12, letterSpacing: 2, marginTop: 5, fontWeight: 'bold' },
  formArea: { width: '100%' },
  buttonWrapper: { marginTop: 25 },
  footerLink: { marginTop: 35, alignItems: 'center' },
  footerText: { fontSize: 13, letterSpacing: 0.5 }
});
