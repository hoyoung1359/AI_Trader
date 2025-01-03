import StockDetailWrapper from '@/components/StockDetailWrapper'

export default function Page({ params }: { params: { code: string } }) {
  return <StockDetailWrapper code={params.code} />
} 