import React from 'react';
import { View, Text, StyleSheet} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { usePerfil } from '../context/PerfilContext';

export default function Sidebar() {
  const { user } = useAuth();
  const { perfilSelecionado } = usePerfil();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Configurações</Text>
      <Text style={styles.userInfo}>
        Usuário: {user?.anonimo ? 'Visitante' : user?.email}
      </Text>

      {perfilSelecionado ? (
        <>
          <Text style={styles.userInfo}>Perfil: {perfilSelecionado.nome}</Text>
          <Text style={styles.userInfo}>Tipo: {perfilSelecionado.tipo}</Text>
        </>
      ) : (
        <Text style={styles.userInfo}>Nenhum perfil selecionado</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 300,
    backgroundColor: '#111',
    padding: 16,
    height: '100%',
  },
  header: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    paddingBottom: 12,
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  userInfo: {
    color: '#aaa',
    marginTop: 4,
  },
});