import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { signIn, signUp, getUser } from '../lib/supabaseClient';

export type User = {
  id: string;
  email?: string;
  anonimo?: boolean;
};

export type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email?: string, password?: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  token: string | null;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSession = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('supabase_user');
        const storedToken = await AsyncStorage.getItem('supabase_token');

        if (storedUser) {
          const parsed = JSON.parse(storedUser);
          setUser(parsed);
          setToken(storedToken);
        } else if (storedToken) {
          const userInfo = await getUser(storedToken);
          if (userInfo && userInfo.id) {
            const fullUser = { id: userInfo.id, email: userInfo.email };
            setUser(fullUser);
            setToken(storedToken);
            await AsyncStorage.setItem('supabase_user', JSON.stringify(fullUser));
          }
        }
      } catch (error) {
        console.error('Erro ao recuperar sessão:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSession();
  }, []);

  const login = async (email?: string, password?: string) => {
    if (!email || !password) {
      const guestToken = 'anon-' + Date.now().toString();
      const guestId = 'guest-' + Math.random().toString(36).substring(2, 12);
      const guestUser = { id: guestId, email: 'visitante@app.com', anonimo: true };

      await AsyncStorage.setItem('supabase_token', guestToken);
      await AsyncStorage.setItem('supabase_user', JSON.stringify(guestUser));

      setToken(guestToken);
      setUser(guestUser);
      return;
    }

    const result = await signIn(email, password);
    if (result?.access_token) {
      setToken(result.access_token);
      await AsyncStorage.setItem('supabase_token', result.access_token);

      const userInfo = await getUser(result.access_token);
      const fullUser = { id: userInfo.id, email: userInfo.email };
      await AsyncStorage.setItem('supabase_user', JSON.stringify(fullUser));

      setUser(fullUser);
    } else {
      const msg = result.error?.message.toLowerCase();
      if (msg?.includes('invalid login credentials')) throw new Error('Email ou senha incorretos.');
      throw new Error(result.error?.message || 'Erro ao fazer login');
    }
  };

  const signup = async (email: string, password: string) => {
    const result = await signUp(email, password);
    if (result?.access_token) {
      setToken(result.access_token);
      await AsyncStorage.setItem('supabase_token', result.access_token);

      const userInfo = await getUser(result.access_token);
      const fullUser = { id: userInfo.id, email: userInfo.email };
      await AsyncStorage.setItem('supabase_user', JSON.stringify(fullUser));

      setUser(fullUser);
    } else {
      const msg = result.error?.message.toLowerCase();
      if (msg?.includes('user already registered')) throw new Error('Este e-mail já está cadastrado.');
      throw new Error(result.error?.message || 'Erro ao cadastrar usuário');
    }
  };

  const logout = async () => {
    await AsyncStorage.multiRemove(['supabase_token', 'supabase_user']);
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);