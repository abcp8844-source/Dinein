import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../context/ThemeContext';
import { globalCountries } from '../services/countryProvider';

export default function Register() {
  const { colors } = useTheme();
  const router = useRouter();
  
  const [role, setRole] = useState('customer');
  const [email, setEmail] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(globalCountries[0]);
  const [idNumber, setIdNumber] = useState('');

  const handleRegister = () => {
    if (!email) {
      Alert.alert("Privacy Check", "Email is required for secure global access.");
      return;
    }
    if (role === 'owner' && !idNumber) {
      Alert.alert("Global Verification", `A valid ${selectedCountry.idType} is mandatory for ${selectedCountry.name}.`);
      return;
    }
    Alert.alert("Global System", "Identity verification in progress for " + selectedCountry.name);
    router.replace('/auth/login');
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.primary }]}>DINING TABLE</Text>
      <Text style={{ color: colors.textDim, fontSize: 10, letterSpacing: 2, marginBottom: 30 }}>GLOBAL ACCESS TERMINAL</Text>
      
      <View style={styles.roleContainer}>
        <TouchableOpacity 
          style={[styles.roleBtn, role === 'customer' && { borderColor: colors.primary, borderWidth: 1 }]} 
          onPress={() => setRole('customer')}
        >
          <Text style={{ color: role === 'customer' ? colors.primary : '#666', fontSize: 11 }}>CUSTOMER</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.roleBtn, role === 'owner' && { borderColor: colors.primary, borderWidth: 1 }]} 
          onPress={() => setRole('owner')}
        >
          <Text style={{ color: role === 'owner' ? colors.primary : '#666', fontSize: 11 }}>SHOP OWNER</Text>
        </TouchableOpacity>
      </View>

      {/* Country Selector Placeholder */}
      <View style={[styles.input, { borderBottomColor: colors.border, justifyContent: 'center' }]}>
        <Text style={{ color: colors.textDim, fontSize: 10 }}>SELECTED REGION: <Text style={{ color: colors.primary }}>{selectedCountry.name} ({selectedCountry.code})</Text></Text>
      </View>

      <TextInput 
        style={[styles.input, { color: '#fff', borderBottomColor: colors.border }]} 
        placeholder="Global Identity (Email)" placeholderTextColor="#444" 
        value={email} onChangeText={setEmail}
      />

      {role === 'owner' && (
        <TextInput 
          style={[styles.input, { color: '#fff', borderBottomColor: colors.primary }]} 
          placeholder={`${selectedCountry.idType} Number`}
          placeholderTextColor="#444" 
          value={idNumber} onChangeText={setIdNumber}
        />
      )}

      <TouchableOpacity 
        style={[styles.mainBtn, { backgroundColor: colors.primary }]} 
        onPress={handleRegister}
      >
        <Text style={{ fontWeight: 'bold', letterSpacing: 2, color: '#000' }}>INITIALIZE REGISTRATION</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 40, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 32, letterSpacing: 8, fontWeight: '300' },
  roleContainer: { flexDirection: 'row', gap: 15, marginBottom: 40 },
  roleBtn: { paddingVertical: 12, paddingHorizontal: 20, borderRadius: 2, backgroundColor: '#111' },
  input: { width: '100%', height: 60, borderBottomWidth: 1, marginBottom: 20 },
  mainBtn: { width: '100%', height: 55, justifyContent: 'center', alignItems: 'center', marginTop: 30, borderRadius: 2 }
});
