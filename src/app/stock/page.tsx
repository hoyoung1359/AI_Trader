'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import StockChart from '@/components/stocks/StockChart';

// 임시 주식 목록 데이터
const STOCK_LIST = [
  { code: '005930', name: '삼성전자', price: 73800, change: 1200, balance: 1000000 },
  { code: '000660', name: 'SK하이닉스', price: 156500, change: -500, balance: 800000 },
  { code: '035720', name: '카카오', price: 56700, change: 900, balance: 600000 },
  { code: '035420', name: '네이버', price: 203000, change: 2000, balance: 750000 },
  { code: '005380', name: '현대차', price: 246500, change: -1500, balance: 900000 },
];

// 카테고리 목록
const CATEGORIES = ['전체', '관심', '보유'];

export default function StockPage() {
  const [selectedStock, setSelectedStock] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('전체');

  // 사용자 인증 상태 확인
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

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg">로그인이 필요합니다.</p>
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
            className={`px-4 py-2 rounded-lg ${
              selectedCategory === category
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {/* 주식 목록 테이블 */}
      <div className="bg-white rounded-lg shadow mb-6">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="p-4 text-left">종목명</th>
              <th className="p-4 text-left">종목코드</th>
              <th className="p-4 text-right">현재가</th>
              <th className="p-4 text-right">등락</th>
              <th className="p-4 text-right">잔고</th>
              <th className="p-4 text-center">관심</th>
              <th className="p-4 text-center">매수</th>
            </tr>
          </thead>
          <tbody>
            {STOCK_LIST.map((stock) => (
              <tr
                key={stock.code}
                className="border-b cursor-pointer hover:bg-gray-50"
                onClick={() => setSelectedStock(stock.code)}
              >
                <td className="p-4">{stock.name}</td>
                <td className="p-4">{stock.code}</td>
                <td className="p-4 text-right">{stock.price.toLocaleString()}원</td>
                <td className={`p-4 text-right ${
                  stock.change > 0 ? 'text-red-500' : 'text-blue-500'
                }`}>
                  {stock.change > 0 ? '+' : ''}{stock.change.toLocaleString()}원
                </td>
                <td className="p-4 text-right">{stock.balance.toLocaleString()}원</td>
                <td className="p-4 text-center">
                  <button
                    className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
                    onClick={(e) => {
                      e.stopPropagation();
                      // TODO: 관심 종목 추가 로직 구현
                    }}
                  >
                    ⭐
                  </button>
                </td>
                <td className="p-4 text-center">
                  <button
                    className="px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600"
                    onClick={(e) => {
                      e.stopPropagation();
                      // TODO: 매수 로직 구현
                    }}
                  >
                    매수
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 선택된 종목의 차트 */}
      {selectedStock && (
        <div className="bg-white rounded-lg shadow p-6">
          <StockChart stockCode={selectedStock} />
        </div>
      )}
    </div>
  );
} 