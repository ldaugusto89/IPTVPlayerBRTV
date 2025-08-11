import React, { useEffect } from 'react';
import { View, Text, StyleSheet, BackHandler } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { usePerfil } from '../context/PerfilContext';
import FocusableButton from './FocusableButton';

interface SidebarProps {
  onClose: () => void;
  onNavigate: (route: string) => void;
  isOpen: boolean;
}

export default function Sidebar({ onClose, onNavigate, isOpen }: SidebarProps) {
  const { user } = useAuth();
  const { perfilSelecionado } = usePerfil();

  // Fecha a sidebar ao apertar "voltar" (apenas enquanto aberta)
  useEffect(() => {
    if (!isOpen) return;
    const handler = BackHandler.addEventListener('hardwareBackPress', () => {
      onClose();
      return true;
    });
    return () => handler.remove();
  }, [isOpen, onClose]);

  return (
    <View style={styles.container} pointerEvents={isOpen ? 'auto' : 'none'}>
      <Text style={styles.title}>☰ Menu</Text>

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

      <View style={styles.menu}>
        <FocusableButton
          title="Canais ao Vivo"
          onPress={() => onNavigate('Canais')}
          style={styles.menuButton}
          focusable={isOpen}
          hasTVPreferredFocus={isOpen} // ganha foco quando a sidebar abre
        />
        <FocusableButton
          title="Filmes"
          onPress={() => onNavigate('Filmes')}
          style={styles.menuButton}
          focusable={isOpen}
        />
        <FocusableButton
          title="Séries"
          onPress={() => onNavigate('Series')}
          style={styles.menuButton}
          focusable={isOpen}
        />
        <FocusableButton
          title="Configurações"
          onPress={() => onNavigate('Configuracoes')}
          style={styles.menuButton}
          focusable={isOpen}
        />
        <FocusableButton
          title="Fechar"
          onPress={onClose}
          style={[styles.menuButton, styles.closeButton]}
          focusable={isOpen}
        />
      </View>
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
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  userInfo: {
    color: '#aaa',
    marginTop: 4,
  },
  menu: {
    marginTop: 24,
  },
  menuButton: {
    marginBottom: 12,
  },
  closeButton: {
    backgroundColor: '#900',
  },
});