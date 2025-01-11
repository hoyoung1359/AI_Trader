'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import StockChart from '@/components/stocks/StockChart';

export default function DashboardPage() {
  const router = useRouter();

  // 사용자 인증 상태 확인
  const { data: user, isLoading } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const response = await fetch('/api/auth/me');
      if (!response.ok) {
        return null;
      }
      return response.json();
    },
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold mb-4">접근 권한이 없습니다</h1>
        <p>이 페이지를 보려면 로그인이 필요합니다.</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-8">My Portfolio</h1>
      <div className="grid gap-8">
        <StockChart stockCode="005930" stockName="삼성전자" />
      </div>
    </div>
  );
} 