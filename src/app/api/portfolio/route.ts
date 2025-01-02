import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase-client'
import { KoreaInvestmentAPI } from '@/lib/korea-investment'

export async function GET(request: Request) {
  try {
    // 현재 인증된 사용자 확인
    const { data: { session }, error: authError } = await supabase.auth.getSession()
    if (authError) throw authError
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 사용자의 포트폴리오 조회
    const { data: portfolios, error: dbError } = await supabase
      .from('portfolios')
      .select('*')
      .eq('user_id', session.user.id)

    if (dbError) throw dbError

    // 현재가 조회
    const api = new KoreaInvestmentAPI()
    const portfoliosWithCurrentPrice = await Promise.all(
      portfolios.map(async (item) => {
        try {
          const priceInfo = await api.getStockPrice(item.symbol)
          const currentPrice = priceInfo.price
          const totalValue = currentPrice * item.quantity
          const profitLoss = totalValue - (item.average_price * item.quantity)
          const profitLossPercentage = (profitLoss / (item.average_price * item.quantity)) * 100

          return {
            ...item,
            current_price: currentPrice,
            total_value: totalValue,
            profit_loss: profitLoss,
            profit_loss_percentage: profitLossPercentage
          }
        } catch (error) {
          console.error(`Failed to fetch price for ${item.symbol}:`, error)
          return item
        }
      })
    )

    // 포트폴리오 요약 계산
    const summary = portfoliosWithCurrentPrice.reduce(
      (acc, item) => {
        if (item.current_price) {
          const investment = item.average_price * item.quantity
          const currentValue = item.current_price * item.quantity
          const profitLoss = currentValue - investment

          acc.total_investment += investment
          acc.total_current_value += currentValue
          acc.total_profit_loss += profitLoss
        }
        return acc
      },
      {
        total_investment: 0,
        total_current_value: 0,
        total_profit_loss: 0,
        total_profit_loss_percentage: 0
      }
    )

    summary.total_profit_loss_percentage = 
      (summary.total_profit_loss / summary.total_investment) * 100

    return NextResponse.json({
      portfolios: portfoliosWithCurrentPrice,
      summary
    })
  } catch (error) {
    console.error('Portfolio fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch portfolio' },
      { status: 500 }
    )
  }
} 