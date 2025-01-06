'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MAJOR_STOCKS } from '@/lib/korea-investment/client';

export default function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  const filteredStocks = MAJOR_STOCKS.filter(stock => 
    stock.name.includes(searchTerm) || stock.code.includes(searchTerm)
  );

  const handleStockSelect = (code: string, name: string) => {
    router.push(`/stocks/${code}`);
    setIsSearchOpen(false);
    setSearchTerm('');
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              AI Trader Pro
            </span>
          </div>

          {/* 종목 검색 */}
          <div className="flex-1 max-w-2xl mx-8 relative">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setIsSearchOpen(true);
                }}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="종목명 또는 코드 검색..."
              />
              {isSearchOpen && searchTerm && (
                <div className="absolute w-full mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border dark:border-gray-700 max-h-96 overflow-y-auto">
                  {filteredStocks.map(stock => (
                    <button
                      key={stock.code}
                      onClick={() => handleStockSelect(stock.code, stock.name)}
                      className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{stock.name}</span>
                        <span className="text-sm text-gray-500">{stock.code}</span>
                      </div>
                      <div className="text-sm text-gray-500">{stock.sector}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
              포트폴리오
            </button>
            <button className="text-gray-600 dark:text-gray-300 hover:text-blue-500">
              설정
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
} 