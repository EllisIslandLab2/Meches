// Product Variants Data for Migration
// Each entry represents a single product variant (different color, material, type, etc.)
// Review and adjust this data before running the migration

export interface ProductVariant {
  name: string;
  price: number;
  images: string[]; // Array of image URLs/paths
  category: string; // Groups products into cards
  description: string;
  variant_name: string; // The specific variant (e.g., "Red", "Gold", "Heart")
  is_default_variant: boolean;
  display: boolean;
  selector_label: string; // "Color", "Type", "Material", etc.
  seasons: string[]; // e.g., ["spring"], ["summer"], ["all"], ["christmas"]
  stock_quantity: number;
}

export const productVariants: ProductVariant[] = [
  // ==================== Cowgirl/Star Earrings ====================
  {
    name: "Handmade Earrings - Cowgirl Style",
    price: 8.99,
    images: ["/assets/images/earrings-cowgirl-rbw.JPG"],
    category: "Cowgirl Earrings",
    description: "Beautiful handcrafted cowgirl and star earrings, perfect for summer events and patriotic occasions.",
    variant_name: "Cowgirl Rainbow",
    is_default_variant: true,
    display: true,
    selector_label: "Type",
    seasons: ["summer", "all"],
    stock_quantity: 3
  },
  {
    name: "Handmade Earrings - Star Style",
    price: 8.99,
    images: ["/assets/images/earrings-star-usa.JPG"],
    category: "Cowgirl Earrings",
    description: "Beautiful handcrafted cowgirl and star earrings, perfect for summer events and patriotic occasions.",
    variant_name: "Star USA",
    is_default_variant: false,
    display: true,
    selector_label: "Type",
    seasons: ["summer", "all"],
    stock_quantity: 3
  },

  // ==================== Drip Style Earrings ====================
  {
    name: "Handmade Earrings - Drip Style",
    price: 13.99,
    images: ["/assets/images/earrings-drip-usabrn.JPG"],
    category: "Drip Style Earrings",
    description: "Beautiful drip-style earrings in multiple colors, perfect for fall and patriotic themes.",
    variant_name: "Brown",
    is_default_variant: true,
    display: true,
    selector_label: "Color",
    seasons: ["fall", "all"],
    stock_quantity: 3
  },
  {
    name: "Handmade Earrings - Drip Style",
    price: 13.99,
    images: ["/assets/images/earrings-drip-usateal.JPG"],
    category: "Drip Style Earrings",
    description: "Beautiful drip-style earrings in multiple colors, perfect for fall and patriotic themes.",
    variant_name: "Teal",
    is_default_variant: false,
    display: true,
    selector_label: "Color",
    seasons: ["fall", "all"],
    stock_quantity: 3
  },

  // ==================== Floral Style Earrings ====================
  {
    name: "Handmade Earrings - Floral Style",
    price: 13.99,
    images: ["/assets/images/earrings-floral-red.JPG"],
    category: "Floral Style Earrings",
    description: "Elegant floral earrings in vibrant colors, perfect for spring and special occasions.",
    variant_name: "Red",
    is_default_variant: true,
    display: true,
    selector_label: "Color",
    seasons: ["spring", "all"],
    stock_quantity: 3
  },
  {
    name: "Handmade Earrings - Floral Style",
    price: 13.99,
    images: ["/assets/images/earrings-floral-blue.JPG"],
    category: "Floral Style Earrings",
    description: "Elegant floral earrings in vibrant colors, perfect for spring and special occasions.",
    variant_name: "Blue",
    is_default_variant: false,
    display: true,
    selector_label: "Color",
    seasons: ["spring", "all"],
    stock_quantity: 3
  },
  {
    name: "Handmade Earrings - Floral Style",
    price: 13.99,
    images: ["/assets/images/earrings-floral-white.jpg"],
    category: "Floral Style Earrings",
    description: "Elegant floral earrings in vibrant colors, perfect for spring and special occasions.",
    variant_name: "White",
    is_default_variant: false,
    display: true,
    selector_label: "Color",
    seasons: ["spring", "all"],
    stock_quantity: 3
  },

  // ==================== Decorative Style Earrings ====================
  {
    name: "Handmade Earrings - Decorative Style",
    price: 15.99,
    images: ["/assets/images/earrings-floral-bow-wp.JPG"],
    category: "Decorative Style Earrings",
    description: "Beautiful decorative earrings with bow and flower designs, elegant for any occasion.",
    variant_name: "Bow White/Pink",
    is_default_variant: true,
    display: true,
    selector_label: "Type",
    seasons: ["winter", "all"],
    stock_quantity: 3
  },
  {
    name: "Handmade Earrings - Decorative Style",
    price: 15.99,
    images: ["/assets/images/earrings-floral-flower-blue.JPG"],
    category: "Decorative Style Earrings",
    description: "Beautiful decorative earrings with bow and flower designs, elegant for any occasion.",
    variant_name: "Flower Blue",
    is_default_variant: false,
    display: true,
    selector_label: "Type",
    seasons: ["winter", "all"],
    stock_quantity: 3
  },

  // ==================== Heart Anchor Earrings ====================
  {
    name: "Handmade Earrings - Heart Anchor Style",
    price: 12.99,
    images: ["/assets/images/earings-heart-anchors-circle.JPG"],
    category: "Heart Anchor Earrings",
    description: "Unique heart and anchor design earrings, perfect for beach lovers and summer style.",
    variant_name: "Circle",
    is_default_variant: true,
    display: true,
    selector_label: "Type",
    seasons: ["summer", "all"],
    stock_quantity: 3
  },
  {
    name: "Handmade Earrings - Heart Anchor Style",
    price: 12.99,
    images: ["/assets/images/earings-heart-anchors-needle.JPG"],
    category: "Heart Anchor Earrings",
    description: "Unique heart and anchor design earrings, perfect for beach lovers and summer style.",
    variant_name: "Needle",
    is_default_variant: false,
    display: true,
    selector_label: "Type",
    seasons: ["summer", "all"],
    stock_quantity: 3
  },
  {
    name: "Handmade Earrings - Heart Anchor Style",
    price: 12.99,
    images: ["/assets/images/earings-heart-anchors-circle-needle.JPG"],
    category: "Heart Anchor Earrings",
    description: "Unique heart and anchor design earrings, perfect for beach lovers and summer style.",
    variant_name: "Circle & Needle",
    is_default_variant: false,
    display: true,
    selector_label: "Type",
    seasons: ["summer", "all"],
    stock_quantity: 3
  },

  // ==================== Heart Bow Earrings ====================
  {
    name: "Handmade Earrings - Heart Bow Style",
    price: 11.99,
    images: ["/assets/images/earings-heart-bows-white.jpg"],
    category: "Heart Bow Earrings",
    description: "Charming heart earrings with bow accents, perfect for romantic occasions and Valentine's Day.",
    variant_name: "White",
    is_default_variant: true,
    display: true,
    selector_label: "Color",
    seasons: ["valentine", "all"],
    stock_quantity: 3
  },
  {
    name: "Handmade Earrings - Heart Bow Style",
    price: 11.99,
    images: ["/assets/images/earings-heart-bows-green-white.jpg"],
    category: "Heart Bow Earrings",
    description: "Charming heart earrings with bow accents, perfect for romantic occasions and Valentine's Day.",
    variant_name: "Green & White",
    is_default_variant: false,
    display: true,
    selector_label: "Color",
    seasons: ["valentine", "all"],
    stock_quantity: 3
  },

  // ==================== Heart Pearl Earrings ====================
  {
    name: "Handmade Earrings - Heart Pearl Style",
    price: 14.99,
    images: ["/assets/images/earings-heart-pearls-pink1.jpg"],
    category: "Heart Pearl Earrings",
    description: "Elegant heart earrings with pearl accents in beautiful pink tones, perfect for special occasions.",
    variant_name: "Pink Light",
    is_default_variant: true,
    display: true,
    selector_label: "Shade",
    seasons: ["spring", "valentine", "all"],
    stock_quantity: 3
  },
  {
    name: "Handmade Earrings - Heart Pearl Style",
    price: 14.99,
    images: ["/assets/images/earings-heart-pearls-pink2.JPG"],
    category: "Heart Pearl Earrings",
    description: "Elegant heart earrings with pearl accents in beautiful pink tones, perfect for special occasions.",
    variant_name: "Pink Dark",
    is_default_variant: false,
    display: true,
    selector_label: "Shade",
    seasons: ["spring", "valentine", "all"],
    stock_quantity: 3
  },

  // ==================== Strawberry Earrings ====================
  {
    name: "Handmade Earrings - Strawberry Style",
    price: 10.99,
    images: ["/assets/images/earings-strawberry-silver.JPG"],
    category: "Strawberry Earrings",
    description: "Sweet strawberry design earrings in silver and gold finishes, perfect for summer fun.",
    variant_name: "Silver",
    is_default_variant: true,
    display: true,
    selector_label: "Metal",
    seasons: ["summer", "all"],
    stock_quantity: 3
  },
  {
    name: "Handmade Earrings - Strawberry Style",
    price: 10.99,
    images: [
      "/assets/images/earings-strawberry-silver-gold1.JPG",
      "/assets/images/earings-strawberry-silver-gold2.JPG"
    ],
    category: "Strawberry Earrings",
    description: "Sweet strawberry design earrings in silver and gold finishes, perfect for summer fun.",
    variant_name: "Silver & Gold",
    is_default_variant: false,
    display: true,
    selector_label: "Metal",
    seasons: ["summer", "all"],
    stock_quantity: 3
  }
];

// Export count for verification
export const TOTAL_VARIANTS = productVariants.length;
export const TOTAL_CATEGORIES = new Set(productVariants.map(p => p.category)).size;

console.log(`📊 Product Variants Summary:`);
console.log(`   Total Variants: ${TOTAL_VARIANTS}`);
console.log(`   Total Categories: ${TOTAL_CATEGORIES}`);
console.log(`   Categories:`, Array.from(new Set(productVariants.map(p => p.category))));
