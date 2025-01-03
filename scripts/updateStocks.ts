import * as dotenv from 'dotenv'
import * as path from 'path'
import { AxiosError } from 'axios'

// .env.local 파일을 절대 경로로 로드
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

import { supabase } from '../utils/supabase'
import axios from 'axios'

const BASE_URL = 'https://openapi.koreainvestment.com:9443'

// 주요 KOSPI 종목 코드 리스트
const STOCK_CODES = [
  '005930', // 삼성전자
  '000660', // SK하이닉스
  '035420', // NAVER
  '035720', // 카카오
  '051910', // LG화학
  '006400', // 삼성SDI
  '207940', // 삼성바이오로직스
  '005380', // 현대차
  '000270', // 기아
  '373220'  // LG에너지솔루션
];

// API 호출 간격 (밀리초)
const API_CALL_INTERVAL = 1000; // 1초

// 지연 함수
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function getAccessToken() {
  try {
    const response = await axios.post(`${BASE_URL}/oauth2/tokenP`, {
      grant_type: 'client_credentials',
      appkey: process.env.NEXT_PUBLIC_KOREA_INVESTMENT_API_KEY,
      appsecret: process.env.NEXT_PUBLIC_KOREA_INVESTMENT_API_SECRET
    })
    return response.data.access_token
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error('토큰 발급 중 오류:', error.response?.data || error.message)
    }
    throw error
  }
}

async function fetchStockInfo(accessToken: string, stockCode: string) {
  try {
    const response = await axios.get(`${BASE_URL}/uapi/domestic-stock/v1/quotations/inquire-price`, {
      headers: {
        'content-type': 'application/json; charset=utf-8',
        'authorization': `Bearer ${accessToken}`,
        'appkey': process.env.NEXT_PUBLIC_KOREA_INVESTMENT_API_KEY,
        'appsecret': process.env.NEXT_PUBLIC_KOREA_INVESTMENT_API_SECRET,
        'tr_id': 'FHKST01010100',
        'custtype': 'P',
      },
      params: {
        FID_COND_MRKT_DIV_CODE: 'J',
        FID_INPUT_ISCD: stockCode,
      }
    });

    const { output } = response.data;
    return {
      code: output.stck_shrn_iscd,
      name: output.hts_kor_isnm || output.bstp_kor_isnm, // 종목명이 없으면 업종명 사용
      market: 'KOSPI',
      sector: output.bstp_kor_isnm,
      last_price: parseFloat(output.stck_prpr),
      change_rate: parseFloat(output.prdy_ctrt),
      trading_volume: parseInt(output.acml_vol),
      high_price: parseFloat(output.stck_hgpr),
      low_price: parseFloat(output.stck_lwpr),
      open_price: parseFloat(output.stck_oprc),
      updated_at: new Date().toISOString()
    };
  } catch (error) {
    console.error(`${stockCode} 종목 조회 중 오류:`, error);
    return null;
  }
}

async function fetchStocksSequentially(accessToken: string) {
  const stocksData = [];
  
  for (const code of STOCK_CODES) {
    console.log(`${code} 종목 데이터 조회 중...`);
    const stockInfo = await fetchStockInfo(accessToken, code);
    if (stockInfo) {
      stocksData.push(stockInfo);
      console.log(`${code} (${stockInfo.name}) 데이터 조회 완료`);
    }
    // API 호출 간격 대기
    await delay(API_CALL_INTERVAL);
  }
  
  return stocksData;
}

async function updateStocks() {
  try {
    console.log('토큰 발급 시작...');
    const accessToken = await getAccessToken();
    console.log('토큰 발급 완료');

    console.log('주식 데이터 순차 조회 시작...');
    const stocksData = await fetchStocksSequentially(accessToken);
    console.log('주식 데이터 조회 완료');

    if (stocksData.length > 0) {
      console.log('기존 데이터 삭제 시작...');
      await supabase.from('stocks').delete().neq('code', '');
      console.log('기존 데이터 삭제 완료');

      console.log('새로운 데이터 입력 시작...');
      const { error } = await supabase.from('stocks').insert(stocksData);

      if (error) {
        throw error;
      }
      console.log(`주식 데이터 업데이트 완료 (총 ${stocksData.length}종목)`);
    }
  } catch (error) {
    console.error('데이터 업데이트 중 오류:', error);
    process.exit(1);
  }
}

// 스크립트 실행
updateStocks(); 