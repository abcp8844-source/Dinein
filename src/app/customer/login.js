import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import PremiumButton from '../../components/PremiumButton';
import PremiumInput from '../../components/PremiumInput';
import * as Animatable from 'react-native-animatable'; // ✨ Cinematic Entry

/**
 * CUSTOMER AUTHENTICATION GATEWAY
 * Standardized for 15 Global Markets | AI-Ready Security
 */
export default function CustomerLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const { colors } = useTheme();
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Access Protocol", "Identification credentials are required for network entry.");
      return;
    }
    try {
      // 🚀 Global Auth Sync
      await login(email, password);
      router.replace('/customer/home');
    } catch (error) {
      Alert.alert("Registry Error", "Invalid credentials. Please verify your global account data.");
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: '#000' }]}>
      
      {/* ✨ Header Animation */}
      <Animatable.View animation="fadeInDown" duration={1000} style={styles.header}>
        <Text style={[styles.title, { color: colors.secondary }]}>NETWORK ENTRY</Text>
        <Text style={styles.subTitle}>Access the 15-Market Premium Network</Text>
        <View style={[styles.goldLine, { backgroundColor: colors.primary }]} />
      </Animatable.View>
      
      <Animatable.View animation="fadeInUp" duration={1000} style={styles.form}>
        <PremiumInput 
          placeholder="Corporate or Personal Email" 
          value={email} 
          onChangeText={setEmail} 
          keyboardType="email-address"
        />
        
        <PremiumInput 
          placeholder="Secure Access Key" 
          value={password} 
          onChangeText={setPassword} 
          secureTextEntry={true} 
        />

        <View style={styles.buttonWrapper}>
          <PremiumButton title="SIGN IN TO ECOSYSTEM" onPress={handleLogin} />
        </View>
        
        <TouchableOpacity 
          style={styles.footerAction} 
          onPress={() => router.push('/customer/register')}
        >
          <Text style={[styles.footerText, { color: '#444' }]}>
            No global profile detected? <Text style={{ color: colors.primary, fontWeight: 'bold' }}>Register Now</Text>
          </Text>
        </TouchableOpacity>
      </Animatable.View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 30 },
  header: { marginBottom: 50, alignItems: 'center' },
  title: { fontSize: 32, fontWeight: '900', letterSpacing: 2 },
  subTitle: { color: '#666', fontSize: 10, fontWeight: 'bold', letterSpacing: 1, marginTop: 5, textTransform: 'uppercase' },
  goldLine: { width: 40, height: 2, marginTop: 15 },
  form: { width: '100%' },
  buttonWrapper: { marginTop: 20 },
  footerAction: { marginTop: 30, alignItems: 'center' },
  footerText: { fontSize: 12, letterSpacing: 0.5 }
});
