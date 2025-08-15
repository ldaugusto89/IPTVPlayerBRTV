import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../@types/navigation';
import { getPerfis, ListaPerfil, salvarUltimoPerfil } from '../lib/listaStorage';
import FocusableButton from '../components/FocusableButton';
import { useContent } from '../context/ChannelContext';
import { usePerfil } from '../context/PerfilContext';

type PerfisScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Perfis'>;

export default function PerfisScreen() {
  const [perfis, setPerfis] = useState<ListaPerfil[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingList, setLoadingList] = useState<string | null>(null);
  const navigation = useNavigation<PerfisScreenNavigationProp>();
  const { setServerInfo } = useContent();
  const { activeProfile, setActiveProfile } = usePerfil();

  useEffect(() => {
    const carregarPerfis = async () => {
      const perfisSalvos = await getPerfis();
      setPerfis(perfisSalvos);
      setLoading(false);
    };
    const unsubscribe = navigation.addListener('focus', carregarPerfis);
    return unsubscribe;
  }, [navigation]);

  const handleSelecionar = async (perfil: ListaPerfil) => {
    // A lógica para evitar recarregamento desnecessário continua válida
    if (activeProfile && perfil.id === activeProfile.id) {
      console.log('Perfil já ativo. Navegando para a Home.');
      navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
      return;
    }

    setLoadingList(perfil.id);
    try {
      // Extrai as informações de login da URL do perfil
      const url = perfil.tipo === 'url' ? perfil.url! : `http://${perfil.host}/get.php?username=${perfil.username}&password=${perfil.password}&type=m3u_plus`;
      
      const regex = /^(https?:\/\/[^/]+)\/.*?[?&]username=([^&]+)&password=([^&]+)/;
      const match = url.match(regex);

      if (!match) {
        throw new Error("URL do perfil em formato inválido. Verifique os dados do perfil.");
      }

      const serverInfo = {
        serverUrl: `${match[1]}/player_api.php`,
        username: match[2],
        password: match[3],
      };
      
      console.log("Informações do servidor extraídas com sucesso:", serverInfo);
      
      // Salva as informações no contexto para serem usadas em outras telas
      setServerInfo(serverInfo);
      setActiveProfile(perfil);
      await salvarUltimoPerfil(perfil.id);
      
      // Navega para a Home. O conteúdo será carregado sob demanda lá.
      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      });

    } catch (err: any) {
      console.error("Erro ao selecionar o perfil:", err);
      Alert.alert('Erro', err.message || 'Não foi possível carregar o perfil.');
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
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#141414' },
  container: { flex: 1, backgroundColor: '#141414', alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 32, color: 'white', marginBottom: 50 },
  perfilContainer: { alignItems: 'center', margin: 20 },
  perfilButton: { width: 120, height: 120, borderRadius: 10, backgroundColor: '#333', justifyContent: 'center', alignItems: 'center' },
  perfilInitial: { fontSize: 60, color: 'white' },
  perfilName: { color: 'white', marginTop: 10, fontSize: 18 },
  addButton: { marginTop: 40, paddingVertical: 10, paddingHorizontal: 30, borderWidth: 1, borderColor: '#888' },
  addButtonText: { color: '#888', fontSize: 16 },
});
