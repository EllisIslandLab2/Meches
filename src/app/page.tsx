import ProductCard from '@/components/ProductCard';
import { sampleProducts, groupProductsByCategory, fetchProductsFromAirtableServer } from '@/data/products';
import Link from 'next/link';
import TimeBasedText from '@/components/TimeBasedText';
import GlassCard from '@/components/GlassCard';
import ProductsClient from '@/components/ProductsClient';
import type { Product } from '@/data/products';

// ISR: Revalidate every 5 minutes
export const revalidate = 300;

// Server-side data fetching with ISR
async function getProducts(): Promise<Product[]> {
  try {
    return await fetchProductsFromAirtableServer();
  } catch (error) {
    console.error('Failed to fetch products during build/revalidate:', error);
    return sampleProducts;
  }
}

export default async function Home() {
  // Pre-fetch products at build time / ISR time
  const products = await getProducts();
  return (
    <div>
      {/* Hero Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-5 text-center">
          <GlassCard className="p-8 mx-auto max-w-3xl" intensity="medium">
            <h2 className="text-4xl font-bold mb-4">
              <TimeBasedText variant="heading">
                Welcome to Meche's Handmade Crafts
              </TimeBasedText>
            </h2>
            <p className="text-xl mb-8">
              <TimeBasedText variant="paragraph">
                Discover unique, handcrafted jewelry and laser-cut wooden designs made with love and attention to detail. 
                Each piece is carefully crafted to bring beauty and personality to your everyday life.
              </TimeBasedText>
            </p>
            <Link
              href="#products"
              className="inline-block bg-green-700 text-white py-4 px-8 rounded-full text-xl font-semibold hover:bg-green-800 transition-colors border-2 border-amber-800 shadow-lg"
            >
              Shop Now
            </Link>
          </GlassCard>
        </div>
      </section>

      {/* Products Section with Client-side Season Filtering */}
      <ProductsClient initialProducts={products} />
    </div>
  );
}
