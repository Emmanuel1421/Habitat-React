import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types';
import { UserResponse } from '@/types/api';
import { authService } from '@/services/authService';
import { userService } from '@/services/userService';
import { roleApiToFrontend } from '@/lib/roleMap';
import { TOKEN_KEY, USER_KEY, ApiError } from '@/lib/api';

const mapUser = (u: UserResponse): User => ({
  id: String(u.id),
  nome: u.name,
  email: u.email,
  role: roleApiToFrontend(u.role),
  ativo: u.status,
});

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => Promise<void>;
  isAuthenticated: boolean;
  loading: boolean;
  loginError: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [loginError, setLoginError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    const storedUser = localStorage.getItem(USER_KEY);
    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoginError(null);
    try {
      const res = await authService.login({ email, password });
      const mapped = mapUser(res.user);
      localStorage.setItem(TOKEN_KEY, res.token);
      localStorage.setItem(USER_KEY, JSON.stringify(mapped));
      setUser(mapped);
      return true;
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Falha ao autenticar';
      setLoginError(message);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
  };

  const updateUser = async (updates: Partial<User>) => {
    if (!user) return;
    const updated = await userService.update(Number(user.id), {
      name: updates.nome,
      email: updates.email,
    });
    const mapped = mapUser(updated);
    localStorage.setItem(USER_KEY, JSON.stringify(mapped));
    setUser(mapped);
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, updateUser, isAuthenticated: !!user, loading, loginError }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
