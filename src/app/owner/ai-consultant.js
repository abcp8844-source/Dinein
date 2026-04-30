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

  useEffect(() => {
    const initializeBusinessIntelligence = async () => {
      setLoading(true);
      const systemPrompt = `
        Role: Strategic Business AI for Restaurant Owner. 
        Context: Location ${userData?.location?.city || "Thailand"}.
        Task: Provide a brief weather-impact report and one local market insight.
        Privacy: Maintain business confidentiality. 
        Support: If business help is needed beyond AI, advise using the Admin Support link.
      `;

      try {
        const response = await generateAIResponse(systemPrompt);
        setMessages([{ id: "1", text: response, sender: "ai" }]);
      } catch (error) {
        setMessages([
          {
            id: "1",
            text: "Business Strategy Link Active. How can I help with your operations today?",
            sender: "ai",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };
    initializeBusinessIntelligence();
  }, []);

  const handleSendMessage = async () => {
    if (!inputText.trim() || loading) return;

    const userMessage = { id: Date.now().toString(), text: inputText, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    const currentInput = inputText;
    setInputText("");
    setLoading(true);

    const securePrompt = `
      Instructions:
      - You are a Business Consultant. 
      - Topics: Market Trends, Logistics, Weather, Growth.
      - Escalation: If the owner is frustrated or needs direct technical help, say: "Direct Admin support is available. I am alerting the team to assist you further."
      User Query: ${currentInput}
    `;

    try {
      const response = await generateAIResponse(securePrompt);
      setMessages((prev) => [...prev, { id: Date.now().toString(), text: response, sender: "ai" }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString(), text: "System busy. Connecting to Admin backup...", sender: "ai" },
      ]);
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
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={26} color="#FFF" />
        </TouchableOpacity>
        
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>STRATEGIC RADAR</Text>
          <View style={styles.statusRow}>
            <View style={[styles.pulseDot, { backgroundColor: loading ? "#FF3B30" : colors.primary }]} />
            <Text style={[styles.statusText, { color: loading ? "#FF3B30" : colors.primary }]}>
              {loading ? "SYNCING DATA..." : "BUSINESS LINK SECURE"}
            </Text>
          </View>
        </View>

        {/* DIRECT ADMIN SUPPORT BUTTON */}
        <TouchableOpacity onPress={() => router.push("/support/admin-direct")}>
          <Ionicons name="headset-outline" size={24} color={colors.primary} />
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

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={100}>
        <View style={styles.inputArea}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Ask about Market, Weather or Support..."
              placeholderTextColor="#444"
              value={inputText}
              onChangeText={setInputText}
              editable={!loading}
            />
            <TouchableOpacity onPress={handleSendMessage} disabled={loading} style={[styles.sendBtn, { backgroundColor: colors.primary }]}>
              {loading ? <ActivityIndicator size="small" color="#000" /> : <Ionicons name="rocket-sharp" size={18} color="#000" />}
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
  pulseDot: { width: 5, height: 5, borderRadius: 2.5, marginRight: 6 },
  statusText: { fontSize: 8, fontWeight: "bold", letterSpacing: 1 },
  chatContent: { padding: 20, paddingBottom: 40 },
  messageBubble: { maxWidth: "85%", padding: 18, borderRadius: 20, marginBottom: 15 },
  userBubble: { alignSelf: "flex-end", backgroundColor: "#0D0D0D", borderBottomRightRadius: 2, borderWidth: 1, borderColor: "#1A1A1A" },
  aiBubble: { alignSelf: "flex-start", backgroundColor: "#050505", borderBottomLeftRadius: 2, borderWidth: 1 },
  messageText: { fontSize: 13, lineHeight: 20, fontWeight: "500" },
  inputArea: { padding: 20, backgroundColor: "#000" },
  inputContainer: { flexDirection: "row", alignItems: "center", backgroundColor: "#080808", borderRadius: 25, paddingHorizontal: 15, paddingVertical: 10, borderWidth: 1, borderColor: "#111" },
  input: { flex: 1, color: "#FFF", fontSize: 13 },
  sendBtn: { width: 40, height: 40, borderRadius: 20, justifyContent: "center", alignItems: "center", marginLeft: 10 },
});
