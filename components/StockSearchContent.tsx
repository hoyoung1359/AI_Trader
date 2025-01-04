'use client';

import { useState, useCallback, useEffect } from 'react';
import { useStock } from '@/app/providers/StockProvider';
import { StockItem } from '@/types/stock';
import { useRouter } from 'next/navigation';
import debounce from 'lodash/debounce';

export default function StockSearchContent() {
  const router = useRouter();
  const { stocks, loading, error } = useStock();
  const [filteredStocks, setFilteredStocks] = useState<StockItem[]>([]);

  useEffect(() => {
    setFilteredStocks(stocks);
  }, [stocks]);

  const handleSearch = useCallback(
    debounce((term: string) => {
      if (!term.trim()) {
        setFilteredStocks(stocks);
        return;
      }

      const filtered = stocks.filter(stock => 
        stock.name.toLowerCase().includes(term.toLowerCase()) ||
        stock.code.includes(term)
      );
      setFilteredStocks(filtered);
    }, 300),
    [stocks]
  );

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="mb-4">
        <input
          type="text"
          placeholder="종목명 또는 종목코드로 검색"
          className="w-full px-4 py-2 border rounded-lg"
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredStocks.map((stock) => (
          <div 
            key={stock.code}
            className="p-4 border rounded-lg hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => router.push(`/stock/${stock.code}`)}
          >
            <h3 className="font-bold text-lg">{stock.name}</h3>
            <div className="mt-2 space-y-1">
              <p className="text-gray-600">종목코드: {stock.code}</p>
              <p className="text-lg font-semibold">
                현재가: {stock.last_price?.toLocaleString()}원
              </p>
              {stock.change_rate && (
                <p className={`${stock.change_rate > 0 ? 'text-red-500' : 'text-blue-500'}`}>
                  등락률: {stock.change_rate}%
                </p>
              )}
              <p className="text-sm text-gray-500">{stock.sector || '섹터 정보 없음'}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 