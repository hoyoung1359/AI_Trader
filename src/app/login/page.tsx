'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import { HiOutlineMail, HiOutlineLockClosed, HiChartBar, HiCurrencyDollar } from 'react-icons/hi'
import Link from 'next/link'
import Image from 'next/image'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      router.push('/dashboard')
      router.refresh()
    } catch (err) {
      setError('로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.')
      console.error('Login error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* 왼쪽 섹션 - 로그인 폼 */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold gradient-text mb-2">
              Virtual Trader
            </h1>
            <p className="text-gray-600">
              가상 주식 거래로 실전 투자를 연습해보세요
            </p>
          </div>

          <form className="mt-8 space-y-6 glass-card p-8" onSubmit={handleLogin}>
            <div className="space-y-4">
              <div className="relative">
                <HiOutlineMail className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field pl-10"
                  placeholder="이메일"
                />
              </div>
              <div className="relative">
                <HiOutlineLockClosed className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pl-10"
                  placeholder="비밀번호"
                />
              </div>
            </div>

            {error && (
              <div className="text-danger text-sm text-center">{error}</div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full"
            >
              {isLoading ? '로그인 중...' : '로그인'}
            </button>

            <div className="flex items-center justify-between text-sm">
              <Link href="/register" className="text-primary hover:underline">
                회원가입
              </Link>
              <Link href="/forgot-password" className="text-primary hover:underline">
                비밀번호 찾기
              </Link>
            </div>
          </form>
        </div>
      </div>

      {/* 오른쪽 섹션 - 데코레이션 */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-primary to-blue-600 items-center justify-center p-8">
        <div className="text-white space-y-8">
          <div className="space-y-4 text-center">
            <h2 className="text-3xl font-bold">실전 투자 연습의 시작</h2>
            <p className="text-lg opacity-90">
              실시간 시장 데이터로 투자 전략을 테스트해보세요
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="glass-card p-6 animate-float">
              <HiChartBar className="w-8 h-8 mb-2" />
              <h3 className="font-bold mb-1">실시간 차트</h3>
              <p className="text-sm opacity-80">
                실시간 주가 변동을 분석하세요
              </p>
            </div>
            <div className="glass-card p-6 animate-float" style={{ animationDelay: '0.5s' }}>
              <HiCurrencyDollar className="w-8 h-8 mb-2" />
              <h3 className="font-bold mb-1">포트폴리오 관리</h3>
              <p className="text-sm opacity-80">
                투자 성과를 한눈에 확인하세요
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}