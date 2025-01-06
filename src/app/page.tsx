import Dashboard from '@/components/layout/Dashboard';
import StockDashboard from '@/components/stocks/StockDashboard';

export default function Home() {
  return (
    <Dashboard>
      <StockDashboard 
        stockCode="005930" 
        stockName="삼성전자" 
      />
    </Dashboard>
  );
} 