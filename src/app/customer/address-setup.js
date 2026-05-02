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

export default function AddressSetup() {
  const [address, setAddress] = useState(null);
  const [loading, setLoading] = useState(false);
  const { updateProfile, userData } = useAuth();
  const { colors } = useTheme();
  const router = useRouter();

  const country = userData?.countryName || "GLOBAL";

  const handleIdentifyLocation = async () => {
    setLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "PERMISSION DENIED",
          "LOCATION ACCESS IS CRITICAL FOR LOGISTICS PRECISION.",
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
      Alert.alert("GPS ERROR", "UNABLE TO SYNC WITH REGIONAL SATELLITES.");
    } finally {
      setLoading(false);
    }
  };

  const finalizeSetup = async () => {
    if (!address) return;
    try {
      await updateProfile({ location: address });
      router.replace("/(customer)/home");
    } catch (error) {
      Alert.alert("SYNC FAILURE", "FAILED TO UPDATE LOGISTICS PROFILE.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Animatable.View
        animation="fadeInUp"
        duration={800}
        style={styles.content}
      >
        <View style={styles.iconHeader}>
          <MaterialCommunityIcons name="target" size={40} color="#D4AF37" />
        </View>

        <Text style={styles.title}>LOGISTICS PRECISION</Text>
        <Text style={styles.subtitle}>
          ALIGNING YOUR PROFILE WITH THE {country.toUpperCase()} NODE.
        </Text>

        <View style={styles.addressDisplay}>
          <Text style={styles.addressLabel}>DETECTED COORDINATES:</Text>
          <Text style={styles.addressText}>
            {address
              ? `${address.house} ${address.street}, ${address.city}`.toUpperCase()
              : "WAITING FOR ENCRYPTED GPS SIGNAL..."}
          </Text>
          {address && (
            <View style={styles.verifiedBadge}>
              <MaterialCommunityIcons
                name="check-decagram"
                size={12}
                color="#D4AF37"
              />
              <Text style={styles.verifiedText}>STATION VERIFIED</Text>
            </View>
          )}
        </View>

        <PremiumButton
          title={loading ? "SYNCING..." : "IDENTIFY LOCATION"}
          onPress={handleIdentifyLocation}
          disabled={loading}
        />

        {address && (
          <TouchableOpacity
            onPress={finalizeSetup}
            style={styles.confirmBtn}
            activeOpacity={0.7}
          >
            <Text style={styles.confirmText}>CONFIRM & ESTABLISH LINK</Text>
          </TouchableOpacity>
        )}
      </Animatable.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    padding: 30,
  },
  content: { width: "100%", alignItems: "center" },
  iconHeader: { marginBottom: 20 },
  title: {
    fontSize: 22,
    fontWeight: "900",
    letterSpacing: 4,
    color: "#FFF",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 8,
    textAlign: "center",
    marginTop: 12,
    letterSpacing: 2,
    color: "#444",
    fontWeight: "bold",
  },
  addressDisplay: {
    width: "100%",
    marginVertical: 45,
    padding: 30,
    borderRadius: 25,
    backgroundColor: "#0A0A0A",
    borderWidth: 1,
    borderColor: "#111",
  },
  addressLabel: {
    fontSize: 8,
    fontWeight: "900",
    marginBottom: 15,
    letterSpacing: 2,
    color: "#D4AF37",
  },
  addressText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "300",
    lineHeight: 24,
    letterSpacing: 0.5,
  },
  verifiedBadge: { flexDirection: "row", alignItems: "center", marginTop: 20 },
  verifiedText: {
    color: "#D4AF37",
    fontSize: 8,
    fontWeight: "900",
    marginLeft: 6,
    letterSpacing: 1,
  },
  confirmBtn: { marginTop: 30, paddingVertical: 10 },
  confirmText: {
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 2,
    color: "#D4AF37",
  },
});
