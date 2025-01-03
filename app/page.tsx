import dynamic from 'next/dynamic';
import LoadingSpinner from '@/components/LoadingSpinner';

const StockSearchWrapper = dynamic(
  () => import('@/components/StockSearchWrapper'),
  {
    ssr: false,
    loading: () => <LoadingSpinner />
  }
);

export default function Page() {
  return <StockSearchWrapper />;
} 