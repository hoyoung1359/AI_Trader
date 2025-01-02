import { NextResponse } from 'next/server'
import { KoreaInvestmentAPI } from '@/lib/korea-investment'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('query')

    if (!query) {
      return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 })
    }

    const api = new KoreaInvestmentAPI()
    const stocks = await api.searchStocks(query)

    return NextResponse.json(stocks)
  } catch (error) {
    console.error('Stock search error:', error)
    return NextResponse.json(
      { error: 'Failed to search stocks' },
      { status: 500 }
    )
  }
} 