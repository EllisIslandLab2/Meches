'use client';

import { useCart } from '@/contexts/CartContext';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Script from 'next/script';

// Square SDK types
interface SquareCard {
  attach(elementId: string): Promise<void>;
  tokenize(): Promise<{
    status: string;
    token?: string;
    errors?: Array<{ message: string }>;
  }>;
}

interface SquarePayments {
  card(): Promise<SquareCard>;
}

declare global {
  interface Window {
    Square?: {
      payments(applicationId: string, locationId: string): SquarePayments;
    };
  }
}

interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
}

export default function PaymentPage() {
  const { cart, getTotalPrice, clearCart, isLoaded } = useCart();
  const router = useRouter();
  const [isSquareLoaded, setIsSquareLoaded] = useState(false);
  const [card, setCard] = useState<SquareCard | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentForm, setPaymentForm] = useState<SquarePayments | null>(null);

  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: ''
  });

  const subtotal = getTotalPrice();
  const freeShippingThreshold = parseFloat(process.env.NEXT_PUBLIC_FREE_SHIPPING_THRESHOLD || '50');
  const shippingCost = parseFloat(process.env.NEXT_PUBLIC_SHIPPING_COST || '5.99');

  // Ohio sales tax rate (7.25%) as estimate - final tax calculated by Square based on exact address
  const estimatedTaxRate = 0.0725;

  const shipping = subtotal >= freeShippingThreshold ? 0 : shippingCost;
  const estimatedTax = subtotal * estimatedTaxRate;
  const estimatedTotal = subtotal + shipping + estimatedTax;

  useEffect(() => {
    // Only redirect if cart is loaded and empty
    if (isLoaded && cart.length === 0) {
      router.push('/checkout');
    }
  }, [cart, router, isLoaded]);

  const initializeSquare = async () => {
    if (!window.Square) {
      console.error('Square.js not loaded');
      return;
    }

    const appId = process.env.NEXT_PUBLIC_SQUARE_APPLICATION_ID;
    const locationId = process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID;

    if (!appId || !locationId) {
      console.error('Square credentials not configured. Please set NEXT_PUBLIC_SQUARE_APPLICATION_ID and NEXT_PUBLIC_SQUARE_LOCATION_ID in your environment variables.');
      alert('Payment system is not configured. Please contact the store owner.');
      return;
    }

    try {
      const payments = window.Square.payments(appId, locationId);

      // Wait for DOM to be ready
      const container = document.querySelector('#square-card-container');
      if (!container) {
        console.error('Square card container not found');
        return;
      }

      const card = await payments.card();
      await card.attach('#square-card-container');
      setCard(card);
      setPaymentForm(payments);
    } catch (error) {
      console.error('Failed to initialize Square payments:', error);
    }
  };

  const handleSquareLoad = () => {
    setIsSquareLoaded(true);
    // Give React time to render the container
    setTimeout(() => {
      initializeSquare();
    }, 100);
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!card || !paymentForm) {
      alert('Payment form not ready. Please refresh the page.');
      return;
    }

    // Validate customer information
    const requiredFields: (keyof CustomerInfo)[] = ['firstName', 'lastName', 'email', 'address', 'city', 'state', 'zipCode'];
    for (const field of requiredFields) {
      if (!customerInfo[field]) {
        alert(`Please fill in your ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        return;
      }
    }

    setIsProcessing(true);

    try {
      // Tokenize the card
      const result = await card.tokenize();
      
      if (result.status === 'OK') {
        // Store order info and redirect to success page
        const orderInfo = {
          customerInfo,
          cart,
          totals: { subtotal, shipping, estimatedTax, estimatedTotal },
          paymentToken: result.token,
          timestamp: new Date().toISOString()
        };

        // In a real implementation, you would:
        // 1. Send the token to your backend
        // 2. Process the payment with Square's Payments API
        // 3. Save the order to your database
        // 4. Send confirmation emails
        
        // For demo purposes, we'll simulate success and store in localStorage
        localStorage.setItem('lastOrder', JSON.stringify(orderInfo));
        
        // Submit customer info to Airtable
        try {
          await fetch('/api/airtable', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              action: 'create',
              formType: 'customer-info',
              data: {
                fields: {
                  'First Name': customerInfo.firstName,
                  'Last Name': customerInfo.lastName,
                  'Email': customerInfo.email,
                  'Phone': customerInfo.phone,
                  'Address': customerInfo.address,
                  'City': customerInfo.city,
                  'State': customerInfo.state,
                  'Zip Code': customerInfo.zipCode,
                  'Order Total': estimatedTotal,
                  'Order Items': cart.map(item => 
                    `${item.name} (${item.variant}) x${item.quantity}`
                  ).join(', '),
                  'Order Date': new Date().toISOString()
                }
              }
            })
          });
        } catch (airtableError) {
          console.error('Failed to save to Airtable:', airtableError);
          // Continue anyway - payment was successful
        }

        clearCart();
        router.push('/success');
      } else {
        console.error('Card tokenization failed:', result.errors);
        alert('Payment failed. Please check your card details and try again.');
      }
    } catch (error) {
      console.error('Payment processing error:', error);
      alert('An error occurred while processing your payment. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Show loading state while cart is being loaded from localStorage
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your cart...</p>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl text-gray-600 mb-4">Your cart is empty</h2>
          <button
            onClick={() => router.push('/')}
            className="bg-yellow-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-yellow-600 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Script
        src={
          process.env.NEXT_PUBLIC_SQUARE_ENVIRONMENT === 'production'
            ? "https://web.squarecdn.com/v1/square.js"
            : "https://sandbox.web.squarecdn.com/v1/square.js"
        }
        onLoad={handleSquareLoad}
        strategy="lazyOnload"
      />
      
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-5">
          <h1 className="text-3xl font-bold text-amber-800 mb-8">Payment</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Order Summary */}
            <div className="lg:order-2">
              <div className="bg-white rounded-xl p-6 shadow-lg sticky top-24">
                <h3 className="text-xl font-semibold mb-6">Order Summary</h3>
                
                <div className="space-y-3 mb-6">
                  {cart.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>{item.name} ({item.variant}) x{item.quantity}</span>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping:</span>
                    <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-sm">Est. Tax (OH):</div>
                      <div className="text-xs text-gray-600">Final tax at checkout</div>
                    </div>
                    <span className="text-sm">${estimatedTax.toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between text-lg font-bold text-amber-800">
                      <span>Estimated Total:</span>
                      <span>${estimatedTotal.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Payment Amount Highlight */}
                <div className="bg-yellow-100 border-2 border-yellow-500 rounded-lg p-4 mt-6">
                  <h3 className="text-yellow-800 font-semibold mb-3">Amount to Enter in Square</h3>
                  <div className="bg-white border-2 border-blue-500 rounded-lg p-4 flex justify-between items-center">
                    <span className="text-3xl font-bold text-blue-600">${estimatedTotal.toFixed(2)}</span>
                  </div>
                  <p className="text-yellow-800 text-sm mt-3 leading-relaxed">
                    This is an estimate. Square will calculate the final tax based on your exact shipping address.
                  </p>
                </div>
              </div>
            </div>

            {/* Customer Information & Payment Form */}
            <div className="lg:order-1">
              <form onSubmit={handlePayment} className="bg-white rounded-xl p-6 shadow-lg">
                <h2 className="text-xl font-semibold mb-6">Customer Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">First Name *</label>
                    <input
                      type="text"
                      required
                      value={customerInfo.firstName}
                      onChange={(e) => setCustomerInfo({...customerInfo, firstName: e.target.value})}
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Last Name *</label>
                    <input
                      type="text"
                      required
                      value={customerInfo.lastName}
                      onChange={(e) => setCustomerInfo({...customerInfo, lastName: e.target.value})}
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Email *</label>
                    <input
                      type="email"
                      required
                      value={customerInfo.email}
                      onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Phone</label>
                    <input
                      type="tel"
                      value={customerInfo.phone}
                      onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">Address *</label>
                  <input
                    type="text"
                    required
                    value={customerInfo.address}
                    onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                  />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">City *</label>
                    <input
                      type="text"
                      required
                      value={customerInfo.city}
                      onChange={(e) => setCustomerInfo({...customerInfo, city: e.target.value})}
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">State *</label>
                    <input
                      type="text"
                      required
                      value={customerInfo.state}
                      onChange={(e) => setCustomerInfo({...customerInfo, state: e.target.value})}
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Zip Code *</label>
                    <input
                      type="text"
                      required
                      value={customerInfo.zipCode}
                      onChange={(e) => setCustomerInfo({...customerInfo, zipCode: e.target.value})}
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                    />
                  </div>
                </div>

                <h3 className="text-lg font-semibold mb-4">Payment Information</h3>
                
                <div id="square-card-container" className="mb-6 p-4 border rounded-lg bg-gray-50 min-h-[60px] flex items-center justify-center">
                  {!isSquareLoaded && (
                    <div className="text-gray-500">Loading payment form...</div>
                  )}
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <p className="text-sm text-blue-800 mb-2">
                    <strong>How to complete your payment:</strong>
                  </p>
                  <ol className="text-sm text-blue-800 space-y-1 ml-4 list-decimal">
                    <li>Fill in all customer information above</li>
                    <li>Enter your card details in the Square payment form</li>
                    <li>Estimated amount: <strong>${estimatedTotal.toFixed(2)}</strong> (final tax calculated by Square)</li>
                    <li>Click "Complete Payment" below</li>
                  </ol>
                </div>

                <div className="text-center">
                  <button
                    type="submit"
                    disabled={isProcessing || !isSquareLoaded}
                    className="bg-green-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? 'Processing...' : `Complete Payment - ~$${estimatedTotal.toFixed(2)}`}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}