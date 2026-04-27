import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import PremiumButton from '../../components/PremiumButton';
import PremiumInput from '../../components/PremiumInput';

export default function CustomerLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const { colors } = useTheme();
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }
    try {
      await login(email, password);
      router.replace('/customer/home');
    } catch (error) {
      Alert.alert("Login Failed", error.message);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.secondary }]}>Customer Login</Text>
      
      <PremiumInput 
        placeholder="Email Address" 
        value={email} 
        onChangeText={setEmail} 
      />
      
      <PremiumInput 
        placeholder="Password" 
        value={password} 
        onChangeText={setPassword} 
        secureTextEntry={true} 
      />

      <PremiumButton title="Sign In" onPress={handleLogin} />
      
      <Text 
        style={[styles.footerText, { color: colors.textDim }]}
        onPress={() => router.push('/customer/register')}
      >
        Don't have an account? <Text style={{ color: colors.primary }}>Register</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 40,
  },
  footerText: {
    marginTop: 20,
    fontSize: 14,
  }
});
