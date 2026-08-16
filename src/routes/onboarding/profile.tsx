import { createFileRoute } from '@tanstack/react-router'

import { ProfileStep } from '@/features/onboarding'

export const Route = createFileRoute('/onboarding/profile')({
  component: ProfileStep,
})
