import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

// 계좌 정보 조회
export async function GET() {
  try {
    // 임시로 인증 체크를 건너뛰고 기본 계정 생성
    const mockAccount = {
      balance: 10000000, // 1000만원
      total_profit: 0,
      total_trades: 0
    };
    
    return NextResponse.json(mockAccount);
  } catch (error) {
    console.error('Error fetching account:', error);
    return NextResponse.json(
      { error: 'Failed to fetch account' },
      { status: 500 }
    );
  }
}

// 초기 자금 설정
export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { initialBalance } = await request.json();

    const { error } = await supabase
      .from('virtual_accounts')
      .upsert({
        user_id: user.id,
        balance: initialBalance,
      }, {
        onConflict: 'user_id'
      });

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error setting initial balance:', error);
    return NextResponse.json(
      { error: 'Failed to set initial balance' },
      { status: 500 }
    );
  }
} 