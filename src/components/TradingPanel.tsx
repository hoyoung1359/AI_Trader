import { useState } from 'react'
import { Stock, TradeRequest } from '@/types'
import { executeTrade } from '@/services/api'

interface TradingPanelProps {
  stock: Stock | null
}

export default function TradingPanel({ stock }: TradingPanelProps) {
  const [quantity, setQuantity] = useState<number>(0)

  const handleTrade = async (type: 'BUY' | 'SELL') => {
    if (!stock) return

    const tradeData: TradeRequest = {
      symbol: stock.symbol,
      quantity,
      type,
    }

    try {
      await executeTrade(1, tradeData)  // userId 1 하드코딩
      alert(`${type === 'BUY' ? '매수' : '매도'} 주문이 완료되었습니다.`)
      setQuantity(0)
    } catch (error) {
      alert('주문 처리 중 오류가 발생했습니다.')
    }
  }

  if (!stock) {
    return <p>종목을 선택해주세요</p>
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-bold">{stock.name}</h3>
        <p>현재가: {stock.price.toLocaleString()} 원</p>
      </div>
      <div>
        <input 
          type="number" 
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          placeholder="수량"
          className="w-full p-2 border rounded mb-2"
        />
        <div className="grid grid-cols-2 gap-2">
          <button 
            onClick={() => handleTrade('BUY')}
            className="bg-red-500 text-white p-2 rounded"
          >
            매수
          </button>
          <button 
            onClick={() => handleTrade('SELL')}
            className="bg-blue-500 text-white p-2 rounded"
          >
            매도
          </button>
        </div>
      </div>
    </div>
  )
} 