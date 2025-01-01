import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase-client'
import { KoreaInvestmentAPI } from '@/lib/korea-investment'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')

  if (!userId) {
    return NextResponse.json(
      { error: 'User ID is required' },
      { status: 400 }
    )
  }

  try {
    const { data: portfolio, error } = await supabase
      .from('portfolio')
      .select(`
        *,
        stock_master (
          name,
          market,
          sector
        )
      `)
      .eq('user_id', userId)

    if (error) throw error

    // 현재가 정보 추가
    const api = new KoreaInvestmentAPI()
    const portfolioWithPrices = await Promise.all(
      portfolio.map(async (item) => {
        try {
          const priceInfo = await api.getStockPrice(item.symbol)
          return {
            ...item,
            current_price: priceInfo.price,
            profit_loss: (priceInfo.price - item.average_price) * item.quantity,
            profit_loss_percent: ((priceInfo.price / item.average_price) - 1) * 100
          }
        } catch (error) {
          console.error(`Error fetching price for ${item.symbol}:`, error)
          return item
        }
      })
    )

    return NextResponse.json(portfolioWithPrices)
  } catch (error) {
    console.error('Error fetching portfolio:', error)
    return NextResponse.json(
      { error: 'Failed to fetch portfolio' },
      { status: 500 }
    )
  }
} 