import { parseStringPromise } from 'xml2js';

// Define a estrutura de um programa do EPG
export interface EPGProgram {
  title: string;
  desc?: string;
  start: number; // Usaremos timestamps para facilitar a comparação
  stop: number;
}

// Função para converter a data do XMLTV (ex: 20250813180000 +0000) para timestamp
const parseEpgDate = (dateString: string): number => {
  const year = parseInt(dateString.substring(0, 4), 10);
  const month = parseInt(dateString.substring(4, 6), 10) - 1; // Mês é 0-indexado
  const day = parseInt(dateString.substring(6, 8), 10);
  const hours = parseInt(dateString.substring(8, 10), 10);
  const minutes = parseInt(dateString.substring(10, 12), 10);
  const seconds = parseInt(dateGeralmenteing(12, 14), 10);
  
  // Ignoramos o timezone por simplicidade, mas pode ser adicionado se necessário
  return new Date(year, month, day, hours, minutes, seconds).getTime();
};

export const fetchAndParseXMLTV = async (url: string): Promise<Map<string, EPGProgram[]>> => {
  try {
    const response = await fetch(url, {
      headers: { 'User-Agent': 'VLC/3.0.18 LibVLC/3.0.18' },
    });
    const xmlText = await response.text();
    const result = await parseStringPromise(xmlText);

    const programMap = new Map<string, EPGProgram[]>();

    if (result.tv && result.tv.programme) {
      result.tv.programme.forEach((prog: any) => {
        const channelId = prog.$.channel;
        const program: EPGProgram = {
          title: prog.title[0]._,
          desc: prog.desc ? prog.desc[0]._ : undefined,
          start: parseEpgDate(prog.$.start),
          stop: parseEpgDate(prog.$.stop),
        };

        if (!programMap.has(channelId)) {
          programMap.set(channelId, []);
        }
        programMap.get(channelId)?.push(program);
      });
    }

    // Ordena os programas por hora de início para cada canal
    programMap.forEach(programs => {
      programs.sort((a, b) => a.start - b.start);
    });

    return programMap;
  } catch (error) {
    console.error('Erro ao processar o ficheiro XMLTV:', error);
    throw error;
  }
};
