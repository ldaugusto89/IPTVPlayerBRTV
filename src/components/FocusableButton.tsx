import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, ViewStyle, TextStyle, NativeSyntheticEvent, TargetedEvent } from 'react-native';

interface FocusableButtonProps {
  onPress: () => void;
  onFocus?: (event: NativeSyntheticEvent<TargetedEvent>) => void;
  onBlur?: (event: NativeSyntheticEvent<TargetedEvent>) => void;
  title?: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
  children?: React.ReactNode | (({ focused }: { focused: boolean }) => React.ReactNode);
  hasTVPreferredFocus?: boolean;
}

const FocusableButton: React.FC<FocusableButtonProps> = ({
  onPress,
  onFocus,
  onBlur,
  title,
  style,
  textStyle,
  children,
  hasTVPreferredFocus,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = (e: NativeSyntheticEvent<TargetedEvent>) => {
    setIsFocused(true);
    if (onFocus) {
      onFocus(e);
    }
  };

  const handleBlur = (e: NativeSyntheticEvent<TargetedEvent>) => {
    setIsFocused(false);
    if (onBlur) {
      onBlur(e);
    }
  };

  return (
    <Pressable
      onPress={onPress}
      onFocus={handleFocus}
      onBlur={handleBlur}
      // O estilo do foco agora é aplicado diretamente aqui
      style={[style, isFocused && styles.buttonFocused]}
      hasTVPreferredFocus={hasTVPreferredFocus}
    >
      {typeof children === 'function' ? (
        children({ focused: isFocused })
      ) : children ? (
        children
      ) : (
        <Text style={[styles.text, textStyle]}>{title}</Text>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  // O estilo base do botão foi removido para maior flexibilidade,
  // pois cada componente que o usa (card, botão do sidebar) já tem seu próprio estilo.
  buttonFocused: {
    transform: [{ scale: 1.1 }],
    borderColor: '#00aaff', // Um contorno azul claro e vibrante
    borderWidth: 3,
    borderRadius: 8, // Garante que o contorno seja arredondado
  },
  text: {
    color: 'white',
    fontSize: 16,
  },
});

export default FocusableButton;
