import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SectionList, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../@types/navigation';
import { useContent, ApiCategory } from '../context/ChannelContext';
import FocusableButton from '../components/FocusableButton';
import Sidebar from '../components/Sidebar';
import { getLiveCategories, getLiveStreams } from '../services/xtreamService';

type NavigationProp = StackNavigationProp<RootStackParamList>;

interface LiveStream {
  stream_id: number;
  name: string;
  stream_icon: string;
  epg_channel_id: string;
}

interface ChannelSection {
  title: string;
  data: LiveStream[];
  id: string;
}

export default function ChannelsScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { serverInfo, liveCategories, setLiveCategories } = useContent();
  const [isLoading, setIsLoading] = useState(true);
  const [sections, setSections] = useState<ChannelSection[]>([]);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchCategories = async () => {
      if (!serverInfo) return;
      
      setIsLoading(true);
      try {
        const categories = liveCategories.length > 0 ? liveCategories : await getLiveCategories(serverInfo);
        if (liveCategories.length === 0) {
          setLiveCategories(categories || []);
        }
        
        const formattedSections = (categories || []).map((cat: ApiCategory) => ({
          title: cat.category_name,
          id: cat.category_id,
          data: [],
        }));
        setSections(formattedSections);
      } catch (error) {
        console.error("Erro ao buscar categorias de canais:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, [serverInfo, liveCategories]);

  const toggleSection = async (sectionId: string) => {
    const newExpandedSections = new Set(expandedSections);
    if (newExpandedSections.has(sectionId)) {
      newExpandedSections.delete(sectionId);
      setExpandedSections(newExpandedSections);
      return;
    }

    newExpandedSections.add(sectionId);
    setExpandedSections(newExpandedSections);

    const currentSection = sections.find(s => s.id === sectionId);
    if (currentSection && currentSection.data.length > 0) {
      return;
    }

    if (serverInfo) {
      try {
        const streams = await getLiveStreams(serverInfo, sectionId);
        setSections(prevSections =>
          prevSections.map(s =>
            s.id === sectionId ? { ...s, data: streams || [] } : s
          )
        );
      } catch (error) {
        console.error(`Erro ao buscar canais para a categoria ${sectionId}:`, error);
      }
    }
  };
  
  const handlePress = (item: LiveStream) => {
    if (!serverInfo) return;
    
    const baseUrl = serverInfo.serverUrl.replace('/player_api.php', '');
    const streamUrl = `${baseUrl}/${serverInfo.username}/${serverInfo.password}/${item.stream_id}.ts`;
    console.log(`[Player] Navegando com a URL: ${streamUrl}`);

    // NAVEGAÇÃO CORRIGIDA: Passa os parâmetros de forma individual
    navigation.navigate('Player', { 
      url: streamUrl,
      title: item.name,
      logo: item.stream_icon
    });
  };

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Sidebar navigation={navigation} />
      <View style={styles.content}>
        <Text style={styles.screenTitle}>Canais</Text>
        <SectionList
          sections={sections}
          keyExtractor={(item, index) => `${item.stream_id}-${index}`}
          renderSectionHeader={({ section }) => (
            <TouchableOpacity onPress={() => toggleSection(section.id)}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionHeaderText}>{section.title}</Text>
                <Text style={styles.sectionHeaderText}>
                  {expandedSections.has(section.id) ? '−' : '+'}
                </Text>
              </View>
            </TouchableOpacity>
          )}
          renderItem={({ item, section }) => {
            if (!expandedSections.has(section.id)) {
              return null;
            }
            return (
              <FocusableButton
                style={styles.channelButton}
                onPress={() => handlePress(item)}
              >
                <View style={styles.channelContent}>
                  <Image
                    source={{ uri: item.stream_icon }}
                    style={styles.logo}
                    defaultSource={require('../assets/placeholder.png')}
                  />
                  <View style={styles.textContainer}>
                    <Text style={styles.channelName} numberOfLines={1}>{item.name}</Text>
                  </View>
                </View>
              </FocusableButton>
            );
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#141414',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#141414',
  },
  content: {
    flex: 1,
    paddingLeft: 10,
  },
  screenTitle: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    margin: 20,
  },
  sectionHeader: {
    backgroundColor: '#101010',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#2F2F2F',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sectionHeaderText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  channelButton: {
    backgroundColor: '#1a1a1a',
    borderBottomWidth: 1,
    borderBottomColor: '#2F2F2F',
  },
  channelContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    paddingLeft: 25,
  },
  logo: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
    marginRight: 15,
    backgroundColor: '#000',
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  channelName: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
