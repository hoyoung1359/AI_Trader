'use client'

import { useState, useCallback, useEffect } from 'react'
import { useStock } from '@/contexts/StockContext'
import { StockItem } from '@/types/stock'
import debounce from 'lodash/debounce'
import { useRouter } from 'next/navigation'
import { supabase } from '@/utils/supabase-client'

export function StockSearchContent() {
  const router = useRouter()
  const { stocks, loading, error } = useStock()
  const [filteredStocks, setFilteredStocks] = useState<StockItem[]>([])

  useEffect(() => {
    setFilteredStocks(stocks)
  }, [stocks])

  const handleSearch = useCallback(
    debounce((term: string) => {
      if (!term.trim()) {
        setFilteredStocks(stocks)
        return
      }

      const filtered = stocks.filter(stock => 
        stock.name.toLowerCase().includes(term.toLowerCase()) ||
        stock.code.includes(term)
      )
      setFilteredStocks(filtered)
    }, 300),
    [stocks]
  )

  const handleStockClick = (code: string) => {
    router.push(`/stock/${code}`)
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="mb-4">
        <input
          type="text"
          placeholder="종목명 또는 종목코드로 검색"
          className="w-full px-4 py-2 border rounded-lg"
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>

      {error && (
        <div className="text-red-500 mb-4">{error}</div>
      )}

      {loading ? (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredStocks.map((stock) => (
            <div 
              key={stock.code}
              className="p-4 border rounded-lg hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handleStockClick(stock.code)}
            >
              <h3 className="font-bold text-lg">{stock.name}</h3>
              <div className="mt-2 space-y-1">
                <p className="text-gray-600">종목코드: {stock.code}</p>
                <p className="text-lg font-semibold">
                  현재가: {stock.last_price?.toLocaleString()}원
                </p>
                {stock.change_rate && (
                  <p className={`${stock.change_rate > 0 ? 'text-red-500' : 'text-blue-500'}`}>
                    등락률: {stock.change_rate}%
                  </p>
                )}
                <p className="text-sm text-gray-500">{stock.sector || '섹터 정보 없음'}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export function StockDetail({ code }: { code: string }) {
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