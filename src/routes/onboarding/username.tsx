import { createFileRoute } from '@tanstack/react-router'

import { UsernameStep } from '@/features/onboarding'

export const Route = createFileRoute('/onboarding/username')({
  component: UsernameStep,
})
