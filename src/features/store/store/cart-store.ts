import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import type { CartItem } from '../types'

function itemKey(productId: string, colorName: string | null): string {
  return `${productId}::${colorName ?? ''}`
}

interface CartState {
  items: CartItem[]
  addItem: (productId: string, colorName: string | null, quantity: number) => void
  removeItem: (productId: string, colorName: string | null) => void
  setQuantity: (productId: string, colorName: string | null, quantity: number) => void
  clearCart: () => void
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],

      addItem: (productId, colorName, quantity) =>
        set((state) => {
          const key = itemKey(productId, colorName)
          const existing = state.items.find((i) => itemKey(i.productId, i.colorName) === key)
          if (existing) {
            return {
              items: state.items.map((i) =>
                itemKey(i.productId, i.colorName) === key ? { ...i, quantity: i.quantity + quantity } : i,
              ),
            }
          }
          return { items: [...state.items, { productId, colorName, quantity }] }
        }),

      removeItem: (productId, colorName) =>
        set((state) => ({
          items: state.items.filter((i) => itemKey(i.productId, i.colorName) !== itemKey(productId, colorName)),
        })),

      setQuantity: (productId, colorName, quantity) =>
        set((state) => {
          if (quantity < 1) {
            return { items: state.items.filter((i) => itemKey(i.productId, i.colorName) !== itemKey(productId, colorName)) }
          }
          const key = itemKey(productId, colorName)
          return {
            items: state.items.map((i) => (itemKey(i.productId, i.colorName) === key ? { ...i, quantity } : i)),
          }
        }),

      clearCart: () => set({ items: [] }),
    }),
    { name: 'abio-cart' },
  ),
)

/** Total item count across all cart lines (sum of quantities, not distinct lines). */
export const useCartCount = () => useCartStore((s) => s.items.reduce((sum, i) => sum + i.quantity, 0))
