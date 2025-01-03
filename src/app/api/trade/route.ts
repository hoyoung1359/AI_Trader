import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase-client'

export async function POST(request: Request) {
  try {
    const { userId, symbol, quantity, type, price } = await request.json()

    // 사용자 잔고 확인
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('cash_balance')
      .eq('id', userId)
      .single()

    if (userError || !user) {
      return NextResponse.json(
        { error: '사용자를 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    const totalAmount = quantity * price

    // 매수 시 잔고 확인
    if (type === 'buy' && user.cash_balance < totalAmount) {
      return NextResponse.json(
        { error: '잔고가 부족합니다.' },
        { status: 400 }
      )
    }

    // 매도 시 보유 수량 확인
    if (type === 'sell') {
      const { data: holding, error: holdingError } = await supabase
        .from('portfolio')
        .select('quantity')
        .eq('user_id', userId)
        .eq('symbol', symbol)
        .single()

      if (holdingError || !holding || holding.quantity < quantity) {
        return NextResponse.json(
          { error: '보유 수량이 부족합니다.' },
          { status: 400 }
        )
      }
    }

    // 트랜잭션 시작
    const { data, error } = await supabase.rpc('execute_trade', {
      p_user_id: userId,
      p_symbol: symbol,
      p_quantity: quantity,
      p_price: price,
      p_type: type
    })

    if (error) throw error

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Trade error:', error)
    return NextResponse.json(
      { error: '거래 처리 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
} 