import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sourceId, amountMoney, customerInfo, cart, totals } = body;

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

    // Log order to Airtable (non-blocking - don't fail payment if Airtable fails)
    try {
      const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
      const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
      const ORDERS_TABLE = process.env.ORDERS_TABLE;

      if (AIRTABLE_API_KEY && AIRTABLE_BASE_ID && ORDERS_TABLE) {
        // Generate unique order ID
        const orderId = squareData.payment?.id || `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

        // Format shipping address
        const shippingAddress = customerInfo
          ? `${customerInfo.address}\n${customerInfo.city}, ${customerInfo.state} ${customerInfo.zipCode}`
          : '';

        // Format order items
        let orderItems = '';
        if (cart && Array.isArray(cart)) {
          orderItems = cart.map((item: any) => {
            const price = typeof item.price === 'number' ? item.price : 0;
            const quantity = typeof item.quantity === 'number' ? item.quantity : 0;
            return `${item.name} (${item.variant}) x${quantity} @ $${price.toFixed(2)}`;
          }).join('\n');
        }

        // Calculate totals (use provided totals or calculate from amountMoney)
        const subtotal = totals?.subtotal || 0;
        const shipping = totals?.shipping || 0;
        const tax = totals?.estimatedTax || 0;
        const discount = totals?.discount || 0;
        const total = amountMoney.amount / 100; // Convert cents to dollars

        // Create Airtable record
        const airtableUrl = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${ORDERS_TABLE}`;
        const airtableResponse = await fetch(airtableUrl, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            fields: {
              'Order ID': orderId,
              'Customer Name': customerInfo ? `${customerInfo.firstName} ${customerInfo.lastName}` : '',
              'Email': customerInfo?.email || '',
              'Phone': customerInfo?.phone || '',
              'Address': shippingAddress,
              'Order Items': orderItems,
              'Subtotal': subtotal,
              'Shipping': shipping,
              'Tax': tax,
              'Discount': discount,
              'Total': total,
              'Payment Status': 'Paid',
              'Order Date': new Date().toISOString().split('T')[0], // Format as YYYY-MM-DD
              'Payment ID': squareData.payment?.id || '',
              'Payment Token': sourceId || ''
            }
          })
        });

        if (!airtableResponse.ok) {
          const airtableError = await airtableResponse.json();
          console.error('Airtable logging failed (non-critical):', airtableError);
        } else {
          console.log('Order logged to Airtable successfully');
        }

        // Send order confirmation email (non-blocking)
        try {
          const emailResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'https://www.mechescreations.com'}/api/send-order-confirmation`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: customerInfo?.email,
              orderId: orderId,
              customerName: customerInfo ? `${customerInfo.firstName} ${customerInfo.lastName}` : '',
              items: cart,
              totals: {
                subtotal: subtotal,
                shipping: shipping,
                estimatedTax: tax,
                discount: discount,
                total: total,
              }
            }),
          });

          if (!emailResponse.ok) {
            console.error('Failed to send confirmation email (non-critical)');
          } else {
            console.log('Order confirmation email sent successfully');
          }
        } catch (emailError) {
          console.error('Email sending error (non-critical):', emailError);
        }

      } else {
        console.warn('Airtable not configured - skipping order logging');
      }
    } catch (airtableError) {
      // Log but don't fail the payment
      console.error('Airtable logging error (non-critical):', airtableError);
    }

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
