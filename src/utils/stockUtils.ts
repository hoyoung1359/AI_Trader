import { SearchStock, Stock } from '@/types'

export function convertToStock(searchStock: SearchStock): Stock {
  return {
    symbol: searchStock.symbol,
    name: searchStock.name,
    sector: searchStock.sector,
    marketCap: 0, // 기본값
    volume: searchStock.volume || 0,
    price: searchStock.price || 0,
    change: searchStock.change || 0,
    high: searchStock.high,
    low: searchStock.low
  }
}

export function isValidStock(stock: any): stock is Stock {
  return (
    typeof stock === 'object' &&
    typeof stock.symbol === 'string' &&
    typeof stock.name === 'string' &&
    typeof stock.price === 'number' &&
    typeof stock.change === 'number' &&
    typeof stock.volume === 'number' &&
    typeof stock.marketCap === 'number'
  )
} 