import React, { useRef, useEffect, useState } from 'react';
import { View, StyleSheet, BackHandler, Pressable, Text } from 'react-native';
import Video, { OnProgressData } from 'react-native-video';
import { useRoute, useNavigation } from '@react-navigation/native';
import { PlayerScreenRouteProp, PlayerScreenNavigationProp } from '../../@types/navigation';
import { useHistory } from '../context/HistoryContext'; // 1. IMPORTE O HOOK DO HISTÓRICO

export default function PlayerScreen() {
  const route = useRoute<PlayerScreenRouteProp>();
  const navigation = useNavigation<PlayerScreenNavigationProp>();
  const { url, title, logo } = route.params; // Pegamos os dados do item
  
  const { addToHistory } = useHistory(); // 2. PEGUE A FUNÇÃO DO CONTEXTO
  const hasSavedToHistory = useRef(false); // Ref para controlar o salvamento

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      navigation.goBack();
      return true;
    });
    return () => backHandler.remove();
  }, [navigation]);

  const handleProgress = (data: OnProgressData) => {
    // Salva no histórico após 30 segundos, e apenas uma vez
    if (data.currentTime > 30 && !hasSavedToHistory.current) {
      addToHistory({ name: title, url, logo, group: { title: '' } }); // Salva o item
      hasSavedToHistory.current = true; // Marca como salvo
    }
  };

  return (
    <View style={styles.container}>
      <Video
        source={{ uri: url }}
        style={styles.video}
        controls={true}
        resizeMode="contain"
        fullscreen={true}
        onProgress={handleProgress} // 3. CHAME A FUNÇÃO AQUI
        onError={(err) => console.log('Erro no player:', err)}
      />
       <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>← Voltar</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  video: {
    ...StyleSheet.absoluteFillObject,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 5,
  },
  backText: {
    color: 'white',
    fontSize: 16,
  }
});