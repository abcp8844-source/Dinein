import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useTheme } from "../theme/ThemeContext";

const MARKETS = [
  { id: "THA", name: "Thailand", flag: "🇹🇭" },
  { id: "ARE", name: "UAE", flag: "🇦🇪" },
  { id: "USA", name: "USA", flag: "🇺🇸" },
  { id: "GBR", name: "UK", flag: "🇬🇧" },
  { id: "CHN", name: "China", flag: "🇨🇳" },
  { id: "JPN", name: "Japan", flag: "🇯🇵" },
  { id: "KOR", name: "S.Korea", flag: "🇰🇷" },
  { id: "SGP", name: "Singapore", flag: "🇸🇬" },
  { id: "MYS", name: "Malaysia", flag: "🇲🇾" },
  { id: "IDN", name: "Indonesia", flag: "🇮🇩" },
  { id: "VNM", name: "Vietnam", flag: "🇻🇳" },
  { id: "SAU", name: "Saudi Arabia", flag: "🇸🇦" },
  { id: "HKG", name: "Hong Kong", flag: "🇭🇰" },
  { id: "DEU", name: "Germany", flag: "🇩🇪" },
  { id: "FRA", name: "France", flag: "🇫🇷" },
];

export default function GlobalHeader() {
  const { colors } = useTheme();
  const [selectedMarket, setSelectedMarket] = useState(MARKETS[0]);
  const [currentLang, setCurrentLang] = useState("EN");

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
          borderBottomColor: colors.border,
        },
      ]}
    >
      <View style={styles.topRow}>
        <View style={styles.profileArea}>
          <View style={[styles.avatar, { backgroundColor: colors.primary }]} />
          <Text style={[styles.welcomeText, { color: colors.textMain }]}>
            Welcome, Partner
          </Text>
        </View>

        <TouchableOpacity
          style={styles.langSelector}
          onPress={() => setCurrentLang(currentLang === "EN" ? "UR" : "EN")}
        >
          <Text style={[styles.langLabel, { color: colors.textDim }]}>
            LANGUAGE:
          </Text>
          <Text style={[styles.langActive, { color: colors.primary }]}>
            {currentLang === "EN" ? "ENGLISH" : "URDU"}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.marketBar}>
        <Text style={[styles.marketTitle, { color: colors.textDim }]}>
          SELECT OPERATIONAL MARKET:
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {MARKETS.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.flagBtn,
                selectedMarket.id === item.id && {
                  borderBottomColor: colors.primary,
                },
              ]}
              onPress={() => setSelectedMarket(item)}
            >
              <Text style={styles.flagIcon}>{item.flag}</Text>
              <Text
                style={[
                  styles.flagText,
                  {
                    color:
                      selectedMarket.id === item.id
                        ? colors.primary
                        : colors.textDim,
                  },
                ]}
              >
                {item.id}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View
        style={[
          styles.statusNode,
          { backgroundColor: "#050505", borderTopColor: colors.border },
        ]}
      >
        <Text style={[styles.nodeText, { color: colors.textDim }]}>
          CONNECTED:{" "}
          <Text style={{ color: colors.primary }}>
            {selectedMarket.name.toUpperCase()}
          </Text>
        </Text>
        <Text style={[styles.nodeText, { color: colors.textDim }]}>
          SYSTEM: <Text style={{ color: colors.primary }}>{currentLang}</Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingTop: 10, borderBottomWidth: 1 },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  profileArea: { flexDirection: "row", alignItems: "center" },
  avatar: {
    width: 35,
    height: 35,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  welcomeText: { fontSize: 12, fontWeight: "bold", marginLeft: 10 },
  langSelector: { alignItems: "flex-end" },
  langLabel: { fontSize: 8, fontWeight: "900", letterSpacing: 1 },
  langActive: { fontSize: 11, fontWeight: "bold" },
  marketBar: { paddingLeft: 20, marginBottom: 15 },
  marketTitle: {
    fontSize: 8,
    fontWeight: "900",
    marginBottom: 8,
    letterSpacing: 1,
  },
  flagBtn: {
    alignItems: "center",
    marginRight: 15,
    paddingBottom: 5,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  flagIcon: { fontSize: 22, marginBottom: 2 },
  flagText: { fontSize: 9, fontWeight: "bold" },
  statusNode: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderTopWidth: 1,
  },
  nodeText: { fontSize: 8, fontWeight: "900" },
});
