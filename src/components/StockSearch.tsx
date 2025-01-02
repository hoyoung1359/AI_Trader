'use client'

import { useState, useEffect, useRef } from 'react'
import { SearchStock } from '@/types'
import { HiSearch, HiTrendingUp, HiTrendingDown } from 'react-icons/hi'
import { useDebounce } from '@/hooks/useDebounce'
import { LoadingSpinner } from './LoadingSpinner'

export default function StockSearch() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchStock[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const debouncedQuery = useDebounce<string>(query, 500)
  const searchRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!debouncedQuery) {
      setResults([])
      return
    }

    const searchStocks = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch(`/api/stocks/search?query=${encodeURIComponent(debouncedQuery)}`)
        if (!response.ok) throw new Error('Search failed')

        const data = await response.json()
        console.log('Search response:', data) // 디버깅용
        setResults(data)
      } catch (err) {
        setError('검색에 실패했습니다')
        console.error('Search error:', err)
      } finally {
        setIsLoading(false)
      }
    }

    searchStocks()
  }, [debouncedQuery])

  return (
    <div className="relative" ref={searchRef}>
      <div className="relative">
        <HiSearch className="absolute left-3 top-3 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="input-field pl-10"
          placeholder="종목명 또는 코드 검색..."
        />
      </div>

      {(isLoading || results.length > 0 || error) && (
        <div className="absolute z-10 mt-1 w-full bg-white rounded-lg shadow-xl border border-gray-200 max-h-96 overflow-y-auto">
          {isLoading && (
            <div className="p-4 text-center">
              <LoadingSpinner size="sm" />
            </div>
          )}

          {error && (
            <div className="p-4 text-center text-red-500">
              {error}
            </div>
          )}

          {results.map((stock) => (
            <div
              key={stock.symbol}
              className="p-4 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{stock.name}</h3>
                  <p className="text-sm text-gray-500">{stock.symbol}</p>
                  <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                    {stock.market}
                  </span>
                </div>
                {stock.price && (
                  <div className="text-right">
                    <p className="font-bold">{stock.price.toLocaleString()}원</p>
                    {stock.change && (
                      <div className={`flex items-center ${
                        stock.change >= 0 ? 'text-red-600' : 'text-blue-600'
                      }`}>
                        {stock.change >= 0 ? (
                          <HiTrendingUp className="w-4 h-4" />
                        ) : (
                          <HiTrendingDown className="w-4 h-4" />
                        )}
                        <span className="ml-1">{Math.abs(stock.change).toFixed(2)}%</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
} 