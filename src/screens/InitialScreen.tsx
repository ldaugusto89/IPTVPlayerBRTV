import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { getPerfis, getUltimoPerfilId, salvarUltimoPerfil  } from '../lib/listaStorage';
import { fetchAndParseM3U, M3UItem } from '../utils/m3uParser';
import { useChannels } from '../context/ChannelContext';

export default function InitialScreen() {
  const navigation = useNavigation<any>();
  const { user, loading } = useAuth();
  const { setChannels } = useChannels();

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

      // Salvar último perfil
      await salvarUltimoPerfil(perfil.id);

      try {
        const urlFinal =
          perfil.tipo === 'url'
            ? perfil.url!
            : `${perfil.host?.replace(/\/$/, '')}/get.php?username=${perfil.username}&password=${perfil.password}&type=m3u_plus&output=ts`;

        const canais: M3UItem[] = await fetchAndParseM3U(urlFinal);

        setChannels(canais);

        if (canais.length > 0) {
          navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
        } else {
          Alert.alert('Lista vazia ou inválida');
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