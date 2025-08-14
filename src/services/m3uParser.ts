// Função para extrair um atributo como: tvg-name="..."
function getAttribute(line: string, attributeName: string): string {
  const regex = new RegExp(`${attributeName}="([^"]*)"`, 'i');
  const match = line.match(regex);
  return match ? match[1] : '';
}

// A função agora retornará um objeto com os itens E a URL do EPG
export const fetchAndParseM3U = async (url: string) => {
  try {
    let correctedUrl = url;
    if (correctedUrl.includes('output=ts')) {
      correctedUrl = correctedUrl.replace('output=ts', 'output=m3u8');
    }

    const response = await fetch(correctedUrl, {
      headers: {
        'User-Agent': 'VLC/3.0.18 LibVLC/3.0.18',
      },
    });

    if (!response.ok) {
      throw new Error(`Erro de rede ao buscar a lista: ${response.status}`);
    }
    const m3uText = await response.text();

    const lines = m3uText.split('\n');
    const items = [];
    let currentItem: any = {};
    let epgUrl: string | null = null; // 1. Variável para guardar o link do EPG

    for (const line of lines) {
      const trimmedLine = line.trim();

      // 2. PROCURA PELO LINK DO EPG NA PRIMEIRA LINHA
      if (trimmedLine.startsWith('#EXTM3U')) {
        epgUrl = getAttribute(trimmedLine, 'x-tvg-url');
      }
      
      if (trimmedLine.startsWith('#EXTINF:')) {
        currentItem = {};
        const groupTitle = getAttribute(trimmedLine, 'group-title');
        const tvgName = getAttribute(trimmedLine, 'tvg-name');
        const tvgLogo = getAttribute(trimmedLine, 'tvg-logo');
        const tvgId = getAttribute(trimmedLine, 'tvg-id');
        const name = trimmedLine.split(',').pop() || tvgName || 'Título Desconhecido';

        currentItem = {
          name: name.trim(),
          logo: tvgLogo,
          group: { title: groupTitle },
          tvg: { id: tvgId, name: tvgName, logo: tvgLogo },
        };
      } else if (trimmedLine && !trimmedLine.startsWith('#')) {
        if (currentItem.name) {
          currentItem.url = trimmedLine;
          items.push(currentItem);
        }
      }
    }

    if (items.length === 0) {
      console.log('Nenhum item foi extraído pelo parser customizado. Conteúdo recebido:', m3uText.substring(0, 1000));
      throw new Error('A lista M3U está vazia ou em um formato irreconhecível.');
    }

    // 3. RETORNA OS ITENS E O LINK DO EPG
    console.log("EPG URL encontrada no arquivo M3U:", epgUrl);
    return { items, epgUrl };

  } catch (error) {
    console.error('Falha ao buscar ou processar o arquivo M3U:', error);
    // Em caso de erro, retorna a estrutura esperada com valores vazios
    return { items: [], epgUrl: null };
  }
};
