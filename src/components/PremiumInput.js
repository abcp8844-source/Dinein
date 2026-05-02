import React, { useState, useRef } from "react";
import { TextInput, StyleSheet, View, Animated } from "react-native";
import { useTheme } from "../theme/ThemeContext";

/**
 * EXECUTIVE UI COMPONENT: PREMIUM INPUT
 * Feature: Animated Gold Glow on focus for Dining Table brand consistency.
 */
export default function PremiumInput({
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = "default",
}) {
  const { colors, borderRadius } = useTheme();
  const [isFocused, setIsFocused] = useState(false);

  // Animation for the border glow effect
  const glowAnim = useRef(new Animated.Value(0)).current;

  const handleFocus = () => {
    setIsFocused(true);
    Animated.timing(glowAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const handleBlur = () => {
    setIsFocused(false);
    Animated.timing(glowAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  // Interpolating color from dimmed to bright gold
  const borderColor = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.border || "#1B2631", colors.primary || "#D4AF37"],
  });

  return (
    <Animated.View
      style={[
        styles.container,
        {
          borderColor: borderColor,
          backgroundColor: colors.inputBg,
          borderRadius: borderRadius?.medium || 15,
          borderWidth: isFocused ? 2 : 1.2,
          // Premium Shadow/Glow effect when focused
          shadowColor: colors.primary,
          shadowOpacity: isFocused ? 0.3 : 0,
          shadowRadius: isFocused ? 8 : 0,
          elevation: isFocused ? 5 : 0,
        },
      ]}
    >
      <TextInput
        style={[styles.input, { color: colors.textMain }]}
        placeholder={placeholder}
        placeholderTextColor={colors.textDim}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        selectionColor={colors.primary}
        keyboardType={keyboardType}
        onFocus={handleFocus}
        onBlur={handleBlur}
        autoCapitalize="none"
        cursorColor={colors.primary}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 60,
    marginVertical: 10,
    paddingHorizontal: 20,
    justifyContent: "center",
  },
  input: {
    fontSize: 15,
    fontWeight: "500",
    letterSpacing: 1,
  },
});
