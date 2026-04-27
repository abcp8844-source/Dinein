import React from 'react';
import { TextInput, StyleSheet, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';

export default function PremiumInput({ placeholder, value, onChangeText, secureTextEntry = false }) {
  const { colors } = useTheme();
  
  return (
    <View style={[styles.container, { borderColor: colors.primary }]}>
      <TextInput
        style={[styles.input, { color: colors.textMain }]}
        placeholder={placeholder}
        placeholderTextColor={colors.textDim}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '85%',
    height: 55,
    borderWidth: 1,
    borderRadius: 10,
    marginVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: 'rgba(128, 0, 0, 0.05)',
    justifyContent: 'center',
  },
  input: {
    fontSize: 16,
  },
});
