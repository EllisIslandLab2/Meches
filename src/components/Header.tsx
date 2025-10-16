'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { useSeason, type SeasonHoliday } from '@/contexts/SeasonContext';
import CartModal from './CartModal';
import SeasonDropdown from './SeasonDropdown';

export default function Header() {
  const { getTotalItems } = useCart();
  const { setSelectedSeason } = useSeason();
  const [isCartOpen, setIsCartOpen] = useState(false);

  const seasonQuickLinks = [
    { value: 'spring' as SeasonHoliday, emoji: '🌸', label: 'Spring' },
    { value: 'summer' as SeasonHoliday, emoji: '☀️', label: 'Summer' },
    { value: 'fall' as SeasonHoliday, emoji: '🍂', label: 'Fall' },
    { value: 'winter' as SeasonHoliday, emoji: '❄️', label: 'Winter' }
  ];

  return (
    <>
      <header className="bg-gradient-to-r from-amber-50 to-yellow-50 shadow-lg sticky top-0 z-50 border-b-2 border-amber-800">
        <nav className="max-w-7xl mx-auto px-3" aria-label="Main navigation">
          <div className="py-2 relative">
            {/* Absolutely Centered Logo */}
            <div className="absolute left-1/2 top-2 transform -translate-x-1/2">
              <div className="rounded-lg overflow-hidden">
                <Image
                  src="/assets/images/meche-logo.png"
                  alt="Meche's Crafts Logo"
                  width={140}
                  height={140}
                  className="object-cover"
                  priority
                />
              </div>
            </div>

            {/* Content Row with Season Selector and Cart */}
            <div className="flex justify-between items-start relative z-10">
              {/* Left: Season Selector */}
              <div className="flex items-start pt-1">
                <SeasonDropdown />
              </div>

              {/* Right: Cart */}
              <div className="flex flex-col items-end gap-1 pt-1">
                <button
                  onClick={() => setIsCartOpen(true)}
                  className="bg-green-700 text-white px-3 py-1.5 rounded-full font-medium hover:bg-green-800 transition-colors border-2 border-amber-800 shadow-lg flex items-center gap-2 text-sm"
                  aria-label={`Shopping cart with ${getTotalItems()} items`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                    />
                  </svg>
                  Cart ({getTotalItems()})
                </button>
              </div>
            </div>

            {/* Navigation Links and Season Quick Links at Bottom */}
            <div className="flex items-center justify-between mt-2 pt-1">
              {/* Season Quick Links */}
              <div className="flex items-center gap-2">
                {seasonQuickLinks.map((season) => (
                  <Link
                    key={season.value}
                    href="/#products"
                    onClick={() => setSelectedSeason(season.value)}
                    className="text-2xl hover:scale-125 transition-transform cursor-pointer"
                    title={season.label}
                    aria-label={`Filter by ${season.label}`}
                  >
                    {season.emoji}
                  </Link>
                ))}
              </div>

              {/* Navigation Links */}
              <div className="flex items-center gap-4">
                <Link href="/" className="text-amber-900 font-semibold hover:text-green-700 transition-colors border-b-2 border-transparent hover:border-green-600 text-sm">
                  Home
                </Link>
                <Link href="/#products" className="text-amber-900 font-semibold hover:text-green-700 transition-colors border-b-2 border-transparent hover:border-green-600 text-sm">
                  Products
                </Link>
                <Link href="/contact" className="text-amber-900 font-semibold hover:text-green-700 transition-colors border-b-2 border-transparent hover:border-green-600 text-sm">
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