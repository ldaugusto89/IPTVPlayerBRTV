import React from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';
import FocusableButton from './FocusableButton';
import { VodItem, SeriesItem } from '../context/ChannelContext';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../@types/navigation';
import { useContent } from '../context/ChannelContext';

type NavigationProp = StackNavigationProp<RootStackParamList>;
type ItemType = VodItem | SeriesItem;

interface ContentMediaRowProps {
  title: string;
  items: ItemType[];
  navigation: NavigationProp;
  seeAllScreen?: keyof RootStackParamList;
}

const ContentMediaRow = ({ title, items, navigation, seeAllScreen }: ContentMediaRowProps) => {
  const { serverInfo } = useContent();

  if (!items || items.length === 0) {
    return null;
  }

  const handlePress = (item: ItemType) => {
    if (!serverInfo) return;

    if ('stream_id' in item) { // É um filme
      const streamUrl = `${serverInfo.serverUrl.replace('/player_api.php', '')}/movie/${serverInfo.username}/${serverInfo.password}/${item.stream_id}.mp4`;
      navigation.navigate('Player', { 
        channel: { name: item.name, url: streamUrl, logo: item.stream_icon, group: { title: 'Filmes' } }
      });
    } else if ('series_id' in item) { // É uma série
      navigation.navigate('SeriesDetail', { seriesId: String(item.series_id) });
    }
  };

  const renderItem = ({ item }: { item: ItemType }) => {
    let imageUrl: string | undefined;
    if ('stream_icon' in item) {
      imageUrl = item.stream_icon;
    } else if ('cover' in item) {
      imageUrl = item.cover;
    }

    return (
      <FocusableButton onPress={() => handlePress(item)} style={styles.card}>
        <Image
          style={styles.cardImage}
          source={{ uri: imageUrl }}
          defaultSource={require('../assets/placeholder.png')}
        />
        <View style={styles.titleContainer}>
          <Text style={styles.cardTitle} numberOfLines={2}>{item.name}</Text>
        </View>
      </FocusableButton>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {seeAllScreen && (
          <TouchableOpacity onPress={() => navigation.navigate(seeAllScreen as any)}>
            <Text style={styles.seeAll}>Ver Todos</Text>
          </TouchableOpacity>
        )}
      </View>
      <FlatList
        horizontal
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => String('stream_id' in item ? item.stream_id : item.series_id)}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: 10 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
    container: { marginBottom: 20 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginLeft: 10, marginRight: 20, marginBottom: 10 },
    title: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
    seeAll: { color: '#1e90ff', fontSize: 16, fontWeight: 'bold' },
    card: { width: 150, height: 220, marginHorizontal: 8, borderRadius: 8, backgroundColor: '#282828', overflow: 'hidden' },
    cardImage: { width: '100%', height: '75%', resizeMode: 'cover', backgroundColor: '#1f1f1f' },
    titleContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 5 },
    cardTitle: { color: '#fff', fontSize: 14, textAlign: 'center' },
});

export default ContentMediaRow;
