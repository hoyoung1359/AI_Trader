import { error } from 'console'

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
      this.accessToken = data.access_token
      this.tokenExpiresAt = new Date(Date.now() + 23 * 60 * 60 * 1000) // 23시간
      
      return this.accessToken
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
          headers: {
            Authorization: `Bearer ${token}`,
            appkey: this.apiKey,
            appsecret: this.apiSecret,
            tr_id: "FHKST01010100",
          },
        }
      )

      if (!response.ok) {
        throw new Error('Failed to fetch stock price')
      }

      const data = await response.json()
      
      return {
        price: parseFloat(data.output.stck_prpr),    // 현재가
        change: parseFloat(data.output.prdy_ctrt),   // 전일대비
        volume: parseInt(data.output.acml_vol),      // 거래량
        high: parseFloat(data.output.high),          // 고가
        low: parseFloat(data.output.low),            // 저가
      }
    } catch (error) {
      console.error('Error fetching stock price:', error)
      throw error
    }
  }
} 