'use client';

import React, { useState } from 'react';
import useSWR from 'swr';
import ProductCard from '@/components/ProductCard';
import { groupProductsByCategory, fetchProductsFromAirtable } from '@/data/products';
import { useSeason } from '@/contexts/SeasonContext';
import TimeBasedText from '@/components/TimeBasedText';
import GlassCard from '@/components/GlassCard';
import type { Product } from '@/data/products';

interface ProductsClientProps {
  initialProducts: Product[];
}

// SWR fetcher function
const fetcher = async () => {
  const products = await fetchProductsFromAirtable();
  return products;
};

const ProductSkeleton: React.FC = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    {[...Array(6)].map((_, i) => (
      <div key={i} className="bg-gradient-to-br from-amber-50/95 to-yellow-50/95 rounded-xl shadow-lg overflow-hidden border-2 border-amber-700 animate-pulse">
        <div className="h-64 bg-amber-200"></div>
        <div className="p-6">
          <div className="bg-amber-200 h-6 rounded mb-2"></div>
          <div className="bg-amber-200 h-4 rounded mb-4"></div>
          <div className="bg-amber-200 h-6 w-24 rounded mb-4"></div>
          <div className="bg-amber-200 h-12 rounded"></div>
        </div>
      </div>
    ))}
  </div>
);

export default function ProductsClient({ initialProducts }: ProductsClientProps) {
  const { selectedSeason } = useSeason();
  const [showUpdateNotification, setShowUpdateNotification] = useState(false);

  // SWR with background refresh - uses initialProducts as fallback
  const { data: products = initialProducts, error, isValidating } = useSWR(
    '/api/products-swr',
    fetcher,
    {
      fallbackData: initialProducts,
      refreshInterval: 30000, // Refresh every 30 seconds
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      onSuccess: (newData) => {
        // Show notification when data updates in background
        if (newData && newData.length !== initialProducts.length) {
          setShowUpdateNotification(true);
          setTimeout(() => setShowUpdateNotification(false), 5000);
        }
      }
    }
  );

  // Client-side season filtering (instant switching)
  const productGroups = groupProductsByCategory(products, [selectedSeason]);

  if (error) {
    console.error('Error fetching products:', error);
    // Fallback to initial products on error
    const fallbackGroups = groupProductsByCategory(initialProducts, [selectedSeason]);
    return (
      <section id="products" className="py-16">
        <div className="max-w-6xl mx-auto px-5">
          <GlassCard className="p-6 mb-12 mx-auto max-w-md" intensity="light">
            <h2 className="text-3xl font-bold text-center">
              <TimeBasedText variant="heading">
                Our Products
              </TimeBasedText>
            </h2>
          </GlassCard>
          
          <div className="mb-4 text-center">
            <div className="bg-amber-100 border border-amber-400 text-amber-800 px-4 py-2 rounded-lg inline-block">
              ⚠️ Using cached products. Check your connection.
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {fallbackGroups.map((productGroup) => (
              <ProductCard key={productGroup.category} product={productGroup} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="products" className="py-16">
      <div className="max-w-6xl mx-auto px-5">
        <GlassCard className="p-6 mb-12 mx-auto max-w-md" intensity="light">
          <h2 className="text-3xl font-bold text-center">
            <TimeBasedText variant="heading">
              Our Products
            </TimeBasedText>
          </h2>
        </GlassCard>

        {/* Update notification */}
        {(isValidating && !showUpdateNotification) && (
          <div className="fixed top-24 right-5 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg z-40 flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            <span className="text-sm">Checking for updates...</span>
          </div>
        )}

        {showUpdateNotification && (
          <div className="fixed top-24 right-5 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-40 flex items-center gap-2">
            <span className="text-sm">✨ Products updated!</span>
          </div>
        )}

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {productGroups.map((productGroup) => (
              <ProductCard key={productGroup.category} product={productGroup} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}