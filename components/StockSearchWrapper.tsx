'use client'

import { Suspense } from 'react'
import dynamic from 'next/dynamic'

const StockSearchPage = dynamic(() => import('./StockSearchPage'), {
  loading: () => (
    <div className="flex justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
    </div>
  )
})

export default function StockSearchWrapper() {
  return (
    <Suspense fallback={
      <div className="flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    }>
      <StockSearchPage />
    </Suspense>
  )
} 