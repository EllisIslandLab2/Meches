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
      {/* Hero Section - Wood Shavings on Desk */}
      <section
        className="relative py-24 px-4 min-h-[600px] flex items-center"
        style={{
          backgroundImage: 'url("/Meches Wood Shavings on a Desk.webp")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      >
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/40"></div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          {/* Semi-transparent white card for content */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-10 shadow-2xl border border-stone-200/70">
            <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6 text-amber-900">
              <TimeBasedText variant="heading">
                Welcome to Meche&apos;s Handmade Crafts
              </TimeBasedText>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-stone-700 leading-relaxed">
              <TimeBasedText variant="paragraph">
                Discover unique, handcrafted jewelry and laser-cut wooden designs made with love and attention to detail.
                Each piece is carefully crafted to bring beauty and personality to your everyday life.
              </TimeBasedText>
            </p>
            <Link
              href="#products"
              className="inline-block text-white py-4 px-10 rounded-xl text-xl font-semibold hover:opacity-90 transition-opacity shadow-lg hover:shadow-xl border-2 border-stone-600"
              style={{
                backgroundImage: 'url(/wooden-button-resized.webp)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              Shop Now
            </Link>
          </div>
        </div>
      </section>

      {/* Products Section - Neutral Background */}
      <section
        id="products"
        className="py-20 px-4 bg-stone-50"
      >
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl p-8 mb-12 mx-auto max-w-md shadow-xl border border-stone-200">
            <h2 className="text-4xl font-serif font-bold text-center text-amber-900">
              <TimeBasedText variant="heading">
                Our Products
              </TimeBasedText>
            </h2>
          </div>

          {/* Products display */}
          <ProductsClient initialProducts={products} />
        </div>
      </section>

      {/* Separator */}
      <div className="h-16 bg-gradient-to-b from-transparent via-stone-100 to-transparent"></div>

      {/* Call to Action Section - Ridged Wood */}
      <section
        className="relative py-20 px-4 min-h-[500px] flex items-center"
        style={{
          backgroundImage: 'url("/Meches Wood Shavings on a Ridged Desk.webp")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      >
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/40"></div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-10 shadow-2xl border border-stone-200/70">
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6 text-amber-900">
              Custom Orders Welcome
            </h2>
            <p className="text-lg md:text-xl text-stone-700 mb-8 leading-relaxed">
              Have a special request or custom design in mind? We&apos;d love to bring your vision to life.
              Each custom piece is crafted with the same attention to detail and care.
            </p>
            <Link
              href="/contact"
              className="inline-block text-white py-4 px-10 rounded-xl text-xl font-semibold hover:opacity-90 transition-opacity shadow-lg hover:shadow-xl border-2 border-stone-600"
              style={{
                backgroundImage: 'url(/wooden-button-resized.webp)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              Contact Us for Custom Orders
            </Link>
          </div>
        </div>
      </section>

      {/* Bottom spacer */}
      <div className="h-8 bg-gradient-to-b from-transparent to-stone-50"></div>
    </div>
  );
}
