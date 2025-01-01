import { useEffect, useState } from 'react'
import { fetchPortfolio } from '@/services/api'

interface PortfolioSummary {
  totalValue: number
  totalProfit: number
  profitPercent: number
  sectorDistribution: {
    [sector: string]: {
      value: number
      percent: number
    }
  }
}

interface PortfolioAnalysisProps {
  userId: number
}

export default function PortfolioAnalysis({ userId }: PortfolioAnalysisProps) {
  const [summary, setSummary] = useState<PortfolioSummary | null>(null)

  useEffect(() => {
    loadPortfolioSummary()
  }, [userId])

  const loadPortfolioSummary = async () => {
    try {
      const portfolio = await fetchPortfolio(userId)
      
      // 포트폴리오 요약 계산
      const totalValue = portfolio.reduce((sum, item) => 
        sum + (item.quantity * item.current_price), 0
      )

      const totalProfit = portfolio.reduce((sum, item) => 
        sum + ((item.current_price - item.average_price) * item.quantity), 0
      )

      const profitPercent = (totalProfit / (totalValue - totalProfit)) * 100

      // 섹터별 분포 계산
      const sectorDistribution = portfolio.reduce((acc, item) => {
        const sector = item.stock_master.sector
        const value = item.quantity * item.current_price
        
        if (!acc[sector]) {
          acc[sector] = { value: 0, percent: 0 }
        }
        acc[sector].value += value
        return acc
      }, {} as PortfolioSummary['sectorDistribution'])

      // 섹터별 비중 계산
      Object.values(sectorDistribution).forEach(sector => {
        sector.percent = (sector.value / totalValue) * 100
      })

      setSummary({
        totalValue,
        totalProfit,
        profitPercent,
        sectorDistribution
      })
    } catch (error) {
      console.error('포트폴리오 분석 실패:', error)
    }
  }

  if (!summary) return <div>로딩 중...</div>

  return (
    <div className="border rounded p-4 space-y-4">
      <h2 className="text-xl font-bold">포트폴리오 분석</h2>
      
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 bg-gray-50 rounded">
          <div className="text-gray-600">총 평가금액</div>
          <div className="text-xl font-bold">
            {summary.totalValue.toLocaleString()}원
          </div>
        </div>
        
        <div className="p-4 bg-gray-50 rounded">
          <div className="text-gray-600">총 손익</div>
          <div className={`text-xl font-bold ${
            summary.totalProfit >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {summary.totalProfit.toLocaleString()}원
          </div>
        </div>

        <div className="p-4 bg-gray-50 rounded">
          <div className="text-gray-600">수익률</div>
          <div className={`text-xl font-bold ${
            summary.profitPercent >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {summary.profitPercent.toFixed(2)}%
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">섹터별 분포</h3>
        <div className="space-y-2">
          {Object.entries(summary.sectorDistribution).map(([sector, data]) => (
            <div key={sector} className="flex justify-between items-center">
              <div className="flex-1">
                <div className="text-sm text-gray-600">{sector}</div>
                <div className="h-2 bg-gray-200 rounded">
                  <div 
                    className="h-full bg-blue-500 rounded"
                    style={{ width: `${data.percent}%` }}
                  />
                </div>
              </div>
              <div className="ml-4 text-sm">
                {data.percent.toFixed(1)}%
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 