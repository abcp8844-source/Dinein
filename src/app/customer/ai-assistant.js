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
    const initializeChat = async () => {
      setLoading(true);
      const systemPrompt = `
        Role: Customer Food Assistant.
        Location: ${userData?.location?.city || "Thailand"}.
        Privacy: Strictly hide admin/owner details.
        Transfer Rule: If user asks for human/admin or reports a major issue, use the phrase: "Connecting to our human support expert..."
      `;
      try {
        const response = await generateAIResponse(systemPrompt);
        setMessages([{ id: "1", text: response, sender: "ai" }]);
      } catch (error) {
        setMessages([{ id: "1", text: "Welcome! How can I assist you today?", sender: "ai" }]);
      } finally {
        setLoading(false);
      }
    };
    initializeChat();

    // SOCKET/FIREBASE LISTENER FOR ADMIN MESSAGES SHOULD BE PLACED HERE
  }, []);

  const handleSendMessage = async () => {
    if (!inputText.trim() || loading) return;

    const userMsg = { id: Date.now().toString(), text: inputText, sender: "user" };
    setMessages((prev) => [...prev, userMsg]);
    const currentInput = inputText;
    setInputText("");
    setLoading(true);

    const securePrompt = `
      Instructions:
      - Stay within food discovery topics for ${userData?.location?.city}.
      - If user reports payment error or asks for human help, reply exactly: "I am notifying our human expert to assist you. Please stay on this chat."
      Query: ${currentInput}
    `;

    try {
      const response = await generateAIResponse(securePrompt);
      
      // LOGIC: Trigger Admin Alert if AI suggests human handover
      if (response.includes("human expert")) {
        // Function to push alert to your Admin Dashboard (e.g., notifyAdmin(userId))
      }

      setMessages((prev) => [...prev, { id: Date.now().toString(), text: response, sender: "ai" }]);
    } catch (error) {
      setMessages((prev) => [...prev, { id: Date.now().toString(), text: "Connecting to Admin support...", sender: "admin" }]);
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
        item.sender === "admin" && { borderColor: colors.primary, borderWidth: 1 }
      ]}
    >
      <Text style={[styles.messageText, { color: item.sender === "user" ? "#000" : "#EEE" }]}>
        {item.text}
      </Text>
    </Animatable.View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>SECURE HYBRID CHAT</Text>
          <Text style={[styles.onlineStatus, { color: colors.primary }]}>
            {loading ? "● SYSTEM PROCESSING" : "● PRIVACY PROTECTED"}
          </Text>
        </View>
        <TouchableOpacity>
          <Ionicons name="shield-checkmark" size={22} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        contentContainerStyle={styles.chatContent}
        onContentSizeChange={() => flatListRef.current.scrollToEnd()}
      />

      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"} 
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
      >
        <View style={styles.inputWrapper}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Type your message here..."
              placeholderTextColor="#444"
              value={inputText}
              onChangeText={setInputText}
              editable={!loading}
            />
            <TouchableOpacity 
              onPress={handleSendMessage} 
              disabled={loading}
              style={[styles.sendBtn, { backgroundColor: colors.primary }]}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#000" />
              ) : (
                <Ionicons name="send" size={18} color="#000" />
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
  header: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center", 
    padding: 20, 
    borderBottomWidth: 1, 
    borderBottomColor: "#111" 
  },
  headerTitleContainer: { alignItems: "center" },
  headerTitle: { color: "#FFF", fontSize: 10, fontWeight: "900", letterSpacing: 2 },
  onlineStatus: { fontSize: 8, fontWeight: "bold", marginTop: 4, letterSpacing: 1 },
  chatContent: { padding: 20, paddingBottom: 40 },
  messageBubble: { maxWidth: "82%", padding: 16, borderRadius: 22, marginBottom: 15 },
  userBubble: { alignSelf: "flex-end", borderBottomRightRadius: 2 },
  aiBubble: { 
    alignSelf: "flex-start", 
    backgroundColor: "#0A0A0A", 
    borderBottomLeftRadius: 2, 
    borderWidth: 1, 
    borderColor: "#151515" 
  },
  messageText: { fontSize: 13, lineHeight: 19, fontWeight: "500" },
  inputWrapper: { padding: 20, backgroundColor: "#000" },
  inputContainer: { 
    flexDirection: "row", 
    alignItems: "center", 
    backgroundColor: "#0D0D0D", 
    borderRadius: 25, 
    paddingHorizontal: 15, 
    paddingVertical: 8, 
    borderWidth: 1, 
    borderColor: "#1A1A1A" 
  },
  input: { flex: 1, color: "#FFF", fontSize: 13, paddingRight: 10 },
  sendBtn: { 
    width: 38, 
    height: 38, 
    borderRadius: 19, 
    justifyContent: "center", 
    alignItems: "center" 
  },
});
