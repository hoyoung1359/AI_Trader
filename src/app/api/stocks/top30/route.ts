import { NextResponse } from 'next/server'
import { KoreaInvestmentAPI } from '@/lib/korea-investment'
import { getCache, updateCache, needsUpdate, isMarketOpen } from '@/lib/stockCache'
import { Stock } from '@/types'

const KOSPI_TOP_30 = [
  { symbol: '005930', name: '삼성전자' },
  { symbol: '000660', name: 'SK하이닉스' },
  { symbol: '373220', name: 'LG에너지솔루션' },
  { symbol: '207940', name: '삼성바이오로직스' },
  { symbol: '005935', name: '삼성전자우' },
  { symbol: '005380', name: '현대차' },
  { symbol: '000270', name: '기아' },
  { symbol: '051910', name: 'LG화학' },
  { symbol: '035420', name: 'NAVER' },
  { symbol: '005490', name: 'POSCO홀딩스' },
  // ... 나머지 종목들
]

export async function GET() {
  try {
    const cache = getCache()
    const cacheKey = 'kospi:top30'
    
    // 캐시가 유효하면 캐시된 데이터 반환
    if (!needsUpdate() && cache.stocks[cacheKey]) {
      return NextResponse.json({
        stocks: cache.stocks[cacheKey],
        isMarketOpen: isMarketOpen(),
        lastUpdated: cache.lastUpdated
      })
    }

    const api = new KoreaInvestmentAPI()
    const stocks = await Promise.all(
      KOSPI_TOP_30.map(async (stock) => {
        try {
          const price = await api.getStockPrice(stock.symbol)
          return {
            ...stock,
            ...price,
            marketCap: 0, // 실제 시가총액 데이터 필요
            volume: price.volume || 0
          } as Stock
        } catch (error) {
          console.error(`Failed to fetch price for ${stock.symbol}:`, error)
          return {
            ...stock,
            price: 0,
            change: 0,
            volume: 0,
            marketCap: 0
          } as Stock
        }
      })
    )

    // 캐시 업데이트
    updateCache({
      stocks: {
        ...cache.stocks,
        [cacheKey]: stocks
      }
    })

    return NextResponse.json({
      stocks,
      isMarketOpen: isMarketOpen(),
      lastUpdated: Date.now()
    })

  } catch (error) {
    console.error('Failed to fetch top 30 stocks:', error)
    return NextResponse.json(
      { error: '주식 정보를 불러오는데 실패했습니다.' },
      { status: 500 }
    )
  }
} 