import React, { createContext, useState, useContext, ReactNode } from 'react';
import { fetchAndParseXMLTV, EPGProgram } from '../utils/xmltvParser';

interface EPGContextType {
  epgData: Map<string, EPGProgram[]>; // Um mapa de ID do canal para a sua programação
  isLoadingEPG: boolean;
  loadEpgData: (url: string) => Promise<void>;
  getProgramForChannel: (channelId: string) => { now?: EPGProgram, next?: EPGProgram };
}

const EPGContext = createContext<EPGContextType>({
  epgData: new Map(),
  isLoadingEPG: false,
  loadEpgData: async () => {},
  getProgramForChannel: () => ({}),
});

export const EPGProvider = ({ children }: { children: ReactNode }) => {
  const [epgData, setEpgData] = useState<Map<string, EPGProgram[]>>(new Map());
  const [isLoadingEPG, setIsLoadingEPG] = useState(false);

  const loadEpgData = async (url: string) => {
    if (!url) return;
    setIsLoadingEPG(true);
    try {
      const parsedData = await fetchAndParseXMLTV(url);
      setEpgData(parsedData);
    } catch (error) {
      console.error("Falha ao carregar dados do EPG:", error);
      setEpgData(new Map()); // Limpa em caso de erro
    } finally {
      setIsLoadingEPG(false);
    }
  };

  const getProgramForChannel = (channelId: string) => {
    const programs = epgData.get(channelId);
    if (!programs) return {};

    const now = new Date();
    const nowTimestamp = now.getTime();
    
    let currentProgram: EPGProgram | undefined;
    let nextProgram: EPGProgram | undefined;

    for (let i = 0; i < programs.length; i++) {
      const prog = programs[i];
      if (prog.start <= nowTimestamp && prog.stop > nowTimestamp) {
        currentProgram = prog;
        if (i + 1 < programs.length) {
          nextProgram = programs[i + 1];
        }
        break;
      }
    }
    
    return { now: currentProgram, next: nextProgram };
  };

  return (
    <EPGContext.Provider value={{ epgData, isLoadingEPG, loadEpgData, getProgramForChannel }}>
      {children}
    </EPGContext.Provider>
  );
};

export const useEPG = () => useContext(EPGContext);