import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../context/ThemeContext';
import { dbService } from '../../services/dbService'; // Assuming this handles Firebase

export default function Register() {
  const { colors } = useTheme();
  const router = useRouter();
  
  const [role, setRole] = useState('customer');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [shopName, setShopName] = useState('');
  const [idType, setIdType] = useState('ID'); // ID Card or Passport
  const [idNumber, setIdNumber] = useState('');

  const handleRegister = async () => {
    // Basic Validation
    if (!email || !password) {
      Alert.alert("Security Check", "Email and Password are required for privacy protection.");
      return;
    }

    if (role === 'owner' && !idNumber) {
      Alert.alert("Verification Required", "Under our Privacy Policy, Shop Owners must provide a valid ID or Passport number for legal compliance.");
      return;
    }

    try {
      // Registration Logic (Firebase integration)
      const userData = {
        email,
        phone,
        role,
        ...(role === 'owner' && { shopName, idType, idNumber, verified: false })
      };
      
      console.log("Registering User:", userData);
      Alert.alert("Success", "Account created. Our team will verify your documents shortly.");
      router.replace('/auth/login');
    } catch (error) {
      Alert.alert("System Error", "Registration failed. Please try again.");
    }
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.primary }]}>DINING TABLE</Text>
      <Text style={[styles.subtitle, { color: colors.textDim }]}>SECURE REGISTRATION</Text>
      
      {/* Role Selection */}
      <View style={styles.roleContainer}>
        <TouchableOpacity 
          style={[styles.roleBtn, role === 'customer' && { backgroundColor: colors.primary }]} 
          onPress={() => setRole('customer')}
        >
          <Text style={[styles.roleText, { color: role === 'customer' ? '#000' : '#666' }]}>CUSTOMER</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.roleBtn, role === 'owner' && { backgroundColor: colors.primary }]} 
          onPress={() => setRole('owner')}
        >
          <Text style={[styles.roleText, { color: role === 'owner' ? '#000' : '#666' }]}>SHOP OWNER</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.form}>
        <TextInput 
          style={[styles.input, { color: '#fff', borderColor: colors.border }]} 
          placeholder="Email Address" placeholderTextColor="#444" 
          value={email} onChangeText={setEmail}
        />
        <TextInput 
          style={[styles.input, { color: '#fff', borderColor: colors.border }]} 
          placeholder="Phone Number (e.g. +66...)" placeholderTextColor="#444" 
          value={phone} onChangeText={setPhone}
        />
        <TextInput 
          style={[styles.input, { color: '#fff', borderColor: colors.border }]} 
          placeholder="Password" placeholderTextColor="#444" secureTextEntry 
          value={password} onChangeText={setPassword}
        />

        {/* OWNER SPECIFIC FIELDS */}
        {role === 'owner' && (
          <View style={styles.ownerSection}>
            <TextInput 
              style={[styles.input, { color: '#fff', borderColor: colors.primary }]} 
              placeholder="Shop Name" placeholderTextColor="#444" 
              value={shopName} onChangeText={setShopName}
            />
            <Text style={{ color: colors.primary, fontSize: 10, marginBottom: 10, letterSpacing: 1 }}>IDENTITY VERIFICATION</Text>
            <View style={{ flexDirection: 'row', gap: 10, marginBottom: 15 }}>
              <TouchableOpacity onPress={() => setIdType('ID')} style={[styles.smallBtn, idType === 'ID' && { borderColor: colors.primary }]}>
                <Text style={{ color: '#fff', fontSize: 10 }}>THAI ID</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setIdType('Passport')} style={[styles.smallBtn, idType === 'Passport' && { borderColor: colors.primary }]}>
                <Text style={{ color: '#fff', fontSize: 10 }}>PASSPORT</Text>
              </TouchableOpacity>
            </View>
            <TextInput 
              style={[styles.input, { color: '#fff', borderColor: colors.primary }]} 
              placeholder={idType === 'ID' ? "Identification Number" : "Passport Number"} 
              placeholderTextColor="#444" 
              value={idNumber} onChangeText={setIdNumber}
            />
          </View>
        )}
      </View>

      {/* Social Login for Customers */}
      {role === 'customer' && (
        <View style={styles.socialArea}>
          <Text style={{ color: '#444', fontSize: 10, marginBottom: 15 }}>OR REGISTER WITH</Text>
          <View style={{ flexDirection: 'row', gap: 20 }}>
            <Text style={{ color: colors.secondary }}>Google</Text>
            <Text style={{ color: colors.secondary }}>Facebook</Text>
          </View>
        </View>
      )}

      <TouchableOpacity 
        style={[styles.mainBtn, { backgroundColor: colors.primary }]} 
        onPress={handleRegister}
      >
        <Text style={styles.btnText}>VERIFY & CREATE ACCOUNT</Text>
      </TouchableOpacity>

      <Text style={styles.privacyNote}>
        By clicking Register, you agree to our <Text style={{ color: colors.primary }}>Privacy Policy</Text> and Anti-Fraud Terms.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 30, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 32, fontWeight: '300', letterSpacing: 6, marginBottom: 5 },
  subtitle: { fontSize: 10, letterSpacing: 4, marginBottom: 40 },
  roleContainer: { flexDirection: 'row', width: '100%', gap: 10, marginBottom: 30 },
  roleBtn: { flex: 1, height: 45, justifyContent: 'center', alignItems: 'center', borderRadius: 2, borderWidth: 1, borderColor: '#333' },
  roleText: { fontSize: 10, fontWeight: 'bold', letterSpacing: 1 },
  form: { width: '100%' },
  input: { width: '100%', height: 50, borderBottomWidth: 1, marginBottom: 20, fontSize: 14 },
  ownerSection: { marginTop: 10 },
  smallBtn: { padding: 8, borderWidth: 1, borderColor: '#333', borderRadius: 2 },
  socialArea: { alignItems: 'center', marginVertical: 30 },
  mainBtn: { width: '100%', height: 55, justifyContent: 'center', alignItems: 'center', marginTop: 20, borderRadius: 2 },
  btnText: { color: '#000', fontWeight: 'bold', letterSpacing: 2, fontSize: 13 },
  privacyNote: { color: '#444', fontSize: 9, textAlign: 'center', marginTop: 30, lineHeight: 15 }
});
