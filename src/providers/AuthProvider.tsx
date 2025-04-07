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
      // 현재 로그인 또는 회원가입 페이지인 경우 인증 체크 스킵
      if (window.location.pathname === '/login' || window.location.pathname === '/register') {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/auth/me', {
          credentials: 'include',
          headers: {
            'Cache-Control': 'no-cache'
          }
        });
        
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
          localStorage.setItem('userInfo', JSON.stringify(userData));
        } else {
          setUser(null);
          localStorage.removeItem('userInfo');
          if (response.status === 401 && window.location.pathname !== '/login') {
            // 토큰이 만료되고 현재 로그인 페이지가 아닌 경우에만 리다이렉트
            window.location.href = '/login';
          }
        }
      } catch (error) {
        console.error('인증 확인 에러:', error);
        setUser(null);
        localStorage.removeItem('userInfo');
      } finally {
        setIsLoading(false);
      }
    };

    // 페이지 로드 시와 포커스를 받았을 때 인증 상태 확인
    checkAuth();
    
    // 로그인/회원가입 페이지가 아닐 때만 focus 이벤트 리스너 추가
    if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
      window.addEventListener('focus', checkAuth);
      return () => {
        window.removeEventListener('focus', checkAuth);
      };
    }
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
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('로그아웃 처리 중 오류가 발생했습니다');
      }

      // 상태 및 로컬 스토리지 초기화
      setUser(null);
      localStorage.removeItem('userInfo');
      window.location.href = '/login';
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