import React, { useMemo } from 'react';
import { View, Text, StyleSheet, SectionList, FlatList, ActivityIndicator, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../@types/navigation';
import { useContent, M3UItem } from '../context/ChannelContext';
import FocusableButton from '../components/FocusableButton';
import { useFavorites } from '../context/FavoritesContext';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Sidebar from '../components/Sidebar';
import LinearGradient from 'react-native-linear-gradient';

type NavigationProp = StackNavigationProp<RootStackParamList>;

const getSeriesBaseName = (name: string) => name.split(/ S\d{1,2}E\d{1,2}/i)[0].trim();

export default function SeriesScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { series, isLoading } = useContent();
  const { toggleFavorite, isFavorite } = useFavorites();

  const seriesSections = useMemo(() => {
    if (isLoading) return [];
    
    const groupedByCategory = series.reduce((acc, episode) => {
      const groupTitle = (episode.group as any)?.title || episode.group || 'Outros';
      if (!acc[groupTitle]) acc[groupTitle] = [];
      acc[groupTitle].push(episode);
      return acc;
    }, {} as { [key: string]: M3UItem[] });

    return Object.keys(groupedByCategory).map(title => {
      const seriesMap = new Map<string, M3UItem>();
      groupedByCategory[title].forEach(item => {
        const baseName = getSeriesBaseName(item.name);
        if (!seriesMap.has(baseName)) {
          seriesMap.set(baseName, item);
        }
      });
      return {
        title,
        data: [Array.from(seriesMap.values())],
      };
    });
  }, [series, isLoading]);

  const handlePress = (item: M3UItem) => {
    navigation.navigate('SeriesDetail', { seriesName: getSeriesBaseName(item.name), seriesLogo: item.tvg?.logo || item.logo });
  };

  if (isLoading) {
    return <View style={styles.loaderContainer}><ActivityIndicator size="large" color="#fff" /></View>;
  }

  return (
    <View style={styles.container}>
      <Sidebar navigation={navigation} />
      <View style={styles.content}>
        <SectionList
          sections={seriesSections}
          keyExtractor={(item, index) => item[0]?.url + index}
          ListHeaderComponent={<Text style={styles.screenTitle}>Séries</Text>}
          renderSectionHeader={({ section: { title } }) => <Text style={styles.sectionHeader}>{title}</Text>}
          renderItem={({ item: seriesGroup }) => (
            <FlatList
              horizontal
              data={seriesGroup}
              keyExtractor={(serie) => serie.url}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingVertical: 15 }}
              renderItem={({ item: serie }) => (
                <FocusableButton onPress={() => handlePress(serie)} onLongPress={() => toggleFavorite(serie)} style={styles.card}>
                  <Image style={styles.cardImage} source={{ uri: serie.tvg?.logo || serie.logo }} defaultSource={require('../assets/placeholder.png')} />
                  <LinearGradient colors={['transparent', 'rgba(0,0,0,0.8)']} style={styles.gradientOverlay} />
                  <Text style={styles.cardTitle} numberOfLines={2}>{getSeriesBaseName(serie.name)}</Text>
                  {isFavorite(serie) && <Ionicons name="star" color="#FFD700" size={18} style={styles.starIcon} />}
                </FocusableButton>
              )}
            />
          )}
        />
      </View>
    </View>
  );
}

// Estilos são idênticos aos da MoviesScreen
const styles = StyleSheet.create({
  container: { flex: 1, flexDirection: 'row', backgroundColor: '#141414' },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#141414' },
  content: { flex: 1, paddingLeft: 10 },
  screenTitle: { color: '#fff', fontSize: 28, fontWeight: 'bold', margin: 20 },
  sectionHeader: { color: '#fff', fontSize: 20, fontWeight: 'bold', marginLeft: 10, marginTop: 10 },
  card: { width: 130, height: 180, margin: 8, borderRadius: 8, backgroundColor: '#282828', justifyContent: 'flex-end' },
  cardImage: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, resizeMode: 'cover', borderRadius: 8 },
  gradientOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, height: '50%', borderRadius: 8 },
  cardTitle: { color: '#fff', fontSize: 13, fontWeight: 'bold', textAlign: 'center', padding: 8, zIndex: 1 },
  starIcon: { position: 'absolute', top: 8, right: 8, zIndex: 1 },
});
