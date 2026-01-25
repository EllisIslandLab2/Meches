'use client';

import React from 'react';
import ProductCard from '@/components/ProductCard';
import { groupProductsByCategory } from '@/data/products';
import { useSeason } from '@/contexts/SeasonContext';
import TimeBasedText from '@/components/TimeBasedText';
import GlassCard from '@/components/GlassCard';
import HolidayCountdown from '@/components/HolidayCountdown';
import type { Product } from '@/data/products';

interface ProductsClientProps {
  initialProducts: Product[];
}

export default function ProductsClient({ initialProducts }: ProductsClientProps) {
  const { selectedSeason } = useSeason();

  // Client-side season filtering using ISR-provided products (instant switching)
  // Products are fetched server-side via ISR and revalidate every 5 minutes
  const productGroups = groupProductsByCategory(initialProducts, [selectedSeason]);

  return (
    <section id="products" className="py-16">
      <div className="max-w-6xl mx-auto px-5">
        <GlassCard className="p-6 mb-12 mx-auto max-w-md" intensity="medium">
          <h2 className="text-3xl font-bold text-center mb-4">
            <TimeBasedText variant="heading">
              Our Products
            </TimeBasedText>
          </h2>
          <HolidayCountdown />
        </GlassCard>

        {/* Products display */}
        {productGroups.length === 0 ? (
          <div className="text-center py-12">
            <GlassCard className="p-8 mx-auto max-w-lg" intensity="light">
              <p className="text-lg text-amber-800 mb-2">
                No products available for {selectedSeason === 'all' ? 'all seasons' : selectedSeason}
              </p>
              <p className="text-sm text-amber-700">
                {selectedSeason !== 'all'
                  ? 'Try selecting a different season to see more products'
                  : 'Products will appear here when available'
                }
              </p>
            </GlassCard>
          </div>
        ) : (
          <div className="flex flex-wrap justify-center gap-8">
            {productGroups.map((productGroup, index) => (
              <div key={productGroup.category} className="w-full max-w-sm">
                <ProductCard product={productGroup} priority={index < 2} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}