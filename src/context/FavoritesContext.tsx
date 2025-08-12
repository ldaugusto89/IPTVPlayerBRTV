import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { M3UItem } from './ChannelContext';

const FAVORITES_KEY = '@iptv_favorites';

interface FavoritesContextType {
  favorites: M3UItem[];
  toggleFavorite: (item: M3UItem) => void;
  isFavorite: (item: M3UItem) => boolean;
  toastMessage: string | null; // <-- NOVO: para a mensagem
}

const FavoritesContext = createContext<FavoritesContextType>({
  favorites: [],
  toggleFavorite: () => {},
  isFavorite: () => false,
  toastMessage: null,
});

export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  const [favorites, setFavorites] = useState<M3UItem[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null); // <-- NOVO

  useEffect(() => {
    const loadFavorites = async () => {
      const storedFavorites = await AsyncStorage.getItem(FAVORITES_KEY);
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }
    };
    loadFavorites();
  }, []);

  const isFavorite = (itemToCheck: M3UItem) => {
    return favorites.some(fav => fav.url === itemToCheck.url);
  };

  const toggleFavorite = (itemToToggle: M3UItem) => {
    let newFavorites: M3UItem[];
    let message: string;

    if (isFavorite(itemToToggle)) {
      newFavorites = favorites.filter(fav => fav.url !== itemToToggle.url);
      message = 'Removido dos Favoritos';
    } else {
      newFavorites = [itemToToggle, ...favorites];
      message = 'Adicionado aos Favoritos';
    }

    setFavorites(newFavorites);
    AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));

    // Lógica para exibir a mensagem de feedback
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 2000); // Esconde a mensagem após 2 segundos
  };

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite, toastMessage }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoritesContext);
