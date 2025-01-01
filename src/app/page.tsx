'use client'

import { useState, useEffect } from 'react'
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

  useEffect(() => {
    const searchStocks = async () => {
      const data = await fetchStocks(searchQuery)
      setStocks(data)
    }
    searchStocks()
  }, [searchQuery])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const userId = 1;

  return (
    <div className="space-y-4">
      <UserInfo userId={userId} />
      <Portfolio userId={userId} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border rounded p-4">
          <h2 className="text-xl font-bold mb-4">주식 검색</h2>
          <div className="mb-4">
            <input 
              type="text" 
              value={searchQuery}
              onChange={handleSearch}
              placeholder="종목 검색..."
              className="w-full p-2 border rounded"
            />
          </div>
          <StockList stocks={stocks} onSelectStock={setSelectedStock} />
        </div>

        <div className="border rounded p-4">
          <h2 className="text-xl font-bold mb-4">가상 매매</h2>
          <TradingPanel stock={selectedStock} />
        </div>
      </div>

      <TransactionHistory userId={userId} />
    </div>
  )
} 