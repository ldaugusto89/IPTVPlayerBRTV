// Não precisamos mais da biblioteca 'm3u-parser'
// import M3uParser from 'm3u-parser';

// Função para extrair um atributo como: tvg-name="..."
function getAttribute(line: string, attributeName: string): string {
  const regex = new RegExp(`${attributeName}="([^"]*)"`, 'i');
  const match = line.match(regex);
  return match ? match[1] : '';
}

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

    // --- NOSSO PARSER CUSTOMIZADO ---
    const lines = m3uText.split('\n');
    const items = [];
    let currentItem: any = {};

    for (const line of lines) {
      const trimmedLine = line.trim();
      if (trimmedLine.startsWith('#EXTINF:')) {
        // Encontramos a linha de informação de um canal
        currentItem = {}; // Reseta o item atual
        
        const groupTitle = getAttribute(trimmedLine, 'group-title');
        const tvgName = getAttribute(trimmedLine, 'tvg-name');
        const tvgLogo = getAttribute(trimmedLine, 'tvg-logo');
        const tvgId = getAttribute(trimmedLine, 'tvg-id');

        // O nome do canal geralmente está depois da última vírgula
        const name = trimmedLine.split(',').pop() || tvgName || 'Título Desconhecido';

        currentItem = {
          name: name.trim(),
          logo: tvgLogo,
          group: { title: groupTitle },
          tvg: { id: tvgId, name: tvgName, logo: tvgLogo },
        };
      } else if (trimmedLine && !trimmedLine.startsWith('#')) {
        // Esta é a linha da URL, que vem logo após a linha #EXTINF
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

    return items;
    // --- FIM DO PARSER CUSTOMIZADO ---

  } catch (error) {
    console.error('Falha ao buscar ou processar o arquivo M3U:', error);
    return [];
  }
};
