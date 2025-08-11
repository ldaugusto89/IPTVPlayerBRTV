import React from 'react';
import { View, StyleSheet, Dimensions, Pressable, Text, Alert } from 'react-native';
import Video from 'react-native-video';
import { useNavigation, useRoute, RouteProp  } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../@types/navigation';

type PlayerScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Player'>;
type PlayerScreenRouteProp = RouteProp<RootStackParamList, 'Player'>; 

const { width, height } = Dimensions.get('window');

export default function PlayerScreen() {
  const route = useRoute<PlayerScreenRouteProp>();
  const navigation = useNavigation<PlayerScreenNavigationProp>();
  const { url, title } = route.params;

  return (
    <View style={styles.container}>
      <Video
        source={{ uri: url , headers: {
        'User-Agent': 'VLC/3.0.18 LibVLC/3.0.18',
        },}}
        style={styles.video}
        controls
        resizeMode="contain"
        fullscreen
        onError={(err) => {
            console.log('Erro no player:', err);
            //Alert.alert('Erro', 'Não foi possível reproduzir este canal.');
            }}
      />

      <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>← Voltar</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'black', justifyContent: 'center' },
  video: {
    width: width,
    height: height,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    backgroundColor: '#00000099',
    padding: 10,
    borderRadius: 6,
  },
  backText: {
    color: '#fff',
    fontSize: 18,
  },
});