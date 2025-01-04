import dynamic from 'next/dynamic';
import LoadingSpinner from '@/components/LoadingSpinner';

const StockSearchContent = dynamic(
  () => import('@/components/StockSearchContent'),
  {
    ssr: false,
    loading: () => <LoadingSpinner />
  }
);

const DynamicProvider = dynamic(
  () => import('@/app/providers/StockProvider').then(mod => ({ default: mod.StockProvider })),
  {
    ssr: false,
    loading: () => <LoadingSpinner />
  }
);

export default function Page() {
  return (
    <DynamicProvider>
      <StockSearchContent />
    </DynamicProvider>
  );
} 