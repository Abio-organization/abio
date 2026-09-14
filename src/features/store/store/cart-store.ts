import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem } from '../types'
export const itemKey = (i: CartItem) =>
  JSON.stringify([
    i.productId,
    i.variantId ?? null,
    i.customUsername ?? '',
    i.preferredColor ?? '',
    i.instructions ?? '',
    i.artworkUrl ?? '',
  ])
interface CartState {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (key: string) => void
  setQuantity: (key: string, quantity: number) => void
  clearCart: () => void
}
export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (item) =>
        set((s) => {
          const key = itemKey(item)
          const existing = s.items.find((i) => itemKey(i) === key)
          return {
            items: existing
              ? s.items.map((i) =>
                  itemKey(i) === key
                    ? {
                        ...i,
                        quantity: Math.min(99, i.quantity + item.quantity),
                      }
                    : i,
                )
              : [
                  ...s.items,
                  {
                    ...item,
                    quantity: Math.min(99, Math.max(1, item.quantity)),
                  },
                ],
          }
        }),
      removeItem: (key) =>
        set((s) => ({ items: s.items.filter((i) => itemKey(i) !== key) })),
      setQuantity: (key, quantity) =>
        set((s) => ({
          items: s.items.map((i) =>
            itemKey(i) === key
              ? { ...i, quantity: Math.min(99, Math.max(1, quantity)) }
              : i,
          ),
        })),
      clearCart: () => set({ items: [] }),
    }),
    { name: 'abio-cart', version: 2, migrate: () => ({ items: [] }) },
  ),
)
export const useCartCount = () =>
  useCartStore((s) => s.items.reduce((sum, i) => sum + i.quantity, 0))
