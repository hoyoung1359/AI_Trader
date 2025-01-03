import dynamic from 'next/dynamic';
import LoadingSpinner from '@/components/LoadingSpinner';

const StockDetailWrapper = dynamic(
  () => import('@/components/StockDetailWrapper'),
  {
    ssr: false,
    loading: () => <LoadingSpinner />
  }
);

type Props = {
  params: { code: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export default function StockPage({ params }: Props) {
  return <StockDetailWrapper code={params.code} />;
} 