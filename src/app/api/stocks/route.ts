import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase-client'
import { KoreaInvestmentAPI } from '@/lib/korea-investment'
import { Stock } from '@/types'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('query') || ''

  try {
    const { data: stocks, error } = await supabase
      .from('stock_master')
      .select('*')
      .ilike('name', `%${query}%`)
      .limit(20)

    if (error) throw error

    const api = new KoreaInvestmentAPI()
    const stocksWithPrices = await Promise.all(
      stocks.map(async (stock) => {
        try {
          const priceInfo = await api.getStockPrice(stock.symbol)
          return {
            symbol: stock.symbol,
            name: stock.name,
            market: stock.market,
            sector: stock.sector,
            price: priceInfo.price,
            change: priceInfo.change,
            volume: priceInfo.volume,
            high: priceInfo.high,
            low: priceInfo.low
          } as Stock
        } catch (error) {
          console.error(`Error fetching price for ${stock.symbol}:`, error)
          return {
            ...stock,
            price: 0,
            change: 0,
            volume: 0,
            high: 0,
            low: 0
          } as Stock
        }
      })
    )

    return NextResponse.json(stocksWithPrices)
  } catch (error) {
    console.error('Error fetching stocks:', error)
    return NextResponse.json({ error: 'Failed to fetch stocks' }, { status: 500 })
  }
} 