'use client'

import { useState } from 'react'
import { Stock } from '@/types'
import StockSearch from '@/components/StockSearch'
import { HiChartBar, HiCurrencyDollar, HiLightningBolt, HiTrendingUp } from 'react-icons/hi'

export default function DashboardPage() {
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null)

  const handleSelectStock = (stock: Stock) => {
    setSelectedStock(stock)
    // 추가적인 대시보드 로직 구현 가능
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-4">대시보드</h1>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center text-blue-500 mb-2">
              <HiCurrencyDollar className="text-xl" />
              <span className="ml-2">보유 현금</span>
            </div>
            <p className="text-2xl font-bold">0원</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center text-green-500 mb-2">
              <HiChartBar className="text-xl" />
              <span className="ml-2">총 자산</span>
            </div>
            <p className="text-2xl font-bold">0원</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center text-purple-500 mb-2">
              <HiTrendingUp className="text-xl" />
              <span className="ml-2">수익률</span>
            </div>
            <p className="text-2xl font-bold">0%</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center text-yellow-500 mb-2">
              <HiLightningBolt className="text-xl" />
              <span className="ml-2">거래량</span>
            </div>
            <p className="text-2xl font-bold">0건</p>
          </div>
        </div>
      </div>

      <div className="glass-card p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">종목 검색</h2>
        <StockSearch onSelectStock={handleSelectStock} />
      </div>

      {selectedStock && (
        <div className="glass-card p-6">
          <h2 className="text-xl font-bold mb-4">선택된 종목 정보</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-bold text-lg">{selectedStock.name}</h3>
              <p className="text-gray-600">{selectedStock.symbol}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">{selectedStock.price.toLocaleString()}원</p>
              <p className={`${selectedStock.change >= 0 ? 'text-red-500' : 'text-blue-500'}`}>
                {selectedStock.change >= 0 ? '+' : ''}{selectedStock.change}%
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 차트 및 분석 섹션 추가 예정 */}
    </div>
  )
} 