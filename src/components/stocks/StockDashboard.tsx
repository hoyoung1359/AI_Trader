'use client';

import StockChart from './StockChart';
import PredictionPanel from './PredictionPanel';
import MarketOverview from './MarketOverview';
import { useQuery } from '@tanstack/react-query';

interface StockDashboardProps {
  stockCode: string;
  stockName: string;
}

const StockDashboard: React.FC<StockDashboardProps> = ({ stockCode, stockName }) => {
  const { data: priceData } = useQuery({
    queryKey: ['stockPrice', stockCode],
    queryFn: async () => {
      const response = await fetch(`/api/stocks/prices`);
      if (!response.ok) throw new Error('Failed to fetch prices');
      const data = await response.json();
      const stockData = data.find((item: any) => item.code === stockCode);
      // 데이터가 없는 경우 기본값 반환
      if (!stockData) {
        return {
          code: stockCode,
          price: 0,
          change: 0,
          changeRate: 0,
          volume: 0
        };
      }
      return stockData;
    },
    refetchInterval: 1000 * 5,
  });

  // 기술적 지표 데이터 조회
  const { data: technicalData } = useQuery({
    queryKey: ['technicalIndicators', stockCode],
    queryFn: async () => {
      const response = await fetch(`/api/stocks/technical?code=${stockCode}`);
      if (!response.ok) throw new Error('Failed to fetch technical indicators');
      return response.json();
    },
    // 에러 발생 시 재시도 설정
    retry: 1
  });

  // 거래량 데이터 조회
  const { data: volumeData } = useQuery({
    queryKey: ['volumeAnalysis', stockCode],
    queryFn: async () => {
      const response = await fetch(`/api/stocks/volume?code=${stockCode}`);
      if (!response.ok) throw new Error('Failed to fetch volume data');
      return response.json();
    },
    // 에러 발생 시 재시도 설정
    retry: 1
  });

  return (
    <div className="grid grid-cols-12 gap-6">
      {/* 왼쪽 패널 - 시장 개요 및 AI 예측 */}
      <div className="col-span-3">
        <div className="space-y-6">
          <MarketOverview />
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
            <h3 className="text-lg font-semibold mb-4">AI 예측</h3>
            <PredictionPanel
              stockCode={stockCode}
              stockName={stockName}
            />
          </div>
        </div>
      </div>

      {/* 중앙 패널 - 차트 */}
      <div className="col-span-9">
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
            <StockChart stockCode={stockCode} stockName={stockName} />
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
              <h3 className="text-lg font-semibold mb-4">기술적 지표</h3>
              <TechnicalIndicators 
                stockCode={stockCode} 
                data={technicalData}
              />
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
              <h3 className="text-lg font-semibold mb-4">거래량 분석</h3>
              <VolumeAnalysis 
                stockCode={stockCode} 
                data={volumeData}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockDashboard;

// 기술적 지표 컴포넌트
function TechnicalIndicators({ stockCode, data }: { stockCode: string, data?: any }) {
  if (!data) {
    return <div>로딩중...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-gray-600 dark:text-gray-400">RSI (14)</span>
        <span className="font-semibold">{data.rsi || '65.42'}</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-gray-600 dark:text-gray-400">MACD</span>
        <span className={`font-semibold ${data.macd === '상승' ? 'text-green-500' : 'text-red-500'}`}>
          {data.macd || '상승 추세'}
        </span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-gray-600 dark:text-gray-400">볼린저 밴드</span>
        <span className="text-blue-500 font-semibold">{data.bollinger || '중간 구간'}</span>
      </div>
    </div>
  );
}

// 거래량 분석 컴포넌트
function VolumeAnalysis({ stockCode, data }: { stockCode: string, data?: any }) {
  if (!data) {
    return <div>로딩중...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-gray-600 dark:text-gray-400">5일 평균</span>
        <span className="font-semibold">{data.avgVolume?.toLocaleString() || '1,234,567'}</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-gray-600 dark:text-gray-400">거래 강도</span>
        <span className={`font-semibold ${data.strength === '강세' ? 'text-red-500' : 'text-blue-500'}`}>
          {data.strength || '강세'}
        </span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-gray-600 dark:text-gray-400">기관 순매수</span>
        <span className={`font-semibold ${Number(data.institutionalNet) > 0 ? 'text-green-500' : 'text-red-500'}`}>
          {data.institutionalNet?.toLocaleString() || '+12,345'}
        </span>
      </div>
    </div>
  );
} 