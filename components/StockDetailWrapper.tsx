'use client'

import { Suspense } from 'react'
import dynamic from 'next/dynamic'

const StockDetailPage = dynamic(() => import('./StockDetailPage'), {
  loading: () => (
    <div className="flex justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
    </div>
  )
})

export default function StockDetailWrapper({ code }: { code: string }) {
  return (
    <Suspense fallback={
      <div className="flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    }>
      <StockDetailPage code={code} />
    </Suspense>
  )
} 