import { createFileRoute } from '@tanstack/react-router'

import { PublicProfilePage } from '@/features/public-profile/PublicProfilePage'

export const Route = createFileRoute('/$username')({
  component: PublicProfileRoute,
})

function PublicProfileRoute() {
  const { username } = Route.useParams()
  return <PublicProfilePage username={username} />
}
