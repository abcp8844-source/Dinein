import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
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
    // --- MASTER ADMIN SHORTCUT ---
    const isMasterAdmin = (email.toLowerCase() === 'admin' || email === 'abcp8844@gmail.com') 
                          && password === 'abcp7863811';

    if (isMasterAdmin) {
       router.replace('/admin/home');
       return;
    }

    if (!email || !password) {
      Alert.alert("Required", "Please enter credentials");
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      router.replace('/(tabs)/home'); 
    } catch (error) {
      Alert.alert("Access Denied", "Invalid email or security key.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.logo, { color: colors.primary }]}>AB&CP</Text>
      <Text style={[styles.subtitle, { color: colors.textDim }]}>PREMIUM CONTROL SYSTEM</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, { color: '#fff', borderColor: '#333' }]}
          placeholder="Access ID"
          placeholderTextColor="#444"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />
        <TextInput
          style={[styles.input, { color: '#fff', borderColor: '#333' }]}
          placeholder="Security Key"
          placeholderTextColor="#444"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>

      <TouchableOpacity 
        style={[styles.loginBtn, { backgroundColor: colors.primary }]} 
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? <ActivityIndicator color="#000" /> : <Text style={styles.btnText}>OPEN SYSTEM</Text>}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/auth/register')}>
        <Text style={{ color: colors.textDim, marginTop: 25, fontSize: 11, letterSpacing: 1 }}>
          NEW PARTNER? <Text style={{ color: colors.secondary }}>REGISTER HERE</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 35 },
  logo: { fontSize: 50, fontWeight: 'bold', letterSpacing: 8 },
  subtitle: { fontSize: 10, marginBottom: 60, letterSpacing: 4, opacity: 0.6 },
  inputContainer: { width: '100%', marginBottom: 40 },
  input: { width: '100%', height: 60, borderBottomWidth: 1, marginBottom: 25, fontSize: 16, letterSpacing: 1 },
  loginBtn: { width: '100%', height: 60, borderRadius: 4, justifyContent: 'center', alignItems: 'center', marginTop: 10 },
  btnText: { color: '#000', fontWeight: 'bold', fontSize: 14, letterSpacing: 2 }
});
