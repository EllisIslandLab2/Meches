export interface CartItem {
  id: string; // Changed to string for Airtable record IDs
  productId: string; // Changed to string for Airtable record IDs
  name: string;
  price: number;
  variant: string;
  variantType: string;
  quantity: number;
  image: string;
}

export interface CartContextType {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, 'id'>) => void;
  removeFromCart: (id: string) => void; // Changed to string
  updateQuantity: (id: string, quantity: number) => void; // Changed to string
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  isLoaded: boolean;
}