'use client'

import { useEffect, useState } from 'react'
import { PortfolioSummary, Transaction } from '@/types'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { HiTrendingUp, HiTrendingDown } from 'react-icons/hi'

export default function PortfolioPage() {
  const [summary, setSummary] = useState<PortfolioSummary | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPortfolioData = async () => {
      try {
        const [summaryRes, transactionsRes] = await Promise.all([
          fetch('/api/portfolio/summary'),
          fetch('/api/portfolio/transactions')
        ])

        if (!summaryRes.ok || !transactionsRes.ok) {
          throw new Error('Failed to fetch portfolio data')
        }

        const summaryData = await summaryRes.json()
        const transactionsData = await transactionsRes.json()

        setSummary(summaryData)
        setTransactions(transactionsData)
      } catch (err) {
        setError('포트폴리오 데이터를 불러오는데 실패했습니다.')
        console.error('Portfolio fetch error:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPortfolioData()
  }, [])

  if (isLoading) return <LoadingSpinner fullScreen />
  if (error) return <div className="text-red-500">{error}</div>
  if (!summary) return null

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">내 포트폴리오</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="card p-6">
          <h3 className="text-sm font-medium text-gray-500">보유 현금</h3>
          <p className="text-2xl font-bold mt-2">
            {summary.cash.toLocaleString()}원
          </p>
        </div>
        
        <div className="card p-6">
          <h3 className="text-sm font-medium text-gray-500">총 투자금액</h3>
          <p className="text-2xl font-bold mt-2">
            {summary.totalInvestment.toLocaleString()}원
          </p>
        </div>

        <div className="card p-6">
          <h3 className="text-sm font-medium text-gray-500">총 평가금액</h3>
          <p className="text-2xl font-bold mt-2">
            {summary.totalValue.toLocaleString()}원
          </p>
        </div>

        <div className="card p-6">
          <h3 className="text-sm font-medium text-gray-500">총 손익</h3>
          <div className={`flex items-center ${
            summary.totalProfitLoss >= 0 ? 'text-red-600' : 'text-blue-600'
          }`}>
            <p className="text-2xl font-bold mt-2">
              {summary.totalProfitLoss.toLocaleString()}원
            </p>
            <div className="ml-2 flex items-center">
              {summary.totalProfitLoss >= 0 ? (
                <HiTrendingUp className="w-5 h-5" />
              ) : (
                <HiTrendingDown className="w-5 h-5" />
              )}
              <span className="ml-1">
                {Math.abs(summary.profitLossPercentage).toFixed(2)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-4">최근 거래내역</h2>
      <div className="overflow-x-auto">
        <table className="transactions-table">
          <thead>
            <tr>
              <th>날짜</th>
              <th>종목</th>
              <th>거래유형</th>
              <th>수량</th>
              <th>가격</th>
              <th>총액</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction.id}>
                <td>{new Date(transaction.timestamp).toLocaleDateString()}</td>
                <td>{transaction.symbol}</td>
                <td className={transaction.type === 'buy' ? 'text-red-600' : 'text-blue-600'}>
                  {transaction.type === 'buy' ? '매수' : '매도'}
                </td>
                <td>{transaction.shares.toLocaleString()}</td>
                <td>{transaction.price.toLocaleString()}원</td>
                <td>{transaction.total.toLocaleString()}원</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
} 