'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, memo, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { useCart } from '@/contexts/CartContext';
import SeasonDropdown from './SeasonDropdown';

// Lazy load CartModal only when needed
const CartModal = dynamic(() => import('./CartModal'), {
  ssr: false
});

function Header() {
  const { getTotalItems } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Memoize cart item count to reduce re-renders
  const totalItems = useMemo(() => getTotalItems(), [getTotalItems]);

  return (
    <>
      <header className="bg-gradient-to-r from-amber-50 to-yellow-50 shadow-lg sticky top-0 z-50 border-b-2 border-amber-800">
        <nav className="max-w-7xl mx-auto px-3" aria-label="Main navigation">
          <div className="py-1 md:py-2 relative">
            {/* Absolutely Centered Logo */}
            <div className="absolute left-1/2 top-0 md:top-2 transform -translate-x-1/2">
              <div className="rounded-lg overflow-hidden">
                <Image
                  src="/assets/images/meche-logo.png"
                  alt="Meche's Crafts Logo"
                  width={100}
                  height={100}
                  className="object-cover md:w-[140px] md:h-[140px]"
                  priority
                  fetchPriority="high"
                />
              </div>
            </div>

            {/* Content Row with Season Selector and Cart */}
            <div className="flex justify-between items-start relative z-10">
              {/* Left: Season Selector */}
              <div className="flex items-start">
                <SeasonDropdown />
              </div>

              {/* Right: Cart */}
              <div className="flex flex-col items-end">
                <button
                  onClick={() => setIsCartOpen(true)}
                  className="bg-green-700 text-white px-3 py-2 rounded-full font-medium hover:bg-green-800 transition-colors border-2 border-amber-800 shadow-lg flex items-center gap-1.5 text-sm"
                  aria-label={`Shopping cart with ${totalItems} items`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                    />
                  </svg>
                  <span className="hidden md:inline">Cart</span> ({totalItems})
                </button>
              </div>
            </div>

            {/* Navigation Links at Bottom */}
            <div className="flex items-center justify-between mt-1 md:mt-2">
              {/* Navigation Links */}
              <div className="flex items-center gap-3 md:gap-4">
                <Link href="/" className="text-amber-900 font-semibold hover:text-green-700 transition-colors border-b-2 border-transparent hover:border-green-600 text-xs md:text-sm">
                  Home
                </Link>
                <Link href="/#products" className="text-amber-900 font-semibold hover:text-green-700 transition-colors border-b-2 border-transparent hover:border-green-600 text-xs md:text-sm">
                  Products
                </Link>
                <Link href="/contact" className="text-amber-900 font-semibold hover:text-green-700 transition-colors border-b-2 border-transparent hover:border-green-600 text-xs md:text-sm">
                  Contact
                </Link>
              </div>
            </div>
          </div>
        </nav>
      </header>

      <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}

export default memo(Header);