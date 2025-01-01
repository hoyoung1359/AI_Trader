import { useEffect, useState } from 'react'
import { fetchPortfolio } from '@/services/api'

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
      const data = await fetchPortfolio()
      setPortfolio(data)
    } catch (error) {
      console.error('포트폴리오 로딩 실패:', error)
    }
  }

  return (
    <div className="border rounded p-4">
      <h2 className="text-xl font-bold mb-4">보유 종목</h2>
      {/* 포트폴리오 내용 */}
    </div>
  )
} 