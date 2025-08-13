import React, { useMemo } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../@types/navigation';
import Sidebar from '../components/Sidebar';
import ContentRow from '../components/ContentRow';
import { useContent, M3UItem } from '../context/ChannelContext';
import { useFavorites } from '../context/FavoritesContext';
import { useHistory } from '../context/HistoryContext';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

// Reutilizamos a função para extrair o nome base da série
const getSeriesBaseName = (name: string) => name.split(/ S\d{1,2}E\d{1,2}/i)[0].trim();

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { channels, movies, series, isLoading } = useContent();
  const { favorites } = useFavorites();
  const { history } = useHistory();

  // CRIA UMA LISTA DE SÉRIES ÚNICAS PARA A HOME
  const uniqueSeriesForHome = useMemo(() => {
    const seriesMap = new Map<string, M3UItem>();
    series.forEach(item => {
      const baseName = getSeriesBaseName(item.name);
      if (!seriesMap.has(baseName)) {
        seriesMap.set(baseName, item);
      }
    });
    return Array.from(seriesMap.values());
  }, [series]);

  // CRIA UMA LISTA DE FILMES ÚNICOS PARA A HOME
  const uniqueMoviesForHome = useMemo(() => {
    const movieMap = new Map<string, M3UItem>();
    movies.forEach(item => {
      if (!movieMap.has(item.name)) {
        movieMap.set(item.name, item);
      }
    });
    return Array.from(movieMap.values());
  }, [movies]);

  const navigateToCategory = (category: 'Canais' | 'Filmes' | 'Series') => {
    navigation.navigate(category);
  };

  return (
    <View style={styles.container}>
      <Sidebar navigation={navigation} />
      <ScrollView style={styles.contentContainer}>
        {isLoading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#fff" />
          </View>
        ) : (
          <>
            <ContentRow title="Continuar Assistindo" data={history} type="channel" />
            <ContentRow title="Favoritos" data={favorites} type="channel" />
            <ContentRow title="Canais" data={channels.slice(0, 20)} type="channel" onSeeAll={() => navigateToCategory('Canais')} />
            {/* USA AS NOVAS LISTAS ÚNICAS */}
            <ContentRow title="Filmes" data={uniqueMoviesForHome.slice(0, 20)} type="movie" onSeeAll={() => navigateToCategory('Filmes')} />
            <ContentRow title="Séries" data={uniqueSeriesForHome.slice(0, 20)} type="series" onSeeAll={() => navigateToCategory('Series')} />
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, flexDirection: 'row', backgroundColor: '#141414' },
  contentContainer: { flex: 1, paddingTop: 20, paddingLeft: 10 },
  loaderContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
