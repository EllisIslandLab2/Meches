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
          <div className="py-1 md:py-4">
            {/* Mobile Layout: Logo left, Season + Cart + Nav right */}
            <div className="md:hidden">
              <div className="flex items-start justify-between gap-3">
                {/* Logo - Left aligned on mobile - Smaller size */}
                <div className="flex-shrink-0">
                  <div className="rounded-lg overflow-hidden">
                    <Image
                      src="/assets/images/meche-logo.png"
                      alt="Meche's Crafts Logo"
                      width={65}
                      height={65}
                      className="object-cover"
                      priority
                      fetchPriority="high"
                    />
                  </div>
                </div>

                {/* Right side: Season selector, Cart, and Nav links stacked - Everything right-aligned */}
                <div className="flex flex-col items-end gap-1.5 flex-1">
                  <SeasonDropdown compact={true} />
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
                    ({totalItems})
                  </button>
                  {/* Nav Links - Right aligned under cart on mobile */}
                  <div className="flex items-center justify-end gap-2.5">
                    <Link href="/" className="text-amber-900 font-semibold hover:text-green-700 transition-colors border-b-2 border-transparent hover:border-green-600 text-xs whitespace-nowrap">
                      Home
                    </Link>
                    <Link href="/#products" className="text-amber-900 font-semibold hover:text-green-700 transition-colors border-b-2 border-transparent hover:border-green-600 text-xs whitespace-nowrap">
                      Products
                    </Link>
                    <Link href="/contact" className="text-amber-900 font-semibold hover:text-green-700 transition-colors border-b-2 border-transparent hover:border-green-600 text-xs whitespace-nowrap">
                      Contact
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Desktop Layout: Enhanced with larger elements and more spacing */}
            <div className="hidden md:block relative">
              <div className="flex items-start justify-between relative gap-6">
                {/* Left: Season Selector with Label */}
                <div className="flex items-start flex-1">
                  <SeasonDropdown showLabel={true} />
                </div>

                {/* Center: Larger Logo */}
                <div className="flex-shrink-0 mx-6">
                  <div className="rounded-lg overflow-hidden">
                    <Image
                      src="/assets/images/meche-logo.png"
                      alt="Meche's Crafts Logo"
                      width={160}
                      height={160}
                      className="object-cover"
                      style={{ width: 'auto', height: 'auto' }}
                      priority
                      fetchPriority="high"
                    />
                  </div>
                </div>

                {/* Right: Cart and Nav Links stacked - Enhanced sizing */}
                <div className="flex flex-col items-end flex-1 gap-2">
                  <button
                    onClick={() => setIsCartOpen(true)}
                    className="bg-green-700 text-white px-5 py-3 rounded-full font-semibold hover:bg-green-800 transition-colors border-2 border-amber-800 shadow-lg flex items-center gap-2 text-base"
                    aria-label={`Shopping cart with ${totalItems} items`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2.5}
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                      />
                    </svg>
                    <span className="font-semibold">Cart</span>
                    <span className="bg-white text-green-700 px-2 py-0.5 rounded-full font-bold text-sm">
                      {totalItems}
                    </span>
                  </button>
                  {/* Nav Links - Larger and more prominent on desktop */}
                  <div className="flex items-center gap-5 mt-1">
                    <Link href="/" className="text-amber-900 font-bold hover:text-green-700 transition-colors border-b-2 border-transparent hover:border-green-600 text-base py-1">
                      Home
                    </Link>
                    <Link href="/#products" className="text-amber-900 font-bold hover:text-green-700 transition-colors border-b-2 border-transparent hover:border-green-600 text-base py-1">
                      Products
                    </Link>
                    <Link href="/contact" className="text-amber-900 font-bold hover:text-green-700 transition-colors border-b-2 border-transparent hover:border-green-600 text-base py-1">
                      Contact
                    </Link>
                  </div>
                </div>
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