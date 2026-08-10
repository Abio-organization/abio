import { createFileRoute } from '@tanstack/react-router'

import { CartPage } from '@/features/store'

export const Route = createFileRoute('/store/cart')({
  component: CartPage,
})
