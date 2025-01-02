import { NextResponse } from 'next/server'
import { KoreaInvestmentAPI } from '@/lib/korea-investment'

export async function GET(
  request: Request,
  { params }: { params: { symbol: string } }
) {
  try {
    if (!params.symbol) {
      return NextResponse.json(
        { error: 'Symbol is required' },
        { status: 400 }
      )
    }

    const api = new KoreaInvestmentAPI()
    
    // 3개월 전부터 현재까지의 데이터 조회
    const today = new Date()
    const threeMonthsAgo = new Date()
    threeMonthsAgo.setMonth(today.getMonth() - 3)

    const endDate = today.toISOString().split('T')[0].replace(/-/g, '')
    const startDate = threeMonthsAgo.toISOString().split('T')[0].replace(/-/g, '')

    const data = await api.getStockHistory(params.symbol, startDate, endDate)

    return NextResponse.json(data)
  } catch (error) {
    console.error('Stock history error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stock history' },
      { status: 500 }
    )
  }
} 