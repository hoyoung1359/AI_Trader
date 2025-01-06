import { ReactNode } from 'react';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* 상단 네비게이션 바 */}
      <nav className="fixed top-0 left-0 right-0 h-16 bg-white dark:bg-gray-800 shadow-sm z-50">
        <div className="h-full px-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-blue-600 dark:text-blue-400">AI Trader</h1>
          <div className="flex items-center space-x-4">
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
              <span className="text-xl">🔔</span>
            </button>
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
              <span className="text-xl">👤</span>
            </button>
          </div>
        </div>
      </nav>

      {/* 사이드바 */}
      <aside className="fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-white dark:bg-gray-800 shadow-sm">
        <nav className="p-4 space-y-1">
          <MenuItem icon="📊" label="대시보드" active />
          <MenuItem icon="📈" label="차트" />
          <MenuItem icon="💼" label="포트폴리오" />
          <MenuItem icon="⭐" label="관심종목" />
          <MenuItem icon="📱" label="실시간" />
          <MenuItem icon="⚙️" label="설정" />
        </nav>
      </aside>

      {/* 메인 컨텐츠 */}
      <main className="ml-64 pt-16 p-6">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}

function MenuItem({ icon, label, active = false }: { icon: string; label: string; active?: boolean }) {
  return (
    <a 
      href="#" 
      className={`
        flex items-center px-4 py-3 text-gray-700 dark:text-gray-200
        ${active ? 'bg-blue-50 dark:bg-blue-900/30 border-r-4 border-blue-500' : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'}
      `}
    >
      <span className="text-xl mr-3">{icon}</span>
      <span className="font-medium">{label}</span>
    </a>
  );
} 