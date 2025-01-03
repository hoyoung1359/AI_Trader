import { NextResponse } from 'next/server'
import { KoreaInvestmentAPI } from '@/lib/korea-investment'
import { SearchStock } from '@/types'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('query')

    if (!query) {
      return NextResponse.json({ error: '검색어를 입력해주세요.' }, { status: 400 })
    }

    const api = new KoreaInvestmentAPI()
    const searchResults = await api.searchStocks(query)

    // SearchStock 타입으로 변환
    const stocks: SearchStock[] = searchResults.map(item => ({
      symbol: item.symbol,
      name: item.name,
      market: item.market,
      sector: item.sector,
      price: item.price,
      change: item.change,
      volume: item.volume
    }))

    return NextResponse.json(stocks)
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json(
      { error: '검색 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
} 