import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../@types/navigation';
import { getPerfis, ListaPerfil, salvarUltimoPerfil } from '../lib/listaStorage'; // Usando suas funções
import { fetchAndParseM3U } from '../utils/m3uParser';
import FocusableButton from '../components/FocusableButton';
import { useContent } from '../context/ChannelContext';
import { useEPG } from '../context/EPGContext';

type PerfisScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Perfis'>;

export default function PerfisScreen() {
  const [perfis, setPerfis] = useState<ListaPerfil[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingList, setLoadingList] = useState<string | null>(null);
  const navigation = useNavigation<PerfisScreenNavigationProp>();
  const { setAllContent } = useContent();
  const { loadEpgData } = useEPG();

  useEffect(() => {
    const carregarPerfis = async () => {
      const perfisSalvos = await getPerfis(); // Usando sua função
      setPerfis(perfisSalvos);
      setLoading(false);
    };
    // Recarrega os perfis quando a tela ganha foco
    const unsubscribe = navigation.addListener('focus', carregarPerfis);
    return unsubscribe;
  }, [navigation]);

  const handleSelecionar = async (perfil: ListaPerfil) => {
    if (!perfil.url) {
        Alert.alert('Erro', 'Este perfil não tem uma URL de lista configurada.');
        return;
    }

    setLoadingList(perfil.id);
    try {
      let finalEpgUrl: string | null = null;

      // ---- A LÓGICA INTELIGENTE COMEÇA AQUI ----
      try {
        // Tentamos "desconstruir" o link para encontrar as credenciais.
        const urlParams = new URL(perfil.url);
        const username = urlParams.searchParams.get('username');
        const password = urlParams.searchParams.get('password');
        const dns = urlParams.hostname + (urlParams.port ? `:${urlParams.port}` : '');
        
        // Se encontrarmos as credenciais, construímos o link do EPG.
        if (dns && username) {
          finalEpgUrl = `http://${dns}/xmltv.php?username=${username}&password=${password || ''}`;
          console.log("EPG URL construída a partir do link M3U:", finalEpgUrl);
        }
      } catch (e) {
        console.log("Não foi possível desconstruir a URL. Vamos procurar o EPG dentro do arquivo M3U.");
      }
      
      // Independentemente do resultado acima, processamos o arquivo M3U.
      const { items, epgUrl: epgUrlFromM3U } = await fetchAndParseM3U(perfil.url);

      if (items.length === 0) {
        Alert.alert('Aviso', 'A lista está vazia ou não pôde ser carregada.');
        setLoadingList(null);
        return;
      }

      setAllContent(items);
      await salvarUltimoPerfil(perfil.id);

      // Carrega o EPG: dá prioridade à URL que construímos. Se não tivermos uma,
      // usamos a que (talvez) tenhamos encontrado dentro do arquivo M3U.
      loadEpgData(finalEpgUrl || epgUrlFromM3U);
      
      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      });
    } catch (err) {
      console.error("Erro ao carregar a lista:", err);
      Alert.alert('Erro', 'Não foi possível carregar a lista. Verifique os dados e sua conexão.');
      setLoadingList(null);
    }
  };

  if (loading) {
    return <ActivityIndicator style={styles.centered} size="large" color="#fff" />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quem está assistindo?</Text>
      <FlatList
        data={perfis}
        keyExtractor={item => item.id}
        numColumns={4}
        renderItem={({ item }) => (
          <View style={styles.perfilContainer}>
            <FocusableButton
              style={styles.perfilButton}
              onPress={() => handleSelecionar(item)}
            >
              {loadingList === item.id ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.perfilInitial}>{item.nome.charAt(0)}</Text>
              )}
            </FocusableButton>
            <Text style={styles.perfilName}>{item.nome}</Text>
          </View>
        )}
      />
      <FocusableButton
        title="Adicionar Perfil"
        onPress={() => navigation.navigate('PerfilForm')}
        style={styles.addButton}
        textStyle={styles.addButtonText}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#141414',
  },
  container: {
    flex: 1,
    backgroundColor: '#141414',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    color: 'white',
    marginBottom: 50,
  },
  perfilContainer: {
    alignItems: 'center',
    margin: 20,
  },
  perfilButton: {
    width: 120,
    height: 120,
    borderRadius: 10,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  perfilInitial: {
    fontSize: 60,
    color: 'white',
  },
  perfilName: {
    color: 'white',
    marginTop: 10,
    fontSize: 18,
  },
  addButton: {
    marginTop: 40,
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderWidth: 1,
    borderColor: '#888',
  },
  addButtonText: {
    color: '#888',
    fontSize: 16,
  },
});
