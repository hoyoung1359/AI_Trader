'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { supabase } from '@/utils/supabase-client'
import { StockItem } from '@/types/stock'

interface StockContextType {
  stocks: StockItem[]
  loading: boolean
  error: string | null
  fetchStocks: () => Promise<void>
}

const StockContext = createContext<StockContextType | null>(null)

export function StockProvider({ children }: { children: ReactNode }) {
  const [stocks, setStocks] = useState<StockItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStocks = async () => {
    try {
      const { data, error } = await supabase
        .from('stocks')
        .select('*')
      
      if (error) throw error
      setStocks(data || [])
    } catch (error) {
      console.error('데이터 불러오기 실패:', error)
      setError('주식 데이터를 불러오는데 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStocks()
  }, [])

  return (
    <StockContext.Provider value={{ stocks, loading, error, fetchStocks }}>
      {children}
    </StockContext.Provider>
  )
}

export function useStock() {
  const context = useContext(StockContext)
  if (!context) {
    throw new Error('useStock must be used within a StockProvider')
  }
  return context
} 