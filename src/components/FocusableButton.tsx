import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, ViewStyle, TextStyle, NativeSyntheticEvent, TargetedEvent } from 'react-native';

interface FocusableButtonProps {
  onPress: () => void;
  onLongPress?: () => void; // <-- NOVO
  delayLongPress?: number;  // <-- NOVO
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
  onLongPress,
  delayLongPress,
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
      onLongPress={onLongPress} // <-- NOVO
      delayLongPress={delayLongPress || 500} // <-- NOVO (padrão de meio segundo)
      onFocus={handleFocus}
      onBlur={handleBlur}
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
  buttonFocused: {
    transform: [{ scale: 1.1 }],
    borderColor: '#00aaff',
    borderWidth: 3,
    borderRadius: 8,
  },
  text: {
    color: 'white',
    fontSize: 16,
  },
});

export default FocusableButton;
