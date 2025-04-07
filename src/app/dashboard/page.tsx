'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import StockChart from '@/components/stocks/StockChart';
import { useAuth } from '@/providers/AuthProvider';

const STOCK_LIST = [
  { code: '005930', name: '삼성전자' },
  { code: '000660', name: 'SK하이닉스' },
  { code: '035720', name: '카카오' },
  { code: '035420', name: 'NAVER' },
  { code: '005380', name: '현대차' },
];

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuth();
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
    staleTime: 1000 * 60 * 5,
  });

  // 비트코인 시세 가져오기
  const { data: bitcoin } = useQuery({
    queryKey: ['bitcoin'],
    queryFn: async () => {
      const response = await fetch('https://api.coindesk.com/v1/bpi/currentprice.json');
      const data = await response.json();
      return {
        price: Number(data.bpi.USD.rate.replace(',', '')).toFixed(2),
        change: '+2.5%'
      };
    },
    staleTime: 1000 * 60,
  });

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
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">My Portfolio</h1>
          <div className="text-sm text-gray-500">
            마지막 업데이트: {new Date().toLocaleString()}
          </div>
        </div>
        
        {/* 환율 및 비트코인 시세 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <span className="text-sm text-gray-500">USD/KRW</span>
                  <div className="text-lg font-semibold text-gray-900">₩ {exchangeRates?.usdKrw || '-'}</div>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-sm px-2 py-1 bg-green-100 text-green-800 rounded-full">▲ 0.2%</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <span className="text-sm text-gray-500">JPY/KRW</span>
                  <div className="text-lg font-semibold text-gray-900">₩ {exchangeRates?.jpyKrw || '-'}</div>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-sm px-2 py-1 bg-red-100 text-red-800 rounded-full">▼ 0.1%</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Bitcoin</span>
                  <div className="text-lg font-semibold text-gray-900">$ {bitcoin?.price || '-'}</div>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-sm px-2 py-1 bg-green-100 text-green-800 rounded-full">
                  {bitcoin?.change || '-'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 메인 차트와 종목 목록 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* 메인 차트 */}
          <div className="md:col-span-3 bg-white rounded-xl shadow-sm">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">{selectedStock.name}</h2>
                  <p className="text-sm text-gray-500">{selectedStock.code}</p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <StockChart 
                stockCode={selectedStock.code} 
                stockName={selectedStock.name}
                showOrderButtons={false}
              />
            </div>
          </div>

          {/* 종목 목록 */}
          <div className="bg-white rounded-xl shadow-sm">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">대표 종목</h2>
            </div>
            <div className="p-4">
              <div className="space-y-2">
                {STOCK_LIST.map((stock) => (
                  <button
                    key={stock.code}
                    onClick={() => setSelectedStock(stock)}
                    className={`w-full p-4 rounded-lg transition-colors ${
                      selectedStock.code === stock.code
                        ? 'bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-100'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-left">
                        <h3 className="font-medium text-gray-900">{stock.name}</h3>
                        <p className="text-sm text-gray-500">{stock.code}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">
                          {/* 실시간 가격 데이터 연동 시 추가 */}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 