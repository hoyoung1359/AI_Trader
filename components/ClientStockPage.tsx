'use client'

import { StockDetail } from './StockApp'

export default function ClientStockPage({ code }: { code: string }) {
  return (
    <main className="container mx-auto px-4">
      <div className="max-w-4xl mx-auto py-8">
        <StockDetail code={code} />
      </div>
    </main>
  )
} 