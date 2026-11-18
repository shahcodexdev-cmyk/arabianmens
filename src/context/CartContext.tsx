import { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react';
import type { CartItem } from '../types';
import { getProductById } from '../data/products';

interface CartState {
  items: CartItem[];
  isDrawerOpen: boolean;
  isCheckoutOpen: boolean;
  checkoutSingleItem: CartItem | null;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: { variantId: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { variantId: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'OPEN_DRAWER' }
  | { type: 'CLOSE_DRAWER' }
  | { type: 'TOGGLE_DRAWER' }
  | { type: 'OPEN_CHECKOUT'; payload?: CartItem }
  | { type: 'CLOSE_CHECKOUT' }
  | { type: 'LOAD_CART'; payload: CartItem[] };

const CART_STORAGE_KEY = 'amc-cart';

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingIndex = state.items.findIndex(
        item => item.variantId === action.payload.variantId
      );
      if (existingIndex >= 0) {
        const updated = [...state.items];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + action.payload.quantity,
        };
        return { ...state, items: updated, isDrawerOpen: true };
      }
      return { ...state, items: [...state.items, action.payload], isDrawerOpen: true };
    }
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item.variantId !== action.payload.variantId),
      };
    case 'UPDATE_QUANTITY': {
      if (action.payload.quantity < 1) {
        return {
          ...state,
          items: state.items.filter(item => item.variantId !== action.payload.variantId),
        };
      }
      return {
        ...state,
        items: state.items.map(item =>
          item.variantId === action.payload.variantId
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };
    }
    case 'CLEAR_CART':
      return { ...state, items: [] };
    case 'OPEN_DRAWER':
      return { ...state, isDrawerOpen: true, isCheckoutOpen: false };
    case 'CLOSE_DRAWER':
      return { ...state, isDrawerOpen: false };
    case 'TOGGLE_DRAWER':
      return { ...state, isDrawerOpen: !state.isDrawerOpen };
    case 'OPEN_CHECKOUT':
      return {
        ...state,
        isCheckoutOpen: true,
        isDrawerOpen: false,
        checkoutSingleItem: action.payload || null,
      };
    case 'CLOSE_CHECKOUT':
      return {
        ...state,
        isCheckoutOpen: false,
        checkoutSingleItem: null,
      };
    case 'LOAD_CART':
      return { ...state, items: action.payload };
    default:
      return state;
  }
}

interface CartContextType {
  items: CartItem[];
  isDrawerOpen: boolean;
  isCheckoutOpen: boolean;
  checkoutSingleItem: CartItem | null;
  addItem: (item: CartItem) => void;
  removeItem: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
  openCheckout: (singleItem?: CartItem) => void;
  closeCheckout: () => void;
  itemCount: number;
  subtotal: number;
}

const CartContext = createContext<CartContextType | null>(null);

function validateCartItems(items: CartItem[]): CartItem[] {
  return items.filter(item => {
    const product = getProductById(item.productId);
    if (!product) return false;
    const variant = product.variants.find(v => v.id === item.variantId);
    if (!variant || !variant.available) return false;
    // Update price from current catalog
    item.price = variant.price;
    item.name = product.name;
    item.slug = product.slug;
    item.image = product.images[0]?.url || '';
    return true;
  });
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    isDrawerOpen: false,
    isCheckoutOpen: false,
    checkoutSingleItem: null,
  });

  // Load from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          const valid = validateCartItems(parsed);
          dispatch({ type: 'LOAD_CART', payload: valid });
        }
      }
    } catch {
      // Invalid cart data — start fresh
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.items));
    } catch {
      // Storage full or unavailable
    }
  }, [state.items]);

  const itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const value: CartContextType = {
    items: state.items,
    isDrawerOpen: state.isDrawerOpen,
    isCheckoutOpen: state.isCheckoutOpen,
    checkoutSingleItem: state.checkoutSingleItem,
    addItem: (item) => dispatch({ type: 'ADD_ITEM', payload: item }),
    removeItem: (variantId) => dispatch({ type: 'REMOVE_ITEM', payload: { variantId } }),
    updateQuantity: (variantId, quantity) =>
      dispatch({ type: 'UPDATE_QUANTITY', payload: { variantId, quantity } }),
    clearCart: () => dispatch({ type: 'CLEAR_CART' }),
    openDrawer: () => dispatch({ type: 'OPEN_DRAWER' }),
    closeDrawer: () => dispatch({ type: 'CLOSE_DRAWER' }),
    toggleDrawer: () => dispatch({ type: 'TOGGLE_DRAWER' }),
    openCheckout: (singleItem) => dispatch({ type: 'OPEN_CHECKOUT', payload: singleItem }),
    closeCheckout: () => dispatch({ type: 'CLOSE_CHECKOUT' }),
    itemCount,
    subtotal,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextType {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
