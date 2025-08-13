import React, { useMemo } from 'react';
import { View, Text, StyleSheet, SectionList, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList, M3UItem } from '../../@types/navigation';
import { useContent } from '../context/ChannelContext';
import Sidebar from '../components/Sidebar';
import ContentRow from '../components/ContentRow';

type NavigationProp = StackNavigationProp<RootStackParamList>;

const getSeriesBaseName = (name: string) => name.split(/ S\d{1,2}E\d{1,2}/i)[0].trim();

export default function SeriesScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { series, isLoading } = useContent();

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
        if (!seriesMap.has(baseName)) seriesMap.set(baseName, item);
      });
      return { title, data: [Array.from(seriesMap.values())] };
    });
  }, [series, isLoading]);

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
            <ContentRow
              title=""
              data={seriesGroup.slice(0, 10)} // Mostra apenas uma prévia
              type="series"
              onSeeAll={() => navigation.navigate('CategoryDetail', {
                title: seriesGroup[0].group.title,
                items: seriesGroup, // Passa a lista completa
                type: 'series',
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
