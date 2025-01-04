import dynamic from 'next/dynamic';
import LoadingSpinner from '@/components/LoadingSpinner';

const StockDetail = dynamic(
  () => import('@/components/StockDetail'),
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

type Props = {
  params: { code: string }
};

export default function StockPage({ params }: Props) {
  return (
    <DynamicProvider>
      <StockDetail code={params.code} />
    </DynamicProvider>
  );
} 