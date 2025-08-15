import { useMemo } from 'react';
import { useContent } from '../context/ChannelContext';
import { M3UItem } from '../services/m3uParser';

export const useHomeScreenData = () => {
  // O hook agora retorna arrays vazios para não quebrar a HomeScreen.
  // A lógica de "Continue Assistindo" e "Adicionados Recentemente"
  // precisará ser refeita usando a API.
  const recentlyAdded: M3UItem[] = useMemo(() => [], []);
  const continueWatching: M3UItem[] = useMemo(() => [], []);

  return { recentlyAdded, continueWatching };
};