'use client'

import { useState } from 'react'
import { Stock, TradeRequest } from '@/types'
import { executeTrade } from '@/services/api'
import StockChart from './StockChart'
import PriceAlert from './PriceAlert'
import AutoTrading from './AutoTrading'

interface TradingPanelProps {
  stock: Stock | null
}

export default function TradingPanel({ stock }: TradingPanelProps) {
  const [quantity, setQuantity] = useState<number>(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleTrade = async (type: 'BUY' | 'SELL') => {
    if (!stock) return
    if (quantity <= 0) {
      setError('수량을 입력해주세요')
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      const tradeData: TradeRequest = {
        symbol: stock.symbol,
        quantity,
        type,
      }

      await executeTrade(1, tradeData)
      setQuantity(0)
      alert(`${type === 'BUY' ? '매수' : '매도'} 주문이 완료되었습니다.`)
    } catch (err) {
      setError(err instanceof Error ? err.message : '주문 처리 중 오류가 발생했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  if (!stock) {
    return (
      <div className="text-center p-4 text-gray-500">
        종목을 선택해주세요
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <StockChart symbol={stock.symbol} name={stock.name} />
      
      <div className="border rounded p-4 bg-white">
        <div className="mb-4">
          <h3 className="text-lg font-bold">{stock.name}</h3>
          <div className="grid grid-cols-2 gap-4 mt-2">
            <div>
              <span className="text-gray-600">현재가</span>
              <div className={`text-xl font-bold ${
                (stock.change ?? 0) >= 0 ? 'text-red-600' : 'text-blue-600'
              }`}>
                {stock.price?.toLocaleString() ?? '-'}원
              </div>
            </div>
            <div>
              <span className="text-gray-600">등락률</span>
              <div className={`${
                (stock.change ?? 0) >= 0 ? 'text-red-600' : 'text-blue-600'
              }`}>
                {stock.change?.toFixed(2) ?? '-'}%
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
              주문수량
            </label>
            <input 
              id="quantity"
              type="number" 
              min="1"
              value={quantity}
              onChange={(e) => {
                setError(null)
                setQuantity(Math.max(0, parseInt(e.target.value) || 0))
              }}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="수량을 입력하세요"
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => handleTrade('BUY')}
              disabled={isLoading}
              className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 disabled:opacity-50"
            >
              {isLoading ? '처리중...' : '매수'}
            </button>
            <button 
              onClick={() => handleTrade('SELL')}
              disabled={isLoading}
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {isLoading ? '처리중...' : '매도'}
            </button>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-bold mb-4">가격 알림 설정</h3>
        <PriceAlert
          symbol={stock.symbol}
          currentPrice={stock.price ?? 0}
          userId={1}
        />
      </div>

      <div className="card">
        <h3 className="text-lg font-bold mb-4">자동매매 설정</h3>
        <AutoTrading
          symbol={stock.symbol}
          currentPrice={stock.price ?? 0}
          userId={1}
        />
      </div>
    </div>
  )
} 