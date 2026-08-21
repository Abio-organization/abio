import { createFileRoute } from '@tanstack/react-router'

import { ComingSoonPage } from '@/features/dashboard/components/ComingSoonPage'

export const Route = createFileRoute('/dashboard/store')({
  component: () => <ComingSoonPage title="Store" description="Manage your products and orders here soon." />,
})
