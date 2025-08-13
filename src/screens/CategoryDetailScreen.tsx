import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList, M3UItem } from '../../@types/navigation';
import { FlashList } from '@shopify/flash-list';
import FocusableButton from '../components/FocusableButton';
import { useFavorites } from '../context/FavoritesContext';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';

// Tipos para a navegação e rota desta tela
type CategoryDetailRouteProp = RouteProp<RootStackParamList, 'CategoryDetail'>;
type CategoryDetailNavigationProp = StackNavigationProp<RootStackParamList, 'CategoryDetail'>;

// Reutilizamos a função para extrair o nome base da série
const getSeriesBaseName = (name: string) => name.split(/ S\d{1,2}E\d{1,2}/i)[0].trim();

export default function CategoryDetailScreen() {
  const route = useRoute<CategoryDetailRouteProp>();
  const navigation = useNavigation<CategoryDetailNavigationProp>();
  const { title, items, type } = route.params; // Recebemos os dados via navegação
  const { toggleFavorite, isFavorite } = useFavorites();

  const handlePress = (item: M3UItem) => {
    if (type === 'series') {
      navigation.navigate('SeriesDetail', { 
        seriesName: getSeriesBaseName(item.name), 
        seriesLogo: item.tvg?.logo || item.logo 
      });
    } else {
      navigation.navigate('Player', { url: item.url, title: item.name, logo: item.tvg?.logo || item.logo });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.screenTitle}>{title}</Text>
      <FlashList
        data={items}
        keyExtractor={(item) => item.url}
        numColumns={5}
        estimatedItemSize={196} // Altura do card + margem
        renderItem={({ item }) => {
          const displayName = type === 'series' ? getSeriesBaseName(item.name) : item.name;
          return (
            <FocusableButton
              onPress={() => handlePress(item)}
              onLongPress={() => toggleFavorite(item)}
              style={styles.card}
            >
              <Image style={styles.cardImage} source={{ uri: item.tvg?.logo || item.logo }} defaultSource={require('../assets/placeholder.png')} />
              <LinearGradient colors={['transparent', 'rgba(0,0,0,0.8)']} style={styles.gradientOverlay} />
              <Text style={styles.cardTitle} numberOfLines={2}>{displayName}</Text>
              {isFavorite(item) && <Ionicons name="star" color="#FFD700" size={18} style={styles.starIcon} />}
            </FocusableButton>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#141414' },
  screenTitle: { color: '#fff', fontSize: 28, fontWeight: 'bold', margin: 20 },
  card: { flex: 1, height: 180, margin: 8, borderRadius: 8, backgroundColor: '#282828', justifyContent: 'flex-end' },
  cardImage: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, resizeMode: 'cover', borderRadius: 8 },
  gradientOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, height: '50%', borderRadius: 8 },
  cardTitle: { color: '#fff', fontSize: 13, fontWeight: 'bold', textAlign: 'center', padding: 8, zIndex: 1 },
  starIcon: { position: 'absolute', top: 8, right: 8, zIndex: 1 },
});
