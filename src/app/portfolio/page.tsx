'use client'

import Portfolio from '@/components/Portfolio'
import PortfolioPerformance from '@/components/PortfolioPerformance'

export default function PortfolioPage() {
  return (
    <div className="space-y-6">
      <PortfolioPerformance userId={1} />
      <Portfolio userId={1} />
    </div>
  )
} 