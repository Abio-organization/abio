import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/shared/lib/api-client'
import type { Product } from './types'
interface CatalogProduct {
  id: string
  slug: string
  name: string
  description: string | null
  type: 'standard' | 'custom'
  basePriceKobo: number
  imageUrls: string[]
  metadata?: Product['metadata']
  variants: {
    id: string
    colorName: string
    colorHex: string | null
    stockQty: number
    priceKobo: number | null
    imageUrls: string[]
  }[]
}
export function mapProduct(p: CatalogProduct): Product {
  const images = p.imageUrls.length
    ? p.imageUrls
    : p.variants.flatMap((v) => v.imageUrls).slice(0, 1)
  return {
    id: p.id,
    slug: p.slug,
    type: p.type,
    name: p.name,
    description: p.description ?? '',
    basePrice: p.basePriceKobo / 100,
    defaultImage: images[0] || '',
    defaultGallery: images,
    metadata: p.metadata,
    tagline: p.metadata?.tagline,
    badge: p.metadata?.badge,
    features: p.metadata?.features,
    colors:
      p.type === 'standard'
        ? p.variants.map((v) => ({
            id: v.id,
            name: v.colorName,
            code: v.colorHex || '#000000',
            stockQty: v.stockQty,
            price: (v.priceKobo ?? p.basePriceKobo) / 100,
            mainImage: v.imageUrls[0] || images[0] || '',
            gallery: v.imageUrls.length ? v.imageUrls : images,
          }))
        : undefined,
  }
}
export async function fetchCatalog(signal?: AbortSignal) {
  const products: Product[] = []
  let page = 1,
    totalPages: number
  do {
    const { data } = await apiClient.get<{
      data: { products: CatalogProduct[]; pagination: { totalPages: number } }
    }>('/astore/products', { params: { page, limit: 100 }, signal })
    products.push(...data.data.products.map(mapProduct))
    totalPages = data.data.pagination.totalPages
    page++
  } while (page <= totalPages)
  return products
}
export function useCatalog() {
  return useQuery({
    queryKey: ['store', 'catalog'],
    queryFn: ({ signal }) => fetchCatalog(signal),
    staleTime: 0,
  })
}
