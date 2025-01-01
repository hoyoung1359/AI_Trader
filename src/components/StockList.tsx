import { useState, useEffect } from 'react'
import { Stock } from '@/types'
import { fetchStocks } from '@/services/api'

interface StockListProps {
  stocks: Stock[]
  onSelectStock: (stock: Stock) => void
}

export default function StockList({ stocks, onSelectStock }: StockListProps) {
  const [updatedStocks, setUpdatedStocks] = useState<Stock[]>(stocks)

  useEffect(() => {
    setUpdatedStocks(stocks)
  }, [stocks])

  useEffect(() => {
    if (updatedStocks.length === 0) return

    const updatePrices = async () => {
      try {
        const symbols = updatedStocks.map(stock => stock.symbol)
        const updatedData = await Promise.all(
          symbols.map(symbol => fetchStocks(symbol))
        )
        const flatData = updatedData.flat()
        
        setUpdatedStocks(prev => 
          prev.map(stock => {
            const updated = flatData.find(s => s.symbol === stock.symbol)
            return updated || stock
          })
        )
      } catch (error) {
        console.error('가격 업데이트 실패:', error)
      }
    }

    const interval = setInterval(updatePrices, 5000)  // 5초마다 업데이트
    return () => clearInterval(interval)
  }, [updatedStocks])

  return (
    <div className="space-y-2">
      {updatedStocks.map((stock) => (
        <div 
          key={stock.symbol}
          className="p-2 border rounded cursor-pointer hover:bg-gray-100"
          onClick={() => onSelectStock(stock)}
        >
          <div className="flex justify-between">
            <span>{stock.name} ({stock.symbol})</span>
            <div className="text-right">
              <div className={`
                ${stock.change >= 0 ? 'text-green-600' : 'text-red-600'}
                transition-colors duration-300
              `}>
                {stock.price.toLocaleString()} 원
              </div>
              <div className="text-sm text-gray-500">
                {stock.change.toFixed(2)}%
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
} 