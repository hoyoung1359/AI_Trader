import { NextResponse } from 'next/server'
import { KoreaInvestmentAPI } from '@/lib/korea-investment'

export async function GET(
  request: Request,
  { params }: { params: { symbol: string } }
) {
  try {
    const api = new KoreaInvestmentAPI()

    // 기본적으로 최근 3개월 데이터 조회
    const today = new Date()
    const threeMonthsAgo = new Date()
    threeMonthsAgo.setMonth(today.getMonth() - 3)

    const endDate = today.toISOString().split('T')[0].replace(/-/g, '')
    const startDate = threeMonthsAgo.toISOString().split('T')[0].replace(/-/g, '')

    const data = await api.getStockHistory(params.symbol, startDate, endDate)

    return NextResponse.json(data)
  } catch (error) {
    console.error('Stock history fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stock history' },
      { status: 500 }
    )
  }
} 