export interface WebSocketMessage {
  type: string;
  cmd: string;
  format: string;
  token: string;
  key: string;
  qtype: string;
  realtype: string;
}

export interface StockRealtime {
  체결시간: string;
  현재가: number;
  전일대비: number;
  등락율: number;
  거래량: number;
  거래대금: number;
} 