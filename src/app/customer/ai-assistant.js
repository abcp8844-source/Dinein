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

export default function AiAssistant() {
  const { userData } = useAuth();
  const { colors } = useTheme();
  const router = useRouter();

  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef();

  useEffect(() => {
    const startAssistant = async () => {
      setLoading(true);
      const greetingPrompt = `
        Role: Customer Personal Food Assistant.
        Safety Level: High. 
        Context: Location ${userData?.location?.city || "Thailand"}.
        Privacy Rule: Never mention Admin panels, Owner earnings, or other users' private orders.
        Task: Start with a 1-line helpful greeting about discovering food in this area.
      `;
      try {
        const response = await generateAIResponse(greetingPrompt);
        setMessages([{ id: "1", text: response, sender: "ai" }]);
      } catch (error) {
        setMessages([{ id: "1", text: "Hello! I'm your food discovery partner. How can I help you today?", sender: "ai" }]);
      } finally {
        setLoading(false);
      }
    };
    startAssistant();
  }, []);

  const handleSendMessage = async () => {
    if (!inputText.trim() || loading) return;

    const userMsg = { id: Date.now().toString(), text: inputText, sender: "user" };
    setMessages((prev) => [...prev, userMsg]);
    const currentInput = inputText;
    setInputText("");
    setLoading(true);

    // 🛡️ UNIVERSAL PRIVACY & SECURITY GATE
    const securePrompt = `
      Strict Instructions:
      1. You are a Personal Assistant for the CUSTOMER.
      2. SECURITY: If the user asks about Admin settings, Owner's profit, or private database info, refuse politely.
      3. PRIVACY: Do not leak other customers' identity or locations.
      4. SCOPE: Stay strictly within food discovery, menu suggestions, and local trends in ${userData?.location?.city}.
      5. Do not perform any system-level tasks.
      User Question: ${currentInput}
    `;

    try {
      const response = await generateAIResponse(securePrompt);
      setMessages((prev) => [...prev, { id: Date.now().toString(), text: response, sender: "ai" }]);
    } catch (error) {
      setMessages((prev) => [...prev, { id: Date.now().toString(), text: "Secure link busy. Please try again.", sender: "ai" }]);
    } finally {
      setLoading(false);
    }
  };

  const renderMessage = ({ item }) => (
    <Animatable.View
      animation={item.sender === "user" ? "fadeInRight" : "fadeInLeft"}
      duration={400}
      style={[
        styles.messageBubble,
        item.sender === "user" ? [styles.userBubble, { backgroundColor: colors.primary }] : styles.aiBubble,
      ]}
    >
      <Text style={[styles.messageText, { color: item.sender === "user" ? "#000" : "#EEE" }]}>
        {item.text}
      </Text>
    </Animatable.View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER WITH SECURITY STATUS */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>SECURE FOOD AI</Text>
          <Text style={[styles.onlineStatus, { color: colors.primary }]}>
            {loading ? "● ENCRYPTING QUERY" : "● PRIVACY PROTECTED"}
          </Text>
        </View>
        <Ionicons name="shield-checkmark-outline" size={22} color={colors.primary} />
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
        <View style={styles.inputWrapper}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Discover the best food..."
              placeholderTextColor="#444"
              value={inputText}
              onChangeText={setInputText}
              editable={!loading}
            />
            <TouchableOpacity onPress={handleSendMessage} disabled={loading} style={[styles.sendBtn, { backgroundColor: colors.primary }]}>
              {loading ? (
                <ActivityIndicator size="small" color="#000" />
              ) : (
                <Ionicons name="sparkles-sharp" size={18} color="#000" />
              )}
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
  headerTitle: { color: "#FFF", fontSize: 11, fontWeight: "900", letterSpacing: 2 },
  onlineStatus: { fontSize: 8, fontWeight: "bold", marginTop: 4, letterSpacing: 1 },
  chatContent: { padding: 20, paddingBottom: 40 },
  messageBubble: { maxWidth: "82%", padding: 16, borderRadius: 22, marginBottom: 15 },
  userBubble: { alignSelf: "flex-end", borderBottomRightRadius: 2 },
  aiBubble: { alignSelf: "flex-start", backgroundColor: "#0A0A0A", borderBottomLeftRadius: 2, borderWidth: 1, borderColor: "#151515" },
  messageText: { fontSize: 13, lineHeight: 19, fontWeight: "500" },
  inputWrapper: { padding: 20, backgroundColor: "#000" },
  inputContainer: { flexDirection: "row", alignItems: "center", backgroundColor: "#0D0D0D", borderRadius: 25, paddingHorizontal: 15, paddingVertical: 8, borderWidth: 1, borderColor: "#1A1A1A" },
  input: { flex: 1, color: "#FFF", fontSize: 13 },
  sendBtn: { width: 38, height: 38, borderRadius: 19, justifyContent: "center", alignItems: "center", marginLeft: 10 },
});
