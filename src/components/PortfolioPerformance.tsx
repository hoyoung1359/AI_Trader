'use client'

import { useEffect, useState } from 'react'
import { Line } from 'react-chartjs-2'
import type { ChartData, ChartOptions } from 'chart.js'

interface Performance {
  daily: number
  weekly: number
  monthly: number
  yearly: number
  history: {
    date: string
    value: number
    profit: number
  }[]
}

interface PortfolioPerformanceProps {
  userId: number
}

export default function PortfolioPerformance({ userId }: PortfolioPerformanceProps) {
  const [performance, setPerformance] = useState<Performance | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchPerformance()
  }, [userId])

  const fetchPerformance = async () => {
    try {
      const response = await fetch(`/api/portfolio/performance?userId=${userId}`)
      if (!response.ok) throw new Error('Failed to fetch performance data')
      const data = await response.json()
      setPerformance(data)
    } catch (error) {
      console.error('Error fetching performance:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) return <div className="loading loading-lg mx-auto" />
  if (!performance) return null

  const chartData: ChartData<'line'> = {
    labels: performance.history.map(item => item.date),
    datasets: [
      {
        label: '포트폴리오 가치',
        data: performance.history.map(item => item.value),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }
    ]
  }

  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: '포트폴리오 성과'
      }
    },
    scales: {
      y: {
        beginAtZero: false,
        ticks: {
          callback: value => `${value.toLocaleString()}원`
        }
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-4">
        <div className="card">
          <h3 className="text-lg font-semibold mb-2">일간 수익률</h3>
          <p className={`text-2xl font-bold ${
            performance.daily >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {performance.daily.toFixed(2)}%
          </p>
        </div>
        <div className="card">
          <h3 className="text-lg font-semibold mb-2">주간 수익률</h3>
          <p className={`text-2xl font-bold ${
            performance.weekly >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {performance.weekly.toFixed(2)}%
          </p>
        </div>
        <div className="card">
          <h3 className="text-lg font-semibold mb-2">월간 수익률</h3>
          <p className={`text-2xl font-bold ${
            performance.monthly >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {performance.monthly.toFixed(2)}%
          </p>
        </div>
        <div className="card">
          <h3 className="text-lg font-semibold mb-2">연간 수익률</h3>
          <p className={`text-2xl font-bold ${
            performance.yearly >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {performance.yearly.toFixed(2)}%
          </p>
        </div>
      </div>

      <div className="card">
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  )
} 