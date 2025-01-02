import axios from 'axios'
import { SearchStock, StockPrice, StockHistoryItem, WebSocketMessage, PriceCallback } from '@/types'
import { Cache } from './cache'

export class KoreaInvestmentAPI {
  private baseUrl = 'https://openapi.koreainvestment.com:9443'
  private wsUrl = 'wss://ops.koreainvestment.com:21000'
  private apiKey: string
  private apiSecret: string
  private accessToken: string | null = null
  private searchCache: Cache<SearchStock[]>
  private priceCache: Cache<StockPrice>

  constructor() {
    this.apiKey = process.env.NEXT_PUBLIC_KOREA_INVESTMENT_API_KEY!
    this.apiSecret = process.env.NEXT_PUBLIC_KOREA_INVESTMENT_API_SECRET!
    this.searchCache = new Cache<SearchStock[]>(300)
    this.priceCache = new Cache<StockPrice>(60)
  }

  private async getAccessToken(): Promise<string> {
    if (this.accessToken) return this.accessToken

    try {
      const response = await axios.post(
        `${this.baseUrl}/oauth2/tokenP`,
        {
          grant_type: 'client_credentials',
          appkey: this.apiKey,
          appsecret: this.apiSecret
        }
      )

      if (!response.data.access_token) {
        throw new Error('No access token received')
      }

      const token = response.data.access_token as string
      this.accessToken = token
      return token

    } catch (error) {
      console.error('Token error:', error)
      throw new Error('Failed to get access token')
    }
  }

  async searchStocks(query: string): Promise<SearchStock[]> {
    const cacheKey = `search:${query}`
    const cached = this.searchCache.get(cacheKey)
    if (cached) return cached

    try {
      const accessToken = await this.getAccessToken()

      // 1. 종목 검색
      const searchResponse = await axios.get(
        `${this.baseUrl}/uapi/domestic-stock/v1/quotations/search-info`,
        {
          headers: {
            'Content-Type': 'application/json',
            'authorization': `Bearer ${accessToken}`,
            'appkey': this.apiKey,
            'appsecret': this.apiSecret,
            'tr_id': 'CTPF1604R', // 주식 종목 검색 TR ID
            'custtype': 'P'
          },
          params: {
            AUTH: '',
            EXCD: 'KRX',  // KRX 전체
            SYMB: query,  // 검색어
            GUBN: '0',    // 전체
            BYMD: new Date().toISOString().slice(0, 10).replace(/-/g, ''),
          }
        }
      )

      if (!searchResponse.data.output || !Array.isArray(searchResponse.data.output)) {
        console.warn('Invalid search response:', searchResponse.data)
        return []
      }

      // 2. 검색된 종목들의 현재가 조회
      const stocks = await Promise.all(
        searchResponse.data.output
          .filter((item: any) => item.SYMB && item.KORN)
          .map(async (item: any) => {
            try {
              const priceResponse = await axios.get(
                `${this.baseUrl}/uapi/domestic-stock/v1/quotations/inquire-price`,
                {
                  headers: {
                    'Content-Type': 'application/json',
                    'authorization': `Bearer ${accessToken}`,
                    'appkey': this.apiKey,
                    'appsecret': this.apiSecret,
                    'tr_id': 'FHKST01010100'
                  },
                  params: {
                    FID_COND_MRKT_DIV_CODE: 'J',
                    FID_INPUT_ISCD: item.SYMB
                  }
                }
              )

              const price = priceResponse.data.output

              return {
                symbol: item.SYMB,
                name: item.KORN,
                market: item.EXCD === '01' ? 'KOSPI' : 'KOSDAQ',
                price: Number(price.stck_prpr) || 0,
                change: Number(price.prdy_ctrt) || 0,
                volume: Number(price.acml_vol) || 0,
                high: Number(price.stck_hgpr) || 0,
                low: Number(price.stck_lwpr) || 0
              }
            } catch (error) {
              console.error(`Price fetch error for ${item.SYMB}:`, error)
              return {
                symbol: item.SYMB,
                name: item.KORN,
                market: item.EXCD === '01' ? 'KOSPI' : 'KOSDAQ'
              }
            }
          })
      )

      this.searchCache.set(cacheKey, stocks)
      return stocks

    } catch (error) {
      console.error('Stock search error:', error)
      if (axios.isAxiosError(error)) {
        console.error('API Response:', error.response?.data)
      }
      throw error
    }
  }

