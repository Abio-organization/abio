export interface ProductColor {
  id: string
  stockQty: number
  price: number
  code: string
  name: string
  mainImage: string
  gallery: string[]
}

export interface Product {
  slug: string
  type: 'standard' | 'custom'
  metadata?: {
    tagline?: string
    badge?: string
    features?: string[]
    preview?: {
      enabled: boolean
      defaultColor: string
      frontOverlayUrl?: string
      backOverlayUrl?: string
    }
  }
  id: string
  name: string
  tagline?: string
  description?: string
  basePrice: number
  defaultImage: string
  defaultGallery?: string[]
  colors?: ProductColor[]
  features?: string[]
  badge?: string
}

/** A line in the cart — one product + color combination, with a quantity. */
export interface CartItem {
  productId: string
  colorName: string | null
  variantId?: string
  customUsername?: string
  preferredColor?: string
  instructions?: string
  artworkUrl?: string
  quantity: number
}
