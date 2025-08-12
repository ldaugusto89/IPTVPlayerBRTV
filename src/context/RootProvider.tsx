import React from 'react';
import { AuthProvider } from './AuthContext';
import { PerfilProvider } from './PerfilContext';
import { FavoritesProvider } from './FavoritesContext';
import { ChannelProvider } from './ChannelContext';
import { HistoryProvider } from './HistoryContext';

type Props = { children: React.ReactNode };

export default function RootProvider({ children }: Props) {
  return (
    <AuthProvider>
      <PerfilProvider>
        <FavoritesProvider>
          <HistoryProvider>
            <ChannelProvider>{children}</ChannelProvider>
          </HistoryProvider>
        </FavoritesProvider>
      </PerfilProvider>
    </AuthProvider>
  );
}
