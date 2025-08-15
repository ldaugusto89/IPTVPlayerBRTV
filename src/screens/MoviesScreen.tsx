import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../@types/navigation';
import { useContent } from '../context/ChannelContext';
import { getVodCategories, getVodStreams } from '../services/xtreamService';
import Sidebar from '../components/Sidebar';
import ContentMediaRow from '../components/ContentMediaRow'; // Reutilizaremos a fileira de carrossel

type MoviesScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Movies'
>;

// Interface para agrupar a categoria com seus filmes
interface CategoryWithMovies {
  category_id: string;
  category_name: string;
  movies: any[];
}

const MoviesScreen = () => {
  const navigation = useNavigation<MoviesScreenNavigationProp>();
  const { serverInfo } = useContent();

  // Estado para armazenar todas as categorias com seus respectivos filmes
  const [moviesByCategories, setMoviesByCategories] = useState<
    CategoryWithMovies[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  // Efeito para buscar TODAS as categorias e TODOS os filmes
  useEffect(() => {
    const fetchAllMovies = async () => {
      if (!serverInfo) {
        setIsLoading(false);
        return;
      }
      setIsLoading(true);

      try {
        // 1. Busca todas as categorias de filmes
        const categories = await getVodCategories(serverInfo);
        if (!Array.isArray(categories) || categories.length === 0) {
          setMoviesByCategories([]);
          return;
        }

        // 2. Para cada categoria, cria uma promessa para buscar seus filmes
        const moviePromises = categories.map(category =>
          getVodStreams(serverInfo, category.category_id).then(movies => ({
            category_id: category.category_id,
            category_name: category.category_name,
            movies: Array.isArray(movies) ? movies : [],
          })),
        );

        // 3. Executa todas as buscas em paralelo
        const results = await Promise.all(moviePromises);

        // 4. Filtra categorias que não retornaram filmes e atualiza o estado
        setMoviesByCategories(results.filter(cat => cat.movies.length > 0));
      } catch (error) {
        console.error('Erro ao carregar todos os filmes por categoria:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllMovies();
  }, [serverInfo]);

  // Se estiver carregando, exibe um indicador central
  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <Sidebar navigation={navigation} />
        <View style={styles.centeredContent}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.loadingText}>Carregando filmes...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Sidebar navigation={navigation} />
      <ScrollView style={styles.mainContent}>
        <Text style={styles.screenTitle}>Filmes</Text>
        {moviesByCategories.map(categoryData => (
          <ContentMediaRow
            key={categoryData.category_id}
            title={categoryData.category_name}
            items={categoryData.movies.slice(0, 20)}
            navigation={navigation}
            seeAllScreen="CategoryDetail"
            categoryId={categoryData.category_id}
            type="movie" // Passa o tipo para a navegação
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#141414',
  },
  loaderContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#141414',
  },
  centeredContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#ccc',
    marginTop: 10,
  },
  mainContent: {
    flex: 1,
    paddingLeft: 10,
  },
  screenTitle: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    margin: 20,
  },
});

export default MoviesScreen;
