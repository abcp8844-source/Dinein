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
import PremiumButton from "../../components/PremiumButton";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";

export default function Wallet() {
  const { userData, loading: authLoading } = useAuth();
  const { colors } = useTheme();

  // REAL DATA SYNC: No more dummy state, taking from AuthContext directly
  const balance = userData?.walletBalance || 0;
  const currency = userData?.currencyCode || "USD";
  const country = userData?.idOrigin || "Global"; // Updated to match Register.js logic

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
          {authLoading ? (
            <ActivityIndicator
              color={colors.primary || "#D4AF37"}
              style={{ marginVertical: 20 }}
            />
          ) : (
            <View style={styles.amountRow}>
              <Text style={styles.balanceAmount}>
                {balance.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}
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
          <Text style={styles.sectionTitle}>
            LOCAL GATEWAYS ACTIVE ({country.toUpperCase()})
          </Text>
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
          <PremiumButton
            title="TOP UP WALLET"
            onPress={() => {
              /* Link to Real Payment Processor */
            }}
          />
          <Text style={styles.safetyDisclaimer}>
            ENCRYPTED SETTLEMENTS FOR {country.toUpperCase()}.
          </Text>
        </Animatable.View>
      </ScrollView>
    </SafeAreaView>
  );
}
// Styles remain same as your provided code
