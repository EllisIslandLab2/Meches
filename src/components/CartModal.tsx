'use client';

import { useCart } from '@/contexts/CartContext';
import Image from 'next/image';
import Link from 'next/link';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartModal({ isOpen, onClose }: CartModalProps) {
  const { cart, removeFromCart, getTotalPrice } = useCart();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white/98 rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto relative border-2 border-amber-700">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-2xl font-bold text-amber-700 hover:text-amber-900"
        >
          ×
        </button>
        
        <h2 className="text-2xl font-bold text-amber-900 mb-6">Shopping Cart</h2>
        
        {cart.length === 0 ? (
          <div className="text-center py-8 text-amber-700">
            <p>Your cart is empty</p>
          </div>
        ) : (
          <>
            <div className="space-y-4 mb-6">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center gap-4 p-4 border-b border-amber-300">
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={60}
                    height={60}
                    className="rounded-lg object-cover border border-amber-700"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-amber-900">{item.name}</h4>
                    <p className="text-sm text-amber-700">{item.variantType}: {item.variant}</p>
                    <p className="text-sm text-amber-700">Quantity: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-700">${(item.price * item.quantity).toFixed(2)}</p>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-600 text-sm hover:text-red-800 border border-red-600 rounded px-2 py-1 mt-1"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-center mb-6 p-4 bg-amber-100 rounded-lg border-2 border-amber-700">
              <h3 className="text-xl font-bold text-amber-900">Total: ${getTotalPrice().toFixed(2)}</h3>
            </div>
            
            <div className="flex gap-4 justify-center">
              <Link
                href="/checkout"
                className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors border-2 border-amber-800"
                onClick={onClose}
              >
                Checkout
              </Link>
              <button
                onClick={onClose}
                className="bg-amber-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-amber-800 transition-colors border-2 border-amber-800"
              >
                Continue Shopping
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}