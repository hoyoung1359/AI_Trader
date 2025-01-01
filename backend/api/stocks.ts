import { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '../lib/supabase'
import { KoreaInvestmentAPI } from '../lib/korea-investment'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    const { query } = req.query
    
    try {
      const { data: stocks, error } = await supabase
        .from('stock_master')
        .select('*')
        .ilike('name', `%${query}%`)
        .limit(20)

      if (error) throw error

      // 주식 가격 정보 추가
      const api = new KoreaInvestmentAPI()
      const stocksWithPrices = await Promise.all(
        stocks.map(async (stock) => {
          const price = await api.getStockPrice(stock.symbol)
          return { ...stock, ...price }
        })
      )

      res.status(200).json(stocksWithPrices)
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch stocks' })
    }
  }
} 