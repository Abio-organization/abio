import { createFileRoute } from '@tanstack/react-router'

import { LinksStep } from '@/features/onboarding'

export const Route = createFileRoute('/onboarding/links')({
  component: LinksStep,
})
