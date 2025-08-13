import React, { useRef } from 'react';
import { View, Text, FlatList, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { M3UItem } from '../context/ChannelContext';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../@types/navigation';
import FocusableButton from './FocusableButton';
import { useFavorites } from '../context/FavoritesContext';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';

interface ContentRowProps {
  title: string;
  data: M3UItem[];
  type: 'channel' | 'movie' | 'series';
  onSeeAll?: () => void;
}

type NavigationProp = StackNavigationProp<RootStackParamList>;

// Reutilizamos a função para extrair o nome base da série
const getSeriesBaseName = (name: string) => name.split(/ S\d{1,2}E\d{1,2}/i)[0].trim();

const ContentRow: React.FC<ContentRowProps> = ({ title, data, type, onSeeAll }) => {
  const navigation = useNavigation<NavigationProp>();
  const flatListRef = useRef<FlatList<M3UItem>>(null);
  const { toggleFavorite, isFavorite } = useFavorites();

  const handlePress = (item: M3UItem) => {
    // AQUI ESTÁ A NOVA LÓGICA DE NAVEGAÇÃO
    if (type === 'series') {
      // Se for uma série, extrai o nome base e navega para a tela de detalhes
      const seriesName = getSeriesBaseName(item.name);
      navigation.navigate('SeriesDetail', { 
        seriesName: seriesName, 
        seriesLogo: item.tvg?.logo || item.logo 
      });
    } else {
      // Para filmes e canais, continua a ir diretamente para o player
      navigation.navigate('Player', { url: item.url, title: item.name, logo: item.tvg?.logo || item.logo });
    }
  };

  if (!data || data.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.titleHeader}>
        <Text style={styles.title}>{title}</Text>
        {onSeeAll && (
          <FocusableButton onPress={onSeeAll} style={styles.seeAllButton}>
            <Text style={styles.seeAllText}>Ver todos</Text>
          </FocusableButton>
        )}
      </View>
      <FlatList
        ref={flatListRef}
        data={data}
        keyExtractor={(item, index) => item.url + index}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: 15 }}
        renderItem={({ item, index }) => {
          // Determina o nome a ser exibido
          const displayName = type === 'series' ? getSeriesBaseName(item.name) : item.name;

          return (
            <FocusableButton
              onPress={() => handlePress(item)}
              onLongPress={() => toggleFavorite(item)}
              style={type === 'channel' ? styles.channelCard : styles.posterCard}
              onFocus={() => {
                flatListRef.current?.scrollToIndex({ index, animated: true, viewPosition: 0.5 });
              }}
            >
              <Image
                style={type === 'channel' ? styles.cardImageContain : styles.cardImageCover}
                source={{ uri: item.tvg?.logo || item.logo }}
                defaultSource={require('../assets/placeholder.png')}
              />
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.8)']}
                style={styles.gradientOverlay}
              />
              <Text style={styles.cardTitle} numberOfLines={2}>{displayName}</Text>
              
              {isFavorite(item) && (
                <Ionicons name="star" color="#FFD700" size={18} style={styles.starIcon} />
              )}
            </FocusableButton>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: 10 },
  titleHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 10, marginBottom: 5 },
  title: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  seeAllButton: { paddingHorizontal: 10 },
  seeAllText: { color: '#aaa', fontSize: 14 },
  posterCard: { width: 130, height: 180, marginHorizontal: 8, borderRadius: 8, backgroundColor: '#282828', justifyContent: 'flex-end' },
  channelCard: { width: 150, height: 150, marginHorizontal: 8, borderRadius: 8, backgroundColor: '#282828', justifyContent: 'flex-end' },
  cardImageContain: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, resizeMode: 'contain', margin: 10 },
  cardImageCover: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, resizeMode: 'cover', borderRadius: 8 },
  gradientOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, height: '50%', borderRadius: 8 },
  cardTitle: { color: '#fff', fontSize: 13, fontWeight: 'bold', textAlign: 'center', padding: 8, zIndex: 1 },
  starIcon: { position: 'absolute', top: 8, right: 8, zIndex: 1 },
});

export default ContentRow;
