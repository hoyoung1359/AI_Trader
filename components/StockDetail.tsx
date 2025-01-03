'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/utils/supabase-client'
import { StockItem } from '@/types/stock'

export default function StockDetail({ code }: { code: string }) {
  const [stock, setStock] = useState<StockItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchStockDetail() {
      try {
        const { data, error } = await supabase
          .from('stocks')
          .select('*')
          .eq('code', code)
          .single()

        if (error) throw error
        setStock(data)
      } catch (error) {
        console.error('상세 정보 로드 실패:', error)
        setError('주식 정보를 불러오는데 실패했습니다.')
      } finally {
        setLoading(false)
      }
    }

    fetchStockDetail()
  }, [code])

  if (loading) return <div>로딩 중...</div>
  if (error) return <div className="text-red-500">{error}</div>
  if (!stock) return <div>종목을 찾을 수 없습니다.</div>

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-4">{stock.name}</h1>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h2 className="text-xl font-semibold mb-2">기본 정보</h2>
          <p>종목코드: {stock.code}</p>
          <p>섹터: {stock.sector || '정보 없음'}</p>
          <p>시장: {stock.market}</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">가격 정보</h2>
          <p>현재가: {stock.last_price?.toLocaleString()}원</p>
          <p className={`${stock.change_rate && stock.change_rate > 0 ? 'text-red-500' : 'text-blue-500'}`}>
            등락률: {stock.change_rate}%
          </p>
          {stock.trading_volume && (
            <p>거래량: {stock.trading_volume.toLocaleString()}</p>
          )}
        </div>
      </div>
    </div>
  )
} 