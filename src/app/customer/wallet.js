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
      console.error("FINANCIAL_SYNC_ERROR", error);
    } finally {
      setLoading(false);
    }
  };

  const getGlobalPaymentMethods = () => {
    const methods = {
      "Thailand": ["PROMPTPAY QR", "TRUEMONEY"],
      "China": ["ALIPAY", "WECHAT PAY"],
      "Singapore": ["PAYNOW", "GRABPAY"],
      "Turkey": ["PARAM", "PAPARA"],
      "United States": ["APPLE PAY", "STRIPE"],
      "United Kingdom": ["REVOLUT", "BARCLAYS"],
      "United Arab Emirates": ["APPLE PAY", "ETISALAT"],
      "Saudi Arabia": ["MADA", "STC PAY"],
      "Japan": ["LINE PAY", "PAYPAY"],
      "South Korea": ["KAKAO PAY", "NAVER PAY"],
      "Germany": ["GIROPAY", "SOFORT"],
      "France": ["CARTE BANCAIRE"],
      "Italy": ["POSTEPAY", "SATISPAY"],
      "Canada": ["INTERAC", "APPLE PAY"],
      "Malaysia": ["DUITNOW", "TOUCH N GO"],
      "Indonesia": ["GOPAY", "OVO"],
      "Vietnam": ["MOMO", "ZALOPAY"],
      "Hong Kong": ["OCTOPUS", "FPS"],
      "Australia": ["AFTERPAY", "POLI"],
      "Switzerland": ["TWINT"],
      "Global": ["VISA/MASTERCARD", "CRYPTO NODE"]
    };

    return methods[country] || methods["Global"];
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 25 }}>
        
        <Animatable.View animation="fadeInDown" style={styles.headerArea}>
          <Text style={styles.headerLabel}>GLOBAL LIQUIDITY HUB</Text>
          <View style={styles.goldLine} />
        </Animatable.View>

        <Animatable.View animation="zoomIn" style={styles.balanceCard}>
          <Text style={styles.balanceTitle}>SECURE BALANCE ({country.toUpperCase()})</Text>
          {loading ? (
            <ActivityIndicator color="#D4AF37" style={{ marginVertical: 20 }} />
          ) : (
            <View style={styles.amountRow}>
              <Text style={styles.balanceAmount}>{balance.toLocaleString()}</Text>
              <Text style={styles.currencyCode}>{currency}</Text>
            </View>
          )}
        </Animatable.View>

        <Animatable.View animation="fadeInUp" delay={400} style={styles.gatewaySection}>
          <Text style={styles.sectionTitle}>LOCAL GATEWAYS ACTIVE</Text>
          {getGlobalPaymentMethods().map((method, index) => (
            <TouchableOpacity key={index} style={styles.methodItem} activeOpacity={0.7}>
              <View style={styles.methodMain}>
                <MaterialCommunityIcons name="shield-check" size={18} color="#D4AF37" />
                <Text style={styles.methodName}>{method}</Text>
              </View>
              <Text style={styles.linkText}>SECURE LINK</Text>
            </TouchableOpacity>
          ))}
        </Animatable.View>

        <Animatable.View animation="fadeInUp" delay={600} style={styles.footer}>
          <PremiumButton title="TOP UP WALLET" onPress={() => {}} />
          <Text style={styles.safetyDisclaimer}>
            ENCRYPTED FINANCIAL SETTLEMENTS FOR {country.toUpperCase()}.
          </Text>
        </Animatable.View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  headerArea: { marginTop: 30, marginBottom: 40, alignItems: "center" },
  headerLabel: { color: "#D4AF37", fontSize: 11, fontWeight: "900", letterSpacing: 4 },
  goldLine: { width: 40, height: 1.5, backgroundColor: "#D4AF37", marginTop: 10 },
  balanceCard: { backgroundColor: "#0A0A0A", padding: 35, borderRadius: 25, borderWidth: 1, borderColor: "#111", alignItems: "center" },
  balanceTitle: { color: "#444", fontSize: 9, fontWeight: "900", letterSpacing: 2, marginBottom: 15 },
  amountRow: { flexDirection: "row", alignItems: "baseline" },
  balanceAmount: { color: "#FFF", fontSize: 45, fontWeight: "200" },
  currencyCode: { color: "#D4AF37", fontSize: 16, fontWeight: "900", marginLeft: 10 },
  gatewaySection: { marginTop: 40 },
  sectionTitle: { color: "#333", fontSize: 10, fontWeight: "900", letterSpacing: 2, marginBottom: 20 },
  methodItem: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 18, borderBottomWidth: 1, borderBottomColor: "#0A0A0A" },
  methodMain: { flexDirection: "row", alignItems: "center" },
  methodName: { color: "#BBB", fontSize: 11, fontWeight: "700", marginLeft: 12, letterSpacing: 1 },
  linkText: { color: "#D4AF37", fontSize: 9, fontWeight: "bold" },
  footer: { marginTop: 50, alignItems: "center" },
  safetyDisclaimer: { color: "#222", fontSize: 8, fontWeight: "bold", textAlign: "center", marginTop: 20, letterSpacing: 1 }
});
