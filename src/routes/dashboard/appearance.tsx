import { createFileRoute } from '@tanstack/react-router'

import { AppearancePage } from '@/features/appearance/components/AppearancePage'

export const Route = createFileRoute('/dashboard/appearance')({
  component: AppearancePage,
})
