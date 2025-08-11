import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { RootStackParamList } from '../../@types/navigation';

import { useAuth } from '../context/AuthContext';

import HomeScreen from '../screens/HomeScreen';
import ChannelsScreen from '../screens/ChannelsScreen';
import MoviesScreen from '../screens/MoviesScreen';
import SeriesScreen from '../screens/SeriesScreen';
import PlayerScreen from '../screens/PlayerScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import LoginScreen from '../screens/LoginScreen';
import PerfisScreen from '../screens/PerfisScreen';
import PerfilForm from '../screens/PerfilFormScreen';
import InitialScreen from '../screens/InitialScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const { loading } = useAuth();

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Initial" component={InitialScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Perfis" component={PerfisScreen} />
        <Stack.Screen name="PerfilForm" component={PerfilForm} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Canais" component={ChannelsScreen} />
        <Stack.Screen name="Filmes" component={MoviesScreen} />
        <Stack.Screen name="Series" component={SeriesScreen} />
        <Stack.Screen name="Favorites" component={FavoritesScreen} />
        <Stack.Screen name="Player" component={PlayerScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}