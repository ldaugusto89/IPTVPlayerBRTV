import React, { useRef } from 'react';
import { View, Text, FlatList, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { M3UItem } from '../context/ChannelContext';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../@types/navigation';
import FocusableButton from './FocusableButton';

interface ContentRowProps {
  title: string;
  data: M3UItem[];
  type: 'channel' | 'movie' | 'series';
  onSeeAll?: () => void;
}

type NavigationProp = StackNavigationProp<RootStackParamList>;

const ContentRow: React.FC<ContentRowProps> = ({ title, data, type, onSeeAll }) => {
  const navigation = useNavigation<NavigationProp>();
  const flatListRef = useRef<FlatList<M3UItem>>(null);

  const handlePress = (item: M3UItem) => {
    navigation.navigate('Player', { url: item.url, title: item.name, logo: item.tvg?.logo || item.logo });
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
        // A CORREÇÃO ESTÁ AQUI: Adicionamos um padding vertical
        contentContainerStyle={{ paddingVertical: 15 }}
        renderItem={({ item, index }) => (
          <FocusableButton
            onPress={() => handlePress(item)}
            style={styles.card}
            onFocus={() => {
              flatListRef.current?.scrollToIndex({
                index,
                animated: true,
                viewPosition: 0.5,
              });
            }}
          >
            {({ focused }) => (
              <>
                <Image
                  style={styles.cardImage}
                  source={{ uri: item.tvg?.logo || item.logo }}
                  defaultSource={require('../assets/placeholder.png')}
                />
                <View style={styles.cardOverlay} />
                {focused && (
                   <Text style={styles.cardTitleFocused} numberOfLines={2}>{item.name}</Text>
                )}
              </>
            )}
          </FocusableButton>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 10, // Diminuímos a margem para compensar o padding
  },
  titleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginBottom: 5,
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  seeAllButton: {
    paddingHorizontal: 10,
  },
  seeAllText: {
    color: '#aaa',
    fontSize: 14,
  },
  card: {
    width: 130,
    height: 180,
    marginHorizontal: 8,
    borderRadius: 8,
  },
  cardImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
    backgroundColor: '#333',
  },
  cardOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 8,
  },
  cardTitleFocused: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    right: 8,
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.9)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 5,
  },
});

export default ContentRow;