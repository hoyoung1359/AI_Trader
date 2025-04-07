'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import StockChart from '@/components/stocks/StockChart';
import { MAJOR_STOCKS } from '@/lib/korea-investment/client';

export default function StockDetailPage() {
  const params = useParams();
  const code = params?.code as string;

  // 주식 기본 정보 가져오기
  const stockBasicInfo = MAJOR_STOCKS.find(stock => stock.code === code);

  // 실시간 가격 정보 가져오기
  const { data: priceInfo, isLoading } = useQuery({
    queryKey: ['stockPrice', code],
    queryFn: async () => {
      const response = await fetch('/api/stocks/prices');
      if (!response.ok) {
        throw new Error('Failed to fetch stock prices');
      }
      const prices = await response.json();
      return prices.find((p: any) => p.code === code);
    },
    refetchInterval: 5000, // 5초마다 갱신
  });

  if (isLoading || !stockBasicInfo) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* 주식 정보 헤더 */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{stockBasicInfo.name}</h1>
              <p className="text-sm text-gray-500">{stockBasicInfo.code}</p>
              <p className="text-sm text-gray-500 mt-1">{stockBasicInfo.sector}</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">
                {priceInfo?.price?.toLocaleString() || '-'}원
              </div>
              <div className={`text-sm ${
                priceInfo?.change > 0 ? 'text-red-500' : 
                priceInfo?.change < 0 ? 'text-blue-500' : 'text-gray-500'
              }`}>
                {priceInfo?.change > 0 ? '+' : ''}
                {priceInfo?.change?.toLocaleString() || '-'}원 
                ({priceInfo?.changeRate > 0 ? '+' : ''}
                {priceInfo?.changeRate?.toFixed(2) || '-'}%)
              </div>
              <div className="text-sm text-gray-500 mt-1">
                거래량: {priceInfo?.volume?.toLocaleString() || '-'}
              </div>
            </div>
          </div>
        </div>

        {/* 차트 */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6">
            <StockChart 
              stockCode={stockBasicInfo.code} 
              stockName={stockBasicInfo.name}
              showOrderButtons={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
} 