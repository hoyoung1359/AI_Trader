'use client'

import { useEffect, useState } from 'react'
import { Stock } from '@/types'
import { HiTrendingUp, HiTrendingDown } from 'react-icons/hi'

interface Props {
  symbol: string
}

export default function StockDetail({ symbol }: Props) {
  const [stock, setStock] = useState<Stock | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStockDetail = async () => {
      try {
        const response = await fetch(`/api/stocks/${symbol}`)
        const data = await response.json()

        if (!response.ok) throw new Error(data.error)

        setStock(data)
      } catch (err) {
        setError('주식 정보를 불러오는데 실패했습니다.')
        console.error('Stock detail error:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStockDetail()
  }, [symbol])

  if (isLoading) return <div className="loading-spinner" />
  if (error) return <div className="text-red-500">{error}</div>
  if (!stock) return null

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h1 className="text-2xl font-bold">{stock.name}</h1>
          <p className="text-gray-500">{stock.symbol}</p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold">
            {stock.price?.toLocaleString()}원
          </div>
          {stock.change && (
            <div className={`flex items-center justify-end ${
              stock.change >= 0 ? 'text-red-600' : 'text-blue-600'
            }`}>
              {stock.change >= 0 ? (
                <HiTrendingUp className="mr-1" />
              ) : (
                <HiTrendingDown className="mr-1" />
              )}
              {stock.change.toFixed(2)}%
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="text-sm text-gray-500">거래량</div>
          <div className="text-lg font-medium">
            {stock.volume?.toLocaleString()}
          </div>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="text-sm text-gray-500">시가총액</div>
          <div className="text-lg font-medium">
            {/* 시가총액 정보 추가 필요 */}
            -
          </div>
        </div>
      </div>
    </div>
  )
} 