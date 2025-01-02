'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase-client'

interface PriceAlertProps {
  symbol: string
  currentPrice: number
  userId: number
}

export default function PriceAlert({ symbol, currentPrice, userId }: PriceAlertProps) {
  const [targetPrice, setTargetPrice] = useState<number>(currentPrice)
  const [alertType, setAlertType] = useState<'above' | 'below'>('above')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { error } = await supabase
        .from('price_alerts')
        .insert({
          user_id: userId,
          symbol,
          target_price: targetPrice,
          alert_type: alertType,
          current_price: currentPrice,
          status: 'active'
        })

      if (error) throw error

      alert('가격 알림이 설정되었습니다.')
    } catch (error) {
      console.error('알림 설정 실패:', error)
      alert('알림 설정에 실패했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="label">알림 유형</label>
        <select
          className="input"
          value={alertType}
          onChange={(e) => setAlertType(e.target.value as 'above' | 'below')}
        >
          <option value="above">이상일 때</option>
          <option value="below">이하일 때</option>
        </select>
      </div>

      <div>
        <label className="label">목표가</label>
        <input
          type="number"
          className="input"
          value={targetPrice}
          onChange={(e) => setTargetPrice(Number(e.target.value))}
          min={0}
        />
      </div>

      <button
        type="submit"
        className="btn btn-primary w-full"
        disabled={isLoading}
      >
        {isLoading ? '설정 중...' : '알림 설정'}
      </button>
    </form>
  )
} 