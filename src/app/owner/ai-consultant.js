import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";
import { generateAIResponse } from "../../services/aiService";

export default function OwnerAiConsultant() {
  const { userData } = useAuth();
  const { colors } = useTheme();
  const router = useRouter();

  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef();

  // 🛡️ AUTO-NOTIFY & REAL-TIME SYNC ON LOAD
  useEffect(() => {
    const triggerInitialIntelligence = async () => {
      setLoading(true);
      const systemPrompt = `
        Role: Strategic Business AI. 
        Context: Restaurant Owner is at ${userData?.location?.city || "Current Location"}.
        Task: 
        1. Check weather for the next 3 hours. If rain/storm is likely, start with "⚠️ WEATHER ALERT".
        2. Provide a 1-sentence market trend for this specific area.
        3. Keep response professional and strictly about restaurant operations.
      `;
      
      try {
        const response = await generateAIResponse(systemPrompt);
        setMessages([{ id: "1", text: response, sender: "ai" }]);
      } catch (error) {
        setMessages([{ id: "1", text: "Systems Active. Real-time data sync in progress...", sender: "ai" }]);
      } finally {
        setLoading(false);
      }
    };
    triggerInitialIntelligence();
  }, []);

  const handleSendMessage = async () => {
    if (!inputText.trim() || loading) return;

    const userMessage = { id: Date.now().toString(), text: inputText, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    const currentInput = inputText;
    setInputText("");
    setLoading(true);

    // 🧠 DOMAIN-SPECIFIC LOGIC (Privacy & Scope)
    const securePrompt = `
      Boundary Instructions:
      - You are an AI Consultant for this Global Restaurant App.
      - Topic Scope: ONLY Market Trends, Weather, Logistics, and Business Strategy.
      - Privacy: NEVER reveal customer personal info or internal admin credentials.
      - Limitation: If the user asks for recipes or non-business/non-app topics, politely decline and redirect to business goals.
      - User Query: ${currentInput}
    `;

    try {
      const response = await generateAIResponse(securePrompt);
      setMessages((prev) => [...prev, { id: Date.now().toString(), text: response, sender: "ai" }]);
    } catch (error) {
      setMessages((prev) => [...prev, { id: Date.now().toString(), text: "Neural Link Busy. Try again.", sender: "ai" }]);
    } finally {
      setLoading(false);
    }
  };

  const renderMessage = ({ item }) => (
    <Animatable.View
      animation={item.sender === "user" ? "fadeInRight" : "fadeInLeft"}
      duration={500}
      style={[
        styles.messageBubble,
        item.sender === "user" ? styles.userBubble : [styles.aiBubble, { borderColor: colors.primary }],
      ]}
    >
      <Text style={[styles.messageText, { color: item.sender === "user" ? colors.primary : "#EEE" }]}>
        {item.text}
      </Text>
    </Animatable.View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER SECTION */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={26} color="#FFF" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>AI STRATEGIC RADAR</Text>
          <View style={styles.statusRow}>
            <View style={[styles.pulseDot, { backgroundColor: loading ? "#FF3B30" : colors.primary }]} />
            <Text style={[styles.statusText, { color: loading ? "#FF3B30" : colors.primary }]}>
              {loading ? "ANALYZING REAL-TIME..." : "SECURE LINK ACTIVE"}
            </Text>
          </View>
        </View>
        <Ionicons name="shield-half-outline" size={22} color={colors.primary} />
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        contentContainerStyle={styles.chatContent}
        onContentSizeChange={() => flatListRef.current.scrollToEnd()}
      />

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={100}>
        <View style={styles.inputArea}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Ask about Market, Weather or Admin..."
              placeholderTextColor="#333"
              value={inputText}
              onChangeText={setInputText}
              editable={!loading}
            />
            <TouchableOpacity onPress={handleSendMessage} disabled={loading} style={[styles.sendBtn, { backgroundColor: colors.primary }]}>
              {loading ? <ActivityIndicator size="small" color="#000" /> : <Ionicons name="pulse-outline" size={20} color="#000" />}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 20, borderBottomWidth: 1, borderBottomColor: "#111" },
  headerTitleContainer: { alignItems: "center" },
  headerTitle: { color: "#FFF", fontSize: 10, fontWeight: "900", letterSpacing: 3 },
  statusRow: { flexDirection: "row", alignItems: "center", marginTop: 4 },
  pulseDot: { width: 4, height: 4, borderRadius: 2, marginRight: 5 },
  statusText: { fontSize: 7, fontWeight: "bold", letterSpacing: 1 },
  chatContent: { padding: 25, paddingBottom: 40 },
  messageBubble: { maxWidth: "85%", padding: 20, borderRadius: 22, marginBottom: 20 },
  userBubble: { alignSelf: "flex-end", backgroundColor: "#111", borderBottomRightRadius: 2, borderWidth: 1, borderColor: "#222" },
  aiBubble: { alignSelf: "flex-start", backgroundColor: "#050505", borderBottomLeftRadius: 2, borderWidth: 1 },
  messageText: { fontSize: 14, lineHeight: 22, fontWeight: "500" },
  inputArea: { padding: 25, backgroundColor: "#000" },
  inputContainer: { flexDirection: "row", alignItems: "center", backgroundColor: "#080808", borderRadius: 20, paddingHorizontal: 20, paddingVertical: 12, borderWidth: 1, borderColor: "#111" },
  input: { flex: 1, color: "#FFF", fontSize: 13 },
  sendBtn: { width: 40, height: 40, borderRadius: 12, justifyContent: "center", alignItems: "center", marginLeft: 15 },
});
