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
  BarElement
} from 'chart.js'
import { Line, Bar } from 'react-chartjs-2'

// Chart.js 등록
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

interface ChartData {
  dates: string[]
  prices: number[]
  volumes: number[]
}

interface StockChartProps {
  symbol: string
  name: string
}

export default function StockChart({ symbol, name }: StockChartProps) {
  const [chartData, setChartData] = useState<ChartData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchChartData()
  }, [symbol])

  const fetchChartData = async () => {
    try {
      const response = await fetch(`/api/stocks/${symbol}/history`)
      if (!response.ok) throw new Error('Failed to fetch chart data')
      const data = await response.json()
      setChartData(data)
    } catch (error) {
      console.error('차트 데이터 로딩 실패:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) return <div>차트 로딩 중...</div>
  if (!chartData) return <div>차트 데이터를 불러올 수 없습니다.</div>

  const priceChartData = {
    labels: chartData.dates,
    datasets: [
      {
        label: '주가',
        data: chartData.prices,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }
    ]
  }

  const volumeChartData = {
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
      <div className="border rounded p-4">
        <h3 className="text-lg font-semibold mb-4">{name} 주가 차트</h3>
        <Line 
          data={priceChartData}
          options={{
            responsive: true,
            scales: {
              y: {
                beginAtZero: false
              }
            }
          }}
        />
      </div>

      <div className="border rounded p-4">
        <h3 className="text-lg font-semibold mb-4">거래량</h3>
        <Bar 
          data={volumeChartData}
          options={{
            responsive: true
          }}
        />
      </div>
    </div>
  )
} 