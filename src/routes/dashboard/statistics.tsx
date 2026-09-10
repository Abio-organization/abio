import { createFileRoute } from '@tanstack/react-router'

import { AnalyticsPage } from '@/features/analytics'

export const Route = createFileRoute('/dashboard/statistics')({
  component: AnalyticsPage,
})
