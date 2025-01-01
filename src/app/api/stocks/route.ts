import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase-client'
import { KoreaInvestmentAPI } from '@/lib/korea-investment'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('query') || ''

  try {
    // 주식 마스터 데이터 검색
    const { data: stocks, error } = await supabase
      .from('stock_master')
      .select('*')
      .ilike('name', `%${query}%`)
      .limit(20)

    if (error) throw error

    // 현재가 조회
    const api = new KoreaInvestmentAPI()
    const stocksWithPrices = await Promise.all(
      stocks.map(async (stock) => {
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