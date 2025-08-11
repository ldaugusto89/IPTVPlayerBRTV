export type M3UItem = {
  title: string;
  url: string;
  group: string;
  tvgId?: string;
  logo?: string;
};

export async function fetchAndParseM3U(url: string): Promise<M3UItem[]> {

  const response = await fetch(url);

  const text = await response.text();

  const lines = text.split('\n');
  const items: M3UItem[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (line.startsWith('#EXTINF')) {
      const attrsLine = line;

      const tvgId = getAttr(attrsLine, 'tvg-id');
      const logo = getAttr(attrsLine, 'tvg-logo');
      const group = getAttr(attrsLine, 'group-title') || 'Sem grupo';

      // Última parte depois da vírgula é o título
      const parts = line.split(',');
      const title = parts.length > 1 ? parts[1].trim() : 'Sem título';

      const streamUrl = lines[i + 1]?.trim();
      if (streamUrl && streamUrl.startsWith('http')) {
        items.push({title,url: streamUrl,group,tvgId,logo,});
      }
    }
  }

  return items;
}

// Utilitário para extrair atributo de uma linha
function getAttr(line: string, attr: string): string | undefined {
  const match = line.match(new RegExp(`${attr}="([^"]*)"`));
  return match?.[1];
}