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
} from "react-native";
import { useAuth } from "../../src/context/AuthContext";
import { useTheme } from "../../src/theme/ThemeContext";
import { aiService } from "../../src/services/aiService";
import { dbService } from "../../src/services/dbService";
import { Ionicons } from "@expo/vector-icons";

export default function SupportScreen() {
  const { userData, user } = useAuth();
  const { colors } = useTheme();

  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [escalate, setEscalate] = useState(false);

  const handleSupportRequest = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setEscalate(false);
    try {
      const aiResult = await aiService.generateResponse(
        query,
        userData?.role || "Guest",
      );
      setResponse(aiResult);
      const triggers = ["admin", "human", "manual", "stuck", "failed"];
      if (triggers.some((word) => aiResult.toLowerCase().includes(word))) {
        setEscalate(true);
      }
    } catch (error) {
      setResponse("AI Node Offline. Contact Admin.");
      setEscalate(true);
    } finally {
      setLoading(false);
    }
  };

  const notifyAdmin = async () => {
    setLoading(true);
    try {
      await dbService.sendSupportTicket({
        uid: user.uid,
        query: query,
        role: userData?.role,
        timestamp: new Date().toISOString(),
      });
      Alert.alert("Success", "Admin notified.");
      setQuery("");
      setResponse("");
      setEscalate(false);
    } catch (e) {
      Alert.alert("Error", "Failed to connect.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={[styles.brand, { color: colors.primary }]}>SUPPORT</Text>
        <Text style={[styles.sub, { color: colors.textDim }]}>SECURE NODE</Text>
      </View>

      <View
        style={[
          styles.box,
          { backgroundColor: colors.cardBg, borderColor: colors.border },
        ]}
      >
        <Text style={[styles.label, { color: colors.primary }]}>RESPONSE</Text>
        <Text style={[styles.text, { color: colors.textMain }]}>
          {response || "System Ready."}
        </Text>
        {escalate && (
          <TouchableOpacity
            style={[styles.btnAdmin, { backgroundColor: colors.primary }]}
            onPress={notifyAdmin}
          >
            <Text style={styles.btnText}>ESCALATE</Text>
          </TouchableOpacity>
        )}
      </View>

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
          placeholder="Issue details..."
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
            <Ionicons name="flash" size={18} color="#000" />
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { marginTop: 40, marginBottom: 20, alignItems: "center" },
  brand: { fontSize: 20, fontWeight: "bold", letterSpacing: 3 },
  sub: { fontSize: 7, fontWeight: "900", letterSpacing: 2, marginTop: 4 },
  box: { padding: 20, borderRadius: 15, borderWidth: 1, minHeight: 140 },
  label: { fontSize: 7, fontWeight: "900", marginBottom: 10 },
  text: { fontSize: 13, lineHeight: 20 },
  inputRow: { flexDirection: "row", gap: 8, marginTop: 20, marginBottom: 30 },
  input: {
    flex: 1,
    borderWidth: 0.5,
    borderRadius: 12,
    padding: 12,
    fontSize: 13,
  },
  btnSend: {
    width: 50,
    height: 50,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  btnAdmin: {
    marginTop: 15,
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  btnText: { color: "#000", fontWeight: "bold", fontSize: 9 },
});
