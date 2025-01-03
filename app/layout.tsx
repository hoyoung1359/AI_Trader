import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Virtual Trader',
  description: 'KOSPI 주식 거래 시뮬레이터',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body suppressHydrationWarning={true}>
        {children}
      </body>
    </html>
  )
} 