export interface ServerInfo {
  serverUrl: string;
  username?: string;
  password?: string;
}

export function parseServerInfo(m3uUrl: string): ServerInfo | null {
  const regex = /^(https?:\/\/[^/]+)\/.*?[?&]username=([^&]+)&password=([^&]+)/;
  const match = m3uUrl.match(regex);

  if (match) {
    return {
      serverUrl: `${match[1]}/player_api.php`,
      username: match[2],
      password: match[3],
    };
  }
  return null;
}

async function fetchFromApi(url: string) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Erro na API: ${response.statusText}`);
  }
  return response.json();
}

export const getLiveCategories = (serverInfo: ServerInfo) => 
  fetchFromApi(`${serverInfo.serverUrl}?username=${serverInfo.username}&password=${serverInfo.password}&action=get_live_categories`);

export const getVodCategories = (serverInfo: ServerInfo) => 
  fetchFromApi(`${serverInfo.serverUrl}?username=${serverInfo.username}&password=${serverInfo.password}&action=get_vod_categories`);

export const getSeriesCategories = (serverInfo: ServerInfo) => 
  fetchFromApi(`${serverInfo.serverUrl}?username=${serverInfo.username}&password=${serverInfo.password}&action=get_series_categories`);

// --- FUNÇÕES ATUALIZADAS ---
// Agora, o categoryId é opcional. Se não for fornecido, a API retorna todos os itens.
export const getVodStreams = (serverInfo: ServerInfo, categoryId?: string) => {
  const categoryParam = categoryId ? `&category_id=${categoryId}` : '';
  return fetchFromApi(`${serverInfo.serverUrl}?username=${serverInfo.username}&password=${serverInfo.password}&action=get_vod_streams${categoryParam}`);
}

export const getSeries = (serverInfo: ServerInfo, categoryId?: string) => {
  const categoryParam = categoryId ? `&category_id=${categoryId}` : '';
  return fetchFromApi(`${serverInfo.serverUrl}?username=${serverInfo.username}&password=${serverInfo.password}&action=get_series${categoryParam}`);
}

export const getLiveStreams = (serverInfo: ServerInfo, categoryId: string) => 
  fetchFromApi(`${serverInfo.serverUrl}?username=${serverInfo.username}&password=${serverInfo.password}&action=get_live_streams&category_id=${categoryId}`);
