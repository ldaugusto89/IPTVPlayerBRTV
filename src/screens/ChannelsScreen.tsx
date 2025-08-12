import React, { useMemo } from 'react';
import { View, Text, StyleSheet, SectionList, FlatList, ActivityIndicator, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../@types/navigation';
import { useContent, M3UItem } from '../context/ChannelContext';
import FocusableButton from '../components/FocusableButton';
import { useFavorites } from '../context/FavoritesContext';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Sidebar from '../components/Sidebar';

type NavigationProp = StackNavigationProp<RootStackParamList>;

interface ChannelSection {
  title: string;
  data: M3UItem[][];
}

export default function ChannelsScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { channels, isLoading } = useContent();
  const { toggleFavorite, isFavorite } = useFavorites();

  const channelSections = useMemo(() => {
    if (isLoading) return [];

    const grouped: { [key: string]: M3UItem[] } = channels.reduce((acc, channel) => {
      // LÓGICA DE AGRUPAMENTO CORRIGIDA:
      // Tenta ler channel.group.title, se não der, tenta channel.group, e por último 'Outros'.
      const groupTitle = (channel.group as any)?.title || channel.group || 'Outros';
      
      if (!acc[groupTitle]) {
        acc[groupTitle] = [];
      }
      acc[groupTitle].push(channel);
      return acc;
    }, {} as { [key: string]: M3UItem[] });

    return Object.keys(grouped).map(title => ({
      title,
      data: [grouped[title]],
    }));
  }, [channels, isLoading]);

  const handlePress = (item: M3UItem) => {
    navigation.navigate('Player', { url: item.url, title: item.name, logo: item.tvg?.logo || item.logo });
  };

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Sidebar navigation={navigation} />
      <View style={styles.content}>
        <Text style={styles.screenTitle}>Canais</Text>
        <SectionList
          sections={channelSections}
          keyExtractor={(item, index) => item[0]?.url + index}
          renderSectionHeader={({ section: { title } }) => (
            <Text style={styles.sectionHeader}>{title}</Text>
          )}
          renderItem={({ item: channelGroup }) => (
            <FlatList
              horizontal
              data={channelGroup}
              keyExtractor={(channel) => channel.url}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingVertical: 15 }}
              renderItem={({ item: channel }) => (
                <FocusableButton
                  onPress={() => handlePress(channel)}
                  onLongPress={() => toggleFavorite(channel)}
                  style={styles.card}
                >
                  <View style={styles.imageContainer}>
                    <Image
                      style={styles.cardImage}
                      source={{ uri: channel.tvg?.logo || channel.logo }}
                      defaultSource={require('../assets/placeholder.png')}
                    />
                  </View>
                  <View style={styles.titleContainer}>
                    <Text style={styles.cardTitle} numberOfLines={2}>{channel.name}</Text>
                  </View>
                  {isFavorite(channel) && (
                    <Ionicons name="star" color="#FFD700" size={18} style={styles.starIcon} />
                  )}
                </FocusableButton>
              )}
            />
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#141414',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#141414',
  },
  content: {
    flex: 1,
    paddingLeft: 10,
  },
  screenTitle: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    margin: 20,
  },
  sectionHeader: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
    marginBottom: 5,
  },
  // --- NOVOS ESTILOS PARA O CARD ---
  card: {
    width: 150, // Um pouco mais largo
    height: 150, // Quadrado para melhor acomodar logo + título
    marginHorizontal: 8,
    borderRadius: 8,
    backgroundColor: '#282828',
    overflow: 'hidden',
  },
  imageContainer: {
    flex: 3, // Ocupa 3/4 do espaço
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardImage: {
    width: '80%',
    height: '80%',
    resizeMode: 'contain', // Garante que o logo não seja cortado
  },
  titleContainer: {
    flex: 1, // Ocupa 1/4 do espaço
    justifyContent: 'center',
    paddingHorizontal: 5,
    backgroundColor: '#1f1f1f',
  },
  cardTitle: {
    color: '#fff',
    fontSize: 13,
    textAlign: 'center',
  },
  starIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
});
