#!/usr/bin/env node
/**
 * Airtable to Square Import Converter
 *
 * This script fetches products from your Airtable and converts them
 * to Square's import format (Excel file).
 *
 * Usage: npm run square:import
 */

import * as XLSX from 'xlsx';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuration
const OUTPUT_FILE = 'Square_Import_Products.xlsx';
const LOCATION_NAME = 'Meches Creations';

// Default values for Square import
const DEFAULTS = {
  ITEM_TYPE: 'Physical',
  WEIGHT_LB: 0.1,
  STOCK_QUANTITY: 10,
  STOCK_ALERT: 3,
  VISIBILITY: 'Visible',
  SHIPPING_ENABLED: 'Y',
  SELLABLE: 'Y',
  STOCKABLE: 'Y',
  ARCHIVED: 'N',
  CONTAINS_ALCOHOL: 'N'
};

async function fetchProductsFromAirtable() {
  // Load environment variables
  const envPath = path.join(dirname(__dirname), '.env.local');
  const envContent = fs.readFileSync(envPath, 'utf8');
  const env = {};
  envContent.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length) {
      env[key.trim()] = valueParts.join('=').trim();
    }
  });

  const AIRTABLE_API_KEY = env.AIRTABLE_API_KEY;
  const AIRTABLE_BASE_ID = env.AIRTABLE_BASE_ID;
  const PRODUCTS_TABLE = env.PRODUCTS_TABLE || 'Products';

  if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
    throw new Error('Missing Airtable credentials in .env.local');
  }

  console.log('📡 Fetching products from Airtable...\n');

  const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${PRODUCTS_TABLE}`;

  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Airtable API error (${response.status}): ${error}`);
  }

  const data = await response.json();
  console.log(`✅ Fetched ${data.records.length} products from Airtable\n`);

  return data.records;
}

function transformToSquareFormat(airtableRecords) {
  console.log('🔄 Converting to Square format...\n');

  return airtableRecords.map(record => {
    const fields = record.fields;

    // Extract values with fallbacks
    const itemName = fields.name || 'Unnamed Product';
    const sku = fields.sku || record.id; // Use SKU field or fall back to Airtable ID
    const description = fields.description || `Handmade ${fields.category || 'craft item'}`;
    const price = fields.price ? parseFloat(fields.price).toFixed(2) : '0.00';
    const category = fields.category || 'Uncategorized';
    const weight = fields.weight_lb || DEFAULTS.WEIGHT_LB;
    const stockQty = fields.stock_quantity || DEFAULTS.STOCK_QUANTITY;
    const stockAlert = fields.stock_alert_count || DEFAULTS.STOCK_ALERT;
    const gtin = fields.gtin || '';
    const seoTitle = fields.seo_title || itemName;
    const seoDesc = fields.seo_description || '';
    const itemType = fields.item_type || DEFAULTS.ITEM_TYPE;
    const visibility = fields.online_visibility || DEFAULTS.VISIBILITY;
    const shippingEnabled = fields.shipping_enabled !== false ? DEFAULTS.SHIPPING_ENABLED : 'N';

    return {
      'Reference Handle': '',
      'Token': '',
      'Item Name': itemName,
      'Variation Name': fields.variant_name || '',
      'SKU': sku,
      'Description': description,
      'Categories': category,
      'Reporting Category': category,
      'SEO Title': seoTitle,
      'SEO Description': seoDesc,
      'Permalink': '',
      'GTIN': gtin,
      'Square Online Item Visibility': visibility,
      'Item Type': itemType,
      'Weight (lb)': weight.toString(),
      'Social Media Link Title': '',
      'Social Media Link Description': '',
      'Shipping Enabled': shippingEnabled,
      'Self-serve Ordering Enabled': 'Y',
      'Delivery Enabled': 'N',
      'Pickup Enabled': 'N',
      'Price': price,
      'Online Sale Price': '',
      'Archived': DEFAULTS.ARCHIVED,
      'Sellable': DEFAULTS.SELLABLE,
      'Contains Alcohol': DEFAULTS.CONTAINS_ALCOHOL,
      'Stockable': DEFAULTS.STOCKABLE,
      'Skip Detail Screen in POS': 'N',
      'Option Name 1': '',
      'Option Value 1': '',
      [`Current Quantity ${LOCATION_NAME}`]: stockQty.toString(),
      [`New Quantity ${LOCATION_NAME}`]: '',
      [`Stock Alert Enabled ${LOCATION_NAME}`]: 'Y',
      [`Stock Alert Count ${LOCATION_NAME}`]: stockAlert.toString()
    };
  });
}

