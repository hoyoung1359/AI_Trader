import axios from 'axios'
import { SearchStock, Stock } from '@/types'
import { Cache } from './cache'
import { withRetry } from './retry'
import { StockAPIError } from './errors'

interface StockPrice {
  price: number
  change: number
  volume: number
  high: number
  low: number
}

interface StockHistoryItem {
  date: string
  open: number
  high: number
  low: number
  close: number
  volume: number
}

interface WebSocketMessage {
  body: {
    output: {
      price: number
      change: number
      volume: number
    }
  }
}

type PriceCallback = (data: WebSocketMessage) => void

export class KoreaInvestmentAPI {
  private baseUrl = 'https://openapi.koreainvestment.com:9443'
  private wsUrl = 'wss://ops.koreainvestment.com:21000'
  private apiKey: string
  private apiSecret: string
  private accessToken: string | null = null
  private priceCache: Cache<StockPrice>
  private searchCache: Cache<SearchStock[]>

  constructor() {
    const apiKey = process.env.NEXT_PUBLIC_KOREA_INVESTMENT_API_KEY
    const apiSecret = process.env.NEXT_PUBLIC_KOREA_INVESTMENT_API_SECRET

    if (!apiKey || !apiSecret) {
      throw new Error('Missing Korea Investment API credentials')
    }

    this.apiKey = apiKey
    this.apiSecret = apiSecret

    // 가격 정보는 1분간 캐시
    this.priceCache = new Cache<StockPrice>(60)
    // 검색 결과는 5분간 캐시
    this.searchCache = new Cache<SearchStock[]>(300)
  }

  private async getAccessToken() {
    if (this.accessToken) return this.accessToken

    try {
      const response = await axios.post(`${this.baseUrl}/oauth2/tokenP`, {
        grant_type: 'client_credentials',
        appkey: this.apiKey,
        appsecret: this.apiSecret
      })

      this.accessToken = response.data.access_token
      return this.accessToken
    } catch (error) {
      console.error('Failed to get access token:', error)
      throw new Error('Failed to authenticate with Korea Investment API')
    }
  }

  async getStockPrice(symbol: string): Promise<StockPrice> {
    try {
      const accessToken = await this.getAccessToken()
      
      const response = await axios.get(
        `${this.baseUrl}/uapi/domestic-stock/v1/quotations/inquire-price`,
        {
          headers: {
            'authorization': `Bearer ${accessToken}`,
            'appkey': this.apiKey,
            'appsecret': this.apiSecret,
            'tr_id': 'FHKST01010100',
            'content-type': 'application/json'
          },
          params: {
            FID_COND_MRKT_DIV_CODE: 'J',
            FID_INPUT_ISCD: symbol
          }
        }
      )

      const output = response.data.output

      if (!output) {
        throw new Error('No price data received')
      }

      return {
        price: parseFloat(output.stck_prpr) || 0,
        change: parseFloat(output.prdy_ctrt) || 0,
        volume: parseInt(output.acml_vol) || 0,
        high: parseFloat(output.high) || 0,
        low: parseFloat(output.low) || 0
      }
    } catch (error) {
      console.error('Error fetching stock price:', error)
      throw error
    }
  }

  async searchStocks(query: string): Promise<SearchStock[]> {
    const cacheKey = `search:${query}`
    const cached = this.searchCache.get(cacheKey)
    if (cached) return cached

    try {
      const accessToken = await this.getAccessToken()
      
      const response = await axios.get(`${this.baseUrl}/uapi/domestic-stock/v1/quotations/search-info`, {
        headers: {
          'Content-Type': 'application/json',
          'authorization': `Bearer ${accessToken}`,
          'appkey': this.apiKey,
          'appsecret': this.apiSecret,
          'tr_id': 'CTPF1604R'
        },
        params: {
          AUTH: '',
          EXCD: '01',
          SYMB: query,
          GUBN: '0',
          BYMD: new Date().toISOString().slice(0, 10).replace(/-/g, '')
        }
      })

      if (!response.data.output || !Array.isArray(response.data.output)) {
        return []
      }

      const stocks = await Promise.all(
        response.data.output
          .filter((item: any) => item.SYMB && item.KORN)
          .map(async (item: any): Promise<SearchStock> => {
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

              const priceInfo = priceResponse.data.output

              return {
                symbol: item.SYMB,
                name: item.KORN,
                market: item.EXCD === '01' ? 'KOSPI' : 'KOSDAQ',
                sector: item.SECT || '',
                price: parseFloat(priceInfo.stck_prpr) || 0,
                change: parseFloat(priceInfo.prdy_ctrt) || 0,
                volume: parseInt(priceInfo.acml_vol) || 0,
                high: parseFloat(priceInfo.stck_hgpr) || 0,
                low: parseFloat(priceInfo.stck_lwpr) || 0
              }
            } catch (error) {
              console.error(`Error fetching price for ${item.SYMB}:`, error)
              return {
                symbol: item.SYMB,
                name: item.KORN,
                market: item.EXCD === '01' ? 'KOSPI' : 'KOSDAQ',
                sector: item.SECT || ''
              }
            }
          })
      )

      this.searchCache.set(cacheKey, stocks)
      return stocks
    } catch (error) {
      throw new StockAPIError('Failed to search stocks')
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
            'authorization': `Bearer ${accessToken}`,
            'appkey': this.apiKey,
            'appsecret': this.apiSecret,
            'tr_id': 'FHKST01010400',
            'content-type': 'application/json'
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
        return []
      }

      return response.data.output.map((item: any) => ({
        date: item.stck_bsop_date,
        open: parseFloat(item.stck_oprc) || 0,
        high: parseFloat(item.stck_hgpr) || 0,
        low: parseFloat(item.stck_lwpr) || 0,
        close: parseFloat(item.stck_clpr) || 0,
        volume: parseInt(item.acml_vol) || 0
      }))
    } catch (error) {
      console.error('Error fetching stock history:', error)
      throw new Error('Failed to fetch stock history')
    }
  }

  async subscribeToStockPrice(symbol: string, callback: PriceCallback) {
    try {
      const accessToken = await this.getAccessToken()
      
      const ws = new window.WebSocket(this.wsUrl)

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
          const message = JSON.parse(event.data) as WebSocketMessage
          callback(message)
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