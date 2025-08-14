import React, { createContext, useState, useContext, ReactNode } from 'react';
import { EPGProgram, fetchAndParseXMLTV } from '../services/xmltvParser';

// Define a forma do nosso contexto
interface EPGContextType {
  epgData: EPGProgram[];
  isLoading: boolean;
  loadEpgData: (url: string | null) => Promise<void>;
}

// Cria o contexto com um valor padrão undefined
const EPGContext = createContext<EPGContextType | undefined>(undefined);

// Define as props do nosso provider
interface EPGProviderProps {
  children: ReactNode;
}

export const EPGProvider = ({ children }: EPGProviderProps) => {
  // CORREÇÃO: Inicia com array vazio para evitar erros
  const [epgData, setEpgData] = useState<EPGProgram[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadEpgData = async (url: string | null) => {
    if (!url) {
      console.log('Nenhuma URL de EPG fornecida.');
      setEpgData([]); // Limpa dados antigos se não houver URL
      return;
    }

    console.log(`Iniciando carregamento do EPG de: ${url}`);
    setIsLoading(true);
    try {
      const programmes = await fetchAndParseXMLTV(url);
      setEpgData(programmes);
      console.log(`${programmes.length} programas do EPG foram carregados com sucesso.`);
    } catch (error) {
      console.error('Falha ao carregar ou processar o EPG:', error);
      setEpgData([]); // Garante que epgData seja um array em caso de erro
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <EPGContext.Provider value={{ epgData, isLoading, loadEpgData }}>
      {children}
    </EPGContext.Provider>
  );
};

// Hook customizado para usar o contexto do EPG
export const useEPG = () => {
  const context = useContext(EPGContext);
  // CORREÇÃO: Retorna o contexto inteiro
  if (context === undefined) {
    throw new Error('useEPG deve ser usado dentro de um EPGProvider');
  }
  return context;
};
