import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SectionList, ActivityIndicator, Image, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../@types/navigation';
import { useContent, ApiCategory, VodItem } from '../context/ChannelContext';
import FocusableButton from '../components/FocusableButton';
import Sidebar from '../components/Sidebar';
import { getVodCategories, getVodStreams } from '../services/xtreamService';

type NavigationProp = StackNavigationProp<RootStackParamList>;

interface MovieSection {
  title: string;
  data: VodItem[][]; // Array de arrays para o padrão SectionList > FlatList
  id: string;
}

export default function MoviesScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { serverInfo, vodCategories, setVodCategories } = useContent();
  const [isLoading, setIsLoading] = useState(true);
  const [sections, setSections] = useState<MovieSection[]>([]);

  useEffect(() => {
    const fetchMovieCategories = async () => {
      if (!serverInfo) return;
      
      setIsLoading(true);
      try {
        const categories = vodCategories.length > 0 ? vodCategories : await getVodCategories(serverInfo);
        if (vodCategories.length === 0) {
          setVodCategories(categories || []);
        }
        
        const formattedSections = (categories || []).map((cat: ApiCategory) => ({
          title: cat.category_name,
          id: cat.category_id,
          data: [], // Começa sem filmes carregados
        }));
        setSections(formattedSections);

        // Pré-carrega o conteúdo da primeira categoria para uma experiência mais rápida
        if (formattedSections.length > 0) {
          loadStreamsForSection(formattedSections[0]);
        }
      } catch (error) {
        console.error("Erro ao buscar categorias de filmes:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovieCategories();
  }, [serverInfo]);

  // Função para carregar os filmes de uma seção específica sob demanda
  const loadStreamsForSection = async (section: MovieSection) => {
    if (!serverInfo || section.data.length > 0) return; // Não carrega se já tiver dados

    try {
      const streams = await getVodStreams(serverInfo, section.id);
      setSections(prevSections =>
        prevSections.map(s =>
          s.id === section.id ? { ...s, data: [streams || []] } : s
        )
      );
    } catch (error) {
      console.error(`Erro ao buscar filmes para a categoria ${section.id}:`, error);
    }
  };
  
  const handlePress = (item: VodItem) => {
    if (!serverInfo) return;
    
    const streamUrl = `${serverInfo.serverUrl.replace('/player_api.php', '')}/movie/${serverInfo.username}/${serverInfo.password}/${item.stream_id}.mp4`;
    
    navigation.navigate('Player', { 
      channel: {
        name: item.name,
        url: streamUrl,
        logo: item.stream_icon,
        group: { title: 'Filmes' }
      }
    });
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
        <Text style={styles.screenTitle}>Filmes</Text>
        <SectionList
          sections={sections}
          keyExtractor={(item, index) => `section-${index}`}
          onViewableItemsChanged={({ viewableItems }) => {
            // Carrega o conteúdo das seções que se tornam visíveis ao rolar a tela
            viewableItems.forEach(viewable => {
              loadStreamsForSection(viewable.item as any);
            });
          }}
          renderSectionHeader={({ section: { title } }) => (
            <Text style={styles.sectionHeader}>{title}</Text>
          )}
          renderItem={({ item: movieGroup, section }) => (
            <FlatList
              horizontal
              data={movieGroup}
              keyExtractor={(movie) => String(movie.stream_id)}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingVertical: 15 }}
              renderItem={({ item: movie }) => (
                <FocusableButton
                  onPress={() => handlePress(movie)}
                  style={styles.card}
                >
                  <Image
                    style={styles.cardImage}
                    source={{ uri: movie.stream_icon }}
                    defaultSource={require('../assets/placeholder.png')}
                  />
                  <View style={styles.titleContainer}>
                    <Text style={styles.cardTitle} numberOfLines={2}>{movie.name}</Text>
                  </View>
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
  card: {
    width: 150,
    height: 220,
    marginHorizontal: 8,
    borderRadius: 8,
    backgroundColor: '#282828',
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: '75%',
    resizeMode: 'cover',
    backgroundColor: '#1f1f1f',
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  cardTitle: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
  },
});
