'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase-client'

interface AutoTradingRule {
  symbol: string
  buyPrice: number
  sellPrice: number
  quantity: number
  userId: number
}

interface AutoTradingProps {
  symbol: string
  currentPrice: number
  userId: number
}

export default function AutoTrading({ symbol, currentPrice, userId }: AutoTradingProps) {
  const [rule, setRule] = useState<Partial<AutoTradingRule>>({
    symbol,
    buyPrice: currentPrice,
    sellPrice: currentPrice,
    quantity: 1
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { error } = await supabase
        .from('auto_trading_rules')
        .insert({
          ...rule,
          user_id: userId,
          status: 'active'
        })

      if (error) throw error

      alert('자동매매 규칙이 설정되었습니다.')
    } catch (error) {
      console.error('자동매매 설정 실패:', error)
      alert('설정에 실패했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="label">매수가</label>
        <input
          type="number"
          className="input"
          value={rule.buyPrice}
          onChange={(e) => setRule({ ...rule, buyPrice: Number(e.target.value) })}
          min={0}
        />
      </div>

      <div>
        <label className="label">매도가</label>
        <input
          type="number"
          className="input"
          value={rule.sellPrice}
          onChange={(e) => setRule({ ...rule, sellPrice: Number(e.target.value) })}
          min={0}
        />
      </div>

      <div>
        <label className="label">수량</label>
        <input
          type="number"
          className="input"
          value={rule.quantity}
          onChange={(e) => setRule({ ...rule, quantity: Number(e.target.value) })}
          min={1}
        />
      </div>

      <button
        type="submit"
        className="btn btn-primary w-full"
        disabled={isLoading}
      >
        {isLoading ? '설정 중...' : '자동매매 설정'}
      </button>
    </form>
  )
} 