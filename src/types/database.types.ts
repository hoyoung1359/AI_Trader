export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: number
          username: string
          cash_balance: number
          created_at: string
          last_updated: string
        }
        Insert: {
          username: string
          cash_balance?: number
        }
      }
      portfolio: {
        Row: {
          id: number
          user_id: number
          symbol: string
          quantity: number
          average_price: number
          last_updated: string
        }
        Insert: {
          user_id: number
          symbol: string
          quantity: number
          average_price: number
        }
      }
      transactions: {
        Row: {
          id: number
          user_id: number
          symbol: string
          type: 'BUY' | 'SELL'
          quantity: number
          price: number
          total_amount: number
          cash_balance: number
          timestamp: string
        }
      }
      stock_master: {
        Row: {
          symbol: string
          name: string
          market: string
          sector: string
          last_updated: string
        }
      }
    }
  }
} 