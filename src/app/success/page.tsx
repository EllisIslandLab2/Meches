'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import PaymentErrorBoundary from '@/components/PaymentErrorBoundary';

interface OrderInfo {
  customerInfo: {
    firstName: string;
    lastName: string;
    email: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };
  cart: Array<{
    name: string;
    variant: string;
    quantity: number;
    price: number;
  }>;
  totals: {
    subtotal: number;
    shipping: number;
    estimatedTax: number;
    estimatedTotal: number;
  };
  paymentId?: string;
  timestamp: string;
}

export default function SuccessPage() {
  const [orderInfo, setOrderInfo] = useState<OrderInfo | null>(null);
  const [orderId, setOrderId] = useState<string>('');

  useEffect(() => {
    const savedOrder = localStorage.getItem('lastOrder');
    if (savedOrder) {
      try {
        const order = JSON.parse(savedOrder);
        setOrderInfo(order);
        // Use the real payment ID from Square, or generate fallback
        setOrderId(order.paymentId || 'MHC-' + Math.random().toString(36).substr(2, 9).toUpperCase());
        // Clear the order from localStorage after loading
        localStorage.removeItem('lastOrder');
      } catch (error) {
        console.error('Error loading order info:', error);
      }
    }
  }, []);

  if (!orderInfo) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl text-gray-600 mb-4">Order not found</h2>
          <Link
            href="/"
            className="bg-yellow-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-yellow-600 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const orderDate = new Date(orderInfo.timestamp);

  return (
    <PaymentErrorBoundary>
    <div className="min-h-screen">
      {/* Success Header with Heart-Shaped Wood Background */}
      <section
        className="relative py-20 px-4 min-h-[500px] flex items-center"
        style={{
          backgroundImage: 'url(/Meches Wood Heart-Shaped Shavings on a Desk.webp)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      >
        {/* Very soft warm overlay for celebration */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50/30 via-stone-50/25 to-stone-50/30"></div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-12 shadow-2xl border border-stone-200/70">
            <div className="text-7xl text-stone-700 mb-6">✓</div>
            <h1 className="text-5xl md:text-6xl font-serif font-bold text-amber-900 mb-6">Order Complete!</h1>
            <p className="text-lg md:text-xl text-stone-700 max-w-2xl mx-auto leading-relaxed mb-6">
              Thank you for your purchase! Your order has been received and we&apos;ll start crafting your beautiful pieces right away.
            </p>
            {orderInfo.customerInfo.email && (
              <div className="mt-6 bg-amber-50/80 border-2 border-stone-200 rounded-xl p-5 max-w-2xl mx-auto">
                <p className="text-amber-900 font-semibold text-lg">
                  📧 A confirmation email has been sent to {orderInfo.customerInfo.email}
                </p>
                <p className="text-amber-800 text-sm mt-2">
                  Check your inbox for order details and tracking information
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Separator */}
      <div className="h-12 bg-gradient-to-b from-transparent via-stone-100 to-stone-50"></div>

      {/* Order Details Section */}
      <section className="py-12 px-4 bg-stone-50">
        <div className="max-w-4xl mx-auto">

        {/* Order Confirmation Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h3 className="text-xl font-semibold text-amber-800 mb-6 text-center">Order Confirmation</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-amber-700 mb-3">Order Details</h4>
              <div className="space-y-2">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Order Number:</span>
                  <span className="font-medium">{orderId}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Date:</span>
                  <span>{orderDate.toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Total:</span>
                  <span className="font-bold text-amber-800">${orderInfo.totals.estimatedTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Status:</span>
                  <span className="text-stone-600 font-medium">Confirmed</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-amber-700 mb-3">Shipping Address</h4>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-gray-700 leading-relaxed">
                  {orderInfo.customerInfo.firstName} {orderInfo.customerInfo.lastName}<br />
                  {orderInfo.customerInfo.address}<br />
                  {orderInfo.customerInfo.city}, {orderInfo.customerInfo.state} {orderInfo.customerInfo.zipCode}
                </div>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="mt-8">
            <h4 className="font-semibold text-amber-700 mb-4">Order Items</h4>
            <div className="space-y-3">
              {orderInfo.cart.map((item, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg flex justify-between items-center">
                  <div className="flex-1">
                    <span className="font-medium">{item.name}</span>
                    <span className="text-gray-600 ml-2">({item.variant})</span>
                  </div>
                  <div className="text-gray-600 mx-4">
                    Qty: {item.quantity}
                  </div>
                  <div className="font-bold text-amber-800">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            {/* Order Totals */}
            <div className="border-t-2 border-amber-500 mt-6 pt-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>${orderInfo.totals.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span>{orderInfo.totals.shipping === 0 ? 'FREE' : `$${orderInfo.totals.shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax:</span>
                  <span>${orderInfo.totals.estimatedTax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-amber-800 border-t pt-2">
                  <span>Total:</span>
                  <span>${orderInfo.totals.estimatedTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h3 className="text-xl font-semibold text-amber-800 mb-6 text-center">What Happens Next?</h3>
          
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="bg-amber-500 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                1
              </div>
              <div>
                <h4 className="font-semibold text-amber-700 mb-2">Order Confirmation</h4>
                <p className="text-gray-600">
                  You'll receive an email confirmation shortly with your order details and tracking information.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-amber-500 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                2
              </div>
              <div>
                <h4 className="font-semibold text-amber-700 mb-2">Crafting Your Order</h4>
                <p className="text-gray-600">
                  Each piece is handmade to order. We'll begin crafting your items immediately and keep you updated on progress.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-amber-500 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                3
              </div>
              <div>
                <h4 className="font-semibold text-amber-700 mb-2">Quality Check & Packaging</h4>
                <p className="text-gray-600">
                  Once complete, each item goes through our quality check process and is carefully packaged for shipping.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-amber-500 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                4
              </div>
              <div>
                <h4 className="font-semibold text-amber-700 mb-2">Shipping & Delivery</h4>
                <p className="text-gray-600">
                  Your order will be shipped within 3-5 business days. You'll receive tracking information once it's on the way!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Track Order Section */}
        <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl shadow-lg p-6 mb-8 border-2 border-stone-200">
          <div className="text-center">
            <h3 className="text-xl font-semibold text-amber-800 mb-3">Track Your Order</h3>
            <p className="text-gray-600 mb-4">
              Keep this order number to track your items as they're crafted and shipped!
            </p>
            <div className="bg-white p-4 rounded-lg inline-block mb-4">
              <span className="text-sm text-gray-500 block mb-1">Your Order Number</span>
              <span className="text-2xl font-bold text-amber-800 font-mono">{orderId}</span>
            </div>
            <div>
              <Link
                href={`/track-order/${orderId}`}
                className="inline-block bg-amber-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-amber-700 transition-colors shadow-md"
              >
                Track Order Status →
              </Link>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center">
          <Link
            href="/"
            className="bg-yellow-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-yellow-600 transition-colors"
          >
            Continue Shopping
          </Link>
          <Link
            href="/contact"
            className="bg-amber-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-amber-800 transition-colors"
          >
            Contact Us
          </Link>
        </div>
        </div>
      </section>
    </div>
    </PaymentErrorBoundary>
  );
}