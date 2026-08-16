import { createFileRoute } from '@tanstack/react-router'

import { CompleteStep } from '@/features/onboarding'

export const Route = createFileRoute('/onboarding/complete')({
  component: CompleteStep,
})
