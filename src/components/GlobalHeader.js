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
  const { userData, updateGlobalPreference } = useAuth();
  
  const currentMarket =
    MARKET_REGISTRY.find((m) => m.iso === userData?.isoCode) || MARKET_REGISTRY[0];

  return (
    <View style={styles.headerBody}>
      <View style={styles.topSection}>
        <View style={styles.branding}>
          <Text style={styles.flagLarge}>{currentMarket.flag}</Text>
          <View>
            {/* Back to your original App Name */}
            <Text style={styles.brandTitle}>DINING TABLE</Text>
            <Text style={styles.regionName}>{currentMarket.name.toUpperCase()}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.langTrigger}
          onPress={() =>
            updateGlobalPreference({
              preferredLang: userData?.appLang === "EN" ? currentMarket.langCode : "EN",
            })
          }
        >
          <Text style={styles.langLabel}>SYSTEM LANGUAGE</Text>
          <Text style={styles.langValue}>
            {userData?.appLang === "EN" ? "ENGLISH" : "LOCALIZED"}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.marketBar}>
        <Text style={styles.barLabel}>OPERATIONAL NODES</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {MARKET_REGISTRY.map((item) => (
            <TouchableOpacity
              key={item.iso}
              style={[
                styles.node, 
                userData?.isoCode === item.iso && styles.activeNode
              ]}
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
                  userData?.isoCode === item.iso && { color: "#D4AF37" },
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
    paddingTop: 45,
    borderBottomWidth: 1,
    borderBottomColor: "#1B2631",
  },
  topSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  branding: { flexDirection: "row", alignItems: "center" },
  flagLarge: { fontSize: 28, marginRight: 12 },
  brandTitle: {
    color: "#FFF",
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 3,
  },
  regionName: {
    color: "#D4AF37",
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 1,
    marginTop: 2,
  },
  langTrigger: { alignItems: "flex-end" },
  langLabel: {
    color: "#5D6D7E",
    fontSize: 7,
    fontWeight: "900",
    letterSpacing: 1,
  },
  langValue: {
    color: "#D4AF37",
    fontSize: 10,
    fontWeight: "bold",
    marginTop: 3,
  },
  marketBar: { paddingLeft: 20, marginBottom: 15 },
  barLabel: {
    color: "#5D6D7E",
    fontSize: 7,
    fontWeight: "900",
    marginBottom: 12,
    letterSpacing: 1.5,
  },
  node: {
    alignItems: "center",
    marginRight: 25,
    paddingBottom: 10,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  activeNode: { borderBottomColor: "#D4AF37" },
  nodeFlag: { fontSize: 20, marginBottom: 5 },
  nodeIso: { color: "#FFF", fontSize: 10, fontWeight: "900" },
});
