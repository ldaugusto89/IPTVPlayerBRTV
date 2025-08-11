import React, { createContext, useContext, useState } from 'react';
import { M3UItem } from '../utils/m3uParser';

type ChannelContextType = {
  channels: M3UItem[];
  setChannels: (channels: M3UItem[]) => void;
};

const ChannelContext = createContext<ChannelContextType>({
  channels: [],
  setChannels: () => {},
});

export const ChannelProvider = ({ children }: { children: React.ReactNode }) => {
  const [channels, setChannels] = useState<M3UItem[]>([]);

  return (
    <ChannelContext.Provider value={{ channels, setChannels }}>
      {children}
    </ChannelContext.Provider>
  );
};

export const useChannels = () => useContext(ChannelContext);