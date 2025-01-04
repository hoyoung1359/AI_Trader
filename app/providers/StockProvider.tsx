'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { supabase } from '@/utils/supabase-client'
import { StockItem } from '@/types/stock'

interface StockContextType {
  stocks: StockItem[]
  loading: boolean
  error: string | null
}

const StockContext = createContext<StockContextType>({
  stocks: [],
  loading: true,
  error: null
})

export function StockProvider({ children }: { children: ReactNode }) {
  const [stocks, setStocks] = useState<StockItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true

    const fetchStocks = async () => {
      try {
        const { data, error } = await supabase.from('stocks').select('*')
        if (!mounted) return
        if (error) throw error
        setStocks(data || [])
      } catch (error) {
        if (!mounted) return
        console.error('Failed to load stocks:', error)
        setError('주식 데이터를 불러오는데 실패했습니다.')
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    fetchStocks()
    return () => { mounted = false }
  }, [])

  return (
    <StockContext.Provider value={{ stocks, loading, error }}>
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