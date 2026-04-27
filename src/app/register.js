import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../context/ThemeContext';
import { globalCountries } from '../services/countryProvider';

export default function Register() {
  const { colors } = useTheme();
  const router = useRouter();
  
  const [role, setRole] = useState('customer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(globalCountries[0]);

  const handleRegistration = () => {
    if (!email || !password) {
      Alert.alert("Authentication", "Credentials are required.");
      return;
    }
    if (role === 'owner' && !idNumber) {
      Alert.alert("Compliance", "Verification ID is mandatory.");
      return;
    }
    router.replace('/login');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoCircle}>
          <Text style={styles.brandText}>F&B</Text>
        </View>
        <Text style={styles.tagline}>DINING TABLE</Text>
      </View>

      <View style={styles.roleSwitch}>
        <TouchableOpacity 
          style={[styles.roleOption, role === 'customer' && styles.activeTab]}
          onPress={() => setRole('customer')}
        >
          <Text style={[styles.roleText, { color: role === 'customer' ? '#D4AF37' : '#A68D5F' }]}>CUSTOMER</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.roleOption, role === 'owner' && styles.activeTab]}
          onPress={() => setRole('owner')}
        >
          <Text style={[styles.roleText, { color: role === 'owner' ? '#D4AF37' : '#A68D5F' }]}>OWNER</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.formArea}>
        <TextInput 
          style={styles.input}
          placeholder="Email Address"
          placeholderTextColor="#A68D5F"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />
        <TextInput 
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#A68D5F"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        {role === 'owner' && (
          <View>
            <Text style={styles.regionText}>REGION: {selectedCountry.name}</Text>
            <TextInput 
              style={styles.input}
              placeholder={selectedCountry.idType}
              placeholderTextColor="#A68D5F"
              value={idNumber}
              onChangeText={setIdNumber}
            />
          </View>
        )}

        <TouchableOpacity style={styles.mainBtn} onPress={handleRegistration}>
          <Text style={styles.btnText}>REGISTER</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#8B0000', padding: 40, alignItems: 'center', justifyContent: 'center' },
  header: { alignItems: 'center', marginBottom: 40 },
  logoCircle: { width: 110, height: 110, borderRadius: 55, backgroundColor: '#660000', borderWidth: 3, borderColor: '#D4AF37', justifyContent: 'center', alignItems: 'center' },
  brandText: { fontSize: 40, fontWeight: 'bold', color: '#D4AF37' },
  tagline: { color: '#D4AF37', letterSpacing: 4, marginTop: 10, fontSize: 10 },
  roleSwitch: { flexDirection: 'row', width: '100%', marginBottom: 30 },
  roleOption: { flex: 1, paddingVertical: 12, alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#660000' },
  activeTab: { borderBottomColor: '#D4AF37', borderBottomWidth: 2 },
  roleText: { fontSize: 12, fontWeight: 'bold' },
  formArea: { width: '100%' },
  input: { height: 55, borderBottomWidth: 1, borderBottomColor: '#D4AF37', color: '#FFFFFF', marginBottom: 20, fontSize: 15 },
  regionText: { color: '#D4AF37', fontSize: 10, marginBottom: 5 },
  mainBtn: { backgroundColor: '#D4AF37', height: 55, justifyContent: 'center', alignItems: 'center', marginTop: 20, borderRadius: 4 },
  btnText: { color: '#660000', fontWeight: 'bold', letterSpacing: 2 }
});
