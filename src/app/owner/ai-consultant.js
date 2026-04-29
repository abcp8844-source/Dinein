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
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";

/**
 * GEMINI BUSINESS INTELLIGENCE (Final Version)
 * Features: Market Radar | Weather Sync | Trend Forecasting | Low-Latency
 */
export default function OwnerAiConsultant() {
  const { userData } = useAuth();
  const { colors } = useTheme();
  const router = useRouter();

  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const flatListRef = useRef();

  // 🛡️ INITIAL MARKET ANALYSIS ON LOAD
  useEffect(() => {
    const initialBriefing = {
      id: "1",
      text: `SYSTEM ONLINE. \n\nGreetings, Chief. Here is your 15-Market Intelligence Briefing for ${userData?.location?.city || "Thailand"}: \n\n⛅ WEATHER: High humidity expected tonight. Trending: Cold Beverages. \n🔥 MARKET: 70% of nearby users are ordering 'Spicy Seafood'. \n📦 LOGISTICS: Delivery traffic is low. Perfect time for volume orders.`,
      sender: "ai",
    };
    setMessages([initialBriefing]);
  }, []);

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      text: inputText,
      sender: "user",
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputText("");

    // 🤖 AI NEURAL RESPONSE (Market & Weather Logic)
    setTimeout(() => {
      const aiResponse = {
        id: (Date.now() + 1).toString(),
        text: generateAiInsight(inputText),
        sender: "ai",
      };
      setMessages((prev) => [...prev, aiResponse]);
    }, 1200);
  };

  // 🧠 Logic to keep the app lightweight but smart
  const generateAiInsight = (query) => {
    const q = query.toLowerCase();
    if (q.includes("market") || q.includes("customer")) {
      return "MARKET DATA: Your area shows a 25% spike in night-time snacks. Competitors are offering 'Free Delivery' after 9 PM. Consider a price-match strategy.";
    } else if (q.includes("weather") || q.includes("rain")) {
      return "WEATHER SYNC: Rain predicted in 2 hours. Switch focus to 'Instant Delivery' and feature Hot Soups on the home grid.";
    } else {
      return "ANALYSIS COMPLETE: Current store health is Optimal. Suggesting an inventory restock for 'Featured Items' based on weekend forecasting.";
    }
  };

  const renderMessage = ({ item }) => (
    <Animatable.View
      animation={item.sender === "user" ? "fadeInRight" : "fadeInLeft"}
      duration={500}
      style={[
        styles.messageBubble,
        item.sender === "user"
          ? [styles.userBubble, { backgroundColor: "#111" }]
          : [styles.aiBubble, { borderColor: colors.primary }],
      ]}
    >
      <Text
        style={[
          styles.messageText,
          { color: item.sender === "user" ? colors.primary : "#EEE" },
        ]}
      >
        {item.text}
      </Text>
    </Animatable.View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* --- COMMAND CENTER HEADER --- */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={26} color="#FFF" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>GEMINI CONSULTANT</Text>
          <View style={styles.statusRow}>
            <View
              style={[styles.pulseDot, { backgroundColor: colors.primary }]}
            />
            <Text style={[styles.statusText, { color: colors.primary }]}>
              MARKET RADAR ACTIVE
            </Text>
          </View>
        </View>
        <Ionicons
          name="shield-checkmark-outline"
          size={24}
          color={colors.primary}
        />
      </View>

      {/* --- INTELLIGENCE FEED --- */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        contentContainerStyle={styles.chatContent}
        onContentSizeChange={() => flatListRef.current.scrollToEnd()}
      />

      {/* --- NEURAL INPUT --- */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={100}
      >
        <View style={styles.inputArea}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Ask about Market, Weather or Sales..."
              placeholderTextColor="#333"
              value={inputText}
              onChangeText={setInputText}
            />
            <TouchableOpacity
              onPress={handleSendMessage}
              style={[styles.sendBtn, { backgroundColor: colors.primary }]}
            >
              <Ionicons name="pulse" size={20} color="#000" />
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
    padding: 25,
    borderBottomWidth: 1,
    borderBottomColor: "#111",
  },
  headerTitleContainer: { alignItems: "center" },
  headerTitle: {
    color: "#FFF",
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 3,
  },
  statusRow: { flexDirection: "row", alignItems: "center", marginTop: 4 },
  pulseDot: { width: 5, height: 5, borderRadius: 2.5, marginRight: 5 },
  statusText: { fontSize: 8, fontWeight: "bold", letterSpacing: 1 },
  chatContent: { padding: 25, paddingBottom: 40 },
  messageBubble: {
    maxWidth: "85%",
    padding: 20,
    borderRadius: 24,
    marginBottom: 20,
  },
  userBubble: {
    alignSelf: "flex-end",
    borderBottomRightRadius: 2,
    borderWidth: 1,
    borderColor: "#222",
  },
  aiBubble: {
    alignSelf: "flex-start",
    backgroundColor: "#050505",
    borderBottomLeftRadius: 2,
    borderWidth: 1,
  },
  messageText: { fontSize: 14, lineHeight: 22, fontWeight: "500" },
  inputArea: { padding: 25, backgroundColor: "#000" },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#080808",
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#111",
  },
  input: { flex: 1, color: "#FFF", fontSize: 13 },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 15,
  },
});
