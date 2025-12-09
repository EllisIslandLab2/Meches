// Server-side Airtable integration for ISR
// This can be easily enabled when ready to use real Airtable data

interface AirtableConfig {
  apiKey: string;
  baseId: string;
  tableName: string;
}

const config: AirtableConfig = {
  apiKey: process.env.AIRTABLE_API_KEY || '',
  baseId: process.env.AIRTABLE_BASE_ID || '',
  tableName: process.env.PRODUCTS_TABLE || 'Products'
};

export async function fetchProductsFromAirtableDirect() {
  // Enable this when ready to use real Airtable data
  const USE_REAL_AIRTABLE = process.env.USE_REAL_AIRTABLE === 'true';

  if (!USE_REAL_AIRTABLE || !config.apiKey) {
    console.log('Airtable fetch skipped - USE_REAL_AIRTABLE:', USE_REAL_AIRTABLE, 'has API key:', !!config.apiKey);
    return null; // Return null to use fallback data
  }

  try {
    const url = `https://api.airtable.com/v0/${config.baseId}/${encodeURIComponent(config.tableName)}`;

    console.log('Fetching from Airtable:', {
      url,
      baseId: config.baseId,
      tableName: config.tableName,
      hasApiKey: !!config.apiKey
    });

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json'
      },
      // Add these options to help with potential SSL/network issues in development
      cache: 'no-store',
      next: { revalidate: 0 }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Airtable Direct API error:', {
        status: response.status,
        statusText: response.statusText,
        url,
        error: errorText
      });
      throw new Error(`Airtable API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('Successfully fetched', data.records?.length || 0, 'products from Airtable');
    return data.records || [];
  } catch (error) {
    console.error('Direct Airtable fetch failed:', error);
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        name: error.name,
        cause: error.cause
      });
    }
    return null; // Return null to use fallback data
  }
}

// Transform Airtable record to our Product interface
export function transformAirtableRecord(record: any) {
  // Ensure image paths start with '/' for Next.js Image component
  let imagePath = record.fields.image || '';
  if (imagePath && !imagePath.startsWith('/') && !imagePath.startsWith('http')) {
    imagePath = '/' + imagePath;
  }
  
  return {
    id: record.id,
    name: record.fields.name || '',
    price: record.fields.price || 0,
    image: imagePath,
    category: record.fields.category || '',
    description: record.fields.description || '',
    variant_name: record.fields.variant_name || '',
    is_default_variant: record.fields.is_default_variant || false,
    display: record.fields.display !== false,
    selector_label: record.fields.selector_label || 'Color',
    seasons: Array.isArray(record.fields.seasons) ? record.fields.seasons : [],
    created_time: record.createdTime,
    updated_time: record.fields.last_modified_time
  };
}