function createSquareExcel(squareProducts) {
  console.log('📊 Creating Excel file...\n');

  const wb = XLSX.utils.book_new();

  // Square requires specific instruction rows at the top
  const instructionRows = [
    ['', '', '', ''],
    ['Instructions', '', '', ''],
    ['Fill in your catalog information below. Avoid common errors: 1) each row must have an item name; 2) items and variations must have the same category and description; 3) GTINs must be 8, 12, 13, or 14 digits; 4) items with option sets need both option name and value.', '', '', ''],
    ['', '', '', ''],
    ['', '', '', '']
  ];

  // Column headers (row 6)
  const headers = [
    'Reference Handle', 'Token', 'Item Name', 'Variation Name', 'SKU', 'Description',
    'Categories', 'Reporting Category', 'SEO Title', 'SEO Description', 'Permalink',
    'GTIN', 'Square Online Item Visibility', 'Item Type', 'Weight (lb)',
    'Social Media Link Title', 'Social Media Link Description', 'Shipping Enabled',
    'Self-serve Ordering Enabled', 'Delivery Enabled', 'Pickup Enabled', 'Price',
    'Online Sale Price', 'Archived', 'Sellable', 'Contains Alcohol', 'Stockable',
    'Skip Detail Screen in POS', 'Option Name 1', 'Option Value 1',
    `Current Quantity ${LOCATION_NAME}`, `New Quantity ${LOCATION_NAME}`,
    `Stock Alert Enabled ${LOCATION_NAME}`, `Stock Alert Count ${LOCATION_NAME}`
  ];

  // Convert product objects to arrays
  const dataRows = squareProducts.map(product =>
    headers.map(header => product[header] || '')
  );

  // Combine all rows
  const allRows = [...instructionRows, headers, ...dataRows];

  // Create worksheet
  const ws = XLSX.utils.aoa_to_sheet(allRows);

  // Set column widths for readability
  ws['!cols'] = [
    { wch: 15 }, // Reference Handle
    { wch: 10 }, // Token
    { wch: 35 }, // Item Name
    { wch: 20 }, // Variation Name
    { wch: 15 }, // SKU
    { wch: 50 }, // Description
    { wch: 20 }, // Categories
    { wch: 20 }, // Reporting Category
    { wch: 35 }, // SEO Title
  ];

  XLSX.utils.book_append_sheet(wb, ws, 'Items');

  // Write to file
  const outputPath = path.join(dirname(__dirname), OUTPUT_FILE);
  XLSX.writeFile(wb, outputPath);

  return outputPath;
}

function printSummary(squareProducts, outputPath) {
  console.log('✅ Conversion Complete!\n');
  console.log('═'.repeat(60));
  console.log(`📄 Output File: ${path.basename(outputPath)}`);
  console.log(`📦 Products Converted: ${squareProducts.length}`);
  console.log('═'.repeat(60));
  console.log('\n📋 Products Included:\n');

  squareProducts.forEach((product, idx) => {
    const variant = product['Variation Name'] ? ` (${product['Variation Name']})` : '';
    console.log(`   ${idx + 1}. ${product['Item Name']}${variant}`);
    console.log(`      Price: $${product['Price']} | SKU: ${product['SKU']} | Category: ${product['Categories']}`);
  });

  console.log('\n⚙️  Default Settings Applied:');
  console.log(`   • Item Type: ${DEFAULTS.ITEM_TYPE}`);
  console.log(`   • Weight: ${DEFAULTS.WEIGHT_LB} lb (for all items)`);
  console.log(`   • Initial Stock: ${DEFAULTS.STOCK_QUANTITY} units per item`);
  console.log(`   • Stock Alert: At ${DEFAULTS.STOCK_ALERT} units`);
  console.log(`   • Visibility: ${DEFAULTS.VISIBILITY}`);
  console.log(`   • Shipping: ${DEFAULTS.SHIPPING_ENABLED === 'Y' ? 'Enabled' : 'Disabled'}`);

  console.log('\n📤 Next Steps:');
  console.log('   1. Open Square Dashboard: https://squareup.com/dashboard');
  console.log('   2. Navigate to: Items & Orders → Import');
  console.log(`   3. Upload the file: ${path.basename(outputPath)}`);
  console.log('   4. Review the preview and click "Import"');
  console.log('   5. Add product images in Square (images must be added manually)');
  console.log('\n💡 Tips:');
  console.log('   • Square will auto-calculate taxes based on customer location');
  console.log('   • You can edit any product details in Square after import');
  console.log('   • Consider adding product images via Square dashboard or API');
  console.log('\n');
}

// Main execution
async function main() {
  try {
    console.log('\n🚀 Airtable to Square Converter\n');
    console.log('═'.repeat(60));

    // Step 1: Fetch from Airtable
    const airtableRecords = await fetchProductsFromAirtable();

    // Step 2: Transform to Square format
    const squareProducts = transformToSquareFormat(airtableRecords);

    // Step 3: Create Excel file
    const outputPath = createSquareExcel(squareProducts);

    // Step 4: Print summary
    printSummary(squareProducts, outputPath);

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('\nPlease check:');
    console.error('   • Your .env.local file has correct Airtable credentials');
    console.error('   • Your Airtable base and table names are correct');
    console.error('   • You have internet connection');
    console.error('\n');
    process.exit(1);
  }
}

main();
