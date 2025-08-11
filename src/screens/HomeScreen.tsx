import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Platform, Animated, BackHandler } from 'react-native';
import Sidebar from '../components/Sidebar';
import { useNavigation } from '@react-navigation/native';
import { getSavedListUrl } from '../lib/storage';
import { fetchAndParseM3U } from '../utils/m3uParser';
import { useChannels } from '../context/ChannelContext';
import FocusableButton from '../components/FocusableButton';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export default function HomeScreen() {
  const navigation = useNavigation();
  const { setChannels } = useChannels();
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const isTV = Platform.isTV;

  const sidebarAnim = useRef(new Animated.Value(-300)).current;

  const openSidebar = () => {
    Animated.timing(sidebarAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setSidebarVisible(true));
  };

  const closeSidebar = () => {
    Animated.timing(sidebarAnim, {
      toValue: -300,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setSidebarVisible(false));
  };

  useEffect(() => {
    const loadAndParse = async () => {
      const url = await getSavedListUrl();
      if (url) {
        const items = await fetchAndParseM3U(url);
        setChannels(items);
      }
    };

    loadAndParse();
  }, []);

  // Fecha a sidebar com botão "voltar"
  useEffect(() => {
    const backAction = () => {
      if (sidebarVisible) {
        closeSidebar();
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, [sidebarVisible]);

  const handleNavigate = (route: string) => {
    closeSidebar();
    navigation.navigate(route as never);
  };

  return (
    <View style={styles.container}>
      {/* Sidebar animada */}
      <Animated.View style={[styles.sidebarAnimated, { transform: [{ translateX: sidebarAnim }] }]}>
        <Sidebar onClose={closeSidebar} onNavigate={handleNavigate} isOpen={sidebarVisible} />
      </Animated.View>

      {/* Conteúdo principal */}
      <View style={styles.content}>
        {isTV && (
          <FocusableButton
            onPress={openSidebar}
            style={styles.menuButton}
            focusable={!sidebarVisible}  // não focável enquanto sidebar aberta
          >
            <MaterialIcons name="menu" size={28} color="#fff" />
          </FocusableButton>
        )}

        <Text style={styles.title}>IPTV Player</Text>

        {/* Botões só são focáveis quando a sidebar NÃO está aberta */}
        <FocusableButton
          title="Canais ao Vivo"
          onPress={() => navigation.navigate('Canais' as never)}
          focusable={!sidebarVisible}
        />
        <FocusableButton
          title="Filmes"
          onPress={() => navigation.navigate('Filmes' as never)}
          focusable={!sidebarVisible}
        />
        <FocusableButton
          title="Séries"
          onPress={() => navigation.navigate('Series' as never)}
          focusable={!sidebarVisible}
        />
        <FocusableButton
          title="Favoritos"
          onPress={() => navigation.navigate('Favorites' as never)}
          focusable={!sidebarVisible}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', flex: 1, backgroundColor: '#000' },
  content: { flex: 1, padding: 16 },
  title: { color: '#fff', fontSize: 30, marginBottom: 40 },
  menuButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#333',
    borderRadius: 6,
  },
  sidebarAnimated: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 300,
    zIndex: 100,
  },
});