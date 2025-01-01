import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase-client'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')

  if (!userId) {
    return NextResponse.json(
      { error: 'User ID is required' },
      { status: 400 }
    )
  }

  try {
    const { data: transactions, error } = await supabase
      .from('transactions')
      .select(`
        *,
        stock_master (
          name,
          market
        )
      `)
      .eq('user_id', userId)
      .order('timestamp', { ascending: false })
      .limit(50)

    if (error) throw error

    return NextResponse.json(transactions)
  } catch (error) {
    console.error('Error fetching transactions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch transactions' },
      { status: 500 }
    )
  }
} 