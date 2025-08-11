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