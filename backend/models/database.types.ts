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
        Update: {
          username?: string
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
        Update: {
          quantity?: number
          average_price?: number
        }
      }
      // 다른 테이블들도 동일한 방식으로 정의
    }
  }
} 