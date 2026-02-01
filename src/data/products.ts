// New simplified product structure for Airtable
export interface Product {
  id: string; // Airtable record ID
  name: string;
  price: number;
  images: string[]; // Array of image URLs for carousel support
  category: string; // Groups products into cards (e.g., "Cowgirl Earrings")
  description: string;
  variant_name: string; // Individual variant identifier (e.g., "Cowgirl", "Star")
  is_default_variant: boolean; // Default variant for the category
  display: boolean; // Show/hide product
  selector_label: string; // "Color", "Type", etc. (consolidated from selector_type and selector_label)
  seasons: string[]; // Array of seasons/holidays when this product is relevant
  stock_quantity: number; // Available inventory for this variant
  created_time?: string; // Airtable timestamp
  updated_time?: string; // Airtable timestamp
}

// Grouped product structure for frontend display
export interface ProductGroup {
  category: string;
  name: string;
  price: number;
  description: string;
  variants: Product[];
  defaultVariant: Product;
  selectorLabel: string; // Consolidated selector label
}

// Static fallback data in new structure (for development/testing)
export const sampleProducts: Product[] = [
  // Cowgirl Earrings Category
  {
    id: "rec1",
    name: "Handmade Earrings - Cowgirl Style",
    price: 8.99,
    images: ["/assets/images/earrings-cowgirl-rbw.JPG"],
    category: "Cowgirl Earrings",
    description: "Beautiful handcrafted cowgirl and star earrings",
    variant_name: "Cowgirl",
    is_default_variant: true,
    display: true,
    selector_label: "Type",
    seasons: ["summer"],
    stock_quantity: 3
  },
  {
    id: "rec2",
    name: "Handmade Earrings - Cowgirl Style",
    price: 8.99,
    images: ["/assets/images/earrings-star-usa.JPG"],
    category: "Cowgirl Earrings",
    description: "Beautiful handcrafted cowgirl and star earrings",
    variant_name: "Star",
    is_default_variant: false,
    display: true,
    selector_label: "Type",
    seasons: ["summer"],
    stock_quantity: 3
  },
  // Drip Style Earrings Category
  {
    id: "rec3",
    name: "Handmade Earrings - Drip Style",
    price: 13.99,
    images: ["/assets/images/earrings-drip-usabrn.JPG"],
    category: "Drip Style Earrings",
    description: "Beautiful drip-style earrings in multiple colors",
    variant_name: "Brown",
    is_default_variant: true,
    display: true,
    selector_label: "Color",
    seasons: ["fall"],
    stock_quantity: 3
  },
  {
    id: "rec4",
    name: "Handmade Earrings - Drip Style",
    price: 13.99,
    images: ["/assets/images/earrings-drip-usateal.JPG"],
    category: "Drip Style Earrings",
    description: "Beautiful drip-style earrings in multiple colors",
    variant_name: "Teal",
    is_default_variant: false,
    display: true,
    selector_label: "Color",
    seasons: ["fall"],
    stock_quantity: 3
  },
  // Floral Style Earrings Category
  {
    id: "rec5",
    name: "Handmade Earrings - Floral Style",
    price: 13.99,
    images: ["/assets/images/earrings-floral-red.JPG"],
    category: "Floral Style Earrings",
    description: "Elegant floral earrings in vibrant colors",
    variant_name: "Red",
    is_default_variant: true,
    display: true,
    selector_label: "Color",
    seasons: ["spring"],
    stock_quantity: 3
  },
  {
    id: "rec6",
    name: "Handmade Earrings - Floral Style",
    price: 13.99,
    images: ["/assets/images/earrings-floral-blue.JPG"],
    category: "Floral Style Earrings",
    description: "Elegant floral earrings in vibrant colors",
    variant_name: "Blue",
    is_default_variant: false,
    display: true,
    selector_label: "Color",
    seasons: ["spring"],
    stock_quantity: 3
  },
  // Decorative Style Earrings Category
  {
    id: "rec7",
    name: "Handmade Earrings - Decorative Style",
    price: 15.99,
    images: ["/assets/images/earrings-floral-bow-wp.JPG"],
    category: "Decorative Style Earrings",
    description: "Beautiful decorative earrings with bow and flower designs",
    variant_name: "Bow",
    is_default_variant: true,
    display: true,
    selector_label: "Type",
    seasons: ["winter"],
    stock_quantity: 3
  },
  {
    id: "rec8",
    name: "Handmade Earrings - Decorative Style",
    price: 15.99,
    images: ["/assets/images/earrings-floral-flower-blue.JPG"],
    category: "Decorative Style Earrings",
    description: "Beautiful decorative earrings with bow and flower designs",
    variant_name: "Flower",
    is_default_variant: false,
    display: true,
    selector_label: "Type",
    seasons: ["winter"],
    stock_quantity: 3
  },
  // Add some "all season" products - using existing image for now
  {
    id: "rec9",
    name: "Handmade Earrings - Classic Style",
    price: 12.99,
    images: ["/assets/images/earrings-cowgirl-rbw.JPG"],
    category: "Classic Style Earrings",
    description: "Timeless classic earrings suitable for any season",
    variant_name: "Gold",
    is_default_variant: true,
    display: true,
    selector_label: "Color",
    seasons: ["all"],
    stock_quantity: 3
  }
];

