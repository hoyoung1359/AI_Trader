'use client'

import { useState, useEffect, useCallback } from 'react'
import { debounce } from 'lodash'
import { Stock } from '@/types'
import { fetchStocks } from '@/services/api'
import StockList from '@/components/StockList'
import TradingPanel from '@/components/TradingPanel'
import Portfolio from '@/components/Portfolio'
import UserInfo from '@/components/UserInfo'

export default function Home() {
  const [stocks, setStocks] = useState<Stock[]>([])
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const debouncedSearch = useCallback(
    debounce(async (query: string) => {
      if (!query.trim()) {
        setStocks([])
        return
      }
      setIsLoading(true)
      try {
        const data = await fetchStocks(query)
        setStocks(data)
      } catch (error) {
        console.error('검색 실패:', error)
      } finally {
        setIsLoading(false)
      }
    }, 300),
    []
  )

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)
    debouncedSearch(query)
  }

  return (
    <div className="grid grid-cols-12 gap-6">
      {/* 왼쪽 패널 */}
      <div className="col-span-12 lg:col-span-8 space-y-6">
        {/* 사용자 정보 */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
          <UserInfo userId={1} />
        </div>

        {/* 주식 검색 */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold mb-4">주식 검색</h2>
          <div className="relative">
            <input 
              type="text" 
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="종목명을 입력하세요..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {isLoading && (
              <div className="absolute right-3 top-3">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
              </div>
            )}
          </div>
          <div className="mt-4">
            <StockList 
              stocks={stocks} 
              onSelectStock={setSelectedStock}
            />
          </div>
        </div>
      </div>

      {/* 오른쪽 패널 */}
      <div className="col-span-12 lg:col-span-4 space-y-6">
        <div className="bg-white rounded-lg shadow-sm">
          <TradingPanel stock={selectedStock} />
        </div>
      </div>
    </div>
  )
} 