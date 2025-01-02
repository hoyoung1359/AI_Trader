import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { KoreaInvestmentAPI } from '@/lib/korea-investment'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    const { data: portfolios, error } = await supabase
      .from('portfolios')
      .select('*')
      .eq('user_id', userId)

    if (error) throw error

    const api = new KoreaInvestmentAPI()

    // 각 종목의 현재가 조회
    const portfoliosWithCurrentPrice = await Promise.all(
      portfolios.map(async (item) => {
        try {
          const priceInfo = await api.getStockPrice(item.symbol)
          const currentPrice = priceInfo.price
          const totalValue = currentPrice * item.shares
          const profitLoss = totalValue - (item.average_price * item.shares)
          const profitLossPercentage = ((currentPrice - item.average_price) / item.average_price) * 100

          return {
            ...item,
            current_price: currentPrice,
            total_value: totalValue,
            profit_loss: profitLoss,
            profit_loss_percentage: profitLossPercentage
          }
        } catch (error) {
          console.error(`Error fetching price for ${item.symbol}:`, error)
          return item
        }
      })
    )

    return NextResponse.json(portfoliosWithCurrentPrice)
  } catch (error) {
    console.error('Portfolio fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch portfolio' },
      { status: 500 }
    )
  }
} 