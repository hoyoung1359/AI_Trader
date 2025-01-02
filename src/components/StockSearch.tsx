'use client'

import { useState, useCallback } from 'react'
import { useDebounce } from '@/hooks/useDebounce'
import { SearchStock } from '@/types'
import { HiOutlineSearch, HiOutlineExclamationCircle } from 'react-icons/hi'
import Link from 'next/link'

export default function StockSearch() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchStock[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedStock, setSelectedStock] = useState<SearchStock | null>(null)

  const searchStocks = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([])
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/stocks?query=${encodeURIComponent(searchQuery)}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to search stocks')
      }

      setResults(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Search error:', err)
      setError('주식 검색에 실패했습니다.')
      setResults([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  const debouncedSearch = useDebounce(searchStocks, 300)

  const handleStockSelect = (stock: SearchStock) => {
    setSelectedStock(stock)
    setQuery(stock.name)
    setResults([])
  }

  return (
    <div className="relative w-full max-w-md">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <HiOutlineSearch className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setSelectedStock(null)
            debouncedSearch(e.target.value)
          }}
          placeholder="종목명 또는 종목코드 검색..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {isLoading && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <div className="loading-spinner" />
          </div>
        )}
      </div>

      {error && (
        <div className="mt-2 flex items-center text-sm text-red-500">
          <HiOutlineExclamationCircle className="h-5 w-5 mr-1" />
          {error}
        </div>
      )}

      {results.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto">
          {results.map((stock) => (
            <Link
              key={stock.symbol}
              href={`/stocks/${stock.symbol}`}
              className="block px-4 py-2 hover:bg-gray-50 cursor-pointer"
              onClick={() => handleStockSelect(stock)}
            >
              <div className="font-medium">{stock.name}</div>
              <div className="text-sm text-gray-500">
                {stock.symbol} • {stock.market}
                {stock.sector && ` • ${stock.sector}`}
              </div>
            </Link>
          ))}
        </div>
      )}

      {results.length === 0 && query && !isLoading && !error && (
        <div className="absolute z-10 w-full mt-1 p-4 bg-white border border-gray-200 rounded-lg shadow-lg text-center text-gray-500">
          검색 결과가 없습니다
        </div>
      )}
    </div>
  )
} 