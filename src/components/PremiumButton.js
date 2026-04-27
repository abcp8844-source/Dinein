import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

export default function PremiumButton({ title, onPress, type = 'primary' }) {
  const { colors } = useTheme();
  
  return (
    <TouchableOpacity 
      style={[
        styles.button, 
        { backgroundColor: type === 'primary' ? colors.primary : 'transparent',
          borderColor: colors.secondary,
          borderWidth: type === 'primary' ? 0 : 1 }
      ]} 
      onPress={onPress}
    >
      <Text style={[styles.text, { color: type === 'primary' ? colors.textMain : colors.secondary }]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginVertical: 10,
    width: '80%',
    alignItems: 'center',
    elevation: 5,
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});
