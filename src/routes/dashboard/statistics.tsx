import { createFileRoute } from '@tanstack/react-router'

import { ComingSoonPage } from '@/features/dashboard/components/ComingSoonPage'

export const Route = createFileRoute('/dashboard/statistics')({
  component: () => <ComingSoonPage title="Analytics" description="Link and profile analytics are coming soon." />,
})
