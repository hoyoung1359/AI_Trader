'use client'

import ClientProvider from '@/app/ClientProvider'
import StockDetail from './StockDetail'

export default function StockDetailWrapper({ code }: { code: string }) {
  return (
    <ClientProvider>
      <StockDetail code={code} />
    </ClientProvider>
  )
} 