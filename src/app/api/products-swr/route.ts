import { NextResponse } from 'next/server';
import { fetchProductsFromAirtableServer } from '@/data/products';

export const runtime = 'nodejs';
// NOTE: This endpoint is no longer used by the frontend as of the ISR-only optimization
// ProductsClient now uses ISR-provided products exclusively to reduce Airtable API calls
// Keeping this endpoint for potential future use or debugging
// Cache for 5 minutes to match ISR revalidation if ever re-enabled
export const revalidate = 300;

export async function GET() {
  try {
    const products = await fetchProductsFromAirtableServer();

    return NextResponse.json(products, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
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
