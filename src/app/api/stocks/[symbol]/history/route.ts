import { NextResponse } from 'next/server'
import { KoreaInvestmentAPI } from '@/lib/korea-investment'

export async function GET(
  request: Request,
  { params }: { params: { symbol: string } }
) {
  try {
    const api = new KoreaInvestmentAPI()
    const today = new Date()
    const oneMonthAgo = new Date(today.setMonth(today.getMonth() - 1))

    const startDate = oneMonthAgo.toISOString().split('T')[0].replace(/-/g, '')
    const endDate = new Date().toISOString().split('T')[0].replace(/-/g, '')

    const data = await api.getStockHistory(params.symbol, startDate, endDate)
    
    return NextResponse.json({
      dates: data.map((item: any) => item.stck_bsop_date),
      prices: data.map((item: any) => parseFloat(item.stck_clpr)),
      volumes: data.map((item: any) => parseInt(item.acml_vol))
    })
  } catch (error) {
    console.error('Error fetching stock history:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stock history' },
      { status: 500 }
    )
  }
} 