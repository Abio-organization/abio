import { createFileRoute } from '@tanstack/react-router'

import { GoogleCallbackPage } from '@/features/auth/components/GoogleCallbackPage'

interface GoogleCallbackSearch {
  accessToken?: string
}

export const Route = createFileRoute('/auth/google/callback')({
  validateSearch: (search: Record<string, unknown>): GoogleCallbackSearch => ({
    accessToken: typeof search.accessToken === 'string' ? search.accessToken : undefined,
  }),
  component: GoogleCallbackRoute,
})

function GoogleCallbackRoute() {
  const { accessToken } = Route.useSearch()
  return <GoogleCallbackPage accessToken={accessToken} />
}
