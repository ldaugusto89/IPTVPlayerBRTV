import React, { createContext, useState, useContext, ReactNode } from 'react';

// Define a estrutura de um item da lista M3U
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
  // Adicione quaisquer outros campos que seu parser retorna
}

// Define os tipos para o nosso contexto
interface ChannelContextType {
  channels: M3UItem[];
  movies: M3UItem[];
  series: M3UItem[];
  setAllContent: (items: M3UItem[]) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

// Cria o contexto com valores padrão
const ChannelContext = createContext<ChannelContextType>({
  channels: [],
  movies: [],
  series: [],
  setAllContent: () => {},
  isLoading: true,
  setIsLoading: () => {},
});

// Componente Provedor que envolve a aplicação
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
      const groupTitle = item.group?.title?.toLowerCase() || '';

      // Lógica de separação (pode ser ajustada conforme a sua lista)
      if (groupTitle.includes('filme') || groupTitle.includes('movie')) {
        moviesData.push(item);
      } else if (groupTitle.includes('série') || groupTitle.includes('series') || groupTitle.includes('serie')) {
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

// Hook customizado para usar o contexto facilmente
export const useContent = () => useContext(ChannelContext);