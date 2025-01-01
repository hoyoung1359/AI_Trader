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
    <div className="space-y-4">
      <PortfolioAnalysis userId={userId} />
      
      <div className="border rounded p-4">
        <h2 className="text-xl font-bold mb-4">보유 종목</h2>
        {portfolio.length === 0 ? (
          <p>보유 중인 종목이 없습니다.</p>
        ) : (
          <div className="space-y-2">
            {portfolio.map((item: any) => (
              <div key={item.symbol} className="flex justify-between p-2 border rounded">
                <div>
                  <span className="font-semibold">{item.stock_master.name}</span>
                  <span className="text-sm text-gray-500 ml-2">({item.symbol})</span>
                </div>
                <div className="text-right">
                  <div>{item.quantity}주</div>
                  <div className="text-sm text-gray-500">
                    평균단가: {item.average_price.toLocaleString()}원
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