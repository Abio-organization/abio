export interface ProductColor {
  code: string
  name: string
  mainImage: string
  gallery: string[]
}

export interface Product {
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
  quantity: number
}
