'use client';

import { useState, memo, useCallback, useEffect } from 'react';
import Image from 'next/image';
import useEmblaCarousel from 'embla-carousel-react';
import { ProductGroup } from '@/data/products';
import { useCart } from '@/contexts/CartContext';

interface ProductCardProps {
  product: ProductGroup;
  priority?: boolean;
}

function ProductCard({ product, priority = false }: ProductCardProps) {
  const { addToCart } = useCart();
  const [selectedVariant, setSelectedVariant] = useState(product.defaultVariant);
  const [quantity, setQuantity] = useState(1);
  const [showMessage, setShowMessage] = useState(false);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Update carousel when variant changes
  useEffect(() => {
    setSelectedImageIndex(0);
    if (emblaApi) {
      emblaApi.scrollTo(0);
    }
  }, [selectedVariant, emblaApi]);

  // Track selected slide
  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setSelectedImageIndex(emblaApi.selectedScrollSnap());
    };

    emblaApi.on('select', onSelect);
    onSelect();

    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi]);

  const handleAddToCart = useCallback(() => {
    addToCart({
      productId: selectedVariant.id,
      name: product.name,
      price: product.price,
      variant: selectedVariant.variant_name,
      variantType: product.selectorLabel,
      quantity,
      image: selectedVariant.images[0]
    });

    setShowMessage(true);
    setTimeout(() => setShowMessage(false), 3000);
    setQuantity(1);
  }, [addToCart, selectedVariant, quantity, product.name, product.price, product.selectorLabel]);

  return (
    <div className="bg-gradient-to-br from-amber-50/95 to-yellow-50/95 rounded-xl shadow-lg overflow-hidden transition-transform hover:scale-105 hover:shadow-xl border-2 border-amber-700">
      {showMessage && (
        <div className="fixed top-24 right-5 bg-stone-700 text-white px-4 py-2 rounded-lg shadow-lg z-40 animate-slide-in border-2 border-amber-800">
          Item added to cart!
        </div>
      )}
      
      <div className="h-64 bg-amber-50 relative overflow-hidden border-b-2 border-amber-700">
        {selectedVariant.images && selectedVariant.images.length > 0 ? (
          <>
            {selectedVariant.images.length === 1 ? (
              // Single image - no carousel needed
              <Image
                src={selectedVariant.images[0]}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority={priority}
              />
            ) : (
              // Multiple images - use carousel
              <>
                <div className="overflow-hidden h-full" ref={emblaRef}>
                  <div className="flex h-full">
                    {selectedVariant.images.map((image, index) => (
                      <div key={index} className="flex-[0_0_100%] min-w-0 relative">
                        <Image
                          src={image}
                          alt={`${product.name} - View ${index + 1}`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          priority={priority && index === 0}
                        />
                      </div>
                    ))}
                  </div>
                </div>
                {/* Navigation Arrows */}
                {selectedImageIndex > 0 && (
                  <button
                    onClick={() => emblaApi?.scrollPrev()}
                    className="absolute left-2 top-1/2 -translate-y-1/2 p-3 bg-white/80 hover:bg-white rounded-full transition-all z-10 touch-manipulation shadow-md"
                    aria-label="Previous image"
                  >
                    <svg
                      className="w-4 h-4 text-amber-800"
                      fill="none"
                      strokeWidth="2.5"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                )}
                {selectedImageIndex < selectedVariant.images.length - 1 && (
                  <button
                    onClick={() => emblaApi?.scrollNext()}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-white/80 hover:bg-white rounded-full transition-all z-10 touch-manipulation shadow-md"
                    aria-label="Next image"
                  >
                    <svg
                      className="w-4 h-4 text-amber-800"
                      fill="none"
                      strokeWidth="2.5"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                )}
              </>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-100 to-amber-200">
            <div className="text-center text-amber-600">
              <div className="text-4xl mb-2">🎨</div>
              <p className="text-sm font-medium">Image Coming Soon</p>
            </div>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-amber-900 mb-1">{product.name}</h3>
        <p className="text-amber-700 text-sm mb-3">{product.description}</p>

        {/* Price */}
        <div className="mb-3">
          <p className="text-xl font-bold text-amber-800">${product.price.toFixed(2)}</p>
        </div>

        {/* Quantity Selector */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium text-amber-900">Quantity:</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={selectedVariant.stock_quantity === 0}
              className="w-7 h-7 bg-stone-600 text-white rounded-full font-bold hover:bg-stone-700 transition-colors border-2 border-amber-700 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Decrease quantity"
            >
              -
            </button>
            <span className="w-6 text-center font-bold text-amber-900">{quantity}</span>
            <button
              onClick={() => setQuantity(Math.min(selectedVariant.stock_quantity, quantity + 1))}
              disabled={selectedVariant.stock_quantity === 0}
              className="w-7 h-7 bg-stone-600 text-white rounded-full font-bold hover:bg-stone-700 transition-colors border-2 border-amber-700 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
        </div>

        {/* Category selector - only show if there are multiple variants */}
        {product.variants.length > 1 && (
          <div className="flex items-center gap-2 mb-3">
            <label htmlFor={`variant-${product.category}`} className="text-xs font-medium text-amber-900 whitespace-nowrap">{product.selectorLabel}:</label>
            <select
              id={`variant-${product.category}`}
              value={selectedVariant.id}
              onChange={(e) => {
                const variant = product.variants.find(v => v.id === e.target.value);
                if (variant) setSelectedVariant(variant);
              }}
              className="flex-1 p-1.5 text-sm border-2 border-amber-700 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white/90"
            >
              {product.variants.map((variant) => (
                <option key={variant.id} value={variant.id}>
                  {variant.variant_name}
                </option>
              ))}
            </select>
          </div>
        )}

        <button
          onClick={handleAddToCart}
          disabled={selectedVariant.stock_quantity === 0}
          className="w-full text-white py-2.5 rounded-xl font-semibold hover:opacity-90 transition-opacity border-2 border-stone-600 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:grayscale"
          style={{
            backgroundImage: 'url(/wooden-button-resized.webp)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {selectedVariant.stock_quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
}

export default memo(ProductCard);