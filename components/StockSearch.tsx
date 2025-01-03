'use client';

import { useState, useCallback } from 'react';
import { searchStocks } from '@/utils/koreaInvestment';
import { StockItem } from '@/types/stock';
import debounce from 'lodash/debounce';

export default function StockSearch() {
  const [keyword, setKeyword] = useState('');
  const [stocks, setStocks] = useState<StockItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const debouncedSearch = useCallback(
    debounce(async (searchKeyword: string) => {
      if (!searchKeyword) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const response = await searchStocks(searchKeyword);
        if (response.rt_cd === '0') {
          setStocks(response.output);
        } else {
          setError(response.msg1);
        }
      } catch (error) {
        setError('검색 중 오류가 발생했습니다.');
        console.error('검색 오류:', error);
      } finally {
        setLoading(false);
      }
    }, 500),
    []
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setKeyword(value);
    debouncedSearch(value);
  };

  return (
    <div className="p-4">
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={keyword}
          onChange={handleInputChange}
          placeholder="종목명을 입력하세요"
          className="px-4 py-2 border rounded flex-1"
        />
      </div>

      {error && (
        <div className="text-red-500 mb-4">{error}</div>
      )}

      {loading ? (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {stocks.map((stock) => (
            <div key={stock.종목코드} className="p-4 border rounded hover:shadow-lg transition-shadow">
              <h3 className="font-bold text-lg">{stock.종목명}</h3>
              <div className="mt-2 space-y-1">
                <p className="text-gray-600">종목코드: {stock.종목코드}</p>
                <p className="text-lg font-semibold">
                  현재가: {stock.현재가.toLocaleString()}원
                </p>
                <p className={`${stock.등락률 > 0 ? 'text-red-500' : 'text-blue-500'}`}>
                  등락률: {stock.등락률}%
                </p>
                <p>거래량: {stock.거래량.toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 