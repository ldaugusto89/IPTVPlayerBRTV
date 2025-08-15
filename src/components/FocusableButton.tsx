import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, ViewStyle, TextStyle } from 'react-native';

interface FocusableButtonProps {
  onPress: () => void;
  onLongPress?: () => void;
  children?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
  title?: string;
}

const FocusableButton = ({
  onPress,
  onLongPress,
  children,
  style,
  textStyle,
  title,
}: FocusableButtonProps) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      style={[
        styles.button,
        style,
        isFocused && styles.focused, // Aplica o estilo de foco quando o estado isFocused é true
      ]}
    >
      {title ? <Text style={[styles.text, textStyle]}>{title}</Text> : children}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    // Estilos padrão que podem ser sobrescritos pela prop 'style'
  },
  text: {
    color: 'white',
  },
  // NOVO ESTILO: Borda azul para indicar o foco, sem alterar o tamanho
  focused: {
    borderColor: '#00aaff',
    borderWidth: 3,
    elevation: 10,
  },
});

export default FocusableButton;
