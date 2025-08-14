import { useMemo } from 'react';
import { useContent } from '../context/ChannelContext';
import { useFavorites } from '../context/FavoritesContext';
import { useHistory } from '../context/HistoryContext';
import { M3UItem } from '../context/ChannelContext';

// Esta função ajuda a agrupar séries pelo nome base, ignorando temporada/episódio
const getSeriesBaseName = (name: string) => name.split(/ S\d{1,2}E\d{1,2}/i)[0].trim();

export const useHomeScreenData = () => {
  const { channels, movies, series, isLoading } = useContent();
  const { favorites } = useFavorites();
  const { history } = useHistory();

  // Memoiza a lista de séries únicas para a Home, evitando recálculos
  const uniqueSeriesForHome = useMemo(() => {
    const seriesMap = new Map<string, M3UItem>();
    series.forEach(item => {
      const baseName = getSeriesBaseName(item.name);
      if (!seriesMap.has(baseName)) {
        seriesMap.set(baseName, item);
      }
    });
    return Array.from(seriesMap.values());
  }, [series]);

  // Memoiza a lista de filmes únicos para a Home
  const uniqueMoviesForHome = useMemo(() => {
    const movieMap = new Map<string, M3UItem>();
    movies.forEach(item => {
      if (!movieMap.has(item.name)) {
        movieMap.set(item.name, item);
      }
    });
    return Array.from(movieMap.values());
  }, [movies]);

  return {
    isLoading,
    history,
    favorites,
    channels: channels.slice(0, 20), // Já retorna a lista cortada
    uniqueMoviesForHome: uniqueMoviesForHome.slice(0, 20),
    uniqueSeriesForHome: uniqueSeriesForHome.slice(0, 20),
    // Retorna as listas completas para a função "Ver Todos"
    allChannels: channels,
    allMovies: uniqueMoviesForHome,
    allSeries: uniqueSeriesForHome,
  };
};