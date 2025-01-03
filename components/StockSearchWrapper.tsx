'use client'

import dynamic from 'next/dynamic'
import LoadingSpinner from './LoadingSpinner'
import ClientProvider from '@/app/ClientProvider'

const StockSearchPage = dynamic(() => import('./StockSearchPage'), {
  ssr: false,
  loading: () => <LoadingSpinner />
})

export default function StockSearchWrapper() {
  return (
    <ClientProvider>
      <StockSearchPage />
    </ClientProvider>
  );
} 