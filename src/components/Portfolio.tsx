'use client'

import { useEffect, useState } from 'react'
import { fetchPortfolio } from '@/services/api'
import PortfolioAnalysis from './PortfolioAnalysis'

interface PortfolioProps {
  userId: number
}

export default function Portfolio({ userId }: PortfolioProps) {
  const [portfolio, setPortfolio] = useState([])

  useEffect(() => {
    loadPortfolio()
  }, [userId])

  const loadPortfolio = async () => {
    try {
      const data = await fetchPortfolio(userId)
      setPortfolio(data)
    } catch (error) {
      console.error('포트폴리오 로딩 실패:', error)
    }
  }

  return (
    <div className="space-y-6">
      <PortfolioAnalysis userId={userId} />
      
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-bold mb-6">보유 종목</h2>
        {portfolio.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            보유 중인 종목이 없습니다.
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {portfolio.map((item: any) => (
              <div key={item.symbol} className="py-4 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">{item.stock_master.name}</h3>
                  <p className="text-sm text-gray-500">{item.symbol}</p>
                </div>
                <div className="text-right">
                  <div className="font-medium">{item.quantity.toLocaleString()}주</div>
                  <div className="text-sm text-gray-500">
                    평단가: {item.average_price.toLocaleString()}원
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 