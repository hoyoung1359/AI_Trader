import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase-client'
import { KoreaInvestmentAPI } from '@/lib/korea-investment'

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
          const price = await api.getStockPrice(stock.symbol)
          return { ...stock, ...price }
        } catch (error) {
          console.error(`Error fetching price for ${stock.symbol}:`, error)
          return { ...stock, price: 0, change: 0 }
        }
      })
    )

    return NextResponse.json(stocksWithPrices)
  } catch (error) {
    console.error('Error fetching stocks:', error)
    return NextResponse.json({ error: 'Failed to fetch stocks' }, { status: 500 })
  }
} 