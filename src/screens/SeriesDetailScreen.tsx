import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import {
  SeriesDetailScreenRouteProp,
  SeriesDetailScreenNavigationProp,
} from '../../@types/navigation';
import { useContent } from '../context/ChannelContext';
import { getSeriesInfo } from '../services/xtreamService';
import { buildVideoUrl } from '../utils/buildXtreamUrls';
import SeriesHeader from '../components/series/SeriesHeader';
import SeasonSelector from '../components/series/SeasonSelector';
import Sidebar from '../components/Sidebar';

export default function SeriesDetailScreen() {
  const route = useRoute<SeriesDetailScreenRouteProp>();
  const navigation = useNavigation<SeriesDetailScreenNavigationProp>();
  const { serverInfo } = useContent();
  const { seriesId } = route.params;

  const [seriesInfo, setSeriesInfo] = useState<any>(null);
  const [episodesBySeason, setEpisodesBySeason] = useState<any>({});
  const [availableSeasons, setAvailableSeasons] = useState<number[]>([]);
  const [selectedSeason, setSelectedSeason] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!serverInfo || !seriesId) return;
      setIsLoading(true);
      try {
        const data = await getSeriesInfo(serverInfo, seriesId);
        setSeriesInfo(data.info);

        const seasons: { [key: number]: any[] } = data.episodes;
        const seasonNumbers = Object.keys(seasons)
          .map(Number)
          .sort((a, b) => a - b);
        
        setEpisodesBySeason(seasons);
        setAvailableSeasons(seasonNumbers);
        if (seasonNumbers.length > 0) {
          setSelectedSeason(seasonNumbers[0]);
        }
      } catch (error) {
        console.error('Erro ao buscar detalhes da série:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetails();
  }, [serverInfo, seriesId]);

  const handleEpisodePress = (episode: any) => {
    if (serverInfo) {
      const videoUrl = buildVideoUrl(serverInfo, episode.id, 'series');
      if (videoUrl) {
        navigation.navigate('Player', {
          videoUrl: videoUrl,
          title: `${seriesInfo.name} - ${episode.title}`,
        });
      }
    }
  };

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

  if (!seriesInfo) {
    return (
      <View style={styles.container}>
        <Text style={styles.episodeText}>Não foi possível carregar a série.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Sidebar navigation={navigation} />
      <ScrollView style={styles.mainContent}>
        <SeriesHeader
          seriesName={seriesInfo.name}
          seriesLogo={seriesInfo.cover}
        />
        <SeasonSelector
          seasons={availableSeasons}
          selectedSeason={selectedSeason}
          onSelectSeason={setSelectedSeason}
        />
        {selectedSeason &&
          episodesBySeason[selectedSeason]?.map((episode: any) => (
            <TouchableOpacity
              key={episode.id}
              style={styles.episodeButton}
              onPress={() => handleEpisodePress(episode)}>
              <Text style={styles.episodeText}>
                E{episode.episode_num}. {episode.title}
              </Text>
            </TouchableOpacity>
          ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#141414', flexDirection: 'row' },
  loaderContainer: { flex: 1, backgroundColor: '#141414', flexDirection: 'row' },
  centeredContent: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  mainContent: { flex: 1 },
  episodeButton: {
    padding: 15,
    backgroundColor: '#222',
    marginBottom: 5,
    borderRadius: 5,
    marginHorizontal: 20,
  },
  episodeText: { color: '#fff', fontSize: 16 },
});
