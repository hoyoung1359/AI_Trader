import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase-client'
import { KoreaInvestmentAPI } from '@/lib/korea-investment'

export async function POST(request: Request) {
  try {
    const { userId, symbol, type, quantity } = await request.json()

    // 사용자 확인
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()

    if (userError || !user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // 현재 주식 가격 조회
    const api = new KoreaInvestmentAPI()
    const priceInfo = await api.getStockPrice(symbol)
    const totalAmount = priceInfo.price * quantity

    // 거래 실행
    const { data, error } = await supabase.rpc('execute_trade', {
      p_user_id: userId,
      p_symbol: symbol,
      p_type: type,
      p_quantity: quantity,
      p_price: priceInfo.price,
      p_total_amount: totalAmount
    })

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error('Trade error:', error)
    return NextResponse.json(
      { error: 'Failed to execute trade' },
      { status: 500 }
    )
  }
} 