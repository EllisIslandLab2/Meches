import { NextRequest, NextResponse } from 'next/server';

// Vercel Edge Config: Enable caching at the edge
export const runtime = 'nodejs'; // Use Node.js runtime for Airtable API calls
// Removed force-dynamic to enable caching and reduce Airtable API calls
// ISR handles product updates, this route is for forms/orders only
export const maxDuration = 60; // Increase timeout to 60 seconds for Vercel

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
      case 'order':
        AIRTABLE_TABLE_NAME = process.env.ORDERS_TABLE;
        break;
      case 'products':
        AIRTABLE_TABLE_NAME = process.env.PRODUCTS_TABLE;
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

    // Helper function to make fetch requests with retry logic
    async function fetchWithRetry(url: string, options: RequestInit, maxRetries = 2): Promise<Response> {
      let lastError: Error | null = null;

      for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
          // Create abort controller with 25 second timeout per attempt
          const attemptController = new AbortController();
          const attemptTimeoutId = setTimeout(() => attemptController.abort(), 25000);

          const response = await fetch(url, {
            ...options,
            signal: attemptController.signal
          });

          clearTimeout(attemptTimeoutId);
          return response;
        } catch (error) {
          lastError = error instanceof Error ? error : new Error(String(error));

          // If this was the last attempt, throw the error
          if (attempt === maxRetries) {
            throw lastError;
          }

          // Otherwise, wait before retrying (exponential backoff)
          const delayMs = Math.min(1000 * Math.pow(2, attempt), 5000);
          await new Promise(resolve => setTimeout(resolve, delayMs));
        }
      }

      throw lastError || new Error('Failed to fetch from Airtable');
    }

    let response;

    switch (action) {
      case 'get':
        // Get all records or specific record
        const getUrl = data?.recordId ? `${baseUrl}/${data.recordId}` : baseUrl;
        response = await fetchWithRetry(getUrl, {
          headers: {
            'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
            'Content-Type': 'application/json'
          }
        });
        break;

      case 'create':
        // Create new record
        response = await fetchWithRetry(baseUrl, {
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
        response = await fetchWithRetry(`${baseUrl}/${data.recordId}`, {
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

    // Return with cache headers for Vercel Edge Network
    // Cache for 5 minutes, allow stale content for 1 hour while revalidating
    return NextResponse.json(result, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=3600',
      }
    });

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
