import React from 'react';
import { View, StyleSheet, Platform,Text } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../@types/navigation';
import FocusableButton from './FocusableButton';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Definimos as propriedades que o Sidebar espera receber
interface SidebarProps {
  navigation: StackNavigationProp<RootStackParamList>;
}

// Criamos um tipo para os nossos botões de navegação
type NavItem = {
  name: keyof RootStackParamList;
  icon: string;
  label: string;
};

const navItems: NavItem[] = [
  { name: 'Home', icon: 'home-outline', label: 'Início' },
  { name: 'Canais', icon: 'tv-outline', label: 'Canais' },
  { name: 'Filmes', icon: 'film-outline', label: 'Filmes' },
  { name: 'Series', icon: 'albums-outline', label: 'Séries' },
  { name: 'Favorites', icon: 'star-outline', label: 'Favoritos' },
];

const settingsItem: NavItem = { name: 'Perfis', icon: 'settings-outline', label: 'Perfis' };


export default function Sidebar({ navigation }: SidebarProps) {
  return (
    <View style={styles.container}>
      <View>
        {navItems.map((item) => (
          <FocusableButton
            key={item.name}
            style={styles.navButton}
            onPress={() => navigation.navigate(item.name)}
          >
            <Ionicons name={item.icon} size={28} color="white" />
            {Platform.OS !== 'android' && Platform.OS !== 'ios' && <Text style={styles.navLabel}>{item.label}</Text>}
          </FocusableButton>
        ))}
      </View>

      <View>
        <FocusableButton
            key={settingsItem.name}
            style={styles.navButton}
            onPress={() => navigation.navigate(settingsItem.name)}
          >
            <Ionicons name={settingsItem.icon} size={28} color="white" />
            {Platform.OS !== 'android' && Platform.OS !== 'ios' && <Text style={styles.navLabel}>{settingsItem.label}</Text>}
          </FocusableButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 90, // Largura do sidebar
    backgroundColor: '#000', // Fundo preto para contraste
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'space-between', // Empurra as configurações para o final
    height: '100%',
  },
  navButton: {
    marginBottom: 30,
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    height: 60,
    borderRadius: 30, // Botões redondos
  },
  navLabel: {
    color: 'white',
    marginTop: 5,
    fontSize: 12,
  }
});