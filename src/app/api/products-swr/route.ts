import { NextResponse } from 'next/server';
import { fetchProductsFromAirtableServer } from '@/data/products';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic'; // SWR endpoint always fetches fresh data

export async function GET() {
  try {
    const products = await fetchProductsFromAirtableServer();

    return NextResponse.json(products, {
      headers: {
        'Cache-Control': 'public, max-age=0, must-revalidate',
      }
    });
  } catch (error) {
    console.error('Products SWR endpoint error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}
