'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { useQuery } from '@tanstack/react-query';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface StockChartProps {
  stockCode: string;
  stockName: string;
  showOrderButtons?: boolean;
}

type ChartType = 'candlestick' | 'line';
type TimeFrame = '1m' | '5m' | '15m' | '30m' | '1h' | '1D' | '1W' | '1M';

interface ChartData {
  date: string;
  시가: number;
  고가: number;
  저가: number;
  종가: number;
  거래량: number;
}

const TIME_FRAMES: { value: TimeFrame; label: string; unit: 'minute' | 'day' | 'week' | 'month' }[] = [
  { value: '1m', label: '1분', unit: 'minute' },
  { value: '5m', label: '5분', unit: 'minute' },
  { value: '15m', label: '15분', unit: 'minute' },
  { value: '30m', label: '30분', unit: 'minute' },
  { value: '1h', label: '1시간', unit: 'minute' },
  { value: '1D', label: '일봉', unit: 'day' },
  { value: '1W', label: '주봉', unit: 'week' },
  { value: '1M', label: '월봉', unit: 'month' }
];

export default function StockChart({ stockCode, stockName, showOrderButtons = false }: StockChartProps) {
  const [chartType, setChartType] = useState<ChartType>('candlestick');
  const [timeFrame, setTimeFrame] = useState<TimeFrame>('1D');

  const { data: chartData, isLoading, error } = useQuery({
    queryKey: ['stockChart', stockCode, timeFrame],
    queryFn: async () => {
      const selectedTimeFrame = TIME_FRAMES.find(tf => tf.value === timeFrame);
      if (!selectedTimeFrame) throw new Error('Invalid time frame');

      const response = await fetch(
        `/api/stocks/chart?code=${stockCode}&period=${timeFrame}&unit=${selectedTimeFrame.unit}`,
        { credentials: 'include' }
      );
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch chart data');
      }
      
      return await response.json() as ChartData[];
    },
    staleTime: 1000 * 60,
    retry: 2,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[400px] text-red-500">
        데이터를 불러오는데 실패했습니다. 잠시 후 다시 시도해주세요.
      </div>
    );
  }

  if (!chartData || chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-[400px] text-gray-500">
        차트 데이터가 없습니다.
      </div>
    );
  }

  const selectedTimeFrame = TIME_FRAMES.find(tf => tf.value === timeFrame);
  const isIntraday = selectedTimeFrame?.unit === 'minute';

  const series = [
    {
      name: '주가',
      type: chartType,
      data: chartData.map(item => ({
        x: new Date(item.date).getTime(),
        y: [item.시가, item.고가, item.저가, item.종가]
      }))
    },
    {
      name: '거래량',
      type: 'bar',
      data: chartData.map(item => ({
        x: new Date(item.date).getTime(),
        y: item.거래량
      }))
    }
  ];

  const chartOptions = {
    chart: {
      type: chartType,
      height: 600,
      toolbar: {
        show: true,
        tools: {
          download: false,
          selection: true,
          zoom: true,
          zoomin: true,
          zoomout: true,
          pan: true,
          reset: true
        }
      },
      animations: {
        enabled: false
      },
      background: '#ffffff'
    },
    title: {
      text: `${stockName} (${stockCode})`,
      align: 'left' as const
    },
    grid: {
      borderColor: '#f1f1f1',
      xaxis: {
        lines: {
          show: true
        }
      },
      yaxis: {
        lines: {
          show: true
        }
      }
    },
    xaxis: {
      type: 'datetime' as const,
      labels: {
        datetimeUTC: false,
        format: isIntraday ? 'HH:mm' : 'yyyy-MM-dd',
        style: {
          colors: '#666',
          fontSize: '12px'
        }
      },
      axisBorder: {
        show: true,
        color: '#e0e0e0'
      },
      crosshairs: {
        show: true,
        width: 1,
        opacity: 0.5,
        stroke: {
          color: '#b6b6b6',
          width: 1,
          dashArray: 3,
        }
      }
    },
    yaxis: [
      {
        tooltip: {
          enabled: true
        },
        labels: {
          formatter: (value: number) => {
            return value ? value.toLocaleString() : '-';
          },
          style: {
            colors: '#666',
            fontSize: '12px'
          }
        },
        tickAmount: 8,
        axisBorder: {
          show: true,
          color: '#e0e0e0'
        }
      },
      {
        seriesName: '거래량',
        opposite: true,
        labels: {
          formatter: (value: number) => {
            return value ? `${(value / 1000).toFixed(0)}K` : '-';
          },
          style: {
            colors: '#666',
            fontSize: '12px'
          }
        },
        axisBorder: {
          show: true,
          color: '#e0e0e0'
        }
      }
    ],
    plotOptions: {
      candlestick: {
        colors: {
          upward: '#f53b57',   // 상승봉 색상
          downward: '#0abde3'  // 하락봉 색상
        },
        wick: {
          useFillColor: true,
        }
      },
      bar: {
        colors: {
          ranges: [{
            from: -1000000,
            to: 0,
            color: '#0abde3'
          }, {
            from: 0,
            to: 1000000,
            color: '#f53b57'
          }]
        }
      }
    },
    tooltip: {
      x: {
        format: isIntraday ? 'HH:mm' : 'yyyy-MM-dd'
      }
    }
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {TIME_FRAMES.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setTimeFrame(value)}
              className={`px-3 py-1 rounded ${
                timeFrame === value
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setChartType('candlestick')}
            className={`px-3 py-1 rounded ${
              chartType === 'candlestick'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            캔들
          </button>
          <button
            onClick={() => setChartType('line')}
            className={`px-3 py-1 rounded ${
              chartType === 'line'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            라인
          </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <Chart
          options={chartOptions}
          series={series}
          type={chartType}
          height={600}
        />
      </div>

      {showOrderButtons && (
        <div className="flex justify-center space-x-4 mt-4">
          <button className="px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600">
            매수
          </button>
          <button className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            매도
          </button>
        </div>
      )}
    </div>
  );
}