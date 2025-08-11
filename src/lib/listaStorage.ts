import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid  from 'react-native-uuid';
import { ListaPerfil } from '../../@types/navigation';

const STORAGE_KEY = '@iptv:perfis';
const ULTIMO_PERFIL_KEY = 'ultimo_perfil';

export async function getPerfis(): Promise<ListaPerfil[]> {
  const json = await AsyncStorage.getItem(STORAGE_KEY);
  return json ? JSON.parse(json) : [];
}

export async function salvarPerfil(perfil: Omit<ListaPerfil, 'id'>): Promise<void> {
  const perfis = await getPerfis();
  perfis.push({ ...perfil, id: uuid.v4() });
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(perfis));
}

export async function removerPerfil(id: string): Promise<void> {
  const perfis = await getPerfis();
  const filtrados = perfis.filter((p) => p.id !== id);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filtrados));
}

export async function atualizarPerfil(perfilAtualizado: ListaPerfil): Promise<void> {
  const perfis = await getPerfis();
  const novos = perfis.map((p) => (p.id === perfilAtualizado.id ? perfilAtualizado : p));
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(novos));
}

export async function replacePerfil(novo: ListaPerfil) {
  const lista = await getPerfis();
  const atualizada = lista.map(p => (p.id === novo.id ? novo : p));
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(atualizada));
}

export async function salvarUltimoPerfil(id: string) {
  await AsyncStorage.setItem(ULTIMO_PERFIL_KEY, id);
}

export async function getUltimoPerfilId(): Promise<string | null> {
  return await AsyncStorage.getItem(ULTIMO_PERFIL_KEY);
}