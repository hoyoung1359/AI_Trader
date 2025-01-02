'use client'

import { useState, useEffect } from 'react'
import { Portfolio, PortfolioSummary } from '@/types'
import { HiTrendingUp, HiTrendingDown } from 'react-icons/hi'

export default function PortfolioPage() {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([])
  const [summary, setSummary] = useState<PortfolioSummary | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchPortfolio()
  }, [])

  const fetchPortfolio = async () => {
    try {
      const response = await fetch('/api/portfolio')
      const data = await response.json()

      if (!response.ok) throw new Error(data.error)

      setPortfolios(data.portfolios)
      setSummary(data.summary)
    } catch (err) {
      setError('포트폴리오를 불러오는데 실패했습니다.')
      console.error('Portfolio fetch error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="loading-spinner border-blue-500" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <div className="text-red-500 mb-4">{error}</div>
        <button
          onClick={fetchPortfolio}
          className="btn-primary max-w-xs"
        >
          다시 시도
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* 포트폴리오 요약 */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="card p-6">
            <h3 className="text-sm font-medium text-gray-500">총 투자금액</h3>
            <p className="text-2xl font-bold mt-2">
              {summary.total_investment.toLocaleString()}원
            </p>
          </div>
          <div className="card p-6">
            <h3 className="text-sm font-medium text-gray-500">현재 평가금액</h3>
            <p className="text-2xl font-bold mt-2">
              {summary.total_current_value.toLocaleString()}원
            </p>
          </div>
          <div className="card p-6">
            <h3 className="text-sm font-medium text-gray-500">총 손익</h3>
            <p className={`text-2xl font-bold mt-2 ${
              summary.total_profit_loss >= 0 ? 'text-red-600' : 'text-blue-600'
            }`}>
              {summary.total_profit_loss.toLocaleString()}원
            </p>
          </div>
          <div className="card p-6">
            <h3 className="text-sm font-medium text-gray-500">수익률</h3>
            <p className={`text-2xl font-bold mt-2 flex items-center ${
              summary.total_profit_loss_percentage >= 0 ? 'text-red-600' : 'text-blue-600'
            }`}>
              {summary.total_profit_loss_percentage >= 0 ? (
                <HiTrendingUp className="mr-1" />
              ) : (
                <HiTrendingDown className="mr-1" />
              )}
              {summary.total_profit_loss_percentage.toFixed(2)}%
            </p>
          </div>
        </div>
      )}

      {/* 포트폴리오 목록 */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                종목
              </th>
              <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                보유수량
              </th>
              <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                평균단가
              </th>
              <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                현재가
              </th>
              <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                평가금액
              </th>
              <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                손익
              </th>
              <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                수익률
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {portfolios.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium text-gray-900">{item.name}</div>
                  <div className="text-sm text-gray-500">{item.symbol}</div>
                </td>
                <td className="px-6 py-4 text-right whitespace-nowrap">
                  {item.quantity.toLocaleString()}주
                </td>
                <td className="px-6 py-4 text-right whitespace-nowrap">
                  {item.average_price.toLocaleString()}원
                </td>
                <td className="px-6 py-4 text-right whitespace-nowrap">
                  {item.current_price?.toLocaleString() ?? '-'}원
                </td>
                <td className="px-6 py-4 text-right whitespace-nowrap">
                  {item.total_value?.toLocaleString() ?? '-'}원
                </td>
                <td className="px-6 py-4 text-right whitespace-nowrap">
                  <span className={
                    item.profit_loss && item.profit_loss >= 0 ? 'text-red-600' : 'text-blue-600'
                  }>
                    {item.profit_loss?.toLocaleString() ?? '-'}원
                  </span>
                </td>
                <td className="px-6 py-4 text-right whitespace-nowrap">
                  <span className={`flex items-center justify-end ${
                    item.profit_loss_percentage && item.profit_loss_percentage >= 0 
                      ? 'text-red-600' 
                      : 'text-blue-600'
                  }`}>
                    {item.profit_loss_percentage ? (
                      <>
                        {item.profit_loss_percentage >= 0 ? (
                          <HiTrendingUp className="mr-1" />
                        ) : (
                          <HiTrendingDown className="mr-1" />
                        )}
                        {item.profit_loss_percentage.toFixed(2)}%
                      </>
                    ) : '-'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
} 