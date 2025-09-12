'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import CartModal from './CartModal';

export default function Header() {
  const { getTotalItems } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <>
      <header className="bg-gradient-to-r from-amber-50 to-yellow-50 shadow-lg sticky top-0 z-50 border-b-2 border-amber-800">
        <nav className="max-w-6xl mx-auto px-5">
          <div className="flex justify-between items-center py-3">
            <div className="flex items-center gap-3">
              <div className="rounded-lg border-2 border-amber-800 overflow-hidden">
                <Image
                  src="/assets/images/logo.jpg"
                  alt="Meche's Crafts Logo"
                  width={80}
                  height={80}
                  className="object-cover"
                />
              </div>
              <h1 className="text-2xl font-semibold text-amber-900">
                <Link href="/" className="hover:text-green-700 transition-colors">
                  Meche's Handmade Crafts
                </Link>
              </h1>
            </div>
            
            <div className="flex items-center gap-8">
              <Link href="/" className="text-amber-900 font-medium hover:text-green-700 transition-colors border-b-2 border-transparent hover:border-green-600">
                Home
              </Link>
              <Link href="/#products" className="text-amber-900 font-medium hover:text-green-700 transition-colors border-b-2 border-transparent hover:border-green-600">
                Products
              </Link>
              <Link href="/contact" className="text-amber-900 font-medium hover:text-green-700 transition-colors border-b-2 border-transparent hover:border-green-600">
                Contact
              </Link>
              <button
                onClick={() => setIsCartOpen(true)}
                className="bg-green-600 text-white px-4 py-2 rounded-full font-medium hover:bg-green-700 transition-colors border-2 border-amber-800 shadow-lg flex items-center gap-2"
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
                Cart ({getTotalItems()})
              </button>
            </div>
          </div>
        </nav>
      </header>
      
      <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}