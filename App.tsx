/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
//import { NewAppScreen } from '@react-native/new-app-screen';
//import { StatusBar, StyleSheet, useColorScheme, View, Text } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import { ChannelProvider } from './src/context/ChannelContext';
import { FavoritesProvider } from './src/context/FavoritesContext';
import { PerfilProvider } from './src/context/PerfilContext';
import { AuthProvider } from './src/context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <PerfilProvider>
        <FavoritesProvider>
          <ChannelProvider>
            <AppNavigator />
          </ChannelProvider>
        </FavoritesProvider>
      </PerfilProvider>
    </AuthProvider>
  );
}

export default App;
