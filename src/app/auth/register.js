import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../theme/ThemeContext";

const GLOBAL_MARKETS = [
  { id: "USA", name: "United States", currency: "USD", localIdName: "SSN" },
  { id: "CHN", name: "China", currency: "CNY", localIdName: "Resident ID" },
  {
    id: "GBR",
    name: "United Kingdom",
    currency: "GBP",
    localIdName: "National Insurance",
  },
  { id: "DEU", name: "Germany", currency: "EUR", localIdName: "ID Card" },
  { id: "FRA", name: "France", currency: "EUR", localIdName: "ID Card" },
  { id: "JPN", name: "Japan", currency: "JPY", localIdName: "My Number" },
  {
    id: "KOR",
    name: "South Korea",
    currency: "KRW",
    localIdName: "Resident Reg",
  },
  { id: "THA", name: "Thailand", currency: "THB", localIdName: "Thai ID" },
  { id: "SGP", name: "Singapore", currency: "SGD", localIdName: "NRIC" },
  { id: "MYS", name: "Malaysia", currency: "MYR", localIdName: "MyKad" },
  { id: "IDN", name: "Indonesia", currency: "IDR", localIdName: "KTP" },
  { id: "VNM", name: "Vietnam", currency: "VND", localIdName: "Citizen ID" },
  { id: "ARE", name: "UAE", currency: "AED", localIdName: "Emirates ID" },
  { id: "SAU", name: "Saudi Arabia", currency: "SAR", localIdName: "Iqama" },
  { id: "HKG", name: "Hong Kong", currency: "HKD", localIdName: "HKID" },
];

