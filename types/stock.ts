export interface KISToken {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface StockItem {
  종목코드: string;
  종목명: string;
  현재가: number;
  전일대비: number;
  등락률: number;
  거래량: number;
  시가: number;
  고가: number;
  저가: number;
}

export interface SearchResponse {
  rt_cd: string;
  msg_cd: string;
  msg1: string;
  output: StockItem[];
} 