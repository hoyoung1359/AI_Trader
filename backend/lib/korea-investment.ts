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

  async getStockPrice(symbol: string) {
    // 기존 로직을 TypeScript로 변환
  }
} 