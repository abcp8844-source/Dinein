import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import { MARKET_REGISTRY } from "../constants/market-registry";

export default function GlobalHeader() {
  const { marketISO, appLang, updateGlobalPreference } = useAuth();
  const currentMarket =
    MARKET_REGISTRY.find((m) => m.iso === marketISO) || MARKET_REGISTRY[0];

  return (
    <View style={styles.headerBody}>
      {/* LANGUAGE SELECTOR (Available everywhere) */}
      <View style={styles.topSection}>
        <View style={styles.branding}>
          <Text style={styles.flagLarge}>{currentMarket.flag}</Text>
          <Text style={styles.brandTitle}>DINING TABLE</Text>
        </View>

        <TouchableOpacity
          style={styles.langTrigger}
          onPress={() =>
            updateGlobalPreference({
              preferredLang: appLang === "EN" ? currentMarket.langCode : "EN",
            })
          }
        >
          <Text style={styles.langLabel}>SWITCH LANGUAGE</Text>
          <Text style={styles.langText}>
            {appLang === "EN"
              ? "ENGLISH"
              : currentMarket.nativeLang.toUpperCase()}
          </Text>
        </TouchableOpacity>
      </View>

      {/* MARKET SELECTOR BAR (For selection) */}
      <View style={styles.marketBar}>
        <Text style={styles.barLabel}>SELECT OPERATIONAL REGION</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {MARKET_REGISTRY.map((item) => (
            <TouchableOpacity
              key={item.iso}
              style={[styles.node, marketISO === item.iso && styles.activeNode]}
              onPress={() =>
                updateGlobalPreference({
                  isoCode: item.iso,
                  currencyCode: item.currency,
                  preferredLang: item.langCode,
                })
              }
            >
              <Text style={styles.nodeFlag}>{item.flag}</Text>
              <Text
                style={[
                  styles.nodeIso,
                  marketISO === item.iso && { color: "#D4AF37" },
                ]}
              >
                {item.iso}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerBody: {
    backgroundColor: "#020B18",
    paddingTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#1A2A3A",
  },
  topSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  branding: { flexDirection: "row", alignItems: "center" },
  flagLarge: { fontSize: 24, marginRight: 10 },
  brandTitle: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "200",
    letterSpacing: 4,
  },
  langTrigger: { alignItems: "flex-end" },
  langLabel: {
    color: "#5D6D7E",
    fontSize: 7,
    fontWeight: "900",
    letterSpacing: 1,
  },
  langText: {
    color: "#D4AF37",
    fontSize: 10,
    fontWeight: "bold",
    marginTop: 2,
  },
  marketBar: { paddingLeft: 20, marginBottom: 10 },
  barLabel: {
    color: "#5D6D7E",
    fontSize: 7,
    fontWeight: "900",
    marginBottom: 10,
    letterSpacing: 1,
  },
  node: {
    alignItems: "center",
    marginRight: 22,
    paddingBottom: 8,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  activeNode: { borderBottomColor: "#D4AF37" },
  nodeFlag: { fontSize: 18, marginBottom: 4 },
  nodeIso: { color: "#FFF", fontSize: 10, fontWeight: "900" },
});
