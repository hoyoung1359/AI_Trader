'use client'

import { useState, useEffect } from 'react'
import { SearchStock, Stock } from '@/types'
import { HiSearch, HiTrendingUp, HiTrendingDown } from 'react-icons/hi'
import { useDebounce } from '@/hooks/useDebounce'
import { convertToStock } from '@/utils/stockUtils'

interface StockSearchProps {
  onSelectStock: (stock: Stock) => void
  className?: string
}

export default function StockSearch({ onSelectStock, className = '' }: StockSearchProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchStock[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const debouncedQuery = useDebounce(query, 500)

  useEffect(() => {
    if (!debouncedQuery) {
      setResults([])
      return
    }

    const searchStocks = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`/api/stocks/search?query=${encodeURIComponent(debouncedQuery)}`)
        const data = await response.json()
        setResults(data)
      } catch (error) {
        console.error('Search error:', error)
      } finally {
        setIsLoading(false)
      }
    }

    searchStocks()
  }, [debouncedQuery])

  return (
    <div className={`w-full ${className}`}>
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full p-3 border rounded-lg"
          placeholder="종목명 또는 코드를 입력하세요"
        />
        {isLoading && (
          <div className="absolute right-3 top-3">
            <div className="animate-spin h-5 w-5 border-2 border-blue-500 rounded-full border-t-transparent" />
          </div>
        )}
      </div>

      {results.length > 0 && (
        <div className="mt-2 bg-white rounded-lg shadow-lg border max-h-96 overflow-y-auto">
          {results.map((searchStock) => (
            <div
              key={searchStock.symbol}
              className="p-4 hover:bg-gray-50 cursor-pointer border-b"
              onClick={() => onSelectStock(convertToStock(searchStock))}
            >
              <div className="flex justify-between">
                <div>
                  <h3 className="font-medium">{searchStock.name}</h3>
                  <p className="text-sm text-gray-500">{searchStock.symbol}</p>
                </div>
                {searchStock.price && (
                  <div className="text-right">
                    <p className="font-bold">{searchStock.price.toLocaleString()}원</p>
                    <div className={`flex items-center ${
                      searchStock.change && searchStock.change >= 0 ? 'text-red-600' : 'text-blue-600'
                    }`}>
                      {searchStock.change && searchStock.change >= 0 ? (
                        <HiTrendingUp className="mr-1" />
                      ) : (
                        <HiTrendingDown className="mr-1" />
                      )}
                      <span>{searchStock.change?.toFixed(2)}%</span>
                    </div>
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