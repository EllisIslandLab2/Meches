# ProductVariants Migration - Summary

## ✅ What Was Completed

### 1. Created New Airtable Table
- **Table Name**: `ProductVariants`
- **Table ID**: `tbl4IvHBlgHojetuF`
- **Records Created**: 18 product variants across 8 categories

### 2. Table Structure
Each product variant is now a separate row with these fields:
- `name` - Product name
- `price` - Price in dollars
- `images` - Multiple image attachments (needs manual upload)
- `category` - Groups variants together
- `description` - Product description
- `variant_name` - Specific variant identifier
- `Select` - Duplicate of variant_name for backwards compatibility
- `is_default_variant` - Which variant shows first (checkbox)
- `display` - Show/hide on website (checkbox)
- `selector_label` - Dropdown label (Color, Type, Metal, etc.)
- `seasons` - When to display (spring, summer, fall, winter, valentine, etc.)
- `stock_quantity` - Available inventory

### 3. Product Categories Created

1. **Cowgirl Earrings** (2 variants)
   - Cowgirl Rainbow ($8.99)
   - Star USA ($8.99)

2. **Drip Style Earrings** (2 variants)
   - Brown ($13.99)
   - Teal ($13.99)

3. **Floral Style Earrings** (3 variants)
   - Red ($13.99)
   - Blue ($13.99)
   - White ($13.99)

4. **Decorative Style Earrings** (2 variants)
   - Bow White/Pink ($15.99)
   - Flower Blue ($15.99)

5. **Heart Anchor Earrings** (3 variants)
   - Circle ($12.99)
   - Needle ($12.99)
   - Circle & Needle ($12.99)

6. **Heart Bow Earrings** (2 variants)
   - White ($11.99)
   - Green & White ($11.99)

7. **Heart Pearl Earrings** (2 variants)
   - Pink Light ($14.99)
   - Pink Dark ($14.99)

8. **Strawberry Earrings** (2 variants)
   - Silver ($10.99)
   - Silver & Gold ($10.99)

### 4. Configuration Updated
- `.env.local` now uses `PRODUCTS_TABLE=ProductVariants`
- `USE_REAL_AIRTABLE=true` (already set)

---

## 📋 Next Steps (Required)

### Immediate: Upload Product Images

**You must upload the actual image files to Airtable** for products to display on your website.

1. Open Airtable: https://airtable.com
2. Navigate to the `ProductVariants` table
3. Follow the checklist in: `scripts/IMAGE_UPLOAD_GUIDE.md`
4. Images are located in: `public/assets/images/`

**Estimated Time**: 10-15 minutes

---

### After Images: Test Your Website

```bash
npm run dev
```

Then verify:
- [ ] Products display correctly on homepage
- [ ] Images load properly
- [ ] Variant selectors work (Color/Type dropdowns)
- [ ] Season filtering works (if you have seasonal filtering enabled)
- [ ] Shopping cart functions
- [ ] Checkout process completes

---

## 📂 Files Created/Modified

### Created Files:
1. `scripts/migrate-to-product-variants.ts` - Migration script
2. `scripts/product-variants-data.ts` - Product data source
3. `scripts/MIGRATION_GUIDE.md` - Comprehensive migration documentation
4. `scripts/IMAGE_UPLOAD_GUIDE.md` - Image upload checklist
5. `MIGRATION_SUMMARY.md` - This file

### Modified Files:
1. `package.json` - Added `migrate:products` script
2. `.env.local` - Updated `PRODUCTS_TABLE=ProductVariants`

---

## 🔄 How to Add More Products Later

### Option 1: Add Directly in Airtable (Recommended)
1. Open ProductVariants table in Airtable
2. Click "+ Add record"
3. Fill in all fields:
   - name, price, category, description, variant_name
   - Upload images
   - Set is_default_variant, display, selector_label
   - Select seasons
   - Set stock_quantity
4. Save - appears immediately on website (ISR cache updates every 5 minutes)

### Option 2: Add to Data File and Re-run Migration
1. Edit `scripts/product-variants-data.ts`
2. Add new variant objects to the `productVariants` array
3. Run `npm run migrate:products`
4. Upload new images in Airtable

---

## 🛠 Available Scripts

```bash
# Run migration (safe to re-run, won't duplicate data)
npm run migrate:products

# Start development server
npm run dev

# Build for production
npm run build

# Import to Square (if using Square catalog sync)
npm run square:import
```

---

## 📊 Data Source

All product data is defined in `scripts/product-variants-data.ts`. This file:
- Documents all 18 product variants
- Specifies image paths
- Sets prices, descriptions, seasons
- Defines category groupings
- Controls which variants are default

**Tip**: Use this file as your "source of truth" for product data. You can edit it and re-run the migration to update Airtable.

---

## 🔒 Benefits of New Structure

### Before (Old Products Table):
- One product with multiple variants in arrays/complex fields
- Hard to manage individual variant images
- Difficult to track stock per variant
- Complex to add new color/material options

### After (New ProductVariants Table):
- Each variant is a simple, independent row
- Easy to add/upload images per variant
- Individual stock tracking
- Simple to add new variants (just add a new row)
- Better for inventory management
- Easier to filter and sort

---

## ❓ Troubleshooting

### Products not showing on website

**Check these in order:**
1. Are images uploaded in Airtable? (Required for display)
2. Is `display` checkbox checked for the variant?
3. Is at least one `seasons` value selected?
4. Is `USE_REAL_AIRTABLE=true` in `.env.local`?
5. Is `PRODUCTS_TABLE=ProductVariants` in `.env.local`?
6. Try clearing Next.js cache: `rm -rf .next && npm run dev`

### Images not loading

1. Verify images are actually uploaded to Airtable (not just paths)
2. Check Airtable permissions (table must be readable)
3. Verify image URLs in Airtable are publicly accessible
4. Check browser console for 404 errors

### Variant selector not showing

1. Ensure multiple variants exist in the same `category`
2. Verify `selector_label` is set (e.g., "Color", "Type")
3. Check that `variant_name` is different for each variant in the category

---

## 🔙 Rollback (If Needed)

If you need to revert to the old Products table:

1. Edit `.env.local`:
   ```bash
   PRODUCTS_TABLE=Products
   ```

2. Restart your development server:
   ```bash
   npm run dev
   ```

3. (Optional) Delete ProductVariants table in Airtable

---

## 📞 Support

- Migration Guide: `scripts/MIGRATION_GUIDE.md`
- Image Upload Checklist: `scripts/IMAGE_UPLOAD_GUIDE.md`
- Product Data: `scripts/product-variants-data.ts`
- Airtable Documentation: https://airtable.com/developers/web/api

---

## ✨ You're All Set!

The migration is complete. Once you upload the images to Airtable, your website will be ready with the new product variants system.

**Remember**: The new structure makes it much easier to:
- Add new product variants (just add a row)
- Manage images per variant
- Track inventory
- Organize products by season/category

Happy crafting! 🎨
