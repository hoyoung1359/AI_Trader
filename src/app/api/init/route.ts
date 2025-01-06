import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    // stocks/sync API 호출
    const response = await fetch(`${process.env.VERCEL_URL || 'http://localhost:3000'}/api/stocks/sync`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to initialize database');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Initialization error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to initialize' },
      { status: 500 }
    );
  }
} 