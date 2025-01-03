// 기본 주식 정보 인터페이스
interface BaseStock {
  symbol: string
  name: string
  sector?: string
  price?: number
  change?: number
  volume?: number
  high?: number
  low?: number
}

// 검색 결과용 인터페이스
export interface SearchStock extends BaseStock {
  market: string
}

// 거래용 주식 정보 인터페이스
export interface Stock extends BaseStock {
  marketCap: number
  volume: number
  price: number
  change: number
}

export interface User {
  id: number
  username: string
  cash_balance: number
  created_at: string
  last_updated: string
}

export interface TradeRequest {
  symbol: string
  type: 'BUY' | 'SELL'
  quantity: number
}

export interface Portfolio {
  id: string
  userId: string
  stocks: {
    symbol: string
    shares: number
    averagePrice: number
  }[]
  cash: number
  createdAt: string
  updatedAt: string
}

export interface Transaction {
  id: string
  userId: string
  symbol: string
  type: 'buy' | 'sell'
  shares: number
  price: number
  total: number
  timestamp: string
}

export interface PortfolioPerformance {
  date: string
  totalValue: number
  cash: number
  stocks: {
    symbol: string
    shares: number
    price: number
    value: number
  }[]
}

export interface PortfolioSummary {
  totalInvestment: number
  totalValue: number
  totalProfitLoss: number
  profitLossPercentage: number
  cash: number
}

export interface StockHistoryItem {
  date: string
  open: number
  high: number
  low: number
  close: number
  volume: number
}

export interface WebSocketMessage {
  header: {
    tr_id: string
    content_type?: string
  }
  body: {
    output: {
      price: number
      change: number
      volume: number
      symbol: string
    }
  }
}

export interface StockPrice {
  price: number
  change: number
  volume: number
  high: number
  low: number
}

export type PriceCallback = (data: WebSocketMessage) => void 