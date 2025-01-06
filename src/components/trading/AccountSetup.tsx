'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export default function AccountSetup() {
  const [initialBalance, setInitialBalance] = useState(10000000); // 기본값 1000만원
  const queryClient = useQueryClient();

  const setupMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/trading/account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ initialBalance })
      });
      if (!response.ok) throw new Error('Failed to setup account');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['virtualAccount'] });
    }
  });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
        모의 투자 초기 자금 설정
      </h3>
      <div className="flex gap-4 items-center">
        <input
          type="number"
          value={initialBalance}
          onChange={(e) => setInitialBalance(Math.max(0, parseInt(e.target.value) || 0))}
          className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="초기 자금 입력"
        />
        <button
          onClick={() => setupMutation.mutate()}
          disabled={setupMutation.isPending}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
        >
          설정
        </button>
      </div>
      {setupMutation.isSuccess && (
        <p className="mt-2 text-sm text-green-500">
          초기 자금이 설정되었습니다.
        </p>
      )}
      {setupMutation.isError && (
        <p className="mt-2 text-sm text-red-500">
          초기 자금 설정에 실패했습니다.
        </p>
      )}
    </div>
  );
} 