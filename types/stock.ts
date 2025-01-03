export interface KISToken {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface StockItem {
  code: string;
  name: string;
  market: string;
  sector: string | null;
  last_price: number | null;
  change_rate: number | null;
  trading_volume: number | null;
  high_price: number | null;
  low_price: number | null;
  open_price: number | null;
  updated_at: string;
}

export interface SearchResponse {
  rt_cd: string;
  msg_cd: string;
  msg1: string;
  output: StockItem[];
} 