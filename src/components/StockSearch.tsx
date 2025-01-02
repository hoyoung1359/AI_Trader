'use client'

import { useState } from 'react'
import { useDebounce } from '@/hooks/useDebounce'
import { SearchStock } from '@/types'
import { HiOutlineSearch, HiOutlineExclamationCircle } from 'react-icons/hi'

export default function StockSearch() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchStock[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const debouncedSearch = useDebounce(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([])
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/stocks/search?q=${encodeURIComponent(searchQuery)}`)
      const data = await response.json()

      if (!response.ok) throw new Error(data.error)

      setResults(data)
    } catch (err) {
      console.error('Search error:', err)
      setError('주식 검색에 실패했습니다.')
    } finally {
      setIsLoading(false)
    }
  }, 300)

  return (
    <div className="relative">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <HiOutlineSearch className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
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
            <div
              key={stock.symbol}
              className="px-4 py-2 hover:bg-gray-50 cursor-pointer"
            >
              <div className="font-medium">{stock.name}</div>
              <div className="text-sm text-gray-500">{stock.symbol}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
} 