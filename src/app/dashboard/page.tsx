'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import StockChart from '@/components/stocks/StockChart';

export default function DashboardPage() {
  const router = useRouter();

  // 사용자 인증 상태 확인
  const { data: user, isLoading, error } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const response = await fetch('/api/auth/me');
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Not authenticated');
        }
        const data = await response.json();
        throw new Error(data.error || 'Failed to fetch user data');
      }
      return response.json();
    },
    retry: false,
  });

  // 인증되지 않은 사용자는 로그인 페이지로 리다이렉트
  useEffect(() => {
    if (error) {
      router.push('/login');
    }
  }, [error, router]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-8">My Portofolio</h1>
      <div className="grid gap-8">
        <StockChart stockCode="005930" stockName="삼성전자" />
      </div>
    </div>
  );
} 