import { Stock } from '@/types'

interface StockCache {
  stocks: {
    [key: string]: Stock[] // 캐시 키별 주식 데이터
  }
  lastUpdated: number
  isMarketOpen: boolean
  totalPages: number
}

let cache: StockCache = {
  stocks: {},
  lastUpdated: 0,
  isMarketOpen: false,
  totalPages: 1
}

const UPDATE_INTERVAL = 10 * 60 * 1000 // 10분
const MARKET_OPEN_HOUR = 9
const MARKET_CLOSE_HOUR = 15 // 15:30 기준이지만 시간 단위로 체크

export function isMarketOpen(): boolean {
  const now = new Date()
  const hour = now.getHours()
  const day = now.getDay()

  // 주말 체크
  if (day === 0 || day === 6) return false
  
  // 장 운영 시간 체크
  return hour >= MARKET_OPEN_HOUR && hour < MARKET_CLOSE_HOUR
}

export function needsUpdate(): boolean {
  const now = Date.now()
  return now - cache.lastUpdated > UPDATE_INTERVAL
}

export function updateCache(newCache: Partial<StockCache>) {
  cache = {
    ...cache,
    ...newCache,
    lastUpdated: Date.now(),
    isMarketOpen: isMarketOpen()
  }
}

export function getCache(): StockCache {
  return cache
} 