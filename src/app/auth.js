import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ActivityIndicator, StatusBar } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'expo-router';
import { useTheme } from '../../context/ThemeContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { colors } = useTheme();
  const router = useRouter();

  const handleLogin = async () => {
    const isMasterAdmin = (email.toLowerCase() === 'admin' || email === 'abcp8844@gmail.com') 
                          && password === 'abcp7863811';

    if (isMasterAdmin) {
       router.replace('/admin/home');
       return;
    }

    if (!email || !password) {
      Alert.alert("Authentication", "Required fields are missing.");
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      router.replace('/(tabs)/home'); 
    } catch (error) {
      Alert.alert("Access Denied", "System could not verify these credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" />
      
      {/* Modern Minimalist Header */}
      <View style={styles.headerArea}>
        <Text style={[styles.logoText, { color: colors.primary }]}>DINING TABLE</Text>
        <View style={[styles.underline, { backgroundColor: colors.primary }]} />
        <Text style={[styles.tagline, { color: colors.textDim }]}>THE ART OF FINE DELIVERY</Text>
      </View>

      <View style={styles.formArea}>
        <View style={[styles.inputWrapper, { borderBottomColor: colors.border }]}>
          <Text style={[styles.label, { color: colors.primary }]}>ACCESS ID</Text>
          <TextInput
            style={[styles.input, { color: colors.textMain }]}
            placeholder="Enter email or admin id"
            placeholderTextColor="#444"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
          />
        </View>

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

      <TouchableOpacity 
        activeOpacity={0.8}
        style={[styles.loginBtn, { backgroundColor: colors.primary }]} 
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? <ActivityIndicator color="#000" /> : <Text style={styles.btnText}>INITIALIZE ACCESS</Text>}
      </TouchableOpacity>

      <View style={styles.footerLinks}>
        <TouchableOpacity onPress={() => router.push('/auth/register')}>
          <Text style={{ color: colors.textDim }}>NEW PARTNER? <Text style={{ color: colors.secondary }}>CREATE ACCOUNT</Text></Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={{ marginTop: 15 }}
          onPress={() => Alert.alert("Support", "Reach out to: abcp8844@gmail.com")}
        >
          <Text style={{ color: colors.primary, fontSize: 11, letterSpacing: 1 }}>SYSTEM SUPPORT</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 40, justifyContent: 'center' },
  headerArea: { alignItems: 'center', marginBottom: 60 },
  logoText: { fontSize: 38, fontWeight: '300', letterSpacing: 6 },
  underline: { height: 1, width: 40, marginTop: 10, marginBottom: 10 },
  tagline: { fontSize: 10, letterSpacing: 4, fontWeight: '500' },
  formArea: { marginBottom: 40 },
  inputWrapper: { borderBottomWidth: 1, marginBottom: 30, paddingBottom: 5 },
  label: { fontSize: 10, fontWeight: 'bold', letterSpacing: 2, marginBottom: 8 },
  input: { fontSize: 16, height: 40 },
  loginBtn: { height: 55, borderRadius: 2, justifyContent: 'center', alignItems: 'center', elevation: 10, shadowColor: '#D4AF37', shadowOpacity: 0.3, shadowRadius: 10 },
  btnText: { color: '#000', fontWeight: 'bold', fontSize: 13, letterSpacing: 2 },
  footerLinks: { alignItems: 'center', marginTop: 30 }
});
