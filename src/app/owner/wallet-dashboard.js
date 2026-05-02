import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Alert,
  StatusBar,
} from "react-native";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../theme/ThemeContext";
import * as Animatable from "react-native-animatable";

export default function OwnerWallet() {
  const { userData } = useAuth();
  const { colors } = useTheme();

  const currency = userData?.currencyCode || "USD";
  const country = userData?.countryName || "Global Market";
  const marketISO = userData?.isoCode || "INTL";

  const [balance, setBalance] = useState(0.0);

  const handlePromotionDeduction = (cost) => {
    if (balance >= cost) {
      Alert.alert(
        "DINING TABLE SECURITY",
        `Confirm ${cost} ${currency} deduction for ${country} promotion.`,
        [
          {
            text: "AUTHORIZE",
            onPress: () => setBalance((prev) => prev - cost),
          },
          { text: "CANCEL", style: "cancel" },
        ],
      );
    } else {
      Alert.alert("MARKET ERROR", "Insufficient funds in your revenue node.");
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: "#020B18" }]}>
      <StatusBar barStyle="light-content" />
      <ScrollView showsVerticalScrollIndicator={false}>
        <Animatable.View
          animation="fadeInDown"
          style={[
            styles.header,
            { backgroundColor: "#051121", borderBottomColor: "#0A1A2F" },
          ]}
        >
          <View style={[styles.badge, { borderColor: colors.primary }]}>
            <Text style={[styles.badgeText, { color: colors.primary }]}>
              {marketISO} REGISTRY ACTIVE
            </Text>
          </View>

          <Text style={styles.label}>
            TOTAL SETTLED REVENUE ({country.toUpperCase()})
          </Text>
          <Text style={[styles.amount, { color: "#FFF" }]}>
            {balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}{" "}
            <Text style={[styles.currency, { color: colors.primary }]}>
              {currency}
            </Text>
          </Text>

          <View style={styles.syncStatus}>
            <Text style={styles.syncStatusText}>
              ● DINING TABLE NODE: ENCRYPTED
            </Text>
          </View>
        </Animatable.View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>PROMOTION ENGINE</Text>
          <TouchableOpacity
            style={[
              styles.promoCard,
              { backgroundColor: "#051121", borderColor: "#0A1A2F" },
            ]}
            onPress={() => handlePromotionDeduction(500)}
          >
            <View style={{ flex: 1 }}>
              <Text style={styles.promoTitle}>Market Wide Visibility</Text>
              <Text style={styles.promoDesc}>
                Priority placement in {country} market
              </Text>
            </View>
            <Text style={[styles.promoPrice, { color: colors.primary }]}>
              -{500} {currency}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            MARKET SETTLEMENTS ({marketISO})
          </Text>
          <div
            style={[
              styles.ledgerCard,
              { backgroundColor: "#051121", borderColor: "#0A1A2F" },
            ]}
          >
            <View style={[styles.ledgerRow, { borderBottomColor: "#0A1A2F" }]}>
              <View>
                <Text style={styles.orderId}>Order Settlement</Text>
                <Text style={styles.timeStamp}>Synced for: {country}</Text>
              </View>
              <Text style={styles.credit}>ACTIVE</Text>
            </View>
          </div>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 40, alignItems: "center", borderBottomWidth: 1 },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 15,
    borderWidth: 1,
  },
  badgeText: { fontSize: 8, fontWeight: "900", letterSpacing: 1 },
  label: { color: "#5D6D7E", fontSize: 9, fontWeight: "900", letterSpacing: 2 },
  amount: { fontSize: 38, fontWeight: "200", marginTop: 10 },
  currency: { fontSize: 16, fontWeight: "900" },
  syncStatus: {
    marginTop: 15,
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: "rgba(0,255,0,0.05)",
    borderRadius: 4,
  },
  syncStatusText: {
    color: "#00FF00",
    fontSize: 7,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  section: { marginTop: 30, paddingHorizontal: 25 },
  sectionTitle: {
    color: "#2C3E50",
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 2,
    marginBottom: 15,
  },
  promoCard: {
    padding: 20,
    borderRadius: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
  },
  promoTitle: { color: "#FFF", fontSize: 14, fontWeight: "bold" },
  promoDesc: { color: "#5D6D7E", fontSize: 9, marginTop: 4, fontWeight: "600" },
  promoPrice: { fontSize: 12, fontWeight: "900" },
  ledgerCard: { borderRadius: 20, padding: 20, borderWidth: 1 },
  ledgerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 18,
    borderBottomWidth: 1,
  },
  orderId: { color: "#FFF", fontSize: 12, fontWeight: "700" },
  timeStamp: { color: "#5D6D7E", fontSize: 8, marginTop: 4, fontWeight: "900" },
  credit: { color: "#00FF00", fontSize: 10, fontWeight: "900" },
});
