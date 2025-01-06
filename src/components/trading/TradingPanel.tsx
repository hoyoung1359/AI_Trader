'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface TradingPanelProps {
  stockCode: string;
  stockName: string;
  currentPrice: number;
}

export default function TradingPanel({ stockCode, stockName, currentPrice }: TradingPanelProps) {
  const [quantity, setQuantity] = useState(0);
  const [orderType, setOrderType] = useState<'buy' | 'sell'>('buy');
  const queryClient = useQueryClient();

  // 계좌 정보 조회
  const { data: account } = useQuery({
    queryKey: ['virtualAccount'],
    queryFn: async () => {
      const response = await fetch('/api/trading/account');
      if (!response.ok) throw new Error('Failed to fetch account');
      return response.json();
    }
  });

  // 보유 종목 조회
  const { data: holding } = useQuery({
    queryKey: ['holding', stockCode],
    queryFn: async () => {
      const response = await fetch(`/api/trading/holdings/${stockCode}`);
      if (!response.ok) throw new Error('Failed to fetch holding');
      return response.json();
    }
  });

  // 주문 실행
  const orderMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/trading/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: orderType,
          stockCode,
          quantity,
          price: currentPrice
        })
      });
      if (!response.ok) throw new Error('Failed to execute order');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['virtualAccount'] });
      queryClient.invalidateQueries({ queryKey: ['holding', stockCode] });
      setQuantity(0);
    }
  });

  const totalAmount = quantity * currentPrice;
  const canBuy = account?.balance >= totalAmount && quantity > 0;
  const canSell = (holding?.quantity || 0) >= quantity && quantity > 0;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          주문하기
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {stockName} ({stockCode})
        </p>
        <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-2">
          {currentPrice.toLocaleString()}원
        </p>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-2">
        <button
          onClick={() => setOrderType('buy')}
          className={`px-4 py-2 rounded-lg font-medium ${
            orderType === 'buy'
              ? 'bg-red-500 text-white'
              : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
          }`}
        >
          매수
        </button>
        <button
          onClick={() => setOrderType('sell')}
          className={`px-4 py-2 rounded-lg font-medium ${
            orderType === 'sell'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
          }`}
        >
          매도
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-sm text-gray-600 dark:text-gray-400">수량</label>
          <div className="flex gap-2 mt-1">
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(0, parseInt(e.target.value) || 0))}
              className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={() => setQuantity(Math.floor((account?.balance || 0) / currentPrice))}
              className="px-3 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300"
            >
              최대
            </button>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">주문금액</span>
            <span className="font-medium">{totalAmount.toLocaleString()}원</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">보유현금</span>
            <span className="font-medium">{account?.balance?.toLocaleString()}원</span>
          </div>
          {holding && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">보유수량</span>
              <span className="font-medium">{holding.quantity}주</span>
            </div>
          )}
        </div>

        <button
          onClick={() => orderMutation.mutate()}
          disabled={orderType === 'buy' ? !canBuy : !canSell || orderMutation.isPending}
          className={`w-full py-3 rounded-lg font-medium ${
            orderType === 'buy'
              ? 'bg-red-500 text-white hover:bg-red-600 disabled:bg-red-300'
              : 'bg-blue-500 text-white hover:bg-blue-600 disabled:bg-blue-300'
          }`}
        >
          {orderType === 'buy' ? '매수하기' : '매도하기'}
        </button>
      </div>
    </div>
  );
} 