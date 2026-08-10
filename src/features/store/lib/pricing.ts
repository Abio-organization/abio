import type { Product } from '../types'

const DISCOUNT_RATE = 0.15

export interface ProductPricing {
  original: number
  discounted: number
  savings: number
}

/**
 * Single source of truth for the 15% launch discount. The legacy app
 * recomputed this in three different places (product card, modal headline,
 * modal savings line) with inconsistent fallbacks — the modal's headline
 * price and its "was" price ended up showing the exact same number, and the
 * discount silently came out to ₦0 whenever a product only had `basePrice`
 * set (which was every real product). This is the only place price math
 * happens now.
 */
export function getProductPricing(product: Product): ProductPricing {
  const original = product.basePrice
  const savings = Math.round(original * DISCOUNT_RATE)
  return { original, discounted: original - savings, savings }
}

export function formatNaira(amount: number): string {
  return `₦${amount.toLocaleString('en-NG')}`
}
