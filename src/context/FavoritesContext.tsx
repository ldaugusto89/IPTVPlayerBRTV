import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { M3UItem } from '../utils/m3uParser';

type FavoritesContextType = {
  favorites: M3UItem[];
  toggleFavorite: (item: M3UItem) => void;
  isFavorite: (item: M3UItem) => boolean;
};

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<M3UItem[]>([]);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    const json = await AsyncStorage.getItem('@favorites');
    if (json) setFavorites(JSON.parse(json));
  };

  const saveFavorites = async (data: M3UItem[]) => {
    setFavorites(data);
    await AsyncStorage.setItem('@favorites', JSON.stringify(data));
  };

  const toggleFavorite = (item: M3UItem) => {
    const exists = favorites.find(f => f.url === item.url);
    if (exists) {
      const updated = favorites.filter(f => f.url !== item.url);
      saveFavorites(updated);
    } else {
      saveFavorites([...favorites, item]);
    }
  };

  const isFavorite = (item: M3UItem) => {
    return favorites.some(f => f.url === item.url);
  };

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error('useFavorites must be used within FavoritesProvider');
  return ctx;
};