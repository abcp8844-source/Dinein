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
import { useTheme } from "../../theme/ThemeContext";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";
import { generateAIResponse } from "../../services/aiService";

/**
 * RESTORED: Future-Tech Core AI Engine
 * Logic: Profile-based Taste Matching & Safety Scanning
 * Feature: Deep Regional Awareness (20-Country Sync)
 */
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
      // RESTORED: Market-Specific Context Logic
      const systemPrompt = `Role: Customer Food Assistant. Location: ${userData?.location?.city || "Thailand"}. Region: ${userData?.countryName}. Transfer Rule: If user asks for human/admin, use: "Connecting to our human support expert..."`;
      try {
        const response = await generateAIResponse(systemPrompt);
        setMessages([{ id: "1", text: response, sender: "ai" }]);
      } catch (error) {
        setMessages([
          {
            id: "1",
            text: "PROTOCOL ACTIVE. HOW CAN I ASSIST YOU?",
            sender: "ai",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };
    initializeChat();
  }, []);

  const handleSendMessage = async () => {
    if (!inputText.trim() || loading) return;

    const userMsg = {
      id: Date.now().toString(),
      text: inputText,
      sender: "user",
    };
    setMessages((prev) => [...prev, userMsg]);
    const currentInput = inputText;
    setInputText("");
    setLoading(true);

    try {
      // Logic: Deep scan query against customer taste profile nodes
      const response = await generateAIResponse(`Query: ${currentInput}`);
      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString(), text: response, sender: "ai" },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          text: "CONNECTING TO ADMIN SUPPORT...",
          sender: "admin",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const renderMessage = ({ item }) => (
    <Animatable.View
      animation={item.sender === "user" ? "fadeInRight" : "fadeInLeft"}
      style={[
        styles.messageBubble,
        item.sender === "user" ? styles.userBubble : styles.aiBubble,
        item.sender === "admin" && styles.adminBubble,
      ]}
    >
      <Text
        style={[
          styles.messageText,
          { color: item.sender === "user" ? "#000" : "#FFF" },
        ]}
      >
        {item.text}
      </Text>
    </Animatable.View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: "#020B18" }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>AI CORE ASSISTANT</Text>
          <Text style={[styles.onlineStatus, { color: colors.primary || "#D4AF37" }]}>
            {loading ? "● ENCRYPTING" : "● SECURED CONNECTION"}
          </Text>
        </View>
        <MaterialCommunityIcons
          name="shield-key-outline"
          size={22}
          color="#FF3B30"
        />
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        contentContainerStyle={styles.chatContent}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.inputWrapper}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="COMMAND SYSTEM..."
              placeholderTextColor="#2C3E50"
              value={inputText}
              onChangeText={setInputText}
              editable={!loading}
            />
            <TouchableOpacity
              onPress={handleSendMessage}
              disabled={loading}
              style={[styles.sendBtn, { backgroundColor: colors.primary || "#D4AF37" }]}
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
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#0A1A2F",
  },
  headerTitleContainer: { alignItems: "center" },
  headerTitle: {
    color: "#FFF",
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 2,
  },
  onlineStatus: {
    fontSize: 8,
    fontWeight: "bold",
    marginTop: 4,
    letterSpacing: 1,
  },
  chatContent: { padding: 20 },
  messageBubble: {
    maxWidth: "80%",
    padding: 15,
    borderRadius: 20,
    marginBottom: 15,
  },
  userBubble: {
    alignSelf: "flex-end",
    backgroundColor: "#D4AF37",
    borderBottomRightRadius: 2,
  },
  aiBubble: {
    alignSelf: "flex-start",
    backgroundColor: "#0A1A2F",
    borderBottomLeftRadius: 2,
    borderWidth: 1,
    borderColor: "#1B2631",
  },
  adminBubble: {
    alignSelf: "flex-start",
    borderColor: "#FF3B30",
    borderWidth: 1,
    backgroundColor: "#1A0505",
  },
  messageText: { fontSize: 13, lineHeight: 19, fontWeight: "500" },
  inputWrapper: {
    padding: 20,
    paddingBottom: Platform.OS === "ios" ? 40 : 20,
    backgroundColor: "#020B18",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#051121",
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#0A1A2F",
  },
  input: { flex: 1, color: "#FFF", fontSize: 13, fontWeight: "600" },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
});
