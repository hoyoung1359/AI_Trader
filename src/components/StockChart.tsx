'use client'

import { useEffect, useState } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
  ChartOptions,
  ChartData
} from 'chart.js'
import { Line, Bar } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
)

interface ChartDataType {
  dates: string[]
  prices: number[]
  volumes: number[]
}

interface StockChartProps {
  symbol: string
  name: string
}

export default function StockChart({ symbol, name }: StockChartProps) {
  const [chartData, setChartData] = useState<ChartDataType | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const response = await fetch(`/api/stocks/${symbol}/history`)
        if (!response.ok) throw new Error('차트 데이터 로딩 실패')
        const data = await response.json()
        if (!data.dates || !data.prices || !data.volumes) {
          throw new Error('잘못된 데이터 형식')
        }
        setChartData(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : '알 수 없는 오류')
        console.error('차트 데이터 로딩 실패:', err)
      } finally {
        setIsLoading(false)
      }
    }

    if (symbol) {
      fetchChartData()
    }
  }, [symbol])

  if (isLoading) return <div className="p-4 text-center">차트 로딩 중...</div>
  if (error) return <div className="p-4 text-red-500">{error}</div>
  if (!chartData) return null

  const commonOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: `${name} (${symbol})`
      }
    }
  }

  const priceChartOptions: ChartOptions<'line'> = {
    ...commonOptions,
    scales: {
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        ticks: {
          callback: (value) => `${value.toLocaleString()}원`
        }
      }
    },
    interaction: {
      mode: 'index' as const,
      intersect: false,
    }
  }

  const volumeChartOptions: ChartOptions<'bar'> = {
    ...commonOptions,
    scales: {
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        beginAtZero: true,
        ticks: {
          callback: (value) => value.toLocaleString()
        }
      }
    }
  }

  const priceChartData: ChartData<'line'> = {
    labels: chartData.dates,
    datasets: [
      {
        label: '주가',
        data: chartData.prices,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        tension: 0.1,
        pointRadius: 1
      }
    ]
  }

  const volumeChartData: ChartData<'bar'> = {
    labels: chartData.dates,
    datasets: [
      {
        label: '거래량',
        data: chartData.volumes,
        backgroundColor: 'rgba(53, 162, 235, 0.5)'
      }
    ]
  }

  return (
    <div className="space-y-4">
      <div className="border rounded p-4 bg-white">
        <Line data={priceChartData} options={priceChartOptions} />
      </div>
      <div className="border rounded p-4 bg-white">
        <Bar 
          data={volumeChartData}
          options={volumeChartOptions}
        />
      </div>
    </div>
  )
} 