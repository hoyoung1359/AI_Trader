'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase-client';
import { StockItem } from '@/types/stock';
import debounce from 'lodash/debounce';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import dynamic from 'next/dynamic';

function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div className="text-center p-4">
      <h2 className="text-red-500 font-bold mb-4">문제가 발생했습니다</h2>
      <pre className="text-sm mb-4">{error.message}</pre>
      <button
        onClick={resetErrorBoundary}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        다시 시도
      </button>
    </div>
  );
}

const StockSearchContent = () => {
  'use client';
  
  const [stocks, setStocks] = useState<StockItem[]>([]);
  const [filteredStocks, setFilteredStocks] = useState<StockItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStocks();
  }, []);

  const fetchStocks = async () => {
    try {
      const { data, error } = await supabase
        .from('stocks')
        .select('*');
      
      if (error) throw error;
      setStocks(data || []);
      setFilteredStocks(data || []);
    } catch (error) {
      console.error('데이터 불러오기 실패:', error);
      setError('주식 데이터를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = debounce((term: string) => {
    setSearchTerm(term);
    if (!term.trim()) {
      setFilteredStocks(stocks);
      return;
    }

    const filtered = stocks.filter(stock => 
      stock.name.toLowerCase().includes(term.toLowerCase()) ||
      stock.code.includes(term)
    );
    setFilteredStocks(filtered);
  }, 300);

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

      {error && (
        <div className="text-red-500 mb-4">{error}</div>
      )}

      {loading ? (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredStocks.map((stock) => (
            <div 
              key={stock.code}
              className="p-4 border rounded-lg hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => console.log('Selected stock:', stock)}
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
      )}
    </div>
  );
};

const StockSearchWithNoSSR = dynamic(() => Promise.resolve(StockSearchContent), {
  ssr: false
});

export default function StockSearch() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <StockSearchWithNoSSR />
    </ErrorBoundary>
  );
} 