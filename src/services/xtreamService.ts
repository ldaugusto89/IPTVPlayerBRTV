// Define a estrutura das informações do servidor extraídas da URL M3U
export interface ServerInfo {
  serverUrl: string; // ex: http://servidor.com/player_api.php
  username?: string;
  password?: string;
}

// Função para extrair os dados do servidor da URL completa
export function parseServerInfo(m3uUrl: string): ServerInfo | null {
  const regex = /^(https?:\/\/[^/]+)\/.*?[?&]username=([^&]+)&password=([^&]+)/;
  const match = m3uUrl.match(regex);

  if (match) {
    return {
      serverUrl: `${match[1]}/player_api.php`, // Aponta para o endpoint da API
      username: match[2],
      password: match[3],
    };
  }
  return null;
}

// Função base para fazer chamadas à API
async function fetchFromApi(url: string) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Erro na chamada à API: ${response.statusText}`);
  }
  return response.json();
}

// Funções para buscar as categorias
export const getLiveCategories = (serverInfo: ServerInfo) => 
  fetchFromApi(`${serverInfo.serverUrl}?username=${serverInfo.username}&password=${serverInfo.password}&action=get_live_categories`);

export const getVodCategories = (serverInfo: ServerInfo) => 
  fetchFromApi(`${serverInfo.serverUrl}?username=${serverInfo.username}&password=${serverInfo.password}&action=get_vod_categories`);

export const getSeriesCategories = (serverInfo: ServerInfo) => 
  fetchFromApi(`${serverInfo.serverUrl}?username=${serverInfo.username}&password=${serverInfo.password}&action=get_series_categories`);

// Funções para buscar os streams (canais, filmes, etc.) de uma categoria
export const getLiveStreams = (serverInfo: ServerInfo, categoryId: string) => 
  fetchFromApi(`${serverInfo.serverUrl}?username=${serverInfo.username}&password=${serverInfo.password}&action=get_live_streams&category_id=${categoryId}`);

export const getVodStreams = (serverInfo: ServerInfo, categoryId: string) => 
  fetchFromApi(`${serverInfo.serverUrl}?username=${serverInfo.username}&password=${serverInfo.password}&action=get_vod_streams&category_id=${categoryId}`);

export const getSeriesStreams = (serverInfo: ServerInfo, categoryId: string) => 
  fetchFromApi(`${serverInfo.serverUrl}?username=${serverInfo.username}&password=${serverInfo.password}&action=get_series&category_id=${categoryId}`);

// NOVA FUNÇÃO: Busca os VODs (filmes) adicionados recentemente
export const getRecentVods = (serverInfo: ServerInfo) =>
  fetchFromApi(`${serverInfo.serverUrl}?username=${serverInfo.username}&password=${serverInfo.password}&action=get_vod_streams&category_id=*`);

// NOVA FUNÇÃO: Busca as séries adicionadas recentemente
export const getRecentSeries = (serverInfo: ServerInfo) =>
  fetchFromApi(`${serverInfo.serverUrl}?username=${serverInfo.username}&password=${serverInfo.password}&action=get_series&category_id=*`);
