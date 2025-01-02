import { NextResponse } from 'next/server'
import { KoreaInvestmentAPI } from '@/lib/korea-investment'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('query')

    if (!query) {
      return NextResponse.json(
        { error: 'Search query is required' },
        { status: 400 }
      )
    }

    const api = new KoreaInvestmentAPI()
    const results = await api.searchStocks(query)

    // 검색 결과가 없는 경우 빈 배열 반환
    if (!results || results.length === 0) {
      return NextResponse.json([])
    }

    return NextResponse.json(results)
  } catch (error) {
    console.error('Stock search error:', error)
    return NextResponse.json(
      { error: 'Failed to search stocks', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
} 