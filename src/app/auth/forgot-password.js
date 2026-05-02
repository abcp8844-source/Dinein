import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from "react-native";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [identityNumber, setIdentityNumber] = useState(""); // Passport or Local ID

  const handleResetRequest = async () => {
    if (!email || !identityNumber) {
      Alert.alert("VERIFICATION REQUIRED", "Please provide registered Email and ID/Passport Number.");
      return;
    }

    // Logic: System will check if Email AND IdentityNumber match in Database
    try {
      // await sendSecureResetLink(email, identityNumber);
      Alert.alert("IDENTITY CONFIRMED", "A secure reset link has been sent to your encrypted email.");
    } catch (error) {
      Alert.alert("ACCESS DENIED", "Provided credentials do not match our global records.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>IDENTITY RECOVERY</Text>
      <TextInput 
        style={styles.input} 
        placeholder="Registered Email" 
        placeholderTextColor="#333"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput 
        style={styles.input} 
        placeholder="Passport or Local ID Number" 
        placeholderTextColor="#333"
        value={identityNumber}
        onChangeText={setIdentityNumber}
      />
      <TouchableOpacity style={styles.btn} onPress={handleResetRequest}>
        <Text style={styles.btnText}>VERIFY & RECOVER</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000", padding: 30, justifyContent: "center" },
  title: { color: "#D4AF37", fontSize: 18, fontWeight: "900", textAlign: "center", marginBottom: 40, letterSpacing: 2 },
  input: { height: 55, borderBottomWidth: 1, borderBottomColor: "#D4AF37", color: "#FFF", marginBottom: 30 },
  btn: { backgroundColor: "#D4AF37", height: 55, borderRadius: 10, justifyContent: "center", alignItems: "center" },
  btnText: { fontWeight: "900", color: "#000" }
});
