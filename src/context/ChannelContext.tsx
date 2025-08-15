import React from 'react';
import { createContext, useState, useContext, ReactNode } from 'react';

// --- Interfaces para a nova arquitetura de API ---

export interface ServerInfo {
  serverUrl: string;
  username?: string;
  password?: string;
}

export interface ApiCategory {
  category_id: string;
  category_name: string;
  parent_id: number;
}

// A API retorna os itens de VOD (filmes) e Séries com uma estrutura diferente
export interface VodItem {
  stream_id: number;
  name: string;
  stream_icon: string;
  rating_5based: number;
}

export interface SeriesItem {
  series_id: number;
  name: string;
  cover: string;
  rating_5based: number;
}

// --- Definição do Contexto ---

interface ChannelContextType {
  serverInfo: ServerInfo | null;
  setServerInfo: (info: ServerInfo | null) => void;
  
  liveCategories: ApiCategory[];
  setLiveCategories: (categories: ApiCategory[]) => void;
  vodCategories: ApiCategory[];
  setVodCategories: (categories: ApiCategory[]) => void;
  seriesCategories: ApiCategory[];
  setSeriesCategories: (categories: ApiCategory[]) => void;

  // Novos estados para o conteúdo recente da HomeScreen
  recentMovies: VodItem[];
  setRecentMovies: (movies: VodItem[]) => void;
  recentSeries: SeriesItem[];
  setRecentSeries: (series: SeriesItem[]) => void;

  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const ChannelContext = createContext<ChannelContextType | undefined>(undefined);

export const ChannelProvider = ({ children }: { children: ReactNode }) => {
  const [serverInfo, setServerInfo] = useState<ServerInfo | null>(null);
  const [liveCategories, setLiveCategories] = useState<ApiCategory[]>([]);
  const [vodCategories, setVodCategories] = useState<ApiCategory[]>([]);
  const [seriesCategories, setSeriesCategories] = useState<ApiCategory[]>([]);
  const [recentMovies, setRecentMovies] = useState<VodItem[]>([]);
  const [recentSeries, setRecentSeries] = useState<SeriesItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const value = {
    serverInfo, setServerInfo,
    liveCategories, setLiveCategories,
    vodCategories, setVodCategories,
    seriesCategories, setSeriesCategories,
    recentMovies, setRecentMovies,
    recentSeries, setRecentSeries,
    isLoading, setIsLoading
  };

  return (
    <ChannelContext.Provider value={value}>
      {children}
    </ChannelContext.Provider>
  );
};

// Hook customizado para usar o contexto
export const useContent = () => {
  const context = useContext(ChannelContext);
  if (!context) {
    throw new Error('useContent deve ser usado dentro de um ChannelProvider');
  }
  return context;
};
