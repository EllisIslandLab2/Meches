import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sourceId, amountMoney, customerInfo } = body;

    // Validate required fields
    if (!sourceId) {
      return NextResponse.json(
        { error: 'Payment token (sourceId) is required' },
        { status: 400 }
      );
    }

    if (!amountMoney || !amountMoney.amount || !amountMoney.currency) {
      return NextResponse.json(
        { error: 'Amount and currency are required' },
        { status: 400 }
      );
    }

    // Get Square access token from environment based on current environment
    const environment = process.env.NEXT_PUBLIC_SQUARE_ENVIRONMENT || 'sandbox';
    const accessToken = environment === 'production'
      ? process.env.SQUARE_ACCESS_TOKEN
      : process.env.SQUARE_ACCESS_TOKEN_SANDBOX;
    const locationId = process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID;

    if (!accessToken || !locationId) {
      console.error('Square credentials not configured for environment:', environment);
      console.error('Access token exists:', !!accessToken);
      console.error('Location ID exists:', !!locationId);
      return NextResponse.json(
        { error: 'Payment system not configured' },
        { status: 500 }
      );
    }

    // Call Square Payments API to create payment
    // Use sandbox endpoint for sandbox environment
    const apiUrl = environment === 'production'
      ? 'https://connect.squareup.com/v2/payments'
      : 'https://connect.squareupsandbox.com/v2/payments';

    const squareResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Square-Version': '2024-01-18',
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        source_id: sourceId,
        idempotency_key: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        amount_money: {
          amount: amountMoney.amount, // Amount in cents
          currency: amountMoney.currency,
        },
        location_id: locationId,
        // Optional: Add buyer information for better fraud detection
        ...(customerInfo && {
          buyer_email_address: customerInfo.email,
          billing_address: {
            address_line_1: customerInfo.address,
            locality: customerInfo.city,
            administrative_district_level_1: customerInfo.state,
            postal_code: customerInfo.zipCode,
            country: 'US',
            first_name: customerInfo.firstName,
            last_name: customerInfo.lastName,
          },
        }),
      }),
    });

    const squareData = await squareResponse.json();

    if (!squareResponse.ok) {
      console.error('Square API error:', squareData);
      return NextResponse.json(
        {
          error: 'Payment failed',
          details: squareData.errors || squareData
        },
        { status: squareResponse.status }
      );
    }

    // Payment successful
    console.log('Payment successful:', squareData.payment?.id);

    return NextResponse.json({
      success: true,
      payment: squareData.payment,
    });

  } catch (error) {
    console.error('Payment processing error:', error);
    return NextResponse.json(
      { error: 'Internal server error processing payment' },
      { status: 500 }
    );
  }
}
