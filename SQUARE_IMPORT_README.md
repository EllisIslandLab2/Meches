# Square Import - Quick Start Guide

## What This Does

Automatically converts your Airtable products to Square's import format, so you can bulk import all your items into Square POS and Square Online.

---

## Quick Start (3 Steps)

### 1. Run the Conversion

```bash
npm run square:import
```

This will:
- ✅ Fetch all products from your Airtable
- ✅ Convert to Square's format
- ✅ Generate `Square_Import_Products.xlsx`
- ✅ Show you a preview

### 2. Upload to Square

1. Go to: https://squareup.com/dashboard
2. Click: **Items & Orders** → **Import**
3. Upload: `Square_Import_Products.xlsx`
4. Review the preview
5. Click: **Import**

### 3. Add Images (Manual Step)

Square doesn't support image import via Excel. After importing:
1. Go to each product in Square Dashboard
2. Click "Edit"
3. Upload images from your `/assets/images/` folder

---

## What Gets Imported

### From Your Airtable
- ✅ Product names
- ✅ Prices
- ✅ Descriptions
- ✅ Categories
- ✅ SKUs (or auto-generated from Airtable ID)
- ✅ Variants (each variant becomes a separate item)

### Auto-Generated Defaults
- Item Type: Physical
- Weight: 0.1 lb (perfect for earrings)
- Initial Stock: 10 units per item
- Stock Alert: 3 units (low stock warning)
- Shipping: Enabled
- Visibility: Visible on Square Online
- Tax: Auto-calculated by Square based on customer location

---

## Optional: Add More Fields to Airtable

For more control, you can add these fields to your Airtable `Products` table:

| Field Name | Type | Purpose |
|------------|------|---------|
| `sku` | Single line text | Custom SKU codes |
| `weight_lb` | Number | Actual product weight |
| `stock_quantity` | Number | Real inventory count |
| `stock_alert_count` | Number | Custom low stock alert |
| `gtin` | Single line text | Barcode/UPC code |

See `SQUARE_AIRTABLE_SCHEMA.md` for full details.

---

## Troubleshooting

### "Missing Airtable credentials"
- Check that `.env.local` exists
- Verify `AIRTABLE_API_KEY` and `AIRTABLE_BASE_ID` are set

### "Failed to fetch products"
- Verify your Airtable API key is valid
- Check the base ID is correct
- Ensure the `Products` table name matches

### "Import failed in Square"
- Check that all products have names
- Verify prices are valid numbers
- Ensure categories are consistent

---

## Notes

### About Variants
Your current Airtable structure treats each color/type as a separate product. After importing:
- Each variant will appear as a separate item in Square
- If you want true Square variants (one item, multiple options), you'll need to restructure after import in Square Dashboard

### About Categories
Your categories (e.g., "Cowgirl Earrings") will become Square categories automatically.

### About Tax
Square calculates sales tax automatically based on:
- Your Square account location
- Customer's shipping/billing address
- Current state/local tax rates

You don't need to configure tax rates!

---

## Support

For issues:
1. Check `SQUARE_AIRTABLE_SCHEMA.md` for field mapping details
2. Verify `.env.local` has correct credentials
3. Test with a small batch first (edit your Airtable view to show fewer products)

For Square-specific help:
- Square Dashboard: https://squareup.com/help
- Square Import Guide: https://squareup.com/help/us/en/article/6282
