import React, { createContext, useState, useContext, ReactNode } from 'react';

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

export interface VodItem {
  stream_id: number;
  name: string;
  stream_icon: string;
  rating_5based: number;
  category_id: string;
}

export interface SeriesItem {
  series_id: number;
  name: string;
  cover: string;
  rating_5based: number;
  category_id: string;
}

// --- Definição do Contexto ---

interface ChannelContextType {
  serverInfo: ServerInfo | null;
  setServerInfo: (info: ServerInfo | null) => void;
  
  // Armazena a lista COMPLETA de filmes e séries
  allMovies: VodItem[];
  setAllMovies: (movies: VodItem[]) => void;
  allSeries: SeriesItem[];
  setAllSeries: (series: SeriesItem[]) => void;

  // Armazena as listas de categorias
  liveCategories: ApiCategory[];
  setLiveCategories: (categories: ApiCategory[]) => void;
  vodCategories: ApiCategory[];
  setVodCategories: (categories: ApiCategory[]) => void;
  seriesCategories: ApiCategory[];
  setSeriesCategories: (categories: ApiCategory[]) => void;

  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const ChannelContext = createContext<ChannelContextType | undefined>(undefined);

export const ChannelProvider = ({ children }: { children: ReactNode }) => {
  const [serverInfo, setServerInfo] = useState<ServerInfo | null>(null);
  const [allMovies, setAllMovies] = useState<VodItem[]>([]);
  const [allSeries, setAllSeries] = useState<SeriesItem[]>([]);
  const [liveCategories, setLiveCategories] = useState<ApiCategory[]>([]);
  const [vodCategories, setVodCategories] = useState<ApiCategory[]>([]);
  const [seriesCategories, setSeriesCategories] = useState<ApiCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const value = {
    serverInfo, setServerInfo,
    allMovies, setAllMovies,
    allSeries, setAllSeries,
    liveCategories, setLiveCategories,
    vodCategories, setVodCategories,
    seriesCategories, setSeriesCategories,
    isLoading, setIsLoading
  };

  return (
    <ChannelContext.Provider value={value}>
      {children}
    </ChannelContext.Provider>
  );
};

export const useContent = () => {
  const context = useContext(ChannelContext);
  if (!context) { throw new Error('useContent must be used within a ChannelProvider'); }
  return context;
};
