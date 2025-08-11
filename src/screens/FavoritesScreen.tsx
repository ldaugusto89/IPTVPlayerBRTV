import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useFavorites } from '../context/FavoritesContext';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../@types/navigation';

type NavigationProps = NativeStackNavigationProp<RootStackParamList, 'Favorites'>;


export default function FavoritesScreen() {
  const { favorites } = useFavorites();
  const navigation = useNavigation<NavigationProps>();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>⭐ Favoritos</Text>
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.url}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() => navigation.navigate('Player', { url: item.url, title: item.title })}
          >
            <Text style={styles.name}>{item.title}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#111', padding: 10 },
  title: { fontSize: 22, color: 'white', marginBottom: 10 },
  item: { padding: 10, backgroundColor: '#222', marginBottom: 5, borderRadius: 5 },
  name: { color: 'white' },
});