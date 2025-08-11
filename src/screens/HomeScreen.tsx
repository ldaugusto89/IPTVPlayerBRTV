import React, { useEffect, useState, useRef } from 'react';
import { View, 
  Text, 
  Pressable, 
  StyleSheet, 
  Platform,
  Animated,
  Dimensions, 
} from 'react-native';
import Sidebar from '../components/Sidebar';
import { useNavigation } from '@react-navigation/native';
import { getSavedListUrl } from '../lib/storage';
import { fetchAndParseM3U } from '../utils/m3uParser';
import { useChannels } from '../context/ChannelContext';

import FocusableButton from '../components/FocusableButton';

export default function HomeScreen() {
  const navigation = useNavigation();
  const { setChannels } = useChannels();
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const isTV = Platform.isTV; // Detecta Android TV

  const screenWidth = Dimensions.get('window').width;
  const sidebarAnim = useRef(new Animated.Value(-300)).current; // Começa fora da tela

  const toggleSidebar = () => {
    const toValue = sidebarVisible ? -300 : 0;

    Animated.timing(sidebarAnim, {
      toValue,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setSidebarVisible(!sidebarVisible);
    });
  };

  useEffect(() => {
  const loadAndParse = async () => {
    const url = await getSavedListUrl();
    if (url) {
      const items = await fetchAndParseM3U(url); // já existente
      setChannels(items); // ou setChannels
    }

  };

  if (sidebarVisible) {
      Animated.timing(sidebarAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(sidebarAnim, {
        toValue: -300,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }

  loadAndParse();
  }, [sidebarVisible]);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.sidebarAnimated, { transform: [{ translateX: sidebarAnim }] }]}>
        <Sidebar />
      </Animated.View>

      <View style={styles.content}>
        {isTV && (
          <Pressable style={styles.gearButton} onPress={toggleSidebar}>
            <Text style={styles.gearIcon}>⚙️</Text>
          </Pressable>
        )}
        <Text style={styles.title}>IPTV Player</Text>

        <FocusableButton title="Canais ao Vivo"  onPress={() => navigation.navigate('Canais')} />

        <FocusableButton title="Filmes"  onPress={() => navigation.navigate('Filmes')} />
        
        <FocusableButton title="Séries"  onPress={() => navigation.navigate('Series')} />
        
        <FocusableButton title="Favoritos"  onPress={() => navigation.navigate('Favorites')} />
                
      </View>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', flex: 1, backgroundColor: '#000' },
  //container: { flex: 1, backgroundColor: '#000', alignItems: 'center', justifyContent: 'center' },
  content: { flex: 1, padding: 16 },
  title: { color: '#fff', fontSize: 30, marginBottom: 40 },
  //button: { marginVertical: 10, padding: 20, backgroundColor: '#444', borderRadius: 10 },
  //buttonText: { color: '#fff', fontSize: 20 },
  gearButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 10,
  },
  gearIcon: { fontSize: 28, color: '#ccc' },
  sidebarAnimated: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 300,
    zIndex: 100,
  },
});