export default function Register() {
  const { colors } = useTheme();
  const { register } = useAuth();
  const router = useRouter();

  const [role, setRole] = useState("customer");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(GLOBAL_MARKETS[7]);

  const [verificationType, setVerificationType] = useState("local");
  const [idNumber, setIdNumber] = useState("");
  const [passportOrigin, setPassportOrigin] = useState("");

  const handleRegistration = async () => {
    if (!email || !password) {
      Alert.alert("Required", "Please provide email and password.");
      return;
    }

    if (role === "owner" && !idNumber) {
      Alert.alert(
        "Compliance",
        "Identification is mandatory for Business Owners.",
      );
      return;
    }

    try {
      const registrationData = {
        market: selectedCountry.name,
        iso: selectedCountry.id,
        currency: selectedCountry.currency,
        verification: {
          method: verificationType,
          id: idNumber,
          origin:
            verificationType === "passport"
              ? passportOrigin
              : selectedCountry.name,
          timestamp: new Date().toISOString(),
        },
      };

      await register(email, password, role, registrationData);

      Alert.alert("Success", `Registered in ${selectedCountry.name} node.`);
      router.replace(role === "owner" ? "/owner/dashboard" : "/customer/home");
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <View style={styles.logoBox}>
          <Text style={styles.logoText}>F&B</Text>
        </View>
        <Text style={styles.tagline}>GLOBAL DINING NETWORK</Text>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          onPress={() => setRole("customer")}
          style={[styles.tab, role === "customer" && styles.activeTab]}
        >
          <Text
            style={[
              styles.tabText,
              role === "customer" && { color: "#D4AF37" },
            ]}
          >
            CUSTOMER
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setRole("owner")}
          style={[styles.tab, role === "owner" && styles.activeTab]}
        >
          <Text
            style={[styles.tabText, role === "owner" && { color: "#D4AF37" }]}
          >
            BUSINESS OWNER
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.form}>
        <Text style={styles.inputLabel}>OPERATIONAL REGION</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.marketScroll}
        >
          {GLOBAL_MARKETS.map((m) => (
            <TouchableOpacity
              key={m.id}
              onPress={() => setSelectedCountry(m)}
              style={[
                styles.marketChip,
                selectedCountry.id === m.id && { backgroundColor: "#D4AF37" },
              ]}
            >
              <Text
                style={[
                  styles.chipText,
                  selectedCountry.id === m.id && { color: "#600" },
                ]}
              >
                {m.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <TextInput
          style={styles.input}
          placeholder="Corporate Email"
          placeholderTextColor="#666"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Secure Password"
          placeholderTextColor="#666"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        {role === "owner" && (
          <View style={styles.ownerPanel}>
            <Text style={styles.inputLabel}>VERIFICATION DOCUMENT</Text>
            <View style={styles.methodToggle}>
              <TouchableOpacity
                onPress={() => setVerificationType("local")}
                style={[
                  styles.methodBtn,
                  verificationType === "local" && styles.methodActive,
                ]}
              >
                <Text style={styles.methodBtnText}>
                  {selectedCountry.localIdName}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setVerificationType("passport")}
                style={[
                  styles.methodBtn,
                  verificationType === "passport" && styles.methodActive,
                ]}
              >
                <Text style={styles.methodBtnText}>PASSPORT (GLOBAL)</Text>
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.input}
              placeholder={
                verificationType === "local"
                  ? `Enter ${selectedCountry.localIdName} Number`
                  : "Enter Passport Number"
              }
              placeholderTextColor="#666"
              value={idNumber}
              onChangeText={setIdNumber}
            />

            {verificationType === "passport" && (
              <TextInput
                style={styles.input}
                placeholder="Passport Issuing Country"
                placeholderTextColor="#666"
                value={passportOrigin}
                onChangeText={setPassportOrigin}
              />
            )}
            <Text style={styles.hint}>
              * System will record origin for {selectedCountry.name} market access.
            </Text>
          </View>
        )}

        <TouchableOpacity style={styles.submitBtn} onPress={handleRegistration}>
          <Text style={styles.submitBtnText}>
            CREATE {role.toUpperCase()} ACCOUNT
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: "#0A111F", padding: 30 },
  header: { alignItems: "center", marginTop: 40, marginBottom: 30 },
  logoBox: {
    width: 80,
    height: 80,
    backgroundColor: "#161E2E",
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#D4AF37",
    justifyContent: "center",
    alignItems: "center",
  },
  logoText: { color: "#D4AF37", fontSize: 28, fontWeight: "900" },
  tagline: {
    color: "#D4AF37",
    fontSize: 8,
    letterSpacing: 2,
    marginTop: 10,
    fontWeight: "bold",
  },
  tabContainer: {
    flexDirection: "row",
    marginBottom: 30,
    borderBottomWidth: 1,
    borderBottomColor: "#1F2937",
  },
  tab: { flex: 1, paddingVertical: 15, alignItems: "center" },
  activeTab: { borderBottomWidth: 3, borderBottomColor: "#D4AF37" },
  tabText: { color: "#A0AEC0", fontSize: 11, fontWeight: "bold" },
  form: { width: "100%" },
  inputLabel: {
    color: "#D4AF37",
    fontSize: 9,
    fontWeight: "bold",
    marginBottom: 10,
    letterSpacing: 1,
  },
  marketScroll: { flexDirection: "row", marginBottom: 20 },
  marketChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#D4AF37",
    marginRight: 8,
  },
  chipText: { color: "#D4AF37", fontSize: 9, fontWeight: "bold" },
  input: {
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: "#D4AF37",
    color: "#FFF",
    marginBottom: 20,
    fontSize: 14,
  },
  ownerPanel: {
    backgroundColor: "rgba(255,255,255,0.05)",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  methodToggle: { flexDirection: "row", gap: 10, marginBottom: 15 },
  methodBtn: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: "#D4AF37",
    borderRadius: 5,
    alignItems: "center",
  },
  methodActive: { backgroundColor: "#D4AF37" },
  methodBtnText: { color: "#FFF", fontSize: 9, fontWeight: "bold" },
  hint: { color: "#D4AF37", fontSize: 8, fontStyle: "italic", opacity: 0.7 },
  submitBtn: {
    backgroundColor: "#D4AF37",
    height: 55,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  submitBtnText: {
    color: "#0A111F",
    fontWeight: "900",
    letterSpacing: 1,
    fontSize: 13,
  },
});
