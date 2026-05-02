import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  StatusBar,
  SafeAreaView
} from "react-native";
import { db } from "../../services/firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import { useAuth } from "../../context/AuthContext";
import { Ionicons } from "@expo/vector-icons";

/**
 * HIGH-VISIBILITY SHOP SETUP
 * Features: High-contrast inputs for maximum clarity.
 */
export default function ShopSetup() {
  const { userData } = useAuth();
  
  // CLEAR VISIBILITY THEME
  const THEME = {
    bg: "#001529",         // Dark Navy Background
    inputBg: "#002F56",    // Lighter Navy (Emerging from background)
    accent: "#D4AF37",     // Gold Highlights
    textMain: "#FFFFFF",   // Sharp White
    textSecondary: "#A6B1BB",
    border: "#004B87"      // Defined borders for clarity
  };

  const [shopName, setShopName] = useState("");
  const [contact, setContact] = useState("");
  const [openingHours, setOpeningHours] = useState("");
  const [city, setCity] = useState(userData?.locationData?.city || "");
  const [area, setArea] = useState(userData?.locationData?.area || "");
  const [street, setStreet] = useState(userData?.locationData?.street || "");
  const [landmark, setLandmark] = useState(userData?.locationData?.landmark || "");

  const handleSaveProfile = async () => {
    if (!shopName || !city || !area || !street || !contact) {
      Alert.alert("Input Required", "Please fill all mandatory fields.");
      return;
    }

    try {
      await setDoc(
        doc(db, "shops", userData.uid),
        {
          name: shopName,
          contact: contact,
          hours: openingHours,
          locationData: { city, area, street, landmark },
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );
      Alert.alert("Success", "Profile synchronized successfully.");
    } catch (error) {
      Alert.alert("Error", "Failed to update profile.");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: THEME.bg }}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: THEME.accent }]}>BUSINESS IDENTITY</Text>
          <Text style={[styles.regionStatus, { color: THEME.textSecondary }]}>
            MARKET: {userData?.countryName?.toUpperCase() || "GLOBAL NODE"}
          </Text>
        </View>

        <View style={styles.form}>
          {/* Identity Section */}
          <Text style={[styles.label, { color: THEME.accent }]}>OFFICIAL NAME</Text>
          <View style={[styles.inputContainer, { backgroundColor: THEME.inputBg, borderColor: THEME.border }]}>
            <TextInput
              style={[styles.input, { color: THEME.textMain }]}
              placeholder="Enter Shop Name"
              placeholderTextColor="#666"
              value={shopName}
              onChangeText={setShopName}
            />
          </View>

          {/* Location Section - Emerging Layout */}
          <Text style={[styles.label, { color: THEME.accent }]}>PRECISE LOCATION</Text>
          <View style={styles.row}>
            <View style={[styles.inputContainer, { flex: 1, marginRight: 10, backgroundColor: THEME.inputBg, borderColor: THEME.border }]}>
              <TextInput
                style={[styles.input, { color: THEME.textMain }]}
                placeholder="City"
                placeholderTextColor="#666"
                value={city}
                onChangeText={setCity}
              />
            </View>
            <View style={[styles.inputContainer, { flex: 1, backgroundColor: THEME.inputBg, borderColor: THEME.border }]}>
              <TextInput
                style={[styles.input, { color: THEME.textMain }]}
                placeholder="Area"
                placeholderTextColor="#666"
                value={area}
                onChangeText={setArea}
              />
            </View>
          </View>

          <View style={[styles.inputContainer, { backgroundColor: THEME.inputBg, borderColor: THEME.border, marginTop: 10 }]}>
            <TextInput
              style={[styles.input, { color: THEME.textMain }]}
              placeholder="Street / Building / Door"
              placeholderTextColor="#666"
              value={street}
              onChangeText={setStreet}
            />
          </View>

          {/* Contact Section */}
          <Text style={[styles.label, { color: THEME.accent }]}>COMMUNICATION</Text>
          <View style={[styles.inputContainer, { backgroundColor: THEME.inputBg, borderColor: THEME.border }]}>
            <TextInput
              style={[styles.input, { color: THEME.textMain }]}
              placeholder="Contact Number"
              placeholderTextColor="#666"
              keyboardType="phone-pad"
              value={contact}
              onChangeText={setContact}
            />
          </View>

          <TouchableOpacity
            style={[styles.saveBtn, { backgroundColor: THEME.accent }]}
            onPress={handleSaveProfile}
            activeOpacity={0.8}
          >
            <Text style={styles.btnText}>SAVE BUSINESS PROFILE</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 25, paddingBottom: 50 },
  header: { marginTop: 20, marginBottom: 35 },
  headerTitle: { fontSize: 26, fontWeight: "900", letterSpacing: 1 },
  regionStatus: { fontSize: 10, fontWeight: "bold", marginTop: 5, letterSpacing: 1.5 },
  label: { fontSize: 9, fontWeight: "900", letterSpacing: 2, marginBottom: 12, marginTop: 25 },
  row: { flexDirection: "row" },
  inputContainer: {
    borderRadius: 15,
    borderWidth: 1.5,
    paddingHorizontal: 15,
    height: 55,
    justifyContent: "center",
    elevation: 3, // Shadow for "emerging" effect
  },
  input: { fontSize: 16, fontWeight: "600" },
  saveBtn: {
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 18,
    marginTop: 50,
    shadowColor: "#D4AF37",
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  btnText: { color: "#000", fontWeight: "900", letterSpacing: 1.5, fontSize: 14 },
});
