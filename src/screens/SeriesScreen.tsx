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
import { getSeriesCategories, getSeriesStreams } from '../services/xtreamService';
import Sidebar from '../components/Sidebar';
import ContentMediaRow from '../components/ContentMediaRow';

type SeriesScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Series'
>;

// Interface para agrupar a categoria com suas séries
interface CategoryWithSeries {
  category_id: string;
  category_name: string;
  series: any[];
}

const SeriesScreen = () => {
  const navigation = useNavigation<SeriesScreenNavigationProp>();
  const { serverInfo } = useContent();

  const [seriesByCategories, setSeriesByCategories] = useState<
    CategoryWithSeries[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAllSeries = async () => {
      if (!serverInfo) {
        setIsLoading(false);
        return;
      }
      setIsLoading(true);

      try {
        const categories = await getSeriesCategories(serverInfo);
        if (!Array.isArray(categories) || categories.length === 0) {
          setSeriesByCategories([]);
          return;
        }

        const seriesPromises = categories.map(category =>
          getSeriesStreams(serverInfo, category.category_id).then(series => ({
            category_id: category.category_id,
            category_name: category.category_name,
            series: Array.isArray(series) ? series : [],
          })),
        );

        const results = await Promise.all(seriesPromises);
        setSeriesByCategories(results.filter(cat => cat.series.length > 0));

      } catch (error) {
        console.error('Erro ao carregar todas as séries por categoria:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllSeries();
  }, [serverInfo]);

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <Sidebar navigation={navigation} />
        <View style={styles.centeredContent}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.loadingText}>Carregando séries...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Sidebar navigation={navigation} />
      <ScrollView style={styles.mainContent}>
        <Text style={styles.screenTitle}>Séries</Text>
        {seriesByCategories.map(categoryData => (
          <ContentMediaRow
            key={categoryData.category_id}
            title={categoryData.category_name}
            items={categoryData.series.slice(0, 20)}
            navigation={navigation}
            seeAllScreen="CategoryDetail"
            categoryId={categoryData.category_id}
            type="series"
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

export default SeriesScreen;
