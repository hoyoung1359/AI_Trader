export interface KISToken {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface StockItem {
  code: string;
  name: string;
  market: string;
  sector: string;
  last_price: number;
  change_rate: number;
  updated_at: string;
}

export interface SearchResponse {
  rt_cd: string;
  msg_cd: string;
  msg1: string;
  output: StockItem[];
} 