'use client'

import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import Notifications from '@/components/Notifications'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  const navItems = [
    { name: '홈', path: '/' },
    { name: '포트폴리오', path: '/portfolio' },
    { name: '거래내역', path: '/transactions' },
    { name: '관심종목', path: '/watchlist' },
  ]

  return (
    <html lang="ko">
      <body className={`${inter.className} bg-gray-50`}>
        <AuthProvider>
          <div className="min-h-screen flex">
            {/* 사이드바 */}
            <div className="w-64 bg-white shadow-lg">
              <div className="p-4">
                <h1 className="text-xl font-bold text-gray-800">
                  주식 가상매매
                </h1>
              </div>
              <nav className="mt-4">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={`block px-4 py-2 text-sm ${
                      pathname === item.path
                        ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>

            {/* 메인 콘텐츠 */}
            <div className="flex-1">
              <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                  <h1 className="text-2xl font-bold text-gray-900">
                    주식 가상매매 시뮬레이터
                  </h1>
                  <div className="flex items-center space-x-4">
                    <Notifications />
                    {/* 기존 헤더 컴포넌트들 */}
                  </div>
                </div>
              </header>

              <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
              </main>
            </div>
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}
