'use client';

import { useState, useRef, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { createChart, ColorType, IChartApi, Time, CandlestickData, LineData } from 'lightweight-charts';
import { ChartOptions, ChartPeriod, ChartType, TechnicalIndicator } from '@/types/chart';
import TradingPanel from '../trading/TradingPanel';

interface StockChartProps {
  stockCode: string;
  stockName: string;
}

interface ChartDataItem {
  date: string;
  시가: number;
  고가: number;
  저가: number;
  종가: number;
  거래량: number;
}

type ProcessedDataItem = Omit<CandlestickData<Time>, 'time'> & {
  time: string;  // YYYYMMDD 형식의 문자열
  value: number;
};

export default function StockChart({ stockCode, stockName }: StockChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const [options, setOptions] = useState<ChartOptions>({
    period: '1M',
    type: 'line',
    indicators: ['MA5', 'MA20']
  });

  // HTTP 폴링 방식으로 데이터 가져오기
  const { data: chartData, isLoading, error, refetch } = useQuery({
    queryKey: ['stockChart', stockCode, options.period],
    queryFn: async () => {
      const response = await fetch(`/api/stocks/chart?code=${stockCode}&period=${options.period}`);
      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.msg_cd === 'EGW00201') {
          // 초당 거래건수 초과 에러인 경우 1초 대기 후 재시도
          await new Promise(resolve => setTimeout(resolve, 1000));
          const retryResponse = await fetch(`/api/stocks/chart?code=${stockCode}&period=${options.period}`);
          if (!retryResponse.ok) {
            throw new Error('Failed to fetch chart data after retry');
          }
          return retryResponse.json();
        }
        throw new Error('Failed to fetch chart data');
      }
      return response.json();
    },
    staleTime: 1000 * 60 * 5, // 5분마다 갱신
    refetchInterval: 1000 * 60 * 5, // 5분마다 자동 갱신
    retry: 3, // 최대 3번 재시도
    retryDelay: 1000, // 재시도 간격 1초
  });

  // 차트 데이터 가공
  const processChartData = (data: ChartDataItem[]): ProcessedDataItem[] => {
    return data
      .map(item => ({
        time: `${item.date.slice(0, 4)}-${item.date.slice(4, 6)}-${item.date.slice(6, 8)}`,
        open: item.시가,
        high: item.고가,
        low: item.저가,
        close: item.종가,
        value: item.종가,
      }))
      .sort((a, b) => a.time.localeCompare(b.time));
  };

  // 이동평균선 계산
  const calculateMA = (data: ProcessedDataItem[], period: number): LineData<Time>[] => {
    return data
      .map((item, index) => {
        if (index < period - 1) return null;
        const sum = data
          .slice(index - period + 1, index + 1)
          .reduce((acc, curr) => acc + curr.close, 0);
        return {
          time: item.time as Time,
          value: sum / period,
        };
      })
      .filter((item): item is LineData<Time> => item !== null);
  };

  // 차트 생성 및 업데이트
  useEffect(() => {
    let chart: IChartApi | null = null;

    const initChart = () => {
      if (!chartContainerRef.current || !chartData?.length) return;

      try {
        // 차트 생성
        chart = createChart(chartContainerRef.current, {
          layout: {
            background: { type: ColorType.Solid, color: 'white' },
            textColor: 'black',
          },
          grid: {
            vertLines: { color: '#f0f0f0' },
            horzLines: { color: '#f0f0f0' },
          },
          width: chartContainerRef.current.clientWidth,
          height: 400,
          timeScale: {
            timeVisible: true,
            secondsVisible: false,
            borderColor: '#D1D5DB',
          },
          rightPriceScale: {
            borderColor: '#D1D5DB',
            autoScale: true,
          },
          crosshair: {
            mode: 1,
            vertLine: {
              width: 1,
              color: '#2962FF',
              style: 0,
            },
            horzLine: {
              width: 1,
              color: '#2962FF',
              style: 0,
            },
          },
        });

        chartRef.current = chart;

        // 데이터 가공
        const processedData = processChartData(chartData);

        // 메인 시리즈 추가
        if (options.type === 'candle') {
          const candlestickSeries = chart.addCandlestickSeries({
            upColor: '#26a69a',
            downColor: '#ef5350',
            borderVisible: false,
            wickUpColor: '#26a69a',
            wickDownColor: '#ef5350',
          });
          candlestickSeries.setData(processedData);
        } else {
          const lineSeries = chart.addLineSeries({
            color: '#2962FF',
            lineWidth: 2,
          });
          lineSeries.setData(processedData);
        }

        // 이동평균선 추가
        if (options.indicators.includes('MA5')) {
          const ma5Series = chart.addLineSeries({
            color: '#ff7700',
            lineWidth: 1,
            priceLineVisible: false,
          });
          ma5Series.setData(calculateMA(processedData, 5));
        }

        if (options.indicators.includes('MA20')) {
          const ma20Series = chart.addLineSeries({
            color: '#2196F3',
            lineWidth: 1,
            priceLineVisible: false,
          });
          ma20Series.setData(calculateMA(processedData, 20));
        }

        // 차트 범위 자동 조정
        chart.timeScale().fitContent();

        // 리사이즈 핸들러
        const handleResize = () => {
          if (chartContainerRef.current && chart) {
            chart.applyOptions({
              width: chartContainerRef.current.clientWidth,
            });
          }
        };

        window.addEventListener('resize', handleResize);

        return () => {
          window.removeEventListener('resize', handleResize);
        };
      } catch (err) {
        console.error('Chart creation error:', err);
      }
    };

    // 기존 차트 정리
    if (chartRef.current) {
      try {
        chartRef.current.remove();
        chartRef.current = null;
      } catch (err) {
        console.error('Error removing chart:', err);
      }
    }

    initChart();

    // 컴포넌트 언마운트 시 차트 정리
    return () => {
      if (chartRef.current) {
        try {
          chartRef.current.remove();
          chartRef.current = null;
        } catch (err) {
          console.error('Error cleaning up chart:', err);
        }
      }
    };
  }, [chartData, options.type, options.indicators]);

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="h-[400px] flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
        </div>
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="h-[400px] flex flex-col items-center justify-center text-red-500">
          <p>차트 데이터를 불러오는데 실패했습니다.</p>
          <p className="text-sm mt-2">{(error as Error).message}</p>
          <button 
            onClick={() => refetch()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg">
        <div className="p-4 border-b dark:border-gray-700">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                {stockName}
              </h2>
              <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {stockCode}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <ChartPeriodSelector 
                period={options.period}
                onChange={(period) => setOptions(prev => ({ ...prev, period }))}
              />
              <ChartTypeSelector 
                type={options.type}
                onChange={(type) => setOptions(prev => ({ ...prev, type }))}
              />
              <IndicatorSelector 
                selected={options.indicators}
                onChange={(indicators) => setOptions(prev => ({ ...prev, indicators }))}
              />
            </div>
          </div>
        </div>
        <div className="p-4">
          <div ref={chartContainerRef} className="h-[500px] w-full" />
        </div>
      </div>
      <TradingPanel
        stockCode={stockCode}
        stockName={stockName}
        currentPrice={chartData?.[0]?.종가 || 0}
      />
    </div>
  );
}

