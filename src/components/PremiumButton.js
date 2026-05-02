import React, { useEffect, useRef } from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
  View,
} from "react-native";
import { useTheme } from "../theme/ThemeContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function PremiumButton({
  title,
  onPress,
  type = "primary",
  style,
  loading = false,
  disabled = false,
}) {
  const { colors, borderRadius } = useTheme();
  const isPrimary = type === "primary";

  // Animation logic for the Gold Pulse
  const pulseAnim = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    if (loading) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 0.4,
            duration: 800,
            useNativeDriver: true,
          }),
        ]),
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [loading]);

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[
        styles.button,
        {
          backgroundColor: isPrimary ? colors.primary : "transparent",
          borderColor: colors.primary,
          borderWidth: isPrimary ? 0 : 1.5,
          borderRadius: borderRadius?.button || 15,
        },
        style,
        disabled && !loading && { opacity: 0.5 },
      ]}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <Animated.View
          style={{
            opacity: pulseAnim,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          {/* DINING TABLE BRAND VISUAL: A small plate/fork icon */}
          <MaterialCommunityIcons
            name="silverware-variant"
            size={18}
            color={isPrimary ? "#020B18" : colors.primary}
            style={{ marginRight: 10 }}
          />
          <Text
            style={[
              styles.text,
              { color: isPrimary ? "#020B18" : colors.primary },
            ]}
          >
            PROCESSING...
          </Text>
        </Animated.View>
      ) : (
        <Text
          style={[
            styles.text,
            { color: isPrimary ? "#020B18" : colors.primary },
          ]}
        >
          {title.toUpperCase()}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 16,
    paddingHorizontal: 25,
    marginVertical: 12,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#D4AF37",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  text: {
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 2.5,
  },
});
