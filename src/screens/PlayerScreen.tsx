import React, { useRef, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import Video from 'react-native-video';
import { useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../@types/navigation';

type PlayerScreenRouteProp = RouteProp<RootStackParamList, 'Player'>;

export default function PlayerScreen() {
  const route = useRoute<PlayerScreenRouteProp>();
  // LEITURA DE PARÂMETROS CORRIGIDA:
  const { url, title, logo } = route.params;

  const videoRef = useRef<Video>(null);
  const [isLoading, setIsLoading] = useState(true);

  return (
    <View style={styles.container}>
      <Video
        ref={videoRef}
        source={{ uri: url }} // Usa a URL diretamente
        style={StyleSheet.absoluteFill}
        controls={true}
        resizeMode="contain"
        onLoadStart={() => setIsLoading(true)}
        onLoad={() => setIsLoading(false)}
        onError={(error) => console.error('Erro no player de vídeo:', error)}
        fullscreen={true}
        fullscreenAutorotate={true}
        fullscreenOrientation="landscape"
      />
      {isLoading && (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#FFFFFF" />
          <Text style={styles.titleText}>{title}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  loader: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleText: {
    color: 'white',
    fontSize: 18,
    marginTop: 20,
  }
});
