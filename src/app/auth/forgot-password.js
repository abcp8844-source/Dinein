import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "expo-router";
import { useTheme } from "../theme/ThemeContext";
import PremiumButton from "../components/PremiumButton";
import PremiumInput from "../components/PremiumInput";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { resetPassword } = useAuth();
  const { colors } = useTheme();
  const router = useRouter();

  const handleReset = async () => {
    if (!email) {
      Alert.alert("Required", "Please enter your registered email.");
      return;
    }

    setLoading(true);
    try {
      await resetPassword(email);
      Alert.alert(
        "Reset Link Sent",
        "Check your email to reset your security key.",
      );
      router.back();
    } catch (error) {
      Alert.alert("Error", "Account not found or network issue.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" />

      <View style={styles.headerArea}>
        <Text style={[styles.logoText, { color: colors.primary }]}>
          RECOVER
        </Text>
        <Text style={[styles.tagline, { color: colors.textDim }]}>
          SECURITY KEY RESTORATION
        </Text>
      </View>

      <View style={styles.formArea}>
        <Text style={[styles.label, { color: colors.primary }]}>
          REGISTERED EMAIL
        </Text>
        <PremiumInput
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />
      </View>

      <PremiumButton
        title={loading ? "SENDING..." : "SEND RESET LINK"}
        onPress={handleReset}
      />

      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Text style={{ color: colors.textDim }}>BACK TO LOGIN</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 30, justifyContent: "center" },
  headerArea: { alignItems: "center", marginBottom: 40 },
  logoText: { fontSize: 24, fontWeight: "300", letterSpacing: 5 },
  tagline: { fontSize: 8, letterSpacing: 2, fontWeight: "bold", marginTop: 5 },
  formArea: { marginBottom: 30 },
  label: {
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  backBtn: { alignItems: "center", marginTop: 30 },
});
