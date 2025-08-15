import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../@types/navigation';
import { useContent } from '../context/ChannelContext';
import Sidebar from '../components/Sidebar';
import { getRecentVods, getRecentSeries, getLiveCategories } from '../services/xtreamService';
import ContentMediaRow from '../components/ContentMediaRow'; // Importando o novo componente de mídia
import ContentChannelRow from '../components/ContentChannelRow'; // Importando o novo componente de canais

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { 
    serverInfo, 
    recentMovies, setRecentMovies,
    recentSeries, setRecentSeries,
    liveCategories, setLiveCategories,
    isLoading, setIsLoading
  } = useContent();

  useEffect(() => {
    const fetchHomeContent = async () => {
      if (!serverInfo) return;

      setIsLoading(true);
      try {
        const [movies, series, channels] = await Promise.all([
          getRecentVods(serverInfo),
          getRecentSeries(serverInfo),
          getLiveCategories(serverInfo)
        ]);
        
        setRecentMovies(Array.isArray(movies) ? movies : []);
        setRecentSeries(Array.isArray(series) ? series : []);
        setLiveCategories(Array.isArray(channels) ? channels : []);
      } catch (error) {
        console.error("Erro ao buscar conteúdo da Home:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHomeContent();
  }, [serverInfo]);

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <Sidebar navigation={navigation} />
        <View style={styles.content}>
          <ActivityIndicator size="large" color="#fff" />
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

        {recentMovies.length > 0 && (
           <ContentMediaRow 
             title="Filmes" 
             items={recentMovies.slice(0, 10)}
             navigation={navigation}
             seeAllScreen="Movies"
           />
        )}

        {recentSeries.length > 0 && (
           <ContentMediaRow 
             title="Séries" 
             items={recentSeries.slice(0, 10)}
             navigation={navigation}
             seeAllScreen="Series"
           />
        )}

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
});

export default HomeScreen;
