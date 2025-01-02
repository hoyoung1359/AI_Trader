import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: '주식 가상매매 시뮬레이터',
  description: '주식 거래 시뮬레이션 및 분석 플랫폼',
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
          <nav className="bg-gray-800 text-white p-4">
            <div className="container mx-auto">
              <h1 className="text-xl font-bold">주식 가상매매 시뮬레이터</h1>
            </div>
          </nav>
          <main className="container mx-auto p-4">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  )
}
