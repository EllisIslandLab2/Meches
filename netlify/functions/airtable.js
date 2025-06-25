// netlify/functions/airtable.js

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  // Get environment variables
  const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
  const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;

  // Parse request body
  const { action, data, formType } = JSON.parse(event.body);
  
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
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid form type' })
      };
  }

  try {
    let response;
    const baseUrl = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_NAME}`;
    
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
        return {
          statusCode: 400,
          body: JSON.stringify({ error: 'Invalid action' })
        };
    }

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error?.message || 'Airtable API error');
    }

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
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: JSON.stringify({ error: error.message })
    };
  }
};