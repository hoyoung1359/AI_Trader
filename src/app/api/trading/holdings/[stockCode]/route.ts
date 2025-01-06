import { NextResponse } from 'next/server';

interface MyRouteContext {
  params: Promise<{
    stockCode: string;
  }>;
}

export async function GET(_request: Request, context: MyRouteContext) {
  try {
    const { stockCode } = await context.params;
    
    const mockHolding = {
      code: stockCode,
      quantity: 0,
      average_price: 0,
      current_value: 0,
      profit_loss: 0,
      profit_loss_rate: 0
    };
    
    return NextResponse.json(mockHolding);
  } catch (error) {
    console.error('Error fetching holding:', error);
    return NextResponse.json(
      { error: 'Failed to fetch holding' },
      { status: 500 }
    );
  }
}