import React, { useEffect, useRef } from 'react';
import { Text, StyleSheet, Animated } from 'react-native';
import { useFavorites } from '../context/FavoritesContext';

const Toast = () => {
  const { toastMessage } = useFavorites();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (toastMessage) {
      // Animação de entrada
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      // Animação de saída
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [toastMessage, fadeAnim]);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <Text style={styles.text}>{toastMessage}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 60,
    alignSelf: 'center',
    zIndex: 1000,
  },
  text: {
    backgroundColor: 'rgba(0,0,0,0.85)',
    color: 'white',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Toast;
