import { NextResponse } from 'next/server'
import { KoreaInvestmentAPI } from '@/lib/korea-investment'
import { getCache, updateCache, needsUpdate, isMarketOpen } from '@/lib/stockCache'
import { Stock } from '@/types'

// 한 페이지당 표시할 종목 수
const PAGE_SIZE = 50

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const sector = searchParams.get('sector')
    const sortBy = searchParams.get('sortBy') || 'marketCap'

    const cache = getCache()
    const cacheKey = `kospi:${page}:${sector}:${sortBy}`
    
    if (!needsUpdate() && cache.stocks[cacheKey]) {
      return NextResponse.json({
        stocks: cache.stocks[cacheKey],
        isMarketOpen: isMarketOpen(),
        lastUpdated: cache.lastUpdated,
        totalPages: cache.totalPages
      })
    }

    const api = new KoreaInvestmentAPI()
    const allStocks = await api.getKospiStocks()
    
    // 섹터 필터링
    let filteredStocks: Stock[] = sector 
      ? allStocks.filter((stock: Stock) => stock.sector === sector)
      : allStocks

    // 정렬
    filteredStocks.sort((a: Stock, b: Stock) => {
      switch (sortBy) {
        case 'marketCap':
          return b.marketCap - a.marketCap
        case 'volume':
          return b.volume - a.volume
        case 'price':
          return b.price - a.price
        case 'change':
          return b.change - a.change
        default:
          return 0
      }
    })

    // 페이지네이션
    const startIndex = (page - 1) * PAGE_SIZE
    const endIndex = startIndex + PAGE_SIZE
    const pagedStocks = filteredStocks.slice(startIndex, endIndex)

    // 가격 정보 조회
    const stocksWithPrice = await Promise.all(
      pagedStocks.map(async (stock: Stock) => {
        try {
          const price = await api.getStockPrice(stock.symbol)
          return { ...stock, ...price }
        } catch (error) {
          console.error(`Failed to fetch price for ${stock.symbol}:`, error)
          return stock
        }
      })
    )

    const totalPages = Math.ceil(filteredStocks.length / PAGE_SIZE)

    // 캐시 업데이트
    updateCache({
      stocks: {
        ...cache.stocks,
        [cacheKey]: stocksWithPrice
      },
      totalPages
    })

    return NextResponse.json({
      stocks: stocksWithPrice,
      isMarketOpen: isMarketOpen(),
      lastUpdated: Date.now(),
      totalPages
    })

  } catch (error) {
    console.error('Failed to fetch KOSPI stocks:', error)
    return NextResponse.json(
      { error: '주식 정보를 불러오는데 실패했습니다.' },
      { status: 500 }
    )
  }
} 