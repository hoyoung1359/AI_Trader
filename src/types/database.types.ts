export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: number
          auth_id: string
          username: string
          cash_balance: number
          created_at: string
          last_updated: string
        }
        Insert: {
          auth_id: string
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
      price_alerts: {
        Row: {
          id: number
          user_id: number
          symbol: string
          target_price: number
          alert_type: 'above' | 'below'
          status: 'active' | 'triggered' | 'cancelled'
          created_at: string
          triggered_at: string | null
        }
      }
      auto_trading_rules: {
        Row: {
          id: number
          user_id: number
          symbol: string
          buy_price: number
          sell_price: number
          quantity: number
          status: 'active' | 'completed' | 'cancelled'
          created_at: string
        }
      }
      portfolio_history: {
        Row: {
          id: number
          user_id: number
          total_value: number
          cash_balance: number
          profit_loss: number
          date: string
          created_at: string
        }
      }
    }
  }
} 