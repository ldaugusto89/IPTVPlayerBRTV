import React, { useMemo } from 'react';
import { View, Text, StyleSheet, SectionList, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList, M3UItem } from '../../@types/navigation';
import { useContent } from '../context/ChannelContext';
import Sidebar from '../components/Sidebar';
import ContentRow from '../components/ContentRow';

type NavigationProp = StackNavigationProp<RootStackParamList>;

export default function MoviesScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { movies, isLoading } = useContent();

  const movieSections = useMemo(() => {
    if (isLoading) return [];
    const uniqueMovies = new Map<string, M3UItem>();
    movies.forEach(item => {
      if (!uniqueMovies.has(item.name)) uniqueMovies.set(item.name, item);
    });

    const grouped = Array.from(uniqueMovies.values()).reduce((acc, movie) => {
      const groupTitle = (movie.group as any)?.title || movie.group || 'Outros';
      if (!acc[groupTitle]) acc[groupTitle] = [];
      acc[groupTitle].push(movie);
      return acc;
    }, {} as { [key: string]: M3UItem[] });

    return Object.keys(grouped).map(title => ({ title, data: [grouped[title]] }));
  }, [movies, isLoading]);

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
            <ContentRow
              title=""
              data={movieGroup.slice(0, 10)} // Mostra apenas uma prévia
              type="movie"
              onSeeAll={() => navigation.navigate('CategoryDetail', {
                title: movieGroup[0].group.title,
                items: movieGroup, // Passa a lista completa
                type: 'movie',
              })}
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
});
