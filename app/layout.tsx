import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Virtual Trader',
  description: '주식 가상매매 프로그램',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  )
} 