import { createFileRoute } from '@tanstack/react-router'
import { StorePage } from '@/features/store'
export const Route = createFileRoute('/dashboard/store')({
  component: () => <StorePage embedded />,
})
