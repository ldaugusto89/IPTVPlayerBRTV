import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { M3UItem } from './ChannelContext'; // Reutilizamos o mesmo tipo de item

const HISTORY_KEY = '@iptv_history';
const MAX_HISTORY_ITEMS = 20; // Limite de itens no histórico

interface HistoryContextType {
  history: M3UItem[];
  addToHistory: (item: M3UItem) => Promise<void>;
}

const HistoryContext = createContext<HistoryContextType>({
  history: [],
  addToHistory: async () => {},
});

export const HistoryProvider = ({ children }: { children: ReactNode }) => {
  const [history, setHistory] = useState<M3UItem[]>([]);

  useEffect(() => {
    // Carrega o histórico salvo no AsyncStorage quando o app inicia
    const loadHistory = async () => {
      try {
        const storedHistory = await AsyncStorage.getItem(HISTORY_KEY);
        if (storedHistory) {
          setHistory(JSON.parse(storedHistory));
        }
      } catch (e) {
        console.error('Failed to load history.', e);
      }
    };
    loadHistory();
  }, []);

  const addToHistory = async (itemToAdd: M3UItem) => {
    try {
      // Remove o item se ele já existir para colocá-lo no topo
      const filteredHistory = history.filter(item => item.url !== itemToAdd.url);
      
      // Adiciona o novo item no início da lista
      const newHistory = [itemToAdd, ...filteredHistory];

      // Limita o histórico ao número máximo de itens
      if (newHistory.length > MAX_HISTORY_ITEMS) {
        newHistory.length = MAX_HISTORY_ITEMS;
      }

      setHistory(newHistory);
      await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
    } catch (e) {
      console.error('Failed to save history.', e);
    }
  };

  return (
    <HistoryContext.Provider value={{ history, addToHistory }}>
      {children}
    </HistoryContext.Provider>
  );
};

export const useHistory = () => useContext(HistoryContext);