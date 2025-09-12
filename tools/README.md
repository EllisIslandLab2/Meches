# Product Import Tool

This CLI tool simplifies importing products from Airtable by converting simple variant formats to the complex structure required by your Next.js application.

## Quick Start

1. **Export data from Airtable** as JSON with the simple format
2. **Run the processor**: `node product-processor.js input.json output.json`
3. **Copy the processed data** to your `src/data/products.ts` file

## Usage

```bash
# Basic processing
node product-processor.js airtable-export.json processed-products.json

# Group products by category
node product-processor.js airtable-export.json grouped-products.json --group-by-category

# Show help
node product-processor.js --help
```

## Input Format (Simple)

Instead of the complex format you currently use:
```json
{
  "cowgirl": {
    "image": "assets/images/earrings-cowgirl-rbw.JPG",
    "name": "Cowgirl"
  }
}
```

You can now use this simple format in Airtable:
```json
[
  {
    "id": 1,
    "name": "Handmade Earrings - Cowgirl Style",
    "price": 8.99,
    "category": "earrings",
    "description": "Beautiful handcrafted cowgirl and star earrings",
    "variants": "Cowgirl, /assets/images/earrings-cowgirl-rbw.JPG; Star, /assets/images/earrings-star-usa.JPG",
    "defaultVariant": "cowgirl",
    "selectorType": "type",
    "selectorLabel": "Type"
  }
]
```

## Output Format

The tool automatically converts to your application's format:
```json
[
  {
    "id": 1,
    "name": "Handmade Earrings - Cowgirl Style",
    "price": 8.99,
    "category": "earrings",
    "description": "Beautiful handcrafted cowgirl and star earrings",
    "variants": {
      "cowgirl": {
        "name": "Cowgirl",
        "image": "/assets/images/earrings-cowgirl-rbw.JPG"
      },
      "star": {
        "name": "Star",
        "image": "/assets/images/earrings-star-usa.JPG"
      }
    },
    "defaultVariant": "cowgirl",
    "selectorType": "type",
    "selectorLabel": "Type"
  }
]
```

## Variant Format Rules

- **Separate variants** with semicolons (`;`)
- **Each variant** follows: `Name, /path/to/image`
- **Variant keys** are auto-generated (lowercase, no spaces)
- **Example**: `"Red Rainbow, /assets/images/red.jpg; Blue Rainbow, /assets/images/blue.jpg"`

## Files

- `product-processor.js` - Main CLI tool
- `example-airtable-input.json` - Sample input format
- `example-processed-output.json` - Sample output format