// Script to create a new ProductVariants table in Airtable and migrate data
// This creates individual entries for each product variant (color, material, etc.)

import * as dotenv from 'dotenv';
import * as path from 'path';
import { productVariants } from './product-variants-data';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const OLD_TABLE_NAME = process.env.PRODUCTS_TABLE || 'Products';
const NEW_TABLE_NAME = 'ProductVariants';

if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
  console.error('❌ Missing required environment variables: AIRTABLE_API_KEY and AIRTABLE_BASE_ID');
  process.exit(1);
}

interface AirtableField {
  name: string;
  type: string;
  options?: any;
}

// Define the schema for the new ProductVariants table
const NEW_TABLE_SCHEMA: AirtableField[] = [
  { name: 'name', type: 'singleLineText' },
  { name: 'price', type: 'number', options: { precision: 2 } },
  { name: 'images', type: 'multipleAttachments' },
  { name: 'category', type: 'singleLineText' },
  { name: 'description', type: 'multilineText' },
  { name: 'variant_name', type: 'singleLineText' },
  { name: 'Select', type: 'singleLineText' }, // For backwards compatibility
  {
    name: 'is_default_variant',
    type: 'checkbox',
    options: {
      icon: 'check',
      color: 'greenBright'
    }
  },
  {
    name: 'display',
    type: 'checkbox',
    options: {
      icon: 'check',
      color: 'blueBright'
    }
  },
  { name: 'selector_label', type: 'singleLineText' },
  {
    name: 'seasons',
    type: 'multipleSelects',
    options: {
      choices: [
        { name: 'all' },
        { name: 'spring' },
        { name: 'summer' },
        { name: 'fall' },
        { name: 'winter' },
        { name: 'christmas' },
        { name: 'halloween' },
        { name: 'valentine' },
        { name: 'easter' }
      ]
    }
  },
  { name: 'stock_quantity', type: 'number', options: { precision: 0 } }
];

async function createTable() {
  console.log('🔧 Creating new ProductVariants table...');

  const url = `https://api.airtable.com/v0/meta/bases/${AIRTABLE_BASE_ID}/tables`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: NEW_TABLE_NAME,
      fields: NEW_TABLE_SCHEMA,
      description: 'Product variants table where each color/material/type is a separate entry'
    })
  });

  if (!response.ok) {
    const errorText = await response.text();

    // If table already exists, that's fine
    if (response.status === 422 && errorText.includes('already exists')) {
      console.log('✅ ProductVariants table already exists, skipping creation');
      return true;
    }

    console.error('❌ Failed to create table:', response.status, errorText);
    return false;
  }

  const result = await response.json();
  console.log('✅ Successfully created ProductVariants table:', result.id);
  return true;
}

async function fetchOldProducts() {
  console.log(`📥 Fetching products from ${OLD_TABLE_NAME} table...`);

  const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(OLD_TABLE_NAME)}`;

  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('❌ Failed to fetch products:', response.status, errorText);
    return null;
  }

  const data = await response.json();
  console.log(`✅ Fetched ${data.records?.length || 0} records from ${OLD_TABLE_NAME}`);
  return data.records || [];
}

async function populateNewTable() {
  console.log(`📤 Populating ${NEW_TABLE_NAME} table with variant data...`);
  console.log(`   Using ${productVariants.length} product variants from product-variants-data.ts`);

  const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(NEW_TABLE_NAME)}`;

  // Transform product variants data to Airtable format
  // For images: Airtable expects URLs or attachment objects
  // Since we're using local paths, we'll store them as text for now
  // You'll need to upload the actual images to Airtable manually or use the attachment API
  const newRecords = productVariants.map(variant => {
    return {
      fields: {
        name: variant.name,
        price: variant.price,
        // For now, store image paths as text. You'll need to upload actual images to Airtable
        // or convert these paths to URLs that Airtable can access
        // images: variant.images, // This would work if images were URLs
        category: variant.category,
        description: variant.description,
        variant_name: variant.variant_name,
        Select: variant.variant_name, // Duplicate for compatibility
        is_default_variant: variant.is_default_variant,
        display: variant.display,
        selector_label: variant.selector_label,
        seasons: variant.seasons,
        stock_quantity: variant.stock_quantity
      }
    };
  });

  // Airtable allows max 10 records per request
  const batchSize = 10;
  let successCount = 0;

  for (let i = 0; i < newRecords.length; i += batchSize) {
    const batch = newRecords.slice(i, i + batchSize);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        records: batch,
        typecast: true // Auto-convert types
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Failed to insert batch ${i / batchSize + 1}:`, response.status, errorText);
      continue;
    }

    const result = await response.json();
    successCount += result.records?.length || 0;
    console.log(`✅ Inserted batch ${i / batchSize + 1}: ${result.records?.length || 0} records`);

    // Rate limiting: wait a bit between batches
    if (i + batchSize < newRecords.length) {
      await new Promise(resolve => setTimeout(resolve, 250));
    }
  }

  console.log(`✅ Successfully populated ${successCount} records in ${NEW_TABLE_NAME}`);
  return successCount;
}

async function main() {
  console.log('🚀 Starting migration to ProductVariants table\n');

  // Step 1: Create the new table
  const tableCreated = await createTable();
  if (!tableCreated) {
    console.error('❌ Migration failed: Could not create table');
    process.exit(1);
  }

  console.log('');

  // Step 2: Populate new table with organized product variants
  await populateNewTable();

  console.log('\n✨ Migration complete!');
  console.log('\n📝 Next steps:');
  console.log('   1. Upload product images to Airtable:');
  console.log('      - Open your ProductVariants table in Airtable');
  console.log('      - For each record, click the "images" field and upload the corresponding image files');
  console.log('      - Image paths are listed in scripts/product-variants-data.ts');
  console.log('   2. Update your .env.local file:');
  console.log('      PRODUCTS_TABLE=ProductVariants');
  console.log('   3. Verify the data in Airtable');
  console.log('   4. Test your application with the new table');
  console.log('   5. Once confirmed working, you can delete or archive the old Products table');
}

main().catch(error => {
  console.error('❌ Migration failed with error:', error);
  process.exit(1);
});
