import { ServerInfo } from '../context/ChannelContext'; // Reutilize a interface

/**
 * Constrói a URL de streaming para um vídeo ou canal ao vivo.
 * @param serverInfo - Objeto com os dados do servidor.
 * @param streamId - O ID do stream (filme, episódio ou canal).
 * @param type - O tipo de stream ('movie', 'series', 'live').
 * @returns A URL completa para o player de vídeo.
 */
export const buildVideoUrl = (
  serverInfo: ServerInfo,
  streamId: number,
  type: 'movie' | 'series' | 'live',
): string | null => {
  if (!serverInfo.username || !serverInfo.password) {
    console.error('Usuário ou senha não definidos para construir a URL do vídeo.');
    return null;
  }

  // A URL base remove o '/player_api.php' para montar a URL de streaming
  const baseUrl = serverInfo.serverUrl.replace('/player_api.php', '');

  // Monta a URL com base no tipo de conteúdo
  switch (type) {
    case 'movie':
      // Formato: http://host/movie/user/password/id.mp4
      return `${baseUrl}/movie/${serverInfo.username}/${serverInfo.password}/${streamId}.mp4`;
    case 'series':
      // Formato: http://host/series/user/password/id.mp4
      // Note que para episódios de série, a API Xtream trata como 'series' mas a URL de stream é a mesma de filme
      return `${baseUrl}/series/${serverInfo.username}/${serverInfo.password}/${streamId}.mp4`;
    case 'live':
      // Formato: http://host/user/password/id.ts
      return `${baseUrl}/${serverInfo.username}/${serverInfo.password}/${streamId}.ts`;
    default:
      console.error(`Tipo de stream desconhecido: ${type}`);
      return null;
  }
};


export function buildXtreamUrls(host: string, username: string, password: string) {
  const base = host.endsWith('/') ? host.slice(0, -1) : host;
  return {
    m3u: `${base}/get.php?username=${username}&password=${password}&type=m3u_plus&output=ts`,
    epg: `${base}/xmltv.php?username=${username}&password=${password}`,
    api: `${base}/player_api.php?username=${username}&password=${password}`,
  };
}
