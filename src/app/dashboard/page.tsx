'use client'

import { useState } from 'react'
import StockSearch from '@/components/StockSearch'
import { HiChartBar, HiCurrencyDollar, HiLightningBolt, HiTrendingUp } from 'react-icons/hi'

export default function DashboardPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold gradient-text">
          AI 기반 주식 거래 플랫폼
        </h1>
        <p className="text-gray-600 mt-2">
          실시간 시장 데이터와 AI 분석을 통한 스마트 투자
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="glass-card p-6">
          <div className="flex items-center mb-4">
            <HiChartBar className="w-6 h-6 text-blue-500" />
            <h2 className="ml-2 font-semibold">실시간 시장 동향</h2>
          </div>
          <p className="text-sm text-gray-600">
            KOSPI, KOSDAQ 실시간 모니터링
          </p>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center mb-4">
            <HiLightningBolt className="w-6 h-6 text-yellow-500" />
            <h2 className="ml-2 font-semibold">AI 투자 분석</h2>
          </div>
          <p className="text-sm text-gray-600">
            머신러닝 기반 종목 분석
          </p>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center mb-4">
            <HiCurrencyDollar className="w-6 h-6 text-green-500" />
            <h2 className="ml-2 font-semibold">포트폴리오 관리</h2>
          </div>
          <p className="text-sm text-gray-600">
            실시간 수익률 모니터링
          </p>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center mb-4">
            <HiTrendingUp className="w-6 h-6 text-purple-500" />
            <h2 className="ml-2 font-semibold">거래 시뮬레이션</h2>
          </div>
          <p className="text-sm text-gray-600">
            가상 투자로 전략 테스트
          </p>
        </div>
      </div>

      <div className="glass-card p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">종목 검색</h2>
        <StockSearch />
      </div>

      {/* 차트 및 분석 섹션 추가 예정 */}
    </div>
  )
} 