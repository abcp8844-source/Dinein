import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../theme/ThemeContext";
import { aiService } from "../../services/aiService";
import { db } from "../../firebaseConfig"; // Direct Firebase Import
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { Ionicons } from "@expo/vector-icons";

/**
 * GLOBAL SUPPORT NODE
 * Purpose: AI-Powered Assistance with Admin Escalation
 * Access: Customer & Owner Shared
 */
export default function SupportScreen() {
  const { userData, user } = useAuth();
  const { colors } = useTheme();

  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [escalate, setEscalate] = useState(false);

  // Phase 1: AI Generated Assistance
  const handleSupportRequest = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setEscalate(false);
    try {
      const aiResult = await aiService.generateResponse(
        query,
        userData?.role || "User",
      );
      setResponse(aiResult);

      // Trigger escalation if AI suggests human help or fails
      const triggers = ["admin", "human", "manual", "stuck", "failed", "help"];
      if (triggers.some((word) => aiResult.toLowerCase().includes(word))) {
        setEscalate(true);
      }
    } catch (error) {
      setResponse("AI Node Offline. Manual escalation required.");
      setEscalate(true);
    } finally {
      setLoading(false);
    }
  };

  // Phase 2: Direct Admin Ticket Generation
  const notifyAdmin = async () => {
    if (!user?.uid) return;
    setLoading(true);
    try {
      await addDoc(collection(db, "support_tickets"), {
        userId: user.uid,
        userEmail: user.email,
        message: query,
        role: userData?.role || "unknown",
        status: "pending",
        timestamp: serverTimestamp(),
      });

      Alert.alert("TICKET CREATED", "Your issue has been forwarded to Admin.");
      setQuery("");
      setResponse("");
      setEscalate(false);
    } catch (e) {
      Alert.alert("NETWORK ERROR", "Failed to reach Admin Node.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={[styles.brand, { color: colors.primary }]}>
            CORE SUPPORT
          </Text>
          <Text style={[styles.sub, { color: colors.textDim }]}>
            ENCRYPTED ASSISTANCE NODE
          </Text>
        </View>

        {/* AI Output Area */}
        <View
          style={[
            styles.box,
            { backgroundColor: colors.cardBg, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.label, { color: colors.primary }]}>
            SYSTEM RESPONSE
          </Text>
          <Text style={[styles.text, { color: colors.textMain }]}>
            {response || "Standing by for user input..."}
          </Text>

          {escalate && (
            <TouchableOpacity
              style={[styles.btnAdmin, { backgroundColor: colors.primary }]}
              onPress={notifyAdmin}
            >
              <Text style={styles.btnText}>TALK TO ADMIN</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* User Input Area */}
        <View style={styles.inputRow}>
          <TextInput
            style={[
              styles.input,
              {
                color: colors.textMain,
                borderColor: colors.border,
                backgroundColor: colors.inputBg,
              },
            ]}
            placeholder="Describe your issue..."
            placeholderTextColor={colors.textDim}
            value={query}
            onChangeText={setQuery}
            multiline
          />
          <TouchableOpacity
            style={[styles.btnSend, { backgroundColor: colors.primary }]}
            onPress={handleSupportRequest}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#000" />
            ) : (
              <Ionicons name="send" size={20} color="#000" />
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: { padding: 25 },
  header: { marginTop: 20, marginBottom: 30, alignItems: "center" },
  brand: { fontSize: 18, fontWeight: "900", letterSpacing: 4 },
  sub: {
    fontSize: 8,
    fontWeight: "700",
    letterSpacing: 2,
    marginTop: 5,
    opacity: 0.6,
  },
  box: {
    padding: 25,
    borderRadius: 20,
    borderWidth: 1,
    minHeight: 180,
    justifyContent: "center",
  },
  label: { fontSize: 8, fontWeight: "900", marginBottom: 15, letterSpacing: 1 },
  text: { fontSize: 14, lineHeight: 22, fontWeight: "500" },
  inputRow: { flexDirection: "row", gap: 12, marginTop: 25 },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 15,
    padding: 15,
    fontSize: 14,
    minHeight: 55,
  },
  btnSend: {
    width: 55,
    height: 55,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  btnAdmin: {
    marginTop: 20,
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
  },
  btnText: { color: "#000", fontWeight: "900", fontSize: 10, letterSpacing: 1 },
});
