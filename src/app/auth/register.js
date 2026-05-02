import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../../context/AuthContext"; // Path Verified
import { useTheme } from "../../theme/ThemeContext"; // Path Verified
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";

// Standardized 15 Global Markets
const GLOBAL_MARKETS = [
  { id: "THA", name: "Thailand", currency: "THB", localIdName: "Thai ID" },
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
  { id: "SGP", name: "Singapore", currency: "SGD", localIdName: "NRIC" },
  { id: "MYS", name: "Malaysia", currency: "MYR", localIdName: "MyKad" },
  { id: "IDN", name: "Indonesia", currency: "IDR", localIdName: "KTP" },
  { id: "VNM", name: "Vietnam", currency: "VND", localIdName: "Citizen ID" },
  { id: "ARE", name: "UAE", currency: "AED", localIdName: "Emirates ID" },
  { id: "SAU", name: "Saudi Arabia", currency: "SAR", localIdName: "Iqama" },
  { id: "HKG", name: "Hong Kong", currency: "HKD", localIdName: "HKID" },
];

export default function Register() {
  const { register } = useAuth();
  const { colors } = useTheme();
  const router = useRouter();

  const [role, setRole] = useState("customer");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(GLOBAL_MARKETS[0]);
  const [verificationType, setVerificationType] = useState("local");
  const [idNumber, setIdNumber] = useState("");
  const [passportOrigin, setPassportOrigin] = useState("");

  const handleRegistration = async () => {
    if (!email || !password) {
      Alert.alert("REQUIRED", "Email and Security Key are mandatory.");
      return;
    }

    // Strict Rule: Owner MUST provide Identification
    if (role === "owner" && !idNumber) {
      Alert.alert(
        "COMPLIANCE ERROR",
        "Passport or Local ID is required for Merchant verification.",
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

      // Corrected Routing Path
      router.replace(role === "owner" ? "/(owner)/home" : "/(customer)/home");
    } catch (error) {
      Alert.alert("REGISTRY ERROR", error.message);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: "#000" }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Header Section */}
        <Animatable.View animation="fadeInDown" style={styles.header}>
          <MaterialCommunityIcons
            name="shield-check-outline"
            size={50}
            color="#D4AF37"
          />
          <Text style={styles.title}>GLOBAL REGISTRY</Text>
          <View style={styles.goldLine} />
        </Animatable.View>

        {/* Unified Tab Switcher */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            onPress={() => setRole("customer")}
            style={[styles.tab, role === "customer" && styles.activeTab]}
          >
            <Text
              style={[
                styles.tabText,
                { color: role === "customer" ? "#D4AF37" : "#444" },
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
              style={[
                styles.tabText,
                { color: role === "owner" ? "#D4AF37" : "#444" },
              ]}
            >
              MERCHANT
            </Text>
          </TouchableOpacity>
        </View>

        {/* Market Selection */}
        <Text style={styles.label}>OPERATIONAL MARKET</Text>
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
                styles.chip,
                selectedCountry.id === m.id && {
                  borderColor: "#D4AF37",
                  backgroundColor: "#111",
                },
              ]}
            >
              <Text
                style={[
                  styles.chipText,
                  { color: selectedCountry.id === m.id ? "#D4AF37" : "#444" },
                ]}
              >
                {m.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Inputs */}
        <TextInput
          style={styles.input}
          placeholder="Corporate or Personal Email"
          placeholderTextColor="#333"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Security Key (Password)"
          placeholderTextColor="#333"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        {/* Strict Verification for Owners */}
        {role === "owner" && (
          <Animatable.View animation="fadeIn" style={styles.verificationBox}>
            <Text style={styles.label}>IDENTITY VERIFICATION</Text>
            <View style={styles.toggleRow}>
              <TouchableOpacity
                onPress={() => setVerificationType("local")}
                style={[
                  styles.toggleBtn,
                  verificationType === "local" && styles.toggleActive,
                ]}
              >
                <Text style={styles.toggleBtnText}>
                  {selectedCountry.localIdName}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setVerificationType("passport")}
                style={[
                  styles.toggleBtn,
                  verificationType === "passport" && styles.toggleActive,
                ]}
              >
                <Text style={styles.toggleBtnText}>PASSPORT</Text>
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.input}
              placeholder={
                verificationType === "local"
                  ? `${selectedCountry.localIdName} Number`
                  : "Passport Identification Number"
              }
              placeholderTextColor="#333"
              value={idNumber}
              onChangeText={setIdNumber}
            />

            {verificationType === "passport" && (
              <TextInput
                style={styles.input}
                placeholder="Issuing Country"
                placeholderTextColor="#333"
                value={passportOrigin}
                onChangeText={setPassportOrigin}
              />
            )}
            <Text style={styles.legalNote}>
              * Documents must be valid in the {selectedCountry.name}{" "}
              operational node.
            </Text>
          </Animatable.View>
        )}

        <TouchableOpacity
          style={styles.registerBtn}
          onPress={handleRegistration}
        >
          <Text style={styles.registerBtnText}>
            INITIALIZE {role.toUpperCase()} PROFILE
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 25 },
  header: { alignItems: "center", marginTop: 20, marginBottom: 40 },
  title: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "900",
    letterSpacing: 4,
    marginTop: 15,
  },
  goldLine: { width: 40, height: 2, backgroundColor: "#D4AF37", marginTop: 10 },
  tabContainer: {
    flexDirection: "row",
    marginBottom: 30,
    backgroundColor: "#0A0A0A",
    borderRadius: 15,
    padding: 5,
  },
  tab: { flex: 1, paddingVertical: 15, alignItems: "center", borderRadius: 10 },
  activeTab: {
    backgroundColor: "#111",
    borderWidth: 0.5,
    borderColor: "#D4AF3733",
  },
  tabText: { fontSize: 10, fontWeight: "900", letterSpacing: 1.5 },
  label: {
    color: "#D4AF37",
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 2,
    marginBottom: 15,
  },
  marketScroll: { marginBottom: 30 },
  chip: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#111",
    marginRight: 10,
  },
  chipText: { fontSize: 10, fontWeight: "bold" },
  input: {
    height: 55,
    borderBottomWidth: 1,
    borderBottomColor: "#111",
    color: "#FFF",
    marginBottom: 20,
    fontSize: 14,
  },
  verificationBox: {
    backgroundColor: "#0A0A0A",
    padding: 20,
    borderRadius: 20,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: "#111",
  },
  toggleRow: { flexDirection: "row", gap: 10, marginBottom: 20 },
  toggleBtn: {
    flex: 1,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#222",
  },
  toggleActive: { backgroundColor: "#D4AF37", borderColor: "#D4AF37" },
  toggleBtnText: { color: "#FFF", fontSize: 9, fontWeight: "bold" },
  legalNote: { color: "#444", fontSize: 8, fontStyle: "italic", marginTop: 5 },
  registerBtn: {
    backgroundColor: "#D4AF37",
    height: 60,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  registerBtnText: {
    color: "#000",
    fontWeight: "900",
    letterSpacing: 2,
    fontSize: 12,
  },
});
