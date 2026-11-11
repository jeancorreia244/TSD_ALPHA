import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { graphql, mutations } from '../api';

const AuthContext = createContext(null);

const STORAGE_KEY = 'tsd_auth';

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setSession(parsed);
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setLoading(false);
  }, []);

  const saveSession = useCallback((newSession) => {
    if (newSession) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newSession));
      setSession(newSession);
    } else {
      localStorage.removeItem(STORAGE_KEY);
      setSession(null);
    }
  }, []);

  const register = useCallback(async (name, email, password, phone) => {
    const data = await graphql(mutations.register, { name, email, password, phone });
    const payload = data?.register;
    if (!payload?.token) throw new Error('Falha no cadastro: token não retornado');
    saveSession(payload);
    return payload;
  }, [saveSession]);

  const login = useCallback(async (email, password) => {
    const data = await graphql(mutations.login, { email, password });
    const payload = data?.login;
    if (!payload?.token) throw new Error('Falha no login: token não retornado');
    saveSession(payload);
    return payload;
  }, [saveSession]);

  const logout = useCallback(() => {
    saveSession(null);
  }, [saveSession]);

  const value = {
    session,
    loading,
    register,
    login,
    logout,
    isAuthenticated: !!session?.token
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth deve ser usado dentro de AuthProvider');
  return context;
}