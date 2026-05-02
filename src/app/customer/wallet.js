import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  StatusBar,
} from "react-native";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../theme/ThemeContext";
import { dbService } from "../../services/dbService";
import PremiumButton from "../../components/PremiumButton";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";

/**
 * RESTORED: Wallet & Liquidity Registry
 * Logic: Asset Balance Sync & Dynamic Gateway Mapping
 * Feature: Secured Settlement Nodes for 20 Locked Global Markets
 * Integrity: Aligned with the finalized "Locked" market list including Italy and Canada.
 */
export default function Wallet() {
  const { userData } = useAuth();
  const { colors } = useTheme();
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  const currency = userData?.currencyCode || "USD";
  const country = userData?.countryName || "Global";

  useEffect(() => {
    fetchWalletState();
  }, []);

  const fetchWalletState = async () => {
    try {
      const bal = await dbService.getWalletBalance(userData?.uid);
      setBalance(bal || 0);
    } catch (error) {
      console.error("Wallet Sync Error:", error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 🛡️ SECURED GATEWAY MAPPING
   * Verified for 20 Core Markets: Thailand, China, Singapore, Turkey, US, UK, UAE, Saudi Arabia,
   * Japan, South Korea, Germany, France, Italy, Canada, Malaysia, Indonesia, Vietnam, Hong Kong,
   * Australia, and Switzerland.
   */
  const getGlobalPaymentMethods = () => {
    const methods = {
      Thailand: ["PROMPTPAY QR", "TRUEMONEY"],
      China: ["ALIPAY", "WECHAT PAY"],
      Singapore: ["PAYNOW", "GRABPAY"],
      Turkey: ["PARAM", "PAPARA"],
      "United States": ["APPLE PAY", "STRIPE"],
      "United Kingdom": ["REVOLUT", "BARCLAYS"],
      "United Arab Emirates": ["APPLE PAY", "ETISALAT"],
      "Saudi Arabia": ["MADA", "STC PAY"],
      Japan: ["LINE PAY", "PAYPAY"],
      "South Korea": ["KAKAO PAY", "NAVER PAY"],
      Germany: ["GIROPAY", "SOFORT"],
      France: ["CARTE BANCAIRE"],
      Italy: ["POSTEPAY", "SATISPAY"],
      Canada: ["INTERAC", "APPLE PAY"],
      Malaysia: ["DUITNOW", "TOUCH N GO"],
      Indonesia: ["GOPAY", "OVO"],
      Vietnam: ["MOMO", "ZALOPAY"],
      "Hong Kong": ["OCTOPUS", "FPS"],
      Australia: ["AFTERPAY", "POLI"],
      Switzerland: ["TWINT"],
      Global: ["VISA/MASTERCARD", "SECURE GATEWAY"],
    };

    return methods[country] || methods["Global"];
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: "#020B18" }]}>
      <StatusBar barStyle="light-content" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 25 }}
      >
        <Animatable.View animation="fadeInDown" style={styles.headerArea}>
          <Text
            style={[styles.headerLabel, { color: colors.primary || "#D4AF37" }]}
          >
            LIQUIDITY HUB
          </Text>
          <View
            style={[
              styles.goldLine,
              { backgroundColor: colors.primary || "#D4AF37" },
            ]}
          />
        </Animatable.View>

        <Animatable.View
          animation="zoomIn"
          style={[
            styles.balanceCard,
            { backgroundColor: "#051121", borderColor: "#0A1A2F" },
          ]}
        >
          <Text style={styles.balanceTitle}>SECURE ASSET BALANCE</Text>
          {loading ? (
            <ActivityIndicator
              color={colors.primary || "#D4AF37"}
              style={{ marginVertical: 20 }}
            />
          ) : (
            <View style={styles.amountRow}>
              <Text style={styles.balanceAmount}>
                {balance.toLocaleString()}
              </Text>
              <Text
                style={[
                  styles.currencyCode,
                  { color: colors.primary || "#D4AF37" },
                ]}
              >
                {currency}
              </Text>
            </View>
          )}
        </Animatable.View>

        <Animatable.View
          animation="fadeInUp"
          delay={400}
          style={styles.gatewaySection}
        >
          <Text style={styles.sectionTitle}>LOCAL GATEWAYS ACTIVE</Text>
          {getGlobalPaymentMethods().map((method, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.methodItem, { borderBottomColor: "#0A1A2F" }]}
              activeOpacity={0.7}
            >
              <View style={styles.methodMain}>
                <MaterialCommunityIcons
                  name="shield-check"
                  size={18}
                  color={colors.primary || "#D4AF37"}
                />
                <Text style={styles.methodName}>{method}</Text>
              </View>
              <Text
                style={[
                  styles.linkText,
                  { color: colors.primary || "#D4AF37" },
                ]}
              >
                SECURE LINK
              </Text>
            </TouchableOpacity>
          ))}
        </Animatable.View>

        <Animatable.View animation="fadeInUp" delay={600} style={styles.footer}>
          <PremiumButton title="TOP UP WALLET" onPress={() => {}} />
          <Text style={styles.safetyDisclaimer}>
            ENCRYPTED SETTLEMENTS FOR {country.toUpperCase()}.
          </Text>
        </Animatable.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerArea: { marginTop: 30, marginBottom: 40, alignItems: "center" },
  headerLabel: { fontSize: 11, fontWeight: "900", letterSpacing: 4 },
  goldLine: { width: 40, height: 2, marginTop: 10 },
  balanceCard: {
    padding: 35,
    borderRadius: 30,
    borderWidth: 1,
    alignItems: "center",
  },
  balanceTitle: {
    color: "#5D6D7E",
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 2,
    marginBottom: 15,
  },
  amountRow: { flexDirection: "row", alignItems: "baseline" },
  balanceAmount: { color: "#FFF", fontSize: 45, fontWeight: "200" },
  currencyCode: { fontSize: 16, fontWeight: "900", marginLeft: 10 },
  gatewaySection: { marginTop: 40 },
  sectionTitle: {
    color: "#2C3E50",
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 2,
    marginBottom: 20,
  },
  methodItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 22,
    borderBottomWidth: 1,
  },
  methodMain: { flexDirection: "row", alignItems: "center" },
  methodName: {
    color: "#FFF",
    fontSize: 11,
    fontWeight: "700",
    marginLeft: 12,
    letterSpacing: 1,
  },
  linkText: { fontSize: 9, fontWeight: "900" },
  footer: { marginTop: 50, alignItems: "center" },
  safetyDisclaimer: {
    color: "#1B2631",
    fontSize: 8,
    fontWeight: "900",
    textAlign: "center",
    marginTop: 25,
    letterSpacing: 1,
  },
});
