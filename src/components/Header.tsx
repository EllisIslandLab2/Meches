'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, memo, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { useCart } from '@/contexts/CartContext';
import SeasonDropdown from './SeasonDropdown';
import HeaderSnow from './HeaderSnow';

// Lazy load CartModal only when needed
const CartModal = dynamic(() => import('./CartModal'), {
  ssr: false
});

function Header() {
  const { getTotalItems } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Memoize cart item count to reduce re-renders
  const totalItems = useMemo(() => getTotalItems(), [getTotalItems]);

  return (
    <>
      <header className="bg-gradient-to-r from-amber-50 to-yellow-50 shadow-lg sticky top-0 z-50 border-b-2 border-amber-800 relative overflow-hidden">
        {/* Snow effect for Christmas */}
        <HeaderSnow />

        <nav className="max-w-7xl mx-auto px-3 relative z-10" aria-label="Main navigation">
          <div className="py-1 md:py-4">
            {/* Mobile Layout: Logo left, Cart + Hamburger right */}
            <div className="md:hidden">
              <div className="flex items-center justify-between gap-3 py-2">
                {/* Left: Logo */}
                <Link href="/" className="flex-shrink-0 rounded-lg overflow-hidden">
                  <Image
                    src="/meche-logo.webp"
                    alt="Meche's Crafts Logo"
                    width={60}
                    height={60}
                    className="object-cover"
                    priority
                    fetchPriority="high"
                  />
                </Link>

                {/* Right: Cart button and Hamburger menu */}
                <div className="flex items-center gap-2">
                  {/* Cart Button */}
                  <button
                    onClick={() => setIsCartOpen(true)}
                    className="text-white px-3 py-2 rounded-xl font-medium hover:opacity-90 transition-opacity border-2 border-stone-600 shadow-lg flex items-center gap-1.5 text-sm"
                    style={{
                      backgroundImage: 'url(/wooden-button-resized.webp)',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
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
                    <span className="text-xs font-bold">({totalItems})</span>
                  </button>

                  {/* Hamburger Menu Button */}
                  <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="bg-amber-900 text-white px-3 py-2 rounded-lg hover:bg-amber-800 transition-colors border-2 border-amber-800 shadow-lg flex flex-col gap-1.5"
                    aria-label="Navigation menu"
                  >
                    <span className={`block h-0.5 w-5 bg-white transition-transform ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                    <span className={`block h-0.5 w-5 bg-white transition-opacity ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
                    <span className={`block h-0.5 w-5 bg-white transition-transform ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
                  </button>
                </div>
              </div>

              {/* Mobile Menu Dropdown */}
              {isMobileMenuOpen && (
                <div className="bg-amber-50 border-t-2 border-amber-800 py-3 px-3 space-y-3">
                  {/* Season selector */}
                  <div className="pb-3 border-b border-stone-200">
                    <SeasonDropdown compact={true} />
                  </div>

                  {/* Navigation Links */}
                  <nav className="space-y-2 flex flex-col">
                    <Link
                      href="/"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-amber-900 font-semibold hover:text-stone-600 transition-colors hover:bg-amber-100 rounded px-3 py-2 block"
                    >
                      Home
                    </Link>
                    <Link
                      href="/#products"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-amber-900 font-semibold hover:text-stone-600 transition-colors hover:bg-amber-100 rounded px-3 py-2 block"
                    >
                      Products
                    </Link>
                    <Link
                      href="/contact"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-amber-900 font-semibold hover:text-stone-600 transition-colors hover:bg-amber-100 rounded px-3 py-2 block"
                    >
                      Contact
                    </Link>
                  </nav>
                </div>
              )}
            </div>

            {/* Desktop Layout: Enhanced with larger elements and more spacing */}
            <div className="hidden md:block relative">
              <div className="flex items-start justify-between relative gap-6">
                {/* Left: Season Selector with Label */}
                <div className="flex items-start flex-1">
                  <SeasonDropdown showLabel={true} />
                </div>

                {/* Center: Logo */}
                <div className="flex-shrink-0 mx-6">
                  <div className="rounded-lg overflow-hidden">
                    <Image
                      src="/meche-logo.webp"
                      alt="Meche's Crafts Logo"
                      width={120}
                      height={120}
                      className="object-cover"
                      priority
                      fetchPriority="high"
                    />
                  </div>
                </div>

                {/* Right: Cart and Nav Links stacked - Enhanced sizing */}
                <div className="flex flex-col items-end flex-1 gap-2">
                  <button
                    onClick={() => setIsCartOpen(true)}
                    className="text-white px-5 py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity border-2 border-stone-600 shadow-lg flex items-center gap-2 text-base"
                    style={{
                      backgroundImage: 'url(/wooden-button-resized.webp)',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
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
                    <span className="bg-white text-stone-600 px-2 py-0.5 rounded-full font-bold text-sm">
                      {totalItems}
                    </span>
                  </button>
                  {/* Nav Links - Larger and more prominent on desktop */}
                  <div className="flex items-center gap-5 mt-1">
                    <Link href="/" className="text-amber-900 font-bold hover:text-stone-600 transition-colors border-b-2 border-transparent hover:border-stone-700 text-base py-1">
                      Home
                    </Link>
                    <Link href="/#products" className="text-amber-900 font-bold hover:text-stone-600 transition-colors border-b-2 border-transparent hover:border-stone-700 text-base py-1">
                      Products
                    </Link>
                    <Link href="/contact" className="text-amber-900 font-bold hover:text-stone-600 transition-colors border-b-2 border-transparent hover:border-stone-700 text-base py-1">
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