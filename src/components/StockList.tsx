'use client'

import { useEffect, useState } from 'react'
import { Stock } from '@/types'
import { HiTrendingUp, HiTrendingDown } from 'react-icons/hi'
import { KOSPI_SECTORS } from '@/constants/sectors'
import { SORT_OPTIONS } from '@/constants/sortOptions'

interface StockListProps {
  onSelectStock: (stock: Stock) => void
}

const PAGE_SIZE = 50

// 페이지네이션 컴포넌트
const Pagination = ({ currentPage, totalPages, onPageChange }: {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}) => {
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1)
  const visiblePages = pageNumbers.slice(
    Math.max(0, currentPage - 3),
    Math.min(totalPages, currentPage + 2)
  )

  return (
    <div className="flex justify-center gap-2 mt-4">
      {currentPage > 1 && (
        <button
          onClick={() => onPageChange(currentPage - 1)}
          className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
        >
          이전
        </button>
      )}
      
      {visiblePages.map(page => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-1 rounded ${
            currentPage === page 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-200 hover:bg-gray-300'
          }`}
        >
          {page}
        </button>
      ))}
      
      {currentPage < totalPages && (
        <button
          onClick={() => onPageChange(currentPage + 1)}
          className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
        >
          다음
        </button>
      )}
    </div>
  )
}

export default function StockList({ onSelectStock }: StockListProps) {
  const [stocks, setStocks] = useState<Stock[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [sector, setSector] = useState<string>('')
  const [sortBy, setSortBy] = useState<string>('marketCap')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStocks = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await fetch(
          `/api/stocks/kospi?page=${currentPage}&sector=${sector}&sortBy=${sortBy}`
        )
        if (!response.ok) {
          throw new Error('주식 정보를 불러오는데 실패했습니다.')
        }
        const data = await response.json()
        
        setStocks(data.stocks)
        setTotalPages(data.totalPages)
      } catch (error) {
        console.error('Failed to fetch stocks:', error)
        setError(error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchStocks()
    const interval = setInterval(fetchStocks, 10 * 60 * 1000)
    return () => clearInterval(interval)
  }, [currentPage, sector, sortBy])

  if (error) {
    return (
      <div className="p-4 text-center text-red-500">
        <p>{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          새로고침
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">코스피 종목</h2>
        <div className="flex gap-4">
          <select 
            value={sector} 
            onChange={(e) => setSector(e.target.value)}
            className="border rounded p-2"
          >
            {KOSPI_SECTORS.map(sector => (
              <option key={sector.value} value={sector.value}>
                {sector.label}
              </option>
            ))}
          </select>
          
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border rounded p-2"
          >
            {SORT_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: PAGE_SIZE }).map((_, i) => (
            <div 
              key={i}
              className="p-4 border rounded-lg animate-pulse bg-gray-100"
            >
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stocks.map((stock) => (
            <div
              key={stock.symbol}
              className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
              onClick={() => onSelectStock(stock)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{stock.name}</h3>
                  <p className="text-sm text-gray-500">{stock.symbol}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold">
                    {stock.price?.toLocaleString()}원
                  </p>
                  {stock.change && (
                    <div className={`flex items-center justify-end ${
                      stock.change >= 0 ? 'text-red-600' : 'text-blue-600'
                    }`}>
                      {stock.change >= 0 ? (
                        <HiTrendingUp className="mr-1" />
                      ) : (
                        <HiTrendingDown className="mr-1" />
                      )}
                      <span>{Math.abs(stock.change).toFixed(2)}%</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  )
} 