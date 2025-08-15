import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { getPerfis, getUltimoPerfilId, salvarUltimoPerfil } from '../lib/listaStorage';
import { useContent } from '../context/ChannelContext';
import { usePerfil } from '../context/PerfilContext';
import { parseServerInfo } from '../services/xtreamService'; // Importando o novo serviço

export default function InitialScreen() {
  const navigation = useNavigation<any>();
  const { user, loading } = useAuth();
  const { setServerInfo } = useContent(); // Usaremos a nova função do contexto
  const { setActiveProfile } = usePerfil();

  useEffect(() => {
    const verificarFluxo = async () => {
      if (loading) return;

      if (!user) {
        navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
        return;
      }

      const perfis = await getPerfis();
      if (!perfis || perfis.length === 0) {
        navigation.reset({ index: 0, routes: [{ name: 'Perfis' }] });
        return;
      }

      const ultimoId = await getUltimoPerfilId();
      const perfil = perfis.find(p => p.id === ultimoId) || perfis[0];
      await salvarUltimoPerfil(perfil.id);

      try {
        // --- NOVA LÓGICA DE API ---
        // 1. Monta a URL completa, assim como a tela de perfis faz
        const url = perfil.tipo === 'url' 
          ? perfil.url! 
          : `http://${perfil.host}/get.php?username=${perfil.username}&password=${perfil.password}&type=m3u_plus`;

        // 2. Extrai as informações do servidor
        const serverInfo = parseServerInfo(url);

        if (serverInfo) {
          console.log("InitialScreen: Informações do servidor extraídas com sucesso.");
          // 3. Salva as informações no contexto
          setServerInfo(serverInfo);
          setActiveProfile(perfil);
          // 4. Navega para a Home, que agora terá as informações para buscar o conteúdo
          navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
        } else {
          throw new Error("Não foi possível extrair informações do servidor do perfil salvo.");
        }
      } catch (err: any) {
        console.warn('Erro ao carregar perfil na InitialScreen:', err.message);
        // Em caso de erro, o melhor é ir para a seleção de perfis
        navigation.reset({ index: 0, routes: [{ name: 'Perfis' }] });
      }
    };

    verificarFluxo();
  // Adicionamos as novas dependências ao array
  }, [user, loading, navigation, setServerInfo, setActiveProfile]);


  return (
    <View style={styles.loading}>
      <ActivityIndicator size="large" color="#1e90ff" />
    </View>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
