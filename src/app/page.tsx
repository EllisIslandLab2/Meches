import ProductCard from '@/components/ProductCard';
import { products } from '@/data/products';
import Link from 'next/link';
import TimeBasedText from '@/components/TimeBasedText';
import GlassCard from '@/components/GlassCard';

export default function Home() {
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

      {/* Products Section */}
      <section id="products" className="py-16">
        <div className="max-w-6xl mx-auto px-5">
          <GlassCard className="p-6 mb-12 mx-auto max-w-md" intensity="light">
            <h2 className="text-3xl font-bold text-center">
              <TimeBasedText variant="heading">
                Our Products
              </TimeBasedText>
            </h2>
          </GlassCard>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
