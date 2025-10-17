import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const environment = process.env.NEXT_PUBLIC_SQUARE_ENVIRONMENT || 'sandbox';
    const accessToken = environment === 'production'
      ? process.env.SQUARE_ACCESS_TOKEN
      : process.env.SQUARE_ACCESS_TOKEN_SANDBOX;

    if (!accessToken) {
      return NextResponse.json(
        { error: 'Access token not configured' },
        { status: 500 }
      );
    }

    const apiUrl = environment === 'production'
      ? 'https://connect.squareup.com/v2/locations'
      : 'https://connect.squareupsandbox.com/v2/locations';

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Square-Version': '2024-01-18',
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Square API error:', data);
      return NextResponse.json(
        { error: 'Failed to fetch locations', details: data },
        { status: response.status }
      );
    }

    return NextResponse.json({
      environment,
      locations: data.locations || [],
    });

  } catch (error) {
    console.error('Error fetching locations:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
