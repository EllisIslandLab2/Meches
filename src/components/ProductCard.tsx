'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ProductGroup } from '@/data/products';
import { useCart } from '@/contexts/CartContext';

interface ProductCardProps {
  product: ProductGroup;
  priority?: boolean;
}

export default function ProductCard({ product, priority = false }: ProductCardProps) {
  const { addToCart } = useCart();
  const [selectedVariant, setSelectedVariant] = useState(product.defaultVariant);
  const [quantity, setQuantity] = useState(1);
  const [showMessage, setShowMessage] = useState(false);

  const handleAddToCart = () => {
    addToCart({
      productId: selectedVariant.id,
      name: product.name,
      price: product.price,
      variant: selectedVariant.variant_name,
      variantType: product.selectorLabel,
      quantity,
      image: selectedVariant.image
    });
    
    setShowMessage(true);
    setTimeout(() => setShowMessage(false), 3000);
    setQuantity(1);
  };

  return (
    <div className="bg-gradient-to-br from-amber-50/95 to-yellow-50/95 rounded-xl shadow-lg overflow-hidden transition-transform hover:scale-105 hover:shadow-xl border-2 border-amber-700">
      {showMessage && (
        <div className="fixed top-24 right-5 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-40 animate-slide-in border-2 border-amber-800">
          Item added to cart!
        </div>
      )}
      
      <div className="h-64 bg-amber-50 relative overflow-hidden border-b-2 border-amber-700">
        {selectedVariant.image && selectedVariant.image.trim() !== '' ? (
          <Image
            src={selectedVariant.image}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={priority}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-100 to-amber-200">
            <div className="text-center text-amber-600">
              <div className="text-4xl mb-2">🎨</div>
              <p className="text-sm font-medium">Image Coming Soon</p>
            </div>
          </div>
        )}
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-semibold text-amber-900 mb-2">{product.name}</h3>
        <p className="text-amber-700 text-sm mb-4">{product.description}</p>
        <p className="text-2xl font-bold text-green-700 mb-4">${product.price.toFixed(2)}</p>
        
        <div className="space-y-4 mb-6">
          {/* Only show selector if there are multiple variants */}
          {product.variants.length > 1 && (
            <div>
              <label htmlFor={`variant-${product.category}`} className="block text-sm font-medium mb-2 text-amber-900">{product.selectorLabel}:</label>
              <select
                id={`variant-${product.category}`}
                value={selectedVariant.id}
                onChange={(e) => {
                  const variant = product.variants.find(v => v.id === e.target.value);
                  if (variant) setSelectedVariant(variant);
                }}
                className="w-full p-2 border-2 border-amber-700 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white/90"
              >
                {product.variants.map((variant) => (
                  <option key={variant.id} value={variant.id}>
                    {variant.variant_name}
                  </option>
                ))}
              </select>
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-amber-900">Quantity:</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 bg-green-700 text-white rounded-full font-bold hover:bg-green-800 transition-colors border-2 border-amber-700"
                aria-label="Decrease quantity"
              >
                -
              </button>
              <span className="w-8 text-center font-bold text-amber-900">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-8 h-8 bg-green-700 text-white rounded-full font-bold hover:bg-green-800 transition-colors border-2 border-amber-700"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          </div>
        </div>
        
        <button
          onClick={handleAddToCart}
          className="w-full bg-green-700 text-white py-3 rounded-lg font-semibold hover:bg-green-800 transition-colors border-2 border-amber-800 shadow-lg"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}