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
    { icon: '📊', label: 'Dashboard', href: '/dashboard' },
    { icon: '📈', label: 'Stock', href: '/stock', disabled: true },
    { icon: '⭐', label: 'Favorit', href: '/favorit', disabled: true },
    { icon: '💰', label: 'Wallet', href: '/wallet', disabled: true },
  ];

  const handleLogout = async () => {
    await logout();
    // 로그아웃 후 사용자 정보 쿼리 무효화
    queryClient.invalidateQueries({ queryKey: ['user'] });
    queryClient.setQueryData(['user'], null);
    router.push('/');
  };

  const isAuthenticated = user || authUser;

  return (
    <div className="w-64 bg-white h-screen shadow-lg fixed left-0 top-0">
      <div className="p-4">
        <Link href="/" className="flex items-center space-x-2 mb-8">
          <span className="text-2xl">◆</span>
          <span className="text-xl font-bold">Headername</span>
        </Link>
        
        {isAuthenticated ? (
          // 로그인 상태일 때의 메뉴
          <>
            <nav className="space-y-2">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.disabled ? '#' : item.href}
                  className={`flex items-center space-x-2 p-3 rounded-lg w-full ${
                    pathname === item.href
                      ? 'bg-indigo-50 text-indigo-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  } ${item.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={e => {
                    if (item.disabled) e.preventDefault();
                  }}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>
            <div className="absolute bottom-8 left-0 w-full px-4">
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 p-3 rounded-lg w-full text-red-600 hover:bg-red-50"
              >
                <span>🚪</span>
                <span>Logout</span>
              </button>
            </div>
          </>
        ) : (
          // 로그아웃 상태일 때의 메뉴
          <div className="space-y-2">
            <Link
              href="/login"
              className="flex items-center space-x-2 p-3 rounded-lg w-full text-indigo-600 hover:bg-indigo-50"
            >
              <span>🔑</span>
              <span>로그인/회원가입</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
} 