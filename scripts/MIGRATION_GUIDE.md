# Product Variants Migration Guide

This guide explains how to migrate from the old Products table to a new ProductVariants table where each color/material/type variation is a separate entry.

## Why This Migration?

The new structure makes it easier to:
- Add images for each specific variant (color, material, etc.)
- Track inventory for individual variants
- Manage product variations independently
- Add new variants without modifying existing records

## What Gets Created

### New Table: ProductVariants

Each row in this table represents a **single product variant**. For example:
- "Floral Earrings - Red" (one row)
- "Floral Earrings - Blue" (another row)
- "Floral Earrings - White" (another row)

### Schema Fields

| Field | Type | Description |
|-------|------|-------------|
| name | Text | Product name |
| price | Number | Price in dollars |
| images | Attachments | Product images (supports multiple) |
| category | Text | Groups variants together (e.g., "Floral Style Earrings") |
| description | Text | Product description |
| variant_name | Text | Specific variant (e.g., "Red", "Blue", "Silver") |
| Select | Text | Same as variant_name (for backwards compatibility) |
| is_default_variant | Checkbox | Which variant shows first |
| display | Checkbox | Show/hide on website |
| selector_label | Text | Dropdown label (e.g., "Color", "Type", "Metal") |
| seasons | Multiple Select | When to show (e.g., "summer", "all", "valentine") |
| stock_quantity | Number | Available inventory |
| last_modified_time | Last Modified Time | Auto-updated timestamp |

## Pre-Migration Checklist

- [ ] You have added `schema.bases:write` permission to your Airtable API token
- [ ] Your `.env.local` file has valid `AIRTABLE_API_KEY` and `AIRTABLE_BASE_ID`
- [ ] You have reviewed `scripts/product-variants-data.ts` and adjusted:
  - Product names
  - Prices
  - Descriptions
  - Variant names
  - Categories
  - Seasons
  - Stock quantities

## Running the Migration

```bash
npm run migrate:products
```

This will:
1. Create the new `ProductVariants` table in Airtable
2. Populate it with all product variants from `product-variants-data.ts`
3. Set up the proper schema with all required fields

## Post-Migration Steps

### 1. Upload Images to Airtable

The migration creates the records but **does not upload images** (they're local files). You need to:

1. Open your Airtable base in a web browser
2. Navigate to the `ProductVariants` table
3. For each record, upload the corresponding images:

| Variant | Image Path |
|---------|-----------|
| Cowgirl Rainbow | `/public/assets/images/earrings-cowgirl-rbw.JPG` |
| Star USA | `/public/assets/images/earrings-star-usa.JPG` |
| Drip Brown | `/public/assets/images/earrings-drip-usabrn.JPG` |
| Drip Teal | `/public/assets/images/earrings-drip-usateal.JPG` |
| ... | ... |

**Tip**: You can select multiple records and drag-drop images to batch upload.

### 2. Update Environment Variables

Add to your `.env.local`:

```bash
PRODUCTS_TABLE=ProductVariants
```

### 3. Verify the Data

1. Check that all variants are present in Airtable
2. Verify images are uploaded correctly
3. Confirm prices, descriptions, and seasons are correct

### 4. Test Your Application

```bash
npm run dev
```

Visit http://localhost:3000 and verify:
- Products display correctly
- Images load properly
- Variant selectors work
- Season filtering functions
- Cart and checkout work

### 5. Clean Up (Optional)

Once everything works:
- You can archive or delete the old `Products` table
- Remove unused sample data from `src/data/products.ts`

## Product Variants Summary

The migration includes **24 product variants** across **10 categories**:

1. **Cowgirl Earrings** (2 variants)
   - Cowgirl Rainbow
   - Star USA

2. **Drip Style Earrings** (2 variants)
   - Brown
   - Teal

3. **Floral Style Earrings** (3 variants)
   - Red
   - Blue
   - White

4. **Decorative Style Earrings** (2 variants)
   - Bow White/Pink
   - Flower Blue

5. **Heart Anchor Earrings** (3 variants)
   - Circle
   - Needle
   - Circle & Needle

6. **Heart Bow Earrings** (2 variants)
   - White
   - Green & White

7. **Heart Pearl Earrings** (2 variants)
   - Pink Light
   - Pink Dark

8. **Strawberry Earrings** (2 variants)
   - Silver
   - Silver & Gold (2 images)

## Troubleshooting

### Error: "Table already exists"

This is normal if you're re-running the migration. The script will skip table creation and proceed to populate data.

### Error: "Missing API permissions"

Ensure your Airtable API token has `schema.bases:write` permission. You can add this in your Airtable account settings.

### Images not showing on website

1. Verify images are uploaded to Airtable (not just paths)
2. Check that the `images` field type is "Attachments"
3. Ensure `USE_REAL_AIRTABLE=true` in your `.env.local`

### Products not displaying

1. Verify `display` is checked for all variants
2. Check that at least one `seasons` value is selected
3. Ensure `PRODUCTS_TABLE=ProductVariants` in `.env.local`

## Need to Add More Products?

Edit `scripts/product-variants-data.ts` and add new variant objects, then re-run the migration. The script handles duplicate prevention automatically.

## Rollback

If you need to revert:
1. Change `.env.local` back to `PRODUCTS_TABLE=Products`
2. Restart your application
3. Delete the `ProductVariants` table from Airtable (optional)
