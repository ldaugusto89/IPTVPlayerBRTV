import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// A estrutura de um item da lista M3U
export interface M3UItem {
  name: string;
  url: string;
  logo?: string;
  group: {
    title: string;
  };
  tvg?: {
    id: string;
    name: string;
    logo: string;
  };
}

// Tipos para o nosso contexto
interface ChannelContextType {
  channels: M3UItem[];
  movies: M3UItem[];
  series: M3UItem[];
  setAllContent: (items: M3UItem[]) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

// Contexto com valores padrão
const ChannelContext = createContext<ChannelContextType>({
  channels: [],
  movies: [],
  series: [],
  setAllContent: () => {},
  isLoading: true,
  setIsLoading: () => {},
});

// Componente Provedor
export const ChannelProvider = ({ children }: { children: ReactNode }) => {
  const [channels, setChannels] = useState<M3UItem[]>([]);
  const [movies, setMovies] = useState<M3UItem[]>([]);
  const [series, setSeries] = useState<M3UItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Função que recebe a lista completa e a separa em categorias
  const setAllContent = (items: M3UItem[]) => {
    setIsLoading(true);
    const channelsData: M3UItem[] = [];
    const moviesData: M3UItem[] = [];
    const seriesData: M3UItem[] = [];

    items.forEach(item => {
      // AQUI ESTÁ A NOVA LÓGICA: Verificamos a URL do item
      const url = item.url.toLowerCase();

      if (url.includes('/movie/')) {
        moviesData.push(item);
      } else if (url.includes('/series/')) {
        seriesData.push(item);
      } else {
        channelsData.push(item);
      }
    });

    setChannels(channelsData);
    setMovies(moviesData);
    setSeries(seriesData);
    setIsLoading(false);
  };

  return (
    <ChannelContext.Provider value={{ channels, movies, series, setAllContent, isLoading, setIsLoading }}>
      {children}
    </ChannelContext.Provider>
  );
};

// Hook customizado para usar o contexto
export const useContent = () => useContext(ChannelContext);
