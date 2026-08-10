import type { Product } from './types'

export const products: Product[] = [
  {
    id: 'ap-card-5',
    name: 'AP Card 5',
    tagline: 'The original Abio NFC card.',
    basePrice: 35000,
    defaultImage: '/icons/Apcard5.png',
    defaultGallery: ['/icons/Apcard5.png'],
    badge: 'Bestseller',
    colors: [
      {
        code: '#000000',
        name: 'Onyx Black',
        mainImage: '/images/Blackcard3.png',
        gallery: ['/images/Blackcard3.png', '/images/Apcard 5 white back.png', '/images/Blackcard1 (1).png', '/images/Blackcard2.png'],
      },
      {
        code: '#FFFFFF',
        name: 'Pearl White',
        mainImage: '/images/Apcard 5 white 1.png',
        gallery: ['/images/Apcard 5 white 1.png', '/images/Apcard 5 white back.png', '/images/A5 w 1.png', '/images/WHite card.png'],
      },
      {
        code: '#F28B82',
        name: 'Coral Blush',
        mainImage: '/images/pink card 3.png',
        gallery: ['/images/pink card 3.png', '/images/Apcard 5 white back.png', '/images/pink card 2.png', '/images/Pink card.png'],
      },
    ],
    features: ['iOS & Android Compatible', 'Secure NFC Technology', 'Durable Stainless Steel'],
  },
  {
    id: 'ap-card-5-plus',
    name: 'AP Card 5+ Custom',
    tagline: 'Your logo, your colors.',
    basePrice: 50000,
    defaultImage: '/icons/Apcard 5 2.png',
    defaultGallery: ['/icons/Apcard 5 2.png'],
    features: ['iOS & Android Compatible', 'Secure & Trusted', 'In stock, ready to deliver'],
  },
]

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id)
}
