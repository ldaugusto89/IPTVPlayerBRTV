import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { getPerfis, getUltimoPerfilId, salvarUltimoPerfil  } from '../lib/listaStorage';
import { fetchAndParseM3U, M3UItem } from '../utils/m3uParser';
import { buildXtreamUrls } from '../utils/buildXtreamUrls';
import { useContent } from '../context/ChannelContext';

export default function InitialScreen() {
  const navigation = useNavigation<any>();
  const { user, loading } = useAuth();
  const { setAllContent } = useContent();

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

      // Gera URL de M3U
      const { m3u } = buildXtreamUrls(
        perfil.host || '',
        perfil.username || '',
        perfil.password || ''
      );
      const urlFinal = perfil.tipo === 'url' ? perfil.url! : m3u;

      try {
        const canais: M3UItem[] = await fetchAndParseM3U(urlFinal);
        setAllContent(canais);

        if (canais.length > 0) {
          navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
        } else {
          Alert.alert('Lista vazia ou inválida');
          navigation.reset({ index: 0, routes: [{ name: 'Perfis' }] });
        }
      } catch (err) {
        console.warn('Erro ao carregar lista:', err);
        navigation.reset({ index: 0, routes: [{ name: 'Perfis' }] });
      }
    };

    verificarFluxo();
  }, [user, loading]);


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