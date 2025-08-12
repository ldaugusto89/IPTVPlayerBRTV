import React from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../@types/navigation';
import Sidebar from '../components/Sidebar';
import ContentRow from '../components/ContentRow';
import { useContent } from '../context/ChannelContext';
import { useFavorites } from '../context/FavoritesContext';
import { useHistory } from '../context/HistoryContext';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { channels, movies, series, isLoading } = useContent();
  const { favorites } = useFavorites();
  const { history } = useHistory();

  // Função para navegar para a tela de detalhes de uma categoria
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
            <ContentRow
              title="Continuar Assistindo"
              data={history}
              type="channel" // O tipo aqui afeta mais o clique, podemos refinar depois
            />
            <ContentRow
              title="Favoritos"
              data={favorites}
              type="channel"
            />
            <ContentRow
              title="Canais"
              data={channels.slice(0, 20)} // Mostra uma prévia
              type="channel"
              onSeeAll={() => navigateToCategory('Canais')}
            />
            <ContentRow
              title="Filmes"
              data={movies.slice(0, 20)} // Mostra uma prévia
              type="movie"
              onSeeAll={() => navigateToCategory('Filmes')}
            />
            <ContentRow
              title="Séries"
              data={series.slice(0, 20)} // Mostra uma prévia
              type="series"
              onSeeAll={() => navigateToCategory('Series')}
            />
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#141414',
  },
  contentContainer: {
    flex: 1,
    paddingTop: 20,
    paddingLeft: 10,
  },
  loaderContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
