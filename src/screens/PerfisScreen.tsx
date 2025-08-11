import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  Alert,
} from 'react-native';
import { salvarUltimoPerfil } from '../lib/listaStorage';
import { useNavigation } from '@react-navigation/native';
import {   getPerfis, removerPerfil } from '../lib/listaStorage';
import { useChannels } from '../context/ChannelContext';
import { fetchAndParseM3U } from '../utils/m3uParser';
import { ListaPerfil } from '../../@types/navigation';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../@types/navigation';
import { buildXtreamUrls } from '../utils/buildXtreamUrls';

type PerfisScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Perfis'>;

export default function PerfisScreen() {
  const [perfis, setPerfis] = useState<ListaPerfil[]>([]);
  const navigation = useNavigation<PerfisScreenNavigationProp>();
  const { setChannels } = useChannels();

  useEffect(() => {
    carregarPerfis();
    const unsubscribe = navigation.addListener('focus', carregarPerfis);
    return unsubscribe;
  }, [navigation]);

  const carregarPerfis = async () => {
    const dados = await getPerfis();
    setPerfis(dados);
  };

  const handleSelecionar = async (perfil: ListaPerfil) => {
    try {
      let finalUrl = '';

      if (perfil.tipo === 'url' && perfil.url) {
        finalUrl = perfil.url;
      } else if (
        perfil.tipo === 'api' &&
        perfil.host &&
        perfil.username &&
        perfil.password
      ) {
        finalUrl = buildXtreamUrls(perfil.host, perfil.username, perfil.password).m3u;
      } else {
        Alert.alert('Erro', 'Perfil incompleto ou inválido.');
        return;
      }

      const canais = await fetchAndParseM3U(finalUrl);

      if (canais.length === 0) {
        Alert.alert('Erro', 'Lista vazia ou inválida.');
        return;
      }

      setChannels(canais);
      await salvarUltimoPerfil(perfil.id);
      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      });

    } catch (err) {
      Alert.alert('Erro ao carregar lista', String(err));
    }
  };

  const handleRemover = async (id: string) => {
    Alert.alert('Remover perfil', 'Tem certeza que deseja excluir?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Remover',
        style: 'destructive',
        onPress: async () => {
          await removerPerfil(id);
          carregarPerfis();
        },
      },
    ]);
  };

  const renderItem = ({ item }: { item: ListaPerfil }) => (
    <View style={styles.card}>
      <Text style={styles.nome}>{item.nome}</Text>
      <Text style={styles.tipo}>{item.tipo === 'url' ? 'Lista via URL' : 'Login via API'}</Text>

      <View style={styles.actions}>
        <Pressable style={styles.botao} onPress={() => handleSelecionar(item)}>
          <Text style={styles.botaoTexto}>Usar</Text>
        </Pressable>
        <Pressable
          style={styles.botao}
          onPress={() => navigation.navigate('PerfilForm', { perfil: item })}
        >
          <Text style={styles.botaoTexto}>Editar</Text>
        </Pressable>
        <Pressable style={styles.botao} onPress={() => handleRemover(item.id)}>
          <Text style={[styles.botaoTexto, { color: 'red' }]}>Excluir</Text>
        </Pressable>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Perfis de Lista</Text>

      <FlatList
        data={perfis}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.vazio}>Nenhum perfil salvo</Text>}
      />

      <Pressable
        style={styles.adicionar}
        onPress={() => navigation.navigate('PerfilForm')}
      >
        <Text style={styles.adicionarTexto}>+ Novo Perfil</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', padding: 16 },
  titulo: { fontSize: 24, color: '#fff', marginBottom: 16 },
  card: {
    backgroundColor: '#111',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  nome: { fontSize: 18, color: '#fff', marginBottom: 4 },
  tipo: { fontSize: 14, color: '#aaa' },
  actions: { flexDirection: 'row', marginTop: 10, gap: 12 },
  botao: { paddingVertical: 6, paddingHorizontal: 12, backgroundColor: '#222', borderRadius: 6 },
  botaoTexto: { color: '#fff', fontSize: 14 },
  adicionar: {
    backgroundColor: '#444',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  adicionarTexto: { color: '#fff', fontSize: 18 },
  vazio: { color: '#aaa', textAlign: 'center', marginTop: 30 },
});
