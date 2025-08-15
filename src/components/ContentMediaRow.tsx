import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../@types/navigation';
import { useContent } from '../context/ChannelContext';
import { buildVideoUrl } from '../utils/buildXtreamUrls'; // Importar a função de construção de URL

// Define os tipos de props que o componente pode receber
interface ContentMediaRowProps {
  title: string;
  items: any[];
  navigation: StackNavigationProp<RootStackParamList>;
  seeAllScreen?: keyof RootStackParamList; // Nome da tela para "Ver Todos"
  categoryId?: string; // ID da categoria para passar na navegação
  type?: 'movie' | 'series'; // Adiciona o tipo para a navegação de detalhes
}

const ContentMediaRow: React.FC<ContentMediaRowProps> = ({
  title,
  items,
  navigation,
  seeAllScreen,
  categoryId,
  type,
}) => {
  const { serverInfo } = useContent(); // Acessa as informações do servidor

  if (!items || items.length === 0) {
    return null;
  }

  const handleSeeAllPress = () => {
    if (!seeAllScreen) return;
    if (categoryId && type) {
      navigation.navigate(seeAllScreen, {
        categoryId: categoryId,
        title: title,
        type: type,
      });
    } else {
      navigation.navigate(seeAllScreen);
    }
  };

  // Função para lidar com o clique em um item (filme ou série)
  const handleItemPress = (item: any) => {
    const itemType = type || (item.series_id ? 'series' : 'movie');

    if (itemType === 'series') {
      navigation.navigate('SeriesDetail', { seriesId: item.series_id });
    } else if (itemType === 'movie' && serverInfo) {
      // Constrói a URL do vídeo para o player
      const videoUrl = buildVideoUrl(serverInfo, item.stream_id, 'movie');
      if (videoUrl) {
        navigation.navigate('Player', {
          videoUrl: videoUrl,
          title: item.name,
        });
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {seeAllScreen && (
          <TouchableOpacity onPress={handleSeeAllPress}>
            <Text style={styles.seeAllText}>Ver Todos</Text>
          </TouchableOpacity>
        )}
      </View>
      <FlatList
        data={items}
        keyExtractor={item =>
          (item.stream_id || item.series_id).toString()
        }
        horizontal
        renderItem={({ item }) => (
          // Adiciona o onPress ao TouchableOpacity do item
          <TouchableOpacity onPress={() => handleItemPress(item)}>
            <Image
              source={{ uri: item.stream_icon || item.cover }}
              style={styles.poster}
              resizeMode="cover"
            />
          </TouchableOpacity>
        )}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: 10,
    marginRight: 20,
    marginBottom: 10,
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  seeAllText: {
    color: '#00aaff',
    fontSize: 16,
  },
  poster: {
    width: 120,
    height: 180,
    marginRight: 10,
    borderRadius: 5,
    backgroundColor: '#222',
  },
});

export default ContentMediaRow;
