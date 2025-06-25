// netlify/functions/airtable.js

exports.handler = async (event, context) => {
  // Add this at the very top of your function
  console.log('Function started');
  console.log('Environment check:', {
    hasApiKey: !!process.env.AIRTABLE_API_KEY,
    hasBaseId: !!process.env.AIRTABLE_BASE_ID,
    hasCustomTable: !!process.env.CUSTOM_TABLE,
    hasOrdersTable: !!process.env.ORDERS_TABLE,
    hasInquiriesTable: !!process.env.INQUIRIES_TABLE
  });

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    console.log('Method not allowed:', event.httpMethod);
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Get environment variables
    const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
    const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;

    // Parse request body
    const { action, data, formType } = JSON.parse(event.body);
    console.log('Parsed request:', { action, formType, dataKeys: Object.keys(data || {}) });
  
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
        console.log('Invalid form type:', formType);
        return {
          statusCode: 400,
          body: JSON.stringify({ error: 'Invalid form type' })
        };
    }

    console.log('Selected table:', AIRTABLE_TABLE_NAME);

    let response;
    const baseUrl = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_NAME}`;
    console.log('Base URL:', baseUrl);
    
    switch (action) {
      case 'get':
        // Get all records or specific record
        const getUrl = data?.recordId ? `${baseUrl}/${data.recordId}` : baseUrl;
        console.log('Making GET request to:', getUrl);
        response = await fetch(getUrl, {
          headers: {
            'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
            'Content-Type': 'application/json'
          }
        });
        break;

      case 'create':
        // Create new record
        console.log('Making CREATE request with data:', data.fields);
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
        console.log('Making UPDATE request to:', `${baseUrl}/${data.recordId}`);
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
        console.log('Invalid action:', action);
        return {
          statusCode: 400,
          body: JSON.stringify({ error: 'Invalid action' })
        };
    }

    console.log('Response status:', response.status);
    const result = await response.json();
    console.log('Response data:', result);

    if (!response.ok) {
      console.error('Airtable API error:', result);
      throw new Error(result.error?.message || 'Airtable API error');
    }

    console.log('Success! Returning result');
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: JSON.stringify(result)
    };

  } catch (error) {
    console.error('Function error:', error.message);
    console.error('Error details:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: JSON.stringify({ error: error.message, details: error.stack })
    };
  }
};