import React, { createContext, useContext, useState } from 'react';
import { api, AuthUser } from './api';

interface AuthCtx {
  user: AuthUser | null;
  token: string | null;
  login: (email: string, password: string) => Promise<AuthUser>;
  logout: () => void;
}

const AuthContext = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const s = localStorage.getItem('user');
    return s ? JSON.parse(s) : null;
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));

  const login = async (email: string, password: string): Promise<AuthUser> => {
    const res = await api.login(email, password);
    setUser(res.user);
    setToken(res.token);
    localStorage.setItem('user', JSON.stringify(res.user));
    localStorage.setItem('token', res.token);
    return res.user;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return <AuthContext.Provider value={{ user, token, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
}
