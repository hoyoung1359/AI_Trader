'use client'

import { StockProvider } from './providers'
import { ReactNode } from 'react'

export default function ClientProvider({ children }: { children: ReactNode }) {
  return <StockProvider>{children}</StockProvider>
} 