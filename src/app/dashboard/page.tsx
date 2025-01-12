'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import StockChart from '@/components/stocks/StockChart';

// 임시 주식 목록 데이터
const STOCK_LIST = [
  { code: '005930', name: '삼성전자', price: 73800, change: 1200, changePercent: 1.65 },
  { code: '000660', name: 'SK하이닉스', price: 156500, change: -500, changePercent: -0.32 },
  { code: '035720', name: '카카오', price: 56700, change: 900, changePercent: 1.61 },
  { code: '035420', name: '네이버', price: 203000, change: 2000, changePercent: 0.99 },
  { code: '005380', name: '현대차', price: 246500, change: -1500, changePercent: -0.61 },
];

export default function DashboardPage() {
  const [selectedStock, setSelectedStock] = useState(STOCK_LIST[0]);

  // 환율 데이터 가져오기
  const { data: exchangeRates } = useQuery({
    queryKey: ['exchangeRates'],
    queryFn: async () => {
      const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
      const data = await response.json();
      return {
        usdKrw: (data.rates.KRW).toFixed(2),
        jpyKrw: (data.rates.KRW / data.rates.JPY).toFixed(2)
      };
    },
    staleTime: 1000 * 60 * 5, // 5분마다 갱신
  });

  // 비트코인 시세 가져오기
  const { data: bitcoin } = useQuery({
    queryKey: ['bitcoin'],
    queryFn: async () => {
      const response = await fetch('https://api.coindesk.com/v1/bpi/currentprice.json');
      const data = await response.json();
      return {
        price: Number(data.bpi.USD.rate.replace(',', '')).toFixed(2),
        change: '+2.5%' // 실제로는 이전 가격과 비교하여 계산해야 함
      };
    },
    staleTime: 1000 * 60, // 1분마다 갱신
  });

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
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-8 text-gray-800">My Portfolio</h1>
        
        {/* 환율 및 비트코인 시세 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500">USD/KRW</p>
                  <p className="text-lg font-bold text-gray-800">₩ {exchangeRates?.usdKrw || '-'}</p>
                </div>
              </div>
              <div className="text-green-500 text-sm font-semibold">
                +0.2%
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 11V9a2 2 0 00-2-2m2 4v4a2 2 0 104 0v-1m-4-3H9m2 0h4m6 1a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500">JPY/KRW</p>
                  <p className="text-lg font-bold text-gray-800">₩ {exchangeRates?.jpyKrw || '-'}</p>
                </div>
              </div>
              <div className="text-red-500 text-sm font-semibold">
                -0.1%
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Bitcoin</p>
                  <p className="text-lg font-bold text-gray-800">$ {bitcoin?.price || '-'}</p>
                </div>
              </div>
              <div className="text-green-500 text-sm font-semibold">
                {bitcoin?.change || '-'}
              </div>
            </div>
          </div>
        </div>

        {/* 메인 컨텐츠 영역 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* 메인 차트 */}
          <div className="md:col-span-2 bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-800">{selectedStock.name}</h2>
                <p className="text-sm text-gray-500">{selectedStock.code}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-800">{selectedStock.price.toLocaleString()}원</p>
                <div className="flex items-center justify-end space-x-2">
                  <p className={`text-sm font-semibold ${
                    selectedStock.change > 0 ? 'text-red-500' : 'text-blue-500'
                  }`}>
                    {selectedStock.change > 0 ? '+' : ''}{selectedStock.change.toLocaleString()}원
                  </p>
                  <p className={`text-sm font-semibold ${
                    selectedStock.changePercent > 0 ? 'text-red-500' : 'text-blue-500'
                  }`}>
                    ({selectedStock.changePercent > 0 ? '+' : ''}{selectedStock.changePercent}%)
                  </p>
                </div>
              </div>
            </div>
            <StockChart 
              stockCode={selectedStock.code} 
              stockName={selectedStock.name}
            />
          </div>

          {/* 종목 리스트 */}
          <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
            <h2 className="text-lg font-bold text-gray-800 mb-4">대표 종목</h2>
            <div className="space-y-4">
              {STOCK_LIST.map((stock) => (
                <div
                  key={stock.code}
                  className={`p-4 rounded-lg cursor-pointer transition-all ${
                    selectedStock.code === stock.code
                      ? 'bg-indigo-50 border border-indigo-100'
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedStock(stock)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-800">{stock.name}</h3>
                      <p className="text-sm text-gray-500">{stock.code}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-800">{stock.price.toLocaleString()}원</p>
                      <div className="flex items-center justify-end space-x-2">
                        <p className={`text-sm font-medium ${
                          stock.change > 0 ? 'text-red-500' : 'text-blue-500'
                        }`}>
                          {stock.change > 0 ? '+' : ''}{stock.change.toLocaleString()}
                        </p>
                        <p className={`text-sm font-medium ${
                          stock.changePercent > 0 ? 'text-red-500' : 'text-blue-500'
                        }`}>
                          ({stock.changePercent > 0 ? '+' : ''}{stock.changePercent}%)
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 