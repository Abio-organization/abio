import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'

import { GoogleCallbackPage } from '@/features/auth/components/GoogleCallbackPage'

interface GoogleCallbackSearch {
  accessToken?: string
}

/**
 * The backend hands the access token over in the URL fragment
 * (`#accessToken=...`) so it never reaches server logs or Referer headers.
 * The `?accessToken=` query form is still accepted so sign-in keeps working
 * while an older backend build is live.
 *
 * The token is read once on mount and then wiped from the address bar, so it doesn't
 * linger in browser history or get copied along with the URL.
 */
function readTokenFromUrl(fallback: string | undefined): string | undefined {
  if (typeof window === 'undefined') return fallback
  const hash = new URLSearchParams(window.location.hash.replace(/^#/, ''))
  return hash.get('accessToken') ?? fallback
}

export const Route = createFileRoute('/auth/google/callback')({
  validateSearch: (search: Record<string, unknown>): GoogleCallbackSearch => ({
    accessToken: typeof search.accessToken === 'string' ? search.accessToken : undefined,
  }),
  component: GoogleCallbackRoute,
})

function GoogleCallbackRoute() {
  const { accessToken: queryToken } = Route.useSearch()
  const [accessToken] = useState(() => readTokenFromUrl(queryToken))

  useEffect(() => {
    window.history.replaceState(window.history.state, '', window.location.pathname)
  }, [])

  return <GoogleCallbackPage accessToken={accessToken} />
}
