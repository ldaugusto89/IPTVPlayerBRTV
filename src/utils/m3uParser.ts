export type Category = 'channel' | 'series' | 'movie';

export type M3UItem = {
  title: string;
  url: string;
  group: string;
  tvgId?: string;
  logo?: string;
  category: Category;
};

function detectCategory(streamUrl: string): Category {
  const url = streamUrl.toLowerCase();

  if (url.includes('/series/')) {
    return 'series';
  }

  if (url.includes('/movie/')) {
    return 'movie';
  }

  // Caso queira usar padrão por título (SxxEyy) ou group-title:
  // if (/\bS\d{2}E\d{2}\b/i.test(streamUrl)) return 'series';
  // if (/\(\d{4}\)$/.test(streamUrl)) return 'movie';

  return 'channel';
}


export async function fetchAndParseM3U(url: string): Promise<M3UItem[]> {
  const response = await fetch(url);
  const text = await response.text();
  const lines = text.split('\n');
  const items: M3UItem[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line.startsWith('#EXTINF')) continue;

    // Extrai atributos
    const tvgId = getAttr(line, 'tvg-id');
    const logo = getAttr(line, 'tvg-logo');
    const group = getAttr(line, 'group-title') || 'Sem grupo';

    // Título após a vírgula
    const parts = line.split(',');
    const title = parts.length > 1 ? parts[1].trim() : 'Sem título';

    // URL da próxima linha
    const streamUrl = lines[i + 1]?.trim();
    if (streamUrl && streamUrl.startsWith('http')) {
      const category = detectCategory(streamUrl);

      items.push({
        title,
        url: streamUrl,
        group,
        tvgId,
        logo,
        category,
      });
    }
  }

  return items;
}

// Extrai valor de atributo em formato attr="valor"
function getAttr(line: string, attr: string): string | undefined {
  const match = line.match(new RegExp(`${attr}="([^"]*)"`));
  return match?.[1];
}
