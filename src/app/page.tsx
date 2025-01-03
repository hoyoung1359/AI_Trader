'use client'

import { useState } from 'react'
import { Stock } from '@/types'
import StockList from '@/components/StockList'
import TradingPanel from '@/components/TradingPanel'

export default function Home() {
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null)

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <StockList onSelectStock={setSelectedStock} />
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4">거래</h2>
          <TradingPanel stock={selectedStock} />
        </div>
      </div>
    </div>
  )
} 