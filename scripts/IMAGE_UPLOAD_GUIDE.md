# Image Upload Guide for ProductVariants

This guide shows which images to upload for each product variant in your Airtable ProductVariants table.

## How to Upload Images

1. Open your Airtable base: https://airtable.com
2. Navigate to the **ProductVariants** table
3. For each record below, click the **images** field (attachment column)
4. Drag and drop or click to upload the image file(s) listed

**Tip**: You can upload images in bulk by:
- Opening multiple file explorer windows
- Finding the image files in `/public/assets/images/`
- Dragging them directly to the corresponding Airtable row

---

## Image Upload Checklist

### Cowgirl Earrings

#### Cowgirl Rainbow
- [ ] `earrings-cowgirl-rbw.JPG`

#### Star USA
- [ ] `earrings-star-usa.JPG`

---

### Drip Style Earrings

#### Brown
- [ ] `earrings-drip-usabrn.JPG`

#### Teal
- [ ] `earrings-drip-usateal.JPG`

---

### Floral Style Earrings

#### Red
- [ ] `earrings-floral-red.JPG`

#### Blue
- [ ] `earrings-floral-blue.JPG`

#### White
- [ ] `earrings-floral-white.jpg`

---

### Decorative Style Earrings

#### Bow White/Pink
- [ ] `earrings-floral-bow-wp.JPG`

#### Flower Blue
- [ ] `earrings-floral-flower-blue.JPG`

---

### Heart Anchor Earrings

#### Circle
- [ ] `earings-heart-anchors-circle.JPG`

#### Needle
- [ ] `earings-heart-anchors-needle.JPG`

#### Circle & Needle
- [ ] `earings-heart-anchors-circle-needle.JPG`

---

### Heart Bow Earrings

#### White
- [ ] `earings-heart-bows-white.jpg`

#### Green & White
- [ ] `earings-heart-bows-green-white.jpg`

---

### Heart Pearl Earrings

#### Pink Light
- [ ] `earings-heart-pearls-pink1.jpg`

#### Pink Dark
- [ ] `earings-heart-pearls-pink2.JPG`

---

### Strawberry Earrings

#### Silver
- [ ] `earings-strawberry-silver.JPG`

#### Silver & Gold (Multiple Images)
- [ ] `earings-strawberry-silver-gold1.JPG`
- [ ] `earings-strawberry-silver-gold2.JPG`

---

## Finding the Image Files

All images are located in:
```
/home/ellisisland/maria-crafts-v2/public/assets/images/
```

You can open this folder in your file explorer and sort by name to find the images easily.

## After Uploading

Once all images are uploaded:

1. ✅ Verify each record has its image(s)
2. ✅ Check that `display` is checked for variants you want to show
3. ✅ Confirm `is_default_variant` is set for one variant per category
4. ✅ Ensure `seasons` are selected appropriately
5. ✅ Test your website: `npm run dev`

## Optional: Add Last Modified Time Field

If you want to track when records are updated:

1. In Airtable, click the **+** button to add a new field
2. Choose **Last modified time** as the field type
3. Name it `last_modified_time`
4. Select which fields to track (or select all)

This field will automatically update when you make changes to records.

## Troubleshooting

**Q: Can I upload images in a different format (PNG, WEBP)?**
A: Yes! Airtable supports most image formats. You may want to convert your JPG files to more modern formats like WEBP for better web performance.

**Q: Can I add multiple images to a single variant?**
A: Yes! The `images` field supports multiple attachments. This is useful for showing different angles or close-ups.

**Q: What if I don't have an image for a variant yet?**
A: You can leave the `images` field empty and add it later. The app will show a placeholder image.

**Q: Should I compress images before uploading?**
A: It's a good idea to optimize images for web (around 800-1200px wide, compressed to ~200KB or less) for faster page loads.
