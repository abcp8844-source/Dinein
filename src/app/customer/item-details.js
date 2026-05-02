import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../theme/ThemeContext";
import { dbService } from "../../services/dbService";
import PremiumButton from "../../components/PremiumButton";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";

export default function ItemDetails() {
  const { id, name, price, description } = useLocalSearchParams();
  const { userData } = useAuth();
  const { colors } = useTheme();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [orderMode, setOrderMode] = useState("delivery");

  const currency = userData?.currencyCode || "USD";
  const country = userData?.countryName || "GLOBAL";

  const requestAdminHelp = () => {
    Alert.alert("CORE SUPPORT", "ESTABLISH DIRECT LINK WITH SUPER ADMIN?", [
      { text: "CANCEL", style: "cancel" },
      {
        text: "ALERT ADMIN",
        onPress: () =>
          Alert.alert("SUCCESS", "ADMIN PROTOCOL INITIATED. STANDBY."),
      },
    ]);
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      const orderId = await dbService.placeOrder({
        customerId: userData.uid,
        customerEmail: userData.email,
        itemId: id,
        itemName: name,
        itemPrice: price,
        currency: currency,
        region: userData?.isoCode || "Global",
        orderMode: orderMode,
        deliveryStatus: "pending",
        timestamp: new Date().toISOString(),
        ai_tag: "TRANSACTION_VERIFIED",
      });

      router.replace({
        pathname: "/(customer)/success", // Refined path based on your image
        params: { orderId, itemName: name, amount: price },
      });
    } catch (error) {
      Alert.alert("SYNC ERROR", "SYSTEM MONITORING ACTIVE. ADMIN NOTIFIED.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animatable.View animation="fadeInDown" style={styles.header}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>{name?.toUpperCase()}</Text>
            <TouchableOpacity
              onPress={requestAdminHelp}
              style={styles.adminCircle}
            >
              <MaterialCommunityIcons
                name="robot-muffled"
                size={20}
                color="#D4AF37"
              />
            </TouchableOpacity>
          </View>
          <View style={styles.priceContainer}>
            <Text style={styles.price}>{price}</Text>
            <Text style={styles.currencyLabel}>{currency}</Text>
          </View>
        </Animatable.View>

        <Animatable.View
          animation="fadeInUp"
          delay={200}
          style={styles.selectorContainer}
        >
          <Text style={styles.sectionLabel}>EXECUTION MODE</Text>
          <View style={styles.modeRow}>
            {["delivery", "dine_in"].map((mode) => (
              <TouchableOpacity
                key={mode}
                onPress={() => setOrderMode(mode)}
                style={[
                  styles.modeBtn,
                  orderMode === mode && styles.activeMode,
                ]}
              >
                <Ionicons
                  name={
                    mode === "delivery"
                      ? "bicycle-outline"
                      : "restaurant-outline"
                  }
                  size={18}
                  color={orderMode === mode ? "#000" : "#444"}
                />
                <Text
                  style={[
                    styles.modeText,
                    { color: orderMode === mode ? "#000" : "#444" },
                  ]}
                >
                  {mode === "delivery" ? "DELIVERY" : "DINE-IN"}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animatable.View>

        <Animatable.View
          animation="fadeIn"
          delay={400}
          style={styles.detailsBox}
        >
          <Text style={styles.descTitle}>ASSET SPECIFICATIONS</Text>
          <Text style={styles.description}>{description}</Text>
        </Animatable.View>

        <Animatable.View
          animation="pulse"
          iterationCount="infinite"
          style={styles.aiTrustBox}
        >
          <Text style={styles.aiTrustText}>
            🛡️ ENCRYPTED SYNC ACTIVE FOR {country.toUpperCase()} MARKET NODE.
          </Text>
        </Animatable.View>

        <View style={styles.footer}>
          <PremiumButton
            title={loading ? "ENCRYPTING..." : "AUTHORIZE TRANSACTION"}
            onPress={handlePlaceOrder}
            disabled={loading}
          />
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backBtn}
          >
            <Text style={styles.cancelText}>ABORT & RETURN</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  scrollContent: { padding: 25, flexGrow: 1 },
  header: { marginTop: 20 },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: { fontSize: 28, fontWeight: "900", color: "#FFF", letterSpacing: 1 },
  adminCircle: {
    padding: 10,
    backgroundColor: "#0A0A0A",
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "#111",
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    marginTop: 10,
  },
  price: { fontSize: 32, fontWeight: "300", color: "#D4AF37" },
  currencyLabel: {
    fontSize: 12,
    marginLeft: 8,
    fontWeight: "900",
    color: "#D4AF37",
    opacity: 0.6,
  },
  selectorContainer: { marginTop: 40 },
  sectionLabel: {
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 3,
    marginBottom: 20,
    color: "#333",
  },
  modeRow: { flexDirection: "row", justifyContent: "space-between" },
  modeBtn: {
    flex: 0.48,
    height: 65,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#111",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  activeMode: { backgroundColor: "#D4AF37", borderColor: "#D4AF37" },
  modeText: {
    fontSize: 10,
    fontWeight: "900",
    marginLeft: 10,
    letterSpacing: 1,
  },
  detailsBox: {
    marginTop: 45,
    padding: 25,
    backgroundColor: "#0A0A0A",
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#111",
  },
  descTitle: {
    fontSize: 8,
    fontWeight: "900",
    letterSpacing: 2,
    marginBottom: 15,
    color: "#D4AF37",
  },
  description: {
    fontSize: 14,
    lineHeight: 24,
    color: "#AAA",
    fontWeight: "400",
  },
  aiTrustBox: {
    marginTop: 40,
    padding: 20,
    backgroundColor: "#050505",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#111",
  },
  aiTrustText: {
    color: "#222",
    fontSize: 8,
    fontWeight: "900",
    textAlign: "center",
    letterSpacing: 1,
  },
  footer: { marginTop: 50, paddingBottom: 20 },
  backBtn: { marginTop: 25, alignItems: "center" },
  cancelText: {
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 2,
    color: "#444",
  },
});
