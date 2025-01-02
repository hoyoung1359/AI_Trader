export interface Stock {
  symbol: string
  name: string
  market: string
  sector?: string
  price?: number
  change?: number
  volume?: number
  high?: number
  low?: number
}

export interface SearchStock {
  symbol: string
  name: string
  market: string
  sector?: string
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