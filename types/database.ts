export interface Database {
  public: {
    Tables: {
      stocks: {
        Row: {
          code: string
          name: string
          market: string
          sector: string | null
          last_price: number | null
          change_rate: number | null
          trading_volume: number | null
          high_price: number | null
          low_price: number | null
          open_price: number | null
          updated_at: string
        }
        Insert: {
          code: string
          name: string
          market: string
          sector?: string | null
          last_price?: number | null
          change_rate?: number | null
          trading_volume?: number | null
          high_price?: number | null
          low_price?: number | null
          open_price?: number | null
          updated_at?: string
        }
      }
    }
  }
} 