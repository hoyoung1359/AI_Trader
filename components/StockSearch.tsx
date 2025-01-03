'use client';

import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import StockSearchContent from './StockSearchContent';

function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div className="text-center p-4">
      <h2 className="text-red-500 font-bold mb-4">문제가 발생했습니다</h2>
      <pre className="text-sm mb-4">{error.message}</pre>
      <button
        onClick={resetErrorBoundary}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        다시 시도
      </button>
    </div>
  );
}

export default function StockSearch() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <StockSearchContent />
    </ErrorBoundary>
  );
} 