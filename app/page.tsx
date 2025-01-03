'use client'

import StockSearch from '@/components/StockSearch'

export default function Home() {
  return (
    <main className="container mx-auto px-4">
      <div className="max-w-4xl mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">코스피 종목 검색</h1>
        <StockSearch />
      </div>
    </main>
  )
} 