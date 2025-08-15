import React from 'react';
import { AuthProvider } from './AuthContext';
import { PerfilProvider } from './PerfilContext';
import { FavoritesProvider } from './FavoritesContext';
import { ChannelProvider } from './ChannelContext';
import { HistoryProvider } from './HistoryContext';
import { EPGProvider } from './EPGContext';

type Props = { children: React.ReactNode };

export default function RootProvider({ children }: Props) {
  return (
    <AuthProvider>
      <PerfilProvider>
        <EPGProvider>
          <FavoritesProvider>
            <HistoryProvider>
              <ChannelProvider>{children}</ChannelProvider>
            </HistoryProvider>
          </FavoritesProvider>
        </EPGProvider>  
      </PerfilProvider>
    </AuthProvider>
  );
}
