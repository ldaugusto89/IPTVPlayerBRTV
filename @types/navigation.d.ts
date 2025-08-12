import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  Perfis: undefined;
  PerfilForm: { perfil?: ListaPerfil } | undefined;
  Canais: undefined;
  Filmes: undefined;
  Series: undefined;
  Favorites: undefined;
  Initial: undefined;
  Player: { url: string; title: string };
};

export type ListaPerfil = {
  id: string;
  nome: string;
  tipo: 'url' | 'api';
  url?: string;
  host?: string;
  username?: string;
  password?: string;
};

export type PlayerScreenRouteProp = RouteProp<RootStackParamList, 'Player'>;

// Tipagem para a Navegação da Tela do Player
export type PlayerScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Player'>;

// Tipagem para outras telas, se necessário
export type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;