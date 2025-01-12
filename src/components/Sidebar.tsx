'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const queryClient = useQueryClient();

  // 사용자 인증 상태 확인
  const { data: authUser } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const response = await fetch('/api/auth/me');
      if (!response.ok) {
        return null;
      }
      return response.json();
    },
  });

  const menuItems = [
    { 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
        </svg>
      ), 
      label: 'Dashboard', 
      href: '/dashboard' 
    },
    { 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ), 
      label: 'Stock', 
      href: '/stock', 
      disabled: false 
    },
    { 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      ), 
      label: 'Favorit', 
      href: '/favorit', 
      disabled: true 
    },
    { 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      ), 
      label: 'Wallet', 
      href: '/wallet', 
      disabled: true 
    },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      queryClient.invalidateQueries({ queryKey: ['user'] });
      queryClient.setQueryData(['user'], null);
    } catch (error) {
      console.error('로그아웃 실패:', error);
    }
  };

  const handleLoginClick = () => {
    router.push('/login');
  };

  const isAuthenticated = user || authUser;

  return (
    <div className="w-64 bg-white h-screen shadow-lg fixed left-0 top-0">
      <div className="p-4">
        <Link href="/" className="flex items-center space-x-2 mb-8">
          <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <span className="text-xl font-bold text-gray-800">AI Stock</span>
        </Link>
        
        {isAuthenticated ? (
          <>
            <nav className="space-y-1">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.disabled ? '#' : item.href}
                  className={`flex items-center space-x-3 p-3 rounded-lg w-full transition-colors ${
                    pathname === item.href
                      ? 'bg-indigo-50 text-indigo-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  } ${item.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={e => {
                    if (item.disabled) e.preventDefault();
                  }}
                >
                  {item.icon}
                  <span className="font-medium">{item.label}</span>
                </Link>
              ))}
            </nav>
            <div className="absolute bottom-8 left-0 w-full px-4">
              <button
                onClick={handleLogout}
                className="flex items-center space-x-3 p-3 rounded-lg w-full text-red-600 hover:bg-red-50 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className="font-medium">로그아웃</span>
              </button>
            </div>
          </>
        ) : (
          <div className="space-y-2">
            <button
              onClick={handleLoginClick}
              className="flex items-center space-x-3 p-3 rounded-lg w-full text-indigo-600 hover:bg-indigo-50 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              <span className="font-medium">로그인/회원가입</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 