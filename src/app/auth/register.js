import React, { useState } from "react";
import { View, StyleSheet, ScrollView, Text, Alert } from "react-native";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "expo-router";
import PremiumInput from "../../components/PremiumInput";
import PremiumButton from "../../components/PremiumButton";
import { useTheme } from "../../theme/ThemeContext";

const GLOBAL_MARKETS = [
  { id: "THA", name: "Thailand", currency: "THB", localIdName: "Thai ID", code: "+66" },
  { id: "CHN", name: "China", currency: "CNY", localIdName: "Resident ID", code: "+86" },
  { id: "SGP", name: "Singapore", currency: "SGD", localIdName: "NRIC", code: "+65" },
  { id: "TUR", name: "Turkey", currency: "TRY", localIdName: "Kimlik", code: "+90" },
  { id: "ARE", name: "UAE", currency: "AED", localIdName: "Emirates ID", code: "+971" },
  { id: "SAU", name: "Saudi Arabia", currency: "SAR", localIdName: "Iqama", code: "+966" },
  { id: "USA", name: "USA", currency: "USD", localIdName: "SSN", code: "+1" },
  { id: "GBR", name: "UK", currency: "GBP", localIdName: "NIN", code: "+44" },
  { id: "JPN", name: "Japan", currency: "JPY", localIdName: "My Number", code: "+81" },
  { id: "KOR", name: "S. Korea", currency: "KRW", localIdName: "Resident Reg", code: "+82" },
  { id: "DEU", name: "Germany", currency: "EUR", localIdName: "ID Card", code: "+49" },
  { id: "FRA", name: "France", currency: "EUR", localIdName: "ID Card", code: "+33" },
  { id: "ITA", name: "Italy", currency: "EUR", localIdName: "Codice Fiscale", code: "+39" },
  { id: "CAN", name: "Canada", currency: "CAD", localIdName: "SIN", code: "+1" },
  { id: "AUS", name: "Australia", currency: "AUD", localIdName: "TFN", code: "+61" },
  { id: "MYS", name: "Malaysia", currency: "MYR", localIdName: "MyKad", code: "+60" },
  { id: "IDN", name: "Indonesia", currency: "IDR", localIdName: "KTP", code: "+62" },
  { id: "VNM", name: "Vietnam", currency: "VND", localIdName: "Citizen ID", code: "+84" },
  { id: "HKG", name: "Hong Kong", currency: "HKD", localIdName: "HKID", code: "+852" },
  { id: "CHE", name: "Switzerland", currency: "CHF", localIdName: "ID Card", code: "+41" },
];

export default function Register() {
  const { colors } = useTheme();
  const { register, sendOTP } = useAuth();
  const router = useRouter();

  const [step, setStep] = useState(1); 
  const [otpCode, setOtpCode] = useState("");
  const [verificationId, setVerificationId] = useState(null);
  
  const [form, setForm] = useState({
    email: "",
    password: "",
    fullName: "",
    phoneNumber: "",
    idNumber: "",
    selectedCountry: GLOBAL_MARKETS[0],
    verificationType: "local", // local or passport
    passportOrigin: "",
    role: "owner" // owner or customer
  });

  const handleRegistrationInitiation = async () => {
    if (!form.email || !form.password || !form.idNumber || !form.phoneNumber) {
      Alert.alert("SECURITY BREACH", "All identity fields are mandatory.");
      return;
    }

    if (form.role === "owner") {
      try {
        const fullPhone = `${form.selectedCountry.code}${form.phoneNumber}`;
        const vId = await sendOTP(fullPhone);
        setVerificationId(vId);
        setStep(2);
      } catch (error) {
        Alert.alert("OTP ERROR", "Verification dispatch failed.");
      }
    } else {
      finalizeRegistration();
    }
  };

  const finalizeRegistration = async () => {
    try {
      const registrationData = {
        isoCode: form.selectedCountry.id,
        currencyCode: form.selectedCountry.currency,
        phone: `${form.selectedCountry.code}${form.phoneNumber}`,
        verificationMethod: form.verificationType,
        idNumber: form.idNumber,
        idOrigin: form.verificationType === "passport" ? form.passportOrigin : form.selectedCountry.name,
      };

      await register(form.email, form.password, form.role, registrationData);
      router.replace(form.role === "owner" ? "/(owner)/home" : "/(customer)/home");
    } catch (error) {
      Alert.alert("REGISTRY ERROR", error.message);
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.primary }]}>SECURE REGISTER</Text>

      {step === 1 ? (
        <View>
          <PremiumInput placeholder="Full Name" value={form.fullName} onChangeText={(t) => setForm({...form, fullName: t})} />
          <PremiumInput placeholder="Email" value={form.email} onChangeText={(t) => setForm({...form, email: t})} />
          <PremiumInput placeholder="Password" value={form.password} secureTextEntry onChangeText={(t) => setForm({...form, password: t})} />
          
          <View style={styles.marketInfo}>
            <Text style={{ color: colors.primary }}>{form.selectedCountry.name} ({form.selectedCountry.code})</Text>
          </View>

          <PremiumInput placeholder="Phone Number" value={form.phoneNumber} onChangeText={(t) => setForm({...form, phoneNumber: t})} keyboardType="phone-pad" />
          <PremiumInput placeholder={form.verificationType === "passport" ? "Passport Number" : form.selectedCountry.localIdName} value={form.idNumber} onChangeText={(t) => setForm({...form, idNumber: t})} />
          
          <PremiumButton title={form.role === "owner" ? "Verify Phone" : "Complete Register"} onPress={handleRegistrationInitiation} />
        </View>
      ) : (
        <View>
          <PremiumInput placeholder="Enter OTP Code" value={otpCode} onChangeText={setOtpCode} keyboardType="number-pad" />
          <PremiumButton title="Finalize Account" onPress={finalizeRegistration} />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 25 },
  title: { fontSize: 22, fontWeight: "900", textAlign: "center", marginBottom: 30, letterSpacing: 2 },
  marketInfo: { padding: 10, marginVertical: 10, borderLeftWidth: 3, borderLeftColor: "#D4AF37" }
});
