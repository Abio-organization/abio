import { createFileRoute } from '@tanstack/react-router'

import { ProfilePage } from '@/features/profile'

export const Route = createFileRoute('/dashboard/')({
  component: ProfilePage,
})
