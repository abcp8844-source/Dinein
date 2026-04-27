import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import PremiumButton from '../../components/PremiumButton';
import PremiumInput from '../../components/PremiumInput';

export default function OwnerRegister() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [businessName, setBusinessName] = useState('');
  const { register } = useAuth();
  const { colors } = useTheme();
  const router = useRouter();

  const handleRegister = async () => {
    if (!email || !password || !businessName) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }
    try {
      await register(email, password, 'owner', businessName);
      router.replace('/owner/dashboard');
    } catch (error) {
      Alert.alert("Registration Failed", error.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.secondary }]}>Business Registration</Text>
      
      <PremiumInput 
        placeholder="Business Name" 
        value={businessName} 
        onChangeText={setBusinessName} 
      />
      
      <PremiumInput 
        placeholder="Business Email" 
        value={email} 
        onChangeText={setEmail} 
      />
      
      <PremiumInput 
        placeholder="Password" 
        value={password} 
        onChangeText={setPassword} 
        secureTextEntry={true} 
      />

      <PremiumButton title="Register Business" onPress={handleRegister} />
      
      <Text 
        style={[styles.footerText, { color: colors.textDim }]}
        onPress={() => router.back()}
      >
        Already registered? <Text style={{ color: colors.primary }}>Login</Text>
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
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 40,
    textAlign: 'center'
  },
  footerText: {
    marginTop: 20,
    fontSize: 14,
  }
});
