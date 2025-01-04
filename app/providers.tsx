'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { supabase } from '@/utils/supabase'
import { StockItem } from '@/types/stock'
import LoadingSpinner from '@/components/LoadingSpinner'

// Stock Context 타입 정의
interface StockContextType {
  stocks: StockItem[]
  loading: boolean
  error: string | null
}

const initialState: StockContextType = {
  stocks: [],
  loading: true,
  error: null
}

const StockContext = createContext<StockContextType>(initialState)

export function Providers({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false)
  const [state, setState] = useState<StockContextType>(initialState)

  useEffect(() => {
    setMounted(true)
    
    let isActive = true

    const fetchStocks = async () => {
      try {
        const { data, error } = await supabase.from('stocks').select('*')
        
        if (!isActive) return
        
        if (error) throw error
        
        setState(prev => ({
          ...prev,
          stocks: data || [],
          loading: false
        }))
      } catch (error) {
        if (!isActive) return
        
        console.error('데이터 불러오기 실패:', error)
        setState(prev => ({
          ...prev,
          error: '주식 데이터를 불러오는데 실패했습니다.',
          loading: false
        }))
      }
    }

    fetchStocks()

    return () => {
      isActive = false
    }
  }, [])

  if (!mounted) {
    return <LoadingSpinner />
  }

  return (
    <StockContext.Provider value={state}>
      {children}
    </StockContext.Provider>
  )
}

// Stock Context를 사용하기 위한 훅
export function useStock() {
  const context = useContext(StockContext)
  if (!context) {
    throw new Error('useStock must be used within a StockProvider')
  }
  return context
} 