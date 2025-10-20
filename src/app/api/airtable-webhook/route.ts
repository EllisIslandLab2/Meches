import { NextRequest, NextResponse } from 'next/server';

// This webhook is called by Airtable automation when order status changes to "Shipped"
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Airtable webhook sends record data
    // Extract the fields from the webhook payload
    const { orderId, email, customerName, trackingNumber, carrier, orderItems, status } = body;

    // Validate required fields
    if (!email || !orderId) {
      return NextResponse.json(
        { error: 'Email and order ID are required' },
        { status: 400 }
      );
    }

    // Only send email if status is "Shipped"
    if (status && status.toLowerCase() !== 'shipped') {
      console.log(`Order ${orderId} status is ${status}, not sending shipping notification`);
      return NextResponse.json({
        success: true,
        message: 'Status is not shipped, email not sent',
      });
    }

    // Parse order items if it's a string
    let items;
    if (typeof orderItems === 'string') {
      items = orderItems.split('\n').filter((item: string) => item.trim());
    } else {
      items = orderItems;
    }

    // Send shipping notification
    const emailResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'https://www.mechescreations.com'}/api/send-shipping-notification`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        orderId,
        customerName,
        trackingNumber,
        carrier: carrier || 'USPS',
        items,
      }),
    });

    if (!emailResponse.ok) {
      const errorData = await emailResponse.json();
      console.error('Failed to send shipping notification:', errorData);
      return NextResponse.json(
        { error: 'Failed to send shipping notification email' },
        { status: 500 }
      );
    }

    const emailData = await emailResponse.json();
    console.log('Shipping notification sent successfully:', emailData);

    return NextResponse.json({
      success: true,
      message: 'Shipping notification sent',
      emailData,
    });

  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { error: 'Internal server error processing webhook' },
      { status: 500 }
    );
  }
}
