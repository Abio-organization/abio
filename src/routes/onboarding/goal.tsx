import { createFileRoute } from '@tanstack/react-router'

import { GoalStep } from '@/features/onboarding'

export const Route = createFileRoute('/onboarding/goal')({
  component: GoalStep,
})
