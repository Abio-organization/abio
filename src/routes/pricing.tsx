import { createFileRoute } from '@tanstack/react-router'

import { PricingPage } from '@/features/landing'

export const Route = createFileRoute('/pricing')({
  component: PricingPage,
})
