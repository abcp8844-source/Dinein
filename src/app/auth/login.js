import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ActivityIndicator, StatusBar } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'expo-router';
import { useTheme } from '../../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons'; // For Google Icon

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, loginWithGoogle } = useAuth(); // Added Google Auth Support
  const { colors } = useTheme();
  const router = useRouter();

  // MASTER SECURITY: Using your specific credentials
  const MASTER_ADMIN_EMAIL = "abcp8844@gmail.com";
  const MASTER_ADMIN_PASS = "abcp7863811";

  const handleLogin = async () => {
    // 🛡️ Admin Verification Logic
    const isMasterAdmin = (email.toLowerCase() === 'admin' || email === MASTER_ADMIN_EMAIL) 
                          && password === MASTER_ADMIN_PASS;

    if (isMasterAdmin) {
       router.replace('/admin/home');
       return;
    }

    if (!email || !password) {
      Alert.alert("Authentication", "Credentials cannot be empty.");
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      router.replace('/(tabs)/home'); 
    } catch (error) {
      Alert.alert("Access Denied", "Check your ID or Security Key.");
    } finally {
      setLoading(false);
    }
  };

  /**
   * 🚀 CUSTOMER EASE: One-Tap Google Access
   */
  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      // Logic from AuthContext to handle Gmail login
      await loginWithGoogle(); 
      router.replace('/customer/home');
    } catch (error) {
      console.log("Google Auth Cancelled or Failed");
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
        {/* Email Input */}
        <View style={[styles.inputWrapper, { borderBottomColor: colors.border }]}>
          <Text style={[styles.label, { color: colors.primary }]}>ACCESS ID</Text>
          <TextInput
            style={[styles.input, { color: colors.textMain }]}
            placeholder="Email or Admin Username"
            placeholderTextColor="#444"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
          />
        </View>

        {/* Password Input */}
        <View style={[styles.inputWrapper, { borderBottomColor: colors.border }]}>
          <Text style={[styles.label, { color: colors.primary }]}>SECURITY KEY</Text>
          <TextInput
            style={[styles.input, { color: colors.textMain }]}
            placeholder="••••••••"
            placeholderTextColor="#444"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>
      </View>

      {/* Main Login Button */}
      <TouchableOpacity 
        activeOpacity={0.8}
        style={[styles.loginBtn, { backgroundColor: colors.primary }]} 
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? <ActivityIndicator color="#000" /> : <Text style={styles.btnText}>INITIALIZE ACCESS</Text>}
      </TouchableOpacity>

      {/* --- QUICK ACCESS FOR CUSTOMERS --- */}
      <View style={styles.dividerArea}>
        <View style={styles.line} />
        <Text style={styles.dividerText}>QUICK ACCESS</Text>
        <View style={styles.line} />
      </View>

      <TouchableOpacity 
        style={styles.googleBtn} 
        onPress={handleGoogleLogin}
        activeOpacity={0.7}
      >
        <Ionicons name="logo-google" size={18} color="#D4AF37" />
        <Text style={styles.googleBtnText}>CONTINUE WITH GOOGLE</Text>
      </TouchableOpacity>

      <View style={styles.footerLinks}>
        <TouchableOpacity onPress={() => router.push('/auth/register')}>
          <Text style={{ color: colors.textDim }}>NEW PARTNER? <Text style={{ color: colors.secondary, fontWeight: 'bold' }}>REGISTER</Text></Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={{ marginTop: 25 }}
          onPress={() => Alert.alert("Secure Node", "All credentials are encrypted via 15-Market Protocol.")}
        >
          <Text style={{ color: colors.primary, fontSize: 10, letterSpacing: 1 }}>256-BIT SECURITY ENFORCED</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 40, justifyContent: 'center' },
  headerArea: { alignItems: 'center', marginBottom: 50 },
  logoText: { fontSize: 32, fontWeight: '300', letterSpacing: 4 },
  underline: { height: 1, width: 30, marginVertical: 10 },
  tagline: { fontSize: 8, letterSpacing: 2, fontWeight: '600' },
  formArea: { marginBottom: 20 },
  inputWrapper: { borderBottomWidth: 1, marginBottom: 25, paddingBottom: 5 },
  label: { fontSize: 8, fontWeight: 'bold', letterSpacing: 1.5, marginBottom: 5 },
  input: { fontSize: 15, height: 40 },
  loginBtn: { height: 50, borderRadius: 4, justifyContent: 'center', alignItems: 'center' },
  btnText: { color: '#000', fontWeight: '900', fontSize: 11, letterSpacing: 2 },
  dividerArea: { flexDirection: 'row', alignItems: 'center', marginVertical: 30 },
  line: { flex: 1, height: 1, backgroundColor: '#222' },
  dividerText: { color: '#444', fontSize: 8, paddingHorizontal: 15, fontWeight: 'bold', letterSpacing: 1 },
  googleBtn: { height: 50, borderRadius: 4, borderWidth: 1, borderColor: '#D4AF37', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10 },
  googleBtnText: { color: '#D4AF37', fontSize: 11, fontWeight: 'bold', letterSpacing: 1 },
  footerLinks: { alignItems: 'center', marginTop: 30 }
});
