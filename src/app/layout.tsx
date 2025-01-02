'use client'

import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'
import { useAuth } from '@/contexts/AuthContext'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import Notifications from '@/components/Notifications'

const inter = Inter({ subsets: ['latin'] })

function MainLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, signOut } = useAuth()
  const pathname = usePathname()
  const router = useRouter()

  const navItems = [
    { name: '홈', path: '/' },
    { name: '포트폴리오', path: '/portfolio' },
    { name: '거래내역', path: '/transactions' },
    { name: '관심종목', path: '/watchlist' },
  ]

  // 로딩 중일 때 로딩 표시
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="loading loading-lg"></div>
    </div>
  }

  // 로그인하지 않은 경우 로그인 페이지로 리다이렉트
  if (!user && pathname !== '/login') {
    router.push('/login')
    return null
  }

  // 로그인 페이지에서 이미 로그인한 경우 홈으로 리다이렉트
  if (user && pathname === '/login') {
    router.push('/')
    return null
  }

  // 로그인 페이지일 때는 사이드바 없이 표시
  if (pathname === '/login') {
    return children
  }

  return (
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
              <button 
                onClick={() => signOut()}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                로그아웃
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
      </div>
    </div>
  )
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <AuthProvider>
          <MainLayout>
            {children}
          </MainLayout>
        </AuthProvider>
      </body>
    </html>
  )
}
