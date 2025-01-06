'use client';

export default function MarketOverview() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
      <h3 className="text-lg font-semibold mb-4">시장 동향</h3>
      <div className="space-y-4">
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600 dark:text-gray-400">KOSPI</span>
            <span className="text-red-500 font-semibold">+2.34%</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full">
            <div className="h-2 bg-red-500 rounded-full" style={{ width: '70%' }}></div>
          </div>
        </div>
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600 dark:text-gray-400">KOSDAQ</span>
            <span className="text-blue-500 font-semibold">-1.12%</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full">
            <div className="h-2 bg-blue-500 rounded-full" style={{ width: '45%' }}></div>
          </div>
        </div>
        <div className="pt-4 border-t">
          <h4 className="text-sm font-semibold mb-3">업종별 등락</h4>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">전기전자</span>
              <span className="text-red-500">+3.45%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">화학</span>
              <span className="text-blue-500">-0.89%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">금융업</span>
              <span className="text-red-500">+1.23%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 