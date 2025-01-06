'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { StockResponse } from '@/types/stock';
import { MAJOR_STOCKS } from '@/lib/korea-investment/client';

interface StockData {
  code: string;
  name: string;
  price: number;
  change: number;
  changeRate: number;
  volume: number;
}

interface StockListProps {
  selectedStock: { code: string; name: string };
  onSelectStock: (stock: { code: string; name: string }) => void;
}

export default function StockList({ selectedStock, onSelectStock }: StockListProps) {
  const [searchTerm, setSearchTerm] = useState('');

  // 초기 데이터 로딩을 위한 업데이트 호출
  const { data: updateResult } = useQuery({
    queryKey: ['updateStockPrices'],
    queryFn: async () => {
      const response = await fetch('/api/stocks/prices/update');
      if (!response.ok) {
        throw new Error('Failed to update stock prices');
      }
      return response.json();
    },
    staleTime: 1000 * 60 * 5, // 5분마다 갱신
  });

  // DB에서 가격 데이터 가져오기
  const { data: stockPrices, isLoading, error } = useQuery({
    queryKey: ['stockPrices', updateResult],
    queryFn: async () => {
      const response = await fetch('/api/stocks/prices');
      if (!response.ok) {
        throw new Error('Failed to fetch stock prices');
      }
      return response.json();
    },
    refetchInterval: 5000, // 5초마다 갱신
  });

  // 주식 데이터 가공
  const stocks = MAJOR_STOCKS.map(stock => {
    const priceData = stockPrices?.find((p: any) => 
      p.stockCode === stock.code || p.code === stock.code
    );
    return {
      code: stock.code,
      name: stock.name,
      price: priceData?.price || 0,
      change: priceData?.change || 0,
      changeRate: priceData?.changeRate || 0,
      volume: priceData?.volume || 0,
    };
  });

  // 검색 필터링
  const filteredStocks = stocks.filter(stock => 
    stock.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    stock.code.includes(searchTerm)
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg h-[calc(100vh-8rem)] flex flex-col">
      {/* 헤더 섹션 */}
      <div className="p-4 border-b dark:border-gray-700 flex-shrink-0">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            실시간 시세
          </h2>
          <div className="relative">
            <input
              type="text"
              placeholder="종목 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-48 px-3 py-1.5 rounded-lg bg-gray-50 dark:bg-gray-700 
                border border-gray-200 dark:border-gray-600
                focus:outline-none focus:ring-2 focus:ring-blue-500 
                dark:text-gray-200 text-sm"
            />
          </div>
        </div>
      </div>

      {/* 테이블 섹션 */}
      <div className="flex-1 overflow-auto">
        <table className="w-full">
          <thead className="sticky top-0 bg-gray-50 dark:bg-gray-700/50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                종목
              </th>
              <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                현재가
              </th>
              <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                등락률
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredStocks.map((stock) => (
              <tr 
                key={stock.code}
                onClick={() => onSelectStock({ code: stock.code, name: stock.name })}
                className={`
                  cursor-pointer transition-colors duration-150
                  hover:bg-gray-50 dark:hover:bg-gray-700/50
                  ${selectedStock.code === stock.code ? 'bg-blue-50 dark:bg-blue-900/20' : ''}
                `}
              >
                <td className="px-4 py-3 whitespace-nowrap">
                  <div>
                    <div className="font-medium text-gray-900 dark:text-gray-100">
                      {stock.name}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {stock.code}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-right whitespace-nowrap">
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {stock.price.toLocaleString()}
                  </span>
                </td>
                <td className={`px-4 py-3 text-right whitespace-nowrap`}>
                  <div className={`font-medium ${stock.change >= 0 ? 'text-red-500' : 'text-blue-500'}`}>
                    {stock.change >= 0 ? '+' : ''}{stock.changeRate}%
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 로딩/에러 상태 */}
      {isLoading && (
        <div className="absolute inset-0 bg-white/50 dark:bg-gray-800/50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
        </div>
      )}
      {error && (
        <div className="p-4 text-center text-red-500">
          데이터를 불러오는데 실패했습니다.
        </div>
      )}
    </div>
  );
} 