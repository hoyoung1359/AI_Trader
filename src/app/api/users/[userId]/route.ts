import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase-client'

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', params.userId)
      .single()

    if (error) throw error

    return NextResponse.json(user)
  } catch (error) {
    console.error('Error fetching user:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    )
  }
} 