import React from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import FocusableButton from '../FocusableButton';

const getSeasonTitle = (seasonNumber: number) => `Temporada ${seasonNumber}`;

interface SeasonSelectorProps {
  seasons: number[];
  selectedSeason: number | null;
  onSelectSeason: (season: number) => void;
}

const SeasonSelector: React.FC<SeasonSelectorProps> = ({ seasons, selectedSeason, onSelectSeason }) => (
  <View style={styles.seasonSelectorContainer}>
    {seasons.length > 0 ? (
      <FlatList
        horizontal
        data={seasons}
        keyExtractor={(season) => `season-${season}`}
        renderItem={({ item: seasonNumber }) => (
          <FocusableButton
            onPress={() => onSelectSeason(seasonNumber)}
            style={[styles.seasonButton, selectedSeason === seasonNumber && styles.seasonButtonActive]}
          >
            <Text style={styles.seasonButtonText}>{getSeasonTitle(seasonNumber)}</Text>
          </FocusableButton>
        )}
      />
    ) : (
      <ActivityIndicator color="#fff" />
    )}
  </View>
);

const styles = StyleSheet.create({
  seasonSelectorContainer: { paddingVertical: 10, paddingHorizontal: 15, borderBottomColor: '#222', borderBottomWidth: 1 },
  seasonButton: { paddingVertical: 8, paddingHorizontal: 15, marginRight: 10, backgroundColor: '#333', borderRadius: 20 },
  seasonButtonActive: { backgroundColor: '#e50914' },
  seasonButtonText: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
});

export default SeasonSelector;
