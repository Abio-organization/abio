import { createFileRoute } from '@tanstack/react-router'

import { StorePage } from '@/features/store'

export const Route = createFileRoute('/store/')({
  component: StorePage,
})
