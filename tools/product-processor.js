#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * CLI Tool for processing Airtable product data
 * Converts simple format to complex variant structure
 */

class ProductProcessor {
  constructor() {
    this.inputFile = '';
    this.outputFile = '';
    this.groupByCategory = false;
  }

  // Parse simple variant format: "Star, assets/images/earrings-star-usa.JPG"
  parseSimpleVariant(variantString) {
    const parts = variantString.split(',').map(part => part.trim());
    if (parts.length !== 2) {
      throw new Error(`Invalid variant format: ${variantString}. Expected: "Name, image/path"`);
    }

    const [name, imagePath] = parts;
    const key = name.toLowerCase().replace(/\s+/g, '');
    
    return {
      key,
      variant: {
        name,
        image: imagePath
      }
    };
  }

  // Convert simple format to complex JSON structure
  processVariants(simpleVariants) {
    const variants = {};
    
    // Handle multiple variants separated by semicolons
    const variantList = simpleVariants.split(';').map(v => v.trim()).filter(v => v);
    
    variantList.forEach(variantString => {
      try {
        const { key, variant } = this.parseSimpleVariant(variantString);
        variants[key] = variant;
      } catch (error) {
        console.warn(`Warning: ${error.message}`);
      }
    });

    return variants;
  }

  // Group products by category
  groupProductsByCategory(products) {
    const grouped = {};
    
    products.forEach(product => {
      const category = product.category || 'uncategorized';
      if (!grouped[category]) {
        grouped[category] = {
          id: `${category.toLowerCase().replace(/\s+/g, '-')}-collection`,
          name: `${category} Collection`,
          category: category,
          description: `Collection of ${category.toLowerCase()} items`,
          variants: {},
          products: []
        };
      }
      
      // Add individual product variants to the category collection
      Object.assign(grouped[category].variants, product.variants);
      grouped[category].products.push(product);
    });

    return Object.values(grouped);
  }

  // Process the input data
  processData(inputData) {
    let products;
    
    try {
      products = typeof inputData === 'string' ? JSON.parse(inputData) : inputData;
    } catch (error) {
      throw new Error(`Invalid JSON input: ${error.message}`);
    }

    if (!Array.isArray(products)) {
      throw new Error('Input data must be an array of products');
    }

    // Process each product
    const processedProducts = products.map(product => {
      const processed = { ...product };
      
      if (product.variants && typeof product.variants === 'string') {
        try {
          processed.variants = this.processVariants(product.variants);
        } catch (error) {
          console.warn(`Warning processing variants for product ${product.name || 'unknown'}: ${error.message}`);
          processed.variants = {};
        }
      }
      
      return processed;
    });

    // Group by category if requested
    if (this.groupByCategory) {
      return this.groupProductsByCategory(processedProducts);
    }

    return processedProducts;
  }

  // Main processing function
  async process(inputFile, outputFile, options = {}) {
    this.inputFile = inputFile;
    this.outputFile = outputFile;
    this.groupByCategory = options.groupByCategory || false;

    try {
      // Read input file
      if (!fs.existsSync(inputFile)) {
        throw new Error(`Input file not found: ${inputFile}`);
      }

      const inputData = fs.readFileSync(inputFile, 'utf8');
      console.log(`Processing ${inputFile}...`);

      // Process the data
      const processedData = this.processData(inputData);

      // Write output file
      const outputDir = path.dirname(outputFile);
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      fs.writeFileSync(outputFile, JSON.stringify(processedData, null, 2));
      console.log(`✅ Successfully processed ${processedData.length} items`);
      console.log(`📄 Output written to: ${outputFile}`);

      if (this.groupByCategory) {
        console.log(`📦 Products grouped by category`);
      }

    } catch (error) {
      console.error(`❌ Error: ${error.message}`);
      process.exit(1);
    }
  }
}

// CLI Interface
function showHelp() {
  console.log(`
🛠️  Product Import CLI Tool for Web Launch Academy

Usage:
  node product-processor.js <input-file> <output-file> [options]

Options:
  --group-by-category    Group products by their category field
  --help                 Show this help message

Examples:
  # Basic processing
  node product-processor.js products-raw.json products-processed.json

  # Group by category
  node product-processor.js products-raw.json products-grouped.json --group-by-category

Input Format Example:
[
  {
    "name": "Earrings Collection",
    "category": "jewelry",
    "description": "Handcrafted earrings",
    "variants": "Star, assets/images/earrings-star-usa.JPG; Cowgirl, assets/images/earrings-cowgirl-rbw.JPG"
  }
]

Output Format:
[
  {
    "name": "Earrings Collection",
    "category": "jewelry", 
    "description": "Handcrafted earrings",
    "variants": {
      "star": {
        "name": "Star",
        "image": "assets/images/earrings-star-usa.JPG"
      },
      "cowgirl": {
        "name": "Cowgirl", 
        "image": "assets/images/earrings-cowgirl-rbw.JPG"
      }
    }
  }
]
`);
}

// Main execution
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.length < 2) {
    showHelp();
    process.exit(0);
  }

  const inputFile = args[0];
  const outputFile = args[1];
  const options = {
    groupByCategory: args.includes('--group-by-category')
  };

  const processor = new ProductProcessor();
  processor.process(inputFile, outputFile, options);
}

module.exports = ProductProcessor;