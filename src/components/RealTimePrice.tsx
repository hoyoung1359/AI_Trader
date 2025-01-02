'use client'

import { useEffect, useState } from 'react'
import { KoreaInvestmentAPI } from '@/lib/korea-investment'

interface RealTimePriceProps {
  symbol: string
}

export default function RealTimePrice({ symbol }: RealTimePriceProps) {
  const [price, setPrice] = useState<number | null>(null)
  const [change, setChange] = useState<number>(0)

  useEffect(() => {
    const api = new KoreaInvestmentAPI()
    
    // 초기 가격 조회
    const fetchInitialPrice = async () => {
      try {
        const priceInfo = await api.getStockPrice(symbol)
        setPrice(priceInfo.price)
        setChange(priceInfo.change)
      } catch (error) {
        console.error('Error fetching initial price:', error)
      }
    }

    fetchInitialPrice()

    // 실시간 가격 구독
    let ws: WebSocket
    const subscribeToPrice = async () => {
      try {
        ws = await api.subscribeToStockPrice(symbol, (data) => {
          setPrice(data.body.output.price)
          setChange(data.body.output.change)
        })
      } catch (error) {
        console.error('Error subscribing to price:', error)
      }
    }

    subscribeToPrice()

    // 컴포넌트 언마운트 시 WebSocket 연결 해제
    return () => {
      if (ws) {
        ws.close()
      }
    }
  }, [symbol])

  if (!price) return <div>로딩 중...</div>

  return (
    <div className={`text-lg font-bold ${
      change >= 0 ? 'text-red-600' : 'text-blue-600'
    }`}>
      {price?.toLocaleString() ?? '-'}원
      <span className="text-sm ml-2">
        {change >= 0 ? '+' : ''}{change.toFixed(2)}%
      </span>
    </div>
  )
} 