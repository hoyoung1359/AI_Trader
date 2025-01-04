export interface KISToken {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface StockItem {
  id: number;
  code: string;
  name: string;
  current_price: number;
  previous_price: number;
  volume: number;
  created_at?: string;
  updated_at?: string;
}

export interface SearchResponse {
  rt_cd: string;
  msg_cd: string;
  msg1: string;
  output: StockItem[];
} 