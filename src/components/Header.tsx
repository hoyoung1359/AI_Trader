'use client';

import { useQuery } from '@tanstack/react-query';

export default function Header() {
  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const response = await fetch('/api/auth/me');
      if (!response.ok) {
        return null;
      }
      return response.json();
    },
  });

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* 검색창 */}
          <div className="flex-1 max-w-lg">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-400">🔍</span>
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Enter Your Email Here"
              />
            </div>
          </div>

          {/* 우측 아이콘들 */}
          <div className="flex items-center space-x-4">
            {/* 알림 아이콘 */}
            <button
              type="button"
              className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              <span className="text-xl">🔔</span>
            </button>

            {/* 프로필 영역 */}
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-500">
                    {user?.email?.[0]?.toUpperCase() || '👤'}
                  </span>
                </div>
              </div>
              <div className="text-sm font-medium text-gray-700">
                {user?.email || '로그인이 필요합니다'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
} 