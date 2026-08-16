import { createFileRoute } from '@tanstack/react-router'

import { PlatformsStep } from '@/features/onboarding'

export const Route = createFileRoute('/onboarding/platforms')({
  component: PlatformsStep,
})
