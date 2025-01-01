import { useEffect, useState } from 'react'
import { User } from '@/types'
import { getUser } from '@/services/api'

interface UserInfoProps {
  userId: number
}

export default function UserInfo({ userId }: UserInfoProps) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    loadUser()
  }, [userId])

  const loadUser = async () => {
    try {
      const userData = await getUser(userId)
      setUser(userData)
    } catch (error) {
      console.error('사용자 정보 로딩 실패:', error)
    }
  }

  if (!user) return null

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">계좌 정보</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-gray-600">사용자명</p>
          <p className="text-lg font-semibold">{user.username}</p>
        </div>
        <div>
          <p className="text-gray-600">보유 현금</p>
          <p className="text-lg font-semibold">{user.cash_balance.toLocaleString()}원</p>
        </div>
      </div>
    </div>
  )
} 