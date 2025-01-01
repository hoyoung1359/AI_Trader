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
      const data = await fetchTransactions(userId)
      setTransactions(data)
    } catch (error) {
      console.error('거래 내역 로딩 실패:', error)
    }
  }

  return (
    <div className="border rounded p-4">
      <h2 className="text-xl font-bold mb-4">거래 내역</h2>
      {transactions.length === 0 ? (
        <p>거래 내역이 없습니다.</p>
      ) : (
        <div className="space-y-2">
          {transactions.map((tx: any) => (
            <div key={tx.id} className="flex justify-between p-2 border rounded">
              <div>
                <span className={tx.type === 'BUY' ? 'text-red-600' : 'text-blue-600'}>
                  {tx.type === 'BUY' ? '매수' : '매도'}
                </span>
                <span className="ml-2">{tx.stock_master.name}</span>
              </div>
              <div className="text-right">
                <div>{tx.quantity}주</div>
                <div className="text-sm text-gray-500">
                  {tx.price.toLocaleString()}원
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
} 