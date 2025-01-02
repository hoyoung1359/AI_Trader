import { useState, useEffect } from 'react'
import { Stock } from '@/types'
import { fetchStocks } from '@/services/api'

interface StockListProps {
  stocks: Stock[]
  onSelectStock: (stock: Stock) => void
}

export default function StockList({ stocks, onSelectStock }: StockListProps) {
  return (
    <div className="space-y-2">
      {stocks.map((stock) => (
        <div 
          key={stock.symbol}
          className="p-2 border rounded cursor-pointer hover:bg-gray-100"
          onClick={() => onSelectStock(stock)}
        >
          <div className="flex justify-between">
            <span>{stock.name} ({stock.symbol})</span>
            <div className="text-right">
              <div className={`
                ${(stock.change ?? 0) >= 0 ? 'text-green-600' : 'text-red-600'}
                font-semibold
              `}>
                {stock.price?.toLocaleString() ?? '-'} 원
              </div>
              <div className="text-sm text-gray-500">
                {stock.change ? `${stock.change.toFixed(2)}%` : '-'}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
} 