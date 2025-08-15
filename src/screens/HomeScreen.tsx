import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../@types/navigation';
import { useContent } from '../context/ChannelContext';
import Sidebar from '../components/Sidebar';
import { getVodStreams, getSeries, getLiveCategories, getVodCategories, getSeriesCategories } from '../services/xtreamService';
import ContentMediaRow from '../components/ContentMediaRow';
import ContentChannelRow from '../components/ContentChannelRow';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { 
    serverInfo, 
    allMovies, setAllMovies, 
    allSeries, setAllSeries,
    liveCategories, setLiveCategories,
    setVodCategories,
    setSeriesCategories,
    isLoading, setIsLoading
  } = useContent();

  useEffect(() => {
    const fetchAllContent = async () => {
      if (!serverInfo) return;

      // Só busca tudo se as listas estiverem vazias, para evitar recarregar
      if (allMovies.length > 0 || allSeries.length > 0) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        console.log("Buscando todo o conteúdo para o app...");
        const [movies, series, liveCat, vodCat, seriesCat] = await Promise.all([
          getVodStreams(serverInfo),
          getSeries(serverInfo),
          getLiveCategories(serverInfo),
          getVodCategories(serverInfo),
          getSeriesCategories(serverInfo)
        ]);
        
        setAllMovies(Array.isArray(movies) ? movies : []);
        setAllSeries(Array.isArray(series) ? series : []);
        setLiveCategories(Array.isArray(liveCat) ? liveCat : []);
        setVodCategories(Array.isArray(vodCat) ? vodCat : []);
        setSeriesCategories(Array.isArray(seriesCat) ? seriesCat : []);
        console.log("Conteúdo completo carregado!");

      } catch (error) {
        console.error("Erro ao buscar todo o conteúdo:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllContent();
  }, [serverInfo]);

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <Sidebar navigation={navigation} />
        <View style={styles.content}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.loadingText}>Carregando conteúdo do seu provedor...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Sidebar navigation={navigation} />
      <ScrollView style={styles.content}>
        <Text style={styles.screenTitle}>Início</Text>
        
        {liveCategories.length > 0 && (
           <ContentChannelRow 
             title="Canais" 
             items={liveCategories.slice(0, 10)}
             navigation={navigation}
             seeAllScreen="Channels"
           />
        )}

        {allMovies.length > 0 && (
           <ContentMediaRow 
             title="Filmes" 
             items={allMovies.slice(0, 10)}
             navigation={navigation}
             seeAllScreen="Movies"
           />
        )}

        {allSeries.length > 0 && (
           <ContentMediaRow 
             title="Séries" 
             items={allSeries.slice(0, 10)}
             navigation={navigation}
             seeAllScreen="Series"
           />
        )}

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, flexDirection: 'row', backgroundColor: '#141414' },
  loaderContainer: { flex: 1, flexDirection: 'row', backgroundColor: '#141414' },
  content: { flex: 1, paddingLeft: 10, justifyContent: 'center', alignItems: 'center' },
  screenTitle: { color: '#fff', fontSize: 28, fontWeight: 'bold', margin: 20 },
  loadingText: { color: '#ccc', fontSize: 16, marginTop: 15 },
});

export default HomeScreen;