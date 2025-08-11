import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../@types/navigation';

type LoginScreenNavigationProp  = NativeStackNavigationProp<RootStackParamList, 'Login'>;

export default function LoginScreen() {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const { login, signup } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email || !password) {
      Alert.alert('Preencha todos os campos');
      return;
    }

    setLoading(true);
    try {
      if (isRegister) {
        await signup(email, password);
        Alert.alert('Conta criada com sucesso!');
      } else {
        await login(email, password);
        navigation.reset({
        index: 0,
        routes: [{ name: 'Initial' }],
      });
      }
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Algo deu errado.');
    } finally {
      setLoading(false);
    }
  };

  const entrarComoVisitante = async () => {
    setLoading(true);
    try {
      await login(); // login anônimo

      navigation.reset({
        index: 0,
        routes: [{ name: 'Initial' }],
      });
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Não foi possível entrar como visitante.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isRegister ? 'Criar Conta' : 'Entrar'}</Text>

      <TextInput
        placeholder="Email"
        style={styles.input}
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        placeholder="Senha"
        style={styles.input}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>{isRegister ? 'Cadastrar' : 'Entrar'}</Text>}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setIsRegister(!isRegister)}>
        <Text style={styles.link}>
          {isRegister ? 'Já tem conta? Entrar' : 'Não tem conta? Criar'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={entrarComoVisitante} style={styles.guestButton}>
        <Text style={styles.guestText}>Entrar sem Conta</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 32,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#222',
    color: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#1e90ff',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  link: {
    color: '#ccc',
    textAlign: 'center',
    marginTop: 12,
    textDecorationLine: 'underline',
  },
  guestButton: {
    marginTop: 32,
    alignItems: 'center',
  },
  guestText: {
    color: '#aaa',
    fontSize: 16,
  },
});