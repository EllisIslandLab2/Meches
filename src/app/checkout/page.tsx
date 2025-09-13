'use client';

import { useCart } from '@/contexts/CartContext';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
  const { cart, updateQuantity, removeFromCart, getTotalPrice } = useCart();
  const router = useRouter();

  const subtotal = getTotalPrice();
  const shipping = subtotal > 50 ? 0 : 5.99;
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shipping + tax;

  const handleProceedToPayment = () => {
    if (cart.length === 0) {
      alert('Your cart is empty');
      return;
    }
    router.push('/payment');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-5">
        <h1 className="text-3xl font-bold text-amber-800 mb-8">Shopping Cart</h1>
        
        {cart.length === 0 ? (
          <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl p-8 text-center border-2 border-amber-700">
            <h2 className="text-xl text-gray-600 mb-4">Your cart is empty</h2>
            <Link
              href="/"
              className="bg-yellow-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-yellow-600 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl p-6 shadow-lg border-2 border-amber-700">
                <h2 className="text-xl font-semibold mb-6">Items in Your Cart</h2>
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div key={item.id} className="grid grid-cols-[80px_1fr_auto_auto] gap-4 items-center p-4 border-b">
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={80}
                        height={80}
                        className="rounded-lg object-cover"
                      />
                      <div>
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-sm text-gray-600">{item.variantType}: {item.variant}</p>
                        <p className="text-sm font-medium">${item.price.toFixed(2)} each</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center gap-2 mb-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 bg-gray-200 text-gray-700 rounded-full font-bold hover:bg-gray-300 transition-colors"
                          >
                            -
                          </button>
                          <span className="w-12 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 bg-gray-200 text-gray-700 rounded-full font-bold hover:bg-gray-300 transition-colors"
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-500 text-sm hover:text-red-700"
                        >
                          Remove
                        </button>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-yellow-600">
                          ${(item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl p-6 shadow-lg sticky top-24 border-2 border-amber-700">
                <h3 className="text-xl font-semibold mb-6">Order Summary</h3>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping:</span>
                    <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax:</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t-2 border-yellow-500 pt-3">
                    <div className="flex justify-between text-lg font-bold text-amber-800">
                      <span>Total:</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {shipping > 0 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
                    <p className="text-sm text-blue-800">
                      Add ${(50 - subtotal).toFixed(2)} more for FREE shipping!
                    </p>
                  </div>
                )}

                <div className="space-y-3">
                  <button
                    onClick={handleProceedToPayment}
                    className="w-full bg-yellow-500 text-white py-3 rounded-lg font-semibold hover:bg-yellow-600 transition-colors"
                  >
                    Proceed to Payment
                  </button>
                  <Link
                    href="/"
                    className="block w-full text-center bg-gray-500 text-white py-3 rounded-lg font-semibold hover:bg-gray-600 transition-colors"
                  >
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}