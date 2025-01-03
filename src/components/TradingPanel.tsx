'use client'

import { useState } from 'react'
import { Stock } from '@/types'
import { useAuth } from '@/contexts/AuthContext'

interface TradingPanelProps {
  stock: Stock | null
}

export default function TradingPanel({ stock }: TradingPanelProps) {
  const [quantity, setQuantity] = useState<number>(0)
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useAuth()

  const handleTrade = async (type: 'buy' | 'sell') => {
    if (!stock || !user) return

    setIsLoading(true)
    try {
      const response = await fetch('/api/trade', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          symbol: stock.symbol,
          quantity,
          type,
          price: stock.price
        }),
      })

      if (!response.ok) {
        throw new Error('거래 실패')
      }

      alert(`${type === 'buy' ? '매수' : '매도'} 완료!`)
      setQuantity(0)
    } catch (error) {
      alert('거래 처리 중 오류가 발생했습니다.')
      console.error('Trade error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!stock) {
    return (
      <div className="p-4 text-center text-gray-500">
        거래할 종목을 선택해주세요
      </div>
    )
  }

  return (
    <div className="p-4 border rounded-lg">
      <h2 className="text-xl font-bold mb-4">{stock.name}</h2>
      <div className="mb-4">
        <p className="text-2xl font-bold">{stock.price?.toLocaleString()}원</p>
        <p className={`${stock.change && stock.change >= 0 ? 'text-red-600' : 'text-blue-600'}`}>
          {stock.change}%
        </p>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">주문수량</label>
        <input
          type="number"
          min="1"
          value={quantity}
          onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 0))}
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => handleTrade('buy')}
          disabled={isLoading}
          className="p-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
        >
          매수
        </button>
        <button
          onClick={() => handleTrade('sell')}
          disabled={isLoading}
          className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          매도
        </button>
      </div>

      {quantity > 0 && stock.price && (
        <div className="mt-4 text-right">
          <p className="text-sm text-gray-600">주문총액</p>
          <p className="text-lg font-bold">{(quantity * stock.price).toLocaleString()}원</p>
        </div>
      )}
    </div>
  )
} 