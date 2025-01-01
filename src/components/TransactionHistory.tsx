import { useEffect, useState } from 'react'
import { fetchTransactions } from '@/services/api'

interface TransactionHistoryProps {
  userId: number
}

export default function TransactionHistory({ userId }: TransactionHistoryProps) {
  const [transactions, setTransactions] = useState([])

  useEffect(() => {
    loadTransactions()
  }, [userId])

  const loadTransactions = async () => {
    try {
      const data = await fetchTransactions()
      setTransactions(data)
    } catch (error) {
      console.error('거래 내역 로딩 실패:', error)
    }
  }

  return (
    <div className="border rounded p-4">
      <h2 className="text-xl font-bold mb-4">거래 내역</h2>
      {/* 거래 내역 내용 */}
    </div>
  )
} 