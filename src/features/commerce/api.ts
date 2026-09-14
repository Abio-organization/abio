import { useAuthStore } from '@/features/auth/store/auth-store'
import axios from 'axios'
import { apiClient } from '@/shared/lib/api-client'
import type { CartItem } from '@/features/store/types'
export interface CartLine {
  id: string
  quantity: number
  customUsername: string | null
  preferredColor: string | null
  instructions: string | null
  artworkUrl: string | null
  unitPriceKobo: number
  lineTotalKobo: number
  product: { id: string; name: string; type: string; active: boolean }
  variant: {
    id: string
    colorName: string
    colorHex: string | null
    stockQty: number
    active: boolean
    imageUrls: string[]
  } | null
}
export interface ServerCart {
  id: string
  items: CartLine[]
  subtotalKobo: number
  itemCount: number
}
export interface OrderItem {
  id: string
  quantity: number
  unitPriceKobo: number
  lineTotalKobo: number
  productName: string | null
  productType: string | null
  variantColorName: string | null
  imageUrls: string[]
  customUsername: string | null
  preferredColor: string | null
  instructions: string | null
  artworkUrl: string | null
  product?: { name: string }
  variant?: { colorName: string; imageUrls: string[] } | null
}
export interface Order {
  id: string
  createdAt: string
  status: string
  subtotalKobo: number
  shippingFeeKobo: number
  totalAmountKobo: number
  shippingAddress: string
  deliveryZone: string
  trackingNumber: string | null
  items: OrderItem[]
  payment: {
    status: 'pending' | 'success' | 'failed' | 'reversed'
    paidAt: string | null
  } | null
  checkoutUrl?: string | null
  paymentInitError?: string | null
}
function authError(error: unknown): never {
  if (axios.isAxiosError(error) && error.response?.status === 401) {
    sessionStorage.setItem(
      'commerce-return',
      window.location.pathname + window.location.search,
    )
    useAuthStore.getState().signOut()
  }
  throw error
}
async function get<T>(url: string, signal?: AbortSignal) {
  return (
    await apiClient
      .get<{ data: T }>(url, { signal, timeout: 20000 })
      .catch(authError)
  ).data.data
}
async function post<T>(url: string, body: unknown) {
  return (
    await apiClient
      .post<{ data: T }>(url, body, { timeout: 45000 })
      .catch(authError)
  ).data.data
}
export const commerce = {
  cart: (signal?: AbortSignal) => get<ServerCart>('/cart', signal),
  add: (item: CartItem) =>
    post<ServerCart>('/cart/items', {
      productId: item.productId,
      variantId: item.variantId,
      quantity: item.quantity,
      customUsername: item.customUsername,
      preferredColor: item.preferredColor,
      instructions: item.instructions,
      artworkUrl: item.artworkUrl,
    }),
  update: async (id: string, quantity: number) =>
    (
      await apiClient.patch<{ data: ServerCart }>(
        `/cart/items/${id}`,
        { quantity },
        { timeout: 20000 },
      ).catch(authError)
    ).data.data,
  remove: async (id: string) => {
    await apiClient.delete(`/cart/items/${id}`, { timeout: 20000 }).catch(authError)
  },
  clear: async () => {
    await apiClient.delete('/cart', { timeout: 20000 }).catch(authError)
  },
  checkout: (body: {
    deliveryZone: 'lagos' | 'outside_lagos'
    shippingAddress: string
  }) => post<Order>('/orders/checkout', body),
  pay: (id: string) => post<Order>(`/orders/${id}/pay`, {}),
  order: (id: string, signal?: AbortSignal) =>
    get<Order>(`/orders/${id}`, signal),
  orders: (page = 1, signal?: AbortSignal) =>
    get<{ orders: Order[]; pagination: { totalPages: number; page: number } }>(
      `/orders?page=${page}&limit=10`,
      signal,
    ),
}
export const money = (kobo: number) =>
  new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(
    kobo / 100,
  )
export const canPay = (order: Order) =>
  order.payment?.status === 'pending' && order.status !== 'cancelled'
export function paymentUrl(value: string | null | undefined) {
  if (!value) return null
  try {
    const u = new URL(value)
    return u.protocol === 'https:' ? u.href : null
  } catch {
    return null
  }
}
