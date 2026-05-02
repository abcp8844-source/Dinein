import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  StatusBar,
} from "react-native";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../theme/ThemeContext";
import PremiumButton from "../../components/PremiumButton";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";

/**
 * RESTORED: Future-Tech Logistics Node
 * Logic: Real-time Geo-spatial Data Binding with AuthContext
 * Integrity: Standard Deep-Navy #020B18 | No Design Deletions
 */
export default function AddressSetup() {
  const [address, setAddress] = useState(null);
  const [loading, setLoading] = useState(false);
  const { updateProfile, userData } = useAuth();
  const { colors } = useTheme();
  const router = useRouter();

  // Ensuring country name defaults to user's real data
  const country = userData?.countryName || "Thailand"; 

  const handleIdentifyLocation = async () => {
    setLoading(true);
    try {
      // Step 1: Request Real Permissions
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "ACCESS DENIED",
          "LOCATION PERMISSION IS REQUIRED FOR GLOBAL LOGISTICS."
        );
        return;
      }

      // Step 2: Get High Accuracy Coordinates
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      // Step 3: Reverse Geocode for Human Readable Address
      const reverseGeo = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (reverseGeo && reverseGeo.length > 0) {
        const first = reverseGeo[0];
        const locationData = {
          street: first.street || "",
          house: first.streetNumber || "",
          district: first.district || "",
          city: first.city || first.region || "",
          lat: location.coords.latitude,
          lng: location.coords.longitude,
          formattedAddress: `${first.streetNumber || ""} ${first.street || ""}, ${first.city || ""}`.trim()
        };
        setAddress(locationData);
      }
    } catch (error) {
      Alert.alert("SYNC ERROR", "UNABLE TO CONNECT WITH LOCAL SATELLITES.");
    } finally {
      setLoading(false);
    }
  };

  const finalizeSetup = async () => {
    if (!address) return;
    try {
      // REAL DATA UPDATE: Syncing with Firebase via AuthContext
      await updateProfile({ 
        locationData: address,
        addressInitialized: true 
      });
      router.replace("/(customer)/home");
    } catch (error) {
      Alert.alert("UPDATE FAILED", "COULD NOT ESTABLISH PROFILE LINK.");
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: "#020B18" }]}>
      <StatusBar barStyle="light-content" />
      <Animatable.View animation="fadeInUp" style={styles.content}>
        <View style={styles.iconBox}>
          <MaterialCommunityIcons
            name="map-marker-radius-outline"
            size={40}
            color={colors.primary || "#D4AF37"}
          />
        </View>

        <Text style={styles.title}>LOGISTICS NODE</Text>
        <Text style={styles.subtitle}>
          ESTABLISHING CONNECTION POINT: {country.toUpperCase()}
        </Text>

        <View style={styles.displayCard}>
          <Text style={styles.label}>COORDINATES DETECTED:</Text>
          <Text style={styles.addressText}>
            {address
              ? address.formattedAddress.toUpperCase()
              : "SEARCHING FOR ENCRYPTED SIGNAL..."}
          </Text>
        </View>

        <PremiumButton
          title={loading ? "SYNCING..." : "IDENTIFY LOCATION"}
          onPress={handleIdentifyLocation}
          disabled={loading}
        />

        {address && (
          <TouchableOpacity onPress={finalizeSetup} style={styles.confirmBtn}>
            <Text
              style={[
                styles.confirmText,
                { color: colors.primary || "#D4AF37" },
              ]}
            >
              CONFIRM & PROCEED
            </Text>
          </TouchableOpacity>
        )}
      </Animatable.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 30,
  },
  content: { width: "100%", alignItems: "center" },
  iconBox: { marginBottom: 25 },
  title: { fontSize: 22, fontWeight: "900", letterSpacing: 4, color: "#FFF" },
  subtitle: {
    fontSize: 8,
    color: "#5D6D7E",
    marginTop: 10,
    letterSpacing: 1.5,
    fontWeight: "bold",
  },
  displayCard: {
    width: "100%",
    marginVertical: 40,
    padding: 30,
    backgroundColor: "#0A1A2F",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#1B2631",
  },
  label: {
    fontSize: 8,
    fontWeight: "900",
    color: "#D4AF37",
    marginBottom: 15,
    letterSpacing: 1,
  },
  addressText: {
    color: "#FFF",
    fontSize: 13,
    fontWeight: "300",
    lineHeight: 22,
    letterSpacing: 0.5,
  },
  confirmBtn: { marginTop: 30 },
  confirmText: {
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 2,
  },
});
