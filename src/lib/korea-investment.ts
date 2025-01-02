import { error } from 'console'
import { SearchStock, Stock } from '@/types'

interface StockPrice {
  price: number
  change: number
  volume: number
  high: number
  low: number
}

export class KoreaInvestmentAPI {
  private baseUrl: string
  private apiKey: string
  private apiSecret: string
  private accessToken: string | null
  private tokenExpiresAt: Date | null

  constructor() {
    this.baseUrl = "https://openapi.koreainvestment.com:9443"
    this.apiKey = process.env.KOREA_INVESTMENT_API_KEY!
    this.apiSecret = process.env.KOREA_INVESTMENT_API_SECRET!
    this.accessToken = null
    this.tokenExpiresAt = null
  }

  async getAccessToken(): Promise<string> {
    try {
      // 토큰이 있고 아직 유효한 경우
      if (this.accessToken && this.tokenExpiresAt && this.tokenExpiresAt > new Date()) {
        return this.accessToken
      }

      const response = await fetch(`${this.baseUrl}/oauth2/tokenP`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          grant_type: 'client_credentials',
          appkey: this.apiKey,
          appsecret: this.apiSecret,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to get access token')
      }

      const data = await response.json()
      
      if (!data.access_token) {
        throw new Error('No access token received')
      }

      this.accessToken = data.access_token
      this.tokenExpiresAt = new Date(Date.now() + 23 * 60 * 60 * 1000) // 23시간
      
      return this.accessToken as string  // 타입 단언 추가
    } catch (error) {
      console.error('Error getting access token:', error)
      throw error
    }
  }

  async getStockPrice(symbol: string): Promise<StockPrice> {
    try {
      const token = await this.getAccessToken()
      
      const response = await fetch(
        `${this.baseUrl}/uapi/domestic-stock/v1/quotations/inquire-price?FID_COND_MRKT_DIV_CODE=J&FID_INPUT_ISCD=${symbol}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            appkey: this.apiKey,
            appsecret: this.apiSecret,
            tr_id: "FHKST01010100",
            "content-type": "application/json"
          }
        }
      )

      if (!response.ok) {
        throw new Error('Failed to fetch stock price')
      }

      const data = await response.json()
      
      if (!data.output) {
        throw new Error('No price data received')
      }

      return {
        price: parseFloat(data.output.stck_prpr) || 0,    // 현재가
        change: parseFloat(data.output.prdy_ctrt) || 0,   // 전일대비
        volume: parseInt(data.output.acml_vol) || 0,      // 거래량
        high: parseFloat(data.output.high) || 0,          // 고가
        low: parseFloat(data.output.low) || 0             // 저가
      }
    } catch (error) {
      console.error('Error fetching stock price:', error)
      throw error
    }
  }

  async getStockHistory(symbol: string, startDate: string, endDate: string) {
    try {
      const token = await this.getAccessToken()
      
      const response = await fetch(
        `${this.baseUrl}/uapi/domestic-stock/v1/quotations/inquire-daily-price`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            appkey: this.apiKey,
            appsecret: this.apiSecret,
            tr_id: "FHKST01010400",
            "content-type": "application/json"
          }
        }
      )

      if (!response.ok) {
        throw new Error('Failed to fetch stock history')
      }

      const data = await response.json()
      return data.output || []
    } catch (error) {
      console.error('Error fetching stock history:', error)
      throw error
    }
  }

  async searchStocks(query: string): Promise<SearchStock[]> {
    try {
      const token = await this.getAccessToken()
      
      const response = await fetch(
        `${this.baseUrl}/uapi/domestic-stock/v1/quotations/search-stock?query=${encodeURIComponent(query)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            appkey: this.apiKey,
            appsecret: this.apiSecret,
            tr_id: "HHDFS00000300"
          }
        }
      )

      if (!response.ok) {
        throw new Error('Failed to search stocks')
      }

      const data = await response.json()
      
      return data.output.map((item: any): SearchStock => ({
        symbol: item.mksc_shrn_iscd,
        name: item.hts_kor_isnm,
        market: item.bstp_cls_code === '01' ? 'KOSPI' : 'KOSDAQ',
        sector: item.bstp_kor_isnm
      }))
    } catch (error) {
      console.error('Error searching stocks:', error)
      throw error
    }
  }

  // 실시간 시세 구독
  async subscribeToStockPrice(symbol: string, callback: (data: any) => void) {
    try {
      const token = await this.getAccessToken()
      
      // WebSocket 연결
      const ws = new WebSocket(`${this.baseUrl}/websocket`)
      
      ws.onopen = () => {
        // 실시간 시세 구독 요청
        ws.send(JSON.stringify({
          header: {
            token,
            appkey: this.apiKey,
            appsecret: this.apiSecret,
            tr_type: "1",
            tr_id: "H0STCNT0"
          },
          body: {
            input: {
              symbol
            }
          }
        }))
      }
      
      ws.onmessage = (event) => {
        const data = JSON.parse(event.data)
        callback(data)
      }
      
      return ws
    } catch (error) {
      console.error('Error subscribing to stock price:', error)
      throw error
    }
  }
} 