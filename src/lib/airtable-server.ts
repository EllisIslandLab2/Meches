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
    return null; // Return null to use fallback data
  }

  try {
    const url = `https://api.airtable.com/v0/${config.baseId}/${config.tableName}`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Airtable API error: ${response.status}`);
    }

    const data = await response.json();
    return data.records || [];
  } catch (error) {
    console.error('Direct Airtable fetch failed:', error);
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