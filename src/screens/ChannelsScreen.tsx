import React from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, TouchableOpacity } from 'react-native';
import { useContent } from '../context/ChannelContext';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../@types/navigation';
import { useFavorites } from '../context/FavoritesContext';
import Ionicons from 'react-native-vector-icons/Ionicons'; // ou react-native-vector-icons/Ionicons

type NavigationProps = NativeStackNavigationProp<RootStackParamList, 'Canais'>;

export default function ChannelsScreen() {
  const { channels } = useContent();
  const grouped = groupBy(channels, 'group');
  const navigation = useNavigation<NavigationProps>();
  const { toggleFavorite, isFavorite } = useFavorites();

  return (
     <View style={styles.container}>
      <FlatList data={Object.keys(grouped)}
        keyExtractor={(item) => item}
        renderItem={({ item: group }) => (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{group}</Text>
            <FlatList horizontal
              data={grouped[group]}
              keyExtractor={(item, idx) => item.url + idx}
              renderItem={({ item }) => (
                <Pressable 
                  style={styles.card} 
                  onPress={() => navigation.navigate('Player', { url: item.url, title: item.title })}
                  onLongPress={() => toggleFavorite(item)} // Adicione esta linha
                  delayLongPress={500} // Meio segundo para ativar
                > 
                  <TouchableOpacity onPress={() => toggleFavorite(item)} style={styles.favoriteIcon}>
                    <Ionicons name={isFavorite(item) ? 'star' : 'star-outline'} size={24} color="gold"/>
                  </TouchableOpacity>
                  <Text style={styles.cardText}>{item.title}</Text>
                </Pressable>
              )}
            />
          </View>
        )}
      />
    </View>
  );

  
}

function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
  return array.reduce((result: Record<string, T[]>, current) => {
    const group = String(current[key] ?? 'Outros');
    if (!result[group]) result[group] = [];
    result[group].push(current);
    return result;
  }, {});
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', paddingTop: 30 },
  section: { marginBottom: 20 },
  sectionTitle: { color: '#fff', fontSize: 22, marginLeft: 15, marginBottom: 10 },
  card: {
    width: 200,
    height: 100,
    backgroundColor: '#222',
    marginHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  cardText: { color: '#fff', textAlign: 'center' },
  favoriteIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 1,
  },
});