import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useEPG } from '../context/EPGContext';
import { EPGProgram } from '../services/xmltvParser';

interface EPGInfoProps {
  channelId: string;
}

const formatTime = (dateString: string) => {
  const hours = dateString.substring(8, 10);
  const minutes = dateString.substring(10, 12);
  return `${hours}:${minutes}`;
};

const parseEPGDate = (dateString: string): Date => {
  const year = parseInt(dateString.substring(0, 4), 10);
  const month = parseInt(dateString.substring(4, 6), 10) - 1;
  const day = parseInt(dateString.substring(6, 8), 10);
  const hours = parseInt(dateString.substring(8, 10), 10);
  const minutes = parseInt(dateString.substring(10, 12), 10);
  const seconds = parseInt(dateString.substring(12, 14), 10);
  const utcDate = new Date(Date.UTC(year, month, day, hours, minutes, seconds));
  const offsetMatch = dateString.match(/([+-])(\d{2})(\d{2})$/);
  if (offsetMatch) {
    const sign = offsetMatch[1] === '+' ? -1 : 1;
    const offsetHours = parseInt(offsetMatch[2], 10);
    const offsetMinutes = parseInt(offsetMatch[3], 10);
    const offsetMilliseconds = (offsetHours * 60 + offsetMinutes) * 60 * 1000;
    utcDate.setTime(utcDate.getTime() + (sign * offsetMilliseconds));
  }
  return utcDate;
};

// Hook para logar os IDs do EPG apenas uma vez
const useEpgDebugLog = (epgData: EPGProgram[]) => {
  useEffect(() => {
    if (epgData.length > 0) {
      console.log('--- [EPG DEBUG] DADOS DO EPG CARREGADOS ---');
      const sampleIds = new Set(epgData.slice(0, 50).map(p => p.channel));
      console.log(`Amostra de IDs disponíveis no EPG:`, Array.from(sampleIds).slice(0, 10));
      console.log('-----------------------------------------');
    }
  }, [epgData]);
};


export default function EPGInfo({ channelId }: EPGInfoProps) {
  const { epgData } = useEPG();
  const [currentProgram, setCurrentProgram] = useState<EPGProgram | null>(null);
  const [nextProgram, setNextProgram] = useState<EPGProgram | null>(null);
    
  // Chama o hook de debug
  useEpgDebugLog(epgData);

  useEffect(() => {
    const findPrograms = () => {
      if (!channelId || !epgData || epgData.length === 0) return;

      // CORREÇÃO: Comparação case-insensitive para aumentar a chance de match
      const channelIdLower = channelId.toLowerCase();
      const channelPrograms = epgData
        .filter(p => p.channel.toLowerCase() === channelIdLower)
        .sort((a, b) => a.start.localeCompare(b.start));

      if (channelPrograms.length === 0) {
        setCurrentProgram(null);
        setNextProgram(null);
        return;
      }

      const now = new Date();
      let current: EPGProgram | null = null;
      let next: EPGProgram | null = null;

      for (let i = 0; i < channelPrograms.length; i++) {
        const prog = channelPrograms[i];
        const progStart = parseEPGDate(prog.start);
        const progStop = parseEPGDate(prog.stop);

        if (now >= progStart && now < progStop) {
          current = prog;
          if (i + 1 < channelPrograms.length) next = channelPrograms[i + 1];
          break;
        }
      }
      setCurrentProgram(current);
      setNextProgram(next);
    };

    findPrograms();
    const interval = setInterval(findPrograms, 60000);
    return () => clearInterval(interval);
  }, [channelId, epgData]);

  if (!currentProgram) {
    return <Text style={styles.noInfoText}>Sem informação de programação</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.programText} numberOfLines={1}>
        <Text style={styles.timeText}>{formatTime(currentProgram.start)} </Text>
        {currentProgram.title}
      </Text>
      {nextProgram && (
        <Text style={styles.programText} numberOfLines={1}>
          <Text style={styles.timeText}>A seguir: </Text>
          {nextProgram.title}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', marginTop: 5 },
  programText: { color: '#BDBDBD', fontSize: 12 },
  timeText: { color: '#9E9E9E', fontWeight: 'bold' },
  noInfoText: { color: '#888', fontSize: 12, fontStyle: 'italic', marginTop: 5 },
});
