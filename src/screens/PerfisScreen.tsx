import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../@types/navigation';
import { obterPerfis, ListaPerfil, salvarUltimoPerfil } from '../lib/listaStorage';
import { fetchAndParseM3U } from '../utils/m3uParser';
import FocusableButton from '../components/FocusableButton';
import { useContent } from '../context/ChannelContext'; // MUDANÇA AQUI

type PerfisScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Perfis'>;

export default function PerfisScreen() {
  const [perfis, setPerfis] = useState<ListaPerfil[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingList, setLoadingList] = useState<string | null>(null); // Para o loading individual
  const navigation = useNavigation<PerfisScreenNavigationProp>();
  const { setAllContent } = useContent(); // MUDANÇA AQUI: usamos o hook customizado

  useEffect(() => {
    const carregarPerfis = async () => {
      const perfisSalvos = await obterPerfis();
      setPerfis(perfisSalvos);
      setLoading(false);
    };
    carregarPerfis();
  }, []);

  const handleSelecionar = async (perfil: ListaPerfil) => {
    setLoadingList(perfil.id); // Ativa o loading para este perfil
    try {
      const items = await fetchAndParseM3U(perfil.url);

      if (items.length === 0) {
        Alert.alert('Aviso', 'A lista está vazia ou não pôde ser carregada.');
        setLoadingList(null);
        return;
      }

      setAllContent(items); // A nova função que separa tudo
      await salvarUltimoPerfil(perfil.id);
      
      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      });
    } catch (err) {
      console.error("Erro ao carregar a lista:", err);
      Alert.alert('Erro', 'Não foi possível carregar a lista. Verifique a URL e sua conexão.');
      setLoadingList(null); // Desativa o loading em caso de erro
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
