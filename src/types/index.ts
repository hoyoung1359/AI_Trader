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

export interface Portfolio {
  id: number
  user_id: number
  symbol: string
  name: string
  quantity: number
  average_price: number
  current_price?: number
  total_value?: number
  profit_loss?: number
  profit_loss_percentage?: number
  created_at: string
  updated_at: string
}

export interface PortfolioSummary {
  total_investment: number
  total_current_value: number
  total_profit_loss: number
  total_profit_loss_percentage: number
}

export interface StockHistoryItem {
  date: string
  open: number
  high: number
  low: number
  close: number
  volume: number
} 