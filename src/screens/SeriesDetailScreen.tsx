import React, { useMemo, useState, useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { SeriesDetailScreenRouteProp, SeriesDetailScreenNavigationProp } from '../../@types/navigation';
import { useContent, M3UItem } from '../context/ChannelContext';
import SeriesHeader from '../components/series/SeriesHeader';
import SeasonSelector from '../components/series/SeasonSelector';
import FocusableButton from '../components/FocusableButton';
import { FlashList } from '@shopify/flash-list'; // 1. Importar a FlashList

// --- Funções de Ajuda (permanecem as mesmas) ---
const getSeriesBaseName = (name: string) => name.split(/ S\d{1,2}E\d{1,2}/i)[0].trim();
const getSeasonNumber = (name: string): number => {
    const match = name.match(/S(\d{1,2})/i);
    return match ? parseInt(match[1], 10) : 1;
};
const getEpisodeNumber = (name: string): number => {
    const match = name.match(/E(\d{1,3})/i);
    return match ? parseInt(match[1], 10) : 0;
}

// --- Componente Principal ---
export default function SeriesDetailScreen() {
  const route = useRoute<SeriesDetailScreenRouteProp>();
  const navigation = useNavigation<SeriesDetailScreenNavigationProp>();
  const { seriesName, seriesLogo } = route.params;
  const { series } = useContent();
  const [selectedSeason, setSelectedSeason] = useState<number | null>(null);

  // A lógica de filtragem, que sabemos que está correta, permanece a mesma.
  const uniqueEpisodes = useMemo(() => {
    const episodeMap = new Map<string, M3UItem>();
    series
      .filter(item => getSeriesBaseName(item.name) === seriesName)
      .forEach(item => {
        if (!episodeMap.has(item.name)) {
          episodeMap.set(item.name, item);
        }
      });
    return Array.from(episodeMap.values());
  }, [series, seriesName]);

  const availableSeasons = useMemo(() => {
    const seasonSet = new Set<number>();
    uniqueEpisodes.forEach(episode => {
      seasonSet.add(getSeasonNumber(episode.name));
    });
    return Array.from(seasonSet).sort((a, b) => a - b);
  }, [uniqueEpisodes]);
  
  useEffect(() => {
    if (availableSeasons.length > 0 && selectedSeason === null) {
      setSelectedSeason(availableSeasons[0]);
    }
  }, [availableSeasons, selectedSeason]);

  const episodesForSelectedSeason = useMemo(() => {
    if (selectedSeason === null) return [];
    return uniqueEpisodes
      .filter(episode => getSeasonNumber(episode.name) === selectedSeason)
      .sort((a, b) => getEpisodeNumber(a.name) - getEpisodeNumber(b.name));
  }, [uniqueEpisodes, selectedSeason]);

  const handleEpisodePress = (item: M3UItem) => {
    navigation.navigate('Player', { url: item.url, title: item.name, logo: item.tvg?.logo });
  };

  // O cabeçalho que será renderizado pela FlashList
  const renderHeader = () => (
    <>
      <SeriesHeader seriesName={seriesName} seriesLogo={seriesLogo} />
      <SeasonSelector
        seasons={availableSeasons}
        selectedSeason={selectedSeason}
        onSelectSeason={setSelectedSeason}
      />
    </>
  );

  return (
    <View style={styles.container}>
      {/* 2. Usar a FlashList em vez da FlatList */}
      <FlashList
        data={episodesForSelectedSeason}
        keyExtractor={(item, index) => item.name + index}
        ListHeaderComponent={renderHeader()}
        // 3. Adicionar a propriedade obrigatória 'estimatedItemSize'
        // (altura aproximada de um botão de episódio)
        estimatedItemSize={60}
        renderItem={({ item }) => (
          <FocusableButton style={styles.episodeButton} onPress={() => handleEpisodePress(item)}>
            <Text style={styles.episodeText}>{item.name}</Text>
          </FocusableButton>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#141414' },
  episodeButton: { padding: 15, backgroundColor: '#222', marginBottom: 5, borderRadius: 5, marginHorizontal: 20 },
  episodeText: { color: '#fff', fontSize: 16 },
});
