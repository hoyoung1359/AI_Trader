'use client'

import { ReactNode } from 'react'
import dynamic from 'next/dynamic'
import LoadingSpinner from './LoadingSpinner'

const DynamicStockProvider = dynamic(
  () => import('@/contexts/StockContext').then(mod => mod.StockProvider),
  {
    ssr: false,
    loading: () => <LoadingSpinner />
  }
)

export default function ClientWrapper({ children }: { children: ReactNode }) {
  return <DynamicStockProvider>{children}</DynamicStockProvider>
} 