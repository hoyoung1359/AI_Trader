'use client'

import { useState, useEffect } from 'react'
import { KoreaInvestmentAPI } from '@/lib/korea-investment'

interface Props {
  symbol: string
}

export default function RealTimePrice({ symbol }: Props) {
  const [price, setPrice] = useState<number | null>(null)
  const [change, setChange] = useState<number | null>(null)
  const [ws, setWs] = useState<WebSocket | null>(null)

  useEffect(() => {
    const api = new KoreaInvestmentAPI()
    let websocket: WebSocket | null = null

    const subscribeToPrice = async () => {
      try {
        websocket = await api.subscribeToStockPrice(symbol, (data) => {
          setPrice(data.body.output.price)
          setChange(data.body.output.change)
        })
        setWs(websocket)
      } catch (error) {
        console.error('Failed to subscribe to price:', error)
      }
    }

    subscribeToPrice()

    return () => {
      if (websocket) {
        websocket.close()
      }
    }
  }, [symbol])

  if (!price) return <div>로딩 중...</div>

  return (
    <div>
      <div className={`text-lg font-bold ${
        change && change >= 0 ? 'text-red-600' : 'text-blue-600'
      }`}>
        {price.toLocaleString()}원
      </div>
      {change && (
        <div className={change >= 0 ? 'text-red-600' : 'text-blue-600'}>
          {change >= 0 ? '+' : ''}{change.toFixed(2)}%
        </div>
      )}
    </div>
  )
} 