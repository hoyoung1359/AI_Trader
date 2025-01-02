import { NextResponse } from 'next/server'
import { KoreaInvestmentAPI } from '@/lib/korea-investment'

export async function GET(
  request: Request,
  { params }: { params: { symbol: string } }
) {
  if (!params.symbol) {
    return NextResponse.json(
      { error: 'Symbol is required' },
      { status: 400 }
    )
  }

  try {
    const api = new KoreaInvestmentAPI()
    const today = new Date()
    const oneMonthAgo = new Date(today.setMonth(today.getMonth() - 1))

    const startDate = oneMonthAgo.toISOString().split('T')[0].replace(/-/g, '')
    const endDate = new Date().toISOString().split('T')[0].replace(/-/g, '')

    const data = await api.getStockHistory(params.symbol, startDate, endDate)
    
    if (!Array.isArray(data)) {
      throw new Error('Invalid data format from API')
    }

    return NextResponse.json({
      dates: data.map((item: any) => item.stck_bsop_date).reverse(),
      prices: data.map((item: any) => parseFloat(item.stck_clpr)).reverse(),
      volumes: data.map((item: any) => parseInt(item.acml_vol)).reverse()
    })
  } catch (error) {
    console.error('Error fetching stock history:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stock history' },
      { status: 500 }
    )
  }
} 