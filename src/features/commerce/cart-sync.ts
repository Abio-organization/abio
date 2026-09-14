import axios from 'axios'
import { commerce, type CartLine } from './api'
import { itemKey, useCartStore } from '@/features/store/store/cart-store'
export const serverItemKey = (i: CartLine) =>
  itemKey({
    productId: i.product.id,
    variantId: i.variant?.id,
    colorName: null,
    quantity: i.quantity,
    customUsername: i.customUsername ?? undefined,
    preferredColor: i.preferredColor ?? undefined,
    instructions: i.instructions ?? undefined,
    artworkUrl: i.artworkUrl ?? undefined,
  })
const pending = new Map<string, Promise<void>>()
/** Persist an absolute target before a write. A retry checks server state first. */
async function reconcile(userId: string) {
  await useCartStore.persist.rehydrate()
  for (const item of [...useCartStore.getState().items]) {
    const key = itemKey(item)
    const journalKey = `cart-sync:${userId}:${key}`
    let cart = await commerce.cart()
    let current = cart.items.find((i) => serverItemKey(i) === key)
    const stored = localStorage.getItem(journalKey)
    const target = stored
      ? Number(stored)
      : (current?.quantity ?? 0) + item.quantity
    if (target > 99)
      throw new Error(
        'A cart line exceeds 99 items. Reduce your saved quantity before syncing.',
      )
    localStorage.setItem(journalKey, String(target))
    try {
      if (!current) {
        if (localStorage.getItem(`${journalKey}:uncertain`))
          throw new Error('An earlier cart update is still unconfirmed. Check again shortly before adding this selection again.')
        localStorage.setItem(`${journalKey}:uncertain`, '1')
        await commerce.add({ ...item, quantity: target })
      }
      else if (current.quantity !== target)
        await commerce.update(current.id, target)
    } catch (error) {
      if (axios.isAxiosError(error) && error.response && [400, 401, 403, 404, 409, 422].includes(error.response.status))
        localStorage.removeItem(`${journalKey}:uncertain`)
      cart = await commerce.cart()
      current = cart.items.find((i) => serverItemKey(i) === key)
      if (current?.quantity !== target) throw error
    }
    const remaining = (useCartStore.getState().items.find((draft) => itemKey(draft) === key)?.quantity ?? 0) - item.quantity
    if (remaining > 0) useCartStore.getState().setQuantity(key, remaining)
    else useCartStore.getState().removeItem(key)
    localStorage.removeItem(`${journalKey}:uncertain`)
    localStorage.removeItem(journalKey)
  }
}
export function syncGuestCart(userId: string) {
  const existing = pending.get(userId)
  if (existing) return existing
  const run =
    typeof navigator.locks !== 'undefined'
      ? navigator.locks.request(`abio-cart-sync:${userId}`, () =>
          reconcile(userId),
        )
      : reconcile(userId)
  pending.set(userId, run)
  return run.finally(() => pending.delete(userId))
}
