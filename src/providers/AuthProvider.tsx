'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { User } from '@/types/auth';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (user: User, token: string) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
          setUser(null);
          localStorage.removeItem('userInfo');
        }
      } catch (error) {
        console.error('인증 확인 에러:', error);
        setUser(null);
        localStorage.removeItem('userInfo');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = (user: User, token: string) => {
    setUser(user);
    localStorage.setItem('userInfo', JSON.stringify(user));
  };

  const logout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error('로그아웃 처리 중 오류가 발생했습니다');
      }

      // 상태 및 로컬 스토리지 초기화
      setUser(null);
      localStorage.removeItem('userInfo');
    } catch (error) {
      console.error('로그아웃 에러:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 