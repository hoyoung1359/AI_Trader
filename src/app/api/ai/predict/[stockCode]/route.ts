import { NextResponse } from 'next/server';
import { MAJOR_STOCKS } from '@/lib/korea-investment/client';

interface MyRouteContext {
  params: Promise<{
    stockCode: string;
  }>;
}

interface MajorStock {
  code: string;
  name: string;
  sector: string;
  currentPrice?: number; // currentPrice 추가
}

export async function GET(_request: Request, context: MyRouteContext) {
  try {
    const { stockCode } = await context.params;

    const stock = MAJOR_STOCKS.find(s => s.code === stockCode) as MajorStock;
    if (!stock) throw new Error('Stock not found');

    // 종목별 특성을 반영한 예측 데이터 생성
    const basePrice = stock.currentPrice || 50000;
    const volatility = Math.random() * 0.1; // 10% 이내의 변동성
    const trend = Math.random() > 0.5 ? 'upward' : 'downward';
    const predictedChange = basePrice * volatility * (trend === 'upward' ? 1 : -1);
    
    const mockPrediction = {
      predictedPrice: Math.round(basePrice + predictedChange),
      confidenceScore: 0.7 + Math.random() * 0.2, // 70~90% 신뢰도
      trend,
      supportLevel: Math.round(basePrice * 0.95), // 5% 하락을 지지선으로
      resistanceLevel: Math.round(basePrice * 1.05), // 5% 상승을 저항선으로
      shortTermForecast: trend === 'upward' ? '상승 추세' : '하락 추세',
      technicalSignals: {
        rsi: Math.round(40 + Math.random() * 30), // 40-70 범위의 RSI
        macd: trend === 'upward' ? 'bullish' : 'bearish',
        bollingerBand: ['upper', 'middle', 'lower'][Math.floor(Math.random() * 3)]
      },
      analysisFactors: {
        technical: {
          description: "기술적 분석 요인",
          factors: [
            {
              name: "이동평균선",
              status: trend === 'upward' ? "골든크로스 형성" : "데드크로스 형성",
              impact: trend === 'upward' ? "강한 매수신호" : "강한 매도신호"
            },
            {
              name: "거래량",
              status: `전일 대비 ${Math.round(Math.random() * 100)}% 증가`,
              impact: "시장 관심도 상승"
            }
          ]
        },
        fundamental: {
          description: "기본적 분석 요인",
          factors: [
            {
              name: "시장 점유율",
              status: `업계 ${Math.floor(Math.random() * 3 + 1)}위`,
              impact: "안정적인 시장 지위"
            },
            {
              name: "실적 전망",
              status: `전년 대비 영업이익 ${Math.round(Math.random() * 20)}% 성장 예상`,
              impact: "긍정적 실적 모멘텀"
            }
          ]
        },
        market: {
          description: "시장 환경 요인",
          factors: [
            {
              name: "산업 동향",
              status: stock.sector + " 산업 성장세",
              impact: "긍정적 산업 영향"
            },
            {
              name: "시장 심리",
              status: trend === 'upward' ? "낙관적" : "보수적",
              impact: trend === 'upward' ? "매수세 유입 가능" : "관망세 지속"
            }
          ]
        }
      }
    };

    return NextResponse.json({
      stockCode,
      prediction: mockPrediction
    });
  } catch (error) {
    console.error('Prediction error:', error);
    return NextResponse.json(
      { error: 'Failed to generate prediction' },
      { status: 500 }
    );
  }
}