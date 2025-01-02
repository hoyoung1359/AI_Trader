import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables')
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    const { data: history, error } = await supabase
      .from('portfolio_history')
      .select('*')
      .eq('user_id', userId)
      .gte('date', startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
      .lte('date', endDate || new Date().toISOString().split('T')[0])
      .order('date', { ascending: true })

    if (error) throw error

    return NextResponse.json(history)
  } catch (error) {
    console.error('Portfolio performance error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch portfolio performance' },
      { status: 500 }
    )
  }
} 