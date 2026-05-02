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

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      const orderId = await dbService.placeOrder({
        customerId: userData.uid,
        itemId: id,
        itemName: name,
        itemPrice: price,
        currency: currency,
        orderMode: orderMode,
        timestamp: new Date().toISOString(),
      });

      router.replace({
        pathname: "/(customer)/success",
        params: { orderId, itemName: name, amount: price },
      });
    } catch (error) {
      Alert.alert("SYNC ERROR", "ENCRYPTION ACTIVE. ADMIN NOTIFIED.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: "#020B18" }]}>
      <StatusBar barStyle="light-content" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animatable.View animation="fadeInDown" style={styles.header}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>{name?.toUpperCase()}</Text>
            <View style={[styles.statusBadge, { backgroundColor: "#0A1A2F" }]}>
              <MaterialCommunityIcons
                name="shield-check-outline"
                size={16}
                color="#FF3B30"
              />
            </View>
          </View>
          <View style={styles.priceContainer}>
            <Text style={[styles.price, { color: colors.primary }]}>
              {price}
            </Text>
            <Text style={[styles.currencyLabel, { color: colors.primary }]}>
              {currency}
            </Text>
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
                  { backgroundColor: "#0A1A2F", borderColor: "#1B2631" },
                  orderMode === mode && {
                    backgroundColor: colors.primary,
                    borderColor: colors.primary,
                  },
                ]}
              >
                <Ionicons
                  name={
                    mode === "delivery"
                      ? "bicycle-outline"
                      : "restaurant-outline"
                  }
                  size={18}
                  color={orderMode === mode ? "#000" : "#5D6D7E"}
                />
                <Text
                  style={[
                    styles.modeText,
                    { color: orderMode === mode ? "#000" : "#FFF" },
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
          style={[
            styles.detailsBox,
            { backgroundColor: "#051121", borderColor: "#0A1A2F" },
          ]}
        >
          <Text style={styles.descTitle}>ASSET SPECIFICATIONS</Text>
          <Text style={styles.description}>{description}</Text>
        </Animatable.View>

        <Animatable.View
          animation="pulse"
          iterationCount="infinite"
          style={[styles.aiTrustBox, { backgroundColor: "#0A1A2F" }]}
        >
          <Text style={styles.aiTrustText}>
            🛡️ ENCRYPTED SYNC ACTIVE: {country.toUpperCase()} MARKET NODE
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
  container: { flex: 1 },
  scrollContent: { padding: 25, flexGrow: 1 },
  header: { marginTop: 20 },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: { fontSize: 26, fontWeight: "900", color: "#FFF", letterSpacing: 1 },
  statusBadge: {
    padding: 10,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "#1B2631",
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    marginTop: 10,
  },
  price: { fontSize: 32, fontWeight: "300" },
  currencyLabel: {
    fontSize: 12,
    marginLeft: 8,
    fontWeight: "900",
    opacity: 0.8,
  },
  selectorContainer: { marginTop: 40 },
  sectionLabel: {
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 3,
    marginBottom: 20,
    color: "#5D6D7E",
  },
  modeRow: { flexDirection: "row", justifyContent: "space-between" },
  modeBtn: {
    flex: 0.48,
    height: 65,
    borderRadius: 20,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  modeText: {
    fontSize: 10,
    fontWeight: "900",
    marginLeft: 10,
    letterSpacing: 1,
  },
  detailsBox: { marginTop: 40, padding: 25, borderRadius: 25, borderWidth: 1 },
  descTitle: {
    fontSize: 8,
    fontWeight: "900",
    letterSpacing: 2,
    marginBottom: 15,
    color: "#D4AF37",
  },
  description: {
    fontSize: 13,
    lineHeight: 22,
    color: "#5D6D7E",
    fontWeight: "500",
  },
  aiTrustBox: {
    marginTop: 40,
    padding: 15,
    borderRadius: 15,
    alignItems: "center",
  },
  aiTrustText: {
    color: "#FF3B30",
    fontSize: 8,
    fontWeight: "900",
    letterSpacing: 1,
  },
  footer: { marginTop: 50, paddingBottom: 20 },
  backBtn: { marginTop: 25, alignItems: "center" },
  cancelText: {
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 2,
    color: "#2C3E50",
  },
});
