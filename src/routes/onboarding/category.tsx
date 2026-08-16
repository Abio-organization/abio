import { createFileRoute } from '@tanstack/react-router'

import { CategoryStep } from '@/features/onboarding'

export const Route = createFileRoute('/onboarding/category')({
  component: CategoryStep,
})
