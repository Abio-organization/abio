import type { Product, ProductColor } from '../types'
export function getProductPrice(product: Product, color?: ProductColor) {
  return color?.price ?? product.basePrice
}
export function formatNaira(amount: number) {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
  }).format(amount)
}