  async getStockPrice(symbol: string): Promise<StockPrice> {
    // 캐시 확인
    const cacheKey = `price:${symbol}`
    const cached = this.priceCache.get(cacheKey)
    if (cached) return cached

    try {
      const accessToken = await this.getAccessToken()
      
      const response = await axios.get(
        `${this.baseUrl}/uapi/domestic-stock/v1/quotations/inquire-price`,
        {
          headers: {
            'Content-Type': 'application/json',
            'authorization': `Bearer ${accessToken}`,
            'appkey': this.apiKey,
            'appsecret': this.apiSecret,
            'tr_id': 'FHKST01010100'
          },
          params: {
            FID_COND_MRKT_DIV_CODE: 'J',
            FID_INPUT_ISCD: symbol
          }
        }
      )

      if (!response.data.output) {
        throw new Error('No price data received')
      }

      const priceInfo: StockPrice = {
        price: Number(response.data.output.stck_prpr) || 0,
        change: Number(response.data.output.prdy_ctrt) || 0,
        volume: Number(response.data.output.acml_vol) || 0,
        high: Number(response.data.output.stck_hgpr) || 0,
        low: Number(response.data.output.stck_lwpr) || 0
      }

      // 캐시에 저장
      this.priceCache.set(cacheKey, priceInfo)
      return priceInfo

    } catch (error) {
      console.error('Error fetching stock price:', error)
      if (axios.isAxiosError(error)) {
        console.error('API Response:', error.response?.data)
      }
      throw new Error('Failed to fetch stock price')
    }
  }

  async getStockHistory(
    symbol: string,
    startDate: string,
    endDate: string
  ): Promise<StockHistoryItem[]> {
    try {
      const accessToken = await this.getAccessToken()
      
      const response = await axios.get(
        `${this.baseUrl}/uapi/domestic-stock/v1/quotations/inquire-daily-price`,
        {
          headers: {
            'Content-Type': 'application/json',
            'authorization': `Bearer ${accessToken}`,
            'appkey': this.apiKey,
            'appsecret': this.apiSecret,
            'tr_id': 'FHKST01010400',
            'custtype': 'P'
          },
          params: {
            FID_COND_MRKT_DIV_CODE: 'J',
            FID_INPUT_ISCD: symbol,
            FID_PERIOD_DIV_CODE: 'D',
            FID_ORG_ADJ_PRC: '1',
            START_DT: startDate,
            END_DT: endDate
          }
        }
      )

      if (!response.data.output || !Array.isArray(response.data.output)) {
        console.warn('Invalid history response:', response.data)
        return []
      }

      return response.data.output.map((item: any) => ({
        date: item.stck_bsop_date,
        open: Number(item.stck_oprc) || 0,
        high: Number(item.stck_hgpr) || 0,
        low: Number(item.stck_lwpr) || 0,
        close: Number(item.stck_clpr) || 0,
        volume: Number(item.acml_vol) || 0
      }))

    } catch (error) {
      console.error('Error fetching stock history:', error)
      if (axios.isAxiosError(error)) {
        console.error('API Response:', error.response?.data)
      }
      throw new Error('Failed to fetch stock history')
    }
  }

  async subscribeToStockPrice(symbol: string, callback: PriceCallback): Promise<WebSocket> {
    try {
      const accessToken = await this.getAccessToken()
      
      if (typeof window === 'undefined') {
        throw new Error('WebSocket is only available in browser environment')
      }

      const ws = new WebSocket(this.wsUrl)

      ws.onopen = () => {
        const subscribeMessage = {
          header: {
            appkey: this.apiKey,
            appsecret: this.apiSecret,
            token: accessToken,
            tr_type: '1',
          },
          body: {
            input: {
              tr_id: 'H0STCNT0',
              tr_key: symbol,
            }
          }
        }

        ws.send(JSON.stringify(subscribeMessage))
      }

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data) as WebSocketMessage
          callback(data)
        } catch (error) {
          console.error('WebSocket message parse error:', error)
        }
      }

      ws.onerror = (error) => {
        console.error('WebSocket error:', error)
      }

      return ws
    } catch (error) {
      console.error('WebSocket connection error:', error)
      throw new Error('Failed to subscribe to stock price')
    }
  }
} 