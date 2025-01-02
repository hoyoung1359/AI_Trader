'use client'

import { useEffect, useState } from 'react'
import { KoreaInvestmentAPI } from '@/lib/korea-investment'

interface Props {
  symbol: string
}

export default function RealTimePrice({ symbol }: Props) {
  const [price, setPrice] = useState<number>(0)
  const [change, setChange] = useState<number>(0)
  const [volume, setVolume] = useState<number>(0)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let websocket: WebSocket | null = null
    const api = new KoreaInvestmentAPI()

    const subscribeToPrice = async () => {
      try {
        websocket = await api.subscribeToStockPrice(symbol, (data) => {
          setPrice(data.body.output.price)
          setChange(data.body.output.change)
          setVolume(data.body.output.volume)
        })
      } catch (err) {
        setError('실시간 가격 정보를 불러오는데 실패했습니다.')
        console.error('Real-time price error:', err)
      }
    }

    subscribeToPrice()

    return () => {
      if (websocket) {
        websocket.close()
      }
    }
  }, [symbol])

  if (error) return <div className="text-red-500 text-sm">{error}</div>

  return (
    <div className="space-y-2">
      <div className="text-2xl font-bold">
        {price.toLocaleString()}원
      </div>
      <div className={`flex items-center ${
        change >= 0 ? 'text-red-600' : 'text-blue-600'
      }`}>
        {change >= 0 ? '▲' : '▼'} {Math.abs(change).toFixed(2)}%
      </div>
      <div className="text-sm text-gray-500">
        거래량: {volume.toLocaleString()}
      </div>
    </div>
  )
} 