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

export default function MoviesScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { movies, isLoading } = useContent();
  const { toggleFavorite, isFavorite } = useFavorites();

  const movieSections = useMemo(() => {
    if (isLoading) return [];
    const grouped = movies.reduce((acc, movie) => {
      const groupTitle = (movie.group as any)?.title || movie.group || 'Outros';
      if (!acc[groupTitle]) acc[groupTitle] = [];
      acc[groupTitle].push(movie);
      return acc;
    }, {} as { [key: string]: M3UItem[] });

    return Object.keys(grouped).map(title => ({
      title,
      data: [grouped[title]],
    }));
  }, [movies, isLoading]);

  const handlePress = (item: M3UItem) => {
    navigation.navigate('Player', { url: item.url, title: item.name, logo: item.tvg?.logo || item.logo });
  };

  if (isLoading) {
    return <View style={styles.loaderContainer}><ActivityIndicator size="large" color="#fff" /></View>;
  }

  return (
    <View style={styles.container}>
      <Sidebar navigation={navigation} />
      <View style={styles.content}>
        <SectionList
          sections={movieSections}
          keyExtractor={(item, index) => item[0]?.url + index}
          ListHeaderComponent={<Text style={styles.screenTitle}>Filmes</Text>}
          renderSectionHeader={({ section: { title } }) => <Text style={styles.sectionHeader}>{title}</Text>}
          renderItem={({ item: movieGroup }) => (
            <FlatList
              horizontal
              data={movieGroup}
              keyExtractor={(movie) => movie.url}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingVertical: 15 }}
              renderItem={({ item: movie }) => (
                <FocusableButton onPress={() => handlePress(movie)} onLongPress={() => toggleFavorite(movie)} style={styles.card}>
                  <Image style={styles.cardImage} source={{ uri: movie.tvg?.logo || movie.logo }} defaultSource={require('../assets/placeholder.png')} />
                  <LinearGradient colors={['transparent', 'rgba(0,0,0,0.8)']} style={styles.gradientOverlay} />
                  <Text style={styles.cardTitle} numberOfLines={2}>{movie.name}</Text>
                  {isFavorite(movie) && <Ionicons name="star" color="#FFD700" size={18} style={styles.starIcon} />}
                </FocusableButton>
              )}
            />
          )}
        />
      </View>
    </View>
  );
}

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
