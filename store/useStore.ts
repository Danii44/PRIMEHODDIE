'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { db } from '@/lib/firebase'; 
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

// --- TYPES ---
export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  category: string; // This is the key field!
  colors: { name: string; value: string; image: string }[];
  sizes: string[];
  rating: number;
  reviews: number;
  description: string;
  features?: string[];
  inStock: boolean;
  isNew?: boolean;
  isBestseller?: boolean;
}

export interface Category {
  id: string;
  name: string;
  image: string;
  count: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  color: string;
  size: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'customer';
}

interface StoreState {
  products: Product[];
  isLoading: boolean;
  cart: CartItem[];
  wishlist: string[];
  user: User | null;
  isAuthenticated: boolean;
  isCartOpen: boolean;
  selectedSize: string;
  selectedColor: string;

  // Actions
  fetchProducts: () => Promise<void>;
  setUser: (user: User | null) => void;
  setIsCartOpen: (isOpen: boolean) => void;
  setSelectedSize: (size: string) => void;
  setSelectedColor: (color: string) => void;
  addToCart: (product: Product, color: string, size: string) => void;
  removeFromCart: (productId: string, color: string, size: string) => void;
  updateQuantity: (productId: string, color: string, size: string, quantity: number) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;

  // Helpers
  getCartTotal: () => number;
  getCartCount: () => number;
  isInWishlist: (productId: string) => boolean;
  // NEW: Dynamic Category Getter
  getCategories: () => Category[];
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      products: [],
      isLoading: false,
      cart: [],
      wishlist: [],
      user: null,
      isAuthenticated: false,
      isCartOpen: false,
      selectedSize: '',
      selectedColor: '',

      fetchProducts: async () => {
        set({ isLoading: true });
        try {
          const q = query(collection(db, 'products'), orderBy('name', 'asc'));
          const snapshot = await getDocs(q);
          const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Product[];
          set({ products: items, isLoading: false });
        } catch (error) {
          console.error("Firebase fetch error:", error);
          set({ isLoading: false });
        }
      },

      // DYNAMIC CATEGORY LOGIC
      getCategories: () => {
        const products = get().products;
        const categoryMap: Record<string, Category> = {};

        products.forEach((product) => {
          if (!categoryMap[product.category]) {
            categoryMap[product.category] = {
              id: product.category.toLowerCase().replace(/\s+/g, '-'),
              name: product.category,
              image: product.image, // Uses the first product image found as category cover
              count: 0,
            };
          }
          categoryMap[product.category].count += 1;
        });

        return Object.values(categoryMap);
      },

      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setIsCartOpen: (isOpen) => set({ isCartOpen: isOpen }),
      setSelectedSize: (size) => set({ selectedSize: size }),
      setSelectedColor: (color) => set({ selectedColor: color }),

      addToCart: (product, color, size) => set((state) => {
        const existingItemIndex = state.cart.findIndex(
          (item) => item.product.id === product.id && item.color === color && item.size === size
        );

        // We only return the cart state, NOT the isCartOpen state
        if (existingItemIndex > -1) {
          const newCart = [...state.cart];
          newCart[existingItemIndex].quantity += 1;
          return { cart: newCart }; 
        }
        return { cart: [...state.cart, { product, quantity: 1, color, size }] };
      }),

      removeFromCart: (productId, color, size) => set((state) => ({
        cart: state.cart.filter(item => !(item.product.id === productId && item.color === color && item.size === size)),
      })),

      updateQuantity: (productId, color, size, quantity) => set((state) => ({
        cart: state.cart.map((item) =>
          item.product.id === productId && item.color === color && item.size === size
            ? { ...item, quantity: Math.max(1, quantity) } : item
        ),
      })),

      clearCart: () => set({ cart: [] }),
      toggleWishlist: (productId) => set((state) => ({
        wishlist: state.wishlist.includes(productId)
          ? state.wishlist.filter(id => id !== productId) : [...state.wishlist, productId]
      })),
      getCartTotal: () => get().cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0),
      getCartCount: () => get().cart.reduce((sum, item) => sum + item.quantity, 0),
      isInWishlist: (productId) => get().wishlist.includes(productId),
    }),
    {
      name: 'prime-hoodie-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ cart: state.cart, wishlist: state.wishlist, user: state.user }),
    }
  )
);