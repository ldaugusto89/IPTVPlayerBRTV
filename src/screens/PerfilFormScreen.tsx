import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { salvarPerfil, replacePerfil } from '../lib/listaStorage';
import uuid from 'react-native-uuid';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, ListaPerfil } from '../../@types/navigation';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'PerfilForm'>;
type RouteParams = RouteProp<RootStackParamList, 'PerfilForm'>;

export default function PerfilFormScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteParams>();
  const perfil: ListaPerfil | undefined = route.params?.perfil;

  const [nome, setNome] = useState('');
  const [tipo, setTipo] = useState<'url' | 'api'>('url');
  const [url, setUrl] = useState('');
  const [host, setHost] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (perfil) {
      setNome(perfil.nome);
      setTipo(perfil.tipo);
      setUrl(perfil.url || '');
      setHost(perfil.host || '');
      setUsername(perfil.username || '');
      setPassword(perfil.password || '');
    }
  }, [perfil]);

  const handleSalvar = async () => {
    if (!nome.trim()) {
      Alert.alert('Preencha o nome do perfil');
      return;
    }

    const novoPerfil: ListaPerfil = {
      id: perfil?.id ?? String(uuid.v4()),
      nome: nome.trim(),
      tipo,
      url: tipo === 'url' ? url.trim() : undefined,
      host: tipo === 'api' ? host.trim() : undefined,
      username: tipo === 'api' ? username.trim() : undefined,
      password: tipo === 'api' ? password.trim() : undefined,
    };

    if (perfil) {
      await replacePerfil(novoPerfil); // Atualiza
    } else {
      await salvarPerfil(novoPerfil); // Novo
    }

    navigation.reset({
      index: 0,
      routes: [{ name: 'Initial' }],
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>{perfil ? 'Editar Perfil' : 'Novo Perfil'}</Text>

      <Text style={styles.label}>Nome:</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: Minha Lista IPTV"
        placeholderTextColor="#aaa"
        value={nome}
        onChangeText={setNome}
      />

      <View style={styles.toggle}>
        <Pressable onPress={() => setTipo('url')} style={[styles.toggleBtn, tipo === 'url' && styles.active]}>
          <Text style={styles.toggleText}>URL</Text>
        </Pressable>
        <Pressable onPress={() => setTipo('api')} style={[styles.toggleBtn, tipo === 'api' && styles.active]}>
          <Text style={styles.toggleText}>API</Text>
        </Pressable>
      </View>

      {tipo === 'url' ? (
        <>
          <Text style={styles.label}>URL:</Text>
          <TextInput
            style={styles.input}
            placeholder="https://exemplo.com/lista.m3u"
            placeholderTextColor="#aaa"
            value={url}
            onChangeText={setUrl}
          />
        </>
      ) : (
        <>
          <Text style={styles.label}>Host:</Text>
          <TextInput
            style={styles.input}
            placeholder="http://host.com"
            placeholderTextColor="#aaa"
            value={host}
            onChangeText={setHost}
          />

          <Text style={styles.label}>Usuário:</Text>
          <TextInput
            style={styles.input}
            placeholder="usuario"
            placeholderTextColor="#aaa"
            value={username}
            onChangeText={setUsername}
          />

          <Text style={styles.label}>Senha:</Text>
          <TextInput
            style={styles.input}
            placeholder="senha"
            placeholderTextColor="#aaa"
            value={password}
            secureTextEntry
            onChangeText={setPassword}
          />
        </>
      )}

      <Pressable style={styles.btn} onPress={handleSalvar}>
        <Text style={styles.btnText}>Salvar</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', padding: 20 },
  titulo: { fontSize: 22, color: '#fff', marginBottom: 20 },
  label: { color: '#aaa', marginTop: 10 },
  input: {
    backgroundColor: '#222',
    color: '#fff',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  btn: {
    backgroundColor: '#444',
    padding: 14,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
  },
  btnText: { color: '#fff', fontSize: 16 },
  toggle: { flexDirection: 'row', marginVertical: 10 },
  toggleBtn: {
    flex: 1,
    backgroundColor: '#222',
    padding: 10,
    borderRadius: 8,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  active: { backgroundColor: '#555' },
  toggleText: { color: '#fff' },
});