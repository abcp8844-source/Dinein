import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from "react-native";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import { useAuth } from "../../context/AuthContext"; // Path Verified
import { useTheme } from "../../theme/ThemeContext"; // Path Verified
import PremiumButton from "../../components/PremiumButton"; // Path Verified
import * as Animatable from "react-native-animatable";

export default function AddressSetup() {
  const [address, setAddress] = useState(null);
  const [loading, setLoading] = useState(false);
  const { updateProfile } = useAuth(); 
  const { colors } = useTheme();
  const router = useRouter();

  const handleIdentifyLocation = async () => {
    setLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Location access is vital for precision delivery."
        );
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      const reverseGeo = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (reverseGeo && reverseGeo.length > 0) {
        const first = reverseGeo[0];
        setAddress({
          street: first.street || "",
          house: first.streetNumber || "",
          district: first.district || "",
          city: first.city || "",
          lat: location.coords.latitude,
          lng: location.coords.longitude,
        });
      }
    } catch (error) {
      console.error("GPS_SYNC_ERROR:", error);
      Alert.alert("GPS Error", "Unable to sync with regional satellites.");
    } finally {
      setLoading(false);
    }
  };

  const finalizeSetup = async () => {
    if (!address) return;
    try {
      await updateProfile({ location: address });
      // Corrected navigation to parentheses structure
      router.replace("/(customer)/home");
    } catch (error) {
      console.error("PROFILE_UPDATE_ERROR:", error);
      Alert.alert("Error", "Failed to save address. Please try again.");
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background || "#000" }]}>
      <Animatable.View animation="fadeInUp" style={styles.content}>
        <Text style={[styles.title, { color: "#FFF" }]}>
          DELIVERY PRECISION
        </Text>
        <Text style={[styles.subtitle, { color: colors.textDim || "#444" }]}>
          Aligning your global profile with local logistics.
        </Text>

        <View style={[styles.addressDisplay, { backgroundColor: "#050505", borderColor: "#111" }]}>
          <Text style={[styles.addressLabel, { color: colors.primary || "#D4AF37" }]}>DETECTED ADDRESS:</Text>
          <Text style={styles.addressText}>
            {address
              ? `${address.house} ${address.street}, ${address.city}`
              : "Waiting for GPS signal..."}
          </Text>
        </View>

        <PremiumButton
          title={loading ? "SYNCING GPS..." : "IDENTIFY MY LOCATION"}
          onPress={handleIdentifyLocation}
          disabled={loading}
        />

        {address && (
          <TouchableOpacity onPress={finalizeSetup} style={styles.confirmBtn}>
            <Text style={[styles.confirmText, { color: colors.primary }]}>
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
  content: { width: "100%" },
  title: {
    fontSize: 24,
    fontWeight: "900",
    letterSpacing: 2,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 10,
    textAlign: "center",
    marginTop: 10,
    letterSpacing: 1,
  },
  addressDisplay: {
    marginVertical: 40,
    padding: 25,
    borderRadius: 20,
    borderWidth: 1,
  },
  addressLabel: {
    fontSize: 9,
    fontWeight: "bold",
    marginBottom: 10,
    letterSpacing: 1,
  },
  addressText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "500",
    lineHeight: 24,
  },
  confirmBtn: { marginTop: 20, alignItems: "center" },
  confirmText: { fontSize: 12, fontWeight: "bold", letterSpacing: 1.5 },
});
