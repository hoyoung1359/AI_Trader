'use client'

import { useState, useEffect, useCallback } from 'react'
import { debounce } from 'lodash'
import { Stock } from '@/types'
import { fetchStocks } from '@/services/api'
import StockList from '@/components/StockList'
import TradingPanel from '@/components/TradingPanel'
import Portfolio from '@/components/Portfolio'
import TransactionHistory from '@/components/TransactionHistory'
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
    <div className="space-y-4">
      <UserInfo userId={1} />
      <Portfolio userId={1} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border rounded p-4">
          <h2 className="text-xl font-bold mb-4">주식 검색</h2>
          <div className="mb-4">
            <input 
              type="text" 
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="종목 검색..."
              className="w-full p-2 border rounded"
            />
          </div>
          {isLoading ? (
            <div className="text-center py-4">검색 중...</div>
          ) : (
            <StockList 
              stocks={stocks} 
              onSelectStock={setSelectedStock}
            />
          )}
        </div>

        <div className="border rounded p-4">
          <h2 className="text-xl font-bold mb-4">가상 매매</h2>
          <TradingPanel stock={selectedStock} />
        </div>
      </div>

      <TransactionHistory userId={1} />
    </div>
  )
} 