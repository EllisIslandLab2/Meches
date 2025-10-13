# Square Import - Airtable Schema Guide

## Current Airtable Fields (Already Have)
Your `Products` table currently has these fields:

| Field Name | Type | Description |
|------------|------|-------------|
| `id` | Record ID | Airtable auto-generated |
| `name` | Single line text | Product name |
| `price` | Number | Price in dollars |
| `image` | Attachment/URL | Product image |
| `category` | Single line text | Product category |
| `description` | Long text | Product description |
| `variant_name` | Single line text | Variant identifier (e.g., "Red", "Blue") |
| `is_default_variant` | Checkbox | Default variant for category |
| `display` | Checkbox | Show/hide on website |
| `selector_label` | Single line text | "Color", "Type", etc. |
| `seasons` | Multiple select | Seasons when product is relevant |
| `created_time` | Created time | Airtable timestamp |
| `updated_time` | Last modified | Airtable timestamp |

---

## Additional Fields Needed for Square Import

Add these **optional** fields to your Airtable `Products` table to enhance Square integration:

### Recommended Fields (High Priority)

| Field Name | Type | Default Value | Description |
|------------|------|---------------|-------------|
| `sku` | Single line text | Auto-generate from ID | Unique product identifier for Square |
| `weight_lb` | Number | 0.1 | Weight in pounds (for shipping) |
| `stock_quantity` | Number | 10 | Initial inventory count |
| `stock_alert_count` | Number | 3 | Alert when stock falls below this |
| `gtin` | Single line text | Empty | Barcode/GTIN if you have one |

### Optional Fields (Nice to Have)

| Field Name | Type | Default Value | Description |
|------------|------|---------------|-------------|
| `seo_title` | Single line text | Copy from `name` | SEO-optimized title |
| `seo_description` | Long text | Copy from `description` | SEO meta description |
| `shipping_enabled` | Checkbox | ✓ Checked | Enable shipping for this item |
| `online_visibility` | Single select | "Visible" | Square Online visibility |
| `item_type` | Single select | "Physical" | Physical or digital product |

---

## Square Import Template Mapping

### How Your Airtable Fields Map to Square

| Square Column | Airtable Field | Notes |
|---------------|----------------|-------|
| **Item Name** | `name` | Required |
| **SKU** | `sku` OR `id` | Use SKU if available, otherwise use Airtable ID |
| **Description** | `description` | Required |
| **Price** | `price` | Required |
| **Categories** | `category` | Used for organization |
| **Reporting Category** | `category` | Same as Categories |
| **Weight (lb)** | `weight_lb` OR default `0.1` | For shipping calculations |
| **Current Quantity** | `stock_quantity` OR default `10` | Initial inventory |
| **Stock Alert Count** | `stock_alert_count` OR default `3` | Low stock alert |
| **Item Type** | `item_type` OR default `Physical` | Physical vs Digital |
| **Square Online Visibility** | `online_visibility` OR default `Visible` | Show online |
| **Shipping Enabled** | `shipping_enabled` OR default `Y` | Enable shipping |
| **GTIN** | `gtin` | Optional barcode |
| **SEO Title** | `seo_title` OR `name` | For SEO |
| **SEO Description** | `seo_description` | For SEO |

### Fields Square Auto-Generates
- Reference Handle
- Token
- Permalink

### Fields Set to Defaults by Script
- Sellable: Y
- Stockable: Y
- Contains Alcohol: N
- Archived: N
- Self-serve Ordering: Y
- Delivery Enabled: N
- Pickup Enabled: N
- Skip Detail Screen: N

---

## Implementation Steps

### Option 1: Minimal Setup (Use Script Defaults)
**No Airtable changes needed!** The conversion script will use sensible defaults for all Square-required fields.

- SKU = Airtable ID
- Weight = 0.1 lb
- Stock = 10 units
- Alert = 3 units
- All items: Physical, Visible, Shipping Enabled

### Option 2: Full Control (Add Fields to Airtable)

1. **Go to your Airtable Products table**
2. **Add these fields** (click + to add column):
   - `sku` (Single line text)
   - `weight_lb` (Number, format: Decimal)
   - `stock_quantity` (Number, format: Integer)
   - `stock_alert_count` (Number, format: Integer)
   - `gtin` (Single line text, optional)

3. **Set default values**:
   - Click on each field → Set field description
   - Weight: "Weight in pounds for shipping (default: 0.1)"
   - Stock: "Initial inventory count (default: 10)"
   - Alert: "Low stock alert threshold (default: 3)"

4. **Fill in data** (or leave blank to use defaults):
   - SKU: Leave blank to auto-generate
   - Weight: 0.1 for earrings, adjust for heavier items
   - Stock: Your actual inventory count
   - Alert: When to notify you (3-5 is typical)

---

## Using the Conversion Script

Once fields are added (or skipped), run:

```bash
npm run square:import
```

This will:
1. Fetch all products from your Airtable
2. Transform to Square's format
3. Generate `Square_Import_Products.xlsx`
4. Show you a preview of what will be imported

Then upload the Excel file to Square Dashboard → Items & Orders → Import.

---

## Notes

- **Variants**: Your current structure has variants (Red, Blue, etc.). Square will import each as a separate "Item" since they have different images. If you want true variants in Square (one item, multiple options), you'll need to restructure your Airtable to have one row per category with all variant info in one row.

- **Images**: Square import doesn't support direct image upload via Excel. You'll need to add images manually in Square after import, or use Square's API for bulk image upload.

- **Tax**: Square calculates tax automatically based on customer location. You don't need to configure tax in the import.

- **Categories**: Your current categories (e.g., "Cowgirl Earrings") will become Square categories automatically.
