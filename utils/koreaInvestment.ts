import { KISToken, SearchResponse } from '@/types/stock';

const BASE_URL = 'https://openapi.koreainvestment.com:9443';

export async function getAccessToken(): Promise<KISToken> {
  try {
    const response = await fetch(`${BASE_URL}/oauth2/tokenP`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        grant_type: 'client_credentials',
        appkey: process.env.NEXT_PUBLIC_KOREA_INVESTMENT_API_KEY,
        appsecret: process.env.NEXT_PUBLIC_KOREA_INVESTMENT_API_SECRET
      })
    });

    if (!response.ok) {
      throw new Error('토큰 발급 실패');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('토큰 발급 중 오류:', error);
    throw error;
  }
}

export async function searchStocks(keyword: string): Promise<SearchResponse> {
  try {
    const token = await getAccessToken();
    
    const response = await fetch(`${BASE_URL}/uapi/domestic-stock/v1/quotations/search-info?input=${encodeURIComponent(keyword)}`, {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        'authorization': `Bearer ${token.access_token}`,
        'appkey': process.env.NEXT_PUBLIC_KOREA_INVESTMENT_API_KEY!,
        'appsecret': process.env.NEXT_PUBLIC_KOREA_INVESTMENT_API_SECRET!,
        'tr_id': 'CTPF1604R',
        'custtype': 'P'
      }
    });

    if (!response.ok) {
      throw new Error('종목 검색 실패');
    }

    return response.json();
  } catch (error) {
    console.error('종목 검색 중 오류:', error);
    throw error;
  }
} 