import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import PremiumButton from '../../components/PremiumButton';
import PremiumInput from '../../components/PremiumInput';

export default function CustomerRegister() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [country, setCountry] = useState('');
  const { register } = useAuth();
  const { colors } = useTheme();
  const router = useRouter();

  const handleRegister = async () => {
    if (!email || !password || !country) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }
    try {
      await register(email, password, 'customer', country);
      router.replace('/customer/home');
    } catch (error) {
      Alert.alert("Registration Failed", error.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.secondary }]}>Create Account</Text>
      
      <PremiumInput 
        placeholder="Email Address" 
        value={email} 
        onChangeText={setEmail} 
      />
      
      <PremiumInput 
        placeholder="Country (e.g. UAE, Thailand)" 
        value={country} 
        onChangeText={setCountry} 
      />
      
      <PremiumInput 
        placeholder="Password" 
        value={password} 
        onChangeText={setPassword} 
        secureTextEntry={true} 
      />

      <PremiumButton title="Register Now" onPress={handleRegister} />
      
      <Text 
        style={[styles.footerText, { color: colors.textDim }]}
        onPress={() => router.back()}
      >
        Already have an account? <Text style={{ color: colors.primary }}>Login</Text>
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
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
