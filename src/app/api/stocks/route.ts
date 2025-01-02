import { NextResponse } from 'next/server'
import { KoreaInvestmentAPI } from '@/lib/korea-investment'
import { SearchStock, Stock } from '@/types'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('query') || ''

  try {
    const api = new KoreaInvestmentAPI()
    
    // 한국투자증권 API를 통해 주식 검색
    const stocks: SearchStock[] = await api.searchStocks(query)
    
    // 현재가 조회
    const stocksWithPrices: Stock[] = await Promise.all(
      stocks.map(async (stock: SearchStock) => {
        try {
          const priceInfo = await api.getStockPrice(stock.symbol)
          return {
            ...stock,
            price: priceInfo.price,
            change: priceInfo.change,
            volume: priceInfo.volume,
            high: priceInfo.high,
            low: priceInfo.low
          }
        } catch (error) {
          console.error(`Error fetching price for ${stock.symbol}:`, error)
          return stock
        }
      })
    )

    return NextResponse.json(stocksWithPrices)
  } catch (error) {
    console.error('Error searching stocks:', error)
    return NextResponse.json(
      { error: 'Failed to search stocks' },
      { status: 500 }
    )
  }
} 