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
import RootProvider from './src/context/RootProvider'; './src//context/RootProvider';
import Toast from './src/components/Toast';


function App() {
  return (
    <RootProvider>
      <AppNavigator />
      <Toast/>
    </RootProvider>
  );
}

export default App;
