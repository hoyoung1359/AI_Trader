import { MAJOR_STOCKS } from '@/lib/korea-investment/client';
import Dashboard from '@/components/layout/Dashboard';
import StockDashboard from '@/components/stocks/StockDashboard';

interface Props {
  params: Promise<{
    code: string;
  }>;
}

export async function generateStaticParams() {
  return MAJOR_STOCKS.map((stock) => ({
    code: stock.code,
  }));
}

export async function generateMetadata({ params }: Props) {
  const { code } = await params;
  const stock = MAJOR_STOCKS.find(s => s.code === code);
  return {
    title: stock ? `${stock.name} (${stock.code}) - AI Trader` : 'Stock Not Found - AI Trader',
    description: stock ? `${stock.name}의 실시간 주가 차트 및 AI 분석` : '종목을 찾을 수 없습니다.',
  };
}

export default async function StockPage({ params }: Props) {
  const { code } = await params;
  const stock = MAJOR_STOCKS.find(s => s.code === code);
  
  if (!stock) {
    return (
      <Dashboard>
        <div className="p-4">
          <h1 className="text-xl font-semibold text-red-500">
            종목을 찾을 수 없습니다.
          </h1>
        </div>
      </Dashboard>
    );
  }

  return (
    <Dashboard>
      <StockDashboard 
        stockCode={stock.code} 
        stockName={stock.name} 
      />
    </Dashboard>
  );
}