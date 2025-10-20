'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { nanoid } from 'nanoid';
import { CartItem, CartContextType } from '@/types/cart';

type CartAction = 
  | { type: 'ADD_TO_CART'; payload: Omit<CartItem, 'id'> }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: CartItem[] };

const cartReducer = (state: CartItem[], action: CartAction): CartItem[] => {
  switch (action.type) {
    case 'ADD_TO_CART':
      // Check if item with same name and variant already exists
      const existingItemIndex = state.findIndex(
        item => item.name === action.payload.name && item.variant === action.payload.variant
      );

      if (existingItemIndex !== -1) {
        // Item exists, update quantity
        return state.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item
        );
      } else {
        // Item doesn't exist, add new
        const newItem = {
          ...action.payload,
          id: nanoid() // Generate unique ID
        };
        return [...state, newItem];
      }
    
    case 'REMOVE_FROM_CART':
      return state.filter(item => item.id !== action.payload);
    
    case 'UPDATE_QUANTITY':
      return state.map(item =>
        item.id === action.payload.id
          ? { ...item, quantity: Math.max(1, action.payload.quantity) }
          : item
      );
    
    case 'CLEAR_CART':
      return [];
    
    case 'LOAD_CART':
      return action.payload;
    
    default:
      return state;
  }
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, dispatch] = useReducer(cartReducer, []);
  const [isLoaded, setIsLoaded] = React.useState(false);

  // Cart version for cache busting - increment this to force clear old carts
  const CART_VERSION = 2;

  // Load cart from localStorage on client side
  useEffect(() => {
    // Check cart version
    const savedVersion = localStorage.getItem('cartVersion');
    const currentVersion = savedVersion ? parseInt(savedVersion) : 0;

    // Clear cart if version mismatch
    if (currentVersion !== CART_VERSION) {
      console.log('Cart version mismatch - clearing old cart data');
      localStorage.removeItem('cart');
      localStorage.setItem('cartVersion', CART_VERSION.toString());
      setIsLoaded(true);
      return;
    }

    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        // Validate cart items have required fields
        const validItems = parsedCart.filter((item: any) => {
          const isValid = item &&
            typeof item.id === 'string' &&
            typeof item.name === 'string' &&
            typeof item.price === 'number' &&
            typeof item.quantity === 'number' &&
            item.price > 0 &&
            item.quantity > 0;

          if (!isValid) {
            console.warn('Invalid cart item removed:', item);
          }
          return isValid;
        });

        if (validItems.length !== parsedCart.length) {
          console.log(`Removed ${parsedCart.length - validItems.length} invalid items from cart`);
        }

        dispatch({ type: 'LOAD_CART', payload: validItems });
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
        // Clear corrupted cart data
        localStorage.removeItem('cart');
      }
    }
    setIsLoaded(true);
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item: Omit<CartItem, 'id'>) => {
    dispatch({ type: 'ADD_TO_CART', payload: item });
  };

  const removeFromCart = (id: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: id });
  };

  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => {
      // Defensive check: ensure price and quantity are valid numbers
      const price = typeof item.price === 'number' && !isNaN(item.price) ? item.price : 0;
      const quantity = typeof item.quantity === 'number' && !isNaN(item.quantity) ? item.quantity : 0;
      return total + (price * quantity);
    }, 0);
  };

  const value: CartContextType = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
    isLoaded
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};