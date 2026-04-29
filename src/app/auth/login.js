import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, ActivityIndicator, StatusBar, TouchableOpacity } from 'react-native';
import { useAuth } from '../../src/context/AuthContext';
import { useRouter } from 'expo-router';
import { useTheme } from '../../src/theme/ThemeContext';
import PremiumButton from '../../src/components/PremiumButton';
import PremiumInput from '../../src/components/PremiumInput';
import { Ionicons } from '@expo/vector-icons';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, loginWithGoogle } = useAuth();
  const { colors } = useTheme();
  const router = useRouter();

  const MASTER_ADMIN_EMAIL = "abcp8844@gmail.com";
  const MASTER_ADMIN_PASS = "abcp7863811";

  const handleLogin = async () => {
    const isMasterAdmin = (email.toLowerCase() === 'admin' || email === MASTER_ADMIN_EMAIL) 
                          && password === MASTER_ADMIN_PASS;

    if (isMasterAdmin) {
       router.replace('/admin/home');
       return;
    }

    if (!email || !password) {
      Alert.alert("Authentication", "Credentials required.");
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      router.replace('/(customer)/home'); 
    } catch (error) {
      Alert.alert("Access Denied", "Invalid Security Key.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await loginWithGoogle(); 
      router.replace('/(customer)/home');
    } catch (error) {
      console.log("Auth Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" />
      
      <View style={styles.headerArea}>
        <Text style={[styles.logoText, { color: colors.primary }]}>DINING TABLE</Text>
        <View style={[styles.underline, { backgroundColor: colors.primary }]} />
        <Text style={[styles.tagline, { color: colors.textDim }]}>PREMIUM GLOBAL NETWORK</Text>
      </View>

      <View style={styles.formArea}>
        <Text style={[styles.label, { color: colors.primary }]}>ACCESS ID</Text>
        <PremiumInput
          placeholder="Email or Admin ID"
          value={email}
          onChangeText={setEmail}
        />

        <Text style={[styles.label, { color: colors.primary, marginTop: 15 }]}>SECURITY KEY</Text>
        <PremiumInput
          placeholder="••••••••"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>

      <PremiumButton 
        title={loading ? "INITIALIZING..." : "INITIALIZE ACCESS"} 
        onPress={handleLogin}
      />

      <View style={styles.dividerArea}>
        <View style={[styles.line, { backgroundColor: colors.border }]} />
        <Text style={[styles.dividerText, { color: colors.textDim }]}>QUICK ACCESS</Text>
        <View style={[styles.line, { backgroundColor: colors.border }]} />
      </View>

      <TouchableOpacity 
        style={[styles.googleBtn, { borderColor: colors.primary }]} 
        onPress={handleGoogleLogin}
      >
        <Ionicons name="logo-google" size={18} color={colors.primary} />
        <Text style={[styles.googleBtnText, { color: colors.primary }]}>CONTINUE WITH GOOGLE</Text>
      </TouchableOpacity>

      <View style={styles.footerLinks}>
        <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
          <Text style={{ color: colors.textDim }}>NEW PARTNER? <Text style={{ color: colors.secondary, fontWeight: 'bold' }}>REGISTER</Text></Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 30, justifyContent: 'center' },
  headerArea: { alignItems: 'center', marginBottom: 40 },
  logoText: { fontSize: 28, fontWeight: '300', letterSpacing: 5 },
  underline: { height: 1, width: 40, marginVertical: 12 },
  tagline: { fontSize: 9, letterSpacing: 2, fontWeight: 'bold' },
  formArea: { marginBottom: 30 },
  label: { fontSize: 9, fontWeight: '900', letterSpacing: 1.5, marginBottom: 8 },
  dividerArea: { flexDirection: 'row', alignItems: 'center', marginVertical: 25 },
  line: { flex: 1, height: 1 },
  dividerText: { fontSize: 8, paddingHorizontal: 15, fontWeight: 'bold', letterSpacing: 1 },
  googleBtn: { height: 50, borderRadius: 25, borderWidth: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10 },
  googleBtnText: { fontSize: 10, fontWeight: 'bold', letterSpacing: 1 },
  footerLinks: { alignItems: 'center', marginTop: 40 }
});
