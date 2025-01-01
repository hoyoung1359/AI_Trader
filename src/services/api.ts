import { Stock, User, TradeRequest } from '@/types'

const API_BASE_URL = '/api'

export const fetchStocks = async (query?: string): Promise<Stock[]> => {
  try {
    const response = await fetch(`/api/stocks${query ? `?query=${query}` : ''}`)
    if (!response.ok) {
      console.error('API response not ok:', response.status)
      throw new Error('API 요청 실패')
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error('주식 데이터 조회 실패:', error)
    return []
  }
}

export const executeTrade = async (userId: number, tradeData: TradeRequest) => {
  try {
    const response = await fetch(`${API_BASE_URL}/trade`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, ...tradeData }),
    })
    if (!response.ok) throw new Error('거래 실패')
    return response.json()
  } catch (error) {
    console.error('거래 실패:', error)
    throw error
  }
}

export const fetchPortfolio = async (userId: number) => {
  try {
    const response = await fetch(`${API_BASE_URL}/portfolio?userId=${userId}`)
    if (!response.ok) throw new Error('포트폴리오 조회 실패')
    return response.json()
  } catch (error) {
    console.error('포트폴리오 조회 실패:', error)
    return []
  }
}

export const fetchTransactions = async (userId: number) => {
  try {
    const response = await fetch(`${API_BASE_URL}/transactions?userId=${userId}`)
    if (!response.ok) throw new Error('거래내역 조회 실패')
    return response.json()
  } catch (error) {
    console.error('거래내역 조회 실패:', error)
    return []
  }
}

export const getUser = async (userId: number): Promise<User> => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`)
    if (!response.ok) throw new Error('사용자 정보 조회 실패')
    return response.json()
  } catch (error) {
    console.error('사용자 정보 조회 실패:', error)
    throw error
  }
}

export const fetchStockPrices = async (symbols: string[]): Promise<Stock[]> => {
  try {
    const response = await fetch(`/api/stocks/prices`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ symbols })
    })
    if (!response.ok) throw new Error('가격 조회 실패')
    return response.json()
  } catch (error) {
    console.error('가격 조회 실패:', error)
    return []
  }
} 