// 기술적 지표 계산 함수
const calculateIndicators = (data: any[], period: number) => {
  return data.map((entry, index) => {
    if (index < period - 1) return { ...entry, [`MA${period}`]: null };
    const sum = data.slice(index - period + 1, index + 1)
      .reduce((acc, curr) => acc + curr.종가, 0);
    return { ...entry, [`MA${period}`]: sum / period };
  });
};

// 기간 선택 컴포넌트
function ChartPeriodSelector({ period, onChange }: { 
  period: ChartPeriod; 
  onChange: (period: ChartPeriod) => void; 
}) {
  return (
    <div className="flex rounded-lg bg-gray-100 dark:bg-gray-700 p-1">
      {['1D', '1W', '1M', '3M', '6M', '1Y', '3Y', '5Y'].map((p) => (
        <button
          key={p}
          onClick={() => onChange(p as ChartPeriod)}
          className={`px-3 py-1 text-sm rounded-md transition-colors ${
            period === p
              ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow'
              : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          {p}
        </button>
      ))}
    </div>
  );
}

// 차트 타입 선택 컴포넌트
function ChartTypeSelector({ type, onChange }: {
  type: ChartType;
  onChange: (type: ChartType) => void;
}) {
  return (
    <div className="flex rounded-lg bg-gray-100 dark:bg-gray-700 p-1">
      <button
        onClick={() => onChange('line')}
        className={`px-3 py-1 text-sm rounded-md transition-colors ${
          type === 'line'
            ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow'
            : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
        }`}
      >
        라인
      </button>
      <button
        onClick={() => onChange('candle')}
        className={`px-3 py-1 text-sm rounded-md transition-colors ${
          type === 'candle'
            ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow'
            : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
        }`}
      >
        캔들
      </button>
    </div>
  );
}

// 지표 선택 컴포넌트
function IndicatorSelector({ selected, onChange }: {
  selected: TechnicalIndicator[];
  onChange: (indicators: TechnicalIndicator[]) => void;
}) {
  const indicators: TechnicalIndicator[] = ['MA5', 'MA20', 'MA60', 'MA120'];
  
  return (
    <div className="flex rounded-lg bg-gray-100 dark:bg-gray-700 p-1 space-x-1">
      {indicators.map((indicator) => (
        <button
          key={indicator}
          onClick={() => {
            if (selected.includes(indicator)) {
              onChange(selected.filter(i => i !== indicator));
            } else {
              onChange([...selected, indicator]);
            }
          }}
          className={`px-3 py-1 text-sm rounded-md transition-colors ${
            selected.includes(indicator)
              ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow'
              : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          {indicator}
        </button>
      ))}
    </div>
  );
}