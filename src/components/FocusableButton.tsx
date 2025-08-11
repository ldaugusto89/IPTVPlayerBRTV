import React, { useState } from 'react';
import {
  Pressable,
  Text,
  StyleSheet,
  PressableProps,
  ViewStyle,
  TextStyle,
} from 'react-native';

export interface FocusableButtonProps extends PressableProps {
  title?: string;
  style?: ViewStyle | ViewStyle[];
  textStyle?: TextStyle | TextStyle[];
  focusedStyle?: ViewStyle | ViewStyle[];
  focusable?: boolean; // controla se pode receber foco (útil para travar foco)
}

/**
 * Botão que muda estilo ao receber foco e aceita children (ícone/texto).
 */
export default function FocusableButton({
  title,
  children,
  style,
  textStyle,
  focusedStyle,
  focusable = true,
  onFocus,
  onBlur,
  ...rest
}: React.PropsWithChildren<FocusableButtonProps>) {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus: PressableProps['onFocus'] = (e) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur: PressableProps['onBlur'] = (e) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  return (
    <Pressable
      {...rest}
      onFocus={handleFocus}
      onBlur={handleBlur}
      focusable={focusable}
      style={[
        styles.button,
        style,
        isFocused && (focusedStyle ?? styles.focused),
      ]}
    >
      {children ? (
        children
      ) : (
        <Text style={[styles.text, textStyle]}>{title}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    backgroundColor: '#222',
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  focused: {
    backgroundColor: '#1e90ff',
    borderWidth: 2,
    borderColor: '#fff',
  },
  text: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
});