// Function to group products by category for display (supports multiple season selections)
export function groupProductsByCategory(products: Product[], selectedSeasons?: string[]): ProductGroup[] {
  const filtered = products
    .filter(product => product.display) // Only include products marked for display
    .filter(product => {
      // Products with no seasons are inactive and shouldn't display
      if (!product.seasons || product.seasons.length === 0) return false;

      // If no seasons selected, default to showing all products
      if (!selectedSeasons || selectedSeasons.length === 0) return true;

      // If "all" is in the selected seasons, show all products (that have at least one season)
      if (selectedSeasons.includes('all')) return true;

      // Show products that match ANY of the selected seasons OR have "all" season
      return selectedSeasons.some(selectedSeason =>
        product.seasons.includes(selectedSeason)
      ) || product.seasons.includes('all');
    });

  const grouped = filtered.reduce((acc, product) => {
    if (!acc[product.category]) {
      acc[product.category] = [];
    }
    acc[product.category].push(product);
    return acc;
  }, {} as Record<string, Product[]>);

  return Object.entries(grouped).map(([category, variants]) => {
    const defaultVariant = variants.find(v => v.is_default_variant) || variants[0];
    return {
      category,
      name: variants[0].name,
      price: variants[0].price,
      description: variants[0].description,
      variants,
      defaultVariant,
      selectorLabel: variants[0].selector_label
    };
  });
}

// Server-side function to fetch products from Airtable (for ISR)
export async function fetchProductsFromAirtableServer(): Promise<Product[]> {
  try {
    
    // Server-side only
    if (typeof window === 'undefined') {
      // Import the server-side Airtable functions dynamically to avoid client bundle
      const { fetchProductsFromAirtableDirect, transformAirtableRecord } = await import('@/lib/airtable-server');
      
      // Try to fetch from Airtable directly
      const airtableRecords = await fetchProductsFromAirtableDirect();
      
      if (airtableRecords && airtableRecords.length > 0) {
        // Transform Airtable records to our Product interface
        const products = airtableRecords.map(transformAirtableRecord);
        return products;
      }
    }
    
    // Fallback to sample data with proper structure
    return sampleProducts.map(product => ({
      ...product,
      created_time: new Date().toISOString(),
      updated_time: new Date().toISOString()
    }));
  } catch (error) {
    console.error('Server-side Airtable fetch failed:', error);
    return sampleProducts;
  }
}

// Function to fetch products from Airtable (client-side via API route)
export async function fetchProductsFromAirtable(): Promise<Product[]> {
  // During build time or server-side rendering, use server function
  if (typeof window === 'undefined') {
    return fetchProductsFromAirtableServer();
  }
  
  try {
    const response = await fetch('/api/airtable', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'get',
        formType: 'products',
        data: {}
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Failed to fetch products from Airtable:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });
      return sampleProducts; // Fallback to static data
    }

    const result = await response.json();
    
    // Transform Airtable records to our Product interface
    const products: Product[] = result.records.map((record: any) => {
      // Handle images array from Airtable attachments or fallback to single image
      let images: string[] = [];
      if (Array.isArray(record.fields.images)) {
        // Airtable attachment field returns array of {url, filename, ...}
        images = record.fields.images.map((img: any) => img.url || img);
      } else if (record.fields.image) {
        // Fallback to single image field for backwards compatibility
        let imagePath = record.fields.image;
        if (imagePath && !imagePath.startsWith('/') && !imagePath.startsWith('http')) {
          imagePath = '/' + imagePath;
        }
        images = [imagePath];
      }

      return {
        id: record.id,
        name: record.fields.name || '',
        price: record.fields.price || 0,
        images: images.length > 0 ? images : ['/assets/images/placeholder.jpg'],
        category: record.fields.category || '',
        description: record.fields.description || '',
        variant_name: record.fields.Select || record.fields.variant_name || '',
        is_default_variant: record.fields.is_default_variant || false,
        display: record.fields.display !== false, // Default to true if not set
        selector_label: record.fields.selector_label || 'Color',
        seasons: Array.isArray(record.fields.seasons)
          ? record.fields.seasons.map((s: string) => s.toLowerCase())
          : [],
        stock_quantity: record.fields.stock_quantity || 0,
        created_time: record.createdTime,
        updated_time: record.fields.last_modified_time
      };
    });

    return products;
  } catch (error) {
    console.error('Error fetching products:', error);
    return sampleProducts; // Fallback to static data
  }
}