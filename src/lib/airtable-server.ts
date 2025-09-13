// Server-side Airtable integration for ISR
// This can be easily enabled when ready to use real Airtable data

interface AirtableConfig {
  apiKey: string;
  baseId: string;
  tableName: string;
}

const config: AirtableConfig = {
  apiKey: process.env.AIRTABLE_API_KEY || '',
  baseId: 'appxmdzOF0au72Z7d', // Your existing base ID
  tableName: 'Products' // Your existing table name
};

export async function fetchProductsFromAirtableDirect() {
  // Enable this when ready to use real Airtable data
  const USE_REAL_AIRTABLE = process.env.USE_REAL_AIRTABLE === 'true';
  
  if (!USE_REAL_AIRTABLE || !config.apiKey) {
    console.log('Using sample data for ISR (set USE_REAL_AIRTABLE=true to use real data)');
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
    console.log(`Successfully fetched ${data.records?.length || 0} products from Airtable`);
    
    return data.records || [];
  } catch (error) {
    console.error('Direct Airtable fetch failed:', error);
    return null; // Return null to use fallback data
  }
}

// Transform Airtable record to our Product interface
export function transformAirtableRecord(record: any) {
  return {
    id: record.id,
    name: record.fields.name || '',
    price: record.fields.price || 0,
    image: record.fields.image || '',
    category: record.fields.category || '',
    description: record.fields.description || '',
    variant_name: record.fields.variant_name || '',
    is_default_variant: record.fields.is_default_variant || false,
    display: record.fields.display !== false,
    selector_type: record.fields.selector_type || 'color',
    selector_label: record.fields.selector_label || 'Color',
    season: record.fields.season_new || record.fields.season || undefined,
    created_time: record.createdTime,
    updated_time: record.fields.last_modified_time
  };
}