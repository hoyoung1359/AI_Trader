import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase-client'

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
    // 포트폴리오 이력 조회
    const { data: history, error: historyError } = await supabase
      .from('portfolio_history')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: true })
      .limit(30)

    if (historyError) throw historyError

    // 수익률 계산
    const lastValue = history[history.length - 1]?.total_value || 0
    const yesterdayValue = history[history.length - 2]?.total_value || lastValue
    const weekAgoValue = history[history.length - 8]?.total_value || lastValue
    const monthAgoValue = history[history.length - 31]?.total_value || lastValue
    const yearAgoValue = history[0]?.total_value || lastValue

    return NextResponse.json({
      daily: ((lastValue / yesterdayValue) - 1) * 100,
      weekly: ((lastValue / weekAgoValue) - 1) * 100,
      monthly: ((lastValue / monthAgoValue) - 1) * 100,
      yearly: ((lastValue / yearAgoValue) - 1) * 100,
      history: history.map(item => ({
        date: item.date,
        value: item.total_value,
        profit: item.profit_loss
      }))
    })
  } catch (error) {
    console.error('Error fetching portfolio performance:', error)
    return NextResponse.json(
      { error: 'Failed to fetch portfolio performance' },
      { status: 500 }
    )
  }
} 