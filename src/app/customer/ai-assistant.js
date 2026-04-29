import React, { useState, useRef } from "react";
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
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";

/**
 * GEMINI AI ASSISTANT (Customer Side)
 * Logic: Neural Language Processing for Food Discovery
 * Support: 15 Global Markets
 */
export default function AiAssistant() {
  const { userData } = useAuth();
  const { colors } = useTheme();
  const router = useRouter();

  const [messages, setMessages] = useState([
    {
      id: "1",
      text: `Hello! I am your Gemini Assistant. How can I help you discover the best food in ${userData?.location?.city || "your area"} today?`,
      sender: "ai",
    },
  ]);
  const [inputText, setInputText] = useState("");
  const flatListRef = useRef();

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      text: inputText,
      sender: "user",
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputText("");

    // 🤖 AI Simulation (Connect to Gemini API here)
    setTimeout(() => {
      const aiResponse = {
        id: (Date.now() + 1).toString(),
        text: "Analyzing your preferences... I found 3 restaurants matching your request. Would you like to see the menu?",
        sender: "ai",
      };
      setMessages((prev) => [...prev, aiResponse]);
    }, 1500);
  };

  const renderMessage = ({ item }) => (
    <Animatable.View
      animation={item.sender === "user" ? "fadeInRight" : "fadeInLeft"}
      duration={400}
      style={[
        styles.messageBubble,
        item.sender === "user"
          ? [styles.userBubble, { backgroundColor: colors.primary }]
          : styles.aiBubble,
      ]}
    >
      <Text
        style={[
          styles.messageText,
          { color: item.sender === "user" ? "#000" : "#EEE" },
        ]}
      >
        {item.text}
      </Text>
    </Animatable.View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* --- HEADER --- */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>GEMINI INTELLIGENCE</Text>
          <Text style={[styles.onlineStatus, { color: colors.primary }]}>
            ● SYSTEM ONLINE
          </Text>
        </View>
        <Ionicons name="options-outline" size={24} color="#FFF" />
      </View>

      {/* --- CHAT AREA --- */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        contentContainerStyle={styles.chatContent}
        onContentSizeChange={() => flatListRef.current.scrollToEnd()}
      />

      {/* --- INPUT AREA --- */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={100}
      >
        <View style={styles.inputWrapper}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Ask me anything..."
              placeholderTextColor="#444"
              value={inputText}
              onChangeText={setInputText}
              multiline
            />
            <TouchableOpacity
              onPress={handleSendMessage}
              style={[styles.sendBtn, { backgroundColor: colors.primary }]}
            >
              <Ionicons name="paper-plane" size={20} color="#000" />
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
    borderBottomColor: "#111",
  },
  headerTitleContainer: { alignItems: "center" },
  headerTitle: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 2,
  },
  onlineStatus: {
    fontSize: 8,
    fontWeight: "bold",
    marginTop: 4,
    letterSpacing: 1,
  },
  chatContent: { padding: 20, paddingBottom: 40 },
  messageBubble: {
    maxWidth: "80%",
    padding: 15,
    borderRadius: 20,
    marginBottom: 15,
  },
  userBubble: { alignSelf: "flex-end", borderBottomRightRadius: 2 },
  aiBubble: {
    alignSelf: "flex-start",
    backgroundColor: "#0A0A0A",
    borderBottomLeftRadius: 2,
    borderWidth: 1,
    borderColor: "#111",
  },
  messageText: { fontSize: 14, lineHeight: 20, fontWeight: "500" },
  inputWrapper: { padding: 20, backgroundColor: "#000" },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0D0D0D",
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#111",
  },
  input: { flex: 1, color: "#FFF", fontSize: 14, maxHeight: 100 },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
});
