'use client'

import { createContext, useContext, useState, useEffect, ReactNode, Suspense } from 'react'
import { supabase } from '@/utils/supabase-client'
import { StockItem } from '@/types/stock'
import LoadingSpinner from '@/components/LoadingSpinner'

interface StockContextType {
  stocks: StockItem[]
  loading: boolean
  error: string | null
}

const defaultState: StockContextType = {
  stocks: [],
  loading: true,
  error: null
}

const StockContext = createContext<StockContextType>(defaultState)

function StockProviderInner({ children }: { children: ReactNode }) {
  const [data, setData] = useState<StockContextType>(defaultState)

  useEffect(() => {
    let mounted = true

    async function loadStocks() {
      try {
        const { data: stocks, error } = await supabase.from('stocks').select('*')
        
        if (!mounted) return
        
        if (error) throw error

        setData({
          stocks: stocks || [],
          loading: false,
          error: null
        })
      } catch (error) {
        if (!mounted) return
        console.error('Failed to load stocks:', error)
        setData(prev => ({
          ...prev,
          loading: false,
          error: '주식 데이터를 불러오는데 실패했습니다.'
        }))
      }
    }

    loadStocks()

    return () => {
      mounted = false
    }
  }, [])

  return (
    <StockContext.Provider value={data}>
      {data.loading ? <LoadingSpinner /> : children}
    </StockContext.Provider>
  )
}

export function StockProvider({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <StockProviderInner>{children}</StockProviderInner>
    </Suspense>
  )
}

export function useStock() {
  const context = useContext(StockContext)
  if (!context) {
    throw new Error('useStock must be used within a StockProvider')
  }
  return context
} 