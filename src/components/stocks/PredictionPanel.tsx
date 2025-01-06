'use client';

import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

interface PredictionPanelProps {
  stockCode: string;
  stockName: string;
}

interface Factor {
  name: string;
  status: string;
  impact: string;
}

interface AnalysisFactor {
  description: string;
  factors: Factor[];
}

interface PredictionData {
  predictedPrice: number;
  confidenceScore: number;
  trend: string;
  supportLevel: number;
  resistanceLevel: number;
  shortTermForecast: string;
  technicalSignals: {
    rsi: number;
    macd: string;
    bollingerBand: string;
  };
  analysisFactors: {
    [key: string]: AnalysisFactor;
  };
}

export default function PredictionPanel({ stockCode, stockName }: PredictionPanelProps) {
  const [selectedFactor, setSelectedFactor] = useState<'technical' | 'fundamental' | 'market'>('technical');
  
  const { data: prediction, isLoading } = useQuery({
    queryKey: ['prediction', stockCode],
    queryFn: async () => {
      const response = await fetch(`/api/ai/predict/${stockCode}`);
      if (!response.ok) throw new Error('Failed to fetch prediction');
      return response.json();
    },
    refetchInterval: 1000 * 60 * 5,
  });

  if (isLoading) {
    return <div className="animate-pulse">AI 분석 중...</div>;
  }

  const data = prediction?.prediction;
  if (!data) return null;

  return (
    <div className="space-y-4">
      <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-600 dark:text-gray-400">예상 가격</span>
          <span className="font-bold text-lg">
            {data.predictedPrice.toLocaleString()}원
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600 dark:text-gray-400">신뢰도</span>
          <span className={`font-medium ${
            data.confidenceScore > 0.7 ? 'text-green-500' : 'text-yellow-500'
          }`}>
            {(data.confidenceScore * 100).toFixed(1)}%
          </span>
        </div>
      </div>

      <div className="flex space-x-2">
        {(['technical', 'fundamental', 'market'] as const).map((factor) => (
          <button
            key={factor}
            onClick={() => setSelectedFactor(factor)}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              selectedFactor === factor
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300'
            }`}
          >
            {factor === 'technical' ? '기술적' : factor === 'fundamental' ? '기본적' : '시장'}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
          {data.analysisFactors[selectedFactor].description}
        </h4>
        {data.analysisFactors[selectedFactor].factors.map((factor: Factor, index: number) => (
          <div key={index} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {factor.name}
              </span>
              <span className="text-sm text-blue-600 dark:text-blue-400">
                {factor.status}
              </span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {factor.impact}
            </p>
          </div>
        ))}
      </div>

      <div className="border-t pt-4 mt-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="text-sm text-gray-600 dark:text-gray-400">지지선</div>
            <div className="font-medium">{data.supportLevel.toLocaleString()}원</div>
          </div>
          <div className="text-center p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="text-sm text-gray-600 dark:text-gray-400">저항선</div>
            <div className="font-medium">{data.resistanceLevel.toLocaleString()}원</div>
          </div>
        </div>
      </div>
    </div>
  );
}