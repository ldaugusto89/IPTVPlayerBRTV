import React from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Image } from 'react-native';
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

  const handlePress = (item: M3UItem) => {
    navigation.navigate('Player', { url: item.url, title: item.name, logo: item.tvg?.logo || item.logo });
  };

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Sidebar navigation={navigation} />
      <View style={styles.content}>
        <Text style={styles.screenTitle}>Filmes</Text>
        <FlatList
          data={movies}
          keyExtractor={(item) => item.url}
          numColumns={5} // Define o número de colunas na grade
          renderItem={({ item }) => (
            <FocusableButton
              onPress={() => handlePress(item)}
              onLongPress={() => toggleFavorite(item)}
              style={styles.card}
            >
              <Image
                style={styles.cardImage}
                source={{ uri: item.tvg?.logo || item.logo }}
                defaultSource={require('../assets/placeholder.png')}
              />
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.8)']}
                style={styles.gradientOverlay}
              />
              <Text style={styles.cardTitle} numberOfLines={2}>{item.name}</Text>
              {isFavorite(item) && (
                <Ionicons name="star" color="#FFD700" size={18} style={styles.starIcon} />
              )}
            </FocusableButton>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#141414',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#141414',
  },
  content: {
    flex: 1,
    paddingLeft: 10,
  },
  screenTitle: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    margin: 20,
  },
  card: {
    flex: 1, // Permite que o card se ajuste na coluna
    height: 180,
    margin: 8,
    borderRadius: 8,
    backgroundColor: '#282828',
    justifyContent: 'flex-end',
  },
  cardImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    resizeMode: 'cover',
    borderRadius: 8,
  },
  gradientOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
    borderRadius: 8,
  },
  cardTitle: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 8,
    zIndex: 1,
  },
  starIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 1,
  },
});
