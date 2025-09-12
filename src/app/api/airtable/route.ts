import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Get environment variables
    const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
    const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;

    if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
      return NextResponse.json(
        { error: 'Airtable configuration missing' },
        { status: 500 }
      );
    }

    // Parse request body
    const { action, data, formType } = await request.json();

    // Map form types to environment variables
    let AIRTABLE_TABLE_NAME;
    switch (formType) {
      case 'custom-order-form':
        AIRTABLE_TABLE_NAME = process.env.CUSTOM_TABLE;
        break;
      case 'general-contact-form':
        AIRTABLE_TABLE_NAME = process.env.INQUIRIES_TABLE;
        break;
      case 'customer-info':
        AIRTABLE_TABLE_NAME = process.env.ORDERS_TABLE;
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid form type' },
          { status: 400 }
        );
    }

    if (!AIRTABLE_TABLE_NAME) {
      return NextResponse.json(
        { error: 'Table configuration missing' },
        { status: 500 }
      );
    }

    const baseUrl = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_NAME}`;
    let response;

    switch (action) {
      case 'get':
        // Get all records or specific record
        const getUrl = data?.recordId ? `${baseUrl}/${data.recordId}` : baseUrl;
        response = await fetch(getUrl, {
          headers: {
            'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
            'Content-Type': 'application/json'
          }
        });
        break;

      case 'create':
        // Create new record
        response = await fetch(baseUrl, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            fields: data.fields
          })
        });
        break;

      case 'update':
        // Update existing record
        response = await fetch(`${baseUrl}/${data.recordId}`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            fields: data.fields
          })
        });
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

    const result = await response.json();

    if (!response.ok) {
      console.error('Airtable API error:', result);
      throw new Error(result.error?.message || 'Airtable API error');
    }

    return NextResponse.json(result);

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Internal server error',
        details: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}