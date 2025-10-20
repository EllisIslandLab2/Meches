import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params;

    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }

    const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
    const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
    const ORDERS_TABLE = process.env.ORDERS_TABLE;

    if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID || !ORDERS_TABLE) {
      return NextResponse.json(
        { error: 'Airtable not configured' },
        { status: 500 }
      );
    }

    // Search for order by Order ID field
    const airtableUrl = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${ORDERS_TABLE}?filterByFormula={Order ID}='${orderId}'`;

    const response = await fetch(airtableUrl, {
      headers: {
        'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
      },
    });

    if (!response.ok) {
      console.error('Airtable API error:', response.status);
      return NextResponse.json(
        { error: 'Failed to fetch order' },
        { status: response.status }
      );
    }

    const data = await response.json();

    if (!data.records || data.records.length === 0) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Get the first matching record
    const record = data.records[0];
    const fields = record.fields;

    // Format the order data
    const order = {
      id: record.id,
      orderId: fields['Order ID'] || '',
      customerName: fields['Customer Name'] || '',
      email: fields['Email'] || '',
      phone: fields['Phone'] || '',
      address: fields['Address'] || '',
      orderItems: fields['Order Items'] || '',
      subtotal: fields['Subtotal'] || 0,
      shipping: fields['Shipping'] || 0,
      tax: fields['Tax'] || 0,
      discount: fields['Discount'] || 0,
      total: fields['Total'] || 0,
      paymentStatus: fields['Payment Status'] || '',
      orderDate: fields['Order Date'] || '',
      status: fields['Status'] || 'Pending',
      trackingNumber: fields['Tracking Number'] || '',
      carrier: fields['Carrier'] || '',
    };

    return NextResponse.json({ order });

  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
