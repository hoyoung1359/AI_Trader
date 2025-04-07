'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import StockChart from '@/components/stocks/StockChart';
import { MAJOR_STOCKS } from '@/lib/korea-investment/client';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';

// 카테고리 목록
const CATEGORIES = ['전체', '관심', '보유'];

export default function StockPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [selectedStock, setSelectedStock] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('전체');

  // 주식 가격 데이터 가져오기
  const { data: stockPrices, isLoading: pricesLoading } = useQuery({
    queryKey: ['stockPrices'],
    queryFn: async () => {
      const response = await fetch('/api/stocks/prices', {
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error('Failed to fetch stock prices');
      }
      return response.json();
    },
    refetchInterval: 5000, // 5초마다 갱신
  });

  const isLoading = authLoading || pricesLoading;

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900">로그인이 필요합니다</h2>
          <p className="mt-2 text-gray-600">서비스를 이용하려면 로그인해주세요.</p>
          <button
            onClick={() => router.push('/login')}
            className="mt-4 px-4 py-2 bg-gradient-to-r from-indigo-600 to-blue-500 text-white rounded-lg hover:from-indigo-700 hover:to-blue-600 transition-colors"
          >
            로그인하기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* 카테고리 필터 */}
      <div className="flex gap-4 mb-6">
        {CATEGORIES.map((category) => (
          <button
            key={category}
            className={`px-4 py-2 rounded-lg transition-colors ${
              selectedCategory === category
                ? 'bg-gradient-to-r from-indigo-600 to-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {/* 주식 목록 테이블 */}
      <div className="bg-white rounded-lg shadow-sm mb-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="p-4 text-left">종목명</th>
                <th className="p-4 text-left">종목코드</th>
                <th className="p-4 text-right">현재가</th>
                <th className="p-4 text-right">전일대비</th>
                <th className="p-4 text-right">등락률</th>
                <th className="p-4 text-right">거래량</th>
                <th className="p-4 text-center">관심</th>
                <th className="p-4 text-center">매수</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="p-4 text-center">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600" />
                    </div>
                  </td>
                </tr>
              ) : (
                MAJOR_STOCKS.map((stock) => {
                  const priceData = stockPrices?.find((p: any) => p.code === stock.code);
                  return (
                    <tr
                      key={stock.code}
                      className="border-b cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => router.push(`/stock/${stock.code}`)}
                    >
                      <td className="p-4">
                        <div>
                          <div className="font-medium text-gray-900">{stock.name}</div>
                          <div className="text-sm text-gray-500">{stock.sector}</div>
                        </div>
                      </td>
                      <td className="p-4 text-gray-600">{stock.code}</td>
                      <td className="p-4 text-right font-medium">
                        {priceData?.price?.toLocaleString() || '-'}원
                      </td>
                      <td className={`p-4 text-right font-medium ${
                        priceData?.change > 0 ? 'text-red-500' : 
                        priceData?.change < 0 ? 'text-blue-500' : 'text-gray-500'
                      }`}>
                        {priceData?.change > 0 ? '+' : ''}
                        {priceData?.change?.toLocaleString() || '-'}원
                      </td>
                      <td className={`p-4 text-right font-medium ${
                        priceData?.changeRate > 0 ? 'text-red-500' : 
                        priceData?.changeRate < 0 ? 'text-blue-500' : 'text-gray-500'
                      }`}>
                        {priceData?.changeRate > 0 ? '+' : ''}
                        {priceData?.changeRate?.toFixed(2) || '-'}%
                      </td>
                      <td className="p-4 text-right text-gray-600">
                        {priceData?.volume?.toLocaleString() || '-'}
                      </td>
                      <td className="p-4 text-center">
                        <button
                          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            // TODO: 관심 종목 추가 로직 구현
                          }}
                        >
                          <svg className="w-5 h-5 text-gray-400 hover:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                          </svg>
                        </button>
                      </td>
                      <td className="p-4 text-center">
                        <button
                          className="px-3 py-1 text-sm font-medium text-white bg-red-500 rounded hover:bg-red-600 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/stock/${stock.code}`);
                          }}
                        >
                          매수
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 선택된 종목의 차트 */}
      {selectedStock && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <StockChart 
            stockCode={selectedStock} 
            stockName={MAJOR_STOCKS.find(s => s.code === selectedStock)?.name || ''} 
          />
        </div>
      )}
    </div>
  );
} 