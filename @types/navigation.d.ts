import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

export type RootStackParamList = {
  Initial: undefined;
  Login: undefined;
  Home: undefined;
  Perfis: undefined;
  PerfilForm: { id?: string };
  // A tela Player agora recebe o objeto 'channel' inteiro
  Player: { channel: M3UItem }; 
  
  // Telas de conteúdo agora recebem o ID e o nome da categoria
  Channels: { categoryId: string; categoryName: string };
  Movies: { categoryId: string; categoryName: string };
  Series: { categoryId: string; categoryName: string };

  Favorites: undefined;
  CategoryDetail: { category: string };
  SeriesDetail: { seriesId: string };
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

export type SeriesDetailScreenRouteProp = RouteProp<RootStackParamList, 'SeriesDetail'>;
export type SeriesDetailScreenNavigationProp = StackNavigationProp<RootStackParamList, 'SeriesDetail'>;

export type PlayerScreenRouteProp = RouteProp<RootStackParamList, 'Player'>;
// Tipagem para a Navegação da Tela do Player
export type PlayerScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Player'>;
// Tipagem para outras telas, se necessário
export type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;
