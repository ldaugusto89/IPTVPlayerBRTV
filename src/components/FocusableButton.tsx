import React, { useState } from 'react';
import { Pressable, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';

interface FocusableButtonProps {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export default function FocusableButton({
  title,
  onPress,
  style,
  textStyle,
}: FocusableButtonProps) {
  const [focused, setFocused] = useState(false);

  return (
    <Pressable
      onPress={onPress}
      onFocus={() => {
        setFocused(true);
        console.log(`Foco no botão: ${title}`);
      }}
      onBlur={() => {
        setFocused(false);
        console.log(`Perdeu foco: ${title}`);
      }}
      hasTVPreferredFocus={title === 'Canais ao Vivo'} // o primeiro botão tem foco inicial
      style={[
        styles.button,
        focused && styles.focused,
        style,
      ]}
    >
      <Text style={[styles.text, textStyle]}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
    backgroundColor: '#222',
    marginBottom: 16,
  },
  focused: {
    backgroundColor: '#1e90ff', // Azul claro para destaque visível
    borderColor: '#fff',
    borderWidth: 2,
  },
  text: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
});