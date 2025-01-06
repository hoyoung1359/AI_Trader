'use client';

import { useState, useEffect } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import { MAJOR_STOCKS } from '@/lib/korea-investment/client';

interface StockSearchProps {
  onSearch: (code: string) => void;
}

interface StockInfo {
  code: string;
  name: string;
  sector: string;
}

export default function StockSearch({ onSearch }: StockSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredStocks, setFilteredStocks] = useState<StockInfo[]>(MAJOR_STOCKS);
  
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // 검색어에 따른 필터링
  useEffect(() => {
    if (!debouncedSearchTerm) {
      setFilteredStocks(MAJOR_STOCKS);
      return;
    }

    const filtered = MAJOR_STOCKS.filter(
      stock =>
        stock.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        stock.code.includes(debouncedSearchTerm) ||
        stock.sector.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );
    setFilteredStocks(filtered);
  }, [debouncedSearchTerm]);

  return (
    <div className="mb-6">
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="종목명, 코드 또는 섹터로 검색"
          className="px-4 py-2 border rounded-lg flex-1"
        />
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
        {filteredStocks.map((stock) => (
          <button
            key={stock.code}
            onClick={() => {
              setSearchTerm(stock.name);
              onSearch(stock.code);
            }}
            className="p-2 text-sm bg-gray-100 rounded-lg hover:bg-gray-200 text-left"
          >
            <div className="font-semibold">{stock.name}</div>
            <div className="text-xs text-gray-600">
              {stock.code} | {stock.sector}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
} 