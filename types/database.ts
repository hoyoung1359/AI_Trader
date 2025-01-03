export interface StockWatchlist {
  id: string
  user_id: string
  stock_code: string
  stock_name: string
  created_at: string
}

export interface TradeHistory {
  id: string
  user_id: string
  stock_code: string
  type: 'buy' | 'sell'
  price: number
  quantity: number
  total_amount: number
  created_at: string
} 