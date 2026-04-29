import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Linking,
} from "react-native";
import { useTheme } from "../../context/ThemeContext";

export default function AboutApp() {
  const { colors } = useTheme();

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView contentContainerStyle={{ padding: 25 }}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.primary }]}>
            DINING TABLE
          </Text>
          <Text style={{ color: colors.textDim, fontSize: 12 }}>
            Version 1.0.4 (Stable)
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.label, { color: colors.primary }]}>
            ABOUT THE PLATFORM
          </Text>
          <Text style={[styles.description, { color: colors.textMain }]}>
            DiningTable is a premium ecosystem designed for seamless delivery
            and dine-in experiences. We bridge the gap between quality food
            partners and elite customers with a focus on modernity and
            efficiency.
          </Text>
        </View>

        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        <TouchableOpacity style={styles.linkRow} onPress={() => {}}>
          <Text style={{ color: colors.textMain }}>Privacy Policy</Text>
          <Text style={{ color: colors.primary }}>→</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.linkRow} onPress={() => {}}>
          <Text style={{ color: colors.textMain }}>Terms of Service</Text>
          <Text style={{ color: colors.primary }}>→</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.linkRow} onPress={() => {}}>
          <Text style={{ color: colors.textMain }}>Developer Credits</Text>
          <Text style={{ color: colors.textDim }}>AB&CP Digital</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text
            style={{ color: colors.textDim, fontSize: 10, textAlign: "center" }}
          >
            © 2026 DiningTable. All rights reserved.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { alignItems: "center", marginVertical: 40 },
  title: { fontSize: 32, fontWeight: "300", letterSpacing: 8 },
  section: { marginBottom: 30 },
  label: {
    fontSize: 10,
    fontWeight: "bold",
    letterSpacing: 2,
    marginBottom: 15,
  },
  description: { fontSize: 14, lineHeight: 22, opacity: 0.8 },
  divider: { height: 1, width: "100%", marginBottom: 20 },
  linkRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 20,
    borderBottomWidth: 0.5,
    borderBottomColor: "#2C2C2E",
  },
  footer: { marginTop: 100 },
});
