import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { type, stockCode, quantity, price } = await request.json();
    const totalAmount = quantity * price;

    // 트랜잭션 시작
    const { data: account, error: accountError } = await supabase
      .from('virtual_accounts')
      .select('balance')
      .eq('user_id', user.id)
      .single();

    if (accountError) throw accountError;

    if (type === 'buy') {
      if (account.balance < totalAmount) {
        return NextResponse.json({ error: '잔액이 부족합니다.' }, { status: 400 });
      }

      // 매수 처리
      const { error: buyError } = await supabase.rpc('execute_buy_order', {
        p_user_id: user.id,
        p_stock_code: stockCode,
        p_quantity: quantity,
        p_price: price
      });

      if (buyError) throw buyError;
    } else {
      // 매도 처리
      const { error: sellError } = await supabase.rpc('execute_sell_order', {
        p_user_id: user.id,
        p_stock_code: stockCode,
        p_quantity: quantity,
        p_price: price
      });

      if (sellError) throw sellError;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Trading error:', error);
    return NextResponse.json(
      { error: 'Failed to process order' },
      { status: 500 }
    );
  }
} 