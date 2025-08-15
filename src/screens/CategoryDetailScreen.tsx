import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../@types/navigation';
import { useContent } from '../context/ChannelContext';
import { getVodStreams, getSeriesStreams } from '../services/xtreamService';
import Sidebar from '../components/Sidebar';
import { buildVideoUrl } from '../utils/buildXtreamUrls'; // Importar a função

type CategoryDetailScreenRouteProp = RouteProp<
  RootStackParamList,
  'CategoryDetail'
>;
type CategoryDetailNavigationProp = StackNavigationProp<
  RootStackParamList,
  'CategoryDetail'
>;

const CategoryDetailScreen = () => {
  const route = useRoute<CategoryDetailScreenRouteProp>();
  const navigation = useNavigation<CategoryDetailNavigationProp>();
  const { serverInfo } = useContent();

  const { categoryId, title, type } = route.params;

  const [items, setItems] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchItems = async () => {
      if (!serverInfo || !categoryId || !type) {
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      try {
        let streams;
        if (type === 'movie') {
          streams = await getVodStreams(serverInfo, categoryId);
        } else if (type === 'series') {
          streams = await getSeriesStreams(serverInfo, categoryId);
        }
        setItems(Array.isArray(streams) ? streams : []);
      } catch (error) {
        console.error(
          `Erro ao buscar itens para a categoria ${categoryId}:`,
          error,
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchItems();
  }, [serverInfo, categoryId, type]);

  // Função para lidar com o clique em um item da grade
  const handleItemPress = (item: any) => {
    if (type === 'series') {
      navigation.navigate('SeriesDetail', { seriesId: item.series_id });
    } else if (type === 'movie' && serverInfo) {
      const videoUrl = buildVideoUrl(serverInfo, item.stream_id, 'movie');
      if (videoUrl) {
        navigation.navigate('Player', {
          videoUrl: videoUrl,
          title: item.name,
        });
      }
    }
  };

  const renderGridItem = ({ item }: { item: any }) => (
    // Adiciona o onPress ao TouchableOpacity do item
    <TouchableOpacity
      style={styles.gridItem}
      onPress={() => handleItemPress(item)}>
      <Image
        source={{ uri: item.stream_icon || item.cover }}
        style={styles.poster}
        resizeMode="cover"
      />
      <Text style={styles.itemTitle} numberOfLines={2}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <Sidebar navigation={navigation} />
        <View style={styles.centeredContent}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Sidebar navigation={navigation} />
      <View style={styles.mainContent}>
        <Text style={styles.screenTitle}>{title}</Text>
        <FlatList
          data={items}
          renderItem={renderGridItem}
          keyExtractor={item => (item.stream_id || item.series_id).toString()}
          numColumns={5}
          contentContainerStyle={styles.gridContainer}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, flexDirection: 'row', backgroundColor: '#141414' },
  loaderContainer: { flex: 1, flexDirection: 'row', backgroundColor: '#141414' },
  centeredContent: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  mainContent: { flex: 1, paddingLeft: 10 },
  screenTitle: { color: '#fff', fontSize: 28, fontWeight: 'bold', margin: 20 },
  gridContainer: {
    paddingHorizontal: 10,
  },
  gridItem: {
    flex: 1,
    margin: 5,
    alignItems: 'center',
  },
  poster: {
    width: 150,
    height: 220,
    borderRadius: 5,
    backgroundColor: '#222',
  },
  itemTitle: {
    color: 'white',
    marginTop: 5,
    textAlign: 'center',
    fontSize: 14,
    width: 150,
  },
});

export default CategoryDetailScreen;
