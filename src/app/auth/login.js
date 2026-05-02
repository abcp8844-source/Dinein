import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Dimensions,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../theme/ThemeContext";
import PremiumButton from "../../components/PremiumButton";
import PremiumInput from "../../components/PremiumInput";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";

const { width } = Dimensions.get("window");

export default function UnifiedLogin() {
  const [activeTab, setActiveTab] = useState("customer");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { login } = useAuth();
  const { colors } = useTheme();
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("REQUIRED", "Please enter your identity credentials.");
      return;
    }

    try {
      // Login logic will detect the node from these 20 countries
      await login(email, password, activeTab);

      // Strict Routing based on roles
      router.replace(
        activeTab === "customer" ? "/(customer)/home" : "/(owner)/home",
      );
    } catch (error) {
      Alert.alert("AUTH ERROR", "Invalid credentials for this global node.");
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: "#000" }]}>
      <StatusBar barStyle="light-content" />

      {/* 🏆 MODERN PREMIUM TABS */}
      <View style={styles.gatewayWrapper}>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === "customer" && styles.activeTabStyle,
          ]}
          onPress={() => setActiveTab("customer")}
        >
          <MaterialCommunityIcons
            name="silverware-fork-knife"
            size={32}
            color={activeTab === "customer" ? "#D4AF37" : "#333"}
          />
          <Text
            style={[
              styles.tabLabel,
              { color: activeTab === "customer" ? "#FFF" : "#444" },
            ]}
          >
            CUSTOMER
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === "owner" && styles.activeTabStyle]}
          onPress={() => setActiveTab("owner")}
        >
          <MaterialCommunityIcons
            name="chef-hat"
            size={32}
            color={activeTab === "owner" ? "#D4AF37" : "#333"}
          />
          <Text
            style={[
              styles.tabLabel,
              { color: activeTab === "owner" ? "#FFF" : "#444" },
            ]}
          >
            MERCHANT
          </Text>
        </TouchableOpacity>
      </View>

      <Animatable.View
        animation="fadeInUp"
        duration={1200}
        style={styles.content}
      >
        <Text style={styles.entryText}>
          {activeTab === "customer"
            ? "ACCESS DINING TABLE"
            : "PARTNER TERMINAL"}
        </Text>
        <View style={styles.goldLine} />

        <View style={styles.inputGap}>
          <PremiumInput
            placeholder="Global Identity (Email)"
            value={email}
            onChangeText={setEmail}
          />
          <View style={{ height: 15 }} />
          <PremiumInput
            placeholder="Security Key"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        {/* Forgot Password Link - Identity Based */}
        <TouchableOpacity
          onPress={() => router.push("/(auth)/forgot-password")}
          style={{ alignSelf: "flex-end", marginBottom: 20 }}
        >
          <Text style={{ color: "#444", fontSize: 11 }}>
            Forgot Security Key?
          </Text>
        </TouchableOpacity>

        <PremiumButton
          title={activeTab === "customer" ? "SIGN IN" : "MERCHANT LOGIN"}
          onPress={handleLogin}
        />

        <TouchableOpacity
          style={styles.registerLink}
          onPress={() => router.push("/(auth)/register")}
        >
          <Text style={styles.footerText}>
            {activeTab === "owner"
              ? "Interested in Partnership?"
              : "Don't have a profile?"}
            <Text style={styles.goldText}> REGISTER</Text>
          </Text>
        </TouchableOpacity>
      </Animatable.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 25, justifyContent: "center" },
  gatewayWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 60,
    backgroundColor: "#0A0A0A",
    borderRadius: 25,
    padding: 10,
    borderWidth: 1,
    borderColor: "#111",
  },
  tab: {
    width: "48%",
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
  },
  activeTabStyle: {
    backgroundColor: "#111",
    borderWidth: 1,
    borderColor: "#D4AF3733",
    shadowColor: "#D4AF37",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: "900",
    marginTop: 10,
    letterSpacing: 2,
  },
  content: { width: "100%" },
  entryText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "300",
    letterSpacing: 4,
    textAlign: "center",
  },
  goldLine: {
    width: 30,
    height: 2,
    backgroundColor: "#D4AF37",
    alignSelf: "center",
    marginVertical: 20,
  },
  inputGap: { marginVertical: 10 },
  registerLink: { marginTop: 30, alignItems: "center" },
  footerText: { color: "#666", fontSize: 11, letterSpacing: 1 },
  goldText: { color: "#D4AF37", fontWeight: "bold" },
});
